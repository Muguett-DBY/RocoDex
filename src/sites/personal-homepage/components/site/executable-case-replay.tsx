"use client";

import { ArrowRight, Cpu, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CstdCaseReplay } from "../../content/case-replays";
import type { CstdLocale } from "../../content/content-types";

type ReplayResult = {
  verdict: string;
  metric: string;
  before: Record<string, number>;
  after: Record<string, number>;
  steps: [string, string][];
};

export function ExecutableCaseReplay({ replay, locale, compact = false }: { replay: CstdCaseReplay; locale: CstdLocale; compact?: boolean }) {
  const [input, setInput] = useState(replay.inputDefault);
  const [result, setResult] = useState<ReplayResult | null>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [workerReady, setWorkerReady] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker("/cstd-case-worker.js");
    workerRef.current = worker;
    const readinessFrame = window.requestAnimationFrame(() => setWorkerReady(true));
    worker.addEventListener("message", (event: MessageEvent<{ result?: ReplayResult }>) => {
      if (!event.data.result) return;
      setResult(event.data.result);
      setActiveStep(0);
      setRunning(true);
    });
    return () => {
      window.cancelAnimationFrame(readinessFrame);
      worker.terminate();
    };
  }, []);

  useEffect(() => {
    if (!running || !result) return;
    const timer = window.setInterval(() => {
      setActiveStep((current) => {
        if (current >= result.steps.length - 1) {
          setRunning(false);
          return current;
        }
        return current + 1;
      });
    }, 520);
    return () => window.clearInterval(timer);
  }, [result, running]);

  function run() {
    setResult(null);
    setActiveStep(-1);
    workerRef.current?.postMessage({ requestId: crypto.randomUUID(), scenario: replay.id, input });
    window.dispatchEvent(new CustomEvent("cstd:metric", { detail: { name: "case_replay", value: input } }));
  }

  function reset() {
    setResult(null);
    setActiveStep(-1);
    setRunning(false);
    setInput(replay.inputDefault);
  }

  const copy = locale === "zh" ? { run: "运行重放", reset: "重置", before: "未约束", after: "边界生效", worker: "DEDICATED WEB WORKER" } : { run: "Run replay", reset: "Reset", before: "Unconstrained", after: "Boundary active", worker: "DEDICATED WEB WORKER" };

  return (
    <div data-cstd-case-replay={replay.id} data-cstd-worker="dedicated" data-cstd-worker-ready={workerReady ? "true" : "false"} className={compact ? "border-y border-white/15 py-6" : "border border-white/15 bg-[#07090b]/92 p-5 md:p-7"}>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 font-mono text-[8px] font-black text-[#24e0ff]"><Cpu aria-hidden="true" className="h-4 w-4" /> {copy.worker}</p>
          <h3 className="mt-3 text-2xl font-semibold text-white md:text-3xl">{replay.title[locale]}</h3>
          <p className="mt-3 text-sm leading-7 text-[#aab3b6]">{replay.thesis[locale]}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={run} disabled={!workerReady} className="inline-flex h-10 items-center gap-2 bg-[#f4d431] px-4 font-mono text-[10px] font-black text-black hover:bg-[#24e0ff] disabled:cursor-wait disabled:bg-[#485054] disabled:text-[#d7dfdc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#f4d431]"><Play aria-hidden="true" className="h-3.5 w-3.5" /> {copy.run}</button>
          <button type="button" onClick={reset} aria-label={copy.reset} title={copy.reset} className="flex h-10 w-10 items-center justify-center border border-white/20 text-[#9aa4a8] hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"><RotateCcw aria-hidden="true" className="h-4 w-4" /></button>
        </div>
      </div>

      <label className="mt-7 block font-mono text-[9px] font-black text-[#7b878c]" htmlFor={`replay-${replay.id}-input`}>
        {replay.inputLabel[locale]} / <span className="text-[#f4d431]">{input}{replay.unit[locale]}</span>
      </label>
      <input id={`replay-${replay.id}-input`} type="range" min={replay.inputMin} max={replay.inputMax} step={replay.inputStep} value={input} onChange={(event) => setInput(Number(event.target.value))} className="mt-3 h-1 w-full accent-[#f4d431]" />

      {result ? (
        <div className="mt-7" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[#3dff8f]/30 py-4 font-mono text-[9px] font-black">
            <span className="text-[#3dff8f]">{result.verdict}</span>
            <span className="text-white">{result.metric}</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[[copy.before, result.before], [copy.after, result.after]].map(([label, values]) => (
              <div key={String(label)} className="border-l-2 border-white/20 bg-white/[0.035] px-4 py-4">
                <p className="font-mono text-[8px] font-black text-[#718087]">{String(label).toUpperCase()}</p>
                <p className="mt-3 font-mono text-xs leading-6 text-[#dce1e2]">{Object.entries(values as Record<string, number>).map(([key, value]) => `${key}=${value}`).join(" / ")}</p>
              </div>
            ))}
          </div>
          <ol className="mt-5 grid gap-2 lg:grid-cols-5">
            {result.steps.map(([label, detail], index) => (
              <li key={label} data-cstd-replay-step-active={index <= activeStep ? "true" : "false"} className="min-h-28 border border-white/12 p-3 opacity-35 transition-[opacity,border-color,transform] data-[cstd-replay-step-active=true]:-translate-y-1 data-[cstd-replay-step-active=true]:border-[#24e0ff]/55 data-[cstd-replay-step-active=true]:opacity-100">
                <p className="font-mono text-[8px] font-black text-[#24e0ff]">0{index + 1} / {label}</p>
                <p className="mt-2 text-[11px] leading-5 text-[#aeb7ba]">{detail}</p>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="mt-7 flex items-center gap-3 border-y border-white/10 py-5 font-mono text-[9px] font-black text-[#9aa6aa]"><ArrowRight aria-hidden="true" className="h-4 w-4" /> INPUT READY / WORKER IDLE</div>
      )}
    </div>
  );
}
