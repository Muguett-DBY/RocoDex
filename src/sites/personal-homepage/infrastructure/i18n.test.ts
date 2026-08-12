import { describe, expect, test } from "vitest";
import {
  cstdLocaleConfig,
  getCstdLocaleFromPathname,
  getLocalizedCstdHref,
  getLocalizedCstdPathname,
} from "./i18n";

describe("CSTD i18n routing", () => {
  test("declares stable BCP 47 metadata for every supported locale", () => {
    expect(cstdLocaleConfig.zh).toMatchObject({ htmlLang: "zh-CN", openGraphLocale: "zh_CN", pathPrefix: "" });
    expect(cstdLocaleConfig.en).toMatchObject({ htmlLang: "en-AU", openGraphLocale: "en_AU", pathPrefix: "/en" });
  });

  test.each([
    ["/", "zh"],
    ["/work/rocodex-platform", "zh"],
    ["/en", "en"],
    ["/en/notes/evidence-first-ai-research", "en"],
    ["/cstd", "zh"],
    ["/cstd/en/lab/data-lens", "en"],
  ] as const)("detects %s as %s", (pathname, locale) => {
    expect(getCstdLocaleFromPathname(pathname)).toBe(locale);
  });

  test("maps public and local-development paths without duplicating prefixes", () => {
    expect(getLocalizedCstdPathname("/", "en")).toBe("/en");
    expect(getLocalizedCstdPathname("/en", "zh")).toBe("/");
    expect(getLocalizedCstdPathname("/notes/observable-dcf-pipeline", "en")).toBe("/en/notes/observable-dcf-pipeline");
    expect(getLocalizedCstdPathname("/en/work/cfzzs-crm", "zh")).toBe("/work/cfzzs-crm");
    expect(getLocalizedCstdPathname("/cstd/en/work/cfzzs-crm", "zh")).toBe("/work/cfzzs-crm");
    expect(getLocalizedCstdPathname("/cstd/topics/visual-computing", "en")).toBe("/en/topics/visual-computing");
  });

  test("preserves query strings and fragments while leaving non-site links alone", () => {
    expect(getLocalizedCstdHref("/en/notes?view=compact#sources", "zh")).toBe("/notes?view=compact#sources");
    expect(getLocalizedCstdHref("/work/rocodex-platform?from=home#proof", "en")).toBe("/en/work/rocodex-platform?from=home#proof");
    expect(getLocalizedCstdHref("#proof", "en")).toBe("#proof");
    expect(getLocalizedCstdHref("mailto:cstd@custard.top", "en")).toBe("mailto:cstd@custard.top");
    expect(getLocalizedCstdHref("https://github.com/Muguett-DBY", "en")).toBe("https://github.com/Muguett-DBY");
  });
});
