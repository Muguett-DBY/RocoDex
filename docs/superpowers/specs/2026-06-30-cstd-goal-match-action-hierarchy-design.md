# CSTD Goal Match Action Hierarchy Design

## Problem

The selected goal match now has five actions. At the small breakpoint the old four-column rail leaves one orphaned action, all controls are only 40 px high, and the destructive clear command competes visually with the visitor's forward paths.

## Decision

Use a stable two-column action rail from 420 px upward. The primary case action and directory continuation span both columns, comparison and live-project actions share the middle row, and clearing the match becomes a separate 44 by 44 icon control in the panel corner. Every command uses a minimum 44 px touch target, visible focus treatment, and an accessible name.

## Acceptance

- The action rail has no orphaned fifth command at desktop or tablet widths.
- Every action measures at least 44 px in both tested viewports.
- The clear icon does not overlap the heading or evidence copy.
- Desktop and 390 px mobile layouts have no horizontal overflow or console errors.
