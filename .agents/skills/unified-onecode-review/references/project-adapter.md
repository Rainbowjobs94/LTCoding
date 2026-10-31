# Project adapter contract

An adapter is project-owned glue, not part of this portable skill. It MUST
provide and document current:

- authority owner and scoped roles; review and rollback routes;
- packet/evidence tables or equivalent stores and non-public fields;
- authentication, session, CSRF/nonce, tenant isolation, and audit behavior;
- public branding and anonymous explanation routes;
- secret names, provider boundaries, redaction, and rotation ownership;
- private-evidence storage/access policy and retention/deletion;
- web/mobile route mappings and compatibility/version rules;
- focused tests, typecheck, release approval, deployment, and rollback commands.

It must not put private identities, secret values, or hardcoded LT permissions
in this skill. Missing adapter data is `BLOCKED`, never an invitation to guess.