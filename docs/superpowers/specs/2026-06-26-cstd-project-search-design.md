# CSTD Project Search Design

## Goal

Make the personal homepage project directory searchable by project name, description, tags, metrics, and evidence.

## Problem

- Category filters help, but visitors still need to scan several cards when they remember a keyword like `CRM`, `南京`, or `估值`.
- Search and category filtering should work together, not as separate browsing modes.
- Empty results need a clear recovery path.

## Decision

- Extend the existing project filter helper with an optional query parameter.
- Search across title, kicker, description, tags, metrics, and evidence text.
- Add a project search input above the category filters.
- Show a resettable empty state when the combined filter has no result.

## Acceptance

- Tests cover title/description/tag search, category + query composition, and empty summary copy.
- `/cstd` search finds CRM by `rbac` and Alpha by `A 股`.
- A no-result query shows an empty state and reset action.
- Desktop and 390 px mobile render without horizontal overflow or console errors.
