import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ExternalLink, ShieldCheck } from "lucide-react";
import type { CSSProperties } from "react";
import type { CstdLocale } from "../../content/content-types";
import { getCstdCaseDossier } from "../../content/case-dossiers";
import { cstdCaseStudies, getCaseStudyPath, getCstdCaseStudy } from "../../content/case-studies";
import { loadCstdContentDocument } from "../../content/content-document";
import { CstdLink } from "../site/cstd-link";
import { CstdSiteChrome } from "../site/cstd-site-chrome";
import { CstdEvidenceGraph } from "../site/evidence-graph";
import { StructuredData } from "../site/structured-data";
import { CinematicCaseFilm } from "../site/cinematic-case-film";
import { LiveProofMesh } from "../site/live-proof-mesh";
import { CstdPageHero } from "./page-hero";
import { getCstdCaseReplayByCaseSlug } from "../../content/case-replays";
import { ExecutableCaseReplay } from "../site/executable-case-replay";
import { CstdCaseDossierView } from "../site/case-dossier";
import { AtelierProjectCover } from "../site/atelier-project-cover";

const workHero = {
  src: "/cstd-universe/cstd-broadcast-nexus-v1.webp",
  alt: { zh: "连接多个真实产品的广播枢纽", en: "A broadcast nexus connecting shipped products" },
  position: "50% 48%",
} as const;

export const cstdCaseStudyStaticParams = cstdCaseStudies.map((entry) => ({ slug: entry.slug }));

export function CstdWorkIndexPage({ locale }: { locale: CstdLocale }) {
  const copy = locale === "zh" ? {
    eyebrow: "01 / SELECTED WORK",
    title: "做过的事，放在这里。",
    summary: "从城市数据分析到产品开发，每份案例都写清楚问题、做法和验证结果。可以看成品，也可以往里看看它是怎么做出来的。",
    role: "角色",
    status: "状态",
    open: "打开案例",
  } : {
    eyebrow: "01 / SELECTED WORK",
    title: "Made, tested, and kept here.",
    summary: "Urban data analysis, products, and the decisions behind them. Each case explains the problem, the approach, and how the result was checked.",
    role: "Role",
    status: "Status",
    open: "Open case",
  };

  return (
    <CstdSiteChrome locale={locale} page="work-index">
      <main id="cstd-main">
        <CstdPageHero locale={locale} eyebrow={copy.eyebrow} title={copy.title} summary={copy.summary} image={workHero} atelierVisual={<AtelierProjectCover entry={cstdCaseStudies.find((entry) => entry.slug === "melbourne-pedestrian-microclimate")!} locale={locale} />} />

        <section data-cstd-work-index className="border-b border-white/12 bg-[#080a0c]/88">
          {cstdCaseStudies.map((entry, index) => (
            <article key={entry.slug} className="group relative border-t border-white/12 first:border-t-0">
              <CstdLink href={getCaseStudyPath(entry, locale)} className="relative mx-auto grid min-h-[34rem] max-w-[1540px] overflow-hidden px-5 py-16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#24e0ff] md:px-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(28rem,1.12fr)] lg:items-center lg:gap-16 lg:px-16">
                <div className="relative z-10 max-w-2xl">
                  <div className="flex items-center gap-4 font-mono text-[11px] font-black text-[#778286]">
                    <span className="text-[#f4d431]">{String(index + 1).padStart(2, "0")}</span>
                    <span>{entry.year}</span>
                    <span className="h-px flex-1 bg-white/15" />
                  </div>
                  <p className="mt-8 font-mono text-[11px] font-black uppercase text-[#24e0ff]">{entry.kicker[locale]}</p>
                  <h2 className="mt-4 text-4xl font-semibold leading-[0.95] text-white md:text-6xl">{entry.title[locale]}</h2>
                  <p className="mt-6 text-base leading-8 text-[#aab3b6]">{entry.summary[locale]}</p>
                  <dl className="mt-8 grid gap-4 border-y border-white/12 py-5 sm:grid-cols-2">
                    <div>
                      <dt className="font-mono text-[11px] font-black text-[#677379]">{copy.role.toUpperCase()}</dt>
                      <dd className="mt-2 text-sm text-[#d9dfe1]">{entry.role[locale]}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[11px] font-black text-[#677379]">{copy.status.toUpperCase()}</dt>
                      <dd className="mt-2 text-sm text-[#d9dfe1]">{entry.status[locale]}</dd>
                    </div>
                  </dl>
                  <span className="mt-8 inline-flex items-center gap-3 border-b-2 border-[#f4d431] pb-2 font-mono text-xs font-black text-white transition-[gap,color] group-hover:gap-5 group-hover:text-[#f4d431]">
                    {copy.open} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </span>
                </div>

                <figure className="relative mt-10 aspect-[16/10] overflow-hidden border border-white/18 bg-black shadow-[0_32px_80px_rgba(0,0,0,0.48)] lg:mt-0" style={{ viewTransitionName: `cstd-case-${entry.slug}` } as CSSProperties}>
                  <Image data-cstd-world-cover src={entry.image.src} alt={entry.image.alt[locale]} fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]" style={{ objectPosition: entry.image.position ?? "50% 50%" }} />
                  <div className="cstd-atelier-work-cover"><AtelierProjectCover entry={entry} locale={locale} /></div>
                  <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(120deg,transparent_35%,rgba(36,224,255,0.12))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <figcaption className="absolute bottom-3 left-3 bg-[#050709]/90 px-3 py-2 font-mono text-[11px] font-black text-[#24e0ff] backdrop-blur">VERIFIED SURFACE / {entry.projectId.toUpperCase()}</figcaption>
                </figure>
              </CstdLink>
            </article>
          ))}
        </section>
      </main>
      <StructuredData value={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: copy.title,
        url: `https://custard.top${locale === "en" ? "/en/work" : "/work"}`,
        hasPart: cstdCaseStudies.map((entry) => ({ "@type": "CreativeWork", name: entry.title[locale], url: `https://custard.top${getCaseStudyPath(entry, locale)}` })),
      }} />
    </CstdSiteChrome>
  );
}

export async function CstdCaseStudyPage({ locale, slug }: { locale: CstdLocale; slug: string }) {
  const entry = getCstdCaseStudy(slug);
  if (!entry) notFound();
  const document = await loadCstdContentDocument("cases", entry.slug, locale);
  const copy = locale === "zh" ? {
    back: "全部作品",
    role: "承担角色",
    status: "运行状态",
    stack: "使用的技术",
    evidence: "交付与验证",
    evidenceSummary: "结果如何，留给证据来说。",
    live: "访问线上系统",
    next: "下一份案例",
  } : {
    back: "All work",
    role: "Role",
    status: "Status",
    stack: "Built with",
    evidence: "Delivery and verification",
    evidenceSummary: "The result, backed by a record.",
    live: "Visit live system",
    next: "Next case",
  };
  const index = cstdCaseStudies.findIndex((candidate) => candidate.slug === entry.slug);
  const nextEntry = cstdCaseStudies[(index + 1) % cstdCaseStudies.length];
  const replay = getCstdCaseReplayByCaseSlug(entry.slug);
  const dossier = getCstdCaseDossier(entry.slug);

  return (
    <CstdSiteChrome locale={locale} page={`work-${entry.slug}`}>
      <main id="cstd-main">
        <CstdPageHero locale={locale} eyebrow={`${entry.year} / ${entry.kicker[locale].toUpperCase()}`} title={entry.title[locale]} summary={entry.summary[locale]} image={entry.image} metrics={entry.metrics} transitionName={`cstd-case-${entry.slug}`} atelierVisual={<AtelierProjectCover entry={entry} locale={locale} />} />

        <nav className="cstd-case-outline" aria-label={locale === "zh" ? "案例阅读导航" : "Case reading navigation"}>
          <div><span>{locale === "zh" ? "这份案例" : "In this case"}</span>{entry.toc.map((section, sectionIndex) => <a key={section.id} href={`#${section.id}`}>{String(sectionIndex + 1).padStart(2, "0")}<span>{(section.eyebrow?.[locale] ?? section.title[locale]).replace(/^\d+\s*\/\s*/, "")}</span></a>)}</div>
        </nav>

        <section className="border-b border-white/12 bg-[#f1eee5] text-[#090b0d]">
          <div className="mx-auto grid max-w-[1540px] gap-10 px-5 py-14 md:px-10 lg:grid-cols-[minmax(18rem,0.75fr)_minmax(0,1.25fr)] lg:px-16 lg:py-20">
            <div>
              <CstdLink href={locale === "en" ? "/en/work" : "/work"} className="inline-flex items-center gap-2 font-mono text-[11px] font-black text-[#0b5f6d] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" /> {copy.back}
              </CstdLink>
            </div>
            <dl className="grid gap-6 sm:grid-cols-3">
              <div><dt className="font-mono text-[11px] font-black text-black/75">{copy.role.toUpperCase()}</dt><dd className="mt-2 text-sm leading-6">{entry.role[locale]}</dd></div>
              <div><dt className="font-mono text-[11px] font-black text-black/75">{copy.status.toUpperCase()}</dt><dd className="mt-2 text-sm leading-6">{entry.status[locale]}</dd></div>
              <div><dt className="font-mono text-[11px] font-black text-black/75">{copy.stack.toUpperCase()}</dt><dd className="mt-2 text-sm leading-6">{entry.technologies.join(" · ")}</dd></div>
            </dl>
          </div>
        </section>

        <article data-cstd-case-story className="bg-[#080a0c]">{document}</article>

        <div className="cstd-case-lab-intro"><p>{locale === "zh" ? "继续往里看" : "A closer look"}</p><h2>{locale === "zh" ? "把过程，打开来看。" : "Open up the process."}</h2><p>{locale === "zh" ? "架构、交互重放和相关资料，都留在这里供你检查。" : "Explore the architecture, interactive replays, and the sources behind this work."}</p></div>
        <CinematicCaseFilm caseStudy={entry} locale={locale} />

        {dossier ? <CstdCaseDossierView dossier={dossier} locale={locale} /> : null}

        {replay ? (
          <section className="border-b border-[#24e0ff]/25 bg-[#06080a] px-5 py-16 md:px-10 lg:px-16 lg:py-24" aria-label={locale === "zh" ? "可执行技术重放" : "Executable technical replay"}>
            <div className="mx-auto max-w-[1320px]">
              <ExecutableCaseReplay replay={replay} locale={locale} compact />
            </div>
          </section>
        ) : null}

        <LiveProofMesh locale={locale} caseSlug={entry.slug} />

        <CstdEvidenceGraph entry={entry} locale={locale} />

        <section data-cstd-case-evidence className="border-b border-[#f4d431]/40 bg-[#f4d431] px-5 py-20 text-[#050709] md:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1320px]">
            <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <div className="flex items-center gap-3 font-mono text-[11px] font-black"><ShieldCheck aria-hidden="true" className="h-5 w-5" /> {copy.evidence}</div>
                <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-tight md:text-5xl">{copy.evidenceSummary}</h2>
              </div>
              <div className="border-t border-black/30">
                {entry.evidence.map((evidence, evidenceIndex) => (
                  <div key={evidence.label[locale]} className="grid gap-3 border-b border-black/30 py-5 sm:grid-cols-[3rem_10rem_1fr] sm:items-start">
                    <span className="font-mono text-[11px] font-black text-black/75">0{evidenceIndex + 1}</span>
                    <strong className="font-mono text-xs">{evidence.label[locale]}</strong>
                    <p className="text-sm leading-7 text-black/70">{evidence.detail[locale]}</p>
                  </div>
                ))}
              </div>
            </div>
            {entry.liveHref ? (
              <a href={entry.liveHref} target="_blank" rel="noreferrer" className="mt-10 inline-flex items-center gap-3 border-b-2 border-black pb-2 font-mono text-xs font-black transition-[gap] hover:gap-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
                {copy.live} <ExternalLink aria-hidden="true" className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </section>

        <CstdLink data-cstd-next-case href={getCaseStudyPath(nextEntry, locale)} className="group block bg-[#050709] px-5 py-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#24e0ff] md:px-10 lg:px-16">
          <div className="mx-auto flex max-w-[1320px] items-end justify-between gap-8">
            <div><p className="font-mono text-[11px] font-black text-[#24e0ff]">{copy.next.toUpperCase()}</p><p className="mt-4 text-3xl font-semibold text-white md:text-5xl">{nextEntry.title[locale]}</p></div>
            <ArrowUpRight aria-hidden="true" className="h-8 w-8 shrink-0 text-[#f4d431] transition-transform group-hover:-translate-y-2 group-hover:translate-x-2" />
          </div>
        </CstdLink>
      </main>
      <StructuredData value={[
        { "@context": "https://schema.org", "@type": ["CreativeWork", "SoftwareSourceCode"], name: entry.title[locale], description: entry.summary[locale], url: `https://custard.top${getCaseStudyPath(entry, locale)}`, image: `https://custard.top${entry.image.src}`, programmingLanguage: entry.technologies, runtimePlatform: entry.status[locale], keywords: entry.capabilityIds, creator: { "@type": "Person", name: locale === "zh" ? "奶黄包" : "Custard" }, ...(dossier ? { about: dossier.architecture.map((node) => ({ "@type": "Thing", name: node.title[locale], description: node.detail[locale] })) } : {}) },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: locale === "zh" ? "作品" : "Work", item: `https://custard.top${locale === "en" ? "/en/work" : "/work"}` },
          { "@type": "ListItem", position: 2, name: entry.title[locale], item: `https://custard.top${getCaseStudyPath(entry, locale)}` },
        ] },
      ]} />
    </CstdSiteChrome>
  );
}
