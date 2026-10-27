import { expect, test } from "@playwright/test";
import { captureBrowserIssues, expectNoHorizontalOverflow } from "./support/browser";

const schoolNames = /monash|莫纳什|university of sydney|悉尼大学|FIT\d{4}/i;
const doctoralStatements = /博士|博\s*0|\bph\.?\s*d\.?\b|doctoral|doctorate|year[\s-]*zero/i;

for (const locale of ["zh", "en"] as const) {
  test(`CSTD ${locale} public profile and resume disclose fields of study without schools`, async ({ page, request }) => {
    const issues = captureBrowserIssues(page);
    const prefix = locale === "en" ? "/en" : "";
    for (const path of [prefix || "/", `${prefix}/about`, `${prefix}/resume`, `${prefix}/now`]) {
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);
      const html = await response!.text();
      expect(html).not.toMatch(schoolNames);
      expect(html).not.toMatch(doctoralStatements);
      await expect(page.locator("html")).toHaveAttribute("lang", locale === "zh" ? "zh-CN" : "en-AU");
      // 首页同时常驻 editorial <main> 与游戏壳 <main>（互斥 display 规则只暴露一个），收窄到可见地标
      const main = page.locator("main:visible");
      await expect(main).toContainText(locale === "zh" ? "数据" : /data/i);
      await expect(main).not.toContainText(doctoralStatements);
      await expect(main).not.toContainText(/Melbourne, Australia|墨尔本，澳大利亚/);
      await expectNoHorizontalOverflow(page);
    }
    const resume = await (await request.get(`${prefix}/resume.json`)).json();
    expect(resume.schemaVersion).toBe(2);
    expect(JSON.stringify(resume)).not.toMatch(schoolNames);
    expect(JSON.stringify(resume)).not.toMatch(doctoralStatements);
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
  await expect(page.locator("[data-cstd-home-editorial] .title-role")).toContainText("数据科学 · 产品开发");
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
