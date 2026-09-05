import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { captureBrowserIssues, expectNoHorizontalOverflow } from "./support/browser";

function stripPermittedEnglishAutonyms(value: string) {
  return value.replaceAll("奶黄包", "").replace(/^\s*中\s*$/gmu, "");
}

test("CSTD presents a clear portfolio before optional visual enhancement", async ({ page, isMobile }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBe(true);

  await expect(page.getByRole("heading", { level: 1, name: "奶黄包" })).toBeVisible();
  await expect(page.getByText("我用 R、Python 和 SQL 做可复现的分析", { exact: false })).toBeVisible();
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-enhancements-ready", "true");
  await expect(page.locator("[data-cstd-hero-summary] > div")).toHaveCount(3);
  await expect(page.locator("[data-cstd-narrative-switcher]")).toHaveCount(0);

  await expect(page.locator("[data-cstd-scene]")).toHaveCount(5);
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
  await expect(page.locator("[data-cstd-knowledge-card]")).toHaveCount(4);
  await expect(page.locator("[data-cstd-content-health]")).toHaveAttribute("data-cstd-content-health-score", "100");
  await expect(page.locator("[data-cstd-scene-director]")).toHaveCount(0);
  await expect(page.locator("[data-cstd-global-hud]")).toHaveCount(0);
  await expect(page.getByRole("searchbox")).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("[data-cstd-console-trigger]")).toHaveCount(0);
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-render-policy", "balanced");
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-scene-mode", "image");
  await expect(page.locator("[data-cstd-webgl]")).toHaveCount(0);

  // The GPU opt-in belongs to the neon game world; atelier stays a static editorial view.
  await page.evaluate(() => window.localStorage.setItem("cstd-world-theme", "neon-district"));
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-render-policy", "balanced");

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

test("CSTD keeps the complete experience localized across themes and deep-route switching", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  const [rawChineseResponse, rawEnglishResponse] = await Promise.all([
    page.request.get("/cstd"),
    page.request.get("/cstd/en"),
  ]);
  expect(await rawChineseResponse.text()).toMatch(/<html[^>]*\blang="zh-CN"/i);
  expect(await rawEnglishResponse.text()).toMatch(/<html[^>]*\blang="en-AU"/i);

  await page.goto("/cstd/en?view=compact#proof", { waitUntil: "domcontentloaded" });
  const root = page.locator("[data-cstd-kinetic-world]");
  await expect(page.locator("html")).toHaveAttribute("lang", "en-AU");
  await expect(page.locator("html")).toHaveAttribute("data-cstd-locale", "en");
  await expect(root).toHaveAttribute("data-cstd-locale", "en");
  await expect(page.getByRole("heading", { level: 1, name: "Custard" })).toBeVisible();
  await expect(page.locator("[data-cstd-hero-thesis]")).toContainText("I take problems apart");
  await expect(page.locator("[data-cstd-scene]")).toHaveCount(5);
  await expect(page.locator("[data-cstd-knowledge-list]")).not.toContainText("[object Object]");
  const englishCopy = stripPermittedEnglishAutonyms((await root.innerText()) ?? "");
  expect(englishCopy).not.toMatch(/[\p{Script=Han}]/u);
  await expect(page.locator('link[rel="alternate"][hreflang="zh-CN"]')).toHaveAttribute(
    "href",
    /^https:\/\/custard\.top\/?$/,
  );
  await expect(page.locator('link[rel="alternate"][hreflang="en-AU"]')).toHaveAttribute("href", "https://custard.top/en");

  for (const world of [
    { id: "underworld-forge", thesis: "Difficult systems are forged" },
    { id: "astral-covenant", thesis: "Complex systems are adventures" },
  ]) {
    await page.locator("[data-cstd-theme-switcher]").click();
    await page.locator(`[data-cstd-theme-option="${world.id}"]`).click();
    await expect(root).toHaveAttribute("data-cstd-theme", world.id);
    await expect(page.locator("[data-cstd-hero-thesis]")).toContainText(world.thesis);
  }

  await page.locator("[data-cstd-theme-switcher]").click();
  await page.locator('[data-cstd-theme-option="astral-covenant"]').click();
  await page.goto("/cstd/en/notes/host-boundaries-in-one-next-deployment?view=compact#sources", { waitUntil: "domcontentloaded" });
  const englishShell = page.locator("[data-cstd-deep-shell]");
  await expect(englishShell).toHaveAttribute("data-cstd-locale", "en");
  await expect(englishShell).toHaveAttribute("data-cstd-theme", "astral-covenant");
  await expect(page.locator("html")).toHaveAttribute("lang", "en-AU");
  const englishTitle = (await page.getByRole("heading", { level: 1 }).textContent()) ?? "";
  expect(englishTitle).toContain("Next.js");
  expect(englishTitle).not.toMatch(/[\p{Script=Han}]/u);
  expect(stripPermittedEnglishAutonyms((await englishShell.innerText()) ?? "")).not.toMatch(/[\p{Script=Han}]/u);

  const toChinese = page.locator('[data-cstd-locale-switch][data-cstd-locale-to="zh"]');
  await expect(toChinese).toHaveAccessibleName("Switch to Chinese");
  await expect(toChinese).toHaveAttribute("href", "/notes/host-boundaries-in-one-next-deployment?view=compact#sources");
  await toChinese.click();
  await expect(page).toHaveURL(/\/cstd\/notes\/host-boundaries-in-one-next-deployment\?view=compact#sources$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.locator("[data-cstd-deep-shell]")).toHaveAttribute("data-cstd-locale", "zh");
  await expect(page.locator("[data-cstd-deep-shell]")).toHaveAttribute("data-cstd-theme", "astral-covenant");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("一个 Next.js 部署");

  const toEnglish = page.locator('[data-cstd-locale-switch][data-cstd-locale-to="en"]');
  await expect(toEnglish).toHaveAccessibleName("切换到英文");
  await expect(toEnglish).toHaveAttribute("href", "/en/notes/host-boundaries-in-one-next-deployment?view=compact#sources");
  await toEnglish.click();
  await expect(page).toHaveURL(/\/cstd\/en\/notes\/host-boundaries-in-one-next-deployment\?view=compact#sources$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en-AU");
  await expectNoHorizontalOverflow(page);
  expect(pageErrors).toEqual([]);
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
  await expect(knowledge.locator("[data-cstd-knowledge-card]")).toHaveCount(4);
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
  // On slow CI runners the click can land before the island hydrates; retry until the URL follows.
  await expect(async () => {
    await film.getByRole("button", { name: "下一镜" }).click();
    await expect(page).toHaveURL(/\?act=tests-as-walls$/);
  }).toPass({ timeout: 15_000 });
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
    ["/cstd/en/feed.json", "application/json"],
    ["/cstd/llms.txt", "text/plain"],
    ["/cstd/manifest.webmanifest", "application/manifest+json"],
    ["/cstd/en/manifest.webmanifest", "application/manifest+json"],
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
  expect(experience).toMatchObject({ schemaVersion: 2 });
  expect(experience.acts).toHaveLength(5);
});

test("CSTD visual contracts keep identity, summary, and quiet reading coherent", async ({ page, isMobile }) => {
  await page.addInitScript(() => {
    window.sessionStorage.setItem("cstd:identity-boot-seen", "true");
    window.localStorage.setItem("cstd-motion-mode", "calm");
  });
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-cstd-stage-visual] .cstd-stage-visual-image")).toBeVisible();
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
  expect(heroCapture.byteLength).toBeGreaterThan(isMobile ? 40_000 : 70_000);
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

test("CSTD switches and persists three game worlds with distinct interactions", async ({ page, isMobile }) => {
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.localStorage.setItem("cstd-world-theme", "neon-district"));
  await page.reload({ waitUntil: "domcontentloaded" });
  const root = page.locator("[data-cstd-kinetic-world]");
  const switcher = page.locator("[data-cstd-theme-switcher]");
  const stageImage = page.locator("[data-cstd-stage-visual] .cstd-stage-visual-image");

  await expect(root).toHaveAttribute("data-cstd-theme", "neon-district");
  await expect(root).toHaveAttribute("data-cstd-theme-kind", "cyberpunk");
  await expect(stageImage).toHaveCSS("background-image", /cstd-neon-observatory-v2/);
  await expect(page.locator('[data-cstd-theme-encounter-theme="neon-district"]')).toBeVisible();
  await page.locator('[data-cstd-neon-breach-node="1"]').click();
  await page.locator('[data-cstd-neon-breach-node="2"]').click();
  await page.locator('[data-cstd-neon-breach-node="3"]').click();
  await expect(page.locator('[data-cstd-neon-breach-status="locked"]')).toBeVisible();
  if (!isMobile) await expect(page.locator('[data-cstd-theme-scene-rail="neon-district"]')).toBeVisible();

  await switcher.click();
  await expect(page.locator("[data-cstd-theme-option]")).toHaveCount(4);
  const underworldOption = page.locator('[data-cstd-theme-option="underworld-forge"]');
  await expect(underworldOption).toBeVisible();
  expect(await underworldOption.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const target = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return Boolean(target?.closest('[data-cstd-theme-option="underworld-forge"]'));
  })).toBe(true);
  await underworldOption.click();
  await expect(root).toHaveAttribute("data-cstd-theme", "underworld-forge");
  await expect(root).toHaveAttribute("data-cstd-theme-kind", "mythic-underworld");
  await expect(switcher).toHaveAttribute("data-cstd-theme-active", "underworld-forge");
  await expect(page.locator('[data-cstd-theme-world-image="underworld-forge"]')).toBeVisible();
  await expect(stageImage).toHaveCSS("background-image", /cstd-underworld-forge-v1/);
  await expect(page.locator('[data-cstd-theme-encounter-theme="underworld-forge"]')).toBeVisible();
  await page.locator('[data-cstd-underworld-boon="insight"]').click();
  await expect(page.locator('[data-cstd-boon-selected="insight"]')).toBeVisible();
  await expect(page.locator("[data-cstd-underworld-boon-result]")).toContainText("洞察");
  await expect(page.locator("[data-cstd-overdrive-toggle]")).toHaveCount(0);
  if (!isMobile) await expect(page.locator('[data-cstd-theme-scene-rail="underworld-forge"]')).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(root).toHaveAttribute("data-cstd-theme", "underworld-forge");
  await page.goto("/cstd/notes/host-boundaries-in-one-next-deployment", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-cstd-deep-shell]")).toHaveAttribute("data-cstd-theme", "underworld-forge");

  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  await page.locator("[data-cstd-theme-switcher]").click();
  await page.locator('[data-cstd-theme-option="astral-covenant"]').click();
  await expect(root).toHaveAttribute("data-cstd-theme", "astral-covenant");
  await expect(root).toHaveAttribute("data-cstd-theme-kind", "fantasy-codex");
  await expect(page.locator('[data-cstd-theme-world-image="astral-covenant"]')).toBeVisible();
  await expect(stageImage).toHaveCSS("background-image", /cstd-astral-covenant-v1/);
  await expect(page.locator('[data-cstd-theme-encounter-theme="astral-covenant"]')).toBeVisible();
  await page.locator('[data-cstd-astral-approach="lore"]').click();
  await page.locator("[data-cstd-astral-roll]").click();
  await expect(page.locator("[data-cstd-astral-roll-result]")).toContainText("7 + 4 = 11");
  if (!isMobile) await expect(page.locator('[data-cstd-theme-scene-rail="astral-covenant"]')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("CSTD loads each world's type, material, and deep-page composition as one coherent system", async ({ page, isMobile }) => {
  test.setTimeout(120_000);
  const worlds = [
    {
      id: "neon-district",
      font: { zh: "CSTD Neon Display", en: "CSTD Neon Latin" },
      material: "neon-alloy-v1.webp",
      artifact: "neon",
      copy: { zh: "信号已锁定", en: "SIGNAL LOCKED" },
    },
    {
      id: "underworld-forge",
      font: { zh: "CSTD Underworld Display", en: "CSTD Underworld Display" },
      material: "underworld-basalt-v1.webp",
      artifact: "underworld",
      copy: { zh: "冥府档案 / 工坊 017", en: "UNDERWORLD ARCHIVE / FORGE 017" },
    },
    {
      id: "astral-covenant",
      font: { zh: "CSTD Astral Display", en: "CSTD Astral Display" },
      material: "astral-vellum-v1.webp",
      artifact: "astral",
      copy: { zh: "星界旅记 / 判定 017", en: "ASTRAL JOURNAL / ROLL 017" },
    },
  ] as const;

  for (const world of worlds) {
    await page.goto("/cstd", { waitUntil: "domcontentloaded" });
    await page.evaluate((theme) => window.localStorage.setItem("cstd-world-theme", theme), world.id);
    await page.goto("/cstd/work/rocodex-platform", { waitUntil: "networkidle" });

    const shell = page.locator("[data-cstd-deep-shell]");
    const heroTitle = page.locator("[data-cstd-page-hero-title]");
    const material = page.locator("[data-cstd-page-hero-material]");
    const artifact = page.locator(`[data-cstd-deep-artifact="${world.artifact}"]`);

    await expect(shell).toHaveAttribute("data-cstd-theme", world.id);
    await page.evaluate(() => document.fonts.ready);
    await expect(heroTitle).toHaveCSS("font-family", new RegExp(world.font.zh));
    expect(await material.evaluate((element) => getComputedStyle(element).backgroundImage)).toContain(world.material);
    await expect(artifact).toContainText(world.copy.zh);
    await expect(page.locator("[data-cstd-page-hero-scroll]")).toContainText("向下滚动 / 继续查看");
    if (isMobile) await expect(artifact).toBeHidden();
    else await expect(artifact).toBeVisible();
    for (const otherArtifact of ["neon", "underworld", "astral"].filter((candidate) => candidate !== world.artifact)) {
      await expect(page.locator(`[data-cstd-deep-artifact="${otherArtifact}"]`)).toBeHidden();
    }

    await expect(page.locator('link[data-cstd-theme-font]')).toHaveCount(0);
    await expectNoHorizontalOverflow(page);

    await page.goto("/cstd/en", { waitUntil: "domcontentloaded" });
    const englishRoot = page.locator("[data-cstd-kinetic-world]");
    await expect(englishRoot).toHaveAttribute("data-cstd-locale", "en");
    await expect(englishRoot).toHaveAttribute("data-cstd-theme", world.id);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".cstd-hero-wordmark")).toHaveCSS("font-family", new RegExp(world.font.en));
    await expect(page.locator('link[data-cstd-theme-font]')).toHaveCount(0);
    if (world.id === "neon-district") {
      await expect(page.locator("[data-cstd-hero-thesis]")).toHaveCSS("font-family", /CSTD Neon Latin/);
    }
    if (world.id === "underworld-forge") {
      const labels = await page.locator('[data-cstd-theme-scene-rail="underworld-forge"] [data-cstd-theme-scene-copy="underworld-forge"]').evaluateAll((nodes) => nodes.map((node) => node.textContent));
      expect(labels).toEqual(["GATE", "FORGE", "TRIALS", "ORACLE", "RETURN"]);
    }
    if (world.id === "astral-covenant") {
      const labels = await page.locator('[data-cstd-theme-scene-rail="astral-covenant"] [data-cstd-theme-scene-copy="astral-covenant"]').evaluateAll((nodes) => nodes.map((node) => node.textContent));
      expect(labels).toEqual(["VENTURE", "SPELLBOOK", "ROLL", "CHRONICLE", "LEGACY"]);
    }
    await expectNoHorizontalOverflow(page);

    await page.goto("/cstd/en/work/rocodex-platform", { waitUntil: "domcontentloaded" });
    const englishShell = page.locator("[data-cstd-deep-shell]");
    await expect(englishShell).toHaveAttribute("data-cstd-locale", "en");
    await expect(page.locator("[data-cstd-page-hero-title]")).toHaveCSS("font-family", new RegExp(world.font.en));
    await expect(page.locator(`[data-cstd-deep-artifact="${world.artifact}"]`)).toContainText(world.copy.en);
    await expect(page.locator("[data-cstd-page-hero-scroll]")).toContainText("SCROLL / CONTINUE TRACE");
    await expectNoHorizontalOverflow(page);
  }
});

test("CSTD keeps the theme control reachable on compact mobile screens", async ({ page, isMobile }) => {
  test.skip(!isMobile, "This contract targets compact mobile header geometry.");
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });

  for (const theme of ["underworld-forge", "astral-covenant", "neon-district"] as const) {
    const switcher = page.locator("[data-cstd-theme-switcher]");
    await expect(switcher).toBeVisible();
    const box = await switcher.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(320);
    expect(await switcher.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      return Boolean(hit && (hit === element || element.contains(hit)));
    })).toBe(true);

    await switcher.click();
    const menu = page.locator("[data-cstd-theme-menu]");
    await expect(menu).toBeVisible();
    const menuBox = await menu.boundingBox();
    expect(menuBox).not.toBeNull();
    expect(menuBox!.x).toBeGreaterThanOrEqual(0);
    expect(menuBox!.x + menuBox!.width).toBeLessThanOrEqual(320);
    expect(menuBox!.y).toBeGreaterThanOrEqual(0);
    expect(menuBox!.y + menuBox!.height).toBeLessThanOrEqual(640);
    await page.locator(`[data-cstd-theme-option="${theme}"]`).click();
    await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-theme", theme);
  }

  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight / 2, behavior: "instant" }));
  await expect(page.locator("[data-cstd-theme-switcher]")).toBeInViewport();
  await expectNoHorizontalOverflow(page);
});

test("CSTD theme picker supports roving keyboard focus and restores the trigger", async ({ page }) => {
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  const trigger = page.locator("[data-cstd-theme-switcher]");
  await trigger.focus();
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog", { name: /选择视觉世界|Choose a visual world/ });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("radio", { checked: true })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(page.locator('[data-cstd-theme-option="neon-district"]')).toBeFocused();
  await page.keyboard.press("End");
  await expect(page.locator('[data-cstd-theme-option="astral-covenant"]')).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("CSTD applies a persisted visual world before the React runtime loads", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem("cstd-world-theme", "astral-covenant"));
  await page.route("**/_next/static/chunks/**", (route) => route.request().resourceType() === "script" ? route.abort() : route.continue());
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });

  await expect(page.locator("html")).toHaveAttribute("data-cstd-theme", "astral-covenant");
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-theme", "astral-covenant");
  // The decorative world layer hydrates with React; the pre-paint contract is the theme attributes above.
  await expect(page.locator("[data-cstd-stage-visual] .cstd-stage-visual-image")).toHaveCSS("background-image", /cstd-astral-covenant-v1/);
});

test("CSTD exposes a five-act stage, useful depth routes, and an inspectable evidence chain", async ({ page }) => {
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });

  const actNavigation = page.getByRole("navigation", { name: "五幕主页导航" });
  await expect(actNavigation.getByRole("link")).toHaveCount(5);
  await expect(page.locator("[data-cstd-stage-visual]")).toBeVisible();

  const entryConsole = page.locator("[data-cstd-entry-console]");
  await expect(entryConsole).toBeVisible();
  await expect(entryConsole).toHaveAttribute("data-cstd-entry-ready", "true");
  await expect(entryConsole.getByRole("tab")).toHaveCount(3);
  await entryConsole.getByRole("tab", { name: "10 SEC" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(entryConsole.getByRole("tab", { name: "1 MIN" })).toBeFocused();
  await expect(entryConsole.getByRole("tab", { name: "1 MIN" })).toHaveAttribute("aria-selected", "true");
  await expect(entryConsole.getByRole("tabpanel")).toContainText("看我怎么做系统");

  await page.locator("#proof").scrollIntoViewIfNeeded();
  const evidence = page.locator("[data-cstd-evidence-chain]");
  await expect(evidence).toBeVisible();
  await expect(evidence.locator("[data-cstd-evidence-project-tabs]").getByRole("tab")).toHaveCount(3);
  await evidence.locator("[data-cstd-evidence-project-tabs]").getByRole("tab").nth(1).click();
  await evidence.locator("[data-cstd-evidence-phase-tabs]").getByRole("tab", { name: /取舍/ }).click();
  await expect(evidence.locator("[data-cstd-evidence-phase-tabs]").getByRole("tab", { name: /取舍/ })).toHaveAttribute("aria-selected", "true");
  await expect(evidence.locator("[data-cstd-evidence-phase-panel]")).toBeVisible();
});

test("CSTD follows system motion preference until the visitor chooses an explicit override", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  const root = page.locator("[data-cstd-kinetic-world]");
  await expect(root).toHaveAttribute("data-cstd-motion", "calm");

  await page.getByRole("button", { name: "开启增强动效" }).click();
  await expect(root).toHaveAttribute("data-cstd-motion", "full");
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(root).toHaveAttribute("data-cstd-motion", "full");
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
    { id: "systems", label: "系统", selector: "#systems" },
    { id: "proof", label: "证据", selector: "#proof" },
    { id: "path", label: "知识", selector: "#path" },
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
  await expect(footer.getByRole("heading", { name: /仍在\s*构建/ })).toBeVisible();
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
  await page.evaluate(() => window.localStorage.setItem("cstd-world-theme", "neon-district"));
  await page.reload({ waitUntil: "domcontentloaded" });
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

test("CSTD primary and deep surfaces pass automated WCAG A/AA checks in every visual world", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const theme of ["neon-district", "underworld-forge", "astral-covenant"] as const) {
    await page.goto("/cstd", { waitUntil: "domcontentloaded" });
    await page.evaluate((nextTheme) => window.localStorage.setItem("cstd-world-theme", nextTheme), theme);

    for (const path of ["/cstd", "/cstd/work/rocodex-platform"]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const themedRoot = path === "/cstd" ? page.locator("[data-cstd-kinetic-world]") : page.locator("[data-cstd-deep-shell]");
      await expect(themedRoot).toHaveAttribute("data-cstd-theme", theme);
      if (path === "/cstd") {
        await expect(themedRoot).toHaveAttribute("data-cstd-enhancements-ready", "true");
        for (const heading of ["#proof-heading", "#executable-evidence-heading"]) {
          await expect(page.locator(heading)).toHaveCSS("opacity", "1");
        }
      }
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(results.violations.map((violation) => ({ id: violation.id, targets: violation.nodes.map((node) => node.target) }))).toEqual([]);
    }
  }
});
