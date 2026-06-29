# CSTD Restored Comparison Receipt Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a compact restored-link receipt to the existing CSTD comparison header.

**Architecture:** Extend the existing `cstd-project-comparison-context` helper so the visible receipt is a pure, tested model. Track whether the current view state came from URL synchronization inside `CstdLanding`, then pass that boolean into `ProjectComparison`.

**Tech Stack:** Next.js App Router, React client component state, Vitest, Tailwind utility classes.

---

### Task 1: Context Model

**Files:**
- Modify: `src/lib/cstd-project-comparison-context.ts`
- Test: `src/lib/cstd-project-comparison-context.test.ts`

- [ ] Write failing tests requiring a `receipt` field for restored URL comparisons and `null` for manual comparisons.
- [ ] Run `npm test -- src/lib/cstd-project-comparison-context.test.ts` and confirm the tests fail against the old model.
- [ ] Add `restoredFromUrl?: boolean` to the helper input.
- [ ] Return `receipt: null` when `restoredFromUrl` is false or no projects are selected.
- [ ] Return `receipt.label` and `receipt.detail` when restored state has selected projects.
- [ ] Rerun the focused context tests.

### Task 2: Landing Integration

**Files:**
- Modify: `src/components/cstd-landing.tsx`
- Test: `src/components/cstd-landing-url-sync.test.ts`

- [ ] Write a source-contract test requiring `projectViewStateRestoredFromUrl`, the URL-state helper assignment, and the `分享视图恢复状态` aria label.
- [ ] Run focused tests and confirm the source-contract test fails.
- [ ] Add `projectViewStateRestoredFromUrl` state to `CstdLanding`.
- [ ] Set it during URL sync with `hasActiveCstdProjectViewState(window.location.search)`.
- [ ] Pass it to `ProjectComparison` as `restoredFromUrl`.
- [ ] Render `context.receipt` inside the comparison header with mobile-safe wrapping.
- [ ] Rerun focused and related tests.

### Task 3: Verification And Closure

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify after remote verification: `.agent/iteration-log.md`

- [ ] Run `git diff --check`.
- [ ] Run source hygiene scans for debug statements, temporary markers, and obvious secret patterns.
- [ ] Run `npm run lint`.
- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Restart local production server and verify the receipt on desktop and 390 px mobile direct comparison links.
- [ ] Verify a plain `/cstd` first visit does not show the receipt before the user builds state.
- [ ] Commit and push to `origin/main`.
- [ ] Check GitHub Actions and Vercel.
- [ ] Verify the live custom domain on desktop and mobile.
- [ ] Update `.agent/orchestrator-log.md` and `.agent/iteration-log.md` with final evidence.
