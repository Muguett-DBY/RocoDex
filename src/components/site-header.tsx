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
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { CollectionNavLink } from "@/components/collection-nav-link";
import { getMobileNavigationToggleState, siteNavigationItems } from "@/lib/site-navigation";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileToggle = getMobileNavigationToggleState(mobileMenuOpen);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f7f6f1]/95 backdrop-blur dark:border-slate-700/80 dark:bg-slate-950/95">
      <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <BrandLink />
          <nav className="hidden flex-wrap items-center gap-2 md:flex">
            <HeaderNavLinks />
            <CollectionNavLink />
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
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <nav
            id="mobile-site-navigation"
            className="mt-3 grid gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:hidden dark:border-slate-700 dark:bg-slate-900"
          >
            <HeaderNavLinks itemClassName="h-11 justify-start px-3" onNavigate={() => setMobileMenuOpen(false)} />
            <CollectionNavLink className="h-11 justify-start px-3" onClick={() => setMobileMenuOpen(false)} />
            {authEnabled ? <AuthControls /> : null}
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

function HeaderNavLinks({ itemClassName, onNavigate }: { itemClassName?: string; onNavigate?: () => void }) {
  return siteNavigationItems.map((item) => {
    const Icon = navIcons[item.href];
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        className={`inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white ${itemClassName ?? ""}`}
      >
        <Icon className="h-4 w-4" />
        {item.label}
      </Link>
    );
  });
}

function AuthControls() {
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

  return session?.user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <User className="h-4 w-4" />
                {session.user.name}
              </button>
              {menuOpen ? (
                <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <LogOut className="h-4 w-4" />
                    退出登录
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Link
                href="/login"
                className="inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <LogIn className="h-4 w-4" />
                登录
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-emerald-600 px-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <UserPlus className="h-4 w-4" />
                注册
              </Link>
            </div>
          );
}
