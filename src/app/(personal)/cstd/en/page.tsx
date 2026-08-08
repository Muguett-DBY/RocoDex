import { CstdEnglishHubPage } from "@/sites/personal-homepage/routes";
import { getCstdProfileMetadata } from "@/sites/personal-homepage/metadata";

export const metadata = getCstdProfileMetadata("en", "en");

export default function EnglishHubPage() {
  return <CstdEnglishHubPage />;
}
