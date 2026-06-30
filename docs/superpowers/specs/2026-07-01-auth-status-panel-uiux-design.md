# Auth Status Panel UI/UX Design

## Problem

The login and registration pages now correctly block account actions while storage is checking or unavailable, but the UI still feels like a plain inline alert. The same markup is duplicated across both pages, the disabled primary action does not explain why it is unavailable, and the recovery link reads more like text than the next safe action.

## Goal

Make the account-service status a polished, reusable, and responsive product surface on login and registration. Visitors should immediately understand whether the account service is checking, unavailable, or ready, why the primary action is disabled, and where they can safely continue.

## Approach

- Add a reusable `AccountStatusPanel` component for loading, disabled, and unavailable states.
- Use restrained icons from the existing `lucide-react` dependency: a spinner for checking, a warning icon for blocked states, and an arrow for the recovery action.
- Make the recovery action a 44 px touch-safe link styled like a secondary action instead of a small text link.
- Add an explicit helper under the submit button while account actions are blocked.
- Improve auth card spacing responsively with smaller mobile padding and the existing rounded card visual language.

## User-Visible Changes

- Login and registration show the same mature account-status panel instead of duplicated plain alerts.
- The checking state has a clear spinner and live status semantics.
- The unavailable state has a clear recovery action that is easy to tap on mobile.
- Disabled login/register buttons are paired with a visible reason, so users do not have to infer why the button is unavailable.

## Accessibility And Responsive Requirements

- Status panels use `role="status"` and `aria-live="polite"`.
- The checking panel sets `aria-busy="true"`.
- Decorative icons are hidden from assistive technology.
- The recovery action is at least 44 px tall and full width on narrow screens.
- The submit helper is connected with `aria-describedby` while the button is blocked.

## Verification

- Add component rendering tests for checking and blocked status panels.
- Add source-contract tests that login and registration use the shared panel and disabled helper.
- Run focused Vitest tests, lint, typecheck, full tests, build, E2E, audit, and diff checks.
- Verify local and live login/register pages in the in-app Browser at 390 x 844 and desktop width: checking state, unavailable state, disabled helper, recovery action, no overflow, no framework overlay, and zero console warnings/errors.
