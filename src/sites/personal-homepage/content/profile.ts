import type { LocalizedText } from "./content-types";

export const cstdProfile = {
  name: { zh: "奶黄包", en: "Custard" },
  title: { zh: "数据科学研究生 · 把分析、数据系统和产品一起交付的人", en: "Data science postgraduate · delivering analysis, data systems, and products together" },
  location: { zh: "墨尔本", en: "Melbourne, Australia" },
  availability: { zh: "在莫纳什读数据科学硕士，同时持续构建个人产品", en: "Studying data science at Monash while continuously building personal products" },
  intro: {
    zh: "我在莫纳什读数据科学硕士；本科在悉尼大学从化学与生物分子工程转入数据科学。不管是在 R 里清洗 147 万行开放数据，还是把分析做成能上线的产品，我的工作方式都一样：问题是真实的，数据是可核验的，结论能复算，产品能交付。这个站不是技能清单，放的是作品、取舍，以及它们后来怎么被验证。",
    en: "I am finishing a Master of Data Science at Monash; my undergraduate path at the University of Sydney moved from chemical and biomolecular engineering into data science. Whether I am wrangling 1.47 million rows of open data in R or turning an analysis into a shipped product, the working method stays the same: real questions, verifiable data, reproducible conclusions, and products that actually run. This site is not a skills list; it keeps the work, the trade-offs, and how they were checked.",
  },
  now: {
    updatedAt: "2026-09-06",
    focus: {
      zh: "把数据科学的训练和多年的产品构建接起来：用开放数据做经得起复算的分析，再把分析长成可用的产品。",
      en: "Connecting formal data science training with years of product building: open-data analysis that survives rechecking, then grows into usable products.",
    },
    building: [
      { zh: "墨尔本开放数据的行人与微气候分析，以及同源数据上的产品实验。", en: "Melbourne open-data pedestrian and microclimate analysis, plus product experiments on the same data." },
      { zh: "面向澳洲劳动力市场与城市生活场景的数据产品。", en: "Data products aimed at the Australian labour market and urban life." },
      { zh: "证据优先的研究工具与确定性计算。", en: "Evidence-first research tools and deterministic computation." },
    ] satisfies readonly LocalizedText[],
    learning: [
      { zh: "统计建模、大数据处理与生物信息学把产品直觉补成方法论。", en: "Statistical modelling, big-data processing, and bioinformatics turning product instinct into method." },
      { zh: "把化工的边界、守恒与实验直觉迁移到数据工作流。", en: "Translating chemical-engineering intuition about boundaries, balances, and experiments into data workflows." },
    ] satisfies readonly LocalizedText[],
  },
  education: [
    {
      period: "2025—2026",
      school: "Monash University",
      degree: { zh: "数据科学硕士（Master of Data Science）", en: "Master of Data Science" },
      detail: {
        zh: "数据清洗、数据科学基础、探索性分析与可视化、统计建模、大数据处理、数据库、Python、计算机网络与生物信息学。",
        en: "Data wrangling, foundations of data science, exploration and visualisation, statistical modelling, big-data processing, databases, Python, computer architecture and networks, and bioinformatics.",
      },
    },
    {
      period: "2020—2024",
      school: "The University of Sydney",
      degree: { zh: "理学学士 — 数据科学主修，化学辅修", en: "Bachelor of Science — Data Science major, Chemistry minor" },
      detail: {
        zh: "从化学与生物分子工程转入数据科学：数学、统计与算法打底，把化工的边界与守恒思维带进数据系统。",
        en: "Moved from chemical and biomolecular engineering into data science: mathematics, statistics, and algorithms, carrying chemical-engineering thinking about boundaries and balances into data systems.",
      },
    },
  ] satisfies readonly {
    period: string;
    school: string;
    degree: LocalizedText;
    detail: LocalizedText;
  }[],
  capabilities: [
    { label: { zh: "数据分析与建模", en: "Data analysis and modelling" }, value: "R · Python · SQL · pandas · data.table · ggplot2 · Statistical modelling" },
    { label: { zh: "产品与前端", en: "Product and frontend" }, value: "React · Next.js · TypeScript · UX · Three.js" },
    { label: { zh: "边缘与数据工程", en: "Edge and data engineering" }, value: "Cloudflare · D1 · R2 · Supabase · Hono · SQL" },
    { label: { zh: "研究与 AI", en: "Research and AI" }, value: "Evidence pipelines · Agents · DCF · Open-data analysis" },
  ],
} as const;
