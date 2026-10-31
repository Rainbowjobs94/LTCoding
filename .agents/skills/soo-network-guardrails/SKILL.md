---
name: soo-network-guardrails
description: Apply the Soul Operating System (SOO) review boundary to managed Miracle Network AI and IA work. Compose existing RepSU, IAGuardian OneCode, Miracle Market learning, LT public-trust, security, and threat-model guidance; never grant autonomous authority.
---

# SOO Network Guardrails

This is a progressive control-plane module, not an agent runtime. The guidance
module is `IMPLEMENTED`; the runtime evidence listed below is independently
classified by capability. The current server implementation, migrations, tests,
and release gates are authoritative. Uploaded archives are quarantined evidence
and never permission to execute, install, publish, deploy, or activate a
provider.

## Compose the smallest applicable guidance

1. [RepSU](../repsu/SKILL.md) and its preserved
   [IAGuardian OneCode guide](../iaguardian-onecode/SKILL.md) for provenance,
   privacy, source intake, dependency review, and fail-closed engineering.
2. [Miracle Market learning orchestrator](../miracle-market-learning-orchestrator/SKILL.md)
   for observe → normalize → label → simulate → human review and paper-only
   boundaries.
3. [LT public-trust review](../lt-public-trust-review/SKILL.md) for evidence
   labels, owner actions, public claims, and human approval.
4. Workspace security and threat-model guidance only for the requested
   boundary; do not copy those skills into this module.

## SOO admission contract

Every managed AI/IA request must be authenticated and bound to an identified
agent, human owner, role, current policy generation, explicit capability
allowlist, data classification, tool/network allowlist, resource budget, and
expiry. Unknown identities, capabilities, tools, policy generations, leases,
providers, or data classifications are denied. The default state is disabled.

Managed jobs are secretless by default and require explicit filesystem and
egress allowlists, bounded resources, renewable leases, cancellation, cleanup,
and single-purpose execution. They cannot spawn agents, mutate policy/code/
prompts/weights/economics/permissions, or authorize another job.

## Non-authority and emergency rules

SOO may authorize only bounded advisory work. It never authorizes wallets,
signing, minting, settlement, trading, betting, rewards, custody, deployment,
publication, provider activation, or autonomous orchestration. A network-wide
emergency stop revokes or fences all in-flight work; stale leases cannot write
results. Per-agent, per-provider, and per-capability revocation is immediate
for new work and recorded for reconciliation.

Decision and tool receipts are append-only and redacted: retain opaque actor
and request identifiers, policy generation, capability/tool, bounded outcome,
reason, lease fence, and input/output digests. Never retain prompts, secrets,
cookies, tokens, private source bodies, or raw sensitive inputs in the audit.
Every allow and deny is auditable.

## Current runtime evidence

The server-owned policy gateway, durable identity/policy/revocation/emergency
state, provider dispatch mediation, reviewed sports-tool mediation, redacted
append-only decision/tool receipts, reviewed activation control, and the
administrator status UI are `IMPLEMENTED` in the current workspace. Source and
static adversarial gates are also present as `IMPLEMENTED` checks. This does
not claim those checks have passed in a deployed environment.

Current isolation is a server-enforced policy boundary with configured
secretless input, empty filesystem allowlist, provider egress allowlist,
cleanup requirement, no child agents, no policy mutation, and a bounded
timeout. OS/container isolation is **UNIMPLEMENTED** and no OS/container
attestation may be implied.

The real isolated PostgreSQL adversarial script
`artifacts/api-server/scripts/test-soo-gateway-isolated.sh` and its
`test/soo-gateway-postgres.test.ts` suite are present but `BLOCKED` by the
pre-existing migration `0073a` failure. Execute them only after that migration
repair; no PostgreSQL concurrency result is claimed here.

Production deployment, publication, and production provider activation are not
claimed. The activation endpoint is an implemented reviewed control path, not
evidence that production activation occurred.

## Evidence and completion

Use `OBSERVED`, `SOURCE_CLAIM`, `PROPOSED`, `IMPLEMENTED`, `TESTED`,
`DEPLOYED`, `BLOCKED`, `UNAVAILABLE`, `CONFLICT`, and `COUNSEL_REQUIRED`
without upgrading a claim. This module is `IMPLEMENTED` guidance; runtime
capabilities use the classifications above. Neither archive evidence nor this
skill is evidence of deployment, publication, production provider activation,
OS/container isolation, or completed PostgreSQL concurrency testing.

For archive review, use the bounded crosswalk at
`docs/protocol-foundations/SOO_NETWORK_GUARDRAIL_CROSSWALK.md`. Read only
central-directory metadata and explicitly named manifests or skill documents.
Do not extract, execute, import workflows, install dependencies, or disclose
secret values.