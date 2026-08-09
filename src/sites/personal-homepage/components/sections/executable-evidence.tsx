"use client";

import { ArrowUpRight, FlaskConical } from "lucide-react";
import { memo, useState } from "react";
import { cstdCaseReplays } from "../../content/case-replays";
import { CstdLink } from "../site/cstd-link";
import { ExecutableCaseReplay } from "../site/executable-case-replay";

function ExecutableEvidence() {
  const [selected, setSelected] = useState(cstdCaseReplays[0].id);
  const replay = cstdCaseReplays.find((entry) => entry.id === selected) ?? cstdCaseReplays[0];

  return (
    <section id="operator" data-cstd-chapter="operator" data-cstd-scene="operator" data-cstd-executable-evidence aria-labelledby="executable-evidence-heading" className="relative z-20 border-b border-[#ff3b30]/30 bg-[#050709]/88 px-5 py-24 text-[#f2efe7] md:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto grid max-w-[1540px] gap-12 xl:grid-cols-[minmax(20rem,0.68fr)_minmax(0,1.32fr)] xl:items-start xl:gap-20">
        <div className="xl:sticky xl:top-28">
          <p className="flex items-center gap-3 font-mono text-[10px] font-black text-[#ff5a50]"><FlaskConical aria-hidden="true" className="h-4 w-4" /> 03 / EXECUTABLE EVIDENCE</p>
          <h2 id="executable-evidence-heading" className="mt-6 text-5xl font-semibold leading-[0.92] md:text-7xl">案例不只可读，<span className="text-[#f4d431]">还可以运行。</span></h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#aeb7ba]">三个重放只演示真实的核心边界：异步版本、缓存编解码与双域名所有权。计算在独立 Worker 中进行，结果可重复，不伪造日志。</p>
          <div className="mt-8 border-t border-white/15">
            {cstdCaseReplays.map((entry, index) => (
              <button key={entry.id} type="button" data-cstd-replay-option={entry.id} aria-pressed={entry.id === replay.id} onClick={() => setSelected(entry.id)} className="grid w-full grid-cols-[2rem_1fr_auto] items-center gap-3 border-b border-white/15 py-4 text-left text-[#9da8ac] transition-colors hover:text-white aria-pressed:text-[#f4d431] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#f4d431]">
                <span className="font-mono text-[9px] font-black">0{index + 1}</span>
                <span className="text-sm font-semibold">{entry.title.zh}</span>
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </button>
            ))}
          </div>
          <CstdLink href={replay.sourceHref.zh} className="mt-6 inline-flex items-center gap-2 font-mono text-[9px] font-black text-[#24e0ff] hover:text-white">查看完整技术案例 <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></CstdLink>
        </div>

        <ExecutableCaseReplay key={replay.id} replay={replay} locale="zh" />
      </div>
    </section>
  );
}

export const MemoizedExecutableEvidence = memo(ExecutableEvidence);
