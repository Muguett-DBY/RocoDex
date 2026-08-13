import { CstdNotesIndexPage } from "@/sites/personal-homepage/routes";
import { getCstdNotesMetadata } from "@/sites/personal-homepage/metadata";

export const metadata = getCstdNotesMetadata("en");

export default function NotesPage() {
  return <CstdNotesIndexPage locale="en" />;
}
