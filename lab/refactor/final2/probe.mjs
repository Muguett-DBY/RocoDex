/* 视觉终审员-2 独立核验：在采集脚本声称的同一位置复拍 + DOM 状态 dump。
   目的：裁决 after/02–05 中间态截图所述状态是否为真（视觉模型对 03 的读数出现
   幻觉文本，需 DOM 实证）。另做 reduced-motion 零注册核验。 */
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const BASE = "http://127.0.0.1:3231";
const OUT = "E:/DEV/RocoDex/lab/refactor/final2/";

const scrollTo = (page, top) => page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), top);
const pump = async (page, frames = 12) => {
  await page.evaluate(async (count) => {
    for (let i = 0; i < count; i++) await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
  }, frames);
};
const chapterY = async (page, selector, p) => page.evaluate(({ selector, p }) => {
  const el = document.querySelector(selector);
  const rect = el.getBoundingClientRect();
  const y = rect.top + scrollY + p * (rect.height + innerHeight) - innerHeight;
  return Math.max(0, Math.min(y, document.documentElement.scrollHeight));
}, { selector, p });
const pinTravel = async (page, progress) => page.evaluate((progress) => {
  const spread = document.querySelector(".data-spread");
  if (!spread) return null;
  const box = spread.closest(".pin-spacer") ?? spread;
  const pinStart = box.getBoundingClientRect().top + scrollY - innerHeight * 0.12;
  return Math.max(0, Math.min(pinStart + innerHeight * 0.95 * progress, document.documentElement.scrollHeight));
}, progress);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  /* ---- 指纹：确认是重构后的构建 ---- */
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/cstd`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length >= 2, null, { timeout: 20_000 });
  await page.waitForTimeout(1600);
  const fp = await page.evaluate(() => ({
    css: [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute("href")).find((h) => h.includes("cstd-editorial")),
    gsapColophon: document.querySelector(".colophon-small")?.textContent ?? null,
    spacers: document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length,
  }));
  console.log("FINGERPRINT", JSON.stringify(fp));

  /* ---- 02: ch-title p=0.71 —— 铜线 scaleX 应 ~0.5、title-lift y ≈ -6.3 ---- */
  const y02 = await chapterY(page, ".ch-title", 0.71);
  await scrollTo(page, y02); await pump(page);
  const st02 = await page.evaluate(() => {
    const rule = document.querySelector(".ch-title .title-foot .ed-rule");
    const lift = document.querySelector(".ch-title .title-lift");
    return { ruleScaleX: rule?.style.transform ?? getComputedStyle(rule).transform, liftY: lift?.style.transform ?? "", ruleRect: rule?.getBoundingClientRect().toJSON() };
  });
  await page.screenshot({ path: `${OUT}f2-02.png` });
  console.log("02", y02, JSON.stringify(st02));

  /* ---- 03: #ch-method p=0.46 —— 行 3 编号 clip 应 ~inset(50% 0 0 0)、行线 scaleX ~0.5 ---- */
  const y03 = await chapterY(page, "#ch-method", 0.46);
  await scrollTo(page, y03); await pump(page);
  const st03 = await page.evaluate(() => {
    const rows = [...document.querySelectorAll("#ch-method .method-list li")];
    const list = document.querySelector("#ch-method .method-list");
    return {
      methodListTop: Math.round(list.getBoundingClientRect().top),
      pinWrapped: !!list.closest(".pin-spacer"),
      rows: rows.map((li) => ({
        no: li.querySelector(".method-no").textContent,
        noClip: li.querySelector(".method-no").style.clipPath,
        ruleScaleX: li.querySelector(".ed-rule").style.transform,
        opacity: getComputedStyle(li).opacity,
        top: Math.round(li.getBoundingClientRect().top),
      })),
      headingsInViewport: [...document.querySelectorAll("h1,h2,h3")].filter((h) => { const r = h.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }).map((h) => h.className || h.tagName),
    };
  });
  await page.screenshot({ path: `${OUT}f2-03.png` });
  console.log("03", y03, JSON.stringify(st03));

  /* ---- 04: .data-spread pin 0.45 —— 计数 ~735k、图版 clip ~inset(0 30% 0 0) ---- */
  const y04 = await pinTravel(page, 0.45);
  await scrollTo(page, y04); await pump(page);
  const st04 = await page.evaluate(() => {
    const c = document.querySelector(".data-count .ed-nums");
    const fig = document.querySelector(".data-figure");
    const figInner = document.querySelector(".data-figure-inner");
    return { count: c.textContent, countTop: Math.round(c.getBoundingClientRect().top), figClip: fig.style.clipPath, innerY: figInner?.style.transform ?? "", figTop: Math.round(fig.getBoundingClientRect().top) };
  });
  await page.screenshot({ path: `${OUT}f2-04.png` });
  console.log("04", y04, JSON.stringify(st04));

  /* ---- 05: #ch-notes p=0.34 —— note2 半墨（窗 [0.26,0.42] → 0.5）+ h2 升幕 ---- */
  const y05 = await chapterY(page, "#ch-notes", 0.34);
  await scrollTo(page, y05); await pump(page);
  const st05 = await page.evaluate(() => {
    const notes = [...document.querySelectorAll("#ch-notes .note-list .note")];
    const h2 = document.querySelector("#ch-notes h2");
    const words = [...h2.querySelectorAll(".ed-word__in")];
    return {
      h2TopVh: +(h2.getBoundingClientRect().top / innerHeight).toFixed(3),
      h2WordYPct: words.map((w) => Math.round(parseFloat((w.style.transform.match(/translateY\(([-\d.]+)%\)/) || [0, NaN])[1]))).slice(0, 8),
      notes: notes.map((n) => ({
        rule: n.querySelector(".ed-rule").style.transform,
        driftX: n.querySelector("[data-ed-drift]")?.style.transform ?? "",
        top: Math.round(n.getBoundingClientRect().top),
      })),
    };
  });
  await page.screenshot({ path: `${OUT}f2-05.png` });
  console.log("05", y05, JSON.stringify(st05));
  await page.close();

  /* ---- reduced-motion：零注册核验 ---- */
  const rm = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await rm.goto(`${BASE}/cstd`, { waitUntil: "domcontentloaded" });
  await rm.waitForTimeout(2000);
  const stRm = await rm.evaluate(() => ({
    spacers: document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length,
    h1Split: !!document.querySelector(".ch-title h1 .ed-word"),
    anyInlineTransform: [...document.querySelectorAll(".chapter [style*='transform'], .chapter [style*='clip-path'], .chapter [style*='opacity']")].length,
    h1Visible: !!document.querySelector(".ch-title h1") && getComputedStyle(document.querySelector(".ch-title h1")).opacity !== "0",
  }));
  await rm.screenshot({ path: `${OUT}f2-reduced-motion.png` });
  console.log("RM", JSON.stringify(stRm));
  await rm.close();
  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
