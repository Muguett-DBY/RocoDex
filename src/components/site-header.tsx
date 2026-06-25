"use client";

import Link from "next/link";
import { BookOpen, Database, GitCompare, Info, LogIn, LogOut, ScrollText, Search, Shield, Sparkles, Swords, UserPlus, User, Brain } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { CollectionNavLink } from "@/components/collection-nav-link";

const navItems = [
  { href: "/creatures", label: "精灵列表", icon: BookOpen },
  { href: "/guides", label: "攻略", icon: ScrollText },
  { href: "/pvp-teams", label: "PVP阵容", icon: Swords },
  { href: "/matchups", label: "克制", icon: Shield },
  { href: "/skills", label: "技能", icon: Search },
  { href: "/compare", label: "对比", icon: GitCompare },
  { href: "/discover", label: "发现", icon: Sparkles },
  { href: "/rkti", label: "洛克测试", icon: Brain },
  { href: "/data-status", label: "数据状态", icon: Database },
  { href: "/about", label: "关于", icon: Info },
];

export function SiteHeader({ authEnabled }: { authEnabled: boolean }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f7f6f1]/95 backdrop-blur dark:border-slate-700/80 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
            RD
          </span>
          <span>
            <span className="block text-base font-bold text-slate-950 dark:text-white">洛克图鉴</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">RocoDex</span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <CollectionNavLink />
          <ThemeToggle />
          {authEnabled ? <AuthControls /> : null}
        </nav>
      </div>
    </header>
  );
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
                className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-slate-950"
              >
                <User className="h-4 w-4" />
                {session.user.name}
              </button>
              {menuOpen ? (
                <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
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
                className="inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950"
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
