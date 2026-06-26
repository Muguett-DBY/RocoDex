import { describe, expect, test } from "vitest";
import { cstdProjects } from "./cstd-projects";
import { getCstdProjectProofTimeline } from "./cstd-project-proof-timeline";

describe("CSTD project proof timeline", () => {
  test("builds a compact proof timeline from live project evidence", () => {
    const timeline = getCstdProjectProofTimeline(cstdProjects);

    expect(timeline.summary).toBe("5 个线上项目都有可追溯的当前状态与交付证据");
    expect(timeline.items.map((item) => item.projectId)).toEqual(["crm", "design", "alpha", "rocodex", "photography"]);
    expect(timeline.items[0]).toMatchObject({
      projectId: "crm",
      title: "产业园区招商 CRM",
      signal: "生产环境持续验证与迭代",
      proof: "交付覆盖线索全周期、空间资源、导入导出、软删除恢复和角色权限的运营系统。",
    });
    expect(timeline.items.every((item) => item.href.startsWith("https://"))).toBe(true);
  });
});
