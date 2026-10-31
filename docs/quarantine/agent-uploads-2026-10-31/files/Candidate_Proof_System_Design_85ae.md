# Candidate Proof System Design (Compute + Storage PoW/PoSt)

## 1. Overview
This document specifies the candidate zero-knowledge and deterministic verification architecture for validating genuine compute and storage claims prior to reusing reward templates.

> **Governance Note:** Circom + `snarkjs` (Groth16 over BN254) is the candidate architecture. A candidate design does **not** constitute approval of synthetic or mock proofs. The policy engine remains fail-closed until pinned artifact hashes and real positive/negative vectors are registered.

## 2. Statement Specification

### 2.1 Storage Claim Statement
- **Unit of Storage:** Fixed `4096`-byte (`4 KiB`) raw data chunks.
- **Commitment Tree:** Binary Poseidon Merkle tree of depth $d = 20$ (supporting up to $2^{20}$ chunks = $4\text{ GiB}$ per dataset root).
- **Challenge Derivation:**
  $$\text{index} = \text{uint64}(\text{SHA256}(\text{challenge\_nonce} \parallel \text{claimant\_account})) \bmod 2^{d}$$
- **Verification Condition:** The prover demonstrates knowledge of chunk payload $D_{\text{index}}$ and sibling path $\{S_0, \dots, S_{d-1}\}$ such that $\text{MerkleRoot}(D_{\text{index}}, \text{index}, \{S_k\}) = R_{\text{storage}}$.

### 2.2 Compute Claim Statement
- **Unit of Compute:** $K$ iterated hash-chain evaluations bound to the challenged storage chunk and nonce.
- **Input Binding:**
  $$W_0 = \text{Poseidon}(\text{domain\_tag}, \text{claimant\_account}, \text{challenge\_nonce}, \text{Hash}(D_{\text{index}}))$$
- **Work Iteration:** For $j = 1 \dots K$, $W_j = \text{Poseidon}(W_{j-1}, j)$.
- **Output Digest:** $H_{\text{compute}} = W_K$.

## 3. Public Input Byte-Level Schema

All public inputs are serialized as an array of 6 field elements in $\mathbb{F}_r$ where:
$$r = 21888242871839275222246405745257275088548364400416034343698204186575808495617$$

| Index | Field Name | Width (Bytes) | Endianness | Normalization Rule |
| :--- | :--- | :--- | :--- | :--- |
| `pub[0]` | `version_and_domain` | 32 | Big-Endian | Exact match `0x01` (`LTR_MINING_V1`) |
| `pub[1]` | `claimant_account` | 32 | Big-Endian | Upper 12 bytes `0x00`, lower 20 bytes EVM address |
| `pub[2]` | `challenge_nonce` | 32 | Big-Endian | Strictly `< r`, unconsumed in nullifier set |
| `pub[3]` | `storage_merkle_root` | 32 | Big-Endian | Strictly `< r`, non-zero |
| `pub[4]` | `challenged_chunk_index` | 32 | Big-Endian | Upper 24 bytes `0x00`, lower 8 bytes `uint64 < 2^20` |
| `pub[5]` | `compute_work_digest` | 32 | Big-Endian | Strictly `< r`, non-zero |