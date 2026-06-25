# CSTD Shareable Project Focus Design

## Goal

Let visitors focus on one project case study and share that exact context without creating separate routes or duplicating project content.

## Experience

- Every project card has a `查看案例` command.
- Selecting a project opens an inline focus section above the grid.
- The address becomes `?project=<id>#project-focus`.
- A copy action provides visible success, unsupported, or failure feedback.
- Closing focus removes the query and returns to the project directory.
- Invalid project IDs are ignored instead of producing an empty or broken state.

## Architecture

Pure URL and clipboard-result helpers live in `src/lib/cstd-project-focus.ts`. `CstdLanding` owns selected-project and copy-feedback state, synchronizes selection with browser history, and renders project data from the shared `cstdProjects` module.

## Error Handling

- Unknown IDs resolve to no selected project.
- Missing clipboard support shows a manual-copy message.
- Clipboard rejection shows a retry/manual-copy message.
- No network request or route handler is required.

## Verification

- Unit tests cover valid and invalid parsing, root and `/cstd` paths, and all copy outcomes.
- Browser checks cover selection, URL change, copy feedback, close behavior, reload from a deep link, mobile overflow, and console health.
