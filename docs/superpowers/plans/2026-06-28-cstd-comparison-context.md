# CSTD Comparison Context Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development and superpowers:executing-plans.

**Goal:** Add a tested comparison-context line to the existing CSTD project comparison matrix.

**Architecture:** Add a pure helper that formats the active goal and selected project titles, then pass the active goal from `CstdLanding` into `ProjectComparison`. Do not change URL state, project selection behavior, or comparison rows.

---

### Task 1: Context Contract

**Files:**
- Add: `src/lib/cstd-project-comparison-context.test.ts`
- Add: `src/lib/cstd-project-comparison-context.ts`

- [x] Add failing tests for goal-backed and manual comparison context.
- [x] Implement the helper with stable labels and project-title ordering.
- [x] Run the focused helper test.

### Task 2: Comparison Header UI

**Files:**
- Modify: `src/components/cstd-landing.tsx`

- [x] Pass the selected goal into `ProjectComparison`.
- [x] Render the tested context line in the comparison header.
- [x] Keep mobile-safe wrapping and existing comparison behavior.
- [x] Run focused comparison-context and URL-sync tests.

### Task 3: Verification And Release

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [x] Run `git diff --check` and source hygiene checks.
- [x] Run `npm run lint`, `npm test`, and `npm run build`.
- [x] Verify direct comparison deep links in Browser on desktop and 390px mobile.
- [ ] Commit with `feat: add cstd comparison context` and push `main`.
- [ ] Verify GitHub Actions, Vercel, and the live custom domain.
- [ ] Record final Stage 6 evidence and final status.
