"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreatureCollection } from "@/hooks/use-creature-collection";
import { cn } from "@/lib/utils";

export function CollectionButton({
  creatureId,
  creatureName,
  compact = false,
  className,
}: {
  creatureId: string;
  creatureName: string;
  compact?: boolean;
  className?: string;
}) {
  const { hydrated, isSaved, toggle } = useCreatureCollection();
  const saved = isSaved(creatureId);
  const label = saved ? `从收藏移除 ${creatureName}` : `收藏 ${creatureName}`;

  return (
    <Button
      type="button"
      variant={saved ? "primary" : "secondary"}
      className={cn(compact ? "h-9 w-9 p-0" : "", className)}
      disabled={!hydrated}
      aria-label={label}
      aria-pressed={saved}
      title={label}
      onClick={() => toggle(creatureId)}
    >
      <Heart className={cn("h-4 w-4", saved ? "fill-current" : "")} />
      {compact ? <span className="sr-only">{label}</span> : <span>{saved ? "已收藏" : "加入收藏"}</span>}
    </Button>
  );
}
