# CSTD Mobile Metric Density Implementation Plan

## Objective

Reduce repeated vertical scanning inside CSTD project cards while preserving a
safe fallback for unusually narrow screens and improving metric semantics for
assistive technology.

## Baseline And Prototype Evidence

- Production commit audited: `ae71a8d`
- Baseline viewport: 320 x 800
- First card: about 930 pixels high
- Metric grid: about 237 x 224 pixels
- Prototype first card: about 853 pixels high
- Prototype metric grid: about 237 x 147 pixels
- Measured reduction: 77 pixels per first card
- All six cards at 320px: zero tile/value/label overflow and one-line text
- 280px prototype: no overflow, but `Portrait` and `Nanjing` wrap to two lines
- Baseline screenshot:
  `output/playwright/cstd-card-actions-2026-07-13/07-metric-baseline-320.png`
- Prototype screenshot:
  `output/playwright/cstd-card-actions-2026-07-13/06-metric-prototype-320.png`

## Task 1: Add Failing Contracts

Extend `src/lib/cstd-mobile-layout.test.ts` to require:

- one-column default;
- two columns from 320 pixels;
- three columns at `sm`;
- last-item two-column span from 320 pixels;
- last-item reset at `sm`.

Extend the existing CSTD project-discovery E2E test to require a named metric
list and responsive geometry:

- mobile: metrics 1 and 2 share a row, metric 3 is below and wider;
- desktop: all three metrics share a row with approximately equal widths.

Run focused unit and E2E checks and capture the expected red state.

## Task 2: Implement Responsive Metrics

Update `src/lib/cstd-mobile-layout.ts`:

- retain `grid-cols-1` as the narrow fallback;
- add `min-[320px]:grid-cols-2`;
- retain `sm:grid-cols-3`;
- add last-item span/reset classes to the metric tile.
- align the project action rail with the same 320-pixel activation boundary so
  narrower screens use full-width actions.

Update `ProjectCard` in `src/components/cstd-landing.tsx`:

- render the metric grid as a named `<ul>`;
- render each tile as `<li>`;
- preserve all content and existing visual classes.

## Task 3: Focused Verification

- Run the mobile-layout unit test.
- Run the CSTD project-discovery E2E test in desktop and mobile profiles.
- Confirm semantic role/name assertions and responsive geometry pass.
- Run TypeScript and lint before broadening the gate.

## Task 4: Full Local Acceptance

Run:

- `npm run lint`
- `npx tsc --noEmit`
- `npm test`
- `npm run build`
- `npm run test:e2e`
- `npm audit --json`
- `git diff --check`

Use the production build to verify 280, 320, 390, and desktop widths. At each
width, inspect page overflow, metric text overflow, error-overlay state, and
console warnings/errors. Capture and inspect representative screenshots.

## Task 5: Release Closure

- Commit the scoped implementation and push `main` without force.
- Wait for GitHub Actions and Vercel to complete for the implementation SHA.
- Verify apex and `/cstd` return 200.
- Repeat mobile metric geometry and all-card overflow checks in production.
- Verify desktop three-column geometry and visual parity.
- Record the release evidence, remaining risks, and next audit direction in the
  iteration and orchestrator logs.
