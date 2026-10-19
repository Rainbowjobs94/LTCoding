"""KPI reconciliation: compare reported revenue with revenue implied by verified activity."""

from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal, InvalidOperation
from enum import Enum

Numeric = int | float | str | Decimal


class ReconciliationStatus(str, Enum):
    PASSED = "passed"
    MONITOR = "monitor"
    QUARANTINE = "quarantine"
    FINANCIAL_HALT = "financial_halt"


@dataclass(frozen=True)
class Thresholds:
    """Variance limits as fractions of expected revenue. Defaults are policy choices, not standards."""

    monitor: Decimal = Decimal("0.02")
    quarantine: Decimal = Decimal("0.05")
    halt: Decimal = Decimal("0.15")

    def __post_init__(self) -> None:
        if not (Decimal(0) <= self.monitor <= self.quarantine <= self.halt):
            raise ValueError("Thresholds must satisfy 0 <= monitor <= quarantine <= halt")


@dataclass(frozen=True)
class ReconciliationResult:
    batch_id: str
    expected_arpdau: Decimal
    expected_revenue: Decimal
    reported_revenue: Decimal
    variance_ratio: Decimal | None
    status: ReconciliationStatus

    def to_dict(self) -> dict[str, str | None]:
        return {
            "batch_id": self.batch_id,
            "expected_arpdau": f"{self.expected_arpdau:.6f}",
            "expected_revenue": f"{self.expected_revenue:.2f}",
            "variance_ratio": None if self.variance_ratio is None else f"{self.variance_ratio:.4f}",
            "status": self.status.value,
        }


def _to_decimal(name: str, value: object) -> Decimal:
    if isinstance(value, bool) or not isinstance(value, (int, float, str, Decimal)):
        raise ValueError(f"{name} must be numeric")
    try:
        number = Decimal(str(value))
    except InvalidOperation as exc:
        raise ValueError(f"{name} must be numeric") from exc
    if not number.is_finite() or number < 0:
        raise ValueError(f"{name} must be a finite, non-negative number")
    return number


def reconcile(
    batch_id: str,
    reported_session_rpm: Numeric,
    verified_sessions_per_dau: Numeric,
    dau: int,
    reported_revenue: Numeric,
    thresholds: Thresholds | None = None,
) -> ReconciliationResult:
    """Expected revenue = (RPM / 1000) * sessions per DAU * DAU; status from relative variance."""
    if not isinstance(batch_id, str) or not batch_id.strip():
        raise ValueError("batch_id must be a non-empty string")
    if isinstance(dau, bool) or not isinstance(dau, int) or dau < 0:
        raise ValueError("dau must be a non-negative integer")
    limits = thresholds or Thresholds()
    rpm = _to_decimal("reported_session_rpm", reported_session_rpm)
    sessions = _to_decimal("verified_sessions_per_dau", verified_sessions_per_dau)
    reported = _to_decimal("reported_revenue", reported_revenue)

    arpdau = rpm / Decimal(1000) * sessions
    expected = arpdau * Decimal(dau)

    ratio: Decimal | None
    if expected == 0:
        ratio = Decimal(0) if reported == 0 else None
    else:
        ratio = abs(reported - expected) / expected

    if ratio is None or ratio > limits.halt:
        status = ReconciliationStatus.FINANCIAL_HALT
    elif ratio > limits.quarantine:
        status = ReconciliationStatus.QUARANTINE
    elif ratio > limits.monitor:
        status = ReconciliationStatus.MONITOR
    else:
        status = ReconciliationStatus.PASSED
    return ReconciliationResult(batch_id, arpdau, expected, reported, ratio, status)
