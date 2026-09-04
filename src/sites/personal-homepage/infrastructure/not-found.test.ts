import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, test } from "vitest";

import { cstdNotFoundCopy, createCstdNotFoundHtml, getCstdNotFoundEntryPath } from "./not-found";

const repositoryRoot = path.resolve(import.meta.dirname, "../../../..");

describe("unified CSTD 404 surfaces", () => {
  test("both locales share one copy source with entry paths", () => {
    expect(cstdNotFoundCopy.zh.heading).toBe("信号丢失 / 路径未接入");
    expect(cstdNotFoundCopy.en.heading).toBe("Signal lost / Route disconnected");
    expect(getCstdNotFoundEntryPath("zh")).toBe("/");
    expect(getCstdNotFoundEntryPath("en")).toBe("/en");
  });

  test("the proxy edge 404 renders the shared copy with the right document language", () => {
    for (const locale of ["zh", "en"] as const) {
      const html = createCstdNotFoundHtml(locale);
      expect(html).toContain(cstdNotFoundCopy[locale].heading);
      expect(html).toContain(cstdNotFoundCopy[locale].body);
      expect(html).toContain(cstdNotFoundCopy[locale].action);
      expect(html).toContain(cstdNotFoundCopy[locale].signal);
      expect(html).toContain(locale === "zh" ? 'lang="zh-CN"' : 'lang="en-AU"');
      expect(html).toContain('name="robots" content="noindex"');
    }
  });

  test("the proxy delegates to the shared module instead of keeping private 404 copy", () => {
    const proxySource = readFileSync(path.join(repositoryRoot, "src/proxy.ts"), "utf8");
    expect(proxySource).toContain("createCstdNotFoundHtml");
    expect(proxySource).not.toContain("PACKET LOSS");
    expect(proxySource).not.toContain("信号丢失");

    const pageSource = readFileSync(
      path.join(repositoryRoot, "src/sites/personal-homepage/components/pages/not-found-page.tsx"),
      "utf8",
    );
    expect(pageSource).toContain("cstdNotFoundCopy");
    expect(pageSource).not.toContain("这条神经链路不存在");
  });
});
