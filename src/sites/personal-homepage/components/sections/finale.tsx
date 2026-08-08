"use client";

import Image from "next/image";
import { ArrowUp, RadioTower } from "lucide-react";
import { memo } from "react";

function Finale() {
  return (
    <footer
      id="cstd-footer"
      data-cstd-finale
      data-cstd-generated-visual="night-workstation-v1"
      className="group relative z-20 flex min-h-[92svh] items-end overflow-hidden border-t border-[#f4d431]/40 bg-[#050709] px-5 pb-12 pt-28 text-[#f2efe7] [content-visibility:auto] [contain-intrinsic-size:auto_900px] md:px-10 md:pb-16 lg:px-16"
    >
      <Image
        src="/cstd-universe/cstd-night-workstation-v1.webp"
        alt="原创 Night Runner 夜间工作台与透明数据屏幕"
        fill
        loading="lazy"
        sizes="100vw"
        className="object-cover object-[46%_center] opacity-70 saturate-[0.82] contrast-110 transition-[transform,filter] duration-700 group-hover:scale-[1.012] group-hover:saturate-100"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.96)_0%,rgba(5,7,9,0.68)_42%,rgba(5,7,9,0.16)_78%)]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,#050709_0%,rgba(5,7,9,0.38)_35%,transparent_72%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-2 bg-[repeating-linear-gradient(135deg,#f4d431_0_14px,#050709_14px_28px)]" />
      <div aria-hidden="true" className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(36,224,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(36,224,255,0.18)_1px,transparent_1px)] [background-size:88px_88px]" />

      <div className="relative mx-auto grid w-full max-w-[1540px] gap-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
        <div className="max-w-5xl">
          <p className="flex items-center gap-3 font-mono text-[10px] font-black uppercase text-[#3dff8f]">
            <RadioTower aria-hidden="true" className="h-4 w-4" />
            FINAL TRANSMISSION // SIGNAL REMAINS OPEN
          </p>
          <h2 className="mt-7 text-6xl font-black leading-[0.86] tracking-[0] md:text-8xl lg:text-[8.5rem]">
            STILL
            <span className="block text-[#f4d431]">BUILDING.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-xl font-semibold leading-8 text-[#dce3e5] md:text-2xl md:leading-9">
            把复杂问题持续编译成清楚、可靠、真正运行的系统。
          </p>
        </div>

        <div className="border-y border-[#24e0ff]/30 bg-[#050709]/72 px-5 py-6 font-mono backdrop-blur-md">
          <p className="text-[9px] font-black text-[#24e0ff]">CSTD-01 / OPEN CHANNEL</p>
          <a
            href="mailto:cstd@custard.top"
            className="mt-5 block text-lg font-black text-[#f2efe7] transition-colors hover:text-[#f4d431] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
          >
            cstd@custard.top
          </a>
          <p className="mt-3 text-[10px] leading-5 text-[#899398]">奶黄包个人技术工作室<br />2022-2026 / NIGHT SHIFT ACTIVE</p>
          <a
            href="#top"
            aria-label="返回页面顶部"
            className="mt-8 inline-flex h-11 w-11 items-center justify-center border border-[#f4d431]/55 text-[#f4d431] transition-colors hover:bg-[#f4d431] hover:text-[#050709] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
          >
            <ArrowUp aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export const MemoizedFinale = memo(Finale);
