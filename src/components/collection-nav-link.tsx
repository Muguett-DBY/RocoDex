"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useCreatureCollection } from "@/hooks/use-creature-collection";
import { collectionNavigationItem, getSiteNavigationLinkState } from "@/lib/site-navigation";
import { cn } from "@/lib/utils";

export function CollectionNavLink({
  pathname,
  className,
  onClick,
}: {
  pathname?: string | null;
  className?: string;
  onClick?: () => void;
}) {
  const { hydrated, ids } = useCreatureCollection();
  const state = getSiteNavigationLinkState(collectionNavigationItem, pathname);

  return (
    <Link
      href="/collection"
      aria-current={state.ariaCurrent}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition hover:bg-white hover:text-slate-950 dark:hover:bg-slate-800 dark:hover:text-white",
        state.current
          ? "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
          : "text-slate-700 dark:text-slate-300",
        className,
      )}
    >
      <Heart className="h-4 w-4" />
      我的收藏
      {hydrated && ids.length > 0 ? (
        <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[11px] font-bold text-emerald-800">{ids.length}</span>
      ) : null}
    </Link>
  );
}
