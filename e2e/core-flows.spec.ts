import { randomUUID } from "node:crypto";
import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

const usersFile = path.join(process.cwd(), "data", "users.json");

function captureBrowserIssues(page: Page) {
  const issues: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "warning" || message.type() === "error") {
      issues.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => issues.push(`pageerror: ${error.message}`));

  return issues;
}

async function expectNoHorizontalOverflow(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
    )
    .toBe(true);
}

async function gotoRocodexPage(page: Page, url: string) {
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

test("core routes render responsively", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);

  await gotoRocodexPage(page, "/");
  await expect(page.getByRole("heading", { level: 1, name: "洛克图鉴 / RocoDex" })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.getByRole("link", { name: "查看精灵列表", exact: false }).click();
  await expect(page).toHaveURL(/\/creatures$/);
  await expect(page.getByRole("heading", { level: 1, name: "全 347 只精灵" })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await gotoRocodexPage(page, "/creatures/001");
  await expect(page.getByRole("heading", { level: 1, name: "迪莫" })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  const cstdResponse = await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  expect(cstdResponse?.ok()).toBe(true);
  await expect(page.getByRole("heading", { level: 1, name: "CSTD" })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  expect(browserIssues).toEqual([]);
});

test("CSTD presents five shipped products without portfolio tools", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  await expect(page.getByRole("heading", { level: 1, name: "CSTD" })).toBeVisible();
  await expect(page.getByRole("link", { name: "看五个作品" })).toHaveAttribute("href", "#work");
  await expect(page.locator('[data-cstd-project]')).toHaveCount(5);

  for (const title of [
    "洛克图鉴 / RocoDex",
    "奶黄包摄影",
    "CSTD Alpha",
    "私人 AI 创作工作台",
    "产业园区招商 CRM",
  ]) {
    await expect(page.getByRole("heading", { level: 3, name: title })).toHaveCount(1);
  }

  await expect(page.getByRole("searchbox")).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByText("项目对比", { exact: true })).toHaveCount(0);
  await expect(page.getByText("按目标找项目", { exact: true })).toHaveCount(0);
  await expect(page.getByText("加入对比", { exact: false })).toHaveCount(0);

  await expect
    .poll(() =>
      page.locator('img[src*="cstd-studio-hero"]').evaluate((image) => {
        const element = image as HTMLImageElement;
        return element.complete && element.naturalWidth > 0;
      }),
    )
    .toBe(true);
  for (const id of ["rocodex", "photography", "alpha", "design", "crm"]) {
    const project = page.locator(`[data-cstd-project="${id}"]`);
    await project.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        project.locator("img").evaluate((image) => {
          const element = image as HTMLImageElement;
          return element.complete && element.naturalWidth > 0;
        }),
      )
      .toBe(true);
  }

  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD project index navigates the exhibition and keeps direct links safe", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  const index = page.getByRole("navigation", { name: "作品索引" });
  await expect(index.getByRole("link")).toHaveCount(5);
  await index.getByRole("link", { name: /02.*奶黄包摄影/ }).click();
  await expect(page).toHaveURL(/#project-photography$/);
  await expect(page.locator("#project-photography")).toBeInViewport({ ratio: 0.35 });
  await expect
    .poll(() => index.getByRole("link", { name: /02.*奶黄包摄影/ }).getAttribute("aria-current"))
    .toBe("true");

  const expectedLinks = [
    ["rocodex", "打开图鉴", "https://rocodex.custard.top"],
    ["photography", "查看摄影站", "https://shoot.custard.top"],
    ["alpha", "打开 Alpha", "https://alpha.custard.top"],
    ["design", "打开工作台", "https://design.custard.top"],
    ["crm", "打开 CRM", "https://cfzzs.custard.top"],
  ] as const;

  for (const [id, label, href] of expectedLinks) {
    const link = page.locator(`[data-cstd-project="${id}"]`).getByRole("link", { name: label });
    await expect(link).toHaveAttribute("href", href);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noreferrer");
  }

  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD studio interaction changes the note without turning into a workflow", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd#studio", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  const originalUrl = page.url();
  await expect(page.getByText("先把问题看明白，再把界面做漂亮。", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "再碰一下奶黄包" }).click();
  await expect(page.getByText("真实上线，比停在概念图里更有意思。", { exact: true })).toBeVisible();
  expect(page.url()).toBe(originalUrl);
  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
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

  const navigation = gotoRocodexPage(page, "/creatures/001");
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
    await gotoRocodexPage(page, "/register");
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
