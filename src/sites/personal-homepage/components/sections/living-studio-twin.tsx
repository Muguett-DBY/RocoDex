"use client";

import Image from "next/image";
import { Activity, ArrowUpRight, CheckCircle2, Pause, Play, RadioTower } from "lucide-react";
import { clsx } from "clsx";
import { memo, useEffect, useMemo, useState } from "react";
import { cstdArtBible } from "../../content/art-bible";
import { getNarrativeSystems, type CstdNarrativeMode } from "../../content/narratives";
import { cstdStudioSnapshot } from "../../content/studio-status";
import type { CstdSystem } from "../../content/systems";
import { CstdLink } from "../site/cstd-link";

function LivingStudioTwin({
  activeSystemId,
  setActiveSystemId,
  reducedMotion,
  narrativeMode,
}: {
  activeSystemId: CstdSystem["id"];
  setActiveSystemId: (id: CstdSystem["id"]) => void;
  reducedMotion: boolean;
  narrativeMode: CstdNarrativeMode;
}) {
  const systems = useMemo(() => getNarrativeSystems(narrativeMode), [narrativeMode]);
  const activeSystem = systems.find((system) => system.id === activeSystemId) ?? systems[0];
  const activeStatus = cstdStudioSnapshot.districts.find((district) => district.id === activeSystem.id);
  const activeArt = cstdArtBible[activeSystem.id];
  const [replayIndex, setReplayIndex] = useState(cstdStudioSnapshot.releases.length - 1);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing || reducedMotion) return;
    const timer = window.setInterval(() => {
      setReplayIndex((current) => (current + 1) % cstdStudioSnapshot.releases.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);

  const release = cstdStudioSnapshot.releases[replayIndex];

  return (
    <section
      id="systems"
      data-cstd-chapter="systems"
      data-cstd-scene="systems"
      data-cstd-studio-twin
      data-cstd-studio-district={activeSystem.id}
      aria-labelledby="studio-twin-heading"
      className="relative z-20 border-y border-[#24e0ff]/25 bg-[#06080a]/72 text-[#f2efe7] lg:min-h-[138svh]"
    >
      <div className="relative flex min-h-svh items-center overflow-hidden px-5 py-24 md:px-10 lg:sticky lg:top-0 lg:px-16">
        <div className="absolute inset-0">
          <Image
            key={activeArt.image}
            src={activeArt.image}
            alt={activeArt.imageAlt.zh}
            fill
            sizes="100vw"
            className="cstd-district-backdrop object-cover"
            style={{ objectPosition: "50% 50%" }}
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.98)_0%,rgba(5,7,9,0.9)_43%,rgba(5,7,9,0.35)_100%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,7,9,0.92),transparent_52%,rgba(5,7,9,0.72))]" />

        <div className="relative mx-auto grid w-full max-w-[1540px] gap-12 xl:grid-cols-[minmax(0,0.84fr)_minmax(34rem,1.16fr)] xl:items-end xl:gap-20">
          <div>
            <p className="flex items-center gap-3 font-mono text-[10px] font-black text-[#24e0ff]">
              <Activity aria-hidden="true" className="h-4 w-4" /> 01 / LIVING STUDIO TWIN
            </p>
            <h2 id="studio-twin-heading" className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.92] md:text-7xl">
              五个区域，<span className="text-[#f4d431]">由真实证据供电。</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#b5bdc0] md:text-lg">
              这里不是技能徽章墙。每个区域的覆盖率、工件数量和更新时间都来自已发布案例；构建时生成快照，访问时不等待第三方接口。
            </p>

            <div className="mt-9 grid gap-px border-y border-white/15 bg-white/10 sm:grid-cols-2">
              {systems.map((system, index) => {
                const status = cstdStudioSnapshot.districts.find((district) => district.id === system.id);
                const active = system.id === activeSystem.id;
                return (
                  <button
                    key={system.id}
                    type="button"
                    data-cstd-studio-district-option={system.id}
                    data-cstd-system={system.id}
                    data-cstd-system-active={active ? "true" : "false"}
                    onClick={() => setActiveSystemId(system.id)}
                    onFocus={() => setActiveSystemId(system.id)}
                    className={clsx(
                      "group min-h-24 bg-[#07090b]/88 px-4 py-4 text-left transition-[background-color,color] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#24e0ff]",
                      active ? "bg-[#f4d431] text-[#050709]" : "text-[#d8ddde] hover:bg-white/8",
                    )}
                  >
                    <span className="flex items-center justify-between gap-4 font-mono text-[8px] font-black">
                      <span>{String(index + 1).padStart(2, "0")} / {system.code}</span>
                      <span className={active ? "text-black/55" : "text-[#3dff8f]"}>{status?.state.toUpperCase()}</span>
                    </span>
                    <span className="mt-3 block text-lg font-semibold">{system.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-l border-white/20 bg-[#050709]/82 p-5 backdrop-blur-xl md:p-8" data-cstd-system-visual={activeSystem.id}>
            <div className="flex flex-wrap items-start justify-between gap-5 border-b border-white/15 pb-6">
              <div>
                <p className="font-mono text-[9px] font-black" style={{ color: activeArt.accent }}>{activeSystem.district.toUpperCase()}</p>
                <p className="mt-3 text-3xl font-semibold md:text-4xl">{activeSystem.title}</p>
              </div>
              <span className="flex items-center gap-2 font-mono text-[9px] font-black text-[#3dff8f]"><CheckCircle2 aria-hidden="true" className="h-4 w-4" /> PUBLIC PROOF</span>
            </div>

            <div className="grid gap-px bg-white/12 sm:grid-cols-3">
              {[
                [String(activeStatus?.coverageScore ?? 0), "COVERAGE"],
                [String(activeStatus?.evidenceCount ?? 0), "ARTIFACTS"],
                [String(activeStatus?.projectCount ?? 0), "SYSTEMS"],
              ].map(([value, label]) => (
                <div key={label} className="bg-[#080b0e] px-4 py-5">
                  <p className="font-mono text-3xl font-black text-white">{value}{label === "COVERAGE" ? "%" : ""}</p>
                  <p className="mt-2 font-mono text-[8px] font-black text-[#9aa6aa]">{label}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-base leading-8 text-[#c3cacc]">{activeSystem.relation}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {activeSystem.stack.map((item) => <span key={item} className="border border-white/14 px-2.5 py-1.5 font-mono text-[8px] font-black text-[#aab3b6]">{item}</span>)}
            </div>

            <div className="mt-8 border-t border-white/15 pt-6" data-cstd-release-replay data-cstd-replay-index={replayIndex}>
              <div className="flex items-center justify-between gap-4">
                <p className="flex items-center gap-2 font-mono text-[9px] font-black text-[#f4d431]"><RadioTower aria-hidden="true" className="h-4 w-4" /> RELEASE REPLAY</p>
                <button
                  type="button"
                  aria-label={playing ? "暂停发布重放" : "播放发布重放"}
                  title={playing ? "暂停发布重放" : "播放发布重放"}
                  onClick={() => setPlaying((current) => !current)}
                  className="flex h-9 w-9 items-center justify-center border border-[#f4d431]/45 text-[#f4d431] hover:bg-[#f4d431] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4d431]"
                >
                  {playing ? <Pause aria-hidden="true" className="h-4 w-4" /> : <Play aria-hidden="true" className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-5 grid grid-cols-4 gap-2" aria-label="发布时间线">
                {cstdStudioSnapshot.releases.map((entry, index) => (
                  <button
                    key={`${entry.date}-${entry.kind}`}
                    type="button"
                    aria-label={`${entry.date} ${entry.title.zh}`}
                    onClick={() => { setPlaying(false); setReplayIndex(index); }}
                    className={clsx("h-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24e0ff]", index <= replayIndex ? "bg-[#f4d431]" : "bg-white/15")}
                  />
                ))}
              </div>
              <p className="mt-5 font-mono text-[9px] font-black text-[#7e8a8f]">{release.date} / {release.kind.toUpperCase()}</p>
              <p className="mt-2 text-lg font-semibold text-white">{release.title.zh}</p>
              <p className="mt-2 text-sm leading-6 text-[#9ba6aa]">{release.summary.zh}</p>
            </div>

            <div className="mt-7 flex flex-wrap gap-6 font-mono text-[10px] font-black">
              <CstdLink href="/status.json" className="inline-flex items-center gap-2 text-[#24e0ff] hover:text-white">STATUS.JSON <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /></CstdLink>
              <CstdLink href="/map" className="inline-flex items-center gap-2 text-[#f4d431] hover:text-white">OPEN KNOWLEDGE MAP <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /></CstdLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const MemoizedLivingStudioTwin = memo(LivingStudioTwin);
