# Mobile Navigation Focus Return Check Plan

## Stage 5 Closed Loop

1. Add a failing source contract test for Escape focus restoration.
2. Implement a menu button ref, default-preventing Escape handler, and post-close focus restoration.
3. Run focused tests, local CI/audit/hygiene, full tests, and build.
4. Verify in the browser by focusing a mobile menu link, pressing `Escape`, and checking focus returns to the menu button.
5. Commit, push `main`, wait for GitHub Actions, confirm Vercel, run live verification, and update logs.
