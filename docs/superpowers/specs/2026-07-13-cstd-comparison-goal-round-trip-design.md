# CSTD Comparison Goal Round Trip Design

**Date:** 2026-07-13

## Problem

The completed comparison now hands visitors directly to a decision result, but its `选择目标路径` continuation does not complete the round trip:

- On production at 390 x 844, the action aligns `#project-guide` at 96.5 pixels but leaves keyboard focus on the now-offscreen comparison button. Pressing Tab continues after the comparison in DOM order and skips the goal choices that were just brought into view.
- The URL remains on `#project-comparison`, so the address no longer describes the visible section.
- Selecting `查精灵资料与玩法工具` correctly preserves `compare=rocodex,photography` and the `2 / 2` comparison, but the default URL builder changes the hash to `#projects`.
- The updated comparison then begins 1,391.5 pixels below the viewport, requiring about 1,295 pixels of manual scrolling to realign it to the established 96-pixel result position.
- The selected goal and updated fit are correct, but there is no contextual return action from the guide.

This is a navigation-state problem: ordinary goal browsing should stay in the guide, while a `#project-guide` view that carries an active comparison should return to that comparison after the requested choice.

## Goals

- Give the outbound goal-selection step an accurate `#project-guide` URL.
- Move programmatic focus to the goal-guide heading so keyboard navigation continues through the five goal buttons.
- Preserve every selected comparison project while a goal is chosen.
- Return goal selection from a comparison-preserving `#project-guide` view to `#project-comparison` after a non-null goal is selected.
- Align and focus the updated comparison result, exposing its revised next step and fit judgment in the first result viewport.
- Preserve ordinary goal selection, restored URL behavior, browser history, comparison limits, project data, and external actions.
- Add deterministic URL, focus, state-preservation, history, and overflow regression coverage.

## Non-goals

- Do not duplicate the five goal choices inside the comparison result.
- Do not add a sticky tray, modal, drawer, or fixed mobile control.
- Do not automatically replace either compared project when the selected goal points to a third project; the existing explicit `补入目标直达项目` action remains responsible for alignment.
- Do not return ordinary guide browsing to the comparison.
- Do not focus headings for restored links or browser back/forward navigation.
- Do not change recommendation copy, fit calculation, copied summaries, project URLs, or the two-project limit.

## Options considered

### 1. Inline goal selector inside the comparison

This removes all travel, but duplicates the guide's five choices and their future maintenance. It also makes the compact decision result substantially denser on mobile.

### 2. Manual return action after goal selection

This keeps the guide canonical and is simple to implement, but visitors still need to discover and activate another control. It does not repair the outbound keyboard-focus failure by itself.

### 3. Provenance-aware round trip

The comparison action serializes `#project-guide` and uses a transient flag only to focus the guide heading. A subsequent non-null goal selection derives its return behavior from the current guide hash plus the preserved comparison query, serializes `#project-comparison`, and focuses the updated result. Normal guide selection without comparison state remains unchanged.

**Decision:** use option 3. It fixes URL semantics, keyboard order, and the measured 1,295-pixel return cost without adding or duplicating UI.

## Interaction contract

### Leave the comparison

1. Mark the current interaction as a comparison-to-guide handoff.
2. Push the existing project state with `#project-guide`; keep filter, query, focused project, goal, and comparison IDs intact.
3. Align the guide to its existing scroll margin.
4. Focus the `按目标找项目` heading without adding it to sequential tab order.
5. The next Tab key moves to the first goal button.

### Select a goal during the handoff

1. Accept the selected non-null goal through the existing guide controls.
2. Preserve the complete comparison ID list and clear only the existing focused-project state, as current goal selection already does.
3. Push the updated state with `#project-comparison` instead of the default `#projects`.
4. Clear the transient guide-focus marker and mark one interaction-driven comparison focus transfer.
5. After React renders the selected guide and recomputed fit, align the result and focus `项目对比`.
6. Keep the revised next-step action first in the result body.

### Ordinary guide selection

Goal choices without an active comparison keep the existing `#projects` behavior and retain focus on the selected goal button. A restored or history-reached `#project-guide` URL with comparison IDs remains a valid decision continuation and returns to the updated comparison when a goal is selected.

### History and restored URLs

- Back from the updated result returns to the comparison-preserving `#project-guide` entry and removes the selected goal through the existing `popstate` state sync.
- Forward restores the goal and aligned result but does not treat history navigation as a new focus handoff.
- Direct `#project-guide` and `#project-comparison` URLs align their named sections without stealing focus.

## Architecture

- Extend `CstdProjectViewHash` with `project-guide`; keep query parsing unchanged because the hash carries navigation, not domain state.
- Add transient comparison-to-guide focus state in `CstdLanding`. It is render state because it drives a post-render guide alignment/focus effect and is intentionally not serialized; the URL hash and comparison query carry the durable return semantics.
- Generalize the existing comparison-completion focus ref so the same one-shot result-focus mechanism can serve completion and goal-return interactions.
- Add a guide alignment effect keyed by synchronized view state and handoff state. It always aligns a `#project-guide` URL, but focuses the heading only for the direct outbound interaction.
- Include `selectedGuideId` in the comparison alignment effect so the result realigns after fit recomputation. Focus remains guarded by the one-shot interaction ref.
- Clear transient focus markers on `popstate`; history state remains recoverable from the hash and query alone.
- Keep `ProjectGuide` and `ProjectComparison` data APIs unchanged except for the existing callbacks; add only a stable heading ID, `tabIndex={-1}`, and visible focus treatment.

## Accessibility

- Both transitions land focus on a descriptive heading at the new visual location.
- Programmatic headings remain outside normal tab order.
- The first goal button follows the guide heading in DOM order, making the requested choices reachable with one Tab.
- Ordinary selection retains native button focus and `aria-pressed` feedback.
- Restored URLs and history movement do not unexpectedly move keyboard focus.

## Verification

- Unit coverage proves the URL builder can serialize `#project-guide` while preserving goal and comparison parameters.
- Source-contract coverage proves the outbound state marker, guide URL, guide heading focus, selected-guide dependency, and one-shot result focus remain wired.
- Desktop and mobile E2E coverage proves outbound URL/position/focus, one-Tab access to the first goal, preserved `2 / 2` state, return URL/position/focus, updated next step and fit, browser history, restored-link behavior, overflow, and zero browser issues.
- Local and production browser checks measure 320 x 800, 390 x 844, and 1280 x 720 behavior and visually inspect guide arrival and updated-result arrival.

## Risks

- **Stale focus intent:** clear transient focus markers on goal selection and `popstate`; derive durable return behavior from `#project-guide` plus non-empty comparison state.
- **Focus race:** both headings are focused in post-render animation frames with `preventScroll`, after their sections are aligned.
- **History drift:** every transition uses the existing URL builder and `pushState`; back/forward remains owned by the existing `popstate` sync.
- **Ordinary-flow regression:** the special return hash requires both `#project-guide` and non-empty comparison state, leaving goal selection without comparison context on its current default path.
