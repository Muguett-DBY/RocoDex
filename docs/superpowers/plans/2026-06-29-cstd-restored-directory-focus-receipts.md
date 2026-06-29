# CSTD Restored Directory And Focus Receipts Implementation Plan

> Required execution mode: follow the existing TDD loop in this repository. Keep each change scoped to Stage 1.

## Task 1: Pure Receipt Model

- [ ] Add focused tests for directory and focused-project restored receipts.
- [ ] Confirm the tests fail before implementation.
- [ ] Add pure helpers in the URL state module.
- [ ] Rerun focused tests.

## Task 2: Landing Integration

- [ ] Add source-contract tests for directory/focus restored-state flags, aria labels, and manual reset behavior.
- [ ] Confirm the tests fail before implementation.
- [ ] Track directory, focus, and comparison restored states separately during URL synchronization.
- [ ] Render `筛选视图已恢复` inside Project index.
- [ ] Render `分享案例已恢复` inside Project case study.
- [ ] Clear restored flags after manual state mutations.
- [ ] Rerun focused and related tests.

## Task 3: Stage Closure

- [ ] Run diff and source hygiene checks.
- [ ] Run lint, test, and build.
- [ ] Verify local production desktop and mobile flows.
- [ ] Commit, push `main`, check GitHub Actions and Vercel.
- [ ] Verify the live custom domain.
- [ ] Update `.agent/orchestrator-log.md` and `.agent/iteration-log.md`.
