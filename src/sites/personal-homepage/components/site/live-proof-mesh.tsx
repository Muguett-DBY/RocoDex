import { ArrowUpRight, CheckCircle2, FileJson2, RadioTower } from "lucide-react";
import { cstdArtBible } from "../../content/art-bible";
import type { CstdLocale } from "../../content/content-types";
import type { CstdProofMeshEntry } from "../../content/content-models";
import { cstdProofMesh, getCstdProofFreshness } from "../../content/proof-mesh";
import { CstdLink } from "./cstd-link";

const freshnessCopy = {
  zh: { current: "当前", aging: "待复核", stale: "已过期" },
  en: { current: "CURRENT", aging: "REVIEW", stale: "STALE" },
} as const;

export function LiveProofMesh({ locale, caseSlug }: { locale: CstdLocale; caseSlug?: string }) {
  const entries: readonly CstdProofMeshEntry[] = caseSlug ? cstdProofMesh.filter((entry) => entry.caseSlug === caseSlug) : cstdProofMesh;
  const artifactTotal = entries.reduce<number>((total, entry) => total + entry.artifactCount, 0);
  return (
    <section data-cstd-proof-mesh data-cstd-proof-mesh-size={caseSlug ? "case" : "global"} aria-labelledby={`proof-mesh-${caseSlug ?? "global"}`} className="border-y border-white/12 bg-[#050709]/92 px-5 py-10 text-[#f2efe7] backdrop-blur-xl md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1540px]">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="flex items-center gap-2 font-mono text-[11px] font-black text-[#3dff8f]"><RadioTower aria-hidden="true" className="h-4 w-4" /> LIVE PROOF MESH / BUILD-TIME</p>
            <h2 id={`proof-mesh-${caseSlug ?? "global"}`} className="mt-3 text-2xl font-semibold md:text-3xl">{locale === "zh" ? "不是项目声明，而是可追踪的证据网络。" : "Not project claims, but a traceable evidence network."}</h2>
          </div>
          <div className="flex items-center gap-5 font-mono text-[11px] font-black text-[#778388]"><span>{entries.length} NODES</span><span>{artifactTotal} ARTIFACTS</span><CstdLink href={locale === "zh" ? "/proof.json" : "/en/proof.json"} className="inline-flex items-center gap-2 text-[#24e0ff] hover:text-white"><FileJson2 aria-hidden="true" className="h-3.5 w-3.5" /> JSON</CstdLink></div>
        </header>
        <div className="mt-7 grid border-l border-t border-white/12 sm:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry) => {
            const freshness = getCstdProofFreshness(entry.verifiedAt);
            const accent = cstdArtBible[entry.capabilityIds[0]].accent;
            return (
              <CstdLink key={entry.id} href={locale === "en" ? `/en/work/${entry.caseSlug}` : `/work/${entry.caseSlug}`} data-cstd-proof-node={entry.caseSlug} className="group min-w-0 border-b border-r border-white/12 bg-white/[0.018] p-5 transition-colors hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#24e0ff]">
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex items-center gap-2 font-mono text-[11px] font-black" style={{ color: accent }}><CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />{entry.status.toUpperCase()} / {entry.coverageScore}</span>
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-[#68757b] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <h3 className="mt-4 truncate text-lg font-semibold text-white">{entry.title[locale]}</h3>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[11px] font-black text-[#778388]"><span>{entry.artifactCount} ARTIFACTS</span><span>{entry.artifactKinds.length} TYPES</span><span data-cstd-proof-freshness={freshness}>{freshnessCopy[locale][freshness]} / {entry.verifiedAt}</span></div>
              </CstdLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
