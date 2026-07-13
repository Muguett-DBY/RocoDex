# CSTD Project Action Hierarchy Implementation Plan

## Objective

Make the real product entry the unmistakable first action on every live CSTD
project card while reducing mobile action density and preserving the richer
portfolio decision tools.

## Baseline Evidence

- Production route: `https://custard.top/cstd?verify=card-audit-9bb199e`
- Viewport: 390 x 844
- First card height: about 959 CSS pixels after scrolling it into view
- Existing action order: case study, comparison, product launch, deep link
- Existing action rail: four 44-pixel rows with three 12-pixel gaps
- Horizontal overflow: 0
- Screenshot:
  `output/playwright/cstd-card-actions-2026-07-13/01-live-mobile-before.png`

## Task 1: Add A Failing Browser Contract

Extend the existing CSTD project-discovery E2E test to inspect the first live
card action rail.

- Assert the direct product link is action 1.
- Assert the case-study button is action 2.
- Assert the comparison button is action 3.
- On mobile, assert the case-study and comparison controls share a row.
- On mobile, assert both controls remain at least 44 pixels tall.

Run the focused test and capture the expected failure against the current DOM.

## Task 2: Define Stable Responsive Classes

Add project-card action-rail constants to `src/lib/cstd-mobile-layout.ts`.

- Mobile rail: two-column grid with 12-pixel gaps.
- Desktop rail: wrapping flex row.
- Secondary controls: `min-w-0`, compact horizontal padding, centered text,
  and the existing focus-visible treatment.
- Wide mobile actions: span both columns without affecting desktop flex.

Extend `src/lib/cstd-mobile-layout.test.ts` before wiring the component.

## Task 3: Reorder And Restyle Card Actions

Update `ProjectCard` in `src/components/cstd-landing.tsx`.

- Render the live product link first and pass the primary treatment.
- Add the existing external-link icon to live product and specialized links.
- Render case study and comparison after the launch action as secondary
  controls.
- Keep the optional specialized link full-width on mobile.
- Keep the case-study control primary for `Next` cards.
- Extend `HeroButton` only as needed to express a wide mobile secondary action.

Do not use CSS reordering; source order must carry the interaction hierarchy.

## Task 4: Focused Verification

- Run the mobile-layout unit tests.
- Run the focused CSTD project-discovery E2E test on desktop and mobile.
- Confirm the original red assertion is now green.
- Review the staged diff for unrelated changes and accessibility regressions.

## Task 5: Full Local Acceptance

Run:

- `npm run lint`
- `npx tsc --noEmit`
- `npm test`
- `npm run build`
- `npm run test:e2e`
- `npm audit --json`
- `git diff --check`

Start the production build on a free local port and verify 390 x 844 plus a
desktop viewport. Capture before/after action geometry, screenshots, overflow,
console warnings/errors, and error-overlay state.

## Task 6: Release Closure

- Commit the scoped implementation and push `main` without force.
- Wait for GitHub Actions and Vercel to finish.
- Verify the apex and `/cstd` aliases return 200.
- Repeat the mobile action-order and row-alignment checks on production.
- Verify the live desktop action order and external target policy.
- Record results, remaining risks, and the next audit direction in both agent
  logs.
