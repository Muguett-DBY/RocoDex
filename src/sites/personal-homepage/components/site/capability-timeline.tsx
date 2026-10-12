import { ArrowUpRight, ChevronDown } from "lucide-react";
import type { CstdLocale } from "../../content/content-types";
import { cstdTimeline, cstdTimelineChapters, getCstdTimelineDateLabel, type CstdTimelineEntry } from "../../content/timeline";
import { cstdTimelineDetails } from "../../content/timeline-details";
import { CstdLink } from "./cstd-link";
import { TimelineExpandButton } from "./timeline-expand-button";

export const cstdTimelineRecordLabels = {
  coursework: { zh: "课程学习与练习", en: "Coursework & practice" },
  "team-coursework": { zh: "团队课程项目", en: "Team coursework" },
  "team-prototype": { zh: "团队原型", en: "Team prototype" },
  "personal-project": { zh: "个人项目 · AI 辅助", en: "Personal project · AI assisted" },
  "public-note": { zh: "公开技术札记", en: "Public technical note" },
  "research-plan": { zh: "研究准备 · 初步计划", en: "Research preparation · preliminary plan" },
  release: { zh: "个人项目发布 · AI 辅助", en: "Personal release · AI assisted" },
} as const;

function EvidenceLink({ entry, locale }: { entry: CstdTimelineEntry; locale: CstdLocale }) {
  const href = entry.evidence[locale];
  const self = `${locale === "en" ? "/en" : ""}/about#timeline-${entry.id}`;
  if (href === self) return null;
  const content = <>{locale === "zh" ? "看作品与相关记录" : "Explore the work"}<ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /></>;
  return href.startsWith("/")
    ? <CstdLink href={href} className="cstd-timeline-evidence">{content}</CstdLink>
    : <a href={href} className="cstd-timeline-evidence" target="_blank" rel="noreferrer">{content}</a>;
}

function TimelineEntry({ entry, locale }: { entry: CstdTimelineEntry; locale: CstdLocale }) {
  const detail = cstdTimelineDetails[entry.id];
  const copy = locale === "zh"
    ? { expand: "学了什么、做了什么、留下了什么", learning: "学了什么", practice: "具体做了什么", outputs: "作品与写作" }
    : { expand: "Learning, work and outputs", learning: "What I learned", practice: "What I worked on", outputs: "Outputs & writing" };
  return (
    <li id={`timeline-${entry.id}`} className="cstd-timeline-entry" data-cstd-timeline-entry={entry.id}>
      <div className="cstd-timeline-date"><span>{getCstdTimelineDateLabel(entry, locale)}</span>{entry.datePrecision === "half-year" && <small>{locale === "zh" ? "按学期记录" : "Recorded by study period"}</small>}</div>
      <article className="min-w-0">
        <p className="cstd-timeline-type">{cstdTimelineRecordLabels[entry.recordType][locale]}</p>
        <h4 className="cstd-timeline-title">{entry.title[locale]}</h4>
        <p className="cstd-timeline-summary">{entry.summary[locale]}</p>
        <ul className="cstd-timeline-tags" aria-label={locale === "zh" ? "技术与方法" : "Technologies and methods"}>{entry.technologies.map((term) => <li key={term}>{term}</li>)}</ul>
        <details data-cstd-timeline-detail className="cstd-timeline-detail">
          <summary><span>{copy.expand}</span><ChevronDown aria-hidden="true" className="h-4 w-4" /></summary>
          <dl>
            <div><dt>{copy.learning}</dt><dd>{detail.learning[locale]}</dd></div>
            <div><dt>{copy.practice}</dt><dd>{detail.practice[locale]}</dd></div>
            <div><dt>{copy.outputs}</dt><dd><ul>{detail.outputs.map((output) => <li key={output.en}>{output[locale]}</li>)}</ul></dd></div>
          </dl>
          <EvidenceLink entry={entry} locale={locale} />
        </details>
      </article>
    </li>
  );
}

export function CstdCapabilityTimeline({ locale, compact = false }: { locale: CstdLocale; compact?: boolean }) {
  if (compact) return (
    <ol data-cstd-capability-timeline="compact" className="cstd-timeline-compact">
      {cstdTimeline.slice(-3).map((entry) => <li key={entry.id}>
        <CstdLink href={`${locale === "en" ? "/en" : ""}/about#timeline-${entry.id}`}>
          <span className="cstd-timeline-date">{getCstdTimelineDateLabel(entry, locale)}</span>
          <div><h3>{entry.title[locale]}</h3><p>{entry.summary[locale]}</p></div>
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </CstdLink>
      </li>)}
    </ol>
  );
  const years = [...new Set(cstdTimeline.map((entry) => entry.date.slice(0, 4)))];
  const copy = locale === "zh" ? {
    intro: "从实验记录和数学练习，到数据分析、产品开发，再到正在准备的 AI 研究。这里把每一步学过的内容、实际做过的事和留下的作品放在一起。",
    dates: "能核对到月份的写到月；只有学期记录的保留上半年／下半年。课程报告、团队参与、公开札记和初步研究计划都注明性质。",
    navigation: "按年份查看经历", years: "年学习与实践", entries: "条经历记录", terms: "个技术与方法关键词",
  } : {
    intro: "From lab records and mathematics to data analysis, product development and the AI research I am now preparing for. Each entry connects what I learned, what I worked on and what I produced.",
    dates: "Dates use months where supported and half-years where only a study period is known. Coursework, team contributions, public notes and preliminary research plans are labelled throughout.",
    navigation: "Browse the timeline by year", years: "years of study & practice", entries: "timeline entries", terms: "technology & method keywords",
  };
  return (
    <div data-cstd-capability-timeline="full" className="cstd-timeline">
      <div className="cstd-timeline-intro"><p>{copy.intro}</p><p className="cstd-timeline-date-note">{copy.dates}</p></div>
      <dl className="cstd-timeline-stats">
        <div><dd>{years.length}</dd><dt>{copy.years}</dt></div>
        <div><dd>{cstdTimeline.length}</dd><dt>{copy.entries}</dt></div>
        <div><dd>{new Set(cstdTimeline.flatMap((entry) => entry.technologies)).size}</dd><dt>{copy.terms}</dt></div>
      </dl>
      <div className="cstd-timeline-layout">
        <aside className="cstd-timeline-rail">
          <nav aria-label={copy.navigation}>{years.map((year) => <a key={year} href={`#timeline-year-${year}`}><span>{year}</span><small>{String(cstdTimeline.filter((entry) => entry.date.startsWith(year)).length).padStart(2, "0")}</small></a>)}</nav>
          <TimelineExpandButton locale={locale} />
        </aside>
        <div className="min-w-0">{years.map((year) => <section key={year} id={`timeline-year-${year}`} className="cstd-timeline-year" aria-labelledby={`timeline-heading-${year}`}>
          <h3 id={`timeline-heading-${year}`}><span>{year}</span><span>{cstdTimelineChapters[year][locale]}</span></h3>
          <ol>{cstdTimeline.filter((entry) => entry.date.startsWith(year)).map((entry) => <TimelineEntry key={entry.id} entry={entry} locale={locale} />)}</ol>
        </section>)}</div>
      </div>
    </div>
  );
}
