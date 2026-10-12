import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { captureBrowserIssues, expectNoHorizontalOverflow } from "./support/browser";

test.describe("EDITORIAL without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("serves the complete formal homepage as a readable document", async ({ page }) => {
    await page.goto("/cstd", { waitUntil: "load" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("奶黄包");
    await expect(page.locator("[data-cstd-home-editorial] .title-role")).toContainText("人工智能 · 博 0");
    await expect(page.locator("[data-cstd-home-editorial] .chapter")).toHaveCount(6);
    await expect(page.locator("[data-cstd-home-editorial] .work")).toHaveCount(3);
    await expect(page.locator("[data-cstd-home-editorial] .note")).toHaveCount(3);
    const summaryOpacity = await page.locator("[data-cstd-home-editorial] .title-stack .ed-summary").evaluate((el) => getComputedStyle(el).opacity);
    expect(summaryOpacity).toBe("1");
    const counterText = await page.locator('[data-cstd-home-editorial] [data-sc-count="0 1,470,000"]').textContent();
    expect(counterText).toContain("1,470,000");
    // 普查行：服务端注册表数字直接呈现（7 个已发布案例）
    await expect(page.locator('[data-cstd-home-editorial] [data-sc-count="0 7"]')).toHaveText("7");
    await expect(page.locator("[data-cstd-home-editorial] .work-census")).toContainText("个已发布案例");
    await expectNoHorizontalOverflow(page);
  });
});

test("EDITORIAL mounts the scroll engine and the whole journey settles", async ({ page }) => {
  const issues = captureBrowserIssues(page);
  await page.addInitScript(() => Object.defineProperty(navigator, "gpu", { value: undefined, configurable: true }));
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/sc-ready/, { timeout: 20_000 });

  // 扉页在落地视口内即完成入场
  await expect(page.locator("[data-cstd-home-editorial] .title-stack .ed-summary")).toHaveClass(/sc-in/, { timeout: 10_000 });

  // 跳到作品章：峰值计数与图表抵达。贰章改为整章 act 后计数窗重键为章 p 0.50–0.74，
  // scrollIntoView(#ch-work) 落位 p≈0.3 还在窗外，须深入数据版面再断言终值。
  await page.evaluate(() => document.getElementById("ch-work")?.scrollIntoView());
  await page.evaluate(() => {
    document.querySelector(".data-spread")?.scrollIntoView({ block: "center" });
    scrollBy(0, innerHeight * 0.6);
  });
  await expect(page.locator('[data-cstd-home-editorial] [data-sc-count="0 1,470,000"]')).toHaveText("1,470,000", { timeout: 10_000 });
  await expect(page.locator('[data-cstd-home-editorial] [data-sc-count="0 7"]')).toHaveText("7", { timeout: 10_000 });
  await expect(page.locator("[data-cstd-home-editorial] .data-figure img")).toBeVisible();

  // 通读全页：每条页边批注落位，尾章为当前章（每步等一帧，避免合成滚动越过观察窗口）
  await page.evaluate(async () => {
    const height = document.documentElement.scrollHeight;
    const frame = () => new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
    for (let y = 0; y <= height; y += 300) {
      window.scrollTo(0, y);
      await frame();
    }
  });
  await expect(page.locator("[data-cstd-home-editorial] .mnote.is-set")).toHaveCount(4, { timeout: 10_000 });
  await expect(page.locator('[data-cstd-home-editorial] .folio__item[data-folio="ch-colophon"].is-active')).toHaveCount(1);
  await expect(page.locator("[data-cstd-home-editorial] .folio")).toHaveClass(/is-dark/);
  await expect(page.locator("[data-cstd-home-editorial] canvas")).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
  expect(issues).toEqual([]);
});

test("EDITORIAL stays instant and complete under reduced motion with zero media fetches", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const mediaRequests: string[] = [];
  page.on("request", (request) => {
    if (/\.(mp4|webm)(\?|$)/.test(request.url())) mediaRequests.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/sc-ready/, { timeout: 20_000 });

  await page.evaluate(() => {
    document.querySelector(".data-spread")?.scrollIntoView({ block: "center" });
    scrollBy(0, innerHeight * 0.6);
  });
  await expect(page.locator('[data-cstd-home-editorial] [data-sc-count="0 1,470,000"]')).toHaveText("1,470,000", { timeout: 10_000 });
  await expect(page.locator('[data-cstd-home-editorial] [data-sc-count="0 7"]')).toHaveText("7", { timeout: 10_000 });
  await expect(page.locator("[data-cstd-home-editorial] .mnote.is-set")).toHaveCount(4, { timeout: 10_000 });
  // 页面出现第二个 [data-sc-reveal]（肆章 h2），断言按节点收窄
  await expect(page.locator("[data-cstd-home-editorial] .data-figure[data-sc-reveal]")).toHaveCSS("clip-path", /none|inset\(0px 0(%|px)/);
  await expect(page.locator("[data-cstd-home-editorial] .ch-lab h2[data-sc-reveal]")).toHaveCSS("clip-path", "none");
  // 页面自管滚动设备的减速冒烟：编号直接全墨、扉页铜线与札记漂移直接呈现
  await expect(page.locator("[data-cstd-home-editorial] .method-no").first()).toHaveCSS("clip-path", "none");
  const reduceSamples = await page.locator("[data-cstd-home-editorial]").evaluate((root) => ({
    titleLine: getComputedStyle(root.querySelector(".title-foot")!, "::after").transform,
    noteDrift: getComputedStyle(root.querySelector(".note [data-ed-drift]")!).transform,
    parallax: getComputedStyle(root.querySelector(".title-lift")!).transform,
  }));
  expect(reduceSamples.titleLine).toBe("none");
  expect(reduceSamples.noteDrift).toBe("none");
  expect(reduceSamples.parallax).toBe("none");
  expect(mediaRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test("EDITORIAL hands the homepage to the game worlds and takes it back", async ({ page }) => {
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/sc-ready/, { timeout: 20_000 });
  await expect(page.locator("[data-cstd-home-editorial]")).toBeVisible();
  await expect(page.locator("[data-cstd-home-shell]")).toBeHidden();

  await page.locator('[data-cstd-theme-switcher] >> visible=true').click();
  await page.locator('[data-cstd-theme-option="neon-district"]').click();
  await expect(page.locator("[data-cstd-home-game]")).toBeVisible();
  await expect(page.locator("[data-cstd-home-editorial]")).toBeHidden();
  await expect(page.locator("html")).not.toHaveClass(/sc-ready/, { timeout: 10_000 });

  await page.locator('[data-cstd-theme-switcher] >> visible=true').click();
  await page.locator('[data-cstd-theme-option="atelier"]').click();
  await expect(page.locator("[data-cstd-home-editorial]")).toBeVisible();
  await expect(page.locator("html")).toHaveClass(/sc-ready/, { timeout: 10_000 });
  await expectNoHorizontalOverflow(page);
});

test("EDITORIAL keeps the English page readable on a narrow phone", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/cstd/en", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/sc-ready/, { timeout: 20_000 });
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Custard");
  await expect(page.locator("[data-cstd-home-editorial] .title-role")).toContainText("PhD Year 0");
  await expect(page.locator("[data-cstd-home-editorial] .ed-bar__cta")).toContainText("Start a collaboration");
  await expect(page.locator("[data-cstd-home-editorial] canvas")).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
  await page.evaluate(() => {
    document.querySelector(".data-spread")?.scrollIntoView({ block: "center" });
    scrollBy(0, innerHeight * 0.6);
  });
  await expect(page.locator('[data-cstd-home-editorial] [data-sc-count="0 1,470,000"]')).toHaveText("1,470,000", { timeout: 10_000 });
  await expectNoHorizontalOverflow(page);
});

test("EDITORIAL scrubs the per-chapter devices from scroll position", async ({ page }) => {
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/sc-ready/, { timeout: 20_000 });
  await expect(page.locator("[data-cstd-home-editorial] .chapter[data-sc-act]")).toHaveCount(6);
  const frame = () => page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0))));

  // 逐章滚动：每个 flow act 都在发布 --sc-p（0..1 的有限数）。
  // 页面 CSS 为 smooth 滚动，单点采样必须用 instant 落位（与引擎 focusin 同一惯例）
  for (const id of ["ch-title", "ch-method", "ch-work", "ch-notes", "ch-lab", "ch-colophon"]) {
    await page.evaluate((chapterId) => document.getElementById(chapterId)?.scrollIntoView({ behavior: "instant" }), id);
    await frame();
    const p = await page.locator(`#${id}`).evaluate((el) => parseFloat(el.style.getPropertyValue("--sc-p")));
    expect(Number.isFinite(p), `${id} should publish --sc-p`).toBe(true);
    expect(p).toBeGreaterThanOrEqual(0);
    expect(p).toBeLessThanOrEqual(1);
  }

  // 扉页铜线随滚动推进：着陆静息为 0，下滚后比例增长
  const titleLineScale = () => page.locator("[data-cstd-home-editorial] .title-foot").evaluate((el) => {
    const transform = getComputedStyle(el, "::after").transform;
    if (transform === "none") return 1;
    const m = transform.match(/^matrix\(([-\d.e+]+),/);
    return m ? Math.abs(parseFloat(m[1])) : NaN;
  });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await frame();
  const lineAtRest = await titleLineScale();
  expect(lineAtRest).toBeLessThanOrEqual(0.02);
  await page.evaluate(() => scrollBy({ top: innerHeight * 0.55, behavior: "instant" }));
  await frame();
  const lineAfterScroll = await titleLineScale();
  expect(lineAfterScroll).toBeGreaterThan(lineAtRest);

  // 壹章编号『落墨』随滚动填充（第三行窗口 0.38–0.54）：章首未启，下滚后增长
  const thirdInk = () => page.locator("[data-cstd-home-editorial] .method-list li:nth-child(3) .method-no").evaluate((el) => {
    const m = getComputedStyle(el).clipPath.match(/inset\(\s*([\d.]+)%/);
    return m ? parseFloat(m[1]) : Number.NaN;
  });
  await page.evaluate(() => document.getElementById("ch-method")?.scrollIntoView({ behavior: "instant" }));
  await frame();
  const inkAtChapterHead = await thirdInk();
  expect(Number.isFinite(inkAtChapterHead)).toBe(true);
  await page.evaluate(() => scrollBy({ top: innerHeight * 0.6, behavior: "instant" }));
  await frame();
  const inkAfterScroll = await thirdInk();
  expect(inkAfterScroll).toBeLessThan(inkAtChapterHead);
});

test("ATELIER keeps its inner pages readable, accessible, and free of decorative renderers", async ({ page }) => {
  const issues = captureBrowserIssues(page);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/cstd/work", "/cstd/about", "/cstd/notes", "/cstd/notes/evidence-first-ai-research", "/cstd/en/about"]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('[data-cstd-deep-shell]')).toHaveAttribute("data-cstd-theme", "atelier");
    await expect(page.locator('[data-cstd-signal-field]')).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations.map((violation) => ({ id: violation.id, targets: violation.nodes.map((node) => node.target) }))).toEqual([]);
  }
  expect(issues).toEqual([]);
});

test("ATELIER case navigation reaches the readable story and preserves the technical demonstration", async ({ page }) => {
  await page.goto("/cstd/work/alpha-research-system", { waitUntil: "domcontentloaded" });
  await expect(page.locator('.cstd-atelier-hero-artwork')).toBeVisible();
  await page.locator('.cstd-case-outline a[href="#pipeline"]').click();
  await expect(page.locator('[data-cstd-case-story] #pipeline')).toBeInViewport();
  await expect(page.locator('[data-cstd-case-story] #pipeline')).toContainText("证据指纹");
  await expect(page.locator('[data-cstd-case-film]')).toBeVisible();
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute("href", "/cstd-atelier/mark-v1.svg");
  await expectNoHorizontalOverflow(page);
});
