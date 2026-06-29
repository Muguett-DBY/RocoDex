# CSTD Comparison Next Step Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the CSTD comparison decision into a goal-aligned next action while preserving comparison URL state.

**Architecture:** Add a pure next-step and alignment helper, memoize it in the existing landing component, and render one responsive action band in the comparison surface. Reuse existing focus, guide, live-link, and URL-state APIs.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind utility classes, Vitest, Browser/IAB, Edge Playwright fallback.

---

### Task 1: Next-Step Decision Contract

**Files:**
- Create: `src/lib/cstd-project-comparison-next-step.test.ts`
- Create: `src/lib/cstd-project-comparison-next-step.ts`

- [x] Write failing tests for selected direct project, missing direct project, no goal, missing target, and idempotent two-project alignment.
- [x] Run `npx vitest run src/lib/cstd-project-comparison-next-step.test.ts` and confirm the missing-module red state.
- [x] Implement `getCstdProjectComparisonNextStep` with `focus`, `align`, and `select-goal` return states.
- [x] Implement `alignCstdProjectComparisonIds` so the direct target is first, one reference is retained, and the existing limit is respected.
- [x] Rerun the focused test and confirm all cases pass.

### Task 2: Comparison Action Band And URL Repair

**Files:**
- Modify: `src/components/cstd-landing-url-sync.test.ts`
- Modify: `src/components/cstd-landing.tsx`

- [x] Add failing source-contract assertions for next-step memoization, `aria-label="对比下一步"`, focus/alignment handlers, and the preserved comparison hash.
- [x] Run the focused source test and confirm the new contract fails.
- [x] Memoize the next-step model and pass it to `ProjectComparison`.
- [x] Add comparison-local handlers that align or remove projects with `#project-comparison` while projects remain.
- [x] Render responsive primary and secondary actions between goal fit and evidence rows.
- [x] Run next-step, URL-state, fit, scan, comparison, and mobile-layout tests.

### Task 3: Verification And Release

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [x] Run diff, hygiene, lint, full tests, and production build.
- [x] Verify local desktop and 390 x 844 mobile alignment, focus, link, overflow, and console behavior.
- [x] Commit `feat: add cstd comparison next actions`, push `main`, and verify GitHub Actions, Vercel, and the live custom domain.
- [x] Record Stage 4 evidence and the Stage 5 CHECK handoff.
