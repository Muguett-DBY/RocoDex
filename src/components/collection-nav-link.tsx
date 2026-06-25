"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useCreatureCollection } from "@/hooks/use-creature-collection";
import { cn } from "@/lib/utils";

export function CollectionNavLink({ className, onClick }: { className?: string; onClick?: () => void }) {
  const { hydrated, ids } = useCreatureCollection();

  return (
    <Link
      href="/collection"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
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
