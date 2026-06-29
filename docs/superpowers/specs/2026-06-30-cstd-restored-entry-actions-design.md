# CSTD Restored Entry Actions Design

## Goal

Make restored directory and focused project entry points immediately actionable without adding a new homepage panel.

## User-Facing Behavior

- A restored filtered directory receipt includes a compact next-step action:
  - If projects match, the action opens the first matching case study.
  - If no projects match, the action resets the directory controls.
- A restored focused project receipt includes a compact action to copy the case-study summary directly from the restored entry point.
- Existing copy, reset, comparison, and project navigation controls remain unchanged.

## Constraints

- Keep this inside existing `Project index` and `Project case study` surfaces.
- Clear restored-state receipts after navigational/manual state changes.
- Do not change the public URL-state contract.
- Keep mobile layout full-width-safe and avoid nested cards.

## Verification

- Pure helper tests for directory and focus restored actions.
- Source-contract tests for visible action labels and action handlers.
- Browser checks for desktop and 390 px mobile restored directory/focus links.
