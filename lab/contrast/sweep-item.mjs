import { chromium } from "playwright-core";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:4635/cstd", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => document.querySelectorAll(".pin-spacer").length >= 2, null, { timeout: 20000 }).catch(() => {});
const out = await page.evaluate(async () => {
  const frame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
  const h = document.documentElement.scrollHeight;
  const res = { samples: 0, mismatches: 0 };
  for (let y = 0; y <= h; y += 200) {
    scrollTo({ top: y, behavior: "instant" });
    await frame();
    const colophon = document.querySelector("[data-colophon]");
    const rect = colophon.getBoundingClientRect();
    document.querySelectorAll(".folio__item").forEach((item) => {
      const r = item.getBoundingClientRect();
      const cy = r.top + r.height / 2;
      const onPlate = rect.top <= cy && rect.bottom >= cy;
      res.samples += 1;
      if (item.classList.contains("is-dark") !== onPlate) res.mismatches += 1;
    });
  }
  return res;
});
console.log(JSON.stringify(out));
await browser.close();
