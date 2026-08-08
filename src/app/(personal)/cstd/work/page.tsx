import { CstdWorkIndexPage } from "@/sites/personal-homepage/routes";
import { getCstdWorkMetadata } from "@/sites/personal-homepage/metadata";

export const metadata = getCstdWorkMetadata("zh");

export default function WorkPage() {
  return <CstdWorkIndexPage locale="zh" />;
}
