# CSTD Comparison Next Step Design

## Context

The comparison surface now explains the active goal, direct fit, reference fit, and evidence coverage. It still stops at explanation: visitors must leave the decision surface and rediscover the matching project before they can inspect or open it. A second problem appears when the selected comparison omits the goal's direct project: the UI names the gap but offers no correction action.

## Selected Approach

Add a goal-aligned next-step model and a compact action band inside the existing comparison surface. The model has three explicit states:

1. `focus`: the direct project is already selected. Offer a primary in-page case-study action and a secondary live-product action.
2. `align`: a goal is selected but its direct project is missing. Offer one action that inserts the direct project while retaining the first existing reference project.
3. `select-goal`: no goal is selected. Send the visitor back to the existing goal guide.

This two-level action design is preferred over an external-link-only button because it preserves the portfolio's case-study evidence before sending visitors away. It is preferred over a new wizard because all required state and actions already exist.

## Architecture

- Add `src/lib/cstd-project-comparison-next-step.ts` as a pure decision model. It derives copy, action kind, and target project from the selected guide, all projects, and selected comparison projects.
- Keep comparison alignment deterministic with `alignCstdProjectComparisonIds`: direct project first, then the first existing reference, capped at the established comparison limit.
- Memoize the derived model in `CstdLanding` and pass it to `ProjectComparison`.
- Reuse `focusProject` for the station-local case study and existing project `href`/`action` data for the live product.
- Allow comparison-originated mutations to keep the `#project-comparison` hash. Clearing the comparison still returns to `#projects` because the comparison section no longer exists.

## Interaction And Responsive Behavior

- Place the next-step band after `目标判断` and before detailed evidence rows so the flow remains decision, action, then proof.
- Use a single full-width primary button on mobile; the live-product link sits beside it only when the direct project is already present.
- Use visible labels and text, not color alone, for all three states.
- The action band must wrap long project names, remain within the comparison width, and preserve existing focus outlines.
- After alignment, the same band immediately changes from correction to case-study actions without extra status state.

## Error And Edge Handling

- If no goal is selected, do not guess a project; point to the goal guide.
- If a guide target is absent from the project catalog, fall back to the goal-selection state.
- Alignment is idempotent and never exceeds the existing two-project limit.
- Project removal initiated inside the comparison keeps the comparison hash while at least one project remains.

## Verification

- TDD unit coverage for focus, align, no-goal, missing-target, and deterministic comparison alignment.
- Source-contract coverage for model wiring, action-band accessibility, focus/alignment callbacks, and comparison hash preservation.
- Related comparison, URL-state, fit, scan, and mobile-layout tests.
- Full lint, test, and production build gates.
- Local and live desktop plus 390 x 844 mobile verification of alignment, focus navigation, external link presence, overflow, and console errors.

## Non-Goals

- No new analytics, persistent storage, routing system, or comparison limit.
- No redesign of project cards or the case-study panel.
- No automatic external navigation after alignment.
