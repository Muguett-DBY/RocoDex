# CSTD Project-First Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the main CSTD homepage take visitors from the hero directly to real project work while preserving restored goal and comparison journeys.

**Architecture:** Reuse the existing `#project-directory`, project cards, and URL-state model. Introduce one local context predicate in `CstdLanding` to choose between the default project-first order and the existing restored decision-first order; no new route, state model, dependency, or visual system is required.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Framer Motion, Vitest, Playwright.

## Global Constraints

- Scope is the personal main site at `custard.top` / `/cstd`, not the RocoDex encyclopedia pages.
- Preserve all existing project filter, focus, comparison, copy, motion, audio, and external-link behavior.
- Keep valid goal-share URLs on their existing `goal` plus `#projects` contract.
- Use the existing CSTD visual system and project data; add no dependency or route.
- Verify desktop and 390 x 844 mobile behavior with zero horizontal overflow and zero console warnings or errors.

---

### Task 1: Lock The Project-First Journey With Browser Tests

**Files:**
- Modify: `e2e/core-flows.spec.ts`

**Interfaces:**
- Consumes: existing `/cstd`, `#project-directory`, `#project-guide`, and semantic project-card markup.
- Produces: regression coverage for default project discovery and restored decision context.

- [ ] **Step 1: Write the failing project-entry test**

Add a Playwright test that dismisses the intro, asserts `看项目` targets `#project-directory`, confirms maintainer-only labels are absent, activates the link, and verifies the first `洛克图鉴 / RocoDex` article intersects the viewport while `#project-directory` precedes `#project-guide` in default DOM order.

- [ ] **Step 2: Write the failing restored-context test**

Open `/cstd?goal=portrait-shooting#projects`, dismiss the intro, assert the restored goal receipt is visible, and verify `#project-guide` precedes `#project-directory`.

- [ ] **Step 3: Run the focused tests and verify RED**

Run: `npm run test:e2e -- --grep "CSTD project discovery"`

Expected: FAIL because the current hero link is `#projects`, maintainer panels are present, and the default directory follows the guide.

### Task 2: Reorder The Visitor Journey

**Files:**
- Modify: `src/components/cstd-landing.tsx`
- Modify: `src/lib/cstd-navigation.ts`
- Modify: `src/lib/cstd-navigation.test.ts`
- Delete: `src/lib/cstd-homepage-updates.ts`
- Delete: `src/lib/cstd-homepage-updates.test.ts`

**Interfaces:**
- Consumes: `selectedGuide`, `projectComparison.projects`, `ProjectWorkflowSummary`, `ProjectGuide`, `ProjectComparison`, `#project-directory`, and the existing project-card grid.
- Produces: `hasProjectDecisionContext: boolean`, default directory-first rendering, and direct project-navigation anchors.

- [ ] **Step 1: Update the navigation contract test**

Change the expected `Projects` href in `src/lib/cstd-navigation.test.ts` from `#projects` to `#project-directory`, then run `npm test -- src/lib/cstd-navigation.test.ts` and confirm it fails against the old navigation data.

- [ ] **Step 2: Implement the minimal navigation and hero change**

Set the `Projects` item and `看项目` button href to `#project-directory`. Remove the homepage-update imports, summaries, and hero panel markup.

- [ ] **Step 3: Implement context-aware project ordering**

Set `hasProjectDecisionContext` when a selected goal or one or more comparison projects exist. Render workflow, guide, and comparison before the directory only for that context; otherwise render the directory and project cards first, then the decision-support panels. Keep capability and evidence panels after the project cards.

- [ ] **Step 4: Remove dead maintainer-only homepage data**

Delete `src/lib/cstd-homepage-updates.ts` and its unit test after confirming `rg -n "cstdHomepage" src` returns no references.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `npm test -- src/lib/cstd-navigation.test.ts`

Run: `npm run test:e2e -- --grep "CSTD project discovery"`

Expected: the unit test and both desktop/mobile browser projects pass with clean console capture.

### Task 3: Verify, Release, And Validate Production

**Files:**
- Modify: `.agent/iteration-log.md`
- Modify: `.agent/orchestrator-log.md`

**Interfaces:**
- Consumes: the completed implementation and repository release workflow.
- Produces: local and production evidence tied to the released commit.

- [ ] **Step 1: Run all local gates**

Run `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm audit --json`, `git diff --check`, `npm run build`, and `npm run test:e2e`. Every command must exit `0`; the audit must report zero vulnerabilities.

- [ ] **Step 2: Verify the local production UI**

Start `npm run start` on an unused port, then use the chosen browser at desktop and 390 x 844 mobile sizes. Verify the project jump, default/restored ordering, no maintainer labels, no overlap, no horizontal overflow, and no console warnings/errors; capture matching screenshots.

- [ ] **Step 3: Record evidence and commit intentionally**

Append the implementation and verification evidence to both agent logs. Stage only the files from this plan and commit with `fix: prioritize cstd project discovery`.

- [ ] **Step 4: Push and close the remote release loop**

Push `main`, wait for the matching GitHub Actions run and Vercel production deployment, then verify `https://custard.top/` and `https://custard.top/cstd` by HTTP and browser at desktop/mobile sizes. Record the final remote evidence in a follow-up log commit and push it after its own local diff checks.

