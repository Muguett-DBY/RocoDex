# Account Recovery Actions Design

## Problem

The account outage panel points users to local collection, which is useful if they already have saved creatures. New visitors with an empty local collection still need a clear next step to continue using the site without an account.

## Goal

Make account outage recovery feel complete by offering two safe no-account paths: local collection and creature browsing. The panel should remain compact and reuse the existing visual system.

## Approach

- Keep the current primary recovery action from the account-status model.
- Add a secondary touch-safe action to `/creatures` labeled `继续查精灵`.
- Use a responsive action row: stacked full-width actions on narrow screens, compact inline actions on larger screens.
- Keep both actions at least 44 px tall and maintain focus-visible outlines.

## Verification

- Extend `AccountStatusPanel` tests to require the secondary `/creatures` recovery action and responsive action row.
- Run full local verification and production Browser checks for login/home outage panels after deploy.
