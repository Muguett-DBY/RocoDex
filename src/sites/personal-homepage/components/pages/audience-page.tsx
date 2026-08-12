import { notFound } from "next/navigation";
import { getCstdNarrative, parseCstdNarrativeShareSlug } from "../../content/narratives";
import { cstdHomepageObservatory } from "../../content/observatory";
import { PersonalHomepage } from "../personal-homepage";
import { StructuredData } from "../site/structured-data";
import type { CstdLocale } from "../../content/content-types";

export const cstdAudienceStaticParams = ["builder", "research", "collaboration"].map((audience) => ({ audience }));

export function CstdAudienceHomepagePage({ audience, locale = "zh" }: { audience: string; locale?: CstdLocale }) {
  const mode = parseCstdNarrativeShareSlug(audience);
  if (!mode) notFound();
  const narrative = getCstdNarrative(mode);
  return (
    <>
      <PersonalHomepage initialNarrativeMode={mode} observatory={cstdHomepageObservatory} locale={locale} />
      <StructuredData value={{
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        name: `CSTD / ${narrative.label[locale]}`,
        description: narrative.description[locale],
        inLanguage: locale === "zh" ? "zh-CN" : "en-AU",
        url: `https://custard.top${locale === "en" ? "/en" : ""}/for/${audience}`,
        mainEntity: { "@type": "Person", name: locale === "zh" ? "奶黄包" : "Custard", alternateName: locale === "zh" ? "Custard" : "奶黄包" },
      }} />
    </>
  );
}
