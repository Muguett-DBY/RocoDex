import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { captureBrowserIssues, expectNoHorizontalOverflow } from "./support/browser";

test.describe("FLIGHT without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("serves the readable city narrative without any runtime", async ({ page }) => {
    await page.goto("/cstd", { waitUntil: "load" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("工程城市");
    await expect(page.locator("[data-cstd-home-flight] .fx-role").first()).toContainText("人工智能博 0");
    await expect(page.locator("[data-cstd-home-flight] [data-sc-copy]")).toHaveCount(11);
    await expect(page.locator("[data-cstd-home-flight] [data-sc-copy] h2").first()).toBeVisible();
    await expect(page.locator("[data-cstd-home-flight] canvas")).toHaveCount(0);
    await expect(page.locator("[data-cstd-home-flight] .fx-cta")).toHaveAttribute("href", /^mailto:cstd@custard\.top/);
    await expect(page.locator("[data-cstd-home-flight] .grid-rail")).toBeHidden();
    await expectNoHorizontalOverflow(page);
  });
});

test("FLIGHT mounts the continuous world and every district stays reachable", async ({ page }) => {
  const issues = captureBrowserIssues(page);
  await page.addInitScript(() => Object.defineProperty(navigator, "gpu", { value: undefined, configurable: true }));
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/sc-ready/, { timeout: 20_000 });
  await expect(page.locator("[data-cstd-home-flight] [data-sc-segment]")).toHaveCount(9);
  await expect(page.locator("[data-cstd-home-flight] .grid-rail__leg button")).toHaveCount(9);

  const track = await page.locator("[data-cstd-home-flight] [data-sc-spacer]").evaluate((spacer) => spacer.getBoundingClientRect().height);
  expect(track).toBeGreaterThan(9 * page.viewportSize()!.height);

  const lastNode = page.locator("[data-cstd-home-flight] .grid-rail__leg button").nth(8);
  await lastNode.click();
  await expect(page.locator("[data-cstd-home-flight] .grid-rail__pct")).toHaveText(/9[0-9]%/, { timeout: 10_000 });
  await expect(page.getByRole("heading", { level: 2, name: /这座城建好了/ })).toBeVisible();
  await expect(page.locator("[data-cstd-home-flight] canvas")).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
  expect(issues).toEqual([]);
});

test("FLIGHT never fetches a clip under reduced motion and the ledger still settles", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const clipRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith(".mp4")) clipRequests.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/sc-ready/, { timeout: 20_000 });

  await page.evaluate(() => scrollTo(0, 5.1 * innerHeight));
  await expect(page.locator("[data-cstd-home-flight] .ledger__line")).toHaveCount(11, { timeout: 10_000 });
  await expect(page.locator("[data-cstd-home-flight] .ledger__line.is-close")).toHaveCount(0);

  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await expect(page.locator("[data-cstd-home-flight] .ledger__line.is-close")).toHaveCount(1, { timeout: 10_000 });
  await expect(page.locator("[data-cstd-home-flight] .ledger__line")).toHaveCount(15);
  expect(clipRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test("FLIGHT hands the homepage to the game worlds and takes it back", async ({ page }) => {
  await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/sc-ready/, { timeout: 20_000 });
  await expect(page.locator("[data-cstd-home-flight]")).toBeVisible();
  await expect(page.locator("[data-cstd-home-shell]")).toBeHidden();

  await page.locator('[data-cstd-theme-switcher] >> visible=true').click();
  await page.locator('[data-cstd-theme-option="neon-district"]').click();
  await expect(page.locator("[data-cstd-home-game]")).toBeVisible();
  await expect(page.locator("[data-cstd-home-flight]")).toBeHidden();
  await expect(page.locator("html")).not.toHaveClass(/sc-ready/, { timeout: 10_000 });

  await page.locator('[data-cstd-theme-switcher] >> visible=true').click();
  await page.locator('[data-cstd-theme-option="atelier"]').click();
  await expect(page.locator("[data-cstd-home-flight]")).toBeVisible();
  await expect(page.locator("html")).toHaveClass(/sc-ready/, { timeout: 10_000 });
  await expectNoHorizontalOverflow(page);
});

test("FLIGHT keeps the English city readable on a narrow phone", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/cstd/en", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/sc-ready/, { timeout: 20_000 });
  await expect(page.getByRole("heading", { level: 1 })).toContainText("engineering city");
  await expect(page.locator("[data-cstd-home-flight] .fx-role").first()).toContainText("PhD Year 0");
  await expect(page.locator("[data-cstd-home-flight] .fx-bar__cta")).toContainText("Start a collaboration");
  await expect(page.locator("[data-cstd-home-flight] canvas")).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
  await page.evaluate(() => scrollTo(0, 5.1 * innerHeight));
  await expect(page.getByRole("heading", { name: "DCF Quantum" })).toBeVisible({ timeout: 10_000 });
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
