/* 终审补拍：各 pin 行程与窗口的实际可见性 + 用户真实看到的中间态帧 */
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const BASE = process.env.SHOT_BASE_URL ?? "http://127.0.0.1:3220";
const OUT = "E:/DEV/RocoDex/lab/refactor/review/";

const scrollTo = (page, top) => page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), top);
const pump = async (page, frames = 10) => {
  await page.evaluate(async (count) => {
    for (let i = 0; i < count; i++) {
      await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
    }
  }, frames);
};
const chapterY = async (page, selector, p) => page.evaluate(({ selector, p }) => {
  const el = document.querySelector(selector);
  const rect = el.getBoundingClientRect();
  const y = rect.top + scrollY + p * (rect.height + innerHeight) - innerHeight;
  return Math.max(0, Math.min(y, document.documentElement.scrollHeight));
}, { selector, p });

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/cstd`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length >= 2, null, { timeout: 20_000 });
  await page.waitForTimeout(1600);
  await scrollTo(page, 0);
  await pump(page);

  // 方法章 / 札记章 pin-window 映射
  const map = await page.evaluate(() => {
    const vh = innerHeight;
    const doc = (el) => el.getBoundingClientRect().top + scrollY;
    const out = {};
    for (const [name, chSel, pinSel, pinStartPct, pinLenPct] of [
      ["method", "#ch-method", "#ch-method .method-list", 0.14, 1.05],
      ["notes", "#ch-notes", null, 0, 0],
    ]) {
      const ch = document.querySelector(chSel);
      const chTop = doc(ch);
      const H = ch.offsetHeight;
      const pAt = (y) => (y + vh - chTop) / (H + vh);
      const entry = { chTop, H, "H+vh": H + vh };
      if (pinSel) {
        const t = document.querySelector(pinSel);
        const tTop = doc(t);
        const pinStart = tTop - pinStartPct * vh;
        const pinEnd = pinStart + pinLenPct * vh;
        entry.pinStart = pinStart;
        entry.pinEnd = pinEnd;
        entry["p@pinStart"] = pAt(pinStart);
        entry["p@pinEnd"] = pAt(pinEnd);
      }
      out[name] = entry;
    }
    return out;
  });
  console.log("MAP", JSON.stringify(map, null, 2));

  // 用户真实看到的数据 pin 中点（pinStart+pinEnd 中点 ≈ scrollY 4670）
  await scrollTo(page, 4670);
  await pump(page, 14);
  await page.screenshot({ path: `${OUT}r1-data-pinmid-actual.png` });
  const st1 = await page.evaluate(() => {
    const c = document.querySelector(".data-count .ed-nums");
    const r = c.getBoundingClientRect();
    return { count: c.textContent, top: Math.round(r.top) };
  });
  console.log("PINMID", JSON.stringify(st1));

  // 自称 04 的位置（ch-work p=0.9325）
  const y04 = await chapterY(page, "#ch-work", 0.9325);
  await scrollTo(page, y04);
  await pump(page, 14);
  await page.screenshot({ path: `${OUT}r2-claimed-04-p09325.png` });

  // 方法 pin 中点
  const mp = map.method;
  const midm = (mp.pinStart + mp.pinEnd) / 2;
  await scrollTo(page, midm);
  await pump(page, 14);
  await page.screenshot({ path: `${OUT}r3-method-pinmid-actual.png` });

  // 札记 p=0.34（自称 05）
  const y05 = await chapterY(page, "#ch-notes", 0.34);
  await scrollTo(page, y05);
  await pump(page, 14);
  await page.screenshot({ path: `${OUT}r4-notes-p034.png` });

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
