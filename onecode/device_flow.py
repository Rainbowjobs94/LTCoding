"""OAuth 2.0 Device Authorization Grant (RFC 8628) core logic.

Framework-agnostic and in-memory: swap the dicts for a database or Redis before
production, and keep signing keys in a managed key service. Secrets are stored hashed.
"""

from __future__ import annotations

import hashlib
import secrets
import time
from collections.abc import Callable, Iterable
from dataclasses import dataclass

USER_CODE_ALPHABET = "BCDFGHJKLMNPQRSTVWXZ"
GRANT_TYPE = "urn:ietf:params:oauth:grant-type:device_code"


class DeviceFlowError(Exception):
    def __init__(self, code: str, description: str = "") -> None:
        super().__init__(code)
        self.code = code
        self.description = description


def _digest(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()


def normalize_user_code(code: str) -> str:
    return "".join(ch for ch in code.upper() if ch not in "- ")


@dataclass
class _Session:
    client_id: str
    scope: str
    expires_at: float
    interval: int
    user_code_hash: str
    last_poll: float | None = None
    status: str = "pending"
    subject: str | None = None


@dataclass(frozen=True)
class _Token:
    subject: str
    scope: str
    expires_at: float


class DeviceFlowService:
    def __init__(
        self,
        *,
        verification_uri: str,
        registered_clients: Iterable[str],
        allowed_scopes: Iterable[str],
        clock: Callable[[], float] = time.monotonic,
        code_ttl: int = 900,
        interval: int = 5,
        token_ttl: int = 900,
        max_pending: int = 10_000,
        max_verify_failures: int = 5,
        verify_window: int = 300,
    ) -> None:
        self._uri = verification_uri
        self._clients = frozenset(registered_clients)
        self._scopes = frozenset(allowed_scopes)
        self._clock = clock
        self._code_ttl = code_ttl
        self._interval = interval
        self._token_ttl = token_ttl
        self._max_pending = max_pending
        self._max_failures = max_verify_failures
        self._window = verify_window
        self._sessions: dict[str, _Session] = {}
        self._user_codes: dict[str, str] = {}
        self._tokens: dict[str, _Token] = {}
        self._failures: dict[str, list[float]] = {}

    def _purge(self) -> None:
        now = self._clock()
        for key in [k for k, s in self._sessions.items() if s.expires_at <= now]:
            self._drop(key)
        for tkey in [k for k, t in self._tokens.items() if t.expires_at <= now]:
            del self._tokens[tkey]

    def _drop(self, device_hash: str) -> None:
        session = self._sessions.pop(device_hash, None)
        if session is not None:
            self._user_codes.pop(session.user_code_hash, None)

    def start(self, client_id: str, scope: str) -> dict[str, str | int]:
        self._purge()
        if client_id not in self._clients:
            raise DeviceFlowError("invalid_client")
        requested = set(scope.split())
        if not requested or not requested <= self._scopes:
            raise DeviceFlowError("invalid_scope")
        if len(self._sessions) >= self._max_pending:
            raise DeviceFlowError("temporarily_unavailable")
        device_code = secrets.token_urlsafe(32)
        while True:
            raw = "".join(secrets.choice(USER_CODE_ALPHABET) for _ in range(8))
            user_hash = _digest(raw)
            if user_hash not in self._user_codes:
                break
        device_hash = _digest(device_code)
        self._user_codes[user_hash] = device_hash
        self._sessions[device_hash] = _Session(
            client_id=client_id,
            scope=" ".join(sorted(requested)),
            expires_at=self._clock() + self._code_ttl,
            interval=self._interval,
            user_code_hash=user_hash,
        )
        display = f"{raw[:4]}-{raw[4:]}"
        return {
            "device_code": device_code,
            "user_code": display,
            "verification_uri": self._uri,
            "verification_uri_complete": f"{self._uri}?user_code={display}",
            "expires_in": self._code_ttl,
            "interval": self._interval,
        }

    def _check_rate(self, caller_id: str) -> list[float]:
        now = self._clock()
        recent = [t for t in self._failures.get(caller_id, []) if now - t < self._window]
        self._failures[caller_id] = recent
        if len(recent) >= self._max_failures:
            raise DeviceFlowError("rate_limited", "Too many invalid user codes")
        return recent

    def approve(
        self, user_code: str, subject: str, *, caller_id: str, approved: bool = True
    ) -> None:
        if not subject:
            raise DeviceFlowError("invalid_request", "subject is required")
        self._purge()
        recent = self._check_rate(caller_id)
        device_hash = self._user_codes.get(_digest(normalize_user_code(user_code)))
        session = self._sessions.get(device_hash) if device_hash else None
        if session is None:
            recent.append(self._clock())
            raise DeviceFlowError("invalid_grant", "Unknown or expired user code")
        if session.status != "pending":
            raise DeviceFlowError("invalid_grant", "User code already used")
        session.status = "approved" if approved else "denied"
        session.subject = subject

    def poll(self, device_code: str, client_id: str) -> dict[str, str | int]:
        self._purge()
        device_hash = _digest(device_code)
        session = self._sessions.get(device_hash)
        if session is None:
            raise DeviceFlowError("expired_token" if device_code else "invalid_grant")
        if session.client_id != client_id:
            raise DeviceFlowError("invalid_grant")
        now = self._clock()
        too_fast = session.last_poll is not None and now - session.last_poll < session.interval
        session.last_poll = now
        if too_fast:
            session.interval += 5
            raise DeviceFlowError("slow_down")
        if session.status == "pending":
            raise DeviceFlowError("authorization_pending")
        self._drop(device_hash)
        if session.status == "denied" or session.subject is None:
            raise DeviceFlowError("access_denied")
        token = secrets.token_urlsafe(32)
        self._tokens[_digest(token)] = _Token(
            session.subject, session.scope, now + self._token_ttl
        )
        return {
            "access_token": token,
            "token_type": "Bearer",
            "expires_in": self._token_ttl,
            "scope": session.scope,
        }

    def introspect(self, access_token: str) -> dict[str, str]:
        self._purge()
        token = self._tokens.get(_digest(access_token))
        if token is None:
            raise DeviceFlowError("invalid_token")
        return {"subject": token.subject, "scope": token.scope}
