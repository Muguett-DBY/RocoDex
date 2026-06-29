# CSTD Restored Case Handoff Completion Design

## Goal

Complete the restored case-study handoff at the point of action so visitors can copy evidence, understand the result, recover from clipboard restrictions, and continue to the live project without searching lower in the page.

## User-Facing Behavior

- A restored case link keeps the current receipt and recommended copy action.
- Copy success changes the top action to a completed state and announces the result beside the action.
- Clipboard unsupported or failed states expose the case summary in a labelled read-only field inside the same handoff.
- The restored case handoff includes a secondary live-project link next to the copy action.
- Non-restored case visits keep the existing action-rail copy feedback and fallback behavior.

## Architecture

- Add a pure copy-presentation helper to map `copied`, `unsupported`, and `failed` results to labels, messages, tones, and manual-copy requirements.
- Extend `RestoredEntryHandoff` with optional completion feedback, manual-copy text, and a secondary external action.
- Keep the directory handoff on its current single-action path.
- Avoid duplicate feedback and fallback fields when the restored top handoff owns the copy result.

## Constraints

- Preserve all public URL parameters, hashes, copy payloads, and restored-receipt clearing behavior.
- Do not add a new homepage section or dependency.
- Keep actions at least 44 px high and full width on mobile.
- Generate the rendered manual-copy brief only when a fallback is actually required.

## Verification

- Unit tests for all copy-presentation outcomes.
- Source and mobile-layout contracts for localized feedback, manual fallback, and the live-project action.
- Browser verification for success and restricted-clipboard paths at desktop and 390 px mobile.
