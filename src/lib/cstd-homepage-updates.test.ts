import { describe, expect, test } from "vitest";
import { cstdHomepageUpdates, getCstdHomepageUpdateSummary } from "./cstd-homepage-updates";

describe("CSTD homepage updates", () => {
  test("summarizes the latest homepage improvements", () => {
    expect(cstdHomepageUpdates.map((update) => update.label)).toEqual(["项目搜索", "案例导航", "摘要复制", "CI 绿色"]);
    expect(getCstdHomepageUpdateSummary(cstdHomepageUpdates)).toBe("最近优化 4 项：项目搜索、案例导航、摘要复制、CI 绿色");
  });
});
