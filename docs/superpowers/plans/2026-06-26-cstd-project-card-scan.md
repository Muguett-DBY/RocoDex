# Plan: CSTD Project Card Scan

## Stage

Long 6-stage run, stage 3 / 6, `UIUX`.

## Steps

1. Add a failing unit test for compact card evidence and project-specific case-study labels.
2. Add a small card helper for evidence previews and accessible labels.
3. Replace full evidence blocks in cards with the compact preview.
4. Preserve full problem/outcome evidence in the focused case-study panel.
5. Run focused tests, full local gates, browser verification, diff check, commit, push, and remote status checks.

## Verification Targets

- `npm test -- src/lib/cstd-project-card.test.ts`
- `npm test -- src/lib/cstd-project-focus.test.ts src/lib/cstd-projects.test.ts src/lib/cstd-mobile-layout.test.ts`
- `npm run lint`
- `npm test`
- `npm run build`
- Browser checks for accessible labels, hidden card problem text, visible focus details, desktop screenshot, mobile overflow, and console errors.
