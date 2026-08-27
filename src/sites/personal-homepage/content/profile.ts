import type { CstdLocale, LocalizedText } from "./content-types";

export const cstdProfile = {
  name: { zh: "奶黄包", en: "Custard" },
  title: { zh: "产品工程师 / 创作工具与研究系统构建者", en: "Product engineer / builder of creative tools and research systems" },
  location: { zh: "悉尼 / 南京", en: "Sydney / Nanjing" },
  availability: { zh: "正在做独立产品，也在整理做产品的方法", en: "Building independent products and writing down how they get made" },
  intro: {
    zh: "我做产品，也做产品背后的系统：界面、数据、AI、研究和发布都要对真实使用负责。这个站不是技能清单，放在这里的是作品、取舍，以及它们后来怎么被验证。",
    en: "I build products and the systems behind them: interfaces, data, AI, research, and release all have to answer to real use. This site is not a skills list; it keeps the work, the trade-offs, and how they were checked.",
  },
  now: {
    updatedAt: "2026-08-27",
    focus: {
      zh: "把 CSTD 17.0 做成一个能慢慢长大的个人档案：先让人看见我在做什么，再把作品、方法和验证过程连起来。",
      en: "Making CSTD 17.0 into a personal archive that can grow: show what I am making first, then connect the work to its methods and checks.",
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
