# Auth Storage Outage Check Design

## Finding

The register and account-status routes handle known storage outages with controlled responses, but the credentials login path still calls `findUserByUsername` directly from `authorize`. A direct credentials auth request can bypass the client-side account-status preflight and surface a Redis/network failure as an auth server error.

## Priority

P1. The UI prevents normal users from submitting while storage is unavailable, but API-level or stale-client login attempts should still fail safely without polluting error logs or creating a server error experience.

## Fix

- Catch known storage-unavailable errors inside the credentials `authorize` callback.
- Log the known outage as `console.warn`, matching register and account-status behavior.
- Return `null` for credentials authorization so Auth.js treats the attempt as an unsuccessful sign-in rather than an unhandled server exception.
- Re-throw unknown errors so unrelated bugs are not hidden.

## Verification

- Add an auth configuration test that captures the credentials `authorize` callback and verifies known storage errors return `null` with a warning.
- Verify unknown storage errors still reject.
- Run focused auth tests plus full lint, typecheck, test, build, E2E, audit, diff check, and smoke the live login outage state after deploy.
