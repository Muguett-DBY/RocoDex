# RocoDex Iteration Log

## 2026-06-30 - Long Homepage Cycle 5 Stage 6 / 6 - IMPROVE

### Scope

- Added a compact restored-goal receipt for clean selected-goal share links.
- Tracked clean `goal` share restoration separately from directory, project-focus, and comparison restored states.
- Preserved the goal-share URL contract: valid links still use only `goal` and `#projects`.

### User-visible change

- Opening a shared link such as `/cstd?goal=portrait-shooting#projects` now says `目标路径已恢复` inside the selected-match panel and names the restored goal plus recommended project.
- Ordinary in-page goal selection and richer restored comparison links do not show this receipt.

### Verification evidence

- TDD red reproduced the missing restored-goal receipt helper; focused tests then passed 2 files / 19 tests and related tests passed 3 files / 35 tests.
- `npm run lint` passed; full tests passed 47 files / 211 tests; `npm run build` generated 735 static pages.
- Local Edge checks confirmed desktop/mobile clean goal links show the receipt, ordinary click and comparison-restored states do not, horizontal overflow `0`, and zero console warnings/errors.
- Commit `3125a29` was pushed to `origin/main`.
- GitHub Actions CI run `28421161470` passed.
- Vercel production deployment `rocodex-epmb7n9o3-muguett-dbys-projects.vercel.app` completed Ready.
- Live `https://custard.top/cstd?goal=portrait-shooting#projects` desktop/mobile checks confirmed the receipt, while ordinary click and comparison-restored states suppressed it; horizontal overflow `0`, zero console warnings/errors.

### Next direction

- This 6-stage cycle is complete. The next useful pass is a lighter cross-page CSTD content consistency check, unless a new product direction supersedes it.

## 2026-06-30 - Long Homepage Cycle 5 Stage 5 / 6 - CHECK

### Scope

- Audited the selected-goal sharing path for URL-state, copy-feedback semantics, and fallback behavior.
- Fixed a feedback semantics issue where unsupported or failed copy outcomes used the same success-colored treatment as completed copies.
- Added a tested copy presentation contract with `success` / `warning` tone and manual-copy requirements.

### User-visible change

- Goal-path copy failures now read as warning/recovery states instead of success states.
- Manual-copy fallback visibility is now derived from the same tested presentation contract as the message text.

### Verification evidence

- TDD red reproduced the missing copy-presentation helper; focused guide tests then passed 1 file / 7 tests and related tests passed 3 files / 33 tests.
- `npm run lint` passed; full tests passed 47 files / 209 tests; `npm run build` generated 735 static pages.
- Local Edge checks confirmed success feedback color `rgb(4, 120, 87)`, unsupported feedback color `rgb(138, 75, 21)`, clean copied/fallback URL, horizontal overflow `0`, and zero console warnings/errors.
- Commit `6e85847` was pushed to `origin/main`.
- GitHub Actions CI run `28420736743` passed.
- Vercel production deployment `rocodex-q2wy78dsy-muguett-dbys-projects.vercel.app` completed Ready.
- Live `https://custard.top/cstd` checks confirmed the same success/warning colors, manual fallback input, clean URL, horizontal overflow `0`, and zero console warnings/errors.

### Next direction

- Stage 6 should make opened goal-share links more self-explanatory for recipients, without adding another large panel or changing the share URL contract.

## 2026-06-30 - Long Homepage Cycle 5 Stage 4 / 6 - IMPROVE

### Scope

- Added clean selected-goal path sharing from the CSTD match panel.
- Added clipboard success, unsupported-browser, and failure feedback for goal-path copying.
- Added a manual read-only URL fallback and kept the existing case, comparison, live-link, and directory continuation actions unchanged.

### User-visible change

- Visitors who choose a goal can now copy a clean share URL like `/cstd?goal=portrait-shooting#projects` without carrying stale search, category, project focus, or comparison state.
- The selected-goal heading now has two 44 px icon controls: copy target path and clear target match.

### Verification evidence

- TDD red reproduced the missing share-link and copy-message helpers; focused tests then passed 3 files / 32 tests.
- `npm run lint` passed; full tests passed 47 files / 208 tests; `npm run build` generated 735 static pages.
- Local Edge checks at 1365 x 900 and 390 x 844 confirmed clean copied URLs, unsupported-clipboard fallback input, 44 px copy/clear controls, no heading overlap, horizontal overflow `0`, and zero console warnings/errors.
- Commit `4fad37c` was pushed to `origin/main`.
- GitHub Actions CI run `28420278964` passed.
- Vercel production deployment `rocodex-qntcdl8dp-muguett-dbys-projects.vercel.app` completed Ready and aliases include `https://custard.top`.
- Live Edge checks on `https://custard.top/cstd` confirmed the same clean copied URL, fallback input, 44 px controls, horizontal overflow `0`, and zero console warnings/errors.

### Next direction

- Stage 5 should audit the goal-guide sharing path for URL-state edge cases, accessibility semantics, and regression gaps, then fix verified defects before adding more UI.

## 2026-06-30 - Long Homepage Cycle 5 Stage 3 / 6 - UIUX

### Scope

- Rebuilt the selected-goal action rail around a stable primary, paired secondary, and full-width continuation hierarchy.
- Raised every forward action to 44 px and separated clearing into an accessible 44 by 44 icon control.

### User-visible change

- Goal matches now scan cleanly on desktop and stack predictably on mobile without an orphaned fifth button or a competing text-heavy clear action.

### Verification evidence

- TDD red reproduced the missing layout contracts; focused tests then passed 2 files / 21 tests.
- Lint passed; full tests passed 47 files / 206 tests; the production build generated 735 static pages after resolving a local `.next` log-handle lock.
- Local screenshots and geometry checks confirmed the desktop 2-column hierarchy, mobile full-width stack, 44 px controls, no title overlap, horizontal overflow `0`, and zero console warnings/errors.
- Commit `4b18bfb` was pushed to `origin/main`.
- GitHub Actions CI run `28419743507`, Vercel deployment, and live desktop/mobile geometry checks all passed.

### Next direction

- Stage 4 should let visitors copy the exact selected goal path and receive explicit clipboard feedback.

## 2026-06-30 - Long Homepage Cycle 5 Stage 2 / 6 - IMPROVE

### Scope

- Added a goal-aware project-directory continuation derived from real category metadata and project counts.
- Preserved the selected goal while applying its category filter, clearing stale search, and scrolling to the directory.

### User-visible change

- After choosing a goal, visitors can now continue into the relevant project category without manually finding the directory or recreating filters.

### Verification evidence

- TDD red reproduced the missing continuation helper; focused tests then passed 2 files / 20 tests.
- `git diff --check`, `npm run lint`, `npm test`, and `npm run build` passed; full tests passed 47 files / 205 tests and build generated 735 static pages.
- Local and live Edge checks at 1440 x 1000 and 390 x 844 confirmed goal preservation, category filtering, search clearing, directory scrolling, horizontal overflow `0`, and zero console warnings/errors.
- Commit `e3f4e80` was pushed to `origin/main`.
- GitHub Actions CI run `28419361689` and the Vercel deployment both completed successfully.

### Next direction

- Stage 3 should clarify the five-action match panel hierarchy and raise every action to a 44 px minimum touch target.

## 2026-06-30 - Long Homepage Cycle 5 Stage 1 / 6 - IMPROVE

### Scope

- Continued from the completed navigation-hardening loop by moving back to CSTD personal project homepage product direction.
- Added a `portrait-shooting` goal-guide path for the live photography project.
- Added guide coverage summary logic so the homepage now states `5 条目标路径覆盖 5 / 5 个上线项目`.
- Replaced stale fixed `4 条路径` workflow copy with a derived goal count and adjusted the desktop goal grid to five columns.

### User-visible change

- Visitors can now choose `预约南京写真或情侣约拍` from the first-scan goal guide and land directly on the `奶黄包摄影` match.

### Verification evidence

- TDD red reproduced the missing photography goal path, missing coverage summary helper, and stale fixed path count.
- Focused tests passed 2 files / 11 tests.
- `git diff --check`, `npm run lint`, `npm test`, and `npm run build` passed; full tests passed 47 files / 204 tests and build generated 735 static pages.
- Local and live Edge checks at 1440 x 1000 and 390 x 844 confirmed 5 goal cards, full live-project coverage text, photography match behavior, horizontal overflow `0`, and zero console warnings/errors.
- Commit `ffbb3da` was pushed to `origin/main`.
- GitHub Actions CI run `28418862325` completed successfully.
- Vercel commit status completed successfully with description `Deployment has completed`.

### Next direction

- Stage 2 should turn the complete live-project goal guide into a stronger continuation path, especially after a visitor has selected a goal and needs to choose between evidence, comparison, directory, or opening the live project.

## 2026-06-30 - Long Homepage Cycle 4 Stage 6 / 6 - IMPROVE

### Scope

- Added a pure context-strip home action helper.
- Added a `首页` action before related destinations in the non-CSTD context strip.
- Kept related links, 44 px action targets, mobile Escape/focus behavior, and CSTD isolation unchanged.

### User-visible change

- From nested or module pages, visitors now get an explicit `首页` continuation in the context strip instead of relying only on the brand mark.

### Verification evidence

- TDD red failed before the home action helper and context strip rendering existed; focused tests then passed 2 files / 12 tests.
- `git diff --check` passed with only Windows line-ending notices.
- `npm run lint` passed.
- `npm test` passed 47 files / 203 tests.
- `npm run build` generated 735 static pages.
- Local desktop and 390 x 844 production-browser verification on `/creatures/001` confirmed the context strip home action `首页`, related actions `攻略` and `我的收藏`, 44 px action heights, horizontal overflow `0`, and zero console warnings/errors.
- Commit `93fc965` was pushed to `origin/main`.
- GitHub Actions CI run `28418211220` completed successfully.
- Vercel production deployment `rocodex-jvccbr4ex-muguett-dbys-projects.vercel.app` was Ready.
- Live desktop and 390 x 844 verification on `https://rocodex.custard.top/creatures/001` confirmed the context strip home action `首页`, related actions `攻略` and `我的收藏`, 44 px action heights, horizontal overflow `0`, and zero console warnings/errors.

### Next direction

- The 6-stage cycle is complete. Next useful work is a separate product-direction pass rather than more navigation hardening in this same loop.

## 2026-06-30 - Long Homepage Cycle 4 Stage 5 / 6 - CHECK

### Scope

- Audited the cross-page navigation work for auth-enabled mobile controls, keyboard semantics, route-transition behavior, dependency/audit state, and regression coverage.
- Found and fixed a keyboard accessibility risk: closing the mobile menu with `Escape` from a focused menu link could unmount the focused element without returning focus to the menu button.

### User-visible change

- Pressing `Escape` from inside the expanded mobile menu now closes the menu and returns focus to the `打开主导航` button.

### Verification evidence

- TDD red reproduced the missing focus-return contract; focused tests then passed 2 files / 13 tests.
- `npm run ci:local` stopped the local Next process, ran `npm ci`, and found 0 vulnerabilities; npm reported install-script approval warnings for `sharp` and `unrs-resolver`.
- `git diff --check`, `npm audit --json`, and `npm run lint` passed.
- Source hygiene found no source TODO/FIXME/debugger/conflict/console.log issues; the only match was an older docs line describing the scan itself.
- `npm test` passed 47 files / 201 tests.
- `npm run build` generated 735 static pages.
- Local 390 x 844 production-browser verification on `/creatures/001` focused the mobile menu `/guides` link, pressed `Escape`, and confirmed the menu disappeared, `aria-expanded="false"`, focus returned to the `打开主导航` button, horizontal overflow `0`, and zero console warnings/errors.
- Commit `1cc1d10` was pushed to `origin/main`.
- GitHub Actions CI run `28410403142` completed successfully.
- Vercel production deployment `rocodex-4dsod1kui-muguett-dbys-projects.vercel.app` was Ready.
- Live 390 x 844 verification on `https://rocodex.custard.top/creatures/001` focused the mobile menu `/guides` link, pressed `Escape`, and confirmed the menu disappeared, `aria-expanded="false"`, focus returned to the `打开主导航` button, horizontal overflow `0`, and zero console warnings/errors.

### Next direction

- Stage 6 should add one final user-facing continuation polish to the non-CSTD navigation layer while preserving the accessibility contracts validated in Stage 5.

## 2026-06-30 - Long Homepage Cycle 4 Stage 4 / 6 - IMPROVE

### Scope

- Added a pure `Escape` dismissal helper for the mobile navigation.
- Wired the header container so bubbling `Escape` key events close the expanded mobile menu.
- Preserved existing pointer toggling, route-change closing, active states, 44 px menu controls, and constrained menu scrolling.

### User-visible change

- Keyboard users can now dismiss the expanded mobile menu with `Escape` without navigating back to the toggle manually.

### Verification evidence

- TDD red failed before the dismissal helper and header keydown wiring existed; focused tests then passed 2 files / 12 tests.
- `git diff --check` passed with only Windows line-ending notices.
- `npm run lint` passed.
- `npm test` passed 47 files / 200 tests.
- `npm run build` generated 735 static pages.
- Local 390 x 844 production-browser verification on `/creatures/001` opened the menu, pressed `Escape` from the focused close toggle, and confirmed the menu disappeared, `aria-expanded="false"`, the toggle label returned to `打开主导航`, horizontal overflow `0`, and zero console warnings/errors.
- Commit `44723a4` was pushed to `origin/main`.
- GitHub Actions CI run `28409951124` completed successfully.
- Vercel commit status completed successfully and production deployment `rocodex-958gkjp3r-muguett-dbys-projects.vercel.app` was Ready.
- Live 390 x 844 verification on `https://rocodex.custard.top/creatures/001` opened the auth-enabled 13-control menu, pressed `Escape` from the focused close toggle, and confirmed the menu disappeared, `aria-expanded="false"`, the toggle label returned to `打开主导航`, horizontal overflow `0`, and zero console warnings/errors.

### Next direction

- Stage 5 should perform a CHECK pass over the cross-page navigation work, including auth-enabled mobile menu behavior, keyboard semantics, route transitions, dependency/audit state, and regression gaps.

## 2026-06-30 - Long Homepage Cycle 4 Stage 3 / 6 - UIUX

### Scope

- Added a route-context-backed current summary for the expanded mobile navigation.
- Rendered the summary only inside the opened mobile menu, keeping the closed sticky header footprint unchanged.
- Added an accessible mobile nav landmark label while preserving existing link order, active states, collection entry, and menu close behavior.
- Fixed auth-enabled mobile menu controls so login/register inherit the same 44 px touch target and close-on-navigation behavior as the other menu entries.
- Constrained the expanded mobile menu to the viewport with internal scrolling for auth-enabled production menus.

### User-visible change

- Mobile visitors opening the menu from nested pages now immediately see the current module name and description before the route index.
- The current route still appears as the highlighted navigation row with `aria-current="page"`.

### Verification evidence

- TDD red failed before the summary helper and mobile menu summary UI existed; follow-up red contracts reproduced the live auth-enabled 36 px control issue and the viewport overflow issue; focused tests then passed 2 files / 10 tests.
- `git diff --check` passed with only Windows line-ending notices.
- `npm run lint` passed.
- `npm test` passed 47 files / 198 tests.
- `npm run build` generated 735 static pages.
- Local 390 x 844 production-browser verification on `/creatures/001` confirmed the `精灵列表` summary, description text, `aria-label="移动主导航"`, `aria-expanded="true"` after opening, correct active link, 11 menu controls, 44 px minimum control height, `max-height: 764px`, internal scrolling, overflow `0`, no viewport overflow, and zero console warnings/errors.
- Commits `095ef57`, `151975c`, and `121e3fc` were pushed to `origin/main`.
- GitHub Actions CI run `28409478931` completed successfully for `121e3fc`.
- Vercel commit status completed successfully and production deployment `rocodex-1zpoyijjb-muguett-dbys-projects.vercel.app` was Ready.
- Live 390 x 844 verification on `https://rocodex.custard.top/creatures/001` confirmed the same summary and route state with 13 controls including auth links, 44 px minimum control height, `max-height: 764px`, internal scrolling, menu bottom `828` inside the 844 px viewport, horizontal overflow `0`, and zero console warnings/errors.

### Next direction

- Stage 4 should strengthen mobile navigation interaction resilience now that the expanded menu has clearer current-location context.
- Recommended flagship: make keyboard dismissal deterministic for the mobile menu without adding persistent state.

## 2026-06-30 - Long Homepage Cycle 4 Stage 2 / 6 - IMPROVE

### Scope

- Bound the mobile menu's requested open state to the pathname where it was opened.
- Added a pure normalized-path helper that derives whether the menu should still be visible.
- Preserved existing explicit link-close behavior, accessibility state, active links, and touch targets.

### User-visible change

- The mobile navigation now closes when browser history, programmatic navigation, or another page control changes the pathname.
- Query-only changes on the same page do not unexpectedly close the menu.

### Verification evidence

- TDD red failed before the route-aware visibility helper existed; focused tests then passed 2 files / 8 tests.
- `npm run lint` exited `0`.
- `npm test` passed 46 files / 194 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Local 390 x 844 production-browser history navigation confirmed the menu closed, `aria-expanded` reset, the correct route became active, overflow stayed `0`, and console warnings/errors stayed `0`.
- Commit `2b3f84a` was pushed to `origin/main`.
- GitHub Actions CI run `28408191121` completed successfully.
- Vercel commit status completed successfully with description `Deployment has completed`.
- Live 390 x 844 browser-history verification on `https://rocodex.custard.top` confirmed the same close, accessibility, active-route, overflow, and console behavior.

### Next direction

- Stage 3 should refine the mobile navigation's information hierarchy and current-location visibility without increasing the sticky header footprint.
- Recommended flagship: turn the expanded menu into a clearer route index with stronger current-item semantics and restrained grouping.

## 2026-06-30 - Long Homepage Cycle 4 Stage 1 / 6 - IMPROVE

### Scope

- Continued the previous cross-page navigation direction outside CSTD.
- Added pure route matching and related-destination context helpers for exact and nested routes.
- Added active states to desktop/mobile header links and the count-aware collection link.
- Added a compact global context strip with two curated next destinations.

### User-visible change

- Visitors can see which RocoDex module they are currently browsing, including nested creature, guide, and team pages.
- Each supported module now exposes two nearby next destinations without returning to the homepage.
- Context actions retain a 44 px minimum touch target on mobile.

### Verification evidence

- TDD red failed before route helpers and context rendering existed; focused tests then passed 2 files / 7 tests.
- `npm run lint` exited `0`.
- `npm test` passed 46 files / 193 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Local production desktop and 390 x 844 browser checks confirmed correct active links, expected context destinations, 44 px actions, overflow `0`, no header/context overlap, and console warnings/errors `0`.
- Commit `35e0095` was pushed to `origin/main`.
- GitHub Actions CI run `28407640308` completed successfully.
- Vercel commit status completed successfully with description `Deployment has completed`.
- Live `https://rocodex.custard.top` desktop/mobile checks returned HTTP `200` and confirmed active links, expected context destinations, 44 px actions, overflow `0`, no header/context overlap, and console warnings/errors `0`.

### Next direction

- Stage 2 should make the mobile menu close reliably when the pathname changes through browser history or programmatic navigation.
- Recommended flagship: extract and test route-transition menu state while preserving current link and accessibility behavior.

## 2026-06-30 - Long Homepage Cycle 3 Stage 2 / 6 - IMPROVE

### Scope

- Continued the Stage 1 restored-link direction by making restored directory and focused project entries actionable.
- Added pure action helpers for restored directory and focus states.
- Rendered a compact `恢复筛选下一步` handoff inside the Project index restored receipt.
- Rendered a scoped `恢复案例下一步` copy action inside the Project case-study restored receipt.

### User-visible change

- Visitors opening `/cstd?category=operations&q=CRM#projects` can jump straight from the restored filter receipt into the matching CRM case study.
- Visitors opening `/cstd?project=design#project-focus` can copy the restored case-study summary from the same restored-entry area.
- The public URL-state contract and existing manual clearing behavior remain unchanged.

### Verification evidence

- TDD red failed before restored action helpers and component wiring existed; focused tests passed 2 files / 21 tests after implementation.
- Related CSTD tests passed 6 files / 50 tests.
- `npm run lint` exited `0`.
- `npm test` passed 44 files / 179 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Local in-app Browser plus controlled Edge desktop/mobile checks confirmed restored action regions, directory-to-focus transition, copy feedback, overflow `0`, no framework overlay, and console/page errors `0`.
- Commit `18e319a` was pushed to `origin/main`.
- GitHub Actions CI run `28388400215` completed successfully.
- Vercel commit status completed successfully with description `Deployment has completed`.
- Live `https://custard.top` desktop/mobile checks confirmed both restored actions, HTTP `200`, overflow `0`, no framework overlay, and console/page errors `0`.

### Next direction

- Stage 3 should use the UIUX prompt to make restored-entry action areas easier to scan on small screens and visually align them with nearby toolbar/focus controls.
- Recommended flagship: refine the restored receipt/action presentation into a clearer responsive handoff pattern inside existing Project index and Project case-study surfaces.

## 2026-06-29 - Long Homepage Cycle 3 Stage 1 / 6 - IMPROVE

### Scope

- Continued the previous direction by extending restored-link receipts beyond comparison links.
- Added pure URL-state receipt helpers for filtered directory links and focused project links.
- Rendered `筛选视图已恢复` in the existing Project index toolbar and `分享案例已恢复` in the existing Project case study header.
- Cleared restored-link receipts after manual directory, focus, guide, or comparison changes.

### User-visible change

- Visitors opening shared directory links such as `/cstd?category=operations&q=CRM#projects` now see exactly which filter/search state was restored.
- Visitors opening shared case-study links such as `/cstd?project=design#project-focus` now see that the focused project was recovered from the link.
- Plain `/cstd` visits still do not show restored-link receipts.

### Verification evidence

- Focused TDD failed before implementation, then passed 2 files / 18 tests.
- Related CSTD tests passed 9 files / 75 tests.
- `npm run lint` exited `0`.
- `npm test` passed 44 files / 176 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Local clean Edge desktop/mobile checks confirmed restored receipts, manual clearing, plain `/cstd` without restored receipts, overflow `0`, no framework overlay, and console warnings/errors `0`.
- In-app Browser checks confirmed the focus and directory receipts with overflow `0` and no warning/error logs.
- Commit `36477b1` was pushed to `origin/main`.
- GitHub Actions CI run `28370400526` completed successfully.
- Vercel deployment `https://rocodex-m2d4lzi0q-muguett-dbys-projects.vercel.app` reached Ready.
- Live clean Edge desktop/mobile checks on `https://custard.top` confirmed both restored directory and focus receipts, overflow `0`, no framework overlay, and console warnings/errors `0`.

### Next direction

- Stage 2 should make these restored entry points more actionable without adding a new homepage panel.
- Recommended flagship: add compact next-action handoffs for restored directory and focused project views inside the existing Project index / Project case study surfaces.

## 2026-06-29 - Long Homepage Cycle 2 Stage 6 / 6 - IMPROVE

### Scope

- Completed the Stage 5 follow-up direction by making restored comparison links self-explanatory after the intro is skipped.
- Added a pure restored-link receipt model to the comparison context helper.
- Rendered `分享视图已恢复` inside the existing CSTD comparison header when a valid URL `compare` state restores the comparison.

### User-visible change

- Visitors opening a shared comparison link now see that the goal path and selected projects were restored from the link before reading the fit band or matrix.
- Plain `/cstd` visits and manual in-page comparisons do not show the restored-link receipt.

### Verification evidence

- TDD red failed before `receipt`, `restoredFromUrl`, and component wiring existed; focused tests passed 2 files / 13 tests after implementation.
- Related comparison, URL-state, next-step, scan, motion, and mobile-layout tests passed 9 files / 56 tests.
- `npm run lint` exited `0`.
- `npm test` passed 44 files / 172 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Local and live clean Edge desktop/mobile checks confirmed direct comparison links showed the restored-link receipt, no intro controls, comparison top `96`, horizontal overflow `0`, no framework overlay, and no console warnings/errors.
- Local plain `/cstd` confirmed the restored-link receipt is absent and the intro still appears.
- Commit `5616952` was pushed to `origin/main`; GitHub Actions run `28368972112` passed install, lint, test, and build.
- Vercel deployment `https://rocodex-37ebyz6n2-muguett-dbys-projects.vercel.app` reached Ready, and live HTTP/browser verification passed on the custom domain.

### Final status

- The six-stage long homepage cycle is complete.
- Residual risk: the restored receipt currently covers comparison links only; focused project and filtered directory links can get matching receipts later if they become primary shared entry points.

### Next direction

- Broaden restored-state receipts to focused project and filtered directory links if sharing those views becomes a primary homepage workflow.
- Keep future CSTD homepage work inside existing decision, evidence, and navigation surfaces rather than adding stacked panels.

## 2026-06-29 - Long Homepage Cycle 2 Stage 5 / 6 - CHECK

### Scope

- Audited the recent CSTD comparison deep-link workflow for URL-state and first-visit behavior.
- Fixed a real P1 issue where clean first-visit comparison or goal links restored state but could still be covered by the automatic intro overlay.
- Added a validated active view-state helper so `category`, `q`, `goal`, `project`, and `compare` all participate in intro gating after invalid values are normalized away.

### User-visible change

- Shared CSTD project-state links now open directly into the restored decision surface without requiring the visitor to dismiss the intro first.
- Plain `/cstd` first visits still show the intended intro entry, so the fix is scoped to restored/shared project-state URLs.

### Verification evidence

- TDD red failed on the missing active view-state helper and old `hasProjectFocus` intro gate, then focused tests passed 3 files / 19 tests.
- Related URL-state, comparison, next-step, scan, workflow, motion, and mobile-layout tests passed 10 files / 60 tests.
- `npm run ci:local` completed `npm ci` with 0 vulnerabilities.
- `npm run lint` exited `0`.
- `npm test` passed 44 files / 169 tests.
- `npm run build` exited `0` and generated 735 static pages.
- `npm audit --json` reported 0 vulnerabilities.
- Local and live clean Edge desktop/mobile checks confirmed direct comparison links showed no intro controls, landed at `#project-comparison`, had target top `96`, horizontal overflow `0`, no framework overlay, and no console warnings/errors.
- Local clean Edge plain `/cstd` confirmed the intro still appears with `开启 CSTD` and `直接浏览项目`.
- Commit `cbc1eac` was pushed to `origin/main`; GitHub Actions run `28366577353` passed install, lint, test, and build.
- Vercel deployment `https://rocodex-bdevhiv15-muguett-dbys-projects.vercel.app` reached Ready, and live HTTP/browser verification passed on the custom domain.

### Next direction

- Use Stage 6 to make restored comparison links more self-explanatory after the intro is skipped, without adding another homepage panel.
- Keep future public URL parameters covered by `hasActiveCstdProjectViewState` when they should suppress the first-visit intro.

## 2026-06-28 — Long Homepage Round 5 Stage 6 / 6 — IMPROVE

### Scope

- Refreshed the existing `/cstd` hero status blocks instead of adding another panel.
- Updated latest improvements to highlight URL view recovery, current-view sharing, project comparison, and the clean 3D runtime.
- Updated capability and acceptance summaries to reflect searchable/shareable/comparable evidence, clean browser runtime, and green GitHub Actions/Vercel status.

### Verification evidence

- Focused TDD failed before implementation because the homepage summary data still had the old labels, then passed 3 / 3 after updating the data.
- `npm run lint` exited `0`.
- `npm test` passed 36 files / 128 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Local HTTP `/cstd` returned `200` and included `视图记忆`, `项目对比`, `运行时清洁`, and `远端绿色`.
- In-app Browser verification covered 1366x900 and 390x844 `/cstd`; new labels were visible, summary aria-labels matched, no horizontal overflow was present, and console errors/warnings were `0`.
- Commit `669b1e2` was pushed to `origin/main`.
- GitHub Actions CI run `28300188342` completed successfully.
- Vercel production deployment `dpl_7i3UA8kn9noM7UavFPtCkiWpiWBd` completed Ready.
- Live smoke passed on `https://custard.top`, `https://rocodex.vercel.app/cstd`, and `https://rocodex.custard.top/cstd` with the new Stage 6 summary text.

### Follow-up candidates

- Revisit the exact Three.js pin after React Three Fiber releases its Timer migration.
- Keep future homepage work inside the existing evidence/navigation surfaces unless a genuinely new workflow appears.

## 2026-06-28 — Long Homepage Round 5 Stage 5 / 6 — CHECK

### Scope

- Investigated the `THREE.Clock` browser deprecation warning observed during Stage 4 verification.
- Fixed the warning by exact-pinning Three.js before the deprecation release while upstream React Three Fiber Timer migration is still unreleased.
- Added a dependency-policy regression test so the project cannot silently float back to a warning-producing Three.js version.

### Verification evidence

- Focused TDD failed before implementation because `package.json` still specified `three` and `@types/three` as `^0.184.0`, then passed after exact pinning to `0.182.0`.
- `npm run ci:local` completed a clean `npm ci` with 0 vulnerabilities.
- `npm run lint` exited `0`.
- `npm test` passed 36 files / 128 tests.
- `npm run build` exited `0` and generated 735 static pages.
- `npm audit --json` found 0 vulnerabilities; TODO/FIXME/console.log/debugger and secret-extension scans had no matches.
- HTTP smoke covered 13 local production routes and all returned `200`.
- In-app Browser verification covered `/cstd` at 1366x900 and 390x844, mascot click interaction, visible desktop/mobile canvas, mobile menu interaction, no horizontal overflow, and console errors/warnings `0`; the previous `THREE.Clock` warning was gone.
- Commit `c81cfa5` was pushed to `origin/main`.
- GitHub Actions CI run `28299933916` completed successfully.
- Vercel production deployment `dpl_F68Py3DTeCD1TzqcoqXsHoBkKoYX` completed Ready; `https://custard.top`, `https://rocodex.vercel.app/cstd`, and `https://rocodex.custard.top/cstd` returned public CSTD homepage responses.

### Follow-up candidates

- Stage 6 should refresh the visible homepage acceptance summary so it reflects the new comparison flow, runtime-warning check, and green CI/Vercel status.
- Track upstream React Three Fiber Timer migration and revisit the Three.js pin after a released version removes internal `THREE.Clock` usage.

## 2026-06-28 — Long Homepage Round 5 Stage 4 / 6 — IMPROVE

### Scope

- Added a strict two-project comparison flow for live `/cstd` projects.
- Reused existing project evidence to compare type, current state, responsibility, delivered outcome, and technology tags.
- Added accessible selection/removal controls and responsive one-column mobile / two-column desktop presentation.

### Verification evidence

- Focused TDD failed before implementation because the comparison module, control helper, and layout constants were missing, then passed 4 / 4 comparison tests and 12 / 12 mobile-layout tests.
- `npm run lint` exited `0`.
- `npm test` passed 35 files / 127 tests.
- `npm run build` exited `0` and generated 735 static pages.
- In-app Browser verification covered 1366x900 and 390x844; the full two-project matrix rendered, third selection was disabled, remove/clear restored state, no horizontal overflow was present, and console errors were `0`.
- Commit `a6a1d84` was pushed to `origin/main`.
- GitHub Actions CI run `28299182654` and Vercel deployment status both completed successfully.

### Follow-up candidates

- Investigate the observed `THREE.Clock` deprecation warning during the Stage 5 production check.
- Keep comparison data derived from the canonical project records so homepage proof does not drift.

## 2026-06-28 — Long Homepage Round 5 Stage 3 / 6 — UIUX

### Scope

- Added explicit category and keyword condition badges to the `/cstd` project directory toolbar.
- Stabilized the toolbar actions with stacked full-width controls on narrow mobile screens and compact desktop alignment.

### Verification evidence

- Focused TDD failed before implementation because the badge helper and responsive toolbar constants were missing, then passed 11 / 11 filter tests and 11 / 11 mobile-layout tests after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 34 files / 122 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification covered desktop and 390px mobile `/cstd?category=operations&q=CRM#projects`; active-condition badges were visible, actions did not overlap, mobile controls stacked cleanly, no horizontal overflow was present, and console errors were `0`.
- Commit `ac68e81` was pushed to `origin/main`.
- GitHub Actions CI run `28298689704` and Vercel deployment status both completed successfully.

### Follow-up candidates

- Add a focused two-project comparison flow using existing project evidence instead of adding another broad homepage section.
- Keep the comparison selection lightweight and reversible, with a strict two-project limit.

## 2026-06-28 — Long Homepage Round 5 Stage 2 / 6 — IMPROVE

### Scope

- Added `复制当前视图` to the `/cstd` project directory toolbar.
- The action copies an absolute URL for the current `category` and `q` state, with success feedback and manual-copy fallback.

### Verification evidence

- Focused TDD failed before implementation because the absolute share URL helper was missing, then passed 10 / 10 after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 34 files / 120 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification in local Chrome covered desktop and 390px mobile `/cstd?category=operations&q=CRM#projects`; clipboard content matched the current filtered view URL, no horizontal overflow, and console errors were `0`.
- Commit `ec84a84` was pushed to `origin/main`.
- GitHub Actions CI run `28298430484` and Vercel deployment status both completed successfully.

### Follow-up candidates

- Use the UI/UX stage to make the project toolbar more compact and visually stable now that it has search, filters, reset, and share controls.
- Consider exposing the current view URL as a small non-copy permalink only if browser clipboard fallback evidence shows repeated failures.

## 2026-06-28 — Long Homepage Round 5 Stage 1 / 6 — IMPROVE

### Scope

- Made the `/cstd` project directory category/search state recoverable from URL parameters.
- Added URL helpers for `category` and `q`, and wired filter/search/reset/focus-close interactions to stable `#projects` links.

### Verification evidence

- Focused TDD failed before implementation because the URL state helpers were missing, then passed 9 / 9 after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 34 files / 119 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification in local Chrome covered desktop and 390px mobile `/cstd?category=creative&q=南京#projects`; the directory restored `创作影像 + 南京`, URL updates worked after editing search, no horizontal overflow, and console errors were `0`.
- Commit `40f7461` was pushed to `origin/main`.
- GitHub Actions CI run `28298205378` and Vercel deployment status both completed successfully.

### Follow-up candidates

- Add a one-click share action for the current filtered project directory view.
- Keep future homepage additions focused on navigation, proof, and reuse instead of new stacked panels.

## 2026-06-26 — Long Homepage Round 4 Stage 6 / 6 — IMPROVE

### Scope

- Added an `Acceptance status` block to the `/cstd` hero.
- The block summarizes this round's visible acceptance state: capability index, proof timeline, deep-link directory, and local CI.

### Verification evidence

- Focused TDD failed before implementation because `cstdHomepageAcceptance` was undefined, then passed after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 34 files / 117 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification in local Chrome covered desktop and 390px mobile `/cstd`; `Acceptance status` and all four acceptance labels were visible, no horizontal overflow, and console errors were `0`.
- Commit `c97aa38` was pushed to `origin/main`.
- GitHub Actions CI run `28238931144` and Vercel deployment status both completed successfully.

### Follow-up candidates

- Keep the homepage focused: future additions should consolidate proof and navigation rather than add more stacked panels.
- Consider adding a small public changelog route if the project evidence continues to grow.

## 2026-06-26 — Long Homepage Round 4 Stage 5 / 6 — CHECK

### Scope

- Fixed a Windows local CI install risk where stale `next start` processes from this repo can lock Next's SWC binary and make `npm ci` fail with `EPERM unlink`.
- Added `npm run ci:local` and `scripts/stop-local-next.ps1` to stop only current-repo Next processes before clean install.

### Verification evidence

- Focused TDD failed before implementation because `scripts/stop-local-next.ps1` was missing, then passed after implementation.
- `npm run ci:local` completed `npm ci` successfully with 0 vulnerabilities; npm emitted allow-scripts review warnings for `sharp` and `unrs-resolver`.
- `npm run lint` exited `0`.
- `npm test` passed 34 files / 116 tests.
- `npm run build` exited `0` and generated 735 static pages.
- 13 key routes returned HTTP `200`.
- Browser verification in local Chrome covered desktop and 390px mobile `/cstd?project=crm#project-focus`; intro was skipped, focus panel and copy status were visible, no horizontal overflow, and console errors were `0`.
- Commits `33086d0` and `8ecb184` were pushed to `origin/main`.
- GitHub Actions CI run `28238533912` for `8ecb184` and Vercel deployment status both completed successfully; the prior `33086d0` run was cancelled by concurrency after the follow-up script commit.

## 2026-06-26 — Long Homepage Round 4 Stage 4 / 6 — IMPROVE

### Scope

- Added a `Capability index` / `按能力看项目` panel to `/cstd`.
- The panel groups live projects into product engineering, AI creation/research, and operations system lanes with direct case-study focus buttons.

### Verification evidence

- Focused TDD failed before implementation because `cstd-project-capability-index` did not exist, then passed after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 33 files / 115 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification in local Chrome covered desktop and 390px mobile `/cstd`; all three capability lanes were visible, CRM lane click opened the CRM focus URL, no horizontal overflow, and console errors were `0`.
- Commit `a860faa` was pushed to `origin/main`.
- GitHub Actions CI run `28235672074` and Vercel deployment status both completed successfully.

## 2026-06-26 — Long Homepage Round 4 Stage 3 / 6 — UIUX

### Scope

- Reworked the `/cstd` evidence overview into a clearer `项目分享中心`.
- Copy actions now live in two labeled responsive cards, and the proof timeline uses a tested 1/2/5-column responsive grid.

### Verification evidence

- Focused TDD failed before implementation because the share/timeline layout constants were missing, then passed after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 32 files / 114 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification in local Chrome covered desktop and 390px mobile `/cstd`; share center labels and both copy statuses were visible, no horizontal overflow, and console errors were `0`.
- Commit `0273c39` was pushed to `origin/main`.
- GitHub Actions CI run `28235364518` and Vercel deployment status both completed successfully.

## 2026-06-26 — Long Homepage Round 4 Stage 2 / 6 — IMPROVE

### Scope

- Added `复制项目深链目录` to the `/cstd` evidence overview.
- The copied directory includes every live project's focus URL and excludes the incubating placeholder.

### Verification evidence

- Focused TDD failed before implementation because `buildCstdProjectLinkDirectory` was missing, then passed after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 32 files / 113 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification in local Chrome covered desktop and 390px mobile copy flows; clipboard content included CRM and Design focus links, excluded the incubating project, no horizontal overflow, and console errors were `0`.
- Commit `b9f587a` was pushed to `origin/main`.
- GitHub Actions CI run `28234985262` and Vercel deployment status both completed successfully.

## 2026-06-26 — Long Homepage Round 4 Stage 1 / 6 — IMPROVE

### Scope

- Added a `Proof timeline` to the `/cstd` evidence overview.
- The timeline orders live projects by current production/verification signal and shows each project's delivery proof.

### Verification evidence

- Focused TDD failed before implementation because `cstd-project-proof-timeline` did not exist, then passed after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 32 files / 112 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification in local Chrome covered desktop and 390px mobile `/cstd`; `Proof timeline` and the proof summary were visible, no horizontal overflow, and console errors were `0`.
- Commit `859f568` was pushed to `origin/main`.
- GitHub Actions CI run `28234623735` and Vercel deployment status both completed successfully.

## 2026-06-26 — Long Homepage Round 3 Stage 6 / 6 — IMPROVE

### Scope

- Added a hero `Capability checklist` to summarize the homepage's finished capabilities.
- The checklist shows the homepage is searchable, verifiable, copyable, deep-linkable, and deployable.

### Verification evidence

- Focused TDD failed before implementation because `cstdHomepageCapabilities` was undefined, then passed after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 31 files / 111 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification in local Chrome covered desktop and 390px mobile `/cstd`; checklist and `可深链` were visible, no horizontal overflow, and console errors were `0`.
- 13 key routes returned HTTP `200`.
- Full `npm audit --json` reported 0 vulnerabilities.
- Commit `8965b6d` was pushed to `origin/main`.
- GitHub Actions CI run `28234061879` and Vercel deployment status both completed successfully.

## 2026-06-26 — Long Homepage Round 3 Stage 5 / 6 — CHECK

### Scope

- Ran CI/dependency/history checks: latest 10 GitHub Actions CI runs were successful and `npm audit` reported 0 vulnerabilities.
- Fixed the first-visit project deep-link overlay issue by skipping automatic intro when a valid `?project=` focus link is present.

### Verification evidence

- Focused TDD failed before implementation because project deep links still played the intro, then passed after implementation.
- `npm ci` passed with 0 vulnerabilities; npm emitted allow-scripts review warnings for `sharp` and `unrs-resolver`.
- `npm run lint` exited `0`.
- `npm test` passed 31 files / 110 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification in local Chrome covered desktop and 390px mobile first-visit `/cstd?project=crm#project-focus`; intro was not visible, focus panel was visible, no horizontal overflow, and console errors were `0`.
- 13 key routes returned HTTP `200`.
- Commit `c117a29` was pushed to `origin/main`.
- GitHub Actions CI run `28233247671` and Vercel deployment status both completed successfully.

## 2026-06-26 — Long Homepage Round 3 Stage 4 / 6 — IMPROVE

### Scope

- Added a copyable `项目组合摘要` to the `/cstd` evidence overview.
- The summary packages live project count, complete evidence count, each live project's current status, delivery evidence, and external link.
- Added success feedback and unsupported/failure fallback text area for manual copying.

### Verification evidence

- Focused TDD failed before implementation because `cstd-project-portfolio-brief` did not exist, then passed after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 31 files / 109 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification in local Chrome covered desktop and 390px mobile copy flows after setting intro as seen; clipboard content was correct, no horizontal overflow, and console errors were `0`.
- 13 key routes returned HTTP `200`.
- Full `npm audit --json` reported 0 vulnerabilities.
- Commit `f6e6b3b` was pushed to `origin/main`.
- GitHub Actions CI run `28232842747` and Vercel deployment status both completed successfully.

## 2026-06-26 — Long Homepage Round 3 Stage 3 / 6 — UIUX

### Scope

- Upgraded the `/cstd` project focus panel into a clearer scan-and-act case-study surface.
- Added checklist completeness text, responsive focus-panel layout helpers, and a sticky desktop action rail.

### Verification evidence

- Focused TDD failed before implementation because the summary helper and focus layout classes were missing, then passed after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 30 files / 108 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification in local Chrome covered desktop and 390px mobile focus panels with no horizontal overflow and console errors `0`.
- 13 key routes returned HTTP `200`.
- Full `npm audit --json` reported 0 vulnerabilities.
- Commit `a317a69` was pushed to `origin/main`.
- GitHub Actions CI run `28221810953` and Vercel deployment status both completed successfully.

## 2026-06-26 — Long Homepage Round 3 Stage 2 / 6 — IMPROVE

### Scope

- Added a per-project `证据清单` to the `/cstd` project focus panel.
- The checklist makes role, problem, delivered outcome, and current status evidence scannable before opening an external project.

### Verification evidence

- Focused TDD failed before implementation because `getCstdProjectEvidenceChecklist` was not a function, then passed after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 30 files / 106 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification in local Chrome covered desktop and 390px mobile focus panels with no horizontal overflow and console errors `0`.
- 13 key routes returned HTTP `200`.
- Full `npm audit --json` reported 0 vulnerabilities.
- Commit `d95320c` was pushed to `origin/main`.
- GitHub Actions CI run `28221433932` and Vercel deployment status both completed successfully.

## 2026-06-26 — Long Homepage Round 3 Stage 1 / 6 — IMPROVE

### Scope

- Added an `Evidence overview` panel to the `/cstd` project section.
- The panel summarizes live projects, complete case-study evidence, and covered core usage scenarios before visitors use search or filters.

### Verification evidence

- Focused TDD failed before implementation because `cstd-project-evidence-overview` did not exist, then passed after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 30 files / 105 tests.
- `npm run build` exited `0` and generated 735 static pages.
- `/cstd` production-rendered HTTP content contained the new evidence overview and summary text.
- 13 key routes returned HTTP `200`.
- Full `npm audit --json` reported 0 vulnerabilities.
- Commit `369bde5` was pushed to `origin/main`.
- GitHub Actions CI run `28221022639` and Vercel deployment status both completed successfully.

## 2026-06-26 — Long Homepage Round 2 Stage 6 / 6 — IMPROVE

### Scope

- Added a CSTD hero `Latest updates` strip summarizing this round's homepage improvements.
- The strip surfaces project search, case navigation, project brief copy, and green CI/deployment status.

### Verification evidence

- Focused TDD failed before implementation because `cstd-homepage-updates` did not exist, then passed after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 29 files / 104 tests.
- `npm run build` exited `0` and generated 735 static pages.
- `/cstd` production-rendered HTTP content contained `最近优化 4 项`, `项目搜索`, and `CI 绿色`.
- 13 key routes returned HTTP `200`.
- Full `npm audit --json` reported 0 vulnerabilities.
- Commit `0c0079b` was pushed to `origin/main`.
- GitHub Actions CI and Vercel deployment status both completed successfully.

## 2026-06-26 — Long Homepage Round 2 Stage 5 / 6 — CHECK

### Scope

- Audited GitHub Actions, local CI parity, dependency audit, HTTP smoke, and browser smoke options.
- Upgraded CI action pins to `actions/checkout@v7` and `actions/setup-node@v6`.
- Updated the workflow guard test and lockfile; full `npm audit` now reports 0 vulnerabilities.

### Verification evidence

- Latest 10 baseline GitHub Actions runs on `main` were already successful.
- TDD failed while workflow action pins were still v4, then passed after upgrading the pins.
- `npm ci` passed after stopping a local production server that locked Next's Windows SWC binary.
- `npm run lint` exited `0`.
- `npm test` passed 28 files / 103 tests.
- `npm run build` exited `0` and generated 735 static pages.
- HTTP smoke returned `200` for 13 key routes.
- Browser smoke was blocked by browser tooling/runtime issues: Browser attach timeout, incomplete bundled Playwright package, and Chrome/Edge CDP startup failure.
- Commit `0dba81d` was pushed to `origin/main`.
- GitHub Actions CI and Vercel deployment status both completed successfully.

## 2026-06-26 — Long Homepage Round 2 Stage 4 / 6 — IMPROVE

### Scope

- Added a copyable plain-text project brief to the `/cstd` focus panel.
- The brief includes title, current state, role, problem, delivered outcome, and project link.
- Added separate brief-copy feedback and a read-only fallback when browser clipboard access fails.

### Verification evidence

- Focused TDD failed before implementation because `buildCstdProjectBrief` did not exist, then passed after implementation.
- Focused project focus and filter tests passed 12 / 12.
- `npm run lint` exited `0`.
- `npm test` passed 28 files / 103 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification covered CRM focus brief copy, clipboard content, 390px mobile overflow, and console errors `0`.
- Commit `e4e6cfe` was pushed to `origin/main`.
- GitHub Actions CI and Vercel deployment status both completed successfully.

## 2026-06-26 — Long Homepage Round 2 Stage 3 / 6 — UIUX

### Scope

- Added a compact active-state strip for the `/cstd` project directory controls.
- The strip names default, category-only, search-only, and combined filter/search states.
- Added one reset command that clears both category and keyword controls.

### Verification evidence

- Focused TDD failed before implementation because `getCstdProjectControlSummary` did not exist, then passed after implementation.
- Focused project filter and focus tests passed 11 / 11.
- `npm run lint` exited `0`.
- `npm test` passed 28 files / 102 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification covered combined `创作影像` + `南京` state, reset to `浏览全部项目`, desktop/mobile overflow, and console errors `0`.
- Commit `0f1e5c9` was pushed to `origin/main`.
- GitHub Actions CI and Vercel deployment status both completed successfully.

## 2026-06-26 — Long Homepage Round 2 Stage 2 / 6 — IMPROVE

### Scope

- Added previous/next navigation inside the `/cstd` project focus panel.
- Navigation follows the canonical project order, updates the focus URL, and preserves the existing close/copy/external actions.

### Verification evidence

- Focused TDD failed before implementation because `getCstdProjectFocusNavigation` did not exist, then passed after implementation.
- Focused project focus and filter tests passed 10 / 10.
- `npm run lint` exited `0`.
- `npm test` passed 28 files / 101 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification covered `/cstd?project=design#project-focus`, next navigation to `crm`, previous navigation back to `design`, 390px mobile overflow, and console errors `0`.
- Commit `95b654c` was pushed to `origin/main`.
- GitHub Actions CI run `28210682871` and Vercel deployment status both completed successfully.

## 2026-06-26 — Long Homepage Round 2 Stage 1 / 6 — IMPROVE

### Scope

- Added keyword search to the `/cstd` project directory.
- Search now composes with category filters and covers titles, descriptions, tags, metrics, and evidence text.
- Added a clearable search input plus a resettable no-result state.

### Verification evidence

- Focused TDD failed before implementation because `filterCstdProjects` ignored the query argument, then passed 6 / 6 after implementation.
- Related mobile layout tests passed in the focused regression run.
- `npm run lint` exited `0`.
- `npm test` passed 28 files / 100 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser plugin loaded `/cstd` successfully; Playwright fallback completed search, empty-state reset, 390px mobile overflow, and console-error verification after Browser screenshot capture timed out.
- Commit `2187c2a` was pushed to `origin/main`.
- GitHub Actions CI run `28209172739` and Vercel deployment status both completed successfully.

## 2026-06-26 — Long Homepage Stage 6 / 6 — IMPROVE

### Scope

- Removed automatic background-music startup and global audio activation listeners from the CSTD landing page.
- Made the sound control explicitly start idle audio and stop active audio.

### Verification evidence

- TDD failed while `listenForCstdAudioActivation` and `tryStartBgm` were still present, then passed 1 / 1 after removal.
- Existing intro-sound tests passed 7 / 7.
- `npm run lint` exited `0`.
- `npm test` passed 28 files / 98 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification proved no `Audio` construction on load, BGM construction only after clicking `声音：待播`, no mobile overflow, and no console errors.

### Follow-up candidates

- Revisit the GitHub Actions annotation when `actions/checkout` and `actions/setup-node` publish major versions that no longer target Node.js 20 internally.

## 2026-06-26 — Long Homepage Stage 5 / 6 — CHECK

### Scope

- Added a GitHub Actions CI workflow for `main` and pull requests.
- Added a static test that guards the workflow's lint/test/build gates.

### Verification evidence

- TDD failed before `.github/workflows/ci.yml` existed and passed 1 / 1 after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 27 files / 97 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser smoke verified `/cstd` at 390 px with no horizontal overflow and no console errors.

### Follow-up candidates

- After push, watch the new GitHub Actions run to completion and record its run ID.

## 2026-06-26 — Long Homepage Stage 4 / 6 — IMPROVE

### Scope

- Added a goal-based project guide above the project index.
- Routed guide clicks into the existing shareable project focus panel.

### Verification evidence

- TDD failed before the goal-guide module existed and passed 2 / 2 after implementation.
- Related project, card, and focus tests passed 7 / 7.
- `npm run lint` exited `0`.
- `npm test` passed 26 files / 96 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification covered guide rendering, CRM guide-to-focus flow, final concise guide status copy, 390 px mobile overflow, screenshots, and console errors.

### Follow-up candidates

- Add repository CI so homepage changes receive a current GitHub Actions signal instead of relying only on Vercel commit statuses.

## 2026-06-26 — Long Homepage Stage 3 / 6 — UIUX

### Scope

- Converted project cards from full evidence blocks into compact role/current-status previews.
- Added project-specific accessible names for the repeated `查看案例` controls.

### Verification evidence

- TDD failed before the card helper existed and passed 2 / 2 after implementation.
- Related project, focus, and layout tests passed 15 / 15.
- `npm run lint` exited `0`.
- `npm test` passed 25 files / 94 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification covered compact card copy, preserved focus-panel details, accessible button labels, desktop and 390 px mobile screenshots, overflow, and console errors.

### Follow-up candidates

- Add goal-based project recommendations above the grid so visitors can choose by intent instead of project name.

## 2026-06-26 — Long Homepage Stage 2 / 6 — IMPROVE

### Scope

- Added shareable project case-study focus URLs with `?project=<id>#project-focus`.
- Added an inline project focus panel with close, visit, copy-link, and copy-result states.

### Verification evidence

- TDD failed before the project-focus helper existed and passed 3 / 3 after implementation.
- Related project evidence and filtering tests passed 6 / 6.
- `npm run lint` exited `0`.
- `npm test` passed 24 files / 92 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification covered RocoDex card focus, CRM deep link, copy feedback, close-to-directory URL cleanup, 390 px mobile overflow, screenshots, and console errors.
- Commit `fbaa939` was pushed to `origin/main`; Vercel completed successfully and no current GitHub Actions run was created.

### Follow-up candidates

- Compact the project cards now that full evidence can live in the focused case-study panel.
- Improve project card button accessible names so repeated `查看案例` controls are easier to distinguish in automation and assistive tech.

## 2026-06-26 — Long Homepage Stage 1 / 6 — IMPROVE

### Scope

- Added honest case-study evidence to every live CSTD project.
- Extracted project metadata from the large landing component into a tested library module.

### Verification evidence

- TDD red/green completed for the missing project evidence module.
- `npm run lint` exited `0`.
- `npm test` passed 23 files / 89 tests.
- `npm run build` generated 735 static pages.
- Browser verification covered desktop, 390 px mobile, operations filtering, evidence content, overflow, and console errors.
- Commit `414c876` was pushed to `origin/main`; Vercel completed successfully and no new GitHub Actions run was created.

### Follow-up candidates

- Add a focused, shareable case-study view for one project at a time.
- Reduce the visual height of the full project grid through a clearer master-detail browsing pattern.

## 2026-06-26 — Homepage Continuation Stage 2 / 2 — UIUX

### Scope

- Replaced the permanent six-button CSTD mobile navigation grid with an accessible collapsible project menu.
- Added a sticky mobile header while preserving desktop project shortcuts.

### Verification evidence

- Focused TDD failed before implementation and passed 2 / 2 after the navigation helper was added.
- Mobile layout tests passed 7 / 7.
- `npm run lint` exited `0`.
- `npm test` passed 22 files / 86 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification covered collapsed/open/closed states, six navigation links, `#projects` handoff, sticky positioning, 390 × 844 overflow, keyboard focus outline, desktop visibility, screenshots, and console errors.
- Commit `14b8ddf` was pushed to `origin/main`; Vercel completed successfully and no new GitHub Actions run was created.

### Follow-up candidates

- Add concise case-study evidence for selected projects: role, problem, outcome, and current status.
- Revisit the React Three Fiber `Clock` warning when upstream ships a supported `Timer` migration.
- Consider pausing background audio until a deliberate user gesture to further reduce first-load work.

### Recommended next flagship

- Build a focused project case-study layer that adds credibility and outcomes without expanding the homepage into a dense dashboard.

## 2026-06-26 — Homepage Continuation Stage 1 / 2 — IMPROVE

### Scope

- Converted the CSTD cinematic intro from an every-load blocker into a first-visit experience.
- Preserved explicit replay and made reduced-motion visits enter the homepage directly.

### Verification evidence

- Focused TDD failed before implementation and passed 5 / 5 after the decision logic changed.
- `npm run lint` exited `0`.
- `npm test` passed 21 files / 84 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification covered fresh visit, direct browse, repeat reload, manual replay, 390 × 844 reduced-motion layout, overflow, and console errors.
- Commit `b39adba` was pushed to `origin/main`; Vercel completed successfully and no new GitHub Actions run was created.

### Follow-up candidates

- Upgrade the homepage section navigation and project browsing ergonomics in the UI/UX stage.
- Revisit the React Three Fiber clock warning when upstream provides a supported Timer migration.

## 2026-06-26 — Short Run Stage 2 / 2 — UIUX

### Scope

- Added a segmented category filter to the CSTD project directory.
- Improved the scan path for the expanded six-card homepage with visible count feedback and pressed/focus states.

### Changed surfaces

- `/cstd`
- CSTD project filter helper and tests

### Verification evidence

- Focused TDD run failed before implementation because the project filter helper did not exist.
- Focused TDD run passed after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 21 files / 84 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification covered default 6/6 project state, `运营系统` filtered 1/6 state, restored `全部` state, 390px mobile overflow, focusable filter buttons, and console error checks.
- Commit `1867d4c` was pushed to `origin/main`.
- GitHub remote check found no new Actions run for `1867d4c`; Vercel commit status completed successfully.

### Follow-up candidates

- Replace the existing Three.js `Clock` usage with `Timer` to remove the deprecation warning.
- Consider a lighter first-visit path for users who only want to browse the project directory without the intro layer.

## 2026-06-26 — Short Run Stage 1 / 2 — IMPROVE

### Scope

- Added `cstd-design` and `ZJDCRM` to the CSTD personal homepage project directory.
- Updated homepage live project count and top navigation to expose Design and CRM directly.

### Changed surfaces

- `/cstd`
- `custard.top` homepage via middleware rewrite
- CSTD project metadata/layout tests

### Verification evidence

- Focused TDD run failed before implementation because the new project metadata entries did not exist.
- Focused TDD run passed after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 20 files / 80 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification covered `/cstd`, both new project cards, `05 个在线项目`, project-anchor interaction, 390px mobile overflow, and console error checks.
- Commit `a6d2711` was pushed to `origin/main`.
- GitHub remote check found no new Actions run for `a6d2711`; Vercel commit status completed successfully.

### Follow-up candidates

- Use the UI/UX stage to improve the larger six-card project directory scan path.
- Consider replacing the existing Three.js `Clock` usage with `Timer` in a future maintenance pass.

## 2026-06-26 — Stage 1 / 6 — IMPROVE

### Scope

- Built a no-login local collection workflow for saved creatures.
- Connected the collection workflow to comparison through validated query IDs.
- Fixed runtime instability found during browser verification: theme hydration mismatch and missing-auth session errors.

### Changed surfaces

- `/collection`
- `/compare?ids=...`
- Creature cards
- Creature detail pages
- Site header navigation
- `/login` and `/register` when auth secrets are absent

### Verification evidence

- Focused TDD run failed before implementation because collection/theme/auth helper modules and `parseComparisonIds` did not exist.
- Focused TDD run passed after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 17 files / 73 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification covered save/remove controls, collection count, collection-to-compare handoff, 390px mobile overflow, auth-unavailable fallback, and console error checks.
- Commit `8e87ee8` was pushed to `origin/main`.
- GitHub remote check found no Actions run for `8e87ee8`; root `.github/workflows` is absent, and commit check-runs/statuses were both `0`.

### Follow-up candidates

- Add richer collection grouping or notes once account sync requirements are explicit.
- Consider a compact mobile navigation treatment in the UI/UX stage.

## 2026-06-26 — Stage 2 / 6 — IMPROVE

### Scope

- Added collection insights so saved creatures show guide coverage, PVP rating coverage, role coverage, attribute coverage, and next actions.
- Kept the implementation local/static; no auth, database, or network dependency was introduced.

### Changed surfaces

- `/collection`
- README collection documentation

### Verification evidence

- Focused TDD run failed before implementation because `src/lib/collection-insights.ts` did not exist.
- Focused TDD run passed after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 18 files / 74 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification covered `/collection` with two saved creatures, confirmed the insight panel, next-action text, no horizontal overflow, and console errors `0`.
- Commit `909d65b` was pushed to `origin/main`.
- GitHub remote check found no Actions run for `909d65b`; Vercel commit status completed successfully.

## 2026-06-26 — Stage 3 / 6 — UIUX

### Scope

- Reworked the site header for mobile so primary navigation is collapsed by default and opened from an accessible menu button.
- Preserved the desktop horizontal navigation at `md+`.

### Changed surfaces

- Global site header
- Mobile navigation panel

### Verification evidence

- Focused TDD run failed before implementation because `src/lib/site-navigation.ts` did not exist.
- Focused TDD run passed after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 19 files / 76 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification covered 375px mobile collapsed/open header, captured screenshot, confirmed no horizontal overflow, and console errors `0`.
- Commit `a5478ba` was pushed to `origin/main`.
- GitHub remote check found no Actions run for `a5478ba`; Vercel commit status completed successfully.

## 2026-06-26 — Stage 4 / 6 — IMPROVE

### Scope

- Added shareable collection links using `/collection?ids=...`.
- Added explicit import UI that merges shared IDs into local browser collection only after user action.
- Added a copy-share-link action for populated collections.

### Changed surfaces

- `/collection`
- README collection documentation

### Verification evidence

- Focused TDD run failed before implementation because the new share helper exports did not exist.
- Focused TDD run passed after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 19 files / 77 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification covered `/collection?ids=008,009`, confirmed import prompt, import action, saved count, imported creature names, copy-share action, no horizontal overflow, and console errors `0`.
- Commit `4217bd1` was pushed to `origin/main`.
- GitHub remote check found no Actions run for `4217bd1`; Vercel commit status completed successfully.

## 2026-06-26 — Stage 5 / 6 — CHECK

### Scope

- Ran a production-style check across local gates, dependency audit, source hygiene, HTTP routes, and Browser/IAB flows.
- No product code fix was required.

### Verification evidence

- `npm run lint` exited `0`.
- `npm test` passed 19 files / 77 tests.
- `npm run build` exited `0` and generated 735 static pages.
- `npm audit --omit=dev` found 0 vulnerabilities.
- Source hygiene scan found no TODO/FIXME/console.log/debugger matches.
- 13 key routes returned HTTP `200` from local production server.
- Browser smoke covered mobile header, collection share import, compare handoff, auth fallback, and console errors `0`.
- Commit `f097cee` was pushed to `origin/main`.
- GitHub remote check found no Actions run for `f097cee`; Vercel commit status completed successfully.

## 2026-06-26 — Stage 6 / 6 — IMPROVE

### Scope

- Added guide shortcuts from collection items to existing guide detail pages.
- Kept guide slug construction centralized through the existing SEO helper.

### Changed surfaces

- `/collection`
- README collection documentation

### Verification evidence

- Focused TDD run failed before implementation because `src/lib/collection-guide-links.ts` did not exist.
- Focused TDD run passed after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 20 files / 79 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification covered collection import, two rendered guide shortcuts, guide detail navigation for `迪莫`, no horizontal overflow, and console errors `0`.
- Commit `b9c8306` was pushed to `origin/main`.
- GitHub remote check found no Actions run for `b9c8306`; Vercel commit status completed successfully.
- Final completion audit recorded in `.agent/final-completion-audit.md`.

## 2026-06-28 — Preflight Risk Closure

### Scope

- Fixed the remaining public route risk by serving the explicit CSTD entry page at `custard.top/cstd`.
- Removed the local `DEP0205 module.register()` verification warning by exact-pinning the current Next, eslint-config-next, Vitest, Tailwind, and Tailwind PostCSS patch releases.
- Added a toolchain policy test so future installs cannot silently drift away from the verified Node/npm and patch-version baseline.

### Changed surfaces

- `custard.top/cstd` routing behavior
- package version policy
- local verification output hygiene

### Verification evidence

- Focused TDD run failed before implementation for the apex `/cstd` route and missing toolchain policy.
- Focused TDD run passed after implementation.
- `node --trace-deprecation .\node_modules\vitest\vitest.mjs run src/lib/cstd-routing.test.ts` passed with no `DEP0205` output.
- `npm run ci:local` completed clean install and audit with 0 vulnerabilities.
- `npm run lint` exited `0`.
- `npm test` passed 37 files / 130 tests.
- `npm audit --json` reported 0 vulnerabilities.
- `npm run build` exited `0` and generated 735 static pages.
- Local production HTTP checks confirmed the intended CSTD host behavior, including `custard.top/cstd` returning CSTD content and `custard.top/creatures` staying `404`.
- Browser verification covered `/cstd` at 1366px, visible CSTD content, visible canvas, no horizontal overflow, and console errors/warnings `0`.
- Upstream R3F Timer work remains open, so `three@0.182.0` remains the verified mitigation.
- Commit `5056844` was pushed to `origin/main`.
- GitHub Actions run `28305671284` passed install, lint, test, and build.
- Vercel deployment `dpl_B34XRY811YFBjcdSDhe5UofKbHL7` reached `Ready`; live custom-domain browser verification passed with no console errors or overflow.

## 2026-06-28 — Long Homepage Cycle Stage 1 / 6 — IMPROVE

### Scope

- Continued the prior evidence/navigation direction because upstream R3F Timer support is still not available.
- Converted the existing goal guide into a selectable, shareable project-match workflow.
- Fixed in-page navigation history so browser back/forward restores goal and case-study state.

### User-visible change

- A selected visitor goal now reveals one matched project with rationale, current status, delivered outcome, a focused case-study action, a direct live-project action, and a clear action.
- Goal, filter, search, and project focus context share one validated URL model.

### Verification evidence

- TDD red/green completed for stable goal IDs and unified project view state; focused tests passed 6 / 6.
- `npm run lint` exited `0`.
- `npm test` passed 38 files / 134 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Browser verification covered desktop and 390 px mobile goal selection, recommendation content, project focus, copy fallback, history back/forward, overflow, and console warnings/errors `0`.
- Commit `a0a4bf1` was pushed to `origin/main`.
- GitHub Actions CI run `28306227178` completed successfully.
- Vercel commit status completed successfully with description `Deployment has completed`.
- Live custom-domain Browser verification covered `https://custard.top/cstd?goal=ai-creation#projects` and the focused `goal=ai-creation&project=design#project-focus` state with no horizontal overflow and console warnings/errors `0`.

### Next direction

- Make project comparison URL-backed and refresh-safe, preserving it across directory and focus navigation.
- Connect a matched project to a clear comparison handoff inside the existing project directory.
- Use the UI/UX stage to reduce scanning cost across capability, goal, evidence, and comparison surfaces.

## 2026-06-28 — Long Homepage Cycle Stage 2 / 6 — IMPROVE

### Scope

- Made `/cstd` project comparison selection URL-backed with a normalized `compare` parameter.
- Preserved comparison state across filtering, search, goal selection, focus navigation, copy-current-view, clear/remove, and browser back/forward.
- Added a comparison action to the selected goal recommendation so matched projects can enter the existing decision matrix directly.

### User-visible change

- Visitors can now share or reload a project comparison such as `?goal=ai-creation&compare=design%2Ccrm#projects`.
- The recommendation panel no longer dead-ends at case-study/live-project actions; it can seed the comparison workflow in one click.

### Verification evidence

- Focused TDD failed before implementation because comparison ID normalization and `compare` URL state did not exist, then passed 8 / 8 after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 38 files / 135 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Local production Browser verification covered desktop direct comparison links, recommendation-to-compare handoff, adding a second project, browser back restoration, 390 px mobile rendering, no horizontal overflow, and console warnings/errors `0`.
- Commit `411d032` was pushed to `origin/main`.
- GitHub Actions CI run `28307243942` completed successfully.
- Vercel commit status completed successfully with description `Deployment has completed`.
- Live custom-domain Browser verification covered `https://custard.top/cstd?goal=ai-creation&compare=design%2Ccrm#projects`, the selected recommendation comparison state, the ready 2 / 2 matrix, no horizontal overflow, and console warnings/errors `0`.

### Next direction

- Use the UI/UX stage to reduce scanning cost across capability, goal, evidence, and comparison surfaces.
- Keep future improvements inside existing homepage surfaces unless a new workflow has clear decision value.

## 2026-06-28 — Long Homepage Cycle Stage 3 / 6 — UIUX

### Scope

- Added a compact project workflow summary near the project section heading.
- Moved the active comparison matrix directly after goal matching so deep-linked comparisons read as part of the decision path.
- Centralized responsive layout contracts for the summary grid and project heading.

### User-visible change

- Visitors now see the active goal path, evidence base, comparison readiness, and directory scope before scanning the full project index.
- Shared comparison links surface the decision matrix earlier, before the broader evidence and share blocks.

### Verification evidence

- Focused TDD failed before implementation because the workflow summary helper and responsive class contracts were missing or too large for the narrow heading requirement.
- Focused TDD passed 2 files / 16 tests after implementation.
- `npm run lint` exited `0`.
- `npm test` passed 39 files / 139 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Local production Browser verification covered desktop and 390 px mobile direct comparison links, workflow summary rendering, comparison-before-evidence order, no horizontal overflow, and console warnings/errors `0`.
- The recommendation comparison control was exercised in both directions: the URL and summary changed to `1 / 2` after removal and returned to `2 / 2` after adding the project back.
- Direct local HTTP output confirmed the current build emits the updated `text-2xl` project heading class and no old `text-3xl` project heading class after cleaning stale local build/browser state.

### Next direction

- Commit `85c0820` was pushed to `origin/main`.
- GitHub Actions CI run `28312834949` completed successfully.
- Vercel commit status completed successfully with description `Deployment has completed`.
- Live custom-domain Browser verification covered desktop and 390 px mobile summary layout, comparison-before-evidence order, responsive heading behavior, no horizontal overflow, console warnings/errors `0`, and the `1 / 2` to `2 / 2` comparison interaction.
- Turn the workflow summary into contextual navigation and a clear next-step action so visitors can move directly from status to the relevant existing project surface.

## 2026-06-28 — Long Homepage Cycle Stage 4 / 6 — IMPROVE

### Scope

- Turned the CSTD project workflow summary into semantic in-page navigation.
- Added safe anchor contracts for project guide, evidence, comparison, and directory destinations.
- Added one contextual next-step action derived from the active goal and comparison count.

### User-visible change

- Visitors can now move from workflow status directly to the relevant project surface instead of manually scanning the long project section.
- The next action changes between choosing a goal, adding a recommended project, completing comparison evidence, and reviewing the ready comparison matrix.

### Verification evidence

- Focused TDD failed before implementation because item `href` contracts and contextual actions were missing.
- Focused responsive TDD failed while the summary grid still owned outer spacing.
- Focused TDD passed 2 files / 21 tests after implementation.
- `git diff --check` exited `0`; source hygiene checks found no matches.
- `npm run lint` exited `0`.
- `npm test` passed 39 files / 144 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Local production Browser verification covered desktop and 390 px mobile navigation links, all four scroll targets, the ready-comparison next action, the no-goal/goal-only/partial-comparison action branches, no horizontal overflow, and console warnings/errors `0`.
- After the production build, the local `next start` server was restarted and the desktop plus 390 px Browser checks were repeated successfully before the server was stopped.

### Next direction

- Commit `a5b878c` was pushed to `origin/main`.
- GitHub Actions CI run `28314027392` completed successfully.
- Vercel commit status completed successfully with description `Deployment has completed`.
- Live custom-domain Browser verification covered hydrated desktop navigation, all four status-link destinations, the next action, 390 px mobile layout, no horizontal overflow, console warnings/errors `0`, and the no-goal/goal-only/partial-comparison action states.
- Use the CHECK stage to audit URL hydration and navigation-state edge cases, then fix any verified defect before the final improvement stage.

## 2026-06-28 — Long Homepage Cycle Stage 5 / 6 — CHECK

### Scope

- Investigated the deep-link hydration edge case surfaced during Stage 4 live Browser verification.
- Added a regression test to keep initial CSTD project URL-state restoration out of `requestAnimationFrame`.
- Changed the initial project view-state sync to run immediately in a client layout effect while preserving `popstate`.
- Hid the state-aware workflow navigation until URL state has synchronized once, preventing the default next action from being exposed on shared deep links.

### User-visible change

- Shared CSTD project links should restore their goal, comparison, filter, search, and focused-project state before the workflow next action is visible as the wrong default state.

### Verification evidence

- Focused regression test failed before the implementation change because `requestAnimationFrame(syncViewState)` was still present.
- Focused regression test failed again until the synchronized-render guard was added.
- Focused regression test passed after switching to immediate client layout sync and hiding the workflow navigation until URL state has synchronized once.
- Related URL-state, workflow-summary, mobile-layout, and URL-sync tests passed 4 files / 25 tests.
- `git diff --check` exited `0`; source hygiene checks found no matches.
- `npm run lint` exited `0`.
- `npm test` passed 40 files / 145 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Local production Browser verification confirmed the first desktop and 390 px mobile post-load deep-link samples were already hydrated, `defaultStateVisible` was `false`, no horizontal overflow was present, and console warnings/errors were `0`.

### Next direction

- Commit `99d3d12` was pushed to `origin/main`.
- GitHub Actions CI run `28314564319` completed successfully.
- Vercel commit status completed successfully with description `Deployment has completed`.
- Live custom-domain Browser verification confirmed desktop and 390 px mobile first post-load deep-link samples were already hydrated, `defaultStateVisible` was `false`, the next action landed on `#project-comparison`, no horizontal overflow was present, and console warnings/errors were `0`.
- Use the final IMPROVE stage to make deep-linked project decisions more self-contained after the comparison jump, without changing the URL-state contract.

## 2026-06-28 — Long Homepage Cycle Stage 6 / 6 — IMPROVE

### Scope

- Add a comparison-local context line for the active goal and selected project names.
- Keep the change inside the existing comparison matrix and do not alter the URL-state contract.

### User-visible change

- Direct comparison links can be understood after jumping to the matrix because the comparison section itself names the goal path and selected projects.

### Verification evidence

- TDD red: focused comparison-context test failed because the helper did not exist.
- TDD green: focused helper test passed 1 file / 2 tests.
- Related comparison-context, workflow-summary, URL-sync, and mobile-layout tests passed 4 files / 24 tests.
- `git diff --check` exited `0`; source hygiene checks found no matches.
- `npm run lint` exited `0`.
- `npm test` passed 41 files / 147 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Local production Browser verification covered desktop and 390 px mobile comparison jumps, goal/project context visibility, no horizontal overflow, and console warnings/errors `0`.
- Commit `7cae581` was pushed to `origin/main`.
- GitHub Actions CI run `28314925631` completed successfully.
- Vercel commit status completed successfully with description `Deployment has completed`.
- Live custom-domain Browser verification covered desktop and 390 px mobile comparison jumps, the new goal/project context line, no horizontal overflow, no framework error overlay, and console warnings/errors `0`.

### Final status

- Six-stage long homepage cycle completed.

## 2026-06-28 - Long Homepage Cycle 2 Stage 1 / 6 - IMPROVE

### Scope

- Added a pure, tested comparison decision brief built from the active goal and existing comparison matrix.
- Added a shareable comparison URL that preserves goal and project state and targets the comparison surface.
- Added a comparison-local copy action and unified guarded clipboard access for all homepage copy controls.

### User-visible change

- Visitors can copy the current two-project decision, including its evidence and direct URL, without rewriting the comparison manually.
- Incomplete selections remain explicit, and unsupported or failed clipboard actions produce visible feedback.

### Verification evidence

- TDD red failed on two missing brief contracts; TDD green passed the comparison, URL-state, and source-contract suite at 3 files / 13 tests.
- A production type-check failure exposed and drove the missing comparison-hash contract before final verification.
- `git diff --check` exited `0` apart from line-ending notices.
- `npm run lint` exited `0`.
- `npm test` passed 41 files / 151 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Local production Browser verification covered desktop and 390 px mobile comparison deep links, copy feedback, responsive action bounds, no horizontal overflow, no framework error overlay, and console warnings/errors `0`.

### Next direction

- Commit `a16cb88` was pushed to `origin/main`.
- GitHub Actions CI run `28320833059` completed successfully.
- Vercel commit status completed successfully with description `Deployment has completed`.
- Live custom-domain Browser verification covered desktop and 390 px mobile comparison deep links, responsive actions, explicit restricted-clipboard feedback, no horizontal overflow, no framework error overlay, and console warnings/errors `0`.
- Derive goal-to-project fit signals from existing evidence so the comparison can support a decision instead of only transporting raw rows.

## 2026-06-29 - Long Homepage Cycle 2 Stage 2 / 6 - IMPROVE

### Scope

- Added a pure goal-fit helper for CSTD project comparisons.
- Added direct/reference/unscoped fit signals to the comparison matrix and copied comparison brief.
- Fixed direct `#project-comparison` deep links so the page restores the comparison anchor after conditional comparison content renders.

### User-visible change

- Direct comparison links now explain why the selected goal points to one project as `目标直达` and keeps the other as `横向参照`.
- Copied comparison summaries now include the same decision signal instead of only raw evidence rows.

### Verification evidence

- TDD red failed before `getCstdProjectComparisonFit` existed; TDD green passed the focused fit and comparison suite at 3 files / 13 tests.
- URL-sync regression failed before the comparison hash restore existed; it passed after adding the conditional scroll restoration.
- Related comparison, URL-state, and mobile-layout tests passed 6 files / 34 tests.
- `git diff --check` exited `0` apart from line-ending notices; source hygiene checks found no temporary markers or secret patterns.
- `npm run lint` exited `0`.
- `npm test` passed 42 files / 156 tests.
- `npm run build` exited `0` and generated 735 static pages.
- Local production Browser verification covered desktop and 390 px mobile comparison deep links, the fit band, copy feedback, no horizontal overflow, no framework error overlay, and console warnings/errors `0`.

### Next direction

- Commit `c88315b` was pushed to `origin/main`.
- GitHub Actions CI run `28321478335` completed successfully.
- Vercel commit status completed successfully with description `Deployment has completed`.
- Live desktop Browser verification covered hydrated comparison fit, copy feedback, no horizontal overflow, no framework error overlay, and console warnings/errors `0`.
- Live 390 px mobile verification used Edge Playwright fallback because the in-app Browser viewport override did not apply to the live tab; it confirmed viewport `390 x 844`, fit band visibility, copy success feedback, horizontal overflow `0`, and console warnings/errors `0`.
- Use the UIUX stage to make the comparison decision surface easier to scan on small screens, especially the transition from selected project chips into the fit band and evidence rows.

## 2026-06-29 - Long Homepage Cycle 2 Stage 3 / 6 - UIUX

### Scope

- Added a pure comparison scan-summary model for direct match, reference projects, and aligned evidence.
- Added a semantic three-part scan summary and fit labels to selected comparison rows.
- Kept the existing comparison state, copied brief, fit band, and evidence matrix intact.

### User-visible change

- Visitors can scan the decision order before reading the full matrix: direct goal match, horizontal reference, then evidence coverage.
- Selected projects now carry explicit `目标直达` or `横向参照` labels on desktop and mobile.

### Verification evidence

- TDD red failed before the scan helper existed; focused and related tests passed 7 files / 38 tests after implementation.
- `npm run lint` passed, `npm test` passed 43 files / 160 tests, and `npm run build` generated 735 static pages.
- Local and live desktop/mobile acceptance covered scan content, fit-labelled rows, copy feedback, direct hash restoration, horizontal overflow `0`, no framework error overlay, and console warnings/errors `0`.
- Commit `88f89f0` was pushed to `origin/main`; GitHub Actions run `28364021257` and Vercel deployment both completed successfully.

### Next direction

- Add a clear goal-aligned next action that opens the direct-match project from the comparison decision surface without changing the existing URL-state contract.

## 2026-06-29 - Long Homepage Cycle 2 Stage 4 / 6 - IMPROVE

### Scope

- Added a pure three-state comparison next-step model for direct focus, missing-direct alignment, and goal selection.
- Added a responsive action band with station-local case study and live-product actions.
- Fixed comparison-local selection mutations so they preserve `#project-comparison` while the surface remains available.

### User-visible change

- A completed comparison now leads directly to the goal-matched case study and live product.
- A comparison missing its direct project can repair itself with one action while retaining a horizontal reference.

### Verification evidence

- TDD covered five next-step and alignment cases; related suites passed 7 files / 43 tests.
- `npm run lint` passed, `npm test` passed 44 files / 167 tests, and `npm run build` generated 735 static pages.
- Local and live desktop/mobile acceptance covered alignment, removal hash preservation, case focus, live links, responsive action bounds, horizontal overflow `0`, and console warnings/errors `0`.
- Commit `31476ad` was pushed to `origin/main`; GitHub Actions run `28365280889` and Vercel deployment both completed successfully.

### Next direction

- Use the CHECK stage to audit URL-state edge cases, accessibility semantics, external-link safety, and regression gaps across the recent comparison workflow.

## 2026-06-30 - Long Homepage Cycle 3 Stage 3 / 6 - UIUX

### Scope

- Unified restored directory and focused-case receipts in one responsive handoff component.
- Added polite status semantics, a two-level scan hierarchy, and shared layout contracts.
- Increased restored actions to 44 px and gave the focused-case handoff full mobile header width.

### User-visible change

- Restored links now separate the confirmed restored state from the recommended next action.
- Mobile actions fill the available width; desktop actions remain compact.
- The focused-case handoff no longer competes with the project icon and close control for a narrow text column.

### Verification evidence

- TDD red was observed before the component and layout exports existed; focused tests then passed 2 files / 28 tests and related tests passed 6 files / 58 tests.
- `npm run lint` passed, `npm test` passed 44 files / 181 tests, and `npm run build` generated 735 static pages.
- Local in-app Browser and Edge checks covered directory navigation, copy success/fallback feedback, 1366 x 900 and 390 x 844 layouts, 44 px actions, no horizontal overflow, and zero console warnings/errors.
- Commit `d0e6e58` was pushed to `origin/main`; GitHub Actions run `28390015571` and the Vercel deployment completed successfully.
- Live desktop and 390 x 844 checks covered restored directory-to-focus navigation, a 291 px mobile handoff, 44 px actions, copy feedback, no horizontal overflow, and zero console warnings/errors.

### Next direction

- Use Stage 4 to strengthen the restored-entry workflow with a useful follow-through that preserves the existing public URL contract.

## 2026-06-30 - Long Homepage Cycle 3 Stage 4 / 6 - IMPROVE

### Scope

- Added explicit copy-outcome presentation for restored case-study summary copying.
- Added a responsive restored-entry action group for a top copy action plus a live-project continuation link.
- Kept regular project-focus summary-copy feedback in the existing action rail while restored shared links report at the point of action.

### User-visible change

- Shared case-study links now let recipients copy the case summary, see success/fallback feedback in the restored handoff, and open the live CRM project from the same top-level surface.
- Mobile restored case actions stack as 44 px full-width controls; desktop keeps the handoff compact.

### Verification evidence

- TDD red was observed before the helper, layout export, and component integration existed; focused tests then passed 3 files / 38 tests and related tests passed 6 files / 60 tests.
- `git diff --check` passed with only Windows line-ending notices; `npm run lint` passed, `npm test` passed 44 files / 183 tests, and `npm run build` generated 735 static pages.
- Local in-app Browser verified the restricted-clipboard fallback inside the restored handoff with no duplicate lower action-rail feedback, no horizontal overflow, and zero console warnings/errors.
- Local 390 x 844 Edge Playwright verified the success state, `打开 CRM` continuation, 44 px controls, 280 px action widths inside a 306 px handoff, no horizontal overflow, and zero console warnings/errors.
- Commit `19df154` was pushed to `origin/main`; GitHub Actions run `28391638626` and Vercel deployment `dpl_i31myKHZfYJpCyTWBXqvung3hAim` completed successfully.
- Live in-app Browser and 390 x 844 Edge checks covered the same restricted-clipboard fallback and clipboard-success paths on `https://custard.top`, with no duplicate lower action-rail feedback, no horizontal overflow, and zero console warnings/errors.

### Next direction

- Use the CHECK stage to audit restored-entry URL-state and accessibility behavior now that copy feedback can appear in either the restored handoff or the ordinary action rail.

## 2026-06-30 - Long Homepage Cycle 3 Stage 5 / 6 - CHECK

### Scope

- Audited CI config, package scripts, dependency/audit state, auth availability, API registration boundary, and recent restored-entry follow-up behavior.
- Found and fixed a P1 API inconsistency: `/api/register` still accepted registration when auth was disabled by missing Auth.js secrets.

### User-visible change

- When account features are unavailable, direct API registration now returns the same `账号功能暂未启用` state as the login/register UI instead of creating an unusable account record.

### Verification evidence

- TDD red reproduced the disabled-auth registration bug; focused route tests then passed 1 file / 2 tests and related auth/routing tests passed 4 files / 14 tests.
- `npm run ci:local`, `npm run lint`, `npm test`, `npm run build`, and `npm audit --json` passed; full test count is 45 files / 185 tests, build generated 735 static pages, audit found 0 vulnerabilities.
- Local production HTTP smoke with no auth secrets returned `503 {"error":"账号功能暂未启用"}` for `POST /api/register`.
- Commit `7f0ff03` was pushed to `origin/main`; GitHub Actions run `28393299010` and Vercel commit status completed successfully.
- Remote API smoke on `https://rocodex.custard.top/api/register` returned `400 {"error":"用户名和密码不能为空"}` for an empty JSON body, confirming the deployed route rejects invalid live registration input without creating an account.

### Next direction

- Use the final IMPROVE stage to add one high-value, user-facing continuation improvement without changing the auth boundary.

## 2026-06-30 - Long Homepage Cycle 3 Stage 6 / 6 - IMPROVE

### Scope

- Completed the final continuation direction by making restored comparison links actionable from the existing comparison header.
- Added a restored-comparison continuation helper that reuses the existing next-step model.
- Kept the full lower decision band intact while adding a compact top handoff for shared-link recipients.

### User-visible change

- Opening a shared CSTD comparison URL now shows the restored receipt plus an immediate `继续：查看目标直达案例` action.
- On mobile, the restored continuation action is a 44 px touch target and stays inside the comparison receipt.

### Verification evidence

- TDD red reproduced the missing restored continuation helper/header action; focused tests then passed 2 files / 21 tests and related CSTD tests passed 7 files / 56 tests.
- `npm run ci:local`, `npm run lint`, `npm audit --json`, `npm test`, and `npm run build` passed; full test count is 45 files / 188 tests, build generated 735 static pages, audit found 0 vulnerabilities.
- Local desktop and 390 x 844 in-app Browser checks covered restored comparison receipt, 44 px top action, click-through to `project=design#project-focus`, horizontal overflow `0`, no framework overlay, and zero console warnings/errors.
- Commit `af9417e` was pushed to `origin/main`; GitHub Actions run `28406064593` and Vercel production deployment `rocodex-3jnehx8ag-muguett-dbys-projects.vercel.app` completed successfully.
- Live `https://rocodex.custard.top/cstd?goal=ai-creation&compare=design%2Ccrm#project-comparison` confirmed the restored continuation action and click-through to the target case with no console warnings/errors.

### Next direction

- The 6-stage cycle is complete. Next useful work is a lighter pass on cross-page navigation consistency outside the CSTD project workflow, unless a new product direction supersedes it.

## 2026-06-30 - Residual Risk Closure

### Scope

- Closed the dependency, WebGL, E2E, and production-registration residual risks from the release pass.
- Kept Tailwind on the current compatible patch, aligned Node typings with the supported Node 22 runtime, and preserved the Three.js 0.182 compatibility pin after a focused upgrade trial reproduced the upstream React Three Fiber Clock warning.
- Added repository-owned Playwright coverage for core public routes, CSTD fallback interaction, responsive overflow checks, browser console health, and local register/login cleanup.
- Added an opt-in live registration verifier plus a tightly scoped QA cleanup API. The cleanup API only accepts generated `qa-*` usernames, requires the same password used for registration, and deletes only that generated user.

### Verification evidence

- TDD red/green covered the toolchain policy, Three.js compatibility pin, WebGL constrained-context fallback, GitHub Actions E2E contract, Vitest/E2E collection boundary, DB user deletion, QA cleanup route, and live registration verifier cleanup paths.
- `npm run ci:local` passed after stopping local Next and running `npm ci`; `npm install-scripts ls` reported no unreviewed install scripts.
- `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run test:e2e`, `npm run build`, `npm audit --json`, and `git diff --check` passed locally.
- Final local counts: Vitest 51 files / 227 tests passed; Playwright 3 passed / 1 skipped; Next build generated 736 static pages; npm audit found 0 vulnerabilities.
- Test residue checks found no `data/users.json`; `test-results/` and the temporary Vercel env pull file were removed after verification.

### Risk notes

- Vercel production Redis variables are present but encrypted; `vercel env pull` returns only empty placeholders for those secrets. The live verifier therefore supports direct Redis verification when credentials are available and otherwise uses the deployed QA cleanup API to prove create-and-cleanup without exposing production secrets locally.
- Live mobile browser QA on `https://rocodex.custard.top/cstd?goal=portrait-shooting#projects` found that touch/pointer ordering could overwrite the post-click `happy` mascot copy with the hover `working` copy. Added a guarded mascot mood transition so pointer-enter updates cannot hide click feedback during the 900 ms happy window.
- Follow-up verification after the mobile interaction fix: `npx vitest run src/lib/cstd-mascot-mood.test.ts`, `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run test:e2e`, `npm run build`, `npm audit --json`, and `git diff --check` passed locally; full counts were Vitest 52 files / 229 tests, Playwright 3 passed / 1 skipped, build 736 static pages, audit 0 vulnerabilities.
- Live registration acceptance on the final deployment found production Redis DNS failure: Vercel runtime logs showed `getaddrinfo ENOTFOUND blessed-hamster-86513.upstash.io`, so valid registration returned 500 before any cleanup could run. Added storage-unavailable handling so register and cleanup APIs return explicit `503 {"error":"账号功能暂不可用"}` instead of generic 500 while the external Redis endpoint remains stale.
- Follow-up verification after the storage-unavailable handling: focused route tests passed 2 files / 10 tests; `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run test:e2e`, `npm run build`, `npm audit --json`, and `git diff --check` passed locally; full counts were Vitest 52 files / 231 tests, Playwright 3 passed / 1 skipped, build 736 static pages, audit 0 vulnerabilities.
- Final log-hygiene fix changed expected storage-unavailable paths from `console.error` to `console.warn` so Vercel error logs are not polluted by the known stale Redis endpoint. Verification repeated the same local gates: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run test:e2e`, `npm run build`, `npm audit --json`, and `git diff --check` passed.

## 2026-07-01 - Long Homepage Risk Repair Stage 1 / 6 - IMPROVE

### Scope

- Added a read-only account-service status model and endpoint for ready, disabled, and storage-unavailable states.
- Added registration preflight messaging and a local-collection recovery path before credentials can be submitted.
- Made login and registration auth configuration runtime-dynamic instead of build-time static.

### User-visible change

- Visitors now see account storage outages before entering and submitting registration credentials.
- Registration remains blocked while availability is being checked or unavailable, with a direct path to browser-local collection tools.

### Verification evidence

- Focused status, route, register, and runtime-layout tests passed; full local gates passed with 56 Vitest files / 240 tests, Playwright 3 passed / 1 environment-dependent test skipped, 734 static pages, and 0 audit vulnerabilities.
- Local production Browser at 390 x 844 confirmed the outage notice, disabled submit, local-collection click-through, no horizontal overflow, no framework overlay, and zero console warnings/errors.
- Commit `558153d` was pushed to `origin/main`; GitHub Actions run `28456491877` and Vercel deployment completed successfully.
- Live 390 x 844 Browser verification confirmed registration stays disabled during the delayed production probe and after the unavailable notice appears, with horizontal overflow `0` and zero console warnings/errors.

### Next direction

- Extend the same availability and recovery behavior to login so storage outages cannot be mistaken for invalid credentials.

## 2026-07-01 - Long Homepage Risk Repair Stage 2 / 6 - IMPROVE

### Scope

- Added a shared bounded client account-status fetcher with a 6 second abort and unavailable fallback behavior.
- Added a client hook for login and registration so both pages use the same availability state.
- Added explicit checking feedback to login and registration, kept submit disabled until the account service is ready, and exposed the same local-collection recovery action on login.

### User-visible change

- Visitors no longer wait indefinitely for the account-status probe when production storage is stale.
- Login no longer attempts credential auth while account storage is checking or unavailable, avoiding a misleading invalid-credentials experience.

### Verification evidence

- TDD red/green covered the shared client fetcher, login blocking/recovery behavior, and registration checking behavior; focused green tests passed 5 files / 13 tests.
- `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm run test:e2e`, `npm audit --json`, and `git diff --check` passed locally.
- Final local counts: Vitest 58 files / 245 tests passed; Playwright 3 passed / 1 environment-dependent registration test skipped; Next build generated 734 static pages; npm audit found 0 vulnerabilities.
- Local production Browser at 390 x 844 confirmed login and registration show checking states, switch to unavailable after the bounded wait, keep submit disabled, expose `/collection`, click through from login to `/collection`, have horizontal overflow `0`, no framework overlay, and zero console warnings/errors.
- Commit `41f2386` was pushed to `origin/main`; GitHub Actions run `28458720084` and Vercel commit status completed successfully.
- Live 390 x 844 Browser verification confirmed login and registration show checking states, switch to unavailable after the bounded wait, keep submit disabled, expose `/collection`, have horizontal overflow `0`, no framework overlay, and zero console warnings/errors.
- Live login recovery anchor `a[href="/collection"]` navigated to `https://rocodex.custard.top/collection`.

### Risk notes

- Production account creation still requires a valid external Upstash/Vercel storage endpoint; the repository now presents a bounded and recoverable outage path while that dependency remains unavailable.

### Next direction

- Improve the visual hierarchy and reuse of the checking/unavailable account-status surfaces now that both auth pages share the same behavior.

## 2026-07-01 - Long Homepage Risk Repair Stage 3 / 6 - UIUX

### Scope

- Upgraded login and registration account-service status from duplicated inline alerts to a shared `AccountStatusPanel`.
- Added checking spinner, warning icon, button-like recovery action, and explicit disabled-submit helper text.
- Improved mobile auth card spacing and made the recovery action a 44 px touch target.

### User-visible change

- Account outages now read as a deliberate product state instead of a plain warning block.
- Users can see why login/register is disabled and have a clearer local-collection continuation path.

### Verification evidence

- TDD red/green covered the shared status panel, auth-page integration, and disabled helper; focused tests passed 3 files / 6 tests.
- `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm run test:e2e`, `npm audit --json`, and `git diff --check` passed locally.
- Final local counts: Vitest 59 files / 247 tests passed; Playwright 3 passed / 1 environment-dependent registration test skipped; Next build generated 734 static pages; npm audit found 0 vulnerabilities.
- Local production Browser covered desktop and 390 x 844 login/register checking and unavailable states, 44 px recovery actions, disabled helper linkage, `/collection` click-through, horizontal overflow `0`, no framework overlay, and zero console warnings/errors.
- Commit `7131d1f` was pushed to `origin/main`; GitHub Actions run `28459987432` and Vercel commit status completed successfully.
- Live production Browser covered desktop and 390 x 844 login/register checking and unavailable states, 44 px recovery actions, disabled helper linkage, `/collection` click-through, horizontal overflow `0`, no framework overlay, and zero console warnings/errors.

### Risk notes

- Storage recovery still requires valid external Upstash/Vercel credentials; the UI now presents that outage with clearer feedback and a usable local continuation.

### Next direction

- Add a homepage/public navigation continuation that makes the account outage path more discoverable before users reach login or registration.

## 2026-07-01 - Long Homepage Risk Repair Stage 4 / 6 - IMPROVE

### Scope

- Added `HomeAccountContinuity` to surface account-service outages on the homepage before visitors open login/register.
- Reused the bounded account-status hook and shared `AccountStatusPanel`.
- Kept the homepage quiet while account status is loading or ready, avoiding a permanent account banner in healthy environments.

### User-visible change

- When account storage is unavailable, homepage visitors now see the same local-collection recovery path directly below search.
- The first account-related dead end is avoided: users can continue with local tools from the first screen.

### Verification evidence

- TDD red/green covered the homepage continuity component and homepage integration; focused tests passed 1 file / 2 tests.
- `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm run test:e2e`, `npm audit --json`, and `git diff --check` passed locally.
- Final local counts: Vitest 60 files / 249 tests passed; Playwright 3 passed / 1 environment-dependent registration test skipped; Next build generated 734 static pages; npm audit found 0 vulnerabilities.
- Local production Browser covered desktop and 390 x 844 homepage outage visibility, `/collection` click-through, 44 px recovery action, horizontal overflow `0`, no framework overlay, and zero console warnings/errors.
- Commit `566591b` was pushed to `origin/main`; GitHub Actions run `28494753472` and Vercel commit status completed successfully.
- Live production Browser covered desktop and 390 x 844 homepage outage visibility, `/collection` click-through, 44 px recovery action, horizontal overflow `0`, no framework overlay, and zero console warnings/errors.

### Risk notes

- Production account creation still depends on corrected external Upstash/Vercel credentials; the homepage now exposes the recoverable local path while that dependency remains unavailable.

### Next direction

- Audit the account-status and auth outage path for direct API/authorization bypasses, hydration/performance regressions, and stale recovery links.

## 2026-07-01 - Long Homepage Risk Repair Stage 5 / 6 - CHECK

### Scope

- Audited account-status, registration, and credentials login outage handling.
- Found that direct credentials authorization could still let known storage failures escape if a request bypassed the client preflight.
- Added a focused Auth.js credentials-provider regression test and narrowed the fix to the storage lookup boundary.

### Fix

- Known Redis/network storage outages during credentials login now warn and return `null` for a controlled failed sign-in.
- Unknown lookup errors still re-throw, so unrelated auth bugs are not hidden.

### Verification evidence

- TDD red reproduced the direct-login storage outage risk; focused green tests passed 3 files / 10 tests.
- `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm run test:e2e`, `npm audit --json`, and `git diff --check` passed locally.
- Final local counts: Vitest 61 files / 251 tests passed; Playwright 3 passed / 1 environment-dependent registration test skipped; Next build generated 734 static pages; npm audit found 0 vulnerabilities.
- Commit `34d1040` was pushed to `origin/main`; GitHub Actions run `28496842845` and Vercel commit status completed successfully.
- Live production Browser confirmed the login outage UI remains controlled after deploy: unavailable notice, disabled submit, linked helper, 44 px recovery action, horizontal overflow `0`, no framework overlay, and zero console warnings/errors.

### Risk notes

- Successful production account creation/login still requires valid external Upstash/Vercel credentials; this stage prevents known storage outages from becoming unhandled auth exceptions.

### Next direction

- Add a final low-risk user-facing improvement around account recovery confidence, then run the final production acceptance loop.

## 2026-07-01 - Long Homepage Risk Repair Stage 6 / 6 - IMPROVE

### Scope

- Added a second no-account recovery path to the shared account outage panel.
- Kept `/collection` as the primary local-collection continuation and added `/creatures` for visitors who want to keep browsing the public index.
- Changed the outage action area to stack on mobile and sit inline on wider screens, preserving 44 px touch targets.

### User-visible change

- Login, registration, and homepage outage panels now offer both “先用本地收藏” and “继续查精灵” so visitors are not funneled into only one recovery path while account storage is unavailable.

### Verification evidence

- TDD red reproduced the missing `/creatures` recovery action; focused green passed 1 file / 2 tests.
- `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm run test:e2e`, `npm audit --json`, and `git diff --check` passed locally.
- Final local counts: Vitest 61 files / 251 tests passed; Playwright 3 passed / 1 environment-dependent registration test skipped; Next build generated 734 static pages; npm audit found 0 vulnerabilities.
- Local production Browser at 390 x 844 confirmed login and homepage outage UI show both `/collection` and `/creatures`, keep the account path controlled, give both actions 44 px touch height, have horizontal overflow `0`, navigate to `/creatures`, and report zero console/page errors.
- Commit `318264e` was pushed to `origin/main`; GitHub Actions run `28497469178` and Vercel commit status completed successfully.
- Live production Browser at 390 x 844 confirmed login and homepage outage UI show both `/collection` and `/creatures`, keep login disabled during outage, give both actions 44 px touch height, have horizontal overflow `0`, navigate to `/creatures`, and report zero console/page errors.

### Risk notes

- Successful production account creation/login still requires valid external Upstash/Vercel credentials; this stage improves recovery choices while that dependency remains unavailable.

### Final status

- Six-stage long homepage risk repair cycle completed.

## 2026-07-01 - Account Storage Configuration Follow-up

### Scope

- Investigated the remaining production account-storage dependency after the six-stage repair cycle.
- Confirmed Vercel Production has `AUTH_SECRET`, `UPSTASH_REDIS_URL`, and `UPSTASH_REDIS_TOKEN` configured as sensitive variables, while Preview and Development have no account-storage variables.
- Confirmed no Marketplace integration resources are currently connected to the project; Upstash Redis is discoverable but not installed for this team/project.
- Added explicit account-storage configuration validation so Vercel runtimes cannot silently fall back to local file storage when Redis credentials are missing, partial, or supplied as a non-REST `rediss://` socket URL.

### Verification evidence

- TDD red reproduced the missing storage-config module; focused green passed 2 files / 9 tests.
- Account API/register/auth focused tests passed 6 files / 25 tests.
- Full local gates passed: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm run test:e2e`, `npm audit --json`, and `git diff --check`.
- Final local counts: Vitest 62 files / 259 tests passed; Playwright 3 passed / 1 environment-dependent registration test skipped; Next build generated 734 static pages; npm audit found 0 vulnerabilities.
- Local Vercel-like production server with `VERCEL=1` and missing Redis credentials returned `200`, `Cache-Control: no-store`, and `state: "unavailable"` from `/api/account-status`.
- Commit `e22bdb2` was pushed to `origin/main`; GitHub Actions run `28499457641` and Vercel commit status completed successfully.
- Live production Browser at 390 x 844 confirmed login and homepage outage UI still show both `/collection` and `/creatures`, keep login disabled during outage, give both actions 44 px touch height, have horizontal overflow `0`, navigate to `/creatures`, and report zero console/page errors.

### Risk notes

- This fixes the repository-controlled configuration safety risk. Restoring successful production account registration/login still requires valid external Upstash REST credentials in Vercel Production.

## 2026-07-01 - Account Storage Marketplace Recovery

### Scope

- Accepted Upstash Marketplace setup after account-owner terms confirmation and provisioned `rocodex-accounts` as a Vercel-managed Upstash Redis resource.
- Connected the resource to the `rocodex` project for Production on the free plan, `syd1` primary region, with auto-upgrade disabled.
- Confirmed Vercel injected Marketplace REST variables: `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`, `KV_URL`, and `REDIS_URL`.
- Found stale manual `UPSTASH_REDIS_URL` / `UPSTASH_REDIS_TOKEN` variables still present, so account storage needed to prefer Marketplace KV REST credentials.

### Fix

- Updated account-storage config resolution to choose complete credential pairs in this order: Marketplace `KV_REST_API_*`, then `UPSTASH_REDIS_REST_*`, then legacy `UPSTASH_REDIS_*`.
- Added a regression test proving Marketplace KV REST credentials override stale legacy socket credentials.

### Verification evidence

- TDD red reproduced the stale-legacy-variable precedence failure in `src/lib/account-storage-config.test.ts`.
- Focused green passed account-storage config, DB, and account-status tests: 3 files / 14 tests.
- Full local gates passed: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, and `npm run test:e2e`.
- Final local counts: Vitest 62 files / 260 tests passed; Playwright 3 passed / 1 environment-dependent registration test skipped; Next build generated 734 static pages.
- Commit `506d1ba` was pushed to `origin/main`; GitHub Actions run `28513175924` completed successfully; Vercel commit status completed with `Deployment has completed`.
- Live production `/api/account-status` returned `200`, `Cache-Control: no-store`, and `state: "ready"` at `https://rocodex.custard.top`.
- Live production registration verification created and cleaned `qa-mr1z6oc4-5761` through the API cleanup path.
- Live production browser login verification created `qa-mr1zdd7j-f2f7`, logged in through `/login`, confirmed `/api/auth/session.user.name` matched the generated user, reported horizontal overflow `0`, reported browser warnings/errors `0`, and cleaned the account.
- Final Redis scan for `user:qa*` returned `[]`.

### Final status

- Production account registration and login are restored through the Vercel-managed Upstash Redis resource.

## 2026-07-09 - CSTD Main Site WWW Entry Recovery

### Scope

- Started the continuous improvement goal for the personal main site, treating `custard.top` / CSTD as the target surface rather than the RocoDex subdomain.
- Confirmed `main` matched `origin/main`, pulled latest state, and audited CSTD routing, Vercel domain state, project links, sitemap, CI workflow, TODO/debug markers, and recent iteration direction.
- Found a real main-site reachability gap: the code explicitly treated `www.custard.top` as unsupported, while Vercel reported the `www` domain was not attached/configured for the project.
- Added `www.custard.top` to the Vercel `rocodex` project so it is ready once DNS points to Vercel.

### Fix

- Changed CSTD host routing so `www.custard.top` is recognized as part of the CSTD surface and returns a canonical apex redirect decision.
- Updated `src/proxy.ts` to issue a 308 redirect from `www.custard.top` to `https://custard.top`, preserving the path and query string before normal route handling.

### Verification evidence

- Live baseline: `https://custard.top/` returned `200` with the CSTD title; `https://www.custard.top/` failed before app routing with a TLS/DNS configuration error.
- Vercel domain action: `vercel domains add www.custard.top rocodex --non-interactive` returned `domain_added`.
- Vercel verification: `vercel domains verify www.custard.top` returned `invalid_configuration`; recommended Cloudflare DNS record is `CNAME www 0ccdf8b2f445bccf.vercel-dns-017.com.` with proxy disabled.
- TDD red reproduced the old behavior: `src/lib/cstd-routing.test.ts` failed because `www.custard.top` was not a CSTD host and returned `not-found`.
- Focused green passed: `npx vitest run src/lib/cstd-routing.test.ts src/lib/auth-provider-routing.test.ts` passed 2 files / 10 tests.
- Full local gates passed: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm run test:e2e`, `npm audit --json`, and `git diff --check`.
- Local counts: Vitest 62 files / 260 tests passed; Next build generated 734 static pages; Playwright 3 passed / 1 environment-dependent registration test skipped; npm audit found 0 vulnerabilities.
- Local production `next start` on port 3107 returned 308 for `Host: www.custard.top` on `/`, `/cstd?project=crm`, and `/creatures`, preserving path/query; `Host: custard.top` on `/` returned `200` with the CSTD title.
- Commit `55abc41` was pushed to `origin/main`; GitHub Actions run `28975133900` completed successfully; Vercel commit status completed with `Deployment has completed`.
- Live post-deploy smoke returned `200` for `https://custard.top/`, `https://custard.top/?project=crm#project-focus`, `https://custard.top/cstd?project=design#project-focus`, and `https://custard.top/sitemap.xml`.
- Live browser verification covered `https://custard.top/` at 1440 x 900 and `https://custard.top/?project=crm#project-focus` at 390 x 844; both had horizontal overflow `0`, console/page errors `0`, and failed requests `0`.

### Risk notes

- Live `www.custard.top` cannot complete TLS until Cloudflare DNS is updated. Code and Vercel project attachment are ready; the remaining blocker is DNS outside the repository.

## 2026-07-09 - CSTD Main Site External Link Safety

### Scope

- Continued the personal main site improvement loop on the CSTD landing experience.
- Found that primary project buttons such as `打开 RocoDex` and project-card live links navigated away from `custard.top` in the current tab and did not share one explicit external-link policy.

### Fix

- Added `getCstdLinkTargetProps` to classify CSTD-local links versus external project links.
- Updated the shared `HeroButton` so external project links open in a separate tab with `rel="noreferrer"`, while in-page links such as `#projects` and canonical `custard.top` links stay in the current tab.

### Verification evidence

- TDD red reproduced the missing helper through `src/lib/cstd-link-target.test.ts`.
- Focused green passed: `npx vitest run src/lib/cstd-link-target.test.ts src/lib/cstd-routing.test.ts src/lib/cstd-project-card.test.ts` passed 3 files / 11 tests.
- Full local gates passed: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm run test:e2e`, `npm audit --json`, and `git diff --check`.
- Local counts: Vitest 63 files / 262 tests passed; Next build generated 734 static pages; Playwright 3 passed / 1 environment-dependent registration test skipped; npm audit found 0 vulnerabilities.
- Local production browser verification on port 3108 confirmed `打开 RocoDex` renders `target="_blank"` and `rel="noreferrer"`, `看项目` keeps no `target`/`rel`, horizontal overflow is `0`, and browser console/page errors are `0`.
- Commit `5f9c09d` was pushed to `origin/main`; GitHub Actions run `29000741402` completed successfully; Vercel commit status completed with `Deployment has completed`.
- Live browser verification on `https://custard.top/` at 390 x 844 confirmed `打开 RocoDex` renders `target="_blank"` and `rel="noreferrer"`, `看项目` keeps no `target`/`rel`, horizontal overflow is `0`, console/page errors are `0`, and failed requests are `0`.

## 2026-07-11 - CSTD Host-Aware Robots Policy and E2E Readiness

### Scope

- Continued the personal main-site improvement loop by closing the unfinished public crawler entry for `custard.top` without changing the RocoDex product surface.
- Found that the repository had a host-aware sitemap route but no tracked `/robots.txt` route, and the CSTD host allowlist did not admit that public entry.
- During remote closure, found a separate CI-only navigation race: Playwright waited for the full `load` event while noncritical optimized images could remain pending on constrained mobile Chromium.

### Fix

- Added a host-aware `/robots.txt` route that selects the `custard.top` or `rocodex.custard.top` sitemap, allows search crawling, publishes the content-use signal, and denies configured AI-training crawlers.
- Allowed `/robots.txt` through CSTD routing and added `.gitignore` exceptions so the `.txt` route directory is tracked despite the repository-wide `*.txt` rule.
- Changed Playwright server readiness to `/api/auth/session` and changed route navigation waits to `domcontentloaded`.
- Added a regression test that holds a noncritical optimized-image response and proves route navigation completes before that image is released.

### Verification evidence

- TDD red/green covered host-aware robots output, route headers/body, CSTD routing, Playwright readiness, and delayed-image navigation behavior.
- Full local gates passed: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm run test:e2e`, `npm audit --json`, and `git diff --check`.
- Local counts: Vitest 66 files / 268 tests passed; Next build generated 734 static pages and included dynamic `/robots.txt`; Playwright passed 4 tests with 2 environment-dependent skips; npm audit found 0 vulnerabilities.
- Local production host-header checks returned `200` and the correct per-host Sitemap for both `custard.top` and `rocodex.custard.top`.
- Commits `0ad1ced` and `7b84bfd` were pushed to `origin/main`.
- GitHub Actions run `29154293049` exposed the original mobile navigation race on its first attempt; the same-SHA rerun passed. Final regression-fix run `29154691982` completed successfully, including lint, tests, build, and E2E.
- Vercel status for `7b84bfd` completed successfully with `Deployment has completed`.
- Live `https://custard.top/robots.txt` returned `200`, `text/plain`, the CSTD Sitemap, the content-use signal, and the GPTBot denial; it did not contain the RocoDex Sitemap.
- Live `https://rocodex.custard.top/robots.txt` returned `200`, `text/plain`, the RocoDex Sitemap, the same content-use signal, and the GPTBot denial; it did not contain the CSTD Sitemap.
- Live browser checks at 1280 x 720 and 390 x 844 confirmed the CSTD title, the Design and CRM project content/links, horizontal overflow `0`, and zero console errors.

### Risk notes

- No repository-controlled risk remains for this item. Edge providers may prepend managed crawler policy, so future crawler-policy changes should continue to validate the final live response rather than only the origin route.

### Final status

- Host-aware crawler entry and the CI navigation race are closed in production.

## 2026-07-11 - CSTD WWW DNS and TLS Recovery

### Scope

- Reopened the unresolved `www.custard.top` reachability risk from the earlier canonical-host code change.
- Confirmed the repository and Vercel project already knew how to redirect `www` to the apex domain, but Cloudflare had no `www` DNS record and Vercel had no certificate covering that hostname.

### Fix

- Created an unproxied Cloudflare CNAME from `www.custard.top` to Vercel's project-specific target `0ccdf8b2f445bccf.vercel-dns-017.com` with automatic TTL.
- Re-ran Vercel domain verification and explicitly issued an auto-renewing certificate for `www.custard.top`.
- Kept the existing application-level 308 canonical redirect, which preserves path and query parameters.

### Verification evidence

- Baseline Cloudflare API lookup returned an active `custard.top` zone and zero records for `www.custard.top`; Vercel reported `invalid_configuration`, and HTTPS failed before application routing.
- Cloudflare DNS creation returned success with type `CNAME`, `proxied: false`, and the exact Vercel target.
- Public Cloudflare DoH returned the new CNAME and Vercel edge addresses.
- `vercel domains verify www.custard.top --non-interactive` returned `configured_correctly`, with no issues or conflicts.
- `vercel certs issue www.custard.top` succeeded, and `vercel certs ls` showed an auto-renewing certificate covering the hostname.
- Strict TLS checks against the Vercel edge returned `308` from `/` to `https://custard.top/` and from `/cstd?project=crm` to `https://custard.top/cstd?project=crm`.
- Cloudflare Browser Rendering independently loaded the public `www` deep link, followed the redirect, returned `200`, rendered the CSTD title, and found the CRM project content.
- Focused repository verification passed 3 files / 13 tests covering CSTD host routing, auth-provider routing, and host-aware robots behavior.

### Risk notes

- The development machine's local proxy DNS still maps public addresses to a short-lived `198.18.x.x` fake IP, so its ordinary curl/Chromium path can lag behind public DNS changes. Public DoH, strict edge TLS, Vercel verification, and independent edge-browser evidence all confirm the production hostname is healthy.

### Final status

- The common `www.custard.top` entry is now publicly configured, TLS-covered, and canonically redirected to `custard.top`.

## 2026-07-12 - CSTD Top Navigation Context Preservation

### Scope

- Continued the personal main-site improvement loop on the `custard.top` header and mobile project navigation.
- Found that project action buttons already preserved the main-site context for external destinations, but the top navigation still replaced `custard.top` in the current tab.
- Kept `Projects` as an in-page anchor while applying the existing CSTD external-link policy consistently to the remaining project destinations.

### Fix

- Updated the shared `NavLink` in `src/components/cstd-landing.tsx` to use `getCstdLinkTargetProps`.
- External links for RocoDex, Photography, Alpha, Design, and CRM now render `target="_blank"` with `rel="noreferrer"` on desktop and mobile.
- Added `src/components/cstd-landing-navigation.test.ts` to guard the shared navigation wiring.

### Verification evidence

- TDD red reproduced the missing navigation target policy; focused green passed 3 files / 5 tests.
- Full local gates passed: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm run test:e2e`, `npm audit --json`, and `git diff --check`.
- Local counts: Vitest 67 files / 269 tests passed; Next build generated 734 static pages; Playwright passed 4 tests with 2 environment-dependent skips; npm audit found 0 vulnerabilities.
- Local production browser checks at 1280 px and 390 x 844 confirmed the exact desktop/mobile target policy, in-page `#projects` navigation, menu close state, horizontal overflow `0`, and zero console warnings/errors.
- Commit `80d65dc` was pushed to `origin/main`; GitHub Actions run `29159909691` completed successfully, including lint, tests, build, and E2E.
- Vercel production deployment `dpl_9ow5ijwjkXypX9HBuwaLK1DtSaBY` reached `Ready` and included the `custard.top` and `www.custard.top` aliases.
- Live desktop verification confirmed the exact six-link target policy and horizontal overflow `0`.
- Live mobile verification at 390 x 844 confirmed external links use `_blank` / `noreferrer`, `Projects` remains local, selecting it updates the hash to `#projects`, closes the menu, leaves `aria-expanded="false"`, keeps horizontal overflow `0`, and reports zero console warnings/errors.

### Risk notes

- No repository-controlled or deployment risk remains for this item.

### Final status

- CSTD header navigation now preserves the personal main-site context consistently across desktop and mobile in production.

## 2026-07-12 - CSTD Intro Keyboard Modal Accessibility

### Scope

- Continued the personal main-site improvement loop on the first-visit CSTD intro at `custard.top`.
- Found that the full-screen intro visually blocked the page but did not expose native modal behavior, so keyboard focus could cross its boundaries and Escape/focus restoration were not enforced as one interaction contract.

### Fix

- Replaced the intro wrapper with a native `dialog` opened through `showModal()`, with an accessible name and explicit modal semantics.
- Locked body scrolling while the intro is mounted, restored the previous overflow state on exit, and returned focus to the control that launched a replay.
- Focused `开启 CSTD` in the idle phase and `直接浏览项目` during playback.
- Added explicit first/last-control Tab wrapping because Chromium otherwise moves focus to `body` when crossing a dialog boundary.
- Added visible keyboard focus styles and an end-to-end regression covering the initial intro and replay flow.

### Verification evidence

- Focused Playwright regression passed on desktop and mobile: 2 tests passed.
- Full local gates passed: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm run test:e2e`, `npm audit --json`, and `git diff --check`.
- Local counts: Vitest passed 67 files / 269 tests; Next generated 734 static pages; Playwright passed 6 tests with 2 environment-dependent skips; npm audit found 0 vulnerabilities.
- Fresh local production checks at 1440 x 1100 and 390 x 844 confirmed the exact focus loop, body scroll lock, Escape close, replay focus restoration, horizontal overflow `0`, and no browser warnings/errors.
- Commit `9140588` was pushed to `origin/main`; GitHub Actions run `29179619174` completed successfully, including lint, tests, build, and E2E.
- Vercel production deployment `dpl_Gb8L4mKm7a8epKxUHDPHTfhRvoWv` reached `Ready` and attached `custard.top`, `www.custard.top`, and the project aliases.
- Live HTTP checks returned `200` for both `https://custard.top/` and `/cstd`, with the apex request matched to `/cstd`.
- Live desktop and 390 x 844 mobile browser checks confirmed the focus sequence `开启 CSTD -> 直接浏览项目 -> 开启 CSTD -> 直接浏览项目 -> 开启 CSTD`, playback focus containment on `直接浏览项目`, Escape close, replay focus restoration, body overflow cleanup, horizontal overflow `0`, no Next.js error overlay, and zero console warnings/errors.
- Desktop and mobile screenshots were visually inspected; the intro, controls, and keyboard outline were fully visible without clipping or overlap.

### Risk notes

- No repository-controlled or deployment risk remains for this item. The existing `cstd.introSeen` preference intentionally suppresses automatic replay after the first completed or skipped intro; the explicit `播放开场` control remains available.

### Final status

- The CSTD first-visit intro now behaves as a keyboard-contained modal across desktop and mobile in production.

## 2026-07-13 - CSTD Project-First Discovery

### Scope

- Continued the personal main-site improvement loop on the `custard.top` project discovery flow.
- Found that maintainer-oriented update, capability, and acceptance panels occupied the first viewport while the live project directory appeared later than the decision helpers.
- Preserved restored goal and comparison links as decision-first entry points while making the default visit project-first.

### Fix

- Pointed the hero and shared `Projects` navigation to `#project-directory`.
- Removed the homepage-only maintainer status panels and their unused data module.
- Reordered the default project flow to show the directory and live project cards before goal guidance and supporting evidence.
- Kept restored goal/comparison context before the directory and added stable state so the order no longer jumps after the first comparison action.
- Tightened short-screen spacing and added an accessible compact mascot interaction for mobile and tablet layouts.
- Added desktop/mobile Playwright regressions for the default project jump and restored decision-context behavior.

### Verification evidence

- TDD red reproduced the restored-context jump after adding the recommended photography project; the regression passed on desktop and mobile after the state-lifecycle fix.
- Full local gates passed: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm run test:e2e`, `npm audit --json`, and `git diff --check`.
- Local counts: Vitest passed 66 files / 266 tests; Next generated 734 static pages; Playwright passed 10 tests with 2 environment-dependent skips; npm audit found 0 vulnerabilities.
- Local production verification confirmed the restored goal and comparison sections stay before the directory after interaction, with horizontal overflow `0`, no Next.js error overlay, and zero console warnings/errors. The final full-page screenshot was inspected for clipping, overlap, and blank rendering.
- Design commit `2927d21` and implementation commit `cfb0981` were pushed to `origin/main`.
- GitHub Actions run `29210137095` completed successfully, including lint, tests, build, and E2E.
- Vercel production deployment `dpl_8mT1JA71Dcj6T383ESLqcKJkaxVg` reached `Ready` with `custard.top`, `www.custard.top`, and the project aliases.
- Live HTTP checks returned `200` for the apex, `/cstd`, and the restored goal deep link.
- Live desktop and 390 x 844 mobile checks confirmed the Projects section is hinted in the first viewport, `看项目` lands on the directory with the first card visible, default ordering is directory-first, horizontal overflow is `0`, and no error overlay appears.
- Live restored-goal verification confirmed that adding `奶黄包摄影` keeps both `#project-guide` and `#project-comparison` before `#project-directory`, with zero console warnings/errors.

### Risk notes

- No repository-controlled or deployment risk remains for this item. The requested independent review agent did not return a review before timeout; staged-diff review, React/UX checklist review, automated gates, local production checks, and live production checks were completed directly.

### Final status

- CSTD now leads default visitors to real project work while preserving stable, decision-first deep links in production.

## 2026-07-13 - CSTD Mobile Stage Loading

### Scope

- Continued the personal main-site improvement loop by measuring the real mobile JavaScript cost of the desktop-only CSTD mascot stage.
- Found that Tailwind hid the stage below the `lg` breakpoint, but React still mounted its dynamic component and downloaded the Three.js / React Three Fiber chunk on a fresh 390 x 844 visit.
- Kept the full interactive stage for desktop visitors while removing its network, parsing, WebGL, and mount cost from the mobile path.

### Fix

- Added a client-side `matchMedia("(min-width: 1024px)")` gate that starts disabled for hydration stability and follows breakpoint changes.
- Mounted `CstdCustardStage` only while the desktop media query matches; mobile and tablet layouts continue to expose the compact mascot control.
- Strengthened the responsive E2E contract to wait for network idle and assert one raw mascot control on mobile versus two mounted controls on desktop.
- Added design and implementation plans documenting the measured problem, breakpoint contract, TDD sequence, and release checks.

### Verification evidence

- TDD red first proved the hidden desktop stage still mounted on mobile after dynamic loading; focused green passed on both desktop and mobile after the media-query gate.
- Full local gates passed: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm run test:e2e`, `npm audit --json`, and `git diff --check`.
- Local counts: Vitest passed 66 files / 266 tests; Next generated 734 static pages; Playwright passed 10 tests with 2 environment-dependent skips; npm audit found 0 vulnerabilities.
- Local production mobile verification found one mascot control, no `canvas`, no stage chunk, horizontal overflow `0`, and script totals of 242,870 transferred / 804,131 decoded bytes. Desktop resize loaded the 884,176-byte decoded stage chunk, mounted the canvas, and preserved overflow `0`.
- Design commit `ccf6bfa` and implementation commit `9622741` were pushed to `origin/main`.
- GitHub Actions run `29230393408` completed successfully, including lint, tests, build, and E2E.
- Vercel production deployment `dpl_51y3bTDihUt3512c8ZsxfQSd4omo` reached `Ready` with `custard.top`, `www.custard.top`, and the project aliases; apex and `/cstd` returned `200`.
- Fresh live mobile verification at 390 x 844 found one visible mascot control, no `canvas`, no script over 500 KB decoded, script totals of 250,777 transferred / 804,570 decoded bytes, horizontal overflow `0`, no error overlay, and zero console warnings/errors.
- Compared with the measured pre-fix live baseline, the mobile path removed 241,196 transferred bytes (49.0%) and 883,935 decoded bytes (52.3%).
- Live desktop verification at 1280 x 720 loaded `07klvbk3r7wpr.js` at 241,230 transferred / 884,176 decoded bytes, mounted the canvas, retained one visible stage interaction, and kept horizontal overflow `0` with zero console warnings/errors.
- Desktop and mobile production screenshots were inspected after dismissing the intro; the full stage and compact mascot rendered without clipping, overlap, blank content, or breakpoint layout shift.

### Risk notes

- No repository-controlled or deployment risk remains for this item. The independent reviewer could not run because the external reviewer account reached its usage limit; direct staged-diff review, TDD, full local gates, CI, resource timing, and visual production checks found no blocking issue.
- Chrome DevTools trace tooling was unavailable in this environment, so transfer and decoded-byte evidence came from the browser Resource Timing API and production chunk inspection rather than a DevTools performance trace.

### Final status

- Mobile visitors no longer pay for the desktop-only 3D stage, while desktop behavior remains available and verified in production.

## 2026-07-13 - CSTD Live Project Action Priority

### Scope

- Continued the personal main-site improvement loop by auditing the action hierarchy inside the project cards on `custard.top`.
- Found that every live card visually prioritized `查看案例`, placed comparison second, and deferred the actual working-product link to the third action.
- Measured the first 390 x 844 production card at about 959 CSS pixels tall, including four stacked 44-pixel action rows.

### Fix

- Made each `Live` project's working-product link the first DOM, keyboard, and visual action and applied the established green primary treatment.
- Kept case-study and comparison controls as secondary actions and placed them in one two-column row on narrow cards.
- Kept optional project-specific deep links full-width on mobile and added familiar external-link icons.
- Preserved the incubating card contract: `查看案例` remains first and primary, so it does not imply that an unfinished project is live.
- Added responsive action-rail constants, touch-target unit coverage, and desktop/mobile E2E assertions for semantic order and mobile row alignment.

### Verification evidence

- TDD red failed on desktop and mobile because the first card action was still `查看案例`; the same focused Playwright test passed in both profiles after the implementation.
- Full local gates passed: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm run test:e2e`, `npm audit --json`, and `git diff --check`.
- Local counts: Vitest passed 66 files / 267 tests; Next generated 734 static pages; Playwright passed 10 tests with 2 environment-dependent skips; npm audit found 0 vulnerabilities.
- Local production mobile verification measured the first card at 903 pixels, 56 pixels shorter than the live baseline. The direct link measured 306 x 46, case study and comparison each measured 147 x 45 on the same row, overflow was `0`, and no error overlay or console issue appeared.
- Local desktop verification kept the direct action first, preserved 45-pixel controls, showed no clipping or overlap, and retained overflow `0` with no browser warnings/errors.
- Design commit `fef4862` and implementation commit `512d86a` were pushed to `origin/main`.
- GitHub Actions run `29234209526` completed successfully, including lint, tests, build, and E2E.
- Vercel production deployment `dpl_AeigikDbMWq4gynqce2j2KyMXkuu` reached `Ready` with `custard.top`, `www.custard.top`, and the project aliases; apex and `/cstd` returned `200`.
- Fresh live mobile verification confirmed all five `Live` cards begin with their working-product action, the `Next` card begins with `查看案例`, the first card remains 903 pixels tall, external links use `_blank` / `noreferrer`, overflow is `0`, the mobile-only path has no canvas, and there are zero console warnings/errors.
- Live desktop verification confirmed the same semantic order, expected 45-pixel controls, the desktop canvas, overflow `0`, no error overlay, and zero console warnings/errors.
- Local and production mobile/desktop screenshots were visually inspected and matched without text clipping, overlap, or breakpoint drift.

### Risk notes

- No repository-controlled or deployment risk remains for this item.

### Final status

- CSTD live project cards now lead visitors into real working products while retaining compact case-study, comparison, and deep-link paths in production.

## 2026-07-13 - CSTD Mobile Metric Density

### Scope

- Continued the personal main-site improvement loop by measuring project-card metric density on narrow `custard.top` viewports.
- Found that the three metric tiles stacked into about 224 pixels at 320 CSS pixels wide, delaying the primary working-product action even after the previous action-hierarchy improvement.
- Preserved a readable single-column fallback for very narrow 280-pixel layouts instead of forcing long labels into undersized columns.

### Fix

- Changed project metrics to one column below 320 pixels, a two-column plus full-width final tile from 320 through 639 pixels, and the existing three-column row from 640 pixels upward.
- Converted the metric wrapper and tiles to a named semantic list so assistive technology receives the metrics as one project-scoped group.
- Aligned the action rail with the same 320-pixel safety boundary: controls stack at 280 pixels, then restore the compact two-column action hierarchy at 320 pixels and above.
- Added shared responsive layout contracts and unit coverage for every breakpoint and final-tile span.
- Added desktop/mobile end-to-end assertions for metric semantics, row geometry, width, and responsive action behavior.

### Verification evidence

- Focused unit and Playwright regressions passed after the responsive contracts were implemented.
- Full local gates passed: `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm audit --audit-level=moderate`, `npm run build`, `npm run test:e2e`, and `git diff --check`.
- Local counts: Vitest passed 66 files / 267 tests; Next generated 734 static pages; Playwright passed 10 tests with 2 environment-dependent skips; npm audit found 0 vulnerabilities.
- Local production checks at 280, 320, 390, and 1280 CSS pixels confirmed the intended one-column, two-plus-one, and three-column states with no text or page overflow and zero console warnings/errors.
- At 320 pixels, the first card dropped from the measured live baseline of about 930 pixels to 853 pixels; its metric area dropped from about 224 pixels to 147 pixels while all labels stayed on one line.
- Design commit `e7b82b4` and implementation commit `0b943ef` were pushed to `origin/main`.
- GitHub Actions run `29236595404` completed successfully, including lint, tests, build, and E2E.
- Vercel production deployment `dpl_75pJ3iwc99myEZwhrGhcfQ1QSesV` reached `Ready` with `custard.top`, `www.custard.top`, and the project aliases; both the apex and `/cstd` returned `200`.
- Fresh live 280-pixel verification found three 196 x 69 metric rows and full-width action rows with no split labels or horizontal overflow.
- Fresh live 320-pixel verification measured a 236 x 146 metric list with two 114 x 69 tiles followed by one 236 x 69 tile; all six project cards had zero metric text failures and the first card measured 852 pixels tall.
- Fresh live 390-pixel verification measured two 149 x 69 tiles followed by one 306 x 69 tile, with no dialog residue, text failure, or horizontal overflow.
- Fresh live desktop verification measured three equal 98 x 70 tiles on one row, with a maximum animation-time vertical delta of 1.15 pixels, no horizontal overflow, and zero console warnings/errors.
- Mobile and desktop production screenshots were visually inspected after dismissing the intro and showed no clipping, overlap, or breakpoint drift.

### Risk notes

- No repository-controlled or deployment risk remains for this item. The 280-pixel fallback intentionally uses a taller card to preserve complete labels and 44-pixel action targets.
- A first full E2E run exposed that separately sampled animated bounding boxes could drift by about one pixel; the regression now captures all metric geometry atomically, matching the actual same-row layout without weakening the responsive contract.

### Final status

- CSTD project cards now expose live work sooner on standard mobile widths while retaining readable, stable behavior at 280 pixels and the original compact desktop row in production.

## 2026-07-13 - CSTD Project Action Handoff

### Scope

- Continued the personal main-site improvement loop by measuring the handoff from the project-directory controls into the first working project on `custard.top`.
- Found that `看项目` landed on the 392-pixel directory panel rather than the project grid; at 390 x 844 the first card began about 412 pixels below the target and its primary product action sat about 574 pixels into the card, outside the arrival viewport.
- Preserved the complete project evidence and action set while reducing the distance from navigation intent to a usable product choice.

### Fix

- Added a dedicated `#project-grid` target with the established 96-pixel scroll margin and retargeted the hero plus shared desktop/mobile `Projects` navigation to it.
- Moved each unchanged project action rail directly after the metric group and before the evidence preview, so working-product, case-study, comparison, and deep-link controls appear before supporting detail.
- Restored same-hash navigation explicitly: selecting `Projects` again now scrolls back to the grid even when the URL already ends in `#project-grid`.
- Expanded the desktop/mobile E2E contract to cover navigation targets, repeated mobile navigation, card visibility, metric/action/evidence ordering, viewport containment, and overflow.
- Corrected the release plan and prior log evidence to use the repository's real type check, `npx tsc --noEmit`, and hardened the browser-audit procedure against intro-overlay and resize/hash false results.

### Verification evidence

- TDD red first failed in both browser profiles because evidence preceded the action rail; a later focused run also reproduced the same-hash mobile restore failure. The final focused regression passed 2 tests.
- Full local gates passed: `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm audit --audit-level=moderate`, `npm run build`, `npm run test:e2e`, and `git diff --check`.
- Local counts: Vitest passed 66 files / 267 tests; Next generated 734 static pages; Playwright passed 10 tests with 2 environment-dependent skips; npm audit found 0 vulnerabilities.
- Local production checks at 280, 320, 390, and 1280 CSS pixels measured `#project-grid` and the first card at 96 pixels, order correctness at every size, horizontal overflow `0`, no error overlay, and zero console warnings/errors. The primary action was fully visible at 280; the complete first-row action rails were visible at 320, 390, and 1280.
- Design, implementation, and audit commits `b76c57e`, `1521bdd`, `69c7a23`, `5dde6b6`, `840fed0`, `8cd95df`, and `d558733` were pushed to `origin/main`.
- GitHub Actions run `29241778764` completed successfully in 2m13s, including lint, tests, build, and E2E.
- Vercel production deployment `dpl_GYrWE1qiNxNbFUAso94meYJL46vK` reached `READY` with `custard.top`, `www.custard.top`, and the project aliases; both the apex and `/cstd` returned `200`.
- Fresh live checks reproduced the 96-pixel target position and local containment results at all four viewports, with overflow `0`, no error overlay, and zero console warnings/errors.
- The restored operations link retained `#project-directory` at 96 pixels and surfaced `产业园区招商 CRM` first. All local and production screenshots were visually inspected without clipping, overlap, or breakpoint drift.

### Risk notes

- No repository-controlled or deployment risk remains for this item. At 280 pixels the full four-control action rail intentionally extends below the viewport, while its primary working-product action remains fully visible and every control retains a readable full-width touch target.
- Supporting evidence remains visible directly after the action rail; this change reorders rather than hides project context.

### Final status

- CSTD navigation now hands visitors directly to project choices and exposes the first working-product action within the arrival viewport across production breakpoints.

## 2026-07-13 - CSTD Mobile Project Details

### Scope

- Continued the personal main-site improvement loop by measuring repeated evidence and technology content after each project card's action rail on `custard.top`.
- The 390 x 844 production baseline measured a 9,863-pixel page, a 4,616-pixel project grid, 4,536 pixels of card height, and 1,312 pixels of repeated post-action evidence/tags, about 29% of the card total.
- Compared a static compact treatment, which saved about 232 grid pixels, with a native mobile disclosure, which saved about 832 grid pixels while preserving every evidence field and technology tag on demand.

### Fix

- Added one native, project-named `details` / `summary` disclosure after each mobile action rail, collapsed by default and reporting its evidence/tag counts before expansion.
- Kept the complete evidence and technology content rendered inside the disclosure and kept the existing static desktop presentation unchanged from the `sm` breakpoint upward.
- Factored the shared supporting-content renderer so mobile and desktop use the same source data without duplicating project facts.
- Preserved all project actions, URLs, comparison behavior, URL state, and persistence semantics; the disclosure requires no React state or new dependency.
- Added shared mobile disclosure layout contracts, unit coverage, and desktop/mobile E2E assertions for semantics, ordering, geometry, responsive visibility, keyboard behavior, and focus retention.

### Verification evidence

- TDD red first produced one missing-layout-contract unit failure and two missing-disclosure browser failures; focused green passed 18 layout tests and both desktop/mobile project-flow tests after implementation.
- Full local gates passed: `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm audit --audit-level=moderate`, `npm run build`, `npm run test:e2e`, and `git diff --check`.
- Local counts: Vitest passed 66 files / 268 tests; Next generated 734 static pages; Playwright passed 10 tests with 2 environment-dependent skips; npm audit found 0 vulnerabilities.
- Local production checks at 280, 320, 390, and 1280 pixels found grid tops near 96 pixels, horizontal overflow `0`, no error overlay, and zero console warnings/errors. At 280 the primary product action remained visible and all six summaries were 44 pixels with zero text overflow; at 320 the 692-pixel first card fit completely; at 390 the first card measured 664 pixels and exposed 67.5 pixels of the next card.
- Keyboard verification proved Enter opens and Space closes the native disclosure, focus remains on the summary, evidence and `Next.js 16` become visible, and the chevron reaches `rotate: 180deg`. Desktop kept the prior 691-pixel first-card geometry, static evidence, and visible first-row action rails.
- Design, plan, correction, and implementation commits `068d94e`, `d9d497d`, `c33085d`, and `0002bec` were pushed to `origin/main`.
- GitHub Actions run `29244894840` completed successfully in 2m16s, including lint, tests, build, and E2E.
- Vercel production deployment `dpl_Bdrn5chjTum1ogCnvyBBx8QakiJj` reached `READY` with `custard.top`, `www.custard.top`, and the project aliases; the apex, `/cstd`, `www` route, and cache-busted implementation URL returned `200`.
- Fresh production checks reproduced the local geometry exactly: the 390-pixel project grid measured 3,784 pixels and the page measured 9,031 pixels, saving 832 pixels from each measured baseline while retaining all content behind the disclosure.
- The restored operations link retained `#project-directory` at 96.1 pixels and surfaced `产业园区招商 CRM` first. Collapsed, expanded, desktop, and restored-state screenshots were inspected without clipping, overlap, blank content, or breakpoint drift.

### Risk notes

- No repository-controlled or deployment risk remains for this item. At 280 pixels the complete action rail and disclosure intentionally continue below the viewport while the primary product action remains visible and every control retains a readable full-width target.
- The first expanded screenshot in each environment briefly showed a Chromium screenshot-compositor artifact; a delayed repaint produced clean local and production captures, while DOM state, CSS rotation, console checks, and repeat screenshots remained correct.

### Final status

- Mobile project cards now keep decisions and actions visible first, reduce repeated collapsed scroll cost by 832 pixels at 390 pixels wide, and preserve full project evidence through a native keyboard-accessible disclosure in production.

## 2026-07-13 - CSTD Comparison Completion Handoff

### Scope

- Continued the personal main-site improvement loop by measuring what happens after a visitor selects two projects for comparison on `custard.top`.
- At 390 x 844, the first selection correctly stayed on the card but left the incomplete comparison 4,522.8 pixels below the viewport. After the second selection, the ready result still remained 3,662.8 pixels below the viewport and required another 4,411 pixels of manual scrolling.
- The existing recommended next action began about 1,076 pixels into the manually reached result and was also outside the first result viewport.

### Fix

- Added a normalized pure helper that detects only the transition from an incomplete comparison to the two-project limit.
- Kept the first selection in place with its existing pressed state and focus, then changed only the completion edge to serialize `#project-comparison` and reuse the existing post-render result alignment.
- Added an interaction-only ref so direct completion focuses the programmatically focusable `项目对比` heading, while restored links and browser history navigation align without stealing focus.
- Moved the unchanged `对比下一步` panel before selected-project, goal-fit, and matrix details. No comparison data, callbacks, selected-project controls, URL parameters, copied brief, or limit changed.
- Strengthened unit, source-contract, and desktop/mobile E2E coverage for completion detection, first-selection stability, URL/hash, result position, heading focus, next-step order, responsive visibility, restored state, and overflow.

### Verification evidence

- TDD red produced one missing-helper unit failure and two browser failures that received `#projects` instead of `#project-comparison`; focused green passed 8 unit tests and both desktop/mobile completion tests.
- The first full unit run exposed one stale source-string assertion for the old optional-chain scroll implementation. Its replacement asserts section lookup, scroll, pending-interaction guard, and heading focus; the focused source-contract file then passed 15 tests.
- Full local gates passed: `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm audit --audit-level=moderate`, `npm run build`, `npm run test:e2e`, and `git diff --check`.
- Local counts: Vitest passed 66 files / 269 tests; Next generated 734 static pages; Playwright passed 12 tests with 2 environment-dependent skips; npm audit found 0 vulnerabilities.
- Local production verification at 320 x 800, 390 x 844, and 1280 x 720 measured first-selection scroll deltas of `0`. Completion automatically traversed 4,580, 4,411, and 1,663 pixels respectively and aligned the result at about 96 pixels with the heading focused.
- The next-action panel measured 573.3-763.3 pixels at 320, 572.7-762.7 pixels at 390, and 328.7-434.7 pixels on desktop, fully inside every explicit production viewport and before the selected-project list.
- Browser back restored `?compare=rocodex#projects` with `1 / 2`, the first project selected, and photography unselected. Forward restored `2 / 2` at `#project-comparison` without treating history navigation as a new focus handoff.
- Design, plan, viewport correction, implementation, and source-contract commits `7a34e07`, `8cf3c17`, `ebb58f7`, `f6446e3`, and `0b1ee15` were pushed to `origin/main`.
- GitHub Actions run `29247894511` completed successfully in 2m31s, including lint, tests, build, and the expanded E2E suite.
- Vercel production deployment `dpl_FEqbGZW9oUSpNrUzuNNFVajGDnbB` reached `READY` with `custard.top`, `www.custard.top`, and the project aliases; the apex and cache-busted apex/www `/cstd` URLs returned `200`.
- Fresh production verification reproduced every local geometry and history result exactly. A restored two-project URL aligned at 96.5 pixels, retained the restored-view receipt, did not focus the heading, and kept overflow and browser issues at `0`.
- First-selection, completion, desktop, and restored-state screenshots were visually inspected without clipping, overlap, blank content, or breakpoint drift.

### Risk notes

- No repository-controlled or deployment risk remains for this item. The shorter automated mobile profile (about 393 x 727) shows the next-action panel heading in the arrival viewport but requires a small continuation scroll for its button; the explicit 320 x 800 and 390 x 844 production contracts keep the complete panel and action visible.

### Final status

- Completing a project comparison now turns selection into a direct, keyboard-coherent decision handoff and removes more than 4,400 pixels of manual result discovery on the measured mobile path.

## 2026-07-29 - CSTD Comparison Goal Round Trip

### Scope

- Continued the personal main-site improvement loop by tracing the `选择目标路径` continuation from a completed two-project comparison on `custard.top`.
- The restored comparison itself aligned at about 96.5 pixels, but opening the goal guide left the URL at `#project-comparison`, kept focus on the offscreen trigger, and let Tab skip the goal buttons.
- Choosing `查精灵资料与玩法工具` preserved both projects but changed the URL to `#projects`; the updated comparison landed about 1,391.5 pixels below the viewport and required roughly 1,295 pixels of manual return scrolling.

### Fix

- Added `#project-guide` to the normalized CSTD view-state contract so the guide step is durable, shareable, and history-aware without dropping `compare=rocodex,photography`.
- Added one-shot interaction focus for the guide and result headings while keeping restored links, reloads, and browser history from stealing focus.
- Returned a goal choice directly to `#project-comparison`, preserved both selected projects, and retained browser back/forward semantics between the guide and the updated fit decision.
- Kept 280-pixel actions stacked, but moved 320 pixels and wider to a two-column action row and tightened the narrow panel padding so the complete result action fits inside a 320 x 800 arrival viewport.
- Patched newly published dependency advisories during release: upgraded Next.js to `16.2.12`, Auth.js to `5.0.0-beta.32`, PostCSS to `8.5.24`, and Sharp to `0.35.3`.
- Replaced the vulnerable legacy `eslint-config-next` dependency chain with an ESLint 10 flat configuration that retains Next Core Web Vitals, TypeScript, React Hooks, and JSX accessibility coverage; fixed the concrete accessibility and code-quality findings exposed by the new rules.

### Verification evidence

- TDD red first rejected the missing `project-guide` hash type, then source-contract tests failed for the absent one-shot round-trip state, and both desktop/mobile browser tests received `#project-comparison` instead of `#project-guide`.
- The narrow-layout red check measured a 52-pixel action-row delta at mobile size; the final focused browser regression passed both profiles with a zero-pixel delta.
- Full local gates passed: `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm audit --audit-level=moderate`, `npm run build`, `npm run test:e2e`, `git diff --check`, and an npm `11.18.0` clean-install dry run.
- Local counts: Vitest passed 66 files / 271 tests; Next generated 734 static pages; Playwright passed 14 tests with 2 environment-dependent skips; npm audit found 0 vulnerabilities.
- Local production verification at 320 x 800, 390 x 844, and 1280 x 900 aligned the comparison, guide, and returned result at 96.0-96.5 pixels. Guide and result headings received interaction focus, Tab reached the first goal, back/forward restored pressed state, and reload intentionally left focus neutral.
- At 320 pixels the two result actions shared one row, the next-step panel ended at 796.97 pixels, and the complete action remained inside the 800-pixel viewport. Every viewport had overflow `0`, no dialog residue, and zero console warnings/errors.
- Design, plan, implementation, narrow-layout, and security commits `bfae771`, `747eacf`, `03d35ec`, `ab0d142`, and `853890b` were pushed to `origin/main`.
- GitHub Actions run `30451887816` completed successfully in 2m22s, including dependency installation, lint, tests, build, and E2E.
- Vercel production deployment `dpl_2jQ8D8n9n7Re4YE9PkDWNV5BGzTb` reached `READY` with `custard.top`, `www.custard.top`, and project aliases. Apex, `/cstd`, `www`, and the cache-busted release URL returned `200`.
- Fresh production browser verification reproduced every local position, focus, history, selected-project, action-row, overflow, and restored-state result exactly. Production console issues, Vercel error logs, and Vercel HTTP 500 logs were all `0`.
- Mobile guide/result and desktop result screenshots were visually inspected without clipping, overlap, blank content, or breakpoint drift.

### Risk notes

- No repository-controlled, dependency-audit, CI, deployment, runtime-log, or measured viewport risk remains for this item.
- The direct Vercel deployment URL is protected by project authentication; public production verification was completed through the canonical `custard.top` aliases.

### Final status

- A completed comparison can now enter goal selection and return to an updated, focused decision without losing selected projects, URL provenance, history behavior, or a mobile viewport.

## 2026-07-29 - CSTD Comparison Case Handoff

### Scope

- Continued the personal main-site improvement loop by following `查看目标直达案例` from the goal-aligned comparison decision on `custard.top`.
- The production baseline preserved `goal=game-data` and both compared projects, but a 390 x 844 arrival left the live project action at about 1,088 pixels, 244 pixels below the viewport.
- The direct click also left keyboard focus on the offscreen comparison button instead of identifying the newly opened case study.

### Fix

- Added a pure comparison-handoff model that is created only when the selected case matches the current goal and is present in the preserved comparison.
- Added a compact `Decision handoff` band to the case-study header with the goal, horizontal reference, and real live-project action.
- Added interaction-only heading focus for direct case navigation while keeping browser history and restored links focus-neutral.
- Kept the complete evidence checklist, existing action rail, project navigation, copy controls, project URLs, goal, comparison selection, and URL serialization unchanged.
- Added unit, source-contract, and desktop/mobile E2E coverage for provenance, action visibility, focus, URL state, back/forward, reload, overflow, and browser issues.

### Verification evidence

- TDD red first failed on the absent handoff helper and source contract; the focused green run passed 19 tests.
- Full local gates passed: `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm audit --audit-level=moderate`, `npm run build`, `npm run test:e2e`, and `git diff --check`.
- Local counts: Vitest passed 67 files / 274 tests; Next generated 734 static pages; Playwright passed 16 tests with 2 environment-dependent skips; npm audit found 0 vulnerabilities.
- Local visual checks at 320 x 800, 390 x 844, and 1280 x 900 aligned the case at about 78 pixels and placed the live action at about 391, 337, and 241 pixels respectively, fully inside every viewport.
- The heading received direct-interaction focus, while back, forward, and reload stayed focus-neutral. Every viewport reported horizontal overflow `0` and no console warnings/errors.
- Implementation commit `a5be005` was pushed to `origin/main`.
- GitHub Actions run `30453941937` completed successfully in 2m42s across install, lint, 274 tests, build, and E2E.
- Vercel production deployment `dpl_2pxLPe5neaiPodbTwnxsUca9EMu2` reached `READY` for `custard.top`, `www.custard.top`, and project aliases; apex, `/cstd`, and `www` returned `200`.
- Fresh production checks reproduced the local positions, focus, URL, history, reload, action visibility, and zero-overflow results at all three viewports.
- Production screenshots were visually inspected without clipping, overlap, blank content, or breakpoint drift. Vercel runtime-error and HTTP 500 queries returned no entries.

### Risk notes

- No repository-controlled, dependency-audit, CI, deployment, runtime-log, or measured viewport risk remains for this item.
- One full E2E attempt was blocked by the temporary local Next process used for visual inspection; stopping that owned process and rerunning produced the complete passing result.

### Final status

- A goal-aligned comparison now hands visitors to an actionable case study with visible provenance, immediate live-project access, keyboard-coherent focus, and durable history behavior in production.

## 2026-07-29 - CSTD Case Return To Decision

### Scope

- Continued the personal main-site improvement loop by closing the comparison-originated case study on `custard.top`.
- At 390 x 844, closing the case changed the URL to `#projects`, kept the page near scroll position 5,453, and placed the first project card at about 78 pixels.
- The preserved comparison decision moved about 2,432 pixels above the viewport and keyboard focus fell back to `body`.

### Fix

- Made case closing source-aware: a goal-matched case with preserved comparison provenance now serializes `#project-comparison` instead of `#projects`.
- Reused the existing result-alignment effect and direct-interaction focus intent so closing lands on the named `项目对比` heading.
- Added `selectedProjectId` to the comparison restoration effect dependencies so removing the conditionally rendered case can trigger the return.
- Cleared only programmatically managed CSTD heading focus on `popstate`, preventing offscreen focus from surviving back/forward navigation while leaving ordinary controls untouched.
- Kept ordinary non-comparison case closing on the project directory path.
- Extended source-contract and desktop/mobile E2E coverage through close, back, forward, position, focus, URL, provenance, overflow, and browser issues.

### Verification evidence

- The source-contract red run failed on the absent source-aware close rule.
- The first focused E2E green attempt found the comparison heading remained focused while history restored the case; the managed-focus cleanup fixed that offscreen focus and the second focused run passed both browser profiles.
- Full local gates passed: `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm audit --audit-level=moderate`, `npm run build`, `npm run test:e2e`, and `git diff --check`.
- Local counts: Vitest passed 67 files / 275 tests; Next generated 734 static pages; Playwright passed 16 tests with 2 environment-dependent skips; npm audit found 0 vulnerabilities.
- Local checks at 320 x 800, 390 x 844, and 1280 x 900 aligned the returned comparison at 96.0-96.5 pixels and focused its heading.
- Browser back restored the case around 96 pixels with its handoff and neutral focus; forward restored the comparison around 96 pixels with neutral focus. Every viewport reported overflow `0` and no console warnings/errors.
- Implementation commit `477db60` was pushed to `origin/main`.
- GitHub Actions run `30455467721` completed successfully in 2m52s across install, lint, 275 tests, build, and E2E.
- Vercel production deployment `dpl_K7zEmKjC3372h7EVUNnUopawnr32` reached `READY` for production aliases; apex, `/cstd`, and `www` returned `200`.
- Fresh production checks reproduced every local URL, position, direct focus, history-neutral focus, provenance, and zero-overflow result.
- Production screenshots were visually inspected without clipping, overlap, blank content, or breakpoint drift. Vercel runtime-error and HTTP 500 queries returned no entries.

### Risk notes

- No repository-controlled, dependency-audit, CI, deployment, runtime-log, or measured viewport risk remains for this item.

### Final status

- Closing a comparison-originated case now returns to the preserved decision instead of stranding visitors in the project directory, with coherent direct and history focus behavior in production.

## 2026-07-30 - CSTD Live Product Showcase

### Scope

- Continued the personal main-site loop with a visual audit of the first visit, hero, project discovery path, and project cards on `custard.top`.
- The production baseline had a coherent custard identity, but the mobile first viewport was dominated by copy and controls while the desktop hero used most of its right half for the mascot alone.
- Visitors had to scroll into long text cards before seeing what the five shipped products actually looked like.

### Fix

- Captured and visually inspected first-party production screenshots for RocoDex, the photography site, CSTD Alpha, the private AI workspace, and the招商 CRM.
- Rebuilt the hero as a dark, full-width product-studio stage with sharper positioning, compact actions, an integrated 3D custard, and a mobile mascot control.
- Added a responsive five-item `Live product windows` rail. Mobile uses touch-safe horizontal snap scrolling with a visible next-card cue; desktop shows all five production surfaces at once.
- Added production previews to desktop project cards while preserving the compact, action-first mobile card.
- Reworked the first-visit intro, typography, color balance, metadata, project-section framing, and card treatment to match the new product-studio direction.
- Added apex-host routing for `/cstd-projects/`, preview metadata and file-existence coverage, and browser coverage for all five live links.

### Verification evidence

- TDD red first rejected missing preview metadata and blocked the new apex asset path; the focused green run passed 28 tests.
- Full local gates passed: `npx tsc --noEmit`, `npm run lint`, 67 Vitest files / 276 tests, `npm audit --audit-level=moderate`, a 734-page production build, 16 Playwright tests with 2 environment-dependent skips, and `git diff --check`.
- Local production checks at 320 x 800, 390 x 844, and 1440 x 1000 reported horizontal overflow `0`, five preview links, loaded visible images, working mobile end-of-rail lazy loading, and no console warnings/errors.
- The first GitHub Actions run `30464141054` exposed a Linux-font boundary: the desktop action bottom reached 723 pixels in a 720-pixel viewport and focus caused a 7-pixel browser scroll.
- Reduced the desktop preview height by 16 pixels and strengthened the regression to require at least 10 pixels of action headroom instead of merely allowing an exact viewport fit.
- The corrected local full E2E rerun passed, and GitHub Actions run `30465027509` completed successfully in 2m27s across install, lint, 276 tests, build, and E2E.
- Commits `f39f252` and `feaa808` were pushed to `origin/main`.
- Vercel production deployment `dpl_BgrURAwM9fkyf28JtwHw6CnJPXSL` reached `READY` for final commit `feaa808`.
- Apex, `/cstd`, `www`, and `/cstd-projects/rocodex.png` returned `200`; `www` redirected to the apex and the existing apex route boundary continued to return `404` for RocoDex-only paths.
- Fresh production checks at 320 x 800, 390 x 844, 1280 x 720, and 1440 x 1000 reported overflow `0`, five live links, no browser issues, and action headroom of 93, 165, 50, and 330 pixels respectively.
- The mobile rail reached its exact 1,108-pixel maximum scroll and loaded the fifth preview at 319 x 199 pixels. The live intro remained visible, focused `开启 CSTD`, and produced no overflow or browser issues.
- Production desktop, mobile, intro, project-card, and before/after screenshots were visually inspected without clipping, overlap, blank media, or breakpoint drift.
- Vercel error/fatal and HTTP 500 log scans returned no entries.

### Risk notes

- The first implementation CI run is intentionally retained as evidence of the cross-platform typography boundary; the final run and deployment are green.
- Mobile project-card screenshots remain intentionally hidden and lazy to preserve the action-first 320/390 layout; the live product rail supplies the first-viewport visual proof.
- No repository-controlled, dependency-audit, final-CI, deployment, runtime-log, or measured viewport risk remains for this item.

### Final status

- The live personal site now presents CSTD as an independent product studio, shows real shipped work in the first viewport, preserves the established mascot identity, and keeps all existing project discovery, comparison, case-study, URL, history, and focus behavior intact.

## 2026-07-30 - CSTD Editorial Project Workbench

### Scope

- Continued the `custard.top` personal-main-site loop with a desktop-first audit of the project directory, project gallery, goal guide, capability index, comparison handoff, and delivery evidence.
- The shipped-product hero was visually strong, but the long project area still used six equal cards followed by several similarly weighted pale tools.
- The result was complete but visually flat: the most important live work had no hierarchy, filtering felt like a form, and the lower evidence sequence lacked a clear closing moment.

### Fix

- Added a tested gallery-layout rule that promotes the first visible live project, keeps later work in a compact editorial rhythm, and reserves a full-width studio queue for incubating work.
- Rebuilt the desktop gallery on a twelve-column system: an 8/4 opening pair, a three-project second row, and a separate full-width incubation strip.
- Enlarged real production media, added project numbering, removed hover rotation, and kept filter results adaptive so a single match becomes a full-width feature.
- Recast the project directory as a high-contrast product console with a stronger search field, state summary, filters, and copy controls.
- Reworked the goal guide as a dark route board, the capability index as a blue capability band, and the evidence overview as a full-bleed dark delivery ledger.
- Increased primary project actions to a stable 48-pixel minimum target and preserved every existing URL, focus, comparison, history, share, and external-link behavior.

### Verification evidence

- The TDD red run failed because the gallery-layout helper did not exist; the focused green run passed 21 tests after implementation.
- Full local gates passed: `npx tsc --noEmit`, `npm run lint`, 68 Vitest files / 279 tests, `npm audit --audit-level=moderate`, a 734-page production build, 16 Playwright tests with 2 environment-dependent skips, and `git diff --check`.
- The first full E2E run found two genuine regressions: the 360-pixel featured image pushed actions 73.6 pixels below a 720-pixel viewport, and card `content-visibility` defeated the browser's scroll anchor after selecting the first comparison item.
- Reduced featured desktop media to 256 pixels, removed the unnecessary visibility containment, and raised project actions from 44 to 48 pixels. Focused desktop/mobile E2E then passed 4/4 and the full suite passed.
- Production-mode browser checks confirmed a `CRM` search renders one 1,280-pixel full-width feature, two selected projects restore the comparison URL and two-item decision list, and all tested states report overflow `0` with no console/page/network errors.
- Final 1,440 x 1,000 and 1,280 x 720 visual checks showed the intended 8/4 and three-column rhythm, readable production media, coherent controls, and 162.7 pixels of measured action headroom at the compact desktop viewport.
- A 3.2-second scripted full-page scroll recorded 513 frames, 6.4-millisecond p95 frame spacing, no long tasks during the scroll, and CLS `0`.
- Final screenshots and the side-by-side comparison are stored under `output/playwright/cstd-workbench-2026-07-30/`.
- Implementation commit `8937f45` was pushed directly to `origin/main`.
- GitHub Actions run `30468328413` completed successfully in 2m52s across install, lint, 279 tests, build, and E2E.
- Vercel production deployment `dpl_9ApvubxoS1tXifbnBZS9eZGFPrAk` reached `READY` for exact commit `8937f45061ad73f758501f662f41a22169f881ae`.
- Apex, `/cstd`, and `www` returned `200`; `www` redirected to the apex.
- Fresh production browser checks at 1,440 x 1,000 and 1,280 x 720 matched local gallery geometry, adaptive single-result width, two-item comparison state, URL serialization, 162.7-pixel action headroom, overflow `0`, and no browser issues.
- Vercel runtime-error, error/fatal, and HTTP 500 queries returned no entries for the released deployment.

### Risk notes

- Vercel reports the repository's pre-existing broad Node engine range warning; it did not affect this 52-second successful build and is outside this UI release.
- No repository-controlled UI, dependency-audit, final-CI, deployment, runtime-log, or measured desktop-viewport risk remains for this item.

### Final status

- The editorial project workbench is live on `custard.top`, with the full local and remote release loop closed.
