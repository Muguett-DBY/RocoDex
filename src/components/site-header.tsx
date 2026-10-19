"use client";

import Link from "next/link";
import {
  BookOpen,
  Brain,
  Database,
  GitCompare,
  Info,
  Menu,
  ScrollText,
  Search,
  Shield,
  Sparkles,
  Swords,
  X,
  type LucideIcon,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";
import { useState, useRef, type KeyboardEvent } from "react";
import { CollectionNavLink } from "@/components/collection-nav-link";
import {
  getMobileNavigationSummary,
  getMobileNavigationToggleState,
  getSiteNavigationLinkState,
  isMobileNavigationOpenForPath,
  shouldDismissMobileNavigation,
  siteNavigationItems,
  type MobileNavigationRouteState,
} from "@/lib/site-navigation";
import { cn } from "@/lib/utils";

const navIcons: Record<string, LucideIcon> = {
  "/creatures": BookOpen,
  "/guides": ScrollText,
  "/pvp-teams": Swords,
  "/matchups": Shield,
  "/skills": Search,
  "/compare": GitCompare,
  "/discover": Sparkles,
  "/rkti": Brain,
  "/data-status": Database,
  "/about": Info,
};

export function SiteHeader() {
  const pathname = usePathname();
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const [mobileMenuState, setMobileMenuState] = useState<MobileNavigationRouteState>({
    open: false,
    pathname,
  });
  const mobileMenuOpen = isMobileNavigationOpenForPath(mobileMenuState, pathname);
  const mobileToggle = getMobileNavigationToggleState(mobileMenuOpen);
  const mobileMenuSummary = getMobileNavigationSummary(pathname);

  const closeMobileMenu = () => setMobileMenuState({ open: false, pathname });
  const handleMobileNavigationKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!mobileMenuOpen || !shouldDismissMobileNavigation(event.key)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    closeMobileMenu();
    requestAnimationFrame(() => {
      mobileMenuButtonRef.current?.focus();
    });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f7f6f1]/95 backdrop-blur dark:border-slate-700/80 dark:bg-slate-950/95">
      {/* Escape is handled from bubbled menu events; this container is not itself interactive. */}
      {/* eslint-disable-next-line jsx-a11y-x/no-static-element-interactions */}
      <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8" onKeyDown={handleMobileNavigationKeyDown}>
        <div className="flex items-center justify-between gap-3">
          <BrandLink />
          <nav className="hidden flex-wrap items-center gap-2 md:flex">
            <HeaderNavLinks pathname={pathname} />
            <CollectionNavLink pathname={pathname} />
            <ThemeToggle />
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              ref={mobileMenuButtonRef}
              type="button"
              aria-expanded={mobileToggle.expanded}
              aria-controls="mobile-site-navigation"
              aria-label={mobileToggle.label}
              onClick={() => setMobileMenuState({ open: !mobileMenuOpen, pathname })}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <nav
            id="mobile-site-navigation"
            aria-label="移动主导航"
            className="mt-3 grid max-h-[calc(100dvh-5rem)] gap-2 overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:hidden dark:border-slate-700 dark:bg-slate-900"
          >
            {mobileMenuSummary ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950/60">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">当前位置</p>
                <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">
                  {mobileMenuSummary.label}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                  {mobileMenuSummary.description}
                </p>
              </div>
            ) : null}
            <HeaderNavLinks
              pathname={pathname}
              itemClassName="h-11 justify-start px-3"
              onNavigate={closeMobileMenu}
            />
            <CollectionNavLink
              pathname={pathname}
              className="h-11 justify-start px-3"
              onClick={closeMobileMenu}
            />
          </nav>
        ) : null}
      </div>
    </header>
  );
}

function BrandLink() {
  return (
    <Link href="/" className="flex min-w-0 items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
        RD
      </span>
      <span className="min-w-0">
        <span className="block text-base font-bold text-slate-950 dark:text-white">洛克图鉴</span>
        <span className="block text-xs text-slate-500 dark:text-slate-400">RocoDex</span>
      </span>
    </Link>
  );
}

function HeaderNavLinks({
  pathname,
  itemClassName,
  onNavigate,
}: {
  pathname: string | null;
  itemClassName?: string;
  onNavigate?: () => void;
}) {
  return siteNavigationItems.map((item) => {
    const Icon = navIcons[item.href];
    const state = getSiteNavigationLinkState(item, pathname);

    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={state.ariaCurrent}
        onClick={onNavigate}
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition hover:bg-white hover:text-slate-950 dark:hover:bg-slate-800 dark:hover:text-white",
          state.current
            ? "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
            : "text-slate-700 dark:text-slate-300",
          itemClassName,
        )}
      >
        <Icon className="h-4 w-4" />
        {item.label}
      </Link>
    );
  });
}
