# Home Account Continuity Design

## Problem

Login and registration now explain account-storage outages well, but visitors only see that recovery path after choosing an account action. On the homepage, the header still exposes login/register as ordinary actions while production storage may be unavailable, so the first account interaction can feel like a dead end.

## Goal

Surface a quiet, useful account-continuity notice on the homepage when the account service is blocked. The homepage should point visitors to the same local collection continuation before they invest time in login or registration.

## Approach

- Add a small client component, `HomeAccountContinuity`, that reuses the existing bounded account-status hook.
- Render nothing while the status is still loading or ready, keeping the homepage fast and calm in healthy environments.
- When status is disabled or unavailable, render the existing `AccountStatusPanel` below the homepage search box.
- Keep the panel inside the hero's existing content column so it is visible in the first viewport without adding a new section.

## User-Visible Changes

- If account storage is unavailable, homepage visitors see a clear explanation and a local-collection recovery action before opening login/register.
- Healthy environments do not gain a permanent account banner.
- The recovery UI remains consistent with login and registration.

## Verification

- Add source-contract tests that the homepage renders `HomeAccountContinuity` and the component only renders blocked states.
- Run focused tests, full local gates, and Browser checks for homepage mobile/desktop outage visibility, recovery click-through, no overflow, no framework overlay, and console health.
