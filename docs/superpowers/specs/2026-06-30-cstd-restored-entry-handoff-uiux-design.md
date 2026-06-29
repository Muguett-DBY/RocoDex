# CSTD Restored Entry Handoff UIUX Design

## Goal

Upgrade the restored directory and focused project entry actions from simple alert rows into one coherent, responsive handoff pattern that is easier to scan and tap.

## User-Facing Behavior

- Restored entry receipts keep their current labels and URL semantics.
- Each restored entry shows a clearer two-part hierarchy: restored state first, recommended next step second.
- The next-step action uses a full-width mobile button with a larger tap target and an auto-width desktop button.
- Directory and focus handoffs share the same component structure while keeping their blue/green tone differences.

## Constraints

- Keep the handoff inside the existing Project index and Project case-study surfaces.
- Do not add another homepage panel.
- Do not change URL parameters, copy text payloads, or restored-state clearing behavior.
- Preserve keyboard focus visibility and assistive status announcement.

## Verification

- Source-contract tests for the reusable handoff component, status semantics, responsive grid, and mobile tap target.
- Mobile-layout tests for shared restored-entry class tokens.
- Browser checks on restored directory and focus links at desktop and 390 px mobile.
