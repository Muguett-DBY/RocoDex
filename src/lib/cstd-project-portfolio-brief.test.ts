import { describe, expect, test } from "vitest";
import { cstdProjects } from "./cstd-projects";
import { buildCstdProjectPortfolioBrief } from "./cstd-project-portfolio-brief";

describe("CSTD project portfolio brief", () => {
  test("builds a shareable portfolio brief from live project evidence", () => {
    const brief = buildCstdProjectPortfolioBrief(cstdProjects);

    expect(brief).toContain("custard.top 项目组合");
    expect(brief).toContain("已上线项目：5");
    expect(brief).toContain("完整案例证据：5");
    expect(brief).toContain("洛克图鉴 / RocoDex：持续维护数据与玩法工具");
    expect(brief).toContain("产业园区招商 CRM：生产环境持续验证与迭代");
    expect(brief).toContain("https://cfzzs.custard.top");
    expect(brief).not.toContain("更多项目孵化中");
  });
});
