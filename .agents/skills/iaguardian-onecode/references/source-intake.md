# Source Intake and Crosswalk

## Inventory

For each source, record:

- Stable source ID
- Original filename and source location
- Real byte size and SHA-256
- Content type and access level
- Extraction status
- Claimed author/owner and date
- License or `unknown`
- Evidence level
- Related duplicates or versions
- Intended integration destination
- Missing input or required follow-up

Do not hash a preview and present it as the original. Do not claim an archive,
video, image, repository, or linked page was inspected when only its name,
summary, metadata, or truncated text was available.

## Archive Safety

- List members before extraction.
- Reject absolute paths, `..` traversal, symlinks, hard links, devices, and pipes.
- Bound member count, nesting, expanded size, individual size, and compression ratio.
- Extract only under a quarantine directory.
- Do not execute scripts or install dependencies during intake.
- Review package manifests, install hooks, binaries, macros, and generated files.
- Keep private sources outside public assets and version control by default.

## Secrets and Sensitive Data

- Report only the file location and credential category.
- Never print, copy, archive, commit, or send the value to a model.
- Recommend revocation or rotation when genuine exposure is confirmed.
- Treat names suggesting keys or credentials as a reason to inspect safely, not
  proof that a secret exists.
- Minimize KYC, location, biometric, health, inmate, minor, payment, and identity data.

## Crosswalk Rules

Map every requirement to:

1. Source and evidence label.
2. Requested outcome.
3. Existing implementation evidence.
4. Destination module or documentation.
5. Acceptance test.
6. Dependencies, permissions, cost, and risks.
7. Conflict or supersession decision.
8. Final disposition.

Preserve conflicting claims. Select an implementation only after inspecting real
code and its current tests.
