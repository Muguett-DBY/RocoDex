# Mobile Navigation Route State Plan

## Stage 2 Plan

1. Add a failing pure test for route-aware mobile menu visibility.
2. Add normalized path state and a pure visibility helper in `site-navigation.ts`.
3. Replace the header's boolean menu state with `{ open, pathname }` and derive visibility synchronously.
4. Preserve explicit close callbacks, toggle accessibility state, active links, and 44 px mobile rows.
5. Run focused tests, full local checks, and mobile browser navigation verification.
6. Record evidence, commit only Stage 2 files, push `main`, and verify CI/deployment status.

## Verification Commands

- `npm test -- src/lib/site-navigation.test.ts src/components/site-context-bar.test.ts`
- `npm run lint`
- `npm test`
- `npm run build`
- `git diff --check`
