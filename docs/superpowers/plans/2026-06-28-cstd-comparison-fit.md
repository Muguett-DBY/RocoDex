# CSTD Comparison Fit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development and superpowers:executing-plans.

**Goal:** Explain goal-to-project fit in the existing CSTD comparison matrix and copied brief.

**Architecture:** Add a pure fit helper that consumes the selected guide and comparison projects. Pass its output to the existing matrix UI and brief formatter. Keep the existing guide mapping as the sole recommendation source.

---

### Task 1: Fit Contract

**Files:**
- Add: `src/lib/cstd-project-comparison-fit.test.ts`
- Add: `src/lib/cstd-project-comparison-fit.ts`

- [x] Add failing tests for direct, missing-direct, and no-goal comparisons.
- [x] Implement stable fit summaries and per-project labels.
- [x] Run the focused fit tests.

### Task 2: Decision Surface And Brief

**Files:**
- Modify: `src/lib/cstd-project-comparison.test.ts`
- Modify: `src/lib/cstd-project-comparison.ts`
- Modify: `src/components/cstd-landing.tsx`

- [x] Add fit evidence to the copied brief contract.
- [x] Render a separator-based decision band in the existing matrix.
- [x] Keep desktop and mobile comparison columns aligned.
- [x] Run focused fit, comparison, URL-sync, and mobile-layout tests.

### Task 3: Verification And Release

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [x] Run diff, hygiene, lint, full tests, and production build.
- [x] Verify local desktop and 390px mobile behavior.
- [ ] Commit, push, and verify Actions, Vercel, and the live custom domain.
- [ ] Record Stage 2 evidence before starting Stage 3.
