# CSTD Project Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add searchable project discovery to the CSTD homepage.

**Architecture:** Extend the existing `cstd-project-filter` helper so category and query filtering share one path. Keep UI state local to `CstdLanding` and reuse the existing project grid and empty-state patterns.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Tailwind CSS utilities.

---

### Task 1: Searchable Project Filter

**Files:**
- Modify: `src/lib/cstd-project-filter.ts`
- Modify: `src/lib/cstd-project-filter.test.ts`

- [x] **Step 1: Write failing tests**

Add tests proving search checks description and tags, composes with category filters, and returns empty-state summary text.

- [x] **Step 2: Verify tests fail**

Run: `npm test -- src/lib/cstd-project-filter.test.ts`
Expected: failure because `filterCstdProjects` ignores the third query argument.

- [x] **Step 3: Implement search**

Add an optional `query` parameter, normalize whitespace and case, and search title, kicker, description, tags, metrics, and evidence.

- [x] **Step 4: Verify tests pass**

Run: `npm test -- src/lib/cstd-project-filter.test.ts`
Expected: all tests pass.

### Task 2: Homepage Search UI

**Files:**
- Modify: `src/components/cstd-landing.tsx`

- [x] **Step 1: Add local search state**

Add `projectSearchQuery` state and pass it into `filterCstdProjects` and `getCstdProjectFilterSummary`.

- [x] **Step 2: Render search input**

Add a search input inside the project index panel with a clear button.

- [x] **Step 3: Render no-result recovery**

When `visibleProjects.length === 0`, show a resettable empty state instead of a blank grid.

### Task 3: Verification

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [x] **Step 1: Run local gates**

Run focused tests, `npm run lint`, `npm test`, and `npm run build`.

- [x] **Step 2: Browser verify**

Verify `/cstd` search, empty-state reset, desktop/mobile overflow, and console health.

- [x] **Step 3: Commit, push, and check CI**

Commit only Stage 1 files, push to `main`, watch GitHub Actions, and check Vercel status.
