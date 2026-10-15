import { chromium } from "playwright-core";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://custard.top/", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => document.querySelectorAll(".pin-spacer").length >= 2, null, { timeout: 20000 }).catch(() => {});
await page.evaluate(() => {
  const el = document.querySelector("[data-colophon]");
  scrollTo({ top: el.getBoundingClientRect().top + scrollY + 200, behavior: "instant" });
});
await page.waitForTimeout(700);
const state = await page.evaluate(() => {
  const folio = document.querySelector(".folio");
  const item = folio?.querySelector(".folio__item b");
  return { isDark: folio?.classList.contains("is-dark"), firstMark: item?.textContent, itemColor: item ? getComputedStyle(item).color : null };
});
await page.screenshot({ path: "lab/contrast/shots-live/verify-colophon-folio.png", clip: { x: 0, y: 300, width: 220, height: 400 } });
console.log(JSON.stringify(state));
await browser.close();
