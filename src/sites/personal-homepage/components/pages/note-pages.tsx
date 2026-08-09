import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock3, Link2 } from "lucide-react";
import type { CSSProperties } from "react";
import type { ContentMetric, CstdLocale } from "../../content/content-types";
import { cstdCaseStudies, getCaseStudyPath } from "../../content/case-studies";
import { loadCstdContentDocument } from "../../content/content-document";
import { cstdTechnicalNotes, getCstdTechnicalNote, getTechnicalNotePath } from "../../content/technical-notes";
import { getCstdTopicPath, getCstdTopicsForNote } from "../../content/topics";
import { CitationButton } from "../site/citation-button";
import { CstdLink } from "../site/cstd-link";
import { CstdSiteChrome } from "../site/cstd-site-chrome";
import { StructuredData } from "../site/structured-data";
import { CstdPageHero } from "./page-hero";

const notesHero = {
  src: "/cstd-archive/cstd-archive-notebook-v1.webp",
  alt: { zh: "记录系统决策的夜间技术档案", en: "A night archive of technical decisions" },
  position: "50% 50%",
} as const;

export const cstdTechnicalNoteStaticParams = cstdTechnicalNotes.map((entry) => ({ slug: entry.slug }));

function formatDate(value: string, locale: CstdLocale) {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-AU", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export function CstdNotesIndexPage({ locale }: { locale: CstdLocale }) {
  const copy = locale === "zh" ? {
    eyebrow: "02 / FIELD NOTES",
    title: "把实现写成可以复用的工程判断。",
    summary: "不是新闻流，也不是工具清单。这里记录真实项目里关于边界、证据、性能、数据、动效与跨学科系统思维的长期笔记。",
    read: "阅读全文",
    min: "分钟",
  } : {
    eyebrow: "02 / FIELD NOTES",
    title: "Turn implementation into reusable engineering judgment.",
    summary: "Not a news feed or a tool list. These durable notes document boundaries, evidence, performance, data, motion, and interdisciplinary systems thinking from real projects.",
    read: "Read note",
    min: "min",
  };

  return (
    <CstdSiteChrome locale={locale} page="notes-index">
      <main id="cstd-main">
        <CstdPageHero locale={locale} eyebrow={copy.eyebrow} title={copy.title} summary={copy.summary} image={notesHero} compact />
        <section className="border-b border-white/12 bg-[#080a0c]/92 px-5 py-16 md:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1320px]">
            {cstdTechnicalNotes.map((note, index) => (
              <article key={note.slug} className="group border-t border-white/15 first:border-t-0">
                <CstdLink href={getTechnicalNotePath(note, locale)} className="grid gap-7 py-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24e0ff] md:grid-cols-[7rem_minmax(0,1fr)_15rem] md:items-center lg:py-14">
                  <div className="flex items-center gap-4 md:block">
                    <span className="font-mono text-[9px] font-black text-[#f4d431]">{String(index + 1).padStart(2, "0")}</span>
                    <span className="font-mono text-[8px] font-black text-[#657278] md:mt-3 md:block">{formatDate(note.publishedAt, locale)}</span>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] font-black text-[#24e0ff]">{note.category[locale].toUpperCase()} / {note.series[locale].toUpperCase()}</p>
                    <h2 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-white transition-colors group-hover:text-[#f4d431] md:text-4xl lg:text-5xl">{note.title[locale]}</h2>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-[#98a3a7] md:text-base">{note.summary[locale]}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-3 font-mono text-[8px] font-black text-[#69757a]">
                      <Clock3 aria-hidden="true" className="h-3.5 w-3.5" /> {note.readingMinutes} {copy.min}
                      {note.tags.map((tag) => <span key={tag} className="border-l border-white/15 pl-3">{tag}</span>)}
                    </div>
                  </div>
                  <figure className="relative aspect-[4/3] overflow-hidden border border-white/15 bg-black md:order-none" style={{ viewTransitionName: `cstd-note-${note.slug}` } as CSSProperties}>
                    <Image src={note.image.src} alt={note.image.alt[locale]} fill sizes="(min-width: 768px) 240px, 100vw" className="object-cover opacity-75 transition-[transform,opacity] duration-500 group-hover:scale-105 group-hover:opacity-100" />
                    <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center bg-[#f4d431] text-black"><ArrowUpRight aria-hidden="true" className="h-4 w-4" /></span>
                  </figure>
                </CstdLink>
              </article>
            ))}
          </div>
        </section>
      </main>
      <StructuredData value={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: copy.title,
        url: `https://custard.top${locale === "en" ? "/en/notes" : "/notes"}`,
        hasPart: cstdTechnicalNotes.map((note) => ({ "@type": "TechArticle", headline: note.title[locale], url: `https://custard.top${getTechnicalNotePath(note, locale)}` })),
      }} />
    </CstdSiteChrome>
  );
}

export async function CstdTechnicalNotePage({ locale, slug }: { locale: CstdLocale; slug: string }) {
  const note = getCstdTechnicalNote(slug);
  if (!note) notFound();
  const document = await loadCstdContentDocument("notes", note.slug, locale);
  const copy = locale === "zh" ? {
    back: "全部札记",
    read: "阅读时间",
    min: "分钟",
    published: "发布",
    series: "系列",
    revision: "修订",
    citation: "复制引用",
    related: "相关真实系统",
    relatedSummary: "这篇文章来自以下项目中的实际设计与交付工作。",
    next: "继续阅读",
    paths: "所属主题路径",
  } : {
    back: "All notes",
    read: "Reading time",
    min: "min",
    published: "Published",
    series: "Series",
    revision: "Revision",
    citation: "Copy citation",
    related: "Related shipped systems",
    relatedSummary: "This note comes from design and delivery work in the following systems.",
    next: "Continue reading",
    paths: "Curated paths",
  };
  const noteMetrics: readonly ContentMetric[] = [
    { value: `${note.readingMinutes} ${copy.min}`, label: { zh: copy.read, en: copy.read } },
    { value: formatDate(note.publishedAt, locale), label: { zh: copy.published, en: copy.published } },
    { value: note.series[locale], label: { zh: copy.series, en: copy.series } },
  ];
  const index = cstdTechnicalNotes.findIndex((candidate) => candidate.slug === note.slug);
  const nextNote = cstdTechnicalNotes[(index + 1) % cstdTechnicalNotes.length];
  const relatedCases = note.relatedCaseSlugs.flatMap((caseSlug) => {
    const caseStudy = cstdCaseStudies.find((entry) => entry.slug === caseSlug);
    return caseStudy ? [caseStudy] : [];
  });
  const relatedTopics = getCstdTopicsForNote(note.slug);

  return (
    <CstdSiteChrome locale={locale} page={`note-${note.slug}`}>
      <main id="cstd-main">
        <CstdPageHero locale={locale} eyebrow={`${note.category[locale].toUpperCase()} / ${note.series[locale].toUpperCase()}`} title={note.title[locale]} summary={note.summary[locale]} image={note.image} metrics={noteMetrics} compact transitionName={`cstd-note-${note.slug}`} />

        <article data-cstd-reading-document className="bg-[#f1eee5] text-[#111315]">
          <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-16 md:px-10 lg:grid-cols-[13rem_minmax(0,46rem)] lg:justify-center lg:gap-20 lg:px-16 lg:py-24">
            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <CstdLink href={locale === "en" ? "/en/notes" : "/notes"} className="inline-flex items-center gap-2 font-mono text-[9px] font-black text-[#0b6473] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" /> {copy.back}
              </CstdLink>
              <nav aria-label={locale === "zh" ? "文章目录" : "Article contents"} className="mt-8 hidden border-l border-black/20 pl-4 lg:block">
                {note.toc.map((section, sectionIndex) => <a key={section.id} href={`#${section.id}`} className="mt-4 block font-mono text-[8px] font-black leading-5 text-black/75 hover:text-black"><span className="mr-2 text-[#0b6473]">0{sectionIndex + 1}</span>{section.title[locale]}</a>)}
              </nav>
              <p className="mt-7 font-mono text-[8px] font-black leading-5 text-black/75">{copy.revision.toUpperCase()} {note.revision}<br />UPDATED {note.updatedAt}</p>
              <CitationButton value={`${note.title[locale]} — ${locale === "zh" ? "奶黄包" : "Custard"}, https://custard.top${getTechnicalNotePath(note, locale)} (${note.updatedAt})`} label={copy.citation.toUpperCase()} />
            </aside>

            <div>
              {document}
              {relatedTopics.length > 0 ? (
                <nav aria-label={copy.paths} className="mt-14 border-t border-black/20 pt-7" data-cstd-note-paths>
                  <p className="font-mono text-[8px] font-black text-black/55">{copy.paths.toUpperCase()}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {relatedTopics.map((topic) => <CstdLink key={topic.slug} href={getCstdTopicPath(topic, locale)} className="group border-l-2 border-[#0b6473] py-1 pl-4 text-sm font-semibold leading-6 text-black/70 transition-colors hover:border-black hover:text-black">{topic.number} / {topic.title[locale]}</CstdLink>)}
                  </div>
                </nav>
              ) : null}
            </div>
          </div>
        </article>

        <section className="border-b border-white/12 bg-[#080a0c] px-5 py-20 md:px-10 lg:px-16">
          <div className="mx-auto max-w-[1320px]">
            <div className="flex items-center gap-3 font-mono text-[9px] font-black text-[#24e0ff]"><Link2 aria-hidden="true" className="h-4 w-4" /> {copy.related.toUpperCase()}</div>
            <p className="mt-5 max-w-2xl text-2xl font-semibold text-white md:text-3xl">{copy.relatedSummary}</p>
            <div className="mt-10 border-t border-white/15">
              {relatedCases.map((caseStudy) => (
                <CstdLink key={caseStudy.slug} href={getCaseStudyPath(caseStudy, locale)} className="group flex items-center justify-between gap-6 border-b border-white/15 py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24e0ff]">
                  <div><p className="font-mono text-[8px] font-black text-[#68757b]">{caseStudy.kicker[locale].toUpperCase()}</p><p className="mt-2 text-xl font-semibold text-white md:text-2xl">{caseStudy.title[locale]}</p></div>
                  <ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 text-[#f4d431] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </CstdLink>
              ))}
            </div>
          </div>
        </section>

        <CstdLink href={getTechnicalNotePath(nextNote, locale)} className="group block bg-[#f4d431] px-5 py-16 text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-black md:px-10 lg:px-16">
          <div className="mx-auto flex max-w-[1320px] items-end justify-between gap-8">
            <div><p className="font-mono text-[9px] font-black">{copy.next.toUpperCase()}</p><p className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">{nextNote.title[locale]}</p></div>
            <ArrowUpRight aria-hidden="true" className="h-8 w-8 shrink-0 transition-transform group-hover:-translate-y-2 group-hover:translate-x-2" />
          </div>
        </CstdLink>
      </main>
      <StructuredData value={{
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: note.title[locale],
        description: note.summary[locale],
        datePublished: note.publishedAt,
        inLanguage: locale === "zh" ? "zh-CN" : "en-AU",
        image: `https://custard.top${note.image.src}`,
        url: `https://custard.top${getTechnicalNotePath(note, locale)}`,
        author: { "@type": "Person", name: locale === "zh" ? "奶黄包" : "Custard", url: `https://custard.top${locale === "en" ? "/en/about" : "/about"}` },
      }} />
    </CstdSiteChrome>
  );
}
