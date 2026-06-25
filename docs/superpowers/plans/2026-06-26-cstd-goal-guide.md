# Plan: CSTD Goal Guide

## Stage

Long 6-stage run, stage 4 / 6, `IMPROVE`.

## Steps

1. Add a failing test for goal guide data and target integrity.
2. Add typed guide data keyed to existing project IDs.
3. Render a goal guide above the project index.
4. Reuse the existing project focus action so guide clicks produce shareable project URLs.
5. Run local gates, browser verification, diff check, commit, push, and remote status checks.

## Verification Targets

- `npm test -- src/lib/cstd-project-guide.test.ts`
- `npm test -- src/lib/cstd-project-card.test.ts src/lib/cstd-project-focus.test.ts src/lib/cstd-projects.test.ts`
- `npm run lint`
- `npm test`
- `npm run build`
- Browser checks for guide rendering, guide click focus, Alpha/CRM/direct content, 390 px overflow, screenshots, and console errors.
