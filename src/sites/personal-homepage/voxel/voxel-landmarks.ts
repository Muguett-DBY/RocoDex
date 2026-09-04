import type { CstdThemeId } from "../experience/theme-store";

export const voxelCaseStudyIds = [
  "alpha-research-system",
  "cfzzs-crm",
  "creative-workbench",
  "dcf-quantum",
  "portrait-booking",
  "rocodex-platform",
] as const;

export const voxelPortfolioExhibitIds = [
  ...voxelCaseStudyIds,
  "notes-archive",
  "lab-foundry",
] as const;

export type VoxelCaseStudyId = (typeof voxelCaseStudyIds)[number];
export type VoxelExhibitId = (typeof voxelPortfolioExhibitIds)[number];

export type VoxelLandmarkSpec = Readonly<{
  id: VoxelExhibitId;
  x: number;
  z: number;
  radius: number;
  tier: "primary" | "archive";
}>;

export type VoxelThemeLayout = Readonly<{
  mapRadius: number;
  spawn: readonly [x: number, z: number];
  lookAt: readonly [x: number, z: number];
  landmarks: readonly VoxelLandmarkSpec[];
}>;

function landmark(
  id: VoxelExhibitId,
  x: number,
  z: number,
  tier: VoxelLandmarkSpec["tier"] = "primary",
): VoxelLandmarkSpec {
  return { id, x, z, radius: tier === "primary" ? 6.4 : 5.8, tier };
}

const layouts: Record<CstdThemeId, VoxelThemeLayout> = {
  // Night City: exhibits sit on the street grid and the ring boulevard.
  "neon-district": {
    mapRadius: 26,
    spawn: [0, 21],
    lookAt: [0, 8],
    landmarks: [
      landmark("alpha-research-system", 10, 10),
      landmark("cfzzs-crm", 0, -14),
      landmark("creative-workbench", -10, 10),
      landmark("dcf-quantum", -14, 0),
      landmark("portrait-booking", 14, 0),
      landmark("rocodex-platform", 10, -10),
      landmark("notes-archive", -10, -10, "archive"),
      landmark("lab-foundry", 0, 16, "archive"),
    ],
  },
  // The underworld: shrines scattered around a broken karst plateau split by lava channels.
  "underworld-forge": {
    mapRadius: 26,
    spawn: [0, 12],
    lookAt: [0, -10],
    landmarks: [
      landmark("alpha-research-system", 0, -16),
      landmark("cfzzs-crm", 13, -9),
      landmark("creative-workbench", 16, 3),
      landmark("dcf-quantum", 9, 13),
      landmark("portrait-booking", -3, 15),
      landmark("rocodex-platform", -14, 10),
      landmark("notes-archive", -16, -2, "archive"),
      landmark("lab-foundry", -9, -12, "archive"),
    ],
  },
  // The astral isles: shrine islands hang in an arc around the central hub island.
  "astral-covenant": {
    mapRadius: 26,
    spawn: [0, 9],
    lookAt: [0, -14],
    landmarks: [
      landmark("alpha-research-system", 0, -17),
      landmark("cfzzs-crm", 15, -8),
      landmark("creative-workbench", 17, 6),
      landmark("dcf-quantum", 9, 16),
      landmark("portrait-booking", -4, 13),
      landmark("rocodex-platform", -17, 5),
      landmark("notes-archive", -14, -9, "archive"),
      landmark("lab-foundry", -7, -15, "archive"),
    ],
  },
};

export function getVoxelThemeLayout(theme: CstdThemeId) {
  return layouts[theme];
}

export function getVoxelLandmark(theme: CstdThemeId, id: VoxelExhibitId) {
  return layouts[theme].landmarks.find((entry) => entry.id === id);
}
