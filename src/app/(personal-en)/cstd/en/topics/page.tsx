import { CstdTopicsIndexPage } from "@/sites/personal-homepage/routes";
import { getCstdTopicMetadata } from "@/sites/personal-homepage/metadata";

export const metadata = getCstdTopicMetadata(undefined, "en");

export default function TopicsPage() {
  return <CstdTopicsIndexPage locale="en" />;
}
