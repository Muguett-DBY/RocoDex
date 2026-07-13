# CSTD Project Action Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make general CSTD project links land on the actual project grid and expose every card's action rail before its secondary evidence without removing content or stateful directory behavior.

**Architecture:** Add one stable hash target to the existing rendered project grid, retarget only the general project-navigation links, and preserve `#project-directory` for search/filter/restoration workflows. Reorder existing card children directly in `ProjectCard`; no new state, component layer, or dependency is required.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Vitest, Playwright.

## Global Constraints

- Work directly on `main`; do not create a feature branch or force-push.
- Do not add dependencies.
- Keep `#project-directory` unchanged for restored directory state, filtering, comparison guidance, and category browsing.
- Use `id="project-grid"` plus `scroll-mt-24` for the new general destination.
- Preserve all project descriptions, metrics, evidence, tags, actions, and external-link safety attributes.
- Keep DOM, visual, and keyboard order identical; do not use CSS `order`.
- Retain every existing 44-pixel action target, responsive metric layout, and 280-pixel fallback.
- Stage exact files only; never use `git add .`.

---

### Task 1: Establish The Project-Grid Navigation Contract

**Files:**
- Modify: `src/lib/cstd-navigation.test.ts:4-16`
- Modify: `src/lib/cstd-navigation.ts:1-9`
- Modify: `src/components/cstd-landing.tsx:912`
- Modify: `src/components/cstd-landing.tsx:1152`

**Interfaces:**
- Consumes: `cstdNavigationItems`, `cstdProjectGridClassName`, and the existing `HeroButton` hash-link behavior.
- Produces: a stable `#project-grid` destination used by hero, desktop navigation, and mobile navigation while leaving `#project-directory` available to stateful workflows.

- [ ] **Step 1: Change the navigation unit expectation to the new target**

Replace the first expected navigation item in `src/lib/cstd-navigation.test.ts`:

```ts
expect(cstdNavigationItems).toEqual([
  { href: "#project-grid", label: "Projects" },
  { href: "https://rocodex.custard.top", label: "RocoDex" },
  { href: "https://shoot.custard.top", label: "Photography" },
  { href: "https://alpha.custard.top", label: "Alpha" },
  { href: "https://design.custard.top", label: "Design" },
  { href: "https://cfzzs.custard.top", label: "CRM" },
]);
```

- [ ] **Step 2: Run the focused unit test and confirm the red state**

Run:

```powershell
npx vitest run src/lib/cstd-navigation.test.ts
```

Expected: one failure showing `#project-directory` was received where `#project-grid` was expected.

- [ ] **Step 3: Implement the shared and rendered hash destination**

Update `src/lib/cstd-navigation.ts`:

```ts
export const cstdNavigationItems = [
  { href: "#project-grid", label: "Projects" },
  { href: "https://rocodex.custard.top", label: "RocoDex" },
  { href: "https://shoot.custard.top", label: "Photography" },
  { href: "https://alpha.custard.top", label: "Alpha" },
  { href: "https://design.custard.top", label: "Design" },
  { href: "https://cfzzs.custard.top", label: "CRM" },
] as const;
```

Update the hero action and grid wrapper in `src/components/cstd-landing.tsx`:

```tsx
<HeroButton href="#project-grid" primary wideOnMobile>
  看项目
</HeroButton>
```

```tsx
<div id="project-grid" className={`${cstdProjectGridClassName} scroll-mt-24`}>
  {visibleProjects.length > 0 ? (
    visibleProjects.map((project, index) => (
      <ProjectCard
        key={project.title}
        project={project}
        comparedProjectIds={comparedProjectIds}
        index={index}
        motionDisabled={motionDisabled}
        onFocus={focusProject}
        onToggleComparison={toggleProjectComparison}
      />
    ))
  ) : (
    <div className="rounded-xl border-2 border-dashed border-[#d7c19d] bg-white/72 p-6 text-center md:col-span-2 xl:col-span-3">
      <p className="text-lg font-black text-[#2f241d]">没有找到匹配项目</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#6f5b4a]">试试清空搜索词，或切换到全部分类继续浏览。</p>
      <button
        type="button"
        onClick={resetProjectControls}
        className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg border border-[#1b4332] bg-[#0f8f64] px-4 text-sm font-black text-white transition hover:bg-[#0d7d59] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64]"
      >
        重置项目筛选
      </button>
    </div>
  )}
</div>
```

- [ ] **Step 4: Run the navigation unit test and source checks**

Run:

```powershell
npx vitest run src/lib/cstd-navigation.test.ts
npm run typecheck
npm run lint
```

Expected: the unit file passes, TypeScript exits `0`, and ESLint reports no errors.

- [ ] **Step 5: Commit the independently testable navigation handoff**

Run:

```powershell
git add -- src/lib/cstd-navigation.test.ts src/lib/cstd-navigation.ts src/components/cstd-landing.tsx
git diff --cached --check
git commit -m "fix: hand off cstd navigation to project grid"
```

Expected: one commit containing only the three listed files.

---

### Task 2: Put Project Actions Before Secondary Evidence

**Files:**
- Modify: `e2e/core-flows.spec.ts:154-218`
- Modify: `src/components/cstd-landing.tsx:2353-2426`

**Interfaces:**
- Consumes: the `#project-grid` target from Task 1 and the existing metric, action, evidence, and tag nodes inside `ProjectCard`.
- Produces: the DOM sequence `metrics -> actions -> evidence -> tags` plus regression evidence that the action rail is visible after general project navigation.

- [ ] **Step 1: Extend the project-discovery E2E contract**

Update the existing test in `e2e/core-flows.spec.ts` so its target and geometry section contains:

```ts
await expect(projectLink).toHaveAttribute("href", "#project-grid");
await expect(page.getByText("Latest updates", { exact: true })).toHaveCount(0);
await expect(page.getByText("Capability checklist", { exact: true })).toHaveCount(0);
await expect(page.getByText("Acceptance status", { exact: true })).toHaveCount(0);
await expect
  .poll(() => page.locator("#projects").evaluate((element) => element.getBoundingClientRect().top < window.innerHeight))
  .toBe(true);

await projectLink.click();
await expect(page).toHaveURL(/#project-grid$/);
await expect(page.locator("#project-grid")).toBeInViewport();
await expect(firstProjectCard).toBeInViewport({ ratio: 0.8 });

const firstProjectActions = firstProjectCard.locator("a, button");
await expect(firstProjectActions.nth(0)).toHaveText("打开图鉴");
await expect(firstProjectActions.nth(0)).toHaveAttribute("href", "https://rocodex.custard.top");
await expect(firstProjectActions.nth(1)).toHaveText("查看案例");
await expect(firstProjectActions.nth(2)).toHaveText("加入对比");

const projectMetrics = firstProjectCard.getByRole("list", { name: "洛克图鉴 / RocoDex 项目指标" });
const projectEvidence = firstProjectCard.locator("dl");
const [metricBox, evidenceBox, actionBoxes] = await Promise.all([
  projectMetrics.boundingBox(),
  projectEvidence.boundingBox(),
  firstProjectActions.evaluateAll((actions) =>
    actions.map((action) => {
      const box = action.getBoundingClientRect();
      return { top: box.top, bottom: box.bottom };
    }),
  ),
]);

expect(metricBox).not.toBeNull();
expect(evidenceBox).not.toBeNull();
expect(actionBoxes.length).toBeGreaterThanOrEqual(3);
const actionTop = Math.min(...actionBoxes.map((box) => box.top));
const actionBottom = Math.max(...actionBoxes.map((box) => box.bottom));
expect(actionTop).toBeGreaterThanOrEqual(metricBox!.y + metricBox!.height - 2);
expect(evidenceBox!.y).toBeGreaterThanOrEqual(actionBottom - 2);
expect(actionBottom).toBeLessThanOrEqual(page.viewportSize()!.height);
```

Retain the existing metric tile geometry assertions. Replace the default-order check at the end with:

```ts
await expectElementBefore(page, "#project-directory", "#project-guide");
await expectElementBefore(page, "#project-grid", "#project-guide");
await expectNoHorizontalOverflow(page);
expect(browserIssues).toEqual([]);
```

Inside the mobile branch, add the shared-navigation contract after the card geometry assertions:

```ts
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
const navigationToggle = page.locator('button[aria-controls="cstd-mobile-navigation"]');
await navigationToggle.click();
const projectsNavigationLink = page.getByRole("link", { name: "Projects", exact: true });
await expect(projectsNavigationLink).toHaveAttribute("href", "#project-grid");
await projectsNavigationLink.click();
await expect(navigationToggle).toHaveAttribute("aria-expanded", "false");
await expect(page).toHaveURL(/#project-grid$/);
await expect(page.locator("#project-grid")).toBeInViewport();
```

- [ ] **Step 2: Run the focused E2E test and confirm the red state**

Run:

```powershell
npm run test:e2e -- --grep "CSTD project discovery lands on live project work"
```

Expected: both browser profiles fail because the evidence preview still precedes the action rail.

- [ ] **Step 3: Move the unchanged action rail ahead of evidence**

In `ProjectCard`, keep the metric list first, then place the complete existing action block before the evidence block:

```tsx
<ul aria-label={`${project.title} 项目指标`} className={cstdProjectMetricGridClassName}>
  {project.metrics.map(([value, label]) => (
    <li key={value} className={cstdProjectMetricTileClassName}>
      <strong className={cstdProjectMetricValueClassName}>{value}</strong>
      <span className={cstdProjectMetricLabelClassName}>{label}</span>
    </li>
  ))}
</ul>

<div className={cstdProjectCardActionRailClassName}>
  {isLive ? (
    <HeroButton href={project.href} primary wideFrom320>
      <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />
      {project.action}
    </HeroButton>
  ) : null}
  <button
    type="button"
    onClick={() => onFocus(project.id)}
    aria-label={getCstdProjectFocusButtonLabel(project)}
    className={`${isLive ? cstdProjectCardSecondaryActionClassName : cstdProjectCardPrimaryActionClassName} ${
      isLive ? "border-[#1b4332] bg-white text-[#0f8f64] hover:bg-[#eefbf4]" : "border-[#1b4332] bg-[#0f8f64] text-white hover:bg-[#0d7d59]"
    }`}
  >
    <ArrowDownRight aria-hidden="true" className="h-4 w-4 shrink-0" />
    查看案例
  </button>
  {isLive ? (
    <button
      type="button"
      onClick={() => onToggleComparison(project.id)}
      aria-label={`${comparisonControl.label}：${project.title}`}
      aria-pressed={comparisonControl.selected}
      disabled={comparisonControl.disabled}
      className={`${cstdProjectCardSecondaryActionClassName} disabled:cursor-not-allowed disabled:opacity-55 ${
        comparisonControl.selected
          ? "border-[#1b4332] bg-[#dff8ed] text-[#047857]"
          : "border-[#1b4332] bg-white text-[#0f8f64] hover:bg-[#eefbf4]"
      }`}
    >
      {comparisonControl.selected ? <Check className="h-4 w-4" /> : <GitCompareArrows className="h-4 w-4" />}
      {comparisonControl.label}
    </button>
  ) : null}
  {"softHref" in project && project.softHref ? (
    <HeroButton href={project.softHref} wideFrom320>
      <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />
      {project.softAction}
    </HeroButton>
  ) : null}
  {!isLive ? (
    <HeroButton href={project.href} wideFrom320>
      {project.action}
    </HeroButton>
  ) : null}
</div>

<dl className={cstdProjectEvidenceClassName}>
  {evidencePreview.map((item) => (
    <ProjectEvidence key={item.label} label={item.label} value={item.value} />
  ))}
</dl>

<div className="mt-5 flex flex-wrap gap-2">
  {project.tags.map((tag) => (
    <motion.span
      key={tag}
      className="rounded-md bg-[#fff0c9] px-2.5 py-1 text-xs font-black text-[#8a4b15]"
      whileHover={motionDisabled ? undefined : { y: -2, rotate: -1 }}
    >
      {tag}
    </motion.span>
  ))}
</div>
```

- [ ] **Step 4: Run focused regression, type, and lint checks**

Run:

```powershell
npm run test:e2e -- --grep "CSTD project discovery lands on live project work"
npm run typecheck
npm run lint
```

Expected: 2 focused Playwright cases pass, TypeScript exits `0`, and ESLint reports no errors.

- [ ] **Step 5: Commit the action-order regression and implementation**

Run:

```powershell
git add -- e2e/core-flows.spec.ts src/components/cstd-landing.tsx
git diff --cached --check
git commit -m "fix: surface cstd project actions earlier"
```

Expected: one commit containing only the two listed files.

---

### Task 3: Full Local And Production Acceptance

**Files:**
- Modify after remote acceptance: `.agent/iteration-log.md`
- Modify after remote acceptance: `.agent/orchestrator-log.md`

**Interfaces:**
- Consumes: the two implementation commits and the existing CI/Vercel deployment integration.
- Produces: verified `main`, production browser evidence, and a scoped release-log commit.

- [ ] **Step 1: Run every local automated gate from the implementation SHA**

Run each command and require exit code `0`:

```powershell
npm run typecheck
npm run lint
npm test
npm audit --audit-level=moderate
npm run build
npm run test:e2e
git diff --check
```

Expected: all unit files and E2E cases pass, audit reports zero moderate-or-higher vulnerabilities, the Next build completes, and the diff check is clean.

- [ ] **Step 2: Verify the production build at four viewport contracts**

Start the already-built app on port 3117 with a hidden Windows process:

```powershell
$port = 3117
$listener = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue
if ($listener) { throw "Port $port is already in use." }
$server = Start-Process -FilePath "npm.cmd" -ArgumentList @("run", "start", "--", "--hostname", "127.0.0.1", "--port", "$port") -WindowStyle Hidden -PassThru
$ready = $false
for ($attempt = 0; $attempt -lt 60; $attempt++) {
  try {
    $response = Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:$port/cstd"
    if ($response.StatusCode -eq 200) { $ready = $true; break }
  } catch {
    Start-Sleep -Seconds 1
  }
}
if (-not $ready) { Stop-Process -Id $server.Id; throw "CSTD production server did not become ready." }
$localOutput = "output/playwright/cstd-project-action-handoff-2026-07-13"
New-Item -ItemType Directory -Force -Path $localOutput | Out-Null
npx --yes --package @playwright/cli playwright-cli open "http://127.0.0.1:$port/cstd?verify=local#project-grid" --session cstd-handoff-local
npx --yes --package @playwright/cli playwright-cli eval '() => window.localStorage.setItem("cstd.introSeen", "true")' --session cstd-handoff-local
npx --yes --package @playwright/cli playwright-cli goto "http://127.0.0.1:$port/cstd?verify=local#project-grid" --session cstd-handoff-local
```

Run the same audit at all four sizes:

```powershell
$viewports = @(
  @{ Width = 280; Height = 800; Name = "280" },
  @{ Width = 320; Height = 800; Name = "320" },
  @{ Width = 390; Height = 844; Name = "390" },
  @{ Width = 1280; Height = 720; Name = "1280" }
)

foreach ($viewport in $viewports) {
  npx --yes --package @playwright/cli playwright-cli resize $viewport.Width $viewport.Height --session cstd-handoff-local
  npx --yes --package @playwright/cli playwright-cli eval '() => { const grid = document.getElementById("project-grid"); const card = grid?.querySelector("article"); const metrics = card?.querySelector("ul[aria-label$=项目指标]"); const evidence = card?.querySelector("dl"); const actions = evidence?.previousElementSibling; const primary = actions?.querySelector("a, button"); if (!grid || !card || !metrics || !evidence || !actions || !primary) throw new Error("Project handoff nodes are missing"); const gridBox = grid.getBoundingClientRect(); const cardBox = card.getBoundingClientRect(); const metricBox = metrics.getBoundingClientRect(); const actionBox = actions.getBoundingClientRect(); const evidenceBox = evidence.getBoundingClientRect(); const primaryBox = primary.getBoundingClientRect(); const firstRowCards = [...grid.querySelectorAll("article")].filter((candidate) => Math.abs(candidate.getBoundingClientRect().top - cardBox.top) <= 2); const firstRowRailsInside = firstRowCards.every((candidate) => { const rail = candidate.querySelector("dl")?.previousElementSibling; if (!rail) return false; const box = rail.getBoundingClientRect(); return box.top >= 0 && box.bottom <= innerHeight; }); return { viewport: { width: innerWidth, height: innerHeight }, gridTop: Math.round(gridBox.top), cardTop: Math.round(cardBox.top), primaryInside: primaryBox.top >= 0 && primaryBox.bottom <= innerHeight, railInside: actionBox.top >= 0 && actionBox.bottom <= innerHeight, firstRowRailsInside, order: metricBox.bottom <= actionBox.top + 2 && actionBox.bottom <= evidenceBox.top + 2, pageOverflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth, errorOverlay: Boolean(document.querySelector("nextjs-portal")) }; }' --session cstd-handoff-local
  npx --yes --package @playwright/cli playwright-cli screenshot --filename "$localOutput/local-$($viewport.Name).png" --session cstd-handoff-local
}

npx --yes --package @playwright/cli playwright-cli console warning --session cstd-handoff-local
npx --yes --package @playwright/cli playwright-cli console error --session cstd-handoff-local
npx --yes --package @playwright/cli playwright-cli close --session cstd-handoff-local
Stop-Process -Id $server.Id
```

Require these audit results:

```text
280 x 800: #project-grid top is between 80px and 112px; the first primary action is fully visible.
320 x 800: #project-grid top is between 80px and 112px; the complete first action rail is fully visible.
390 x 844: #project-grid top is between 80px and 112px; the complete first action rail is fully visible.
1280 x 720: first-row action rails are fully visible.
```

At every viewport, require `gridTop` and `cardTop` between `80` and `112`, `order=true`, `primaryInside=true`, `pageOverflowX=0`, and `errorOverlay=false`. Require `railInside=true` and `firstRowRailsInside=true` at 320, 390, and 1280; the 280 fallback only requires the primary action because its four full-width controls intentionally exceed the remaining viewport height. Require browser warning/error counts `0` and inspect every screenshot for clipping or overlap.

- [ ] **Step 3: Push the exact implementation history and wait for remote terminals**

Run:

```powershell
git status --short --branch
git push origin main
gh run list --branch main --limit 5 --json databaseId,headSha,status,conclusion,displayTitle,url
```

Expected: the worktree is clean before push, `origin/main` advances without force, and the implementation CI run reaches `completed/success` across lint, tests, build, and E2E. Query the implementation commit status until Vercel reports `success`, then inspect the deployment and require `target=production`, `readyState=READY`, and aliases including `custard.top` and `www.custard.top`.

- [ ] **Step 4: Run browser and HTTP acceptance against production**

Resolve the exact implementation SHA and require `200` from both production entries:

```powershell
$implementationSha = git rev-parse HEAD
curl.exe --silent --show-error --location --output NUL --write-out "%{http_code} %{url_effective}`n" "https://custard.top/?verify=$implementationSha"
curl.exe --silent --show-error --location --output NUL --write-out "%{http_code} %{url_effective}`n" "https://custard.top/cstd?verify=$implementationSha"
```

Run the production browser audit with its own session and commands:

```powershell
$liveUrl = "https://custard.top/cstd?verify=$implementationSha#project-grid"
$liveOutput = "output/playwright/cstd-project-action-handoff-2026-07-13"
New-Item -ItemType Directory -Force -Path $liveOutput | Out-Null
npx --yes --package @playwright/cli playwright-cli open $liveUrl --session cstd-handoff-live
npx --yes --package @playwright/cli playwright-cli eval '() => window.localStorage.setItem("cstd.introSeen", "true")' --session cstd-handoff-live
npx --yes --package @playwright/cli playwright-cli goto $liveUrl --session cstd-handoff-live

$liveViewports = @(
  @{ Width = 280; Height = 800; Name = "280" },
  @{ Width = 320; Height = 800; Name = "320" },
  @{ Width = 390; Height = 844; Name = "390" },
  @{ Width = 1280; Height = 720; Name = "1280" }
)

foreach ($viewport in $liveViewports) {
  npx --yes --package @playwright/cli playwright-cli resize $viewport.Width $viewport.Height --session cstd-handoff-live
  npx --yes --package @playwright/cli playwright-cli eval '() => { const grid = document.getElementById("project-grid"); const card = grid?.querySelector("article"); const metrics = card?.querySelector("ul[aria-label$=项目指标]"); const evidence = card?.querySelector("dl"); const actions = evidence?.previousElementSibling; const primary = actions?.querySelector("a, button"); if (!grid || !card || !metrics || !evidence || !actions || !primary) throw new Error("Project handoff nodes are missing"); const gridBox = grid.getBoundingClientRect(); const cardBox = card.getBoundingClientRect(); const metricBox = metrics.getBoundingClientRect(); const actionBox = actions.getBoundingClientRect(); const evidenceBox = evidence.getBoundingClientRect(); const primaryBox = primary.getBoundingClientRect(); const firstRowCards = [...grid.querySelectorAll("article")].filter((candidate) => Math.abs(candidate.getBoundingClientRect().top - cardBox.top) <= 2); const firstRowRailsInside = firstRowCards.every((candidate) => { const rail = candidate.querySelector("dl")?.previousElementSibling; if (!rail) return false; const box = rail.getBoundingClientRect(); return box.top >= 0 && box.bottom <= innerHeight; }); return { viewport: { width: innerWidth, height: innerHeight }, gridTop: Math.round(gridBox.top), cardTop: Math.round(cardBox.top), primaryInside: primaryBox.top >= 0 && primaryBox.bottom <= innerHeight, railInside: actionBox.top >= 0 && actionBox.bottom <= innerHeight, firstRowRailsInside, order: metricBox.bottom <= actionBox.top + 2 && actionBox.bottom <= evidenceBox.top + 2, pageOverflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth, errorOverlay: Boolean(document.querySelector("nextjs-portal")) }; }' --session cstd-handoff-live
  npx --yes --package @playwright/cli playwright-cli screenshot --filename "$liveOutput/live-$($viewport.Name).png" --session cstd-handoff-live
}

npx --yes --package @playwright/cli playwright-cli resize 390 844 --session cstd-handoff-live
npx --yes --package @playwright/cli playwright-cli goto "https://custard.top/cstd?category=operations#project-directory" --session cstd-handoff-live
npx --yes --package @playwright/cli playwright-cli eval '() => ({ hash: location.hash, directoryTop: Math.round(document.getElementById("project-directory")?.getBoundingClientRect().top ?? -1), firstProject: document.querySelector("#project-grid h3")?.textContent?.trim() })' --session cstd-handoff-live
npx --yes --package @playwright/cli playwright-cli console warning --session cstd-handoff-live
npx --yes --package @playwright/cli playwright-cli console error --session cstd-handoff-live
npx --yes --package @playwright/cli playwright-cli close --session cstd-handoff-live
```

For every live viewport, require `gridTop` and `cardTop` between `80` and `112`, `order=true`, `primaryInside=true`, `pageOverflowX=0`, and `errorOverlay=false`. Require `railInside=true` and `firstRowRailsInside=true` at 320, 390, and 1280; at 280 require only `primaryInside=true`. The restored-state audit must return `hash="#project-directory"`, a directory top between `80` and `112`, and `firstProject="产业园区招商 CRM"`. Require zero console warnings/errors and visually inspect all four live screenshots.

- [ ] **Step 5: Record and commit release evidence**

Append the measured baseline, implementation, local gates, CI run, Vercel deployment, live geometry, screenshots, remaining risks, and next audit direction to both agent logs. Then run:

```powershell
git add -- .agent/iteration-log.md .agent/orchestrator-log.md
git diff --cached --check
git commit -m "docs: record cstd project handoff release"
git push origin main
```

Expected: only the two log files are committed; the log commit's CI and Vercel statuses also reach success before this release cycle is closed.
