import { guideBuildSlug } from "@/lib/seo-pages";
import type { GuideCreatureBuild } from "@/types/guide";

export function getCollectionGuideHref(creatureId: string, guideBuilds: GuideCreatureBuild[]) {
  const build = guideBuilds.find((item) => item.dexId === creatureId);
  return build ? `/guides/${guideBuildSlug(build)}` : null;
}
