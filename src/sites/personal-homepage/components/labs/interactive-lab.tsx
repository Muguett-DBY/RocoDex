"use client";

import { ArrowRight, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CstdLocale } from "../../content/content-types";
import type { CstdLab } from "../../content/labs";

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
            <p className="font-mono text-[8px] font-black text-[#6f7b80]">{String(index + 1).padStart(2, "0")} / {step.signal}</p>
            <p className={`mt-4 text-base font-semibold ${stale ? "text-[#ff6b63]" : current ? "text-[#f4d431]" : complete ? "text-[#24e0ff]" : "text-[#aab3b6]"}`}>{step.label}</p>
            <p className="mt-3 text-xs leading-6 text-[#7f8a8f]">{step.detail}</p>
            {stale ? <p className="mt-4 font-mono text-[8px] font-black text-[#ff6b63]">{locale === "zh" ? "STALE / 写权限撤销" : "STALE / WRITE REVOKED"}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

function SystemTraceLab({ locale }: { locale: CstdLocale }) {
  const steps = useMemo<readonly TraceStep[]>(() => locale === "zh" ? [
    { label: "接收请求", detail: "读取 Host、路径与方法，不初始化任何产品运行时。", signal: "EDGE" },
    { label: "Host 决策", detail: "custard.top 的公开路径被映射到个人站内部路由。", signal: "PROXY" },
    { label: "路由所有权", detail: "(personal) route group 接管页面，不加载 RocoDex Provider。", signal: "ROUTE" },
    { label: "站点 API", detail: "页面只从 personal-homepage 的 public entry 读取。", signal: "MODULE" },
    { label: "渐进渲染", detail: "内容先到达，Canvas、向导与监控按生命周期增强。", signal: "RENDER" },
  ] : [
    { label: "Receive request", detail: "Read host, path, and method before any product runtime initializes.", signal: "EDGE" },
    { label: "Host decision", detail: "Public custard.top paths map to internal portfolio routes.", signal: "PROXY" },
    { label: "Route ownership", detail: "The (personal) group takes over without RocoDex providers.", signal: "ROUTE" },
    { label: "Site API", detail: "The page reads only from the portfolio public entry point.", signal: "MODULE" },
    { label: "Progressive render", detail: "Content arrives first; canvas, guide, and telemetry enhance by lifecycle.", signal: "RENDER" },
  ], [locale]);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

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
        <div><p className="font-mono text-[9px] font-black text-[#24e0ff]">LIVE REQUEST / custard.top/work</p><p className="mt-2 text-sm text-[#8f9ba0]">{locale === "zh" ? "逐步执行一条生产请求。" : "Execute one production request step by step."}</p></div>
        <PlaybackControls locale={locale} playing={playing} canAdvance={active < steps.length - 1} onToggle={() => setPlaying((value) => !value)} onReset={() => { setPlaying(false); setActive(0); }} onAdvance={() => setActive((value) => Math.min(steps.length - 1, value + 1))} />
      </div>
      <TraceTimeline locale={locale} steps={steps} active={active} />
      <div className="mt-6 border-l-2 border-[#f4d431] bg-black/25 p-5 font-mono text-[10px] leading-6 text-[#b9c2c4]" aria-live="polite">
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

  return (
    <div data-cstd-lab="agent-replay">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="font-mono text-[9px] font-black text-[#24e0ff]">RUN TOKEN / alpha:research:042</p>
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
    </div>
  );
}

function presentValue(growth: number, discount: number) {
  const baseCashFlow = 100;
  const years = Array.from({ length: 5 }, (_, index) => baseCashFlow * (1 + growth) ** (index + 1));
  const explicit = years.reduce((sum, cashFlow, index) => sum + cashFlow / (1 + discount) ** (index + 1), 0);
  const terminalGrowth = Math.min(0.03, Math.max(0.005, growth * 0.45));
  const terminal = years.at(-1)! * (1 + terminalGrowth) / Math.max(0.01, discount - terminalGrowth);
  return { years, value: explicit + terminal / (1 + discount) ** 5 };
}

function DataLensLab({ locale }: { locale: CstdLocale }) {
  const [growth, setGrowth] = useState(6);
  const [discount, setDiscount] = useState(10);
  const [margin, setMargin] = useState(25);
  const base = presentValue(growth / 100, discount / 100);
  const bear = presentValue(Math.max(0, growth - 2) / 100, (discount + 1.5) / 100).value;
  const bull = presentValue((growth + 2) / 100, Math.max(4, discount - 1.5) / 100).value;
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
            <div className="flex items-center justify-between gap-5"><label htmlFor={`lens-${control.id}`} className="font-mono text-[9px] font-black text-[#aab3b6]">{control.label.toUpperCase()}</label><output htmlFor={`lens-${control.id}`} data-cstd-control-value={control.id} className="w-16 text-right font-mono text-lg font-black text-[#f4d431]">{control.value}%</output></div>
            <input id={`lens-${control.id}`} type="range" min={control.min} max={control.max} step="0.5" value={control.value} onChange={(event) => control.set(Number(event.target.value))} className="mt-3 w-full accent-[#24e0ff]" />
          </div>
        ))}
        <button type="button" onClick={() => { setGrowth(6); setDiscount(10); setMargin(25); }} className="inline-flex items-center gap-2 border-b border-white/30 pb-1 font-mono text-[9px] font-black text-[#8f9ba0] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><RotateCcw aria-hidden="true" className="h-3.5 w-3.5" /> RESET BASELINE</button>
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
          ].map((metric) => <div key={metric.label} className="border-white/12 p-4 odd:border-r md:border-r md:last:border-r-0"><dt className="font-mono text-[8px] font-black text-[#68757b]">{metric.label.toUpperCase()}</dt><dd className={`mt-2 text-xl font-semibold ${metric.color}`}>{metric.value.toFixed(0)}</dd></div>)}
        </dl>
        <p className="mt-5 text-xs leading-6 text-[#78858a]">{copy.note}</p>
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
  const onFps = useMemo(() => (value: number) => setFps(value), []);
  const config = {
    full: { particles: 130, dpr: "1.5x", glow: locale === "zh" ? "完整" : "full" },
    balanced: { particles: 62, dpr: "1.0x", glow: locale === "zh" ? "收敛" : "restrained" },
    calm: { particles: 18, dpr: "1.0x", glow: locale === "zh" ? "关闭" : "off" },
  }[budget];

  return (
    <div data-cstd-lab="render-lab">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex border border-white/15" role="group" aria-label={locale === "zh" ? "渲染预算" : "Render budget"}>
          {(["full", "balanced", "calm"] as const).map((mode) => <button key={mode} type="button" aria-pressed={budget === mode} onClick={() => setBudget(mode)} className="h-10 border-r border-white/15 px-4 font-mono text-[9px] font-black uppercase text-[#8f9ba0] last:border-r-0 hover:text-white aria-pressed:bg-[#f4d431] aria-pressed:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#24e0ff]">{mode}</button>)}
        </div>
        <div className="font-mono text-[9px] font-black text-[#718087]">LIVE FPS <span data-cstd-render-fps aria-live="polite" className="ml-2 inline-block w-12 text-right text-xl text-[#3dff8f]">{fps || "--"}</span></div>
      </div>
      <div className="mt-6 overflow-hidden border border-white/15"><RenderProbe budget={budget} onFps={onFps} /></div>
      <dl className="grid grid-cols-3 border-x border-b border-white/15">
        <div className="border-r border-white/15 p-4"><dt className="font-mono text-[8px] font-black text-[#68757b]">PARTICLES</dt><dd className="mt-2 text-lg font-semibold text-[#24e0ff]">{config.particles}</dd></div>
        <div className="border-r border-white/15 p-4"><dt className="font-mono text-[8px] font-black text-[#68757b]">DPR CAP</dt><dd className="mt-2 text-lg font-semibold text-[#f4d431]">{config.dpr}</dd></div>
        <div className="p-4"><dt className="font-mono text-[8px] font-black text-[#68757b]">GLOW</dt><dd className="mt-2 text-lg font-semibold text-white">{config.glow}</dd></div>
      </dl>
    </div>
  );
}

export function InteractiveLab({ lab, locale }: { lab: CstdLab; locale: CstdLocale }) {
  if (lab.slug === "system-trace") return <SystemTraceLab locale={locale} />;
  if (lab.slug === "agent-replay") return <AgentReplayLab locale={locale} />;
  if (lab.slug === "data-lens") return <DataLensLab locale={locale} />;
  return <RenderLab locale={locale} />;
}
