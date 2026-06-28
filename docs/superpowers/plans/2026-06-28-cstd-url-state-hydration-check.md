# CSTD URL State Hydration Check Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:systematic-debugging for the finding and superpowers:test-driven-development for the fix.

**Goal:** Remove the verified default-state flash from CSTD project workflow deep links.

**Architecture:** Keep the existing URL-state parser and popstate contract. Change only the timing of initial state restoration inside `CstdLanding`.

---

### Task 1: Reproduce And Guard

**Files:**
- Add: `src/components/cstd-landing-url-sync.test.ts`

- [x] Record the live verification symptom from Stage 4.
- [x] Add a failing regression test that rejects frame-delayed initial URL state restoration.
- [x] Confirm the focused test fails before the implementation change.

### Task 2: Fix Initial Sync Timing

**Files:**
- Modify: `src/components/cstd-landing.tsx`

- [x] Add an isomorphic client layout-effect alias.
- [x] Run `syncViewState()` immediately on mount.
- [x] Hide state-aware workflow navigation until URL state has synchronized at least once.
- [x] Preserve `popstate` synchronization.
- [x] Confirm the focused regression test passes.
- [x] Run related URL-state, workflow-summary, and mobile-layout tests.

### Task 3: Verification And Release

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [x] Run `git diff --check` and source hygiene checks.
- [x] Run `npm run lint`, `npm test`, and `npm run build`.
- [x] Verify direct deep links in Browser on desktop and 390px mobile.
- [ ] Commit with `fix: sync cstd deep links before paint` and push `main`.
- [ ] Verify GitHub Actions, Vercel, and the live custom domain.
- [ ] Record Stage 5 evidence and next direction.
