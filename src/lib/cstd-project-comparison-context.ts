export type CstdProjectComparisonReceipt = {
  label: string;
  detail: string;
};

export type CstdProjectComparisonContext = {
  goalLabel: string;
  projectLabel: string;
  receipt: CstdProjectComparisonReceipt | null;
};

export function getCstdProjectComparisonContext({
  guideGoal,
  projectTitles,
  restoredFromUrl = false,
}: {
  guideGoal: string | null;
  projectTitles: readonly string[];
  restoredFromUrl?: boolean;
}): CstdProjectComparisonContext {
  const titles = projectTitles.map((title) => title.trim()).filter(Boolean);
  const hasGuideGoal = Boolean(guideGoal?.trim());
  const receiptContext = hasGuideGoal ? "目标路径" : "手动选择";
  const receipt =
    restoredFromUrl && titles.length > 0
      ? {
          label: "分享视图已恢复",
          detail: `${receiptContext}与 ${titles.length} 个对比项目已从链接恢复，可直接查看判断。`,
        }
      : null;

  return {
    goalLabel: `目标路径：${guideGoal?.trim() || "手动选择"}`,
    projectLabel: `对比项目：${titles.join(" / ") || "等待选择"}`,
    receipt,
  };
}
