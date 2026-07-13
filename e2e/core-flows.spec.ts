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

async function expectElementBefore(page: Page, firstSelector: string, secondSelector: string) {
  await expect
    .poll(() =>
      page.evaluate(
        ({ firstSelector, secondSelector }) => {
          const first = document.querySelector(firstSelector);
          const second = document.querySelector(secondSelector);
          if (!first || !second) return false;
          return Boolean(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING);
        },
        { firstSelector, secondSelector },
      ),
    )
    .toBe(true);
}

async function dismissCstdIntro(page: Page) {
  const dialog = page.getByRole("dialog", { name: "CSTD 开场动画" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
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

test("core routes render responsively and the CSTD fallback remains interactive", async ({ page, isMobile }) => {
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

  const cstdResponse = await page.goto("/cstd?goal=portrait-shooting#projects");
  expect(cstdResponse?.ok()).toBe(true);
  await page.waitForLoadState("networkidle");
  await expect(page.locator('button[aria-label="点击奶黄包互动"]')).toHaveCount(isMobile ? 1 : 2);
  const mascot = page.getByRole("button", { name: "点击奶黄包互动" });
  await expect(mascot).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await mascot.click();
  await expect(mascot).toContainText("奶黄包收到了你的点击，正在加糖。");
  await expectNoHorizontalOverflow(page);

  expect(browserIssues).toEqual([]);
});

test("CSTD intro behaves as a keyboard-contained modal", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBe(true);

  const dialog = page.getByRole("dialog", { name: "CSTD 开场动画" });
  const skip = dialog.getByRole("button", { name: "直接浏览项目" });
  const start = dialog.getByRole("button", { name: "开启 CSTD" });

  await expect(dialog).toBeVisible();
  await expect(start).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");

  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(start).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(skip).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(start).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");

  const replay = page.getByRole("button", { name: "播放开场" });
  await replay.click();
  await expect(dialog).toBeVisible();
  await expect(skip).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(skip).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(replay).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
  expect(browserIssues).toEqual([]);
});

test("CSTD project discovery lands on live project work", async ({ page, isMobile }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBe(true);
  await dismissCstdIntro(page);

  const projectLink = page.getByRole("link", { name: "看项目", exact: true });
  const firstProjectCard = page.locator("article").filter({
    has: page.getByRole("heading", { name: "洛克图鉴 / RocoDex" }),
  });

  await expect(projectLink).toHaveAttribute("href", "#project-grid");
  if (!isMobile) {
    await expect(page.getByRole("link", { name: "Projects", exact: true })).toHaveAttribute("href", "#project-grid");
  }
  await expect(page.getByText("Latest updates", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Capability checklist", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Acceptance status", { exact: true })).toHaveCount(0);
  await expect
    .poll(() => page.locator("#projects").evaluate((element) => element.getBoundingClientRect().top < window.innerHeight))
    .toBe(true);

  await projectLink.click();
  await expect(page).toHaveURL(/#project-grid$/);
  await expect(page.locator("#project-grid")).toBeInViewport();
  await expect(firstProjectCard).toBeInViewport({ ratio: 0.7 });
  const firstProjectActions = firstProjectCard.locator("a, button");
  await expect(firstProjectActions.nth(0)).toHaveText("打开图鉴");
  await expect(firstProjectActions.nth(0)).toHaveAttribute("href", "https://rocodex.custard.top");
  await expect(firstProjectActions.nth(1)).toHaveText("查看案例");
  await expect(firstProjectActions.nth(2)).toHaveText("加入对比");

  const projectMetrics = firstProjectCard.getByRole("list", { name: "洛克图鉴 / RocoDex 项目指标" });
  const projectEvidence = firstProjectCard.locator("dl");
  const metricTiles = projectMetrics.getByRole("listitem");
  await expect(metricTiles).toHaveCount(3);
  const [metricGridBox, evidenceBox, actionBoxes, metricBoxes] = await Promise.all([
    projectMetrics.boundingBox(),
    projectEvidence.boundingBox(),
    firstProjectActions.evaluateAll((actions) =>
      actions.map((action) => {
        const box = action.getBoundingClientRect();
        return { top: box.top, bottom: box.bottom };
      }),
    ),
    metricTiles.evaluateAll((tiles) =>
      tiles.map((tile) => {
        const box = tile.getBoundingClientRect();
        return { width: box.width, height: box.height, x: box.x, y: box.y };
      }),
    ),
  ]);

  expect(metricGridBox).not.toBeNull();
  expect(evidenceBox).not.toBeNull();
  expect(actionBoxes.length).toBeGreaterThanOrEqual(3);
  const actionTop = Math.min(...actionBoxes.map((box) => box.top));
  const actionBottom = Math.max(...actionBoxes.map((box) => box.bottom));
  expect(actionTop).toBeGreaterThanOrEqual(metricGridBox!.y + metricGridBox!.height - 2);
  expect(evidenceBox!.y).toBeGreaterThanOrEqual(actionBottom - 2);
  expect(actionBottom).toBeLessThanOrEqual(page.viewportSize()!.height);

  if (isMobile) {
    const [caseStudyBox, comparisonBox] = await Promise.all([
      firstProjectActions.nth(1).boundingBox(),
      firstProjectActions.nth(2).boundingBox(),
    ]);

    expect(caseStudyBox).not.toBeNull();
    expect(comparisonBox).not.toBeNull();
    expect(Math.abs(caseStudyBox!.y - comparisonBox!.y)).toBeLessThanOrEqual(1);
    expect(caseStudyBox!.height).toBeGreaterThanOrEqual(44);
    expect(comparisonBox!.height).toBeGreaterThanOrEqual(44);
    expect(Math.abs(metricBoxes[0].y - metricBoxes[1].y)).toBeLessThanOrEqual(1);
    expect(metricBoxes[2].y).toBeGreaterThan(metricBoxes[0].y);
    expect(metricBoxes[2].width).toBeGreaterThanOrEqual(metricBoxes[0].width * 1.9);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
    const navigationToggle = page.locator('button[aria-controls="cstd-mobile-navigation"]');
    await navigationToggle.click();
    const projectsNavigationLink = page.getByRole("link", { name: "Projects", exact: true });
    await expect(projectsNavigationLink).toHaveAttribute("href", "#project-grid");
    await projectsNavigationLink.click();
    await expect(navigationToggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#cstd-mobile-navigation")).toHaveCount(0);
    await expect(page).toHaveURL(/#project-grid$/);
    await expect(page.locator("#project-grid")).toBeInViewport();
  } else {
    expect(Math.abs(metricBoxes[0].y - metricBoxes[1].y)).toBeLessThanOrEqual(2);
    expect(Math.abs(metricBoxes[0].y - metricBoxes[2].y)).toBeLessThanOrEqual(2);
    expect(Math.abs(metricBoxes[0].width - metricBoxes[1].width)).toBeLessThanOrEqual(1);
    expect(Math.abs(metricBoxes[0].width - metricBoxes[2].width)).toBeLessThanOrEqual(1);
  }

  await expectElementBefore(page, "#project-directory", "#project-guide");
  await expectElementBefore(page, "#project-grid", "#project-guide");
  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD project discovery preserves restored decision context", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd?goal=portrait-shooting#projects", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBe(true);
  await expect(page.getByRole("dialog", { name: "CSTD 开场动画" })).toHaveCount(0);

  await expect(page.getByText("目标路径已恢复", { exact: true })).toBeVisible();
  await expectElementBefore(page, "#project-guide", "#project-directory");

  await page
    .getByRole("region", { name: "奶黄包摄影" })
    .getByRole("button", { name: "加入对比：奶黄包摄影" })
    .click();
  await expectElementBefore(page, "#project-guide", "#project-directory");
  await expectElementBefore(page, "#project-comparison", "#project-directory");
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
