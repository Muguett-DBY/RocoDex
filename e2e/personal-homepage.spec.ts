import { expect, test } from "@playwright/test";
import { captureBrowserIssues, expectNoHorizontalOverflow } from "./support/browser";

test("CSTD presents a concise personal studio with progressive visuals", async ({ page, isMobile }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  await expect(page.getByRole("heading", { level: 1, name: "CSTD" })).toBeVisible();
  await expect(page.getByText("奶黄包的个人技术工作室", { exact: false })).toBeVisible();
  await expect(page.getByRole("link", { name: "进入技能反应堆" })).toHaveAttribute("href", "#systems");
  await expect(page.locator("[data-cstd-kinetic-world]")).toBeVisible();
  await expect(page.locator("[data-cstd-atlas]")).toBeVisible();
  await expect(page.locator("[data-cstd-atlas-district]")).toHaveCount(10);
  await expect(page.locator("[data-cstd-atlas-district]:visible")).toHaveCount(5);
  const atlasData = page.locator('[data-cstd-atlas-district="data-systems"]:visible');
  await atlasData.click();
  await expect(page.locator("[data-cstd-atlas]")).toHaveAttribute("data-cstd-atlas-active", "data-systems");
  if (!isMobile) {
    const atlasProduct = page.locator('#cstd-atlas-product-surfaces');
    await atlasProduct.focus();
    await atlasProduct.press("ArrowRight");
    await expect(page.locator("[data-cstd-atlas]")).toHaveAttribute("data-cstd-atlas-active", "edge-operations");
  }
  await expect(page.locator("[data-cstd-world-backdrop]")).toHaveAttribute("data-cstd-world-scene", "hero");
  await expect(page.locator("[data-cstd-world-frame]")).toHaveCount(2);
  await expect(page.locator("[data-cstd-scene]")).toHaveCount(6);
  await expect(page.locator("[data-cstd-system]")).toHaveCount(5);
  await expect(page.locator("[data-cstd-skill-reactor]")).toHaveCount(1);
  await expect(page.locator("[data-cstd-technical-note]")).toHaveCount(3);
  await expect(page.locator("[data-cstd-proof]")).toHaveCount(3);
  await expect(page.locator("[data-cstd-project-plane]")).toHaveCount(3);
  await expect(page.locator("[data-cstd-live-feed]")).toHaveCount(3);
  await expect(page.locator("[data-cstd-project-broadcast]")).toHaveCount(3);
  await expect(page.locator("[data-cstd-live-object]")).toHaveCount(2);
  await expect(page.locator('[data-cstd-generated-visual="night-runner-v1"]')).toHaveCount(1);
  await expect(page.locator('[data-cstd-generated-visual="data-vault-v1"]')).toHaveCount(1);
  await expect(page.locator('[data-cstd-generated-visual="departure-city-v1"]')).toHaveCount(1);
  await expect(page.locator("[data-cstd-learning-step]")).toHaveCount(4);
  await expect(page.locator("[data-cstd-scene-director]")).toHaveCount(1);

  if (isMobile) {
    await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-scene-mode", "image");
    await expect(page.locator("[data-cstd-webgl]")).toHaveCount(0);
  } else {
    const webgl = page.locator("[data-cstd-webgl]");
    await expect(webgl).toHaveAttribute("data-cstd-render-ready", "true");
    await expect(page.locator("[data-cstd-webgl-canvas]")).toBeVisible();
    const canvasImage = await page.locator("[data-cstd-webgl-canvas]").screenshot();
    expect(canvasImage.byteLength).toBeGreaterThan(20_000);
    const canvasSignal = await page.locator("[data-cstd-webgl-canvas] canvas").evaluate((element) => {
      const canvas = element as HTMLCanvasElement;
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      if (!gl) return { colorSpan: 0, litSamples: 0 };
      const pixels = new Uint8Array(canvas.width * canvas.height * 4);
      gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      let minimum = 255;
      let maximum = 0;
      let litSamples = 0;
      for (let index = 0; index < pixels.length; index += 64) {
        const luminance = pixels[index] + pixels[index + 1] + pixels[index + 2];
        minimum = Math.min(minimum, luminance / 3);
        maximum = Math.max(maximum, luminance / 3);
        if (luminance > 24) litSamples += 1;
      }
      return { colorSpan: maximum - minimum, litSamples };
    });
    expect(canvasSignal.colorSpan).toBeGreaterThan(24);
    expect(canvasSignal.litSamples).toBeGreaterThan(500);

    const ambienceToggle = page.locator("[data-cstd-ambience-toggle]");
    await ambienceToggle.click();
    await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-ambience", "on");
    await ambienceToggle.click();
    await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-ambience", "off");
  }

  await expect(page.getByRole("searchbox")).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByText("项目对比", { exact: true })).toHaveCount(0);
  const overdriveToggle = page.locator("[data-cstd-overdrive-toggle]");
  await overdriveToggle.click();
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-overdrive", "true");
  await expect(page.locator("[data-cstd-scene-director]")).toHaveAttribute("data-cstd-director-phase", "hero");
  await overdriveToggle.click();
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-overdrive", "false");
  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD keeps representative work links safe and systems explorable", async ({ page, isMobile }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd#systems", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  const dataSystem = page.locator(
    isMobile
      ? '[data-cstd-system-option="data-systems"]'
      : '[data-cstd-system="data-systems"]',
  );
  await expect(dataSystem).toBeVisible();
  await dataSystem.focus();
  await expect(dataSystem).toHaveAttribute("data-cstd-system-active", "true");
  await expect(page.locator('[data-cstd-system-visual="data-systems"]')).toBeVisible();
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-scene-current", "systems");
  await expect(page.locator("[data-cstd-world-backdrop]")).toHaveAttribute("data-cstd-world-scene", "systems");

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

  const firstBroadcast = page.locator('[data-cstd-proof="rocodex"] [data-cstd-project-broadcast]');
  await firstBroadcast.scrollIntoViewIfNeeded();
  await expect(firstBroadcast.locator("source")).toHaveCount(2);
  await expect(firstBroadcast).toHaveAttribute("data-cstd-broadcast-active", "true");
  await expect.poll(() => firstBroadcast.locator("video").evaluate((element) => {
    const video = element as HTMLVideoElement;
    return !video.paused && video.readyState >= 2;
  })).toBe(true);

  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD serves the original world and dual-format broadcast assets", async ({ request }) => {
  const assets = [
    "/cstd-universe/cstd-neural-gate-v1.webp",
    "/cstd-universe/cstd-skill-reactor-v1.webp",
    "/cstd-universe/cstd-broadcast-nexus-v1.webp",
    "/cstd-universe/cstd-departure-city-v1.webp",
    "/cstd-broadcasts/rocodex-broadcast-v1.webm",
    "/cstd-broadcasts/rocodex-broadcast-v1.mp4",
  ];

  for (const asset of assets) {
    const response = await request.get(asset);
    expect(response.ok()).toBe(true);
    expect((await response.body()).byteLength).toBeGreaterThan(20_000);
  }
});

test("CSTD reaches the footer without a scroll trap or permanent animation load", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  const pageMetrics = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    runningAnimations: document.getAnimations().filter((animation) => {
      const timing = animation.effect?.getTiming();
      return animation.playState === "running" && timing?.iterations === Infinity;
    }).length,
  }));
  expect(pageMetrics.height).toBeLessThan(15_000);
  expect(pageMetrics.runningAnimations).toBeLessThanOrEqual(5);

  const researchPath = page.locator("#path");
  await researchPath.scrollIntoViewIfNeeded();
  await expect(researchPath).toHaveAttribute("data-cstd-path-mode", "interactive-timeline");
  await page.locator('[data-cstd-learning-step="2022"] button').click();
  await expect(researchPath).toHaveAttribute("data-cstd-research-state", "2022");
  await expect(researchPath.getByText("计算与编程基础", { exact: true })).toBeVisible();

  const footer = page.locator("#cstd-footer");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toBeInViewport({ ratio: 0.35 });
  await expect(footer).toHaveAttribute("data-cstd-finale", "true");
  await expect(footer.getByRole("heading", { name: /STILL BUILDING/ })).toBeVisible();
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-scene-current", "finale");
  await expect(page.locator("[data-cstd-world-backdrop]")).toHaveAttribute("data-cstd-world-scene", "finale");
  const bottomFrameDelay = await page.evaluate(() =>
    new Promise<number>((resolve) => {
      const started = performance.now();
      window.requestAnimationFrame(() => resolve(performance.now() - started));
    }),
  );
  expect(bottomFrameDelay).toBeLessThan(100);

  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD console is absent from first paint and opens on demand", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  await expect(page.locator("#cstd-command-drawer")).toHaveCount(0);
  await page.locator("[data-cstd-console-trigger]").click();
  const drawer = page.locator("#cstd-command-drawer");
  await expect(drawer).toBeVisible();
  const input = drawer.getByPlaceholder("输入 help，或按 Tab 补全...");
  await expect(input).toBeVisible();
  await input.fill("whoami");
  await input.press("Enter");
  await expect(drawer.getByText("product engineer / creative systems builder", { exact: false })).toBeVisible();
  await input.fill("breach");
  await input.press("Enter");
  await expect(drawer.getByText("BREACH PROTOCOL ACCEPTED", { exact: true })).toBeVisible();
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-overdrive", "true");
  await page.keyboard.press("Escape");
  await expect(drawer).toHaveCount(0);

  await page.locator("[data-cstd-console-trigger]").click();
  const reopenedDrawer = page.locator("#cstd-command-drawer");
  const reopenedInput = reopenedDrawer.getByPlaceholder("输入 help，或按 Tab 补全...");
  await reopenedInput.fill("scan");
  await reopenedInput.press("Enter");
  await expect(reopenedDrawer.getByText("scan complete", { exact: false })).toBeVisible();
  await reopenedInput.fill("jack alpha");
  await reopenedInput.press("Enter");
  await expect(reopenedDrawer).toHaveCount(0);
  await expect(page.locator("#proof-alpha")).toBeInViewport({ ratio: 0.2 });

  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD calm mode reduces render cost and WebGL recovers to a static fallback", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "WebGL is intentionally omitted on touch/mobile profiles.");

  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  const motionToggle = page.locator("[data-cstd-motion-toggle]");
  const webgl = page.locator("[data-cstd-webgl]");
  await expect(webgl).toHaveAttribute("data-cstd-render-ready", "true");
  await expect(motionToggle).toHaveAttribute("aria-pressed", "true");
  await motionToggle.click();
  await expect(motionToggle).toHaveAttribute("aria-pressed", "false");
  await expect(webgl).toHaveAttribute("data-cstd-render-quality", "lite");

  const canvas = page.locator("[data-cstd-webgl-canvas] canvas");
  await canvas.evaluate((element) => {
    element.dispatchEvent(new Event("webglcontextlost", { cancelable: true }));
  });
  await expect(webgl).toHaveAttribute("data-cstd-render-ready", "fallback");
  await expect(webgl).toHaveAttribute("data-cstd-render-fallback", "true");
  await expect(page.locator("[data-cstd-webgl-canvas]")).toHaveCount(0);

  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});
