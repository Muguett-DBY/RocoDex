# CSTD Project Focus Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add previous/next navigation inside the CSTD project focus panel.

**Architecture:** Keep navigation order derived from `cstdProjects`. Add a small pure helper in `cstd-project-focus`, then pass adjacent project metadata into `ProjectFocus`.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Tailwind CSS utilities.

---

### Task 1: Adjacent Project Helper

**Files:**
- Modify: `src/lib/cstd-project-focus.ts`
- Modify: `src/lib/cstd-project-focus.test.ts`

- [x] **Step 1: Write failing tests**

Add tests for first, middle, last, and unknown project IDs.

- [x] **Step 2: Verify tests fail**

Run: `npm test -- src/lib/cstd-project-focus.test.ts`

- [x] **Step 3: Implement helper**

Return nullable previous and next project summaries without wrapping.

- [x] **Step 4: Verify focused tests pass**

Run: `npm test -- src/lib/cstd-project-focus.test.ts`

### Task 2: Focus Panel Controls

**Files:**
- Modify: `src/components/cstd-landing.tsx`

- [x] **Step 1: Wire navigation state**

Compute adjacent project navigation from the selected project ID.

- [x] **Step 2: Render controls**

Add previous/next controls inside the focus side panel.

- [x] **Step 3: Preserve URL and copy state**

Use the existing focus handler so navigation updates `?project=` and clears copy feedback.

### Task 3: Verification

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [x] **Step 1: Run local gates**

Run focused tests, `npm run lint`, `npm test`, and `npm run build`.

- [x] **Step 2: Browser verify**

Verify `/cstd?project=design#project-focus` adjacent navigation, desktop/mobile overflow, and console health.

- [ ] **Step 3: Commit, push, and check CI**

Commit only Stage 2 files, push to `main`, watch GitHub Actions, and check Vercel status.
