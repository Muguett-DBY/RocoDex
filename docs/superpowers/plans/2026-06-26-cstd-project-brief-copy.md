# CSTD Project Brief Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a copyable evidence-based project brief to the CSTD project focus panel.

**Architecture:** Add a pure brief builder in `cstd-project-focus`, then wire a second copy action in `CstdLanding` using the existing clipboard result model.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Tailwind CSS utilities.

---

### Task 1: Brief Builder

**Files:**
- Modify: `src/lib/cstd-project-focus.ts`
- Modify: `src/lib/cstd-project-focus.test.ts`

- [x] **Step 1: Write failing tests**

Add a test for the plain-text brief format.

- [x] **Step 2: Verify tests fail**

Run: `npm test -- src/lib/cstd-project-focus.test.ts`

- [x] **Step 3: Implement helper**

Build the brief from title, current state, role, problem, outcome, and href.

- [x] **Step 4: Verify focused tests pass**

Run: `npm test -- src/lib/cstd-project-focus.test.ts`

### Task 2: Focus Panel Copy Action

**Files:**
- Modify: `src/components/cstd-landing.tsx`

- [x] **Step 1: Add brief copy state**

Track copy result independently from focus-link copy state.

- [x] **Step 2: Render copy action**

Add `复制案例摘要` to the focus action panel with result feedback.

- [x] **Step 3: Clear stale feedback**

Clear brief-copy feedback when project focus changes or closes.

### Task 3: Verification

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [x] **Step 1: Run local gates**

Run focused tests, `npm run lint`, `npm test`, and `npm run build`.

- [x] **Step 2: Browser verify**

Verify focus panel brief copy feedback, desktop/mobile overflow, and console health.

- [x] **Step 3: Commit, push, and check CI**

Commit only Stage 4 files, push to `main`, watch GitHub Actions, and check Vercel status.
