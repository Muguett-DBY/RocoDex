# Account Status Preflight Design

## Problem

Production can have Auth.js configured while the account storage endpoint is unreachable. In that state the register API now returns a controlled 503, but visitors only learn this after filling the form and submitting it. The login/register experience also does not distinguish between a missing auth secret and temporarily unavailable account storage.

## Scope

- Add a small account-service status model with three user-facing states:
  - ready
  - auth disabled
  - storage unavailable
- Add a read-only account status API that checks auth configuration first, then probes user storage without creating or deleting data.
- Update the register page to preflight account status and show an actionable message before submission when storage is unavailable.
- Keep storage details and secret values out of public responses.

## Acceptance

- The pure status model returns stable messages and actions for all states.
- The status API returns a `200` diagnostic payload for ready, disabled, and unavailable account service states so the browser preflight does not create console resource errors.
- Storage-unavailable checks log as warnings, not error-level crashes.
- The register page calls `/api/account-status`, shows the unavailable state, links to local collection, and disables submit while the account service is blocked.
