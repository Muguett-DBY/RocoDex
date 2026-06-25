# Mobile Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the primary header usable on mobile by replacing always-visible wrapped navigation with an accessible collapsible menu while preserving desktop navigation.

**Architecture:** Store nav metadata and menu label behavior in a pure helper. Keep visual rendering in `SiteHeader`, and make `CollectionNavLink` styleable for desktop and mobile contexts.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, Vitest.

---

### Task 1: Testable navigation metadata

**Files:**
- Create: `src/lib/site-navigation.test.ts`
- Create: `src/lib/site-navigation.ts`

- [x] Write tests that assert nav hrefs are unique, core labels exist, and `getMobileNavigationToggleState(false/true)` returns the expected label and `expanded` state.
- [x] Run `npx vitest run src/lib/site-navigation.test.ts` and confirm RED because the helper does not exist.
- [x] Implement `siteNavigationItems` and `getMobileNavigationToggleState`.
- [x] Re-run focused test and confirm GREEN.

### Task 2: Responsive header implementation

**Files:**
- Modify: `src/components/site-header.tsx`
- Modify: `src/components/collection-nav-link.tsx`

- [x] Import `siteNavigationItems` from the helper.
- [x] Keep desktop nav hidden below `md` and visible at `md+`.
- [x] Add mobile controls with `ThemeToggle` and a menu button.
- [x] Render a mobile menu panel only when open.
- [x] Add optional `className` and `onClick` props to `CollectionNavLink`.
- [x] Close the mobile menu when a primary nav item is clicked.

### Task 3: Documentation and logs

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [x] Record Stage 3 scope, local gates, browser screenshot/check, commit, push, and remote status.

### Task 4: Stage verification and delivery

- [x] Run `npm run lint`.
- [x] Run `npm test`.
- [x] Run `npm run build`.
- [x] Verify mobile collapsed/open header in Browser/IAB and capture a screenshot.
- [x] Review diff/staged diff/secret scan.
- [ ] Commit Stage 3, push `main`, inspect GitHub Actions/checks/Vercel status, and record the result.
