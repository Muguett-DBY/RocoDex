import { expect, test, type Page } from "@playwright/test";
import { captureBrowserIssues, expectNoHorizontalOverflow } from "./support/browser";

async function gotoRocoDexPage(page: Page, url: string) {
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBe(true);
}

test("core RocoDex routes render responsively", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);

  await gotoRocoDexPage(page, "/");
  await expect(page.getByRole("heading", { level: 1, name: "洛克图鉴 / RocoDex" })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.getByRole("link", { name: "查看精灵列表", exact: false }).click();
  await expect(page).toHaveURL(/\/creatures$/);
  await expect(page.getByRole("heading", { level: 1, name: "全 347 只精灵" })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await gotoRocoDexPage(page, "/creatures/001");
  await expect(page.getByRole("heading", { level: 1, name: "迪莫" })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  expect(browserIssues).toEqual([]);
});

test("RocoDex not-found fallback renders as a static page", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  const response = await page.goto("/route-that-does-not-exist", { waitUntil: "networkidle" });

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "页面未找到" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  expect(pageErrors).toEqual([]);
});

test("RocoDex navigation finishes while a noncritical optimized image is delayed", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "One browser profile is sufficient for navigation wait semantics.");

  let releaseImages!: () => void;
  let markImageRequested!: () => void;
  const imagesReleased = new Promise<void>((resolve) => {
    releaseImages = resolve;
  });
  const imageRequested = new Promise<void>((resolve) => {
    markImageRequested = resolve;
  });

  // Since the Cloudflare migration, images ship pre-optimized (no /_next/image);
  // delay the creature artwork itself to test the same navigation guarantee.
  await page.route("**/*.png", async (route) => {
    markImageRequested();
    await imagesReleased;
    await route.abort();
  });

  const navigation = gotoRocoDexPage(page, "/creatures/001");
  await imageRequested;
  const completedBeforeImage = await Promise.race([
    navigation.then(() => true),
    new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 5_000)),
  ]);

  releaseImages();
  await navigation;
  expect(completedBeforeImage).toBe(true);
});
