import type { LocalizedText } from "./content-types";

export type CstdSystemIcon = "product" | "edge" | "ai" | "research" | "data";

export type CstdSystem = {
  id: "product-surfaces" | "edge-operations" | "ai-creation" | "research-models" | "data-systems";
  track: "shipped" | "research";
  icon: CstdSystemIcon;
  code: string;
  district: LocalizedText;
  title: LocalizedText;
  summary: LocalizedText;
  evidence: LocalizedText;
  relation: LocalizedText;
  stack: readonly string[];
  evidenceLinks: readonly {
    kind: "case" | "note" | "lab";
    label: LocalizedText;
    href: string;
  }[];
};

export const cstdSystems = [
  {
    id: "product-surfaces",
    track: "shipped",
    icon: "product",
    code: "SURFACE-01",
    district: { zh: "产品系统", en: "Product systems" },
    title: { zh: "产品界面与使用路径", en: "Product interfaces and user paths" },
    summary: { zh: "从信息结构到界面细节，先让复杂事情有一条清楚的进入路径。", en: "Give complex work a clear entry path, from information architecture to interface detail." },
    evidence: { zh: "RocoDex 与摄影站持续面对真实访客和内容更新。", en: "RocoDex and the portrait platform serve real visitors and continuously changing content." },
    relation: { zh: "把研究、数据与业务能力编译成用户真正会使用的界面。", en: "Turn research, data, and operational rules into interfaces people can actually use." },
    stack: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion"],
    evidenceLinks: [
      { kind: "case", label: { zh: "RocoDex 双站平台", en: "RocoDex dual-site platform" }, href: "/work/rocodex-platform" },
      { kind: "case", label: { zh: "摄影预约与交付", en: "Portrait booking and delivery" }, href: "/work/portrait-booking" },
      { kind: "lab", label: { zh: "渲染实验室", en: "Render Lab" }, href: "/lab/render-lab" },
    ],
  },
  {
    id: "edge-operations",
    track: "shipped",
    icon: "edge",
    code: "EDGE-02",
    district: { zh: "云端与边缘交付", en: "Cloud / edge delivery" },
    title: { zh: "边缘与业务系统", en: "Edge and operational systems" },
    summary: { zh: "把权限、数据、运营节奏和发布流程放进同一套稳定边界里。", en: "Keep identity, data, operations, and releases inside one stable boundary." },
    evidence: { zh: "CRM 覆盖线索、空间、权限和端到端流程验证。", en: "The CRM covers leads, spaces, permissions, and end-to-end operational verification." },
    relation: { zh: "为产品表面提供身份、数据、缓存、审计与持续发布边界。", en: "Provide product surfaces with identity, data, caching, audit, and continuous-delivery boundaries." },
    stack: ["Cloudflare", "Hono", "D1 / R2", "Redis", "Playwright"],
    evidenceLinks: [
      { kind: "case", label: { zh: "CFZZS 产业园 CRM", en: "CFZZS industrial-park CRM" }, href: "/work/cfzzs-crm" },
      { kind: "note", label: { zh: "Host 边界写进代码", en: "Encoding host boundaries" }, href: "/notes/host-boundaries-in-one-next-deployment" },
      { kind: "lab", label: { zh: "系统链路实验", en: "System Trace" }, href: "/lab/system-trace" },
    ],
  },
  {
    id: "ai-creation",
    track: "shipped",
    icon: "ai",
    code: "AGENT-03",
    district: { zh: "AI 与智能体工程", en: "AI / agent engineering" },
    title: { zh: "AI 创作与研究工具", en: "AI creation and research tools" },
    summary: { zh: "把对话、生成和资料沉淀设计为可以回看、可以继续的个人工作流。", en: "Turn chats, generated media, and saved context into personal workflows you can revisit and resume." },
    evidence: { zh: "私有 AI 工作台与 Alpha 研究工具均已独立部署。", en: "The private AI workbench and Alpha research system are independently deployed." },
    relation: { zh: "把模型能力限制在可追踪、可恢复、可复查的产品工作流中。", en: "Constrain model capability inside traceable, recoverable, and reviewable product workflows." },
    stack: ["React", "Streaming UI", "D1 / R2", "Pyodide", "Cloudflare Pages"],
    evidenceLinks: [
      { kind: "case", label: { zh: "CSTD Alpha 研究系统", en: "CSTD Alpha research system" }, href: "/work/alpha-research-system" },
      { kind: "case", label: { zh: "私人 AI 创作工作台", en: "Private AI creative workbench" }, href: "/work/creative-workbench" },
      { kind: "lab", label: { zh: "智能体回放", en: "Agent Replay" }, href: "/lab/agent-replay" },
    ],
  },
  {
    id: "research-models",
    track: "research",
    icon: "research",
    code: "MODEL-04",
    district: { zh: "量化研究", en: "Quantitative research" },
    title: { zh: "研究与可解释模型", en: "Research and interpretable models" },
    summary: { zh: "在课程与独立研究中，用计算和可视化把假设、数据与判断拆开。", en: "Separate assumptions, data, and judgment through computation and visualization." },
    evidence: { zh: "方法来自数据科学、交互分析与量化研究实践。", en: "The methods come from data science, interactive analysis, and quantitative research." },
    relation: { zh: "为判断提供假设、统计模型、估值与可解释图表。", en: "Support decisions with explicit assumptions, statistical models, valuation, and interpretable charts." },
    stack: ["Python", "R Shiny", "Jupyter", "Plotly", "NumPy / pandas"],
    evidenceLinks: [
      { kind: "case", label: { zh: "DCF Quantum", en: "DCF Quantum" }, href: "/work/dcf-quantum" },
      { kind: "note", label: { zh: "确定性内核与 AI 边缘", en: "Deterministic core, AI edge" }, href: "/notes/deterministic-core-ai-edge" },
      { kind: "lab", label: { zh: "数据透镜", en: "Data Lens" }, href: "/lab/data-lens" },
    ],
  },
  {
    id: "data-systems",
    track: "research",
    icon: "data",
    code: "STREAM-05",
    district: { zh: "数据工程", en: "Data engineering" },
    title: { zh: "数据流与计算研究", en: "Data flows and computational research" },
    summary: { zh: "继续学习大规模数据如何被建模、传递和验证，而不是只停留在结果页。", en: "Study how large-scale data is modeled, transported, and verified beyond the final result screen." },
    evidence: { zh: "课程与实验项目覆盖服务建模、流式数据和分布式计算。", en: "Coursework and experiments cover service modeling, streaming data, and distributed computation." },
    relation: { zh: "连接原始事件、并行计算、流式处理与研究模型。", en: "Connect raw events, parallel computation, stream processing, and research models." },
    stack: ["FastAPI", "Pydantic", "SQL / MongoDB", "Spark", "Kafka"],
    evidenceLinks: [
      { kind: "case", label: { zh: "CSTD Alpha 研究系统", en: "CSTD Alpha research system" }, href: "/work/alpha-research-system" },
      { kind: "case", label: { zh: "DCF Quantum", en: "DCF Quantum" }, href: "/work/dcf-quantum" },
      { kind: "note", label: { zh: "可观测 DCF 管线", en: "Observable DCF pipeline" }, href: "/notes/observable-dcf-pipeline" },
    ],
  },
] as const satisfies readonly CstdSystem[];
