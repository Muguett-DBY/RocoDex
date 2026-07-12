# CSTD Mobile Stage Loading Design

## Context

The CSTD hero now uses a compact SVG mascot button below the `lg` breakpoint, while the full Three.js custard stage is visually hidden with `hidden lg:block`. CSS hiding does not stop React from mounting the stage or Next.js from loading its dynamic chunk.

Production evidence at 390 x 844 shows that the mobile page:

- creates a hidden WebGL `canvas`;
- downloads `07klvbk3r7wpr.js` at 241,230 transferred bytes and 884,176 decoded bytes;
- spends 491,973 transferred bytes on scripts in total, so the desktop-only stage accounts for nearly half of the mobile script transfer.

The specialist Chrome DevTools trace service is not configured in this environment. The finding is instead supported by same-origin Resource Timing entries, DOM inspection, the production bundle, and the stage source imports (`three` and `@react-three/fiber`).

## Goal

Do not mount or download the desktop-only Three.js custard stage below 1024 px, while preserving the current compact mascot interaction on mobile/tablet and the current full stage on desktop.

## Non-Goals

- Redesigning the hero or mascot.
- Removing Three.js from the desktop experience.
- Changing the existing `lg` breakpoint.
- Delaying the desktop stage until explicit user interaction.
- Adding a general-purpose media-query library.

## Approaches Considered

### 1. Keep CSS-only hiding

This preserves the current visuals but also preserves the measured mobile network and runtime cost. It does not meet the goal.

### 2. Conditionally mount at the existing desktop breakpoint

Use a small client hook backed by `window.matchMedia("(min-width: 1024px)")`. Start with `false` for server rendering and hydration safety, synchronize after mount, listen for breakpoint changes, and render `CstdCustardStage` only while the query matches.

This is the recommended approach because it removes the mobile import and canvas without changing the visible mobile or desktop product. The existing aside dimensions keep the desktop hero stable while the dynamic component loads.

### 3. Load the desktop stage only after interaction or idle time

This could reduce initial desktop cost too, but it changes the visible desktop experience and introduces a new loading/activation contract. That is a separate optimization and is not justified by the current mobile-specific evidence.

## Design

Add a private `useDesktopCustardStage` hook beside the existing reduced-motion hook in `src/components/cstd-landing.tsx`.

The hook will:

1. initialize to `false`, avoiding server/client markup disagreement;
2. create `window.matchMedia("(min-width: 1024px)")` in an effect;
3. synchronize state immediately from `mediaQuery.matches`;
4. subscribe to `change` so responsive resizing mounts and unmounts correctly;
5. remove the listener during cleanup.

`CstdLanding` will keep the existing desktop aside and decorative labels. Only the `CstdCustardStage` child will be conditional. The compact mobile mascot button remains rendered with its existing `lg:hidden` presentation and accessible name.

## Interaction Contract

- Below 1024 px: exactly one mascot interaction is mounted, using the compact SVG button; no full-stage button or canvas exists.
- At or above 1024 px: the full dynamic stage mounts and remains interactive; the compact button stays visually hidden under the existing classes.
- Crossing the breakpoint: the stage mounts or unmounts without a reload.
- Reduced motion and audio preferences continue to flow to whichever mascot interaction is visible.

## Verification

- TDD regression: the mobile E2E profile must find one raw mascot button in the DOM, while desktop continues to find the compact button plus the full stage.
- Focused desktop/mobile E2E must keep the visible mascot interaction working and preserve zero horizontal overflow.
- Type checking, lint, unit tests, production build, dependency audit, and the full E2E suite must pass.
- Mobile production-mode Resource Timing must omit the 884,176-byte Three.js stage chunk and show no canvas.
- Desktop production mode must still load the stage chunk and expose the full stage interaction.
- Desktop and mobile screenshots must remain visually consistent with the accepted project-first release.

## Risks And Mitigations

- **Desktop stage appears after hydration:** the aside already reserves stable desktop dimensions and the dynamic import already has a loading fallback.
- **Resize listener leaks:** the hook removes the exact `change` listener in effect cleanup.
- **Breakpoint drift:** the hook uses the same 1024 px value as Tailwind's existing `lg` classes; the regression documents that coupling.
- **False performance claim:** acceptance requires a fresh production bundle and browser Resource Timing evidence, not source inspection alone.
