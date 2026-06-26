# CSTD Project Controls UIUX Design

## Problem

The project directory now has category filters, keyword search, focus cards, and adjacent navigation. On mobile, the search box and filter chips are usable, but the active state is split across controls and count text. Visitors have no compact explanation of what is currently applied unless they infer it from the selected chip and search input.

## Decision

Add a compact project controls status row that names the active filter/search state in one line and exposes a single reset action when any control is active. Keep the existing search and segmented filters, but make the control panel read as one responsive toolbar.

## Acceptance

- Default state says the directory is browsing all projects and does not show reset.
- Category-only, search-only, and category-plus-search states have distinct summaries.
- Reset clears both search and category state.
- Mobile and desktop layouts keep controls visible without horizontal overflow.
