# Account Recovery Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a second no-account recovery action to the shared account outage panel.

**Architecture:** Modify only `AccountStatusPanel` and its tests. All pages that already consume the panel inherit the improvement.

**Tech Stack:** React component, Next.js `Link`, Tailwind CSS, Vitest server-rendered component test.

---

### Task 1: Red Test

**Files:**
- Modify: `src/components/account-status-panel.test.tsx`
- Modify: `src/components/account-status-panel.tsx`

- [x] Extend the blocked-state test to require `href="/creatures"`, label `继续查精灵`, and responsive `grid gap-2 sm:flex` action layout.
- [x] Run the focused test and confirm it fails before implementation.
- [x] Add the secondary action with `min-h-11`, secondary border styling, and accessible focus state.
- [x] Re-run the focused test and confirm it passes.

### Task 2: Verification And Closure

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [x] Run full local gates: lint, typecheck, test, build, E2E, audit, diff check.
- [x] Browser-check login and homepage outage panels locally or on production after deploy.
- [x] Update logs, commit, push `main`, check CI/Vercel, and record final evidence.
