/* 调试：主题往返后 pin 是否重建 + console 错误采集 */
import { chromium } from "@playwright/test";

const BASE = "http://127.0.0.1:3220";

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") errors.push(m.type() + ": " + m.text());
});

await page.goto(`${BASE}/cstd`, { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length >= 2, null, { timeout: 15000 }).catch(() => {});
console.log("initial spacers:", await page.evaluate(() => document.querySelectorAll(".pin-spacer").length));

await page.locator('[data-cstd-theme-switcher] >> visible=true').click();
await page.locator('[data-cstd-theme-option="neon-district"]').click();
await page.waitForTimeout(1000);
console.log("in neon: editorial display:", await page.evaluate(() => getComputedStyle(document.querySelector("[data-cstd-home-editorial]")).display));
console.log("in neon: spacers in tree:", await page.evaluate(() => document.querySelectorAll(".pin-spacer").length));

await page.locator('[data-cstd-theme-switcher] >> visible=true').click();
await page.locator('[data-cstd-theme-option="atelier"]').click();
await page.waitForTimeout(1500);
console.log("back in atelier: editorial display:", await page.evaluate(() => getComputedStyle(document.querySelector("[data-cstd-home-editorial]")).display));
console.log("back: spacers:", await page.evaluate(() => document.querySelectorAll("[data-cstd-home-editorial] .pin-spacer").length));
console.log("back: folio count:", await page.evaluate(() => document.querySelectorAll(".folio").length));
console.log("back: h1 split units:", await page.evaluate(() => document.querySelectorAll(".ch-title h1 .ed-word__in").length));
console.log("errors:", JSON.stringify(errors, null, 2));
await browser.close();
