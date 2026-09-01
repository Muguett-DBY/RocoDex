import { chromium } from "@playwright/test";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.CSTD_CAPTURE_BASE_URL ?? "http://127.0.0.1:3200";
const outputParent = path.resolve("output/playwright");
const outputRoot = path.resolve(outputParent, "cstd-theme-gallery");

if (!outputRoot.startsWith(`${outputParent}${path.sep}`)) {
  throw new Error(`Refusing to replace screenshots outside ${outputParent}`);
}

const themes = [
  { id: "neon-district", artifact: "neon" },
  { id: "underworld-forge", artifact: "underworld" },
  { id: "astral-covenant", artifact: "astral" },
];

const captures = [
  { id: "desktop-home", path: "/cstd", viewport: { width: 1440, height: 900 } },
  { id: "desktop-home-en", path: "/cstd/en", viewport: { width: 1440, height: 900 } },
  { id: "desktop-deep", path: "/cstd/work/rocodex-platform", viewport: { width: 1440, height: 900 } },
  { id: "desktop-deep-en", path: "/cstd/en/work/rocodex-platform", viewport: { width: 1440, height: 900 } },
  { id: "mobile-deep", path: "/cstd/work/rocodex-platform", viewport: { width: 390, height: 844 } },
  { id: "mobile-home-en", path: "/cstd/en", viewport: { width: 390, height: 844 } },
];

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

const browser = await chromium.launch({ headless: true });
const report = [];

try {
  for (const theme of themes) {
    for (const capture of captures) {
      const context = await browser.newContext({ viewport: capture.viewport, reducedMotion: "no-preference" });
      await context.addInitScript((themeId) => window.localStorage.setItem("cstd-world-theme", themeId), theme.id);
      const page = await context.newPage();
      const issues = [];

      page.on("console", (message) => {
        if (message.type() === "error") issues.push(`console: ${message.text()}`);
      });
      page.on("pageerror", (error) => issues.push(`pageerror: ${error.message}`));

      const response = await page.goto(`${baseURL}${capture.path}`, { waitUntil: "networkidle", timeout: 30_000 });
      if (!response?.ok()) throw new Error(`${capture.path} returned ${response?.status() ?? "no response"}`);

      const isHomepage = capture.path === "/cstd" || capture.path === "/cstd/en";
      const rootSelector = isHomepage ? "[data-cstd-kinetic-world]" : "[data-cstd-deep-shell]";
      await page.locator(rootSelector).waitFor({ state: "visible" });
      await page.evaluate(async () => { await document.fonts.ready; });

      const fileName = `${theme.id}-${capture.id}.png`;
      await page.screenshot({ path: path.join(outputRoot, fileName), animations: "disabled", fullPage: false });

      report.push(await page.evaluate(({ rootSelector, themeId, artifact, captureId, fileName, isHomepage }) => {
        const root = document.querySelector(rootSelector);
        const title = document.querySelector("[data-cstd-page-hero-title], #cstd-hero-title");
        const material = document.querySelector("[data-cstd-page-hero-material]");
        const artifactNode = isHomepage ? null : document.querySelector(`[data-cstd-deep-artifact="${artifact}"]`);
        const artifactLayer = artifactNode?.closest("[data-cstd-page-hero-artifacts]");
        const heroActions = [...document.querySelectorAll("[data-cstd-hero-actions] a")].map((action) => ({
          text: action.textContent?.trim() ?? "",
          color: getComputedStyle(action).color,
          background: getComputedStyle(action).backgroundColor,
          font: getComputedStyle(action).fontFamily,
        }));
        const visibleDeepArtifacts = [...document.querySelectorAll("[data-cstd-deep-artifact]")]
          .filter((node) => getComputedStyle(node).display !== "none" && node.getClientRects().length > 0)
          .map((node) => node.getAttribute("data-cstd-deep-artifact"));
        return {
          theme: themeId,
          capture: captureId,
          file: fileName,
          rootTheme: root?.getAttribute("data-cstd-theme") ?? null,
          locale: root?.getAttribute("data-cstd-locale") ?? document.documentElement.lang,
          titleFont: title ? getComputedStyle(title).fontFamily : null,
          material: material ? getComputedStyle(material).backgroundImage : null,
          artifactVisible: artifactNode
            ? getComputedStyle(artifactNode).display !== "none" && getComputedStyle(artifactLayer).display !== "none" && artifactNode.getClientRects().length > 0
            : null,
          visibleDeepArtifacts,
          heroActions,
          horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        };
      }, { rootSelector, themeId: theme.id, artifact: theme.artifact, captureId: capture.id, fileName, isHomepage }));

      if (issues.length > 0) throw new Error(`${theme.id}/${capture.id}: ${issues.join(" | ")}`);
      await context.close();
    }
  }
} finally {
  await browser.close();
}

await writeFile(path.join(outputRoot, "report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(`Captured ${report.length} CSTD theme views in ${outputRoot}`);
