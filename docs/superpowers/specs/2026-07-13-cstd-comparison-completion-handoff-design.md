# CSTD Comparison Completion Handoff Design

**Date:** 2026-07-13

## Problem

The mobile project cards correctly keep the first comparison selection in place so visitors can choose a second project. Completion has no equivalent handoff:

- At 390 x 844, selecting `洛克图鉴 / RocoDex` leaves the comparison section 4,522.8 pixels below the viewport.
- After selecting `奶黄包摄影` as the second project, the comparison is ready but the URL still ends in `#projects`, focus stays on the card button, and the result remains 3,662.8 pixels below the viewport.
- Reaching the result requires another 4,411 pixels of scrolling from the second selection.
- Even after manually reaching the section, the existing recommended next action begins at 1,076 pixels and is outside the first result viewport.

The selected button state is sufficient feedback for `1 / 2`; the missing product behavior is a deliberate transition from selection to decision when the comparison becomes complete.

## Goals

- Keep the first selection in place with its current pressed state and focus.
- Detect only the transition from an incomplete comparison to the two-project limit.
- On that transition, serialize `#project-comparison`, align the result to the established 96-pixel header offset, and move focus to the result heading.
- Put the existing recommended next action inside the first result viewport on mobile.
- Preserve every comparison field, selected-project control, matrix row, URL parameter, restored-link behavior, and desktop capability.
- Add deterministic unit and browser regressions for completion, focus, ordering, and restored-state behavior.

## Non-goals

- Do not add a fixed or sticky comparison tray.
- Do not auto-scroll after the first selection or after removing an item.
- Do not change the two-project limit, matching logic, recommendation logic, or copied brief.
- Do not focus the heading when a visitor opens a restored comparison URL.
- Do not add React state for data that already exists in the URL and comparison selection.

## Options considered

### 1. Auto-scroll only

This removes the 4,411-pixel external scroll but leaves the recommended action at 1,076 pixels, outside the arrival viewport. The visitor reaches a summary but not the next decision.

### 2. Fixed mobile comparison tray

A persistent tray can expose progress and a result link, but it introduces content occlusion, safe-area handling, dismissal semantics, and another fixed layer. The first selection already has a clear pressed button, so the added surface is not justified.

### 3. Completion handoff plus next-action priority

This option preserves first-selection browsing, uses the existing comparison target and URL model, and eliminates the completed-state dead end. A DOM prototype placed the existing next-action panel at 572.7-762.7 pixels after result alignment, fully inside the 390 x 844 viewport.

**Decision:** use option 3.

## Interaction contract

### First selection

1. Add the project to the comparison.
2. Keep the current scroll position and button focus.
3. Keep the URL on the project browsing hash.
4. Expose the existing selected button state and `1 / 2` live summary.

### Completion selection

1. Detect the transition from fewer than two selected projects to exactly two.
2. Mark the handoff as originating from the current interaction.
3. Push the same comparison query with `#project-comparison`.
4. After React renders the ready result, align the section to its scroll margin.
5. Programmatically focus the `项目对比` heading without adding it to normal tab order.
6. Show the existing scan summary and recommended next action before detailed selected-project, goal-fit, and matrix evidence.

### Restored URLs

Opening a URL ending in `#project-comparison` retains the existing scroll restoration. Because no current comparison-completion interaction is pending, the page must not move keyboard focus automatically.

## Architecture

- Add a pure completion-edge helper to `src/lib/cstd-project-comparison.ts` and cover incomplete, complete, removal, and already-complete transitions.
- Add one ref in `CstdLanding` to distinguish an interaction handoff from URL restoration without introducing render state.
- Reuse the existing comparison scroll effect and stable IDs. When the ref is pending, focus `#project-comparison-heading` after alignment and clear the ref.
- Give the heading `tabIndex={-1}` and a visible programmatic focus treatment.
- Reorder the existing `对比下一步` block before the selected-project list. No content or callbacks change.

## Accessibility

- The initiating button remains a native pressed button.
- Completion moves focus to a named heading at the new visual location, preventing focus from remaining on an offscreen card.
- The heading is programmatically focusable but is not added to sequential tab navigation.
- Restored deep links do not unexpectedly steal focus.
- The existing live comparison summary and all remove/clear controls remain intact.

## Verification

- Unit tests prove the completion-edge helper only returns true for incomplete-to-complete transitions.
- Desktop and mobile Playwright tests prove first-selection position/focus stability, completion URL/hash, aligned result, heading focus, next-action visibility, content order, overflow, and zero browser issues.
- Existing restored-context tests prove restored comparison links continue to align without interaction-driven focus transfer.
- Local production and live production checks measure 320, 390, and 1280 behavior and visually inspect first selection, completion arrival, and restored comparison states.

## Risks

- **Unexpected scroll:** constrained to the explicit second selection that completes the fixed two-project comparison.
- **Focus race:** focus occurs in the existing post-render animation frame and is guarded by an interaction-only ref.
- **History regression:** the handoff uses the existing URL builder and `pushState`; browser back retains the prior selection entry.
- **Result hierarchy regression:** only the existing next-action block moves; selected projects, fit evidence, and matrix remain in their current order after it.
