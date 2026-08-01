import { randomUUID } from "node:crypto";
import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { captureBrowserIssues, expectNoHorizontalOverflow } from "./support/browser";

const usersFile = path.join(process.cwd(), "data", "users.json");

async function gotoRocoDexPage(page: Page, url: string) {
  const [sessionResponse, pageResponse] = await Promise.all([
    page.waitForResponse((response) => response.url().endsWith("/api/auth/session")),
    page.goto(url, { waitUntil: "domcontentloaded" }),
  ]);

  expect(sessionResponse.ok()).toBe(true);
  expect(pageResponse?.ok()).toBe(true);
}

async function removeLocalTestUser(username: string) {
  let rawUsers: string;
  try {
    rawUsers = await readFile(usersFile, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
    throw error;
  }

  const users = JSON.parse(rawUsers) as Array<{ username?: string }>;
  const remainingUsers = users.filter((user) => user.username !== username);

  if (remainingUsers.length === 0) {
    await rm(usersFile, { force: true });
    return;
  }

  await writeFile(usersFile, `${JSON.stringify(remainingUsers, null, 2)}\n`, "utf8");
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

test("RocoDex not-found fallback renders inside the configured auth context", async ({ page }) => {
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

  await page.route("**/_next/image?*", async (route) => {
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

test("a unique local user can register and sign in without leaving test data", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "The authenticated header assertion is covered in the desktop project.");

  const browserIssues = captureBrowserIssues(page);
  const username = `e2e${Date.now().toString(36)}`;
  const password = `E2e!${randomUUID().slice(0, 12)}`;

  try {
    await gotoRocoDexPage(page, "/register");
    await page.getByLabel("用户名", { exact: true }).fill(username);
    await page.getByLabel("密码", { exact: true }).fill(password);
    await page.getByLabel("确认密码", { exact: true }).fill(password);
    await page.getByRole("button", { name: "注册", exact: true }).click();

    await expect(page).toHaveURL(/\/login\?registered=true$/);
    await page.getByLabel("用户名", { exact: true }).fill(username);
    await page.getByLabel("密码", { exact: true }).fill(password);
    await page.getByRole("button", { name: "登录", exact: true }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("button", { name: username, exact: true })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    expect(browserIssues).toEqual([]);
  } finally {
    await removeLocalTestUser(username);
  }
});
