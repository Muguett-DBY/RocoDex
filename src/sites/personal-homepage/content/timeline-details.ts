import type { LocalizedText } from "./content-types";

export type CstdTimelineDetail = Readonly<{
  learning: LocalizedText;
  practice: LocalizedText;
  outputs: readonly LocalizedText[];
}>;

// Detailed narratives stay in server-rendered pages; the guide uses the light index.
export const cstdTimelineDetails: Readonly<Record<string, CstdTimelineDetail>> = {
  "chemistry-foundations": {
    "learning": {
      "zh": "接触光化学、溶液浓度、相分离、酸碱滴定和紫外—可见吸收光谱（UV–Vis）；把浓度、波长和照射条件当作可以控制的变量。",
      "en": "Studied photochemistry, solution concentration, phase separation, acid–base titration and UV–visible absorption, treating concentration, wavelength and irradiation as controlled variables."
    },
    "practice": {
      "zh": "在蓝晒反应、环境鉴别、防晒剂吸收和醋酸质量控制的课程实验中记录步骤、观察与数据，练习用对照回答问题。",
      "en": "Recorded procedures, observations and data in coursework on blueprint photochemistry, environmental forensics, sunscreen absorption and vinegar acidity; used controls to interpret differences."
    },
    "outputs": [
      {
        "zh": "光化学、相分离、UV–Vis 与酸度测量实验记录。",
        "en": "Lab records on photochemistry, phase separation, UV–Vis and acidity measurements."
      }
    ]
  },
  "engineering-design": {
    "learning": {
      "zh": "学习需求调研、设计约束、方案比较和工程沟通；理解客户的问题与技术方案之间还需要一层清楚的需求定义。",
      "en": "Learned needs analysis, design constraints, concept comparison and engineering communication, with a clear requirements step between a problem and its solution."
    },
    "practice": {
      "zh": "参与社区场地的工程方案讨论，整理交通、照明与使用需求，随着里程碑推进设计简报、提案和展示；回顾自己在团队中的分工与协作。",
      "en": "Contributed to an engineering proposal for a community site, organising traffic, lighting and usage needs across design briefs, proposals and presentations; reflected on my role in the team."
    },
    "outputs": [
      {
        "zh": "团队设计简报、设计提案、客户说明材料与个人反思。",
        "en": "Team design brief, proposal, client handout and personal reflection."
      }
    ]
  },
  "chemical-process-review": {
    "learning": {
      "zh": "从原料性质、麦芽处理、发酵和分离等环节理解化工流程，也开始练习查资料、组织论点和说明工艺条件。",
      "en": "Explored raw-material properties, malt processing, fermentation and separation, while practising source reading, argument structure and explanation of process conditions."
    },
    "practice": {
      "zh": "围绕啤酒生产写课程文献综述，梳理原料与工序的关系。它是早期学习报告，保留了我如何开始把零散知识写成完整说明的过程。",
      "en": "Wrote a coursework literature review of beer production, organising the relationship between ingredients and operations. It records an early attempt to turn separate facts into a complete explanation."
    },
    "outputs": [
      {
        "zh": "《Chemical Process of Making Beer》课程文献综述。",
        "en": "Coursework literature review: Chemical Process of Making Beer."
      }
    ]
  },
  "youth-alcohol-analysis": {
    "learning": {
      "zh": "练习 CSV 导入、数据结构检查、分组比例和趋势图，用 R Markdown 把代码、图表和解释放进同一份报告。",
      "en": "Practised CSV loading, structure checks, grouped proportions and trend plots, using R Markdown to keep code, charts and interpretation together."
    },
    "practice": {
      "zh": "参与分析不同年份、性别和自我认知下的饮酒情况；讨论调查时效、样本覆盖与解释限制，避免把观察到的变化直接说成因果。",
      "en": "Contributed to comparisons across survey years, gender and self-perception; discussed data age, sample coverage and interpretation limits without treating observed changes as causal proof."
    },
    "outputs": [
      {
        "zh": "《Consumption of Alcohol in Australian Youth》团队课程分析报告。",
        "en": "Team coursework report: Consumption of Alcohol in Australian Youth."
      }
    ]
  },
  "traffic-comparison": {
    "learning": {
      "zh": "学习按时间区间、方向和车辆类型筛选数据，理解同一总量背后可能藏着不同的通勤与运输模式。",
      "en": "Learned to filter by time interval, direction and vehicle type, recognising that totals can conceal different commuting and transport patterns."
    },
    "practice": {
      "zh": "用 15 分钟粒度的隧道交通数据比较两个年份的早高峰，分别观察汽车与货车变化，再把图表与背景解释写进报告。",
      "en": "Compared morning traffic across two years using 15-minute records, separating cars and trucks and documenting plots alongside contextual interpretation."
    },
    "outputs": [
      {
        "zh": "隧道交通流量比较的 R Markdown 课程报告。",
        "en": "R Markdown coursework report comparing tunnel traffic flows."
      }
    ]
  },
  "calculus-linear-algebra": {
    "learning": {
      "zh": "学习微积分与线性代数，练习积分、矩阵运算和线性方程组，并用清楚的推导连接条件与结论。",
      "en": "Studied calculus and linear algebra through integration, matrix operations and linear systems, connecting assumptions to conclusions through explicit derivations."
    },
    "practice": {
      "zh": "保留了分阶段的数学作业与解题过程；这一阶段主要是在建立能读懂后续数值计算、统计建模的基础。",
      "en": "Completed mathematical exercises and kept worked solutions, building the foundation needed to follow later numerical and statistical modelling."
    },
    "outputs": [
      {
        "zh": "微积分与线性代数的作业解题记录。",
        "en": "Worked coursework solutions in calculus and linear algebra."
      }
    ]
  },
  "rural-irrigation": {
    "learning": {
      "zh": "学习从环境约束出发设计系统，考虑径流收集、储水、传感器校准和部件之间的依赖，而不只画一张理想结构图。",
      "en": "Learned to design around environmental constraints, including runoff collection, storage, sensor calibration and dependencies between components."
    },
    "practice": {
      "zh": "参与撰写农村灌溉团队方案，比较供水与节水思路，讨论不同土壤、温度和电导率对湿度测量的影响。",
      "en": "Contributed to a rural irrigation proposal, comparing water-supply and conservation ideas and discussing how soil, temperature and conductivity affect moisture readings."
    },
    "outputs": [
      {
        "zh": "《Design Proposal – Rural Irrigation Solution》团队课程提案。",
        "en": "Team coursework proposal: Design Proposal – Rural Irrigation Solution."
      }
    ]
  },
  "green-chemistry": {
    "learning": {
      "zh": "接触绿色化学原则，理解提高产率、减少废物、选择较安全溶剂和缩短合成步骤之间的关系。",
      "en": "Studied green chemistry principles linking yield, waste reduction, solvent choice and the number of synthesis steps."
    },
    "practice": {
      "zh": "记录铁配合物合成过程中的配方、观察和结果，把“能做出来”进一步拆成条件、产物和过程代价。",
      "en": "Documented reagents, observations and outcomes in an iron-complex synthesis exercise, considering conditions and process costs as well as whether a product formed."
    },
    "outputs": [
      {
        "zh": "带明确日期的绿色化学实验记录。",
        "en": "Dated coursework lab record on green chemistry."
      }
    ]
  },
  "python-first-training": {
    "learning": {
      "zh": "学习变量、条件、循环、函数、库与模块；理解输入、处理和输出如何形成一段可以检查的程序。",
      "en": "Studied variables, conditionals, loops, functions, libraries and modules, treating input, processing and output as a program that can be checked."
    },
    "practice": {
      "zh": "结合编程课件与早期练习熟悉 Python 基本结构，尝试文件读取、数据分类和函数拆分，为后来的 pandas 与数据处理打基础。",
      "en": "Used formal teaching material and early exercises to practise Python structure, file reading, data classification and function decomposition before later pandas work."
    },
    "outputs": [
      {
        "zh": "Python 编程练习、CSV 读取与分类函数记录。",
        "en": "Python exercises and records of CSV-reading and classification functions."
      }
    ]
  },
  "thermodynamics": {
    "learning": {
      "zh": "学习能量、熵与火用平衡，接触流体性质、状态方程和相平衡模型；从守恒关系理解不同工况下的系统行为。",
      "en": "Studied energy, entropy and exergy balances, fluid properties, equations of state and phase-equilibrium models to understand behaviour under different operating conditions."
    },
    "practice": {
      "zh": "在课程计算与笔记中拆分输入、输出和边界条件，尝试把复杂过程变成可以逐项检查的物理模型。",
      "en": "Used coursework calculations and notes to separate inputs, outputs and boundary conditions, turning complex processes into physical models that could be examined step by step."
    },
    "outputs": [
      {
        "zh": "热力学计算、能量平衡与相平衡学习记录。",
        "en": "Coursework calculations and notes on thermodynamics, energy balance and phase equilibrium."
      }
    ]
  },
  "distillation-simulation": {
    "learning": {
      "zh": "学习汽液平衡、精馏操作、活度系数模型（UNIQUAC）和实验设计（DOE），理解工况变化与分离效果的联系。",
      "en": "Studied vapour–liquid equilibrium, distillation operations, UNIQUAC activity coefficients and design of experiments to relate operating conditions to separation outcomes."
    },
    "practice": {
      "zh": "参与团队精馏模拟报告，对不同压力和热负荷下的结果做比较，记录模型设置、观察与模拟限制。",
      "en": "Contributed to a team distillation simulation report, comparing pressure and heat-duty settings and recording model configuration, observations and limitations."
    },
    "outputs": [
      {
        "zh": "乙醇—水精馏的团队模拟报告、假设说明与个人反思。",
        "en": "Team ethanol–water distillation report, hypothesis notes and personal reflection."
      }
    ]
  },
  "aerogel-review": {
    "learning": {
      "zh": "接触气凝胶、孔隙结构和热绝缘的关系，学习把材料性能、潜在用途与依据放在同一段论述里。",
      "en": "Explored aerogels, porosity and thermal insulation, connecting material properties, potential uses and supporting evidence."
    },
    "practice": {
      "zh": "参与撰写气凝胶主题的团队课程摘要，将文献中的结构与性质整理成简短介绍。",
      "en": "Contributed to a team coursework abstract on aerogels, condensing literature about structure and properties into a short introduction."
    },
    "outputs": [
      {
        "zh": "《Aerogel – The Material of the Future?》团队课程摘要。",
        "en": "Team coursework abstract: Aerogel – The Material of the Future?"
      }
    ]
  },
  "kinetics-electrochemistry": {
    "learning": {
      "zh": "学习反应速率定律、Arrhenius 方程和活化能，接触氧化还原、电化学电势与色谱分离；把曲线和方程对应起来。",
      "en": "Studied rate laws, the Arrhenius equation and activation energy, alongside redox reactions, electrochemical potentials and chromatographic separation."
    },
    "practice": {
      "zh": "在实验记录中比较不同浓度与温度的反应时间，整理靛蓝合成、叶绿素处理和电化学观察。",
      "en": "Compared reaction times across concentration and temperature settings and documented indigo synthesis, chlorophyll processing and electrochemical observations."
    },
    "outputs": [
      {
        "zh": "碘钟动力学、Arrhenius、色素与电化学课程实验记录。",
        "en": "Coursework lab records on iodine-clock kinetics, Arrhenius analysis, pigments and electrochemistry."
      }
    ]
  },
  "numerical-foundations": {
    "learning": {
      "zh": "学习非线性方程组、常微分方程（ODE）与初值问题，接触数值求解、参数设置和结果绘图。",
      "en": "Studied nonlinear systems, ordinary differential equations and initial-value problems, practising numerical solvers, parameter settings and plotting."
    },
    "practice": {
      "zh": "在反应过程练习中推导浓度变化方程，写 MATLAB 函数处理平衡与时间变化，并用图检查计算结果是否符合物理直觉。",
      "en": "Derived concentration equations in reaction exercises and wrote MATLAB functions for equilibrium and time-dependent behaviour, using plots to check physical plausibility."
    },
    "outputs": [
      {
        "zh": "数值方法作业、MATLAB 函数与反应过程求解记录。",
        "en": "Numerical-methods coursework, MATLAB functions and reaction-modelling records."
      }
    ]
  },
  "heat-transfer": {
    "learning": {
      "zh": "学习热传递与相变，接触过冷、成核和界面效应，练习区分日常直觉与模型条件。",
      "en": "Studied heat transfer and phase change, including supercooling, nucleation and interface effects, while distinguishing everyday intuition from model assumptions."
    },
    "practice": {
      "zh": "写课程说明文章讨论纯水结冰，并保留传热计算练习，把物理机制与条件限制一起表达出来。",
      "en": "Wrote a coursework explanation of pure-water freezing and kept heat-transfer exercises, describing mechanisms alongside the conditions under which they apply."
    },
    "outputs": [
      {
        "zh": "《Freezing of Pure Water》课程说明文章与传热练习。",
        "en": "Coursework essay: Freezing of Pure Water, with heat-transfer exercises."
      }
    ]
  },
  "java-objects": {
    "learning": {
      "zh": "学习面向对象编程（OOP）、类与对象、继承、多态、字符串处理和集合，练习用结构表达不同实体之间的关系。",
      "en": "Studied object-oriented programming, classes, inheritance, polymorphism, strings and collections, using structure to describe relationships between entities."
    },
    "practice": {
      "zh": "通过车辆、人物、电影等课程小练习组织类层次，保留字符串处理和 HashMap 相关练习，熟悉程序拆分与调用。",
      "en": "Organised class hierarchies in small exercises involving vehicles, actors and films; practised string handling and HashMap use, decomposition and method calls."
    },
    "outputs": [
      {
        "zh": "Java 类层次、字符串与集合练习代码。",
        "en": "Java exercises covering class hierarchies, strings and collections."
      }
    ]
  },
  "discrete-maths": {
    "learning": {
      "zh": "学习离散数学中的逻辑、证明与计数思路，练习把自然语言条件转换成明确的数学对象。",
      "en": "Studied logic, proof and counting in discrete mathematics, translating verbal conditions into explicit mathematical objects."
    },
    "practice": {
      "zh": "整理课程题目与复习材料，练习逐步推导，为后续的数据结构、复杂度和算法正确性分析做准备。",
      "en": "Worked through exercises and revision material, practising step-by-step reasoning before later data structures, complexity and correctness analysis."
    },
    "outputs": [
      {
        "zh": "离散数学解题与复习记录。",
        "en": "Discrete-mathematics exercises and revision notes."
      }
    ]
  },
  "negotiation-strategy": {
    "learning": {
      "zh": "学习经济策略和谈判中的激励、选择与权衡；练习从多方立场理解同一个问题。",
      "en": "Studied incentives, choices and trade-offs in economic strategy and negotiation, considering a problem from several positions."
    },
    "practice": {
      "zh": "保留理论材料和分模块练习。这些内容后来也提醒我：技术方案需要兼顾参与者的目标，而不只满足计算上的最优。",
      "en": "Kept theory material and module exercises. They provided a useful reminder that a technical proposal also has to account for participants' goals."
    },
    "outputs": [
      {
        "zh": "经济策略与谈判课程练习记录。",
        "en": "Coursework records on economic strategy and negotiation."
      }
    ]
  },
  "algorithms-practice": {
    "learning": {
      "zh": "在练习中接触渐近复杂度、连续区间求和、二叉搜索树、图连通性和生成树；学习用反例检验算法。",
      "en": "Explored asymptotic complexity, consecutive-range sums, binary search trees, graph connectivity and spanning trees, using counterexamples to test algorithms."
    },
    "practice": {
      "zh": "写过复杂度推导和树、图算法的反例分析，重点是把“看起来可行”拆成可检查的条件与推理。",
      "en": "Wrote complexity derivations and counterexample analyses for tree and graph algorithms, turning apparently plausible methods into claims that could be checked."
    },
    "outputs": [
      {
        "zh": "算法练习中的复杂度推导、树结构与生成树反例分析。",
        "en": "Algorithm exercise write-ups on complexity, tree structure and spanning-tree counterexamples."
      }
    ]
  },
  "spectroscopy-identification": {
    "learning": {
      "zh": "学习核磁共振（NMR）与光谱分析，结合熔点等测量理解分子结构鉴别；练习让不同证据相互支持。",
      "en": "Studied NMR and spectral analysis, combining measurements such as melting point in structure identification and checking agreement between evidence sources."
    },
    "practice": {
      "zh": "围绕未知有机化合物整理实验步骤、光谱信息与结构判断，写成课程实验报告。",
      "en": "Documented procedures, spectral information and structural interpretation for an unknown organic compound in a coursework lab report."
    },
    "outputs": [
      {
        "zh": "《Identification of an Unknown Organic Compound》课程实验报告。",
        "en": "Coursework lab report: Identification of an Unknown Organic Compound."
      }
    ]
  },
  "metal-complex-analysis": {
    "learning": {
      "zh": "学习 Schiff base 配体、金属—配体配合物与化学计量关系，接触吸收光谱和颜色之间的联系。",
      "en": "Studied Schiff-base ligands, metal–ligand complexes and stoichiometric relationships, including the connection between absorption spectra and colour."
    },
    "practice": {
      "zh": "记录配体与铜配合物的制备和表征，在长报告中整理实验方法、结果与解释。",
      "en": "Documented ligand and copper-complex preparation and characterisation, presenting methods, results and interpretation in a long-form coursework report."
    },
    "outputs": [
      {
        "zh": "《Preparation and Investigation of Metal Complexes》课程长报告。",
        "en": "Long-form coursework report: Preparation and Investigation of Metal Complexes."
      }
    ]
  },
  "analytical-metals": {
    "learning": {
      "zh": "接触电感耦合等离子体发射光谱（ICP–OES）、校准曲线和定量分析，理解未知水样浓度如何从标准样推算。",
      "en": "Studied ICP–OES, calibration curves and quantitative analysis, estimating unknown concentrations from reference standards."
    },
    "practice": {
      "zh": "在水样金属污染课程实验中整理校准数据、浓度和水硬度分析，讨论测量结果能支持哪些环境判断。",
      "en": "Organised calibration data, concentration estimates and water-hardness analysis in a coursework experiment on metals in water, discussing what the measurements could support."
    },
    "outputs": [
      {
        "zh": "《Environmental Contamination by Metal Ions》课程短报告。",
        "en": "Short coursework report: Environmental Contamination by Metal Ions."
      }
    ]
  },
  "natural-products": {
    "learning": {
      "zh": "学习溶剂萃取、液液萃取、薄层色谱（TLC）与纯化，理解溶剂组成、极性和分离效果之间的关系。",
      "en": "Studied solvent extraction, liquid–liquid extraction, thin-layer chromatography and purification, relating solvent composition and polarity to separation."
    },
    "practice": {
      "zh": "围绕丁香酚与乙酰丁香酚的提取整理实验过程、色谱观察和产物讨论，写出方法与结果相互对应的长报告。",
      "en": "Documented eugenol and acetyleugenol extraction, chromatographic observations and product interpretation in a long-form report connecting methods to results."
    },
    "outputs": [
      {
        "zh": "《Natural Product Extraction and Separation》课程长报告。",
        "en": "Long-form coursework report: Natural Product Extraction and Separation."
      }
    ]
  },
  "media-digital-transformation": {
    "learning": {
      "zh": "学习案例研究、数字化转型与跨学科沟通；在资料中研究 chatbot、人机交互和客户体验之间的联系。",
      "en": "Studied case analysis, digital transformation and interdisciplinary communication, reviewing connections between chatbots, interaction and customer experience."
    },
    "practice": {
      "zh": "参与行业命题的团队课程项目，承担数据与统计处理、网页和可视化相关工作；整理 AI 客服文献，并在个人反思中讨论协作与 Observer pattern 的启发。",
      "en": "Contributed data and statistical processing, web work and visualisation to a team coursework project; reviewed AI customer-service literature and reflected on collaboration and the Observer pattern."
    },
    "outputs": [
      {
        "zh": "媒体数字化方案中的个人报告部分、团队展示与个人反思。",
        "en": "Individual report contributions, team presentation and reflection for a media digital-transformation proposal."
      }
    ]
  },
  "computational-chemistry": {
    "learning": {
      "zh": "学习量子化学与分子对称性的基础，接触点群、原子单位和能量随分子结构变化的比较。",
      "en": "Studied foundations of quantum chemistry and molecular symmetry, including point groups, atomic units and energy comparisons across molecular structures."
    },
    "practice": {
      "zh": "在课程练习中整理分子模型与计算输出，比较碳链和环结构相关的能量结果，把图、数值与解释对应起来。",
      "en": "Organised molecular models and computational outputs in coursework, comparing energy results for chain and ring structures and connecting diagrams, values and explanations."
    },
    "outputs": [
      {
        "zh": "分子结构、环张力与量子力学课程计算记录。",
        "en": "Coursework computational records on molecular structure, ring strain and quantum mechanics."
      }
    ]
  },
  "superhydrophobic-surfaces": {
    "learning": {
      "zh": "接触超疏水表面、接触角测量和表面改性，同时学习危险识别、风险评估与控制（HIRAC）。",
      "en": "Studied superhydrophobic surfaces, contact angles and surface modification, alongside hazard identification, risk assessment and control."
    },
    "practice": {
      "zh": "为玻璃表面处理课程实验整理操作流程与风险控制，记录清洗、处理、观察和安全约束。",
      "en": "Prepared procedures and risk controls for a glass-surface treatment exercise, documenting cleaning, treatment, observation and safety constraints."
    },
    "outputs": [
      {
        "zh": "超疏水玻璃实验的个人风险评估与实验准备记录。",
        "en": "Personal risk assessment and preparation records for a superhydrophobic-glass coursework experiment."
      }
    ]
  },
  "scientific-python": {
    "learning": {
      "zh": "学习数组计算、随机模拟与科学计算，接触微分方程模型和数值结果的解释。",
      "en": "Studied array computation, random simulation and scientific computing, including differential-equation models and interpretation of numerical results."
    },
    "practice": {
      "zh": "整理 Python、NumPy 与 pandas 练习及模型说明，在复习记录中比较不同初始条件和模型假设。",
      "en": "Organised Python, NumPy and pandas exercises and model explanations, comparing initial conditions and assumptions in study notes."
    },
    "outputs": [
      {
        "zh": "Python 科学计算练习、模型说明与复习笔记。",
        "en": "Python scientific-computing exercises, model explanations and revision notes."
      }
    ]
  },
  "regional-business-analysis": {
    "learning": {
      "zh": "学习区域数据整合、人口归一化指标、标准化和相关性分析，理解地区大小不同会怎样影响比较。",
      "en": "Studied regional-data integration, per-capita indicators, standardisation and correlation, accounting for different population sizes."
    },
    "practice": {
      "zh": "在团队项目中负责零售企业和建筑许可数据的清洗与指标构建，用 SQL 关联区域人口，计算每千人指标并参与地区比较。",
      "en": "Cleaned retail-business and building-approval data and constructed indicators in a team project; joined regional population data in SQL and calculated per-thousand-person measures."
    },
    "outputs": [
      {
        "zh": "地区商业活跃度团队分析报告，内含个人分工记录。",
        "en": "Team analysis report on regional business activity, with documented individual contributions."
      }
    ]
  },
  "data-interface": {
    "learning": {
      "zh": "接触基因表达数据、标准化、分类器和交叉验证，练习比较随机森林、KNN 与 SVM，并理解结果不能只看一个准确率。",
      "en": "Studied gene-expression data, standardisation, classifiers and cross-validation, comparing random forests, KNN and SVM rather than relying on accuracy alone."
    },
    "practice": {
      "zh": "在团队项目中负责分析、可视化和 Shiny 工具相关工作，组织数据导入、分类器参数与结果展示；练习把生物与统计概念讲给其他同学听。",
      "en": "Contributed analysis, visualisation and Shiny interface work in a team project, organising data import, classifier parameters and results while explaining biological and statistical concepts."
    },
    "outputs": [
      {
        "zh": "基因表达分析的 Shiny 工具、R Markdown 报告与个人反思。",
        "en": "Gene-expression Shiny tool, R Markdown report and personal reflection."
      }
    ]
  },
  "retail-statistical-report": {
    "learning": {
      "zh": "学习探索性数据分析（EDA）、线性回归、模型假设和假设检验，练习把研究问题转换成可分析的变量。",
      "en": "Studied exploratory analysis, linear regression, model assumptions and hypothesis tests, turning research questions into analysable variables."
    },
    "practice": {
      "zh": "整理销售数据中的评分、商品类别与消费信息，讨论缺失、样本覆盖和解释限制，并写成带代码的分析报告。",
      "en": "Analysed ratings, product categories and spending in sales data, discussing missingness, sample coverage and interpretation limits in a report with code."
    },
    "outputs": [
      {
        "zh": "超市销售数据的 R Markdown 课程分析报告。",
        "en": "R Markdown coursework analysis report on supermarket sales."
      }
    ]
  },
  "airquality-graphics": {
    "learning": {
      "zh": "学习 tidyverse 数据变换、直方图、分组绘图和轴标签，理解图形选择会影响读者看到的重点。",
      "en": "Studied tidyverse transformations, histograms, grouped plots and axis labels, considering how chart choices affect interpretation."
    },
    "practice": {
      "zh": "在 R Markdown 练习里整理空气质量数据，把数据整理、作图代码和说明放在同一份可重跑记录里。",
      "en": "Organised air-quality data in R Markdown exercises, keeping transformation code, plots and explanations in a rerunnable record."
    },
    "outputs": [
      {
        "zh": "空气质量数据的 R Markdown 作图练习。",
        "en": "R Markdown plotting exercises using air-quality data."
      }
    ]
  },
  "activity-data-checkpoint": {
    "learning": {
      "zh": "练习按用户筛选、均值与方差计算、缺失值检查和分钟级统计，理解设备没记录与人没活动不是同一件事。",
      "en": "Practised filtering by user, calculating means and variance, checking missing values and summarising minute-level records, distinguishing missing measurements from inactivity."
    },
    "practice": {
      "zh": "为团队健康活动问题做个人 notebook，整理不同人的日级与分钟级步数、非零分钟及数据质量，形成后续讨论的依据。",
      "en": "Prepared an individual notebook for a team physical-activity question, summarising daily and minute-level steps, nonzero minutes and data quality for selected participants."
    },
    "outputs": [
      {
        "zh": "个人步数分析 Jupyter notebook 与 checkpoint 说明。",
        "en": "Individual activity-analysis Jupyter notebook and checkpoint write-up."
      }
    ]
  },
  "human-data-workflow": {
    "learning": {
      "zh": "学习把数据分析、质量检查、测试和解释放进团队协作流程，区分个人贡献与团队整体结果。",
      "en": "Learned to connect analysis, quality checks, testing and interpretation within a team workflow, keeping individual contributions distinct from team results."
    },
    "practice": {
      "zh": "继续参与健康活动数据项目，整理个人 checkpoint、分析和测试相关工作，用原始问题检查指标与解释是否合适。",
      "en": "Continued contributing individual checkpoint analysis and testing work to the physical-activity project, checking whether the measures and interpretation suited the original question."
    },
    "outputs": [
      {
        "zh": "个人 checkpoint 更新、团队项目分析材料与学习反思。",
        "en": "Individual checkpoint updates, team analysis material and learning reflections."
      }
    ]
  },
  "python-modular-programs": {
    "learning": {
      "zh": "系统练习 Python 数据结构、函数拆分、文件读写、CSV 与日期处理，理解模块之间怎样传递状态和数据。",
      "en": "Practised Python data structures, function decomposition, file I/O, CSV and date handling, including how modules pass state and data."
    },
    "practice": {
      "zh": "在课程作业中处理销售记录校验、网格状态模拟和分模块提醒系统，将输入检查与业务处理分开。",
      "en": "Worked on sales-record validation, grid-state simulation and a modular reminder system in coursework, separating input checks from task logic."
    },
    "outputs": [
      {
        "zh": "销售记录、网格模拟与提醒系统的课程代码。",
        "en": "Coursework code for sales records, grid simulations and reminder systems."
      }
    ]
  },
  "computer-architecture": {
    "learning": {
      "zh": "接触计算机结构、二进制表示、分页、地址偏移和虚拟内存，练习从位数和页面大小推导寻址关系。",
      "en": "Studied computer architecture, binary representation, paging, address offsets and virtual memory, deriving address relationships from bit widths and page sizes."
    },
    "practice": {
      "zh": "在计算机结构报告中整理页与物理帧的对应，计算地址组成，解释换入换出与内存映射。",
      "en": "Documented page-to-frame relationships in an architecture report, calculating address components and explaining swapping and memory mapping."
    },
    "outputs": [
      {
        "zh": "计算机结构与内存寻址的课程报告。",
        "en": "Coursework report on computer architecture and memory addressing."
      }
    ]
  },
  "service-boundaries": {
    "learning": {
      "zh": "学习多表关联、相关子查询、聚合与条件统计，接触主外键、CHECK 约束和事务。",
      "en": "Studied joins, correlated subqueries, aggregation and conditional reporting, alongside keys, CHECK constraints and transactions."
    },
    "practice": {
      "zh": "在赛事管理课程数据库中写查询与表结构修改，维护参赛、团队和活动数据，让统计与更新遵守同一套关系规则。",
      "en": "Wrote queries and schema modifications for a coursework event database, maintaining participant, team and event data under explicit relational rules."
    },
    "outputs": [
      {
        "zh": "Oracle SQL 查询、表结构修改与数据维护课程脚本。",
        "en": "Coursework Oracle SQL scripts for querying, schema changes and data maintenance."
      }
    ]
  },
  "mira-hackathon": {
    "learning": {
      "zh": "接触 React 界面、FastAPI 路由、文本生成模型与 API 连接；理解原型能展示想法，但仍需要后续验证和完善。",
      "en": "Explored React interfaces, FastAPI routes, text-generation models and API integration, recognising that a prototype still needs validation and development."
    },
    "practice": {
      "zh": "在团队 Hackathon 项目中参与 Mira 原型探索；项目材料保留了日记与任务接口、活动查询和 GPT-2 文本生成示例。",
      "en": "Took part in the team's Mira hackathon prototype. The project records include journal and quest endpoints, activity lookup and a GPT-2 generation example."
    },
    "outputs": [
      {
        "zh": "Mira 团队原型代码与功能探索记录。",
        "en": "Mira team prototype code and feature-exploration records."
      }
    ]
  },
  "maths-for-data-ai": {
    "learning": {
      "zh": "学习数据科学与 AI 所需的数学基础，用函数和推导表示增长、变化与关系，并整理符号和条件。",
      "en": "Studied mathematical foundations for data science and AI, expressing growth, change and relationships through functions and derivations."
    },
    "practice": {
      "zh": "完成阶段性数学作业，保留手写推导与课程题目；重点是理解表达式怎样从条件中得到，而不只记住答案。",
      "en": "Worked through mathematical assignments and kept handwritten solutions, focusing on how expressions follow from their conditions."
    },
    "outputs": [
      {
        "zh": "数据科学与 AI 数学基础的阶段性作业记录。",
        "en": "Coursework records in mathematical foundations for data science and AI."
      }
    ]
  },
  "relational-modelling": {
    "learning": {
      "zh": "学习实体关系建模、函数依赖、规范化和键设计，比较自然键、复合键与代理键的取舍。",
      "en": "Studied entity–relationship modelling, functional dependencies, normalisation and key design, comparing natural, composite and surrogate keys."
    },
    "practice": {
      "zh": "在邮轮业务课程案例中整理乘客、航次、船舶、舱位与登船记录，完成概念模型、逻辑模型、规范化和设计假设。",
      "en": "Modelled passengers, cruises, ships, cabins and manifests in a cruise-business coursework case, documenting conceptual and logical models, normalisation and assumptions."
    },
    "outputs": [
      {
        "zh": "邮轮业务数据库的 ER 图、逻辑模型、规范化说明与设计假设。",
        "en": "Cruise-business ER diagram, logical model, normalisation write-up and design assumptions."
      }
    ]
  },
  "network-routing": {
    "learning": {
      "zh": "学习 IP 地址、子网、静态路由和网络拓扑，理解本地网络、其他网段和外部连接需要怎样的路由关系。",
      "en": "Studied IP addressing, subnets, static routing and topology, relating local networks, remote subnets and external connectivity."
    },
    "practice": {
      "zh": "在网络模拟课程实验中配置多台路由器，整理路由表与连通性说明，写出配置和验证结果。",
      "en": "Configured routers in a coursework network simulation, documenting routing tables, connectivity and verification results."
    },
    "outputs": [
      {
        "zh": "网络路由配置报告与模拟实验文件。",
        "en": "Network-routing coursework report and simulation files."
      }
    ]
  },
  "research-methods-interviews": {
    "learning": {
      "zh": "学习文献梳理、访谈设计、转录与主题分析，接触研究同意、匿名化和证据组织。",
      "en": "Studied literature review, interview design, transcription and thematic analysis, including consent, anonymisation and evidence organisation."
    },
    "practice": {
      "zh": "在研究方法课程中准备访谈问题，整理转录与分析材料，把主题和原始陈述联系起来；公开页面只介绍方法。",
      "en": "Prepared interview questions and organised transcription and analysis material in coursework, linking themes to source statements; the public account describes methods only."
    },
    "outputs": [
      {
        "zh": "课程文献梳理、访谈分析与主题整理材料。",
        "en": "Coursework literature review, interview analysis and thematic-analysis records."
      }
    ]
  },
  "sports-attendance-proposal": {
    "learning": {
      "zh": "练习数据科学的问题定义、数据来源规划和特征设计，区分研究设想、可用数据与已经得到的结果。",
      "en": "Practised problem formulation, source planning and feature design, distinguishing proposed methods from available data and measured outcomes."
    },
    "practice": {
      "zh": "写课程方案讨论天气和交通扰动与比赛上座率的关系，梳理预测需求和可能的数据；这一条记录的是方案，不是已经验证的预测效果。",
      "en": "Wrote a coursework proposal on weather, transit disruptions and match attendance, outlining prediction needs and possible data sources; this documents a proposal rather than a validated forecasting result."
    },
    "outputs": [
      {
        "zh": "《Forecasting AFL Match Attendance with Weather and Transit Disruptions》课程方案。",
        "en": "Coursework proposal: Forecasting AFL Match Attendance with Weather and Transit Disruptions."
      }
    ]
  },
  "social-text-analysis": {
    "learning": {
      "zh": "接触文本数据整理、时间解析和用户指标构建，练习把类别、文本特征与行为统计放到同一分析流程。",
      "en": "Studied text-data preparation, timestamp parsing and user measures, combining categorical, textual and behavioural information in an analysis workflow."
    },
    "practice": {
      "zh": "在课程编码任务中清洗奥运相关社交文本，整理发帖时间和用户特征，形成表格、图形与分析说明。",
      "en": "Cleaned Olympics-related social text in coursework coding tasks, organising posting times and user features into tables, plots and explanations."
    },
    "outputs": [
      {
        "zh": "社交文本与用户数据的 R Markdown 编码报告。",
        "en": "R Markdown coursework coding report on social text and user data."
      }
    ]
  },
  "multi-source-wrangling": {
    "learning": {
      "zh": "学习结构化数据解析、字段对齐、关联键、合并与一致性检查，理解数据整合会怎样影响后续分析。",
      "en": "Studied structured-data parsing, field alignment, join keys, merging and consistency checks, considering their effect on later analysis."
    },
    "practice": {
      "zh": "在团队数据清洗作业中负责 load/merge、JSON/XML 解析整合，以及发现、洞察和建模问题的相关整理。",
      "en": "Contributed loading and merging, JSON/XML integration and the organisation of findings, insights and modelling questions in a team data-wrangling assignment."
    },
    "outputs": [
      {
        "zh": "多源 JSON/XML 整合代码与团队探索性分析报告。",
        "en": "Multi-source JSON/XML integration code and team exploratory-analysis report."
      }
    ]
  },
  "world-development-data": {
    "learning": {
      "zh": "学习跨年份数据的结构检查、列名标准化、指标筛选和时间序列整理，注意不同时段的数据覆盖。",
      "en": "Studied structure checks, column-name cleaning, indicator selection and time-series organisation, accounting for coverage differences over time."
    },
    "practice": {
      "zh": "用 R Markdown 读取和分析世界发展指标，组织代码、统计表与图形，让数据步骤可以重新执行。",
      "en": "Used R Markdown to load and analyse development indicators, documenting code, tables and plots in a rerunnable workflow."
    },
    "outputs": [
      {
        "zh": "世界发展指标的 R Markdown 课程分析报告。",
        "en": "R Markdown coursework analysis report on development indicators."
      }
    ]
  },
  "transaction-cleansing": {
    "learning": {
      "zh": "学习规则校验、缺失推断和异常检查，用线性回归辅助理解字段关系，并检查修正结果是否仍然一致。",
      "en": "Studied rule validation, missing-value inference and anomaly checks, using linear regression to examine field relationships and validate corrections."
    },
    "practice": {
      "zh": "负责团队作业中交易清洗的个人任务部分，整理日期、数值、类别和相关字段，写校验输出，保留修改过程。",
      "en": "Contributed the transaction-cleansing task in a team assignment, checking dates, values, categories and related fields, with validation outputs and a documented correction process."
    },
    "outputs": [
      {
        "zh": "交易数据清洗流水线、校验输出与个人分工说明。",
        "en": "Transaction-cleansing pipeline, validation outputs and individual contribution statement."
      }
    ]
  },
  "proteomics-workflow": {
    "learning": {
      "zh": "接触 TMT 蛋白质组数据、样本映射、质量控制（QC）、PCA 和差异分析，理解批次协变量与多重比较校正（BH-FDR）。",
      "en": "Studied TMT proteomics, sample mapping, QC, PCA and differential analysis, including batch covariates and Benjamini–Hochberg false-discovery-rate correction."
    },
    "practice": {
      "zh": "在课程分析中整理样本通道、去除污染标记、处理零值与 log2 转换，用 limma 在包含批次因素的设计中分析差异。",
      "en": "Organised sample channels, removed contaminant flags, handled zeros and log2 transformations, and used limma with batch factors in coursework analysis."
    },
    "outputs": [
      {
        "zh": "蛋白质组差异分析的 R Markdown 实验 notebook。",
        "en": "R Markdown coursework lab notebook for proteomics differential analysis."
      }
    ]
  },
  "research-methods-statistics": {
    "learning": {
      "zh": "学习假设检验、Welch t 检验、效应量和实验条件比较；同时考虑样本、测量和解释范围。",
      "en": "Studied hypothesis testing, Welch's t-test, effect sizes and condition comparisons, considering samples, measures and the limits of interpretation."
    },
    "practice": {
      "zh": "在课程任务中比较在线互动配置与语言背景相关的行为指标，明确假设、整理统计结果，并把量化与质性分析分开表达。",
      "en": "Compared behavioural measures related to online interaction settings and language background in coursework, stating hypotheses and distinguishing quantitative from qualitative analysis."
    },
    "outputs": [
      {
        "zh": "互动行为的课程研究报告、统计比较与主题分析材料。",
        "en": "Coursework reports on interaction behaviour, statistical comparisons and thematic analysis."
      }
    ]
  },
  "project-risk-planning": {
    "learning": {
      "zh": "学习项目范围、风险登记、应对措施和进度管理，理解一个任务延迟会怎样影响后面的依赖。",
      "en": "Studied scope, risk registers, responses and scheduling, considering how delays affect dependent tasks."
    },
    "practice": {
      "zh": "在 SecureTriage_AI 团队课程项目中主要负责风险管理计划和甘特图，梳理依赖、里程碑与应对，保留个人反思。",
      "en": "Contributed primarily the risk-management plan and Gantt chart to the SecureTriage_AI team coursework project, documenting dependencies, milestones, responses and a reflection."
    },
    "outputs": [
      {
        "zh": "SecureTriage_AI 风险管理计划、甘特图与个人反思。",
        "en": "SecureTriage_AI risk-management plan, Gantt chart and individual reflection."
      }
    ]
  },
  "melbourne-open-data": {
    "learning": {
      "zh": "学习开放数据下载、时间对齐、空间连接和数据质量检查，理解传感器位置、记录粒度与缺失会改变分析。",
      "en": "Studied open-data retrieval, temporal alignment, spatial joins and quality checks, accounting for sensor locations, granularity and missing observations."
    },
    "practice": {
      "zh": "整理约 147 万行行人记录，与环境观测连接，生成探索图和分析报告，并用统一入口组织下载、清洗、作图与报告输出。",
      "en": "Organised around 1.47 million pedestrian records, joined environmental observations and generated exploratory figures and a report, with a common entry point for retrieval, cleaning, plotting and rendering."
    },
    "outputs": [
      {
        "zh": "《Microclimate, Air Quality and Pedestrian Activity in Central Melbourne》课程报告与可重跑分析管线。",
        "en": "Coursework report: Microclimate, Air Quality and Pedestrian Activity in Central Melbourne, with a rerunnable analysis pipeline."
      }
    ]
  },
  "spark-road-safety": {
    "learning": {
      "zh": "学习 Spark DataFrame 变换、多表连接、分组聚合、窗口函数和缓存，接触分区与查询优化对计算的影响。",
      "en": "Studied Spark DataFrame transformations, joins, grouped aggregation, windows and caching, including how partitioning and query design affect execution."
    },
    "practice": {
      "zh": "在道路安全课程项目中清洗事故与车辆数据，整理日期和类别，完成查询分析与性能比较，并把说明写进 notebook。",
      "en": "Cleaned accident and vehicle data in coursework, organised dates and categories, and documented query analysis and performance comparisons in a notebook."
    },
    "outputs": [
      {
        "zh": "道路安全数据分析的 PySpark notebook 与查询优化说明。",
        "en": "Road-safety PySpark notebook and query-optimisation write-up."
      }
    ]
  },
  "dual-host-release": {
    "learning": {
      "zh": "在 AI Agent 辅助开发中学习域名分流、页面路由与产品边界，理解共享部署需要明确哪些逻辑属于哪个站。",
      "en": "Learned hostname routing, page routing and product boundaries through AI-agent-assisted development, making ownership explicit within a shared deployment."
    },
    "practice": {
      "zh": "将个人主站接入 RocoDex 应用，用 Host 判断区分入口；后续继续补上路由隔离、导入约束与浏览器回归。",
      "en": "Integrated the personal site into the RocoDex application using hostname decisions, then continued adding route isolation, import constraints and browser regression checks."
    },
    "outputs": [
      {
        "zh": "双站入口实现与后续架构案例。",
        "en": "Dual-site entry implementation and subsequent architecture case study."
      }
    ]
  },
  "spark-ml-pipelines": {
    "learning": {
      "zh": "学习特征编码、Pipeline、回归模型、评估器和参数搜索，理解训练集表现与泛化误差需要分开看。",
      "en": "Studied feature encoding, pipelines, regression models, evaluators and parameter search, separating training performance from generalisation error."
    },
    "practice": {
      "zh": "在道路事故预测课程任务中构建时间和道路风险特征，比较随机森林与梯度提升树，用 TrainValidationSplit 和回归指标评估配置。",
      "en": "Engineered temporal and road-risk features for coursework prediction, compared random forests and gradient-boosted trees, and evaluated configurations with TrainValidationSplit and regression metrics."
    },
    "outputs": [
      {
        "zh": "道路事故预测的 Spark ML notebook、模型管线与评估输出。",
        "en": "Road-accident Spark ML notebook, model pipeline and evaluation outputs."
      }
    ]
  },
  "streaming-prediction": {
    "learning": {
      "zh": "学习事件时间、watermark、窗口聚合与 checkpoint，理解乱序、延迟到达和重启恢复需要怎样处理。",
      "en": "Studied event time, watermarks, window aggregation and checkpoints, considering out-of-order events, late arrivals and restart recovery."
    },
    "practice": {
      "zh": "在课程流处理任务中读取 Kafka 数据，解析 schema、加载已有 ML Pipeline、生成预测，再做窗口统计并写出 Parquet 与 checkpoint。",
      "en": "Consumed Kafka data in coursework, parsed schemas, loaded a trained ML pipeline, made predictions and persisted windowed summaries with Parquet and checkpoints."
    },
    "outputs": [
      {
        "zh": "Kafka/Spark 流处理 notebook、预测输出与实时数据架构学习说明。",
        "en": "Kafka/Spark streaming notebook, prediction outputs and a streaming-architecture study guide."
      }
    ]
  },
  "interactive-city-visualisation": {
    "learning": {
      "zh": "学习 Shiny 响应式计算、交互筛选和联动视图，理解地图选点、时间过滤和图表反馈怎样组成探索流程。",
      "en": "Studied Shiny reactive computation, interactive filtering and linked views, connecting map selection, time filters and chart feedback."
    },
    "practice": {
      "zh": "为城市行人数据做 Shiny 应用，用 Plotly 和 Leaflet 展示地图、趋势和环境关联，整理运行说明与数据范围。",
      "en": "Built a coursework Shiny app for urban pedestrian data, using Plotly and Leaflet for maps, trends and environmental comparisons, with run instructions and documented coverage."
    },
    "outputs": [
      {
        "zh": "城市行人模式 Shiny 应用、交互视图与运行说明。",
        "en": "Urban pedestrian-pattern Shiny application, linked views and run documentation."
      }
    ]
  },
  "statistical-model-comparison": {
    "learning": {
      "zh": "学习回归与分类、BIC 变量选择、交叉验证和误差比较，理解更复杂的模型不一定在新数据上更好。",
      "en": "Studied regression, classification, BIC variable selection, cross-validation and error comparison, recognising that complexity need not improve performance on new data."
    },
    "practice": {
      "zh": "在统计建模作业中比较完整与筛选模型，整理随机森林、XGBoost 和特征工程结果，并讨论模型选择与训练误差之间的权衡。",
      "en": "Compared full and selected models in coursework, documented random forests, XGBoost and feature engineering, and examined trade-offs between model selection and training error."
    },
    "outputs": [
      {
        "zh": "R 统计建模 notebook、模型比较与误差分析说明。",
        "en": "R statistical-modelling notebook, model comparisons and error analysis."
      }
    ]
  },
  "hireway-studio": {
    "learning": {
      "zh": "继续学习需求分析、数据集检查、产品信息结构和团队交付，理解公开数据怎样转化为用户能采取行动的信息。",
      "en": "Continuing to learn requirements analysis, dataset checks, information architecture and team delivery, turning public data into actionable information."
    },
    "practice": {
      "zh": "参与 HireWay 团队项目，整理就业相关数据与需求材料，讨论页面表达和使用路径。这里记录个人参与，不把团队所有技术模块都归为个人成果。",
      "en": "Contributing to the HireWay team project through labour-data and requirements work and discussions of page structure and user paths, with contributions distinguished from the full team's work."
    },
    "outputs": [
      {
        "zh": "持续更新的 HireWay 团队项目、数据整理与需求材料。",
        "en": "Ongoing HireWay team project, data-preparation and requirements material."
      }
    ]
  },
  "sensory-friendly-journeys": {
    "learning": {
      "zh": "学习以人为中心的问题定义，把感官过载、路线不确定性与信息分散拆成具体需求。",
      "en": "Studied human-centred problem formulation, turning sensory overload, uncertain routes and fragmented information into concrete needs."
    },
    "practice": {
      "zh": "写个人城市出行问题陈述，讨论人流、施工、噪声与安静避让空间的提示需求；先明确问题，再讨论可能的产品。",
      "en": "Wrote an individual urban-travel problem statement on crowds, construction, noise and quiet refuge spaces, establishing needs before proposing a product."
    },
    "outputs": [
      {
        "zh": "感官友好城市出行的个人问题陈述与设计探索。",
        "en": "Individual problem statement and design exploration for sensory-friendly urban travel."
      }
    ]
  },
  "engineering-systems-note": {
    "learning": {
      "zh": "回看工程训练中的系统边界与变量追踪，思考这些方法怎样帮助理解软件状态变化。",
      "en": "Revisited system boundaries and variable tracking from engineering, considering their use in software state changes."
    },
    "practice": {
      "zh": "在个人网站写技术札记，用工程思路解释软件中的输入、输出和过程检查。",
      "en": "Wrote a personal-site technical note connecting engineering thinking to software inputs, outputs and process checks."
    },
    "outputs": [
      {
        "zh": "公开技术札记：《化工训练如何进入软件系统设计》。",
        "en": "Public technical note: How chemical engineering shaped software systems thinking."
      }
    ]
  },
  "wrangling-design-note": {
    "learning": {
      "zh": "把清洗步骤与指标口径、展示逻辑联系起来，关注数据定义怎样变成产品行为。",
      "en": "Connected cleaning with metric definitions and presentation logic, examining how data definitions shape product behaviour."
    },
    "practice": {
      "zh": "用技术札记整理清洗、可解释指标与界面之间的关系，讲清为什么上游规则值得展示。",
      "en": "Documented connections between cleaning, interpretable measures and interfaces, explaining why upstream rules matter."
    },
    "outputs": [
      {
        "zh": "公开技术札记：《数据清洗也是产品设计》。",
        "en": "Public technical note: Data wrangling is product design."
      }
    ]
  },
  "single-canvas-note": {
    "learning": {
      "zh": "整理三维运行时、场景切换和资源加载的边界，理解视觉复杂度需要与性能预算一起设计。",
      "en": "Examined runtime boundaries, scene switching and resource loading, treating visual complexity alongside a performance budget."
    },
    "practice": {
      "zh": "把个人主站的渲染架构思路写成札记，讨论统一画布、延迟加载和降级路径。",
      "en": "Wrote a note on the site's rendering architecture, covering a shared canvas, lazy loading and fallback paths."
    },
    "outputs": [
      {
        "zh": "公开技术札记：《沉浸式网站只需要一个三维运行时》。",
        "en": "Public technical note: An immersive website needs only one 3D runtime."
      }
    ]
  },
  "optimistic-locking-note": {
    "learning": {
      "zh": "整理乐观锁、版本校验、冲突反馈和审计记录的关系，理解并发写入需要明确处理规则。",
      "en": "Connected optimistic locking, version checks, conflict feedback and audit records, making concurrent-write rules explicit."
    },
    "practice": {
      "zh": "结合业务系统案例写技术札记，说明版本条件和冲突提示怎样进入日常操作流程。",
      "en": "Wrote a technical note from an operational-system case, explaining how version conditions and conflict feedback fit everyday workflows."
    },
    "outputs": [
      {
        "zh": "公开技术札记：《多人 CRM 里，最后提交不应该自动获胜》。",
        "en": "Public technical note: In a multi-user CRM, last write should not automatically win."
      }
    ]
  },
  "dcf-cache-diagnosis": {
    "learning": {
      "zh": "学习从完整可执行流程做性能剖析，检查启动、缓存、归一化与报告输出，而不是先猜最慢的公式。",
      "en": "Examined profiling from the complete executable workflow, including startup, caching, normalisation and reporting, before choosing an optimisation target."
    },
    "practice": {
      "zh": "把缓存 JSON 反复解析与序列化的问题写成公开复盘，解释运行内对象复用，以及优化仍要保留输入来源和指纹的原因。",
      "en": "Published a review of repeated JSON parsing and serialisation, explaining within-run object reuse and why optimisation still needs input provenance and fingerprints."
    },
    "outputs": [
      {
        "zh": "公开技术札记：《全市场 DCF 扫描为什么先优化缓存 JSON》。",
        "en": "Public technical note: Why a market-wide DCF scan optimized cache JSON first."
      }
    ]
  },
  "deterministic-ai-note": {
    "learning": {
      "zh": "整理确定性计算与生成式模型的职责，讨论结构化输入、校验与可复现结论。",
      "en": "Examined responsibilities of deterministic computation and generative models, including structured input, validation and reproducible conclusions."
    },
    "practice": {
      "zh": "写札记解释模型适合帮助理解和探索的位置，以及需要稳定计算和独立检查的位置。",
      "en": "Wrote a note on where models can support explanation and exploration and where stable computation and independent checks are needed."
    },
    "outputs": [
      {
        "zh": "公开技术札记：《AI 放在解释层，公式留在决策层》。",
        "en": "Public technical note: Put AI at the explanation edge, not the decision core."
      }
    ]
  },
  "evidence-ai-note": {
    "learning": {
      "zh": "整理证据来源、更新时间、上下文和不确定性，理解一个流畅回答需要怎样的事实支撑。",
      "en": "Examined provenance, timestamps, context and uncertainty as support for a fluent answer."
    },
    "practice": {
      "zh": "写公开札记说明先更新依据、再组织模型上下文的工作方式，把来源和结论联系起来。",
      "en": "Wrote a public note on refreshing evidence before preparing model context, connecting sources to conclusions."
    },
    "outputs": [
      {
        "zh": "公开技术札记：《先刷新证据，再让模型说话》。",
        "en": "Public technical note: Refresh evidence before asking the model to speak."
      }
    ]
  },
  "host-boundaries-note": {
    "learning": {
      "zh": "整理 Host 决策、route group、模块 public API 与导入守卫的关系，让产品隔离有代码依据。",
      "en": "Connected hostname decisions, route groups, module APIs and import guards to enforce product isolation in code."
    },
    "practice": {
      "zh": "结合双站平台的演进写架构札记，说明请求如何进入各自产品、测试怎样守住边界。",
      "en": "Wrote an architecture note from the dual-site platform's development, explaining request ownership and the tests that enforce boundaries."
    },
    "outputs": [
      {
        "zh": "公开技术札记：《一个 Next.js 部署，两个真正独立的网站》。",
        "en": "Public technical note: One Next.js deployment, two separate websites."
      }
    ]
  },
  "adaptive-archive-release": {
    "learning": {
      "zh": "在 AI Agent 辅助开发中整理双语发布、内容结构和自适应渲染，理解 Full、Lite 与静态模式需要清楚的触发条件。",
      "en": "Organised bilingual publishing, content structure and adaptive rendering in AI-agent-assisted development, with explicit conditions for full, lite and static modes."
    },
    "practice": {
      "zh": "为主站加入案例、札记与实验页，验证语言路由、渲染分级和浏览器操作，让档案既能读也能实际探索。",
      "en": "Added case, note and experiment pages and checked language routing, rendering tiers and browser interactions, making the archive readable and explorable."
    },
    "outputs": [
      {
        "zh": "双语技术档案、四个实验入口与发布记录。",
        "en": "Bilingual archive, four experiment entries and release record."
      }
    ]
  },
  "cstd-9-observatory": {
    "learning": {
      "zh": "整理可观测性、内容健康和发布契约，理解页面表现需要有可读的状态与检查结果。",
      "en": "Examined observability, content health and release contracts so page behaviour has readable status and check results."
    },
    "practice": {
      "zh": "在主站工程观测层加入公开 JSON、内容证据与性能预算，组织构建和发布检查。",
      "en": "Added public JSON contracts, content evidence and performance budgets to the site's observability layer, with build and release checks."
    },
    "outputs": [
      {
        "zh": "站点工程观测数据、内容健康与性能契约。",
        "en": "Site observability data, content-health and performance contracts."
      }
    ]
  },
  "cstd-17-universe": {
    "learning": {
      "zh": "学习主题系统、渐进增强、动效偏好与资源预算，在 AI 辅助迭代中为不同场景安排加载和降级策略。",
      "en": "Studied themes, progressive enhancement, motion preferences and resource budgets, iterating with AI assistance on loading and fallbacks."
    },
    "practice": {
      "zh": "让不同视觉世界拥有各自界面与场景，持续检查导航、静态退路和阅读体验。",
      "en": "Gave visual worlds distinct interfaces and scenes, checking navigation, static fallbacks and reading behaviour."
    },
    "outputs": [
      {
        "zh": "可切换视觉世界、渲染分级与阅读体验更新。",
        "en": "Switchable visual worlds, rendering tiers and reading-experience updates."
      }
    ]
  },
  "cloudflare-migration": {
    "learning": {
      "zh": "学习 OpenNext 适配、边缘运行时、静态资产和域名绑定，理解构建成功与真实页面可访问需要分别检查。",
      "en": "Studied OpenNext adaptation, edge runtimes, assets and domain binding, checking both build results and accessible pages."
    },
    "practice": {
      "zh": "在 AI Agent 辅助开发中迁移双站托管，处理路由与构建输出，检查主域名、www 和图鉴入口。",
      "en": "Migrated dual-site hosting with AI-agent assistance, adapting routing and build output and checking the main, www and encyclopedia entry points."
    },
    "outputs": [
      {
        "zh": "Cloudflare Workers 双站部署与域名路由更新。",
        "en": "Cloudflare Workers dual-site deployment and domain-routing updates."
      }
    ]
  },
  "professional-writing": {
    "learning": {
      "zh": "接触社会资本、弱连接和结构洞等概念，练习用阅读材料支持观点，并检查案例能否迁移到自己的处境。",
      "en": "Studied social capital, weak ties and structural holes, supporting arguments with readings and considering whether cases transfer to my own situation."
    },
    "practice": {
      "zh": "写播客分析和个人发展反思，讨论互惠合作、职业转变和具体行动；把引用、解释与个人判断分开。",
      "en": "Wrote a podcast analysis and development reflection on reciprocal collaboration, career changes and practical actions, distinguishing sources, interpretation and personal judgement."
    },
    "outputs": [
      {
        "zh": "职业发展播客分析、社会资本讨论与个人行动计划。",
        "en": "Professional-development podcast analysis, social-capital discussion and personal action plan."
      }
    ]
  },
  "agent-reliability-plan": {
    "learning": {
      "zh": "梳理智能体评估、功能验收、失败恢复和实验设计，区分过程动作、真实任务状态与额外副作用。",
      "en": "Studying agent evaluation, functional verification, recovery and experimental design, distinguishing actions from final task state and side effects."
    },
    "practice": {
      "zh": "写初步研究计划，设计直接执行、最终检查与关键步骤检查的比较，考虑配对任务、重复运行、预算控制和置信区间。当前记录的是研究准备，尚未得到实验结论。",
      "en": "Drafted comparisons between direct execution, final verification and stepwise checking, considering paired tasks, repeated runs, budget controls and confidence intervals. This is research preparation without experimental findings yet."
    },
    "outputs": [
      {
        "zh": "网页智能体真实完成、状态校验与失败恢复的初步研究计划。",
        "en": "Preliminary research plan on web-agent completion, state verification and failure recovery."
      }
    ]
  },
  "fact-checking-plan": {
    "learning": {
      "zh": "梳理事实核查、检索增强、证据归因和选择性预测，学习把回答覆盖率与回答错误率一起看。",
      "en": "Studying fact-checking, retrieval augmentation, evidence attribution and selective prediction, assessing answer coverage alongside error rates."
    },
    "practice": {
      "zh": "写英文初步计划，讨论移除关键证据、加入无关材料、允许弃答等实验条件，安排同预算比较与人工核验。计划仍在准备阶段，未包装成已完成研究或发表论文。",
      "en": "Drafted an English plan covering decisive-evidence removal, irrelevant material and abstention, with equal-budget comparisons and human checks. It remains a preliminary plan rather than completed or published research."
    },
    "outputs": [
      {
        "zh": "《Evidence-Aware Reliability Evaluation of LLM Fact-Checking》初步英文研究计划。",
        "en": "Preliminary English research plan: Evidence-Aware Reliability Evaluation of LLM Fact-Checking."
      }
    ]
  },
  "atelier-bilingual-release": {
    "learning": {
      "zh": "在 AI Agent 辅助开发中学习编辑式排版、材质动效、WebGPU 退路与无障碍检查；把设计细节和真实加载成本一起考虑。",
      "en": "Explored editorial typography, material motion, WebGPU fallbacks and accessibility through AI-agent-assisted development, considering design and real loading costs together."
    },
    "practice": {
      "zh": "完善默认正式主题、项目封面与语言切换，根据浏览器语言选择首次展示；整理年月经历与作品，检查手机、桌面和真实线上页面。",
      "en": "Refined the default formal theme, covers and language switching, negotiated first-visit language from browser preferences, and organised dated work with mobile, desktop and live-page checks."
    },
    "outputs": [
      {
        "zh": "更新后的正式主题、双语经历时间线与线上发布验证。",
        "en": "Updated formal theme, bilingual timeline and production release verification."
      }
    ]
  }
};
