import { describe, expect, test } from "vitest";
import { cstdHomepageCapabilities, cstdHomepageUpdates, getCstdHomepageCapabilitySummary, getCstdHomepageUpdateSummary } from "./cstd-homepage-updates";

describe("CSTD homepage updates", () => {
  test("summarizes the latest homepage improvements", () => {
    expect(cstdHomepageUpdates.map((update) => update.label)).toEqual(["项目搜索", "案例导航", "摘要复制", "CI 绿色"]);
    expect(getCstdHomepageUpdateSummary(cstdHomepageUpdates)).toBe("最近优化 4 项：项目搜索、案例导航、摘要复制、CI 绿色");
  });

  test("summarizes the homepage capability checklist", () => {
    expect(cstdHomepageCapabilities.map((capability) => capability.label)).toEqual(["可搜索", "可验证", "可复制", "可深链", "可部署"]);
    expect(getCstdHomepageCapabilitySummary(cstdHomepageCapabilities)).toBe("主页能力 5 项：可搜索、可验证、可复制、可深链、可部署");
  });
});
