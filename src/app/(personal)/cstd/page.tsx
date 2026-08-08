import { PersonalHomepage, StructuredData } from "@/sites/personal-homepage";
import { personalHomepageMetadata, personalHomepageStructuredData } from "@/sites/personal-homepage/metadata";

export const metadata = personalHomepageMetadata;

export default function PersonalHomepagePage() {
  return <><PersonalHomepage /><StructuredData value={personalHomepageStructuredData} /></>;
}
