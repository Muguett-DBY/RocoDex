import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { captureBrowserIssues, expectNoHorizontalOverflow } from "./support/browser";

test.describe("ATELIER without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("serves readable content, real work, and the complete static material", async ({ page }) => {
    await page.goto("/cstd", { waitUntil: "load" });
    await expect(page.getByRole("heading", { level: 1, name: "奶黄包" })).toBeVisible();
    await expect(page.locator(".atelier-hero-copy")).toHaveCSS("opacity", "1");
    await expect(page.locator(".atelier-hero-intro")).toContainText("R、Python 和 SQL");
    await expect(page.locator(".atelier-project")).toHaveCount(3);
    await expect(page.locator(".atelier-project-tools").first()).toContainText("data.table");
    const sculpture = page.locator(".atelier-sculpture");
    await expect(sculpture).toBeVisible();
    expect(await sculpture.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    await expect(page.locator("canvas")).toHaveCount(0);
    await page.locator('.atelier-actions a[href="#atelier-proof"]').click();
    await expect(page.locator("#atelier-proof")).toBeInViewport();
    await expectNoHorizontalOverflow(page);
  });
});

test("ATELIER preserves its full visual and content when WebGPU is unavailable", async ({ page }) => {
  const issues = captureBrowserIssues(page);
  await page.addInitScript(() => Object.defineProperty(navigator, "gpu", { value: undefined, configurable: true }));
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-enhancements-ready", "true");
  const toggle = page.locator("[data-atelier-material-toggle]");
  await expect(page.locator("canvas")).toHaveCount(0);
  await toggle.click();
  await expect(toggle).toHaveText("静态光影");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(toggle).toBeDisabled();
  await expect(page.locator(".atelier-sculpture")).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
  expect(issues).toEqual([]);
});

test("ATELIER starts its material only on request and releases it when inactive", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  const root = page.locator("[data-cstd-kinetic-world]");
  const material = page.locator("[data-atelier-material]");
  const toggle = page.locator("[data-atelier-material-toggle]");
  const canvas = material.locator("canvas");
  await expect(root).toHaveAttribute("data-cstd-motion", "calm");
  await expect(canvas).toHaveCount(0);
  await toggle.click();
  await expect(toggle).toHaveText(/暂停光影|静态光影/, { timeout: 20_000 });

  // Secure contexts can still have no GPU adapter (for example a CI runner).
  if (await toggle.isDisabled()) {
    await expect(canvas).toHaveCount(0);
    await expect(page.locator(".atelier-sculpture")).toBeVisible();
  } else {
    await expect(root).toHaveAttribute("data-cstd-motion", "full");
    await expect(material).toHaveAttribute("data-atelier-material", "ready");
    await expect(canvas).toBeVisible();
    await page.locator('.atelier-actions a[href="#atelier-proof"]').click();
    await expect(canvas).toHaveCount(0);
    await page.locator('.atelier-footer-line a[href="#atelier-top"]').click();
    await toggle.scrollIntoViewIfNeeded();
    await expect(canvas).toBeVisible();
    await page.locator("[data-cstd-motion-toggle]").click();
    await expect(canvas).toHaveCount(0);
    await expect(toggle).toHaveText("让光影流动");
    await toggle.click();
    await expect(canvas).toBeVisible();
    await page.locator("[data-cstd-theme-switcher]").click();
    await page.locator('[data-cstd-theme-option="neon-district"]').click();
    await expect(canvas).toHaveCount(0);
    await page.locator("[data-cstd-theme-switcher]").click();
    await page.locator('[data-cstd-theme-option="atelier"]').click();
    await toggle.scrollIntoViewIfNeeded();
    await expect(canvas).toBeVisible();
    await toggle.click();
    await expect(canvas).toHaveCount(0);
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
  }
  expect(errors).toEqual([]);
});

test("ATELIER anchors target the visible portfolio across world switches", async ({ page }) => {
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  const root = page.locator("[data-cstd-kinetic-world]");
  await expect(root).toHaveAttribute("data-cstd-enhancements-ready", "true");
  await page.locator('.atelier-actions a[href="#atelier-proof"]').click();
  await expect(page.locator("#atelier-proof")).toBeInViewport();
  await expect(root).toHaveAttribute("data-cstd-scene-current", "proof");
  const landingOffset = await page.locator("#atelier-proof").evaluate((section) => {
    const header = document.querySelector("[data-cstd-home-header]")!;
    return Math.abs(section.getBoundingClientRect().top - header.getBoundingClientRect().bottom - 8);
  });
  expect(landingOffset).toBeLessThanOrEqual(24);

  await page.locator("[data-cstd-theme-switcher]").click();
  await page.locator('[data-cstd-theme-option="neon-district"]').click();
  await expect(page.locator("[data-cstd-home-game]")).toBeVisible();
  await page.locator('[data-cstd-home-header] a[href="#proof"]:visible').click();
  await expect(root).toHaveAttribute("data-cstd-scene-current", "proof");
  await page.locator("[data-cstd-theme-switcher]").click();
  await page.locator('[data-cstd-theme-option="atelier"]').click();
  await page.locator('[data-cstd-home-header] a[href="#atelier-proof"]:visible').click();
  await expect(page.locator("#atelier-proof")).toBeInViewport();
  await expect(root).toHaveAttribute("data-cstd-scene-current", "proof");
  await expectNoHorizontalOverflow(page);
});

test("ATELIER keeps English work readable on a narrow phone", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/cstd/en", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "Custard" })).toBeVisible();
  await expect(page.locator(".atelier-hero-intro")).toContainText("R, Python, and SQL");
  await expect(page.locator(".atelier-project-tools").nth(1)).toContainText("TypeScript");
  await expect(page.locator("[data-atelier-material-toggle]")).toHaveText("Set the light in motion");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
  await page.getByRole("link", { name: "Explore the work", exact: true }).click();
  await expect(page.locator("#atelier-proof")).toBeInViewport();
  await expectNoHorizontalOverflow(page);
});

test("ATELIER keeps its inner pages readable, accessible, and free of decorative renderers", async ({ page }) => {
  const issues = captureBrowserIssues(page);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/cstd/work", "/cstd/about", "/cstd/notes", "/cstd/notes/evidence-first-ai-research", "/cstd/en/about"]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('[data-cstd-deep-shell]')).toHaveAttribute("data-cstd-theme", "atelier");
    await expect(page.locator('[data-cstd-signal-field]')).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations.map((violation) => ({ id: violation.id, targets: violation.nodes.map((node) => node.target) }))).toEqual([]);
  }
  expect(issues).toEqual([]);
});

test("ATELIER case navigation reaches the readable story and preserves the technical demonstration", async ({ page }) => {
  await page.goto("/cstd/work/alpha-research-system", { waitUntil: "domcontentloaded" });
  await expect(page.locator('.cstd-atelier-hero-artwork')).toBeVisible();
  await page.locator('.cstd-case-outline a[href="#pipeline"]').click();
  await expect(page.locator('[data-cstd-case-story] #pipeline')).toBeInViewport();
  await expect(page.locator('[data-cstd-case-story] #pipeline')).toContainText("证据指纹");
  await expect(page.locator('[data-cstd-case-film]')).toBeVisible();
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute("href", "/cstd-atelier/mark-v1.svg");
  await expectNoHorizontalOverflow(page);
});
