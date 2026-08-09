import type { CstdLocale, LocalizedText } from "./content-types";

export type CstdCaseDossierNode = Readonly<{
  id: string;
  type: "edge" | "contract" | "state" | "proof";
  title: LocalizedText;
  detail: LocalizedText;
}>;

export type CstdCaseDossier = Readonly<{
  caseSlug: "rocodex-platform" | "cfzzs-crm" | "alpha-research-system";
  accent: string;
  thesis: LocalizedText;
  architecture: readonly CstdCaseDossierNode[];
  flows: readonly Readonly<{ from: string; to: string; label: LocalizedText }>[];
  decisions: readonly Readonly<{
    id: string;
    question: LocalizedText;
    chosen: LocalizedText;
    rejected: LocalizedText;
    rationale: LocalizedText;
    proofHref: Readonly<Record<CstdLocale, string>>;
  }>[];
  failureModes: readonly Readonly<{
    id: string;
    trigger: LocalizedText;
    containment: LocalizedText;
    visibleOutcome: LocalizedText;
    proofHref: Readonly<Record<CstdLocale, string>>;
  }>[];
}>;

export const cstdCaseDossiers: readonly CstdCaseDossier[] = [
  {
    caseSlug: "rocodex-platform",
    accent: "#24e0ff",
    thesis: {
      zh: "同一部署可以承载两个产品，但请求所有权、导入边界和失败出口必须在渲染前确定。",
      en: "One deployment can host two products, but request ownership, import boundaries, and failure exits must be decided before rendering.",
    },
    architecture: [
      { id: "host-gate", type: "edge", title: { zh: "Host Gate", en: "Host Gate" }, detail: { zh: "在产品树之前读取 Host，决定请求属于个人主站还是 RocoDex。", en: "Reads the Host before either product tree and assigns the request to the portfolio or RocoDex." } },
      { id: "route-groups", type: "contract", title: { zh: "Route Groups", en: "Route Groups" }, detail: { zh: "(personal) 与 (rocodex) 各自拥有页面、布局和故障边界。", en: "(personal) and (rocodex) own their pages, layouts, and failure boundaries." } },
      { id: "site-apis", type: "contract", title: { zh: "Narrow Site APIs", en: "Narrow Site APIs" }, detail: { zh: "站点只通过 index.ts 与 server.ts 暴露最小公共接口。", en: "Each site exposes a deliberately narrow public surface through index.ts and server.ts." } },
      { id: "host-tests", type: "proof", title: { zh: "Host Acceptance", en: "Host Acceptance" }, detail: { zh: "架构测试、Host 路由测试与浏览器验收共同证明隔离。", en: "Architecture, host-routing, and browser tests prove the separation together." } },
    ],
    flows: [
      { from: "host-gate", to: "route-groups", label: { zh: "分配请求", en: "assign request" } },
      { from: "route-groups", to: "site-apis", label: { zh: "限制依赖", en: "constrain imports" } },
      { from: "site-apis", to: "host-tests", label: { zh: "验证边界", en: "verify boundary" } },
    ],
    decisions: [
      { id: "host-first", question: { zh: "何时区分两个产品？", en: "When should the products diverge?" }, chosen: { zh: "Host 级路由先于 React 树", en: "Host routing before the React tree" }, rejected: { zh: "客户端加载后再跳转", en: "Redirect after client hydration" }, rationale: { zh: "避免错误产品闪现、共享状态和不可预测的 404。", en: "Prevents wrong-product flashes, shared state, and ambiguous 404 behavior." }, proofHref: { zh: "/notes/host-boundaries-in-one-next-deployment", en: "/en/notes/host-boundaries-in-one-next-deployment" } },
      { id: "narrow-api", question: { zh: "模块如何协作？", en: "How should modules collaborate?" }, chosen: { zh: "显式的最小公共 API", en: "Explicit minimal public APIs" }, rejected: { zh: "跨目录深层导入", en: "Cross-directory deep imports" }, rationale: { zh: "所有权清晰，重构时能由导入守卫立即暴露越界。", en: "Ownership stays visible and import guards expose boundary violations immediately." }, proofHref: { zh: "/lab/system-trace", en: "/en/lab/system-trace" } },
    ],
    failureModes: [
      { id: "unknown-path", trigger: { zh: "custard.top 收到未声明路径", en: "custard.top receives an undeclared path" }, containment: { zh: "路由契约返回个人站 not-found，而不是落入 RocoDex。", en: "The routing contract returns the personal-site not-found instead of falling into RocoDex." }, visibleOutcome: { zh: "品牌一致的失败出口", en: "A site-consistent failure exit" }, proofHref: { zh: "/work/rocodex-platform#evidence", en: "/en/work/rocodex-platform#evidence" } },
      { id: "cross-import", trigger: { zh: "站点代码跨边界深层导入", en: "Site code deep-imports across ownership boundaries" }, containment: { zh: "架构回归测试在构建前失败。", en: "The architecture regression test fails before deployment." }, visibleOutcome: { zh: "越界不会进入生产包", en: "The violation never enters the production bundle" }, proofHref: { zh: "/lab/system-trace", en: "/en/lab/system-trace" } },
    ],
  },
  {
    caseSlug: "cfzzs-crm",
    accent: "#f4d431",
    thesis: {
      zh: "业务系统的可信度来自服务端权限、数据范围和并发冲突都能被明确拒绝。",
      en: "Operational trust comes from explicit server-side rejection of permission, data-scope, and concurrency violations.",
    },
    architecture: [
      { id: "identity", type: "edge", title: { zh: "Request Identity", en: "Request Identity" }, detail: { zh: "每个请求先绑定真实用户和角色上下文。", en: "Every request first binds to an authenticated user and role context." } },
      { id: "rbac", type: "contract", title: { zh: "RBAC Contract", en: "RBAC Contract" }, detail: { zh: "五级角色权限在服务端校验，不信任隐藏按钮。", en: "Five role levels are enforced on the server, never inferred from hidden buttons." } },
      { id: "scope", type: "state", title: { zh: "Data Scope", en: "Data Scope" }, detail: { zh: "查询与写入都受组织和角色数据范围约束。", en: "Reads and writes are constrained by organizational and role data scope." } },
      { id: "version", type: "state", title: { zh: "Optimistic Version", en: "Optimistic Version" }, detail: { zh: "记录版本参与更新条件，旧版本不能静默覆盖新事实。", en: "Record versions participate in updates so stale state cannot silently replace newer truth." } },
      { id: "role-e2e", type: "proof", title: { zh: "Real-role E2E", en: "Real-role E2E" }, detail: { zh: "真实角色浏览器流程验证权限、范围和 409 冲突。", en: "Browser flows with real roles verify authorization, scope, and 409 conflicts." } },
    ],
    flows: [
      { from: "identity", to: "rbac", label: { zh: "解析权限", en: "resolve permission" } },
      { from: "rbac", to: "scope", label: { zh: "约束数据", en: "constrain data" } },
      { from: "scope", to: "version", label: { zh: "条件写入", en: "conditional write" } },
      { from: "version", to: "role-e2e", label: { zh: "验证冲突", en: "verify conflict" } },
    ],
    decisions: [
      { id: "server-rbac", question: { zh: "权限由谁负责？", en: "Who owns authorization?" }, chosen: { zh: "服务端 RBAC + 数据范围", en: "Server-side RBAC and data scope" }, rejected: { zh: "前端菜单可见性即权限", en: "Treating menu visibility as permission" }, rationale: { zh: "客户端提示体验，服务端决定事实。", en: "The client communicates affordances; the server decides truth." }, proofHref: { zh: "/work/cfzzs-crm#architecture", en: "/en/work/cfzzs-crm#architecture" } },
      { id: "optimistic-lock", question: { zh: "多人编辑如何处理？", en: "How should concurrent edits behave?" }, chosen: { zh: "版本化乐观锁与显式 409", en: "Versioned optimistic locking with explicit 409" }, rejected: { zh: "最后写入者静默获胜", en: "Silent last-write-wins" }, rationale: { zh: "冲突应成为可恢复业务状态，而不是数据损坏。", en: "Conflict becomes a recoverable business state instead of data corruption." }, proofHref: { zh: "/notes/optimistic-locking-for-operations", en: "/en/notes/optimistic-locking-for-operations" } },
    ],
    failureModes: [
      { id: "stale-edit", trigger: { zh: "用户提交过期记录版本", en: "A user submits a stale record version" }, containment: { zh: "条件更新失败并返回 409，保留当前数据库事实。", en: "The conditional update fails with 409 and preserves current database truth." }, visibleOutcome: { zh: "提示冲突并要求刷新", en: "Conflict is surfaced and refresh is required" }, proofHref: { zh: "/lab/proof-museum", en: "/en/lab/proof-museum" } },
      { id: "scope-escape", trigger: { zh: "角色请求范围外记录", en: "A role requests an out-of-scope record" }, containment: { zh: "服务端权限与查询范围共同拒绝。", en: "Server authorization and query scope reject the request together." }, visibleOutcome: { zh: "越权数据不进入响应", en: "Unauthorized data never enters the response" }, proofHref: { zh: "/work/cfzzs-crm#evidence", en: "/en/work/cfzzs-crm#evidence" } },
    ],
  },
  {
    caseSlug: "alpha-research-system",
    accent: "#3dff8f",
    thesis: {
      zh: "AI 负责综合，证据指纹、不可变版本和确定性核心负责让结论可追问、可复核、可反证。",
      en: "AI synthesizes; evidence fingerprints, immutable versions, and a deterministic core make conclusions reviewable and falsifiable.",
    },
    architecture: [
      { id: "sources", type: "edge", title: { zh: "Source Intake", en: "Source Intake" }, detail: { zh: "数据、引用、缺失项与来源寿命进入同一个证据快照。", en: "Data, citations, missing fields, and source age enter one evidence snapshot." } },
      { id: "fingerprint", type: "contract", title: { zh: "Evidence Fingerprint", en: "Evidence Fingerprint" }, detail: { zh: "规范化证据先产生指纹，变化才触发新研究。", en: "Normalized evidence is fingerprinted before changed inputs trigger new research." } },
      { id: "run-token", type: "state", title: { zh: "D1 Run Token", en: "D1 Run Token" }, detail: { zh: "原子认领当前任务，过期回调没有写入权。", en: "Atomic tokens claim the current job and remove write authority from stale callbacks." } },
      { id: "valuation", type: "state", title: { zh: "Immutable Valuation", en: "Immutable Valuation" }, detail: { zh: "公式输入、确定性输出、模型解释和反证条件绑定到不可变版本。", en: "Formula inputs, deterministic outputs, model explanation, and disconfirming conditions bind to an immutable version." } },
      { id: "replay", type: "proof", title: { zh: "Agent Replay", en: "Agent Replay" }, detail: { zh: "可执行重放验证收集、指纹、排队、综合与发布顺序。", en: "Executable replay verifies collection, fingerprinting, queueing, synthesis, and publication order." } },
    ],
    flows: [
      { from: "sources", to: "fingerprint", label: { zh: "规范化", en: "normalize" } },
      { from: "fingerprint", to: "run-token", label: { zh: "认领任务", en: "claim job" } },
      { from: "run-token", to: "valuation", label: { zh: "提交版本", en: "commit version" } },
      { from: "valuation", to: "replay", label: { zh: "留下证据", en: "leave evidence" } },
    ],
    decisions: [
      { id: "fingerprint-first", question: { zh: "何时调用模型？", en: "When should the model run?" }, chosen: { zh: "先比较证据指纹", en: "Compare evidence fingerprints first" }, rejected: { zh: "每次访问都重新生成", en: "Regenerate on every visit" }, rationale: { zh: "模型成本服从事实变化，结果版本也更清晰。", en: "Model cost follows factual change and result versions stay explicit." }, proofHref: { zh: "/notes/evidence-first-ai-research", en: "/en/notes/evidence-first-ai-research" } },
      { id: "deterministic-core", question: { zh: "估值由谁计算？", en: "Who computes valuation?" }, chosen: { zh: "确定性公式核心，AI 解释边缘", en: "Deterministic formula core, AI explanation edge" }, rejected: { zh: "让模型直接生成数字", en: "Letting the model invent the numbers" }, rationale: { zh: "公式可复现，模型仍能提供语境与反证条件。", en: "Formulas remain reproducible while the model provides context and disconfirming conditions." }, proofHref: { zh: "/notes/deterministic-core-ai-edge", en: "/en/notes/deterministic-core-ai-edge" } },
      { id: "immutable-version", question: { zh: "研究历史如何保存？", en: "How should research history persist?" }, chosen: { zh: "不可变估值版本", en: "Immutable valuation versions" }, rejected: { zh: "原地覆盖最新结果", en: "Overwriting the latest result in place" }, rationale: { zh: "每个结论都能返回当时的输入、来源与任务。", en: "Every conclusion can return to the inputs, sources, and job that produced it." }, proofHref: { zh: "/work/alpha-research-system#architecture", en: "/en/work/alpha-research-system#architecture" } },
    ],
    failureModes: [
      { id: "stale-callback", trigger: { zh: "旧任务晚于新任务完成", en: "An older job completes after a newer job" }, containment: { zh: "运行令牌校验拒绝过期写入。", en: "Run-token validation rejects the stale write." }, visibleOutcome: { zh: "当前研究版本保持不变", en: "The current research version remains unchanged" }, proofHref: { zh: "/lab/agent-replay", en: "/en/lab/agent-replay" } },
      { id: "missing-evidence", trigger: { zh: "关键数据缺失或来源退化", en: "Critical data is missing or a source degrades" }, containment: { zh: "缺失项和 fallback 随版本保存，不伪装成完整输入。", en: "Missing fields and fallback provenance persist with the version instead of posing as complete input." }, visibleOutcome: { zh: "结论显示来源与限制", en: "The conclusion exposes its sources and limits" }, proofHref: { zh: "/work/alpha-research-system#evidence", en: "/en/work/alpha-research-system#evidence" } },
      { id: "model-failure", trigger: { zh: "首选模型不可用", en: "The preferred model is unavailable" }, containment: { zh: "按已声明的两级模型策略回退，确定性计算不受影响。", en: "The declared two-tier model strategy falls back while deterministic calculation remains intact." }, visibleOutcome: { zh: "解释层降级，数值核心不漂移", en: "Explanation degrades without numerical drift" }, proofHref: { zh: "/notes/deterministic-core-ai-edge", en: "/en/notes/deterministic-core-ai-edge" } },
    ],
  },
] as const;

export function getCstdCaseDossier(caseSlug: string) {
  return cstdCaseDossiers.find((entry) => entry.caseSlug === caseSlug);
}
