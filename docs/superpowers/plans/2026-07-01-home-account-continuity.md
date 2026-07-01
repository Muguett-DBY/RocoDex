# Home Account Continuity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a homepage account-continuity notice that appears only when account service status is blocked and points visitors to local collection recovery.

**Architecture:** Add one focused client component under `src/components` and mount it in the homepage hero. Reuse the existing account-status hook and panel; do not add new dependencies or new backend routes.

**Tech Stack:** Next.js App Router, React client component, Tailwind CSS, Vitest source-contract tests.

---

### Task 1: Homepage Continuity Contract

**Files:**
- Create: `src/components/home-account-continuity.tsx`
- Test: `src/components/home-account-continuity.test.ts`
- Modify: `src/app/page.tsx`

- [ ] Write a failing source-contract test requiring `HomeAccountContinuity` to use `useAccountServiceStatus`, suppress loading/ready states, and render `AccountStatusPanel` for blocked states.
- [ ] Write a failing source-contract test requiring `src/app/page.tsx` to mount `HomeAccountContinuity` below `HomeSearch`.
- [ ] Run the focused tests and confirm they fail because the component/page integration is missing.
- [ ] Implement `HomeAccountContinuity` as a small client component.
- [ ] Mount `HomeAccountContinuity` in the homepage hero below the search area.
- [ ] Re-run the focused tests and confirm they pass.

### Task 2: Verification And Stage Closure

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [ ] Run `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm run test:e2e`, `npm audit --json`, and `git diff --check`.
- [ ] Run local production Browser checks at 390 x 844 and 1440 x 900 for homepage outage visibility and `/collection` click-through.
- [ ] Update `.agent` logs with local evidence.
- [ ] Stage only stage 4 files, run `git diff --cached --check`, commit, push `main`, watch GitHub Actions, check Vercel, and record remote evidence.
