import { chromium } from "playwright-core";
const browser = await chromium.launch();
let stuck = 0;
for (let i = 0; i < 8; i += 1) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://127.0.0.1:4633/cstd", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(900);
  const dark = await page.evaluate(() => {
    const f = document.querySelector(".folio");
    const c = document.querySelector("[data-colophon]");
    return { isDark: f?.classList.contains("is-dark"), colophonTop: c ? Math.round(c.getBoundingClientRect().top) : null };
  });
  if (dark.isDark && (dark.colophonTop ?? 0) > 900) stuck += 1;
  await page.close();
}
console.log(JSON.stringify({ coldLoads: 8, stuckDarkOverPaper: stuck }));
await browser.close();
