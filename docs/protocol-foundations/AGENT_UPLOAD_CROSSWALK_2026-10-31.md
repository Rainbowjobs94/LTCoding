# Agent upload crosswalk (2026-10-31)

**Scope:** Every file from the 2026-10-31 chat upload batch, copied in full to
`docs/quarantine/agent-uploads-2026-10-31/files/` in **each** Rainbowjobs94
repository environment. **Nothing omitted.**

**Default label:** `SOURCE_CLAIM` for protocol, economics, privacy, deployment,
and UI narrative unless matched to `OBSERVED` / `IMPLEMENTED` / `TESTED` code.

**Disposition:** `QUARANTINED_REFERENCE` — read for requirements and issue
spotting; do not execute, deploy, or treat as authority.

| File | Subject (from name / bounded peek) | Label | Disposition |
| --- | --- | --- | --- |
| `Proof_and_Sustainable_Economics_Brief_590d.md` | RC curve, revenue splits, mining caps, advisory proposals | `SOURCE_CLAIM` | Cross-check vs contracts and accounting code |
| `Candidate_Proof_System_Design_85ae.md` | PoW/PoSt candidate, Circom/Groth16, Merkle/Poseidon | `SOURCE_CLAIM` | Compare to implemented proof gates only |
| `Proof_Validation_and_Audit_Report_fc21.md` | Proof validation / audit narrative | `SOURCE_CLAIM` | Do not treat as independent audit |
| `Proof_Artifact_Cloud_Search_Log_72b6.md` | Cloud search / artifact trace log | `SOURCE_CLAIM` | Operational reference only |
| `Report_Template_Proof_Validation_da24.md` | Report template | `PROPOSED` | Template only |
| `Master_Combined_2___Proof_Validation_Console_af6a.txt` | Combined proof console export (large text) | `SOURCE_CLAIM` | Full text in quarantine |
| `Soul_Operating_System__SOO____Reality_Nexus_886f.txt` | SOO / Reality Nexus UI narrative (React-style source text) | `SOURCE_CLAIM` | Not production SOO kernel; compare `soo/` where applicable |
| `Soul_Operating_System___Reality_Nexus_OS_ef35.txt` | Same content hash as row above | `SOURCE_CLAIM` | Duplicate bytes retained per upload names |
| `Soul_Operating_System__SOO____12_Nexus_f459.txt` | Same content hash | `SOURCE_CLAIM` | Duplicate bytes retained |
| `Soul_Operating_System___Reality22_Nexus_OS_f7f6.txt` | Same content hash | `SOURCE_CLAIM` | Duplicate bytes retained |
| `Soul_OS___Reality_Nexus_995e.txt` | Shorter Reality Nexus UI export | `SOURCE_CLAIM` | Full text in quarantine |
| `SoulOS_RealityNexus_ea20.txt` | SoulOS / Reality Nexus export | `SOURCE_CLAIM` | Full text in quarantine |
| `ltsocial_policy_1761862318654.pdf_2ed7.pdf` | LT Social policy PDF | `SOURCE_CLAIM` | `COUNSEL_REQUIRED` for release decisions |
| `G06_20Privacy_20Approval_20Review.pdf_28e4.pdf` | Privacy approval review PDF | `SOURCE_CLAIM` | Policy/code consistency review only |
| `Solidity_20Vault_20Source.pdf_2c47.pdf` | Vault Solidity source PDF | `SOURCE_CLAIM` | Compare to repo Solidity, do not deploy |
| `Automated_20Tax_20Vault_20Contract_20Review.pdf_8933.pdf` | Tax vault review PDF | `SOURCE_CLAIM` | Not a substitute for audit |
| `Help_20us_20finish_20the_20deployment_20for_20my_20crypto_20Blockc....pdf_1865.pdf` | Deployment help / Blockc… PDF | `SOURCE_CLAIM` | No deployment without approval |
| `Task_2081_20_E2_80_94_20Proof_20Gate_20__20Fair__20Sustainable_20Economics_20_E2_6554.pdf` | Task 2081 proof gate / economics PDF | `SOURCE_CLAIM` | Cross-check task claims vs repo |
| `1lUMwIArajA0l_96KV4NcHgublxYMaUTp5Z4hVVRSqAI_1761862246704.pdf_412f.pdf` | Uploaded Google Doc export PDF | `SOURCE_CLAIM` | Read-only |
| `Gemini_20Export_20October_2021__202026_20at_2011-36-09_E2_80_AFAM_20UTC-4.pdf_da37.pdf` | Gemini export PDF | `SOURCE_CLAIM` | Read-only |

## Composed agent skills (all environments)

Every repository includes the full skill library under `.agents/skills/`:

| Skill | Role |
| --- | --- |
| `repsu` | RepSU operating guide entry |
| `iaguardian-onecode` | Evidence model, intake, engineering, legal/IP |
| `soo-network-guardrails` | SOO admission / deny-by-default composition |
| `unified-onecode-review` | Portable OneCode review procedure |
| `lt-public-trust-review` | Public trust / evidence labels |
| `miracle-market-learning-orchestrator` | Paper-only learning boundaries |
| `hab-agent-handoff` | Hab handoff boundaries |
| `hab-protocol-review` | Token / protocol reconciliation |
| `hab-source-transfer` | Hab source transfer rules |
| `hab-resource-planner` | Hab resource planning |
| `ia-guardian-hab` | IA Guardian Hab module |

Load skills per Cursor agent discovery; SOO module composes RepSU, IAGuardian,
Miracle Market, and LT public-trust skills — all are present in every repo.

## Related

- `SOO_NETWORK_GUARDRAIL_CROSSWALK.md` — prior archive crosswalk (Task 693).
- `docs/quarantine/agent-uploads-2026-10-31/MANIFEST.md` — cryptographic manifest.
