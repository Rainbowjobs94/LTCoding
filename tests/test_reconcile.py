from decimal import Decimal

import pytest

from onecode.reconcile import ReconciliationStatus as S
from onecode.reconcile import Thresholds, reconcile

BASE = {"reported_session_rpm": 10, "verified_sessions_per_dau": 3, "dau": 396000}


def run(reported):
    return reconcile("b1", reported_revenue=reported, **BASE)


def test_expected_revenue_matches_formula():
    r = run(11880)
    assert r.expected_arpdau == Decimal("0.03")
    assert r.expected_revenue == Decimal("11880")
    assert r.status is S.PASSED and r.variance_ratio == 0


def test_within_two_percent_passes():
    assert run(12100).status is S.PASSED


def test_monitor_band():
    assert run(12200).status is S.MONITOR


def test_dashboard_example_is_quarantine():
    r = run(12560)
    assert r.status is S.QUARANTINE
    assert round(r.variance_ratio, 4) == Decimal("0.0572")


def test_exactly_five_percent_is_not_quarantine():
    assert run(12474).status is S.MONITOR


def test_under_reporting_is_also_flagged():
    assert run(11000).status is S.QUARANTINE


def test_large_variance_halts():
    assert run(20000).status is S.FINANCIAL_HALT


def test_zero_expected_cases():
    ok = reconcile("b", 10, 3, 0, 0)
    bad = reconcile("b", 10, 3, 0, 5)
    assert ok.status is S.PASSED and ok.variance_ratio == 0
    assert bad.status is S.FINANCIAL_HALT and bad.variance_ratio is None


def test_custom_thresholds():
    t = Thresholds(Decimal("0.01"), Decimal("0.20"), Decimal("0.30"))
    assert reconcile("b", 10, 3, 396000, 12560, t).status is S.MONITOR


def test_to_dict():
    d = run(12560).to_dict()
    assert d["status"] == "quarantine" and d["variance_ratio"] == "0.0572"
    assert reconcile("b", 10, 3, 0, 5).to_dict()["variance_ratio"] is None


@pytest.mark.parametrize(
    "kwargs",
    [
        {"batch_id": ""},
        {"reported_session_rpm": -1},
        {"reported_session_rpm": float("nan")},
        {"reported_session_rpm": "abc"},
        {"reported_session_rpm": True},
        {"reported_session_rpm": [1]},
        {"verified_sessions_per_dau": float("inf")},
        {"dau": 1.5},
        {"dau": -1},
        {"dau": True},
        {"reported_revenue": -5},
    ],
)
def test_invalid_inputs(kwargs):
    args = {"batch_id": "b", "reported_session_rpm": 10, "verified_sessions_per_dau": 3,
            "dau": 10, "reported_revenue": 1}
    args.update(kwargs)
    with pytest.raises(ValueError):
        reconcile(**args)


def test_invalid_thresholds():
    with pytest.raises(ValueError):
        Thresholds(Decimal("0.2"), Decimal("0.1"), Decimal("0.3"))
