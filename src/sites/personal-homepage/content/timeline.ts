import type { CstdLocale, LocalizedText } from "./content-types";
import type { CstdSystem } from "./systems";

export type CstdTimelineEntry = Readonly<{
  date: string;
  kind: "education" | "project" | "diagnosis" | "release";
  title: LocalizedText;
  summary: LocalizedText;
  capabilityIds: readonly CstdSystem["id"][];
  evidence: Readonly<Record<CstdLocale, string>>;
}>;

export const cstdTimeline: readonly CstdTimelineEntry[] = [
  {
    date: "2022-02-01",
    kind: "education",
    title: { zh: "从数值计算与面向对象开始", en: "Starting with numerical computing and objects" },
    summary: { zh: "MATLAB 与 Java 建立第一层算法、数值和程序结构直觉。", en: "MATLAB and Java established the first layer of algorithmic, numerical, and structural intuition." },
    capabilityIds: ["research-models"],
    evidence: { zh: "/about", en: "/en/about" },
  },
  {
    date: "2024-03-01",
    kind: "education",
    title: { zh: "把数据探索变成可操作界面", en: "Turning data exploration into an interface" },
    summary: { zh: "R Shiny、Python、Jupyter 与 Plotly 把分析、可视化和交互放进同一研究过程。", en: "R Shiny, Python, Jupyter, and Plotly connected analysis, visualization, and interaction in one research process." },
    capabilityIds: ["research-models", "data-systems"],
    evidence: { zh: "/notes/data-wrangling-as-product-design", en: "/en/notes/data-wrangling-as-product-design" },
  },
  {
    date: "2025-03-01",
    kind: "project",
    title: { zh: "服务、数据库与业务边界汇合", en: "Services, databases, and product boundaries converge" },
    summary: { zh: "SQL、MongoDB、FastAPI 与 Pydantic 让数据定义和接口约束成为产品体验的一部分。", en: "SQL, MongoDB, FastAPI, and Pydantic made data definitions and interface constraints part of the product experience." },
    capabilityIds: ["edge-operations", "data-systems"],
    evidence: { zh: "/work/cfzzs-crm", en: "/en/work/cfzzs-crm" },
  },
  {
    date: "2026-06-26",
    kind: "release",
    title: { zh: "一个仓库承载两个独立产品", en: "One repository, two independent products" },
    summary: { zh: "Host 决策、route group、最小 public API 与导入守卫把个人主站和 RocoDex 真正隔离。", en: "Host decisions, route groups, narrow public APIs, and import guards separated the portfolio from RocoDex." },
    capabilityIds: ["product-surfaces", "edge-operations"],
    evidence: { zh: "/work/rocodex-platform", en: "/en/work/rocodex-platform" },
  },
  {
    date: "2026-07-15",
    kind: "diagnosis",
    title: { zh: "性能瓶颈不在 DCF 数学", en: "The bottleneck was not DCF mathematics" },
    summary: { zh: "真实性能剖析把热点定位到重复缓存 JSON 解析与序列化，并保留数据指纹和运行清单。", en: "Profiling located the hot path in repeated cache JSON parsing and serialization while preserving fingerprints and run manifests." },
    capabilityIds: ["research-models", "data-systems"],
    evidence: { zh: "/notes/observable-dcf-pipeline", en: "/en/notes/observable-dcf-pipeline" },
  },
  {
    date: "2026-08-08",
    kind: "release",
    title: { zh: "CSTD 技术档案与自适应视觉上线", en: "CSTD technical archive and adaptive visuals ship" },
    summary: { zh: "双语案例、技术札记、四个 Lab 与 Full/Lite/静态分级渲染在同一发布中完成验证。", en: "Bilingual cases, field notes, four Labs, and Full/Lite/static rendering tiers passed one release gate." },
    capabilityIds: ["product-surfaces", "ai-creation", "edge-operations"],
    evidence: { zh: "https://github.com/Muguett-DBY/RocoDex/commit/049d2de", en: "https://github.com/Muguett-DBY/RocoDex/commit/049d2de" },
  },
  {
    date: "2026-08-09",
    kind: "release",
    title: { zh: "CSTD 9.0 工程观测与深度档案上线", en: "CSTD 9.0 engineering observatory and deep dossiers ship" },
    summary: { zh: "个人方法、构建来源、内容健康、旗舰案例故障档案与实时视觉预算进入同一个发布契约。", en: "Personal method, build provenance, content health, flagship failure dossiers, and live visual budgets enter one release contract." },
    capabilityIds: ["product-surfaces", "edge-operations", "ai-creation", "data-systems"],
    evidence: { zh: "/observatory.json", en: "/en/observatory.json" },
  },
];
