import type { ContentImage, CstdLocale, LocalizedText } from "./content-types";

export type CstdLab = Readonly<{
  slug: "system-trace" | "agent-replay" | "data-lens" | "render-lab";
  number: string;
  title: LocalizedText;
  summary: LocalizedText;
  principle: LocalizedText;
  image: ContentImage;
  tags: readonly string[];
}>;

export const cstdLabs: readonly CstdLab[] = [
  {
    slug: "system-trace",
    number: "01",
    title: { zh: "System Trace", en: "System Trace" },
    summary: { zh: "沿一条真实请求穿过 Host 决策、路由边界、站点模块和渲染阶段。", en: "Follow a request through host decisions, route boundaries, site modules, and rendering." },
    principle: { zh: "边界必须在请求进入产品树之前生效。", en: "Boundaries take effect before a request enters the product tree." },
    image: { src: "/cstd-universe/cstd-neural-gate-v1.webp", alt: { zh: "系统请求入口", en: "A system request gate" } },
    tags: ["Routing", "Architecture", "Observability"],
  },
  {
    slug: "agent-replay",
    number: "02",
    title: { zh: "Agent Replay", en: "Agent Replay" },
    summary: { zh: "重放一个证据优先研究任务，观察收集、指纹、排队、综合与发布。", en: "Replay an evidence-first research job across collection, fingerprinting, queueing, synthesis, and publication." },
    principle: { zh: "过期任务可以完成，但不能覆盖当前事实。", en: "A stale job may finish, but it cannot overwrite current truth." },
    image: { src: "/cstd-universe/cstd-broadcast-nexus-v1.webp", alt: { zh: "异步任务广播节点", en: "An asynchronous job broadcast node" } },
    tags: ["AI", "Jobs", "Evidence"],
  },
  {
    slug: "data-lens",
    number: "03",
    title: { zh: "Data Lens", en: "Data Lens" },
    summary: { zh: "调整增长、折现率与安全边际，直接看确定性 DCF 区间如何响应。", en: "Adjust growth, discount rate, and margin of safety to see deterministic DCF ranges respond." },
    principle: { zh: "交互改变假设，不改变公式。", en: "Interaction changes assumptions, not formulas." },
    image: { src: "/cstd-world/cstd-data-loom-v2.webp", alt: { zh: "数据与曲线织机", en: "A data and curve loom" } },
    tags: ["DCF", "Data", "Determinism"],
  },
  {
    slug: "render-lab",
    number: "04",
    title: { zh: "Render Lab", en: "Render Lab" },
    summary: { zh: "实时比较 Full、Balanced 与 Calm 三档视觉预算对粒子、帧率和画面密度的影响。", en: "Compare Full, Balanced, and Calm visual budgets across particles, frame rate, and scene density." },
    principle: { zh: "高级动效首先是稳定的资源调度。", en: "Sophisticated motion begins with stable resource scheduling." },
    image: { src: "/cstd-universe/cstd-skill-reactor-v1.webp", alt: { zh: "渲染质量反应堆", en: "A render-quality reactor" } },
    tags: ["Canvas", "Performance", "Motion"],
  },
] as const;

export function getCstdLab(slug: string) {
  return cstdLabs.find((entry) => entry.slug === slug);
}

export function getLabPath(lab: CstdLab, locale: CstdLocale) {
  return locale === "en" ? `/en/lab/${lab.slug}` : `/lab/${lab.slug}`;
}
