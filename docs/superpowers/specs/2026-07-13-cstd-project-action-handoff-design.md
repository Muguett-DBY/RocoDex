# CSTD Project Action Handoff Design

## Context

The personal main site now reaches the project directory early and gives live
product links the correct visual priority, but the handoff from the hero to a
working project still stops too soon.

At a fresh 390 x 844 production viewport:

- `#project-directory` is 392 CSS pixels high.
- The first project card begins 412 pixels below the directory target.
- Following `看项目` leaves only 336 pixels of the first card visible.
- The first working-product action begins at viewport y = 1082, outside the
  844-pixel viewport.
- Inside every card, the primary action begins 574 pixels from the card top.
- The `负责` / `现在` preview delays the action rail by about 146 pixels when
  visual spacing is included.

A browser-only prototype that targeted the project grid and placed actions
immediately after metrics produced these results without removing content:

- 390 x 844: first card top 96; the complete action rail spans y = 524-680.
- 320 x 800: first card top 96; the complete action rail spans y = 552-708.
- 280 x 800: first card top 96; the primary action spans y = 629-673.
- 1280 x 720: first-row action rails end by y = 579.
- Every checked viewport retained horizontal overflow `0`.

## Alternatives Considered

### Collapse the mobile directory controls

This would save roughly 336 pixels before the first card, but it would hide
search, filtering, and shareable-view controls behind a new disclosure. Those
controls remain useful for restored directory links, so this adds state and
reduces discoverability to solve a navigation-target problem.

### Collapse card evidence and technology tags

This reduced the six-card mobile grid by about 820 pixels in a prototype, but
it hid portfolio evidence and introduced a repeated disclosure on every card.
It can be reconsidered later if measured scanning cost remains high after the
direct handoff is fixed.

### Clamp project descriptions

Reducing three description lines to two would save only about 28 pixels per
card while removing product differentiation. It does not address the initial
412-pixel directory offset and is not worth the content loss.

## Product Decision

Create a stable project-grid destination and make general project-navigation
actions land there. Reorder each card so its action rail follows the metric
summary and precedes the role/current evidence.

This produces a scan-to-action sequence:

1. Project identity and concise description.
2. Project metrics.
3. Working-product, case-study, comparison, and optional deep-link actions.
4. Role and current-status evidence.
5. Technology tags.

No card content, directory capability, filter state, or deep-link behavior is
removed.

## Navigation Contract

- Add `id="project-grid"` and `scroll-mt-24` to the rendered project grid.
- The hero `看项目` link targets `#project-grid`.
- The shared desktop/mobile `Projects` navigation item targets
  `#project-grid`.
- `#project-directory` remains the destination for restored directory state,
  filtering workflows, comparison guidance, and category browsing.
- Filtering to an empty result still leaves `#project-grid` as a valid target
  containing the existing empty-state recovery UI.
- The hash is the only navigation state changed by the general project links.

## Card Contract

- The metric list remains before every action.
- The complete action rail moves before the evidence preview in DOM and visual
  order; CSS `order` is not used.
- Existing live-versus-incubating action rules remain unchanged.
- Existing external-link target and `noreferrer` behavior remain unchanged.
- Evidence and tags retain their existing content, styling, and relative order.
- Card height and responsive metric/action layouts remain unchanged.

## Accessibility And Interaction

- The hash target receives the existing 96-pixel scroll margin so content is
  not obscured by the sticky header.
- DOM order matches reading, keyboard, and visual order.
- All action controls retain their existing accessible names, focus-visible
  treatment, and minimum 44-pixel target height.
- Mobile navigation continues to close after selecting `Projects` and reports
  `aria-expanded="false"`.
- Reduced-motion behavior remains unchanged because the new destination uses
  native anchor navigation rather than a new scripted animation.

## Verification Strategy

- Update the navigation unit contract to expect `#project-grid` for
  `Projects`.
- Extend the existing desktop/mobile project-discovery E2E test to prove:
  - `看项目` targets and reaches `#project-grid`;
  - the first project card occupies the target viewport;
  - its complete action rail is visible in the standard mobile and desktop
    profiles;
  - its action rail precedes the evidence preview in DOM and visual order;
  - existing action order, metric geometry, restored context, and overflow
    checks still pass.
- Verify the mobile navigation link closes the menu and reaches the grid.
- Run local production checks at 280, 320, 390, and 1280 CSS pixels.
- Run the full typecheck, lint, unit, audit, build, and E2E gates before push,
  then verify GitHub Actions, Vercel, HTTP entry points, and production browser
  behavior.

## Success Criteria

- At 390 x 844 after `看项目`, the first project card starts near the 96-pixel
  scroll offset and its complete action rail is inside the viewport.
- At 320 x 800, the complete first-card action rail is inside the viewport.
- At 280 x 800, the first working-product action is inside the viewport.
- At 1280 x 720, the first-row action rails are inside the viewport.
- In every project card, metrics precede actions and actions precede evidence.
- Directory controls and existing stateful deep links keep their current
  destination and behavior.
- No content is removed and no checked viewport has clipping, overlap,
  horizontal overflow, browser errors, or warnings.
- Local gates, CI, Vercel, and live production acceptance all pass before the
  release is closed.
