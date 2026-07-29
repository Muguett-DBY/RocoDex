export type CstdProjectLayout = "feature" | "standard" | "incubator";

export function getCstdProjectLayout({
  index,
  hasPreview,
  status,
}: {
  index: number;
  hasPreview: boolean;
  status: string;
}): CstdProjectLayout {
  if (status !== "Live") return "incubator";
  if (index === 0 && hasPreview) return "feature";
  return "standard";
}
