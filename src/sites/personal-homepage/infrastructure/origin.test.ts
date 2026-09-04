import { describe, expect, test } from "vitest";

import { createCstdUrl, resolveCstdSiteOrigin } from "./origin";

describe("CSTD site origin", () => {
  test("falls back to the production origin without configuration", () => {
    expect(resolveCstdSiteOrigin({})).toBe("https://custard.top");
    expect(resolveCstdSiteOrigin({ CSTD_ORIGIN: "   " })).toBe("https://custard.top");
  });

  test("honors an environment override and strips trailing slashes", () => {
    expect(resolveCstdSiteOrigin({ CSTD_ORIGIN: "https://cstd-git-branch.example.vercel.app" })).toBe("https://cstd-git-branch.example.vercel.app");
    expect(resolveCstdSiteOrigin({ CSTD_ORIGIN: "https://preview.example.vercel.app/" })).toBe("https://preview.example.vercel.app");
    expect(resolveCstdSiteOrigin({ CSTD_ORIGIN: "https://staging.example.com///" })).toBe("https://staging.example.com");
  });

  test("joins canonical URLs for feeds and metadata", () => {
    expect(createCstdUrl("/observatory.json")).toBe(`${resolveCstdSiteOrigin({})}/observatory.json`);
    expect(createCstdUrl("/en/notes")).toBe(`${resolveCstdSiteOrigin({})}/en/notes`);
  });
});
