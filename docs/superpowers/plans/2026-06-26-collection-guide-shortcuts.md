# Collection Guide Shortcuts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development before production code and superpowers:verification-before-completion before recording completion. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add direct guide detail shortcuts for saved collection items with matching guide builds.

**Architecture:** Put guide-href resolution in a pure helper, then render the resulting href from `CollectionWorkspace` where guide data is already loaded.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, Vitest.

---

### Task 1: Pure guide link helper

**Files:**
- Create: `src/lib/collection-guide-links.test.ts`
- Create: `src/lib/collection-guide-links.ts`

- [x] Write tests for matching dex ID to `/guides/<slug>` and returning `null` for missing guide builds.
- [x] Run `npx vitest run src/lib/collection-guide-links.test.ts` and confirm RED because the helper does not exist.
- [x] Implement the helper using `guideBuildSlug`.
- [x] Re-run focused test and confirm GREEN.

### Task 2: Collection UI shortcut

**Files:**
- Modify: `src/components/collection-workspace.tsx`

- [x] Build a guide href map or resolve per creature from loaded `guideBuilds`.
- [x] Render “查看攻略” beside each saved item when a href exists.
- [x] Preserve compare checkbox, creature card, import prompt, copy link, and insights behavior.

### Task 3: Documentation, logs, and final audit

**Files:**
- Modify: `README.md`
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [x] Mention guide shortcuts in README.
- [x] Record Stage 6 scope, local gates, browser check, commit, push, and remote status.
- [x] Run final completion audit across all six stages before marking the active goal complete.

### Task 4: Stage verification and delivery

- [x] Run `npm run lint`.
- [x] Run `npm test`.
- [x] Run `npm run build`.
- [x] Browser-check collection import plus guide shortcut navigation.
- [x] Review diff/staged diff/secret scan.
- [x] Commit Stage 6, push `main`, inspect GitHub Actions/checks/Vercel status, and record the result.
