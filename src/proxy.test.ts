import { describe, expect, test } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";

describe("personal homepage browser language negotiation", () => {
  test.each([
    ["zh-CN,zh;q=0.9,en;q=0.8", undefined, "zh-CN", 200],
    ["zh-Hant-TW,en;q=0.8", undefined, "zh-CN", 200],
    ["en-AU,en;q=0.9", undefined, "en-AU", 307],
    ["zh;q=0.5,en;q=0.9", undefined, "en-AU", 307],
    ["en-AU", "zh", "zh-CN", 200],
    ["zh-CN", "en", "en-AU", 307],
    ["en-AU", "invalid", "en-AU", 307],
    [undefined, undefined, "zh-CN", 200],
  ] as const)("selects %s with saved choice %s", (language, saved, expected, status) => {
    const headers = new Headers({ host: "custard.top" });
    if (language) headers.set("accept-language", language);
    if (saved) headers.set("cookie", `cstd-locale=${saved}`);
    const response = proxy(new NextRequest("https://custard.top/", { headers }));
    expect(response.status).toBe(status);
    expect(response.headers.get("content-language")).toBe(expected);
    expect(response.headers.get("vary")).toContain("Accept-Language");
    expect(response.headers.get("vary")).toContain("Cookie");
    expect(response.headers.get("cache-control")).toBe("private, max-age=3600");
    if (status === 307) expect(response.headers.get("location")).toBe("https://custard.top/en");
    else expect(response.headers.get("x-middleware-rewrite")).toBe("https://custard.top/cstd");
  });

  test("preserves explicit English links even on a Chinese-language browser", () => {
    const response = proxy(new NextRequest("https://custard.top/en/about", {
      headers: { host: "custard.top", "accept-language": "zh-CN", cookie: "cstd-locale=zh" },
    }));
    expect(response.headers.get("content-language")).toBe("en-AU");
    expect(response.headers.get("x-middleware-rewrite")).toBe("https://custard.top/cstd/en/about");
    expect(response.headers.get("location")).toBeNull();
  });
});
