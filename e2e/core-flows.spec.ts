import { randomUUID } from "node:crypto";
import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

const usersFile = path.join(process.cwd(), "data", "users.json");

function captureBrowserIssues(page: Page) {
  const issues: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "warning" || message.type() === "error") {
      const text = message.text();
      if (text.includes("GL Driver Message") && text.includes("GPU stall due to ReadPixels")) return;
      if (text.includes("You have Reduced Motion enabled on your device")) return;
      issues.push(`${message.type()}: ${text}`);
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

test("CSTD presents an immersive WebGL world with selective proof", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  await expect(page.getByRole("heading", { level: 1, name: "CSTD" })).toBeVisible();
  await expect(page.getByRole("link", { name: "进入系统章节" })).toHaveAttribute("href", "#systems");
  await expect(page.locator("[data-cstd-kinetic-world]")).toBeVisible();
  await expect(page.locator("[data-cstd-elastic-archive]")).toBeVisible();
  await expect(page.locator("[data-cstd-webgl]")).toBeVisible();
  await expect(page.locator("[data-cstd-webgl]")).toHaveAttribute("data-cstd-render-ready", "true");
  await expect(page.locator("[data-cstd-webgl-canvas]")).toBeVisible();
  await expect(page.locator('[data-cstd-system]')).toHaveCount(5);
  await expect(page.locator('[data-cstd-proof]')).toHaveCount(3);
  await expect(page.locator('[data-cstd-project-plane]')).toHaveCount(3);
  await expect(page.locator('[data-cstd-live-object]')).toHaveCount(2);

  for (const title of [
    "可用的产品表面",
    "边缘与业务系统",
    "AI 创作与研究工具",
    "研究与可解释模型",
    "数据流与计算研究",
  ]) {
    await expect(page.getByText(title, { exact: true })).toHaveCount(1);
  }

  for (const title of ["洛克图鉴 / RocoDex", "CSTD Alpha", "产业园区招商 CRM"]) {
    await expect(page.getByRole("heading", { level: 3, name: title })).toHaveCount(1);
  }

  await expect(page.getByRole("searchbox")).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByText("项目对比", { exact: true })).toHaveCount(0);
  await expect(page.getByText("按目标找项目", { exact: true })).toHaveCount(0);
  await expect(page.getByText("加入对比", { exact: false })).toHaveCount(0);

  for (const asset of [
    "cstd-kinetic-studio-v2",
    "cstd-data-loom-v2",
  ]) {
    const assetResponse = await page.request.get(`/cstd-world/${asset}.webp`);
    expect(assetResponse.ok()).toBe(true);
    expect(assetResponse.headers()["content-type"]).toContain("image/webp");
  }

  const canvasImage = await page.locator("[data-cstd-webgl-canvas]").screenshot();
  expect(canvasImage.byteLength).toBeGreaterThan(20_000);

  for (const id of ["product-surfaces", "edge-operations", "ai-creation", "research-models", "data-systems"]) {
    const system = page.locator(`[data-cstd-system="${id}"]`);
    await system.scrollIntoViewIfNeeded();
    await expect(system).toBeVisible();
  }

  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD navigation moves through the narrative and keeps proof links safe", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  const navigation = page.getByRole("navigation", { name: "主导航" });
  await expect(navigation.getByRole("link")).toHaveCount(3);
  await navigation.getByRole("link", { name: "系统" }).click();
  await expect(page).toHaveURL(/#systems$/);
  await expect(page.locator("#systems")).toBeInViewport({ ratio: 0.2 });

  const expectedLinks = [
    ["rocodex", "打开图鉴", "https://rocodex.custard.top"],
    ["alpha", "打开 Alpha", "https://alpha.custard.top"],
    ["crm", "打开 CRM", "https://cfzzs.custard.top"],
  ] as const;

  for (const [id, label, href] of expectedLinks) {
    const link = page.locator(`[data-cstd-proof="${id}"]`).getByRole("link", { name: label });
    await expect(link).toHaveAttribute("href", href);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noreferrer");
  }

  for (const id of ["photography", "design"]) {
    const link = page.locator(`[data-cstd-live-object="${id}"]`).getByRole("link");
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noreferrer");
  }

  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD composes its chapters as one kinetic studio", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "Desktop covers the full chapter rail and sticky research composition.");

  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  const header = page.locator("[data-cstd-header-theme]");
  await expect(header).toHaveAttribute("data-cstd-header-theme", "hero");

  const signalStrip = page.locator("[data-cstd-signal-strip]");
  await expect(signalStrip).toBeVisible();
  const signalTracks = page.locator("[data-cstd-signal-track]");
  await expect(signalTracks).toHaveCount(2);
  const initialSignalTransform = await signalTracks.first().evaluate((element) =>
    getComputedStyle(element).transform,
  );
  const reducedMotion = await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const signalTransform = expect.poll(() =>
    signalTracks.first().evaluate((element) => getComputedStyle(element).transform),
  );
  if (reducedMotion) {
    await signalTransform.toBe(initialSignalTransform);
  } else {
    await signalTransform.not.toBe(initialSignalTransform);
  }

  for (const chapter of ["systems", "proof", "path"] as const) {
    await page.locator(`#${chapter}`).evaluate((element) =>
      element.scrollIntoView({ block: "center" }),
    );
    await expect
      .poll(() => header.getAttribute("data-cstd-header-theme"))
      .toBe(chapter);
    await page.locator(`#${chapter}-heading`).evaluate((element) =>
      element.scrollIntoView({ block: "center" }),
    );
    await expect(page.locator(`#${chapter}-heading`)).toBeInViewport();
  }

  await page.locator("#path").evaluate((element) => {
    window.scrollTo({ top: element.offsetTop + element.offsetHeight - window.innerHeight, behavior: "auto" });
  });
  await expect
    .poll(() => page.locator("[data-cstd-research-state]").getAttribute("data-cstd-research-state"))
    .toBe("2026");

  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD system stage responds to deliberate exploration", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "Desktop covers the sticky material stage.");

  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd#systems", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  const chapterNavigation = page.getByRole("navigation", { name: "章节导航" });
  await expect(chapterNavigation.getByRole("link")).toHaveCount(3);

  const dataSystem = page.locator('[data-cstd-system="data-systems"]');
  await dataSystem.scrollIntoViewIfNeeded();
  await dataSystem.focus();
  await expect(dataSystem).toHaveAttribute("data-cstd-system-active", "true");
  await expect(page.locator('[data-cstd-system-visual="data-systems"]')).toBeVisible();

  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD WebGL field, cursor, and project planes respond to deliberate input", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "Pointer choreography is intentionally a fine-pointer enhancement.");
  test.skip(Boolean(process.env.CI), "Hardware WebGL choreography is covered by local and production Chrome acceptance.");

  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  const hero = page.locator("[data-cstd-hero]");
  const canvas = page.locator("[data-cstd-webgl-canvas]");
  const pointerField = page.locator("[data-cstd-pointer-field]");
  await expect(page.locator("[data-cstd-webgl]")).toHaveAttribute("data-cstd-render-ready", "true");
  const heroBounds = await hero.boundingBox();
  expect(heroBounds).not.toBeNull();
  const initialPointerTransform = await pointerField.evaluate((element) => getComputedStyle(element).transform);
  const initialCanvas = await canvas.screenshot();
  await page.mouse.move(heroBounds!.x + heroBounds!.width * 0.86, heroBounds!.y + heroBounds!.height * 0.72, { steps: 8 });
  await page.mouse.down();
  await page.waitForTimeout(160);
  await page.mouse.up();
  await expect
    .poll(() => pointerField.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(initialPointerTransform);
  const activeCanvas = await canvas.screenshot();
  expect(activeCanvas.equals(initialCanvas)).toBe(false);

  const alphaPlane = page.locator('[data-cstd-project-plane="alpha"]');
  await alphaPlane.scrollIntoViewIfNeeded();
  await page.mouse.move(8, 8);
  await page.waitForTimeout(800);
  const initialClipPath = await alphaPlane.evaluate((element) => getComputedStyle(element).clipPath);
  await alphaPlane.hover();
  await expect
    .poll(() => alphaPlane.evaluate((element) => getComputedStyle(element).clipPath))
    .not.toBe(initialClipPath);

  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD keeps the cinematic field still when reduced motion is requested", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "One browser profile is sufficient for reduced-motion semantics.");

  await page.emulateMedia({ reducedMotion: "reduce" });
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  await expect(page.locator("[data-cstd-pointer-field]")).toBeHidden();

  const signalTrack = page.locator("[data-cstd-signal-track]").first();
  const initialSignalTransform = await signalTrack.evaluate((element) =>
    getComputedStyle(element).transform,
  );
  await page.waitForTimeout(450);
  await expect
    .poll(() => signalTrack.evaluate((element) => getComputedStyle(element).transform))
    .toBe(initialSignalTransform);

  const canvas = page.locator("[data-cstd-webgl-canvas]");
  await expect(page.locator("[data-cstd-webgl]")).toHaveAttribute("data-cstd-render-ready", "true");
  await page.waitForTimeout(100);
  const firstFrame = await canvas.screenshot();
  await page.waitForTimeout(450);
  const secondFrame = await canvas.screenshot();
  expect(secondFrame.equals(firstFrame)).toBe(true);

  await expectNoHorizontalOverflow(page);
  expect(browserIssues).toEqual([]);
});

test("CSTD does not revive gallery index or playful click-through interactions", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);
  const response = await page.goto("/cstd#path", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);

  await expect(page.getByRole("navigation", { name: "作品索引" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "再碰一下奶黄包" })).toHaveCount(0);
  await expect(page.locator('[data-cstd-project]')).toHaveCount(0);
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
