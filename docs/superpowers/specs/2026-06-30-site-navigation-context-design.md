# Site Navigation Context Design

## Stage

- Date: 2026-06-30
- Orchestrator: `03_LONG_6_STAGE_MAIN_V2.txt`
- Stage: 1 / 6, `IMPROVE`
- Scope: cross-page navigation consistency outside the CSTD workflow.

## Problem

The global header lists the main RocoDex modules, but it treats every link as a static destination. Detail pages such as creature, guide, and team pages do not expose which primary section is active, and the page shell has no compact next-step context after navigation. The result is especially weak on entry from search or shared links, where a reader lands deep inside the site without a clear module label or adjacent route.

## User Outcome

- Header links should mark the active primary module for exact and nested routes.
- A compact site context strip should tell the reader where they are and provide two useful next destinations.
- The solution should include `/collection` even though collection keeps its existing count-aware header link.
- The strip must be subtle and full-width, not another card-heavy page section.

## Constraints

- Keep CSTD-specific workflow surfaces untouched in this stage.
- Keep the existing `CollectionNavLink` behavior.
- Use pure helpers for route matching so behavior is testable without browser-only code.
- Preserve static build compatibility.

## Acceptance

- Nested route `/creatures/001` resolves to the `精灵列表` module.
- Nested route `/guides/example` marks the guides header link with `aria-current="page"`.
- `/collection` receives context and related links without duplicating the count-aware collection header link.
- `PageShell` renders the context strip below the sticky header.
- Focused tests, lint, full tests, build, and browser checks pass before commit.
