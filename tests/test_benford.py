import math

import pytest

from tools.benford_simulation import (
    analyze_benford,
    benford_expected_probability,
    first_significant_digit,
    generate_benford_like_data,
    generate_synthetic_data,
)


def test_expected_probabilities_sum_to_one():
    total = sum(benford_expected_probability(d) for d in range(1, 10))
    assert math.isclose(total, 1.0, rel_tol=1e-9)


def test_digit_1_is_about_30_percent():
    assert math.isclose(benford_expected_probability(1), 0.30103, abs_tol=1e-4)


@pytest.mark.parametrize(
    "value,digit", [(1.0, 1), (9.99, 9), (0.0042, 4), (123456.0, 1), (0.5, 5)]
)
def test_first_significant_digit(value, digit):
    assert first_significant_digit(value) == digit


@pytest.mark.parametrize("bad", [0, -1, float("nan"), float("inf")])
def test_first_digit_rejects_invalid(bad):
    with pytest.raises(ValueError):
        first_significant_digit(bad)


def test_invalid_digit_rejected():
    with pytest.raises(ValueError):
        benford_expected_probability(0)


def test_natural_data_not_flagged():
    result = analyze_benford(generate_benford_like_data(5000))
    assert result["requires_investigation"] is False


def test_synthetic_data_flagged():
    result = analyze_benford(generate_synthetic_data(5000))
    assert result["requires_investigation"] is True


def test_small_sample_rejected():
    with pytest.raises(ValueError):
        analyze_benford([1.0] * 50)
