# Restored Comparison Continuation Plan

**Goal:** Turn restored CSTD comparison links into an actionable handoff at the top of the existing comparison section.

**Architecture:** Reuse the existing comparison context and next-step model. Add the minimum fields needed for restored-link copy and wire the existing next-step handler into the restored receipt.

---

### Task 1: Tests First

**Files:**
- Modify: `src/lib/cstd-project-comparison-context.test.ts`
- Modify: `src/components/cstd-landing-url-sync.test.ts`

- [x] Add failing context tests for restored comparison continuation copy.
- [x] Add failing source-contract tests for the header-level restored continuation action.
- [ ] Run focused tests and confirm they fail for the expected missing behavior.

### Task 2: Implementation

**Files:**
- Modify: `src/lib/cstd-project-comparison-context.ts`
- Modify: `src/components/cstd-landing.tsx`

- [x] Extend restored comparison receipt context with continuation label/detail.
- [x] Render continuation copy and action inside the existing comparison header receipt.
- [x] Keep the restored continuation action at the existing 44 px touch target standard.
- [x] Keep non-restored comparisons unchanged.
- [x] Keep the lower decision next-step band unchanged for full reasoning.

### Task 3: Verification And Release

**Files:**
- Modify: `.agent/orchestrator-log.md`
- Modify: `.agent/iteration-log.md`

- [x] Run focused and related tests.
- [x] Run lint, full tests, build, diff hygiene, and source hygiene checks.
- [x] Run local desktop/mobile rendered verification for restored comparison deep links.
- [ ] Commit and push Stage 6 files to `origin/main`.
- [ ] Confirm GitHub Actions and Vercel status.
