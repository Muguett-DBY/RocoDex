# CSTD Restored Case Handoff Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete restored case-study copy and continuation actions inside the top handoff.

**Architecture:** Model copy presentation as a pure helper, then pass the derived state into the existing shared handoff component. The restored focus surface owns local feedback and manual fallback while ordinary focus visits retain the action-rail behavior.

**Tech Stack:** TypeScript, React 19, Next.js 16, Tailwind CSS, Vitest

---

### Task 1: Copy Presentation Model

**Files:**
- Modify: `src/lib/cstd-project-focus.ts`
- Test: `src/lib/cstd-project-focus.test.ts`

- [x] Add failing tests for idle, copied, unsupported, and failed presentation states.
- [x] Run `npm test -- src/lib/cstd-project-focus.test.ts` and confirm the helper is missing.
- [x] Add `getCstdProjectBriefCopyPresentation` with explicit label, message, tone, and manual-copy fields.
- [x] Rerun the focused helper tests and confirm they pass.

### Task 2: Restored Handoff Completion UI

**Files:**
- Modify: `src/components/cstd-landing.tsx`
- Modify: `src/lib/cstd-mobile-layout.ts`
- Test: `src/components/cstd-landing-url-sync.test.ts`
- Test: `src/lib/cstd-mobile-layout.test.ts`

- [x] Add failing source contracts for localized copy feedback, inline manual fallback, completed action state, and the live-project link.
- [x] Add a failing responsive contract for the restored handoff action group.
- [x] Extend `RestoredEntryHandoff` with optional feedback, fallback text, completed label/icon, and secondary link props.
- [x] Wire focus copy presentation into the restored handoff and suppress duplicate action-rail feedback for restored links.
- [x] Keep directory behavior unchanged and render manual brief text only for failed or unsupported copy results.
- [x] Rerun focused and related tests.

### Task 3: Verification And Release

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`
- Modify: `docs/superpowers/plans/2026-06-30-cstd-restored-case-handoff-completion.md`

- [x] Run `git diff --check` and targeted hygiene scans.
- [x] Run `npm run lint`, `npm test`, and `npm run build`.
- [x] Verify local production success and clipboard-fallback paths at desktop and 390 px mobile.
- [x] Commit and push only Stage 4 files to `origin/main`.
- [x] Confirm GitHub Actions and Vercel success.
- [x] Verify the live custom domain and record closure evidence.
