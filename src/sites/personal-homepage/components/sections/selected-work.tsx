import Image from "next/image";
import { clsx } from "clsx";
import { ArrowRight, ArrowUpRight, RadioTower, ShieldCheck } from "lucide-react";
import { cstdCaseStudies, getCaseStudyPath } from "../../content/case-studies";
import { getCstdNarrative, type CstdNarrativeMode } from "../../content/narratives";
import { cstdProjects } from "../../content/projects";
import { cstdProofMesh } from "../../content/proof-mesh";
import { getCstdLinkTargetProps } from "../../domain/link-target";
import { CstdLink } from "../site/cstd-link";
import { ThemeChapterLabel, ThemeCopy } from "../theme-copy";
import type { CstdLocale } from "../../content/content-types";
import { getLocalizedCstdHref } from "../../infrastructure/i18n";
import { createHomepageEvidenceChains } from "../../content/homepage-experience";
import { EvidenceChainExplorer } from "./evidence-chain-explorer";

export function SelectedWork({ narrativeMode, locale }: { narrativeMode: CstdNarrativeMode; locale: CstdLocale }) {
  const projectOrder = getCstdNarrative(narrativeMode).projectOrder;
  const cases = projectOrder
    .map((projectId) => cstdCaseStudies.find((entry) => entry.projectId === projectId))
    .filter((entry) => entry !== undefined);
  const evidenceChains = createHomepageEvidenceChains(cases, locale);

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
        <header data-cstd-chapter-header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
          <div>
            <p className="flex items-center gap-3 font-mono text-[11px] font-black text-[#005f70]"><RadioTower aria-hidden="true" className="h-4 w-4" /> <ThemeChapterLabel neon="03 / SELECTED WORK" ink={locale === "zh" ? "第三卷 / 成器" : "SCROLL III / WORKS MADE REAL"} press={locale === "zh" ? "栏目 B / 现场报道" : "SECTION B / FIELD REPORTS"} pixel={locale === "zh" ? "关卡 03 / 任务日志" : "LEVEL 03 / QUEST LOG"} underworld={locale === "zh" ? "第三殿 / 已成之器" : "HALL III / WORKS FORGED"} astral={locale === "zh" ? "第三章 / 已走过的旅程" : "CHAPTER III / JOURNEYS TAKEN"} /></p>
            <h2 id="proof-heading" className="mt-5 max-w-4xl text-4xl font-semibold leading-[1] md:text-6xl lg:text-[4rem]">
              <ThemeCopy
                neon={locale === "zh" ? <>三个系统，<span className="block text-[#007e92]">三条足够清楚的证据链。</span></> : <>Three systems.<span className="block text-[#007e92]">Three inspectable chains of evidence.</span></>}
                ink={locale === "zh" ? <>器成有痕，<span className="block text-[#007e92]">落款为证。</span></> : <>Each finished object leaves a trace.<span className="block text-[#007e92]">The signature is evidence.</span></>}
                press={locale === "zh" ? <>三份现场报道，<span className="block text-[#007e92]">一条证据链。</span></> : <>Three reports from the field.<span className="block text-[#007e92]">One accountable evidence chain.</span></>}
                pixel={locale === "zh" ? <>三项主线任务，<span className="block text-[#007e92]">战绩可验证。</span></> : <>Three main quests.<span className="block text-[#007e92]">Every clear is verifiable.</span></>}
                underworld={locale === "zh" ? <>三件已成之器，<span className="block text-[#007e92]">每件都带着试炼的刻痕。</span></> : <>Three works leave the forge.<span className="block text-[#007e92]">Each carries the mark of its trials.</span></>}
                astral={locale === "zh" ? <>三段已经走过的旅程，<span className="block text-[#007e92]">每一段都有选择与后果。</span></> : <>Three journeys already travelled.<span className="block text-[#007e92]">Each carries its choices and consequences.</span></>}
              />
            </h2>
          </div>
          <p className="border-l border-black/20 pl-6 text-sm leading-7 text-[#465156] md:text-base md:leading-8">
            <ThemeCopy
              neon={locale === "zh" ? "首页先给你看结果：什么做成了，为什么这样做，现在哪里能打开。完整拆解留给案例页。" : "The homepage starts with outcomes: what shipped, why it was shaped that way, and where it runs now. The full teardown lives in the case archive."}
              ink={locale === "zh" ? "先看器物，再看落款。首页只保留作品最重要的几笔，剩下的来处和改稿放进案例卷。" : "Look at the object, then read the signature. The homepage keeps the essential strokes; the case scroll holds the revisions and the work behind them."}
              press={locale === "zh" ? "本版不把项目写成报表。每篇现场报道只留下结果、关键取舍和可核验的出处。" : "This desk does not turn projects into spreadsheets. Each field report keeps the result, the decisive trade-off, and its checkable source."}
              pixel={locale === "zh" ? "这里展示已经过关的任务，不展开整张技能树。想看地图、失败和掉落物，进入对应案例。" : "This screen shows cleared quests, not the whole skill tree. Enter a case for the map, the failures, and the loot."}
              underworld={locale === "zh" ? "这里不陈列未经试炼的样品。每件作品只留下结果、关键取舍和仍可核验的锻造记录。" : "Nothing leaves this forge untested. Each work keeps its outcome, decisive trade-off, and an inspectable record of how it was made."}
              astral={locale === "zh" ? "这里不写注定胜利的英雄故事。每段旅程只留下当时的局势、真正做过的选择，以及现在仍能核验的结果。" : "These are not tales of inevitable victory. Each journey keeps the situation, the choice that was actually made, and the outcome you can still verify."}
            />
          </p>
        </header>

        <div data-cstd-proof-grid className="mt-12 grid gap-4 lg:grid-cols-12 lg:auto-rows-[15.5rem]">
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
                <Image src={entry.image.src} alt={entry.image.alt[locale]} fill sizes={featured ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 42vw, 100vw"} className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" style={{ objectPosition: entry.image.position ?? "50% 50%" }} />
                <div aria-hidden="true" className={clsx("absolute inset-0", featured ? "bg-[linear-gradient(180deg,rgba(5,7,9,0.03)_0%,rgba(5,7,9,0.3)_46%,rgba(5,7,9,0.98)_82%)]" : "bg-[linear-gradient(90deg,rgba(5,7,9,0.98)_0%,rgba(5,7,9,0.72)_56%,rgba(5,7,9,0.12)_100%)]")} />

                <div className={clsx("absolute inset-x-0 bottom-0 p-5 md:p-7", !featured && "lg:right-auto lg:max-w-[75%]")}>
                  <div className="flex items-center justify-between gap-4 font-mono text-[11px] font-black">
                    <span className="text-[#f4d431]">0{index + 1} / {entry.kicker[locale].toUpperCase()}</span>
                    <span className={clsx("items-center gap-1.5 text-[#24e0ff]", featured ? "flex" : "hidden lg:flex")}><ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" /> {proof?.coverageScore ?? 0}%</span>
                  </div>
                  <h3 className={clsx("mt-4 font-semibold leading-tight text-white", featured ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl")}>{entry.title[locale]}</h3>
                  <p className={clsx("mt-3 line-clamp-2 text-sm leading-6 text-[#b5bdc0]", !featured && "lg:hidden")}>{entry.summary[locale]}</p>
                  <div className={clsx("flex items-center justify-between gap-5 border-t border-white/15 pt-4", featured ? "mt-5" : "mt-4")}>
                    <CstdLink href={getCaseStudyPath(entry, locale)} className="inline-flex items-center gap-2 font-mono text-xs font-black text-[#f4d431] transition-[gap,color] hover:gap-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#f4d431]">
                      {locale === "zh" ? "打开案例" : "Open case"} <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </CstdLink>
                    {project?.href ? (
                      <a href={project.href} {...getCstdLinkTargetProps(project.href)} aria-label={locale === "zh" ? `打开 ${entry.title.zh}` : `Open ${entry.title.en}`} title={locale === "zh" ? `打开 ${entry.title.zh}` : `Open ${entry.title.en}`} className="flex h-10 w-10 items-center justify-center border border-white/20 text-[#aab3b6] transition-colors hover:border-[#24e0ff] hover:text-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#24e0ff]">
                        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <EvidenceChainExplorer chains={evidenceChains} locale={locale} />

        <div data-cstd-proof-footer className="mt-9 flex flex-wrap items-center justify-between gap-5 border-t pt-5 font-mono text-[11px] font-black">
          <span>{cstdProofMesh.length} {locale === "zh" ? "个已发布案例" : "PUBLISHED CASES"} / {cstdProofMesh.reduce((sum, entry) => sum + entry.artifactCount, 0)} {locale === "zh" ? "项公开证据" : "PUBLIC ARTIFACTS"}</span>
          <div className="flex gap-6">
            <CstdLink data-cstd-proof-footer-link="primary" href={getLocalizedCstdHref("/work", locale)}>{locale === "zh" ? "全部案例" : "ALL CASES"}</CstdLink>
            <CstdLink data-cstd-proof-footer-link="secondary" href={getLocalizedCstdHref("/proof.json", locale)}>PROOF.JSON</CstdLink>
          </div>
        </div>
      </div>
    </section>
  );
}
