#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
python3 -m pip install --user -e ".[dev]"

# Verify bundled skills and quarantined upload library (20 files, complete).
test -f .agents/skills/repsu/SKILL.md
test -f .agents/skills/soo-network-guardrails/SKILL.md
test -f .agents/skills/hab-protocol-review/SKILL.md
test -f docs/quarantine/agent-uploads-2026-10-31/MANIFEST.md
count="$(find docs/quarantine/agent-uploads-2026-10-31/files -type f | wc -l)"
test "$count" -eq 20
