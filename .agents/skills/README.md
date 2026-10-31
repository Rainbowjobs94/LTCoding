# Agent skills (complete library)

Every Rainbowjobs94 Cloud Agent environment includes **all** skills below.
Attach or discover them from `.agents/skills/<name>/SKILL.md`.

| Skill directory | Use when |
| --- | --- |
| `repsu/` | RepSU, source intake, Graft lifecycle, verification |
| `iaguardian-onecode/` | Evidence labels, privacy, engineering, legal/IP issue spotting |
| `soo-network-guardrails/` | SOO gateway policy, leases, deny-by-default IA jobs |
| `unified-onecode-review/` | OneCode review packets, idempotency, adapter boundaries |
| `lt-public-trust-review/` | Public claims, owner actions, human approval |
| `miracle-market-learning-orchestrator/` | Observe → simulate → human review (paper-only) |
| `hab-agent-handoff/` | Hab agent handoff and permission boundaries |
| `hab-protocol-review/` | Token/protocol reconciliation, no mainnet without approval |
| `hab-source-transfer/` | Hab source transfer and quarantine |
| `hab-resource-planner/` | Hab resource planning |
| `ia-guardian-hab/` | IA Guardian Hab operator workflow |

## Protocol and upload evidence (full bytes)

- Quarantine: `docs/quarantine/agent-uploads-2026-10-31/files/` (**20 files**, nothing omitted)
- Manifest: `docs/quarantine/agent-uploads-2026-10-31/MANIFEST.md`
- Crosswalk: `docs/protocol-foundations/AGENT_UPLOAD_CROSSWALK_2026-10-31.md`
- SOO archive crosswalk: `docs/protocol-foundations/SOO_NETWORK_GUARDRAIL_CROSSWALK.md`

Uploaded evidence is **reference only** (`SOURCE_CLAIM`); it does not grant
deploy, spend, or production activation authority.
