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
  "neon-district": {
    mapRadius: 20,
    spawn: [0, 15],
    lookAt: [0, 7],
    landmarks: [
      landmark("alpha-research-system", -11, -10),
      landmark("cfzzs-crm", 0, -11),
      landmark("creative-workbench", 11, -10),
      landmark("dcf-quantum", -11, 7),
      landmark("portrait-booking", 0, 9),
      landmark("rocodex-platform", 11, 7),
      landmark("notes-archive", -16, 0, "archive"),
      landmark("lab-foundry", 16, 0, "archive"),
    ],
  },
  "underworld-forge": {
    mapRadius: 20,
    spawn: [0, 9],
    lookAt: [0, 15],
    landmarks: [
      landmark("alpha-research-system", 0, -15),
      landmark("cfzzs-crm", 11, -11),
      landmark("creative-workbench", 15, 0),
      landmark("dcf-quantum", 11, 11),
      landmark("portrait-booking", 0, 15),
      landmark("rocodex-platform", -11, 11),
      landmark("notes-archive", -15, 0, "archive"),
      landmark("lab-foundry", -11, -11, "archive"),
    ],
  },
  "astral-covenant": {
    mapRadius: 20,
    spawn: [0, 10],
    lookAt: [0, 16],
    landmarks: [
      landmark("alpha-research-system", 0, -16),
      landmark("cfzzs-crm", 11, -11),
      landmark("creative-workbench", 16, 0),
      landmark("dcf-quantum", 11, 11),
      landmark("portrait-booking", 0, 16),
      landmark("rocodex-platform", -11, 11),
      landmark("notes-archive", -16, 0, "archive"),
      landmark("lab-foundry", -11, -11, "archive"),
    ],
  },
};

export function getVoxelThemeLayout(theme: CstdThemeId) {
  return layouts[theme];
}

export function getVoxelLandmark(theme: CstdThemeId, id: VoxelExhibitId) {
  return layouts[theme].landmarks.find((entry) => entry.id === id);
}
