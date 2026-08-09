"use client";

import { ArrowUpRight, Boxes, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { cstdCaseReplays } from "../../content/case-replays";
import type { CstdLocale } from "../../content/content-types";
import { ExecutableCaseReplay } from "../site/executable-case-replay";
import { CstdLink } from "../site/cstd-link";

export function ProofMuseumLab({ locale }: { locale: CstdLocale }) {
  const [selectedId, setSelectedId] = useState(cstdCaseReplays[0].id);
  const selected = cstdCaseReplays.find((replay) => replay.id === selectedId) ?? cstdCaseReplays[0];
  const copy = locale === "zh" ? {
    title: "四座胶囊，共用一条可重复执行的证据协议。",
    summary: "选择一个真实工程边界，改变输入，再让独立 Worker 重放前后状态。输出来自确定性函数，不请求生产数据，也不伪造终端日志。",
    source: "打开完整案例",
  } : {
    title: "Four capsules, one repeatable evidence protocol.",
    summary: "Choose a real engineering boundary, change its input, and let a dedicated Worker replay the before-and-after state. Outputs are deterministic, use no production data, and fabricate no terminal logs.",
    source: "Open full case",
  };

  return (
    <div data-cstd-proof-museum data-cstd-capsules={cstdCaseReplays.length}>
      <div className="grid gap-8 border-b border-white/15 pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.6fr)] lg:items-end">
        <div>
          <p className="flex items-center gap-3 font-mono text-[9px] font-black text-[#24e0ff]"><Boxes aria-hidden="true" className="h-4 w-4" /> PROOF CAPSULES / 04</p>
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight text-white md:text-5xl">{copy.title}</h2>
        </div>
        <p className="text-sm leading-7 text-[#9da8ac]">{copy.summary}</p>
      </div>

      <div className="mt-8 grid gap-px bg-white/15 md:grid-cols-2 xl:grid-cols-4" role="tablist" aria-label={locale === "zh" ? "证据胶囊" : "Proof capsules"}>
        {cstdCaseReplays.map((replay, index) => (
          <button
            key={replay.id}
            type="button"
            role="tab"
            aria-selected={replay.id === selected.id}
            onClick={() => setSelectedId(replay.id)}
            className="min-h-32 bg-[#07090b] p-4 text-left text-[#9aa5a9] transition-colors hover:bg-white/5 hover:text-white aria-selected:bg-[#f4d431] aria-selected:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#24e0ff]"
          >
            <span className="flex items-center justify-between font-mono text-[8px] font-black"><span>CAPSULE {String(index + 1).padStart(2, "0")}</span><ShieldCheck aria-hidden="true" className="h-4 w-4" /></span>
            <span className="mt-5 block text-base font-semibold">{replay.title[locale]}</span>
          </button>
        ))}
      </div>

      <div className="mt-8" role="tabpanel">
        <ExecutableCaseReplay key={selected.id} replay={selected} locale={locale} compact />
      </div>
      <CstdLink href={selected.sourceHref[locale]} className="mt-7 inline-flex items-center gap-3 border-b border-[#f4d431] pb-2 font-mono text-[9px] font-black text-[#f4d431] hover:text-white">
        {copy.source} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
      </CstdLink>
    </div>
  );
}
