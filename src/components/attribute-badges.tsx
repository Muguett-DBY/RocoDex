import type { CreatureAttribute } from "@/types/creature";
import { Badge } from "@/components/ui/badge";

const toneMap: Partial<Record<CreatureAttribute, "emerald" | "amber" | "blue" | "rose" | "slate">> = {
  草: "emerald",
  火: "rose",
  水: "blue",
  光: "amber",
  地: "amber",
  普通: "slate",
};

export function AttributeBadges({ attributes }: { attributes: CreatureAttribute[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {attributes.map((attribute) => (
        <Badge key={attribute} tone={toneMap[attribute] ?? "slate"}>
          {attribute}
        </Badge>
      ))}
    </div>
  );
}
