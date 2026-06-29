# Site Navigation Context Plan

## Stage 1 Plan

1. Add failing tests for route matching, header link state, collection context, and PageShell integration.
2. Extend site navigation metadata with descriptions and related route hints while preserving the header item list.
3. Implement pure helpers for pathname normalization, active primary section resolution, header link state, and context related links.
4. Render a client `SiteContextBar` below the global header using `usePathname`.
5. Wire active state and `aria-current` into desktop and mobile header navigation links.
6. Run focused tests, full local checks, and browser validation on desktop and mobile.
7. Record Stage 1 evidence, commit only touched files, push `main`, and verify CI/deployment status.

## Verification Commands

- `npm test -- src/lib/site-navigation.test.ts src/components/site-context-bar.test.ts`
- `npm run lint`
- `npm test`
- `npm run build`
- `git diff --check`
