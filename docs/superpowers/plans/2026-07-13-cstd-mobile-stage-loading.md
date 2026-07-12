# CSTD Mobile Stage Loading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent the desktop-only Three.js custard stage from mounting or downloading below 1024 px while preserving current desktop and compact-mobile interactions.

**Architecture:** A private breakpoint hook in `CstdLanding` owns a hydration-safe `matchMedia` subscription. The existing dynamic stage is rendered only when that hook reports desktop width; all existing layout shells and the compact mobile button remain unchanged.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Playwright, Vitest.

## Global Constraints

- Keep the existing `lg` breakpoint at exactly 1024 px.
- Do not add a media-query dependency.
- Preserve current desktop visuals and mobile mascot copy/interaction.
- Do not render the dynamic Three.js stage during server rendering or mobile hydration.
- Prove the network improvement against a fresh production build.

---

### Task 1: Lock The Mobile Mount Contract

**Files:**
- Modify: `e2e/core-flows.spec.ts`

**Interfaces:**
- Consumes: Playwright's existing `isMobile` project fixture and the mascot accessible name `点击奶黄包互动`.
- Produces: a regression that distinguishes the compact mascot from the hidden full stage using raw DOM count.

- [ ] **Step 1: Write the failing regression**

Update the core-flow test signature and add the raw DOM assertion before the visible-role assertion:

```ts
test("core routes render responsively and the CSTD fallback remains interactive", async ({ page, isMobile }) => {
  // existing route checks
  const mascotButtons = page.locator('button[aria-label="点击奶黄包互动"]');
  await expect(mascotButtons).toHaveCount(isMobile ? 1 : 2);
  const mascot = page.getByRole("button", { name: "点击奶黄包互动" });
  // existing interaction checks
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm run test:e2e -- --grep "core routes render responsively"
```

Expected: mobile Chromium fails because both the compact button and the CSS-hidden desktop-stage button are mounted; desktop remains at two buttons.

### Task 2: Mount The Stage Only On Desktop

**Files:**
- Modify: `src/components/cstd-landing.tsx`

**Interfaces:**
- Consumes: browser `matchMedia`, the existing Tailwind `lg` breakpoint, and `CstdCustardStage` props.
- Produces: `useDesktopCustardStage(): boolean` and conditional full-stage rendering.

- [ ] **Step 1: Add the breakpoint hook**

Add beside `usePrefersReducedMotion`:

```ts
function useDesktopCustardStage() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateEnabled = () => setEnabled(mediaQuery.matches);

    updateEnabled();
    mediaQuery.addEventListener("change", updateEnabled);
    return () => mediaQuery.removeEventListener("change", updateEnabled);
  }, []);

  return enabled;
}
```

- [ ] **Step 2: Gate the dynamic child**

Inside `CstdLanding`, read the hook unconditionally:

```ts
const desktopCustardStageEnabled = useDesktopCustardStage();
```

Keep the aside and labels stable, but change the stage child to:

```tsx
{desktopCustardStageEnabled ? (
  <CstdCustardStage
    audioEnabled={audioPreference !== "disabled"}
    mascotCopy={mascotCopy}
    mascotMood={mascotMood}
    motionDisabled={motionDisabled}
    onMoodChange={handleMascotMoodChange}
    onPoke={pokeMascot}
  />
) : null}
```

- [ ] **Step 3: Run focused GREEN verification**

Run:

```bash
npm run test:e2e -- --grep "core routes render responsively"
```

Expected: desktop and mobile pass; the visible mascot remains interactive in both profiles.

### Task 3: Prove Production Network And Release Quality

**Files:**
- Modify after deployment evidence: `.agent/iteration-log.md`
- Modify after deployment evidence: `.agent/orchestrator-log.md`

**Interfaces:**
- Consumes: fresh `.next` chunks, browser Resource Timing entries, existing CI/Vercel release process.
- Produces: measured before/after evidence and a closed production iteration.

- [ ] **Step 1: Run local quality gates**

Run:

```bash
npm run lint
npx tsc --noEmit
npm test
npm audit --json
git diff --check
npm run build
npm run test:e2e
```

Expected: zero failures, zero dependency vulnerabilities, and a successful production build.

- [ ] **Step 2: Verify production-mode network behavior**

Start the built app, open a 390 x 844 browser before navigation, and inspect Resource Timing.

Expected mobile evidence:

```text
viewport: 390 x 844
hasWebglCanvas: false
desktop stage chunk: absent
raw mascot buttons: 1
```

Open a desktop viewport and confirm the dynamic stage chunk is requested and the full stage interaction is mounted.

- [ ] **Step 3: Commit and publish the implementation**

```bash
git add -- e2e/core-flows.spec.ts src/components/cstd-landing.tsx
git commit -m "perf: skip cstd desktop stage on mobile"
git push origin main
```

- [ ] **Step 4: Close remote verification**

Wait for GitHub Actions and Vercel production Ready. Re-run live mobile Resource Timing, desktop interaction, horizontal-overflow, console, and error-overlay checks. Record exact commit, CI run, deployment ID, transferred/decoded byte savings, and remaining risks in both agent logs, then commit and push the evidence-only update.
