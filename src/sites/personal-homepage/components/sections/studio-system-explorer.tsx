"use client";

import Image from "next/image";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";
import { useRef, useState, type KeyboardEvent } from "react";
import type { CstdHomepageObservatory } from "../../content/observatory";
import type { CstdDistrictStatus } from "../../content/studio-status";
import type { CstdSystem } from "../../content/systems";
import { CstdLink } from "../site/cstd-link";
import type { CstdLocale } from "../../content/content-types";
import { getLocalizedCstdHref } from "../../infrastructure/i18n";

export type StudioSystemArt = Readonly<{
  accent: string;
  image: string;
  imageAlt: Readonly<{ zh: string; en: string }>;
}>;

export function StudioSystemExplorer({
  systems,
  statuses,
  artBySystem,
  observatory,
  locale,
}: {
  systems: readonly CstdSystem[];
  statuses: readonly CstdDistrictStatus[];
  artBySystem: Record<CstdSystem["id"], StudioSystemArt>;
  observatory: CstdHomepageObservatory;
  locale: CstdLocale;
}) {
  const [activeSystemId, setActiveSystemId] = useState<CstdSystem["id"]>(() => systems[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeSystem = systems.find((system) => system.id === activeSystemId) ?? systems[0];
  const activeStatus = statuses.find((status) => status.id === activeSystem.id);
  const activeArt = artBySystem[activeSystem.id];

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (index + 1) % systems.length;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = (index - 1 + systems.length) % systems.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = systems.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    setActiveSystemId(systems[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div data-cstd-system-explorer className="mt-14 grid gap-8 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-12">
      <div data-cstd-system-tabs className="border-t border-white/12" role="tablist" aria-label={locale === "zh" ? "能力方向" : "Capability directions"} aria-orientation="vertical">
        {systems.map((system, index) => {
          const active = system.id === activeSystem.id;
          return (
            <button
              key={system.id}
              type="button"
              role="tab"
              id={`cstd-system-tab-${system.id}`}
              aria-selected={active}
              aria-controls="cstd-system-detail"
              tabIndex={active ? 0 : -1}
              ref={(element) => { tabRefs.current[index] = element; }}
              data-cstd-studio-district-option={system.id}
              data-cstd-system={system.id}
              data-cstd-system-active={active ? "true" : "false"}
              onClick={() => setActiveSystemId(system.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={clsx(
                "relative flex min-h-[4.75rem] w-full items-center gap-4 border-b border-white/12 px-1 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#24e0ff]",
                active ? "text-white" : "text-[#818d91] hover:text-[#d8ddde]",
              )}
            >
              <span className={clsx("font-mono text-[11px] font-black", active ? "text-[#f4d431]" : "text-[#5f6a6e]")}>{String(index + 1).padStart(2, "0")}</span>
              <span>
                <span className="block text-sm font-semibold leading-5">{system.title[locale]}</span>
                <span className="mt-1 block font-mono text-[11px] font-black opacity-60">{system.code}</span>
              </span>
              <span aria-hidden="true" className={clsx("ml-auto h-px transition-[width,background-color]", active ? "w-8 bg-[#f4d431]" : "w-3 bg-white/15")} />
            </button>
          );
        })}
      </div>

      <div
        id="cstd-system-detail"
        role="tabpanel"
        aria-labelledby={`cstd-system-tab-${activeSystem.id}`}
        aria-label={locale === "zh" ? `${activeSystem.title.zh} 能力详情` : `${activeSystem.title.en} capability details`}
        data-cstd-observatory
        data-cstd-observatory-release={observatory.release}
        data-cstd-observatory-environment={observatory.deployment.environment}
        data-cstd-studio-district={activeSystem.id}
        className="min-w-0"
      >
        <div className="relative min-h-[20rem] overflow-hidden border border-white/12 md:min-h-[24rem]" data-cstd-system-visual={activeSystem.id}>
          <Image
            key={activeArt.image}
            src={activeArt.image}
            alt={activeArt.imageAlt[locale]}
            fill
            sizes="(min-width: 1024px) 70vw, 100vw"
            className="cstd-district-backdrop object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,7,9,0.96),rgba(5,7,9,0.08)_72%)]" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <p className="font-mono text-[11px] font-black" style={{ color: activeArt.accent }}>{activeSystem.district[locale].toUpperCase()}</p>
            <h3 className="mt-3 text-3xl font-semibold md:text-5xl">{activeSystem.title[locale]}</h3>
          </div>
        </div>

        <div className="grid gap-8 border-b border-white/12 py-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] font-black text-[#24e0ff]">
              <CheckCircle2 aria-hidden="true" className="h-4 w-4" /> {locale === "zh" ? "证据已关联" : "EVIDENCE LINKED"}
            </div>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#c3cacc]">{activeSystem.relation[locale]}</p>
            <p className="mt-4 font-mono text-[11px] font-bold leading-5 text-[#7f8b90]">{activeSystem.stack.join(" / ")}</p>
          </div>

          <dl className="grid grid-cols-3 gap-6 md:min-w-[19rem]">
            {[
              [`${activeStatus?.coverageScore ?? 0}%`, locale === "zh" ? "覆盖率" : "COVERAGE"],
              [String(activeStatus?.evidenceCount ?? 0), locale === "zh" ? "证据" : "ARTIFACTS"],
              [String(activeStatus?.projectCount ?? 0), locale === "zh" ? "系统" : "SYSTEMS"],
            ].map(([value, label]) => (
              <div key={label} className="flex flex-col">
                <dt data-cstd-system-metric-label className="order-2 mt-1.5 font-mono text-[11px] font-black text-[#697478]">{label}</dt>
                <dd className="order-1 font-mono text-xl font-black text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3 font-mono text-[11px] font-black">
          <CstdLink href={getLocalizedCstdHref("/observatory.json", locale)} className="inline-flex items-center gap-2 text-[#24e0ff] hover:text-white">
            RELEASE {observatory.release} <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </CstdLink>
          <CstdLink href={getLocalizedCstdHref("/map", locale)} className="inline-flex items-center gap-2 text-[#899499] hover:text-white">
            {locale === "zh" ? "知识图谱" : "KNOWLEDGE MAP"} <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </CstdLink>
        </div>
      </div>
    </div>
  );
}
