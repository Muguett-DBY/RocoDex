# Mobile Navigation Route State Design

## Stage

- Date: 2026-06-30
- Orchestrator: `03_LONG_6_STAGE_MAIN_V2.txt`
- Stage: 2 / 6, `IMPROVE`
- Scope: deterministic mobile navigation state across route transitions.

## Problem

The mobile menu closes when its own links are clicked, but its open state is not tied to the current pathname. Browser history, programmatic navigation, or another in-page route control can therefore leave the old menu open over the newly selected page.

## User Outcome

- An open mobile menu should remain open while the normalized pathname is unchanged.
- Any pathname transition should synchronously render the menu closed.
- Direct menu navigation should keep its existing close behavior.
- Toggle labels, `aria-expanded`, current-link states, and touch target sizes must remain stable.

## Approach

Store the pathname together with the requested open state. Derive the rendered open state through a pure route-aware helper, so a path change closes the menu during render without a state-setting effect. The next toggle records the new pathname and opens normally.

## Acceptance

- Pure tests cover same-path query changes, nested path changes, and explicitly closed state.
- `SiteHeader` stores route-aware menu state and preserves existing button/link behavior.
- Mobile browser verification proves browser-history or programmatic route changes close the menu.
- Focused tests, lint, full tests, build, and browser checks pass before commit.
