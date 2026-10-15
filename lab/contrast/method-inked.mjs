/* method-inked — 补拍 #ch-method 行 3 窗口（[0.38,0.54]）之后的完墨状态，
   裁决 ch-method 章顶截图中 02/03 编号"半隐"是落墨编排中途还是渲染缺陷。 */
import { chromium } from "playwright-core";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: "zh-CN" });
await page.goto("https://custard.top/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForFunction(() => document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length >= 2, null, { timeout: 30000 });
await page.waitForTimeout(1200);
const y = await page.evaluate(() => {
  const el = document.querySelector("#ch-method");
  const rect = el.getBoundingClientRect();
  const target = rect.top + scrollY + 0.62 * (rect.height + innerHeight) - innerHeight;
  return Math.max(0, Math.min(target, document.documentElement.scrollHeight));
});
await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), y);
await page.evaluate(async () => { for (let i = 0; i < 24; i++) await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0))); });
await page.waitForTimeout(800);
const st = await page.evaluate(() => [...document.querySelectorAll("#ch-method .method-list li")].map((li) => ({
  no: li.querySelector(".method-no").textContent,
  clip: li.querySelector(".method-no").style.clipPath || "(none)",
  rule: li.querySelector(".ed-rule").style.transform || "(none)",
})));
await page.screenshot({ path: join(HERE, "shots-live", "zh-method-inked.png") });
console.log(JSON.stringify({ y: Math.round(y), rows: st }));
await browser.close();
