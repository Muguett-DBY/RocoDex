# CSTD Comparison Completion Handoff Implementation Plan

> Execute this plan on `main` as a closed loop: TDD, local production verification, exact-file commits, push, CI/Vercel monitoring, live verification, and release evidence.

**Goal:** When a visitor selects the second project, hand them directly and accessibly to a result whose recommended next action is visible in the first viewport, while preserving first-selection browsing and restored-link behavior.

**Architecture:** Detect the incomplete-to-complete selection edge with a pure helper. Mark only direct user completion in a ref, reuse the existing `#project-comparison` URL and scroll effect, focus the existing result heading after render, and reorder the existing next-action block before detailed evidence.

**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Vitest, Playwright, GitHub Actions, Vercel.

**Design:** `docs/superpowers/specs/2026-07-13-cstd-comparison-completion-handoff-design.md`

---

## Task 1: Add the completion-edge contract

**Files:**

- Modify: `src/lib/cstd-project-comparison.test.ts`
- Modify: `src/lib/cstd-project-comparison.ts`

### Step 1: Write the failing unit test

Import `didCompleteCstdProjectComparison` and add a test that requires:

```ts
expect(didCompleteCstdProjectComparison([], ["rocodex"])).toBe(false);
expect(didCompleteCstdProjectComparison(["rocodex"], ["rocodex", "photography"])).toBe(true);
expect(didCompleteCstdProjectComparison(["rocodex", "photography"], ["rocodex"])).toBe(false);
expect(didCompleteCstdProjectComparison(["rocodex", "photography"], ["rocodex", "photography"])).toBe(false);
```

Run:

```powershell
npm test -- src/lib/cstd-project-comparison.test.ts
```

Expected red: the helper is not exported.

### Step 2: Add the minimal helper

Implement the pure transition predicate using `CSTD_PROJECT_COMPARISON_LIMIT`. It must return true only when the previous normalized selection is incomplete and the next normalized selection reaches the limit.

### Step 3: Run focused green

```powershell
npm test -- src/lib/cstd-project-comparison.test.ts
```

Expected: all project-comparison unit tests pass.

---

## Task 2: Define the failing browser handoff

**File:**

- Modify: `e2e/core-flows.spec.ts`

### Step 1: Add a focused comparison-completion test

For both desktop and mobile profiles:

1. Open `/cstd` and dismiss the intro.
2. Align `#project-grid` to its scroll margin.
3. Select `洛克图鉴 / RocoDex` for comparison.
4. Assert the first button remains focused, the scroll position changes by at most two pixels, and the URL remains on `#projects` with one comparison ID.
5. Bring the `奶黄包摄影` comparison button into view and select it.
6. Assert the URL now ends in `#project-comparison` with both IDs.
7. Poll until the result top is between 80 and 112 pixels.
8. Assert `项目对比` is focused, `已选择 2 / 2 个项目` is visible, and `对比下一步` is before `已选对比项目`.
9. On the automated mobile profile (about 393 x 727), require the next-action panel to begin inside the viewport; reserve complete panel/action containment for the explicit 320 x 800 and 390 x 844 production-browser contracts below.
10. Require the matrix to exist, horizontal overflow `0`, and zero browser warnings/errors.

Extend the restored-comparison coverage or add a direct restored URL assertion proving the heading is not auto-focused on initial load.

### Step 2: Run the focused red test

```powershell
npx playwright test e2e/core-flows.spec.ts --grep "comparison completion"
```

Expected red: the second selection remains on `#projects`, the result is offscreen, and the next-action block follows detailed evidence.

---

## Task 3: Implement interaction-only handoff

**File:**

- Modify: `src/components/cstd-landing.tsx`

### Step 1: Track direct completion without render state

Import `didCompleteCstdProjectComparison` and add one `useRef(false)` next to the existing project refs.

In `toggleProjectComparison`:

1. Calculate the next normalized IDs once.
2. Set the ref from the pure completion helper.
3. Call `updateProjectComparison` with `project-comparison` only for a completion edge; otherwise retain the current default hash behavior.

The first selection and item removal must leave the ref false.

### Step 2: Extend the existing result alignment effect

Retain the existing restored URL scroll behavior. Inside the post-render frame:

1. Align `#project-comparison` with `scrollIntoView({ block: "start" })`.
2. If the interaction ref is pending, focus `#project-comparison-heading` with `preventScroll: true` and clear the ref.
3. If the ref is not pending, do not alter focus.

### Step 3: Make the heading programmatically focusable

Add `tabIndex={-1}` to `#project-comparison-heading` and a restrained visible focus outline. Do not add it to sequential keyboard navigation.

---

## Task 4: Put the existing next action in the arrival viewport

**File:**

- Modify: `src/components/cstd-landing.tsx`

Move the unchanged `role="group" aria-label="对比下一步"` block to the start of the comparison body, before `aria-label="已选对比项目"`.

Preserve:

- The block's text, buttons, callbacks, and responsive classes.
- Selected-project removal controls.
- Goal-fit content and matrix rows.
- Copy and clear actions in the header.

Do not create a duplicate block or card-in-card wrapper.

---

## Task 5: Complete focused TDD and review

Run:

```powershell
npm test -- src/lib/cstd-project-comparison.test.ts
npx playwright test e2e/core-flows.spec.ts --grep "comparison completion"
npx tsc --noEmit
npm run lint
git diff --check
```

Review the diff for:

- One computation of the next comparison IDs.
- No new render state or dependency.
- No focus transfer for first selection, removal, or restored URLs.
- No changed comparison data, copy, limit, or external links.
- No unrelated formatting churn.

Commit the implementation only after focused green.

---

## Task 6: Run full local gates

Run fresh:

```powershell
npx tsc --noEmit
npm run lint
npm test
npm audit --audit-level=moderate
npm run build
npm run test:e2e
git diff --check
```

Expected baseline:

- Vitest: at least 66 files / 269 tests after the new unit contract.
- Next build: 734 static pages.
- Playwright: 10 existing passes plus the new desktop/mobile coverage, with the same two environment-dependent skips.
- npm audit: 0 vulnerabilities.

---

## Task 7: Verify the built app in a real browser

Start the already-built application on a verified free local port and use Playwright CLI at 320 x 800, 390 x 844, and 1280 x 720.

Require:

- First selection: pressed state true, focus retained, scroll delta at most two pixels, URL on `#projects`.
- Completion: both IDs serialized, hash `#project-comparison`, result top 80-112 pixels, heading focused.
- 320/390: next-action panel fully inside the arrival viewport, no fixed overlay, page overflow `0`.
- 1280: result alignment and heading focus work without changing desktop comparison columns.
- Restored comparison URL: aligned result, complete data, and no automatic heading focus.
- Browser console: zero warnings and zero errors.
- Screenshots: no clipping, overlap, blank content, or breakpoint drift.

Save evidence under:

```text
output/playwright/cstd-comparison-handoff-2026-07-13/
```

Close the browser session, stop only the verified local server owner, and safely remove only workspace-local Playwright session state.

---

## Task 8: Push and verify production

Require a clean worktree, push `main`, and identify the implementation SHA's GitHub Actions run and Vercel deployment.

Wait for:

- GitHub Actions lint, tests, build, and E2E to complete successfully.
- Vercel target `production`, state `READY`, and aliases including `custard.top` and `www.custard.top`.
- HTTP `200` from the apex and a cache-busted `/cstd` URL.

Repeat the local browser contract against `https://custard.top/cstd`, including restored comparison behavior and screenshot inspection.

---

## Task 9: Record and close the cycle

Append baseline measurements, option comparison, implementation details, local counts, CI run, Vercel deployment, live geometry, screenshots, risks, and the next audit direction to:

```text
.agent/iteration-log.md
.agent/orchestrator-log.md
```

Commit only those files as `docs: record cstd comparison handoff release`, push `main`, and wait for that final commit's own CI and Vercel deployment before continuing the autonomous improvement loop.
