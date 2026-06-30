# Account Status Preflight Plan

## Goal

Reduce the remaining account-storage risk by making the register flow diagnose account service availability before users submit credentials.

## Tasks

1. Add failing tests.
   - Account status model covers ready, auth-disabled, and storage-unavailable states.
   - Account status API verifies ready, auth-disabled, and storage-unavailable responses without writing storage or generating failed browser resources.
   - Register page source contract requires `/api/account-status`, status notice rendering, and blocked-submit handling.

2. Implement the status layer.
   - Add a pure account status helper.
   - Add a read-only `/api/account-status` route.
   - Keep storage failures downgraded to warning-level logs.

3. Wire the register page.
   - Fetch the status after mount.
   - Show a visible status callout for disabled/unavailable states.
   - Disable submit when the status is blocked.

4. Verify Stage 1.
   - Focused tests for account status and register source wiring.
   - Related auth/register tests.
   - `git diff --check`, lint, full tests, production build, and E2E.
   - Local rendered register page smoke with an unavailable status response.

5. Close Stage 1.
   - Review diff.
   - Commit and push to `origin/main`.
   - Check GitHub Actions and Vercel.
   - Update `.agent/orchestrator-log.md` and `.agent/iteration-log.md`.
