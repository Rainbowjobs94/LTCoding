# Proof Artifact & Cloud Corpus Search Audit

## 1. Scope of Search
This document records the verification audit across local repository paths and authorized workspace corpora for pre-existing Groth16 circuits, verification keys, and independently generated positive proof vectors.

## 2. Audit Results by Artifact Class

| Artifact Class | Searched Locations | Status | Notes |
| :--- | :--- | :--- | :--- |
| Compiled Circom Circuit (`*.r1cs`, `*.wasm`) | Workspace & Authorized Cloud Corpus | `UNKNOWN` (Not Found) | No pre-compiled binary `.r1cs` or `.wasm` witness generator located in cloud storage. |
| Trusted Setup Verification Key (`verification_key.json`) | Workspace & Authorized Cloud Corpus | `UNKNOWN` (Not Found) | Must be supplied from an audited ceremony transcript with pinned SHA-256 hash. |
| Independent Positive Proof Vectors | Workspace & Authorized Cloud Corpus | `UNKNOWN` (Not Found) | Per strict cryptographic policy, positive proof vectors are **never** fabricated or mocked. |
| Negative & Replay Rejection Rules | `scripts/report-template-proof-lab/policy.test.mjs` | `OBSERVED` | Enforced deterministically in the policy gate suite; rejects mutated inputs, non-canonical scalars, and replayed nonces. |

## 3. Security Invariant
In accordance with project rules:
- Filenames, READMEs, screenshots, UI `PASS` strings, synthetic adapters, or mock proof bytes are **rejected** as cryptographic evidence.
- Reward template reuse remains gated by `verifyClaimBeforeTemplateReuse()` until the owner registers a signed approval manifest with real artifact hashes and independent positive vectors.