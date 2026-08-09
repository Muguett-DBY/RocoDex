"use client";

import { ArrowUp, ArrowUpRight, RadioTower } from "lucide-react";
import { memo } from "react";
import { getCstdNarrative, getCstdNarrativeSharePath, type CstdNarrativeMode } from "../../content/narratives";
import { CstdLink } from "../site/cstd-link";

const finalNodes = [
  { code: "PRODUCT", color: "#f4d431" },
  { code: "AGENT", color: "#24e0ff" },
  { code: "DATA", color: "#e8edf0" },
  { code: "EDGE", color: "#899499" },
  { code: "RESEARCH", color: "#b9c2c5" },
] as const;

const collaborationCopy = {
  builder: {
    brief: "适合一起拆边界、写实现、做发布验收。",
    signal: "SYSTEM DELIVERY",
  },
  researcher: {
    brief: "适合一起把数据、假设、模型与证据链做扎实。",
    signal: "RESEARCH SYSTEM",
  },
  collaborator: {
    brief: "适合从真实目标出发，把产品价值一路交付到线上。",
    signal: "PRODUCT COLLABORATION",
  },
} as const;

function Finale({ narrativeMode }: { narrativeMode: CstdNarrativeMode }) {
  const narrative = getCstdNarrative(narrativeMode);
  const collaboration = collaborationCopy[narrativeMode];
  return (
    <footer
      id="cstd-footer"
      data-cstd-finale
      data-cstd-scene="finale"
      data-cstd-generated-visual="departure-city-v1"
      className="relative z-20 min-h-[76svh] border-t border-[#f4d431]/30 text-[#f2efe7]"
    >
      <div className="relative flex min-h-[76svh] items-end overflow-hidden px-5 pb-12 pt-28 md:px-10 md:pb-16 lg:px-16">
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.98)_0%,rgba(5,7,9,0.8)_48%,rgba(5,7,9,0.22)_88%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,#050709_0%,rgba(5,7,9,0.28)_38%,transparent_76%)]" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-[#f4d431]/60" />

        <div className="relative mx-auto grid w-full max-w-[1320px] gap-12 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-end lg:gap-20">
          <div className="max-w-6xl">
            <p className="flex items-center gap-3 font-mono text-[10px] font-black uppercase text-[#24e0ff]">
              <RadioTower aria-hidden="true" className="h-4 w-4" />
              06 / FINAL TRANSMISSION
            </p>
            <h2 className="cstd-finale-title mt-8 text-5xl font-black leading-[0.9] tracking-[0] md:text-7xl lg:text-[6.5rem]">
              STILL
              <span className="block text-[#f4d431]">BUILDING.</span>
            </h2>
            <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-[#cbd3d5] md:text-xl md:leading-9">
              {collaboration.brief} 每条能力仍在继续向前连接。
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[8px] font-black">
              {finalNodes.map((node) => (
                <span key={node.code} className="flex items-center gap-2" style={{ color: node.color }}>
                  <span className="cstd-final-node h-1 w-1 bg-current" />
                  {node.code}
                </span>
              ))}
            </div>
          </div>

          <div className="border-l border-white/15 pl-6 font-mono md:pl-8">
            <p className="text-[9px] font-black text-[#24e0ff]">{collaboration.signal}</p>
            <p className="mt-4 text-xs leading-6 text-[#929da1]">当前观看路径：<span className="text-[#f4d431]">{narrative.label.zh}</span></p>
            <a
              href={`mailto:cstd@custard.top?subject=${encodeURIComponent(`CSTD / ${collaboration.signal}`)}`}
              className="mt-5 block text-base font-black text-[#f2efe7] transition-colors hover:text-[#f4d431] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
            >
              cstd@custard.top
            </a>
            <p className="mt-3 text-[9px] leading-5 text-[#717c80]">奶黄包个人技术工作室 / SYDNEY</p>
            <div className="mt-7 flex items-center gap-5">
              <CstdLink href={getCstdNarrativeSharePath(narrativeMode)} aria-label="分享这条观看路径" className="inline-flex h-10 w-10 items-center justify-center border border-[#24e0ff]/35 text-[#24e0ff] hover:bg-[#24e0ff] hover:text-[#050709]">
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </CstdLink>
              <a
                href="#top"
                aria-label="返回页面顶部"
                className="inline-flex h-10 w-10 items-center justify-center border border-[#f4d431]/45 text-[#f4d431] transition-colors hover:bg-[#f4d431] hover:text-[#050709] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
              >
                <ArrowUp aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const MemoizedFinale = memo(Finale);
