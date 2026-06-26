# CSTD Project Controls UIUX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the responsive information architecture of the CSTD project directory controls.

**Architecture:** Add pure helper state in `cstd-project-filter`, then render a compact status/reset strip inside the existing project index panel.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Tailwind CSS utilities.

---

### Task 1: Control Summary Helper

**Files:**
- Modify: `src/lib/cstd-project-filter.ts`
- Modify: `src/lib/cstd-project-filter.test.ts`

- [x] **Step 1: Write failing tests**

Add tests for default, category-only, search-only, combined, and reset-active detection states.

- [x] **Step 2: Verify tests fail**

Run: `npm test -- src/lib/cstd-project-filter.test.ts`

- [x] **Step 3: Implement helper**

Return a concise user-facing control summary and active-control boolean.

- [x] **Step 4: Verify focused tests pass**

Run: `npm test -- src/lib/cstd-project-filter.test.ts`

### Task 2: Responsive Control Strip

**Files:**
- Modify: `src/components/cstd-landing.tsx`

- [x] **Step 1: Compute control state**

Use the helper output in `CstdLanding`.

- [x] **Step 2: Render status strip**

Show current controls and reset action above search/filter inputs.

- [x] **Step 3: Reset both controls**

Reset search query and category filter from one command.

### Task 3: Verification

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [x] **Step 1: Run local gates**

Run focused tests, `npm run lint`, `npm test`, and `npm run build`.

- [x] **Step 2: Browser verify**

Verify category/search summaries, reset behavior, desktop/mobile overflow, and console health.

- [ ] **Step 3: Commit, push, and check CI**

Commit only Stage 3 files, push to `main`, watch GitHub Actions, and check Vercel status.
