import { CstdNowPage } from "@/sites/personal-homepage/routes";
import { getCstdProfileMetadata } from "@/sites/personal-homepage/metadata";

export const metadata = getCstdProfileMetadata("now", "zh");

export default function NowPage() {
  return <CstdNowPage locale="zh" />;
}
