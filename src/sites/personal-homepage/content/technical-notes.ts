import type { ContentImage, ContentSection, CstdLocale, LocalizedText } from "./content-types";

export type CstdTechnicalNote = Readonly<{
  slug: string;
  publishedAt: string;
  readingMinutes: number;
  category: LocalizedText;
  series: LocalizedText;
  title: LocalizedText;
  summary: LocalizedText;
  image: ContentImage;
  relatedCaseSlugs: readonly string[];
  tags: readonly string[];
  sections: readonly ContentSection[];
}>;

export const cstdTechnicalNotes: readonly CstdTechnicalNote[] = [
  {
    slug: "host-boundaries-in-one-next-deployment",
    publishedAt: "2026-08-08",
    readingMinutes: 8,
    category: { zh: "系统架构", en: "Systems architecture" },
    series: { zh: "把边界写进代码", en: "Boundaries in code" },
    title: { zh: "一个 Next.js 部署，两个真正独立的网站", en: "One Next.js deployment, two genuinely separate websites" },
    summary: {
      zh: "从 Host 决策、route group、最小 public API 到导入守卫，解释共享部署如何不演变成共享泥球。",
      en: "Host decisions, route groups, narrow public APIs, and import guards keep shared deployment from becoming shared product code.",
    },
    image: {
      src: "/cstd-universe/cstd-neural-city-v3.webp",
      alt: { zh: "由独立节点组成的神经城市", en: "A neural city made from isolated nodes" },
    },
    relatedCaseSlugs: ["rocodex-platform"],
    tags: ["Next.js", "Architecture", "Testing"],
    sections: [
      {
        id: "boundary",
        title: { zh: "先定义谁拥有 URL", en: "Start by assigning URL ownership" },
        paragraphs: [
          { zh: "目录只是组织手段，Host 才是生产请求最早能看到的产品边界。对 custard.top 的每条公开路径先做白名单式决策，再重写到内部 /cstd 路由；图鉴域名则完全放行自己的产品树。", en: "Folders organize code, but the host is the earliest product boundary visible to production requests. Public custard.top paths receive explicit decisions before rewriting to internal /cstd routes, while the encyclopedia host keeps its own tree." },
          { zh: "这也意味着 404 属于域名，而不是碰巧匹配到的 Next 页面。错误域名永远不应该靠页面组件自己发现。", en: "A 404 belongs to the domain, not whichever Next page happened to match. The page tree should never discover a wrong host after rendering begins." },
        ],
      },
      {
        id: "imports",
        title: { zh: "用 public API 缩小跨站接触面", en: "Shrink cross-site contact with a public API" },
        paragraphs: [
          { zh: "个人主站只向外暴露页面组件、metadata 与 server adapters。路由文件不能直接穿透到内部 content、components 或 infrastructure。这个限制让站点目录可以独立演进。", en: "The portfolio exposes only page components, metadata, and server adapters. Route files cannot reach through to internal content, components, or infrastructure, allowing each site module to evolve independently." },
        ],
      },
      {
        id: "guard",
        title: { zh: "架构测试要验证负空间", en: "Architecture tests should verify negative space" },
        paragraphs: [
          { zh: "最有价值的断言不是某文件存在，而是某类导入永远不能出现。扫描生产 TS/TSX 能在代码评审前阻止认证、数据或 Three.js 运行时跨越边界。", en: "The most useful assertion is not that a file exists, but that a class of import can never appear. Scanning production TS/TSX catches auth, data, or Three.js runtime leaks before review." },
        ],
        code: {
          language: "ts",
          label: { zh: "边界断言", en: "Boundary assertion" },
          value: "expect(crossSiteImports).toEqual([])\nexpect(webglImportsOutsideLazyScene).toEqual([])",
        },
      },
    ],
  },
  {
    slug: "evidence-first-ai-research",
    publishedAt: "2026-08-06",
    readingMinutes: 10,
    category: { zh: "AI 系统", en: "AI systems" },
    series: { zh: "证据优先的智能系统", en: "Evidence-first intelligence" },
    title: { zh: "先刷新证据，再让模型说话", en: "Refresh evidence before asking the model to speak" },
    summary: {
      zh: "公司研究里真正昂贵的不是 token，而是过期事实、重复任务和无法复现的结论。",
      en: "In company research, stale facts, duplicate jobs, and irreproducible conclusions cost more than tokens.",
    },
    image: {
      src: "/cstd-universe/cstd-data-vault-v1.webp",
      alt: { zh: "有来源约束的数据舱", en: "A source-constrained data vault" },
    },
    relatedCaseSlugs: ["alpha-research-system"],
    tags: ["AI", "Evidence", "Cloudflare", "Workflows"],
    sections: [
      {
        id: "separate",
        title: { zh: "收集、综合、发布是三种不同负载", en: "Collection, synthesis, and publishing are different workloads" },
        paragraphs: [
          { zh: "公开数据抓取适合定时批处理；模型综合适合可重试后台任务；页面请求只应该读取已发布结果并触发轻量状态变化。把三者绑在一个 HTTP 请求中，只会把最慢环节变成所有人的超时。", en: "Public data collection belongs in scheduled batches, model synthesis in retryable background jobs, and page requests in reading published state. Binding them to one HTTP request turns the slowest stage into everybody's timeout." },
        ],
      },
      {
        id: "fingerprint",
        title: { zh: "缓存键应该描述证据，而不是时间", en: "Cache keys should describe evidence, not time" },
        paragraphs: [
          { zh: "模板版本与公司证据指纹共同构成可复用单元。即使定时任务再次运行，只要归一化内容没有变化，就不需要重新调用模型。", en: "Template version plus company evidence fingerprint forms the reusable unit. A scheduled run does not justify a new model call when normalized evidence has not changed." },
        ],
        code: {
          language: "text",
          label: { zh: "复用键", en: "Reuse key" },
          value: "result_key = template_version + evidence_fingerprint",
        },
      },
      {
        id: "stale",
        title: { zh: "过期回调必须失去写权限", en: "Stale callbacks must lose write authority" },
        paragraphs: [
          { zh: "任务创建时生成运行令牌，后台 worker 回写前原子认领当前运行。新任务已经取代旧任务时，旧回调只能被记录，不能覆盖最新报告。", en: "A run token is created with each job and atomically claimed before publication. Once a newer run supersedes it, an old callback may be logged but cannot overwrite the latest report." },
        ],
      },
    ],
  },
  {
    slug: "deterministic-core-ai-edge",
    publishedAt: "2026-08-03",
    readingMinutes: 9,
    category: { zh: "产品工程", en: "Product engineering" },
    series: { zh: "证据优先的智能系统", en: "Evidence-first intelligence" },
    title: { zh: "AI 放在解释层，公式留在决策层", en: "Put AI at the explanation edge, not the decision core" },
    summary: {
      zh: "估值系统如何让生成式能力增加理解，而不污染可复算的财务结果。",
      en: "How a valuation system adds generative explanation without contaminating reproducible financial outputs.",
    },
    image: {
      src: "/cstd-archive/cstd-archive-cobalt-modules-v1.webp",
      alt: { zh: "相互隔离的确定性模块", en: "Isolated deterministic modules" },
    },
    relatedCaseSlugs: ["alpha-research-system", "dcf-quantum"],
    tags: ["AI", "DCF", "Determinism", "Product"],
    sections: [
      {
        id: "authority",
        title: { zh: "先标记谁拥有最终决定权", en: "Declare who owns final authority" },
        paragraphs: [
          { zh: "预测假设可以来自用户、历史基线或模型建议，但现金流、折现和终值计算只有一个确定性实现。界面预览与服务端持久化调用同一公式，避免两个真相。", en: "Assumptions may come from users, historical baselines, or model suggestions, but cash flow, discounting, and terminal value have one deterministic implementation shared by preview and persistence." },
        ],
      },
      {
        id: "provenance",
        title: { zh: "版本要保存来源，也要保存缺口", en: "Versions preserve sources and gaps" },
        paragraphs: [
          { zh: "数据快照、来源引用、缺失字段、fallback 与警告都属于估值版本。只保存最终数字会让未来的复盘失去上下文。", en: "Snapshots, citations, missing fields, fallbacks, and warnings all belong to a valuation version. Saving only the final number destroys future review context." },
        ],
      },
      {
        id: "language",
        title: { zh: "语言模型负责把不确定性说清楚", en: "Language models explain uncertainty" },
        paragraphs: [
          { zh: "模型可以比较情景、总结风险和提出需要验证的问题，但不能悄悄改写折现率，也不能把代理估值描述成确认结果。", en: "A model can compare scenarios, summarize risks, and propose verification questions, but it cannot silently rewrite discount rates or describe a proxy estimate as confirmed." },
        ],
      },
    ],
  },
  {
    slug: "observable-dcf-pipeline",
    publishedAt: "2026-07-30",
    readingMinutes: 11,
    category: { zh: "数据与性能", en: "Data and performance" },
    series: { zh: "可审计计算", en: "Auditable computation" },
    title: { zh: "全市场 DCF 扫描为什么先优化缓存 JSON", en: "Why a market-wide DCF scan optimized cache JSON first" },
    summary: {
      zh: "性能分析显示瓶颈不在财务公式，而在重复解析与序列化；正确优化从实测调用栈开始。",
      en: "Profiling found repeated parsing and serialization, not finance math, dominating runtime. Optimization started with the measured call stack.",
    },
    image: {
      src: "/cstd-world/cstd-data-loom-v2.webp",
      alt: { zh: "高速数据织机", en: "A high-throughput data loom" },
    },
    relatedCaseSlugs: ["dcf-quantum"],
    tags: ["Python", "Profiling", "Caching", "Data lineage"],
    sections: [
      {
        id: "measure",
        title: { zh: "先测正式可执行文件", en: "Profile the executable users run" },
        paragraphs: [
          { zh: "只测孤立函数会错过启动、缓存、数据归一化和报告输出。性能调查应该从完整扫描命令开始，再沿调用栈缩小范围。", en: "Isolated functions miss startup, cache access, normalization, and report output. Performance work should begin with the complete scan command and narrow down the measured call stack." },
        ],
      },
      {
        id: "hotpath",
        title: { zh: "公式很快，重复搬运数据很慢", en: "The formula was fast; repeated data movement was slow" },
        paragraphs: [
          { zh: "同一缓存载荷在扫描中被多次读取、JSON 解析和序列化。把已解析对象绑定到一次运行，并延迟只为最终工件序列化，收益远高于微调 DCF 公式。", en: "The same cached payload was repeatedly read, parsed, and serialized. Binding parsed objects to one run and serializing only final artifacts mattered more than micro-optimizing DCF math." },
        ],
      },
      {
        id: "integrity",
        title: { zh: "优化不能跳过数据指纹", en: "Optimization must preserve data fingerprints" },
        paragraphs: [
          { zh: "缓存对象可以复用，但运行清单仍要记录原始文件、接口参数、创建与到期时间以及载荷哈希。速度提升不能以失去审计能力为代价。", en: "Cached objects may be reused, but manifests still record source files, parameters, creation and expiry times, and payload hashes. Speed cannot trade away auditability." },
        ],
      },
    ],
  },
  {
    slug: "optimistic-locking-for-operations",
    publishedAt: "2026-07-26",
    readingMinutes: 7,
    category: { zh: "业务系统", en: "Operational systems" },
    series: { zh: "可信状态", en: "Trustworthy state" },
    title: { zh: "多人 CRM 里，最后提交不应该自动获胜", en: "In a multi-user CRM, last write should not automatically win" },
    summary: {
      zh: "用乐观锁、服务端数据范围和显式冲突恢复保护现场业务信息。",
      en: "Optimistic locking, server-side scopes, and explicit conflict recovery protect operational truth.",
    },
    image: {
      src: "/cstd-world/cstd-kinetic-studio-v2.webp",
      alt: { zh: "并发运行的业务控制台", en: "Concurrent operational consoles" },
    },
    relatedCaseSlugs: ["cfzzs-crm"],
    tags: ["CRM", "Concurrency", "RBAC", "D1"],
    sections: [
      {
        id: "conflict",
        title: { zh: "静默覆盖是最昂贵的成功响应", en: "A silent overwrite is the most expensive success response" },
        paragraphs: [
          { zh: "两个招商人员可能同时更新同一线索：一个刚电话确认需求，另一个还停留在旧页面。若后者提交成功，系统看似稳定，实际已经丢掉业务事实。", en: "Two operators may update one lead at once: one has just confirmed requirements by phone while the other still holds an old page. A successful stale write makes the system look healthy while losing business truth." },
        ],
      },
      {
        id: "version",
        title: { zh: "更新必须携带读取时版本", en: "Every update carries its read version" },
        paragraphs: [
          { zh: "服务端用记录版本作为条件更新。受影响行数为零时返回冲突，前端重新读取并让用户决定合并，而不是自动重放旧输入。", en: "The server conditions updates on the record version. Zero affected rows becomes a conflict; the client refreshes and lets the user reconcile instead of replaying stale input." },
        ],
        code: {
          language: "sql",
          label: { zh: "条件更新", en: "Conditional update" },
          value: "UPDATE leads\nSET stage = ?, version = version + 1\nWHERE id = ? AND version = ?",
        },
      },
      {
        id: "scope",
        title: { zh: "并发保护不能替代权限边界", en: "Concurrency control does not replace authorization" },
        paragraphs: [
          { zh: "版本检查只回答数据是否变化，RBAC 与数据范围回答用户是否有权看到和修改。两者都必须在服务端执行。", en: "Version checks answer whether data changed; RBAC and data scope answer whether a user may see or change it. Both belong on the server." },
        ],
      },
    ],
  },
  {
    slug: "single-canvas-immersive-web",
    publishedAt: "2026-07-22",
    readingMinutes: 8,
    category: { zh: "前端体验", en: "Frontend experience" },
    series: { zh: "动效有预算", en: "Motion with a budget" },
    title: { zh: "沉浸式网站只需要一个三维运行时", en: "An immersive website needs only one 3D runtime" },
    summary: {
      zh: "将 Three.js 隔离为一个按需画布，让内容、滚动和辅助技术保持普通网页语义。",
      en: "Isolate Three.js in one lazy canvas so content, scrolling, and assistive technology retain ordinary web semantics.",
    },
    image: {
      src: "/cstd-universe/cstd-skill-reactor-v1.webp",
      alt: { zh: "单画布技能反应堆", en: "A single-canvas skill reactor" },
    },
    relatedCaseSlugs: ["portrait-booking", "rocodex-platform"],
    tags: ["Three.js", "Performance", "Accessibility", "Canvas"],
    sections: [
      {
        id: "separation",
        title: { zh: "DOM 负责信息，Canvas 负责世界", en: "DOM owns information; canvas owns the world" },
        paragraphs: [
          { zh: "标题、链接、图片和表单都保留在 DOM；固定画布只接收滚动进度、指针和质量等级。即使 WebGL 未加载，网站仍然完整可读可用。", en: "Headings, links, images, and forms remain in the DOM. A fixed canvas receives only scroll progress, pointer input, and quality level. The site stays complete when WebGL never loads." },
        ],
      },
      {
        id: "lifecycle",
        title: { zh: "渲染循环要服从页面生命周期", en: "The render loop follows page lifecycle" },
        paragraphs: [
          { zh: "页面不可见时暂停；窄屏与粗指针使用静态图；DPR 封顶；长任务或低帧率触发质量降级。动效不是例外线程，而是资源预算中的一部分。", en: "Rendering pauses while hidden, coarse pointers use static imagery, DPR is capped, and long tasks or low frame rate lower quality. Motion is part of the resource budget, not an exception to it." },
        ],
      },
      {
        id: "preference",
        title: { zh: "系统偏好是默认值，站内开关是最终选择", en: "System preference is a default; the site switch is final" },
        paragraphs: [
          { zh: "首次访问可参考 prefers-reduced-motion，但用户明确开启增强动效后应保存站内选择。关键是平静模式仍有构图、层次和状态反馈，而不是一张失去设计的静态页面。", en: "The first visit may honor prefers-reduced-motion, while an explicit in-site choice persists. Calm mode must retain composition, hierarchy, and state feedback rather than becoming an undesigned static page." },
        ],
      },
    ],
  },
  {
    slug: "data-wrangling-as-product-design",
    publishedAt: "2026-07-18",
    readingMinutes: 9,
    category: { zh: "数据科学", en: "Data science" },
    series: { zh: "从课程到系统", en: "From coursework to systems" },
    title: { zh: "数据清洗也是产品设计", en: "Data wrangling is product design" },
    summary: {
      zh: "从 USYD 数据课程、Monash data wrangling 与实际研究管线中形成的一套数据契约观。",
      en: "A view of data contracts shaped by USYD data coursework, Monash data wrangling, and production research pipelines.",
    },
    image: {
      src: "/cstd-archive/cstd-archive-data-film-v1.webp",
      alt: { zh: "记录数据血缘的胶片档案", en: "A film archive preserving data lineage" },
    },
    relatedCaseSlugs: ["alpha-research-system", "dcf-quantum"],
    tags: ["Data wrangling", "R", "Python", "Contracts"],
    sections: [
      {
        id: "contract",
        title: { zh: "脏数据通常是未写下的产品决策", en: "Dirty data often reveals an unwritten product decision" },
        paragraphs: [
          { zh: "缺失值是未知、未适用还是抓取失败？日期属于交易所还是用户时区？同名公司是否同一上市主体？每个清洗规则都在替产品回答问题。", en: "Does missing mean unknown, not applicable, or collection failure? Does a date belong to an exchange or user timezone? Are same-name companies the same listing? Every cleaning rule answers a product question." },
        ],
      },
      {
        id: "layers",
        title: { zh: "保留原始层、规范层和派生层", en: "Keep raw, normalized, and derived layers" },
        paragraphs: [
          { zh: "原始响应用于追溯，规范记录用于跨来源比较，派生指标用于产品决策。覆盖原始值会让未来无法解释变化来自数据源、清洗规则还是业务公式。", en: "Raw responses support traceability, normalized records support comparison, and derived metrics support decisions. Overwriting raw values makes later changes impossible to attribute." },
        ],
      },
      {
        id: "quality",
        title: { zh: "数据质量要成为界面状态", en: "Data quality should become interface state" },
        paragraphs: [
          { zh: "与其给不完整数据一个看似精确的数字，不如把来源、缺口、更新时间与确认级别展示给用户。好的产品不隐藏不确定性，而是让它可操作。", en: "Instead of producing a precise-looking number from incomplete data, expose source, gaps, freshness, and confirmation level. Good products make uncertainty actionable." },
        ],
      },
    ],
  },
  {
    slug: "chemical-engineering-to-software-systems",
    publishedAt: "2026-07-14",
    readingMinutes: 8,
    category: { zh: "学习路径", en: "Learning path" },
    series: { zh: "从课程到系统", en: "From coursework to systems" },
    title: { zh: "化工训练如何进入软件系统设计", en: "How chemical engineering shaped software systems thinking" },
    summary: {
      zh: "能量衡算、传递过程、分离与实验训练，最终变成对边界、守恒、状态和可观测性的工程直觉。",
      en: "Balances, transport, separation, and lab work became engineering intuition about boundaries, conservation, state, and observability.",
    },
    image: {
      src: "/cstd-archive/cstd-archive-notebook-v1.webp",
      alt: { zh: "写满系统图的研究笔记", en: "A research notebook filled with system diagrams" },
    },
    relatedCaseSlugs: ["dcf-quantum", "alpha-research-system"],
    tags: ["Systems thinking", "Research", "Engineering", "Learning"],
    sections: [
      {
        id: "balance",
        title: { zh: "任何系统先画边界，再做衡算", en: "Draw the boundary before balancing the system" },
        paragraphs: [
          { zh: "在化工里，边界决定什么是输入、输出、积累和损失。软件也一样：请求、缓存、任务队列和数据库之间若没有明确边界，就无法解释状态从哪里来、去了哪里。", en: "In chemical engineering, boundaries define input, output, accumulation, and loss. Software is similar: without boundaries between requests, caches, queues, and databases, state cannot be explained." },
        ],
      },
      {
        id: "transport",
        title: { zh: "吞吐、延迟和瓶颈是一套传递问题", en: "Throughput, latency, and bottlenecks are transport problems" },
        paragraphs: [
          { zh: "传质与传热训练会自然追问驱动力、阻力和控制步骤。性能分析同样不能平均用力，而要找到支配总时间的阶段。", en: "Transport training asks about driving force, resistance, and the controlling step. Performance work likewise targets the stage that governs total time rather than optimizing evenly." },
        ],
      },
      {
        id: "experiment",
        title: { zh: "实验记录比漂亮结论更重要", en: "Experimental records matter more than elegant conclusions" },
        paragraphs: [
          { zh: "实验训练要求记录条件、误差和异常。它直接影响了我对运行清单、证据快照、可复现测试和失败分类的偏好。", en: "Lab practice records conditions, error, and anomalies. That directly shaped my preference for manifests, evidence snapshots, reproducible tests, and explicit failure classes." },
        ],
      },
    ],
  },
] as const;

export function getCstdTechnicalNote(slug: string) {
  return cstdTechnicalNotes.find((entry) => entry.slug === slug);
}

export function getTechnicalNotePath(note: CstdTechnicalNote, locale: CstdLocale) {
  return locale === "en" ? `/en/notes/${note.slug}` : `/notes/${note.slug}`;
}
