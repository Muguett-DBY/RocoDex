# CSTD Comparison Goal Round Trip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn 选择目标路径 into an accessible, URL-accurate round trip that preserves the current comparison and returns visitors to its updated fit decision.

**Architecture:** Serialize the guide as a first-class view hash, track only direct comparison-to-guide provenance in transient component state, and reuse one guarded result-focus ref for both comparison completion and goal-return interactions. Existing query state, recommendation logic, guide controls, and comparison rendering remain canonical.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Vitest, Playwright, GitHub Actions, Vercel.

**Design:** docs/superpowers/specs/2026-07-13-cstd-comparison-goal-round-trip-design.md

## Global Constraints

- Work only on the personal CSTD homepage at /cstd; do not change the RocoDex encyclopedia experience.
- Preserve every comparison ID while choosing a goal; do not auto-replace projects.
- Keep ordinary goal selection on its existing #projects path.
- Do not duplicate the goal selector or add sticky, modal, drawer, or fixed UI.
- Programmatic heading focus must use tabIndex={-1} and must not affect restored-link focus.
- Use exact-file staging on main; do not use git add . or force push.

---

### Task 1: Add the guide hash contract

**Files:**
- Modify: src/lib/cstd-project-view-state.ts
- Test: src/lib/cstd-project-view-state.test.ts

**Interfaces:**
- Consumes: buildCstdProjectViewHref(pathname, state, hash) and the existing query serializer.
- Produces: CstdProjectViewHash accepting "project-guide" and preserving the supplied comparison IDs.

- [ ] **Step 1: Write the compile-time and runtime contract**

Import type CstdProjectViewHash in the test and add:

~~~ts
it("serializes the goal guide anchor without dropping comparison context", () => {
  const guideHash: CstdProjectViewHash = "project-guide";

  expect(
    buildCstdProjectViewHref(
      "/cstd",
      {
        filter: "all",
        query: "",
        guideId: null,
        projectId: null,
        compareProjectIds: ["rocodex", "photography"],
      },
      guideHash,
    ),
  ).toBe("/cstd?compare=rocodex%2Cphotography#project-guide");
});
~~~

- [ ] **Step 2: Run the type gate and observe red**

Run:

~~~powershell
npx tsc --noEmit
~~~

Expected: TypeScript rejects "project-guide" because the view-hash union does not include it.

- [ ] **Step 3: Extend only the hash union**

~~~ts
export type CstdProjectViewHash =
  | "projects"
  | "project-guide"
  | "project-focus"
  | "project-comparison";
~~~

- [ ] **Step 4: Run focused green**

~~~powershell
npm test -- src/lib/cstd-project-view-state.test.ts
npx tsc --noEmit
~~~

Expected: the focused unit file and type gate pass.

---

### Task 2: Define the failing round-trip browser contract

**Files:**
- Test: e2e/core-flows.spec.ts

**Interfaces:**
- Consumes: production-equivalent /cstd behavior and the existing overflow/browser-issue helpers.
- Produces: desktop and mobile regression coverage for outbound guide handoff, return-to-result behavior, and history.

- [ ] **Step 1: Add a dedicated E2E test**

Add CSTD goal selection returns to the preserved comparison decision. Its central assertions are:

~~~ts
const response = await page.goto(
  "/cstd?compare=rocodex%2Cphotography#project-comparison",
  { waitUntil: "domcontentloaded" },
);
expect(response?.ok()).toBe(true);

const comparison = page.locator("#project-comparison");
const comparisonHeading = page.getByRole("heading", { name: "项目对比" });
const guide = page.locator("#project-guide");
const guideHeading = page.getByRole("heading", { name: "按目标找项目" });
const firstGoal = page.getByRole("button", {
  name: "查精灵资料与玩法工具，匹配洛克图鉴 / RocoDex",
});

await comparison
  .getByRole("group", { name: "对比下一步" })
  .getByRole("button", { name: "选择目标路径", exact: true })
  .click();
await expect(page).toHaveURL(
  /\/cstd\?compare=rocodex%2Cphotography#project-guide$/,
);
await expect.poll(() => guide.evaluate((element) => {
  const top = element.getBoundingClientRect().top;
  return top >= 80 && top <= 112;
})).toBe(true);
await expect(guideHeading).toBeFocused();

await page.keyboard.press("Tab");
await expect(firstGoal).toBeFocused();
await firstGoal.click();

await expect(page).toHaveURL(
  /\/cstd\?goal=game-data&compare=rocodex%2Cphotography#project-comparison$/,
);
await expect.poll(() => comparison.evaluate((element) => {
  const top = element.getBoundingClientRect().top;
  return top >= 80 && top <= 112;
})).toBe(true);
await expect(comparisonHeading).toBeFocused();
await expect(comparison.getByText("已选择 2 / 2 个项目", { exact: true })).toBeVisible();
await expect(comparison.getByText("优先查看洛克图鉴 / RocoDex", { exact: true })).toBeVisible();
await expect(comparison.getByRole("group", { name: "目标匹配判断" })).toContainText("目标直达");
~~~

Then use page.goBack() and page.goForward() to require the guide and result hashes, aligned section tops, selected-goal removal/restoration, and retained 2 / 2 state. Do not require a new focus transfer for history movement. Finish with overflow and browser-issue assertions.

- [ ] **Step 2: Run the focused test and observe red**

~~~powershell
npx playwright test e2e/core-flows.spec.ts --grep "goal selection returns"
~~~

Expected red: after the outbound action the URL remains #project-comparison and the guide heading is not focused.

---

### Task 3: Define source-level wiring contracts

**Files:**
- Test: src/components/cstd-landing-url-sync.test.ts

**Interfaces:**
- Consumes: the stable source-level behavior contracts already used for URL restoration.
- Produces: regression checks for guide provenance, heading focus, return hash, and result realignment after guide changes.

- [ ] **Step 1: Add a focused failing source test**

Add:

~~~ts
expect(source).toContain(
  "const [comparisonGoalHandoffPending, setComparisonGoalHandoffPending] = useState(false);",
);
expect(source).toContain('window.location.hash !== "#project-guide"');
expect(source).toContain(
  'document.getElementById("project-guide-heading")?.focus({ preventScroll: true });',
);
expect(source).toContain('"project-guide",');
expect(source).toContain('window.location.hash === "#project-guide"');
expect(source).toContain('shouldReturnToComparison ? "project-comparison" : "projects"');
expect(source).toContain(
  "[projectComparison.projects.length, projectViewStateSynced, selectedGuideId]",
);
~~~

Update the existing comparison-restoration test to expect the generalized one-shot ref name comparisonResultFocusPendingRef instead of comparisonCompletionHandoffPendingRef.

- [ ] **Step 2: Run the focused unit file and observe red**

~~~powershell
npm test -- src/components/cstd-landing-url-sync.test.ts
~~~

Expected: the new source strings are absent.

---

### Task 4: Implement the provenance-aware round trip

**Files:**
- Modify: src/components/cstd-landing.tsx

**Interfaces:**
- Consumes: CstdProjectViewHash, buildCstdProjectViewHref, selectedGuideId, comparedProjectIds, and the existing guide/comparison callbacks.
- Produces: accurate guide/result URLs and one-shot focus handoffs without changing project or recommendation data.

- [ ] **Step 1: Add transient handoff state and generalize the result ref**

~~~ts
const comparisonResultFocusPendingRef = useRef(false);
const [comparisonGoalHandoffPending, setComparisonGoalHandoffPending] =
  useState(false);
~~~

Replace existing completion-ref reads and writes with comparisonResultFocusPendingRef.

- [ ] **Step 2: Align guide hashes and focus only direct handoffs**

~~~ts
useEffect(() => {
  if (!projectViewStateSynced || window.location.hash !== "#project-guide") return;
  const frame = window.requestAnimationFrame(() => {
    const guideSection = document.getElementById("project-guide");
    if (!guideSection) return;

    guideSection.scrollIntoView({
      behavior:
        comparisonGoalHandoffPending && !motionDisabled ? "smooth" : "auto",
      block: "start",
    });
    if (!comparisonGoalHandoffPending) return;

    document
      .getElementById("project-guide-heading")
      ?.focus({ preventScroll: true });
  });
  return () => window.cancelAnimationFrame(frame);
}, [
  comparisonGoalHandoffPending,
  motionDisabled,
  projectViewStateSynced,
  selectedGuideId,
]);
~~~

- [ ] **Step 3: Serialize the outbound guide transition**

~~~ts
function focusProjectGuide() {
  setComparisonGoalHandoffPending(true);
  window.history.pushState(
    null,
    "",
    buildCstdProjectViewHref(
      window.location.pathname,
      {
        filter: activeProjectFilter,
        query: projectSearchQuery,
        guideId: selectedGuideId,
        projectId: selectedProjectId,
        compareProjectIds: comparedProjectIds,
      },
      "project-guide",
    ),
  );
}
~~~

- [ ] **Step 4: Return only provenance-marked goal selections**

At the start of selectProjectGuide:

~~~ts
const shouldReturnToComparison =
  guideId !== null &&
  window.location.hash === "#project-guide" &&
  comparedProjectIds.length > 0;
comparisonResultFocusPendingRef.current = shouldReturnToComparison;
setComparisonGoalHandoffPending(false);
~~~

Pass this third URL-builder argument:

~~~ts
shouldReturnToComparison ? "project-comparison" : "projects"
~~~

Keep comparison IDs, selected-project clearing, copy-state clearing, and restored-receipt clearing unchanged.

Update the existing `popstate` listener so it clears both transient focus intents before calling the existing URL-state synchronizer. The hash and query remain the durable source of history behavior:

~~~ts
const handlePopState = () => {
  comparisonResultFocusPendingRef.current = false;
  setComparisonGoalHandoffPending(false);
  syncViewState();
};
window.addEventListener("popstate", handlePopState);
return () => window.removeEventListener("popstate", handlePopState);
~~~

- [ ] **Step 5: Realign after goal-fit recomputation**

Use this dependency list for the existing comparison effect:

~~~ts
[projectComparison.projects.length, projectViewStateSynced, selectedGuideId]
~~~

The effect always scrolls a #project-comparison URL, but focuses the heading only while comparisonResultFocusPendingRef.current is true, then clears the ref.

- [ ] **Step 6: Make the guide heading a stable focus target**

~~~tsx
<h3
  id="project-guide-heading"
  tabIndex={-1}
  className="mt-1 rounded-sm text-xl font-black text-[#2f241d] focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-[#0f8f64] sm:text-2xl"
>
  按目标找项目
</h3>
~~~

---

### Task 5: Complete focused TDD and review

**Files:**
- Verify: src/lib/cstd-project-view-state.test.ts
- Verify: src/components/cstd-landing-url-sync.test.ts
- Verify: e2e/core-flows.spec.ts
- Review: src/components/cstd-landing.tsx

**Interfaces:**
- Consumes: Tasks 1-4.
- Produces: a locally green, narrowly reviewed implementation commit.

- [ ] **Step 1: Run focused green**

~~~powershell
npm test -- src/lib/cstd-project-view-state.test.ts src/components/cstd-landing-url-sync.test.ts
npx playwright test e2e/core-flows.spec.ts --grep "goal selection returns"
npx tsc --noEmit
npm run lint
git diff --check
~~~

Expected: both desktop/mobile E2E profiles and all focused units pass.

- [ ] **Step 2: Review behavior boundaries**

Confirm the diff has one transient provenance state and one generalized one-shot result-focus ref; no duplicated UI or changed fit data; no auto-return for ordinary guide selection; no restored-link focus; and exact comparison-ID preservation.

- [ ] **Step 3: Commit the implementation**

~~~powershell
git add -- src/lib/cstd-project-view-state.ts src/lib/cstd-project-view-state.test.ts src/components/cstd-landing.tsx src/components/cstd-landing-url-sync.test.ts e2e/core-flows.spec.ts
git diff --cached --check
git commit -m "feat: complete cstd comparison goal round trip"
~~~

---

### Task 6: Run full local acceptance

**Files:**
- Verify: repository-wide source, tests, build, and browser suite.

**Interfaces:**
- Consumes: the implementation commit.
- Produces: release evidence for the exact implementation SHA.

- [ ] **Step 1: Run every local gate fresh**

~~~powershell
npx tsc --noEmit
npm run lint
npm test
npm audit --audit-level=moderate
npm run build
npm run test:e2e
git diff --check
~~~

Expected baseline: at least 66 Vitest files / 269 tests plus the new contracts, 734 generated pages, the expanded E2E suite with the same two environment-dependent skips, and zero moderate-or-higher vulnerabilities.

- [ ] **Step 2: Verify the built app at production viewports**

Run the built app on a verified free local port and use Playwright CLI at 320 x 800, 390 x 844, and 1280 x 720. Require:

- outbound #project-guide, top 80-112 pixels, guide heading focus, and one-Tab access to the first goal;
- return goal=game-data&compare=rocodex,photography#project-comparison, top 80-112 pixels, result heading focus, and 2 / 2 retained;
- updated goal-fit and direct-project next action visible in the result arrival;
- back/forward hash and selected-goal state restoration;
- direct restored result aligned without automatic focus;
- horizontal overflow 0, no error overlay, and zero console warnings/errors.

Visually inspect mobile guide arrival, mobile result arrival, desktop result arrival, and restored result screenshots. Close the session, stop only the verified server owner, and safely remove only workspace-local Playwright state.

---

### Task 7: Push, verify production, and record release evidence

**Files:**
- Modify after production verification: .agent/iteration-log.md
- Modify after production verification: .agent/orchestrator-log.md

**Interfaces:**
- Consumes: a clean, fully verified implementation SHA.
- Produces: synchronized origin/main, successful CI, READY production deployment, live browser evidence, and a final documentation commit.

- [ ] **Step 1: Push the exact implementation history**

~~~powershell
git status --short --branch
git push origin main
~~~

Require a clean worktree and no ahead/behind divergence after push.

- [ ] **Step 2: Close remote release gates**

Wait for the implementation SHA's GitHub Actions run to pass lint, tests, build, and E2E. Identify the matching Vercel production deployment and require READY, aliases including custard.top and www.custard.top, and HTTP 200 from apex, /cstd, cache-busted /cstd, and the deployment URL.

- [ ] **Step 3: Repeat the browser contract on production**

Run the same 320, 390, and 1280 round trip, history, restored-link, overflow, console, and screenshot checks against https://custard.top/cstd.

- [ ] **Step 4: Record exact evidence and close the log commit**

Append baseline measurements, chosen option, implementation behavior, local counts, implementation commits, CI run ID, Vercel deployment ID, live geometry, history results, residual risks, and the next audited direction to both logs. Then:

~~~powershell
git add -- .agent/iteration-log.md .agent/orchestrator-log.md
git diff --cached --check
git commit -m "docs: record cstd comparison goal round trip"
git push origin main
~~~

Wait for the final log SHA's CI and production deployment to reach successful terminal states before starting the next autonomous cycle.
