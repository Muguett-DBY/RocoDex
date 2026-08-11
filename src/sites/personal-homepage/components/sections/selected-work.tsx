import Image from "next/image";
import { clsx } from "clsx";
import { ArrowRight, ArrowUpRight, RadioTower, ShieldCheck } from "lucide-react";
import { cstdCaseStudies, getCaseStudyPath } from "../../content/case-studies";
import { getCstdNarrative, type CstdNarrativeMode } from "../../content/narratives";
import { cstdProjects } from "../../content/projects";
import { cstdProofMesh } from "../../content/proof-mesh";
import { getCstdLinkTargetProps } from "../../domain/link-target";
import { CstdLink } from "../site/cstd-link";

export function SelectedWork({ narrativeMode }: { narrativeMode: CstdNarrativeMode }) {
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
      className="relative z-20 border-b border-black/15 bg-[#f0efe9] px-5 py-20 text-[#090b0d] md:px-10 lg:px-16 lg:py-28"
    >
      <div className="mx-auto max-w-[1320px]">
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
          <div>
            <p className="flex items-center gap-3 font-mono text-[11px] font-black text-[#005f70]"><RadioTower aria-hidden="true" className="h-4 w-4" /> 03 / SELECTED WORK</p>
            <h2 id="proof-heading" className="mt-5 max-w-4xl text-4xl font-semibold leading-[1] md:text-6xl lg:text-[4rem]">
              三个系统，<span className="block text-[#007e92]">三条足够清楚的证据链。</span>
            </h2>
          </div>
          <p className="border-l border-black/20 pl-6 text-sm leading-7 text-[#465156] md:text-base md:leading-8">
            首页只给出结论、关键决策与运行状态。架构、失败与验证过程留在案例档案中，避免把个人展示页变成项目管理器。
          </p>
        </header>

        <div className="mt-12 grid gap-4 lg:grid-cols-12 lg:auto-rows-[15.5rem]">
          {cases.map((entry, index) => {
            const proof = cstdProofMesh.find((candidate) => candidate.caseSlug === entry.slug);
            const project = cstdProjects.find((candidate) => candidate.id === entry.projectId);
            const featured = index === 0;
            return (
              <article
                key={entry.slug}
                data-cstd-proof={entry.projectId}
                className={clsx(
                  "group relative min-h-[26rem] overflow-hidden border border-black/15 bg-[#050709] shadow-[0_18px_46px_rgba(5,7,9,0.1)] transition-transform duration-500 ease-out hover:-translate-y-1",
                  featured ? "lg:col-span-7 lg:row-span-2 lg:min-h-0" : "lg:col-span-5 lg:min-h-0",
                )}
              >
                <Image src={entry.image.src} alt={entry.image.alt.zh} fill sizes={featured ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 42vw, 100vw"} className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" style={{ objectPosition: entry.image.position ?? "50% 50%" }} />
                <div aria-hidden="true" className={clsx("absolute inset-0", featured ? "bg-[linear-gradient(180deg,rgba(5,7,9,0.03)_0%,rgba(5,7,9,0.3)_46%,rgba(5,7,9,0.98)_82%)]" : "bg-[linear-gradient(90deg,rgba(5,7,9,0.98)_0%,rgba(5,7,9,0.72)_56%,rgba(5,7,9,0.12)_100%)]")} />

                <div className={clsx("absolute inset-x-0 bottom-0 p-5 md:p-7", !featured && "lg:right-auto lg:max-w-[75%]")}>
                  <div className="flex items-center justify-between gap-4 font-mono text-[11px] font-black">
                    <span className="text-[#f4d431]">0{index + 1} / {entry.kicker.zh.toUpperCase()}</span>
                    <span className={clsx("items-center gap-1.5 text-[#24e0ff]", featured ? "flex" : "hidden lg:flex")}><ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" /> {proof?.coverageScore ?? 0}%</span>
                  </div>
                  <h3 className={clsx("mt-4 font-semibold leading-tight text-white", featured ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl")}>{entry.title.zh}</h3>
                  <p className={clsx("mt-3 line-clamp-2 text-sm leading-6 text-[#b5bdc0]", !featured && "lg:hidden")}>{entry.summary.zh}</p>
                  <div className={clsx("flex items-center justify-between gap-5 border-t border-white/15 pt-4", featured ? "mt-5" : "mt-4")}>
                    <CstdLink href={getCaseStudyPath(entry, "zh")} className="inline-flex items-center gap-2 font-mono text-xs font-black text-[#f4d431] transition-[gap,color] hover:gap-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#f4d431]">
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

        <div className="mt-9 flex flex-wrap items-center justify-between gap-5 border-t border-black/15 pt-5 font-mono text-[11px] font-black text-[#596368]">
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
