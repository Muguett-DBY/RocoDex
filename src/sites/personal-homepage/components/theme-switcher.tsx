"use client";

import { Check, ChevronDown, Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CstdLocale } from "../content/content-types";
import { cstdThemes, getCstdThemeMeta, setCstdTheme, useCstdTheme } from "../experience/theme-store";

export function ThemeSwitcher({ locale = "zh" }: { locale?: CstdLocale }) {
  const theme = useCstdTheme();
  const current = getCstdThemeMeta(theme);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const copy = locale === "zh"
    ? { trigger: "切换视觉主题", menu: "选择一个视觉世界", selected: "当前主题" }
    : { trigger: "Switch visual theme", menu: "Choose a visual world", selected: "Current theme" };

  useEffect(() => {
    if (!open) return;
    const closeOnPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnPointerDown);
    document.addEventListener("keydown", closeOnKeyDown);
    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      document.removeEventListener("keydown", closeOnKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        data-cstd-theme-switcher
        data-cstd-theme-active={theme}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${copy.trigger}: ${current.label}`}
        title={`${copy.trigger}: ${current.label}`}
        onClick={() => setOpen((value) => !value)}
        className="cstd-theme-switcher-trigger flex h-9 w-9 items-center justify-center border border-white/15 text-[#aab3b6] transition-colors hover:border-[#f4d431] hover:text-[#f4d431] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
      >
        <Palette aria-hidden="true" className="h-4 w-4" />
        <span data-cstd-theme-label className="sr-only">{current.label}</span>
      </button>

      {open ? (
        <div
          data-cstd-theme-menu
          role="menu"
          aria-label={copy.menu}
          className="cstd-theme-menu absolute right-0 top-[calc(100%+0.7rem)] z-[90] w-[min(19rem,calc(100vw-2rem))] border border-white/15 bg-[#080b0d]/[.97] p-2 shadow-[0_22px_70px_rgba(0,0,0,0.36)] backdrop-blur-xl"
        >
          <div className="px-2 pb-2 pt-1">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#68757b]">{copy.menu}</p>
          </div>
          <div className="grid gap-1">
            {cstdThemes.map((candidate) => {
              const selected = candidate.id === theme;
              return (
                <button
                  key={candidate.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  data-cstd-theme-option={candidate.id}
                  onClick={() => {
                    setCstdTheme(candidate.id);
                    setOpen(false);
                  }}
                  className="cstd-theme-option flex w-full items-start gap-3 border border-transparent px-2.5 py-2.5 text-left transition-colors hover:border-white/15 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#f4d431]"
                >
                  <span aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border border-white/35" style={{ background: candidate.swatch, boxShadow: `0 0 16px ${candidate.swatch}55` }} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-black tracking-[0.08em] text-[#f2efe7]">{locale === "zh" ? candidate.zhLabel : candidate.label}</span>
                      {selected ? <Check aria-label={copy.selected} className="h-3.5 w-3.5 shrink-0 text-[#f4d431]" /> : null}
                    </span>
                    <span className="mt-1 block text-[11px] leading-4 text-[#8f9ba0]">{candidate.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex items-center gap-1.5 border-t border-white/10 px-2 pt-2 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#68757b]">
            <ChevronDown aria-hidden="true" className="h-3 w-3 rotate-[-90deg]" />
            <span>{current.label}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
