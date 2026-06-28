# CSTD Project Match Design

## Context

The homepage already exposes project evidence, capability lanes, filtering, focused case studies, and comparison. The next improvement must stay inside those surfaces instead of adding another unrelated section. The current goal guide jumps directly to a case study, so visitors cannot inspect why a project matches before committing to the deeper view. Homepage URL state is also initialized only once, so browser back/forward cannot restore in-page choices.

## Product change

- Turn the existing goal guide into a selectable project match surface.
- Show one concise recommendation with the goal rationale, current status, delivered outcome, and two clear actions: inspect the case study or open the live project.
- Store the selected goal in the URL so the recommendation can be shared.
- Centralize category, query, goal, and focused-project URL state in one tested helper.
- Listen for `popstate` so browser back/forward restores the visible homepage state.

## Interaction rules

- Goal choices behave as a single-select group with `aria-pressed` state.
- Invalid URL values fall back safely to the unfiltered directory with no selected goal or project.
- Search typing replaces the current history entry; deliberate goal, focus, and close actions create navigable entries.
- Project focus preserves the active directory and goal context.
- Closing a focus view returns to the same directory context.

## Verification

- Unit tests cover parsing, URL serialization, invalid values, and context preservation.
- Browser checks cover match selection, recommendation actions, URL state, back/forward restoration, desktop/mobile overflow, and console output.
