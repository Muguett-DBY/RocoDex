# CSTD Goal Share Receipt Design

## Problem

A clean goal-share URL now restores the selected goal and match, but recipients are not explicitly told that the match came from a shared target path. The workflow summary updates, yet the selected-match panel itself reads like an ordinary local selection.

## Decision

Add a compact restored-goal receipt inside the selected-match panel when a valid `goal` was restored from URL state without project focus or comparison state. Keep the share URL contract unchanged: only `goal` and `#projects` are required.

## Acceptance

- A valid restored goal link produces a concise receipt naming the restored goal and recommended project.
- Ordinary in-page goal selection does not show the restored receipt.
- Project focus and comparison restored states keep their existing handoffs.
- The selected-match panel keeps its existing primary, comparison, live-link, directory, copy, and clear actions.
