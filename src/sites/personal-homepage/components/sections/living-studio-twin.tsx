"use client";

import Image from "next/image";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  CircleGauge,
  Fingerprint,
  GitCommitHorizontal,
  Pause,
  Play,
  RadioTower,
} from "lucide-react";
import { clsx } from "clsx";
import { memo, useEffect, useMemo, useState } from "react";
import { cstdArtBible } from "../../content/art-bible";
import { getNarrativeSystems, type CstdNarrativeMode } from "../../content/narratives";
import type { CstdHomepageObservatory } from "../../content/observatory";
import { cstdStudioSnapshot } from "../../content/studio-status";
import type { CstdSystem } from "../../content/systems";
import { getCstdLinkTargetProps } from "../../domain/link-target";
import { CstdLink } from "../site/cstd-link";

const numberFormatter = new Intl.NumberFormat("en-US");

function formatCheck(check: CstdHomepageObservatory["verification"][number]) {
  if (check.unit === "bytes") return `${Math.round(check.value / 1024)} KB`;
  return numberFormatter.format(check.value);
}

function LivingStudioTwin({
  activeSystemId,
  setActiveSystemId,
  reducedMotion,
  narrativeMode,
  observatory,
}: {
  activeSystemId: CstdSystem["id"];
  setActiveSystemId: (id: CstdSystem["id"]) => void;
  reducedMotion: boolean;
  narrativeMode: CstdNarrativeMode;
  observatory: CstdHomepageObservatory;
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
      className="relative z-20 overflow-hidden border-y border-[#24e0ff]/25 bg-[#06080a]/90 px-5 py-24 text-[#f2efe7] md:px-10 lg:px-16 lg:py-32"
    >
      <Image
        src="/cstd-universe/cstd-observatory-core-v3.webp"
        alt="近未来工程观测站与发光证据核心"
        fill
        sizes="100vw"
        className="object-cover object-[64%_50%] opacity-50"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.99)_0%,rgba(5,7,9,0.91)_47%,rgba(5,7,9,0.42)_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,7,9,0.96),transparent_48%,rgba(5,7,9,0.78))]" />

      <div className="relative mx-auto max-w-[1540px]">
        <header className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_30rem] lg:items-end">
          <div>
            <p className="flex items-center gap-3 font-mono text-[10px] font-black text-[#24e0ff]">
              <Activity aria-hidden="true" className="h-4 w-4" /> 01 / ENGINEERING OBSERVATORY
            </p>
            <h2 id="studio-twin-heading" className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.92] md:text-7xl xl:text-8xl">
              不展示在线绿点，<span className="text-[#f4d431]">展示它为什么可信。</span>
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#bbc4c7] md:text-lg">
              五个能力区域仍由真实案例供电；现在进一步连接构建环境、提交来源、测试闸门、静态输出、资源预算与内容健康。访问时读取已发布快照，不等待第三方接口。
            </p>
          </div>

          <div className="border-l-2 border-[#f4d431] bg-[#050709]/76 px-5 py-6 backdrop-blur-xl" data-cstd-observatory-deployment>
            <div className="flex items-center justify-between gap-5">
              <p className="font-mono text-[9px] font-black text-[#f4d431]">DEPLOYMENT UPLINK</p>
              <span className={clsx("font-mono text-[8px] font-black", observatory.freshness === "current" ? "text-[#3dff8f]" : observatory.freshness === "aging" ? "text-[#f4d431]" : "text-[#ff5a50]")}>{observatory.freshness.toUpperCase()}</span>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <GitCommitHorizontal aria-hidden="true" className="h-5 w-5 text-[#24e0ff]" />
              <span className="font-mono text-2xl font-black text-white">{observatory.deployment.shortCommit}</span>
              <span className="border-l border-white/15 pl-3 font-mono text-[9px] font-black text-[#98a4a8]">{observatory.deployment.environment.toUpperCase()}</span>
            </div>
            <a href={observatory.deployment.sourceHref} {...getCstdLinkTargetProps(observatory.deployment.sourceHref)} className="mt-5 inline-flex items-center gap-2 border-b border-[#24e0ff]/55 pb-1 font-mono text-[9px] font-black text-[#24e0ff] hover:text-white">
              OPEN BUILD SOURCE <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </header>

        <div className="mt-14 grid border-y border-white/15 bg-[#050709]/72 backdrop-blur-lg xl:grid-cols-[22rem_minmax(0,1fr)]">
          <div className="border-b border-white/15 xl:border-b-0 xl:border-r">
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
                    "group min-h-24 w-full border-b border-white/15 px-4 py-4 text-left transition-[background-color,color] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#24e0ff]",
                    active ? "bg-[#f4d431] text-[#050709]" : "text-[#d8ddde] hover:bg-white/8",
                  )}
                >
                  <span className="flex items-center justify-between gap-4 font-mono text-[8px] font-black">
                    <span>{String(index + 1).padStart(2, "0")} / {system.code}</span>
                    <span className={active ? "text-black/75" : "text-[#3dff8f]"}>{status?.state.toUpperCase()}</span>
                  </span>
                  <span className="mt-3 block text-lg font-semibold">{system.title}</span>
                </button>
              );
            })}

            <div className="p-5" data-cstd-release-replay data-cstd-replay-index={replayIndex}>
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
              <p className="mt-5 font-mono text-[8px] font-black text-[#7e8a8f]">{release.date} / {release.kind.toUpperCase()}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-white">{release.title.zh}</p>
            </div>
          </div>

          <div data-cstd-observatory data-cstd-observatory-release={observatory.release} data-cstd-observatory-environment={observatory.deployment.environment}>
            <div className="relative min-h-[22rem] overflow-hidden border-b border-white/15" data-cstd-system-visual={activeSystem.id}>
              <Image
                key={activeArt.image}
                src={activeArt.image}
                alt={activeArt.imageAlt.zh}
                fill
                sizes="(min-width: 1280px) 70vw, 100vw"
                className="cstd-district-backdrop object-cover"
                style={{ objectPosition: "50% 50%" }}
              />
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.96),rgba(5,7,9,0.34)_72%,rgba(5,7,9,0.15))]" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-[9px] font-black" style={{ color: activeArt.accent }}>{activeSystem.district.toUpperCase()}</p>
                    <h3 className="mt-3 text-3xl font-semibold md:text-5xl">{activeSystem.title}</h3>
                  </div>
                  <span className="flex items-center gap-2 font-mono text-[9px] font-black text-[#3dff8f]"><CheckCircle2 aria-hidden="true" className="h-4 w-4" /> PUBLIC PROOF</span>
                </div>
              </div>
            </div>

            <div className="grid gap-px bg-white/12 sm:grid-cols-3">
              {[
                [String(activeStatus?.coverageScore ?? 0), "COVERAGE", "%"],
                [String(activeStatus?.evidenceCount ?? 0), "ARTIFACTS", ""],
                [String(activeStatus?.projectCount ?? 0), "SYSTEMS", ""],
              ].map(([value, label, suffix]) => (
                <div key={label} className="bg-[#080b0e] px-5 py-5">
                  <p className="font-mono text-3xl font-black text-white">{value}{suffix}</p>
                  <p className="mt-2 font-mono text-[8px] font-black text-[#9aa6aa]">{label}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-8 px-5 py-8 md:px-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(26rem,1.18fr)]">
              <div>
                <p className="text-base leading-8 text-[#c3cacc]">{activeSystem.relation}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {activeSystem.stack.map((item) => <span key={item} className="border border-white/14 px-2.5 py-1.5 font-mono text-[8px] font-black text-[#aab3b6]">{item}</span>)}
                </div>
              </div>

              <div>
                <p className="flex items-center gap-2 font-mono text-[9px] font-black text-[#24e0ff]"><CircleGauge aria-hidden="true" className="h-4 w-4" /> RELEASE GATES / {observatory.release}</p>
                <div className="mt-4 grid gap-px bg-white/12 sm:grid-cols-2">
                  {observatory.verification.map((check) => (
                    <div key={check.id} data-cstd-observatory-check={check.id} className="bg-[#07090b] px-4 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-mono text-2xl font-black text-white">{formatCheck(check)}</p>
                        <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[#3dff8f]" />
                      </div>
                      <p className="mt-2 text-xs font-semibold leading-5 text-[#9da8ac]">{check.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-7 gap-y-4 border-t border-white/15 px-5 py-6 font-mono text-[9px] font-black md:px-8">
              <CstdLink href="/observatory.json" className="inline-flex items-center gap-2 text-[#24e0ff] hover:text-white">OBSERVATORY.JSON <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /></CstdLink>
              <CstdLink href="/content-health.json" className="inline-flex items-center gap-2 text-[#3dff8f] hover:text-white">CONTENT {observatory.content.score}/100 <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /></CstdLink>
              <CstdLink href="/studio.json" className="inline-flex items-center gap-2 text-[#f4d431] hover:text-white"><Fingerprint aria-hidden="true" className="h-3.5 w-3.5" /> {observatory.provenanceDigest.toUpperCase()}</CstdLink>
              <CstdLink href="/map" className="inline-flex items-center gap-2 text-[#b7c0c3] hover:text-white">OPEN KNOWLEDGE MAP <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /></CstdLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const MemoizedLivingStudioTwin = memo(LivingStudioTwin);
