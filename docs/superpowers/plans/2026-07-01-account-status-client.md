# Account Status Client Plan

## Goal

Bound the account preflight wait and prevent login storage outages from appearing as credential failures.

## Tasks

1. Add failing client-loader and page integration tests.
2. Implement the timeout-aware account status loader and shared hook.
3. Replace registration's direct fetch with the shared hook and add checking feedback.
4. Add login checking, blocked, unavailable, and local recovery states.
5. Run focused, related, full, build, E2E, and rendered browser verification.
6. Review, commit, push, verify CI/deployment/live behavior, and close logs.
