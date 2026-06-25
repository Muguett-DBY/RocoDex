# Plan: GitHub Actions CI

## Stage

Long 6-stage run, stage 5 / 6, `CHECK`.

## Steps

1. Confirm repository status and existing workflow state.
2. Add a failing static test for the expected CI workflow.
3. Add `.github/workflows/ci.yml`.
4. Run focused test, lint, full tests, build, and homepage browser smoke.
5. Commit and push to `main`.
6. Verify Vercel status, GitHub check-runs, and the new GitHub Actions run.

## Verification Targets

- `npm test -- src/lib/github-ci-workflow.test.ts`
- `npm run lint`
- `npm test`
- `npm run build`
- Browser smoke at `/cstd` on 390 px mobile.
- `gh run list --branch main --limit 5`
- `gh run watch <run-id> --exit-status`
