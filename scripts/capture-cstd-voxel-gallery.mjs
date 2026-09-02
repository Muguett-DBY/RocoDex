import { chromium } from "@playwright/test";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.CSTD_CAPTURE_BASE_URL ?? "http://127.0.0.1:3100";
const outputParent = path.resolve("output/playwright");
const outputRoot = path.resolve(outputParent, "cstd-voxel-gallery");

if (!outputRoot.startsWith(`${outputParent}${path.sep}`)) {
  throw new Error(`Refusing to replace screenshots outside ${outputParent}`);
}

const themes = ["neon-district", "underworld-forge", "astral-covenant"];
const viewports = [
  { id: "desktop", width: 1440, height: 900 },
  { id: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true },
];

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

const browser = await chromium.launch({ headless: true });
const report = [];

try {
  for (const theme of themes) {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        isMobile: viewport.isMobile ?? false,
        hasTouch: viewport.hasTouch ?? false,
        reducedMotion: "no-preference",
      });
      await context.addInitScript((themeId) => {
        window.localStorage.setItem("cstd-world-theme", themeId);
        window.localStorage.removeItem(`cstd-voxel-world-v2:${themeId}`);
        window.localStorage.removeItem(`cstd-voxel-discoveries-v1:${themeId}`);
      }, theme);
      const page = await context.newPage();
      const issues = [];
      page.on("console", (message) => {
        if (message.type() === "error") issues.push(`console: ${message.text()}`);
      });
      page.on("pageerror", (error) => issues.push(`pageerror: ${error.message}`));

      const response = await page.goto(`${baseURL}/cstd/voxel`, { waitUntil: "domcontentloaded", timeout: 30_000 });
      if (!response?.ok()) throw new Error(`Voxel route returned ${response?.status() ?? "no response"}`);
      const stage = page.locator("[data-cstd-voxel-game]");
      await stage.waitFor({ state: "visible" });
      await stage.waitFor({ state: "attached" });
      await page.waitForFunction(() => document.querySelector("[data-cstd-voxel-game]")?.getAttribute("data-cstd-voxel-ready") === "true");
      await page.locator("[data-cstd-voxel-canvas][data-cstd-voxel-color-span]").waitFor();
      await page.evaluate(async () => { await document.fonts.ready; });

      const initialFile = `${theme}-${viewport.id}-arrival.png`;
      await page.screenshot({ path: path.join(outputRoot, initialFile), animations: "allow", fullPage: false });

      await page.locator("[data-cstd-voxel-directory-button]").click();
      const directoryFile = `${theme}-${viewport.id}-directory.png`;
      await page.screenshot({ path: path.join(outputRoot, directoryFile), animations: "allow", fullPage: false });
      await page.locator('[data-cstd-voxel-exhibit="alpha-research-system"] button').click();
      await page.waitForFunction(() => document.querySelector("[data-cstd-voxel-game]")?.getAttribute("data-cstd-voxel-focus") === "alpha-research-system");
      await page.waitForTimeout(500);
      const activeFile = `${theme}-${viewport.id}-landmark.png`;
      await page.screenshot({ path: path.join(outputRoot, activeFile), animations: "allow", fullPage: false });

      report.push(await page.evaluate(({ themeId, viewportId, initialFileName, directoryFileName, activeFileName }) => {
        const stageNode = document.querySelector("[data-cstd-voxel-game]");
        const canvas = document.querySelector("[data-cstd-voxel-canvas]");
        return {
          theme: themeId,
          viewport: viewportId,
          files: [initialFileName, directoryFileName, activeFileName],
          focus: stageNode?.getAttribute("data-cstd-voxel-focus"),
          landmarks: Number(stageNode?.getAttribute("data-cstd-voxel-landmark-count")),
          blockCount: Number(stageNode?.getAttribute("data-cstd-voxel-block-count")),
          discovered: Number(stageNode?.getAttribute("data-cstd-voxel-discovered")),
          colorSpan: Number(canvas?.getAttribute("data-cstd-voxel-color-span")),
          litSamples: Number(canvas?.getAttribute("data-cstd-voxel-lit-samples")),
          pixelSamples: Number(canvas?.getAttribute("data-cstd-voxel-pixel-samples")),
          horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        };
      }, { themeId: theme, viewportId: viewport.id, initialFileName: initialFile, directoryFileName: directoryFile, activeFileName: activeFile }));

      if (issues.length > 0) throw new Error(`${theme}/${viewport.id}: ${issues.join(" | ")}`);
      await context.close();
    }
  }
} finally {
  await browser.close();
}

for (const entry of report) {
  if (entry.landmarks !== 8 || entry.focus !== "alpha-research-system" || entry.discovered < 1 || entry.colorSpan <= 18 || entry.litSamples <= entry.pixelSamples * 0.08 || entry.horizontalOverflow) {
    throw new Error(`Voxel capture failed visual signals: ${JSON.stringify(entry)}`);
  }
}

await writeFile(path.join(outputRoot, "report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(`Captured ${report.length * 3} voxel views in ${outputRoot}`);
