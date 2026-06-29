# CSTD Project State Intro Gate Plan

## Goal

Fix the CHECK-stage regression where shared CSTD project-state links can be covered by the first-visit intro overlay.

## Tasks

1. Add failing regression tests.
   - Add `hasActiveCstdProjectViewState` expectations for empty, invalid, search, category, goal+compare, and project states.
   - Update motion tests to require restored project view state to skip automatic intro.
   - Add a source contract requiring the landing component to use the active view-state helper.

2. Implement the smallest fix.
   - Export `hasActiveCstdProjectViewState` from the project view-state module.
   - Rename the intro decision input from project-focus-specific to project-view-state-specific.
   - Use the helper in `CstdLanding` before deciding whether to show the intro.

3. Verify locally.
   - Focused tests for view-state, motion, and landing source contracts.
   - Related URL-state and comparison tests.
   - `git diff --check`, hygiene scans, lint, full tests, and production build.

4. Verify in browsers.
   - Restart local production server after build.
   - Desktop and 390 x 844 mobile first-visit comparison deep links must show no intro.
   - Plain `/cstd` first visit must still show the intro.
   - Check no horizontal overflow, no framework overlay, and no console warnings/errors.

5. Close Stage 5.
   - Review diff.
   - Commit and push to `origin/main`.
   - Check GitHub Actions and Vercel.
   - Validate the live site on desktop and mobile.
   - Update `.agent/orchestrator-log.md` and `.agent/iteration-log.md`.
