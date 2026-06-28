# CSTD Workflow Navigation Design

Stage 3 made the project workflow visible, but its four status tiles are still passive. On a long homepage, visitors can understand their state without being able to move directly to the goal guide, evidence, comparison, or filtered directory that resolves it.

## Approaches Considered

1. Add anchor links to the four tiles only. This is compact, but it leaves visitors to infer which destination is the best next step.
2. Add one contextual call to action only. This gives a recommendation, but removes the value of jumping to any of the four existing surfaces.
3. Combine navigable status tiles with one contextual next-step action. This keeps the summary dense, preserves free navigation, and gives the incomplete workflow one clear continuation.

The third approach is selected because it advances the existing decision workflow without adding a new homepage section or dependency.

## Behavior

- Each workflow item exposes a stable in-page destination: `#project-guide`, `#project-evidence`, `#project-comparison`, or `#project-directory`.
- The comparison item targets the directory when no comparison exists, avoiding a broken anchor.
- With no goal, the next action sends the visitor to goal matching.
- With a selected goal and an incomplete comparison, the next action sends the visitor to the recommendation or directory needed to add the remaining project.
- With a complete comparison, the next action sends the visitor to the restored comparison matrix.
- Destination surfaces use scroll margins so sticky mobile navigation does not cover their headings.

## Interface

- `getCstdProjectWorkflowSummary` returns an `href` with every existing status item.
- `getCstdProjectWorkflowAction` returns one label, supporting detail, and safe destination from the same goal/comparison state.
- `ProjectWorkflowSummary` renders semantic navigation links and a single next-step link with visible keyboard focus.

## Validation

- Unit tests cover all item destinations and the no-goal, incomplete-comparison, and ready-comparison actions.
- Existing URL-state and comparison tests remain unchanged.
- Browser QA covers all four destinations, the contextual action, desktop and 390px mobile layout, horizontal overflow, and console health.
