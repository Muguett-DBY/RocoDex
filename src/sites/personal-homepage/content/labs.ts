import type { ContentImage, CstdLocale, LocalizedText } from "./content-types";

export type CstdLabRenderer = "system-trace" | "agent-replay" | "data-lens" | "render-lab" | "proof-museum";

export type CstdLab = Readonly<{
  slug: CstdLabRenderer;
  renderer: CstdLabRenderer;
  number: string;
  version: string;
  updatedAt: string;
  title: LocalizedText;
  summary: LocalizedText;
  principle: LocalizedText;
  image: ContentImage;
  tags: readonly string[];
  evidenceHref: Readonly<Record<CstdLocale, string>>;
}>;

export const cstdLabs: readonly CstdLab[] = [
  {
    slug: "system-trace",
    renderer: "system-trace",
    number: "01",
    version: "1.1.0",
    updatedAt: "2026-08-09",
    title: { zh: "System Trace", en: "System Trace" },
    summary: { zh: "沿一条真实请求穿过 Host 决策、路由边界、站点模块和渲染阶段。", en: "Follow a request through host decisions, route boundaries, site modules, and rendering." },
    principle: { zh: "边界必须在请求进入产品树之前生效。", en: "Boundaries take effect before a request enters the product tree." },
    image: { src: "/cstd-universe/cstd-neural-gate-v1.webp", alt: { zh: "系统请求入口", en: "A system request gate" } },
    tags: ["Routing", "Architecture", "Observability"],
    evidenceHref: { zh: "/work/rocodex-platform", en: "/en/work/rocodex-platform" },
  },
  {
    slug: "agent-replay",
    renderer: "agent-replay",
    number: "02",
    version: "1.1.0",
    updatedAt: "2026-08-09",
    title: { zh: "Agent Replay", en: "Agent Replay" },
    summary: { zh: "重放一个证据优先研究任务，观察收集、指纹、排队、综合与发布。", en: "Replay an evidence-first research job across collection, fingerprinting, queueing, synthesis, and publication." },
    principle: { zh: "过期任务可以完成，但不能覆盖当前事实。", en: "A stale job may finish, but it cannot overwrite current truth." },
    image: { src: "/cstd-universe/cstd-broadcast-nexus-v1.webp", alt: { zh: "异步任务广播节点", en: "An asynchronous job broadcast node" } },
    tags: ["AI", "Jobs", "Evidence"],
    evidenceHref: { zh: "/work/alpha-research-system", en: "/en/work/alpha-research-system" },
  },
  {
    slug: "data-lens",
    renderer: "data-lens",
    number: "03",
    version: "1.1.0",
    updatedAt: "2026-08-09",
    title: { zh: "Data Lens", en: "Data Lens" },
    summary: { zh: "调整增长、折现率与安全边际，直接看确定性 DCF 区间如何响应。", en: "Adjust growth, discount rate, and margin of safety to see deterministic DCF ranges respond." },
    principle: { zh: "交互改变假设，不改变公式。", en: "Interaction changes assumptions, not formulas." },
    image: { src: "/cstd-world/cstd-data-loom-v2.webp", alt: { zh: "数据与曲线织机", en: "A data and curve loom" } },
    tags: ["DCF", "Data", "Determinism"],
    evidenceHref: { zh: "/work/dcf-quantum", en: "/en/work/dcf-quantum" },
  },
  {
    slug: "render-lab",
    renderer: "render-lab",
    number: "04",
    version: "1.1.0",
    updatedAt: "2026-08-09",
    title: { zh: "Render Lab", en: "Render Lab" },
    summary: { zh: "实时比较 Full、Balanced 与 Calm 三档视觉预算对粒子、帧率和画面密度的影响。", en: "Compare Full, Balanced, and Calm visual budgets across particles, frame rate, and scene density." },
    principle: { zh: "高级动效首先是稳定的资源调度。", en: "Sophisticated motion begins with stable resource scheduling." },
    image: { src: "/cstd-universe/cstd-skill-reactor-v1.webp", alt: { zh: "渲染质量反应堆", en: "A render-quality reactor" } },
    tags: ["Canvas", "Performance", "Motion"],
    evidenceHref: { zh: "/notes/single-canvas-immersive-web", en: "/en/notes/single-canvas-immersive-web" },
  },
  {
    slug: "proof-museum",
    renderer: "proof-museum",
    number: "05",
    version: "1.0.0",
    updatedAt: "2026-08-09",
    title: { zh: "Proof Museum", en: "Proof Museum" },
    summary: { zh: "在四座证据胶囊中重放竞态、缓存、路由和业务锁边界。", en: "Replay race, cache, routing, and operational-lock boundaries across four evidence capsules." },
    principle: { zh: "展示工程能力最好的方式，是让关键边界可以被重新运行。", en: "The strongest way to present engineering ability is to make its critical boundaries runnable again." },
    image: { src: "/cstd-universe/cstd-evidence-foundry-v2.webp", alt: { zh: "围绕验证核心运行的四座证据胶囊", en: "Four evidence capsules operating around a verification core" } },
    tags: ["Evidence", "Workers", "Determinism"],
    evidenceHref: { zh: "/proof.json", en: "/proof.json" },
  },
] as const;

export function getCstdLab(slug: string) {
  return cstdLabs.find((entry) => entry.slug === slug);
}

export function getLabPath(lab: CstdLab, locale: CstdLocale) {
  return locale === "en" ? `/en/lab/${lab.slug}` : `/lab/${lab.slug}`;
}
