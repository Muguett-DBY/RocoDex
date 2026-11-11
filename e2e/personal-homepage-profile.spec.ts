import { expect, test } from "@playwright/test";
import { captureBrowserIssues, expectNoHorizontalOverflow } from "./support/browser";

const schoolNames = /monash|莫纳什|university of sydney|悉尼大学|FIT\d{4}/i;
const outdatedDoctoralStatus = /博\s*0|博士零年级|year[\s-]*(?:0\b|zero\b)|preparing for doctoral study/i;

for (const locale of ["zh", "en"] as const) {
  test(`CSTD ${locale} public profile and resume disclose fields of study without schools`, async ({ page, request }) => {
    const issues = captureBrowserIssues(page);
    const prefix = locale === "en" ? "/en" : "";
    const title = locale === "zh" ? "人工智能博士研究生" : "PhD Researcher in Artificial Intelligence";
    const stage = locale === "zh" ? "博士在读" : "PhD research";
    const research = locale === "zh" ? "智能体可靠性评估" : "AI agent reliability";
    for (const path of [prefix || "/", `${prefix}/about`, `${prefix}/resume`, `${prefix}/now`]) {
      const response = await page.goto(path === "/" ? "/zh" : path, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);
      const html = await response!.text();
      expect(html).not.toMatch(schoolNames);
      expect(html).not.toMatch(outdatedDoctoralStatus);
      await expect(page.locator("html")).toHaveAttribute("lang", locale === "zh" ? "zh-CN" : "en-AU");
      // 首页同时常驻 editorial <main> 与游戏壳 <main>（互斥 display 规则只暴露一个），收窄到可见地标
      const main = page.locator("main:visible");
      await expect(main).toContainText(research);
      if (!path.endsWith("/now")) {
        await expect(main).toContainText(title);
        if (path.endsWith("/about") || path.endsWith("/resume")) await expect(main).toContainText(stage);
      }
      await expect(main).not.toContainText(/Melbourne, Australia|墨尔本，澳大利亚/);
      await expectNoHorizontalOverflow(page);
    }
    const resume = await (await request.get(`${prefix}/resume.json`)).json();
    expect(resume.schemaVersion).toBe(2);
    expect(resume.person.title).toBe(title);
    expect(JSON.stringify(resume)).not.toMatch(schoolNames);
    expect(JSON.stringify(resume)).not.toMatch(outdatedDoctoralStatus);
    expect(resume.education).toContainEqual(expect.objectContaining({
      stage,
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
  await expect(page.getByRole("heading", { name: "人工智能博士研究生", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "切换到英文", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en-AU");
  const root = await page.request.get("/", { headers: { "accept-language": "zh-CN" }, maxRedirects: 0 });
  expect(root.status()).toBe(302);
  expect(root.headers().location).toBe("/en");
});

test("CSTD defaults to English for every browser language and retains an explicit Chinese home", async ({ page, request }) => {
  for (const language of ["zh-CN,zh;q=0.9,en;q=0.8", "en-AU,en;q=0.9"]) {
    const response = await request.get("/", { headers: { "accept-language": language }, maxRedirects: 0 });
    expect(response.status()).toBe(302);
    expect(response.headers().location).toBe("/en");
    expect(response.headers()["set-cookie"]).toBeUndefined();
  }
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en-AU");
  await page.getByRole("link", { name: "Switch to Chinese", exact: true }).click();
  await expect(page).toHaveURL(/\/zh$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
});
