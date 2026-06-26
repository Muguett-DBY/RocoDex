# Stage 5 Round 2 CI Stability Report

## Scope

Stage 5 checks the current CI, local validation, and deployment pipeline after the first four homepage iterations in this round.

## Baseline

- Branch: `main`
- Remote: `origin https://github.com/Muguett-DBY/RocoDex.git`
- Baseline HEAD: `5133ca2 chore: record stage 4 remote verification`
- Latest 10 GitHub Actions runs on `main`: success
- Latest baseline Vercel commit status: success
- Workflow: `.github/workflows/ci.yml`
- Package manager: npm with `package-lock.json`
- Local runtime observed: Node `v26.4.0`, npm `11.17.0`
- CI runtime configured: Node `22`

## Findings

- No failing GitHub Actions run was present at baseline.
- CI workflow still used `actions/checkout@v4` and `actions/setup-node@v4`.
- GitHub API reported newer stable releases: `actions/checkout@v7.0.0` and `actions/setup-node@v6.4.0`.

## Planned Fix

- Update the static workflow guard test.
- Upgrade workflow action pins to the current major versions.
- Re-run CI-equivalent local commands and push only after validation passes.

## Implementation

- Upgraded `.github/workflows/ci.yml` from `actions/checkout@v4` to `actions/checkout@v7`.
- Upgraded `.github/workflows/ci.yml` from `actions/setup-node@v4` to `actions/setup-node@v6`.
- Ran `npm audit fix`, updating the lockfile to remove the dev-only Vite advisory reported by full `npm audit`.

## Verification

- TDD red: `npm test -- src/lib/github-ci-workflow.test.ts` failed while workflow pins were still v4.
- TDD green: `npm test -- src/lib/github-ci-workflow.test.ts` passed after workflow pin upgrades.
- `npm ci` initially failed because the local Next production server locked `next-swc.win32-x64-msvc.node`; after stopping the local server, `npm ci` passed.
- `npm audit --omit=dev --json` reported 0 production vulnerabilities.
- Full `npm audit --json` initially reported one high dev vulnerability in Vite; after `npm audit fix`, full audit reported 0 vulnerabilities.
- `npm run lint` exited 0.
- `npm test` passed 28 files / 103 tests.
- `npm run build` exited 0 and generated 735 static pages.
- HTTP smoke returned 200 for 13 routes: `/`, `/cstd`, `/collection`, `/compare`, `/creatures`, `/guides`, `/pvp-teams`, `/data-status`, `/discover`, `/matchups`, `/skills`, `/login`, `/register`.
- Browser plugin verification could not complete because the in-app Browser webview attach timed out.
- Playwright fallback could not run because the bundled `playwright` package lacked `playwright-core`; direct Chrome/Edge CDP fallback also exited before opening a debugging port.

## Result

- CI workflow and lockfile were updated.
- Local CI-equivalent validation passed.
- Browser-specific Stage 5 smoke is recorded as tool/browser-runtime blocked, not an application failure.
- Commit `0dba81d` was pushed to `origin/main`.
- GitHub Actions CI for `0dba81d` and Vercel deployment status both completed successfully.
