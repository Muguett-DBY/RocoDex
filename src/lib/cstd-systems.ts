import type { CstdProject } from "./cstd-projects";

export type CstdSystemIcon = "product" | "edge" | "ai" | "research" | "data";

export type CstdSystem = {
  id: "product-surfaces" | "edge-operations" | "ai-creation" | "research-models" | "data-systems";
  track: "shipped" | "research";
  icon: CstdSystemIcon;
  title: string;
  summary: string;
  evidence: string;
  stack: readonly string[];
};

export type CstdProof = {
  projectId: "rocodex" | "alpha" | "crm";
  lens: string;
  statement: string;
  detail: string;
};

export type CstdLearningEntry = {
  year: "2022" | "2024" | "2025" | "2026";
  title: string;
  focus: string;
  note: string;
};

export const cstdSystems = [
  {
    id: "product-surfaces",
    track: "shipped",
    icon: "product",
    title: "可用的产品表面",
    summary: "从信息结构到界面细节，先让复杂事情有一条清楚的进入路径。",
    evidence: "RocoDex 与摄影站持续面对真实访客和内容更新。",
    stack: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion"],
  },
  {
    id: "edge-operations",
    track: "shipped",
    icon: "edge",
    title: "边缘与业务系统",
    summary: "把权限、数据、运营节奏和发布流程放进同一套稳定边界里。",
    evidence: "CRM 覆盖线索、空间、权限和端到端流程验证。",
    stack: ["Cloudflare", "Hono", "D1 / R2", "Redis", "Playwright"],
  },
  {
    id: "ai-creation",
    track: "shipped",
    icon: "ai",
    title: "AI 创作与研究工具",
    summary: "把对话、生成和资料沉淀设计为可以长期回看的个人工作流。",
    evidence: "私有 AI 工作台与 Alpha 研究工具均已独立部署。",
    stack: ["React", "Streaming UI", "D1 / R2", "Pyodide", "Cloudflare Pages"],
  },
  {
    id: "research-models",
    track: "research",
    icon: "research",
    title: "研究与可解释模型",
    summary: "在课程与独立研究中，用计算和可视化把假设、数据与判断拆开。",
    evidence: "方法栈来自数据科学、交互分析与量化研究实践。",
    stack: ["Python", "R Shiny", "Jupyter", "Plotly", "NumPy / pandas"],
  },
  {
    id: "data-systems",
    track: "research",
    icon: "data",
    title: "数据流与计算研究",
    summary: "继续学习大规模数据如何被建模、传递和验证，而不是只停留在结果页。",
    evidence: "课程与实验项目覆盖服务建模、流式数据和分布式计算。",
    stack: ["FastAPI", "Pydantic", "SQL / MongoDB", "Spark", "Kafka"],
  },
] as const satisfies readonly CstdSystem[];

export const cstdProofs = [
  {
    projectId: "rocodex",
    lens: "资料系统",
    statement: "给信息结构一条可走的路径。",
    detail: "精灵、技能、性格、阵容与攻略被整理进同一个可以持续使用的中文入口。",
  },
  {
    projectId: "alpha",
    lens: "研究工具",
    statement: "让判断留下可复查的过程。",
    detail: "从上市主体确认到数据核验、评分、估值和图表，研究过程被拆成可解释的步骤。",
  },
  {
    projectId: "crm",
    lens: "业务系统",
    statement: "把业务链路做成有边界的系统。",
    detail: "线索、联系人、空间资源、导入导出与角色权限被放在清晰的运营闭环中。",
  },
] as const satisfies readonly CstdProof[];

export const cstdLiveObjectIds = ["photography", "design"] as const;

export const cstdLearningPath = [
  {
    year: "2022",
    title: "计算与编程基础",
    focus: "MATLAB / Java",
    note: "从算法、数值计算和面向对象编程建立第一层工程直觉。",
  },
  {
    year: "2024",
    title: "数据科学与交互",
    focus: "R Shiny / Python / Jupyter / Plotly",
    note: "开始把探索、可视化和交互式分析放进同一个研究过程。",
  },
  {
    year: "2025",
    title: "服务与数据建模",
    focus: "SQL / MongoDB / FastAPI / Pydantic",
    note: "把数据定义、接口约束和业务边界当成产品体验的一部分。",
  },
  {
    year: "2026",
    title: "边缘交付与数据系统",
    focus: "Spark / Kafka / Cloudflare / AI products",
    note: "在独立交付和课程实验之间，继续理解系统如何稳定地运行与演化。",
  },
] as const satisfies readonly CstdLearningEntry[];

export function getCstdProjectsById<T extends CstdProject>(
  projects: readonly T[],
  ids: readonly string[],
): T[] {
  return ids.map((id) => {
    const project = projects.find((candidate) => candidate.id === id);
    if (!project) throw new Error(`Unknown CSTD project: ${id}`);
    return project;
  });
}
