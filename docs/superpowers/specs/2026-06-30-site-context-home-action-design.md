# Site Context Home Action

## Problem

The global context strip explains the current non-CSTD module and offers two related destinations, but returning to the homepage relies on the brand mark in the sticky header. That works, yet the context strip is already the user's local navigation handoff and should expose a clear home continuation there too.

## Goal

Add a compact, consistent homepage action to the context strip on non-home modules without changing CSTD or increasing mobile header complexity.

## Scope

- Add a pure helper that returns the homepage navigation item only when the current route is not already home.
- Render the home action in the existing context strip action row before related destinations.
- Keep the existing 44 px touch target contract.
- Do not duplicate the home action on the homepage context.

## Acceptance

- `/creatures/001` exposes a home context action.
- `/` does not expose a duplicate home context action.
- The context strip source uses the helper and renders `href="/"` with the `首页` label.
- Desktop and 390 x 844 browser checks confirm the action, no overflow, and no console warnings/errors.
