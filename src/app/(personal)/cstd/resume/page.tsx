import { CstdResumePage } from "@/sites/personal-homepage/routes";
import { getCstdProfileMetadata } from "@/sites/personal-homepage/metadata";

export const metadata = getCstdProfileMetadata("resume", "zh");

export default function ResumePage() {
  return <CstdResumePage locale="zh" />;
}
