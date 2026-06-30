# Auth Status Panel UI/UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade login and registration account-status UI into a reusable, responsive, accessible status panel with clearer disabled and recovery feedback.

**Architecture:** Add one focused presentational component under `src/components`, then replace duplicated login/register status markup with it. Keep business logic in the existing account-status hook and page handlers.

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS, lucide-react, Vitest with server rendering for component output.

---

### Task 1: Component Contract

**Files:**
- Create: `src/components/account-status-panel.tsx`
- Test: `src/components/account-status-panel.test.tsx`

- [ ] Write tests that render the checking panel and a blocked account status with `renderToStaticMarkup`.
- [ ] Verify the tests fail because `AccountStatusPanel` does not exist.
- [ ] Implement `AccountStatusPanel` with `LoaderCircle`, `TriangleAlert`, `ArrowRight`, `role="status"`, `aria-live="polite"`, `aria-busy` for checking, and a 44 px recovery action.
- [ ] Re-run the focused component test and confirm it passes.

### Task 2: Auth Page Integration

**Files:**
- Modify: `src/app/login/page.tsx`
- Modify: `src/app/register/page.tsx`
- Modify: `src/app/login/login-account-status.test.ts`
- Modify: `src/app/register/register-account-status.test.ts`

- [ ] Extend login/register tests to require `AccountStatusPanel`, blocked submit helper text, and `aria-describedby`.
- [ ] Verify the tests fail before page integration.
- [ ] Replace duplicated inline account-status alerts on both pages with `AccountStatusPanel`.
- [ ] Add a blocked helper below each submit button and connect it with `aria-describedby`.
- [ ] Tighten auth card padding with `p-5 sm:p-8` so the status panel breathes on mobile.
- [ ] Re-run the focused auth tests and confirm they pass.

### Task 3: Verification And Stage Closure

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [ ] Run focused tests for the new component and auth page contracts.
- [ ] Run `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm run test:e2e`, `npm audit --json`, and `git diff --check`.
- [ ] Run local production Browser checks at 390 x 844 and desktop width for login/register checking and unavailable states.
- [ ] Update `.agent` logs with local evidence.
- [ ] Stage only the stage 3 files, run `git diff --cached --check`, commit, push `main`, watch GitHub Actions, check Vercel, and record remote evidence.
