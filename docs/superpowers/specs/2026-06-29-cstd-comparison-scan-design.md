# CSTD Comparison Scan UI Design

Stage 2 made the comparison more useful by adding goal-fit signals. The current surface still asks visitors to read selected projects, fit judgment, and evidence rows as separate blocks. On mobile this creates a long vertical stack where the decision answer is not immediately summarized.

## Goal

Make the CSTD comparison decision surface easier to scan without changing the existing URL state, project evidence, or recommendation logic.

## UI/UX Direction

- Add a compact scan summary near the comparison header: direct match, reference project, and evidence completeness.
- Make selected project rows fit-aware so the selected project list visually leads into the fit band.
- Keep the fit band separator-based, not a nested card.
- Keep the evidence matrix aligned on desktop and stacked on mobile with stable widths and clear project labels.
- Preserve existing copy controls and failure/success feedback.

## Interaction And Accessibility

- The scan summary is a semantic list with `aria-label="对比扫读摘要"`.
- Fit labels are text labels, not color-only signals.
- Remove buttons keep their existing per-project accessible names.
- The page keeps the direct `#project-comparison` anchor restoration from Stage 2.

## Validation

- Pure-helper tests cover direct-fit, no-goal, and missing-direct summaries.
- Source-contract tests prove the scan summary, fit-aware selected rows, and helper wiring render in the CSTD landing page.
- Browser QA covers desktop and 390 px mobile comparison deep links, scan summary visibility, copy feedback, overflow, and console health.
