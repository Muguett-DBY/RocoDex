export type CstdProjectComparisonContext = {
  goalLabel: string;
  projectLabel: string;
};

export function getCstdProjectComparisonContext({
  guideGoal,
  projectTitles,
}: {
  guideGoal: string | null;
  projectTitles: readonly string[];
}): CstdProjectComparisonContext {
  const titles = projectTitles.map((title) => title.trim()).filter(Boolean);

  return {
    goalLabel: `目标路径：${guideGoal?.trim() || "手动选择"}`,
    projectLabel: `对比项目：${titles.join(" / ") || "等待选择"}`,
  };
}
