import { expect, test } from "@playwright/test";

test.describe("CSTD technical archive", () => {
  test("ships navigable bilingual work and note archives", async ({ page }) => {
    test.setTimeout(90_000);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/cstd/work");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("作品不是截图");
    await expect(page.locator('a[href="/work/rocodex-platform"]')).toBeVisible();
    await expect(page.locator("main article")).toHaveCount(6);

    await page.goto("/cstd/work/alpha-research-system");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("CSTD Alpha");
    await expect(page.getByText("PROOF LEDGER / 交付证据")).toBeVisible();
    await expect(page.locator("[data-cstd-case-film]")).toBeVisible();
    await expect(page.locator("[data-cstd-film-beat]")).toHaveCount(5);
    await page.locator("[data-cstd-film-beat]").nth(2).getByRole("button").click();
    await expect(page.locator("[data-cstd-case-film]")).toHaveAttribute("data-cstd-case-film-active-beat", "fingerprint-first");
    await expect(page.locator('[data-cstd-proof-mesh-size="case"] [data-cstd-proof-node]')).toHaveCount(1);
    await expect(page.locator("[data-cstd-evidence-graph]")).toBeVisible();
    expect(await page.locator("[data-cstd-evidence-graph]").getByRole("link").count()).toBeGreaterThanOrEqual(6);
    const structuredData = page.locator('script[type="application/ld+json"]');
    await expect(structuredData).toHaveCount(1);
    const structuredValue = JSON.parse((await structuredData.textContent()) ?? "null");
    expect(structuredValue).toHaveLength(2);

    await page.goto("/cstd/notes");
    await expect(page.locator("main article")).toHaveCount(8);
    await page.goto("/cstd/notes/host-boundaries-in-one-next-deployment");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("一个 Next.js 部署");
    await expect(page.locator("pre")).toContainText("crossSiteImports");
    await expect(page.getByRole("button", { name: "复制代码" })).toBeVisible();
    await expect(page.getByRole("button", { name: "复制引用" })).toBeVisible();

    await page.goto("/cstd/en");
    await expect(page.getByRole("heading", { level: 1, name: "Custard" })).toBeVisible();
    await expect(page.locator("[data-cstd-hero-thesis]")).toContainText("Compile complex problems");
    await expect(page.getByRole("link", { name: "View selected work" })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("keeps the source-constrained knowledge lens grounded and inspectable", async ({ page }) => {
    await page.goto("/cstd", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-cstd-kinetic-world]")).toHaveAttribute("data-cstd-enhancements-ready", "true");
    const lens = page.locator("[data-cstd-knowledge-lens]");
    await expect(lens).toBeVisible();
    await expect(lens.locator("[data-cstd-knowledge-card]")).toHaveCount(3);
    await expect(lens.getByRole("heading", { name: "你的双站架构怎么隔离？" })).toBeVisible();
    await expect(lens).toContainText("真正独立");
    await expect(lens.getByText("SOURCE LINKED", { exact: true })).toHaveCount(3);
    await expect(lens.getByRole("link", { name: "阅读来源" }).first()).toHaveAttribute("href", "/work/rocodex-platform");
    await expect(lens.getByRole("button")).toHaveCount(0);
    await expect(lens.getByRole("textbox")).toHaveCount(0);
  });

  test("explores the global knowledge graph without dead-end nodes", async ({ page }) => {
    await page.goto("/cstd/map");
    const graph = page.locator("[data-cstd-knowledge-constellation]");
    await expect(graph).toBeVisible();
    expect(await graph.locator("[data-cstd-graph-node]").count()).toBeGreaterThanOrEqual(25);
    await graph.getByRole("button", { name: "实验", exact: true }).click();
    await expect(graph).toHaveAttribute("data-cstd-graph-filter", "lab");
    const agentNode = graph.locator('[data-cstd-graph-node="lab:agent-replay"]');
    await agentNode.click();
    await expect(agentNode).toHaveAttribute("aria-pressed", "true");
    await expect(graph.getByRole("link", { name: /OPEN NODE/ })).toHaveAttribute("href", "/lab/agent-replay");
  });

  test("runs deterministic data and stale-agent experiments", async ({ page }) => {
    await page.goto("/cstd/lab/data-lens");
    const values = page.locator('[data-cstd-lab="data-lens"] dl dd');
    const before = await values.allTextContents();
    const growthControl = page.getByRole("slider", { name: "现金流增长" });
    await growthControl.focus();
    await growthControl.press("ArrowRight");
    await expect(page.locator('[data-cstd-control-value="growth"]')).toHaveText("6.5%");
    const after = await values.allTextContents();
    expect(after).not.toEqual(before);
    await expect(page.getByText("不构成投资建议")).toBeVisible();
    await expect(page.locator("[data-cstd-dcf-sensitivity] button")).toHaveCount(26);
    await page.locator("[data-cstd-dcf-sensitivity] button").nth(7).click();

    await page.goto("/cstd/lab/agent-replay");
    await page.getByRole("checkbox", { name: "在综合阶段注入一个更新任务" }).check();
    const next = page.getByRole("button", { name: "下一步" });
    for (let index = 0; index < 4; index += 1) await next.click();
    await expect(page.getByText(/发布被拒绝：令牌 042/)).toBeVisible();
    await page.getByRole("button", { name: "注入并发编辑" }).click();
    await page.getByRole("button", { name: "提交草稿" }).click();
    await expect(page.locator("[data-cstd-conflict-forge]")).toHaveAttribute("data-cstd-conflict-state", "conflict");
    await expect(page.getByText("409 VERSION CONFLICT", { exact: true })).toBeVisible();

    await page.goto("/cstd/lab/system-trace");
    await page.getByLabel("HOST").fill("rocodex.custard.top");
    await expect(page.locator("[data-cstd-route-decision]")).toHaveAttribute("data-cstd-route-decision", "next");
    await page.getByLabel("HOST").fill("custard.top");
    await page.getByLabel("PATH").fill("/work/rocodex-platform");
    await expect(page.locator("[data-cstd-route-decision]")).toHaveAttribute("data-cstd-route-decision", "rewrite");

    await page.goto("/cstd/lab/proof-museum");
    const museum = page.locator("[data-cstd-proof-museum]");
    await expect(museum).toHaveAttribute("data-cstd-capsules", "4");
    await museum.getByRole("tab", { name: /业务记录乐观锁/ }).click();
    const crmReplay = museum.locator('[data-cstd-case-replay="crm-lock"]');
    await expect(crmReplay).toHaveAttribute("data-cstd-worker-ready", "true");
    await crmReplay.getByRole("button", { name: "运行重放" }).click();
    await expect(crmReplay.getByText("CONFLICT RETURNED EXPLICITLY", { exact: true })).toBeVisible();
  });

  test("connects curated topics to cases, notes, and executable labs", async ({ page }) => {
    await page.goto("/cstd/topics");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("工程判断");
    await expect(page.locator('a[href="/topics/system-boundaries"]')).toBeVisible();
    await page.goto("/cstd/topics/system-boundaries");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("系统边界");
    await expect(page.getByRole("link", { name: /RocoDex 双站平台/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Proof Museum/ })).toBeVisible();
    await expect(page.locator("[data-cstd-topic-path]")).toContainText("01 / 05");
  });

  test("renders motion under reduced-motion emulation without horizontal overflow", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const path of ["/cstd/work", "/cstd/notes", "/cstd/lab", "/cstd/topics", "/cstd/map", "/cstd/about", "/cstd/resume"]) {
      await page.goto(path);
      await expect(page.locator("[data-cstd-signal-field]")).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${path} should not overflow horizontally`).toBeLessThanOrEqual(1);
    }

    await page.goto("/cstd/lab/render-lab");
    await expect(page.locator("[data-cstd-render-fps]")).not.toHaveText("--");
    await expect(page.locator("[data-cstd-runtime-diagnostics]")).toContainText(/WEBGL|IMAGE/);
    const canvasHasSignal = await page.locator('[data-cstd-lab="render-lab"] canvas').evaluate((canvas: HTMLCanvasElement) => {
      const context = canvas.getContext("2d");
      if (!context || canvas.width === 0 || canvas.height === 0) return false;
      return context.getImageData(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1).data[3] > 0;
    });
    expect(canvasHasSignal).toBe(true);
  });

  test("serves clean host routes, RSS, and personal security headers", async ({ request }) => {
    test.setTimeout(120_000);
    const headers = { host: "custard.top" };
    const pageResponse = await request.get("/work", { headers });
    expect(pageResponse.status()).toBe(200);
    expect(pageResponse.headers()["x-frame-options"]).toBe("DENY");
    expect(pageResponse.headers()["x-content-type-options"]).toBe("nosniff");
    expect(pageResponse.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");

    for (const asset of ["ink-scroll-v1.webp", "press-room-v1.webp", "pixel-quest-v1.webp"]) {
      const themeAssetResponse = await request.get(`/cstd-themes/${asset}`, { headers });
      expect(themeAssetResponse.status()).toBe(200);
      expect(themeAssetResponse.headers()["content-type"]).toContain("image/webp");
      expect(themeAssetResponse.headers()["cache-control"]).toContain("immutable");
    }

    for (const asset of ["neon-alloy-v1.webp", "ink-xuan-v1.webp", "press-newsprint-v1.webp", "pixel-circuit-v1.webp"]) {
      const materialResponse = await request.get(`/cstd-materials/${asset}`, { headers });
      expect(materialResponse.status()).toBe(200);
      expect(materialResponse.headers()["content-type"]).toContain("image/webp");
      expect(materialResponse.headers()["cache-control"]).toContain("immutable");
    }

    for (const asset of ["neon-display-v1.woff2", "ink-display-v1.woff2", "ink-text-v1.woff2", "press-latin-v1.woff2", "press-serif-v1.woff2", "pixel-text-12-v1.woff2", "pixel-label-10-v1.woff2"]) {
      const fontResponse = await request.get(`/fonts/cstd/${asset}`, { headers });
      expect(fontResponse.status()).toBe(200);
      expect(fontResponse.headers()["content-type"]).toContain("font/woff2");
      expect(fontResponse.headers()["cache-control"]).toContain("immutable");
    }

    const rssResponse = await request.get("/rss.xml?lang=en", { headers });
    expect(rssResponse.status()).toBe(200);
    expect(rssResponse.headers()["content-type"]).toContain("application/rss+xml");
    expect(await rssResponse.text()).toContain("https://custard.top/en/notes/host-boundaries-in-one-next-deployment");

    const resumeResponse = await request.get("/resume.json", { headers });
    expect(resumeResponse.status()).toBe(200);
    expect(resumeResponse.headers()["content-type"]).toContain("application/json");
    const resume = await resumeResponse.json();
    expect(resume.capabilities).toHaveLength(5);
    expect(resume.timeline.length).toBeGreaterThanOrEqual(6);

    const proofResponse = await request.get("/proof.json", { headers });
    expect(proofResponse.status()).toBe(200);
    expect(proofResponse.headers()["content-type"]).toContain("application/json");
    const proof = await proofResponse.json();
    expect(proof.release).toBe("CSTD-17.0");
    expect(proof.entries).toHaveLength(6);
    expect(proof.totals.artifacts).toBeGreaterThanOrEqual(20);

    const graphResponse = await request.get("/graph.json", { headers });
    expect(graphResponse.status()).toBe(200);
    expect((await graphResponse.json()).nodes.length).toBeGreaterThanOrEqual(29);

    const statusResponse = await request.get("/status.json", { headers });
    expect(statusResponse.status()).toBe(200);
    expect((await statusResponse.json()).districts).toHaveLength(5);

    const studioResponse = await request.get("/studio.json", { headers });
    expect(studioResponse.status()).toBe(200);
    expect((await studioResponse.json()).provenance.contract).toBe("cstd.studio-snapshot/v3");

    const observatoryResponse = await request.get("/observatory.json", { headers });
    expect(observatoryResponse.status()).toBe(200);
    expect((await observatoryResponse.json()).provenance.contract).toBe("cstd.engineering-observatory/v2");

    const healthResponse = await request.get("/content-health.json", { headers });
    expect(healthResponse.status()).toBe(200);
    expect((await healthResponse.json()).score).toBe(100);

    const performanceResponse = await request.get("/performance.json", { headers });
    expect(performanceResponse.status()).toBe(200);
    expect((await performanceResponse.json()).budgets.sceneAssetBytes).toBe(320_000);

    const experienceResponse = await request.get("/experience.json", { headers });
    expect(experienceResponse.status()).toBe(200);
    expect((await experienceResponse.json()).acts).toHaveLength(6);

    const securityResponse = await request.get("/.well-known/security.txt", { headers });
    expect(securityResponse.status()).toBe(200);
    expect(await securityResponse.text()).toContain("Contact: mailto:cstd@custard.top");
  });
});
