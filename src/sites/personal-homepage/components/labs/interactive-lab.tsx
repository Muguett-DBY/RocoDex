"use client";

import { ArrowRight, CheckCircle2, Copy, GitCommitHorizontal, Pause, Play, RotateCcw, ShieldX } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import type { CstdLocale } from "../../content/content-types";
import type { CstdLab } from "../../content/labs";
import { buildCstdDcfSensitivity, calculateCstdDcf } from "../../domain/dcf-model";
import { detectCstdRuntimeCapabilities, type CstdRuntimeCapabilities } from "../../experience/runtime-capabilities";
import { getPersonalSiteRouteDecision } from "../../infrastructure/routing";
import { ProofMuseumLab } from "./proof-museum";

type TraceStep = {
  label: string;
  detail: string;
  signal: string;
};

function PlaybackControls({
  locale,
  playing,
  canAdvance,
  onToggle,
  onReset,
  onAdvance,
}: {
  locale: CstdLocale;
  playing: boolean;
  canAdvance: boolean;
  onToggle: () => void;
  onReset: () => void;
  onAdvance: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={onToggle} aria-label={playing ? (locale === "zh" ? "暂停" : "Pause") : (locale === "zh" ? "播放" : "Play")} title={playing ? (locale === "zh" ? "暂停" : "Pause") : (locale === "zh" ? "播放" : "Play")} className="flex h-10 w-10 items-center justify-center bg-[#f4d431] text-black transition-colors hover:bg-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]">
        {playing ? <Pause aria-hidden="true" className="h-4 w-4" /> : <Play aria-hidden="true" className="h-4 w-4" />}
      </button>
      <button type="button" onClick={onReset} aria-label={locale === "zh" ? "重置" : "Reset"} title={locale === "zh" ? "重置" : "Reset"} className="flex h-10 w-10 items-center justify-center border border-white/20 text-[#9aa4a8] transition-colors hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
        <RotateCcw aria-hidden="true" className="h-4 w-4" />
      </button>
      <button type="button" disabled={!canAdvance} onClick={onAdvance} aria-label={locale === "zh" ? "下一步" : "Next step"} title={locale === "zh" ? "下一步" : "Next step"} className="flex h-10 w-10 items-center justify-center border border-[#24e0ff]/45 text-[#24e0ff] transition-colors hover:bg-[#24e0ff] hover:text-black disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24e0ff]">
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}

function TraceTimeline({ locale, steps, active, staleFrom }: { locale: CstdLocale; steps: readonly TraceStep[]; active: number; staleFrom?: number }) {
  return (
    <div className="mt-10 grid gap-3 lg:grid-cols-5">
      {steps.map((step, index) => {
        const complete = index < active;
        const current = index === active;
        const stale = typeof staleFrom === "number" && index >= staleFrom && index <= active;
        return (
          <div key={step.label} data-active={current ? "true" : "false"} className={`relative min-h-40 border p-4 transition-[border-color,background-color,transform] duration-500 ${current ? "-translate-y-2 border-[#f4d431] bg-[#f4d431]/10" : complete ? "border-[#24e0ff]/45 bg-[#24e0ff]/5" : "border-white/12 bg-black/15"}`}>
            <p className="font-mono text-[11px] font-black text-[#6f7b80]">{String(index + 1).padStart(2, "0")} / {step.signal}</p>
            <p className={`mt-4 text-base font-semibold ${stale ? "text-[#ff6b63]" : current ? "text-[#f4d431]" : complete ? "text-[#24e0ff]" : "text-[#aab3b6]"}`}>{step.label}</p>
            <p className="mt-3 text-xs leading-6 text-[#7f8a8f]">{step.detail}</p>
            {stale ? <p className="mt-4 font-mono text-[11px] font-black text-[#ff6b63]">{locale === "zh" ? "STALE / 写权限撤销" : "STALE / WRITE REVOKED"}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

function SystemTraceLab({ locale }: { locale: CstdLocale }) {
  const [host, setHost] = useState("custard.top");
  const [path, setPath] = useState("/work");
  const decision = useMemo(() => getPersonalSiteRouteDecision(host, path), [host, path]);
  const decisionTarget = decision.kind === "rewrite" ? decision.path : decision.kind === "redirect" ? decision.host : decision.kind;
  const steps = useMemo<readonly TraceStep[]>(() => locale === "zh" ? [
    { label: "接收请求", detail: `读取 ${host}${path}，此时不初始化任何产品运行时。`, signal: "EDGE" },
    { label: "Host 决策", detail: decision.kind === "redirect" ? `规范域名并重定向到 ${decision.host}。` : decision.kind === "next" ? "该 Host 不属于个人主站，继续交给 RocoDex。" : "命中 custard.top 的独立主站边界。", signal: "PROXY" },
    { label: "路由所有权", detail: decision.kind === "rewrite" ? `公开路径被内部改写到 ${decision.path}。` : decision.kind === "not-found" ? "未知主站路径在边界处直接返回 404。" : "无需内部改写，沿当前路由继续。", signal: "ROUTE" },
    { label: "站点模块", detail: decision.kind === "rewrite" ? "(personal) route group 只读取 personal-homepage 公共入口。" : "模块所有权保持不变，不发生跨站 Provider 泄漏。", signal: "MODULE" },
    { label: "可见结果", detail: `决策 ${decision.kind.toUpperCase()} / ${decisionTarget}，内容优先到达，视觉层随后增强。`, signal: "RENDER" },
  ] : [
    { label: "Receive request", detail: `Read ${host}${path} before any product runtime initializes.`, signal: "EDGE" },
    { label: "Host decision", detail: decision.kind === "redirect" ? `Canonicalize and redirect to ${decision.host}.` : decision.kind === "next" ? "This host is not the portfolio; continue into RocoDex." : "Match the isolated custard.top boundary.", signal: "PROXY" },
    { label: "Route ownership", detail: decision.kind === "rewrite" ? `Rewrite the public path internally to ${decision.path}.` : decision.kind === "not-found" ? "Reject the unknown portfolio path at the boundary." : "Continue without an internal rewrite.", signal: "ROUTE" },
    { label: "Site module", detail: decision.kind === "rewrite" ? "The (personal) group reads only from the portfolio public entry point." : "Module ownership remains unchanged with no cross-site provider leak.", signal: "MODULE" },
    { label: "Visible result", detail: `Decision ${decision.kind.toUpperCase()} / ${decisionTarget}; content arrives before visual enhancement.`, signal: "RENDER" },
  ], [decision, decisionTarget, host, locale, path]);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  function updateRequest(setter: (value: string) => void, value: string) {
    setter(value);
    setPlaying(false);
    setActive(0);
  }

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setActive((current) => {
      if (current >= steps.length - 1) {
        setPlaying(false);
        return current;
      }
      return current + 1;
    }), 950);
    return () => window.clearInterval(timer);
  }, [playing, steps.length]);

  return (
    <div data-cstd-lab="system-trace">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div><p className="font-mono text-[11px] font-black text-[#24e0ff]">LIVE REQUEST / ROUTING CONTRACT</p><p className="mt-2 text-sm text-[#8f9ba0]">{locale === "zh" ? "修改 Host 与路径，执行真实边界函数。" : "Change host and path, then execute the real boundary function."}</p></div>
        <PlaybackControls locale={locale} playing={playing} canAdvance={active < steps.length - 1} onToggle={() => setPlaying((value) => !value)} onReset={() => { setPlaying(false); setActive(0); }} onAdvance={() => setActive((value) => Math.min(steps.length - 1, value + 1))} />
      </div>
      <div className="mt-7 grid gap-px bg-white/12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_12rem]">
        <label className="bg-[#07090b] p-4 font-mono text-[11px] font-black text-[#78858a]">HOST<input value={host} onChange={(event) => updateRequest(setHost, event.target.value)} className="mt-2 h-11 w-full border border-white/15 bg-black/25 px-3 font-mono text-sm text-white outline-none focus:border-[#24e0ff]" /></label>
        <label className="bg-[#07090b] p-4 font-mono text-[11px] font-black text-[#78858a]">PATH<input value={path} onChange={(event) => updateRequest(setPath, event.target.value)} className="mt-2 h-11 w-full border border-white/15 bg-black/25 px-3 font-mono text-sm text-white outline-none focus:border-[#24e0ff]" /></label>
        <div data-cstd-route-decision={decision.kind} className="flex min-h-20 flex-col justify-center bg-[#071012] p-4"><p className="font-mono text-[11px] font-black text-[#78858a]">DECISION</p><p className="mt-2 break-all font-mono text-sm font-black text-[#f4d431]">{decision.kind.toUpperCase()}<span className="mt-1 block text-[11px] text-[#24e0ff]">{decisionTarget}</span></p></div>
      </div>
      <TraceTimeline locale={locale} steps={steps} active={active} />
      <div className="mt-6 border-l-2 border-[#f4d431] bg-black/25 p-5 font-mono text-[11px] leading-6 text-[#b9c2c4]" aria-live="polite">
        <span className="text-[#f4d431]">TRACE {String(active + 1).padStart(2, "0")}</span> / {steps[active].detail}
      </div>
    </div>
  );
}

function AgentReplayLab({ locale }: { locale: CstdLocale }) {
  const steps = useMemo<readonly TraceStep[]>(() => locale === "zh" ? [
    { label: "收集公开证据", detail: "行情、财务、公告与行业线索独立刷新。", signal: "COLLECT" },
    { label: "规范与指纹", detail: "归一化实体并对实质内容生成稳定指纹。", signal: "HASH" },
    { label: "创建后台任务", detail: "Pages 请求只入队并返回可轮询状态。", signal: "QUEUE" },
    { label: "深度综合", detail: "工作流从固定证据包生成带引用结论。", signal: "AGENT" },
    { label: "原子发布", detail: "运行令牌仍为当前值时才允许写回。", signal: "COMMIT" },
  ] : [
    { label: "Collect evidence", detail: "Prices, filings, disclosures, and industry signals refresh independently.", signal: "COLLECT" },
    { label: "Normalize and hash", detail: "Normalize entities and fingerprint material content.", signal: "HASH" },
    { label: "Create background job", detail: "The page request queues work and returns pollable state.", signal: "QUEUE" },
    { label: "Deep synthesis", detail: "A workflow builds cited conclusions from the fixed evidence pack.", signal: "AGENT" },
    { label: "Atomic publish", detail: "The write succeeds only while the run token remains current.", signal: "COMMIT" },
  ], [locale]);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [injectStale, setInjectStale] = useState(false);
  const [serverVersion, setServerVersion] = useState(7);
  const [clientVersion, setClientVersion] = useState(7);
  const [commitState, setCommitState] = useState<"clean" | "committed" | "conflict">("clean");

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setActive((current) => {
      if (current >= steps.length - 1) {
        setPlaying(false);
        return current;
      }
      return current + 1;
    }), 900);
    return () => window.clearInterval(timer);
  }, [playing, steps.length]);

  function injectConcurrentEdit() {
    setServerVersion((value) => value + 1);
    setCommitState("clean");
  }

  function commitDraft() {
    if (clientVersion !== serverVersion) {
      setCommitState("conflict");
      window.dispatchEvent(new CustomEvent("cstd:metric", { detail: { name: "lab_conflict", value: 409 } }));
      return;
    }
    const next = serverVersion + 1;
    setServerVersion(next);
    setClientVersion(next);
    setCommitState("committed");
  }

  return (
    <div data-cstd-lab="agent-replay">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="font-mono text-[11px] font-black text-[#24e0ff]">RUN TOKEN / alpha:research:042</p>
          <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm text-[#aab3b6]"><input type="checkbox" checked={injectStale} onChange={(event) => setInjectStale(event.target.checked)} className="h-4 w-4 accent-[#ff5a50]" />{locale === "zh" ? "在综合阶段注入一个更新任务" : "Inject a newer run during synthesis"}</label>
        </div>
        <PlaybackControls locale={locale} playing={playing} canAdvance={active < steps.length - 1} onToggle={() => setPlaying((value) => !value)} onReset={() => { setPlaying(false); setActive(0); }} onAdvance={() => setActive((value) => Math.min(steps.length - 1, value + 1))} />
      </div>
      <TraceTimeline locale={locale} steps={steps} active={active} staleFrom={injectStale && active >= 3 ? 3 : undefined} />
      <div aria-live="polite" className={`mt-6 border-l-2 p-5 text-sm leading-7 ${injectStale && active === steps.length - 1 ? "border-[#ff5a50] bg-[#ff5a50]/8 text-[#ffaaa5]" : "border-[#3dff8f] bg-[#3dff8f]/5 text-[#b9d9c8]"}`}>
        {injectStale && active === steps.length - 1
          ? (locale === "zh" ? "发布被拒绝：令牌 042 已被 043 取代。旧任务完成了计算，但没有覆盖新事实。" : "Publication rejected: token 042 was superseded by 043. The old job finished computation but did not overwrite newer truth.")
          : (locale === "zh" ? "当前运行仍拥有写权限。开启注入并播放到最后，观察过期保护。" : "The current run still owns write authority. Enable injection and play to the end to observe stale-run protection.")}
      </div>
      <div data-cstd-conflict-forge data-cstd-conflict-state={commitState} className="mt-8 border-y border-white/15 bg-black/20 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div><p className="font-mono text-[11px] font-black text-[#f4d431]">OPTIMISTIC LOCK / CRM VERSION FORGE</p><p className="mt-2 text-sm leading-6 text-[#8f9ba0]">{locale === "zh" ? "让另一位操作者先写入，再提交当前草稿，观察版本锁如何拒绝覆盖。" : "Let another operator write first, then submit this draft to see the version lock reject overwrite."}</p></div>
          <div className="flex gap-2">
            <button type="button" onClick={injectConcurrentEdit} className="h-10 border border-[#24e0ff]/45 px-3 font-mono text-[11px] font-black text-[#24e0ff] hover:bg-[#24e0ff] hover:text-black">{locale === "zh" ? "注入并发编辑" : "Concurrent edit"}</button>
            <button type="button" onClick={commitDraft} className="inline-flex h-10 items-center gap-2 bg-[#f4d431] px-3 font-mono text-[11px] font-black text-black hover:bg-white"><GitCommitHorizontal aria-hidden="true" className="h-3.5 w-3.5" />{locale === "zh" ? "提交草稿" : "Commit draft"}</button>
          </div>
        </div>
        <div className="mt-6 grid gap-px bg-white/12 sm:grid-cols-3">
          <div className="bg-[#07090b] p-4"><p className="font-mono text-[11px] font-black text-[#78858a]">CLIENT VERSION</p><p className="mt-2 font-mono text-3xl font-black text-[#24e0ff]">v{clientVersion}</p></div>
          <div className="bg-[#07090b] p-4"><p className="font-mono text-[11px] font-black text-[#78858a]">SERVER VERSION</p><p className="mt-2 font-mono text-3xl font-black text-[#f4d431]">v{serverVersion}</p></div>
          <div aria-live="polite" className="bg-[#07090b] p-4"><p className="font-mono text-[11px] font-black text-[#78858a]">COMMIT RESULT</p><p className={`mt-2 flex items-center gap-2 font-mono text-sm font-black ${commitState === "conflict" ? "text-[#ff5a50]" : "text-[#3dff8f]"}`}>{commitState === "conflict" ? <ShieldX aria-hidden="true" className="h-4 w-4" /> : <CheckCircle2 aria-hidden="true" className="h-4 w-4" />}{commitState === "conflict" ? "409 VERSION CONFLICT" : commitState === "committed" ? "200 COMMITTED" : "READY"}</p></div>
        </div>
        <button type="button" onClick={() => { setServerVersion(7); setClientVersion(7); setCommitState("clean"); }} className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] font-black text-[#8f9ba0] hover:text-white"><RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />RESET VERSIONS</button>
      </div>
    </div>
  );
}

function DataLensLab({ locale }: { locale: CstdLocale }) {
  const [growth, setGrowth] = useState(6);
  const [discount, setDiscount] = useState(10);
  const [margin, setMargin] = useState(25);
  const base = calculateCstdDcf(growth / 100, discount / 100);
  const bear = calculateCstdDcf(Math.max(0, growth - 2) / 100, (discount + 1.5) / 100).value;
  const bull = calculateCstdDcf((growth + 2) / 100, Math.max(4, discount - 1.5) / 100).value;
  const sensitivity = buildCstdDcfSensitivity(growth, discount);
  const sensitivityValues = sensitivity.flat().map((cell) => cell.value);
  const sensitivityMin = Math.min(...sensitivityValues);
  const sensitivityRange = Math.max(1, Math.max(...sensitivityValues) - sensitivityMin);
  const buyLine = base.value * (1 - margin / 100);
  const maxCash = Math.max(...base.years);
  const path = base.years.map((cashFlow, index) => `${index === 0 ? "M" : "L"} ${40 + index * 120} ${180 - (cashFlow / maxCash) * 130}`).join(" ");
  const copy = locale === "zh" ? { growth: "现金流增长", discount: "折现率", margin: "安全边际", bear: "悲观价值", base: "中性价值", bull: "乐观价值", buy: "买入线", note: "演示使用归一化现金流 100，仅展示参数敏感性，不构成投资建议。" } : { growth: "Cash-flow growth", discount: "Discount rate", margin: "Margin of safety", bear: "Bear value", base: "Base value", bull: "Bull value", buy: "Buy line", note: "The demo uses normalized cash flow of 100 to show sensitivity only. It is not investment advice." };

  return (
    <div data-cstd-lab="data-lens" className="grid gap-10 lg:grid-cols-[22rem_minmax(0,1fr)]">
      <div className="space-y-7">
        {[
          { id: "growth", label: copy.growth, value: growth, min: 0, max: 14, set: setGrowth },
          { id: "discount", label: copy.discount, value: discount, min: 6, max: 16, set: setDiscount },
          { id: "margin", label: copy.margin, value: margin, min: 0, max: 50, set: setMargin },
        ].map((control) => (
          <div key={control.id}>
            <div className="flex items-center justify-between gap-5"><label htmlFor={`lens-${control.id}`} className="font-mono text-[11px] font-black text-[#aab3b6]">{control.label.toUpperCase()}</label><output htmlFor={`lens-${control.id}`} data-cstd-control-value={control.id} className="w-16 text-right font-mono text-lg font-black text-[#f4d431]">{control.value}%</output></div>
            <input id={`lens-${control.id}`} type="range" min={control.min} max={control.max} step="0.5" value={control.value} onChange={(event) => control.set(Number(event.target.value))} className="mt-3 w-full accent-[#24e0ff]" />
          </div>
        ))}
        <button type="button" onClick={() => { setGrowth(6); setDiscount(10); setMargin(25); }} className="inline-flex items-center gap-2 border-b border-white/30 pb-1 font-mono text-[11px] font-black text-[#8f9ba0] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><RotateCcw aria-hidden="true" className="h-3.5 w-3.5" /> RESET BASELINE</button>
      </div>

      <div>
        <svg viewBox="0 0 560 210" role="img" aria-label={locale === "zh" ? "五年现金流曲线" : "Five-year cash-flow curve"} className="w-full border border-white/12 bg-black/20">
          <defs><linearGradient id="cstd-lens-line" x1="0" x2="1"><stop stopColor="#24e0ff" /><stop offset="1" stopColor="#f4d431" /></linearGradient></defs>
          {[50, 100, 150].map((y) => <line key={y} x1="28" x2="532" y1={y} y2={y} stroke="rgba(255,255,255,.1)" />)}
          <path d={path} fill="none" stroke="url(#cstd-lens-line)" strokeWidth="4" />
          {base.years.map((cashFlow, index) => <circle key={index} cx={40 + index * 120} cy={180 - (cashFlow / maxCash) * 130} r="6" fill={index === 4 ? "#f4d431" : "#24e0ff"}><title>{`Y${index + 1}: ${cashFlow.toFixed(1)}`}</title></circle>)}
        </svg>
        <dl className="mt-6 grid grid-cols-2 border-y border-white/15 md:grid-cols-4">
          {[
            { label: copy.bear, value: bear, color: "text-[#ff7b73]" },
            { label: copy.base, value: base.value, color: "text-[#24e0ff]" },
            { label: copy.bull, value: bull, color: "text-[#3dff8f]" },
            { label: copy.buy, value: buyLine, color: "text-[#f4d431]" },
          ].map((metric) => <div key={metric.label} className="border-white/12 p-4 odd:border-r md:border-r md:last:border-r-0"><dt className="font-mono text-[11px] font-black text-[#68757b]">{metric.label.toUpperCase()}</dt><dd className={`mt-2 text-xl font-semibold ${metric.color}`}>{metric.value.toFixed(0)}</dd></div>)}
        </dl>
        <p className="mt-5 text-xs leading-6 text-[#78858a]">{copy.note}</p>
        <div data-cstd-dcf-sensitivity className="mt-8 overflow-x-auto border-y border-white/15 py-5">
          <div className="mb-4 flex items-center justify-between gap-5"><p className="font-mono text-[11px] font-black text-[#24e0ff]">5 × 5 SENSITIVITY SURFACE</p><button type="button" onClick={() => void navigator.clipboard?.writeText(JSON.stringify({ growth, discount, margin, value: Number(base.value.toFixed(2)) }))} aria-label={locale === "zh" ? "复制当前估值场景" : "Copy valuation scenario"} title={locale === "zh" ? "复制当前估值场景" : "Copy valuation scenario"} className="flex h-9 w-9 items-center justify-center border border-white/18 text-[#8f9ba0] hover:border-[#f4d431] hover:text-[#f4d431]"><Copy aria-hidden="true" className="h-4 w-4" /></button></div>
          <div className="grid min-w-[34rem] grid-cols-[4.5rem_repeat(5,minmax(0,1fr))] gap-px bg-white/12">
            <div className="bg-[#07090b] p-2 font-mono text-[11px] font-black text-[#68757b]">WACC \ G</div>
            {sensitivity[0].map((cell) => <div key={`g-${cell.growth}`} className="bg-[#07090b] p-2 text-center font-mono text-[11px] font-black text-[#24e0ff]">{cell.growth.toFixed(1)}%</div>)}
            {sensitivity.map((row) => [
              <div key={`d-${row[0].discount}`} className="bg-[#07090b] p-3 text-center font-mono text-[11px] font-black text-[#f4d431]">{row[0].discount.toFixed(1)}%</div>,
              ...row.map((cell) => {
                const intensity = (cell.value - sensitivityMin) / sensitivityRange;
                const activeCell = cell.growth === growth && cell.discount === discount;
                return <button key={`${cell.discount}-${cell.growth}`} type="button" onClick={() => { setGrowth(cell.growth); setDiscount(cell.discount); }} aria-label={locale === "zh" ? `估值场景：增长 ${cell.growth}%，折现 ${cell.discount}%，价值 ${cell.value.toFixed(0)}` : `Valuation scenario: growth ${cell.growth}%, discount ${cell.discount}%, value ${cell.value.toFixed(0)}`} className={`min-h-12 p-2 font-mono text-[11px] font-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#f4d431] ${activeCell ? "ring-2 ring-inset ring-[#f4d431]" : ""}`} style={{ backgroundColor: `rgba(36,224,255,${(0.08 + intensity * 0.42).toFixed(3)})` }}>{cell.value.toFixed(0)}</button>;
              }),
            ])}
          </div>
        </div>
      </div>
    </div>
  );
}

type RenderBudget = "full" | "balanced" | "calm";

function RenderProbe({ budget, onFps }: { budget: RenderBudget; onFps: (value: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const count = budget === "full" ? 130 : budget === "balanced" ? 62 : 18;
    const particles = Array.from({ length: count }, (_, index) => ({ x: (index * 73) % 700, y: (index * 47) % 360, speed: 0.2 + (index % 7) * 0.08 }));
    let animationFrame = 0;
    let frames = 0;
    let sampledAt = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, budget === "full" ? 1.5 : 1);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const render = (time: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(5,7,9,.92)";
      context.fillRect(0, 0, width, height);
      for (const [index, particle] of particles.entries()) {
        particle.y = (particle.y + particle.speed) % Math.max(height, 1);
        const x = particle.x % Math.max(width, 1);
        context.beginPath();
        context.fillStyle = index % 8 === 0 ? "rgba(244,212,49,.9)" : "rgba(36,224,255,.58)";
        context.arc(x, particle.y, index % 9 === 0 ? 2.2 : 1.1, 0, Math.PI * 2);
        context.fill();
        if (budget !== "calm" && index % 3 === 0) {
          context.beginPath();
          context.strokeStyle = "rgba(36,224,255,.08)";
          context.moveTo(x, particle.y);
          context.lineTo(width / 2 + Math.sin(time * 0.0004 + index) * 80, height / 2);
          context.stroke();
        }
      }
      frames += 1;
      if (time - sampledAt >= 800) {
        onFps(Math.round(frames * 1000 / (time - sampledAt)));
        frames = 0;
        sampledAt = time;
      }
      animationFrame = window.requestAnimationFrame(render);
    };
    resize();
    window.addEventListener("resize", resize);
    animationFrame = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [budget, onFps]);

  return <canvas ref={canvasRef} className="h-[22rem] w-full" aria-label={`Render probe ${budget}`} />;
}

function RenderLab({ locale }: { locale: CstdLocale }) {
  const [budget, setBudget] = useState<RenderBudget>("full");
  const [fps, setFps] = useState(0);
  const [runtime, setRuntime] = useState<CstdRuntimeCapabilities | null>(null);
  const onFps = useMemo(() => (value: number) => setFps(value), []);
  const config = {
    full: { particles: 130, dpr: "1.5x", glow: locale === "zh" ? "完整" : "full" },
    balanced: { particles: 62, dpr: "1.0x", glow: locale === "zh" ? "收敛" : "restrained" },
    calm: { particles: 18, dpr: "1.0x", glow: locale === "zh" ? "关闭" : "off" },
  }[budget];

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setRuntime(detectCstdRuntimeCapabilities()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div data-cstd-lab="render-lab">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex border border-white/15" role="group" aria-label={locale === "zh" ? "渲染预算" : "Render budget"}>
          {(["full", "balanced", "calm"] as const).map((mode) => <button key={mode} type="button" aria-pressed={budget === mode} onClick={() => setBudget(mode)} className="h-10 border-r border-white/15 px-4 font-mono text-[11px] font-black uppercase text-[#8f9ba0] last:border-r-0 hover:text-white aria-pressed:bg-[#f4d431] aria-pressed:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#24e0ff]">{mode}</button>)}
        </div>
        <div className="font-mono text-[11px] font-black text-[#718087]">LIVE FPS <span data-cstd-render-fps aria-live="polite" className="ml-2 inline-block w-12 text-right text-xl text-[#3dff8f]">{fps || "--"}</span></div>
      </div>
      <div className="mt-6 overflow-hidden border border-white/15"><RenderProbe budget={budget} onFps={onFps} /></div>
      <dl className="grid grid-cols-3 border-x border-b border-white/15">
        <div className="border-r border-white/15 p-4"><dt className="font-mono text-[11px] font-black text-[#68757b]">PARTICLES</dt><dd className="mt-2 text-lg font-semibold text-[#24e0ff]">{config.particles}</dd></div>
        <div className="border-r border-white/15 p-4"><dt className="font-mono text-[11px] font-black text-[#68757b]">DPR CAP</dt><dd className="mt-2 text-lg font-semibold text-[#f4d431]">{config.dpr}</dd></div>
        <div className="p-4"><dt className="font-mono text-[11px] font-black text-[#68757b]">GLOW</dt><dd className="mt-2 text-lg font-semibold text-white">{config.glow}</dd></div>
      </dl>
      <dl data-cstd-runtime-diagnostics className="grid border-x border-b border-white/15 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border-b border-white/15 p-4 sm:border-r lg:border-b-0"><dt className="font-mono text-[11px] font-black text-[#68757b]">AUTO TIER</dt><dd className="mt-2 font-mono text-sm font-black text-[#3dff8f]">{runtime?.tier.toUpperCase() ?? "PROBING"}</dd></div>
        <div className="border-b border-white/15 p-4 lg:border-b-0 lg:border-r"><dt className="font-mono text-[11px] font-black text-[#68757b]">BACKEND</dt><dd className="mt-2 font-mono text-sm font-black text-[#24e0ff]">{runtime?.backend.toUpperCase() ?? "--"}</dd></div>
        <div className="border-b border-white/15 p-4 sm:border-r lg:border-b-0"><dt className="font-mono text-[11px] font-black text-[#68757b]">WEBGPU READY</dt><dd className="mt-2 font-mono text-sm font-black text-[#f4d431]">{runtime ? (runtime.webgpu ? "YES" : "NO / FALLBACK") : "--"}</dd></div>
        <div className="p-4"><dt className="font-mono text-[11px] font-black text-[#68757b]">DEVICE SIGNAL</dt><dd className="mt-2 font-mono text-sm font-black text-white">{runtime ? `${runtime.hardwareConcurrency}C / ${runtime.deviceMemory ?? "?"}GB / ${runtime.dpr}DPR` : "--"}</dd></div>
      </dl>
    </div>
  );
}

const labRenderers: Record<CstdLab["renderer"], ComponentType<{ locale: CstdLocale }>> = {
  "system-trace": SystemTraceLab,
  "agent-replay": AgentReplayLab,
  "data-lens": DataLensLab,
  "render-lab": RenderLab,
  "proof-museum": ProofMuseumLab,
};

export function InteractiveLab({ lab, locale }: { lab: CstdLab; locale: CstdLocale }) {
  const Renderer = labRenderers[lab.renderer];

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("cstd:metric", { detail: { name: "lab_loaded", value: Number(lab.number) } }));
  }, [lab.number]);

  return <Renderer locale={locale} />;
}
