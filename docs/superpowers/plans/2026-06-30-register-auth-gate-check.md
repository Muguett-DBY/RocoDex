# Register API Auth Gate Check Plan

**Goal:** Ensure account registration API respects the same auth availability gate as the UI.

**Architecture:** Reuse `isAuthConfigured` at the route boundary before parsing and storage operations. Add route tests with mocked storage so the disabled path proves no user lookup or creation occurs.

---

### Task 1: Route Test

**Files:**
- Add: `src/app/api/register/route.test.ts`
- Modify: `src/app/api/register/route.ts`

- [x] Add a failing test that missing auth secrets return unavailable and do not call storage.
- [x] Add a configured-auth regression test for the existing successful registration path.
- [x] Run the focused route test and confirm the disabled-auth test fails before implementation.

### Task 2: API Gate

**Files:**
- Modify: `src/app/api/register/route.ts`

- [x] Import and use `isAuthConfigured` before request parsing and storage.
- [x] Return the same account-unavailable message used by the UI.
- [x] Rerun focused and related auth tests.

### Task 3: Verification And Release

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [x] Run `npm run ci:local`, `npm run lint`, `npm test`, `npm run build`, and `npm audit --json`.
- [x] Run a local HTTP smoke for disabled `/api/register`.
- [x] Review diff hygiene and secrets.
- [x] Commit and push Stage 5 files to `origin/main`.
- [x] Confirm GitHub Actions and Vercel success.
