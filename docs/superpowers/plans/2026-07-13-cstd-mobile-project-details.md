# CSTD Mobile Project Details Implementation Plan

> **Execution:** Follow TDD for every behavior change. Keep work on `main`, stage exact files only, run the complete repository gates, push without force, and verify GitHub Actions, Vercel, and `custard.top` before closing the cycle.

**Goal:** Replace 208-240 pixels of repeated post-action evidence per mobile project card with an accessible native disclosure while keeping all content directly visible on desktop.

**Design:** [2026-07-13-cstd-mobile-project-details-design.md](../specs/2026-07-13-cstd-mobile-project-details-design.md)

**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Lucide, Vitest, Playwright, Vercel.

---

## Task 1: Lock the responsive disclosure layout contract

**Files:**

- Modify: `src/lib/cstd-mobile-layout.test.ts`
- Modify: `src/lib/cstd-mobile-layout.ts`

### Step 1: Add the failing layout test

Import the planned disclosure constants and add:

```ts
test("progressively discloses supporting project details only on mobile", () => {
  expect(cstdProjectDetailsDisclosureClassName).toContain("sm:hidden");
  expect(cstdProjectDetailsDisclosureClassName).toContain("group");
  expect(cstdProjectDetailsSummaryClassName).toContain("min-h-11");
  expect(cstdProjectDetailsSummaryClassName).toContain("list-none");
  expect(cstdProjectDetailsSummaryClassName).toContain("focus-visible:outline");
  expect(cstdProjectDetailsMetaClassName).toContain("whitespace-nowrap");
  expect(cstdProjectDetailsBodyClassName).toContain("border-t");
  expect(cstdProjectDetailsDesktopClassName).toContain("hidden");
  expect(cstdProjectDetailsDesktopClassName).toContain("sm:block");
});
```

Run:

```powershell
npx vitest run src/lib/cstd-mobile-layout.test.ts
```

Expected: RED because the disclosure layout contract is not exported yet.

### Step 2: Add the minimal responsive constants

In `src/lib/cstd-mobile-layout.ts`, export:

```ts
export const cstdProjectDetailsDisclosureClassName =
  "group mt-4 rounded-lg border border-[#ead6ad] bg-[#fffaf0]/72 text-sm sm:hidden";

export const cstdProjectDetailsSummaryClassName =
  "flex min-h-11 min-w-0 cursor-pointer list-none items-center gap-2 px-3 font-black text-[#0f8f64] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64] [&::-webkit-details-marker]:hidden";

export const cstdProjectDetailsMetaClassName =
  "ml-auto shrink-0 whitespace-nowrap text-xs font-bold text-[#7b6656]";

export const cstdProjectDetailsBodyClassName = "border-t border-[#ead6ad] p-3";

export const cstdProjectDetailsDesktopClassName = "hidden sm:block";
```

Run the focused unit test again. Expected: GREEN.

---

## Task 2: Specify the mobile disclosure and unchanged desktop view in E2E

**Files:**

- Modify: `e2e/core-flows.spec.ts`

### Step 1: Extend the existing CSTD project-discovery regression

Inside `CSTD project discovery lands on live project work`:

- Locate the first card's uniquely named `details` group and desktop details wrapper.
- Use the mobile group or visible desktop evidence as the supporting-content geometry target.
- Keep the existing metric-before-action assertion and require supporting content after the action rail.
- On mobile, require six visible, collapsed, uniquely named groups.
- Require a 44-pixel first summary, one-line text with no internal overflow, and the compact count text.
- Press Enter to open the first group, verify its evidence and technology tags become visible, then press Space to close it while focus remains on the summary.
- In the configured Pixel 5 profile, require the first card to stay at or below 700 CSS pixels and the transformed bounding-box gap between cards to stay at or below 24 pixels. Reserve the 390 x 844 full-card and next-card-hint contract for the explicit production-build viewport audit.
- On desktop, require mobile disclosures to be hidden and the existing static evidence wrapper to remain visible.

Use stable selectors:

```ts
const mobileDetails = firstProjectCard.getByRole("group", {
  name: "洛克图鉴 / RocoDex 项目详情",
});
const mobileSummary = mobileDetails.locator("summary");
const desktopDetails = firstProjectCard.locator('[data-cstd-project-details="desktop"]');
```

Run:

```powershell
npm run test:e2e -- --grep "CSTD project discovery lands on live project work"
```

Expected: RED on mobile because no disclosure exists and on desktop because no stable static wrapper exists.

---

## Task 3: Implement native mobile details without changing desktop content

**Files:**

- Modify: `src/components/cstd-landing.tsx`
- Modify: `src/lib/cstd-mobile-layout.ts`
- Test: `src/lib/cstd-mobile-layout.test.ts`
- Test: `e2e/core-flows.spec.ts`

### Step 1: Import the responsive constants and icon

Add `ChevronDown` to the Lucide import and import the five new layout constants from `cstd-mobile-layout`.

### Step 2: Factor the repeated supporting markup

Create a small `ProjectCardSupportingDetails` component that receives the project, preview rows, motion preference, and a compact flag. It must render the same `ProjectEvidence` rows and every existing technology tag in both responsive variants.

Compact mobile content uses:

```tsx
<dl className="grid gap-2 text-sm">...</dl>
<div className="mt-3 flex flex-wrap gap-2">...</div>
```

Desktop content keeps `cstdProjectEvidenceClassName` and the existing `mt-5 flex flex-wrap gap-2` tag layout.

### Step 3: Replace the single static block with two responsive presentations

After the action rail, render:

```tsx
<details aria-label={`${project.title} 项目详情`} className={cstdProjectDetailsDisclosureClassName}>
  <summary className={cstdProjectDetailsSummaryClassName}>
    <span className="min-w-0 whitespace-nowrap">项目详情</span>
    <span className={cstdProjectDetailsMetaClassName}>
      证据 {evidencePreview.length} · 技术 {project.tags.length}
    </span>
    <ChevronDown
      aria-hidden="true"
      className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
    />
  </summary>
  <div className={cstdProjectDetailsBodyClassName}>
    <ProjectCardSupportingDetails compact {...sharedProps} />
  </div>
</details>

<div data-cstd-project-details="desktop" className={cstdProjectDetailsDesktopClassName}>
  <ProjectCardSupportingDetails {...sharedProps} />
</div>
```

Do not add React disclosure state, persistence, URL parameters, shortened evidence, or changed tags.

### Step 4: Run focused green checks

Run:

```powershell
npx vitest run src/lib/cstd-mobile-layout.test.ts
npm run test:e2e -- --grep "CSTD project discovery lands on live project work"
npx tsc --noEmit
npm run lint
```

Expected: the focused unit file and both browser profiles pass; TypeScript and ESLint exit `0`.

### Step 5: Commit the tested implementation

Stage only:

```powershell
git add -- src/lib/cstd-mobile-layout.ts src/lib/cstd-mobile-layout.test.ts src/components/cstd-landing.tsx e2e/core-flows.spec.ts
git diff --cached --check
git commit -m "feat: disclose cstd mobile project details"
```

---

## Task 4: Run the full release gate and production acceptance

### Step 1: Run every local automated gate

Require exit code `0` from:

```powershell
npx tsc --noEmit
npm run lint
npm test
npm audit --audit-level=moderate
npm run build
npm run test:e2e
git diff --check
```

### Step 2: Verify the built app at four viewport contracts

Start the already-built application on a free local port and audit 280 x 800, 320 x 800, 390 x 844, and 1280 x 720 with Playwright CLI. Dismiss the intro before screenshots and call `scrollIntoView({ block: "start" })` after every resize.

Require:

- Every viewport: grid top 80-112 pixels, action-before-details order, horizontal overflow `0`, no Next.js error overlay.
- 280: working-product action visible, six collapsed summaries at least 44 pixels high, summary text overflow `0`.
- 320: first card and summary fully inside the 800-pixel viewport.
- 390: first card fully inside the viewport and the next card visibly hinted.
- 1280: mobile disclosures hidden, static evidence visible, first-row action rails visible, and desktop card geometry unchanged.
- Keyboard: Enter opens, Space closes, focus remains on the summary, and expanded evidence/tags are visible.
- Browser console: zero warnings and zero errors.
- Screenshots: no clipping, overlap, blank content, or breakpoint drift.

Save evidence under:

```text
output/playwright/cstd-mobile-project-details-2026-07-13/
```

Close the browser session, stop only the verified local server, and safely remove only workspace-local Playwright session state.

### Step 3: Push and verify remote terminals

Require a clean worktree, then:

```powershell
git push origin main
gh run list --branch main --limit 5 --json databaseId,headSha,status,conclusion,displayTitle,url
```

Wait for the implementation CI run to complete successfully. Require Vercel commit status `success`, inspect the deployment, and confirm `target=production`, `Ready`, and aliases including `custard.top` and `www.custard.top`.

### Step 4: Verify production

- Require HTTP `200` from the apex and `/cstd` using the implementation SHA as a cache-busting query.
- Repeat all four viewport, disclosure, keyboard, screenshot, overflow, overlay, and console checks against `https://custard.top/cstd`.
- Recheck the restored operations deep link and require `#project-directory` plus `产业园区招商 CRM` first.

### Step 5: Record release evidence

Append the measured baseline, option comparison, implementation, local counts, CI run, Vercel deployment, live geometry, screenshots, risks, and next audit direction to:

```text
.agent/iteration-log.md
.agent/orchestrator-log.md
```

Commit only those files as `docs: record cstd mobile project details release`, push `main`, and wait for that final commit's own CI and Vercel deployment to succeed before starting the next audit.
