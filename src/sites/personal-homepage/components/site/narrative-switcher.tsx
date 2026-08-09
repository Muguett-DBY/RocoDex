"use client";

import type { CstdLocale } from "../../content/content-types";
import { cstdNarratives, type CstdNarrativeMode } from "../../content/narratives";

export function NarrativeSwitcher({ locale = "zh", mode, onChange }: { locale?: CstdLocale; mode: CstdNarrativeMode; onChange: (mode: CstdNarrativeMode) => void }) {
  return (
    <div data-cstd-narrative-switcher>
      <p className="font-mono text-[8px] font-black text-[#9aa4a8]">{locale === "zh" ? "选择观看路径" : "CHOOSE A VIEWING PATH"}</p>
      <div className="mt-3 inline-grid grid-cols-3 border border-white/18 bg-[#050709]/70 p-1 backdrop-blur-md" role="radiogroup" aria-label={locale === "zh" ? "访客叙事模式" : "Visitor narrative mode"}>
        {cstdNarratives.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="radio"
            aria-checked={mode === entry.id}
            data-cstd-narrative={entry.id}
            onClick={() => onChange(entry.id)}
            className="min-w-20 px-3 py-2 font-mono text-[9px] font-black text-[#8f9ba0] transition-[background-color,color] hover:text-white aria-checked:bg-[#f4d431] aria-checked:text-[#050709] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24e0ff] md:min-w-24 md:text-[10px]"
          >
            {entry.shortLabel[locale]}
          </button>
        ))}
      </div>
    </div>
  );
}
