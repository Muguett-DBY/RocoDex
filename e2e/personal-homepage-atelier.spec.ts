import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { captureBrowserIssues, expectNoHorizontalOverflow } from "./support/browser";

/* 默认正式主页（EDITORIAL）——单一 GSAP 动效体系用例。
   滚动测试教训（沿用并内建）：
   · window.scrollTo/scrollBy 一律 options 对象形式；
   · 计数终值用步进扫窗（0.3vh 步长 + rAF 泵帧），禁一次性越界跳滚（复位风险）；
   · folio transform 断言需 ≥1200px 视口（display:none 下 computed transform 恒 none）；
   · 章 flow 时间线为 scrub:true（即时），可精确采样；章题升幕/版权页收束为
     scrub:0.6（平滑追赶），中值断言前必须泵帧驱动 GSAP ticker；
   · 无头环境截图与断言分页载（resize 影响 scrub 快照）。
   动效用例显式声明 no-preference（配置在 CI 全局 reduce，会整体禁用编排）。 */

const BIG_COUNT = '[data-cstd-home-editorial] [data-ed-count="0 1,470,000"]';
const CENSUS_COUNT = '[data-cstd-home-editorial] [data-ed-count="0 7"]';

/** 泵帧：驱动无头环境里的 GSAP ticker（scrub 0.6 的平滑追赶需要连续帧） */
async function pump(page: import("@playwright/test").Page, frames = 6) {
  await page.evaluate(async (count) => {
    for (let i = 0; i < count; i++) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
    }
  }, frames);
}

/** 步进扫过 .data-spread pin 段（含 pin-spacer 行程）：每步 0.3vh + 泵帧 */
async function scanPastDataSpread(page: import("@playwright/test").Page, lead = 0.5, tail = 1.6) {
  await page.evaluate(async ({ lead, tail }) => {
    const el = document.querySelector(".data-spread");
    if (el) {
      const box = (el.closest(".pin-spacer") as HTMLElement | null) ?? (el as HTMLElement);
      const start = box.getBoundingClientRect().top + scrollY - innerHeight * lead;
      const end = start + box.offsetHeight + innerHeight * tail;
      const max = document.documentElement.scrollHeight;
      for (let y = Math.max(0, start); y <= Math.min(end, max); y += innerHeight * 0.3) {
        scrollTo({ top: y, behavior: "instant" });
        await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
      }
    }
  }, { lead, tail });
}

/** 通读全页（300px 步进），让全部一次性入场/状态轨触发 */
async function readThrough(page: import("@playwright/test").Page) {
  await page.evaluate(async () => {
    const height = document.documentElement.scrollHeight;
    for (let y = 0; y <= height; y += 300) {
      scrollTo({ top: y, behavior: "instant" });
      await new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
    }
  });
}

/** 解析 computed transform 的 matrix 首列/ty（scaleX 与 yPercent 采样） */
async function matrixOf(page: import("@playwright/test").Page, selector: string) {
  return page.locator(selector).evaluate((el) => {
    const transform = getComputedStyle(el).transform;
    if (transform === "none" || !transform.startsWith("matrix")) return null;
    const m = transform.match(/^matrix\(([^)]+)\)/);
    return m ? m[1].split(",").map((token) => parseFloat(token)) : null;
  });
}

test.describe("EDITORIAL without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("serves the complete formal homepage as a readable document", async ({ page }) => {
    const staticRequests: string[] = [];
    page.on("request", (request) => {
      if (/\/cstd-scroll\/.*\.js(\?|$)/.test(request.url())) staticRequests.push(request.url());
    });
    await page.goto("/cstd", { waitUntil: "load" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("奶黄包");
    await expect(page.locator("[data-cstd-home-editorial] .title-role")).toContainText("人工智能 · 博 0");
    await expect(page.locator("[data-cstd-home-editorial] .chapter")).toHaveCount(6);
    await expect(page.locator("[data-cstd-home-editorial] .work")).toHaveCount(3);
    await expect(page.locator("[data-cstd-home-editorial] .note")).toHaveCount(3);
    // 初始 DOM 即终态：计数 SSR 文本就是终值，LCP 摘要满不透明
    await expect(page.locator(BIG_COUNT)).toHaveText("1,470,000");
    await expect(page.locator(CENSUS_COUNT)).toHaveText("7");
    const summaryOpacity = await page.locator("[data-cstd-home-editorial] .title-stack .ed-summary").evaluate((el) => getComputedStyle(el).opacity);
    expect(summaryOpacity).toBe("1");
    // noscript 只收走 folio（页码轨失去滚动跟踪后是死重），正文批注全数可见
    await expect(page.locator("[data-cstd-home-editorial] .folio")).toHaveCSS("display", "none");
    await expect(page.locator("[data-cstd-home-editorial] .mnote")).toHaveCount(4);
    await expectNoHorizontalOverflow(page);
    expect(staticRequests).toEqual([]);
  });
});

test.describe("EDITORIAL motion", () => {
  test.use({ contextOptions: { reducedMotion: "no-preference" } });

  test("mounts the GSAP choreography and settles the whole journey", async ({ page }) => {
    const issues = captureBrowserIssues(page);
    await page.addInitScript(() => Object.defineProperty(navigator, "gpu", { value: undefined, configurable: true }));
    await page.goto("/cstd", { waitUntil: "domcontentloaded" });
    // GSAP 异步 chunk 装载后创建 pin：pin-spacer ×2 即编排已挂
    await page.waitForFunction(() => document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length >= 2, null, { timeout: 20_000 });

    // 扉页 h1 已分字（CJK 逐字掩码），入场时间线收尾后单元回位
    await expect(page.locator("[data-cstd-home-editorial] .ch-title h1 .ed-word__in").first()).toBeAttached();
    await page.waitForTimeout(1600);
    const h1UnitTy = await page.locator("[data-cstd-home-editorial] .ch-title h1 .ed-word__in").first().evaluate((el) => {
      const transform = getComputedStyle(el).transform;
      if (transform === "none") return 0;
      const m = transform.match(/^matrix\(([^)]+)\)/);
      return m ? parseFloat(m[1].split(",")[5] ?? "0") : Number.NaN;
    });
    expect(Number.isFinite(h1UnitTy)).toBe(true);
    expect(Math.abs(h1UnitTy)).toBeLessThan(0.5);

    // 通读全页：每条页边批注落位（from 终态 inline opacity=1），尾章为当前章且 folio 翻墨
    await readThrough(page);
    await expect
      .poll(() =>
        page.locator("[data-cstd-home-editorial] .mnote").evaluateAll((nodes) =>
          nodes.length === 4 && nodes.every((node) => getComputedStyle(node).opacity === "1"),
        ),
      )
      .toBe(true);
    await expect(page.locator('[data-cstd-home-editorial] .folio__item[data-folio="ch-colophon"].is-active')).toHaveCount(1);
    await expect(page.locator("[data-cstd-home-editorial] .folio")).toHaveClass(/is-dark/);
    await expect(page.locator("[data-cstd-home-editorial] canvas")).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
    expect(issues).toEqual([]);
  });

  test("keeps the folio rail on paper at cold load and flips dark only on the ink plate", async ({ page }) => {
    // 冷载回归：布局未定型时版权页触发器首帧 onRefresh 曾误翻 .folio.is-dark
    // （纸白章码压纸面 1.0:1）。开墨窗已对齐 folio 实底 + 组件侧按实底有界
    // 复核，着陆态必须不暗；底端照旧翻墨（墨牌全盒覆盖 folio 时才成立）。
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/cstd", { waitUntil: "load" });
    await page.waitForFunction(() => document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length >= 2, null, { timeout: 20_000 });
    await page.waitForTimeout(3000); // 让历史误判窗口（若有）充分暴露
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await pump(page, 4);
    const darkAtColdLoad = await page.locator("[data-cstd-home-editorial] .folio").evaluate((el) => el.classList.contains("is-dark"));
    expect(darkAtColdLoad).toBe(false);

    await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await pump(page, 4);
    await expect(page.locator("[data-cstd-home-editorial] .folio")).toHaveClass(/is-dark/);
  });

  test("pins the data spread, scrubs both counters, and reveals the figure inside the pin travel", async ({ page }) => {
    await page.goto("/cstd", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length >= 2, null, { timeout: 20_000 });

    // pin 行为：数据版面在 pin 段内滚动 0.5 视口，其 rect.top 几乎不动
    await page.evaluate(() => {
      const el = document.querySelector(".data-spread");
      if (el) scrollTo({ top: (el as HTMLElement).getBoundingClientRect().top + scrollY + 24, behavior: "instant" });
    });
    await page.waitForTimeout(300);
    const topAtPinStart = await page.locator("[data-cstd-home-editorial] .data-spread").evaluate((el) => el.getBoundingClientRect().top);
    await page.evaluate(() => scrollBy({ top: innerHeight * 0.5, behavior: "instant" }));
    await page.waitForTimeout(300);
    const topMidPin = await page.locator("[data-cstd-home-editorial] .data-spread").evaluate((el) => el.getBoundingClientRect().top);
    expect(Math.abs(topMidPin - topAtPinStart)).toBeLessThan(80);

    // 步进扫过 pin 段：计数抵达终值，图版揭开
    await scanPastDataSpread(page, 0.4, 1.2);
    await expect(page.locator(BIG_COUNT)).toHaveText("1,470,000", { timeout: 10_000 });
    await expect(page.locator(CENSUS_COUNT)).toHaveText("7", { timeout: 10_000 });
    await expect(page.locator("[data-cstd-home-editorial] .data-figure")).toHaveCSS("clip-path", "inset(0px 0% 0px 0px)");
    await expect(page.locator("[data-cstd-home-editorial] .data-figure img")).toBeVisible();

    // 中段采样（结构保证可见）：计数/揭示挂 .data-spread 的 pin 行程（0=pin 起步、
    // 1=收尾，scrub:true 即时映射）。定位到行程 45%（计数窗 [0.1,0.8] 中点）——
    // 此时计数元素必须与视口相交、数值为中间值，图版部分揭开且在屏。
    const pinStartY = await page.evaluate(() => {
      const spread = document.querySelector(".data-spread");
      if (!spread) return null;
      const box = (spread.closest(".pin-spacer") as HTMLElement | null) ?? (spread as HTMLElement);
      return box.getBoundingClientRect().top + scrollY - innerHeight * 0.12;
    });
    expect(pinStartY).not.toBeNull();
    const pinStart = pinStartY as number;
    await page.evaluate((y) => scrollTo({ top: y + innerHeight * 0.95 * 0.45, behavior: "instant" }), pinStart);
    await pump(page, 4);
    const mid = await page.evaluate(() => {
      const counter = document.querySelector('[data-ed-count="0 1,470,000"]');
      const figure = document.querySelector(".data-figure");
      if (!counter || !figure) return null;
      const cr = counter.getBoundingClientRect();
      const fr = figure.getBoundingClientRect();
      const clip = getComputedStyle(figure).clipPath;
      const m = clip.match(/inset\(\s*([\d.]+)(?:px|%)?\s+([\d.]+)%/);
      return {
        text: counter.textContent,
        countIntersectsViewport: cr.top < innerHeight && cr.bottom > 0 && cr.height > 0,
        figIntersectsViewport: fr.top < innerHeight && fr.bottom > 0 && fr.height > 0,
        clipRightPercent: m ? parseFloat(m[2]) : null,
      };
    });
    expect(mid).not.toBeNull();
    expect(mid!.countIntersectsViewport, "counter must be on screen mid-pin").toBe(true);
    expect(mid!.figIntersectsViewport, "figure must be on screen mid-pin").toBe(true);
    expect(mid!.clipRightPercent).not.toBeNull();
    expect(mid!.clipRightPercent!).toBeGreaterThan(5);
    expect(mid!.clipRightPercent!).toBeLessThan(95);
    const midValue = Number((mid!.text ?? "").replace(/,/g, ""));
    expect(Number.isFinite(midValue), `counter mid sample should be numeric: ${mid!.text}`).toBe(true);
    expect(midValue).toBeGreaterThan(100_000);
    expect(midValue).toBeLessThan(1_400_000);

    // 扫到章尾回到终值（可逆复扫不夹中间值）
    await scanPastDataSpread(page, 0.2, 1.6);
    await expect(page.locator(BIG_COUNT)).toHaveText("1,470,000");
    await expectNoHorizontalOverflow(page);
  });

  test("scrubs the per-chapter devices reversibly and tracks the folio rail", async ({ page }) => {
    await page.goto("/cstd", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length >= 2, null, { timeout: 20_000 });
    // folio transform 断言需 ≥1200px 视口（desktop-chromium 默认 1280×720 已满足）

    const titleRule = "[data-cstd-home-editorial] .title-foot .ed-rule";
    const titleScaleX = async () => {
      const m = await matrixOf(page, titleRule);
      return m ? Math.abs(m[0]) : 1;
    };

    // 扉页铜线：着陆静息（章 p=0.5，窗 [0.50,0.92] 起点恰为 0），下滚增长，回滚归零
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await pump(page, 2);
    const lineAtRest = await titleScaleX();
    expect(lineAtRest).toBeLessThanOrEqual(0.02);
    await page.evaluate(() => scrollBy({ top: innerHeight * 0.55, behavior: "instant" }));
    await pump(page, 2);
    const lineAfterScroll = await titleScaleX();
    expect(lineAfterScroll).toBeGreaterThan(lineAtRest);
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await pump(page, 2);
    expect(await titleScaleX()).toBeLessThanOrEqual(0.02);

    // 壹章编号『落墨』（第三行窗 0.38–0.54）：章首未启，滚过 pin 段后填满
    const thirdInk = () =>
      page.locator("[data-cstd-home-editorial] .method-list li:nth-child(3) .method-no").evaluate((el) => {
        const clip = getComputedStyle(el).clipPath;
        if (clip === "none") return 0;
        const m = clip.match(/inset\(\s*([\d.]+)%/);
        return m ? parseFloat(m[1]) : Number.NaN;
      });
    await page.evaluate(() => document.getElementById("ch-method")?.scrollIntoView({ behavior: "instant", block: "start" }));
    await pump(page, 2);
    const inkAtChapterHead = await thirdInk();
    expect(inkAtChapterHead).toBeGreaterThan(90);
    // 滚过 pin 段直到章底（章 flow p→1，第三行窗 0.38–0.54 走完）。
    // methodList.offsetTop 相对 pin-spacer，目标一律按章的文档几何计算。
    await page.evaluate(async () => {
      const chapter = document.getElementById("ch-method");
      if (!chapter) return;
      const target = Math.min(chapter.getBoundingClientRect().top + scrollY + chapter.offsetHeight, document.documentElement.scrollHeight);
      for (let y = scrollY; y <= target; y += innerHeight * 0.35) {
        scrollTo({ top: y, behavior: "instant" });
        await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
      }
    });
    await pump(page, 2);
    const inkAfterScroll = await thirdInk();
    expect(inkAfterScroll).toBeLessThan(10);

    // 叁章札记行『入档』漂移：首行窗 [0.10,0.26] 中点 p≈0.18 处半落位（x≈5px），
    // 滚过章身后归零。札记章矮（无 pin），章顶到视口顶时 p≈0.38 已越过首行窗——
    // 采样一律按章 flow 口径反解滚动位，不按章顶对齐。
    const driftX = () =>
      page.locator("[data-cstd-home-editorial] .note-list .note:first-child [data-ed-drift]").evaluate((el) => {
        const transform = getComputedStyle(el).transform;
        if (transform === "none") return 0;
        const m = transform.match(/^matrix\(([^)]+)\)/);
        return m ? parseFloat(m[1].split(",")[4] ?? "0") : Number.NaN;
      });
    await page.evaluate(() => {
      const chapter = document.getElementById("ch-notes");
      if (!chapter) return;
      const rect = chapter.getBoundingClientRect();
      const p = 0.18;
      const y = rect.top + scrollY + p * (rect.height + innerHeight) - innerHeight;
      scrollTo({ top: Math.max(0, Math.min(y, document.documentElement.scrollHeight)), behavior: "instant" });
    });
    await pump(page, 2);
    const driftAtWindowMid = await driftX();
    expect(driftAtWindowMid).toBeGreaterThan(1);
    expect(driftAtWindowMid).toBeLessThan(9);
    await page.evaluate(async () => {
      const chapter = document.getElementById("ch-notes");
      if (!chapter) return;
      const target = Math.min(chapter.getBoundingClientRect().top + scrollY + chapter.offsetHeight, document.documentElement.scrollHeight);
      for (let y = scrollY; y <= target; y += innerHeight * 0.35) {
        scrollTo({ top: y, behavior: "instant" });
        await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
      }
    });
    await pump(page, 2);
    expect(Math.abs(await driftX())).toBeLessThan(1);

    // 章题升幕可逆（scrub 0.6，泵帧驱动追赶）：h2 滚入中段时至少一枚单元未回位，
    // 滚过窗口后全数回位，回滚再次升起
    const h2Units = page.locator("[data-cstd-home-editorial] .ch-notes h2 .ed-word__in");
    await expect(h2Units.first()).toBeAttached();
    const risenCount = () =>
      h2Units.evaluateAll((nodes) =>
        nodes.filter((node) => {
          const transform = getComputedStyle(node).transform;
          if (transform === "none") return false;
          const m = transform.match(/^matrix\(([^)]+)\)/);
          return m ? parseFloat(m[1].split(",")[5] ?? "0") > 0.5 : false;
        }).length,
      );
    await page.evaluate(() => {
      const h2 = document.querySelector("#ch-notes h2");
      if (h2) scrollTo({ top: h2.getBoundingClientRect().top + scrollY - innerHeight * 0.65, behavior: "instant" });
    });
    await pump(page, 30);
    expect(await risenCount()).toBeGreaterThan(0);
    await page.evaluate(() => {
      const chapter = document.getElementById("ch-notes");
      if (chapter) scrollTo({ top: (chapter as HTMLElement).offsetTop + chapter.offsetHeight + innerHeight, behavior: "instant" });
    });
    await pump(page, 30);
    expect(await risenCount()).toBe(0);
    await page.evaluate(() => {
      const h2 = document.querySelector("#ch-notes h2");
      if (h2) scrollTo({ top: h2.getBoundingClientRect().top + scrollY - innerHeight * 0.65, behavior: "instant" });
    });
    await pump(page, 30);
    expect(await risenCount()).toBeGreaterThan(0);

    // folio 页码轨：章推进时 u 细线增长，当前章高亮。folio 仅 ≥1200px 视口渲染
    // （display:none 下 computed transform 恒 none），先放宽视口再取样
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.evaluate(() => document.getElementById("ch-work")?.scrollIntoView({ behavior: "instant", block: "center" }));
    await pump(page, 4);
    const uScaleY = await matrixOf(page, '[data-cstd-home-editorial] .folio__item[data-folio="ch-work"] u');
    expect(uScaleY, "folio progress hairline should be partially drawn mid-chapter").not.toBeNull();
    expect(uScaleY![3]).toBeGreaterThan(0.15);
    await expect(page.locator('[data-cstd-home-editorial] .folio__item[data-folio="ch-work"].is-active')).toHaveCount(1);

    // 末章金线随滚动绘制
    await page.evaluate(() => document.getElementById("ch-colophon")?.scrollIntoView({ behavior: "instant", block: "center" }));
    await pump(page, 2);
    const goldScaleX = await matrixOf(page, "[data-cstd-home-editorial] .colophon-foot .ed-rule");
    expect(goldScaleX).not.toBeNull();
    expect(Math.abs(goldScaleX![0])).toBeGreaterThan(0.05);
    await expectNoHorizontalOverflow(page);
  });

  test("stays instant and complete under reduced motion with zero media fetches", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const mediaRequests: string[] = [];
    page.on("request", (request) => {
      if (/\.(mp4|webm)(\?|$)/.test(request.url())) mediaRequests.push(request.url());
    });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/cstd", { waitUntil: "domcontentloaded" });

    // 整组零注册：无 pin、无分字；计数文本恒为 SSR 终值（扫窗后仍不变）
    await expect(page.locator("[data-cstd-home-editorial] .pin-spacer")).toHaveCount(0);
    await expect(page.locator("[data-cstd-home-editorial] .ed-word")).toHaveCount(0);
    await scanPastDataSpread(page);
    await expect(page.locator(BIG_COUNT)).toHaveText("1,470,000");
    await expect(page.locator(CENSUS_COUNT)).toHaveText("7");
    await expect(page.locator("[data-cstd-home-editorial] .data-figure")).toHaveCSS("clip-path", "none");
    await expect(page.locator("[data-cstd-home-editorial] .mnote")).toHaveCount(4);

    // 位移类设备直接呈现：无内联 transform/clip 写入
    const reduceSamples = await page.locator("[data-cstd-home-editorial]").evaluate((root) => ({
      titleLine: getComputedStyle(root.querySelector(".title-foot .ed-rule")!).transform,
      noteDrift: getComputedStyle(root.querySelector(".note [data-ed-drift]")!).transform,
      parallax: getComputedStyle(root.querySelector(".title-lift")!).transform,
      methodNo: getComputedStyle(root.querySelector(".method-no")!).clipPath,
    }));
    expect(reduceSamples.titleLine).toBe("none");
    expect(reduceSamples.noteDrift).toBe("none");
    expect(reduceSamples.parallax).toBe("none");
    expect(reduceSamples.methodNo).toBe("none");
    await expect(page.locator("[data-cstd-home-editorial] .ch-lab h2")).toBeVisible();

    // folio 进度细线减速下直接呈现终态（scaleY(1)）；folio 只在 ≥1200px 渲染，
    // 先放宽视口再取样（display:none 下 computed transform 恒 none）
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator("[data-cstd-home-editorial] .folio__item u").first()).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
    expect(mediaRequests).toEqual([]);
    expect(errors).toEqual([]);
  });

  test("ships the LCP and landmark contract", async ({ page, request }) => {
    const issues = captureBrowserIssues(page);
    const scrollJsRequests: string[] = [];
    page.on("request", (request2) => {
      if (/\/cstd-scroll\/.*\.js(\?|$)/.test(request2.url())) scrollJsRequests.push(request2.url());
    });
    await page.goto("/cstd", { waitUntil: "domcontentloaded" });

    // 引擎已退役：无 scrollcraft 引用（链接/请求双验）；样式表引用必须带新版本参数
    // （/cstd-scroll/* immutable 无哈希，忘升版本 = 老访客永不回源）
    await expect(page.locator('link[rel="preload"][href*="scrollcraft"]')).toHaveCount(0);
    await expect(page.locator('link[rel="stylesheet"][href*="scrollcraft"]')).toHaveCount(0);
    await expect(page.locator('link[rel="stylesheet"][href="/cstd-scroll/cstd-editorial.css?v=7"]')).toHaveCount(1);
    await page.waitForTimeout(400);
    expect(scrollJsRequests).toEqual([]);

    // 首屏衬线字体声明式预载保留（LCP 时点提前；全局壳亦预载同一字体，取首枚）
    await expect(page.locator('link[rel="preload"][href="/fonts/cstd/press-serif-v1.woff2"]').first()).toHaveAttribute("as", "font");

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
    await expect(page.locator(CENSUS_COUNT)).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator(BIG_COUNT)).toHaveAttribute("aria-hidden", "true");
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

  test("hands the homepage to the game worlds and takes it back", async ({ page }) => {
    await page.goto("/cstd", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length >= 2, null, { timeout: 20_000 });
    await expect(page.locator("[data-cstd-home-editorial]")).toBeVisible();
    await expect(page.locator("[data-cstd-home-shell]")).toBeHidden();

    await page.locator('[data-cstd-theme-switcher] >> visible=true').click();
    await page.locator('[data-cstd-theme-option="neon-district"]').click();
    await expect(page.locator("[data-cstd-home-game]")).toBeVisible();
    await expect(page.locator("[data-cstd-home-editorial]")).toBeHidden();
    // 固定件随主题卸载：folio/skip 不占 fixed 预算、不留可访问树残影
    await expect(page.locator("[data-cstd-home-editorial] .folio")).toHaveCount(0);
    await expect(page.locator("[data-cstd-home-editorial] .ed-skip")).toHaveCount(0);

    await page.locator('[data-cstd-theme-switcher] >> visible=true').click();
    await page.locator('[data-cstd-theme-option="atelier"]').click();
    await expect(page.locator("[data-cstd-home-editorial]")).toBeVisible();
    await expect(page.locator("[data-cstd-home-editorial] .folio")).toHaveCount(1);
    // 触发器恢复实证：pin 重建 + 步进扫窗后计数仍达终值
    await page.waitForFunction(() => document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length >= 2, null, { timeout: 20_000 });
    await scanPastDataSpread(page);
    await expect(page.locator(BIG_COUNT)).toHaveText("1,470,000", { timeout: 10_000 });
    await expectNoHorizontalOverflow(page);
  });

  test("keeps the English page readable on a narrow phone", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto("/cstd/en", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length >= 2, null, { timeout: 20_000 });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Custard");
    await expect(page.locator("[data-cstd-home-editorial] .title-role")).toContainText("PhD Year 0");
    await expect(page.locator("[data-cstd-home-editorial] .ed-bar__cta")).toContainText("Write me an email");
    await expect(page.locator("[data-cstd-home-editorial] canvas")).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
    await page.evaluate(() => {
      document.querySelector(".data-spread")?.scrollIntoView({ block: "center", behavior: "instant" });
    });
    await scanPastDataSpread(page, 0.6, 1.4);
    await expect(page.locator(BIG_COUNT)).toHaveText("1,470,000", { timeout: 10_000 });
    await expectNoHorizontalOverflow(page);
  });
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
