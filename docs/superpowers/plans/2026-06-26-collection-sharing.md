# Collection Sharing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add shareable collection links that can import a normalized list of creature IDs into the current browser collection after user confirmation.

**Architecture:** Keep parsing and merging in pure collection helpers, add one hook method for merging IDs, and render import/copy actions inside the collection workspace.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, Vitest.

---

### Task 1: Pure sharing helpers

**Files:**
- Modify: `src/lib/creature-collection.test.ts`
- Modify: `src/lib/creature-collection.ts`

- [x] Add failing tests for `parseSharedCollectionIds`, `mergeCreatureCollectionIds`, and `buildCollectionShareHref`.
- [x] Run `npx vitest run src/lib/creature-collection.test.ts` and confirm RED because the helper exports do not exist.
- [x] Implement helpers using normalized, unique, three-digit IDs.
- [x] Re-run focused test and confirm GREEN.

### Task 2: Hook and page wiring

**Files:**
- Modify: `src/hooks/use-creature-collection.ts`
- Modify: `src/app/collection/page.tsx`
- Modify: `src/components/collection-workspace.tsx`

- [x] Add `addMany(ids)` to the collection hook.
- [x] Parse `searchParams.ids` in the collection page and pass `sharedIds` into the workspace.
- [x] Show an import prompt for valid shared IDs not already saved.
- [x] Add a copy-share-link action for non-empty collections.
- [x] Preserve existing empty, compare, insights, and clear behavior.

### Task 3: Documentation and logs

**Files:**
- Modify: `README.md`
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [x] Mention share links in README.
- [x] Record Stage 4 scope, local gates, browser check, commit, push, and remote status.

### Task 4: Stage verification and delivery

- [x] Run `npm run lint`.
- [x] Run `npm test`.
- [x] Run `npm run build`.
- [x] Verify `/collection?ids=001,005` import flow in Browser/IAB.
- [x] Review diff/staged diff/secret scan.
- [x] Commit Stage 4, push `main`, inspect GitHub Actions/checks/Vercel status, and record the result.
