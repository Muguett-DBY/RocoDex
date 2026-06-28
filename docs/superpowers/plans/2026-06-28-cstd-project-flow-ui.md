# CSTD Project Flow UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce scanning cost in the CSTD project section by adding a compact decision summary and moving the active comparison surface closer to goal matching.

**Architecture:** Add a pure summary helper for testable UI copy, export one responsive layout class, then render a small unframed summary component in `CstdLanding`.

**Tech Stack:** Next.js client component, TypeScript helper, Tailwind class contracts, Vitest, in-app Browser verification.

---

### Task 1: Summary Helper And Layout Contract

**Files:**
- Create: `src/lib/cstd-project-workflow-summary.ts`
- Create: `src/lib/cstd-project-workflow-summary.test.ts`
- Modify: `src/lib/cstd-mobile-layout.ts`
- Modify: `src/lib/cstd-mobile-layout.test.ts`

- [x] Add failing tests for project workflow summary items.
- [x] Add failing tests for responsive project workflow summary layout.
- [x] Implement the summary helper.
- [x] Export the responsive layout class.
- [x] Run focused tests.

### Task 2: Project Section UI

**Files:**
- Modify: `src/components/cstd-landing.tsx`

- [x] Render the project workflow summary below the project heading.
- [x] Move the active comparison panel directly after the goal guide.
- [x] Keep comparison clear/remove and card toggles unchanged.
- [x] Verify desktop and mobile layout in Browser.

### Task 3: Verification And Release

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [x] Run `npm run lint`.
- [x] Run `npm test`.
- [x] Run `npm run build`.
- [x] Run local production Browser verification for desktop and 390px mobile.
- [x] Review `git diff`, `git diff --check`, and source hygiene.
- [x] Commit, push `main`, and verify GitHub Actions plus Vercel.
- [x] Update Stage 3 evidence in the logs.
