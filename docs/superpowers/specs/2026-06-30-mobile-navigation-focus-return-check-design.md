# Mobile Navigation Focus Return Check

## Finding

Stage 4 added `Escape` dismissal for the mobile navigation. The keydown handler closes the menu, but when `Escape` is pressed from a focused menu link, that focused element is unmounted. Without explicit focus restoration, keyboard users can lose their place after dismissal.

## Goal

Treat the focus-loss risk as a CHECK-stage accessibility defect and restore focus to the mobile menu button after `Escape` closes the menu.

## Scope

- Preserve the existing route-bound mobile menu state model.
- Keep the `Escape` dismissal helper unchanged.
- Prevent default `Escape` handling in the header dismissal path.
- Return focus to the mobile menu button after the menu has closed.
- Verify from a focused menu link, not only from the toggle button.

## Acceptance

- Source contracts require a mobile menu button ref, `event.preventDefault()`, and post-close focus restoration.
- Local and live mobile browser checks confirm pressing `Escape` from a menu link closes the menu and leaves focus on the reopened `打开主导航` button.
- No horizontal overflow or console warnings/errors are introduced.
