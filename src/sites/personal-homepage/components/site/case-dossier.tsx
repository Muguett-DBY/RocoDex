"use client";

import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  GitCompareArrows,
  Network,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import type { CstdCaseDossier } from "../../content/case-dossiers";
import type { CstdLocale } from "../../content/content-types";
import { getFailureDrillProgress, getNextFailureDrillPhase, type CstdFailureDrillPhase } from "../../domain/failure-drill";
import { CstdLink } from "./cstd-link";

type DossierView = "architecture" | "decisions" | "failures";

const viewMeta = {
  architecture: { icon: Network, zh: "架构流", en: "Architecture" },
  decisions: { icon: GitCompareArrows, zh: "关键取舍", en: "Tradeoffs" },
  failures: { icon: ShieldAlert, zh: "故障隔离", en: "Failure containment" },
} as const;

export function CstdCaseDossierView({ dossier, locale }: { dossier: CstdCaseDossier; locale: CstdLocale }) {
  const [view, setView] = useState<DossierView>("architecture");
  const [selectedNode, setSelectedNode] = useState(dossier.architecture[0].id);
  const [selectedDecision, setSelectedDecision] = useState(dossier.decisions[0].id);
  const [selectedFailure, setSelectedFailure] = useState(dossier.failureModes[0].id);
  const [drillPhase, setDrillPhase] = useState<CstdFailureDrillPhase>("idle");
  const node = dossier.architecture.find((entry) => entry.id === selectedNode) ?? dossier.architecture[0];
  const decision = dossier.decisions.find((entry) => entry.id === selectedDecision) ?? dossier.decisions[0];
  const failure = dossier.failureModes.find((entry) => entry.id === selectedFailure) ?? dossier.failureModes[0];
  const copy = locale === "zh" ? {
    eyebrow: "SYSTEM DOSSIER / 系统档案",
    title: "把架构决定与失败边界放到台前。",
    selected: "当前节点",
    chosen: "选择",
    rejected: "放弃",
    rationale: "为什么",
    trigger: "触发",
    containment: "隔离",
    outcome: "可见结果",
    proof: "打开关联证据",
    drill: "执行故障注入",
    rerun: "重新执行",
    drillIdle: "选择故障后执行一次完整隔离演练。",
    drillRunning: "系统正在沿真实失败边界传播信号。",
    drillComplete: "隔离完成，公开表面保持可解释状态。",
  } : {
    eyebrow: "SYSTEM DOSSIER / ENGINEERING RECORD",
    title: "Architecture decisions and failure boundaries, brought to the foreground.",
    selected: "Selected node",
    chosen: "Chosen",
    rejected: "Rejected",
    rationale: "Why",
    trigger: "Trigger",
    containment: "Containment",
    outcome: "Visible outcome",
    proof: "Open linked evidence",
    drill: "Inject failure",
    rerun: "Run again",
    drillIdle: "Select a failure and run the complete containment drill.",
    drillRunning: "The signal is moving through the real failure boundary.",
    drillComplete: "Containment complete; the public surface remains explainable.",
  };
  const architectureIndex = dossier.architecture.findIndex((entry) => entry.id === node.id);

  useEffect(() => {
    if (drillPhase === "idle" || drillPhase === "outcome") return;
    const timer = window.setTimeout(() => setDrillPhase((current) => getNextFailureDrillPhase(current)), 760);
    return () => window.clearTimeout(timer);
  }, [drillPhase]);

  function selectFailure(id: string) {
    setSelectedFailure(id);
    setDrillPhase("idle");
  }

  function runFailureDrill() {
    setDrillPhase("trigger");
    window.dispatchEvent(new CustomEvent("cstd:metric", { detail: { name: "case_failure_drill", value: 1 } }));
  }

  return (
    <section
      id="system-dossier"
      data-cstd-case-dossier={dossier.caseSlug}
      data-cstd-case-dossier-view={view}
      className="relative overflow-hidden border-b border-[#24e0ff]/25 bg-[#050709] px-5 py-20 text-[#f2efe7] md:px-10 lg:px-16 lg:py-28"
      aria-labelledby={`case-dossier-${dossier.caseSlug}`}
    >
      <Image
        src="/cstd-universe/cstd-case-blueprint-v3.webp"
        alt={locale === "zh" ? "拆解为边界、状态与证据层的系统蓝图" : "An exploded system blueprint split into boundary, state, and proof layers"}
        fill
        sizes="100vw"
        className="object-cover object-[62%_50%] opacity-45"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.99)_0%,rgba(5,7,9,0.91)_48%,rgba(5,7,9,0.4)_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,7,9,0.97),transparent_54%,rgba(5,7,9,0.7))]" />

      <div className="relative mx-auto max-w-[1320px]">
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-end">
          <div>
            <p className="font-mono text-[9px] font-black" style={{ color: dossier.accent }}>{copy.eyebrow}</p>
            <h2 id={`case-dossier-${dossier.caseSlug}`} className="mt-5 max-w-4xl text-4xl font-semibold leading-[0.95] md:text-6xl">{copy.title}</h2>
          </div>
          <p className="border-l border-white/20 pl-5 text-base leading-8 text-[#b5bec1]">{dossier.thesis[locale]}</p>
        </header>

        <div className="mt-12 border-y border-white/15 bg-[#050709]/75 backdrop-blur-lg">
          <div role="tablist" aria-label={locale === "zh" ? "系统档案视图" : "System dossier views"} className="grid border-b border-white/15 sm:grid-cols-3">
            {(Object.keys(viewMeta) as DossierView[]).map((value) => {
              const meta = viewMeta[value];
              const Icon = meta.icon;
              return (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={view === value}
                  data-cstd-dossier-tab={value}
                  onClick={() => setView(value)}
                  className="flex min-h-14 items-center justify-between gap-4 border-b border-white/15 px-4 font-mono text-[9px] font-black text-[#8f9a9e] transition-[background-color,color] last:border-b-0 hover:text-white aria-selected:bg-[#f4d431] aria-selected:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#24e0ff] sm:border-b-0 sm:border-r sm:last:border-r-0"
                >
                  <span>{locale === "zh" ? meta.zh : meta.en}</span><Icon aria-hidden="true" className="h-4 w-4" />
                </button>
              );
            })}
          </div>

          {view === "architecture" ? (
            <div role="tabpanel" data-cstd-dossier-panel="architecture" className="grid xl:grid-cols-[20rem_minmax(0,1fr)]">
              <div className="border-b border-white/15 xl:border-b-0 xl:border-r">
                {dossier.architecture.map((entry, index) => (
                  <button
                    key={entry.id}
                    type="button"
                    aria-pressed={entry.id === node.id}
                    onClick={() => setSelectedNode(entry.id)}
                    className="grid min-h-20 w-full grid-cols-[2.25rem_1fr] gap-3 border-b border-white/15 px-4 py-4 text-left text-[#929da1] hover:bg-white/7 hover:text-white aria-pressed:bg-[#0b171b] aria-pressed:text-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#24e0ff]"
                  >
                    <span className="font-mono text-[8px] font-black">0{index + 1}</span>
                    <span><span className="block font-mono text-[7px] font-black opacity-60">{entry.type.toUpperCase()}</span><span className="mt-2 block text-sm font-semibold">{entry.title[locale]}</span></span>
                  </button>
                ))}
              </div>
              <div className="p-5 md:p-8 lg:p-10">
                <p className="font-mono text-[9px] font-black" style={{ color: dossier.accent }}>{copy.selected.toUpperCase()} / {node.type.toUpperCase()}</p>
                <h3 className="mt-5 text-3xl font-semibold text-white md:text-5xl">{node.title[locale]}</h3>
                <p className="mt-5 max-w-3xl text-base leading-8 text-[#c0c8cb]">{node.detail[locale]}</p>
                <ol className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" aria-label={locale === "zh" ? "架构节点路径" : "Architecture node path"}>
                  {dossier.architecture.map((entry, index) => (
                    <li key={entry.id} className="relative min-h-24 border-t border-white/15 pt-4">
                      <span className={clsx("absolute left-0 top-[-2px] h-[3px] transition-[width,background-color]", index <= architectureIndex ? "w-full bg-[#24e0ff]" : "w-0 bg-white/20")} />
                      <button type="button" onClick={() => setSelectedNode(entry.id)} className="w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#24e0ff]">
                        <span className="font-mono text-[7px] font-black text-[#708086]">0{index + 1} / {entry.type.toUpperCase()}</span>
                        <span className="mt-3 block text-sm font-semibold text-[#d9dfe1]">{entry.title[locale]}</span>
                      </button>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[8px] font-black text-[#7f8c90]">
                  {dossier.flows.map((flow) => <span key={`${flow.from}-${flow.to}`} className="inline-flex items-center gap-2">{flow.label[locale]} <ArrowRight aria-hidden="true" className="h-3 w-3 text-[#f4d431]" /></span>)}
                </div>
              </div>
            </div>
          ) : null}

          {view === "decisions" ? (
            <div role="tabpanel" data-cstd-dossier-panel="decisions" className="grid xl:grid-cols-[22rem_minmax(0,1fr)]">
              <div className="border-b border-white/15 xl:border-b-0 xl:border-r">
                {dossier.decisions.map((entry, index) => (
                  <button key={entry.id} type="button" aria-pressed={entry.id === decision.id} onClick={() => setSelectedDecision(entry.id)} className="grid min-h-24 w-full grid-cols-[2.25rem_1fr] gap-3 border-b border-white/15 px-4 py-5 text-left text-[#929da1] hover:bg-white/7 hover:text-white aria-pressed:bg-[#17150a] aria-pressed:text-[#f4d431] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#f4d431]">
                    <span className="font-mono text-[8px] font-black">0{index + 1}</span><span className="text-sm font-semibold leading-6">{entry.question[locale]}</span>
                  </button>
                ))}
              </div>
              <div className="p-5 md:p-8 lg:p-10">
                <p className="font-mono text-[9px] font-black text-[#f4d431]">DECISION RECORD / {decision.id.toUpperCase()}</p>
                <h3 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight text-white md:text-5xl">{decision.question[locale]}</h3>
                <div className="mt-8 grid gap-px bg-white/12 md:grid-cols-2">
                  <div className="bg-[#08100d] p-5"><p className="flex items-center gap-2 font-mono text-[8px] font-black text-[#3dff8f]"><CheckCircle2 aria-hidden="true" className="h-4 w-4" /> {copy.chosen.toUpperCase()}</p><p className="mt-4 text-lg font-semibold leading-7 text-white">{decision.chosen[locale]}</p></div>
                  <div className="bg-[#11090a] p-5"><p className="flex items-center gap-2 font-mono text-[8px] font-black text-[#ff5a50]"><XCircle aria-hidden="true" className="h-4 w-4" /> {copy.rejected.toUpperCase()}</p><p className="mt-4 text-lg font-semibold leading-7 text-white">{decision.rejected[locale]}</p></div>
                </div>
                <p className="mt-8 font-mono text-[8px] font-black text-[#829095]">{copy.rationale.toUpperCase()}</p>
                <p className="mt-3 max-w-3xl text-base leading-8 text-[#c0c8cb]">{decision.rationale[locale]}</p>
                <CstdLink href={decision.proofHref[locale]} className="mt-7 inline-flex items-center gap-2 border-b border-[#24e0ff]/55 pb-1 font-mono text-[9px] font-black text-[#24e0ff] hover:text-white">{copy.proof} <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></CstdLink>
              </div>
            </div>
          ) : null}

          {view === "failures" ? (
            <div role="tabpanel" data-cstd-dossier-panel="failures" className="grid xl:grid-cols-[22rem_minmax(0,1fr)]">
              <div className="border-b border-white/15 xl:border-b-0 xl:border-r">
                {dossier.failureModes.map((entry, index) => (
                  <button key={entry.id} type="button" aria-pressed={entry.id === failure.id} onClick={() => selectFailure(entry.id)} className="grid min-h-24 w-full grid-cols-[2.25rem_1fr] gap-3 border-b border-white/15 px-4 py-5 text-left text-[#929da1] hover:bg-white/7 hover:text-white aria-pressed:bg-[#17090a] aria-pressed:text-[#ff5a50] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#ff5a50]">
                    <span className="font-mono text-[8px] font-black">0{index + 1}</span><span className="text-sm font-semibold leading-6">{entry.trigger[locale]}</span>
                  </button>
                ))}
              </div>
              <div className="p-5 md:p-8 lg:p-10" data-cstd-failure-drill data-cstd-failure-drill-phase={drillPhase}>
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <p className="font-mono text-[9px] font-black text-[#ff5a50]">FAILURE ENVELOPE / {failure.id.toUpperCase()}</p>
                    <p aria-live="polite" className="mt-3 max-w-xl text-sm leading-6 text-[#9da8ac]">
                      {drillPhase === "idle" ? copy.drillIdle : drillPhase === "outcome" ? copy.drillComplete : copy.drillRunning}
                    </p>
                  </div>
                  <button type="button" onClick={runFailureDrill} className="inline-flex h-11 items-center gap-3 border border-[#ff5a50]/60 bg-[#18090a] px-4 font-mono text-[9px] font-black text-[#ff6a60] transition-colors hover:bg-[#ff5a50] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#ff5a50]">
                    {drillPhase === "idle" ? <Play aria-hidden="true" className="h-4 w-4" /> : <RotateCcw aria-hidden="true" className="h-4 w-4" />}
                    {drillPhase === "idle" ? copy.drill : copy.rerun}
                  </button>
                </div>
                <div aria-hidden="true" className="mt-7 h-1 overflow-hidden bg-white/12"><span className="block h-full origin-left bg-[linear-gradient(90deg,#ff5a50,#f4d431_55%,#3dff8f)] transition-transform duration-500" style={{ transform: `scaleX(${getFailureDrillProgress(drillPhase)})` }} /></div>
                <div className="mt-8 grid gap-px bg-white/12 lg:grid-cols-3">
                  {([
                    ["trigger", copy.trigger, failure.trigger[locale], "text-[#ff5a50]"],
                    ["containment", copy.containment, failure.containment[locale], "text-[#f4d431]"],
                    ["outcome", copy.outcome, failure.visibleOutcome[locale], "text-[#3dff8f]"],
                  ] as const).map(([phase, label, value, color], index) => {
                    const visible = getFailureDrillProgress(drillPhase) >= (index + 1) / 3;
                    return (
                      <div key={label} data-cstd-failure-step={phase} data-cstd-failure-step-active={visible ? "true" : "false"} className={clsx("relative min-h-44 bg-[#07090b] p-5 transition-[background-color,opacity] duration-500", visible ? "opacity-100" : "opacity-45")}>
                        <p className={clsx("flex items-center gap-2 font-mono text-[8px] font-black", color)}>{visible && phase === "outcome" ? <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" /> : null}{label.toUpperCase()}</p>
                        <p className="mt-5 text-base font-semibold leading-8 text-white">{value}</p>
                      </div>
                    );
                  })}
                </div>
                <CstdLink href={failure.proofHref[locale]} className="mt-7 inline-flex items-center gap-2 border-b border-[#24e0ff]/55 pb-1 font-mono text-[9px] font-black text-[#24e0ff] hover:text-white">{copy.proof} <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></CstdLink>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
