# CSTD Comparison Brief Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development and superpowers:executing-plans.

**Goal:** Add a tested copyable decision brief to the existing CSTD project comparison matrix.

**Architecture:** Keep brief formatting in the comparison library, extend the existing view-state URL helper with the comparison anchor, and route clipboard access through one guarded component adapter. Do not add a new homepage section or change comparison selection rules.

---

### Task 1: Brief Contract

**Files:**
- Modify: `src/lib/cstd-project-comparison.test.ts`
- Modify: `src/lib/cstd-project-comparison.ts`

- [x] Add failing tests for complete and incomplete comparison briefs.
- [x] Implement stable brief formatting from existing matrix rows.
- [x] Run the focused comparison tests.

### Task 2: Share URL And UI

**Files:**
- Modify: `src/lib/cstd-project-view-state.test.ts`
- Modify: `src/lib/cstd-project-view-state.ts`
- Modify: `src/components/cstd-landing-url-sync.test.ts`
- Modify: `src/components/cstd-landing.tsx`

- [x] Add the `#project-comparison` URL contract.
- [x] Add a comparison-local copy button and live result message.
- [x] Route every homepage copy action through the guarded clipboard adapter.
- [x] Run focused comparison and URL-state tests.

### Task 3: Verification And Release

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [x] Run `git diff --check`, lint, full tests, and production build.
- [x] Verify the direct comparison link on desktop and 390px mobile.
- [ ] Commit and push the Stage 1 feature independently.
- [ ] Verify GitHub Actions, Vercel, and the live custom domain.
- [ ] Record final Stage 1 remote evidence before starting Stage 2.
