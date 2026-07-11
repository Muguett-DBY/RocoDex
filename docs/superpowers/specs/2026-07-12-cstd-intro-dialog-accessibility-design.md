# CSTD Intro Dialog Accessibility Design

## Problem

The automatic CSTD first-visit intro visually blocks the whole page but is rendered as a plain `div`. Live keyboard verification found that it has no dialog name or modal semantics, does not receive initial focus, allows Tab to move into the hidden page after its two controls, and ignores Escape.

This creates a mismatch between what sighted visitors see and what keyboard or assistive-technology users can operate.

## Decision

Use the browser's native modal `dialog` behavior while preserving the current CSTD intro visuals and timing.

- Render the intro root as a full-viewport `motion.dialog`.
- Open it with `showModal()` so the page behind it becomes inert and keyboard focus stays inside the intro.
- Give the dialog a stable accessible name and explicit modal semantics.
- Focus `开启 CSTD` during the idle phase and `直接浏览项目` during playback.
- Treat Escape as the same explicit skip action as `直接浏览项目`.
- Lock page scrolling while the dialog is mounted and restore the previous body style on cleanup.
- Close the native dialog during cleanup so browsers can restore focus to the control that replayed the intro.

## Alternatives Considered

- Keep the existing `div` and implement a custom focus trap. Rejected because native dialog behavior covers focus containment, background inertness, and focus restoration with less code and fewer keyboard edge cases.
- Remove the automatic intro. Rejected because the intro is an intentional first-viewport brand experience and can be made accessible without removing it.

## Interaction Flow

1. On an eligible first visit, the modal opens and focuses `开启 CSTD`.
2. Shift+Tab moves to `直接浏览项目`; Tab cycles back to `开启 CSTD` without reaching the underlying header.
3. Starting playback moves focus to `直接浏览项目`, which remains available throughout the timed sequence.
4. Escape or the skip button records the intro as seen and closes it.
5. When the intro is replayed from page controls, closing returns focus to `播放开场`.

## Scope

- Change only the CSTD intro container and its two controls.
- Preserve animation timing, audio behavior, first-visit eligibility, reduced-motion handling, and project-view-state intro suppression.
- Do not add new visible UI or alter the RocoDex surface.

## Failure Handling

- Guard `showModal()` with the dialog's `open` state so React effect re-entry cannot open it twice.
- Restore the exact previous body overflow value during cleanup.
- Prevent the native cancel event from closing independently of React state; route it through the existing skip handler.

## Acceptance

- The intro is exposed as a named modal dialog on desktop and mobile.
- Initial and playback focus land on the intended controls.
- Tab and Shift+Tab cannot reach the underlying page while the intro is open.
- Escape closes the intro through the existing skip path.
- Replayed intros restore focus to `播放开场` after closing.
- The page does not scroll behind the intro and the prior overflow style is restored afterward.
- Existing intro animation, audio, motion-preference, URL-state, layout, build, and E2E checks remain green.
