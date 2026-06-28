# CSTD Comparison Brief Design

The comparison matrix already carries goal and project context, but visitors cannot hand that decision state to another person without manually rewriting the evidence. The next improvement should make the existing matrix portable while preserving the current URL-state model.

## Goal

Add one comparison-local copy action that produces a concise, honest decision brief for the active goal and selected projects.

## Behavior

- The brief names the active goal, selected projects, selection status, and shareable comparison URL.
- A complete comparison includes every existing evidence row in matrix order.
- An incomplete comparison explicitly asks the visitor to add another project instead of implying that a decision is ready.
- The copied URL targets `#project-comparison` and preserves goal and comparison query state.
- Clipboard support is checked through one guarded adapter shared by all homepage copy actions.

## Validation

- Pure-helper tests cover complete and incomplete briefs.
- URL-state tests cover the comparison hash contract.
- Source-contract tests prevent direct unguarded clipboard access from returning.
- Browser QA verifies visible feedback, responsive controls, no horizontal overflow, and no console warnings/errors on desktop and 390px mobile.
