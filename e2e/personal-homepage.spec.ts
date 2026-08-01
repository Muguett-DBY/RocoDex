import { expect, test } from "@playwright/test";
import { captureBrowserIssues, expectNoHorizontalOverflow } from "./support/browser";

test("CSTD presents an immersive WebGL world with selective proof", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  await expect(page.getByRole("heading", { level: 1, name: "CSTD" })).toBeVisible();
  await expect(page.getByRole("link", { name: "进入系统章节" })).toHaveAttribute("href", "#systems");
  await expect(page.locator("[data-cstd-kinetic-world]")).toBeVisible();
  await expect(page.locator("[data-cstd-elastic-archive]")).toBeVisible();
  await expect(page.locator("[data-cstd-webgl]")).toBeVisible();
  await expect(page.locator("[data-cstd-webgl]")).toHaveAttribute("data-cstd-render-ready", "true");
  await expect(page.locator("[data-cstd-webgl-canvas]")).toBeVisible();
  await expect(page.locator('[data-cstd-system]')).toHaveCount(5);
  await expect(page.locator('[data-cstd-proof]')).toHaveCount(3);
  await expect(page.locator('[data-cstd-project-plane]')).toHaveCount(3);
  await expect(page.locator('[data-cstd-live-object]')).toHaveCount(2);

  for (const title of [
    "可用的产品表面",
    "边缘与业务系统",
    "AI 创作与研究工具",
    "研究与可解释模型",
    "数据流与计算研究",
  ]) {
    await expect(page.getByText(title, { exact: true })).toHaveCount(1);
  }

  for (const title of ["洛克图鉴 / RocoDex", "CSTD Alpha", "产业园区招商 CRM"]) {
    await expect(page.getByRole("heading", { level: 3, name: title })).toHaveCount(1);
  }

  await expect(page.getByRole("searchbox")).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByText("项目对比", { exact: true })).toHaveCount(0);
  await expect(page.getByText("按目标找项目", { exact: true })).toHaveCount(0);
  await expect(page.getByText("加入对比", { exact: false })).toHaveCount(0);

  for (const asset of [
    "cstd-kinetic-studio-v2",
    "cstd-data-loom-v2",
  ]) {
    const assetResponse = await page.request.get(`/cstd-world/${asset}.webp`);
    expect(assetResponse.ok()).toBe(true);
    expect(assetResponse.headers()["content-type"]).toContain("image/webp");
  }

  const canvasImage = await page.locator("[data-cstd-webgl-canvas]").screenshot();
  expect(canvasImage.byteLength).toBeGreaterThan(20_000);

  for (const id of ["product-surfaces", "edge-operations", "ai-creation", "research-models", "data-systems"]) {
    const system = page.locator(`[data-cstd-system="${id}"]`);
    await system.scrollIntoViewIfNeeded();
    await expect(system).toBeVisible();
  }

  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD navigation moves through the narrative and keeps proof links safe", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  const navigation = page.getByRole("navigation", { name: "主导航" });
  await expect(navigation.getByRole("link")).toHaveCount(3);
  await navigation.getByRole("link", { name: "系统" }).click();
  await expect(page).toHaveURL(/#systems$/);
  await expect(page.locator("#systems")).toBeInViewport({ ratio: 0.2 });

  const expectedLinks = [
    ["rocodex", "打开图鉴", "https://rocodex.custard.top"],
    ["alpha", "打开 Alpha", "https://alpha.custard.top"],
    ["crm", "打开 CRM", "https://cfzzs.custard.top"],
  ] as const;

  for (const [id, label, href] of expectedLinks) {
    const link = page.locator(`[data-cstd-proof="${id}"]`).getByRole("link", { name: label });
    await expect(link).toHaveAttribute("href", href);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noreferrer");
  }

  for (const id of ["photography", "design"]) {
    const link = page.locator(`[data-cstd-live-object="${id}"]`).getByRole("link");
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noreferrer");
  }

  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD composes its chapters as one kinetic studio without trapping vertical scroll", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "Desktop covers the full chapter rail and continuous research composition.");

  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  const header = page.locator("[data-cstd-header-theme]");
  await expect(header).toHaveAttribute("data-cstd-header-theme", "hero");

  const signalStrip = page.locator("[data-cstd-signal-strip]");
  await expect(signalStrip).toBeVisible();
  const signalTracks = page.locator("[data-cstd-signal-track]");
  await expect(signalTracks).toHaveCount(2);
  const initialSignalTransform = await signalTracks.first().evaluate((element) =>
    getComputedStyle(element).transform,
  );
  await expect
    .poll(() => signalTracks.first().evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(initialSignalTransform);

  // End LCP sampling with the same input a visitor uses before scripted chapter positioning.
  await page.mouse.wheel(0, 4);

  for (const chapter of ["systems", "proof", "path"] as const) {
    await page.locator(`#${chapter}`).evaluate((element) =>
      element.scrollIntoView({ block: "center" }),
    );
    await expect
      .poll(() => header.getAttribute("data-cstd-header-theme"))
      .toBe(chapter);
    await page.locator(`#${chapter}-heading`).evaluate((element) =>
      element.scrollIntoView({ block: "center" }),
    );
    await expect(page.locator(`#${chapter}-heading`)).toBeInViewport();
  }

  const researchPath = page.locator("#path");
  await expect(researchPath).toHaveAttribute("data-cstd-path-mode", "vertical");
  await expect(researchPath).toHaveAttribute("data-cstd-path-continuous", "true");
  await expect(researchPath.locator("[data-cstd-path-stage]")).toHaveCSS("position", "relative");
  const learningSteps = researchPath.locator("[data-cstd-learning-step]");
  const naturalFlow = await learningSteps.evaluateAll((steps) =>
    steps.map((step) => Math.round(step.getBoundingClientRect().top)),
  );
  expect(naturalFlow[naturalFlow.length - 1] - naturalFlow[0]).toBeGreaterThan(1_000);

  await researchPath.evaluate((element) => {
    const section = element as HTMLElement;
    window.scrollTo({ top: section.offsetTop, behavior: "instant" });
  });
  await expect(page.locator("[data-cstd-webgl]")).toHaveAttribute("data-cstd-render-active", "false");

  const finalStep = page.locator('[data-cstd-learning-step="2026"]');
  for (let index = 0; index < 12; index += 1) {
    const activeYear = await researchPath.getAttribute("data-cstd-research-state");
    if (activeYear === "2026") break;
    await page.mouse.wheel(0, 520);
    await page.waitForTimeout(24);
  }
  await expect
    .poll(() => page.locator("[data-cstd-research-state]").getAttribute("data-cstd-research-state"))
    .toBe("2026");
  await expect(finalStep).toBeInViewport({ ratio: 0.2 });

  const footer = page.locator("#cstd-footer");
  for (let index = 0; index < 8; index += 1) {
    const intersectsViewport = await footer.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    });
    if (intersectsViewport) break;
    await page.mouse.wheel(0, 520);
    await page.waitForTimeout(24);
  }
  await expect(footer).toBeInViewport({ ratio: 0.4 });
  const bottomFrameDelay = await page.evaluate(() =>
    new Promise<number>((resolve) => {
      const started = performance.now();
      window.requestAnimationFrame(() => resolve(performance.now() - started));
    }),
  );
  expect(bottomFrameDelay).toBeLessThan(500);

  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD system stage responds to deliberate exploration", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "Desktop covers the sticky material stage.");

  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd#systems", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  const chapterNavigation = page.getByRole("navigation", { name: "章节导航" });
  await expect(chapterNavigation.getByRole("link")).toHaveCount(3);

  const dataSystem = page.locator('[data-cstd-system="data-systems"]');
  await dataSystem.scrollIntoViewIfNeeded();
  await dataSystem.focus();
  await expect(dataSystem).toHaveAttribute("data-cstd-system-active", "true");
  await expect(page.locator('[data-cstd-system-visual="data-systems"]')).toBeVisible();

  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD WebGL field, cursor, and project planes respond to deliberate input", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "Pointer choreography is intentionally a fine-pointer enhancement.");
  test.skip(Boolean(process.env.CI), "Hardware WebGL choreography is covered by local and production Chrome acceptance.");

  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  const hero = page.locator("[data-cstd-hero]");
  const canvas = page.locator("[data-cstd-webgl-canvas]");
  const pointerField = page.locator("[data-cstd-pointer-field]");
  await expect(page.locator("[data-cstd-webgl]")).toHaveAttribute("data-cstd-render-ready", "true");
  const heroBounds = await hero.boundingBox();
  expect(heroBounds).not.toBeNull();
  const initialPointerTransform = await pointerField.evaluate((element) => getComputedStyle(element).transform);
  const initialCanvas = await canvas.screenshot();
  await page.mouse.move(heroBounds!.x + heroBounds!.width * 0.86, heroBounds!.y + heroBounds!.height * 0.72, { steps: 8 });
  await page.mouse.down();
  await page.waitForTimeout(160);
  await page.mouse.up();
  await expect
    .poll(() => pointerField.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(initialPointerTransform);
  const activeCanvas = await canvas.screenshot();
  expect(activeCanvas.equals(initialCanvas)).toBe(false);

  const alphaPlane = page.locator('[data-cstd-project-plane="alpha"]');
  await alphaPlane.scrollIntoViewIfNeeded();
  await page.mouse.move(8, 8);
  await page.waitForTimeout(800);
  const initialClipPath = await alphaPlane.evaluate((element) => getComputedStyle(element).clipPath);
  await alphaPlane.hover();
  await expect
    .poll(() => alphaPlane.evaluate((element) => getComputedStyle(element).clipPath))
    .not.toBe(initialClipPath);

  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD preserves its visual field when the WebGL context is lost", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "One browser profile is sufficient for context-loss recovery.");

  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  const webgl = page.locator("[data-cstd-webgl]");
  const canvasShell = page.locator("[data-cstd-webgl-canvas]");
  const canvas = canvasShell.locator("canvas");
  await expect(webgl).toHaveAttribute("data-cstd-render-ready", "true");
  await canvas.evaluate((element) => {
    element.dispatchEvent(new Event("webglcontextlost", { cancelable: true }));
  });
  await expect(webgl).toHaveAttribute("data-cstd-render-ready", "fallback");
  await expect(webgl).toHaveAttribute("data-cstd-render-fallback", "true");
  await expect(canvasShell).toHaveCount(0);

  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD defaults to full motion and keeps an explicit calm mode scrollable", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "One browser profile is sufficient for motion-mode semantics.");

  await page.emulateMedia({ reducedMotion: "reduce" });
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  const motionToggle = page.locator("[data-cstd-motion-toggle]");
  const webgl = page.locator("[data-cstd-webgl]");
  await expect(webgl).toHaveAttribute("data-cstd-render-ready", "true");
  const fullQuality = await webgl.getAttribute("data-cstd-render-quality");
  await expect(motionToggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-cstd-pointer-field]")).toBeVisible();
  await expect(page.locator('[data-cstd-chapter="path"]')).toHaveAttribute("data-cstd-path-mode", "vertical");

  await motionToggle.click();
  await expect(motionToggle).toHaveAttribute("aria-pressed", "false");
  await expect(webgl).toHaveAttribute("data-cstd-render-quality", "lite");
  await expect(webgl).toHaveAttribute("data-cstd-render-ready", "true");
  await motionToggle.click();
  await expect(motionToggle).toHaveAttribute("aria-pressed", "true");
  await expect(webgl).toHaveAttribute("data-cstd-render-quality", fullQuality!);
  await motionToggle.click();
  await expect(motionToggle).toHaveAttribute("aria-pressed", "false");
  await expect(webgl).toHaveAttribute("data-cstd-render-quality", "lite");
  await expect(page.locator("[data-cstd-pointer-field]")).toBeHidden();

  const signalTrack = page.locator("[data-cstd-signal-track]").first();
  const initialSignalTransform = await signalTrack.evaluate((element) =>
    getComputedStyle(element).transform,
  );
  await page.waitForTimeout(450);
  await expect
    .poll(() => signalTrack.evaluate((element) => getComputedStyle(element).transform))
    .toBe(initialSignalTransform);

  const canvas = page.locator("[data-cstd-webgl-canvas]");
  await expect(page.locator("[data-cstd-webgl]")).toHaveAttribute("data-cstd-render-ready", "true");
  await page.waitForTimeout(100);
  const firstFrame = await canvas.screenshot();
  await page.waitForTimeout(450);
  const secondFrame = await canvas.screenshot();
  expect(secondFrame.equals(firstFrame)).toBe(true);

  const researchPath = page.locator('[data-cstd-chapter="path"]');
  await expect(researchPath).toHaveAttribute("data-cstd-path-mode", "vertical");
  await researchPath.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const target = window.scrollY + rect.top + element.scrollHeight - window.innerHeight * 1.05;
    window.scrollTo({ top: target, behavior: "instant" });
  });
  await expect(page.locator('[data-cstd-learning-step="2026"]')).toBeInViewport({ ratio: 0.35 });

  const footer = page.locator("footer");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toBeInViewport({ ratio: 0.4 });

  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD does not revive gallery index or playful click-through interactions", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd#path", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  await expect(page.getByRole("navigation", { name: "作品索引" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "再碰一下奶黄包" })).toHaveCount(0);
  await expect(page.locator('[data-cstd-project]')).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});
