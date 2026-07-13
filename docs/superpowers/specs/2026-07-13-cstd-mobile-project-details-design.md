# CSTD Mobile Project Details Design

## Goal

Reduce the repeated scroll cost between project cards on the personal main site while preserving every existing evidence item, technology tag, project action, desktop view, and deep-link workflow.

## Measured problem

Fresh production measurements at 390 x 844 found:

- Page height: 9,863 CSS pixels.
- Project-grid height: 4,616 CSS pixels.
- Six project cards: 4,536 combined CSS pixels.
- Content after each action rail: 208-240 CSS pixels.
- Total post-action evidence and tag space: 1,312 CSS pixels, about 29% of combined card height.
- Each card repeats the same two evidence labels before the visitor can reach the next project.

The previous release correctly moved actions before evidence. The remaining problem is not action discoverability; it is the cost of continuing from one project to the next after the visitor has already seen the available actions.

## Options considered

### Keep the current static layout

Preserves all information but leaves 1,312 pixels of repeated post-action content in the mobile grid.

### Compress spacing and tag padding

A production DOM prototype reduced the project grid by 232 pixels, from 4,616 to 4,384. It still left 1,080 pixels after the action rails and made supporting labels denser without materially improving project-to-project scanning.

### Use mobile progressive disclosure

A production DOM prototype placed evidence and tags inside a collapsed native `details` element below each action rail. It produced:

- Project-grid height: 3,784 CSS pixels, 832 pixels shorter than production.
- Total post-action space: 480 CSS pixels, down from 1,312.
- First 390-pixel card height: 664 CSS pixels, leaving the next project visible in the arrival viewport.
- First 320-pixel card and its details summary fully visible at 800 CSS pixels high.
- A 44-pixel summary with no horizontal overflow at 280, 320, or 390 pixels.
- Native Enter and Space keyboard toggling with focus retained on the summary.

This option preserves the information, creates the largest measured improvement, and uses a familiar browser interaction instead of custom disclosure state.

## Decision

Use native progressive disclosure below the Tailwind `sm` breakpoint and keep the existing static evidence and tags from `sm` upward.

## Interaction contract

- The action rail remains before all supporting details.
- Mobile cards render one collapsed `details` element by default.
- The summary has a minimum 44-pixel target, visible keyboard focus, `项目详情`, compact evidence and technology counts, and a chevron that rotates while open.
- Every `details` group has a unique accessible name based on the project title.
- Opening a group reveals the same two evidence rows and every existing technology tag; nothing is removed or shortened.
- Enter and Space use native disclosure behavior. No URL, local-storage, or cross-card state is added.
- At `sm` and wider, the disclosure is hidden and the current evidence and tag blocks remain directly visible.
- At 280 pixels, the summary remains one line without clipping or horizontal page overflow.

## Component structure

Factor the repeated evidence-and-tag markup into a small `ProjectCardSupportingDetails` component. Render it:

1. Inside a mobile-only `details` body with compact container styling.
2. Inside a desktop-only wrapper using the current evidence and tag styling unchanged.

This keeps data and labels identical while allowing the two responsive presentation contracts to remain semantically correct. Hidden or closed copies must not appear in the accessibility tree.

## Verification contract

- Unit tests lock the mobile-only disclosure, desktop-only static block, 44-pixel summary, one-line metadata, focus styling, and open-state icon rotation.
- Desktop/mobile E2E verifies six uniquely named disclosure groups, collapsed mobile defaults, keyboard open/close, evidence visibility after expansion, desktop static visibility, action-before-details order, and zero horizontal overflow.
- At 390 x 844, the first mobile card and collapsed details summary must fit in the viewport and the next card must be visibly hinted.
- At 280 x 800, the working-product action and disclosure text must remain unclipped; only the primary action is required to fit before the viewport edge.
- Local production and live checks cover 280 x 800, 320 x 800, 390 x 844, and 1280 x 720, including screenshots and console warnings/errors.

## Non-goals

- Removing evidence or technology tags.
- Changing project actions, metrics, descriptions, filters, comparisons, or deep links.
- Collapsing desktop evidence.
- Persisting disclosure state across navigation or reloads.
