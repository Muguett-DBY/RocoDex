import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { captureBrowserIssues, expectNoHorizontalOverflow } from "./support/browser";

test("CSTD 8.0 presents a concise neural industrialism portfolio", async ({ page, isMobile }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBe(true);

  await expect(page.getByRole("heading", { level: 1, name: "CSTD" })).toBeVisible();
  await expect(page.getByText("奶黄包的个人技术工作室", { exact: false })).toBeVisible();
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-enhancements-ready", "true");
  await expect(page.locator("[data-cstd-narrative-switcher]").getByRole("radio")).toHaveCount(3);
  await page.locator("[data-cstd-narrative-switcher]").getByRole("radio", { name: "研究" }).click();
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-narrative-mode", "researcher");
  await expect(page.getByRole("link", { name: "分享当前路径" })).toHaveAttribute("href", "/for/research");

  await expect(page.locator("[data-cstd-scene]")).toHaveCount(6);
  await expect(page.locator("[data-cstd-studio-twin]")).toHaveCount(1);
  await expect(page.locator("[data-cstd-studio-district-option]")).toHaveCount(5);
  await expect(page.locator("[data-cstd-release-replay]")).toHaveCount(1);
  await expect(page.locator("[data-cstd-proof]")).toHaveCount(3);
  await expect(page.locator("[data-cstd-executable-evidence]")).toHaveCount(1);
  await expect(page.locator("[data-cstd-replay-option]")).toHaveCount(4);
  await expect(page.locator("[data-cstd-knowledge-lens]")).toHaveCount(1);
  await expect(page.locator("[data-cstd-scene-director]")).toHaveCount(1);
  await expect(page.getByRole("searchbox")).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("[data-cstd-console-trigger]")).toHaveCount(0);

  if (isMobile) {
    await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-scene-mode", "image");
    await expect(page.locator("[data-cstd-webgl]")).toHaveCount(0);
  } else {
    const webgl = page.locator("[data-cstd-webgl]");
    await expect(webgl).toHaveAttribute("data-cstd-render-ready", "true");
    await expect(page.locator("[data-cstd-webgl-canvas]")).toBeVisible();
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
  }

  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD runs deterministic worker evidence and graph playback", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);
  await page.goto("/cstd#operator", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-enhancements-ready", "true");

  const section = page.locator("[data-cstd-executable-evidence]");
  await section.scrollIntoViewIfNeeded();
  await section.locator('[data-cstd-replay-option="dcf-cache"]').click();
  const replay = page.locator('[data-cstd-case-replay="dcf-cache"]');
  await expect(replay).toHaveAttribute("data-cstd-worker", "dedicated");
  await expect(replay).toHaveAttribute("data-cstd-worker-ready", "true");
  await replay.getByRole("button", { name: "运行重放" }).click();
  await expect(replay.getByText("HOT PATH ISOLATED", { exact: true })).toBeVisible();
  await expect(replay.locator('[data-cstd-replay-step-active="true"]')).toHaveCount(5, { timeout: 6_000 });

  const knowledge = page.locator("[data-cstd-knowledge-lens]");
  await knowledge.scrollIntoViewIfNeeded();
  await knowledge.getByRole("button", { name: "AI 研究如何避免幻觉？" }).click();
  await expect(knowledge.getByText("LOCAL INDEX RESPONSE", { exact: true })).toBeVisible();
  await knowledge.getByRole("button", { name: "播放证据路径" }).click();
  await expect(knowledge.locator('[data-cstd-graph-path-active="true"]')).toHaveCount(3, { timeout: 5_000 });

  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD embeds the matching executable replay in deep cases", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd/work/rocodex-platform", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBe(true);
  const replay = page.locator('[data-cstd-case-replay="host-boundaries"]');
  await replay.scrollIntoViewIfNeeded();
  await expect(replay).toHaveAttribute("data-cstd-worker-ready", "true");
  await replay.getByRole("button", { name: "运行重放" }).click();
  await expect(replay.getByText("CROSS-SITE IMPORTS: 0", { exact: true })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD exposes audience routes, evidence APIs, feeds, and worker assets", async ({ page, request }) => {
  const audienceResponse = await page.goto("/cstd/for/research", { waitUntil: "domcontentloaded" });
  expect(audienceResponse?.ok()).toBe(true);
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-narrative-mode", "researcher");

  const endpoints = [
    ["/cstd/proof.json", "application/json"],
    ["/cstd/graph.json", "application/json"],
    ["/cstd/status.json", "application/json"],
    ["/cstd/studio.json", "application/json"],
    ["/cstd/releases.json", "application/json"],
    ["/cstd/topics.json", "application/json"],
    ["/cstd/feed.json", "application/json"],
    ["/cstd/llms.txt", "text/plain"],
    ["/cstd-case-worker.js", "javascript"],
  ] as const;
  for (const [url, contentType] of endpoints) {
    const response = await request.get(url);
    const body = await response.body();
    expect(
      response.ok(),
      `${url} returned ${response.status()}: ${body.toString("utf8").slice(0, 240)}`,
    ).toBe(true);
    expect(response.headers()["content-type"]).toContain(contentType);
    expect(body.byteLength).toBeGreaterThan(100);
  }
  const status = await (await request.get("/cstd/status.json")).json();
  expect(status.release).toBe("CSTD-8.0");
  expect(status.provenance.contract).toBe("cstd.studio-snapshot/v3");
  expect(status.districts).toHaveLength(5);
  const graph = await (await request.get("/cstd/graph.json")).json();
  expect(graph.nodes.length).toBeGreaterThanOrEqual(29);
});

test("CSTD reaches its tailored finale without a scroll trap", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-enhancements-ready", "true");
  const metrics = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    infiniteAnimations: document.getAnimations().filter((animation) => animation.playState === "running" && animation.effect?.getTiming().iterations === Infinity).length,
  }));
  expect(metrics.height).toBeLessThan(10_500);
  expect(metrics.infiniteAnimations).toBeLessThanOrEqual(5);

  const footer = page.locator("#cstd-footer");
  await expect(footer).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  await expect(footer).toBeInViewport({ ratio: 0.35 });
  await expect(footer.getByRole("heading", { name: /STILL BUILDING/ })).toBeVisible();
  await expect(footer.getByText("当前观看路径", { exact: false })).toBeVisible();
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-scene-current", "finale");
  const frameDelay = await page.evaluate(() => new Promise<number>((resolve) => {
    const started = performance.now();
    window.requestAnimationFrame(() => resolve(performance.now() - started));
  }));
  expect(frameDelay).toBeLessThan(100);
  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD explicit calm mode reduces render cost and survives context loss", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "WebGL is intentionally omitted on touch/mobile profiles.");
  const browserIssues = captureBrowserIssues(page);
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-enhancements-ready", "true");
  const motionToggle = page.locator("[data-cstd-motion-toggle]");
  const webgl = page.locator("[data-cstd-webgl]");
  await expect(webgl).toHaveAttribute("data-cstd-render-ready", "true");
  await motionToggle.click();
  await expect(webgl).toHaveAttribute("data-cstd-render-quality", "lite");
  await page.locator("[data-cstd-webgl-canvas] canvas").evaluate((element) => element.dispatchEvent(new Event("webglcontextlost", { cancelable: true })));
  await expect(webgl).toHaveAttribute("data-cstd-render-ready", "fallback");
  await expect(page.locator("[data-cstd-webgl-canvas]")).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD primary and deep surfaces pass automated WCAG A/AA checks", async ({ page }) => {
  for (const path of ["/cstd", "/cstd/work/rocodex-platform"]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    if (path === "/cstd") await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-enhancements-ready", "true");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations.map((violation) => ({ id: violation.id, targets: violation.nodes.map((node) => node.target) }))).toEqual([]);
  }
});
