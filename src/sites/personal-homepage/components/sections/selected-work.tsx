"use client";

import Image from "next/image";
import { ArrowRight, ArrowUpRight, RadioTower, ShieldCheck } from "lucide-react";
import { memo } from "react";
import { cstdCaseStudies, getCaseStudyPath } from "../../content/case-studies";
import { getCstdNarrative, type CstdNarrativeMode } from "../../content/narratives";
import { cstdProjects } from "../../content/projects";
import { cstdProofMesh } from "../../content/proof-mesh";
import { getCstdLinkTargetProps } from "../../domain/link-target";
import { CstdLink } from "../site/cstd-link";

function SelectedWork({ narrativeMode }: { reducedMotion: boolean; narrativeMode: CstdNarrativeMode }) {
  const projectOrder = getCstdNarrative(narrativeMode).projectOrder;
  const cases = projectOrder
    .map((projectId) => cstdCaseStudies.find((entry) => entry.projectId === projectId))
    .filter((entry) => entry !== undefined);

  return (
    <section
      data-cstd-chapter="proof"
      data-cstd-scene="proof"
      data-cstd-proof-reel
      data-cstd-light-chapter
      aria-labelledby="proof-heading"
      className="relative z-20 border-b border-black/20 bg-[#efeee8] px-5 py-20 text-[#090b0d] md:px-10 lg:px-16 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-end">
          <div>
            <p className="flex items-center gap-3 font-mono text-[10px] font-black text-[#005f70]"><RadioTower aria-hidden="true" className="h-4 w-4" /> 03 / SELECTED WORK</p>
            <h2 id="proof-heading" className="mt-5 max-w-5xl text-4xl font-semibold leading-[0.96] md:text-6xl lg:text-7xl">
              三个系统，<span className="text-[#007e92]">三条足够清楚的证据链。</span>
            </h2>
          </div>
          <p className="border-l border-black/25 pl-6 text-base leading-8 text-[#3c484d]">
            首页只给出结论、关键决策与运行状态。架构、失败与验证过程留在案例档案中，避免把个人展示页变成项目管理器。
          </p>
        </header>

        <div className="mt-12 grid gap-5 xl:grid-cols-3">
          {cases.map((entry, index) => {
            const proof = cstdProofMesh.find((candidate) => candidate.caseSlug === entry.slug);
            const project = cstdProjects.find((candidate) => candidate.id === entry.projectId);
            return (
              <article
                key={entry.slug}
                data-cstd-proof={entry.projectId}
                className="group relative min-h-[31rem] overflow-hidden border border-black/20 bg-[#050709] shadow-[0_20px_60px_rgba(5,7,9,0.12)] transition-transform duration-500 ease-out hover:-translate-y-2"
              >
                <Image src={entry.image.src} alt={entry.image.alt.zh} fill sizes="(min-width: 1280px) 33vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" style={{ objectPosition: entry.image.position ?? "50% 50%" }} />
                <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,9,0.08)_0%,rgba(5,7,9,0.45)_42%,rgba(5,7,9,0.98)_78%)]" />

                <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                  <div className="flex items-center justify-between gap-4 font-mono text-[8px] font-black">
                    <span className="text-[#f4d431]">0{index + 1} / {entry.kicker.zh.toUpperCase()}</span>
                    <span className="flex items-center gap-1.5 text-[#3dff8f]"><ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" /> {proof?.coverageScore ?? 0}% VERIFIED</span>
                  </div>
                  <h3 className="mt-4 text-3xl font-semibold leading-tight text-white md:text-4xl">{entry.title.zh}</h3>
                  <p className="mt-4 line-clamp-2 text-sm leading-7 text-[#b5bdc0]">{entry.summary.zh}</p>
                  <div className="mt-5 flex items-center justify-between gap-5 border-t border-white/15 pt-5">
                    <CstdLink href={getCaseStudyPath(entry, "zh")} className="inline-flex items-center gap-2 font-mono text-[10px] font-black text-[#f4d431] transition-[gap,color] hover:gap-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#f4d431]">
                      打开案例 <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </CstdLink>
                    {project?.href ? (
                      <a href={project.href} {...getCstdLinkTargetProps(project.href)} aria-label={`打开 ${project.title}`} title={`打开 ${project.title}`} className="flex h-10 w-10 items-center justify-center border border-white/20 text-[#aab3b6] transition-colors hover:border-[#24e0ff] hover:text-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#24e0ff]">
                        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border-y border-black/20 py-5 font-mono text-[9px] font-black text-[#4d595d]">
          <span>{cstdProofMesh.length} PUBLISHED CASES / {cstdProofMesh.reduce((sum, entry) => sum + entry.artifactCount, 0)} PUBLIC ARTIFACTS</span>
          <div className="flex gap-6">
            <CstdLink href="/work" className="text-[#7a6200] hover:text-black">全部案例</CstdLink>
            <CstdLink href="/proof.json" className="text-[#005f70] hover:text-black">PROOF.JSON</CstdLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export const MemoizedSelectedWork = memo(SelectedWork);
