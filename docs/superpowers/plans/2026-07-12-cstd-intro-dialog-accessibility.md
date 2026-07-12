# CSTD Intro Dialog Accessibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the CSTD first-visit and replay intro a named, keyboard-contained native modal that closes predictably and restores focus.

**Architecture:** Keep intro visibility and phase state in `CstdLanding`, but render `CstdIntro` as a native `motion.dialog` opened through `showModal()`. The dialog component owns focus placement, body scroll locking, cancel handling, and native cleanup; Playwright verifies behavior through the real browser accessibility and keyboard model.

**Tech Stack:** Next.js 16, React 19, TypeScript, Framer Motion, Playwright, Vitest

## Global Constraints

- Preserve the existing CSTD intro visuals, 5.6-second playback timing, audio behavior, reduced-motion policy, and URL-state intro suppression.
- Do not add dependencies or visible controls.
- Do not change the RocoDex surface.
- Keep `直接浏览项目` available and keyboard-focused during playback.
- Verify desktop and mobile Chromium behavior.

---

### Task 1: Add the browser-level keyboard regression

**Files:**
- Modify: `e2e/core-flows.spec.ts`
- Test: `e2e/core-flows.spec.ts`

**Interfaces:**
- Consumes: `captureBrowserIssues(page)` and the existing `/cstd` route.
- Produces: an E2E contract for a dialog named `CSTD 开场动画`, focus containment, Escape dismissal, scroll restoration, and replay focus restoration.

- [x] **Step 1: Write the failing Playwright test**

Add a test that opens `/cstd` in a fresh context, locates the intro through `getByRole("dialog", { name: "CSTD 开场动画" })`, verifies `开启 CSTD` receives focus, verifies forward and backward Tab movement wraps at both intro boundaries, closes with Escape, replays from `播放开场`, verifies playback focuses and retains `直接浏览项目` in both Tab directions, then closes and returns focus to `播放开场`. Assert `document.body.style.overflow` is `hidden` while open and restored after close, with no browser warnings or errors.

```ts
test("CSTD intro behaves as a keyboard-contained modal", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBe(true);

  const dialog = page.getByRole("dialog", { name: "CSTD 开场动画" });
  const skip = dialog.getByRole("button", { name: "直接浏览项目" });
  const start = dialog.getByRole("button", { name: "开启 CSTD" });

  await expect(dialog).toBeVisible();
  await expect(start).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");

  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(start).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(skip).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(start).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");

  const replay = page.getByRole("button", { name: "播放开场" });
  await replay.click();
  await expect(dialog).toBeVisible();
  await expect(skip).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(skip).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(replay).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
  expect(browserIssues).toEqual([]);
});
```

- [x] **Step 2: Run the regression to prove the current implementation fails**

Run:

```powershell
npm run test:e2e -- --grep "CSTD intro behaves as a keyboard-contained modal" --project=desktop-chromium
```

Expected: FAIL because the current intro root is not exposed as a named dialog.

- [x] **Step 3: Review the failure**

Confirm the failure is the missing dialog contract, not server startup, network, or selector noise. Preserve the failing test unchanged for Task 2.

---

### Task 2: Convert the intro to a native modal dialog

**Files:**
- Modify: `src/components/cstd-landing.tsx:1308`
- Test: `e2e/core-flows.spec.ts`

**Interfaces:**
- Consumes: `CstdIntroPhase`, `onSkip`, `onStart`, React refs/effects, and native `HTMLDialogElement.showModal()` / `close()`.
- Produces: `CstdIntro` as a full-viewport dialog with stable accessible name `CSTD 开场动画` and browser-managed modal focus containment.

- [x] **Step 1: Add dialog lifecycle refs and effects**

Inside `CstdIntro`, create refs for the dialog, skip button, and start button. On mount, save the active element and `document.body.style.overflow`, set overflow to `hidden`, and call `showModal()` only when `dialog.open` is false. On cleanup, restore the saved overflow, call `close()` only when the dialog remains open, and restore the saved focus when the element is still connected and is not `body`.

Add a phase effect that focuses the start button while idle and the skip button while playing on the next animation frame.

```tsx
const dialogRef = useRef<HTMLDialogElement>(null);
const skipButtonRef = useRef<HTMLButtonElement>(null);
const startButtonRef = useRef<HTMLButtonElement>(null);

useEffect(() => {
  const dialog = dialogRef.current;
  if (!dialog) return;

  const previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  if (!dialog.open) dialog.showModal();

  return () => {
    document.body.style.overflow = previousBodyOverflow;
    if (dialog.open) dialog.close();
    if (previouslyFocusedElement && previouslyFocusedElement !== document.body && previouslyFocusedElement.isConnected) {
      previouslyFocusedElement.focus();
    }
  };
}, []);

useEffect(() => {
  const frame = window.requestAnimationFrame(() => {
    (introPlaying ? skipButtonRef : startButtonRef).current?.focus();
  });
  return () => window.cancelAnimationFrame(frame);
}, [introPlaying]);
```

- [x] **Step 2: Add native modal semantics and cancel routing**

Change the root to `motion.dialog` with `role="dialog"`, `aria-modal="true"`, `aria-labelledby="cstd-intro-title"`, the dialog ref, and an `onCancel` handler that prevents the browser's independent close and calls `onSkip()`. Add a narrow boundary `onKeyDown` guard because Chromium moves focus to `body` when Tab crosses either edge of a modal dialog.

Use full-viewport dialog reset classes:

```tsx
className="fixed inset-0 z-50 m-0 grid h-full max-h-none w-full max-w-none place-items-center overflow-hidden border-0 bg-[#fff4cf] p-0 text-[#2f241d] backdrop:bg-transparent"
```

Add a persistent screen-reader heading:

```tsx
<h2 id="cstd-intro-title" className="sr-only">CSTD 开场动画</h2>
```

The root contract is:

```tsx
<motion.dialog
  ref={dialogRef}
  role="dialog"
  aria-modal="true"
  aria-labelledby="cstd-intro-title"
  onCancel={(event) => {
    event.preventDefault();
    onSkip();
  }}
  onKeyDown={(event) => {
    if (event.key !== "Tab") return;

    const firstControl = skipButtonRef.current;
    const lastControl = introPlaying ? firstControl : startButtonRef.current;
    if (!firstControl || !lastControl) return;

    const focusLeavesStart = event.shiftKey && document.activeElement === firstControl;
    const focusLeavesEnd = !event.shiftKey && document.activeElement === lastControl;
    if (!focusLeavesStart && !focusLeavesEnd) return;

    event.preventDefault();
    (event.shiftKey ? lastControl : firstControl).focus();
  }}
  className="fixed inset-0 z-50 m-0 grid h-full max-h-none w-full max-w-none place-items-center overflow-hidden border-0 bg-[#fff4cf] p-0 text-[#2f241d] backdrop:bg-transparent"
  initial={{ opacity: 1 }}
  exit={{ opacity: 0, scale: 1.018, filter: "blur(12px)" }}
  transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
>
  <h2 id="cstd-intro-title" className="sr-only">CSTD 开场动画</h2>
  {/* Existing intro contents remain here. */}
</motion.dialog>
```

- [x] **Step 3: Wire deterministic control focus**

Attach the skip and start refs to their buttons. Add visible focus outlines to both controls. Mark the decorative visible `CSTD` idle heading as `aria-hidden="true"` so the persistent dialog label is the single accessible heading.

```tsx
<button ref={skipButtonRef} type="button" onClick={onSkip} className="... focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64]">
  直接浏览项目
</button>

<h2 aria-hidden="true" className="mt-2 text-4xl font-black tracking-tight text-[#2f241d] sm:text-6xl">CSTD</h2>

<button ref={startButtonRef} type="button" onClick={onStart} className="... focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8f64]">
  <span className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-white/24 transition group-hover:left-full" />
  开启 CSTD
</button>
```

- [x] **Step 4: Run the focused E2E test on desktop and mobile**

Run:

```powershell
npm run test:e2e -- --grep "CSTD intro behaves as a keyboard-contained modal"
```

Expected: 2 passed, 0 failed.

- [x] **Step 5: Run related focused unit tests**

Run:

```powershell
npx vitest run src/lib/cstd-motion.test.ts src/components/cstd-landing-url-sync.test.ts src/lib/cstd-mobile-layout.test.ts
```

Expected: all selected files and tests pass.

- [x] **Step 6: Commit the implementation**

```powershell
git add -- src/components/cstd-landing.tsx e2e/core-flows.spec.ts docs/superpowers/specs/2026-07-12-cstd-intro-dialog-accessibility-design.md docs/superpowers/plans/2026-07-12-cstd-intro-dialog-accessibility.md
git diff --cached --check
git commit -m "fix: make cstd intro keyboard modal"
```

---

### Task 3: Complete local and production acceptance

**Files:**
- Modify after verification: `.agent/iteration-log.md`
- Modify after verification: `.agent/orchestrator-log.md`

**Interfaces:**
- Consumes: the completed native dialog and E2E contract.
- Produces: local, CI, Vercel, and live `custard.top` evidence for the iteration.

- [x] **Step 1: Run all local quality gates**

Run `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm run test:e2e`, `npm audit --json`, and `git diff --check`. Record exact pass counts and any intentional skips.

- [x] **Step 2: Verify local production behavior**

Run `next start` on a free local port. With Playwright at desktop and 390 x 844, verify the named modal, initial focus, Tab containment, Escape close, replay focus restoration, body overflow restoration, no horizontal overflow, and zero console warnings/errors.

- [ ] **Step 3: Push `main` and wait for remote closure**

Push the implementation commit, wait for the matching GitHub Actions run to pass, and confirm the matching Vercel production deployment is `Ready` with the `custard.top` alias.

- [ ] **Step 4: Verify the live custom domain**

Repeat the keyboard contract on `https://custard.top/?verify=<commit>`, including desktop and mobile widths, then check console warnings/errors and horizontal overflow.

- [ ] **Step 5: Record and publish evidence**

Append the finding, fix, local counts, commit, CI run, Vercel deployment, live checks, and remaining risk to both agent logs. Commit and push only those two log files, then wait for the documentation commit's CI and Vercel status.
