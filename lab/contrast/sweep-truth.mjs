import { chromium } from "playwright-core";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:4633/cstd", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => document.querySelectorAll(".pin-spacer").length >= 2, null, { timeout: 20000 }).catch(() => {});
let mismatches = 0;
let samples = 0;
await page.evaluate(async () => {
  const step = 200;
  const h = document.documentElement.scrollHeight;
  const frame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
  window.__sweep = { mismatches: 0, samples: 0 };
  for (let y = 0; y <= h; y += step) {
    scrollTo({ top: y, behavior: "instant" });
    await frame();
    const folio = document.querySelector(".folio");
    const colophon = document.querySelector("[data-colophon]");
    if (!folio || !colophon) continue;
    const vh = innerHeight, fh = folio.offsetHeight;
    const bandTop = vh / 2 - fh / 2, bandBottom = vh / 2 + fh / 2 - 24;
    const rect = colophon.getBoundingClientRect();
    const covered = rect.top <= bandTop && rect.bottom >= bandBottom;
    const isDark = folio.classList.contains("is-dark");
    window.__sweep.samples += 1;
    if (covered !== isDark) window.__sweep.mismatches += 1;
  }
});
const out = await page.evaluate(() => window.__sweep);
console.log(JSON.stringify(out));
await browser.close();
