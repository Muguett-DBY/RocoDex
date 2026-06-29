# Mobile Navigation Keyboard Dismissal Plan

## Stage 4 Closed Loop

1. Add failing tests for the dismissal helper and header source contract.
2. Implement the helper and wire `Escape` handling through the header container.
3. Run focused tests, diff hygiene, lint, full tests, and build.
4. Restart local production server and verify opening then pressing `Escape` at 390 x 844.
5. Commit and push `main`, wait for GitHub Actions, confirm Vercel, verify live, then record evidence.
