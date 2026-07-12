# CSTD Project-First Discovery Design

## Context

The current `custard.top` homepage gives release metadata and decision-support panels more visual priority than the actual work. On desktop, the primary `看项目` action lands at `#projects`, where workflow, goal, capability, and evidence panels fill the viewport before any project card appears. On a 390 x 844 viewport, the hero also spends the remaining first-screen space on `Latest updates`, `Capability checklist`, and `Acceptance status` content written for maintainers rather than visitors.

The active autonomous-improvement goal authorizes selecting and shipping the highest-value homepage improvement without pausing for another approval round. The existing CSTD colors, type, spacing, mascot, project cards, filters, URL state, and project-detail interactions remain the visual and behavioral source of truth.

## Decision

Adopt a project-first information hierarchy:

1. Keep the brand story, primary actions, proof stats, and interactive mascot in the hero.
2. Remove the release-update, capability-checklist, and acceptance-status panels from the visitor-facing hero.
3. Point `看项目` and the `Projects` navigation item to `#project-directory`, the existing stable directory target.
4. In the default project state, render the directory controls and real project cards before workflow, goal-guide, capability, and evidence panels.
5. When a valid goal or comparison is restored from the URL, preserve the current context-first order so shared decision links still explain their restored state before the directory.
6. Keep all existing filters, project focus, comparison, copying, external-link policy, motion preferences, and deep-link builders unchanged.

## Interaction Contract

- Activating `看项目` updates the hash to `#project-directory` and scrolls the existing directory into view.
- At least the beginning of the first real project card is visible in the same desktop and mobile viewport after the jump.
- The default DOM order is directory, selected project focus when present, project cards, workflow summary, goal guide, capability index, and evidence overview.
- A restored `goal` or `compare` state renders workflow/goal/comparison context before the directory.
- The hero no longer exposes `Latest updates`, `Capability checklist`, or `Acceptance status` labels.

## Accessibility And Responsive Behavior

- Existing semantic links, headings, articles, focus styles, and 44 px touch targets remain intact.
- The directory keeps its current `scroll-mt-24` offset so the sticky mobile header does not cover it.
- No horizontal overflow may appear at desktop or 390 px mobile widths.
- Keyboard activation and native anchor behavior remain available without JavaScript-only click handlers.

## Verification

- Playwright tests cover the primary project handoff at desktop and mobile sizes, default DOM order, removed maintainer labels, and restored decision-link order.
- Unit, lint, TypeScript, audit, production build, and the full E2E suite must pass.
- Local production screenshots at matching desktop and mobile viewports must show the new hierarchy without overlap or clipping.
- After pushing `main`, GitHub Actions, Vercel production readiness, HTTP routing, live browser behavior, console output, and horizontal overflow must be verified.

