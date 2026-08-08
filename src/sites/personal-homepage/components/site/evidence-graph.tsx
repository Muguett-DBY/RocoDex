import { ArrowRight, Boxes, ExternalLink, FlaskConical, Link2 } from "lucide-react";
import type { CstdCaseStudy } from "../../content/case-studies";
import { cstdLabs, getLabPath } from "../../content/labs";
import { cstdSystems } from "../../content/systems";
import { cstdTechnicalNotes, getTechnicalNotePath } from "../../content/technical-notes";
import type { CstdLocale } from "../../content/content-types";
import { CstdLink } from "./cstd-link";

export function CstdEvidenceGraph({ entry, locale }: { entry: CstdCaseStudy; locale: CstdLocale }) {
  const capabilities = entry.capabilityIds.flatMap((id) => {
    const capability = cstdSystems.find((candidate) => candidate.id === id);
    return capability ? [capability] : [];
  });
  const notes = entry.relatedNoteSlugs.flatMap((slug) => {
    const note = cstdTechnicalNotes.find((candidate) => candidate.slug === slug);
    return note ? [note] : [];
  });
  const labs = entry.relatedLabSlugs.flatMap((slug) => {
    const lab = cstdLabs.find((candidate) => candidate.slug === slug);
    return lab ? [lab] : [];
  });
  const copy = locale === "zh" ? {
    eyebrow: "EVIDENCE GRAPH / 技术证据图谱",
    title: "从能力主张一路追到可运行事实。",
    capabilities: "能力区域",
    system: "真实系统",
    proof: "证据与复现",
    verified: "核验",
  } : {
    eyebrow: "EVIDENCE GRAPH / TECHNICAL PROVENANCE",
    title: "Trace every capability claim to running evidence.",
    capabilities: "Capability districts",
    system: "Shipped system",
    proof: "Evidence and reproduction",
    verified: "Verified",
  };

  return (
    <section data-cstd-evidence-graph className="border-b border-white/12 bg-[#06080a] px-5 py-20 md:px-10 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-[1320px]">
        <p className="font-mono text-[9px] font-black text-[#24e0ff]">{copy.eyebrow}</p>
        <h2 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-white md:text-5xl">{copy.title}</h2>
        <div className="mt-12 grid border-y border-white/15 lg:grid-cols-[1fr_4rem_1fr_4rem_1.35fr]">
          <div className="py-7 lg:pr-8">
            <div className="flex items-center gap-3 font-mono text-[8px] font-black text-[#78858a]"><Boxes aria-hidden="true" className="h-4 w-4" /> {copy.capabilities.toUpperCase()}</div>
            <div className="mt-5 border-t border-white/10">
              {capabilities.map((capability) => <div key={capability.id} className="border-b border-white/10 py-4"><p className="font-mono text-[8px] font-black text-[#f4d431]">{capability.code}</p><p className="mt-2 text-sm font-semibold text-white">{capability.title}</p></div>)}
            </div>
          </div>
          <div aria-hidden="true" className="hidden items-center justify-center border-x border-white/10 text-[#24e0ff] lg:flex"><ArrowRight className="h-5 w-5" /></div>
          <div className="border-t border-white/15 py-7 lg:border-t-0 lg:px-8">
            <p className="font-mono text-[8px] font-black text-[#78858a]">{copy.system.toUpperCase()}</p>
            <p className="mt-5 text-2xl font-semibold text-white">{entry.title[locale]}</p>
            <p className="mt-4 text-sm leading-7 text-[#9ca7aa]">{entry.summary[locale]}</p>
            <p className="mt-5 font-mono text-[8px] font-black text-[#3dff8f]">REV {entry.revision} / {copy.verified.toUpperCase()} {entry.updatedAt}</p>
          </div>
          <div aria-hidden="true" className="hidden items-center justify-center border-x border-white/10 text-[#f4d431] lg:flex"><ArrowRight className="h-5 w-5" /></div>
          <div className="border-t border-white/15 py-7 lg:border-t-0 lg:pl-8">
            <div className="flex items-center gap-3 font-mono text-[8px] font-black text-[#78858a]"><Link2 aria-hidden="true" className="h-4 w-4" /> {copy.proof.toUpperCase()}</div>
            <div className="mt-5 border-t border-white/10">
              {entry.artifacts.map((artifact) => {
                const href = artifact.href[locale];
                const content = <><span><span className="block font-mono text-[8px] font-black text-[#24e0ff]">{artifact.kind.toUpperCase()} / {artifact.verifiedAt}</span><span className="mt-2 block text-sm font-semibold text-white">{artifact.label[locale]}</span></span><ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0 text-[#f4d431]" /></>;
                const className = "flex items-start justify-between gap-5 border-b border-white/10 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24e0ff]";
                return href.startsWith("/") ? <CstdLink key={`${artifact.kind}-${href}`} href={href} className={className}>{content}</CstdLink> : <a key={`${artifact.kind}-${href}`} href={href} target="_blank" rel="noreferrer" className={className}>{content}</a>;
              })}
              {notes.map((note) => <CstdLink key={note.slug} href={getTechnicalNotePath(note, locale)} className="flex items-center justify-between gap-5 border-b border-white/10 py-4 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24e0ff]"><span className="flex items-center gap-3"><Link2 aria-hidden="true" className="h-4 w-4 text-[#24e0ff]" />{note.title[locale]}</span><ArrowRight aria-hidden="true" className="h-4 w-4 text-[#f4d431]" /></CstdLink>)}
              {labs.map((lab) => <CstdLink key={lab.slug} href={getLabPath(lab, locale)} className="flex items-center justify-between gap-5 border-b border-white/10 py-4 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24e0ff]"><span className="flex items-center gap-3"><FlaskConical aria-hidden="true" className="h-4 w-4 text-[#3dff8f]" />{lab.title[locale]}</span><ArrowRight aria-hidden="true" className="h-4 w-4 text-[#f4d431]" /></CstdLink>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
