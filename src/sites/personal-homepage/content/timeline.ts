import type { CstdLocale, LocalizedText } from "./content-types";
import type { CstdSystem } from "./systems";

export type CstdTimelineEntry = Readonly<{
  id: string;
  /** ISO day/month, or YYYY-H1 / YYYY-H2 when only the study period is known. */
  date: string;
  datePrecision: "day" | "month" | "half-year";
  kind: "education" | "project" | "writing" | "diagnosis" | "release" | "research";
  recordType: "coursework" | "team-coursework" | "team-prototype" | "personal-project" | "public-note" | "research-plan" | "release";
  title: LocalizedText;
  summary: LocalizedText;
  technologies: readonly string[];
  capabilityIds: readonly CstdSystem["id"][];
  evidence: LocalizedText;
}>;

export const CSTD_TIMELINE_REVIEWED_AT = "2026-10-11";

export function getCstdTimelineSortKey(date: string) {
  return date.replace("-H1", "-01").replace("-H2", "-07");
}

export function getCstdTimelineDateLabel(entry: Pick<CstdTimelineEntry, "date" | "datePrecision">, locale: CstdLocale) {
  const year = entry.date.slice(0, 4);
  if (entry.datePrecision === "half-year") {
    const firstHalf = entry.date.endsWith("H1");
    return locale === "zh" ? `${year} ${firstHalf ? "上半年" : "下半年"}` : `${firstHalf ? "First" : "Second"} half of ${year}`;
  }
  const month = Number(entry.date.slice(5, 7));
  if (locale === "zh") return `${year} 年 ${month} 月`;
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${months[month - 1]} ${year}`;
}

export const cstdTimeline: readonly CstdTimelineEntry[] = [
  {
    "id": "chemistry-foundations",
    "date": "2020-H2",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "从实验台开始：光、溶液与测量",
      "en": "Starting at the lab bench: light, solutions and measurement"
    },
    "summary": {
      "zh": "先学会把一次实验记清楚：改了哪个条件、测到了什么、结果能说明什么。",
      "en": "I started by documenting experiments: what changed, what was measured and what the result could tell us."
    },
    "technologies": [
      "Photochemistry",
      "UV–Vis",
      "Titration",
      "Calibration",
      "Experimental controls"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-chemistry-foundations",
      "en": "/en/about#timeline-chemistry-foundations"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "engineering-design",
    "date": "2020-H2",
    "kind": "project",
    "recordType": "team-coursework",
    "title": {
      "zh": "把社区需求拆成设计要求",
      "en": "Turning community needs into design requirements"
    },
    "summary": {
      "zh": "团队设计从“大家觉得需要什么”，走到需求、约束、方案和交付物。",
      "en": "A team design exercise moved from broad community needs to requirements, constraints, proposals and deliverables."
    },
    "technologies": [
      "Design brief",
      "Requirements",
      "Constraints",
      "Concept evaluation",
      "Team reflection"
    ],
    "capabilityIds": [
      "product-surfaces",
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-engineering-design",
      "en": "/en/about#timeline-engineering-design"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "chemical-process-review",
    "date": "2020-H2",
    "kind": "writing",
    "recordType": "coursework",
    "title": {
      "zh": "第一批文献梳理：啤酒是怎样做出来的",
      "en": "An early literature review: how beer is made"
    },
    "summary": {
      "zh": "尝试把原料、反应和生产步骤连起来，写成别人能读懂的工艺说明。",
      "en": "I connected ingredients, reactions and production steps in a readable process review."
    },
    "technologies": [
      "Literature review",
      "Fermentation",
      "Process flow",
      "Material properties"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-chemical-process-review",
      "en": "/en/about#timeline-chemical-process-review"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "youth-alcohol-analysis",
    "date": "2020-11",
    "kind": "education",
    "recordType": "team-coursework",
    "title": {
      "zh": "第一次用 R 把社会问题画出来",
      "en": "Using R to explore a social question"
    },
    "summary": {
      "zh": "分析青少年饮酒调查，开始接触真实数据的分组、趋势与局限。",
      "en": "An analysis of youth alcohol surveys introduced grouped data, trends and limitations."
    },
    "technologies": [
      "R",
      "R Markdown",
      "data.table",
      "ggplot2",
      "Descriptive statistics"
    ],
    "capabilityIds": [
      "research-models",
      "data-systems"
    ],
    "evidence": {
      "zh": "/about#timeline-youth-alcohol-analysis",
      "en": "/en/about#timeline-youth-alcohol-analysis"
    },
    "datePrecision": "month"
  },
  {
    "id": "traffic-comparison",
    "date": "2020-11",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "按时间、方向和车型比较交通流量",
      "en": "Comparing traffic by time, direction and vehicle type"
    },
    "summary": {
      "zh": "把同一条隧道两年的交通记录拆开看，学习让比较条件保持一致。",
      "en": "Compared two years of tunnel traffic by keeping the time, direction and vehicle categories consistent."
    },
    "technologies": [
      "R",
      "CSV",
      "Time intervals",
      "Grouped comparison",
      "Exploratory analysis"
    ],
    "capabilityIds": [
      "research-models",
      "data-systems"
    ],
    "evidence": {
      "zh": "/about#timeline-traffic-comparison",
      "en": "/en/about#timeline-traffic-comparison"
    },
    "datePrecision": "month"
  },
  {
    "id": "calculus-linear-algebra",
    "date": "2021-H1",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "补上微积分和线性代数这层底座",
      "en": "Building foundations in calculus and linear algebra"
    },
    "summary": {
      "zh": "练习把变化率、累积量和线性关系写成数学表达，后来再把它们用到模型里。",
      "en": "Practised expressing rates, accumulated quantities and linear relationships mathematically, ready to use them in models."
    },
    "technologies": [
      "Calculus",
      "Integration",
      "Matrices",
      "Linear systems",
      "Mathematical notation"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-calculus-linear-algebra",
      "en": "/en/about#timeline-calculus-linear-algebra"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "rural-irrigation",
    "date": "2021-04",
    "kind": "project",
    "recordType": "team-coursework",
    "title": {
      "zh": "给缺水地区设计一套灌溉方案",
      "en": "Designing an irrigation proposal for a water-scarce region"
    },
    "summary": {
      "zh": "把降雨、蓄水、土壤湿度和设备限制放在同一张方案里考虑。",
      "en": "A design proposal brought rainfall, water storage, soil moisture and equipment limits into one system."
    },
    "technologies": [
      "System design",
      "Runoff collection",
      "Soil-moisture sensing",
      "Calibration",
      "Feasibility"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-rural-irrigation",
      "en": "/en/about#timeline-rural-irrigation"
    },
    "datePrecision": "month"
  },
  {
    "id": "green-chemistry",
    "date": "2021-05",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "绿色化学：比较产率，也比较代价",
      "en": "Green chemistry: comparing yield and its costs"
    },
    "summary": {
      "zh": "开始把废物、副产物、溶剂与操作步骤一起纳入实验判断。",
      "en": "I began evaluating waste, by-products, solvents and procedural steps alongside experimental yield."
    },
    "technologies": [
      "Green chemistry",
      "Yield",
      "Metal complexes",
      "Solvent choice",
      "Waste reduction"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-green-chemistry",
      "en": "/en/about#timeline-green-chemistry"
    },
    "datePrecision": "month"
  },
  {
    "id": "python-first-training",
    "date": "2021-H2",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "正式接触 Python 编程",
      "en": "Formal training in Python programming"
    },
    "summary": {
      "zh": "从变量和循环开始，学习把重复的计算步骤写成程序。",
      "en": "Started with variables and loops, then learned to express repeated calculations as programs."
    },
    "technologies": [
      "Python",
      "Control flow",
      "Functions",
      "Modules",
      "CSV"
    ],
    "capabilityIds": [
      "data-systems",
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-python-first-training",
      "en": "/en/about#timeline-python-first-training"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "thermodynamics",
    "date": "2021-H2",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "用能量守恒和相平衡理解系统",
      "en": "Understanding systems through energy and phase equilibrium"
    },
    "summary": {
      "zh": "练习先定义系统边界，再追踪能量、熵和物质怎样变化。",
      "en": "Practised setting system boundaries before tracking energy, entropy and material changes."
    },
    "technologies": [
      "Energy balance",
      "Entropy",
      "Exergy",
      "Equations of state",
      "Phase equilibrium"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-thermodynamics",
      "en": "/en/about#timeline-thermodynamics"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "distillation-simulation",
    "date": "2021-H2",
    "kind": "project",
    "recordType": "team-coursework",
    "title": {
      "zh": "用 Aspen HYSYS 模拟乙醇—水精馏",
      "en": "Simulating ethanol–water distillation with Aspen HYSYS"
    },
    "summary": {
      "zh": "在模拟器里改压力和热负荷，看产品组成和分离效果怎样变化。",
      "en": "Changed pressure and heat duty in a simulator to examine composition and separation performance."
    },
    "technologies": [
      "Aspen HYSYS",
      "Distillation",
      "UNIQUAC",
      "Design of experiments",
      "Sensitivity analysis"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-distillation-simulation",
      "en": "/en/about#timeline-distillation-simulation"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "aerogel-review",
    "date": "2021-H2",
    "kind": "writing",
    "recordType": "team-coursework",
    "title": {
      "zh": "把气凝胶的材料特性讲清楚",
      "en": "Explaining the material properties of aerogels"
    },
    "summary": {
      "zh": "读材料资料，尝试解释“轻”和“隔热”背后的结构与应用。",
      "en": "Read materials literature to explain the structures behind low density and thermal insulation."
    },
    "technologies": [
      "Aerogels",
      "Porous materials",
      "Thermal insulation",
      "Structure–property relations",
      "Scientific abstract"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-aerogel-review",
      "en": "/en/about#timeline-aerogel-review"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "kinetics-electrochemistry",
    "date": "2021-H2",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "从反应速度到电化学",
      "en": "From reaction rates to electrochemistry"
    },
    "summary": {
      "zh": "通过碘钟反应和电化学练习，观察浓度、温度与电势的关系。",
      "en": "Used iodine-clock and electrochemistry exercises to examine concentration, temperature and potential."
    },
    "technologies": [
      "Rate laws",
      "Arrhenius equation",
      "Activation energy",
      "Electrochemistry",
      "Chromatography"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-kinetics-electrochemistry",
      "en": "/en/about#timeline-kinetics-electrochemistry"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "numerical-foundations",
    "date": "2022-H1",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "用 MATLAB 解方程和模拟反应过程",
      "en": "Solving equations and modelling reactions with MATLAB"
    },
    "summary": {
      "zh": "把物料衡算写成方程，再用数值方法看浓度随时间怎样变化。",
      "en": "Turned material balances into equations and used numerical methods to follow concentrations over time."
    },
    "technologies": [
      "MATLAB",
      "fsolve",
      "Ordinary differential equations",
      "Initial-value problems",
      "Numerical methods"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-numerical-foundations",
      "en": "/en/about#timeline-numerical-foundations"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "heat-transfer",
    "date": "2022-H1",
    "kind": "writing",
    "recordType": "coursework",
    "title": {
      "zh": "把传热和过冷现象写成解释",
      "en": "Explaining heat transfer and supercooling"
    },
    "summary": {
      "zh": "尝试回答一个看似简单的问题：纯水为什么可能低于冰点还不结冰？",
      "en": "Examined why pure water can remain liquid below its freezing point."
    },
    "technologies": [
      "Heat transfer",
      "Conduction",
      "Phase change",
      "Supercooling",
      "Nucleation"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-heat-transfer",
      "en": "/en/about#timeline-heat-transfer"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "java-objects",
    "date": "2022-H2",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "用 Java 学程序结构和对象关系",
      "en": "Learning program structure and object relationships in Java"
    },
    "summary": {
      "zh": "不只写一串指令，也开始考虑类、接口和数据结构怎样组织。",
      "en": "Moved beyond sequences of instructions to organising classes, interfaces and data structures."
    },
    "technologies": [
      "Java",
      "Object-oriented programming",
      "Inheritance",
      "Polymorphism",
      "Collections",
      "HashMap"
    ],
    "capabilityIds": [
      "data-systems",
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-java-objects",
      "en": "/en/about#timeline-java-objects"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "discrete-maths",
    "date": "2022-H2",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "开始用离散数学理解计算问题",
      "en": "Using discrete mathematics to understand computing"
    },
    "summary": {
      "zh": "练习逻辑、证明和离散结构，补上算法表达需要的语言。",
      "en": "Practised logic, proof and discrete structures as a language for expressing algorithms."
    },
    "technologies": [
      "Discrete mathematics",
      "Logic",
      "Proof",
      "Combinatorics",
      "Discrete structures"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-discrete-maths",
      "en": "/en/about#timeline-discrete-maths"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "negotiation-strategy",
    "date": "2022-H2",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "技术之外，也学怎样比较策略",
      "en": "Learning to compare strategies beyond technical work"
    },
    "summary": {
      "zh": "接触经济策略与谈判，理解一个选择还会受激励、信息和其他人的选择影响。",
      "en": "Studied economic strategy and negotiation, considering incentives, information and other people's choices."
    },
    "technologies": [
      "Economic strategy",
      "Negotiation",
      "Incentives",
      "Decision-making",
      "Trade-offs"
    ],
    "capabilityIds": [
      "product-surfaces",
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-negotiation-strategy",
      "en": "/en/about#timeline-negotiation-strategy"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "algorithms-practice",
    "date": "2023-H1",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "练习算法复杂度、树和图",
      "en": "Practising complexity, trees and graphs"
    },
    "summary": {
      "zh": "开始追问：这个算法为什么对，数据变大以后又会怎样？",
      "en": "Began asking why an algorithm is correct and how it behaves as the input grows."
    },
    "technologies": [
      "Big O",
      "Sliding windows",
      "Binary search trees",
      "Graph connectivity",
      "Minimum spanning trees"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-algorithms-practice",
      "en": "/en/about#timeline-algorithms-practice"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "spectroscopy-identification",
    "date": "2023-H1",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "用光谱线索识别未知化合物",
      "en": "Identifying an unknown compound from spectral clues"
    },
    "summary": {
      "zh": "把多个仪器给出的信息放在一起，判断哪种结构更符合证据。",
      "en": "Combined information from several measurements to assess which structure fitted the evidence."
    },
    "technologies": [
      "NMR",
      "Spectroscopy",
      "Melting point",
      "Structure elucidation",
      "Analytical chemistry"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-spectroscopy-identification",
      "en": "/en/about#timeline-spectroscopy-identification"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "metal-complex-analysis",
    "date": "2023-H1",
    "kind": "writing",
    "recordType": "coursework",
    "title": {
      "zh": "用实验和光谱解释金属配合物",
      "en": "Explaining metal complexes through experiments and spectra"
    },
    "summary": {
      "zh": "从配体到金属结合比例，练习把结构、颜色和吸收光谱联系起来。",
      "en": "Connected ligands and metal-binding ratios with structure, colour and absorption spectra."
    },
    "technologies": [
      "Schiff bases",
      "Metal–ligand complexes",
      "UV–Vis",
      "Stoichiometry",
      "Chemical characterisation"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-metal-complex-analysis",
      "en": "/en/about#timeline-metal-complex-analysis"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "analytical-metals",
    "date": "2023-H1",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "用校准曲线测水样中的金属",
      "en": "Measuring metals in water with calibration curves"
    },
    "summary": {
      "zh": "从仪器信号到浓度估计，学习定量测量需要怎样的参照。",
      "en": "Learned how reference measurements turn instrument signals into concentration estimates."
    },
    "technologies": [
      "ICP–OES",
      "Calibration curves",
      "Quantitative analysis",
      "Water hardness",
      "Environmental analysis"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-analytical-metals",
      "en": "/en/about#timeline-analytical-metals"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "natural-products",
    "date": "2023-H1",
    "kind": "writing",
    "recordType": "coursework",
    "title": {
      "zh": "把天然产物萃取过程写完整",
      "en": "Documenting natural-product extraction"
    },
    "summary": {
      "zh": "比较丁香中化合物的提取和分离方法，再用色谱观察结果。",
      "en": "Compared methods for extracting and separating compounds from cloves, using chromatography to examine the results."
    },
    "technologies": [
      "Solvent extraction",
      "Liquid–liquid extraction",
      "TLC",
      "Purification",
      "Natural products"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-natural-products",
      "en": "/en/about#timeline-natural-products"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "media-digital-transformation",
    "date": "2023-H1",
    "kind": "project",
    "recordType": "team-coursework",
    "title": {
      "zh": "跨学科团队里的媒体数字化方案",
      "en": "A media digital-transformation proposal in an interdisciplinary team"
    },
    "summary": {
      "zh": "把数据分析、网页表达和 AI 客服资料放进同一份行业命题方案。",
      "en": "Combined data analysis, web presentation and AI customer-service literature in an industry-themed coursework proposal."
    },
    "technologies": [
      "Digital transformation",
      "Data visualisation",
      "Chatbots",
      "Customer experience",
      "Observer pattern"
    ],
    "capabilityIds": [
      "product-surfaces",
      "ai-creation",
      "data-systems"
    ],
    "evidence": {
      "zh": "/about#timeline-media-digital-transformation",
      "en": "/en/about#timeline-media-digital-transformation"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "computational-chemistry",
    "date": "2023-H2",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "用计算结果观察分子能量和结构",
      "en": "Exploring molecular energy and structure computationally"
    },
    "summary": {
      "zh": "从分子点群和能量结果开始，接触量子化学里的计算表达。",
      "en": "Explored computational representations in quantum chemistry through molecular point groups and energy results."
    },
    "technologies": [
      "Quantum chemistry",
      "Molecular symmetry",
      "Point groups",
      "Hartree",
      "Computational modelling"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-computational-chemistry",
      "en": "/en/about#timeline-computational-chemistry"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "superhydrophobic-surfaces",
    "date": "2023-08",
    "kind": "project",
    "recordType": "coursework",
    "title": {
      "zh": "从表面处理到接触角：超疏水材料实验",
      "en": "Surface treatment and contact angles in a superhydrophobic-materials lab"
    },
    "summary": {
      "zh": "把材料制备和安全条件一起记录，观察表面处理怎样影响水滴行为。",
      "en": "Documented preparation and safety conditions while examining how surface treatment affects water droplets."
    },
    "technologies": [
      "Superhydrophobic surfaces",
      "Contact angle",
      "Surface treatment",
      "HIRAC",
      "Risk controls"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-superhydrophobic-surfaces",
      "en": "/en/about#timeline-superhydrophobic-surfaces"
    },
    "datePrecision": "month"
  },
  {
    "id": "scientific-python",
    "date": "2024-H1",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "把科学计算写进 Python",
      "en": "Writing scientific computations in Python"
    },
    "summary": {
      "zh": "从数组和随机数到微分方程，练习用代码描述连续变化。",
      "en": "Practised describing continuous change in code, from arrays and random numbers to differential equations."
    },
    "technologies": [
      "Python",
      "NumPy",
      "pandas",
      "Simulation",
      "Differential equations",
      "Scientific computing"
    ],
    "capabilityIds": [
      "research-models",
      "data-systems"
    ],
    "evidence": {
      "zh": "/about#timeline-scientific-python",
      "en": "/en/about#timeline-scientific-python"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "regional-business-analysis",
    "date": "2024-05",
    "kind": "project",
    "recordType": "team-coursework",
    "title": {
      "zh": "用 SQL 比较地区商业活跃度",
      "en": "Comparing regional business activity with SQL"
    },
    "summary": {
      "zh": "把零售、建筑许可和人口数据接起来，做可比较的地区指标。",
      "en": "Joined retail, building-approval and population data to create comparable regional indicators."
    },
    "technologies": [
      "SQL",
      "SA2",
      "Data joins",
      "Per-capita indicators",
      "Standardisation",
      "Correlation"
    ],
    "capabilityIds": [
      "research-models",
      "data-systems"
    ],
    "evidence": {
      "zh": "/about#timeline-regional-business-analysis",
      "en": "/en/about#timeline-regional-business-analysis"
    },
    "datePrecision": "month"
  },
  {
    "id": "data-interface",
    "date": "2024-05",
    "kind": "project",
    "recordType": "team-coursework",
    "title": {
      "zh": "把基因表达分析变成 R Shiny 工具",
      "en": "Turning gene-expression analysis into an R Shiny tool"
    },
    "summary": {
      "zh": "为肝移植相关的基因表达项目做分析和可视化，让参数和结果可以在界面里探索。",
      "en": "Contributed analysis and visualisation to a liver-transplant gene-expression project, exposing parameters and results through an interface."
    },
    "technologies": [
      "R Shiny",
      "GEOquery",
      "limma",
      "Random forest",
      "KNN",
      "SVM",
      "Cross-validation"
    ],
    "capabilityIds": [
      "research-models",
      "data-systems",
      "product-surfaces"
    ],
    "evidence": {
      "zh": "/notes/data-wrangling-as-product-design",
      "en": "/en/notes/data-wrangling-as-product-design"
    },
    "datePrecision": "month"
  },
  {
    "id": "retail-statistical-report",
    "date": "2024-H2",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "从超市销售数据练习统计建模",
      "en": "Practising statistical modelling with supermarket sales"
    },
    "summary": {
      "zh": "先检查数据，再比较商品、顾客类型和消费情况，尝试写出一个完整分析。",
      "en": "Checked the data before comparing product groups, customer types and spending in a complete analysis."
    },
    "technologies": [
      "R Markdown",
      "EDA",
      "Linear regression",
      "Hypothesis testing",
      "Data limitations"
    ],
    "capabilityIds": [
      "research-models",
      "data-systems"
    ],
    "evidence": {
      "zh": "/about#timeline-retail-statistical-report",
      "en": "/en/about#timeline-retail-statistical-report"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "airquality-graphics",
    "date": "2024-08",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "用 ggplot2 练习图表怎样说话",
      "en": "Learning how charts communicate with ggplot2"
    },
    "summary": {
      "zh": "从空气质量数据开始，比较分布、分组和图形表达。",
      "en": "Used air-quality data to explore distributions, groups and visual presentation."
    },
    "technologies": [
      "R",
      "tidyverse",
      "ggplot2",
      "Histograms",
      "Data transformation"
    ],
    "capabilityIds": [
      "research-models",
      "data-systems"
    ],
    "evidence": {
      "zh": "/about#timeline-airquality-graphics",
      "en": "/en/about#timeline-airquality-graphics"
    },
    "datePrecision": "month"
  },
  {
    "id": "activity-data-checkpoint",
    "date": "2024-09",
    "kind": "project",
    "recordType": "team-coursework",
    "title": {
      "zh": "用 pandas 检查真实步数数据",
      "en": "Checking real activity data with pandas"
    },
    "summary": {
      "zh": "个人 checkpoint 关注每天和每分钟的步数，先分清活动不足和数据缺失。",
      "en": "My individual checkpoint examined daily and minute-level steps, distinguishing low activity from missing data."
    },
    "technologies": [
      "Python",
      "pandas",
      "Jupyter",
      "Missing-data checks",
      "Variance",
      "Activity data"
    ],
    "capabilityIds": [
      "research-models",
      "data-systems"
    ],
    "evidence": {
      "zh": "/about#timeline-activity-data-checkpoint",
      "en": "/en/about#timeline-activity-data-checkpoint"
    },
    "datePrecision": "month"
  },
  {
    "id": "human-data-workflow",
    "date": "2024-10",
    "kind": "project",
    "recordType": "team-coursework",
    "title": {
      "zh": "把分析放回人的使用场景",
      "en": "Putting analysis back into its human context"
    },
    "summary": {
      "zh": "在团队项目里继续追问：数据是否够用，指标能不能回答最初的问题？",
      "en": "Continued asking whether the available data and measures could answer the team's original question."
    },
    "technologies": [
      "Human-in-the-loop",
      "Data interpretation",
      "Testing",
      "Research questions",
      "Team workflow"
    ],
    "capabilityIds": [
      "research-models",
      "data-systems"
    ],
    "evidence": {
      "zh": "/about#timeline-human-data-workflow",
      "en": "/en/about#timeline-human-data-workflow"
    },
    "datePrecision": "month"
  },
  {
    "id": "python-modular-programs",
    "date": "2025-H1",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "用 Python 写校验、模拟和提醒程序",
      "en": "Writing validation, simulation and reminder programs in Python"
    },
    "summary": {
      "zh": "进一步练习函数、列表、字典、文件和日期处理，把任务拆成可以组合的模块。",
      "en": "Extended my use of functions, lists, dictionaries, files and dates, breaking tasks into composable modules."
    },
    "technologies": [
      "Python",
      "Functions",
      "Lists & dictionaries",
      "CSV",
      "datetime",
      "Modular design"
    ],
    "capabilityIds": [
      "data-systems",
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-python-modular-programs",
      "en": "/en/about#timeline-python-modular-programs"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "computer-architecture",
    "date": "2025-H1",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "往下一层看：内存、地址与计算机结构",
      "en": "Looking underneath software: memory, addresses and architecture"
    },
    "summary": {
      "zh": "学习程序运行时的数据怎样被表示、寻址和放进内存。",
      "en": "Studied how data is represented, addressed and held in memory while a program runs."
    },
    "technologies": [
      "Computer architecture",
      "Binary representation",
      "Paging",
      "Virtual memory",
      "Address translation"
    ],
    "capabilityIds": [
      "edge-operations",
      "data-systems"
    ],
    "evidence": {
      "zh": "/about#timeline-computer-architecture",
      "en": "/en/about#timeline-computer-architecture"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "service-boundaries",
    "date": "2025-H1",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "用 Oracle SQL 做查询、约束和数据维护",
      "en": "Using Oracle SQL for queries, constraints and data maintenance"
    },
    "summary": {
      "zh": "让多张表能够正确关联，也让修改数据时的规则有地方落脚。",
      "en": "Joined related tables correctly and made data-update rules explicit."
    },
    "technologies": [
      "Oracle SQL",
      "JOIN",
      "Correlated subqueries",
      "Aggregation",
      "CHECK constraints",
      "Transactions"
    ],
    "capabilityIds": [
      "data-systems",
      "edge-operations"
    ],
    "evidence": {
      "zh": "/about#timeline-service-boundaries",
      "en": "/en/about#timeline-service-boundaries"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "mira-hackathon",
    "date": "2025-03",
    "kind": "project",
    "recordType": "team-prototype",
    "title": {
      "zh": "Mira：在 Hackathon 里拼出一个原型",
      "en": "Mira: assembling a prototype at a hackathon"
    },
    "summary": {
      "zh": "参与一个把日记、活动和小任务放在一起的团队原型，接触前后端与文本生成的连接。",
      "en": "Contributed to a team prototype combining journaling, activities and small tasks, connecting a frontend, APIs and text generation."
    },
    "technologies": [
      "React",
      "FastAPI",
      "GPT-2",
      "Transformers",
      "REST API",
      "Prototype"
    ],
    "capabilityIds": [
      "product-surfaces",
      "ai-creation",
      "data-systems"
    ],
    "evidence": {
      "zh": "/about#timeline-mira-hackathon",
      "en": "/en/about#timeline-mira-hackathon"
    },
    "datePrecision": "month"
  },
  {
    "id": "maths-for-data-ai",
    "date": "2025-03",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "回到数据科学与 AI 的数学基础",
      "en": "Revisiting mathematical foundations for data science and AI"
    },
    "summary": {
      "zh": "继续练习函数、变化和数学推导，让后面的模型有可以理解的底座。",
      "en": "Continued practising functions, change and mathematical derivation as a foundation for later models."
    },
    "technologies": [
      "Mathematical modelling",
      "Functions",
      "Calculus",
      "Linear algebra",
      "AI foundations"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-maths-for-data-ai",
      "en": "/en/about#timeline-maths-for-data-ai"
    },
    "datePrecision": "month"
  },
  {
    "id": "relational-modelling",
    "date": "2025-04",
    "kind": "project",
    "recordType": "coursework",
    "title": {
      "zh": "把业务规则设计成关系数据库",
      "en": "Modelling business rules in a relational database"
    },
    "summary": {
      "zh": "从实体关系图到逻辑模型，练习让数据结构表达真实约束。",
      "en": "Moved from entity–relationship diagrams to logical models that express business constraints."
    },
    "technologies": [
      "ER modelling",
      "Normalisation",
      "1NF / 2NF / 3NF",
      "Primary & foreign keys",
      "Surrogate keys"
    ],
    "capabilityIds": [
      "data-systems",
      "edge-operations"
    ],
    "evidence": {
      "zh": "/about#timeline-relational-modelling",
      "en": "/en/about#timeline-relational-modelling"
    },
    "datePrecision": "month"
  },
  {
    "id": "network-routing",
    "date": "2025-06",
    "kind": "project",
    "recordType": "coursework",
    "title": {
      "zh": "把子网、路由和连通性做成网络实验",
      "en": "Exploring subnets, routing and connectivity in a network lab"
    },
    "summary": {
      "zh": "配置网络路径，再检查机器之间能不能按预期通信。",
      "en": "Configured network paths and checked whether machines could communicate as intended."
    },
    "technologies": [
      "IP addressing",
      "Subnets",
      "Static routing",
      "Network topology",
      "Connectivity testing"
    ],
    "capabilityIds": [
      "edge-operations",
      "data-systems"
    ],
    "evidence": {
      "zh": "/about#timeline-network-routing",
      "en": "/en/about#timeline-network-routing"
    },
    "datePrecision": "month"
  },
  {
    "id": "research-methods-interviews",
    "date": "2025-H2",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "从读文献走到访谈和主题分析",
      "en": "Moving from literature reading to interviews and thematic analysis"
    },
    "summary": {
      "zh": "学习怎样提出问题、收集人的回答，再把零散表达整理成有依据的主题。",
      "en": "Learned to frame questions, collect interview responses and organise them into evidence-based themes."
    },
    "technologies": [
      "Literature review",
      "Interviews",
      "Transcription",
      "Thematic analysis",
      "Research ethics"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-research-methods-interviews",
      "en": "/en/about#timeline-research-methods-interviews"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "sports-attendance-proposal",
    "date": "2025-H2",
    "kind": "writing",
    "recordType": "coursework",
    "title": {
      "zh": "为体育赛事上座率写数据科学方案",
      "en": "Writing a data-science proposal for sports attendance"
    },
    "summary": {
      "zh": "把天气与交通扰动放进问题定义，思考如何让预测更贴近当天的实际情况。",
      "en": "Considered weather and transit disruptions in an attendance-prediction problem."
    },
    "technologies": [
      "Problem formulation",
      "Forecasting",
      "Weather data",
      "Transport disruption",
      "Feature design"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-sports-attendance-proposal",
      "en": "/en/about#timeline-sports-attendance-proposal"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "social-text-analysis",
    "date": "2025-H2",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "把社交文本与用户数据整理成分析",
      "en": "Analysing social text and user data"
    },
    "summary": {
      "zh": "练习处理文本、时间和用户特征，让社交平台数据变成可比较的表与图。",
      "en": "Organised text, time and user features into comparable tables and charts."
    },
    "technologies": [
      "R",
      "tidyverse",
      "lubridate",
      "Text analysis",
      "LIWC",
      "Reproducible reports"
    ],
    "capabilityIds": [
      "research-models",
      "data-systems"
    ],
    "evidence": {
      "zh": "/about#timeline-social-text-analysis",
      "en": "/en/about#timeline-social-text-analysis"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "multi-source-wrangling",
    "date": "2025-09",
    "kind": "project",
    "recordType": "team-coursework",
    "title": {
      "zh": "把 JSON 和 XML 接成一张能分析的表",
      "en": "Integrating JSON and XML into an analysable table"
    },
    "summary": {
      "zh": "负责团队作业里的多源解析与整合，先让数据字段和关系对得上。",
      "en": "Contributed multi-source parsing and integration, aligning fields and relationships before analysis."
    },
    "technologies": [
      "Python",
      "pandas",
      "NumPy",
      "JSON",
      "XML",
      "Data integration"
    ],
    "capabilityIds": [
      "data-systems",
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-multi-source-wrangling",
      "en": "/en/about#timeline-multi-source-wrangling"
    },
    "datePrecision": "month"
  },
  {
    "id": "world-development-data",
    "date": "2025-09",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "整理世界发展指标的长时间序列",
      "en": "Organising long time series of development indicators"
    },
    "summary": {
      "zh": "面对跨年份的数据表，练习列名整理、缺失处理和可重跑的统计。",
      "en": "Practised column cleaning, missing-value handling and rerunnable summaries in multi-year indicator tables."
    },
    "technologies": [
      "R",
      "tidyverse",
      "janitor",
      "zoo",
      "World Development Indicators",
      "Time-series data"
    ],
    "capabilityIds": [
      "data-systems",
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-world-development-data",
      "en": "/en/about#timeline-world-development-data"
    },
    "datePrecision": "month"
  },
  {
    "id": "transaction-cleansing",
    "date": "2025-10",
    "kind": "project",
    "recordType": "team-coursework",
    "title": {
      "zh": "把交易数据的错误逐项找出来",
      "en": "Finding and correcting errors in transaction data"
    },
    "summary": {
      "zh": "从日期和业务规则入手，处理缺失、异常与字段之间的矛盾。",
      "en": "Used date checks and business rules to handle missing values, anomalies and inconsistencies."
    },
    "technologies": [
      "pandas",
      "NumPy",
      "scikit-learn",
      "LinearRegression",
      "Anomaly detection",
      "Validation"
    ],
    "capabilityIds": [
      "data-systems",
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-transaction-cleansing",
      "en": "/en/about#timeline-transaction-cleansing"
    },
    "datePrecision": "month"
  },
  {
    "id": "proteomics-workflow",
    "date": "2025-11",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "从蛋白质组数据走到差异分析",
      "en": "From proteomics data to differential analysis"
    },
    "summary": {
      "zh": "先核对样本与批次，再讨论哪些蛋白的变化有统计依据。",
      "en": "Checked sample and batch mappings before assessing evidence for protein-expression differences."
    },
    "technologies": [
      "R",
      "limma",
      "TMT",
      "QC",
      "PCA",
      "Batch covariates",
      "BH-FDR"
    ],
    "capabilityIds": [
      "research-models",
      "data-systems"
    ],
    "evidence": {
      "zh": "/about#timeline-proteomics-workflow",
      "en": "/en/about#timeline-proteomics-workflow"
    },
    "datePrecision": "month"
  },
  {
    "id": "research-methods-statistics",
    "date": "2025-11",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "用 Welch t 检验和效应量比较行为",
      "en": "Comparing behaviour with Welch's t-test and effect sizes"
    },
    "summary": {
      "zh": "把访谈之外的量化分析补上，学习区分“有差异”和“差异有多大”。",
      "en": "Extended methods training with quantitative comparisons, distinguishing evidence of a difference from its magnitude."
    },
    "technologies": [
      "Welch's t-test",
      "Effect size",
      "Hypothesis testing",
      "Experimental conditions",
      "Thematic analysis"
    ],
    "capabilityIds": [
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-research-methods-statistics",
      "en": "/en/about#timeline-research-methods-statistics"
    },
    "datePrecision": "month"
  },
  {
    "id": "project-risk-planning",
    "date": "2026-H1",
    "kind": "project",
    "recordType": "team-coursework",
    "title": {
      "zh": "把项目风险、依赖和里程碑写进计划",
      "en": "Planning project risks, dependencies and milestones"
    },
    "summary": {
      "zh": "在团队项目里负责风险计划和甘特图，把“会遇到什么问题”提前列清楚。",
      "en": "Contributed risk planning and a Gantt chart to a team project, making potential problems explicit."
    },
    "technologies": [
      "Risk management",
      "Gantt charts",
      "Dependencies",
      "Milestones",
      "Project governance"
    ],
    "capabilityIds": [
      "product-surfaces",
      "edge-operations"
    ],
    "evidence": {
      "zh": "/about#timeline-project-risk-planning",
      "en": "/en/about#timeline-project-risk-planning"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "melbourne-open-data",
    "date": "2026-H1",
    "kind": "project",
    "recordType": "coursework",
    "title": {
      "zh": "用 147 万行开放数据研究城市问题",
      "en": "Exploring an urban question with 1.47 million rows of open data"
    },
    "summary": {
      "zh": "把行人、微气候和空气质量数据接起来，做一条可以重新执行的 R 分析流程。",
      "en": "Connected pedestrian, microclimate and air-quality data in a rerunnable R workflow."
    },
    "technologies": [
      "R",
      "data.table",
      "Spatial joins",
      "Time alignment",
      "Data quality",
      "Reproducible pipeline"
    ],
    "capabilityIds": [
      "research-models",
      "data-systems"
    ],
    "evidence": {
      "zh": "/work/melbourne-pedestrian-microclimate",
      "en": "/en/work/melbourne-pedestrian-microclimate"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "spark-road-safety",
    "date": "2026-04",
    "kind": "project",
    "recordType": "coursework",
    "title": {
      "zh": "用 PySpark 处理道路安全数据",
      "en": "Processing road-safety data with PySpark"
    },
    "summary": {
      "zh": "把多表连接、聚合和窗口计算放到大数据处理流程里，再比较查询写法。",
      "en": "Used joins, aggregation and windows in a big-data workflow, then compared query approaches."
    },
    "technologies": [
      "PySpark",
      "DataFrames",
      "JOIN",
      "groupBy",
      "Window functions",
      "Caching",
      "Query optimisation"
    ],
    "capabilityIds": [
      "data-systems",
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-spark-road-safety",
      "en": "/en/about#timeline-spark-road-safety"
    },
    "datePrecision": "month"
  },
  {
    "id": "dual-host-release",
    "date": "2026-04-27",
    "kind": "release",
    "recordType": "personal-project",
    "title": {
      "zh": "让主站和 RocoDex 从域名入口分流",
      "en": "Routing the personal site and RocoDex by hostname"
    },
    "summary": {
      "zh": "开始把两个产品放进同一仓库，再用 Host 路由明确各自的入口。",
      "en": "Began hosting two products in one repository, using hostname routing to distinguish their entry points."
    },
    "technologies": [
      "Next.js",
      "React",
      "TypeScript",
      "Host routing",
      "Middleware",
      "Product boundaries"
    ],
    "capabilityIds": [
      "product-surfaces",
      "edge-operations"
    ],
    "evidence": {
      "zh": "/work/rocodex-platform",
      "en": "/en/work/rocodex-platform"
    },
    "datePrecision": "day"
  },
  {
    "id": "spark-ml-pipelines",
    "date": "2026-05",
    "kind": "project",
    "recordType": "coursework",
    "title": {
      "zh": "把道路风险预测做成 Spark ML Pipeline",
      "en": "Building a Spark ML pipeline for road-risk prediction"
    },
    "summary": {
      "zh": "把特征整理、模型训练和评估接起来，比较模型与参数配置。",
      "en": "Connected feature preparation, training and evaluation to compare models and parameter settings."
    },
    "technologies": [
      "Spark ML",
      "StringIndexer",
      "VectorAssembler",
      "RandomForestRegressor",
      "GBTRegressor",
      "RMSE",
      "ParamGridBuilder"
    ],
    "capabilityIds": [
      "research-models",
      "data-systems"
    ],
    "evidence": {
      "zh": "/about#timeline-spark-ml-pipelines",
      "en": "/en/about#timeline-spark-ml-pipelines"
    },
    "datePrecision": "month"
  },
  {
    "id": "streaming-prediction",
    "date": "2026-06",
    "kind": "project",
    "recordType": "coursework",
    "title": {
      "zh": "让预测跟着 Kafka 数据流运行",
      "en": "Running predictions on a Kafka data stream"
    },
    "summary": {
      "zh": "从一次性文件处理走到持续接收、预测、聚合和保存结果。",
      "en": "Moved from batch files to continuous ingestion, prediction, aggregation and persistence."
    },
    "technologies": [
      "Kafka",
      "Spark Structured Streaming",
      "Event time",
      "Watermarks",
      "Window aggregation",
      "Parquet",
      "Checkpoints"
    ],
    "capabilityIds": [
      "data-systems",
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-streaming-prediction",
      "en": "/en/about#timeline-streaming-prediction"
    },
    "datePrecision": "month"
  },
  {
    "id": "interactive-city-visualisation",
    "date": "2026-06",
    "kind": "project",
    "recordType": "coursework",
    "title": {
      "zh": "把城市分析做成联动地图和图表",
      "en": "Turning urban analysis into linked maps and charts"
    },
    "summary": {
      "zh": "让日期、传感器、地图和曲线一起变化，方便探索行人模式。",
      "en": "Linked dates, sensors, maps and charts to make pedestrian patterns easier to explore."
    },
    "technologies": [
      "R Shiny",
      "Plotly",
      "Leaflet",
      "Reactive programming",
      "Linked filtering",
      "data.table"
    ],
    "capabilityIds": [
      "product-surfaces",
      "research-models",
      "data-systems"
    ],
    "evidence": {
      "zh": "/work/melbourne-pedestrian-microclimate",
      "en": "/en/work/melbourne-pedestrian-microclimate"
    },
    "datePrecision": "month"
  },
  {
    "id": "statistical-model-comparison",
    "date": "2026-06",
    "kind": "education",
    "recordType": "coursework",
    "title": {
      "zh": "比较模型，也比较复杂度和误差",
      "en": "Comparing models, complexity and error"
    },
    "summary": {
      "zh": "在 R 统计建模中练习特征工程、变量选择和交叉验证，避免只追训练集分数。",
      "en": "Practised feature engineering, variable selection and cross-validation in R, looking beyond training scores."
    },
    "technologies": [
      "R",
      "BIC",
      "Cross-validation",
      "RMSE",
      "Random forest",
      "XGBoost",
      "Feature engineering"
    ],
    "capabilityIds": [
      "research-models",
      "data-systems"
    ],
    "evidence": {
      "zh": "/about#timeline-statistical-model-comparison",
      "en": "/en/about#timeline-statistical-model-comparison"
    },
    "datePrecision": "month"
  },
  {
    "id": "hireway-studio",
    "date": "2026-H2",
    "kind": "project",
    "recordType": "team-coursework",
    "title": {
      "zh": "HireWay：把就业数据放进用户能理解的产品",
      "en": "HireWay: making labour data useful to people"
    },
    "summary": {
      "zh": "参与持续进行中的团队项目，从问题定义、数据整理走到界面与产品讨论。",
      "en": "Participating in an ongoing team project, from problem definition and data preparation to interface and product discussions."
    },
    "technologies": [
      "React",
      "TypeScript",
      "Labour-market data",
      "Data cleaning",
      "User requirements",
      "UI/UX"
    ],
    "capabilityIds": [
      "product-surfaces",
      "data-systems"
    ],
    "evidence": {
      "zh": "https://github.com/Muguett-DBY/HireWay",
      "en": "https://github.com/Muguett-DBY/HireWay"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "sensory-friendly-journeys",
    "date": "2026-H2",
    "kind": "writing",
    "recordType": "coursework",
    "title": {
      "zh": "为感官友好的城市出行定义问题",
      "en": "Framing a sensory-friendly urban travel problem"
    },
    "summary": {
      "zh": "从神经多样性通勤者的视角，考虑人流、噪声、突发变化与安静空间。",
      "en": "Considered crowds, noise, unexpected changes and quiet spaces from a neurodivergent commuter's perspective."
    },
    "technologies": [
      "Accessibility",
      "Neurodiversity",
      "Problem statement",
      "Sensory overload",
      "Urban data",
      "Human-centred design"
    ],
    "capabilityIds": [
      "product-surfaces",
      "data-systems"
    ],
    "evidence": {
      "zh": "/about#timeline-sensory-friendly-journeys",
      "en": "/en/about#timeline-sensory-friendly-journeys"
    },
    "datePrecision": "half-year"
  },
  {
    "id": "engineering-systems-note",
    "date": "2026-07-14",
    "kind": "writing",
    "recordType": "public-note",
    "title": {
      "zh": "化工训练如何进入软件系统设计",
      "en": "How chemical engineering shaped software systems thinking"
    },
    "summary": {
      "zh": "把守恒、边界和过程拆解的习惯，联系到软件系统里的输入、状态与验收。",
      "en": "Connected habits of conservation, boundaries and process decomposition to software inputs, state and acceptance checks."
    },
    "technologies": [
      "System boundaries",
      "Material balance",
      "State transitions",
      "Verification"
    ],
    "capabilityIds": [
      "research-models",
      "edge-operations"
    ],
    "evidence": {
      "zh": "/notes/chemical-engineering-to-software-systems",
      "en": "/en/notes/chemical-engineering-to-software-systems"
    },
    "datePrecision": "day"
  },
  {
    "id": "wrangling-design-note",
    "date": "2026-07-18",
    "kind": "writing",
    "recordType": "public-note",
    "title": {
      "zh": "数据清洗也是产品设计",
      "en": "Data wrangling is product design"
    },
    "summary": {
      "zh": "说明字段、口径和缺失怎样影响用户最后看到的结论。",
      "en": "Explained how fields, definitions and missing data affect what users ultimately see."
    },
    "technologies": [
      "Data contracts",
      "Missingness",
      "Metric definitions",
      "Data provenance"
    ],
    "capabilityIds": [
      "data-systems",
      "product-surfaces"
    ],
    "evidence": {
      "zh": "/notes/data-wrangling-as-product-design",
      "en": "/en/notes/data-wrangling-as-product-design"
    },
    "datePrecision": "day"
  },
  {
    "id": "single-canvas-note",
    "date": "2026-07-22",
    "kind": "writing",
    "recordType": "public-note",
    "title": {
      "zh": "沉浸式网站只需要一个三维运行时",
      "en": "An immersive website needs only one 3D runtime"
    },
    "summary": {
      "zh": "讨论怎样让多个视觉场景共享画布，控制渲染和资源加载的开销。",
      "en": "Discussed sharing a canvas across visual scenes and controlling rendering and loading costs."
    },
    "technologies": [
      "Three.js",
      "Single canvas",
      "Lazy loading",
      "Rendering budget",
      "Fallback"
    ],
    "capabilityIds": [
      "product-surfaces",
      "ai-creation",
      "edge-operations"
    ],
    "evidence": {
      "zh": "/notes/single-canvas-immersive-web",
      "en": "/en/notes/single-canvas-immersive-web"
    },
    "datePrecision": "day"
  },
  {
    "id": "optimistic-locking-note",
    "date": "2026-07-26",
    "kind": "writing",
    "recordType": "public-note",
    "title": {
      "zh": "多人 CRM 里，最后提交不应该自动获胜",
      "en": "In a multi-user CRM, last write should not automatically win"
    },
    "summary": {
      "zh": "讨论两个人同时改同一条记录时，怎样发现冲突并保留上下文。",
      "en": "Discussed detecting conflicts and retaining context when people edit the same record concurrently."
    },
    "technologies": [
      "Optimistic locking",
      "Version checks",
      "Concurrency",
      "Audit trail"
    ],
    "capabilityIds": [
      "edge-operations",
      "data-systems"
    ],
    "evidence": {
      "zh": "/notes/optimistic-locking-for-operations",
      "en": "/en/notes/optimistic-locking-for-operations"
    },
    "datePrecision": "day"
  },
  {
    "id": "dcf-cache-diagnosis",
    "date": "2026-07-30",
    "kind": "diagnosis",
    "recordType": "public-note",
    "title": {
      "zh": "全市场 DCF 扫描为什么先优化缓存 JSON",
      "en": "Why a market-wide DCF scan optimised cache JSON first"
    },
    "summary": {
      "zh": "性能复盘把热点定位到重复搬运缓存数据，保留数据指纹和运行清单。",
      "en": "A performance review traced the hot path to repeated cache handling, while retaining fingerprints and run manifests."
    },
    "technologies": [
      "Python",
      "Profiling",
      "JSON",
      "Caching",
      "Data lineage",
      "Run manifests"
    ],
    "capabilityIds": [
      "research-models",
      "data-systems"
    ],
    "evidence": {
      "zh": "/notes/observable-dcf-pipeline",
      "en": "/en/notes/observable-dcf-pipeline"
    },
    "datePrecision": "day"
  },
  {
    "id": "deterministic-ai-note",
    "date": "2026-08-03",
    "kind": "writing",
    "recordType": "public-note",
    "title": {
      "zh": "AI 放在解释层，公式留在决策层",
      "en": "Put AI at the explanation edge, not the decision core"
    },
    "summary": {
      "zh": "把可重复的计算和生成式解释分开，方便检查数字是怎样得到的。",
      "en": "Separated reproducible calculations from generated explanations so numerical results remain inspectable."
    },
    "technologies": [
      "Deterministic core",
      "LLM",
      "Structured outputs",
      "Validation",
      "Reproducibility"
    ],
    "capabilityIds": [
      "ai-creation",
      "research-models",
      "data-systems"
    ],
    "evidence": {
      "zh": "/notes/deterministic-core-ai-edge",
      "en": "/en/notes/deterministic-core-ai-edge"
    },
    "datePrecision": "day"
  },
  {
    "id": "evidence-ai-note",
    "date": "2026-08-06",
    "kind": "writing",
    "recordType": "public-note",
    "title": {
      "zh": "先刷新证据，再让模型说话",
      "en": "Refresh evidence before asking the model to speak"
    },
    "summary": {
      "zh": "讨论证据时效、来源和上下文怎样影响 AI 给出的解释。",
      "en": "Discussed how evidence freshness, provenance and context affect AI explanations."
    },
    "technologies": [
      "Evidence provenance",
      "Freshness",
      "LLM context",
      "Uncertainty",
      "Auditability"
    ],
    "capabilityIds": [
      "ai-creation",
      "research-models"
    ],
    "evidence": {
      "zh": "/notes/evidence-first-ai-research",
      "en": "/en/notes/evidence-first-ai-research"
    },
    "datePrecision": "day"
  },
  {
    "id": "host-boundaries-note",
    "date": "2026-08-08",
    "kind": "writing",
    "recordType": "public-note",
    "title": {
      "zh": "一个 Next.js 部署，两个真正独立的网站",
      "en": "One Next.js deployment, two separate websites"
    },
    "summary": {
      "zh": "把域名判断、路由所有权和导入约束写成可检查的架构规则。",
      "en": "Documented hostname decisions, route ownership and import constraints as checkable architectural rules."
    },
    "technologies": [
      "Next.js",
      "Host routing",
      "Route groups",
      "Import guards",
      "Architecture tests"
    ],
    "capabilityIds": [
      "product-surfaces",
      "edge-operations"
    ],
    "evidence": {
      "zh": "/notes/host-boundaries-in-one-next-deployment",
      "en": "/en/notes/host-boundaries-in-one-next-deployment"
    },
    "datePrecision": "day"
  },
  {
    "id": "adaptive-archive-release",
    "date": "2026-08-09",
    "kind": "release",
    "recordType": "release",
    "title": {
      "zh": "双语技术档案和可执行实验上线",
      "en": "Shipping a bilingual archive and executable experiments"
    },
    "summary": {
      "zh": "把项目案例、技术札记与实验入口串起来，再检查不同设备上的表现。",
      "en": "Connected case studies, technical notes and experiments, then checked behaviour across devices."
    },
    "technologies": [
      "Bilingual publishing",
      "MDX",
      "Playwright",
      "Adaptive rendering",
      "Static fallback",
      "Performance budget"
    ],
    "capabilityIds": [
      "product-surfaces",
      "edge-operations",
      "ai-creation"
    ],
    "evidence": {
      "zh": "https://github.com/Muguett-DBY/RocoDex/commit/049d2de",
      "en": "https://github.com/Muguett-DBY/RocoDex/commit/049d2de"
    },
    "datePrecision": "day"
  },
  {
    "id": "cstd-9-observatory",
    "date": "2026-08-09",
    "kind": "release",
    "recordType": "release",
    "title": {
      "zh": "让内容健康和性能预算也能被检查",
      "en": "Making content health and performance budgets inspectable"
    },
    "summary": {
      "zh": "把构建来源、内容检查和性能指标接进公开的站点状态。",
      "en": "Connected build provenance, content checks and performance measures to public site status."
    },
    "technologies": [
      "Build provenance",
      "Content health",
      "Observability",
      "Web Vitals",
      "JSON contracts"
    ],
    "capabilityIds": [
      "edge-operations",
      "product-surfaces",
      "data-systems"
    ],
    "evidence": {
      "zh": "/observatory.json",
      "en": "/en/observatory.json"
    },
    "datePrecision": "day"
  },
  {
    "id": "cstd-17-universe",
    "date": "2026-08-12",
    "kind": "release",
    "recordType": "release",
    "title": {
      "zh": "让视觉世界有各自的气质和降级路径",
      "en": "Giving visual worlds distinct identities and fallbacks"
    },
    "summary": {
      "zh": "继续完善主题、实验与阅读体验，照顾不同设备和动效偏好。",
      "en": "Refined themes, experiments and reading behaviour for different devices and motion preferences."
    },
    "technologies": [
      "Three.js",
      "Progressive enhancement",
      "Reduced motion",
      "Lazy loading",
      "Theme systems"
    ],
    "capabilityIds": [
      "product-surfaces",
      "ai-creation",
      "edge-operations"
    ],
    "evidence": {
      "zh": "/performance.json",
      "en": "/en/performance.json"
    },
    "datePrecision": "day"
  },
  {
    "id": "cloudflare-migration",
    "date": "2026-09-09",
    "kind": "release",
    "recordType": "release",
    "title": {
      "zh": "把双站平台迁到 Cloudflare Workers",
      "en": "Moving the dual-site platform to Cloudflare Workers"
    },
    "summary": {
      "zh": "处理域名、静态页面和运行时适配，让部署后的访问路径保持可用。",
      "en": "Handled domains, static pages and runtime adaptation so routes remained usable after deployment."
    },
    "technologies": [
      "Cloudflare Workers",
      "OpenNext",
      "Next.js",
      "Static assets",
      "Custom domains",
      "Deployment checks"
    ],
    "capabilityIds": [
      "edge-operations",
      "product-surfaces"
    ],
    "evidence": {
      "zh": "/work/rocodex-platform",
      "en": "/en/work/rocodex-platform"
    },
    "datePrecision": "day"
  },
  {
    "id": "professional-writing",
    "date": "2026-10-03",
    "kind": "writing",
    "recordType": "coursework",
    "title": {
      "zh": "写职业发展与社会资本分析",
      "en": "Writing about professional development and social capital"
    },
    "summary": {
      "zh": "把访谈播客和阅读材料放在一起，思考合作关系、角色变化和沟通。",
      "en": "Combined a podcast interview with readings to examine relationships, changing roles and communication."
    },
    "technologies": [
      "Social capital",
      "Weak ties",
      "Structural holes",
      "Reflective writing",
      "Evidence-based argument"
    ],
    "capabilityIds": [
      "product-surfaces",
      "research-models"
    ],
    "evidence": {
      "zh": "/about#timeline-professional-writing",
      "en": "/en/about#timeline-professional-writing"
    },
    "datePrecision": "day"
  },
  {
    "id": "agent-reliability-plan",
    "date": "2026-10-07",
    "kind": "research",
    "recordType": "research-plan",
    "title": {
      "zh": "博 0：把“AI 办好了”变成可验证的问题",
      "en": "PhD Year 0: making agent completion a testable question"
    },
    "summary": {
      "zh": "准备研究计划：网页智能体说完成后，实际状态是否正确，重试有没有带来额外问题。",
      "en": "Preparing a research plan on whether web-agent completion claims match real state, and whether retries introduce side effects."
    },
    "technologies": [
      "Web agents",
      "Functional verification",
      "False success",
      "Failure recovery",
      "Equal-budget controls",
      "Confidence intervals"
    ],
    "capabilityIds": [
      "ai-creation",
      "research-models",
      "edge-operations"
    ],
    "evidence": {
      "zh": "/about#timeline-agent-reliability-plan",
      "en": "/en/about#timeline-agent-reliability-plan"
    },
    "datePrecision": "day"
  },
  {
    "id": "fact-checking-plan",
    "date": "2026-10-08",
    "kind": "research",
    "recordType": "research-plan",
    "title": {
      "zh": "证据不足时，LLM 应该继续查还是先不判断？",
      "en": "When evidence is insufficient, should an LLM retrieve more or abstain?"
    },
    "summary": {
      "zh": "另一份初步研究计划关注证据质量、错误自信和核查成本之间的关系。",
      "en": "A second preliminary plan examines evidence quality, incorrect confidence and verification cost."
    },
    "technologies": [
      "LLM fact-checking",
      "Retrieval augmentation",
      "FEVER",
      "Evidence attribution",
      "Selective prediction",
      "Risk–coverage"
    ],
    "capabilityIds": [
      "ai-creation",
      "research-models",
      "data-systems"
    ],
    "evidence": {
      "zh": "/about#timeline-fact-checking-plan",
      "en": "/en/about#timeline-fact-checking-plan"
    },
    "datePrecision": "day"
  },
  {
    "id": "atelier-bilingual-release",
    "date": "2026-10-11",
    "kind": "release",
    "recordType": "release",
    "title": {
      "zh": "让正式主站更像一间个人工作室",
      "en": "Making the formal site feel like a personal studio"
    },
    "summary": {
      "zh": "继续完善排版、项目封面、双语与经历档案，把真实内容放进更舒服的阅读结构。",
      "en": "Refined typography, project covers, languages and the timeline, giving real work a more comfortable reading structure."
    },
    "technologies": [
      "Editorial typography",
      "WebGPU",
      "Shaders",
      "Progressive enhancement",
      "Accept-Language",
      "Accessibility",
      "Playwright"
    ],
    "capabilityIds": [
      "product-surfaces",
      "ai-creation",
      "edge-operations"
    ],
    "evidence": {
      "zh": "/about#capability-timeline",
      "en": "/en/about#capability-timeline"
    },
    "datePrecision": "day"
  }
];

export const cstdTimelineChapters: Readonly<Record<string, LocalizedText>> = {
  "2020": { zh: "从实验台和基础数学开始", en: "Starting with experiments and mathematics" },
  "2021": { zh: "把现实问题写成模型", en: "Modelling real-world questions" },
  "2022": { zh: "数值计算与程序结构", en: "Numerical methods and program structure" },
  "2023": { zh: "实验、计算与跨学科表达", en: "Experiments, computation and interdisciplinary work" },
  "2024": { zh: "让数据分析变成可用的工具", en: "Turning analysis into usable tools" },
  "2025": { zh: "数据库、数据管线与研究方法", en: "Databases, data workflows and research methods" },
  "2026": { zh: "大数据、产品交付与 AI 可靠性", en: "Big data, product delivery and AI reliability" },
};
