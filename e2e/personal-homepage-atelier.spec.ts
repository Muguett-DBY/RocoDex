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

  // 扉页在落地视口内即完成入场（页面自管 data-ed-enter：容器落 is-set，
  // 子元素不经引擎 .sc-in——LCP 不依赖引擎装载）
  await expect(page.locator("[data-cstd-home-editorial] .title-stack[data-ed-enter]")).toHaveClass(/is-set/, { timeout: 10_000 });

  // 跳到作品章：峰值计数与图表抵达。数据版面被 GSAP pin 住，须滚到 pin 段末尾
  // （含 pin-spacer 高度）让计数窗（章 p 0.50–0.74）在 pin 期间走完。
  await page.evaluate(() => document.getElementById("ch-work")?.scrollIntoView());
  await page.evaluate(() => {
    const el = document.querySelector(".data-spread");
    if (el) {
      const box = (el.closest(".pin-spacer") as HTMLElement | null) ?? (el as HTMLElement);
      // 落在 pin 段末端稍靠内：元素仍可见（避免一次性越界导致计数复位）、章 p≈0.97、终值成立
      scrollTo(0, box.getBoundingClientRect().top + scrollY + box.offsetHeight - innerHeight * 1.05, { behavior: "instant" });
    }
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
    // 数据版面已被 GSAP pin 住：滚到 pin 段末尾（含 pin-spacer 高度）确保计数窗口走完
    const el = document.querySelector(".data-spread");
    if (el) {
      const box = (el.closest(".pin-spacer") as HTMLElement | null) ?? (el as HTMLElement);
      // 落在 pin 段末端稍靠内：元素仍可见（避免一次性越界导致计数复位）、章 p≈0.97、终值成立
      scrollTo(0, box.getBoundingClientRect().top + scrollY + box.offsetHeight - innerHeight * 1.05, { behavior: "instant" });
    }
  });
  await expect(page.locator('[data-cstd-home-editorial] [data-sc-count="0 1,470,000"]')).toHaveText("1,470,000", { timeout: 10_000 });
  await expect(page.locator('[data-cstd-home-editorial] [data-sc-count="0 7"]')).toHaveText("7", { timeout: 10_000 });
  await expect(page.locator("[data-cstd-home-editorial] .mnote.is-set")).toHaveCount(4, { timeout: 10_000 });
  // 页面出现第二个 [data-sc-reveal]（数据图版），断言按节点收窄
  await expect(page.locator("[data-cstd-home-editorial] .data-figure[data-sc-reveal]")).toHaveCSS("clip-path", /none|inset\(0px 0(%|px)/);
  // 章题升幕已移交 GSAP：减速下不切分不隐藏，标题直接可见
  await expect(page.locator("[data-cstd-home-editorial] .ch-lab h2")).toBeVisible();
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
  // 引擎为减速保留的 220ms 温和淡入不再被页面 CSS 压成 0s（硬弹出）；
  // folio 进度细线是随滚动运动的位移类设备：减速下直接呈现终态（scaleY(1)）。
  // folio 只在 ≥1200px 渲染，先放宽视口再取样（display:none 下 computed transform 恒 none）
  await expect(page.locator("[data-cstd-home-editorial] .ch-work .ch-head")).toHaveCSS("transition-duration", "0.22s");
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator("[data-cstd-home-editorial] .folio__item u").first()).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  expect(mediaRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test("EDITORIAL ships the LCP and landmark contract", async ({ page, request }) => {
  const issues = captureBrowserIssues(page);
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });

  // LCP：引擎脚本声明式预载（fetch 时点 = 解析期而非水合后）+ 扉页入场页面自管
  // （html:not(.ed-ready) 直出终态，SSR 首绘即 LCP；无 JS 测试另覆盖可见性）
  await expect(page.locator('link[rel="preload"][href="/cstd-scroll/scrollcraft.js"]')).toHaveAttribute("as", "script");

  // 地标：editorial 自有 main（游戏壳 main 被互斥规则移出可访问树）+ skip link 同锚
  await expect(page.locator("[data-cstd-home-editorial] main#top")).toBeVisible();
  const skip = page.locator("[data-cstd-home-editorial] .ed-skip");
  await expect(skip).toHaveAttribute("href", "#top");
  expect(await skip.evaluate((el) => getComputedStyle(el).transform)).not.toBe("none");
  await skip.focus();
  await expect(skip).toHaveCSS("transform", "none");

  // 内链补口：/topics 与 /voxel 不再只靠 sitemap 可达
  await expect(page.locator('[data-cstd-home-editorial] .ed-bar__nav a[href="/topics"]')).toHaveText("主题");
  await expect(page.locator('[data-cstd-home-editorial] .colophon-foot nav a[href="/voxel"]')).toHaveText("作品城");

  // 计数动画中间值不得进入无障碍名称：动画数字 aria-hidden，旁挂 sr-only 终值
  await expect(page.locator('[data-cstd-home-editorial] [data-sc-count="0 7"]')).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator('[data-cstd-home-editorial] [data-sc-count="0 1,470,000"]')).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator("[data-cstd-home-editorial] .work-census .sr-only")).toHaveText("7");
  await expect(page.locator("[data-cstd-home-editorial] .data-copy .sr-only")).toHaveText("1,470,000");

  // 图表分档：srcset 三档 + 衍生资产可达（width/height 兜住布局抖动）
  const chart = page.locator("[data-cstd-home-editorial] .data-figure img");
  await expect(chart).toHaveAttribute("srcset", /-960w\.webp 960w/);
  await expect(chart).toHaveAttribute("srcset", /-1536w\.webp 1536w/);
  await expect(chart).toHaveAttribute("width", "2580");
  for (const href of [
    "/cstd-archive/cstd-archive-melbourne-coefficients-v1-960w.webp",
    "/cstd-archive/cstd-archive-melbourne-coefficients-v1-1536w.webp",
  ]) {
    expect((await request.get(href)).status()).toBe(200);
  }

  expect(issues).toEqual([]);
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

  // 壹章编号『落墨』随滚动填充（第三行窗口 0.38–0.54）：章首未启，滚入 pin 段后增长。
  // 方法列表被 GSAP pin 住（+=105% 视口），章 p 随 pin 段逐屏推进——轮询滚动直到越过窗口。
  const thirdInk = () => page.locator("[data-cstd-home-editorial] .method-list li:nth-child(3) .method-no").evaluate((el) => {
    const m = getComputedStyle(el).clipPath.match(/inset\(\s*([\d.]+)%/);
    return m ? parseFloat(m[1]) : Number.NaN;
  });
  await page.evaluate(() => document.getElementById("ch-method")?.scrollIntoView({ behavior: "instant" }));
  await frame();
  const inkAtChapterHead = await thirdInk();
  expect(Number.isFinite(inkAtChapterHead)).toBe(true);
  await page.evaluate(async () => {
    const el = document.querySelector("#ch-method .method-list");
    const target = el ? (el as HTMLElement).offsetTop + (el as HTMLElement).offsetHeight + innerHeight * 0.8 : scrollY + innerHeight * 1.8;
    for (let y = scrollY; y <= Math.min(target, document.documentElement.scrollHeight); y += innerHeight * 0.35) {
      scrollTo(0, y);
      await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
    }
  });
  await frame();
  const inkAfterScroll = await thirdInk();
  expect(inkAfterScroll).toBeLessThan(inkAtChapterHead);
});

test("EDITORIAL pins the method list and data spread with GSAP scroll choreography", async ({ page }) => {
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/sc-ready/, { timeout: 20_000 });
  // GSAP 异步 chunk 装载后创建 pin：pin-spacer 出现即证明编排已挂
  await page.waitForFunction(() => document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length >= 2, null, { timeout: 20_000 });

  // 章题升幕：扉页 h1 已分字（减速或无 JS 时不切分）
  await expect(page.locator("[data-cstd-home-editorial] .ch-title h1 .ed-word__in").first()).toBeAttached();
  await page.waitForTimeout(1600);
  const h1UnitTy = await page.locator("[data-cstd-home-editorial] .ch-title h1 .ed-word__in").first().evaluate((el) => {
    const t = getComputedStyle(el).transform;
    if (t === "none") return 0;
    const m = t.match(/^matrix\(([^)]+)\)/);
    return m ? parseFloat(m[1].split(",")[5] ?? "0") : Number.NaN;
  });
  // 入场时间线收尾：单元回位（GSAP 收在 identity 矩阵而非 none）
  expect(Number.isFinite(h1UnitTy)).toBe(true);
  expect(Math.abs(h1UnitTy)).toBeLessThan(0.5);

  // pin 行为：数据版面在 pin 段内滚动 0.5 视口，其 rect.top 几乎不动
  await page.evaluate(() => {
    const el = document.querySelector(".data-spread");
    if (el) scrollTo(0, (el as HTMLElement).getBoundingClientRect().top + scrollY + 24);
  });
  await page.waitForTimeout(300);
  const topAtPinStart = await page.locator("[data-cstd-home-editorial] .data-spread").evaluate((el) => el.getBoundingClientRect().top);
  await page.evaluate(() => scrollBy({ top: innerHeight * 0.5, behavior: "instant" }));
  await page.waitForTimeout(300);
  const topMidPin = await page.locator("[data-cstd-home-editorial] .data-spread").evaluate((el) => el.getBoundingClientRect().top);
  expect(Math.abs(topMidPin - topAtPinStart)).toBeLessThan(80);

  // 滚到 pin 段末端稍靠内（元素仍可见），计数到达终值
  await page.evaluate(() => {
    const el = document.querySelector(".data-spread");
    if (el) {
      const box = (el.closest(".pin-spacer") as HTMLElement | null) ?? (el as HTMLElement);
      scrollTo(0, box.getBoundingClientRect().top + scrollY + box.offsetHeight - innerHeight * 1.05, { behavior: "instant" });
    }
  });
  await expect(page.locator('[data-cstd-home-editorial] [data-sc-count="0 1,470,000"]')).toHaveText("1,470,000", { timeout: 10_000 });
  await expectNoHorizontalOverflow(page);
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
