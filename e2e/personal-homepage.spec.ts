import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { captureBrowserIssues, expectNoHorizontalOverflow } from "./support/browser";

test("CSTD presents a clear portfolio before optional visual enhancement", async ({ page, isMobile }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBe(true);

  await expect(page.getByRole("heading", { level: 1, name: "奶黄包" })).toBeVisible();
  await expect(page.getByText("奶黄包的个人技术工作室", { exact: false })).toBeVisible();
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-enhancements-ready", "true");
  await expect(page.locator("[data-cstd-hero-summary] > div")).toHaveCount(3);
  await expect(page.locator("[data-cstd-narrative-switcher]")).toHaveCount(0);

  await expect(page.locator("[data-cstd-scene]")).toHaveCount(6);
  await expect(page.locator("[data-cstd-studio-twin]")).toHaveCount(1);
  await expect(page.locator("[data-cstd-studio-district-option]")).toHaveCount(5);
  await expect(page.locator("[data-cstd-release-replay]")).toHaveCount(0);
  await expect(page.locator("[data-cstd-proof]")).toHaveCount(3);
  await expect(page.locator("[data-cstd-method]")).toHaveCount(0);
  await expect(page.locator("[data-cstd-observatory-check]")).toHaveCount(0);
  await expect(page.locator("[data-cstd-executable-evidence]")).toHaveCount(1);
  await expect(page.locator("[data-cstd-replay-option]")).toHaveCount(0);
  await expect(page.locator('[data-cstd-home-replay="alpha-race"]')).toHaveCount(1);
  await expect(page.locator("[data-cstd-knowledge-lens]")).toHaveCount(1);
  await expect(page.locator("[data-cstd-knowledge-card]")).toHaveCount(3);
  await expect(page.locator("[data-cstd-content-health]")).toHaveAttribute("data-cstd-content-health-score", "100");
  await expect(page.locator("[data-cstd-scene-director]")).toHaveCount(0);
  await expect(page.locator("[data-cstd-global-hud]")).toHaveCount(0);
  await expect(page.getByRole("searchbox")).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("[data-cstd-console-trigger]")).toHaveCount(0);
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-render-policy", "balanced");
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-scene-mode", "image");
  await expect(page.locator("[data-cstd-webgl]")).toHaveCount(0);

  if (isMobile) {
    await expect(page.locator("[data-cstd-overdrive-toggle]")).toBeVisible();
  } else {
    await page.locator("[data-cstd-overdrive-toggle]").click();
    await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-render-policy", "enhanced");
    await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-scene-mode", "webgl");
    const webgl = page.locator("[data-cstd-webgl]");
    await expect(webgl).toHaveAttribute("data-cstd-render-ready", "true", { timeout: 15_000 });
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

test("CSTD runs one deterministic worker example and keeps notes directly readable", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-enhancements-ready", "true");

  const section = page.locator("[data-cstd-executable-evidence]");
  await section.scrollIntoViewIfNeeded();
  const replay = page.locator('[data-cstd-case-replay="alpha-race"]');
  await expect(replay).toHaveAttribute("data-cstd-worker", "dedicated");
  await expect(replay).toHaveAttribute("data-cstd-worker-ready", "true");
  await replay.getByRole("button", { name: "运行重放" }).click();
  await expect(replay.getByText("STALE WRITE REJECTED", { exact: true })).toBeVisible();
  await expect(replay.locator('[data-cstd-replay-step-active="true"]')).toHaveCount(5, { timeout: 6_000 });

  const knowledge = page.locator("[data-cstd-knowledge-lens]");
  await knowledge.scrollIntoViewIfNeeded();
  await expect(knowledge.locator("[data-cstd-knowledge-card]")).toHaveCount(3);
  await expect(knowledge.getByRole("heading", { name: "AI 研究如何避免幻觉？" })).toBeVisible();
  await expect(knowledge.getByRole("button")).toHaveCount(0);

  await expectNoHorizontalOverflow(page);
  const actionableBrowserIssues = browserIssues.filter((issue) => !(
    issue.includes("/cstd-universe/cstd-knowledge-loom-v3.webp")
    && issue.includes("Largest Contentful Paint")
  ));
  expect(actionableBrowserIssues).toEqual([]);
});

test("CSTD embeds the matching executable replay in deep cases", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd/work/rocodex-platform?act=routing-contract", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBe(true);
  const film = page.locator("[data-cstd-case-film]");
  await expect(film).toHaveAttribute("data-cstd-case-film-active-beat", "routing-contract");
  await film.getByRole("button", { name: "下一镜" }).click();
  await expect(page).toHaveURL(/\?act=tests-as-walls$/);
  const replay = page.locator('[data-cstd-case-replay="host-boundaries"]');
  await replay.scrollIntoViewIfNeeded();
  await expect(replay).toHaveAttribute("data-cstd-worker-ready", "true");
  await replay.getByRole("button", { name: "运行重放" }).click();
  await expect(replay.getByText("CROSS-SITE IMPORTS: 0", { exact: true })).toBeVisible();
  const dossier = page.locator('[data-cstd-case-dossier="rocodex-platform"]');
  await dossier.scrollIntoViewIfNeeded();
  await expect(dossier.getByRole("tab")).toHaveCount(3);
  await dossier.getByRole("tab", { name: "关键取舍" }).click();
  await expect(dossier).toHaveAttribute("data-cstd-case-dossier-view", "decisions");
  await expect(dossier.locator('[data-cstd-dossier-panel="decisions"]')).toBeVisible();
  await dossier.getByRole("tab", { name: "故障隔离" }).click();
  await expect(dossier.locator('[data-cstd-dossier-panel="failures"]')).toBeVisible();
  await dossier.getByRole("button", { name: "执行故障注入" }).click();
  await expect(dossier.locator("[data-cstd-failure-drill]")).toHaveAttribute("data-cstd-failure-drill-phase", "outcome", { timeout: 4_000 });
  await expect(dossier.locator('[data-cstd-failure-step="outcome"]')).toHaveAttribute("data-cstd-failure-step-active", "true");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD exposes audience routes, evidence APIs, feeds, and worker assets", async ({ page, request }) => {
  test.setTimeout(120_000);
  const audienceResponse = await page.goto("/cstd/for/research", { waitUntil: "domcontentloaded" });
  expect(audienceResponse?.ok()).toBe(true);
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-narrative-mode", "researcher");

  const endpoints = [
    ["/cstd/proof.json", "application/json"],
    ["/cstd/graph.json", "application/json"],
    ["/cstd/status.json", "application/json"],
    ["/cstd/studio.json", "application/json"],
    ["/cstd/observatory.json", "application/json"],
    ["/cstd/content-health.json", "application/json"],
    ["/cstd/performance.json", "application/json"],
    ["/cstd/experience.json", "application/json"],
    ["/cstd/releases.json", "application/json"],
    ["/cstd/topics.json", "application/json"],
    ["/cstd/feed.json", "application/json"],
    ["/cstd/llms.txt", "text/plain"],
    ["/cstd/manifest.webmanifest", "application/manifest+json"],
    ["/.well-known/security.txt", "text/plain"],
    ["/cstd-case-worker.js", "javascript"],
  ] as const;
  const endpointBodies = new Map<string, Buffer>();
  for (const [url, contentType] of endpoints) {
    const response = await request.get(url);
    const body = await response.body();
    expect(
      response.ok(),
      `${url} returned ${response.status()}: ${body.toString("utf8").slice(0, 240)}`,
    ).toBe(true);
    expect(response.headers()["content-type"]).toContain(contentType);
    expect(body.byteLength).toBeGreaterThan(100);
    endpointBodies.set(url, body);
  }
  const readJson = (url: string) => JSON.parse(endpointBodies.get(url)?.toString("utf8") ?? "null");
  const status = readJson("/cstd/status.json");
  expect(status.release).toBe("CSTD-17.0");
  expect(status.provenance.contract).toBe("cstd.studio-snapshot/v3");
  expect(status.districts).toHaveLength(5);
  const graph = readJson("/cstd/graph.json");
  expect(graph.nodes.length).toBeGreaterThanOrEqual(29);
  const observatory = readJson("/cstd/observatory.json");
  expect(observatory.provenance.contract).toBe("cstd.engineering-observatory/v2");
  expect(observatory.verification).toHaveLength(4);
  const contentHealth = readJson("/cstd/content-health.json");
  expect(contentHealth).toMatchObject({ status: "healthy", score: 100 });
  const performance = readJson("/cstd/performance.json");
  expect(performance).toMatchObject({
    release: "CSTD-17.0",
    budgets: { initialJavascriptBytes: 200_000, startupJavascriptBytes: 800_000 },
    delivery: { defaultRuntimeTier: "image", enhancedRuntimeTrigger: "explicit-user-action" },
    cacheComponents: { status: "evaluated-not-enabled" },
  });
  const experience = readJson("/cstd/experience.json");
  expect(experience.identity.zh).toBe("奶黄包");
  expect(experience.acts).toHaveLength(6);
});

test("CSTD visual contracts keep identity, summary, and quiet reading coherent", async ({ page, isMobile }) => {
  await page.addInitScript(() => {
    window.sessionStorage.setItem("cstd:identity-boot-seen", "true");
    window.localStorage.setItem("cstd-motion-mode", "calm");
  });
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-cstd-world-frame="hero"] img')).toHaveAttribute("src", /cstd-custard-core-v5/);
  const titleLocator = page.getByRole("heading", { level: 1, name: "奶黄包" });
  const summaryLocator = page.locator("[data-cstd-hero-summary]");
  await expect(titleLocator).toBeVisible();
  await expect(summaryLocator).toBeVisible();
  const heroLayout = await page.evaluate(() => {
    const title = document.querySelector("h1");
    const summary = document.querySelector("[data-cstd-hero-summary]");
    if (!(title instanceof HTMLElement) || !(summary instanceof HTMLElement)) return null;
    const titleRect = title.getBoundingClientRect();
    const summaryRect = summary.getBoundingClientRect();
    return {
      summaryHeight: summaryRect.height,
      summaryWidth: summaryRect.width,
      summaryTop: summaryRect.top,
      titleBottom: titleRect.bottom,
    };
  });
  expect(heroLayout).not.toBeNull();
  expect(heroLayout?.summaryHeight).toBeGreaterThan(0);
  expect(heroLayout?.summaryWidth).toBeGreaterThan(0);
  expect(heroLayout?.titleBottom).toBeLessThan(heroLayout?.summaryTop ?? 0);
  const heroCapture = await page.screenshot({ animations: "disabled" });
  expect(heroCapture.byteLength).toBeGreaterThan(isMobile ? 60_000 : 120_000);
  await expectNoHorizontalOverflow(page);

  await page.goto("/cstd/notes/host-boundaries-in-one-next-deployment", { waitUntil: "domcontentloaded" });
  const shell = page.locator("[data-cstd-deep-shell]");
  await expect(shell).toHaveAttribute("data-cstd-controls-ready", "true");
  await page.getByRole("button", { name: /安静阅读/ }).click();
  await expect(shell).toHaveAttribute("data-cstd-reading-mode", "quiet");
  await expect(page.locator("[data-cstd-signal-field]")).toHaveCSS("opacity", "0");
  const proseFontSize = await page.locator(".cstd-mdx-prose > p").first().evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
  expect(proseFontSize).toBeGreaterThanOrEqual(19);
  await expect(page.locator("[data-cstd-note-paths]")).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("CSTD switches and persists four structurally distinct visual worlds", async ({ page }) => {
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  const root = page.locator("[data-cstd-kinetic-world]");
  const switcher = page.locator("[data-cstd-theme-switcher]");

  await expect(root).toHaveAttribute("data-cstd-theme", "neon-district");
  await expect(root).toHaveAttribute("data-cstd-theme-kind", "cyberpunk");
  await switcher.click();
  await expect(page.locator("[data-cstd-theme-menu]")).toBeVisible();
  await expect(page.locator("[data-cstd-theme-option]")).toHaveCount(4);
  const pressOption = page.locator('[data-cstd-theme-option="press-room"]');
  await expect(pressOption).toBeVisible();
  const pressOptionReceivesPointer = await pressOption.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const target = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return Boolean(target?.closest('[data-cstd-theme-option="press-room"]'));
  });
  expect(pressOptionReceivesPointer).toBe(true);
  await pressOption.click();
  await expect(root).toHaveAttribute("data-cstd-theme", "press-room");
  await expect(root).toHaveAttribute("data-cstd-theme-kind", "broadsheet");
  await expect(switcher).toHaveAttribute("data-cstd-theme-active", "press-room");
  await expect(switcher.locator("[data-cstd-theme-label]")).toContainText("工程日报");
  await expect(page.locator('[data-cstd-theme-world-kind="broadsheet"] img')).toHaveAttribute("src", /press-room-v1/);
  await expectNoHorizontalOverflow(page);

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(root).toHaveAttribute("data-cstd-theme", "press-room");
  await page.goto("/cstd/notes/host-boundaries-in-one-next-deployment", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-cstd-deep-shell]")).toHaveAttribute("data-cstd-theme", "press-room");
  await expect(page.locator("[data-cstd-deep-shell]")).toHaveAttribute("data-cstd-theme-kind", "broadsheet");

  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  await page.locator("[data-cstd-theme-switcher]").click();
  await page.locator('[data-cstd-theme-option="ink-protocol"]').click();
  await expect(root).toHaveAttribute("data-cstd-theme", "ink-protocol");
  await expect(root).toHaveAttribute("data-cstd-theme-kind", "ink-scroll");
  await expect(page.locator('[data-cstd-theme-world-kind="ink-scroll"] img')).toHaveAttribute("src", /ink-scroll-v1/);
  await expectNoHorizontalOverflow(page);

  await page.locator("[data-cstd-theme-switcher]").click();
  await page.locator('[data-cstd-theme-option="pixel-quest"]').click();
  await expect(root).toHaveAttribute("data-cstd-theme", "pixel-quest");
  await expect(root).toHaveAttribute("data-cstd-theme-kind", "pixel-game");
  await expect(root).toHaveAttribute("data-cstd-render-policy", "balanced");
  await expect(page.locator("[data-cstd-webgl]")).toHaveCount(0);
  await expect(page.locator('[data-cstd-theme-world-kind="pixel-game"] img')).toHaveAttribute("src", /pixel-quest-v1/);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(root).toHaveAttribute("data-cstd-theme", "pixel-quest");
  await expectNoHorizontalOverflow(page);
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  await expect(page.locator("[data-cstd-finale]")).toBeVisible();
  const bottomGap = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight - window.scrollY);
  expect(bottomGap).toBeLessThanOrEqual(8);
});

test("CSTD header anchors land immediately without a stalled view transition", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "The compact mobile header exposes the primary work shortcut instead of the desktop rail.");
  const transitionErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && message.text().includes("Transition was aborted")) transitionErrors.push(message.text());
  });

  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-enhancements-ready", "true");
  const navigation = page.getByRole("navigation", { name: "首页导航" });
  for (const destination of [
    { id: "systems", label: "能力", selector: "#systems" },
    { id: "proof", label: "作品", selector: "#proof" },
    { id: "operator", label: "证据", selector: "#operator" },
  ]) {
    await navigation.getByRole("link", { name: destination.label, exact: true }).click({ noWaitAfter: true });
    await expect(page.locator("html")).toHaveAttribute("data-cstd-anchor-target", destination.id);
    const responseMs = Number(await page.locator("html").getAttribute("data-cstd-anchor-response-ms"));
    expect(responseMs, `${destination.label} should respond inside the click frame`).toBeLessThan(100);
    await page.evaluate(() => new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
    }));
    const landingOffset = await page.evaluate((selector) => {
      const target = document.querySelector(selector);
      const header = document.querySelector("[data-cstd-home-header]");
      if (!(target instanceof HTMLElement) || !(header instanceof HTMLElement)) return Number.POSITIVE_INFINITY;
      return Math.abs(target.getBoundingClientRect().top - header.getBoundingClientRect().bottom - 8);
    }, destination.selector);
    expect(landingOffset, `${destination.label} should land directly below the floating header`).toBeLessThanOrEqual(24);
  }
  expect(transitionErrors).toEqual([]);
});

test("CSTD reading navigation prewarms the route and responds inside the click frame", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "The compact mobile header exposes the primary work shortcut instead of the desktop rail.");
  const transitionErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && message.text().includes("Transition was aborted")) transitionErrors.push(message.text());
  });

  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-enhancements-ready", "true");
  const navigation = page.getByRole("navigation", { name: "首页导航" });
  const notesLink = navigation.getByRole("link", { name: "札记", exact: true });
  await notesLink.hover();
  await page.waitForTimeout(300);
  const routeStarted = Date.now();
  await notesLink.evaluate((element) => (element as HTMLAnchorElement).click());
  expect(Date.now() - routeStarted).toBeLessThan(500);
  await expect(page.locator("html")).toHaveAttribute("data-cstd-navigation-pending", "reading");
  await expect(page.locator("html")).toHaveAttribute("data-cstd-navigation-target", "/cstd/notes");
  await expect(page).toHaveURL(/\/cstd\/notes$/, { timeout: 30_000 });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 30_000 });
  expect(transitionErrors).toEqual([]);
});

test("CSTD reaches its tailored finale without a scroll trap", async ({ page, isMobile }) => {
  const browserIssues = captureBrowserIssues(page);
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-enhancements-ready", "true");
  const metrics = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    infiniteAnimations: document.getAnimations().filter((animation) => animation.playState === "running" && animation.effect?.getTiming().iterations === Infinity).length,
    fixedElements: [...document.querySelectorAll<HTMLElement>("body *")].filter((element) => getComputedStyle(element).position === "fixed").length,
    backdropFilters: [...document.querySelectorAll<HTMLElement>("body *")].filter((element) => getComputedStyle(element).backdropFilter !== "none").length,
    canvases: document.querySelectorAll("canvas").length,
  }));
  expect(metrics.height).toBeLessThan(isMobile ? 9_500 : 8_000);
  expect(metrics.infiniteAnimations).toBeLessThanOrEqual(2);
  expect(metrics.fixedElements).toBeLessThanOrEqual(6);
  expect(metrics.backdropFilters).toBeLessThanOrEqual(2);
  expect(metrics.canvases).toBe(0);

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
  await expect(webgl).toHaveCount(0);
  await page.locator("[data-cstd-overdrive-toggle]").click();
  await expect(webgl).toHaveAttribute("data-cstd-render-ready", "true", { timeout: 15_000 });
  await motionToggle.click();
  await expect(webgl).toHaveAttribute("data-cstd-render-quality", "lite");
  await page.locator("[data-cstd-webgl-canvas] canvas").evaluate((element) => element.dispatchEvent(new Event("webglcontextlost", { cancelable: true })));
  await expect(webgl).toHaveAttribute("data-cstd-render-ready", "fallback");
  await expect(page.locator("[data-cstd-webgl-canvas]")).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD primary and deep surfaces pass automated WCAG A/AA checks", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const path of ["/cstd", "/cstd/work/rocodex-platform"]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    if (path === "/cstd") {
      await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-enhancements-ready", "true");
      for (const heading of ["#proof-heading", "#executable-evidence-heading"]) {
        await expect(page.locator(heading)).toHaveCSS("opacity", "1");
      }
    }
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations.map((violation) => ({ id: violation.id, targets: violation.nodes.map((node) => node.target) }))).toEqual([]);
  }
});
