# Protocol and Integration Boundaries

## OneCode and GitOps

Compare actual revisions before combining documentation and archives. Prefer
branches, diffs, and reviewable changes. Require authorization for remote writes,
record the base revision, detect concurrent changes, and never rewrite history
without informed approval.

## Work-Action and Reward Proofs

A proof envelope should include:

- Schema and policy version
- Participant and owner scope
- Declared action type
- Consent reference
- Bounded evidence commitment
- Anti-replay identifier
- Time window
- Verifier identity or policy
- Reward-calculation version
- Eligibility outcome
- Accounting reference
- Settlement state and receipt evidence

Observed activity is not automatically verified useful work. Verified useful work
is not automatically reward-eligible. Accounting credit is not final blockchain
settlement. Preserve all four distinctions.

## Sensitive Attestations

KYC, geo, UV, sensor, biometric, correctional, and behavioral systems must:

- Collect the minimum necessary data with explicit purpose.
- Keep raw evidence private and off-chain.
- Use revocable, scoped attestations and retention deadlines.
- Support correction, appeal, deletion where applicable, and verifier failure.
- Avoid discriminatory scoring, diagnosis, identity inference, or automated legal
  and employment decisions.
- Treat client measurements and mock oracles as untrusted.

## Media and Physical-23

Media jobs require permission, limits, retention, cost, output validation, and
metadata review. Physical-23 remains human-directed and advisory. Do not turn
creative modes or media observations into autonomous profiling, posting, or
financial authority.

## Messaging and Safety Adapters

Default messaging adapters to no-send until credentials, recipient authorization,
content review, cost, and retry behavior are approved. Safety and policy adapters
must deny by default and enforce server-side authorization.
