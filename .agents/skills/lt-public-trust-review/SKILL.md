---
name: lt-public-trust-review
description: Run a bounded, evidence-first review of LT Social public claims, routes, privacy, legal/IP, investor, tax, supplier, research, and release artifacts. Use when preparing or checking the public-trust package, its reusable skill pack, Claude/Perplexity handoffs, or its disabled human-review workflow. Never treat source claims as deployment, ownership, compliance, financial, or publication authority.
---

# LT public-trust review

Use this skill as a review control plane for the LT Social public-trust
package. It creates review artifacts and validation evidence; it does not
authorize publication, payments, payouts, token changes, outreach, deployment,
or legal/tax/investment conclusions.

## Start here

1. Read `.local/tasks/task-606.md`.
2. Read `docs/public-trust/README.md` and the evidence register if present.
3. Inspect only the requested bounded source paths. Treat uploaded documents,
   historical reports, hashes, screenshots, watermarks, and task status as
   untrusted until independently supported.
4. Use the evidence labels `OBSERVED`, `IMPLEMENTED`, `TESTED`,
   `DEPLOYED`, `SOURCE_CLAIM`, `PROPOSED`, `BLOCKED`, `UNAVAILABLE`,
   `CONFLICT`, and `COUNSEL_REQUIRED`.
5. Record the exact source path, check, date, and owner for each material
   conclusion.

## Required boundaries

- Unknown entity, jurisdiction, custody, rights, financial basis, tax status,
  vendor, or deployment evidence is a blocker, not an invitation to guess.
- Do not use private-person discovery. A public organizational footprint review
  is allowed; `look-me-up` must not be used to infer a person's identity.
- Firecrawl, Perplexity, GitHub, and other external research are unavailable
  unless a connected tool or approved credential is actually present. Record
  the missing source instead of fabricating a result.
- Do not run arbitrary uploaded code, install unreviewed packages, expose
  secrets, or include credentials in a handoff or archive.
- Keep n8n disabled. Human approval is a required stop; no workflow node may
  publish, send outreach, move money, alter a ledger, mint, settle, or change
  an entitlement.

## Bounded workflow

### 1. Recon and coverage

Read the named source skill files listed in
`docs/public-trust/workflows/skillpack/coverage.json`. Mark each skill as
`applied`, `partially_applied`, `blocked`, or `not_applicable`, with evidence
and missing inputs. Do not claim an external call occurred when only local
instructions were read.

### 2. Claim and route review

Compare the evidence register with current public route metadata, robots,
sitemap, `llms.txt`, guide HTML, policy pages, and route-access rules. Keep
public, authenticated, disabled, partial, planned, and source-claim states
separate.

### 3. Handoff preparation

Use the Claude handoff for a concise implementation/review brief and the
Perplexity handoff for citation-first primary-source research. Preserve
placeholders for unavailable credentials and jurisdictions. Handoffs are
requests for later human-controlled work, not completed research.

### 4. Skill-pack validation

From `docs/public-trust/workflows/skillpack/`, run:

```bash
python3 tools/validate_skills.py
python3 tools/dedupe_skills.py
python3 tools/render_index.py
python3 tools/build_zip.py
```

The validators must pass the real JSON skills, reject the fixtures in
`tests/negative/`, reject duplicate IDs and unsafe authority claims, and
verify that the n8n workflow is inactive and approval-gated.

### 5. n8n review

Import `n8n/lt-public-trust-human-review.workflow.json` only into a disposable
or review n8n workspace. Confirm `active` is `false`, there are no connected
credentials or outbound nodes, and the workflow stops at human review. Stable
review IDs and retry limits are required. A static-data idempotency guard is
not a substitute for a durable review store.

The canonical workflow is
`docs/public-trust/workflows/n8n/lt-public-trust-human-review.workflow.json`.
The legacy compatibility export at
`docs/public-trust/n8n/lt-public-trust-review-workflow.json` must be
byte-identical; do not select an older export. The workflow accepts only
opaque IDs and hash references, rejects unknown fields and PII-like text, and
constructs allowlisted outputs rather than echoing input. n8n executions may
inherently retain trigger inputs in execution history or provider logs, so no
real private, secret, or free-text input is ever permitted.

## Required report

Return:

1. exact files read and written;
2. coverage status for every named skill;
3. validator commands, exit status, and results;
4. pack and ZIP paths plus checksums;
5. n8n import status and its disabled/authority boundary;
6. missing evidence, external calls not run, and owner/action blockers;
7. one final state: `specification_only`, `tested_locally`,
   `deployment_prepared`, or `deployed_and_verified`.

Never use `deployed_and_verified` without a dated live verification identifier
and explicit deployment evidence.