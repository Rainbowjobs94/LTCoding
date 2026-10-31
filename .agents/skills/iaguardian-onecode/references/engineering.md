# Engineering and Orchestration

## Durable Work

Use persistent task records for durable work. Recommended fields include owner,
kind, title, priority, dependencies, state, parameters, acceptance criteria,
idempotency key, approval scope, cost class, attempts, lease, checkpoint,
outputs, verification evidence, and error code.

Recommended lifecycle:

`proposed → ready → running → verifying → succeeded`

Additional states:

`awaiting_approval`, `blocked_budget`, `blocked_capability`, `blocked_input`,
`retry_wait`, `failed`, `cancelled`.

Workers must claim transactionally, renew leases, recover expired work, support
cancellation, enforce deadlines, bound retries, redact logs, and prevent duplicate
external side effects.

## Application Boundaries

- Authenticate every owner-scoped operation server-side.
- Enforce ownership, foreign keys, uniqueness, and transaction boundaries.
- Keep secrets out of ordinary task, preference, and content tables.
- Validate OAuth state, use PKCE and OIDC nonce where applicable, minimize scopes,
  restrict redirects, and protect tokens from browsers and logs.
- Use integer minor units or explicitly bounded decimal arithmetic for money.
- Validate webhook signatures and reconcile provider events idempotently.
- Quarantine discrepancies rather than rewriting historical ledger entries.
- Treat app entitlements as application policy, never as provider or Replit quota.

## Handler Admission

Allowlist handlers such as source inventory, repository cataloging, checks,
documentation generation, internal-link verification, bounded media probing,
OCR, transcription, rendering, and release packaging.

Each handler declares permission, network, runtime, storage, input, output, and
cost requirements. Unsupported handlers return a blocked status; they never
succeed by writing a placeholder.

## Security Gate

Threat-model prompt injection, archive attacks, supply-chain compromise,
cross-user access, OAuth leakage, shell injection, SSRF, SQL injection, XSS,
CSRF, stale leases, retry storms, billing surprises, Unicode spoofing, and
untrusted media or font parsers.

Apply least privilege, schemas, size limits, subprocess timeouts, outbound request
validation, secret redaction, lockfiles, audit history, backup/restore, and rollback.
