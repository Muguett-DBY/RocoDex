# Collection Sharing Design

## Context

The collection is intentionally local to the current browser. Users can save and compare creatures, but they cannot move a shortlist between browsers or share a shortlist with another player without manually naming IDs.

## Decision

Add lightweight collection share links. A share link uses `/collection?ids=001,005` and stores only normalized creature IDs. Visiting a link shows an import prompt that merges valid IDs into the local collection after explicit user action. The feature does not auto-write localStorage on page load.

## User experience

- A populated collection shows a “复制分享链接” action.
- The copied link contains up to the normalized saved IDs.
- Opening `/collection?ids=...` shows a “导入分享清单” prompt when valid IDs are not already saved.
- Importing merges new IDs with existing local collection and preserves existing saved IDs.
- Stale or malformed shared IDs are ignored and do not crash the page.

## Architecture

- Extend `src/lib/creature-collection.ts` with shared-link parsing, merging, and href building helpers.
- Extend `useCreatureCollection` with `addMany(ids)`.
- Pass parsed query IDs from `src/app/collection/page.tsx` into `CollectionWorkspace`.
- Keep import UI inside `CollectionWorkspace` because it owns local collection state and loaded creature data.

## Verification

- TDD red/green for shared-link parsing, merging, and href building.
- Full lint, test, and build.
- Browser verification opens `/collection?ids=001,005`, imports the shared list, confirms saved count and insights update, and checks console errors.
