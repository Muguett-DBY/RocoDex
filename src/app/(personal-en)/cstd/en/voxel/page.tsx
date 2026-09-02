import { getCstdVoxelMetadata } from "@/sites/personal-homepage/metadata";
import { CstdVoxelGamePage } from "@/sites/personal-homepage/routes";

export const metadata = getCstdVoxelMetadata("en");

export default function EnglishVoxelGamePage() {
  return <CstdVoxelGamePage locale="en" />;
}
