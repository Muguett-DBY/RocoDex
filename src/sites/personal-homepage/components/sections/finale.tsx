"use client";

import { ArrowUp, ArrowUpRight, RadioTower } from "lucide-react";
import { memo } from "react";
import { getCstdNarrative, getCstdNarrativeSharePath, type CstdNarrativeMode } from "../../content/narratives";
import { CstdLink } from "../site/cstd-link";

const finalNodes = [
  { code: "PRODUCT", color: "#f4d431" },
  { code: "AGENT", color: "#24e0ff" },
  { code: "DATA", color: "#e8edf0" },
  { code: "EDGE", color: "#ff3b30" },
  { code: "RESEARCH", color: "#3dff8f" },
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
      className="relative z-20 min-h-svh border-t border-[#f4d431]/40 text-[#f2efe7] lg:h-[155svh]"
    >
      <div className="relative flex min-h-svh items-end overflow-hidden px-5 pb-12 pt-28 md:px-10 md:pb-16 lg:sticky lg:top-0 lg:px-16">
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.97)_0%,rgba(5,7,9,0.72)_42%,rgba(5,7,9,0.14)_82%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,#050709_0%,rgba(5,7,9,0.28)_38%,transparent_76%)]" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-2 bg-[repeating-linear-gradient(135deg,#f4d431_0_14px,#050709_14px_28px)]" />

        <div className="relative mx-auto grid w-full max-w-[1540px] gap-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div className="max-w-6xl">
            <p className="flex items-center gap-3 font-mono text-[10px] font-black uppercase text-[#3dff8f]">
              <RadioTower aria-hidden="true" className="h-4 w-4" />
              FINAL TRANSMISSION / CITY NETWORK ONLINE
            </p>
            <p className="cstd-finale-cstd mt-8 font-mono text-[5rem] font-black leading-[0.78] text-[#24e0ff] md:text-[8rem] lg:text-[10rem]">CSTD</p>
            <h2 className="cstd-finale-title mt-3 text-6xl font-black leading-[0.84] tracking-[0] md:text-8xl lg:text-[8.5rem]">
              STILL
              <span className="block text-[#f4d431]">BUILDING.</span>
            </h2>
            <p className="mt-8 max-w-2xl text-xl font-semibold leading-8 text-[#dce3e5] md:text-2xl md:leading-9">
              {collaboration.brief} 这座城市不会在这一屏结束，每条能力仍在继续向前连接。
            </p>
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 font-mono text-[9px] font-black">
              {finalNodes.map((node) => (
                <span key={node.code} className="flex items-center gap-2" style={{ color: node.color }}>
                  <span className="cstd-final-node h-1.5 w-1.5 bg-current shadow-[0_0_12px_currentColor]" />
                  {node.code} / ONLINE
                </span>
              ))}
            </div>
          </div>

          <div className="border-y border-[#24e0ff]/35 bg-[#050709]/76 px-5 py-6 font-mono backdrop-blur-md">
            <p className="text-[9px] font-black text-[#24e0ff]">CSTD-01 / {collaboration.signal}</p>
            <p className="mt-4 text-sm leading-6 text-[#b1bbbe]">当前观看路径：<span className="text-[#f4d431]">{narrative.label.zh}</span></p>
            <a
              href={`mailto:cstd@custard.top?subject=${encodeURIComponent(`CSTD / ${collaboration.signal}`)}`}
              className="mt-5 block text-lg font-black text-[#f2efe7] transition-colors hover:text-[#f4d431] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
            >
              cstd@custard.top
            </a>
            <p className="mt-3 text-[10px] leading-5 text-[#899398]">奶黄包个人技术工作室<br />NIGHT SHIFT / SIGNAL OPEN</p>
            <CstdLink href={getCstdNarrativeSharePath(narrativeMode)} className="mt-6 inline-flex items-center gap-2 border-b border-[#24e0ff]/55 pb-1 text-[9px] font-black text-[#24e0ff] hover:text-white">
              分享这条观看路径 <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </CstdLink>
            <a
              href="#top"
              aria-label="返回页面顶部"
              className="mt-8 inline-flex h-11 w-11 items-center justify-center border border-[#f4d431]/55 text-[#f4d431] transition-colors hover:bg-[#f4d431] hover:text-[#050709] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
            >
              <ArrowUp aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const MemoizedFinale = memo(Finale);
