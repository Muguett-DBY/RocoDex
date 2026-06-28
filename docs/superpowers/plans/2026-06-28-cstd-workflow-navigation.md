# CSTD Workflow Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the CSTD project workflow summary into safe in-page navigation with one contextual next-step action.

**Architecture:** Extend the existing pure workflow helper with stable anchor targets and a derived action, then connect those contracts to semantic links and existing project surfaces in `CstdLanding`. Keep URL-backed goal and comparison state unchanged.

**Tech Stack:** Next.js client component, TypeScript, Tailwind CSS, Lucide icons, Vitest, in-app Browser verification.

---

### Task 1: Navigation Contracts

**Files:**
- Modify: `src/lib/cstd-project-workflow-summary.test.ts`
- Modify: `src/lib/cstd-project-workflow-summary.ts`

- [x] Add failing assertions that every summary item has the expected safe `href`.
- [x] Add failing tests for no-goal, incomplete-comparison, and ready-comparison actions.
- [x] Run `npm test -- src/lib/cstd-project-workflow-summary.test.ts` and confirm the missing contracts fail.
- [x] Add `href` to `CstdProjectWorkflowSummaryItem` and implement `getCstdProjectWorkflowAction` with the tested state branches.
- [x] Re-run the focused test and confirm it passes.

### Task 2: Actionable Summary UI

**Files:**
- Modify: `src/components/cstd-landing.tsx`
- Modify: `src/lib/cstd-mobile-layout.ts`
- Modify: `src/lib/cstd-mobile-layout.test.ts`

- [x] Add a failing responsive contract test for the summary grid without outer spacing ownership.
- [x] Derive the contextual action from the existing selected goal and normalized comparison count.
- [x] Render semantic item links and one next-step link with Lucide icons and visible focus states.
- [x] Add stable IDs and scroll margins to the guide, evidence, comparison, and directory surfaces.
- [x] Run focused workflow and mobile-layout tests.

### Task 3: Verification And Release

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [x] Run `npm run lint`, `npm test`, and `npm run build`.
- [x] Run `git diff --check` and source hygiene checks.
- [x] Verify all four summary destinations and the contextual action in Browser on desktop and 390px mobile.
- [ ] Commit with `feat: add cstd workflow navigation` and push `main`.
- [ ] Verify GitHub Actions, Vercel, and the live custom domain.
- [ ] Record Stage 4 evidence and next direction.
