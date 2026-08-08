import { CstdNowPage } from "@/sites/personal-homepage/routes";
import { getCstdProfileMetadata } from "@/sites/personal-homepage/metadata";

export const metadata = getCstdProfileMetadata("now", "en");

export default function NowPage() {
  return <CstdNowPage locale="en" />;
}
