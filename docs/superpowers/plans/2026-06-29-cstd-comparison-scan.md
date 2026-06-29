# CSTD Comparison Scan UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the CSTD comparison decision surface easier to scan on desktop and mobile.

**Architecture:** Add a pure scan-summary helper derived from the existing comparison and fit objects. Wire the helper into the existing CSTD landing page, then use fit data to enrich the selected-project rows and header scan summary.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind utility classes, Vitest, Browser/IAB and Playwright fallback for rendered QA.

---

### Task 1: Scan Summary Contract

**Files:**
- Add: `src/lib/cstd-project-comparison-scan.test.ts`
- Add: `src/lib/cstd-project-comparison-scan.ts`

- [x] Add failing tests for direct-fit, no-goal, and missing-direct scan summaries.
- [x] Implement stable scan summary items with text labels and non-color-only tones.
- [x] Run focused scan-summary tests.

### Task 2: Comparison Surface UI

**Files:**
- Modify: `src/components/cstd-landing-url-sync.test.ts`
- Modify: `src/components/cstd-landing.tsx`

- [x] Add source-contract tests for helper wiring, `aria-label="对比扫读摘要"`, and `fitItemsByProjectId`.
- [x] Render the scan summary below the comparison context line.
- [x] Make selected project rows display their fit labels and keep remove buttons stable.
- [x] Run focused scan, URL-sync, fit, comparison, and mobile-layout tests.

### Task 3: Verification And Release

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [x] Run diff, hygiene, lint, full tests, and production build.
- [x] Verify local desktop and 390 px mobile rendered comparison behavior.
- [x] Commit, push, and verify Actions, Vercel, and the live custom domain.
- [x] Record Stage 3 evidence before starting Stage 4.
