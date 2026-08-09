import { PersonalHomepage, StructuredData } from "@/sites/personal-homepage";
import { personalHomepageMetadata, personalHomepageStructuredData } from "@/sites/personal-homepage/metadata";
import { cstdHomepageObservatory } from "@/sites/personal-homepage/server";

export const metadata = personalHomepageMetadata;

export default function PersonalHomepagePage() {
  return <><PersonalHomepage observatory={cstdHomepageObservatory} /><StructuredData value={personalHomepageStructuredData} /></>;
}
