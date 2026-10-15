import { chromium } from "playwright-core";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://custard.top/", { waitUntil: "domcontentloaded" });
await page.evaluate(() => {
  const el = document.querySelector("[data-colophon]");
  scrollTo({ top: el.getBoundingClientRect().top + scrollY + 200, behavior: "instant" });
});
await page.waitForTimeout(700);
const walk = await page.evaluate(() => {
  const b = document.querySelector(".folio__item b");
  const chain = [];
  for (let n = b; n && n.nodeType === 1; n = n.parentElement) {
    const cs = getComputedStyle(n);
    chain.push(`${n.tagName.toLowerCase()}.${(n.classList[0] ?? "")} pos=${cs.position} bg=${cs.backgroundColor}`);
    if (chain.length > 8) break;
  }
  return { isDark: document.querySelector(".folio").classList.contains("is-dark"), chain };
});
console.log(JSON.stringify(walk, null, 1));
await browser.close();
