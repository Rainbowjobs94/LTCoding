# SOO Network Guardrail adoption crosswalk

**Task:** 693  
**State:** `IMPLEMENTED` for the documented guidance and supported server
control paths. This does not claim deployment, publication, production
provider activation, OS/container isolation, or completed PostgreSQL
concurrency evidence.

## Quarantined archive evidence

The two uploaded archives were inspected in place as untrusted bytes. Neither
was extracted into the workspace, executed, installed, imported, or activated.

| Source | SHA-256 | Members | Expanded bytes | Compressed bytes | Max finite ratio | Safety result |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| `attached_assets/miracle-hub-replit_1789562890842.zip` | `4e865827e1d8ac7b27d7a960cb515ffda419305551f11fa9f1878f1f7b1ee37a` | 39 | 302,338 | 94,336 | 4.8 | `OBSERVED`; no traversal, absolute path, duplicate path, symlink, or device entry |
| `attached_assets/miracle-network_1789562890842.zip` | `385866780a75e7eae3a07d4ee448b01b34a22292b0d2efc45c4ee918cfb37774` | 17 | 122,819 | 33,096 | 1.0 | `OBSERVED`; no traversal, absolute path, duplicate path, symlink, or device entry |

The second archive contains a zero-byte stored `.gitkeep`, so its unbounded
zero-compression ratio is not treated as an expansion finding. No duplicate
content hashes were found within either archive. Secret-risk names are limited
to `.env.example` placeholders; no values were read or disclosed. Executable
entrypoints, deployment files, contract files, daemon/agent files, and package
manifests remain quarantined.

## Bounded adoption and omission crosswalk

| Evidence path / subject | Label | Decision and reason |
| --- | --- | --- |
| `skills/SKILL_MEGA.md`, `skills/SKILL_SOO_LTR_ECOSYSTEM.md` in `miracle-hub-replit` | `CONFLICT` / `QUARANTINED` | Source claims and broad authority are not authority. Use the existing composed skills and server policy instead. |
| `skills/lt-replit-agent/SKILL.md` and references | `ALREADY_EXISTS` | Replit/source-intake guidance is already covered by RepSU and IAGuardian; no duplicate module adopted. |
| `main.py`, `agents/`, `backend/`, `scripts/deploy.js`, `package.json` | `QUARANTINED` / `BLOCKED` | Entrypoints, daemons, deployment hooks, and dependencies were not executed or installed. Runtime adoption requires independent security, dependency, and owner review. |
| `contracts/`, `client/`, `hardhat.config.ts` | `BLOCKED` | Wallet, contract, mining, signing, and deployment surfaces are outside SOO scope and remain explicitly blocked. |
| `miracle-network/src/server.js`, `config/mining.json`, Docker/Replit files | `QUARANTINED` / `BLOCKED` | Untrusted server, mining, container, and deployment claims; no activation or configuration adoption. |
| `.env.example` files in both archives | `BLOCKED` | Placeholder locations were noted without reading values; no credentials are imported into SOO or reports. |
| Existing RepSU, IAGuardian OneCode, Miracle Market learning, LT public-trust, security, and threat-model guidance | `ALREADY_EXISTS` / `ADOPTED` | Compose these authoritative boundaries rather than duplicating them. |
| `.agents/skills/soo-network-guardrails/SKILL.md` | `IMPLEMENTED` | Small progressive composition module; it grants no runtime authority and distinguishes guidance from runtime evidence. |
| Server-owned gateway, durable identities/policy, revocation, emergency fencing, leases, bounded timeout, and deny-by-default checks | `IMPLEMENTED` | `artifacts/api-server/src/lib/sooGateway.ts`, `lib/db/migrations/0119_soo_network_guardrails.sql`, `lib/db/migrations/0120_soo_hardening.sql`, and focused source tests provide the current implementation boundary. |
| Managed provider mediation for Guardian and Miracle Hub; reviewed sports tool mediation | `IMPLEMENTED` | Provider calls use `sooDispatch`; the reviewed sports path uses `sooToolDispatch` with an exact tool/input registry. This is not production provider activation. |
| Append-only redacted decisions/tool/outcome receipts | `IMPLEMENTED` | Durable receipt tables/triggers and digest-only persistence are present; raw prompts, secrets, and private source bodies are excluded. |
| Reviewed activation control and admin SOO status/revocation/emergency UI | `IMPLEMENTED` | `artifacts/api-server/src/routes/soo.ts` and `artifacts/rainbow-jobs/src/pages/command-center.tsx`; activation remains a control path, not evidence of production activation. |
| Source/static adversarial dispatch gates | `IMPLEMENTED` | `artifacts/api-server/src/lib/sooGateway.source-contract.test.ts` and `sooGateway.test.ts` are present and enumerate bypass, replay, stale generation, redaction, and policy-boundary assertions. |
| Current job isolation | `IMPLEMENTED` | Server-enforced policy boundary with secretless input, configured filesystem/egress restrictions, cleanup, no child agents/policy mutation, and bounded timeout. OS/container isolation is `UNIMPLEMENTED`; no attestation is claimed. |
| Isolated PostgreSQL adversarial/concurrency execution | `BLOCKED` | `artifacts/api-server/scripts/test-soo-gateway-isolated.sh` and `artifacts/api-server/test/soo-gateway-postgres.test.ts` exist, but execution is blocked by pre-existing migration `0073a`; no PostgreSQL concurrency result is claimed. |
| Financial, wallet, deployment, mobile, provider activation, publication, and autonomous policy/code changes | `OUT_OF_SCOPE` / `BLOCKED` | Explicitly omitted; no archive claim can expand scope. |

## Unsupported or unresolved dependencies

No archive dependency, provider credential, mining service, Docker runtime,
workflow activation, deployment target, or contract authority is adopted.
Package manifests were identified as evidence but not installed. Exact
licenses, provenance, OS/container isolation, and any stronger-than-server
policy attestation remain unavailable; the configured server boundary and
egress controls are the implemented scope.