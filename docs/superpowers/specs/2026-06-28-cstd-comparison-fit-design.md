# CSTD Comparison Fit Design

The comparison matrix now exposes evidence and can copy it, but it still leaves the visitor to infer why one project directly fits the selected goal while another is only useful as a reference. The existing goal guide already owns that mapping, so the comparison can explain it without inventing scores.

## Goal

Turn the existing goal-to-project mapping into a transparent decision signal inside the comparison and its copied brief.

## Behavior

- The guide's mapped project is labeled `目标直达` and reuses the guide's existing reason.
- Other selected projects are labeled `横向参照`; copy explains that they are evidence references, not direct recommendations for the active goal.
- If the mapped project is absent, the summary says the direct match is not in the current comparison.
- Without a selected goal, all projects remain unscoped and the visitor is asked to choose a goal before interpreting fit.
- No numeric scores, rankings, or new project claims are introduced.

## Presentation

- Render one separator-based decision band inside the existing comparison surface, not a nested card.
- Keep the two project signals aligned on desktop and stacked with clear labels on mobile.
- Include the same fit summary and per-project signals in the copied comparison brief.

## Validation

- Pure-helper tests cover direct match, missing direct match, and no-goal states.
- Comparison-brief tests prove fit signals are copied.
- Browser QA covers hydrated desktop/mobile deep links, fit labels, copy feedback, overflow, and console cleanliness.
