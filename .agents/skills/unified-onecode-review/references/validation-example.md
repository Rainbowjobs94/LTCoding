# Validation example

For a project adapter exposing a public explanation route and an authenticated
review route, verify:

1. anonymous explanation returns only curated public text and route guidance;
2. packet IDs, evidence fields, identities, prompts, tokens, and decisions never
   appear in the anonymous response or logs;
3. an unauthenticated request cannot invoke review, approve, reject, activate,
   or rollback;
4. two reviewers using the same idempotency key get one result, while a stale
   revision is rejected;
5. web and mobile use the same versioned contract without sharing private data;
6. release and rollback checks report exact `PASS`, `FAIL`, or `SKIP`.

This is a validation pattern, not evidence that any project has passed it.