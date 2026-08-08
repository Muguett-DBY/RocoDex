"use client";

import Image from "next/image";
import { Cpu, Fingerprint, Network, Radio } from "lucide-react";
import { memo } from "react";
import { cstdSystems } from "../../content/systems";

const operatorSignals = [
  { label: "Runtime", value: "INDEPENDENT", icon: Cpu, color: "#f4d431" },
  { label: "Identity", value: "CSTD-01", icon: Fingerprint, color: "#24e0ff" },
  { label: "Network", value: `${cstdSystems.length} SYSTEMS`, icon: Network, color: "#ff3b30" },
] as const;

function OperatorProfile() {
  return (
    <section
      id="operator"
      data-cstd-chapter="operator"
      data-cstd-generated-visual="night-runner-v1"
      aria-labelledby="operator-heading"
      className="group relative z-20 min-h-[96svh] overflow-hidden border-y border-[#24e0ff]/20 bg-[#050709] text-[#f2efe7] contain-paint [content-visibility:auto] [contain-intrinsic-size:auto_980px]"
    >
      <div className="absolute inset-0 lg:left-[35%]">
        <Image
          src="/cstd-persona/cstd-night-runner-v1.webp"
          alt="原创 Night Runner 角色站在夜间数据中心，佩戴透明数据面罩并手持终端"
          fill
          loading="lazy"
          unoptimized
          sizes="(min-width: 1024px) 65vw, 100vw"
          className="object-cover object-[67%_center] opacity-55 saturate-[0.82] contrast-110 transition-[filter,transform] duration-700 group-hover:saturate-100 group-hover:scale-[1.012] lg:opacity-90"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,#050709_0%,rgba(5,7,9,0.94)_18%,rgba(5,7,9,0.34)_55%,rgba(5,7,9,0.08)_100%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,#050709_0%,transparent_34%,rgba(5,7,9,0.2)_100%)]" />
        <span aria-hidden="true" className="cstd-persona-scan absolute inset-x-0 top-0 h-px bg-[#24e0ff]/70 shadow-[0_0_20px_rgba(36,224,255,0.75)]" />
      </div>

      <div aria-hidden="true" className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(36,224,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(36,224,255,0.16)_1px,transparent_1px)] [background-size:84px_84px]" />
      <div aria-hidden="true" className="absolute right-0 top-24 h-px w-[46vw] bg-[#ff3b30]/70" />
      <span aria-hidden="true" className="absolute right-5 top-20 hidden font-mono text-[9px] font-black text-[#ff5a50] lg:block">VISUAL ID / ORIGINAL ASSET 01</span>

      <div className="relative mx-auto flex min-h-[96svh] max-w-[1540px] flex-col justify-between px-5 pb-10 pt-24 md:px-10 md:pb-14 lg:px-16 lg:pb-16 lg:pt-28">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 font-mono text-[10px] font-black uppercase text-[#24e0ff]">
            <Radio aria-hidden="true" className="h-4 w-4" />
            03 // OPERATOR PROFILE
            <span aria-hidden="true" className="h-px w-16 bg-[#24e0ff]/50" />
            SIGNAL LOCKED
          </div>

          <p className="mt-10 font-mono text-xs font-black text-[#f4d431]">奶黄包 / CSTD-01 / NIGHT RUNNER</p>
          <h2 id="operator-heading" className="mt-5 max-w-3xl text-6xl font-black leading-[0.82] tracking-[0] md:text-8xl lg:text-[7.5rem]">
            BUILD AFTER
            <span className="block text-[#f4d431]">MIDNIGHT.</span>
          </h2>
          <p className="mt-8 max-w-xl text-xl font-semibold leading-8 text-[#d7dfe1] md:text-2xl md:leading-9">
            不扮演未来，只把今天复杂、模糊、分散的问题，编译成明天可以真正运行的产品。
          </p>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[#8f9ba0] md:text-base">
            独立完成产品界面、数据边界、AI 工作流与发布运维。视觉可以锋利，系统必须清楚，交付必须经得起真实使用。
          </p>
        </div>

        <div className="mt-20 grid max-w-4xl border-y border-white/15 bg-[#050709]/68 backdrop-blur-md sm:grid-cols-3">
          {operatorSignals.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex min-h-28 items-center gap-4 border-b border-white/15 px-5 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
              <Icon aria-hidden="true" className="h-5 w-5 flex-none" style={{ color }} />
              <div>
                <p className="font-mono text-[9px] font-bold uppercase text-[#68757b]">{label}</p>
                <p className="mt-1 font-mono text-sm font-black" style={{ color }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const MemoizedOperatorProfile = memo(OperatorProfile);
