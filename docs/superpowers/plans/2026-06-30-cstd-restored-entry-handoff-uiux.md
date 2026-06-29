# CSTD Restored Entry Handoff UIUX Implementation Plan

## Task 1: UIUX Contracts

- [x] Add failing source-contract tests for a unified restored-entry handoff component.
- [x] Add failing mobile-layout tests for shared handoff class tokens and 44 px action targets.

## Task 2: Component Upgrade

- [x] Add shared restored-entry handoff class constants.
- [x] Replace duplicated receipt/action markup with a reusable `RestoredEntryHandoff` component.
- [x] Preserve directory and focus tone variants, handlers, and URL behavior.
- [x] Keep mobile action buttons full width and desktop action buttons compact.

## Task 3: Verification And Closure

- [x] Run focused and related tests.
- [x] Run diff/source hygiene checks.
- [x] Run lint, test, and build.
- [x] Verify local production desktop/mobile restored-entry flows.
- [ ] Commit, push `main`, check GitHub Actions and Vercel.
- [ ] Verify the live custom domain.
- [ ] Update `.agent/orchestrator-log.md` and `.agent/iteration-log.md`.
