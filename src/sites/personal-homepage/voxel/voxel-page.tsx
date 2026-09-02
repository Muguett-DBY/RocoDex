import type { CstdLocale } from "../content/content-types";
import { CstdSiteChrome } from "../components/site/cstd-site-chrome";
import { VoxelSandbox } from "./voxel-sandbox";
import { getVoxelPortfolio } from "./voxel-portfolio";

export function CstdVoxelGamePage({ locale }: { locale: CstdLocale }) {
  return (
    <CstdSiteChrome locale={locale} page="voxel" immersive>
      <VoxelSandbox locale={locale} portfolio={getVoxelPortfolio(locale)} />
    </CstdSiteChrome>
  );
}
