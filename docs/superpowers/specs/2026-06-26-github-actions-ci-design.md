# GitHub Actions CI Design

## Goal

Give `main` and pull requests a current GitHub Actions signal for the same gates used during local homepage work.

## Problem

- The repository had no `.github/workflows` directory.
- Commit check-runs were consistently `0`.
- Vercel deployments were successful, but they did not expose the lint/test/build ladder as a GitHub Actions check.

## Decision

- Add a single `CI` workflow on push and pull request to `main`.
- Use Node.js 22 with npm cache.
- Run `npm ci`, `npm run lint`, `npm test`, and `npm run build`.
- Add a static test to prevent accidental deletion or weakening of the workflow.

## Acceptance

- Local workflow test fails before the workflow exists and passes after.
- Local lint, tests, and build pass.
- A pushed commit creates a current GitHub Actions run on `main`.
- The current run succeeds.
