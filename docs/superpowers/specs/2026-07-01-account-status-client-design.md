# Account Status Client Design

## Problem

The production storage probe can take more than ten seconds before reporting an unavailable Redis endpoint. Registration is safely blocked during that window, but the page does not explain why. Login still submits credentials directly and can translate a storage failure into a generic invalid-credentials message.

## Scope

- Add a shared client loader with a six-second timeout and unavailable fallback.
- Add a small shared React hook for account status loading.
- Show an explicit checking state on registration and login.
- Block login until the status is ready and show the same local-collection recovery action when unavailable.

## Acceptance

- Ready responses are returned unchanged.
- failed, non-OK, and timed-out requests resolve to the public unavailable state.
- Registration and login are disabled while checking.
- Login does not call Auth.js while status is disabled or unavailable.
- Both pages preserve access to browser-local collection tools.
