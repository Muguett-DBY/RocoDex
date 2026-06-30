# CSTD Goal Copy Warning Design

## Problem

The selected-goal copy control reports unsupported or failed clipboard access, but the rendered feedback currently uses the same success-colored treatment as a completed copy. That makes the recovery state less clear and leaves the manual-copy requirement encoded in component conditionals instead of a tested presentation contract.

## Decision

Introduce a goal-copy presentation helper that returns the message, tone, and manual-copy requirement for each clipboard outcome. Use `success` only for completed copies and `warning` for unsupported or failed copies.

## Acceptance

- Successful goal-path copies keep success feedback and do not ask for manual copying.
- Unsupported and failed copies are warning outcomes.
- Warning outcomes explicitly require the manual read-only URL fallback.
- The component derives fallback visibility from the presentation contract.
