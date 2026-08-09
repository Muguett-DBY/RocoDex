import type { CstdLocale, LocalizedText } from "./content-types";

export type CstdCaseReplayId = "alpha-race" | "dcf-cache" | "host-boundaries" | "crm-lock";

export type CstdCaseReplay = Readonly<{
  id: CstdCaseReplayId;
  caseSlug: "alpha-research-system" | "dcf-quantum" | "rocodex-platform" | "cfzzs-crm";
  title: LocalizedText;
  thesis: LocalizedText;
  inputLabel: LocalizedText;
  inputMin: number;
  inputMax: number;
  inputStep: number;
  inputDefault: number;
  unit: Readonly<Record<CstdLocale, string>>;
  sourceHref: Readonly<Record<CstdLocale, string>>;
}>;

export const cstdCaseReplays: readonly CstdCaseReplay[] = [
  {
    id: "alpha-race",
    caseSlug: "alpha-research-system",
    title: { zh: "异步版本竞态", en: "Async version race" },
    thesis: { zh: "旧任务可以完成，但不能覆盖新事实。", en: "A stale task may finish, but it cannot overwrite newer truth." },
    inputLabel: { zh: "并发研究任务", en: "Concurrent research jobs" },
    inputMin: 2,
    inputMax: 8,
    inputStep: 1,
    inputDefault: 4,
    unit: { zh: "个", en: " jobs" },
    sourceHref: { zh: "/work/alpha-research-system", en: "/en/work/alpha-research-system" },
  },
  {
    id: "dcf-cache",
    caseSlug: "dcf-quantum",
    title: { zh: "缓存序列化热点", en: "Cache serialization hot path" },
    thesis: { zh: "优化重复解析和序列化，而不是改写确定性估值数学。", en: "Remove repeated parse and serialization work without rewriting deterministic valuation math." },
    inputLabel: { zh: "扫描记录", en: "Scan records" },
    inputMin: 100,
    inputMax: 1200,
    inputStep: 100,
    inputDefault: 600,
    unit: { zh: "条", en: " records" },
    sourceHref: { zh: "/work/dcf-quantum", en: "/en/work/dcf-quantum" },
  },
  {
    id: "host-boundaries",
    caseSlug: "rocodex-platform",
    title: { zh: "双域名边界", en: "Dual-host boundary" },
    thesis: { zh: "在 React 初始化前决定产品所有权。", en: "Resolve product ownership before React initializes." },
    inputLabel: { zh: "请求批次", en: "Request batch" },
    inputMin: 3,
    inputMax: 12,
    inputStep: 1,
    inputDefault: 6,
    unit: { zh: "个", en: " requests" },
    sourceHref: { zh: "/work/rocodex-platform", en: "/en/work/rocodex-platform" },
  },
  {
    id: "crm-lock",
    caseSlug: "cfzzs-crm",
    title: { zh: "业务记录乐观锁", en: "Operational optimistic lock" },
    thesis: { zh: "冲突必须显式返回，而不是静默覆盖客服刚刚确认的事实。", en: "A conflict must return explicitly instead of silently overwriting a newly confirmed operational fact." },
    inputLabel: { zh: "并发编辑者", en: "Concurrent editors" },
    inputMin: 2,
    inputMax: 10,
    inputStep: 1,
    inputDefault: 5,
    unit: { zh: "人", en: " editors" },
    sourceHref: { zh: "/work/cfzzs-crm", en: "/en/work/cfzzs-crm" },
  },
] as const;

export function getCstdCaseReplayByCaseSlug(slug: string) {
  return cstdCaseReplays.find((replay) => replay.caseSlug === slug);
}
