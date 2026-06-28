# CSTD Comparison URL State Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make CSTD project comparison shareable, refresh-safe, and connected to goal recommendations.

**Architecture:** Extend the existing `CstdProjectViewState` helper instead of creating a second URL model. Normalize live comparison IDs in the comparison helper, then make the landing component preserve that state across all project-directory actions.

**Tech Stack:** Next.js App Router, React client component state, TypeScript helpers, Vitest, in-app Browser verification.

---

### Task 1: Comparison State Helpers

**Files:**
- Modify: `src/lib/cstd-project-comparison.ts`
- Modify: `src/lib/cstd-project-comparison.test.ts`
- Modify: `src/lib/cstd-project-view-state.ts`
- Modify: `src/lib/cstd-project-view-state.test.ts`

- [x] Add failing tests for normalized live comparison IDs and URL parse/build behavior.
- [x] Add `normalizeCstdProjectComparisonIds`.
- [x] Add `compareProjectIds` to `CstdProjectViewState`.
- [x] Parse and serialize the `compare` URL parameter.
- [x] Run focused tests for comparison and view-state helpers.

### Task 2: CSTD Landing Integration

**Files:**
- Modify: `src/components/cstd-landing.tsx`

- [x] Initialize comparison state from the URL and sync it on `popstate`.
- [x] Preserve comparison IDs in project focus, focus close, filter/search, goal select, and copy-current-view actions.
- [x] Update comparison toggles and clear/remove actions through URL history.
- [x] Add a recommendation-panel comparison button for the matched project.

### Task 3: Verification, Logging, And Release

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [x] Run `npm run lint`.
- [x] Run `npm test`.
- [x] Run `npm run build`.
- [x] Run local production Browser verification for desktop and 390px mobile.
- [x] Review `git diff`, `git diff --check`, and source hygiene.
- [x] Commit, push `main`, and verify GitHub Actions plus Vercel.
- [x] Update iteration and orchestrator logs with Stage 2 evidence.
