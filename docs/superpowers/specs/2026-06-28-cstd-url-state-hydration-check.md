# CSTD URL State Hydration Check

Stage 4 live verification exposed a real deep-link edge case: a shared project URL could briefly render the default project workflow state before the URL-backed goal and comparison state was restored. The page eventually corrected itself, but the first visible workflow action could point to the wrong destination.

## Finding

- A direct URL such as `/cstd?goal=ai-creation&compare=design%2Ccrm#projects` initially rendered the default summary state.
- The URL view state was restored through `requestAnimationFrame(syncViewState)`, so the project workflow navigation could be one frame or more behind hydration.
- The issue affects the new Stage 4 navigation because its first next action is state-dependent.

## Fix

- Move URL view-state restoration into an isomorphic client layout effect.
- Run `syncViewState()` immediately on mount instead of deferring it through `requestAnimationFrame`.
- Keep the state-aware workflow navigation hidden until URL state has been synchronized at least once, so the default action is not exposed on deep links.
- Keep `popstate` synchronization unchanged for browser back/forward.

## Validation

- Add a regression test that prevents reintroducing `requestAnimationFrame(syncViewState)`.
- Run focused URL-state/workflow/mobile-layout tests.
- Run full lint, test, and build gates.
- Verify live-like local production deep links in Browser before release.
