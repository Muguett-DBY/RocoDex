# CSTD Immersive Systems World Design QA

## Evidence

- Generated source materials: `public/cstd-world/cstd-kinetic-studio-v2.webp`, `public/cstd-world/cstd-data-loom-v2.webp`
- Source-to-implementation comparison: `output/playwright/cstd-wow-reference-compare.png`
- Desktop hero: `output/playwright/cstd-wow-hero-pass1.png`
- Pointer and press state: `output/playwright/cstd-wow-hero-interactive-pass1.png`
- Systems chapter after correction: `output/playwright/cstd-wow-systems-pass2.png`
- Selected work chapter: `output/playwright/cstd-wow-proof-pass1.png`
- Horizontal research path: `output/playwright/cstd-wow-path-pass1.png`
- Mobile fallback and layout: `output/playwright/cstd-wow-mobile-pass1.png`
- Desktop viewport: 1440 x 1024 CSS pixels at device scale factor 1
- Mobile viewport: 393 x 852 CSS pixels at device scale factor 1

## Visual Direction

The homepage now presents CSTD as a continuous physical-digital studio instead of a conventional portfolio grid. A fixed Three.js world combines two dedicated generated environments, five archive textures, three real product surfaces, a distorted image shader, particle currents, a dual-material archive spine, camera motion, bloom, noise, and restrained chromatic separation. DOM chapters stay legible and accessible above that scene.

## Required Surfaces

- Hero: full-bleed, unframed WebGL world with the CSTD brand as the first viewport signal and the next signal strip visible at the fold.
- Systems: five capability axes operate as one deliberate focus surface. Hover and keyboard focus update evidence without search, filtering, or comparison utilities.
- Work: three live systems use full-height editorial chapters and real product screenshots rather than repeated cards.
- Research: four learning years move through one horizontal camera-like sequence on desktop and fall back to a vertical sequence on smaller viewports or reduced motion.
- Palette: graphite, warm ivory, custard amber, cobalt, and small brass highlights. No purple theme, decorative orbs, gradient background, or neon cyberpunk treatment.
- Typography: heavy display hierarchy with zero letter spacing, stable responsive sizes, and no viewport-width font scaling.

## Interaction Verification

- The WebGL canvas covers the full 1440 x 1024 viewport and produces a nonblank PNG payload above 1.2 MB in every inspected chapter.
- Production Chrome sampled 120 animation frames at 6.25 ms average and 6.30 ms p95 on the current 160 Hz display; the single canvas rendered at its full 1440 x 1024 CSS and backing resolution.
- The production first-view resource sample transferred 2.89 MB across 35 requests, with 4.15 MB decoded, while the console remained at 0 errors and 0 warnings.
- Pointer movement and press changed the canvas pixel output; the cursor field moved from its initial transform to the inspected pointer coordinates.
- Scroll progress changes background textures, particles, archive panels, project planes, camera position, and the active header chapter.
- Project planes animate their clipping geometry and image transform on hover.
- Reduced-motion mode hides the pointer field, freezes the signal lanes, and produces identical consecutive canvas frames.
- The scene starts with a lightweight first frame, promotes to full post-processing on hardware GPUs, and retains a lower-cost composition on software rasterizers.
- Desktop and 393px states have zero horizontal overflow.

## Iteration History

1. P1: chapter labels were derived from old whole-page percentages and lagged behind the actual Systems, Work, and Path sections. Fixed by resolving the active chapter from each section's real document offset.
2. P2: the Systems title wrapped into too many isolated lines and all viewport-enter callbacks selected the final system. Fixed with a stable two-line heading and deliberate hover/focus activation only.
3. P1: reduced-motion conditional markup caused a server/client hydration mismatch. Fixed by hydrating the motion preference before applying it and keeping pointer markup structurally stable.
4. Test environment: Chromium reports benign `ReadPixels` driver warnings when Playwright captures WebGL frames. The regression helper filters only this exact driver message while retaining all application warnings and errors.
5. P1: continuous full-quality WebGL saturated GitHub's software rasterizer and caused unrelated DOM assertions to time out. Fixed with renderer-aware quality, reduced-motion CI contexts, and a scene-ready signal after texture decode.
6. P2: reduced-motion demand frames could still advance lerped object transforms while textures settled. Fixed by assigning deterministic transforms directly and proving identical canvas output across five consecutive runs.
7. P2: mixed unitless and percentage clip-path coordinates produced invalid intermediate keyframes during hover. Fixed with consistent percentage coordinates and verified across three consecutive hardware-interaction runs.

## Automated Acceptance

- CSTD source and routing contracts: 13/13 passed.
- CSTD desktop browser regression: 7/7 passed.
- Full desktop and mobile browser suite: 14 passed, 6 intentional capability skips.
- CI-equivalent CSTD suite: 9 passed, 5 intentional hardware-interaction skips in 54.5 seconds.
- Browser interaction checks include Canvas frame changes, chapter state, project links, keyboard focus, no utility workflows, and reduced motion.

## Findings

No actionable P0, P1, or P2 visual issues remain in the inspected desktop or mobile states. The WebGL treatment intentionally exceeds the still source by adding depth, generated archive panels, live product planes, pointer refraction, and scroll-driven camera movement.

## Final Result

final result: passed
