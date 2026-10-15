/* 重构后基准截图采集（lab/refactor/after/）——视觉终审 R1 修订版
   覆盖：桌面 zh 7 帧（数据中间态按 .data-spread pin 行程定位，非章 p 公式）
   + 全页图 + 六章完成态（图 01 揭示完成在屏）+ 移动 zh 3 帧 + 桌面 en 3 帧。
   机位：桌面 1440×900 / 移动 390×844。scrub:true 即时映射 + 泵帧，采样确定。 */
import { mkdirSync, statSync, openSync } from "node:fs";
import { chromium } from "@playwright/test";

const BASE = process.env.SHOT_BASE_URL ?? "http://127.0.0.1:3220";
const OUT = "lab/refactor/after/";

const pump = async (page, frames = 8) => {
  await page.evaluate(async (count) => {
    for (let i = 0; i < count; i++) {
      await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
    }
  }, frames);
};
const scrollTo = (page, top) => page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), top);

const chapterP = (page, selector, p) =>
  page.evaluate(({ selector, p }) => {
    const el = document.querySelector(selector);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const y = rect.top + scrollY + p * (rect.height + innerHeight) - innerHeight;
    return Math.max(0, Math.min(y, document.documentElement.scrollHeight));
  }, { selector, p });

/** .data-spread pin 行程定位：progress ∈ [0,1]（0=pin 起步、1=收尾） */
const pinTravel = (page, progress) =>
  page.evaluate((progress) => {
    const spread = document.querySelector(".data-spread");
    if (!spread) return null;
    const box = spread.closest(".pin-spacer") ?? spread;
    const pinStart = box.getBoundingClientRect().top + scrollY - innerHeight * 0.12;
    return Math.max(0, Math.min(pinStart + innerHeight * 0.95 * progress, document.documentElement.scrollHeight));
  }, progress);

async function shoot(page, name, extra = {}) {
  await page.screenshot({ path: OUT + name, ...extra });
  const { size, mtime } = statSync(OUT + name);
  console.log(`${name} ${size}B ${mtime.toISOString()}`);
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  /* ---- 桌面 zh 1440×900 ---- */
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/cstd`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length >= 2, null, { timeout: 20_000 });
  await page.waitForTimeout(1600); // 扉页入场时间线收尾

  await scrollTo(page, 0);
  await pump(page);
  await shoot(page, "01-title-landing.png");

  await scrollTo(page, await chapterP(page, ".ch-title", 0.71)); // 铜线半绘 + 轻视差
  await pump(page);
  await shoot(page, "02-title-rule-mid.png");

  await scrollTo(page, await chapterP(page, "#ch-method", 0.46)); // 第三行编号半落墨（pin 内）
  await pump(page);
  await shoot(page, "03-method-ink-mid.png");

  await scrollTo(page, await pinTravel(page, 0.45)); // 数据时刻：计数 ~735k 在屏 + 图版 ~66% 开度
  await pump(page);
  await shoot(page, "04-data-count-mid.png");

  await scrollTo(page, await chapterP(page, "#ch-notes", 0.34)); // 札记入档漂移中段
  await pump(page);
  await shoot(page, "05-notes-drift-mid.png");

  await page.evaluate(() => document.getElementById("ch-colophon")?.scrollIntoView({ behavior: "instant", block: "center" }));
  await pump(page, 16);
  await shoot(page, "06-colophon.png");

  // 六章完成态：各章读完（章底对齐视口底）；作品章取 pin 行程 98%（图 01 揭示完成在屏）
  const chapterIds = ["ch-title", "ch-method", "ch-work", "ch-notes", "ch-lab", "ch-colophon"];
  for (let i = 0; i < chapterIds.length; i++) {
    const id = chapterIds[i];
    if (id === "ch-work") await scrollTo(page, await pinTravel(page, 0.98));
    else await page.evaluate((cid) => document.getElementById(cid)?.scrollIntoView({ behavior: "instant", block: "end" }), id);
    await pump(page, 12);
    await shoot(page, `ch${i + 1}-end.png`);
  }

  // 全页图（滚回顶部让 pin 处于未激活的自然流位置，避免 stitching 伪影）
  await scrollTo(page, 0);
  await pump(page, 4);
  await shoot(page, "07-fullpage.png", { fullPage: true });
  await page.close();

  /* ---- 移动 zh 390×844 ---- */
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(`${BASE}/cstd`, { waitUntil: "domcontentloaded" });
  await mobile.waitForFunction(() => document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length >= 2, null, { timeout: 20_000 });
  await mobile.waitForTimeout(1600);
  await scrollTo(mobile, 0);
  await pump(mobile);
  await shoot(mobile, "m1-landing.png");
  await scrollTo(mobile, await pinTravel(mobile, 0.45));
  await pump(mobile);
  await shoot(mobile, "m2-data-pinmid.png");
  await mobile.evaluate(() => {
    const h2 = document.querySelector("#ch-method h2");
    if (h2) scrollTo({ top: h2.getBoundingClientRect().top + scrollY - innerHeight * 0.65, behavior: "instant" });
  });
  await pump(mobile, 20);
  await shoot(mobile, "m3-method-h2mid.png");
  await mobile.close();

  /* ---- 桌面 en 1440×900 ---- */
  const en = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await en.goto(`${BASE}/cstd/en`, { waitUntil: "domcontentloaded" });
  await en.waitForFunction(() => document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length >= 2, null, { timeout: 20_000 });
  await en.waitForTimeout(1600);
  await scrollTo(en, 0);
  await pump(en);
  await shoot(en, "en1-landing.png");
  await scrollTo(en, await pinTravel(en, 0.45));
  await pump(en);
  await shoot(en, "en2-data-pinmid.png");
  await en.evaluate(() => {
    const h2 = document.querySelector("#ch-method h2");
    if (h2) scrollTo({ top: h2.getBoundingClientRect().top + scrollY - innerHeight * 0.65, behavior: "instant" });
  });
  await pump(en, 20);
  await shoot(en, "en3-method-h2mid.png");
  await en.close();

  openSync(OUT + ".captured", "w"); // 采集完成标记
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
