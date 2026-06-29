# Mobile Navigation Keyboard Dismissal

## Problem

The mobile navigation can be opened and closed with the menu button, closes on route transitions, and now fits within small viewports. Keyboard users still need a deterministic way to dismiss the expanded menu without tabbing back to the menu button.

## Goal

Let `Escape` close the expanded mobile navigation from the header/menu area while preserving the existing route-bound menu state model.

## Scope

- Add a small pure helper for mobile navigation dismissal keys.
- Wire the header/menu keydown path to close the mobile menu when `Escape` is pressed.
- Keep pointer behavior, link navigation, browser-history closing, and desktop navigation unchanged.
- Verify with tests and browser automation.

## Acceptance

- `Escape` is recognized as the only dismissal key.
- Pressing `Escape` after opening the mobile menu closes the menu and restores `aria-expanded="false"`.
- Other keys do not trigger dismissal logic.
- Local and live mobile browser verification show no horizontal overflow and no console warnings/errors.
