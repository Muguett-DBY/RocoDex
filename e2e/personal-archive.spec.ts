import { expect, test } from "@playwright/test";

test.describe("CSTD technical archive", () => {
  test("ships navigable bilingual work and note archives", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/cstd/work");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("作品不是截图");
    await expect(page.locator('a[href="/work/rocodex-platform"]')).toBeVisible();
    await expect(page.locator("main article")).toHaveCount(6);

    await page.goto("/cstd/work/alpha-research-system");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("CSTD Alpha");
    await expect(page.getByText("PROOF LEDGER / 交付证据")).toBeVisible();
    const structuredData = page.locator('script[type="application/ld+json"]');
    await expect(structuredData).toHaveCount(1);
    const structuredValue = JSON.parse((await structuredData.textContent()) ?? "null");
    expect(structuredValue).toHaveLength(2);

    await page.goto("/cstd/notes");
    await expect(page.locator("main article")).toHaveCount(8);
    await page.goto("/cstd/notes/host-boundaries-in-one-next-deployment");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("一个 Next.js 部署");
    await expect(page.getByText("expect(crossSiteImports).toEqual([])")).toBeVisible();

    await page.goto("/cstd/en");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Systems that run");
    await expect(page.getByRole("link", { name: "ALL CASE STUDIES" })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("keeps the source-constrained guide grounded and willing to refuse", async ({ page }) => {
    await page.goto("/cstd/work");
    await page.getByRole("button", { name: "技术向导" }).click();
    await page.getByRole("button", { name: "你的双站架构怎么隔离？" }).click();
    const result = page.locator("[data-cstd-guide-result]");
    await expect(result).toContainText("Host 决策");
    await expect(result.getByRole("link", { name: "双站架构边界" })).toBeVisible();

    const input = page.getByLabel("问一个具体技术问题…");
    await input.fill("请告诉我明天悉尼的天气");
    await input.press("Enter");
    await expect(result).toContainText("不会用猜测补齐答案");
    await expect(result.getByText("来源")).toHaveCount(0);
  });

  test("runs deterministic data and stale-agent experiments", async ({ page }) => {
    await page.goto("/cstd/lab/data-lens");
    const values = page.locator('[data-cstd-lab="data-lens"] dl dd');
    const before = await values.allTextContents();
    const growthControl = page.getByLabel("现金流增长");
    await growthControl.focus();
    await growthControl.press("ArrowRight");
    await expect(page.locator('[data-cstd-control-value="growth"]')).toHaveText("6.5%");
    const after = await values.allTextContents();
    expect(after).not.toEqual(before);
    await expect(page.getByText("不构成投资建议")).toBeVisible();

    await page.goto("/cstd/lab/agent-replay");
    await page.getByRole("checkbox", { name: "在综合阶段注入一个更新任务" }).check();
    const next = page.getByRole("button", { name: "下一步" });
    for (let index = 0; index < 4; index += 1) await next.click();
    await expect(page.getByText(/发布被拒绝：令牌 042/)).toBeVisible();
  });

  test("renders motion under reduced-motion emulation without horizontal overflow", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const path of ["/cstd/work", "/cstd/notes", "/cstd/lab", "/cstd/about", "/cstd/resume"]) {
      await page.goto(path);
      await expect(page.locator("[data-cstd-signal-field]")).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${path} should not overflow horizontally`).toBeLessThanOrEqual(1);
    }

    await page.goto("/cstd/lab/render-lab");
    await expect(page.locator("[data-cstd-render-fps]")).not.toHaveText("--");
    const canvasHasSignal = await page.locator('[data-cstd-lab="render-lab"] canvas').evaluate((canvas: HTMLCanvasElement) => {
      const context = canvas.getContext("2d");
      if (!context || canvas.width === 0 || canvas.height === 0) return false;
      return context.getImageData(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1).data[3] > 0;
    });
    expect(canvasHasSignal).toBe(true);
  });

  test("serves clean host routes, RSS, and personal security headers", async ({ request }) => {
    const pageResponse = await request.get("/work", { headers: { host: "custard.top" } });
    expect(pageResponse.status()).toBe(200);
    expect(pageResponse.headers()["x-frame-options"]).toBe("DENY");
    expect(pageResponse.headers()["x-content-type-options"]).toBe("nosniff");
    expect(pageResponse.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");

    const rssResponse = await request.get("/rss.xml?lang=en", { headers: { host: "custard.top" } });
    expect(rssResponse.status()).toBe(200);
    expect(rssResponse.headers()["content-type"]).toContain("application/rss+xml");
    expect(await rssResponse.text()).toContain("https://custard.top/en/notes/host-boundaries-in-one-next-deployment");
  });
});
