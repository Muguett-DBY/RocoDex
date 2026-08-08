"use client";

import Image from "next/image";
import { Bot, Boxes, CloudCog, DatabaseZap, Microscope } from "lucide-react";
import { clsx } from "clsx";
import { memo, type ComponentType } from "react";
import { cstdSystems, type CstdSystem, type CstdSystemIcon } from "../../content/systems";

const systemIcons: Record<CstdSystemIcon, ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  product: Boxes,
  edge: CloudCog,
  ai: Bot,
  research: Microscope,
  data: DatabaseZap,
};

const systemAccents: Record<CstdSystemIcon, string> = {
  product: "#f4d431",
  edge: "#24e0ff",
  ai: "#ff3b30",
  research: "#3dff8f",
  data: "#e8edf0",
};

function SystemsChapter({
  activeSystemId,
  setActiveSystemId,
  reducedMotion,
}: {
  activeSystemId: CstdSystem["id"];
  setActiveSystemId: (id: CstdSystem["id"]) => void;
  reducedMotion: boolean;
}) {
  const activeSystem = cstdSystems.find((system) => system.id === activeSystemId) ?? cstdSystems[0];
  const accent = systemAccents[activeSystem.icon];
  const ActiveIcon = systemIcons[activeSystem.icon];

  return (
    <section
      id="systems"
      data-cstd-chapter="systems"
      data-cstd-motion={reducedMotion ? "calm" : "full"}
      aria-labelledby="systems-heading"
      className="relative z-10 overflow-hidden bg-[#090c0f] px-5 py-24 text-[#f2efe7] contain-paint md:px-10 md:py-32 lg:px-16"
    >
      <div aria-hidden="true" className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(36,224,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(36,224,255,0.045)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div aria-hidden="true" className="absolute left-0 top-0 h-full w-1 bg-[#f4d431]" />
      <div className="mx-auto max-w-[1540px]">
        <header className="grid gap-8 border-b border-white/10 pb-12 lg:grid-cols-[1fr_30rem] lg:items-end">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase text-[#f4d431]">01 // RUNNING PROCESSES</p>
            <h2 id="systems-heading" className="mt-5 max-w-5xl text-5xl font-semibold leading-[0.96] tracking-[0] md:text-7xl xl:text-8xl">
              五个进程，共用一条神经总线。
            </h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-[#979da1]">
            从可用的产品表面，到边缘交付、AI 工具与数据研究。选择一条能力轴，查看它如何落到真实系统中。
          </p>
        </header>

        <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(32rem,1.08fr)] lg:gap-20">
          <div
            data-cstd-generated-visual="data-vault-v1"
            className="relative self-start overflow-hidden border-y border-[#24e0ff]/25 bg-[#061015]/55 px-5 py-8 lg:sticky lg:top-24 lg:px-7"
          >
            <div aria-hidden="true" className="absolute inset-0">
              <Image
                src="/cstd-universe/cstd-data-vault-v1.webp"
                alt=""
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover opacity-[0.16] saturate-50"
              />
              <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(6,16,21,0.98)_0%,rgba(6,16,21,0.88)_54%,rgba(6,16,21,0.42)_100%)]" />
            </div>
            <div aria-hidden="true" className="cstd-system-sweep absolute inset-x-0 top-0 h-px bg-[#24e0ff] opacity-0" />
            <div className="relative z-10 flex items-start justify-between gap-6">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase text-[#718087]">INSPECTING PROCESS</p>
                <p className="mt-3 font-mono text-xs font-bold" style={{ color: accent }}>
                  {activeSystem.track === "shipped" ? "SHIPPED SYSTEM" : "RESEARCH TRACK"}
                </p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-md border border-white/15" style={{ color: accent }}>
                <ActiveIcon aria-hidden={true} className="h-5 w-5" />
              </span>
            </div>
            <div
              key={activeSystem.id}
              data-cstd-system-visual={activeSystem.id}
              className={clsx("cstd-active-system relative z-10 mt-10 transition-opacity", reducedMotion ? "duration-0" : "duration-300")}
            >
              <h3 className="text-4xl font-semibold leading-tight md:text-5xl">{activeSystem.title}</h3>
              <p className="mt-6 text-lg leading-8 text-[#d6d4ce]">{activeSystem.summary}</p>
              <p className="mt-5 border-l-2 pl-5 text-sm leading-7 text-[#8f9599]" style={{ borderColor: accent }}>
                {activeSystem.evidence}
              </p>
              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-t border-white/10 pt-6 font-mono text-[11px] font-semibold text-[#aeb3b6]">
                {activeSystem.stack.map((item) => <li key={item}>/ {item}</li>)}
              </ul>
            </div>
          </div>

          <ol className="border-t border-white/10">
            {cstdSystems.map((system, index) => {
              const active = system.id === activeSystem.id;
              const Icon = systemIcons[system.icon];
              const itemAccent = systemAccents[system.icon];
              return (
                <li key={system.id} className="border-b border-white/10">
                  <button
                    type="button"
                    data-cstd-system={system.id}
                    data-cstd-system-active={active ? "true" : "false"}
                    onClick={() => setActiveSystemId(system.id)}
                    onPointerEnter={() => setActiveSystemId(system.id)}
                    onFocus={() => setActiveSystemId(system.id)}
                    className={clsx(
                      "group grid w-full grid-cols-[2rem_2.75rem_1fr_auto] items-center gap-3 px-3 py-6 text-left transition-colors [clip-path:polygon(0_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431] md:gap-5 md:px-5 md:py-7",
                      active ? "bg-white/[0.045] text-[#f2efe7]" : "text-[#8f9599] hover:bg-white/[0.025] hover:text-[#d6d4ce]",
                    )}
                  >
                    <span className="font-mono text-[10px] font-bold text-[#656b6f]">{String(index + 1).padStart(2, "0")}</span>
                    <span
                      className={clsx("flex h-10 w-10 items-center justify-center rounded-md border transition-colors", active ? "border-current" : "border-white/10")}
                      style={active ? { color: itemAccent } : undefined}
                    >
                      <Icon aria-hidden={true} className="h-4 w-4" />
                    </span>
                    <span className="text-xl font-semibold md:text-2xl">{system.title}</span>
                    <span className="hidden font-mono text-[10px] font-bold uppercase sm:block" style={active ? { color: itemAccent } : undefined}>
                      {active ? "Inspecting" : system.track}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

export const MemoizedSystemsChapter = memo(SystemsChapter);
