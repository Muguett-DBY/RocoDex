import { CstdLabIndexPage } from "@/sites/personal-homepage/routes";
import { getCstdLabMetadata } from "@/sites/personal-homepage/metadata";

export const metadata = getCstdLabMetadata(undefined, "en");

export default function LabPage() {
  return <CstdLabIndexPage locale="en" />;
}
