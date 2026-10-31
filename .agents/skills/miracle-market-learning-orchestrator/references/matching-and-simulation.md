# Matching and simulation reference

## Feature and assignment contract

Player-agents and eligible instruments use a versioned, normalized feature
vector containing only reviewed market, quality, risk, calibration, and
time-horizon inputs. Protected, health, trauma, hidden behavioral, or
identity-sensitive attributes never enter a match score. Freeze source
snapshots and rule versions for replay.

The assignment engine deterministically produces a score matrix and may return
unmatched. Capacity, no-match threshold, hysteresis, cooldown, tie-breaking,
conflict disclosure, and review-window rules are explicit. Reassignment cannot
occur minute by minute or erase an earlier reason trail.

## Paper game boundary

An immutable observation becomes a virtual play only after the observation is
accepted and the rule version is frozen. Paper units, positions, predictions,
fills, fees, spread, slippage, gas assumptions, stale data, cancellation,
correction, outage, and insufficient-data behavior are all declared before
activation. A paper outcome changes no wallet, token, reward, entitlement, or
real-world position.

Conditional events compile to a bounded predicate format; they cannot run
arbitrary code. A sports predicate can move an offer only to paper-eligible or
human-review state. It cannot trigger a sale, wager, transfer, mint, signing,
settlement, or reward.

## Polygon boundary

Polygon is limited to a reviewed testnet rehearsal with dedicated
least-privilege roles, exact bytecode/configuration evidence, policy hash,
pause controls, and rollback documentation. Mainnet deployment, live sales,
custody, and spendable allocations are blocked pending economics,
legal/compliance, independent audit, key custody, incident response, and
owner approval.
