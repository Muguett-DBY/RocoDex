import type { CstdProject } from "./projects";

export type CstdSystemIcon = "product" | "edge" | "ai" | "research" | "data";

export type CstdSystem = {
  id: "product-surfaces" | "edge-operations" | "ai-creation" | "research-models" | "data-systems";
  track: "shipped" | "research";
  icon: CstdSystemIcon;
  code: string;
  district: string;
  title: string;
  summary: string;
  evidence: string;
  relation: string;
  stack: readonly string[];
};

export type CstdProof = {
  projectId: "rocodex" | "alpha" | "crm";
  lens: string;
  statement: string;
  detail: string;
  decision: string;
  signal: string;
};

export type CstdTechnicalNote = {
  code: string;
  title: string;
  thesis: string;
  detail: string;
  stack: readonly string[];
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
    code: "SURFACE-01",
    district: "Product systems",
    title: "可用的产品表面",
    summary: "从信息结构到界面细节，先让复杂事情有一条清楚的进入路径。",
    evidence: "RocoDex 与摄影站持续面对真实访客和内容更新。",
    relation: "把研究、数据与业务能力编译成用户真正能进入的界面。",
    stack: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion"],
  },
  {
    id: "edge-operations",
    track: "shipped",
    icon: "edge",
    code: "EDGE-02",
    district: "Cloud / edge delivery",
    title: "边缘与业务系统",
    summary: "把权限、数据、运营节奏和发布流程放进同一套稳定边界里。",
    evidence: "CRM 覆盖线索、空间、权限和端到端流程验证。",
    relation: "为产品表面提供身份、数据、缓存、审计与持续发布边界。",
    stack: ["Cloudflare", "Hono", "D1 / R2", "Redis", "Playwright"],
  },
  {
    id: "ai-creation",
    track: "shipped",
    icon: "ai",
    code: "AGENT-03",
    district: "AI / agent engineering",
    title: "AI 创作与研究工具",
    summary: "把对话、生成和资料沉淀设计为可以长期回看的个人工作流。",
    evidence: "私有 AI 工作台与 Alpha 研究工具均已独立部署。",
    relation: "把模型能力限制在可追踪、可恢复、可复查的产品工作流中。",
    stack: ["React", "Streaming UI", "D1 / R2", "Pyodide", "Cloudflare Pages"],
  },
  {
    id: "research-models",
    track: "research",
    icon: "research",
    code: "MODEL-04",
    district: "Quantitative research",
    title: "研究与可解释模型",
    summary: "在课程与独立研究中，用计算和可视化把假设、数据与判断拆开。",
    evidence: "方法栈来自数据科学、交互分析与量化研究实践。",
    relation: "为判断提供假设、统计模型、估值与可解释图表。",
    stack: ["Python", "R Shiny", "Jupyter", "Plotly", "NumPy / pandas"],
  },
  {
    id: "data-systems",
    track: "research",
    icon: "data",
    code: "STREAM-05",
    district: "Data engineering",
    title: "数据流与计算研究",
    summary: "继续学习大规模数据如何被建模、传递和验证，而不是只停留在结果页。",
    evidence: "课程与实验项目覆盖服务建模、流式数据和分布式计算。",
    relation: "连接原始事件、并行计算、流式处理与研究模型。",
    stack: ["FastAPI", "Pydantic", "SQL / MongoDB", "Spark", "Kafka"],
  },
] as const satisfies readonly CstdSystem[];

export const cstdProofs = [
  {
    projectId: "rocodex",
    lens: "资料系统",
    statement: "给信息结构一条可走的路径。",
    detail: "精灵、技能、性格、阵容与攻略被整理进同一个可以持续使用的中文入口。",
    decision: "用稳定的数据模型承载搜索、筛选、收藏与阵容关系，而不是把页面写成静态目录。",
    signal: "347 只精灵 / 402 个形态 / PVP 工作流",
  },
  {
    projectId: "alpha",
    lens: "研究工具",
    statement: "让判断留下可复查的过程。",
    detail: "从上市主体确认到数据核验、评分、估值和图表，研究过程被拆成可解释的步骤。",
    decision: "先锁定上市主体与数据口径，再让 AI 在有结构的评分和估值边界内生成研究结果。",
    signal: "主体确认 / 20 项评分 / 估值区间",
  },
  {
    projectId: "crm",
    lens: "业务系统",
    statement: "把业务链路做成有边界的系统。",
    detail: "线索、联系人、空间资源、导入导出与角色权限被放在清晰的运营闭环中。",
    decision: "以线索生命周期为主轴，把 RBAC、审计、软删除和导入导出放进同一业务模型。",
    signal: "RBAC / D1 / 全流程 E2E",
  },
] as const satisfies readonly CstdProof[];

export const cstdTechnicalNotes = [
  {
    code: "NOTE / 01",
    title: "AI 工作流的边界，不应该由模型猜。",
    thesis: "模型负责生成可能性，产品负责约束状态、证据、恢复与权限。",
    detail: "在 Alpha 与私人创作工作台中，流式输出只是表面；真正决定稳定性的，是输入结构、任务状态、资产持久化、失败恢复与可审计的边界。",
    stack: ["Streaming UI", "Structured output", "D1 / R2", "Task state"],
  },
  {
    code: "NOTE / 02",
    title: "研究结果必须带着路径一起交付。",
    thesis: "图表、评分和结论只有能回到数据口径与假设时，才具有长期价值。",
    detail: "从 USYD 的交互分析到 Monash 的统计建模，再到独立估值工具，研究界面始终保留主体、数据、假设、模型与结论之间的可追踪关系。",
    stack: ["Python", "R Shiny", "Jupyter", "Plotly", "Statistical modelling"],
  },
  {
    code: "NOTE / 03",
    title: "边缘交付不是部署按钮，而是一条运行链。",
    thesis: "身份、缓存、数据、观测与回滚共同决定一个产品能否持续在线。",
    detail: "Cloudflare、Vercel、D1、R2、Redis 与 Playwright 被当作同一交付系统来设计；发布完成的定义包括构建、端到端验证、线上响应和可恢复性。",
    stack: ["Cloudflare", "Vercel", "Redis", "Playwright", "CI / CD"],
  },
] as const satisfies readonly CstdTechnicalNote[];

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
