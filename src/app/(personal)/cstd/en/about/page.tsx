import { CstdAboutPage } from "@/sites/personal-homepage/routes";
import { getCstdProfileMetadata } from "@/sites/personal-homepage/metadata";

export const metadata = getCstdProfileMetadata("about", "en");

export default function AboutPage() {
  return <CstdAboutPage locale="en" />;
}
