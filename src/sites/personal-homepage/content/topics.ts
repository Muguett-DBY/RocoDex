import type { ContentImage, CstdLocale, LocalizedText } from "./content-types";

export type CstdTopicSlug =
  | "system-boundaries"
  | "evidence-first-ai"
  | "quantitative-systems"
  | "visual-computing"
  | "interdisciplinary-engineering";

export type CstdTopic = Readonly<{
  slug: CstdTopicSlug;
  number: string;
  title: LocalizedText;
  thesis: LocalizedText;
  summary: LocalizedText;
  image: ContentImage;
  accent: string;
  caseSlugs: readonly string[];
  noteSlugs: readonly string[];
  labSlugs: readonly string[];
}>;

export const cstdTopics: readonly CstdTopic[] = [
  {
    slug: "system-boundaries",
    number: "01",
    title: { zh: "系统边界与运行所有权", en: "System boundaries and runtime ownership" },
    thesis: { zh: "可靠架构首先回答谁拥有请求、状态和失败。", en: "Reliable architecture first answers who owns the request, state, and failure." },
    summary: { zh: "从双域名路由、API 契约到业务乐观锁，追踪边界如何在真实产品中落地。", en: "Trace how boundaries ship through dual-host routing, API contracts, and operational optimistic locks." },
    image: { src: "/cstd-universe/cstd-neural-foundry-v2.webp", alt: { zh: "神经工业系统入口", en: "A neural industrial system gate" }, position: "58% 50%" },
    accent: "#24e0ff",
    caseSlugs: ["rocodex-platform", "cfzzs-crm"],
    noteSlugs: ["host-boundaries-in-one-next-deployment", "optimistic-locking-for-operations"],
    labSlugs: ["system-trace", "proof-museum"],
  },
  {
    slug: "evidence-first-ai",
    number: "02",
    title: { zh: "证据优先 AI", en: "Evidence-first AI" },
    thesis: { zh: "模型负责综合，证据、版本与确定性核心负责约束。", en: "Models synthesize; evidence, versions, and deterministic cores constrain." },
    summary: { zh: "把研究 Agent、异步任务、引用和过期写保护连成一条可审计路径。", en: "Connect research agents, asynchronous jobs, citations, and stale-write protection into one auditable path." },
    image: { src: "/cstd-universe/cstd-evidence-foundry-v2.webp", alt: { zh: "证据胶囊与验证核心", en: "Evidence capsules and a verification core" }, position: "58% 50%" },
    accent: "#ff5a50",
    caseSlugs: ["alpha-research-system", "creative-workbench"],
    noteSlugs: ["evidence-first-ai-research", "deterministic-core-ai-edge"],
    labSlugs: ["agent-replay", "proof-museum"],
  },
  {
    slug: "quantitative-systems",
    number: "03",
    title: { zh: "定量研究系统", en: "Quantitative research systems" },
    thesis: { zh: "让假设可交互，让公式可复现，让性能证据可观察。", en: "Make assumptions interactive, formulas reproducible, and performance evidence observable." },
    summary: { zh: "从数据整理、DCF 确定性核心到缓存性能剖析，形成可解释研究流水线。", en: "Move from data wrangling and deterministic DCF cores to cache profiling in an explainable research pipeline." },
    image: { src: "/cstd-world/cstd-data-loom-v2.webp", alt: { zh: "数据曲线与分析织机", en: "A data curve and analysis loom" }, position: "50% 50%" },
    accent: "#3dff8f",
    caseSlugs: ["dcf-quantum", "alpha-research-system"],
    noteSlugs: ["observable-dcf-pipeline", "data-wrangling-as-product-design"],
    labSlugs: ["data-lens", "proof-museum"],
  },
  {
    slug: "visual-computing",
    number: "04",
    title: { zh: "浏览器视觉计算", en: "Browser visual computing" },
    thesis: { zh: "惊艳来自清晰的艺术方向与稳定的资源调度。", en: "Spectacle comes from clear art direction and stable resource scheduling." },
    summary: { zh: "研究单画布世界、渐进 GPU 能力、视觉预算与以内容为先的电影化界面。", en: "Explore single-canvas worlds, progressive GPU capability, visual budgets, and content-first cinematic interfaces." },
    image: { src: "/cstd-universe/cstd-skill-reactor-v1.webp", alt: { zh: "浏览器视觉反应堆", en: "A browser visual reactor" }, position: "50% 50%" },
    accent: "#f4d431",
    caseSlugs: ["creative-workbench", "portrait-booking"],
    noteSlugs: ["single-canvas-immersive-web"],
    labSlugs: ["render-lab"],
  },
  {
    slug: "interdisciplinary-engineering",
    number: "05",
    title: { zh: "跨学科工程路径", en: "Interdisciplinary engineering path" },
    thesis: { zh: "化工、数据、研究与软件不是履历碎片，而是一套系统直觉。", en: "Chemical engineering, data, research, and software are not resume fragments but one systems intuition." },
    summary: { zh: "沿学习轨迹理解建模、约束、实验、界面和交付为何可以共享同一套判断。", en: "Follow how modeling, constraints, experiments, interfaces, and delivery share one engineering judgment." },
    image: { src: "/cstd-universe/cstd-knowledge-loom-v2.webp", alt: { zh: "技术档案与数据纤维构成的知识织机", en: "A knowledge loom built from technical archives and data fibers" }, position: "42% 50%" },
    accent: "#f2efe7",
    caseSlugs: ["dcf-quantum", "portrait-booking", "rocodex-platform"],
    noteSlugs: ["chemical-engineering-to-software-systems", "data-wrangling-as-product-design"],
    labSlugs: ["system-trace", "data-lens"],
  },
] as const;

export function getCstdTopic(slug: string) {
  return cstdTopics.find((topic) => topic.slug === slug);
}

export function getCstdTopicPath(topic: CstdTopic, locale: CstdLocale) {
  return locale === "en" ? `/en/topics/${topic.slug}` : `/topics/${topic.slug}`;
}
