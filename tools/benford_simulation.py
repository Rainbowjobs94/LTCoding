from __future__ import annotations

import math
import random
from collections import Counter
from collections.abc import Iterable
from dataclasses import dataclass
from typing import Any

CRITICAL_Z = 1.96


@dataclass(frozen=True)
class DigitResult:
    digit: int
    observed_count: int
    observed_proportion: float
    expected_proportion: float
    z_statistic: float
    flagged: bool


def first_significant_digit(value: float) -> int:
    if not math.isfinite(value) or value <= 0:
        raise ValueError("Value must be positive and finite.")
    normalized = abs(value)
    while normalized >= 10:
        normalized /= 10
    while normalized < 1:
        normalized *= 10
    return int(normalized)


def benford_expected_probability(digit: int) -> float:
    if digit < 1 or digit > 9:
        raise ValueError("Leading digit must be 1..9")
    return math.log10(1 + 1 / digit)


def benford_z_statistic(
    observed_proportion: float, expected_proportion: float, sample_size: int
) -> float:
    standard_error = math.sqrt(expected_proportion * (1 - expected_proportion) / sample_size)
    numerator = max(0.0, abs(observed_proportion - expected_proportion) - 1 / (2 * sample_size))
    return numerator / standard_error if standard_error else 0.0


def analyze_benford(amounts: Iterable[float]) -> dict[str, Any]:
    """Screening test only: a flag is an investigation trigger, not proof of fraud."""
    values = [float(v) for v in amounts if math.isfinite(float(v)) and float(v) > 0]
    if len(values) < 100:
        raise ValueError("Need at least 100 positive values")
    digits = [first_significant_digit(v) for v in values]
    counts = Counter(digits)
    n = len(values)
    rows = []
    for d in range(1, 10):
        obs = counts[d] / n
        exp = benford_expected_probability(d)
        z = benford_z_statistic(obs, exp, n)
        rows.append(DigitResult(d, counts[d], obs, exp, z, z > CRITICAL_Z))
    max_z = max(r.z_statistic for r in rows)
    return {
        "sample_size": n,
        "max_z_statistic": max_z,
        "critical_z": CRITICAL_Z,
        "requires_investigation": max_z > CRITICAL_Z,
        "digit_results": rows,
    }


def generate_benford_like_data(size: int, seed: int = 42) -> list[float]:
    rng = random.Random(seed)
    return [10 ** rng.uniform(-2, 6) for _ in range(size)]


def generate_synthetic_data(size: int, seed: int = 99) -> list[float]:
    rng = random.Random(seed)
    return [rng.uniform(90.0, 99.99) for _ in range(size)]


if __name__ == "__main__":  # pragma: no cover
    legit = analyze_benford(generate_benford_like_data(5000))
    synth = analyze_benford(generate_synthetic_data(5000))
    print(f"natural: max_z={legit['max_z_statistic']:.2f} flag={legit['requires_investigation']}")
    print(f"synthetic: max_z={synth['max_z_statistic']:.2f} flag={synth['requires_investigation']}")
