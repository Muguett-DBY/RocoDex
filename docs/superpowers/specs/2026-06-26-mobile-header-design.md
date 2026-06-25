# Mobile Header UI/UX Design

## Context

The site header currently renders all primary navigation links directly in the header. On narrow screens this creates a dense multi-line block before page content, especially after adding collection navigation.

## Decision

Introduce a mobile-only collapsible navigation panel. Desktop keeps the current horizontal navigation. Mobile keeps the brand visible, exposes theme toggle and a clear menu button, and places primary navigation, collection, and auth controls inside the expandable panel.

## User experience

- Desktop users see the same navigation structure as before.
- Mobile users see a compact one-row header by default.
- The menu button uses `aria-expanded`, `aria-controls`, and explicit open/close labels.
- The mobile panel uses a card-like surface with large tap targets and wraps auth controls safely.
- Opening the menu should not cause horizontal overflow.

## Architecture

- Move navigation metadata to `src/lib/site-navigation.ts` so labels/hrefs and menu labels are testable without rendering React.
- Keep icon ownership in `SiteHeader` to avoid coupling pure metadata to React icon components.
- Extend `CollectionNavLink` with optional `className` and `onClick` props so it can share desktop/mobile styling.
- Keep the header as a client component because auth controls and the mobile menu need client state.

## Verification

- TDD red/green for navigation metadata uniqueness and mobile menu label state.
- Full lint, test, and build.
- Browser verification at mobile width confirms collapsed default state, menu open state, no horizontal overflow, and console errors `0`.
