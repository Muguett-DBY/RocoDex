# CSTD Shareable Project Focus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a shareable inline case-study focus state to the CSTD project directory.

**Architecture:** Keep URL parsing/building and clipboard result normalization in a pure helper. Keep browser history, selection, scrolling, and feedback in the landing component.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Tailwind CSS, Lucide

---

### Task 1: Define focus URL behavior

**Files:**
- Create: `src/lib/cstd-project-focus.test.ts`
- Create: `src/lib/cstd-project-focus.ts`

- [ ] Test valid/invalid project query parsing.
- [ ] Test focus and directory URL construction for `/` and `/cstd`.
- [ ] Test copied, unsupported, and failed clipboard outcomes.
- [ ] Run the focused test and confirm the helper module is missing.
- [ ] Implement the minimal helper and re-run the test.

### Task 2: Add focus interactions

**Files:**
- Modify: `src/components/cstd-landing.tsx`

- [ ] Initialize selection from the current URL after mount.
- [ ] Add `查看案例` to every card.
- [ ] Render a selected project focus section above the grid.
- [ ] Update history and scroll when selection changes.
- [ ] Add copy feedback and a close action.

### Task 3: Validate and release

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [ ] Run lint, all tests, and production build.
- [ ] Verify selection, deep-link reload, copy, close, desktop/mobile layout, and console health.
- [ ] Inspect diffs, commit with `feat: add shareable project case studies`, push `main`, and check remote deployment status.
