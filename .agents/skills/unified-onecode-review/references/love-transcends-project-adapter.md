# Love Transcends project adapter (non-secret reference)

This reference maps public repository surfaces only. It contains no private
identities, packet data, credentials, secret values, or LT-wide permissions.
It is an adapter for review preparation, not an authority.

## Authority and surfaces

- **Account/session authority:** the workspace Express/PostgreSQL account
  backend is authoritative for web and mobile. OneCode is not an identity
  provider. A request must have the server's authenticated user/session and
  pass the server-side admin guard; client claims are insufficient.
- **Actual Rainbow authority predicate:** the OneCode route transaction locks
  the singleton `rainbowJobsControlPolicyTable` row and an active
  `agentIdentitiesTable` row owned by the authenticated user. The identity
  query also requires normalized `agentName` to equal `rainbowjobs`
  (`regexp_replace(lower(agentName), '[^a-z0-9]', '', 'g')`) and
  `approvedCapabilities <> '[]'::jsonb`. It permits work only when the
  user's ID equals `designatedOwnerUserId`, the identity status is `active`,
  `emergencyPaused` is false, `shiftOnline` is true, and
  `shiftExpiresAt` exists and is later than the current time. Missing rows,
  mismatch, pause, offline state, expiry, or failed admin/auth checks are
  `403`/`BLOCKED`. Revocation is therefore achieved by removing/deactivating
  the identity, changing the designated owner, pausing/offlining the shift,
  or letting the shift expire; each subsequent request rechecks the locked
  state. This adapter does not name an owner.
- **API contract source:** `lib/api-spec/openapi.yaml` is authoritative;
  generated clients are outputs and are not edited by this workflow. The
  OneCode route family is:
  `GET /onecode/packets`, `GET /onecode/queue`,
  `POST /onecode/packets`, `GET /onecode/packets/:packetId`,
  `POST /onecode/packets/:packetId/revisions`,
  `POST /onecode/packets/:packetId/decision`, and
  `PUT /onecode/packets/:packetId/reminder`. All are authenticated/admin
  surfaces and are additionally subject to the authority predicate above.
- **Schema/migration ownership:** logical tables are defined in
  `lib/db/src/schema/oneCode.ts` and exported by the DB package. Application
  migrations under `lib/db/migrations/` and the repository's application
  migration ledger own rollout/rehearsal; this adapter never edits schema or
  pushes migrations. Contract changes require the API contract owner and
  generated-client process.
- **Web and mobile consumers:** `artifacts/lt-social/` and
  `artifacts/lt-social-mobile/` consume the API. Web sessions use the server
  auth middleware and httpOnly access/refresh cookies; native clients use the
  server native-session exchange. `SESSION_SECRET` is server-owned. Requests
  must remain authenticated and use the project's CSRF/request-security
  protections where browser state-changing requests require them; do not
  weaken or bypass those checks. Neither client path grants authority,
  credentials, or private-storage access.
- **Public IAMiracle boundary:** `artifacts/api-server/src/routes/iamiracle.ts`
  and `artifacts/api-server/src/lib/iamiracle.ts` provide anonymous,
  public-information explanation. IAMiracle may explain OneCode and point an
  authenticated user to `/rainbow-jobs/`; it must not inspect packets/private
  evidence, invoke skills, make decisions, or mutate downstream state.
- **Branding:** use current project-local terminology in `replit.md` and the
  IAMiracle public profile. Branding is not permission or identity proof.

## Evidence, retention, and deletion

OneCode stores owner-scoped packet metadata and immutable version/decision
records: titles/status/version, action types, assumptions, evidence references
or commitments supplied by the packet, risks, unresolved steps, expected
results, skill outcomes, reminder state, idempotency records, and actor/owner
references (`artifacts/api-server/src/routes/oneCode.ts:47-86`). It has no
object-upload or raw-byte operation. The enforced metadata-only boundary is
`validateReviewMetadata` (`artifacts/api-server/src/routes/oneCode.ts:34-45,
99-100,128-129`): at most six supported lens keys
(`improve,optimize,confirm,elaborate,update,compare`), bounded plain-text
values, and bounded arrays of labels/opaque references. The shared
`SECRET_SHAPE` rejection covers identifiers, secret-shaped values, private
paths, data/base64 payloads, signed URLs, and contact-like values; non-string
arrays, nested objects, oversized values, and unsupported keys are rejected.
`artifacts/api-server/test/onecode-review.test.ts` is the focused privacy and
authority regression suite, while `lib/api-spec/openapi.yaml` and generated
contracts carry the public shape. OneCode therefore stores references/labels,
never private evidence bytes; raw evidence remains in the private-evidence
subsystems below.

The existing private-evidence owners are concrete:

- Vocational evidence uses
  `artifacts/api-server/src/lib/vocationalEvidence.ts` and
  `artifacts/api-server/src/routes/rainbowJobs.ts:160-186,198-250`. It stores
  object-path/hash/scan metadata, sets 30-day `retentionExpiresAt`, and
  removes source objects during finalization.
- `DELETE /rainbow-jobs/profile` at
  `artifacts/api-server/src/routes/rainbowJobs.ts:253-267` deletes owner
  uploads/profile rows, expires pending verifications, audits deletion, and
  calls `deleteVocationalEvidenceBestEffort` for retained verification objects.
- Admin listing invokes `cleanupVocationalEvidence`, while the evidence
  route rejects expired/deleted objects
  (`artifacts/api-server/src/routes/rainbowJobs.ts:269-280`); cleanup is
  implemented in `artifacts/api-server/src/lib/vocationalEvidence.ts`.
- General private files are owned by
  `artifacts/api-server/src/lib/privateFileService.ts` and
  `artifacts/api-server/src/routes/privateFiles.ts:30-79`. Owner deletion is
  retryable (`deletion_pending`), scan retention is handled by
  `cleanupPrivateFiles`, and audit rows are recorded.

Those subsystems own access control, expiry/retention,
deletion/tombstoning, storage-provider cleanup, and redacted audit of raw
bytes. OneCode owns only its packet metadata lifecycle and must never imply
that deleting a packet deletes upstream evidence. A request for raw OneCode
evidence upload is `BLOCKED`: no such OneCode capability exists.

## Secrets and redaction

Secret-name ownership is project-local: the API runtime owns the
`SESSION_SECRET` name for authentication/session signing; deployment/provider
owners control any other configured secret names. This document intentionally
contains no values, identities, tokens, keys, or provider credentials. Never
print, commit, hash for display, prompt, export, or attach secret values.
Redact cookies, authorization headers, refresh/access tokens, upload URLs,
private evidence, email/contact fields, wallet/payment fields, and raw request
bodies from logs and reports. Report only a missing secret's name and the
owning boundary. IAMiracle has no secret or private-evidence access.

## Audit, storage, release, and rollback

The API/DB owner owns transactional packet, version, decision, reminder, and
idempotency storage. The Rainbow/OneCode routes use owner scoping, locked
authority checks, expected-version checks, and idempotency-key replay/conflict
records; audit output must be redacted and must not become evidence storage.
The private-evidence owner owns raw storage audit and deletion proof.

The owning release operator approves publication and runs
`docs/RELEASE.md`/`pnpm run validate:release`. The adapter prepares evidence
only; it does not deploy, publish, mutate accounts, or approve a decision.
Preserve the last verified revision, contract version, migration checkpoint,
and test output as rollback evidence. On failure, restore the prior verified
revision through the project release process and reconcile packet/idempotency
state; do not edit generated clients or API/schema contracts as an improvised
rollback.

## Validation gates

Run only the checks appropriate to the change and record exact results:

1. `pnpm --filter @workspace/api-server exec tsx --test test/iamiracle.test.ts`
   verifies the public boundary and non-exposure assertions.
2. `pnpm --filter @workspace/api-server run typecheck` verifies the API
   implementation types.
3. `pnpm run typecheck` is the workspace compatibility check when the owning
   agent authorizes the broader run.
4. `pnpm run validate:release` is the authoritative ecosystem release gate;
   it is not replaced by this adapter's focused checks.

A missing environment, unavailable dependency, skipped gate, or failing check
is `BLOCKED`, not `READY`. The adapter must never print secret values.

## Release and rollback responsibilities

The owning project release operator approves publication and runs the
authoritative release gate. The adapter prepares evidence and reports results;
it does not deploy, publish, mutate accounts, or approve a decision. Use the
repository's current release procedure (`docs/RELEASE.md`) to identify the
release checkpoint and rollback target. Preserve the last verified revision,
contract version, and test output as rollback evidence. If a public-boundary
change fails verification, revert that reviewed change or restore the prior
verified revision through the project release process; do not edit generated
clients or API/schema contracts as an improvised rollback.

## Self-contained READY/BLOCKED checklist

Report `READY` only when every item is checked:

- [x] `oneCode.ts` confirms auth/admin plus normalized `rainbowjobs`, non-empty
  capabilities, designated owner, active identity, online, unpaused, and
  unexpired checks; revocation is rechecked per request.
- [x] OpenAPI route family and `oneCode.ts` schema ownership are present, with
  migration-ledger/rehearsal ownership identified.
- [x] Web cookie/native session and request-security/CSRF boundary are
  confirmed by current auth/request-security source; `SESSION_SECRET`
  ownership is named without exposing its value.
- [x] `vocationalEvidence.ts`, `rainbowJobs.ts`, and
  `privateFileService.ts` provide retention, owner deletion, cleanup, and
  audit citations; raw-byte storage is excluded from OneCode and
  reference-only handling is enforced by `validateReviewMetadata` and
  covered by `test/onecode-review.test.ts`.
- [x] Redaction rules cover secrets, sessions, private evidence, and personal
  fields; no secret or private identity appears in the report.
- [x] Audit/storage ownership, release approval, rollback checkpoint, and
  reconciliation responsibility are identified.
- [x] Focused IAMiracle tests and API typecheck pass; broader release gate is
  run or explicitly marked `SKIP` by the owning release operator.

If any box is unchecked, report `BLOCKED` with the first missing mapping or
failed check. `READY` is a project-local adapter readiness finding only: it
grants no authority, approval, deployment permission, or decision capability.