import Link from "next/link";
import { BookOpen, Database, GitCompare, Info, ScrollText, Search, Shield, Sparkles, Swords } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/creatures", label: "精灵列表", icon: BookOpen },
  { href: "/guides", label: "攻略", icon: ScrollText },
  { href: "/pvp-teams", label: "PVP阵容", icon: Swords },
  { href: "/matchups", label: "克制", icon: Shield },
  { href: "/skills", label: "技能", icon: Search },
  { href: "/compare", label: "对比", icon: GitCompare },
  { href: "/discover", label: "发现", icon: Sparkles },
  { href: "/data-status", label: "数据状态", icon: Database },
  { href: "/about", label: "关于", icon: Info },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f7f6f1]/95 backdrop-blur dark:border-slate-700/80 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
            RD
          </span>
          <span>
            <span className="block text-base font-bold text-slate-950">洛克图鉴</span>
            <span className="block text-xs text-slate-500">RocoDex</span>
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
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
