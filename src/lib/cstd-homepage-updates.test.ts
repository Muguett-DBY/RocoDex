import { describe, expect, test } from "vitest";
import {
  cstdHomepageAcceptance,
  cstdHomepageCapabilities,
  cstdHomepageUpdates,
  getCstdHomepageAcceptanceSummary,
  getCstdHomepageCapabilitySummary,
  getCstdHomepageUpdateSummary,
} from "./cstd-homepage-updates";

describe("CSTD homepage updates", () => {
  test("summarizes the latest homepage improvements", () => {
    expect(cstdHomepageUpdates.map((update) => update.label)).toEqual(["视图记忆", "当前视图", "项目对比", "运行时清洁"]);
    expect(getCstdHomepageUpdateSummary(cstdHomepageUpdates)).toBe("最近优化 4 项：视图记忆、当前视图、项目对比、运行时清洁");
  });

  test("summarizes the homepage capability checklist", () => {
    expect(cstdHomepageCapabilities.map((capability) => capability.label)).toEqual(["可搜索", "可分享", "可对比", "可验证", "可上线"]);
    expect(getCstdHomepageCapabilitySummary(cstdHomepageCapabilities)).toBe("主页能力 5 项：可搜索、可分享、可对比、可验证、可上线");
  });

  test("summarizes the current homepage acceptance state", () => {
    expect(cstdHomepageAcceptance.map((item) => item.label)).toEqual(["目录深链", "项目对比", "3D 运行时", "远端绿色"]);
    expect(getCstdHomepageAcceptanceSummary(cstdHomepageAcceptance)).toBe("本轮验收 4 项：目录深链、项目对比、3D 运行时、远端绿色");
  });
});
