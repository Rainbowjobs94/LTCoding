# LTCoding

Copy Rights Trademark Patent pending LTR Protocols. Research and Function Blockchain, Intelligence Aware Technology, and More

## Contents

| Path | Purpose | Status |
|------|---------|--------|
| `tools/benford_simulation.py` | Benford's Law first-digit screening with continuity-corrected Z-statistics | Tested (pytest, 100% coverage) |
| `docs/openapi/onecode_openapi_0_6_0.json` | OpenAPI 3.1 contract for the OneCode backend | Draft spec; no server implemented yet |
| `docs/dashboard/onecode-v0-6-0-dashboard.html` | Browser dashboard using hard-coded sample data | Illustration only |

A Benford flag is a reason to investigate a batch of amounts. It is not proof of fraud, and the test is unreliable on data with fixed prices.

## Run the tests

```bash
pip install -e ".[dev]"
python -m pytest
```
