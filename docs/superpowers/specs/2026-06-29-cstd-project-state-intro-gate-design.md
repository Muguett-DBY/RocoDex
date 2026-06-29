# CSTD Project State Intro Gate Design

## Problem

First-time visitors opening a restored CSTD project view can still see the automatic intro overlay when the URL does not include a direct `project=` focus parameter. This affects shared comparison and goal links such as:

`/cstd?goal=ai-creation&compare=design%2Ccrm#project-comparison`

The page restores the comparison state, but the intro controls remain visible over the shared decision surface.

## Scope

- Treat any valid project view-state parameter as an intentional restored state:
  - `category`
  - `q`
  - `goal`
  - `project`
  - `compare`
- Keep plain `/cstd` first visits eligible for the automatic intro.
- Ignore invalid URL parameters so malformed links do not suppress the intro.
- Keep explicit replay behavior unchanged.

## Acceptance

- A pure helper reports whether a search string contains active, valid CSTD project view state.
- Automatic intro playback is skipped for restored project view state, not only direct project focus links.
- Existing URL sync and comparison hash behavior stays unchanged.
- Local and live desktop/mobile checks confirm comparison deep links are not blocked by the intro on a clean first visit.
