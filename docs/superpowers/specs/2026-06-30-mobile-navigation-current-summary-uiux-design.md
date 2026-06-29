# Mobile Navigation Current Summary UIUX

## Problem

The mobile header now marks active routes and closes stale menus on pathname changes, but the expanded menu still reads as a flat list. On small screens, visitors who open the menu from a nested page such as a creature detail page must infer the current module only from one highlighted row among many entries.

## Goal

Make the expanded mobile navigation easier to scan by showing a compact current-location summary inside the opened menu, without increasing the sticky header's closed height or changing desktop navigation.

## Scope

- Use the existing site navigation route context as the source of truth.
- Add a pure helper for the mobile summary so nested and query-bearing routes resolve consistently.
- Render the summary only inside the expanded mobile menu.
- Add an accessible label to the mobile nav landmark.
- Keep route links and collection/auth controls in the same menu order.

## Non-goals

- No new primary destinations.
- No CSTD project workflow changes.
- No persistent state, personalization, or query-specific menu behavior.
- No increased closed mobile header footprint.

## Acceptance

- `/creatures/001` resolves the summary to `精灵列表`.
- Unknown routes do not render a summary.
- The expanded mobile nav exposes `aria-label="移动主导航"`.
- The current summary displays the module label and description above the route index.
- Mobile browser verification confirms no horizontal overflow, no console warnings/errors, and no header/menu overlap.
