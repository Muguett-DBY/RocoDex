"use client";

import { Bot, Boxes, CloudCog, DatabaseZap, Microscope } from "lucide-react";
import { clsx } from "clsx";
import { memo, type ComponentType, type CSSProperties } from "react";
import {
  cstdSystems,
  cstdTechnicalNotes,
  type CstdSystem,
  type CstdSystemIcon,
} from "../../content/systems";

const systemIcons: Record<CstdSystemIcon, ComponentType<{ className?: string; style?: CSSProperties; "aria-hidden"?: boolean }>> = {
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

const reactorCoordinates: Record<CstdSystem["id"], { left: string; top: string; x: number; y: number }> = {
  "product-surfaces": { left: "11%", top: "18%", x: 150, y: 145 },
  "edge-operations": { left: "72%", top: "14%", x: 785, y: 120 },
  "ai-creation": { left: "79%", top: "62%", x: 850, y: 470 },
  "research-models": { left: "10%", top: "67%", x: 145, y: 505 },
  "data-systems": { left: "45%", top: "78%", x: 500, y: 575 },
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
      data-cstd-scene="systems"
      data-cstd-skill-reactor
      data-cstd-motion={reducedMotion ? "calm" : "full"}
      aria-labelledby="systems-heading"
      className="relative z-20 text-[#f2efe7] contain-paint"
    >
      <div className="relative lg:h-[190svh]">
        <div className="relative min-h-svh overflow-hidden border-y border-[#24e0ff]/25 bg-[#050709]/28 px-5 py-24 backdrop-blur-[2px] md:px-10 lg:sticky lg:top-0 lg:flex lg:items-center lg:px-16 lg:py-20">
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.93)_0%,rgba(5,7,9,0.48)_42%,rgba(5,7,9,0.24)_100%)]" />
          <div aria-hidden="true" className="cstd-reactor-scan absolute inset-x-0 top-0 h-px bg-[#24e0ff]/75 shadow-[0_0_24px_rgba(36,224,255,0.8)]" />

          <div className="relative mx-auto w-full max-w-[1540px]">
            <header className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-end">
              <div>
                <p className="font-mono text-[10px] font-black uppercase text-[#24e0ff]">01 // SKILL REACTOR / FIVE DISTRICTS</p>
                <h2 id="systems-heading" className="mt-5 max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[0] md:text-7xl xl:text-8xl">
                  技术不是清单，
                  <span className="block text-[#f4d431]">是一座持续供能的系统。</span>
                </h2>
              </div>
              <p className="max-w-xl text-base leading-8 text-[#aeb6b9]">
                真实项目与课程研究被归入五个相互依赖的工程区域。选择节点，查看它向整座城市提供的能力与证据。
              </p>
            </header>

            <div className="mt-12 grid gap-10 lg:grid-cols-[23rem_minmax(0,1fr)] lg:items-center xl:grid-cols-[25rem_minmax(0,1fr)]">
              <div
                key={activeSystem.id}
                data-cstd-system-visual={activeSystem.id}
                className="cstd-reactor-detail border-l-2 bg-[#050709]/72 py-3 pl-6 pr-4 backdrop-blur-md"
                style={{ borderColor: accent }}
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="font-mono text-[9px] font-black text-[#778388]">INSPECTING / {activeSystem.code}</p>
                    <p className="mt-2 font-mono text-xs font-black" style={{ color: accent }}>{activeSystem.district}</p>
                  </div>
                  <ActiveIcon aria-hidden={true} className="h-6 w-6 flex-none" />
                </div>
                <h3 className="mt-8 text-4xl font-semibold leading-[0.98] md:text-5xl">{activeSystem.title}</h3>
                <p className="mt-6 text-lg leading-8 text-[#d6dadd]">{activeSystem.summary}</p>
                <p className="mt-5 text-sm leading-7 text-[#8f9ba0]">{activeSystem.relation}</p>
                <p className="mt-6 border-t border-white/15 pt-5 font-mono text-[10px] font-bold leading-5 text-[#aeb6b9]">EVIDENCE / {activeSystem.evidence}</p>
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] font-black text-[#c8d0d3]">
                  {activeSystem.stack.map((item) => <li key={item}>/ {item}</li>)}
                </ul>
              </div>

              <div className="relative hidden aspect-[10/6.5] min-h-[31rem] lg:block" data-cstd-reactor-map>
                <svg viewBox="0 0 1000 650" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
                  <g className="cstd-reactor-links" fill="none" strokeWidth="1.2">
                    {cstdSystems.map((system) => {
                      const coordinate = reactorCoordinates[system.id];
                      const active = system.id === activeSystem.id;
                      return (
                        <line
                          key={system.id}
                          x1="500"
                          y1="325"
                          x2={coordinate.x}
                          y2={coordinate.y}
                          stroke={active ? systemAccents[system.icon] : "rgba(155,177,184,0.28)"}
                          strokeDasharray={active ? "0" : "8 10"}
                          data-cstd-reactor-link-active={active ? "true" : "false"}
                        />
                      );
                    })}
                  </g>
                </svg>

                <div className="cstd-reactor-core absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-[#24e0ff]/70 bg-[#050709]/86 shadow-[0_0_80px_rgba(36,224,255,0.18)] [clip-path:polygon(18%_0,82%_0,100%_18%,100%_82%,82%_100%,18%_100%,0_82%,0_18%)]">
                  <div className="text-center font-mono">
                    <p className="text-[8px] font-black text-[#68757b]">CSTD CORE</p>
                    <p className="mt-2 text-2xl font-black text-[#24e0ff]">05</p>
                    <p className="mt-1 text-[8px] font-black text-[#3dff8f]">LINKED</p>
                  </div>
                </div>

                {cstdSystems.map((system, index) => {
                  const coordinate = reactorCoordinates[system.id];
                  const active = system.id === activeSystem.id;
                  const Icon = systemIcons[system.icon];
                  const itemAccent = systemAccents[system.icon];
                  return (
                    <button
                      key={system.id}
                      type="button"
                      data-cstd-system={system.id}
                      data-cstd-system-active={active ? "true" : "false"}
                      onClick={() => setActiveSystemId(system.id)}
                      onPointerEnter={() => setActiveSystemId(system.id)}
                      onFocus={() => setActiveSystemId(system.id)}
                      className={clsx(
                        "cstd-reactor-node absolute w-40 -translate-x-1/2 -translate-y-1/2 border bg-[#050709]/88 px-4 py-3 text-left font-mono backdrop-blur-md transition-[border-color,transform,background-color] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]",
                        active ? "z-10 scale-105" : "border-white/15 hover:border-white/40",
                      )}
                      style={{
                        left: coordinate.left,
                        top: coordinate.top,
                        borderColor: active ? itemAccent : undefined,
                      }}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <Icon aria-hidden={true} className="h-4 w-4" style={{ color: itemAccent }} />
                        <span className="text-[8px] font-black text-[#68757b]">0{index + 1}</span>
                      </span>
                      <span className="mt-3 block text-[10px] font-black" style={{ color: active ? itemAccent : "#d6dadd" }}>{system.district}</span>
                    </button>
                  );
                })}
              </div>

              <ol className="border-t border-white/15 lg:hidden">
                {cstdSystems.map((system, index) => {
                  const active = system.id === activeSystem.id;
                  const Icon = systemIcons[system.icon];
                  const itemAccent = systemAccents[system.icon];
                  return (
                    <li key={system.id} className="border-b border-white/15">
                      <button
                        type="button"
                        data-cstd-system-option={system.id}
                        data-cstd-system-active={active ? "true" : "false"}
                        onClick={() => setActiveSystemId(system.id)}
                        onFocus={() => setActiveSystemId(system.id)}
                        className="grid w-full grid-cols-[2rem_2rem_1fr] items-center gap-3 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
                      >
                        <span className="font-mono text-[9px] font-black text-[#68757b]">0{index + 1}</span>
                        <Icon aria-hidden={true} className="h-4 w-4" style={{ color: itemAccent }} />
                        <span className={clsx("text-base font-semibold", active ? "text-white" : "text-[#9aa4a8]")}>{system.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div data-cstd-technical-notes className="relative border-b border-[#f4d431]/30 bg-[#050709]/94 px-5 py-24 backdrop-blur-xl md:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-[1540px]">
          <div className="grid gap-8 lg:grid-cols-[24rem_1fr]">
            <div>
              <p className="font-mono text-[10px] font-black text-[#f4d431]">FIELD NOTES / DEEP SIGNAL</p>
              <h3 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">技术分享，不写成关键词墙。</h3>
            </div>
            <div className="border-t border-white/15">
              {cstdTechnicalNotes.map((note, index) => (
                <article key={note.code} data-cstd-technical-note={note.code} className="grid gap-5 border-b border-white/15 py-8 md:grid-cols-[5rem_minmax(0,0.85fr)_minmax(18rem,1.15fr)] md:gap-8">
                  <p className="font-mono text-[9px] font-black text-[#68757b]">0{index + 1}<br />{note.code}</p>
                  <div>
                    <h4 className="text-2xl font-semibold leading-tight text-[#f2efe7]">{note.title}</h4>
                    <p className="mt-4 text-base font-semibold leading-7 text-[#24e0ff]">{note.thesis}</p>
                  </div>
                  <div>
                    <p className="text-sm leading-7 text-[#9aa4a8]">{note.detail}</p>
                    <p className="mt-5 font-mono text-[9px] font-black leading-5 text-[#c4cccf]">{note.stack.map((item) => `/ ${item}`).join("   ")}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const MemoizedSystemsChapter = memo(SystemsChapter);
