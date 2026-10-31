# Staged task template

Copy this small template for one active slice. Do not start the next slice
until the current contract and release checks pass.

```yaml
slice_id: ""
title: ""
state: proposed
owner: ""
scope:
  observe: []
  normalize: []
  label: []
  simulate: []
  human_review: []
evidence:
  source_ids: []
  implementation_paths: []
  test_paths: []
  hashes: []
boundaries:
  paper_only: true
  no_trade_custody_signing_minting_rewards_autonomy: true
dependencies: []
omissions: []
checks:
  contract: pending
  migration: not_applicable
  unit: pending
  integration: pending
  privacy: pending
  release: pending
human_review:
  required: true
  decision: pending
  reviewer: ""
  reviewed_at: ""
next_review: ""
```

Use `implemented` only for this repository's verified implementation and
tests. Use `proposed` for designed but not built work, `blocked` for work
whose evidence/approval/dependency prevents progress, and `unavailable` when
the required provider or asset cannot be identified or accessed.
