import { notFound } from "next/navigation";
import { getCstdNarrative, parseCstdNarrativeShareSlug } from "../../content/narratives";
import { cstdHomepageObservatory } from "../../content/observatory";
import { PersonalHomepage } from "../personal-homepage";
import { StructuredData } from "../site/structured-data";

export const cstdAudienceStaticParams = ["builder", "research", "collaboration"].map((audience) => ({ audience }));

export function CstdAudienceHomepagePage({ audience }: { audience: string }) {
  const mode = parseCstdNarrativeShareSlug(audience);
  if (!mode) notFound();
  const narrative = getCstdNarrative(mode);
  return (
    <>
      <PersonalHomepage initialNarrativeMode={mode} observatory={cstdHomepageObservatory} />
      <StructuredData value={{
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        name: `CSTD / ${narrative.label.zh}`,
        description: narrative.description.zh,
        url: `https://custard.top/for/${audience}`,
        mainEntity: { "@type": "Person", name: "Custard", alternateName: "奶黄包" },
      }} />
    </>
  );
}
