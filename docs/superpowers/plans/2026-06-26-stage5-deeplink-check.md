# Stage 5 Deep-Link Check Plan

Goal: Fix the project deep-link first-visit overlay issue found during systematic checks.

Checklist:

- [x] Add a failing test that skips automatic intro for direct project deep links.
- [x] Apply the deep-link skip in the CSTD landing initialization path.
- [x] Re-run CI-equivalent local gates plus browser verification.
- [x] Commit, push `main`, and verify GitHub Actions plus Vercel.
