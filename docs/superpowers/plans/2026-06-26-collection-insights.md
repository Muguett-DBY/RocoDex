# Collection Insights Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a collection insights panel that turns saved creature IDs into guide coverage, role coverage, attribute coverage, and next-action guidance.

**Architecture:** Keep insight calculation in a pure library and render it through a small presentational component. The collection workspace remains the data-loading boundary and dynamically imports existing static creature and guide data.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, Vitest.

---

### Task 1: Pure collection insight summary

**Files:**
- Create: `src/lib/collection-insights.test.ts`
- Create: `src/lib/collection-insights.ts`

- [x] **Step 1: Write failing tests**

```ts
import { describe, expect, it } from "vitest";
import { summarizeCollectionInsights } from "@/lib/collection-insights";
import type { Creature } from "@/types/creature";
import type { GuideCreatureBuild } from "@/types/guide";
```

Cover these expectations:

- valid saved IDs are matched to creatures and guide builds by dex ID
- unmatched stale IDs are counted but ignored in coverage
- roles and attributes are deduplicated and counted
- PVP-rated builds exclude `未评级`
- next actions mention compare readiness for 2+ saved creatures and review gaps when unrated builds exist

- [x] **Step 2: Run the focused test and confirm RED**

Run: `npx vitest run src/lib/collection-insights.test.ts`

Expected: fail because `src/lib/collection-insights.ts` does not exist.

- [x] **Step 3: Implement the pure helper**

Create `summarizeCollectionInsights(ids, creatures, guideBuilds)` returning counts, role coverage, attribute coverage, and action messages. Do not import static data in this helper.

- [x] **Step 4: Run focused test and confirm GREEN**

Run: `npx vitest run src/lib/collection-insights.test.ts`

Expected: 1 test file passes.

### Task 2: Render insights on the collection page

**Files:**
- Create: `src/components/collection-insights-panel.tsx`
- Modify: `src/components/collection-workspace.tsx`

- [x] Add a presentational panel that renders coverage stat cards, role chips, attribute chips, and next-action bullets.
- [x] Import `guideBuilds` in the existing collection workspace data-loading effect.
- [x] Use `summarizeCollectionInsights(ids, creatures, guideBuilds)` only after data is hydrated.
- [x] Preserve existing empty, stale, compare, and clear behavior.

### Task 3: Documentation and logs

**Files:**
- Modify: `README.md`
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [x] Mention collection insights in README.
- [x] Record Stage 2 scope, local gates, browser check, commit, push, and remote-check evidence.

### Task 4: Stage verification and delivery

- [x] Run `npm run lint`.
- [x] Run `npm test`.
- [x] Run `npm run build`.
- [x] Verify `/collection` in Browser/IAB with saved creatures and confirm the insight panel plus console error count.
- [x] Review `git status`, `git diff`, staged diff, and secret scan.
- [ ] Commit Stage 2, push `main`, inspect GitHub Actions/checks, and record the result.
