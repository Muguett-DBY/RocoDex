"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";
import { clsx } from "clsx";
import type { KeyboardEvent, MouseEvent } from "react";
import { cstdSystems, type CstdSystem } from "../../content/systems";
import { cstdAtlasCoordinates, cstdSystemAccents, cstdSystemIcons } from "./system-presentation";

export function CstdAtlasPanel({
  activeSystemId,
  onSelectSystem,
  overdrive,
}: {
  activeSystemId: CstdSystem["id"];
  onSelectSystem: (id: CstdSystem["id"]) => void;
  overdrive: boolean;
}) {
  const activeIndex = cstdSystems.findIndex((system) => system.id === activeSystemId);
  const activeSystem = cstdSystems[activeIndex] ?? cstdSystems[0];
  const accent = cstdSystemAccents[activeSystem.icon];

  function select(id: CstdSystem["id"]) {
    onSelectSystem(id);
    window.dispatchEvent(new CustomEvent("cstd:metric", { detail: { name: "atlas_district", value: cstdSystems.findIndex((entry) => entry.id === id) + 1 } }));
  }

  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"] as const).includes(event.key as "ArrowLeft")) return;
    event.preventDefault();
    const direction = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
    const nextIndex = (index + direction + cstdSystems.length) % cstdSystems.length;
    const next = cstdSystems[nextIndex];
    select(next.id);
    document.getElementById(`cstd-atlas-${next.id}`)?.focus();
  }

  function openEvidence(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const host = window.location.hostname.toLowerCase();
    if (host === "custard.top" || host === "www.custard.top") return;
    event.preventDefault();
    window.location.assign(`/cstd${activeSystem.evidenceLinks[0].href}`);
  }

  return (
    <aside data-cstd-atlas data-cstd-atlas-active={activeSystem.id} className="relative min-h-[34rem] overflow-hidden border border-[#24e0ff]/25 bg-[#03070a]/78 shadow-[0_28px_90px_rgba(0,0,0,0.48)] backdrop-blur-xl">
      <header className="flex items-center justify-between gap-4 border-b border-white/12 px-4 py-3 font-mono">
        <p className="flex items-center gap-2 text-[9px] font-black text-[#24e0ff]"><span aria-hidden="true" className="h-1.5 w-1.5 bg-current shadow-[0_0_10px_currentColor]" /> CSTD ATLAS / LIVE TOPOLOGY</p>
        <span className={clsx("flex items-center gap-2 text-[8px] font-black", overdrive ? "text-[#ff5a50]" : "text-[#3dff8f]")}><span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse bg-current" />{overdrive ? "REDLINE" : "NOMINAL"}</span>
      </header>

      <div className="relative hidden h-[22rem] lg:block">
        <svg viewBox="0 0 510 330" aria-hidden="true" className="absolute inset-0 h-full w-full">
          <defs>
            <radialGradient id="cstd-atlas-core"><stop stopColor="rgba(36,224,255,.36)" /><stop offset="1" stopColor="rgba(36,224,255,0)" /></radialGradient>
            <filter id="cstd-atlas-glow"><feGaussianBlur stdDeviation="4" /></filter>
          </defs>
          <circle cx="255" cy="166" r="82" fill="url(#cstd-atlas-core)" opacity=".6" />
          <circle cx="255" cy="166" r="42" fill="none" stroke="rgba(36,224,255,.55)" strokeDasharray="4 8" className="cstd-atlas-orbit" />
          {cstdSystems.map((system) => {
            const coordinate = cstdAtlasCoordinates[system.id];
            const active = system.id === activeSystem.id;
            const color = cstdSystemAccents[system.icon];
            return <g key={system.id}><line x1="255" y1="166" x2={coordinate.x} y2={coordinate.y} stroke={active ? color : "rgba(153,178,186,.25)"} strokeWidth={active ? 2 : 1} strokeDasharray={active ? undefined : "6 8"} /><circle cx={coordinate.x} cy={coordinate.y} r={active ? 16 : 8} fill={active ? color : "rgba(7,12,15,.9)"} stroke={color} opacity={active ? 0.25 : 0.65} filter={active ? "url(#cstd-atlas-glow)" : undefined} /></g>;
          })}
        </svg>
        <div className="cstd-atlas-core absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-[#24e0ff]/70 bg-[#05090c]/95 [clip-path:polygon(18%_0,82%_0,100%_18%,100%_82%,82%_100%,18%_100%,0_82%,0_18%)]">
          <div className="text-center font-mono"><p className="text-[7px] font-black text-[#718087]">CSTD CORE</p><p className="mt-1 text-lg font-black text-[#24e0ff]">05</p></div>
        </div>
        {cstdSystems.map((system, index) => {
          const coordinate = cstdAtlasCoordinates[system.id];
          const Icon = cstdSystemIcons[system.icon];
          const active = system.id === activeSystem.id;
          const color = cstdSystemAccents[system.icon];
          return (
            <button
              id={`cstd-atlas-${system.id}`}
              key={system.id}
              type="button"
              data-cstd-atlas-district={system.id}
              aria-pressed={active}
              onClick={() => select(system.id)}
              onFocus={() => onSelectSystem(system.id)}
              onPointerEnter={() => onSelectSystem(system.id)}
              onKeyDown={(event) => moveFocus(event, index)}
              className={clsx("absolute flex h-14 w-36 -translate-x-1/2 -translate-y-1/2 items-center gap-3 border bg-[#05090c]/92 px-3 text-left font-mono transition-[transform,border-color,background-color] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#f4d431]", active ? "z-10 scale-105" : "border-white/15 hover:border-white/40")}
              style={{ left: `${coordinate.x / 5.1}%`, top: `${coordinate.y / 3.3}%`, borderColor: active ? color : undefined }}
            >
              <Icon aria-hidden="true" className="h-4 w-4 shrink-0" style={{ color }} />
              <span><span className="block text-[7px] font-black text-[#6d797e]">0{index + 1} / {system.code}</span><span className="mt-1 block text-[9px] font-black text-white">{system.district}</span></span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-5 border-b border-white/12 lg:hidden" aria-label="技术区域">
        {cstdSystems.map((system, index) => {
          const Icon = cstdSystemIcons[system.icon];
          const active = system.id === activeSystem.id;
          return <button key={system.id} type="button" data-cstd-atlas-district={system.id} aria-pressed={active} aria-label={system.title} onClick={() => select(system.id)} className="flex h-14 items-center justify-center border-r border-white/12 text-[#7c898e] last:border-r-0 aria-pressed:bg-white/8 aria-pressed:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#24e0ff]"><Icon aria-hidden="true" className="h-4 w-4" /><span className="sr-only">0{index + 1}</span></button>;
        })}
      </div>

      <div key={activeSystem.id} className="cstd-atlas-detail border-t border-white/12 px-5 py-5" style={{ borderTopColor: `${accent}66` }}>
        <div className="flex items-start justify-between gap-5">
          <div><p className="font-mono text-[8px] font-black" style={{ color: accent }}>{activeSystem.code} / {activeSystem.track.toUpperCase()}</p><h2 className="mt-2 text-2xl font-semibold leading-tight text-white">{activeSystem.title}</h2></div>
          <span className="font-mono text-[8px] font-black text-[#6e7a7f]">0{activeIndex + 1}/05</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-[#9ca7aa]">{activeSystem.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
          <a href="#systems" className="inline-flex items-center gap-2 font-mono text-[9px] font-black text-[#f4d431] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#f4d431]">进入区域 <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" /></a>
          <a href={activeSystem.evidenceLinks[0].href} onClick={openEvidence} className="inline-flex items-center gap-2 font-mono text-[9px] font-black text-[#24e0ff] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#24e0ff]">追踪证据 <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /></a>
        </div>
      </div>
    </aside>
  );
}
