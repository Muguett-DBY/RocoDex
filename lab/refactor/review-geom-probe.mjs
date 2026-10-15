/* 终审几何探针：实测重构后 ch-work 的 pin 行程与计数/揭示窗（章 p 口径）是否相交，
   以及计数元素在 pin 行程内是否可见。产出 JSON 到 stdout。
   视口/路径可配：PROBE_W/PROBE_H/PROBE_PATH（默认 1440×900 /cstd）。 */
import { chromium } from "@playwright/test";

const BASE = process.env.SHOT_BASE_URL ?? "http://127.0.0.1:3220";
const VW = Number(process.env.PROBE_W ?? 1440);
const VH = Number(process.env.PROBE_H ?? 900);
const ROUTE = process.env.PROBE_PATH ?? "/cstd";

const scrollTo = (page, top) => page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), top);
const pump = async (page, frames = 10) => {
  await page.evaluate(async (count) => {
    for (let i = 0; i < count; i++) {
      await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
    }
  }, frames);
};

const chapterP = async (page, selector, p) => {
  return page.evaluate(({ selector, p }) => {
    const el = document.querySelector(selector);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const y = rect.top + scrollY + p * (rect.height + innerHeight) - innerHeight;
    return Math.max(0, Math.min(y, document.documentElement.scrollHeight));
  }, { selector, p });
};

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: VW, height: VH } });
  console.log(`VIEWPORT ${VW}x${VH} ${ROUTE}`);
  await page.goto(`${BASE}${ROUTE}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length >= 2, null, { timeout: 20_000 });
  await page.waitForTimeout(1600);
  await scrollTo(page, 0);
  await pump(page);

  const geom = await page.evaluate(() => {
    const vh = innerHeight;
    const ch = document.querySelector("#ch-work");
    const spread = document.querySelector(".data-spread");
    const count = document.querySelector(".data-count .ed-nums");
    const figure = document.querySelector(".data-figure");
    const doc = (el) => el.getBoundingClientRect().top + scrollY;
    const chTop = doc(ch);
    const H = ch.offsetHeight; // 含 pin spacer
    const spreadTop = doc(spread);
    const spreadH = spread.offsetHeight;
    const pinStart = spreadTop - 0.12 * vh; // start 'top 12%'
    const pinEnd = pinStart + 0.95 * vh;    // end '+=95%'
    const pAt = (y) => (y + vh - chTop) / (H + vh);
    return {
      vh, chTop, H, "H+vh": H + vh, spreadTop, spreadH,
      pinStart, pinEnd,
      "p@pinStart": pAt(pinStart),
      "p@pinEnd": pAt(pinEnd),
      countTop: doc(count), figureTop: doc(figure),
      "count windows": Array.from(document.querySelectorAll("[data-ed-count]")).map((e) => ({
        count: e.getAttribute("data-ed-count"), at: e.getAttribute("data-ed-count-at"),
      })),
      "p@0.88": (0.88 * (H + vh) + chTop - vh),
      "p@0.985": (0.985 * (H + vh) + chTop - vh),
    };
  });
  console.log("GEOM", JSON.stringify(geom));

  // 步进采样：pin 行程内每 10% 与计数窗内若干点，记录计数元素可视性、数值、图版 clip
  const samples = [];
  const steps = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.875, 0.9, 0.925, 0.9325, 0.95, 0.965, 0.9775, 0.985, 1.0];
  for (const p of steps) {
    const y = await chapterP(page, "#ch-work", p);
    await scrollTo(page, y);
    await pump(page, 6);
    const s = await page.evaluate(() => {
      const count = document.querySelector(".data-count .ed-nums");
      const spread = document.querySelector(".data-spread");
      const cr = count.getBoundingClientRect();
      const sr = spread.getBoundingClientRect();
      const fig = document.querySelector(".data-figure");
      return {
        countText: count.textContent,
        countVisible: cr.top < innerHeight && cr.bottom > 0 && cr.height > 0,
        countRect: { top: Math.round(cr.top), bottom: Math.round(cr.bottom) },
        spreadTop: Math.round(sr.top),
        figClip: getComputedStyle(fig).clipPath,
      };
    });
    samples.push({ p, scrollY: Math.round(y), ...s });
  }
  console.log("SAMPLES", JSON.stringify(samples));
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
