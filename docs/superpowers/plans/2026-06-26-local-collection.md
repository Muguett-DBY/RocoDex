# Local Collection Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persistent local creature collection connected to comparison while removing current theme hydration and missing-auth runtime errors.

**Architecture:** Store a versioned list of creature IDs in localStorage behind pure parsing helpers and a client hook. Keep dataset ownership in existing modules, add focused client controls to server-rendered pages, and gate auth UI from server configuration.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, Vitest.

---

### Task 1: Pure collection and configuration behavior

**Files:**
- Create: `src/lib/creature-collection.test.ts`
- Create: `src/lib/creature-collection.ts`
- Create: `src/lib/theme-preference.test.ts`
- Create: `src/lib/theme-preference.ts`
- Create: `src/lib/auth-availability.test.ts`
- Create: `src/lib/auth-availability.ts`
- Modify: `src/lib/player-tools.test.ts`
- Modify: `src/lib/creature-compare.ts`

- [x] Write failing tests for malformed storage, duplicate IDs, toggling, compare URLs, theme preference, auth configuration, and validated comparison query IDs.
- [x] Run focused tests and confirm failures are caused by missing behavior.
- [x] Implement the minimal pure helpers.
- [x] Re-run focused tests and confirm they pass.

### Task 2: Collection storage and controls

**Files:**
- Create: `src/hooks/use-creature-collection.ts`
- Create: `src/components/collection-button.tsx`
- Create: `src/components/collection-nav-link.tsx`
- Modify: `src/components/creature-card.tsx`
- Modify: `src/app/creatures/[id]/page.tsx`

- [x] Implement a hydration-safe client hook with versioned localStorage and storage-event synchronization.
- [x] Add accessible save/remove controls without nesting a button inside a link.
- [x] Add the collection control to creature details.

### Task 3: Collection workspace and comparison handoff

**Files:**
- Create: `src/app/collection/page.tsx`
- Create: `src/components/collection-workspace.tsx`
- Modify: `src/app/compare/page.tsx`
- Modify: `src/components/creature-compare-tool.tsx`

- [x] Build loading, empty, populated, and stale-entry states.
- [x] Allow selecting two to four saved creatures for comparison.
- [x] Preload the comparison tool from validated query IDs.

### Task 4: Runtime stability and navigation

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/components/auth-provider.tsx`
- Modify: `src/components/page-shell.tsx`
- Modify: `src/components/site-header.tsx`
- Modify: `src/components/theme-toggle.tsx`
- Create: `src/components/auth-unavailable.tsx`
- Create: `src/app/login/layout.tsx`
- Create: `src/app/register/layout.tsx`

- [x] Gate auth provider and controls from server-side secret availability.
- [x] Show a useful auth-unavailable state when auth is not configured.
- [x] Make theme toggle initial markup deterministic and apply preference after mount.
- [x] Add collection navigation.

### Task 5: Stage verification and delivery

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Create or modify: `.agent/iteration-log.md`
- Modify: `README.md`

- [x] Run `npm run lint`.
- [x] Run `npm test`.
- [x] Run `npm run build`.
- [x] Verify collection save/remove, persistence, compare handoff, desktop/mobile layout, and clean console in Browser/IAB.
- [x] Review `git status`, `git diff`, and staged diff for unrelated changes, secrets, and temporary code.
- [ ] Commit with a focused IMPROVE message, push `main`, inspect GitHub Actions/Pages, and record the result.
