# Collection Insights Design

## Context

Stage 1 added a browser-local collection and a compare handoff. The next improvement should make the collection useful before a user manually opens each saved creature or guide page.

## Decision

Add a read-only collection insights panel to `/collection`. It summarizes saved creatures against existing guide data: matched guide coverage, PVP-rated count, role coverage, attribute coverage, recommended team count, and next actions. It uses only local creature IDs and existing static guide data, so it does not require authentication, a database, or network calls.

## Alternatives considered

- Add more creature-list filters. This is useful but less directly connected to the newly added collection workflow.
- Add account-synced favorites. This is higher risk because auth is intentionally optional and may not be configured.
- Add collection insights. This gives immediate value, has bounded scope, and can be tested with pure helpers.

## User experience

- Empty collections keep the existing empty state.
- Non-empty collections show a compact insight panel above saved cards.
- The panel answers: how many saved creatures have guide records, how many have PVP ratings, what roles and attributes are covered, and what to do next.
- Unknown or unrated guide data is surfaced as review work, not invented recommendations.
- Existing compare and clear actions remain unchanged.

## Architecture

- `src/lib/collection-insights.ts` owns the pure summary logic.
- `src/lib/collection-insights.test.ts` verifies guide matching, deduplication, role/attribute counts, unrated handling, and next-action text.
- `src/components/collection-insights-panel.tsx` renders the summary without owning data loading.
- `src/components/collection-workspace.tsx` dynamically imports `guideBuilds` alongside `creatures` and passes the summary inputs to the panel.

## Error handling

- Stale collection IDs are ignored by the insight summary and remain covered by the existing stale-count warning.
- Missing guide builds count as unmatched instead of crashing.
- Duplicate saved IDs are normalized by Stage 1 collection storage before reaching the panel.

## Verification

- TDD red/green for the pure helper.
- Full `npm run lint`, `npm test`, and `npm run build`.
- Browser check for `/collection` with two saved creatures confirming the insight panel renders and no console errors appear.
