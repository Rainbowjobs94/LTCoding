# Proof Validation & Fair-and-Sustainable Economics Research Brief

## 1. Accounting Separation & Solvency Principles
To ensure long-term sustainability and regulatory clarity, the protocol strictly separates four distinct categories of value:

1. **Collected Customer & Platform Revenue (Realized Inflows):**
   - Actual native asset inflows settled on-chain via `KEMVault.sol` and `RCBondingCurve.sol`.
   - **Shift Node Split:** `75%` Creator (`25%` immediately available + `50%` vaulted until the agreed maturity timestamp or governance approval) and `25%` Platform (routed to the 2-of-4 Governance Safe `0xd6aCD5f169279C9989dA2F04C6CeBd3dC2286808`).
   - **Streaming Split:** `75%` Creator (`25%` immediately available + `50%` vaulted), `10%` Viewers (allocated via pull-based `viewerClaimableRewards`), and `15%` Platform (routed to the Governance Safe).
2. **Reserve-Backed Bonding Curve Issuance (`RCBondingCurve`):**
   - Reality Coin (RC) spot price $P(S) = P_{\text{base}} + m \cdot S$ and reserve balance $R(S) = P_{\text{base}} \cdot S + 0.5 \cdot m \cdot S^2$ are enforced via integer math with a `100 bps` (1%) protocol swap fee.
   - Reserve deposits back circulating curve tokens 1:1 along the integral curve and are never commingled with operating revenue.
3. **Internal Promotional Credits:**
   - Promotional deposit multipliers (`promoPlatformCredits`) are strictly non-withdrawable internal platform credits and carry no claim on curve reserves.
4. **Unbacked Token Issuance & Assumed Market Prices:**
   - Daily mining mint caps (`10,000 ether`/day) and triennial vested rewards (unlocking `1924905600` / Dec 31, 2030) represent token supply expansion—**not** collected revenue.
   - No fixed fiat earnings, guaranteed APYs, or assumed secondary-market token prices are promised to miners or node operators.

## 2. Commercial Proposals (Unapproved / Advisory Only)
*The following items are strictly labeled as **Proposals** and are not active on-chain rules:*
- **Proposal A (Fee-Backed Mining Pool):** Cap variable mining reward distributions to a fixed percentage of trailing 30-day realized platform fee inflows rather than fixed daily token inflation.
- **Proposal B (Storage Rent Escrow):** Require storage clients to lock real payment streams that release pro-rata upon verified Merkle chunk proofs.