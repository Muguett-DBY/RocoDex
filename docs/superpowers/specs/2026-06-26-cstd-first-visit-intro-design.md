# CSTD First-Visit Intro Design

## Goal

Keep the CSTD cinematic intro as an intentional brand moment without blocking repeat visitors who return to browse projects.

## Experience

- Show the intro choice only when the browser has not completed or skipped it before.
- Skip the automatic overlay when reduced motion is requested or motion is disabled.
- Label the bypass action as `直接浏览项目` so its result is explicit.
- Remember completion in local storage when the visitor starts or skips the intro.
- Keep the existing `播放开场` control so the animation remains available on demand.

## Architecture

`src/lib/cstd-motion.ts` owns the pure intro decision and stable storage keys. `src/components/cstd-landing.tsx` reads the saved state during preference initialization and records completion at the user interaction boundary. No account, network request, or new dependency is required.

## Error Handling

The feature remains progressive: if storage is unavailable, the existing page still renders and the intro can be dismissed. Reduced-motion users enter the homepage directly.

## Verification

- Unit tests cover first visit, repeat visit, disabled motion, reduced motion, and explicit replay.
- Browser checks cover a fresh visit, a repeat reload, manual replay, mobile layout, and console health.
