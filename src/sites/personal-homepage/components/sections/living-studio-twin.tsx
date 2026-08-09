"use client";

import Image from "next/image";
import { Activity, ArrowUpRight, CheckCircle2, GitCommitHorizontal } from "lucide-react";
import { clsx } from "clsx";
import { memo, useMemo } from "react";
import { cstdArtBible } from "../../content/art-bible";
import { getNarrativeSystems, type CstdNarrativeMode } from "../../content/narratives";
import type { CstdHomepageObservatory } from "../../content/observatory";
import { cstdStudioSnapshot } from "../../content/studio-status";
import type { CstdSystem } from "../../content/systems";
import { getCstdLinkTargetProps } from "../../domain/link-target";
import { CstdLink } from "../site/cstd-link";

function LivingStudioTwin({
  activeSystemId,
  setActiveSystemId,
  narrativeMode,
  observatory,
}: {
  activeSystemId: CstdSystem["id"];
  setActiveSystemId: (id: CstdSystem["id"]) => void;
  narrativeMode: CstdNarrativeMode;
  observatory: CstdHomepageObservatory;
}) {
  const systems = useMemo(() => getNarrativeSystems(narrativeMode), [narrativeMode]);
  const activeSystem = systems.find((system) => system.id === activeSystemId) ?? systems[0];
  const activeStatus = cstdStudioSnapshot.districts.find((district) => district.id === activeSystem.id);
  const activeArt = cstdArtBible[activeSystem.id];

  return (
    <section
      data-cstd-chapter="systems"
      data-cstd-scene="systems"
      data-cstd-studio-twin
      data-cstd-studio-district={activeSystem.id}
      aria-labelledby="studio-twin-heading"
      className="relative z-20 overflow-hidden border-y border-[#24e0ff]/20 bg-[#07090b] px-5 py-20 text-[#f2efe7] md:px-10 lg:px-16 lg:py-24"
    >
      <Image
        src="/cstd-universe/cstd-core-world-v4.webp"
        alt="五个能力区域连接到奶黄包个人工作室核心"
        fill
        sizes="100vw"
        className="object-cover object-[64%_50%] opacity-25"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.99),rgba(5,7,9,0.9)_56%,rgba(5,7,9,0.66))]" />

      <div className="relative mx-auto max-w-[1440px]">
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div>
            <p className="flex items-center gap-3 font-mono text-[10px] font-black text-[#24e0ff]">
              <Activity aria-hidden="true" className="h-4 w-4" /> 02 / CAPABILITY SYSTEM
            </p>
            <h2 id="studio-twin-heading" className="mt-5 max-w-4xl text-4xl font-semibold leading-[0.96] md:text-6xl lg:text-7xl">
              我不收集技能图标，<span className="text-[#f4d431]">我构建能上线的系统。</span>
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#b7c0c3]">
              产品界面、智能能力、数据工程、边缘部署和研究模型共同组成一条完整交付链。选择一个方向，查看它如何落进真实作品。
            </p>
          </div>

          <div data-cstd-observatory-deployment className="border-l-2 border-[#3dff8f] bg-[#0a0d0f] px-5 py-5">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[9px] font-black text-[#3dff8f]">LIVE BUILD</p>
              <span className="font-mono text-[8px] font-black text-[#8c979a]">{observatory.freshness.toUpperCase()}</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <GitCommitHorizontal aria-hidden="true" className="h-4 w-4 text-[#24e0ff]" />
              <span className="font-mono text-xl font-black text-white">{observatory.deployment.shortCommit}</span>
              <span className="font-mono text-[8px] font-black text-[#8c979a]">{observatory.deployment.environment.toUpperCase()}</span>
            </div>
          </div>
        </header>

        <div className="mt-12 grid gap-px bg-white/12 lg:grid-cols-5" role="tablist" aria-label="能力方向">
          {systems.map((system, index) => {
            const active = system.id === activeSystem.id;
            return (
              <button
                key={system.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="cstd-system-detail"
                data-cstd-studio-district-option={system.id}
                data-cstd-system={system.id}
                data-cstd-system-active={active ? "true" : "false"}
                onClick={() => setActiveSystemId(system.id)}
                className={clsx(
                  "min-h-24 bg-[#0a0d10] px-4 py-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#24e0ff]",
                  active ? "bg-[#f4d431] text-[#050709]" : "text-[#d8ddde] hover:bg-[#12171b]",
                )}
              >
                <span className="font-mono text-[8px] font-black opacity-70">{String(index + 1).padStart(2, "0")} / {system.code}</span>
                <span className="mt-3 block text-sm font-semibold leading-5">{system.title}</span>
              </button>
            );
          })}
        </div>

        <div
          id="cstd-system-detail"
          role="tabpanel"
          aria-label={`${activeSystem.title} 能力详情`}
          data-cstd-observatory
          data-cstd-observatory-release={observatory.release}
          data-cstd-observatory-environment={observatory.deployment.environment}
          className="grid border-x border-b border-white/12 bg-[#080b0e] lg:grid-cols-[minmax(22rem,0.9fr)_minmax(0,1.1fr)]"
        >
          <div className="relative min-h-[24rem] overflow-hidden border-b border-white/12 lg:border-b-0 lg:border-r" data-cstd-system-visual={activeSystem.id}>
            <Image
              key={activeArt.image}
              src={activeArt.image}
              alt={activeArt.imageAlt.zh}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="cstd-district-backdrop object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,7,9,0.96),rgba(5,7,9,0.08)_70%)]" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="font-mono text-[9px] font-black" style={{ color: activeArt.accent }}>{activeSystem.district.toUpperCase()}</p>
              <h3 className="mt-3 text-3xl font-semibold md:text-4xl">{activeSystem.title}</h3>
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 md:p-8">
            <div>
              <div className="flex items-center gap-2 font-mono text-[9px] font-black text-[#3dff8f]">
                <CheckCircle2 aria-hidden="true" className="h-4 w-4" /> PUBLIC EVIDENCE AVAILABLE
              </div>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#c3cacc]">{activeSystem.relation}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {activeSystem.stack.map((item) => (
                  <span key={item} className="border border-white/14 px-2.5 py-1.5 font-mono text-[8px] font-black text-[#aab3b6]">{item}</span>
                ))}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-px bg-white/12">
              {[
                [`${activeStatus?.coverageScore ?? 0}%`, "COVERAGE"],
                [String(activeStatus?.evidenceCount ?? 0), "ARTIFACTS"],
                [String(activeStatus?.projectCount ?? 0), "SYSTEMS"],
              ].map(([value, label]) => (
                <div key={label} className="bg-[#0b0e11] px-3 py-4 md:px-5">
                  <p className="font-mono text-xl font-black text-white md:text-2xl">{value}</p>
                  <p className="mt-2 font-mono text-[7px] font-black text-[#8c979a] md:text-[8px]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3 font-mono text-[9px] font-black">
          <a href={observatory.deployment.sourceHref} {...getCstdLinkTargetProps(observatory.deployment.sourceHref)} className="inline-flex items-center gap-2 text-[#24e0ff] hover:text-white">
            BUILD SOURCE <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
          <CstdLink href="/observatory.json" className="inline-flex items-center gap-2 text-[#3dff8f] hover:text-white">
            RELEASE {observatory.release} <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </CstdLink>
          <CstdLink href="/map" className="inline-flex items-center gap-2 text-[#b7c0c3] hover:text-white">
            KNOWLEDGE MAP <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </CstdLink>
        </div>
      </div>
    </section>
  );
}

export const MemoizedLivingStudioTwin = memo(LivingStudioTwin);
