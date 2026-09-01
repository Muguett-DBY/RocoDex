"use client";

import { ArrowDown, ArrowUpRight, Clock3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import type { CstdLocale, LocalizedText } from "../../content/content-types";
import { useCstdMotionMode } from "../../experience/motion-store";
import { getLocalizedCstdHref } from "../../infrastructure/i18n";
import { CstdChapterLink } from "../site/cstd-chapter-link";
import { CstdLink } from "../site/cstd-link";
import { ThemeCopy } from "../theme-copy";

type EntryLens = Readonly<{
  id: "signal" | "tour" | "archive";
  duration: string;
  title: LocalizedText;
  detail: LocalizedText;
  action: LocalizedText;
  target: "#proof" | "#systems" | "/work";
}>;

const entryLenses: readonly EntryLens[] = [
  {
    id: "signal",
    duration: "10 SEC",
    title: { zh: "先看结果", en: "See the outcome" },
    detail: { zh: "三项代表作、明确职责和可核验的线上入口。", en: "Three selected systems, clear ownership, and live destinations you can verify." },
    action: { zh: "直达作品与证据", en: "Jump to work and evidence" },
    target: "#proof",
  },
  {
    id: "tour",
    duration: "1 MIN",
    title: { zh: "看我怎么做系统", en: "See how I build systems" },
    detail: { zh: "从产品判断进入 AI、数据、交付和发布验证。", en: "Move from product judgment through AI, data, delivery, and release verification." },
    action: { zh: "进入能力地图", en: "Enter the systems map" },
    target: "#systems",
  },
  {
    id: "archive",
    duration: "5 MIN",
    title: { zh: "完整读一条证据链", en: "Read a complete evidence chain" },
    detail: { zh: "案例里保留约束、取舍、架构、失败边界和复盘。", en: "The case archive preserves constraints, trade-offs, architecture, failure boundaries, and reflection." },
    action: { zh: "打开完整案例库", en: "Open the full case archive" },
    target: "/work",
  },
];

const bootSteps = ["identity", "systems", "proof"] as const;

export function StudioEntryConsole({ locale }: { locale: CstdLocale }) {
  const motionMode = useCstdMotionMode();
  const [bootPhase, setBootPhase] = useState(0);
  const [activeLensId, setActiveLensId] = useState<EntryLens["id"]>("signal");
  const activeLens = useMemo(
    () => entryLenses.find((lens) => lens.id === activeLensId) ?? entryLenses[0],
    [activeLensId],
  );

  useEffect(() => {
    const delay = motionMode === "calm" ? 0 : 150;
    const timers = bootSteps.map((_, index) => window.setTimeout(() => setBootPhase(index + 1), delay + index * 180));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [motionMode]);

  function moveDepthFocus(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    const nextIndex = event.key === "ArrowRight"
      ? (currentIndex + 1) % entryLenses.length
      : event.key === "ArrowLeft"
        ? (currentIndex - 1 + entryLenses.length) % entryLenses.length
        : event.key === "Home"
          ? 0
          : event.key === "End"
            ? entryLenses.length - 1
            : null;
    if (nextIndex === null) return;

    event.preventDefault();
    const nextLens = entryLenses[nextIndex];
    setActiveLensId(nextLens.id);
    document.getElementById(`cstd-depth-${nextLens.id}`)?.focus();
  }

  const targetHref = activeLens.target === "/work" ? getLocalizedCstdHref(activeLens.target, locale) : activeLens.target;

  return (
    <aside data-cstd-entry-console data-cstd-entry-ready={bootPhase === bootSteps.length ? "true" : "false"} aria-label={locale === "zh" ? "主页浏览深度" : "Homepage viewing depth"}>
      <div data-cstd-entry-status className="flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] font-black">
          <ThemeCopy neon="STUDIO LINK" underworld={locale === "zh" ? "踏入工坊" : "ENTER THE FORGE"} astral={locale === "zh" ? "打开冒险日志" : "OPEN ADVENTURE LOG"} />
        </p>
        <span className="inline-flex items-center gap-2 font-mono text-[9px] font-black">
          <i aria-hidden="true" />
          {bootPhase === bootSteps.length ? (locale === "zh" ? "信号就绪" : "SIGNAL READY") : (locale === "zh" ? "正在建立现场" : "LINKING STUDIO")}
        </span>
      </div>

      <div aria-hidden="true" data-cstd-boot-track className="mt-4 grid grid-cols-3 gap-2">
        {bootSteps.map((step, index) => <span key={step} data-cstd-boot-step={step} data-cstd-boot-step-ready={bootPhase > index ? "true" : "false"} />)}
      </div>
      <span className="sr-only" role="status" aria-live="polite">
        {bootPhase === bootSteps.length ? (locale === "zh" ? "个人工作室信号已经就绪" : "Personal studio signal is ready") : ""}
      </span>

      <div role="tablist" aria-label={locale === "zh" ? "选择浏览深度" : "Choose viewing depth"} data-cstd-depth-tabs className="mt-5 grid grid-cols-3">
        {entryLenses.map((lens, index) => (
          <button
            key={lens.id}
            type="button"
            role="tab"
            id={`cstd-depth-${lens.id}`}
            aria-selected={activeLens.id === lens.id}
            aria-controls="cstd-depth-panel"
            tabIndex={activeLens.id === lens.id ? 0 : -1}
            data-cstd-depth-active={activeLens.id === lens.id ? "true" : "false"}
            onClick={() => setActiveLensId(lens.id)}
            onKeyDown={(event) => moveDepthFocus(event, index)}
          >
            {lens.duration}
          </button>
        ))}
      </div>

      <div id="cstd-depth-panel" role="tabpanel" aria-labelledby={`cstd-depth-${activeLens.id}`} data-cstd-depth-panel className="mt-5 min-h-36">
        <p className="flex items-center gap-2 font-mono text-[10px] font-black"><Clock3 aria-hidden="true" className="h-3.5 w-3.5" /> {activeLens.duration}</p>
        <h2 className="mt-3 text-xl font-semibold leading-tight">{activeLens.title[locale]}</h2>
        <p className="mt-2 text-sm leading-6">{activeLens.detail[locale]}</p>
        {activeLens.target.startsWith("#") ? (
          <CstdChapterLink href={targetHref as "#proof" | "#systems"} data-cstd-depth-action className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] font-black">
            {activeLens.action[locale]} <ArrowDown aria-hidden="true" className="h-4 w-4" />
          </CstdChapterLink>
        ) : (
          <CstdLink href={targetHref} eagerPrefetch data-cstd-depth-action className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] font-black">
            {activeLens.action[locale]} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </CstdLink>
        )}
      </div>
    </aside>
  );
}
