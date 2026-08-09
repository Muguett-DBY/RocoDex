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
      className="relative z-20 overflow-hidden border-y border-white/10 bg-[#07090b] px-5 py-20 text-[#f2efe7] md:px-10 lg:px-16 lg:py-28"
    >
      <Image
        src="/cstd-universe/cstd-core-world-v4.webp"
        alt="五个能力区域连接到奶黄包个人工作室核心"
        fill
        sizes="100vw"
        className="object-cover object-[64%_50%] opacity-15"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.99),rgba(5,7,9,0.93)_56%,rgba(5,7,9,0.8))]" />

      <div className="relative mx-auto max-w-[1320px]">
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="flex items-center gap-3 font-mono text-[10px] font-black text-[#24e0ff]">
              <Activity aria-hidden="true" className="h-4 w-4" /> 02 / CAPABILITY SYSTEM
            </p>
            <h2 id="studio-twin-heading" className="mt-5 max-w-4xl text-4xl font-semibold leading-[1] md:text-6xl lg:text-[4rem]">
              我不收集技能图标，<span className="block text-[#f4d431]">我构建能上线的系统。</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#aeb8bb]">
              产品界面、智能能力、数据工程、边缘部署和研究模型共同组成一条完整交付链。选择一个方向，查看它如何落进真实作品。
            </p>
          </div>

          <a
            data-cstd-observatory-deployment
            href={observatory.deployment.sourceHref}
            {...getCstdLinkTargetProps(observatory.deployment.sourceHref)}
            className="group flex min-w-56 items-center gap-4 border-y border-white/12 py-4 font-mono transition-colors hover:border-[#24e0ff]/50"
          >
            <GitCommitHorizontal aria-hidden="true" className="h-4 w-4 text-[#24e0ff]" />
            <span>
              <span className="block text-[8px] font-black text-[#788489]">LIVE / {observatory.freshness.toUpperCase()}</span>
              <span className="mt-1 block text-sm font-black text-white">{observatory.deployment.shortCommit}</span>
            </span>
            <ArrowUpRight aria-hidden="true" className="ml-auto h-4 w-4 text-[#788489] transition-colors group-hover:text-[#24e0ff]" />
          </a>
        </header>

        <div className="mt-14 grid gap-8 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-12">
          <div className="border-t border-white/12" role="tablist" aria-label="能力方向">
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
                    "relative flex min-h-[4.75rem] w-full items-center gap-4 border-b border-white/12 px-1 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#24e0ff]",
                    active ? "text-white" : "text-[#818d91] hover:text-[#d8ddde]",
                  )}
                >
                  <span className={clsx("font-mono text-[9px] font-black", active ? "text-[#f4d431]" : "text-[#5f6a6e]")}>{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block text-sm font-semibold leading-5">{system.title}</span>
                    <span className="mt-1 block font-mono text-[8px] font-black opacity-60">{system.code}</span>
                  </span>
                  <span aria-hidden="true" className={clsx("ml-auto h-px transition-[width,background-color]", active ? "w-8 bg-[#f4d431]" : "w-3 bg-white/15")} />
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
            className="min-w-0"
          >
            <div className="relative min-h-[20rem] overflow-hidden border border-white/12 md:min-h-[24rem]" data-cstd-system-visual={activeSystem.id}>
              <Image
                key={activeArt.image}
                src={activeArt.image}
                alt={activeArt.imageAlt.zh}
                fill
                sizes="(min-width: 1024px) 70vw, 100vw"
                className="cstd-district-backdrop object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,7,9,0.96),rgba(5,7,9,0.08)_72%)]" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="font-mono text-[9px] font-black" style={{ color: activeArt.accent }}>{activeSystem.district.toUpperCase()}</p>
                <h3 className="mt-3 text-3xl font-semibold md:text-5xl">{activeSystem.title}</h3>
              </div>
            </div>

            <div className="grid gap-8 border-b border-white/12 py-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <div className="flex items-center gap-2 font-mono text-[8px] font-black text-[#24e0ff]">
                  <CheckCircle2 aria-hidden="true" className="h-4 w-4" /> EVIDENCE LINKED
                </div>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#c3cacc]">{activeSystem.relation}</p>
                <p className="mt-4 font-mono text-[9px] font-bold leading-5 text-[#7f8b90]">{activeSystem.stack.join(" / ")}</p>
              </div>

              <dl className="grid grid-cols-3 gap-6 md:min-w-[19rem]">
                {[
                  [`${activeStatus?.coverageScore ?? 0}%`, "COVERAGE"],
                  [String(activeStatus?.evidenceCount ?? 0), "ARTIFACTS"],
                  [String(activeStatus?.projectCount ?? 0), "SYSTEMS"],
                ].map(([value, label]) => (
                  <div key={label} className="flex flex-col">
                    <dt className="order-2 mt-1.5 font-mono text-[7px] font-black text-[#697478]">{label}</dt>
                    <dd className="order-1 font-mono text-xl font-black text-white">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3 font-mono text-[9px] font-black">
              <CstdLink href="/observatory.json" className="inline-flex items-center gap-2 text-[#24e0ff] hover:text-white">
                RELEASE {observatory.release} <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </CstdLink>
              <CstdLink href="/map" className="inline-flex items-center gap-2 text-[#899499] hover:text-white">
                KNOWLEDGE MAP <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </CstdLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const MemoizedLivingStudioTwin = memo(LivingStudioTwin);
