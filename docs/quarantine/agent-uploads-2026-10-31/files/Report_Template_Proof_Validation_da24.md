# Report Template Proof Validation Specification

## 1. Executive Policy
Reward templates in the mining protocol **MUST NOT** be reused across claims unless each claim is backed by a cryptographically verified proof of genuine compute and storage work, bound to an unconsumed nonce and a canonical public-input encoding.

## 2. Cryptographic Verification Gates (7 Mandatory Invariants)
Before any reward template reuse is permitted in production, the verification pipeline enforces the following seven gates:

1. **Exact Verifier & Circuit Identity:**
   - Circuit Type: Groth16 over BN254 (`alt_bn128`), compiled from a pinned Circom revision.
   - Required Artifacts: `.circom` source, `.r1cs` constraint system, `.wasm` witness generator, and `Groth16Verifier.sol` with pinned SHA-256 digests.
2. **Public Verification Key (`verification_key.json`):**
   - Must match the Ceremony / Powers of Tau transcript and be pinned by SHA-256 digest in the policy manifest.
3. **Compute & Storage Statements:**
   - **Compute Statement:** Proves execution of $N$ sequential Poseidon/SHA-256 state transitions over input challenge seed $C_{\text{seed}}$ yielding output digest $H_{\text{compute}}$.
   - **Storage Statement:** Proves Merkle inclusion of a 4,096-byte data chunk $D_i$ at leaf index $i$ under pinned dataset Merkle root $R_{\text{storage}}$ challenged by $C_{\text{seed}}$.
4. **Canonical Public-Input Encoding:**
   - Field Order (6 elements, 32-byte big-endian scalar field elements modulo $r_{\text{BN254}}$):
     1. `version_and_domain` (`uint256`, canonical domain tag)
     2. `claimant_account` (`uint160` zero-padded to 32 bytes)
     3. `challenge_nonce` (`uint256`, strictly monotonic/unconsumed)
     4. `storage_merkle_root` (`uint256` field element $< r$)
     5. `challenged_chunk_index` (`uint64` zero-padded to 32 bytes)
     6. `compute_work_digest` (`uint256` field element $< r$)
   - Any non-canonical scalar ($\ge r_{\text{BN254}}$) or altered byte width is rejected prior to pairing evaluation.
5. **Independent Positive Proof Vectors:**
   - Must originate from an independent prover run against real storage chunks and compute challenges, accompanied by the full witness/proof transcript and provenance hash.
   - Mock proof bytes, UI pass flags, or synthetic adapters are strictly rejected.
6. **Negative & Replay/Malleability Tests:**
   - Flipping any bit in `pi_a`, `pi_b`, `pi_c`, public inputs, chunk data, Merkle path, or leaf index **MUST** fail verification.
   - Re-submitting an already-consumed `(claimant_account, challenge_nonce, compute_work_digest)` tuple—or an alternate scalar encoding ($x + r_{\text{BN254}}$)—**MUST** be refused as a replay/malleability violation.
7. **Explicit Owner Approval Manifest:**
   - Requires a signed owner approval manifest binding the exact SHA-256 hashes of the circuit, verification key, verifier contract, and public-input schema.