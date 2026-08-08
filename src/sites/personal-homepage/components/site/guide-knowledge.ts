import type { CstdLocale, LocalizedText } from "../../content/content-types";

export type GuideKnowledgeEntry = Readonly<{
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  href: Readonly<Record<CstdLocale, string>>;
  keywords: readonly string[];
}>;

export const guideKnowledge: readonly GuideKnowledgeEntry[] = [
  {
    id: "boundaries",
    title: { zh: "双站架构边界", en: "Dual-site architecture boundaries" },
    summary: { zh: "RocoDex 与个人主站共享 Next.js/Vercel 容器，但用 Host 决策、route group、最小 public API 和导入测试隔离。", en: "RocoDex and the portfolio share a Next.js/Vercel container while host decisions, route groups, narrow APIs, and import tests preserve isolation." },
    href: { zh: "/notes/host-boundaries-in-one-next-deployment", en: "/en/notes/host-boundaries-in-one-next-deployment" },
    keywords: ["next", "架构", "边界", "route", "host", "rocodex", "deployment", "architecture"],
  },
  {
    id: "evidence-ai",
    title: { zh: "证据优先 AI", en: "Evidence-first AI" },
    summary: { zh: "CSTD Alpha 将数据收集、证据指纹、后台综合和发布拆开，证据未变化时复用结果，过期回调无权覆盖当前报告。", en: "CSTD Alpha separates collection, evidence fingerprints, background synthesis, and publication. Unchanged evidence reuses results and stale callbacks cannot overwrite current reports." },
    href: { zh: "/work/alpha-research-system", en: "/en/work/alpha-research-system" },
    keywords: ["ai", "模型", "证据", "agent", "research", "alpha", "研究", "evidence"],
  },
  {
    id: "determinism",
    title: { zh: "确定性估值内核", en: "Deterministic valuation core" },
    summary: { zh: "DCF 公式拥有最终决定权，AI 只解释假设。每个版本保存数据快照、缺口、fallback 和实际计算口径。", en: "DCF formulas retain final authority while AI explains assumptions. Each version preserves snapshots, gaps, fallbacks, and the applied calculation basis." },
    href: { zh: "/notes/deterministic-core-ai-edge", en: "/en/notes/deterministic-core-ai-edge" },
    keywords: ["dcf", "估值", "公式", "finance", "valuation", "确定性", "wacc"],
  },
  {
    id: "performance",
    title: { zh: "全市场扫描性能", en: "Market-wide scan performance" },
    summary: { zh: "实测发现热点在重复缓存 JSON 解析与序列化，而不是 DCF 数学；优化保留了数据指纹与运行清单。", en: "Profiling found repeated cache JSON parsing and serialization, not DCF math, dominating runtime while data fingerprints and manifests remained intact." },
    href: { zh: "/notes/observable-dcf-pipeline", en: "/en/notes/observable-dcf-pipeline" },
    keywords: ["性能", "缓存", "json", "python", "profile", "performance", "cache", "scan"],
  },
  {
    id: "crm",
    title: { zh: "CRM 并发与权限", en: "CRM concurrency and permissions" },
    summary: { zh: "CFZZS 用服务端 RBAC 数据范围与乐观锁保护多人线索流转，旧版本更新返回冲突而不是静默覆盖。", en: "CFZZS protects multi-user lead transitions with server-side RBAC scopes and optimistic locking; stale writes conflict instead of silently overwriting." },
    href: { zh: "/work/cfzzs-crm", en: "/en/work/cfzzs-crm" },
    keywords: ["crm", "权限", "并发", "rbac", "乐观锁", "concurrency", "locking"],
  },
  {
    id: "visual",
    title: { zh: "单画布沉浸式前端", en: "Single-canvas immersive frontend" },
    summary: { zh: "DOM 保留内容语义，延迟加载的单个 Canvas 负责视觉世界；隐藏页面暂停、DPR 封顶并提供 Full/Balanced/Calm 预算。", en: "DOM retains content semantics while one lazy canvas owns the visual world, pausing when hidden, capping DPR, and exposing Full/Balanced/Calm budgets." },
    href: { zh: "/notes/single-canvas-immersive-web", en: "/en/notes/single-canvas-immersive-web" },
    keywords: ["three", "canvas", "动效", "视觉", "webgl", "motion", "frontend", "performance"],
  },
  {
    id: "learning",
    title: { zh: "跨学科学习路径", en: "Interdisciplinary learning path" },
    summary: { zh: "USYD 的化工、数学、算法与数据课程，以及 Monash 的数据库、网络、数据科学、统计建模和大数据处理共同构成系统直觉。", en: "Chemical engineering, mathematics, algorithms, and data at USYD combine with databases, networks, statistics, and big data at Monash to form systems intuition." },
    href: { zh: "/about", en: "/en/about" },
    keywords: ["学习", "课程", "usyd", "monash", "education", "化工", "data", "study"],
  },
];
