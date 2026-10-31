# Market analysis reference

Use this reference after `observe` and before normalization.

## Observation contract

An observation has an opaque ID, provider and adapter ID, instrument or event
identity, quote/unit, retrieval time, event time when available, freshness and
cache age, methodology, attribution/license requirement, response commitment,
and rejection reason. Values must be finite and bounded. A provider statement
is not a verified market fact until the provider and response are reviewed.

Sports observations are limited to scores, schedules, standings, statistics,
play-by-play, and separately approved sports odds. They expose provider,
retrieval time, cache age, freshness, league/event identity, correction state,
and attribution. They never become crypto, stock, forex, token, gas, or
prediction-market prices.

Financial, crypto, gas, token, and prediction-market observations require
separate reviewed server adapters with their own symbol/chain identity,
freshness, rate-limit, outage, licensing, retention, and kill-switch rules.
Do not use sports odds or an MCP tool as a substitute.

## Provider boundary

`mcp-sports-hub` remains unreviewed/unavailable until its exact pinned commit,
MIT license and dependency tree, named provider/tool allowlist, sidecar
isolation, response limits, egress policy, attribution, and outage behavior
are reviewed. The sidecar has no wallet, database, filesystem, deployment, or
unrestricted network authority.

## Analysis labels

Keep observed data, derived indicators, forecasts, scenarios, educational
commentary, paper decisions, provisional eligibility, and verified outcomes
separate. Every forecast records its horizon, supporting and opposing evidence,
uncertainty, risk limit, invalidation condition, and model/policy version. It
must not say guaranteed buy, sell, stake, return, earnings, or value.
