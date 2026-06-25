# Collection Guide Shortcuts Design

## Context

The collection page now summarizes guide coverage, but users still need to find each saved creature's guide manually. The final improvement should shorten the path from saved candidate to cultivation detail.

## Decision

Add a direct “查看攻略” shortcut for saved collection items when a matching guide build exists. Use the existing guide slug logic so links stay consistent with `/guides/[slug]` static routes.

## User experience

- Each saved collection item keeps the compare checkbox and creature card.
- When a guide build matches the saved creature ID, the item shows a small “查看攻略” link next to the compare selector.
- The link opens the existing independent guide detail page.
- Missing guide records do not render a broken link.

## Architecture

- Add `src/lib/collection-guide-links.ts` with a pure helper that maps a creature ID and guide build list to a guide href.
- Test the helper with `src/lib/collection-guide-links.test.ts`.
- Update `CollectionWorkspace` to build a guide href map from loaded `guideBuilds`.
- Keep guide slug construction delegated to `guideBuildSlug`.

## Verification

- TDD red/green for guide href generation.
- Full lint, test, and build.
- Browser check on `/collection?ids=001,005` import flow confirms “查看攻略” appears and opens a guide detail page.
