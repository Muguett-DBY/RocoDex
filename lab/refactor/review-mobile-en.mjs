/* 终审补充：移动端(390x844) 与英文桌面端实测——after 证据缺这两块 */
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const BASE = process.env.SHOT_BASE_URL ?? "http://127.0.0.1:3220";
const OUT = "E:/DEV/RocoDex/lab/refactor/review/";

const scrollTo = (page, top) => page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), top);
const pump = async (page, frames = 12) => {
  await page.evaluate(async (count) => {
    for (let i = 0; i < count; i++) await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
  }, frames);
};

async function run(browser, { label, url, viewport, mobile }) {
  const page = await browser.newPage({ viewport });
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length >= 2, null, { timeout: 20_000 });
  await page.waitForTimeout(1600);
  await scrollTo(page, 0);
  await pump(page);
  await page.screenshot({ path: `${OUT}${label}-1-landing.png` });

  const geom = await page.evaluate(() => {
    const vh = innerHeight;
    const doc = (el) => el.getBoundingClientRect().top + scrollY;
    const ch = document.querySelector("#ch-work");
    const spread = document.querySelector(".data-spread");
    const chTop = doc(ch), H = ch.offsetHeight;
    const pAt = (y) => (y + vh - chTop) / (H + vh);
    const pinStart = doc(spread) - 0.12 * vh;
    const pinEnd = pinStart + 0.95 * vh;
    return { vh, chTop, H, pinStart, pinEnd, pPinStart: pAt(pinStart), pPinEnd: pAt(pinEnd) };
  });

  // pin 中点：计数可见性与数值
  const midPin = Math.round((geom.pinStart + geom.pinEnd) / 2);
  await scrollTo(page, midPin);
  await pump(page);
  const midState = await page.evaluate(() => {
    const c = document.querySelector(".data-count .ed-nums");
    const r = c.getBoundingClientRect();
    const fig = document.querySelector(".data-figure");
    return { count: c.textContent, countTop: Math.round(r.top), figClip: getComputedStyle(fig).clipPath };
  });
  await page.screenshot({ path: `${OUT}${label}-2-datapin-mid.png` });

  // 图01 在下滚过程中是否曾可见：扫过图版经过视口的 p 区间，检查 clip 是否开
  const sweep = [];
  const figTop = await page.evaluate(() => {
    const fig = document.querySelector(".data-figure");
    return fig.getBoundingClientRect().top + scrollY;
  });
  const figH = await page.evaluate(() => document.querySelector(".data-figure").offsetHeight);
  for (let y = Math.max(0, figTop - 50); y < figTop + figH; y += Math.max(80, Math.round((figH) / 8))) {
    await scrollTo(page, y);
    await pump(page, 4);
    const s = await page.evaluate(() => {
      const fig = document.querySelector(".data-figure");
      const r = fig.getBoundingClientRect();
      const c = document.querySelector(".data-count .ed-nums");
      const cr = c.getBoundingClientRect();
      return {
        figClip: getComputedStyle(fig).clipPath,
        figOnScreen: r.top < innerHeight && r.bottom > 0,
        countText: c.textContent,
        countOnScreen: cr.top < innerHeight && cr.bottom > 0,
      };
    });
    sweep.push({ scrollY: y, ...s });
  }

  // 英文：章题升幕中间态（复杂问题 → Complex questions.）；移动端：扉页滚到 ch-method h2 中途
  if (!mobile) {
    const y = await page.evaluate(() => {
      const h2 = document.querySelector("#ch-method h2");
      const t = h2.getBoundingClientRect().top + scrollY;
      return Math.round(t - innerHeight * 0.65); // h2 落在 65vh ≈ 88%/42% 半程
    });
    await scrollTo(page, y);
    await pump(page, 24);
    await page.screenshot({ path: `${OUT}${label}-3-method-h2-mid.png` });
  } else {
    const y = await page.evaluate(() => {
      const h2 = document.querySelector("#ch-method h2");
      const t = h2.getBoundingClientRect().top + scrollY;
      return Math.round(t - innerHeight * 0.65);
    });
    await scrollTo(page, y);
    await pump(page, 24);
    await page.screenshot({ path: `${OUT}${label}-3-method-h2-mid.png` });
  }

  console.log(label, JSON.stringify({ geom, midPin, midState, sweep }, null, 2));
  await page.close();
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  await run(browser, { label: "m-zh", url: `${BASE}/cstd`, viewport: { width: 390, height: 844 }, mobile: true });
  await run(browser, { label: "d-en", url: `${BASE}/cstd/en`, viewport: { width: 1440, height: 900 }, mobile: false });
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
