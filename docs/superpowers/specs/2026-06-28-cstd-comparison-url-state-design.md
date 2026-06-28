# CSTD Comparison URL State Design

The previous stage made goal matching shareable, but the project comparison selection still lives only in React state. A visitor can select two projects, but reload, copy, or browser history loses the comparison.

## Goals

- Store selected comparison projects in the existing CSTD homepage URL state.
- Keep comparison state when visitors filter, search, select a goal, open a case study, close a case study, or copy the current view.
- Reject invalid, duplicate, and non-live projects from URL state.
- Add a direct comparison handoff from the selected goal recommendation so a matched project can become a comparison candidate without rescanning cards.

## Behavior

- The URL uses `compare=<id,id>` for up to two live project IDs.
- `parseCstdProjectViewState` returns normalized comparison IDs.
- `buildCstdProjectViewHref` serializes comparison IDs along with `category`, `q`, `goal`, and `project`.
- Project card comparison buttons update the URL through history so back/forward can restore comparison state.
- The recommendation panel shows a comparison button using the same selected, disabled, and removable states as project cards.

## Validation

- Unit tests cover comparison ID normalization and unified view-state parsing/serialization.
- Local gates cover lint, full tests, and production build.
- Browser checks cover URL-backed comparison reload, recommendation-to-compare handoff, mobile width, and console health.
