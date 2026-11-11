import type { LocalizedText } from "./content-types";

export const cstdDoctoralStatus = {
  zh: "人工智能 · 博士在读（第一年）",
  en: "Artificial Intelligence · PhD Year 1",
} as const satisfies LocalizedText;

export const cstdEducationIntro = {
  zh: "我在攻读人工智能方向的博士学位，本科和硕士都读的是数据科学。",
  en: "I'm pursuing a PhD in artificial intelligence. I studied data science for both my bachelor's and master's degrees.",
} as const satisfies LocalizedText;

export const cstdProfile = {
  name: { zh: "奶黄包", en: "Custard" },
  title: {
    zh: `${cstdDoctoralStatus.zh} · 数据科学与产品开发`,
    en: `${cstdDoctoralStatus.en} · Data science and product development`,
  },
  availability: { zh: "持续做数据分析、研究工具和个人产品", en: "Building data analyses, research tools, and personal products" },
  summary: {
    zh: `${cstdEducationIntro.zh}平时用 R、Python 和 SQL 分析数据，也用 React 和 Next.js 做产品。这里记录了我的作品和背后的取舍。`,
    en: `${cstdEducationIntro.en} I analyse data with R, Python, and SQL and build products with React and Next.js. This site collects my work and the decisions behind it.`,
  },
  intro: {
    zh: `${cstdEducationIntro.zh}我用 R、Python 和 SQL 做数据分析、统计建模与可视化，也用 React、Next.js 和 Cloudflare 构建产品。最近关注 AI Agent、可靠性评估与可复现研究。这里有我对 147 万行墨尔本开放数据的分析、正在维护的产品，以及开发时的选择、踩过的坑和验证结果。`,
    en: `${cstdEducationIntro.en} I use R, Python, and SQL for data analysis, statistical modelling, and visualisation, and React, Next.js, and Cloudflare to build products. My current interests include AI agents, reliability evaluation, and reproducible research. Here you can explore my analysis of 1.47 million Melbourne open-data records, the products I maintain, and what I learned while building them.`,
  },
  now: {
    updatedAt: "2026-11-11",
    focus: {
      zh: "读博期间，我也在继续做数据分析和产品开发。最近关注 AI Agent 的可靠性，以及怎样设计可以复现的实验。",
      en: "Alongside my PhD, I continue to analyse data and build products. I'm interested in how to assess AI agent reliability and make experiments reproducible.",
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
      stage: { zh: "博士在读（第一年）", en: "PhD Year 1" },
      field: { zh: "人工智能", en: "Artificial Intelligence" },
      detail: {
        zh: "关注 AI Agent、可靠性评估与可复现研究。",
        en: "Research interests include AI agents, reliability evaluation, and reproducible research.",
      },
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
