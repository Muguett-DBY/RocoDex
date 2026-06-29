# CSTD Restored Entry Actions Implementation Plan

## Task 1: Helper Contracts

- [x] Add failing tests for restored directory and focus entry actions.
- [x] Implement pure action helpers in the URL-state module.
- [x] Rerun focused tests.

## Task 2: Landing Integration

- [x] Add source-contract tests requiring restored entry action rendering and handlers.
- [x] Render the directory next action near `筛选视图已恢复`.
- [x] Render the focused case-summary action near `分享案例已恢复`.
- [x] Keep manual state mutation clearing intact.
- [x] Rerun focused and related tests.

## Task 3: Verification And Closure

- [x] Run diff/source hygiene checks.
- [x] Run lint, test, and build.
- [x] Verify local production desktop/mobile routes.
- [ ] Commit, push `main`, check GitHub Actions and Vercel.
- [ ] Verify the live custom domain.
- [ ] Update `.agent/orchestrator-log.md` and `.agent/iteration-log.md`.
