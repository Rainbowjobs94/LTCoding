# Legal, IP, Provenance, and Implementation Audit

This module supports factual review and issue spotting. It is not legal advice,
trademark clearance, a patentability opinion, securities or tax advice, or
attorney-client work.

## Privacy Review

Compare actual collection, use, sharing, storage, logging, retention, deletion,
security, and vendor behavior with public policy and consent interfaces.

Check:

- Purpose and lawful/consent basis presented to the user
- Sensitive data, minors, KYC, biometrics, location, behavior, payments, and media
- Audience and access control
- On-chain versus off-chain data
- Retention, deletion, backup limitations, correction, export, and revocation
- Incident contacts and versioned consent
- Jurisdiction and international-processing disclosures

Report mismatches. Do not declare compliance.

## User Agreement Review

Compare product behavior with agreement terms for eligibility, acceptable use,
moderation, appeals, user-content licenses, takedown, termination, warranties,
liability, payments, refunds, marketplace activity, tokens, blockchain
irreversibility, and version acceptance.

Flag missing, contradictory, or overbroad provisions for counsel.

## Copyright and License Review

Inventory manifests, lockfiles, SPDX headers, vendored code, pasted snippets,
generated code, contracts, fonts, media, data, model terms, and contributor work.

For each item record:

`destination → origin → version/hash → license → modifications → notices → approval`

Distinguish repository-level license metadata from each artifact's actual license.
Flag unknown provenance, incompatible copyleft, missing notices, unclear
contributor/contractor assignment, or provider terms that restrict intended use.

Possession, a copyright notice, a watermark, or a blockchain record does not
establish ownership or permission.

## Trademark Review

List names, marks, slogans, logos, domains, claimed owners, first-use claims,
jurisdictions, and relevant classes. Record evidence and similarity concerns.
Never state that a mark is available, registered, enforceable, or cleared without
authoritative records and qualified review.

## Patent and Prior-Art Review

Extract each technical novelty claim and its earliest evidenced date. Record cited
sources, public disclosures, repositories, demonstrations, publications, and
related implementations. Preserve URLs, dates, and hash snapshots where authorized.

Separate:

- Technical novelty hypothesis
- Prior-art search result
- Inventorship/ownership evidence
- Filing strategy
- Patentability or infringement opinion

The last two require qualified patent counsel. Escalate before new public
disclosure when patent protection may be intended.

## Blockchain Innovation Review

For each blockchain claim distinguish:

1. Specification
2. Source code
3. Successful compile
4. Local tests
5. Testnet deployment
6. Mainnet deployment
7. Verified source and transaction evidence
8. Independent audit

Check claims about tokens, rewards, stable value, ownership, provenance,
immutability, cross-chain operation, KYC, watermarks, and financial outcomes
against actual evidence. Require explicit simulation or not-deployed disclosures.

## Historical Task and Function Verification

For each claimed task or function:

- Locate production-path code.
- Confirm it is reachable from the supported application.
- Identify data migrations, configuration, authorization, and failure behavior.
- Find focused tests and authoritative release coverage.
- Run authorized checks and record command, revision, environment, date, and result.
- For deployment claims, require a deployment identifier/address and live check.

Use evidence statuses only. Task titles, task-system state, screenshots, plans,
comments, generated stubs, and historical completion percentages are not
implementation proof.

## Stop and Escalate

Stop release or copying when there is an exposed credential, unclear ownership,
unknown or incompatible license, suspected infringement, policy/code mismatch,
unreviewed sensitive-data processing, unresolved financial or regulatory claim,
patent-sensitive public disclosure, or failed authoritative gate.

Produce questions and remediation options for counsel; do not invent conclusions.
