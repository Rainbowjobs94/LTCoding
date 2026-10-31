---
name: repsu
description: Operate RepSU for evidence-driven Love Transcends source intake, engineering, privacy-preserving personalization, protocol research, implementation verification, legal/IP issue spotting, and safe Graft/model lifecycle management. Use when requests mention RepSU, IAGuardian, OneCode, LTMMN, ReForge, Physical-23, Graft, model lifecycle, source consolidation, protocol mapping, work-action proofs, privacy or agreement review, provenance, licenses, ownership, trademarks, patents, or verifying past implementations.
---

# RepSU

## Required operating guide

Read [the preserved operating guide](../iaguardian-onecode/SKILL.md) before
substantial work. Its evidence model, zero-added-spend default, privacy rules,
source-intake procedure, engineering workflow, protocol constraints, legal/IP
issue-spotting limits, research rules, verification requirements, and reporting
statuses remain authoritative under the RepSU name.

Use its supporting material directly:

- [Engineering](../iaguardian-onecode/references/engineering.md)
- [Integrations](../iaguardian-onecode/references/integrations.md)
- [Legal/IP audit](../iaguardian-onecode/references/legal-ip-audit.md)
- [Replit](../iaguardian-onecode/references/replit.md)
- [Research](../iaguardian-onecode/references/research.md)
- [Source intake](../iaguardian-onecode/references/source-intake.md)
- [Completion report](../iaguardian-onecode/templates/completion-report.md)
- [Legal/IP audit template](../iaguardian-onecode/templates/legal-ip-audit.md)
- [Source crosswalk](../iaguardian-onecode/templates/source-crosswalk.md)

## Graft safety boundary

Graft's structural graph is a local, regenerable cache. Use only the pinned
workspace package and the repository scripts documented in
`docs/REPSU_TOOLING.md`.

- Inspect package metadata, published source, lifecycle scripts, telemetry, and
  planned writes before installing or initializing a new version.
- Keep `DO_NOT_TRACK=1` and disable Graft telemetry.
- Plain `graft build` is the permitted `$0`, no-model structural pass.
- Never use `--deep`, configure `GRAFT_API_KEY`, or select a hosted model unless
  the repository's privacy owner has established that the source is public or
  expressly approved for that provider and has separately approved any cost.
- Never pass secrets, private keys, credentials, `.env` files, uploads,
  attachments, agent memory/profile data, caches, or private evidence to any
  model or remote indexing provider.
- Build only the allowlisted source roots. Do not broaden the allowlist merely
  to improve map coverage.
- Treat generated summaries as navigation aids, not proof. Verify material
  claims against current production-path source and tests.
- `graft/` and `.graft/` are local caches and must remain ignored. Commit only
  reviewed host wiring and lifecycle documentation.

## Graft lifecycle

1. **Inspect**: confirm the pinned package version, integrity in
   `pnpm-lock.yaml`, upstream source revision, install scripts, telemetry
   behavior, and the output of `graft init --dry-run`.
2. **Install**: use the package-management skill. Do not bypass the package
   firewall. Permit only reviewed native parser build scripts.
3. **Initialize structural map**: run `pnpm run graft:build`. It allowlists
   `artifacts`, `contracts`, `lib`, and `scripts`; excludes attachments,
   dot-directories (including `.agents`), caches, nested repositories, and
   submodules; and makes no model call.
4. **Wire Claude Code**: committed `.claude/` launchers resolve only the pinned
   local package, set DNT, disable implicit query refreshes, and omit vendor Stop
   auto-sync and SessionStart upkeep. Graft MCP is disabled because its startup
   upkeep can overwrite hardened wiring. Run `pnpm run graft:init:claude` to
   validate; do not rerun vendor `graft init`. Never replace `replit.md`.
5. **Use**: query with `graft map`, `graft ask`, `graft grep`, `graft skeleton`,
   and `graft callers`. Returned spans may become stale after edits; inspect
   exact source where needed.
6. **Refresh**: rerun `pnpm run graft:build` after material source changes.
   Run `pnpm run graft:check` to detect drift. Do not describe stale maps as
   current. MCP and hooks intentionally cannot auto-rebuild.
7. **Model change control**: record provider, endpoint ownership, model/version,
   retention/training terms, data classification, approved paths, budget,
   evaluation set, quality/security checks, rollback, and approver before any
   deep build. Rotate or revoke credentials outside the repository.
8. **Upgrade**: repeat source and package inspection, rebuild from scratch,
   compare node/file/edge counts and unsupported-language warnings, review all
   rewritten host files, and keep the prior lockfile as rollback evidence.
9. **Retire**: remove host wiring deliberately, delete local `graft/` and
   `.graft/` caches, remove the dependency with the package-management skill,
   and verify no hooks or MCP registrations remain.

## Reporting

Report the exact installed version and genuine structural node, edge, parsed
file, and card counts from command output. State explicitly whether a deep/model
map was skipped, unavailable, failed, or approved. Never invent generated maps,
claim a skipped check passed, or equate wiring with successful indexing.

Do not mark the broader task complete from tooling work alone. Use
`implementation_in_progress` until the owning agent verifies all delegated
application and release work.