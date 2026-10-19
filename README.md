# LTCoding

Copy Rights Trademark Patent pending LTR Protocols. Research and Function Blockchain, Intelligence Aware Technology, and More

## Contents

| Path | Purpose | Status |
|------|---------|--------|
| `tools/benford_simulation.py` | Benford's Law first-digit screening with continuity-corrected Z-statistics | Tested |
| `onecode/reconcile.py` | Revenue reconciliation: expected revenue from verified activity, variance bands (passed / monitor / quarantine / financial_halt) | Tested; thresholds are configurable policy defaults |
| `onecode/device_flow.py` | OAuth 2.0 Device Authorization Grant (RFC 8628) core: hashed secrets, polling limits, user-code brute-force limit | Tested; in-memory only |
| `docs/openapi/onecode_openapi_0_6_0.json` | OpenAPI 3.1 contract with bearer auth and error responses | Draft; no server implemented yet |
| `docs/dashboard/onecode-v0-6-0-dashboard.html` | Browser dashboard using hard-coded sample data | Illustration only |

## Not production-ready

- The device flow keeps sessions and tokens in memory. Use a database or Redis, TLS, and a managed key service before real use.
- A Benford flag is a reason to investigate. It is not proof of fraud, and the test is unreliable on data with fixed prices.
- No independent security review or audit has been done.

## Run the checks

```bash
pip install -e ".[dev]"
mypy
python -m pytest
```
