import type { LocalizedText } from "./content-types";

const doctoralStage = { zh: "博士在读", en: "PhD research" } as const satisfies LocalizedText;
const researchFocus = {
  zh: "智能体可靠性评估 · 可复现研究",
  en: "AI agent reliability · Reproducible research",
} as const satisfies LocalizedText;

export const cstdProfile = {
  name: { zh: "奶黄包", en: "Custard" },
  title: { zh: "人工智能博士研究生", en: "PhD Researcher in Artificial Intelligence" },
  researchFocus,
  doctoralStage,
  academicBackground: { zh: "数据科学本硕", en: "Bachelor’s & Master’s in Data Science" },
  availability: { zh: "持续做数据分析、研究工具和个人产品", en: "Building data analyses, research tools, and personal products" },
  summary: {
    zh: "人工智能博士研究生，研究兴趣为智能体可靠性评估与可复现研究。",
    en: "PhD researcher in artificial intelligence. Research interests include AI agent reliability and reproducible research.",
  },
  intro: {
    zh: "人工智能博士研究生，本科及硕士专业为数据科学。研究兴趣为智能体可靠性评估与可复现研究。代表项目包括城市开放数据分析、数据产品与研究工具。",
    en: "PhD researcher in artificial intelligence, with bachelor’s and master’s degrees in data science. Research interests include AI agent reliability and reproducible research. Selected projects span urban open-data analysis, data products and research tools.",
  },
  now: {
    updatedAt: "2026-11-12",
    focus: {
      zh: "智能体可靠性评估、可复现实验设计，以及数据分析与产品开发。",
      en: "AI agent reliability, reproducible experimental design, and ongoing work in data analysis and product development.",
    },
    building: [
      { zh: "墨尔本开放数据的行人与微气候分析，以及同源数据上的产品实验。", en: "Melbourne open-data pedestrian and microclimate analysis, plus product experiments on the same data." },
      { zh: "面向澳洲劳动力市场与城市生活场景的数据产品。", en: "Data products aimed at the Australian labour market and urban life." },
      { zh: "证据优先的研究工具与确定性计算。", en: "Evidence-first research tools and deterministic computation." },
    ] satisfies readonly LocalizedText[],
    learning: [
      { zh: "机器学习、统计建模与实验设计，让判断有依据。", en: "Machine learning, statistical modelling, and experimental design to make better-supported decisions." },
      { zh: "AI Agent 的评估方法：先说清任务，再检查结果能否重复。", en: "AI agent evaluation: define the task clearly, then check whether the results hold up across repeated runs." },
    ] satisfies readonly LocalizedText[],
  },
  education: [
    {
      id: "ai-phd",
      stage: doctoralStage,
      field: { zh: "人工智能", en: "Artificial Intelligence" },
      detail: researchFocus,
    },
    {
      id: "data-science",
      stage: { zh: "本硕背景", en: "Bachelor's & master's study" },
      field: { zh: "数据科学", en: "Data Science" },
      detail: {
        zh: "数学、统计与算法打底，做数据清洗、探索性分析、建模、可视化与数据产品。",
        en: "A foundation in mathematics, statistics, and algorithms, applied to data wrangling, exploration, modelling, visualisation, and data products.",
      },
    },
  ] satisfies readonly {
    id: string;
    stage: LocalizedText;
    field: LocalizedText;
    detail: LocalizedText;
  }[],
  capabilities: [
    { label: { zh: "数据分析与建模", en: "Data analysis and modelling" }, value: "R · Python · SQL · pandas · data.table · ggplot2 · Statistical modelling" },
    { label: { zh: "产品与前端", en: "Product and frontend" }, value: "React · Next.js · TypeScript · UX · Three.js" },
    { label: { zh: "边缘与数据工程", en: "Edge and data engineering" }, value: "Cloudflare · D1 · R2 · Supabase · Hono · SQL" },
    { label: { zh: "研究与 AI", en: "Research and AI" }, value: "Evidence pipelines · Agents · DCF · Open-data analysis" },
  ],
} as const;
