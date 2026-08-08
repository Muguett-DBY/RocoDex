import type {
  ContentEvidence,
  ContentImage,
  ContentMetric,
  ContentSection,
  CstdLocale,
  LocalizedText,
} from "./content-types";

export type CstdCaseStudy = Readonly<{
  slug: string;
  projectId: string;
  year: string;
  title: LocalizedText;
  kicker: LocalizedText;
  summary: LocalizedText;
  role: LocalizedText;
  status: LocalizedText;
  liveHref?: string;
  image: ContentImage;
  technologies: readonly string[];
  metrics: readonly ContentMetric[];
  sections: readonly ContentSection[];
  evidence: readonly ContentEvidence[];
}>;

export const cstdCaseStudies: readonly CstdCaseStudy[] = [
  {
    slug: "rocodex-platform",
    projectId: "rocodex",
    year: "2026",
    title: { zh: "RocoDex 双站平台", en: "RocoDex dual-site platform" },
    kicker: { zh: "领域边界 / 内容产品", en: "Domain boundaries / content product" },
    summary: {
      zh: "把个人主站与图鉴产品放进同一个 Next.js 部署容器，同时让域名、认证、内容和回归测试保持真正独立。",
      en: "Two independent websites share one Next.js deployment container while domains, authentication, content, and regression suites remain isolated.",
    },
    role: { zh: "产品设计、前后端、架构与发布", en: "Product, frontend, architecture, and release" },
    status: { zh: "持续上线", en: "Live and evolving" },
    liveHref: "https://rocodex.custard.top",
    image: {
      src: "/cstd-projects/rocodex.png",
      alt: { zh: "RocoDex 图鉴产品界面", en: "RocoDex product interface" },
      position: "50% 36%",
    },
    technologies: ["Next.js 16", "React 19", "TypeScript", "Vercel", "Vitest", "Playwright"],
    metrics: [
      { value: "2", label: { zh: "独立网站", en: "independent sites" } },
      { value: "1", label: { zh: "部署容器", en: "deployment container" } },
      { value: "Host", label: { zh: "级别隔离", en: "level isolation" } },
    ],
    sections: [
      {
        id: "problem",
        eyebrow: { zh: "01 / 问题", en: "01 / Problem" },
        title: { zh: "共享部署不等于共享产品。", en: "A shared deployment is not a shared product." },
        paragraphs: [
          {
            zh: "个人主站 custard.top 与 RocoDex 图鉴拥有不同用户、路由和运行时需求。最危险的方案不是放在一起，而是边界只存在于口头约定。",
            en: "custard.top and RocoDex serve different audiences with different routes and runtime needs. Co-location was not the risk; undocumented ownership was.",
          },
        ],
        bullets: [
          { zh: "主站不应初始化图鉴的认证上下文。", en: "The portfolio must not initialize the encyclopedia auth context." },
          { zh: "错误域名不能泄露另一站页面。", en: "The wrong host must never expose pages owned by the other product." },
          { zh: "每站都要有自己的浏览器回归与 SEO 输出。", en: "Each site needs its own browser regression and SEO output." },
        ],
      },
      {
        id: "architecture",
        eyebrow: { zh: "02 / 架构", en: "02 / Architecture" },
        title: { zh: "Host 决策先于页面渲染。", en: "Host decisions happen before rendering." },
        paragraphs: [
          {
            zh: "Proxy 先按 Host 决定重写、跳转、放行或 404；Next route group 再表达页面所有权；站点模块通过极小 public API 暴露给路由适配器。",
            en: "The proxy chooses rewrite, redirect, pass-through, or 404 by host. Route groups then express ownership, while each site exposes only a narrow public API.",
          },
        ],
        code: {
          language: "text",
          label: { zh: "请求链路", en: "Request path" },
          value: "request\n  -> host decision\n  -> route group\n  -> site public API\n  -> isolated product tree",
        },
      },
      {
        id: "decision",
        eyebrow: { zh: "03 / 决策", en: "03 / Decision" },
        title: { zh: "用测试守住目录无法守住的边界。", en: "Tests enforce what folders alone cannot." },
        paragraphs: [
          {
            zh: "架构测试扫描生产代码导入关系，禁止个人主站越界使用 RocoDex 模块，也限制 Three.js 运行时只出现在延迟场景中。",
            en: "Architecture tests scan production imports, block cross-site dependencies, and keep the Three.js runtime confined to its lazy scene boundary.",
          },
        ],
      },
    ],
    evidence: [
      { label: { zh: "隔离", en: "Isolation" }, detail: { zh: "Route group、Proxy 与导入守卫三层同时生效。", en: "Route groups, proxy rules, and import guards work together." } },
      { label: { zh: "验证", en: "Verification" }, detail: { zh: "两套 Vitest 与 Playwright 流程分别覆盖两个站点。", en: "Separate Vitest and Playwright flows cover each website." } },
      { label: { zh: "发布", en: "Release" }, detail: { zh: "main 推送后同时核验 GitHub Actions、Vercel 与两个生产域名。", en: "Every main release checks Actions, Vercel, and both production hosts." } },
    ],
  },
  {
    slug: "alpha-research-system",
    projectId: "alpha",
    year: "2026",
    title: { zh: "CSTD Alpha 研究系统", en: "CSTD Alpha research system" },
    kicker: { zh: "证据管线 / 决策工作台", en: "Evidence pipeline / decision workspace" },
    summary: {
      zh: "把公司研究从一次性 AI 回答改造成有数据来源、异步任务、不可变估值版本和反证条件的私人研究工作流。",
      en: "Company research becomes a source-aware workflow with background jobs, immutable valuation versions, and explicit disconfirming conditions instead of a one-shot AI answer.",
    },
    role: { zh: "产品、全栈、数据管线与 AI 编排", en: "Product, full stack, data pipeline, and AI orchestration" },
    status: { zh: "私有生产系统", en: "Private production system" },
    liveHref: "https://alpha.custard.top",
    image: {
      src: "/cstd-projects/alpha.png",
      alt: { zh: "CSTD Alpha 公司研究界面", en: "CSTD Alpha research interface" },
      position: "50% 24%",
    },
    technologies: ["React 19", "Cloudflare Pages", "D1", "R2", "GitHub Actions", "NDJSON"],
    metrics: [
      { value: "20", label: { zh: "评分维度", en: "scoring dimensions" } },
      { value: "3", label: { zh: "估值情景", en: "valuation scenarios" } },
      { value: "2", label: { zh: "模型回退层", en: "model fallback tiers" } },
    ],
    sections: [
      {
        id: "problem",
        eyebrow: { zh: "01 / 问题", en: "01 / Problem" },
        title: { zh: "研究质量取决于证据寿命，而不是回答长度。", en: "Research quality depends on evidence freshness, not answer length." },
        paragraphs: [
          { zh: "行情、财务、公告和行业线索更新频率不同。把抓取、综合与页面请求绑在一起，会同时得到超时、重复成本和不可追溯结论。", en: "Prices, filings, disclosures, and industry signals age at different rates. Binding collection and synthesis to a page request creates timeouts, repeated cost, and untraceable conclusions." },
        ],
      },
      {
        id: "pipeline",
        eyebrow: { zh: "02 / 管线", en: "02 / Pipeline" },
        title: { zh: "先生成证据指纹，再决定是否调用模型。", en: "Fingerprint evidence before invoking a model." },
        paragraphs: [
          { zh: "定时 Action 负责收集和归一化公开数据；Pages Function 只创建或复用任务；后台工作流完成深度综合并写回 D1/R2。证据没有实质变化时复用缓存。", en: "Scheduled Actions collect and normalize public data. Pages Functions create or reuse jobs; background workflows synthesize and persist to D1/R2. Unchanged evidence reuses cached work." },
        ],
        code: {
          language: "text",
          label: { zh: "异步研究链", en: "Asynchronous research chain" },
          value: "collect -> normalize -> fingerprint\n        -> queue -> synthesize -> publish\n        -> version -> review",
        },
      },
      {
        id: "valuation",
        eyebrow: { zh: "03 / 估值", en: "03 / Valuation" },
        title: { zh: "确定性公式拥有最终决定权。", en: "Deterministic formulas retain final authority." },
        paragraphs: [
          { zh: "五年 FCFF DCF 在浏览器预览和服务端保存中使用同一套公式。AI 只解释假设，不直接修改最终计算；每次保存创建不可变后继版本。", en: "The five-year FCFF DCF uses the same deterministic formula in browser preview and server persistence. AI explains assumptions but cannot decide outputs; every save creates an immutable successor." },
        ],
      },
    ],
    evidence: [
      { label: { zh: "来源", en: "Sources" }, detail: { zh: "数据快照、引用、缺失项与 fallback 随估值版本保存。", en: "Snapshots, citations, missing fields, and fallbacks travel with each valuation version." } },
      { label: { zh: "并发", en: "Concurrency" }, detail: { zh: "D1 运行令牌原子认领任务，过期回调不能覆盖新结果。", en: "Atomic D1 run tokens stop stale callbacks from overwriting newer results." } },
      { label: { zh: "隐私", en: "Privacy" }, detail: { zh: "固定账号、哈希密码与哈希 session token，不提供公开注册。", en: "Fixed accounts, hashed passwords and session tokens, with no public registration." } },
    ],
  },
  {
    slug: "creative-workbench",
    projectId: "design",
    year: "2026",
    title: { zh: "CSTD Design 创作工作台", en: "CSTD Design creative workbench" },
    kicker: { zh: "生成式媒体 / 私有工作流", en: "Generative media / private workflow" },
    summary: {
      zh: "一个把流式对话、图片、视频、消息分支和素材管理放进统一数据模型的私人中文创作环境。",
      en: "A private Chinese creative environment that unifies streaming chat, images, video, message branches, and asset management.",
    },
    role: { zh: "产品、交互、全栈与安全", en: "Product, interaction, full stack, and security" },
    status: { zh: "私有生产系统", en: "Private production system" },
    image: {
      src: "/cstd-projects/design.png",
      alt: { zh: "CSTD Design 创作工作台", en: "CSTD Design creative workbench" },
      position: "50% 20%",
    },
    technologies: ["React 19", "Vite", "Cloudflare Functions", "D1", "R2", "Zod"],
    metrics: [
      { value: "4", label: { zh: "参考图上限", en: "reference images" } },
      { value: "3", label: { zh: "媒体工作流", en: "media workflows" } },
      { value: "D1/R2", label: { zh: "元数据与媒体分层", en: "metadata and media split" } },
    ],
    sections: [
      {
        id: "model",
        eyebrow: { zh: "01 / 模型", en: "01 / Model" },
        title: { zh: "创作不是一个输入框。", en: "Creation is more than one prompt box." },
        paragraphs: [
          { zh: "对话会分支，生成会排队，素材会回溯到提示词。系统因此围绕可恢复的会话、任务与资产实体设计，而不是围绕一个聊天组件。", en: "Conversations branch, generations queue, and assets trace back to prompts. The system is modeled around recoverable sessions, jobs, and assets rather than a single chat component." },
        ],
      },
      {
        id: "media",
        eyebrow: { zh: "02 / 媒体", en: "02 / Media" },
        title: { zh: "元数据走 D1，大对象走 R2。", en: "Metadata goes to D1; large objects go to R2." },
        paragraphs: [
          { zh: "图片和视频任务保留状态、尺寸、种子和错误；素材上传检查 Magic Bytes；界面轮询有失败上限，避免永远旋转的任务。", en: "Image and video jobs retain status, dimensions, seed, and errors. Uploads inspect magic bytes, while bounded polling prevents permanently spinning jobs." },
        ],
      },
      {
        id: "safety",
        eyebrow: { zh: "03 / 安全", en: "03 / Security" },
        title: { zh: "私人系统也需要明确的滥用边界。", en: "Private tools still need abuse boundaries." },
        paragraphs: [
          { zh: "登录指数退避、API 分级限流、Secure Cookie、401 自动退出和内容类型校验共同缩小攻击面。", en: "Login backoff, endpoint-specific rate limits, secure cookies, automatic 401 logout, and content validation reduce the attack surface." },
        ],
      },
    ],
    evidence: [
      { label: { zh: "可恢复", en: "Recoverable" }, detail: { zh: "消息线程、分支和任务状态跨刷新持久化。", en: "Threads, branches, and job state survive refreshes." } },
      { label: { zh: "可访问", en: "Accessible" }, detail: { zh: "键盘搜索、明确状态和自定义确认流程覆盖高频操作。", en: "Keyboard search, explicit states, and confirmation flows cover repeated actions." } },
      { label: { zh: "可验证", en: "Verifiable" }, detail: { zh: "Vitest、Testing Library 与 CI/CD 持续检查。", en: "Vitest, Testing Library, and CI/CD provide continuous checks." } },
    ],
  },
  {
    slug: "cfzzs-crm",
    projectId: "crm",
    year: "2026",
    title: { zh: "CFZZS 招商 CRM", en: "CFZZS industrial CRM" },
    kicker: { zh: "业务系统 / 权限与并发", en: "Operations / permissions and concurrency" },
    summary: {
      zh: "面向产业园区招商团队的完整线索工作流：权限范围、阶段流转、企业查重、空间资源和审计型导出。",
      en: "A complete lead workflow for industrial park teams: scoped permissions, stage transitions, deduplication, spatial inventory, and auditable exports.",
    },
    role: { zh: "需求拆解、全栈实现与生产验收", en: "Requirements, full stack, and production acceptance" },
    status: { zh: "线上运行", en: "Live" },
    liveHref: "https://cfzzs.custard.top",
    image: {
      src: "/cstd-projects/crm.png",
      alt: { zh: "CFZZS 招商 CRM 仪表盘", en: "CFZZS CRM dashboard" },
      position: "50% 26%",
    },
    technologies: ["React 19", "Hono", "TanStack Query", "D1", "R2", "Playwright"],
    metrics: [
      { value: "5", label: { zh: "角色层级", en: "role levels" } },
      { value: "RBAC", label: { zh: "服务端数据范围", en: "server data scopes" } },
      { value: "E2E", label: { zh: "关键业务覆盖", en: "critical flow coverage" } },
    ],
    sections: [
      {
        id: "workflow",
        eyebrow: { zh: "01 / 工作流", en: "01 / Workflow" },
        title: { zh: "CRM 的核心是状态可信，而不是表格数量。", en: "A CRM is only as good as its trustworthy state." },
        paragraphs: [
          { zh: "线索、联系人、企业、跟进记录和园区空间必须在同一权限模型下协作。仪表盘只是结果，服务端数据范围才是产品骨架。", en: "Leads, contacts, companies, follow-ups, and spatial inventory must cooperate under one permission model. The dashboard is an output; server-side scope is the product skeleton." },
        ],
      },
      {
        id: "concurrency",
        eyebrow: { zh: "02 / 并发", en: "02 / Concurrency" },
        title: { zh: "阶段流转用乐观锁保护。", en: "Optimistic locking protects stage transitions." },
        paragraphs: [
          { zh: "多人同时编辑时，旧版本更新会被拒绝并要求重新读取，避免后提交的人悄悄覆盖现场信息。", en: "When multiple operators edit the same lead, stale updates are rejected and refreshed instead of silently overwriting field intelligence." },
        ],
      },
      {
        id: "delivery",
        eyebrow: { zh: "03 / 交付", en: "03 / Delivery" },
        title: { zh: "生产验收覆盖真实角色动作。", en: "Production acceptance follows real role actions." },
        paragraphs: [
          { zh: "E2E 不只检查页面能开，还覆盖登录、业务路由、后台路由、用户创建与 CSV 导入。", en: "E2E checks more than page availability: login, business and admin routes, user creation, and CSV import are exercised." },
        ],
      },
    ],
    evidence: [
      { label: { zh: "权限", en: "Permissions" }, detail: { zh: "RBAC 与数据范围在服务端执行。", en: "RBAC and data scope are enforced server-side." } },
      { label: { zh: "完整性", en: "Integrity" }, detail: { zh: "企业查重、乐观锁和审批导出减少脏数据。", en: "Deduplication, optimistic locking, and approved exports reduce bad data." } },
      { label: { zh: "运行", en: "Operations" }, detail: { zh: "GitHub Actions 自动部署到 Cloudflare Pages。", en: "GitHub Actions deploy automatically to Cloudflare Pages." } },
    ],
  },
  {
    slug: "dcf-quantum",
    projectId: "dcf",
    year: "2026",
    title: { zh: "DCF Quantum", en: "DCF Quantum" },
    kicker: { zh: "确定性金融计算 / 本地软件", en: "Deterministic finance / local software" },
    summary: {
      zh: "面向全量 A 股与港股通的三情景 DCF 筛选器：公开计算、离线缓存、可审计运行清单与 Windows 安装包。",
      en: "A three-scenario DCF screener for mainland shares and Stock Connect, with public calculations, offline caching, auditable manifests, and a Windows installer.",
    },
    role: { zh: "产品、Python 内核、性能与桌面交付", en: "Product, Python core, performance, and desktop delivery" },
    status: { zh: "本地发布", en: "Local release" },
    image: {
      src: "/cstd-universe/cstd-data-vault-v1.webp",
      alt: { zh: "确定性金融数据计算舱", en: "Deterministic finance data chamber" },
      position: "50% 50%",
    },
    technologies: ["Python", "FCFF DCF", "Local web UI", "PyInstaller", "CSV", "Hash manifests"],
    metrics: [
      { value: "3", label: { zh: "估值情景", en: "valuation scenarios" } },
      { value: "5Y", label: { zh: "显性预测期", en: "forecast period" } },
      { value: "127.0.0.1", label: { zh: "仅本机监听", en: "local-only bind" } },
    ],
    sections: [
      {
        id: "principle",
        eyebrow: { zh: "01 / 原则", en: "01 / Principle" },
        title: { zh: "估值必须能被复算。", en: "A valuation must be reproducible." },
        paragraphs: [
          { zh: "软件不调用大模型，也不自动交易。悲观、中性和乐观区间由公开、确定性的 Python 公式产生，并保留实际折现率口径。", en: "The software calls no language model and makes no trades. Bear, base, and bull ranges come from public deterministic Python formulas with the applied discount-rate basis retained." },
        ],
      },
      {
        id: "audit",
        eyebrow: { zh: "02 / 审计", en: "02 / Audit" },
        title: { zh: "每次扫描都有数据血缘。", en: "Every scan carries data lineage." },
        paragraphs: [
          { zh: "运行清单记录模型版本、配置哈希、数据指纹、缓存参数、依赖版本与输出哈希。代理结果与已完成 FCFF 桥接的确认结果明确分离。", en: "Run manifests retain model version, config hash, data fingerprint, cache parameters, dependencies, and output hashes. Proxy estimates remain explicitly separate from FCFF-bridged confirmations." },
        ],
      },
      {
        id: "desktop",
        eyebrow: { zh: "03 / 交付", en: "03 / Delivery" },
        title: { zh: "把研究内核交付给没有 Python 的电脑。", en: "Ship the research core to machines without Python." },
        paragraphs: [
          { zh: "Windows x64 安装包包含本地浏览器 GUI、独立工作进程、安全取消和离线体验；服务只监听本机回环地址。", en: "The Windows x64 package includes a browser GUI, isolated worker process, safe cancellation, and offline demo, bound only to loopback." },
        ],
      },
    ],
    evidence: [
      { label: { zh: "口径", en: "Basis" }, detail: { zh: "PROXY 与 FCFF_BRIDGED_CONFIRMED 从不混称。", en: "PROXY and FCFF_BRIDGED_CONFIRMED are never conflated." } },
      { label: { zh: "输出", en: "Outputs" }, detail: { zh: "候选、拒绝、财务、确认状态与运行清单分文件保存。", en: "Candidates, rejections, financials, confirmation status, and manifests are separate artifacts." } },
      { label: { zh: "安全", en: "Safety" }, detail: { zh: "CSV 外部文本转义，避免电子表格公式注入。", en: "External CSV text is escaped to prevent spreadsheet formula injection." } },
    ],
  },
  {
    slug: "portrait-booking",
    projectId: "photography",
    year: "2026",
    title: { zh: "奶黄包摄影体验", en: "Custard portrait experience" },
    kicker: { zh: "服务设计 / 预约与视觉", en: "Service design / booking and visual system" },
    summary: {
      zh: "把作品展示、预约、客户账户、课程活动、浏览器修图和后台管理串成一条完整摄影服务链。",
      en: "A complete portrait-service journey connecting work, booking, customer accounts, courses, browser editing, and administration.",
    },
    role: { zh: "体验设计、前后端与沉浸式视觉", en: "Experience design, full stack, and immersive visual direction" },
    status: { zh: "线上运行", en: "Live" },
    liveHref: "https://shoot.custard.top",
    image: {
      src: "/cstd-projects/photography.png",
      alt: { zh: "奶黄包摄影主页", en: "Custard portrait website" },
      position: "50% 28%",
    },
    technologies: ["React 19", "React Router", "Three.js", "PWA", "D1", "R2"],
    metrics: [
      { value: "1", label: { zh: "连续服务旅程", en: "continuous service journey" } },
      { value: "PWA", label: { zh: "离线预约恢复", en: "offline booking recovery" } },
      { value: "3D", label: { zh: "单画布视觉层", en: "single-canvas visual layer" } },
    ],
    sections: [
      {
        id: "journey",
        eyebrow: { zh: "01 / 旅程", en: "01 / Journey" },
        title: { zh: "展示必须自然走向预约。", en: "Presentation should naturally become booking." },
        paragraphs: [
          { zh: "首页不是作品堆叠，而是从风格确认、服务理解、档期选择到预约恢复的连续路径。后台与客户账户共享同一预约事实。", en: "The homepage is not a pile of images. It guides visitors from style and service understanding into availability, booking, and recovery, while admin and customer accounts share one booking truth." },
        ],
      },
      {
        id: "experience",
        eyebrow: { zh: "02 / 体验", en: "02 / Experience" },
        title: { zh: "三维氛围不能阻塞真实照片。", en: "3D atmosphere must not block the photographs." },
        paragraphs: [
          { zh: "沉浸层被隔离在单画布运行时，图片使用响应式资源，PWA 支持离线恢复；动效服务于品牌气质而不是取代内容。", en: "The immersive layer stays in one isolated canvas, imagery is responsive, and the PWA restores interrupted booking. Motion supports the brand without replacing the work." },
        ],
      },
      {
        id: "release",
        eyebrow: { zh: "03 / 发布", en: "03 / Release" },
        title: { zh: "发布门禁覆盖完整预约故事。", en: "Release gates cover the whole booking story." },
        paragraphs: [
          { zh: "静态检查、单测、构建预算与 Playwright 共同验证页面、API、服务工作线程和核心预约流程。", en: "Static checks, unit tests, build budgets, and Playwright jointly verify pages, APIs, service workers, and the critical booking flow." },
        ],
      },
    ],
    evidence: [
      { label: { zh: "架构", en: "Architecture" }, detail: { zh: "routing、features、experience 与 functions 有明确依赖方向。", en: "Routing, features, experience, and functions have explicit dependency direction." } },
      { label: { zh: "恢复", en: "Recovery" }, detail: { zh: "PWA 与本地状态让中断预约可继续。", en: "PWA and local state let interrupted bookings continue." } },
      { label: { zh: "验收", en: "Acceptance" }, detail: { zh: "生产域名、核心页面与 Service Worker 在推送后复核。", en: "Production host, critical pages, and service worker are rechecked after release." } },
    ],
  },
] as const;

export function getCstdCaseStudy(slug: string) {
  return cstdCaseStudies.find((entry) => entry.slug === slug);
}

export function getCaseStudyPath(caseStudy: CstdCaseStudy, locale: CstdLocale) {
  return locale === "en" ? `/en/work/${caseStudy.slug}` : `/work/${caseStudy.slug}`;
}
