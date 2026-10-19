import pytest

from onecode.device_flow import USER_CODE_ALPHABET, DeviceFlowError, DeviceFlowService


class Clock:
    def __init__(self):
        self.t = 0.0

    def __call__(self):
        return self.t


@pytest.fixture
def env():
    clock = Clock()
    svc = DeviceFlowService(
        verification_uri="https://example.test/activate",
        registered_clients={"cli"},
        allowed_scopes={"ledger:read", "ledger:write"},
        clock=clock,
        max_pending=3,
    )
    return svc, clock


def code_of(exc):
    return exc.value.code


def test_happy_path(env):
    svc, clock = env
    s = svc.start("cli", "ledger:read")
    assert s["interval"] == 5 and s["expires_in"] == 900
    assert s["verification_uri_complete"].endswith(s["user_code"])
    with pytest.raises(DeviceFlowError) as e:
        svc.poll(s["device_code"], "cli")
    assert code_of(e) == "authorization_pending"
    clock.t = 10
    svc.approve(s["user_code"].lower().replace("-", ""), "alice", caller_id="ip1")
    tok = svc.poll(s["device_code"], "cli")
    assert tok["token_type"] == "Bearer" and tok["scope"] == "ledger:read"
    assert svc.introspect(tok["access_token"]) == {"subject": "alice", "scope": "ledger:read"}


def test_device_code_is_single_use(env):
    svc, clock = env
    s = svc.start("cli", "ledger:read")
    svc.approve(s["user_code"], "alice", caller_id="ip")
    svc.poll(s["device_code"], "cli")
    clock.t = 10
    with pytest.raises(DeviceFlowError) as e:
        svc.poll(s["device_code"], "cli")
    assert code_of(e) == "expired_token"


def test_slow_down_increases_interval(env):
    svc, clock = env
    s = svc.start("cli", "ledger:read")
    with pytest.raises(DeviceFlowError):
        svc.poll(s["device_code"], "cli")
    clock.t = 1
    with pytest.raises(DeviceFlowError) as e:
        svc.poll(s["device_code"], "cli")
    assert code_of(e) == "slow_down"
    clock.t = 7
    with pytest.raises(DeviceFlowError) as e:
        svc.poll(s["device_code"], "cli")
    assert code_of(e) == "slow_down"
    clock.t = 30
    with pytest.raises(DeviceFlowError) as e:
        svc.poll(s["device_code"], "cli")
    assert code_of(e) == "authorization_pending"


def test_denied(env):
    svc, _ = env
    s = svc.start("cli", "ledger:read")
    svc.approve(s["user_code"], "alice", caller_id="ip", approved=False)
    with pytest.raises(DeviceFlowError) as e:
        svc.poll(s["device_code"], "cli")
    assert code_of(e) == "access_denied"


def test_expiry(env):
    svc, clock = env
    s = svc.start("cli", "ledger:read")
    clock.t = 901
    with pytest.raises(DeviceFlowError) as e:
        svc.poll(s["device_code"], "cli")
    assert code_of(e) == "expired_token"
    with pytest.raises(DeviceFlowError) as e:
        svc.approve(s["user_code"], "alice", caller_id="ip")
    assert code_of(e) == "invalid_grant"


def test_token_expiry(env):
    svc, clock = env
    s = svc.start("cli", "ledger:read")
    svc.approve(s["user_code"], "alice", caller_id="ip")
    tok = svc.poll(s["device_code"], "cli")
    clock.t = 901
    with pytest.raises(DeviceFlowError) as e:
        svc.introspect(tok["access_token"])
    assert code_of(e) == "invalid_token"


def test_start_validation(env):
    svc, _ = env
    for client, scope, err in [("bad", "ledger:read", "invalid_client"),
                               ("cli", "admin", "invalid_scope"), ("cli", "", "invalid_scope")]:
        with pytest.raises(DeviceFlowError) as e:
            svc.start(client, scope)
        assert code_of(e) == err


def test_wrong_client_and_unknown_code(env):
    svc, _ = env
    s = svc.start("cli", "ledger:read")
    with pytest.raises(DeviceFlowError) as e:
        svc.poll(s["device_code"], "other")
    assert code_of(e) == "invalid_grant"
    with pytest.raises(DeviceFlowError) as e:
        svc.poll("", "cli")
    assert code_of(e) == "invalid_grant"


def test_user_code_brute_force_limited(env):
    svc, _ = env
    svc.start("cli", "ledger:read")
    for _ in range(5):
        with pytest.raises(DeviceFlowError) as e:
            svc.approve("AAAA-AAAA", "mallory", caller_id="evil")
        assert code_of(e) == "invalid_grant"
    with pytest.raises(DeviceFlowError) as e:
        svc.approve("AAAA-AAAA", "mallory", caller_id="evil")
    assert code_of(e) == "rate_limited"


def test_cannot_reuse_approved_user_code_and_needs_subject(env):
    svc, _ = env
    s = svc.start("cli", "ledger:read")
    with pytest.raises(DeviceFlowError) as e:
        svc.approve(s["user_code"], "", caller_id="ip")
    assert code_of(e) == "invalid_request"
    svc.approve(s["user_code"], "alice", caller_id="ip")
    with pytest.raises(DeviceFlowError) as e:
        svc.approve(s["user_code"], "bob", caller_id="ip")
    assert code_of(e) == "invalid_grant"


def test_pending_cap_and_secrets_hashed(env):
    svc, _ = env
    sessions = [svc.start("cli", "ledger:read") for _ in range(3)]
    with pytest.raises(DeviceFlowError) as e:
        svc.start("cli", "ledger:read")
    assert code_of(e) == "temporarily_unavailable"
    assert sessions[0]["device_code"] not in svc._sessions
    assert all(c in USER_CODE_ALPHABET for c in sessions[0]["user_code"].replace("-", ""))
