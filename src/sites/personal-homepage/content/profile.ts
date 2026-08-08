import type { CstdLocale, LocalizedText } from "./content-types";

export const cstdProfile = {
  name: { zh: "奶黄包", en: "Custard" },
  title: { zh: "产品工程师 / 创意系统构建者", en: "Product engineer / creative systems builder" },
  location: { zh: "悉尼 / 南京", en: "Sydney / Nanjing" },
  availability: { zh: "持续构建独立产品与研究工具", en: "Building independent products and research tools" },
  intro: {
    zh: "我把产品、数据、AI、研究与视觉工程编译成真正运行的系统。这里不把技术栈当徽章，而把每一个架构决定、失败边界和发布证据放回作品本身。",
    en: "I compile product, data, AI, research, and visual engineering into systems that actually run. Technologies are not badges here; architecture decisions, failure boundaries, and release evidence stay attached to the work.",
  },
  now: {
    updatedAt: "2026-08-08",
    focus: {
      zh: "把 CSTD 从一张高冲击主页扩展为可阅读、可验证、可持续维护的个人技术世界。",
      en: "Expanding CSTD from a high-impact homepage into a readable, verifiable, and maintainable technical world.",
    },
    building: [
      { zh: "证据优先的公司研究与确定性估值工具。", en: "Evidence-first company research and deterministic valuation tools." },
      { zh: "把真实产品案例整理为带决策与复盘的长期档案。", en: "Turning shipped products into durable archives of decisions and postmortems." },
      { zh: "在不牺牲性能与无障碍的前提下探索浏览器视觉叙事。", en: "Exploring browser-native visual storytelling without sacrificing performance or accessibility." },
    ] satisfies readonly LocalizedText[],
    learning: [
      { zh: "Monash：数据探索与可视化、统计建模、大数据处理。", en: "Monash: data exploration and visualization, statistical modeling, and big-data processing." },
      { zh: "把化工的边界、守恒与实验直觉迁移到软件系统。", en: "Translating chemical-engineering intuition about boundaries, balances, and experiments into software." },
    ] satisfies readonly LocalizedText[],
  },
  education: [
    {
      period: "2025—2026",
      school: "Monash University",
      detail: { zh: "数据库、Python、网络、数据科学、数据清洗、统计建模、可视化与大数据处理。", en: "Databases, Python, networks, data science, wrangling, statistical modeling, visualization, and big-data processing." },
    },
    {
      period: "2020—2024",
      school: "The University of Sydney",
      detail: { zh: "化学工程、化学、数学、算法与数据科学；从能量衡算与传递过程走向系统工程。", en: "Chemical engineering, chemistry, mathematics, algorithms, and data science, moving from balances and transport to systems engineering." },
    },
  ],
  capabilities: [
    { label: { zh: "产品与前端", en: "Product and frontend" }, value: "React · Next.js · TypeScript · UX · Three.js" },
    { label: { zh: "边缘与数据", en: "Edge and data" }, value: "Cloudflare · D1 · R2 · Hono · SQL · Python" },
    { label: { zh: "研究与 AI", en: "Research and AI" }, value: "Evidence pipelines · Agents · DCF · Data science" },
    { label: { zh: "质量与交付", en: "Quality and delivery" }, value: "Vitest · Playwright · CI/CD · RUM · Release acceptance" },
  ],
} as const;

export function getLocalePrefix(locale: CstdLocale) {
  return locale === "en" ? "/en" : "";
}
