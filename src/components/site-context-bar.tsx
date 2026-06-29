"use client";

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { usePathname } from "next/navigation";
import { getSiteNavigationContext } from "@/lib/site-navigation";

export function SiteContextBar() {
  const pathname = usePathname();
  const context = getSiteNavigationContext(pathname);

  if (!context) {
    return null;
  }

  return (
    <nav
      aria-label="当前站点位置"
      className="border-b border-slate-200/80 bg-white/70 dark:border-slate-800 dark:bg-slate-950/80"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900">
            <Compass className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{context.current.label}</p>
            <p className="text-xs leading-5 text-slate-600 dark:text-slate-400">{context.current.description}</p>
          </div>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:justify-end">
          {context.relatedItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-800 dark:hover:text-white"
            >
              {item.label}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
