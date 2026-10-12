import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { captureBrowserIssues, expectNoHorizontalOverflow } from "./support/browser";

for (const locale of ["zh", "en"] as const) {
  test(`CSTD ${locale} full timeline supports year navigation, native details and bulk expansion`, async ({ page }) => {
    const issues = captureBrowserIssues(page);
    await page.goto(`${locale === "en" ? "/cstd/en" : "/cstd"}/about`, { waitUntil: "domcontentloaded" });
    const timeline = page.locator('[data-cstd-capability-timeline="full"]');
    await expect(timeline.locator("[data-cstd-timeline-entry]")).toHaveCount(74);
    await expect(timeline.locator(".cstd-timeline-year")).toHaveCount(7);
    await timeline.getByRole("link", { name: "2020 05", exact: true }).click();
    await expect(page).toHaveURL(/#timeline-year-2020$/);
    const first = timeline.locator('[data-cstd-timeline-entry="chemistry-foundations"]');
    await first.locator("summary").click();
    await expect(first.locator("details")).toHaveAttribute("open", "");
    await expect(first.locator("dd").first()).toContainText(locale === "zh" ? "光化学" : "photochemistry");
    await expect(first.locator(".cstd-timeline-date")).toContainText(locale === "zh" ? "2020 下半年" : "Second half of 2020");
    await timeline.getByRole("button", { name: locale === "zh" ? "展开全部细节" : "Expand all details" }).click();
    await expect(timeline.locator("details[open]")).toHaveCount(74);
    await timeline.getByRole("button", { name: locale === "zh" ? "收起全部细节" : "Collapse all details" }).click();
    await expect(timeline.locator("details[open]")).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
    const accessibility = await new AxeBuilder({ page }).include('[data-cstd-capability-timeline="full"]').withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(accessibility.violations).toEqual([]);
    await expect(timeline).not.toContainText(/monash|莫纳什|university of sydney|悉尼大学|31378714|500519943/i);
    expect(issues).toEqual([]);
  });

  test.describe(`CSTD ${locale} static timeline`, () => {
    test.use({ javaScriptEnabled: false });
    test("detailed history remains readable and expandable without JavaScript", async ({ page }) => {
      await page.goto(`${locale === "en" ? "/cstd/en" : "/cstd"}/about`, { waitUntil: "domcontentloaded" });
      const entry = page.locator('[data-cstd-timeline-entry="agent-reliability-plan"]');
      await entry.locator("summary").click();
      await expect(entry.locator("details")).toHaveAttribute("open", "");
      await expect(entry.locator("dd").nth(1)).toContainText(locale === "zh" ? "尚未得到实验结论" : "without experimental findings");
      await expectNoHorizontalOverflow(page);
    });
  });
}
