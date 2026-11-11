import { expect, test } from "@playwright/test";
import { captureBrowserIssues, expectNoHorizontalOverflow } from "./support/browser";

const schoolNames = /monash|莫纳什|university of sydney|悉尼大学|FIT\d{4}/i;
const outdatedDoctoralStatus = /博\s*0|博士零年级|year[\s-]*(?:0\b|zero\b)|preparing for doctoral study/i;

for (const locale of ["zh", "en"] as const) {
  test(`CSTD ${locale} public profile and resume disclose fields of study without schools`, async ({ page, request }) => {
    const issues = captureBrowserIssues(page);
    const prefix = locale === "en" ? "/en" : "";
    const studyStatus = locale === "zh"
      ? /攻读人工智能方向的博士学位|博士在读（第一年）|读博期间/
      : /pursuing a PhD in artificial intelligence|Artificial Intelligence · PhD Year 1|Alongside my PhD/i;
    for (const path of [prefix || "/", `${prefix}/about`, `${prefix}/resume`, `${prefix}/now`]) {
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);
      const html = await response!.text();
      expect(html).not.toMatch(schoolNames);
      expect(html).not.toMatch(outdatedDoctoralStatus);
      await expect(page.locator("html")).toHaveAttribute("lang", locale === "zh" ? "zh-CN" : "en-AU");
      // 首页同时常驻 editorial <main> 与游戏壳 <main>（互斥 display 规则只暴露一个），收窄到可见地标
      const main = page.locator("main:visible");
      await expect(main).toContainText(locale === "zh" ? "数据" : /data/i);
      await expect(main).toContainText(studyStatus);
      await expect(main).not.toContainText(/Melbourne, Australia|墨尔本，澳大利亚/);
      await expectNoHorizontalOverflow(page);
    }
    const resume = await (await request.get(`${prefix}/resume.json`)).json();
    expect(resume.schemaVersion).toBe(2);
    expect(JSON.stringify(resume)).not.toMatch(schoolNames);
    expect(JSON.stringify(resume)).not.toMatch(outdatedDoctoralStatus);
    expect(resume.education).toContainEqual(expect.objectContaining({
      stage: locale === "zh" ? "博士在读（第一年）" : "PhD Year 1",
      field: locale === "zh" ? "人工智能" : "Artificial Intelligence",
    }));
    expect(resume.person).not.toHaveProperty("location");
    expect(resume.education.every((entry: Record<string, unknown>) => !("school" in entry) && !("period" in entry))).toBe(true);
    expect(issues).toEqual([]);
  });
}

test("CSTD language links select static pages while the root remains cacheable", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  const switcher = page.getByRole("link", { name: "Switch to Chinese", exact: true });
  await switcher.hover();
  await switcher.click();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.locator("[data-cstd-home-editorial] .title-role")).toContainText("人工智能 · 博士在读（第一年）");
  await page.getByRole("link", { name: "切换到英文", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en-AU");
  const root = await page.request.get("/", { headers: { "accept-language": "en-AU" }, maxRedirects: 0 });
  expect(root.status()).toBe(200);
  expect(root.headers()["content-language"]).toBe("zh-CN");
  expect(root.headers()["cache-control"]).not.toContain("private");
});

test("CSTD root serves the same static document for every browser language", async ({ request }) => {
  for (const language of ["zh-CN,zh;q=0.9,en;q=0.8", "en-AU,en;q=0.9"]) {
    const response = await request.get("/", { headers: { "accept-language": language }, maxRedirects: 0 });
    expect(response.status()).toBe(200);
    expect(response.headers()["content-language"]).toBe("zh-CN");
    expect(response.headers()["set-cookie"]).toBeUndefined();
  }
});
