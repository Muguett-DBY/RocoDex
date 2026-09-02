import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { captureBrowserIssues, expectNoHorizontalOverflow } from "./support/browser";

const worlds = [
  { id: "neon-district", title: { zh: "作品城 77", en: "PORTFOLIO//CITY 77" } },
  { id: "underworld-forge", title: { zh: "冥火作品神殿", en: "TEMPLE OF SHIPPED WORK" } },
  { id: "astral-covenant", title: { zh: "星骰作品群岛", en: "DICEBOUND PORTFOLIO ISLES" } },
] as const;

async function expectRenderedVoxelCanvas(page: Page) {
  const canvas = page.locator("[data-cstd-voxel-canvas]");
  await expect(canvas).toBeVisible();
  await expect(canvas).toHaveAttribute("data-cstd-voxel-color-span", /\d+/, { timeout: 20_000 });
  const signal = await canvas.evaluate((element) => ({
    span: Number((element as HTMLElement).dataset.cstdVoxelColorSpan),
    lit: Number((element as HTMLElement).dataset.cstdVoxelLitSamples),
    samples: Number((element as HTMLElement).dataset.cstdVoxelPixelSamples),
  }));
  expect(signal.span).toBeGreaterThan(18);
  expect(signal.lit).toBeGreaterThan(signal.samples * 0.08);
}

test("CSTD exposes a themed voxel-world invitation from its navigation", async ({ page, isMobile }) => {
  const browserIssues = captureBrowserIssues(page);
  await page.goto(isMobile ? "/cstd/about" : "/cstd", { waitUntil: "domcontentloaded" });
  const invitation = page.locator("[data-cstd-voxel-nav]:visible").first();
  await expect(invitation).toBeVisible();
  await expect(invitation).toHaveAccessibleName("算了，玩会我的世界吧");
  await invitation.click();
  await expect(page).toHaveURL(/\/cstd\/voxel$/);
  await expect(page.locator("[data-cstd-voxel-game]")).toHaveAttribute("data-cstd-voxel-ready", "true", { timeout: 20_000 });
  expect(browserIssues).toEqual([]);
});

test("CSTD renders three distinct playable voxel biomes without loading a blank canvas", async ({ page }) => {
  test.setTimeout(90_000);
  const browserIssues = captureBrowserIssues(page);
  for (const world of worlds) {
    await page.goto("/cstd", { waitUntil: "domcontentloaded" });
    await page.evaluate((theme) => window.localStorage.setItem("cstd-world-theme", theme), world.id);
    await page.goto("/cstd/voxel", { waitUntil: "domcontentloaded" });
    const game = page.locator("[data-cstd-voxel-game]");
    await expect(game).toHaveAttribute("data-cstd-voxel-ready", "true", { timeout: 20_000 });
    await expect(game).toHaveAttribute("data-cstd-voxel-theme", world.id);
    await expect(game).toHaveAttribute("data-cstd-voxel-landmark-count", "8");
    await expect(page.getByRole("heading", { level: 1, name: world.title.zh })).toBeVisible();
    await expect(page.locator('[role="toolbar"][aria-label="方块快捷栏"] button')).toHaveCount(5);
    await expectRenderedVoxelCanvas(page);
    await expectNoHorizontalOverflow(page);
  }
  expect(browserIssues).toEqual([]);
});

test("CSTD voxel world supports movement, block selection, editing, and local save", async ({ page, isMobile }) => {
  const browserIssues = captureBrowserIssues(page);
  await page.goto("/cstd/voxel", { waitUntil: "domcontentloaded" });
  const game = page.locator("[data-cstd-voxel-game]");
  await expect(game).toHaveAttribute("data-cstd-voxel-ready", "true", { timeout: 20_000 });
  const before = await game.getAttribute("data-cstd-voxel-block-count");

  await page.getByRole("button", { name: "进入作品世界" }).click();
  await expect(game).toHaveAttribute("data-cstd-voxel-active", "true");
  const positionBefore = await page.locator("[data-cstd-voxel-game] dd").first().textContent();

  if (isMobile) {
    const forward = page.getByRole("button", { name: "向前" });
    await expect(forward).toBeVisible();
    await page.keyboard.down("KeyW");
    await page.waitForTimeout(280);
    await page.keyboard.up("KeyW");
    await page.getByRole("button", { name: "晶体" }).click();
    await page.getByRole("button", { name: "挖掘方块" }).click();
  } else {
    await page.keyboard.press("Digit5");
    await expect(game).toHaveAttribute("data-cstd-voxel-selected", "crystal");
    await page.keyboard.down("KeyW");
    await page.waitForTimeout(280);
    await page.keyboard.up("KeyW");
    const canvas = page.locator("[data-cstd-voxel-canvas]");
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.click((box?.x ?? 0) + (box?.width ?? 0) / 2, (box?.y ?? 0) + (box?.height ?? 0) / 2);
    await page.keyboard.press("KeyP");
  }

  await expect.poll(async () => page.locator("[data-cstd-voxel-game] dd").first().textContent()).not.toBe(positionBefore);
  if (!isMobile) await expect(game).toHaveAttribute("data-cstd-voxel-active", "false");
  const after = await game.getAttribute("data-cstd-voxel-block-count");
  expect(Number(after)).toBeLessThanOrEqual(Number(before));
  await page.getByRole("button", { name: "保存世界" }).click();
  await expect(page.getByRole("status")).toContainText("世界已保存");
  expect(await page.evaluate(() => Boolean(window.localStorage.getItem("cstd-voxel-world-v2:neon-district")))).toBe(true);
  expect(browserIssues).toEqual([]);
});

test("CSTD voxel world turns the portfolio directory into navigable landmarks", async ({ page }) => {
  const browserIssues = captureBrowserIssues(page);
  await page.goto("/cstd/voxel", { waitUntil: "domcontentloaded" });
  const game = page.locator("[data-cstd-voxel-game]");
  await expect(game).toHaveAttribute("data-cstd-voxel-ready", "true", { timeout: 20_000 });

  await page.getByRole("button", { name: "城区索引" }).click();
  const directory = page.getByRole("dialog", { name: "城区索引" });
  await expect(directory).toBeVisible();
  await expect(directory.locator("[data-cstd-voxel-exhibit-link]")).toHaveCount(8);
  await page.getByRole("button", { name: /接入节点: CSTD Alpha 研究系统/ }).click();

  await expect(game).toHaveAttribute("data-cstd-voxel-active", "true");
  await expect(game).toHaveAttribute("data-cstd-voxel-focus", "alpha-research-system");
  await expect(page.locator("[data-cstd-voxel-proximity]")).toContainText("CSTD Alpha 研究系统");
  await page.keyboard.press("KeyE");
  await expect(page).toHaveURL(/\/cstd\/work\/alpha-research-system$/);
  expect(browserIssues).toEqual([]);
});

test("CSTD voxel world keeps English UI, compact geometry, and WCAG semantics", async ({ page }) => {
  await page.goto("/cstd/en/voxel", { waitUntil: "domcontentloaded" });
  const game = page.locator("[data-cstd-voxel-game]");
  await expect(game).toHaveAttribute("data-cstd-voxel-ready", "true", { timeout: 20_000 });
  await expect(page.getByRole("heading", { level: 1, name: "PORTFOLIO//CITY 77" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Enter portfolio world" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en-AU");
  await expectNoHorizontalOverflow(page);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations.map((violation) => ({ id: violation.id, targets: violation.nodes.map((node) => node.target) }))).toEqual([]);
});
