# Reality Nexus: Proof Validation & Evidence Lab

A static dashboard that lists the nine artifacts needed before any report template can be reused, the architecture mismatches found so far, synthetic policy vectors, and an owner approval checklist.

## Run

```bash
cd docs/dashboard
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
```

## What it is and is not

- All data is hard-coded in `src/App.jsx`. Nothing is fetched or computed from the repository.
- File hashes are copied from `FILE-INVENTORY.csv`. The page does not recompute them.
- The Sandbox tab replays a fixed sample of expected results. It does not run `policy.test.mjs`.
- The Approval checklist is a personal reminder kept in the browser tab. It does not unlock anything. The gate is BLOCKED until a real verifier, circuit, verifying key, and independent test vectors exist and the owner signs off.

The older `onecode-v0-6-0-dashboard.html` is unchanged.
