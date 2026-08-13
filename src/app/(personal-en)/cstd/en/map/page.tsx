import { CstdMapPage } from "@/sites/personal-homepage/routes";
import { createCstdMetadata } from "@/sites/personal-homepage/metadata";

export const metadata = createCstdMetadata({
  locale: "en",
  path: "/en/map",
  title: "CSTD global knowledge graph",
  description: "A connected map of Custard's system capabilities, cases, technical notes, interactive labs, and learning path.",
  image: "/cstd-districts/data-systems-v1.webp",
});

export default function EnglishMapPage() {
  return <CstdMapPage locale="en" />;
}
