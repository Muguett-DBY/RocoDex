import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BookOpen, FlaskConical, Layers3 } from "lucide-react";
import type { CSSProperties } from "react";
import { cstdCaseStudies, getCaseStudyPath } from "../../content/case-studies";
import type { CstdLocale } from "../../content/content-types";
import { cstdLabs, getLabPath } from "../../content/labs";
import { cstdTechnicalNotes, getTechnicalNotePath } from "../../content/technical-notes";
import { cstdTopics, getCstdTopic, getCstdTopicPath, getCstdTopicSequence } from "../../content/topics";
import { CstdLink } from "../site/cstd-link";
import { CstdSiteChrome } from "../site/cstd-site-chrome";
import { StructuredData } from "../site/structured-data";
import { CstdPageHero } from "./page-hero";

const topicsHero = {
  src: "/cstd-universe/cstd-knowledge-loom-v2.webp",
  alt: { zh: "由技术档案、工程图和数据纤维构成的知识织机", en: "A knowledge loom made from technical archives, engineering diagrams, and data fibers" },
  position: "42% 50%",
} as const;

export const cstdTopicStaticParams = cstdTopics.map((topic) => ({ slug: topic.slug }));

export function CstdTopicsIndexPage({ locale }: { locale: CstdLocale }) {
  const copy = locale === "zh" ? {
    eyebrow: "04 / CURATED PATHS",
    title: "不按技术名词堆栈，按工程判断组织证据。",
    summary: "五条主题路径把案例、技术札记和可运行实验连接起来。每条路径都从一个判断出发，继续通向实现与验证。",
    open: "进入主题",
  } : {
    eyebrow: "04 / CURATED PATHS",
    title: "Evidence organized by engineering judgment, not technology labels.",
    summary: "Five curated paths connect shipped cases, technical notes, and executable labs. Each begins with a judgment and continues into implementation and verification.",
    open: "Open topic",
  };

  return (
    <CstdSiteChrome locale={locale} page="topics-index">
      <main id="cstd-main">
        <CstdPageHero locale={locale} eyebrow={copy.eyebrow} title={copy.title} summary={copy.summary} image={topicsHero} compact />
        <section className="border-b border-white/12 bg-[#07090b]/94">
          {cstdTopics.map((topic) => (
            <CstdLink key={topic.slug} href={getCstdTopicPath(topic, locale)} className="group relative block min-h-[30rem] overflow-hidden border-t border-white/12 first:border-t-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#24e0ff]" style={{ viewTransitionName: `cstd-topic-${topic.slug}` } as CSSProperties}>
              <Image src={topic.image.src} alt={topic.image.alt[locale]} fill sizes="100vw" className="object-cover opacity-38 transition-[transform,opacity,filter] duration-700 group-hover:scale-[1.025] group-hover:opacity-55" style={{ objectPosition: topic.image.position ?? "50% 50%" }} />
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.97)_0%,rgba(5,7,9,0.78)_50%,rgba(5,7,9,0.26)_100%)]" />
              <div className="relative mx-auto flex min-h-[30rem] max-w-[1540px] items-end px-5 py-14 md:px-10 lg:px-16">
                <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.65fr)] lg:items-end">
                  <div>
                    <p className="font-mono text-[9px] font-black" style={{ color: topic.accent }}>PATH / {topic.number}</p>
                    <h2 className="mt-5 max-w-4xl text-4xl font-semibold leading-[0.95] text-white md:text-6xl">{topic.title[locale]}</h2>
                    <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-[#d8ddde]">{topic.thesis[locale]}</p>
                  </div>
                  <div>
                    <p className="text-sm leading-7 text-[#9da8ac]">{topic.summary[locale]}</p>
                    <span className="mt-6 inline-flex items-center gap-3 border-b border-[#f4d431] pb-2 font-mono text-[9px] font-black text-[#f4d431] transition-[gap,color] group-hover:gap-5 group-hover:text-white">{copy.open} <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></span>
                  </div>
                </div>
              </div>
            </CstdLink>
          ))}
        </section>
      </main>
      <StructuredData value={{ "@context": "https://schema.org", "@type": "CollectionPage", name: copy.title, url: `https://custard.top${locale === "en" ? "/en/topics" : "/topics"}`, hasPart: cstdTopics.map((topic) => ({ "@type": "LearningResource", name: topic.title[locale], url: `https://custard.top${getCstdTopicPath(topic, locale)}` })) }} />
    </CstdSiteChrome>
  );
}

export function CstdTopicPage({ locale, slug }: { locale: CstdLocale; slug: string }) {
  const topic = getCstdTopic(slug);
  if (!topic) notFound();
  const cases = topic.caseSlugs.flatMap((caseSlug) => cstdCaseStudies.filter((entry) => entry.slug === caseSlug));
  const notes = topic.noteSlugs.flatMap((noteSlug) => cstdTechnicalNotes.filter((entry) => entry.slug === noteSlug));
  const labs = topic.labSlugs.flatMap((labSlug) => cstdLabs.filter((entry) => entry.slug === labSlug));
  const sequence = getCstdTopicSequence(topic.slug)!;
  const copy = locale === "zh" ? { back: "全部主题", cases: "真实系统", notes: "工程札记", labs: "可运行实验", open: "打开证据", path: "连续判断路径", next: "下一条路径" } : { back: "All topics", cases: "Shipped systems", notes: "Engineering notes", labs: "Executable labs", open: "Open evidence", path: "Continuous judgment path", next: "Next path" };

  return (
    <CstdSiteChrome locale={locale} page={`topic-${topic.slug}`}>
      <main id="cstd-main">
        <CstdPageHero locale={locale} eyebrow={`CURATED PATH / ${topic.number}`} title={topic.title[locale]} summary={topic.thesis[locale]} image={topic.image} compact transitionName={`cstd-topic-${topic.slug}`} />
        <section className="border-b border-white/12 bg-[#f1eee5] px-5 py-14 text-[#090b0d] md:px-10 lg:px-16 lg:py-20">
          <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
            <CstdLink href={locale === "en" ? "/en/topics" : "/topics"} className="inline-flex h-fit items-center gap-2 font-mono text-[9px] font-black text-[#0b6473] hover:text-black"><ArrowLeft aria-hidden="true" className="h-4 w-4" /> {copy.back}</CstdLink>
            <p className="max-w-4xl text-2xl font-semibold leading-10 md:text-4xl md:leading-tight">{topic.summary[locale]}</p>
          </div>
        </section>

        <nav data-cstd-topic-path aria-label={copy.path} className="border-b border-white/12 bg-[#07090b] px-5 py-7 md:px-10 lg:px-16">
          <div className="mx-auto max-w-[1320px]">
            <div className="flex items-center justify-between gap-5 font-mono text-[8px] font-black text-[#718087]"><span>{copy.path.toUpperCase()}</span><span>{String(sequence.position).padStart(2, "0")} / {String(sequence.total).padStart(2, "0")}</span></div>
            <ol className="mt-4 grid gap-1 sm:grid-cols-5">
              {cstdTopics.map((entry) => <li key={entry.slug}><CstdLink href={getCstdTopicPath(entry, locale)} aria-current={entry.slug === topic.slug ? "step" : undefined} className="group block border-t border-white/15 pt-3 font-mono text-[8px] font-black text-[#6f7b80] transition-colors hover:border-[#24e0ff] hover:text-white aria-[current=step]:border-[#f4d431] aria-[current=step]:text-[#f4d431]"><span className="mr-2">{entry.number}</span>{entry.title[locale]}</CstdLink></li>)}
            </ol>
          </div>
        </nav>

        <TopicEvidenceSection icon={Layers3} eyebrow={copy.cases} accent={topic.accent}>
          {cases.map((entry) => <TopicEvidenceLink key={entry.slug} href={getCaseStudyPath(entry, locale)} label={entry.kicker[locale]} title={entry.title[locale]} summary={entry.summary[locale]} action={copy.open} />)}
        </TopicEvidenceSection>
        <TopicEvidenceSection icon={BookOpen} eyebrow={copy.notes} accent="#24e0ff">
          {notes.map((entry) => <TopicEvidenceLink key={entry.slug} href={getTechnicalNotePath(entry, locale)} label={`${entry.category[locale]} / ${entry.readingMinutes} MIN`} title={entry.title[locale]} summary={entry.summary[locale]} action={copy.open} />)}
        </TopicEvidenceSection>
        <TopicEvidenceSection icon={FlaskConical} eyebrow={copy.labs} accent="#3dff8f">
          {labs.map((entry) => <TopicEvidenceLink key={entry.slug} href={getLabPath(entry, locale)} label={`LAB ${entry.number} / ${entry.version}`} title={entry.title[locale]} summary={entry.principle[locale]} action={copy.open} />)}
        </TopicEvidenceSection>

        <CstdLink href={getCstdTopicPath(sequence.next, locale)} className="group relative block min-h-[28rem] overflow-hidden border-b border-white/12 px-5 py-16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#f4d431] md:px-10 lg:px-16">
          <Image src="/cstd-universe/cstd-quiet-archive-v4.webp" alt={locale === "zh" ? "安静知识档案中的连续阅读路径" : "A continuous reading path through the quiet knowledge archive"} fill sizes="100vw" className="object-cover object-[44%_50%] opacity-55 transition-transform duration-700 group-hover:scale-[1.025]" />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.98),rgba(5,7,9,0.78)_55%,rgba(5,7,9,0.25))]" />
          <div className="relative mx-auto flex min-h-[20rem] max-w-[1320px] items-end justify-between gap-8"><div><p className="font-mono text-[9px] font-black text-[#3dff8f]">{copy.next.toUpperCase()} / {sequence.next.number}</p><p className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-white md:text-6xl">{sequence.next.title[locale]}</p><p className="mt-5 max-w-2xl text-base leading-8 text-[#b8c1c4]">{sequence.next.thesis[locale]}</p></div><ArrowUpRight aria-hidden="true" className="h-9 w-9 shrink-0 text-[#f4d431] transition-transform group-hover:-translate-y-2 group-hover:translate-x-2" /></div>
        </CstdLink>
      </main>
      <StructuredData value={{ "@context": "https://schema.org", "@type": "LearningResource", name: topic.title[locale], description: topic.summary[locale], url: `https://custard.top${getCstdTopicPath(topic, locale)}`, hasPart: [...cases.map((entry) => ({ "@type": "CreativeWork", name: entry.title[locale], url: `https://custard.top${getCaseStudyPath(entry, locale)}` })), ...notes.map((entry) => ({ "@type": "TechArticle", name: entry.title[locale], url: `https://custard.top${getTechnicalNotePath(entry, locale)}` }))] }} />
    </CstdSiteChrome>
  );
}

function TopicEvidenceSection({ icon: Icon, eyebrow, accent, children }: { icon: typeof Layers3; eyebrow: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-white/12 bg-[#080a0c] px-5 py-16 md:px-10 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-[1320px]">
        <h2 className="flex items-center gap-3 font-mono text-[9px] font-black uppercase" style={{ color: accent }}><Icon aria-hidden="true" className="h-4 w-4" /> {eyebrow}</h2>
        <div className="mt-7 border-t border-white/15">{children}</div>
      </div>
    </section>
  );
}

function TopicEvidenceLink({ href, label, title, summary, action }: { href: string; label: string; title: string; summary: string; action: string }) {
  return (
    <CstdLink href={href} className="group grid gap-4 border-b border-white/15 py-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#24e0ff] md:grid-cols-[minmax(0,0.72fr)_minmax(20rem,1.28fr)_auto] md:items-center md:gap-8">
      <div><p className="font-mono text-[8px] font-black text-[#738086]">{label.toUpperCase()}</p><h3 className="mt-3 text-2xl font-semibold text-white md:text-3xl">{title}</h3></div>
      <p className="text-sm leading-7 text-[#96a2a6]">{summary}</p>
      <span className="inline-flex items-center gap-2 font-mono text-[9px] font-black text-[#f4d431] transition-[gap,color] group-hover:gap-4 group-hover:text-white">{action} <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></span>
    </CstdLink>
  );
}
