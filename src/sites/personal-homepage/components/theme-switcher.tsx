"use client";

import { Check, CircuitBoard, Gamepad2, Newspaper, Palette, ScrollText, X } from "lucide-react";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import type { CstdLocale } from "../content/content-types";
import { cstdThemes, getCstdThemeMeta, setCstdTheme, useCstdTheme, type CstdThemeId } from "../experience/theme-store";

const themeIcons: Record<CstdThemeId, ComponentType<{ className?: string; "aria-hidden"?: "true" }>> = {
  "neon-district": CircuitBoard,
  "ink-protocol": ScrollText,
  "press-room": Newspaper,
  "pixel-quest": Gamepad2,
};

export function ThemeSwitcher({ locale = "zh" }: { locale?: CstdLocale }) {
  const theme = useCstdTheme();
  const current = getCstdThemeMeta(theme);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 72, right: 16 });
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const copy = locale === "zh"
    ? { trigger: "切换视觉世界", menu: "选择视觉世界", selected: "当前世界", close: "关闭主题选择" }
    : { trigger: "Switch visual world", menu: "Choose a visual world", selected: "Current world", close: "Close theme picker" };
  const visibleLabel = locale === "zh" ? current.zhLabel : current.label;

  useEffect(() => {
    if (!open) return;
    const syncPosition = () => {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      const menuHeight = menuRef.current?.getBoundingClientRect().height ?? 440;
      const preferredTop = rect.bottom + 12;
      const top = Math.max(12, Math.min(preferredTop, window.innerHeight - menuHeight - 12));
      setPosition({ top, right: Math.max(12, window.innerWidth - rect.right) });
    };
    const closeOnPointerDown = (event: PointerEvent) => {
      const node = event.target as Node;
      if (!rootRef.current?.contains(node) && !menuRef.current?.contains(node)) setOpen(false);
    };
    const closeOnKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    syncPosition();
    window.addEventListener("resize", syncPosition);
    window.addEventListener("scroll", syncPosition, { passive: true });
    document.addEventListener("pointerdown", closeOnPointerDown);
    document.addEventListener("keydown", closeOnKeyDown);
    return () => {
      window.removeEventListener("resize", syncPosition);
      window.removeEventListener("scroll", syncPosition);
      document.removeEventListener("pointerdown", closeOnPointerDown);
      document.removeEventListener("keydown", closeOnKeyDown);
    };
  }, [open]);

  const menu = open ? (
    <div
      ref={menuRef}
      data-cstd-theme-menu
      data-cstd-theme-menu-theme={theme}
      role="menu"
      aria-label={copy.menu}
      style={{ top: position.top, right: position.right }}
      className="cstd-theme-menu fixed z-[190] w-[min(26rem,calc(100vw-1.5rem))] border p-2 shadow-[0_24px_80px_rgba(0,0,0,0.32)]"
    >
      <div className="flex items-center justify-between border-b px-2 pb-2 pt-1">
        <div>
          <p className="cstd-theme-menu-kicker text-[10px] font-black uppercase">{copy.menu}</p>
          <p className="cstd-theme-menu-current mt-1 text-xs">{visibleLabel}</p>
        </div>
        <button type="button" aria-label={copy.close} onClick={() => setOpen(false)} className="cstd-theme-menu-close flex h-8 w-8 items-center justify-center border">
          <X aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-2 grid gap-1.5">
        {cstdThemes.map((candidate, index) => {
          const selected = candidate.id === theme;
          const Icon = themeIcons[candidate.id];
          return (
            <button
              key={candidate.id}
              type="button"
              role="menuitemradio"
              aria-checked={selected}
              data-cstd-theme-option={candidate.id}
              data-cstd-theme-option-kind={candidate.kind}
              onClick={() => {
                setCstdTheme(candidate.id);
                setOpen(false);
              }}
              className="cstd-theme-option group grid w-full grid-cols-[3.25rem_minmax(0,1fr)_auto] items-center gap-3 border px-2.5 py-2.5 text-left"
            >
              <span data-cstd-theme-preview={candidate.kind} className="cstd-theme-preview relative flex h-12 w-12 items-center justify-center overflow-hidden border">
                <Icon aria-hidden="true" className="relative z-10 h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="flex items-baseline gap-2">
                  <span className="cstd-theme-option-index text-[9px] font-black">0{index + 1}</span>
                  <span className="cstd-theme-option-title text-xs font-black">{locale === "zh" ? candidate.zhLabel : candidate.label}</span>
                </span>
                <span className="cstd-theme-option-description mt-1 block text-[11px] leading-4">{locale === "zh" ? candidate.zhDescription : candidate.description}</span>
              </span>
              {selected ? <Check aria-label={copy.selected} className="cstd-theme-option-check h-4 w-4" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  ) : null;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        data-cstd-theme-switcher
        data-cstd-theme-active={theme}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${copy.trigger}: ${visibleLabel}`}
        title={`${copy.trigger}: ${visibleLabel}`}
        onClick={() => setOpen((value) => !value)}
        className="cstd-theme-switcher-trigger flex h-9 min-w-9 items-center justify-center gap-2 border px-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <Palette aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span data-cstd-theme-label className="cstd-theme-switcher-copy hidden whitespace-nowrap text-[10px] font-black xl:inline">{visibleLabel}</span>
      </button>
      {menu && typeof document !== "undefined" ? createPortal(menu, document.body) : null}
    </div>
  );
}
