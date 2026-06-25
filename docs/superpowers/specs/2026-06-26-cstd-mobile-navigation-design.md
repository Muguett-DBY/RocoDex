# CSTD Mobile Navigation Design

## Goal

Recover the CSTD mobile first viewport for brand and project discovery by replacing the permanent six-button header grid with a compact, accessible navigation menu.

## Experience

- Keep the brand and one familiar menu icon in the mobile header.
- Open a full-width project navigation panel below the header.
- Keep the desktop project shortcuts visible at the existing breakpoint.
- Close the mobile panel after any destination is selected.
- Make open/closed state available to assistive technology and keyboard users.
- Keep the header visible while browsing with a restrained sticky background.

## Architecture

Navigation metadata and toggle labels live in `src/lib/cstd-navigation.ts`. `CstdLanding` owns only the open state and renders shared navigation links in desktop and mobile containers. Existing link styling remains the visual foundation, with mobile-specific sizing supplied by the caller.

## Responsive Rules

- Below `sm`, desktop navigation is hidden and the menu button is visible.
- At `sm` and above, the menu button and mobile panel are hidden while the horizontal navigation remains visible.
- The mobile panel uses one column so long project names do not compete for width.

## Verification

- Unit tests cover item order, destinations, and toggle state labels.
- Browser checks cover collapsed/open/closed interaction, sticky header, 390 px overflow, focus semantics, desktop visibility, and console health.
