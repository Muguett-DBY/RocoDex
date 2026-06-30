# CSTD Goal Directory Continuation Design

## Problem

Selecting a homepage goal reveals a strong project match, but the next actions jump to the case, comparison, or live product. A visitor who wants to scan related work must manually find the directory and recreate the relevant category filter.

## Decision

Add a goal-aware directory continuation to the selected match panel. It derives the matched project's category, human-readable category label, and category project count from the existing project and filter data. Activating it clears stale directory search text, keeps the selected goal in URL state, selects the matched category, and scrolls to the project directory.

## Acceptance

- Every valid goal can produce a directory continuation.
- The continuation reports the category label and current category project count from source data.
- The action preserves the selected goal while setting the directory category and clearing search text.
- The directory receives focus through scrolling without introducing horizontal overflow or console errors.
