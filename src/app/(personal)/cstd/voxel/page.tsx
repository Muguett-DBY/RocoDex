import { getCstdVoxelMetadata } from "@/sites/personal-homepage/metadata";
import { CstdVoxelGamePage } from "@/sites/personal-homepage/routes";

export const metadata = getCstdVoxelMetadata("zh");

export default function VoxelGamePage() {
  return <CstdVoxelGamePage locale="zh" />;
}
