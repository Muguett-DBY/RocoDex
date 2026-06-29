# Register API Auth Gate Check Design

## Goal

Close the disabled-auth API boundary so account registration is consistently unavailable when the deployment has no Auth.js secret configured.

## Findings

- P1: `/login` and `/register` are hidden behind `isAuthConfigured`, but `/api/register` can still parse credentials and touch user storage when auth is disabled.
- P2: There is no route-level test covering the disabled-auth registration path.

## Behavior

- If neither `AUTH_SECRET` nor `NEXTAUTH_SECRET` is configured, `POST /api/register` returns a clear unavailable response and does not call user lookup or creation.
- If auth is configured, the existing username/password validation, duplicate detection, hashing, and response shape stay unchanged.

## Constraints

- Do not add a dependency or change the public login/register UI.
- Do not alter Redis/local user storage semantics when auth is configured.
- Keep the fix small and covered by automated tests.

## Verification

- Route tests for disabled and configured auth paths.
- CI-equivalent local validation: `npm ci`, lint, test, build.
- HTTP smoke for disabled-auth local API behavior.
