# Residual Risk Closure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the four residual release risks with repeatable dependency, WebGL, E2E, and reversible production-registration verification.

**Architecture:** Keep product behavior unchanged except for a quieter WebGL fallback. Add repository-owned Playwright coverage, run it in CI against a local Next server, and use a separate opt-in live script that creates one unique production account and removes exactly that account in `finally` through the configured Redis REST API.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Playwright, Auth.js, Upstash Redis, GitHub Actions, Vercel.

---

### Task 1: Dependency Compatibility Policy

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/lib/toolchain-version-policy.test.ts`
- Modify if compatible: `src/lib/cstd-three-version.test.ts`

- [ ] **Step 1: Write failing policy expectations**

Update the toolchain test to require Tailwind `4.3.2`, the highest peer-compatible ESLint release, and a Node-22-aligned `@types/node` range. Test a Three.js upgrade separately before changing its compatibility pin.

- [ ] **Step 2: Verify the policy test fails**

Run: `npx vitest run src/lib/toolchain-version-policy.test.ts`

Expected: FAIL because `package.json` still contains the previous versions.

- [ ] **Step 3: Install the exact compatible versions**

Run the equivalent of:

```powershell
npm install --save-dev --save-exact @tailwindcss/postcss@4.3.2 tailwindcss@4.3.2
npm install --save-dev eslint@^9.39.4
npm install --save-dev "@types/node@^22"
```

Only change `three` and `@types/three` if focused tests, build, and browser console checks remain clean with `0.185.0`; otherwise preserve `0.182.0` as an explicit upstream-compatibility pin.

- [ ] **Step 4: Verify compatibility**

Run: `npx vitest run src/lib/toolchain-version-policy.test.ts src/lib/cstd-three-version.test.ts && npm run lint && npx tsc --noEmit && npm run build`

Expected: all commands exit `0` without new warnings.

### Task 2: Quiet WebGL Capability Fallback

**Files:**
- Modify: `src/lib/cstd-webgl.test.ts`
- Modify: `src/lib/cstd-webgl.ts`
- Modify: `src/components/cstd-custard-stage.tsx`

- [ ] **Step 1: Add failing tests for constrained contexts**

Add cases that reject automation/software-only contexts without calling `canvas.getContext`, and that pass `failIfMajorPerformanceCaveat: true` for ordinary capability probes.

- [ ] **Step 2: Verify red state**

Run: `npx vitest run src/lib/cstd-webgl.test.ts`

Expected: FAIL because the current probe always attempts an unqualified context.

- [ ] **Step 3: Implement the minimal capability contract**

Extend the narrow window type with `navigator.webdriver`, return `false` before context creation for automated browsers, and request contexts with `failIfMajorPerformanceCaveat: true` so software-only rendering uses the existing CSS fallback.

- [ ] **Step 4: Verify green state and rendered fallback**

Run: `npx vitest run src/lib/cstd-webgl.test.ts`

Expected: PASS. Then load `/cstd` in a real automated browser and require meaningful fallback content with no WebGL console warning.

### Task 3: Permanent End-to-End Coverage

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/core-flows.spec.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.github/workflows/ci.yml`
- Modify: `src/lib/github-ci-workflow.test.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Add a failing CI contract**

Require `npm run test:e2e` and Chromium installation in the workflow contract test.

- [ ] **Step 2: Verify red state**

Run: `npx vitest run src/lib/github-ci-workflow.test.ts`

Expected: FAIL because CI has no E2E steps.

- [ ] **Step 3: Add Playwright and core flows**

Install `@playwright/test`, add a Chromium project, start Next with a test-only auth secret and no Redis credentials, and cover:

```text
home -> creature directory -> creature detail
home -> CSTD project route -> mascot interaction/fallback
register unique local user -> login -> authenticated state
desktop and mobile overflow/console checks
```

The registration test must remove only its unique local test user and preserve pre-existing local data.

- [ ] **Step 4: Wire local and CI execution**

Add `test:e2e` to `package.json`; in GitHub Actions install Chromium with dependencies after `npm ci`, run lint/unit/build, and then run the E2E command.

- [ ] **Step 5: Verify E2E locally**

Run: `npx playwright install chromium` then `npm run test:e2e`.

Expected: all Chromium desktop/mobile projects pass, no test data remains, and no actionable console errors are hidden.

### Task 4: Reversible Live Registration Acceptance

**Files:**
- Create: `scripts/verify-live-registration.mts`
- Create: `scripts/verify-live-registration.test.ts`
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Add failing helper tests**

Test unique username creation, exact Redis key selection, refusal of non-HTTPS targets except localhost, and cleanup in `finally` after both success and failure.

- [ ] **Step 2: Verify red state**

Run: `npx vitest run scripts/verify-live-registration.test.ts`

Expected: FAIL because the helper does not exist.

- [ ] **Step 3: Implement the opt-in verifier**

The Node 22 type-stripped script must require a target URL and Redis REST credentials, submit one unique strong credential pair, verify the returned username/id, and delete only `user:<generated username>` in `finally`. It must never print the password or Redis token.

- [ ] **Step 4: Verify against production**

Pull Vercel production environment variables into a temporary ignored file outside the repository, run the verifier against `https://rocodex.custard.top`, confirm creation and cleanup, then securely remove the temporary environment file.

Expected: registration returns success, direct Redis lookup confirms the user existed, cleanup deletes one key, and a final lookup returns no user.

### Task 5: Full Release Closure

**Files:**
- Modify: `.agent/iteration-log.md`

- [ ] **Step 1: Run fresh local gates**

Run: `npm run ci:local`, `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run test:e2e`, `npm run build`, `npm audit --json`, and `git diff --check`.

Expected: every command exits `0`; all install scripts are reviewed; no test artifacts or users remain.

- [ ] **Step 2: Commit and push precisely on main**

Stage only reviewed files, commit without `--no-verify`, fetch/reconcile `origin/main`, and push normally.

- [ ] **Step 3: Verify CI, deployment, and live behavior**

Wait for the exact pushed SHA's GitHub Actions run and Vercel production deployment. Re-run desktop/mobile core routes, CSTD console checks, safe malformed registration requests, and the reversible live registration verifier.

- [ ] **Step 4: Record final evidence**

Append exact commands, counts, commit SHA, CI run, deployment id, live URLs, cleanup evidence, and any truly external limitation to `.agent/iteration-log.md`.
