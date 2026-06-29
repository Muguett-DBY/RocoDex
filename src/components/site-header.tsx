"use client";

import Link from "next/link";
import {
  BookOpen,
  Brain,
  Database,
  GitCompare,
  Info,
  LogIn,
  LogOut,
  Menu,
  ScrollText,
  Search,
  Shield,
  Sparkles,
  Swords,
  User,
  UserPlus,
  X,
  type LucideIcon,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { CollectionNavLink } from "@/components/collection-nav-link";
import {
  getMobileNavigationSummary,
  getMobileNavigationToggleState,
  getSiteNavigationLinkState,
  isMobileNavigationOpenForPath,
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

export function SiteHeader({ authEnabled }: { authEnabled: boolean }) {
  const pathname = usePathname();
  const [mobileMenuState, setMobileMenuState] = useState<MobileNavigationRouteState>({
    open: false,
    pathname,
  });
  const mobileMenuOpen = isMobileNavigationOpenForPath(mobileMenuState, pathname);
  const mobileToggle = getMobileNavigationToggleState(mobileMenuOpen);
  const mobileMenuSummary = getMobileNavigationSummary(pathname);

  const closeMobileMenu = () => setMobileMenuState({ open: false, pathname });

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f7f6f1]/95 backdrop-blur dark:border-slate-700/80 dark:bg-slate-950/95">
      <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <BrandLink />
          <nav className="hidden flex-wrap items-center gap-2 md:flex">
            <HeaderNavLinks pathname={pathname} />
            <CollectionNavLink pathname={pathname} />
            <ThemeToggle />
            {authEnabled ? <AuthControls /> : null}
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
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
            {authEnabled ? (
              <AuthControls
                rootClassName="grid gap-2"
                controlClassName="h-11 justify-start px-3"
                onNavigate={closeMobileMenu}
              />
            ) : null}
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

function AuthControls({
  rootClassName,
  controlClassName,
  onNavigate,
}: {
  rootClassName?: string;
  controlClassName?: string;
  onNavigate?: () => void;
} = {}) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = () => {
    onNavigate?.();
    signOut({ callbackUrl: "/" });
  };

  return session?.user ? (
            <div className={cn("relative", rootClassName)} ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
                  controlClassName,
                )}
              >
                <User className="h-4 w-4" />
                {session.user.name}
              </button>
              {menuOpen ? (
                <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className={cn(
                      "flex h-9 w-full items-center gap-2 px-4 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800",
                      controlClassName,
                    )}
                  >
                    <LogOut className="h-4 w-4" />
                    退出登录
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className={cn("flex items-center gap-1", rootClassName)}>
              <Link
                href="/login"
                onClick={onNavigate}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
                  controlClassName,
                )}
              >
                <LogIn className="h-4 w-4" />
                登录
              </Link>
              <Link
                href="/register"
                onClick={onNavigate}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-md bg-emerald-600 px-3 text-sm font-semibold text-white transition hover:bg-emerald-700",
                  controlClassName,
                )}
              >
                <UserPlus className="h-4 w-4" />
                注册
              </Link>
            </div>
          );
}
