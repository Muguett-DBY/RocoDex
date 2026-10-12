import { expect, test } from "@playwright/test";
import { captureBrowserIssues, expectNoHorizontalOverflow } from "./support/browser";

const schoolNames = /monash|莫纳什|university of sydney|悉尼大学|FIT\d{4}/i;

for (const locale of ["zh", "en"] as const) {
  test(`CSTD ${locale} public profile and resume disclose fields of study without schools`, async ({ page, request }) => {
    const issues = captureBrowserIssues(page);
    const prefix = locale === "en" ? "/cstd/en" : "/cstd";
    for (const path of [prefix, `${prefix}/about`, `${prefix}/resume`, `${prefix}/now`]) {
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);
      const html = await response!.text();
      expect(html).not.toMatch(schoolNames);
      await expect(page.locator("html")).toHaveAttribute("lang", locale === "zh" ? "zh-CN" : "en-AU");
      await expect(page.locator("main")).toContainText(locale === "zh" ? "博 0" : "PhD Year 0");
      await expect(page.locator("main")).not.toContainText(/Melbourne, Australia|墨尔本，澳大利亚/);
      await expectNoHorizontalOverflow(page);
    }
    const resume = await (await request.get(`${prefix}/resume.json`)).json();
    expect(resume.schemaVersion).toBe(2);
    expect(JSON.stringify(resume)).not.toMatch(schoolNames);
    expect(resume.person).not.toHaveProperty("location");
    expect(resume.education.every((entry: Record<string, unknown>) => !("school" in entry) && !("period" in entry))).toBe(true);
    expect(issues).toEqual([]);
  });
}

test("CSTD manual language choice survives a prefetched home and overrides browser language", async ({ page }) => {
  await page.goto("/cstd/en", { waitUntil: "domcontentloaded" });
  const switcher = page.getByRole("link", { name: "Switch to Chinese", exact: true });
  await switcher.hover();
  await switcher.click();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.locator("[data-cstd-home-flight] .fx-role").first()).toContainText("人工智能博 0");
  const chinese = await page.request.get("/", { headers: { host: "custard.top", "accept-language": "en-AU" }, maxRedirects: 0 });
  expect(chinese.status()).toBe(200);
  expect(chinese.headers()["content-language"]).toBe("zh-CN");
  expect(chinese.headers()["cache-control"]).toContain("no-store");
  await page.getByRole("link", { name: "切换到英文", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en-AU");
  const english = await page.request.get("/", { headers: { host: "custard.top", "accept-language": "zh-CN" }, maxRedirects: 0 });
  expect(english.status()).toBe(307);
  expect(new URL(english.headers().location, english.url()).pathname).toBe("/en");
});

test("CSTD first visits negotiate weighted browser languages without saving personal details", async ({ request }) => {
  for (const [language, expected, status] of [
    ["zh-CN,zh;q=0.9,en;q=0.8", "zh-CN", 200],
    ["zh-Hant-TW,zh;q=0.9,en;q=0.8", "zh-CN", 200],
    ["en-AU,en;q=0.9", "en-AU", 307],
    ["zh;q=0.5,en;q=0.9", "en-AU", 307],
  ] as const) {
    const response = await request.get("/", { headers: { host: "custard.top", "accept-language": language }, maxRedirects: 0 });
    expect(response.status()).toBe(status);
    expect(response.headers()["content-language"]).toBe(expected);
    expect(response.headers().vary).toMatch(/accept-language/i);
    expect(response.headers().vary).toMatch(/cookie/i);
    expect(response.headers()["cache-control"]).toContain("no-store");
    expect(response.headers()["set-cookie"]).toBeUndefined();
  }
});
