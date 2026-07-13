# CSTD Mobile Metric Density Design

## Context

The live-product action hierarchy is now compact, but each project card still
renders three metric tiles as three full-width rows on every viewport below the
`sm` breakpoint. At a 320 x 800 production viewport:

- The first metric grid is about 237 x 224 CSS pixels.
- Each tile is about 70 pixels high.
- The first project card is about 930 pixels high.
- All metric values and labels have substantial unused horizontal space.

A browser-only two-column prototype reduced the metric grid to 147 pixels and
the first card to 853 pixels. All values and labels across all six cards stayed
on one line with zero element or page overflow.

At a 280-pixel viewport, `Portrait` and `Nanjing` wrap in a two-column layout.
That is safe but visually weaker, so the compact layout must not activate below
320 pixels.

## Product Decision

Use a responsive two-column metric summary from 320 through 639 pixels. The
third metric spans the full row, creating a balanced 2 + 1 layout. Keep the
existing one-column fallback below 320 pixels and the existing three-column
desktop/tablet layout from `sm` upward.

## Responsive Contract

- `< 320px`: one full-width metric per row.
- `320px - 639px`: two equal columns; the last metric spans both columns.
- `>= 640px`: three equal columns; the last metric returns to one column.
- Metric values and labels retain `min-w-0` and `break-words` protection.
- Existing spacing, borders, color, and type hierarchy remain unchanged.
- The project action rail follows the same safety boundary: one column below
  320 pixels and two columns from 320 pixels, preventing Chinese action labels
  from splitting inside 92-pixel controls.

## Semantic Contract

- Each project's metrics are exposed as a named list.
- Each metric tile is a list item.
- The accessible list name includes the project title, so repeated metric
  groups are distinguishable.
- Visual order and DOM order remain identical.

## Success Criteria

- At 390px, browser regression proves the first two metrics share a row and the
  third metric occupies the full next row.
- At desktop width, all three metrics share one row with equal widths.
- Unit coverage proves the one-column fallback, 320px two-column activation,
  last-item span, and `sm` reset are present.
- Local checks at 280px prove the fallback avoids forced long-value wrapping.
- Local checks at 320px prove all metric values and labels across all six cards
  remain single-line with zero overflow.
- The first 320px project card is at least 70 pixels shorter than the production
  baseline without removing content.
- Full local, CI, Vercel, and production gates pass before release closure.
