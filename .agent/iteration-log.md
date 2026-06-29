# RocoDex Iteration Log

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
