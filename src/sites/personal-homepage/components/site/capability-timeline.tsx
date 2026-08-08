import { ArrowUpRight, BookOpen, GitCommitHorizontal, GraduationCap, ScanSearch } from "lucide-react";
import type { CstdLocale } from "../../content/content-types";
import { cstdTimeline } from "../../content/timeline";
import { CstdLink } from "./cstd-link";

const icons = {
  education: GraduationCap,
  project: BookOpen,
  diagnosis: ScanSearch,
  release: GitCommitHorizontal,
} as const;

export function CstdCapabilityTimeline({ locale, compact = false }: { locale: CstdLocale; compact?: boolean }) {
  const entries = compact ? cstdTimeline.slice(-3) : cstdTimeline;
  return (
    <ol data-cstd-capability-timeline className="border-t border-white/15">
      {entries.map((entry) => {
        const Icon = icons[entry.kind];
        const content = (
          <>
            <div className="flex items-center gap-3"><Icon aria-hidden="true" className="h-4 w-4 text-[#24e0ff]" /><span className="font-mono text-[8px] font-black text-[#738086]">{entry.kind.toUpperCase()}</span></div>
            <div><p className="text-xl font-semibold leading-tight text-white md:text-2xl">{entry.title[locale]}</p><p className="mt-3 max-w-3xl text-sm leading-7 text-[#909ca0]">{entry.summary[locale]}</p></div>
            <div className="flex items-start justify-between gap-4 font-mono text-[8px] font-black text-[#f4d431]"><span>{entry.date}</span><ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div>
          </>
        );
        const className = "group grid gap-5 border-b border-white/15 py-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#24e0ff] md:grid-cols-[8rem_minmax(0,1fr)_8rem]";
        return entry.evidence[locale].startsWith("/") ? <li key={entry.date}><CstdLink href={entry.evidence[locale]} className={className}>{content}</CstdLink></li> : <li key={entry.date}><a href={entry.evidence[locale]} target="_blank" rel="noreferrer" className={className}>{content}</a></li>;
      })}
    </ol>
  );
}
