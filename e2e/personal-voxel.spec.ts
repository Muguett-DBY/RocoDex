import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { captureBrowserIssues, expectNoHorizontalOverflow } from "./support/browser";

const worlds = [
  { id: "neon-district", title: { zh: "方块城 77", en: "BLOCK//CITY 77" } },
  { id: "underworld-forge", title: { zh: "冥火采石场", en: "ASHEN QUARRY" } },
  { id: "astral-covenant", title: { zh: "星骰浮岛", en: "DICEBOUND ISLES" } },
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
    await expect(page.getByRole("heading", { level: 1, name: world.title.zh })).toBeVisible();
    await expect(page.getByRole("toolbar", { name: "方块快捷栏" }).getByRole("button")).toHaveCount(5);
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

  await page.getByRole("button", { name: "进入世界" }).click();
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
  expect(await page.evaluate(() => Boolean(window.localStorage.getItem("cstd-voxel-world-v1:neon-district")))).toBe(true);
  expect(browserIssues).toEqual([]);
});

test("CSTD voxel world keeps English UI, compact geometry, and WCAG semantics", async ({ page }) => {
  await page.goto("/cstd/en/voxel", { waitUntil: "domcontentloaded" });
  const game = page.locator("[data-cstd-voxel-game]");
  await expect(game).toHaveAttribute("data-cstd-voxel-ready", "true", { timeout: 20_000 });
  await expect(page.getByRole("heading", { level: 1, name: "BLOCK//CITY 77" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Enter world" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en-AU");
  await expectNoHorizontalOverflow(page);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations.map((violation) => ({ id: violation.id, targets: violation.nodes.map((node) => node.target) }))).toEqual([]);
});
