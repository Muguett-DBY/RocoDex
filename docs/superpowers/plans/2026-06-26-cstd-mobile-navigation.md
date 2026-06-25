# CSTD Mobile Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the space-heavy CSTD mobile navigation grid with an accessible collapsible project menu.

**Architecture:** Extract navigation metadata and button state into a pure helper. Reuse one link renderer for desktop and mobile while keeping open state local to the landing component.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Tailwind CSS, Lucide

---

### Task 1: Define navigation metadata

**Files:**
- Create: `src/lib/cstd-navigation.test.ts`
- Create: `src/lib/cstd-navigation.ts`

- [ ] Write tests for the six destinations and open/closed toggle labels.
- [ ] Run `npm test -- src/lib/cstd-navigation.test.ts` and confirm it fails because the module does not exist.
- [ ] Implement `cstdNavigationItems` and `getCstdMobileNavigationToggleState`.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: Build the responsive header

**Files:**
- Modify: `src/components/cstd-landing.tsx`
- Modify: `src/lib/cstd-mobile-layout.ts`
- Modify: `src/lib/cstd-mobile-layout.test.ts`

- [ ] Add local mobile menu state and shared navigation link rendering.
- [ ] Add the accessible icon toggle and collapsible mobile panel.
- [ ] Make the header sticky with a restrained translucent surface.
- [ ] Hide the permanent desktop navigation below `sm`.
- [ ] Close the panel when a destination is selected.

### Task 3: Validate and release

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [ ] Run focused tests, lint, full tests, and production build.
- [ ] Verify 390 px collapsed/open states, desktop navigation, overflow, screenshots, and console health.
- [ ] Inspect status and diffs, commit with `feat: upgrade personal homepage navigation`, and push `main`.
- [ ] Check GitHub Actions and Vercel, then record the result.
