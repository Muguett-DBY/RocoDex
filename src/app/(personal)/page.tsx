import { PersonalHomepage, StructuredData } from "@/sites/personal-homepage";
import { getPersonalHomepageMetadata, getPersonalHomepageStructuredData } from "@/sites/personal-homepage/metadata";
import { cstdHomepageObservatory } from "@/sites/personal-homepage/server";

export const metadata = getPersonalHomepageMetadata("zh");

export default function PersonalHomepagePage() {
  return <><PersonalHomepage locale="zh" observatory={cstdHomepageObservatory} /><StructuredData value={getPersonalHomepageStructuredData("zh")} /></>;
}
