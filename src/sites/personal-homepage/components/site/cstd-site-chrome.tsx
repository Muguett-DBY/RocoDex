"use client";

import { BookOpen, BookOpenCheck, BriefcaseBusiness, FileText, FlaskConical, Gauge, Languages, Layers3, Network, UserRound } from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { CstdLocale } from "../../content/content-types";
import { CstdLink } from "./cstd-link";
import { CstdTelemetry } from "./cstd-telemetry";
import { SignalField, type CstdVisualMode } from "./signal-field";

const visualModeKey = "cstd-visual-budget";
const visualModeEvent = "cstd-visual-budget-change";
let volatileVisualMode: CstdVisualMode = "full";
type CstdReadingMode = "studio" | "quiet";
const readingModeKey = "cstd-reading-mode";
const readingModeEvent = "cstd-reading-mode-change";
let volatileReadingMode: CstdReadingMode = "studio";

function subscribeVisualMode(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(visualModeEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(visualModeEvent, onStoreChange);
  };
}

function getVisualModeSnapshot(): CstdVisualMode {
  try {
    const stored = window.localStorage.getItem(visualModeKey);
    return stored === "balanced" || stored === "calm" ? stored : "full";
  } catch {
    return volatileVisualMode;
  }
}

function getVisualModeServerSnapshot(): CstdVisualMode {
  return "full";
}

function getReadingModeSnapshot(): CstdReadingMode {
  try {
    return window.localStorage.getItem(readingModeKey) === "quiet" ? "quiet" : "studio";
  } catch {
    return volatileReadingMode;
  }
}

const navItems = [
  { href: "/work", label: { zh: "作品", en: "Work" }, icon: BriefcaseBusiness },
  { href: "/notes", label: { zh: "札记", en: "Notes" }, icon: BookOpen },
  { href: "/lab", label: { zh: "实验", en: "Lab" }, icon: FlaskConical },
  { href: "/topics", label: { zh: "主题", en: "Topics" }, icon: Layers3 },
  { href: "/map", label: { zh: "图谱", en: "Map" }, icon: Network },
  { href: "/about", label: { zh: "关于", en: "About" }, icon: UserRound },
] as const;

function localizedHref(href: string, locale: CstdLocale) {
  return locale === "en" ? `/en${href}` : href;
}

export function CstdSiteChrome({ locale, page, children }: { locale: CstdLocale; page: string; children: React.ReactNode }) {
  const visualMode = useSyncExternalStore(subscribeVisualMode, getVisualModeSnapshot, getVisualModeServerSnapshot);
  const [readingMode, setReadingMode] = useState<CstdReadingMode>("studio");
  const [controlsReady, setControlsReady] = useState(false);
  const readingSurface = page.startsWith("note-");
  const copy = useMemo(() => locale === "zh" ? {
    guide: "技术向导",
    mode: "视觉预算",
    now: "现在",
    resume: "履历",
    statement: "产品 · 数据 · AI · 研究 · 视觉工程",
    back: "返回电影化主页",
    reading: "安静阅读",
  } : {
    guide: "Technical guide",
    mode: "Visual budget",
    now: "Now",
    resume: "Resume",
    statement: "Product · Data · AI · Research · Visual engineering",
    back: "Return to cinematic home",
    reading: "Quiet reading",
  }, [locale]);

  useEffect(() => {
    const syncReadingMode = () => {
      setReadingMode(getReadingModeSnapshot());
      setControlsReady(true);
    };
    const frame = window.requestAnimationFrame(syncReadingMode);

    window.addEventListener("storage", syncReadingMode);
    window.addEventListener(readingModeEvent, syncReadingMode);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("storage", syncReadingMode);
      window.removeEventListener(readingModeEvent, syncReadingMode);
    };
  }, []);

  function cycleVisualMode() {
    const next: CstdVisualMode = visualMode === "full" ? "balanced" : visualMode === "balanced" ? "calm" : "full";
    volatileVisualMode = next;
    try {
      window.localStorage.setItem(visualModeKey, next);
    } catch {
      // The in-session switch remains usable when storage is unavailable.
    }
    window.dispatchEvent(new Event(visualModeEvent));
    window.dispatchEvent(new CustomEvent("cstd:metric", { detail: { name: `visual_${next}`, value: 1 } }));
  }

  function toggleReadingMode() {
    const next: CstdReadingMode = readingMode === "studio" ? "quiet" : "studio";
    setReadingMode(next);
    volatileReadingMode = next;
    try {
      window.localStorage.setItem(readingModeKey, next);
    } catch {
      // Keep the in-session mode available without persistent storage.
    }
    window.dispatchEvent(new Event(readingModeEvent));
    window.dispatchEvent(new CustomEvent("cstd:metric", { detail: { name: `reading_${next}`, value: 1 } }));
  }

  return (
    <div data-cstd-deep-shell data-cstd-controls-ready={controlsReady ? "true" : "false"} data-cstd-visual-mode={visualMode} data-cstd-reading-mode={readingSurface ? readingMode : "studio"} className="relative isolate min-h-screen overflow-x-clip bg-[#07090b] text-[#f2efe7]">
      <a href="#cstd-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-white focus:px-4 focus:py-3 focus:text-black">{locale === "zh" ? "跳到主要内容" : "Skip to content"}</a>
      <SignalField mode={visualMode} />
      <div data-cstd-shell-overlay aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] bg-[linear-gradient(180deg,rgba(7,9,11,0.18),rgba(7,9,11,0.82)_80%)]" />
      <div aria-hidden="true" className="cstd-route-progress fixed inset-x-0 top-0 z-[80] h-0.5 origin-left bg-[#f4d431] shadow-[0_0_16px_rgba(244,212,49,0.6)]" />

      <header className="sticky top-0 z-50 border-b border-white/12 bg-[#07090b]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1540px] items-center gap-4 px-4 md:px-8 lg:px-12">
          <CstdLink href="/" className="group flex shrink-0 items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]" title={copy.back}>
            <span className="flex h-9 w-9 items-center justify-center bg-[#f4d431] font-mono text-[11px] font-black text-[#050709] [clip-path:polygon(0_0,100%_0,100%_72%,72%_100%,0_100%)]">CS</span>
            <span className="hidden sm:block">
              <span className="block font-mono text-xs font-black text-white">CSTD://ARCHIVE</span>
              <span className="mt-0.5 block font-mono text-[11px] font-bold text-[#68757b]">{copy.statement}</span>
            </span>
          </CstdLink>

          <nav aria-label={locale === "zh" ? "主导航" : "Primary navigation"} className="ml-auto hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <CstdLink key={item.href} href={localizedHref(item.href, locale)} className="flex h-9 items-center gap-2 px-3 font-mono text-[11px] font-black text-[#9aa4a8] transition-colors hover:bg-white/5 hover:text-[#f4d431] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4d431]">
                  <Icon aria-hidden="true" className="h-3.5 w-3.5" /> {item.label[locale]}
                </CstdLink>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-3">
            {readingSurface ? (
              <button type="button" disabled={!controlsReady} onClick={toggleReadingMode} aria-pressed={readingMode === "quiet"} aria-label={`${copy.reading}: ${readingMode}`} title={copy.reading} className="flex h-9 w-9 items-center justify-center border border-white/15 text-[#9aa4a8] transition-colors hover:border-[#3dff8f] hover:text-[#3dff8f] aria-pressed:border-[#3dff8f] aria-pressed:bg-[#3dff8f] aria-pressed:text-[#050709] disabled:cursor-wait disabled:opacity-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3dff8f]">
                <BookOpenCheck aria-hidden="true" className="h-4 w-4" />
              </button>
            ) : null}
            <CstdLink href={locale === "zh" ? "/en" : "/"} aria-label={locale === "zh" ? "Switch to English" : "切换到中文"} title={locale === "zh" ? "English" : "中文"} className="flex h-9 w-9 items-center justify-center border border-white/15 text-[#9aa4a8] transition-colors hover:border-[#24e0ff] hover:text-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24e0ff]">
              <Languages aria-hidden="true" className="h-4 w-4" />
            </CstdLink>
            <button type="button" disabled={!controlsReady} onClick={cycleVisualMode} aria-label={`${copy.mode}: ${visualMode}`} title={`${copy.mode}: ${visualMode}`} className="flex h-9 w-9 items-center justify-center border border-white/15 text-[#9aa4a8] transition-colors hover:border-[#f4d431] hover:text-[#f4d431] disabled:cursor-wait disabled:opacity-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4d431]">
              <Gauge aria-hidden="true" className="h-4 w-4" />
            </button>
            <CstdLink href={localizedHref("/map", locale)} aria-label={copy.guide} title={copy.guide} className="flex h-9 w-9 items-center justify-center border border-[#24e0ff]/45 bg-[#24e0ff]/10 text-[#24e0ff] transition-colors hover:bg-[#24e0ff] hover:text-[#050709] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24e0ff]">
              <Network aria-hidden="true" className="h-4 w-4" />
            </CstdLink>
          </div>
        </div>

        <nav aria-label={locale === "zh" ? "移动导航" : "Mobile navigation"} className="flex h-11 items-center gap-1 overflow-x-auto border-t border-white/8 px-3 lg:hidden">
          {navItems.map((item) => (
            <CstdLink key={item.href} href={localizedHref(item.href, locale)} className="shrink-0 px-3 py-2 font-mono text-[11px] font-black text-[#9aa4a8] hover:text-[#f4d431]">{item.label[locale]}</CstdLink>
          ))}
          <CstdLink href={localizedHref("/now", locale)} className="shrink-0 px-3 py-2 font-mono text-[11px] font-black text-[#9aa4a8] hover:text-[#f4d431]">{copy.now}</CstdLink>
        </nav>
      </header>

      <div className="relative z-10">{children}</div>

      <footer className="relative z-10 border-t border-white/12 bg-[#050709]/90 px-5 py-12 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[1540px] gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-mono text-[11px] font-black text-[#24e0ff]">CSTD / SYDNEY NODE / 2026</p>
            <p className="mt-3 max-w-2xl text-xl font-semibold text-[#dce1e2]">{copy.statement}</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-3 font-mono text-[11px] font-black text-[#8f9ba0]">
            <CstdLink href={localizedHref("/now", locale)} className="hover:text-[#f4d431]">{copy.now}</CstdLink>
            <CstdLink href={localizedHref("/resume", locale)} className="inline-flex items-center gap-2 hover:text-[#f4d431]"><FileText aria-hidden="true" className="h-3.5 w-3.5" /> {copy.resume}</CstdLink>
            <CstdLink href={localizedHref("/map", locale)} className="hover:text-[#24e0ff]">MAP</CstdLink>
            <a href={locale === "zh" ? "/rss.xml" : "/rss.xml?lang=en"} className="hover:text-[#f4d431]">RSS</a>
          </div>
        </div>
      </footer>

      <CstdTelemetry page={page} />
    </div>
  );
}
