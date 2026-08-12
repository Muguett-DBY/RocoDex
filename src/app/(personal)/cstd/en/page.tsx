import { PersonalHomepage, StructuredData } from "@/sites/personal-homepage";
import { getPersonalHomepageMetadata, getPersonalHomepageStructuredData } from "@/sites/personal-homepage/metadata";
import { cstdHomepageObservatory } from "@/sites/personal-homepage/server";

export const metadata = getPersonalHomepageMetadata("en");

export default function EnglishHubPage() {
  return <><PersonalHomepage locale="en" observatory={cstdHomepageObservatory} /><StructuredData value={getPersonalHomepageStructuredData("en")} /></>;
}
