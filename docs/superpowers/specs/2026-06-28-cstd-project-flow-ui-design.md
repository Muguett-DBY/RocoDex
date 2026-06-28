# CSTD Project Flow UI Design

The CSTD project section now has strong pieces: capability lanes, goal matching, evidence, share actions, directory controls, case focus, and URL-backed comparison. The experience issue is scanning cost. Visitors need to infer how those pieces connect, and a shared comparison link renders the decision matrix too far below the goal and evidence surfaces.

## Goals

- Add a compact project-decision summary near the section heading.
- Surface the current goal, comparison readiness, directory count, and shareability in one scan.
- Move the active comparison matrix closer to goal matching so URL-backed comparisons feel intentional.
- Keep the design responsive, dense, and compatible with the existing CSTD visual language.

## Behavior

- The summary shows four concise status tiles: goal path, evidence base, comparison readiness, and share state.
- Goal and comparison values update from the same state used by the URL-backed workflow.
- The active comparison matrix appears after the goal guide and before evidence/share blocks.
- Mobile layout stacks the summary tiles in one column; larger screens use two to four columns.

## Validation

- Unit tests cover the summary helper and responsive class contract.
- Browser QA covers direct comparison links, recommendation flow, desktop and 390px mobile layouts, no horizontal overflow, and console health.
