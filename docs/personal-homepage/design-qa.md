# CSTD Immersive Systems World Design QA

## Evidence

- Generated source materials: `public/cstd-world/cstd-kinetic-studio-v2.webp`, `public/cstd-world/cstd-data-loom-v2.webp`
- Source-to-implementation comparison: `output/playwright/cstd-wow-reference-compare.png`
- Desktop hero: `output/playwright/cstd-wow-hero-pass1.png`
- Pointer and press state: `output/playwright/cstd-wow-hero-interactive-pass1.png`
- Systems chapter after correction: `output/playwright/cstd-wow-systems-pass2.png`
- Selected work chapter: `output/playwright/cstd-wow-proof-pass1.png`
- Horizontal research path: `output/playwright/cstd-wow-path-pass1.png`
- Rebuilt path at 2048 x 900: `output/playwright/cstd-path-2048-start-v2.png`
- Rebuilt path transition at 2048 x 900: `output/playwright/cstd-path-2048-transition.png`
- Rebuilt path at 1440 x 1024: `output/playwright/cstd-path-1440-start.png`
- Path-to-footer handoff at 1440 x 1024: `output/playwright/cstd-path-1440-last.png`
- Mobile fallback and layout: `output/playwright/cstd-wow-mobile-pass1.png`
- Runtime-upgrade desktop hero and systems: `output/playwright/cstd-runtime-desktop-hero.png`, `output/playwright/cstd-runtime-desktop-systems.png`
- Runtime-upgrade mobile hero and systems: `output/playwright/cstd-runtime-mobile-hero.png`, `output/playwright/cstd-runtime-mobile-systems.png`
- Runtime-upgrade canvas and asset report: `output/playwright/cstd-runtime-upgrade-report.json`
- Desktop viewport: 1440 x 1024 CSS pixels at device scale factor 1
- Mobile viewport: 393 x 852 CSS pixels at device scale factor 1
- Runtime-upgrade mobile viewport: 390 x 844 CSS pixels at device scale factor 1

## Visual Direction

The homepage now presents CSTD as a continuous physical-digital studio instead of a conventional portfolio grid. A fixed Three.js world combines two dedicated generated environments, five archive textures, three real product surfaces, a distorted image shader, particle currents, a dual-material archive spine, camera motion, bloom, noise, and restrained chromatic separation. DOM chapters stay legible and accessible above that scene.

## Required Surfaces

- Hero: full-bleed, unframed WebGL world with the CSTD brand as the first viewport signal and the next signal strip visible at the fold.
- Systems: five capability axes operate as one deliberate focus surface. Hover and keyboard focus update evidence without search, filtering, or comparison utilities.
- Work: three live systems use full-height editorial chapters and real product screenshots rather than repeated cards.
- Research: four learning years use one continuous vertical camera-like sequence at every viewport. Alternating editorial frames preserve motion and depth without converting vertical wheel input into a pinned horizontal stage.
- Palette: graphite, warm ivory, custard amber, cobalt, and small brass highlights. No purple theme, decorative orbs, gradient background, or neon cyberpunk treatment.
- Typography: heavy display hierarchy with zero letter spacing, stable responsive sizes, and no viewport-width font scaling.

## Interaction Verification

- The WebGL canvas covers the full 1440 x 1024 viewport and produces a nonblank PNG payload above 1.2 MB in every inspected chapter.
- Production Chrome sampled 120 animation frames at 6.25 ms average and 6.30 ms p95 on the current 160 Hz display; the single canvas rendered at its full 1440 x 1024 CSS and backing resolution.
- The production first-view resource sample transferred 2.89 MB across 35 requests, with 4.15 MB decoded, while the console remained at 0 errors and 0 warnings.
- Pointer movement and press changed the canvas pixel output; the cursor field moved from its initial transform to the inspected pointer coordinates.
- Scroll progress changes background textures, particles, archive panels, project planes, camera position, and the active header chapter.
- Project planes animate their clipping geometry and image transform on hover.
- The site defaults to full motion even when the operating system reports reduced motion. A persisted header control explicitly switches to calm mode, where the pointer field is hidden, signal lanes freeze, consecutive canvas frames are identical, and every research chapter remains scrollable.
- The scene starts with a lightweight first frame, promotes to continuous full post-processing on hardware GPUs, and retains a lower-cost demand-rendered composition on software rasterizers. Entering the opaque Work chapter, Research, the footer, or hiding the document pauses the continuous frame loop while keeping DPR and post-processing buffers stable, so scrolling never pays a GPU teardown/rebuild cost.
- A lost WebGL context removes the invalid canvas and preserves the generated static material field without emitting an application error.
- Desktop and 393px states have zero horizontal overflow.

## Iteration History

1. P1: chapter labels were derived from old whole-page percentages and lagged behind the actual Systems, Work, and Path sections. Fixed by resolving the active chapter from each section's real document offset.
2. P2: the Systems title wrapped into too many isolated lines and all viewport-enter callbacks selected the final system. Fixed with a stable two-line heading and deliberate hover/focus activation only.
3. P1: reduced-motion conditional markup caused a server/client hydration mismatch. Fixed by hydrating the motion preference before applying it and keeping pointer markup structurally stable.
4. Test environment: Chromium reports benign `ReadPixels` driver warnings when Playwright captures WebGL frames. The regression helper filters only this exact driver message while retaining all application warnings and errors.
5. P1: continuous full-quality WebGL saturated GitHub's software rasterizer and caused unrelated DOM assertions to time out. Fixed with renderer-aware quality, reduced-motion CI contexts, and a scene-ready signal after texture decode.
6. P2: reduced-motion demand frames could still advance lerped object transforms while textures settled. Fixed by assigning deterministic transforms directly and proving identical canvas output across five consecutive runs.
7. P2: mixed unitless and percentage clip-path coordinates produced invalid intermediate keyframes during hover. Fixed with consistent percentage coordinates and verified across three consecutive hardware-interaction runs.
8. P1: reduced-motion CSS disabled the horizontal transform while leaving the desktop sticky, viewport-height, overflow-hidden shell active. Fixed by making horizontal and vertical path modes structurally exclusive and proving the 2026 chapter and footer remain reachable.
9. P1: conflicting `relative` and `absolute` utilities made the research header consume 210px in the horizontal stage, pushing content below the viewport. Fixed with exclusive positioning classes and visual checks at 2048 x 900 and 1440 x 1024.
10. P2: repeated development refreshes could lose the WebGL context while the post-processing composer was remounting. Fixed with context-loss detection and an immediate static-material fallback.
11. Product decision: operating-system reduced-motion preference no longer silently changes the first visit. Full motion is the default and an explicit, persisted calm-mode control owns the choice.
12. P1: default full motion kept SwiftShader in a continuous frame loop, starving CI screenshots and chapter-state polling until the 45-second test timeout. Fixed by demand-rendering the existing lite composition while preserving continuous rendering on hardware GPUs.
13. Performance: replaced the full Motion component runtime with `LazyMotion` and `framer-motion/m`, deferred WebGL mounting until browser idle time, and split archive textures behind a nested Suspense boundary. Production initial JS fell from 308,385 bytes to 254,038 bytes while retaining the full visual field.
14. Compatibility: Three.js r183-r185 emit a `THREE.Clock` deprecation warning through React Three Fiber 9.7.0. Pinned Three.js and its types to r182, the newest warning-free release for the current Fiber runtime, and kept future `0.x` upgrades behind manual migration and visual review.
15. P1: the desktop Research chapter pinned a 400vw composited track for 420svh. Continuous wheel input remained inside one viewport composition long enough to feel locked, while the oversized `will-change` layer and full WebGL post-processing competed for GPU memory. Replaced it with natural vertical editorial frames and removed the oversized layer. The WebGL scene now pauses its continuous frame loop throughout opaque chapters while preserving stable DPR and compositor buffers, eliminating both sustained GPU work and the transition teardown spike.

## Automated Acceptance

- Unit and source contracts: 156/156 passed across 45 files.
- Dual-site architecture boundary: 9/9 contracts passed.
- Targeted desktop scroll regression: 2/2 passed for continuous wheel release and calm mode.
- Personal homepage desktop and mobile browser suite: 11 passed, 5 intentional capability skips.
- CI-equivalent CSTD suite with operating-system reduced motion: 7 passed, 1 intentional hardware-interaction skip.
- Full CI-equivalent desktop and mobile suite: 17 passed, 7 intentional capability skips.
- Browser interaction checks include Canvas frame changes, real wheel traversal through every Research frame, 2026 visibility, footer reachability, bottom-frame responsiveness, chapter state, project links, keyboard focus, no utility workflows, calm mode, and context-loss fallback.
- Node 24.18.0 / npm 12.0.2 production build: 734 static pages generated successfully; dependency audit reports zero vulnerabilities.
- Production bundle guard: 252,909 initial JS bytes under a 290,000-byte budget; 1,099,960 async WebGL bytes under a 1,250,000-byte budget; no WebGL marker in the initial entry.
- Real Chrome 1920 x 1080 continuous-wheel check: the old production path peaked at 88 ms command latency; the revised local path peaked at 17 ms with a 12 ms P95, produced no scroll-time long tasks or over-40 ms RAF gaps in Work, Research, or the footer, reached the exact scroll maximum, and left WebGL in its inactive state.
- Real Chrome runtime upgrade check: desktop and mobile both rendered at `full` quality, pointer input changed canvas hashes, all 10 generated WebGL materials loaded, horizontal overflow was zero, and the browser console remained clean.

## Findings

No actionable P0, P1, or P2 visual issues remain in the inspected desktop or mobile states. The WebGL treatment intentionally exceeds the still source by adding depth, generated archive panels, live product planes, pointer refraction, and scroll-driven camera movement.

## Final Result

final result: passed
