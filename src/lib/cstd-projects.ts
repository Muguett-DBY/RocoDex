import type { CstdProjectCategory } from "./cstd-project-filter";

export type CstdProjectIconKey = "sparkles" | "camera" | "trending-up" | "bot" | "building" | "rotate";
export type CstdProjectTone = "mint" | "rose" | "teal" | "violet" | "amber" | "sky";

export type CstdProject = {
  id: string;
  title: string;
  kicker: string;
  status: "Live" | "Next";
  href: string;
  action: string;
  softAction?: string;
  softHref?: string;
  icon: CstdProjectIconKey;
  tone: CstdProjectTone;
  category: CstdProjectCategory;
  description: string;
  metrics: readonly (readonly [value: string, label: string])[];
  tags: readonly string[];
  evidence: {
    role: string;
    problem: string;
    outcome: string;
    current: string;
  };
};

export const cstdProjects: readonly CstdProject[] = [
  {
    id: "rocodex",
    title: "洛克图鉴 / RocoDex",
    kicker: "Data app",
    status: "Live",
    href: "https://rocodex.custard.top",
    action: "打开图鉴",
    softAction: "查看 PVP 阵容",
    softHref: "https://rocodex.custard.top/pvp-teams",
    icon: "sparkles",
    tone: "mint",
    category: "data",
    description:
      "面向《洛克王国世界》的中文精灵资料库，支持搜索筛选、精灵对比、PVP 阵容探索、技能浏览和洛克性格测试。",
    metrics: [
      ["347", "只精灵"],
      ["402", "个形态"],
      ["PVP", "阵容与攻略"],
    ],
    tags: ["Next.js 16", "Tailwind", "Upstash Redis", "Cloudflare DNS"],
    evidence: {
      role: "产品设计、数据整理与全栈开发",
      problem: "中文资料分散，精灵、技能与阵容信息难以在同一条路径中检索和比较。",
      outcome: "交付可搜索、可筛选、可收藏、可对比并连接攻略与 PVP 阵容的完整资料入口。",
      current: "持续维护数据与玩法工具",
    },
  },
  {
    id: "photography",
    title: "奶黄包摄影",
    kicker: "Photography",
    status: "Live",
    href: "https://shoot.custard.top",
    action: "查看摄影站",
    icon: "camera",
    tone: "rose",
    category: "creative",
    description:
      "南京女生写真与情侣约拍。柔雾胶片感、自然陪拍、江南感写真和情侣纪念，用清晰的套餐、作品展示和预约入口承载更温柔的拍摄体验。",
    metrics: [
      ["Portrait", "人像"],
      ["Nanjing", "城市"],
      ["Soft", "胶片感"],
    ],
    tags: ["Portrait", "Nanjing", "Cloudflare Pages"],
    evidence: {
      role: "品牌表达、内容结构与前端实现",
      problem: "作品风格、套餐信息与预约入口容易彼此割裂，访客难以快速判断是否适合自己。",
      outcome: "把作品、拍摄气质、套餐与预约动作整合为一条连续的浏览与决策路径。",
      current: "南京地区持续接拍",
    },
  },
  {
    id: "alpha",
    title: "CSTD Alpha",
    kicker: "Investment research",
    status: "Live",
    href: "https://alpha.custard.top",
    action: "打开 Alpha",
    icon: "trending-up",
    tone: "teal",
    category: "research",
    description:
      "中文公司深度评分报告工具。先确认上市主体，再结合公开行情、财务数据和 DeepSeek 生成模板化研究报告、评分、估值区间与图表驾驶舱。",
    metrics: [
      ["AI", "深度报告"],
      ["20", "项评分"],
      ["Charts", "图表驾驶舱"],
    ],
    tags: ["AI Research", "Company scoring", "Cloudflare Pages"],
    evidence: {
      role: "研究框架、交互设计与工程实现",
      problem: "公司研究常在主体识别、数据核验、评分口径和报告结构之间反复切换。",
      outcome: "形成从主体确认到评分、估值与图表报告的结构化研究工作流。",
      current: "聚焦 A 股量化估值能力",
    },
  },
  {
    id: "design",
    title: "私人 AI 创作工作台",
    kicker: "AI creation",
    status: "Live",
    href: "https://design.custard.top",
    action: "打开工作台",
    icon: "bot",
    tone: "violet",
    category: "creative",
    description:
      "个人中文 AI 创作工作台，整合流式对话、图片生成、视频生成和素材库管理，用单密码私有访问承载长期创作资料。",
    metrics: [
      ["Chat", "智能对话"],
      ["Image", "图片生成"],
      ["Video", "视频生成"],
    ],
    tags: ["React 19", "Cloudflare Pages", "D1 + R2"],
    evidence: {
      role: "产品架构、生成流程与全栈开发",
      problem: "对话、图片、视频和素材文件分散在不同工具中，长期创作上下文难以连续保存。",
      outcome: "交付私有访问的一体化工作台，并把生成记录与素材资产纳入同一套管理流程。",
      current: "持续扩展创作与素材能力",
    },
  },
  {
    id: "crm",
    title: "产业园区招商 CRM",
    kicker: "CRM system",
    status: "Live",
    href: "https://cfzzs.custard.top",
    action: "打开 CRM",
    icon: "building",
    tone: "amber",
    category: "operations",
    description:
      "面向产业园区招商的线索管理系统，覆盖仪表盘、线索流转、联系人、空间资源、导入导出、RBAC 权限和管理后台。",
    metrics: [
      ["RBAC", "权限"],
      ["D1", "业务数据"],
      ["E2E", "流程验证"],
    ],
    tags: ["React 19", "Hono", "Cloudflare Pages"],
    evidence: {
      role: "业务建模、权限设计与全栈交付",
      problem: "招商线索、联系人、空间资源和跟进状态分散，权限边界与过程追踪不清晰。",
      outcome: "交付覆盖线索全周期、空间资源、导入导出、软删除恢复和角色权限的运营系统。",
      current: "生产环境持续验证与迭代",
    },
  },
  {
    id: "incubator",
    title: "更多项目孵化中",
    kicker: "Incubating",
    status: "Next",
    href: "#projects",
    action: "继续发酵",
    icon: "rotate",
    tone: "sky",
    category: "incubating",
    description:
      "小工具、小动画、小交互和某些奇怪但有趣的灵感会先在这里冒泡，等它能被清楚使用时，再放进这个实验田。",
    metrics: [
      ["UI", "实验"],
      ["Motion", "动效"],
      ["Tiny", "小工具"],
    ],
    tags: ["Prototype", "Visual lab", "Cute systems"],
    evidence: {
      role: "概念探索与快速原型",
      problem: "新想法需要先验证使用场景和交互价值，再决定是否值得成为独立产品。",
      outcome: "保留小范围实验入口，只在可清楚使用后升级为正式项目。",
      current: "探索中，尚未承诺上线时间",
    },
  },
] as const;
