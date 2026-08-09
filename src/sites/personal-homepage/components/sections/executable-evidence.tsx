"use client";

import { ArrowUpRight, FlaskConical } from "lucide-react";
import { memo } from "react";
import { cstdCaseReplays } from "../../content/case-replays";
import { CstdLink } from "../site/cstd-link";
import { ExecutableCaseReplay } from "../site/executable-case-replay";

function ExecutableEvidence() {
  const replay = cstdCaseReplays[0];

  return (
    <section data-cstd-chapter="operator" data-cstd-scene="operator" data-cstd-executable-evidence data-cstd-home-replay={replay.id} aria-labelledby="executable-evidence-heading" className="relative z-20 border-b border-[#ff3b30]/25 bg-[#050709] px-5 py-20 text-[#f2efe7] md:px-10 lg:px-16 lg:py-24">
      <div className="mx-auto grid max-w-[1440px] gap-10 xl:grid-cols-[minmax(20rem,0.72fr)_minmax(0,1.28fr)] xl:items-start xl:gap-16">
        <div>
          <p className="flex items-center gap-3 font-mono text-[10px] font-black text-[#ff5a50]"><FlaskConical aria-hidden="true" className="h-4 w-4" /> 04 / EXECUTABLE EVIDENCE</p>
          <h2 id="executable-evidence-heading" className="mt-5 text-4xl font-semibold leading-[0.96] md:text-6xl">案例不只可读，<span className="block text-[#f4d431]">还可以运行。</span></h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#aeb7ba]">用一个真实边界演示我的工程方式：输入明确、计算隔离、结果可复现。首页保留一个值得操作的互动，其余细节进入完整案例。</p>
          <div className="mt-6 flex flex-wrap gap-6">
            <CstdLink href={replay.sourceHref.zh} className="inline-flex items-center gap-2 font-mono text-[10px] font-black text-[#24e0ff] hover:text-white">查看完整技术案例 <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></CstdLink>
            <CstdLink href="/lab/proof-museum" className="inline-flex items-center gap-2 font-mono text-[10px] font-black text-[#f4d431] hover:text-white">进入证据博物馆 <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></CstdLink>
          </div>
        </div>

        <ExecutableCaseReplay key={replay.id} replay={replay} locale="zh" />
      </div>
    </section>
  );
}

export const MemoizedExecutableEvidence = memo(ExecutableEvidence);
