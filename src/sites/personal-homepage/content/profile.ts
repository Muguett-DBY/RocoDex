import type { LocalizedText } from "./content-types";

export const cstdProfile = {
  name: { zh: "奶黄包", en: "Custard" },
  title: { zh: "人工智能博 0 · 数据科学与产品开发", en: "AI PhD Year 0 · Data science and product development" },
  availability: { zh: "准备迈入人工智能博士阶段，继续做分析、研究工具和个人产品", en: "Preparing for doctoral study in AI while building analyses, research tools, and personal products" },
  summary: {
    zh: "数据科学本硕背景，现在是人工智能博 0。用 R、Python 和 SQL 分析真实数据，也用 React、Next.js 把想法做成能用的产品。这里放着我的作品，以及每一步怎么做、为什么这么做。",
    en: "My background is in data science at bachelor's and master's level. Now at PhD Year 0 in AI, I use R, Python, and SQL to explore real data, and React and Next.js to build useful products. Here is the work and the thinking behind it.",
  },
  intro: {
    zh: "我的本硕背景是数据科学，现在是人工智能博 0，正在为博士阶段做准备。我用 R、Python 和 SQL 做数据分析、统计建模与可视化，也用 React、Next.js 和 Cloudflare 构建产品。最近关注 AI Agent、可靠性评估与可复现研究。这里有我对 147 万行墨尔本开放数据的分析、正在维护的产品，以及开发时的选择、踩过的坑和验证结果。",
    en: "My bachelor's and master's studies are in data science. I'm now at PhD Year 0 in artificial intelligence, preparing for doctoral study. I use R, Python, and SQL for data analysis, statistical modelling, and visualisation, and React, Next.js, and Cloudflare to build products. My current interests include AI agents, reliability evaluation, and reproducible research. Here you can explore my analysis of 1.47 million Melbourne open-data records, the products I maintain, and what I learned while building them.",
  },
  now: {
    updatedAt: "2026-10-11",
    focus: {
      zh: "人工智能博 0：准备博士阶段的研究，同时继续做开放数据分析和能用的产品。最近在琢磨 AI Agent 的可靠性，以及怎样把实验做得可复现。",
      en: "At PhD Year 0 in AI, I'm preparing for doctoral research while continuing to analyse open data and build useful products. Lately, I've been exploring AI agent reliability and reproducible experiments.",
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
      id: "ai-year-zero",
      stage: { zh: "当前 · 博 0", en: "Now · PhD Year 0" },
      field: { zh: "人工智能", en: "Artificial Intelligence" },
      detail: {
        zh: "正在为博士阶段做准备，关注 AI Agent、可靠性评估与可复现研究。",
        en: "Preparing for doctoral study, with an interest in AI agents, reliability evaluation, and reproducible research.",
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
