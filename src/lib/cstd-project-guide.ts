import type { cstdProjects } from "./cstd-projects";

type CstdProjectId = (typeof cstdProjects)[number]["id"];

export type CstdProjectGuide = {
  goal: string;
  reason: string;
  projectId: CstdProjectId;
};

export const cstdProjectGuides: CstdProjectGuide[] = [
  {
    goal: "查精灵资料与玩法工具",
    reason: "从搜索、对比、收藏到 PVP 阵容进入 RocoDex。",
    projectId: "rocodex",
  },
  {
    goal: "做公司研究与估值",
    reason: "用 CSTD Alpha 串起主体确认、评分、估值和报告。",
    projectId: "alpha",
  },
  {
    goal: "整理 AI 创作素材",
    reason: "用私人工作台连接对话、图片、视频和素材库。",
    projectId: "design",
  },
  {
    goal: "管理招商线索与空间",
    reason: "用产业园区 CRM 处理线索、联系人、权限和资源。",
    projectId: "crm",
  },
];
