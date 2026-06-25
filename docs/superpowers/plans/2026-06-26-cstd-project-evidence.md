# CSTD Project Evidence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add concise, honest case-study evidence to every live CSTD project card.

**Architecture:** Extract serializable project metadata into a tested library module. Keep icon component mapping and rendering in the client component.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Tailwind CSS, Lucide

---

### Task 1: Define project evidence

**Files:**
- Create: `src/lib/cstd-projects.test.ts`
- Create: `src/lib/cstd-projects.ts`

- [ ] Write a test requiring five live projects and complete role, problem, outcome, and current-state fields.
- [ ] Run `npm test -- src/lib/cstd-projects.test.ts` and confirm the module is missing.
- [ ] Implement typed serializable project metadata.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: Render evidence in project cards

**Files:**
- Modify: `src/components/cstd-landing.tsx`
- Modify: `src/lib/cstd-mobile-layout.ts`
- Modify: `src/lib/cstd-mobile-layout.test.ts`

- [ ] Replace inline project metadata with the shared module.
- [ ] Map icon keys to existing Lucide components.
- [ ] Render role, problem, and outcome in a compact evidence block.
- [ ] Keep metrics, actions, tags, filters, and responsive card layout intact.

### Task 3: Validate and release

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [ ] Run focused tests, lint, full tests, and production build.
- [ ] Verify desktop and 390 px mobile evidence rendering, filters, links, overflow, and console health.
- [ ] Inspect diffs and secrets, commit with `feat: add project case study evidence`, push `main`, and check remote deployment status.
