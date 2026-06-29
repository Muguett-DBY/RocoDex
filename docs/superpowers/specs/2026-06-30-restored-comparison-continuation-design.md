# Restored Comparison Continuation Design

## Goal

Make restored CSTD comparison links self-explanatory immediately after the intro is skipped. A recipient who opens a shared comparison URL should understand what was restored and what to do next without hunting through the full comparison matrix.

## Current Gap

- Restored comparison links correctly skip the intro and land on the comparison section.
- The comparison header confirms that the shared view was restored, but the actionable continuation still lives lower in the decision band.
- On mobile, that makes the restored-link landing state feel more like a static receipt than a handoff.

## Proposed Change

- Keep the existing comparison section and URL contract.
- Extend the restored comparison receipt with a compact continuation summary derived from the existing comparison next-step model.
- Render that continuation inside the current comparison header receipt, not as a new homepage panel.
- Add one top-level action in the restored receipt that triggers the same next-step handler as the decision band.

## Boundaries

- Do not change auth or registration behavior.
- Do not add a new route, dependency, or homepage section.
- Do not change the comparison URL parameters or hash contract.
- Preserve the existing full decision band for users who want the complete reasoning.

## Acceptance

- Restored comparison URLs show a header-level restored receipt with a clear next action.
- The action follows the existing next-step behavior: focus target case, align missing target, or return to goal selection.
- Plain non-restored comparisons remain unchanged.
- Desktop and mobile layouts avoid horizontal overflow and console warnings/errors.
