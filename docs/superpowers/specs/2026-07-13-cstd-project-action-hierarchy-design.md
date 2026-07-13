# CSTD Project Action Hierarchy Design

## Context

The default CSTD path now reaches the live project directory quickly, but the
action hierarchy inside each card still favors portfolio inspection over the
actual product. On the production page at a 390 x 844 viewport, the first live
card renders these actions in this order:

1. `查看案例`
2. `加入对比`
3. `打开图鉴`
4. `查看 PVP 阵容`

The first button is also the only green primary control. The direct project
entry is therefore both later in keyboard/DOM order and visually secondary.
The four stacked controls consume about 212 CSS pixels on the first card.

## Product Decision

For a `Live` project, the action that opens the working product is the primary
card action. Case-study inspection and comparison remain available as
secondary decision tools. A project-specific deep link remains tertiary.

For a `Next` project, no live-product affordance is implied. The case study
continues to be the primary action and the incubator anchor remains secondary.

## Interaction Contract

### Live cards

- The direct product link is first in DOM, keyboard, and visual order.
- The direct product link uses the established green primary treatment.
- `查看案例` and `加入对比` share one two-column row on narrow cards.
- An optional specialized deep link spans the card width on narrow cards.
- Desktop keeps an inline wrapping action rail in the same semantic order.

### Incubating cards

- `查看案例` remains first and primary.
- The incubator continuation remains a secondary, full-width mobile action.
- The card never presents an incubating destination as a live product launch.

## Accessibility And Safety

- DOM order must match visual order; CSS `order` is not used.
- Every control keeps a minimum 44-pixel touch target.
- Secondary controls can shrink without clipping or horizontal overflow.
- Existing project-specific accessible labels remain intact.
- External links continue to use the shared target and `noreferrer` policy.
- Focus-visible treatment remains explicit for buttons and links.

## Success Criteria

- Browser regression proves `打开图鉴` is the first action in the first live
  project card, followed by `查看案例` and `加入对比`.
- On a mobile browser, the case-study and comparison controls have the same
  vertical position and retain at least 44-pixel height.
- The first mobile card becomes shorter without removing evidence, metrics,
  tags, or actions.
- Desktop and mobile show no horizontal overflow, clipping, browser errors, or
  Next.js error overlay.
- Lint, typecheck, unit tests, build, E2E, audit, CI, Vercel, and live checks all
  pass before the release is closed.
