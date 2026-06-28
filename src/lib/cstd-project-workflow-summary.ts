export type CstdProjectWorkflowSummaryItem = {
  id: "goal" | "evidence" | "comparison" | "directory";
  label: string;
  value: string;
  detail: string;
};

type CstdProjectWorkflowSummaryInput = {
  compareCount: number;
  compareLimit: number;
  guideGoal: string | null;
  liveEvidenceCount: number;
  totalProjectCount: number;
  visibleProjectCount: number;
};

export function getCstdProjectWorkflowSummary({
  compareCount,
  compareLimit,
  guideGoal,
  liveEvidenceCount,
  totalProjectCount,
  visibleProjectCount,
}: CstdProjectWorkflowSummaryInput): CstdProjectWorkflowSummaryItem[] {
  const remainingComparisonCount = Math.max(compareLimit - compareCount, 0);

  return [
    {
      id: "goal",
      label: "目标路径",
      value: guideGoal ?? "先选目标",
      detail: guideGoal ? "已匹配推荐项目" : "按意图进入项目路径",
    },
    {
      id: "evidence",
      label: "证据底座",
      value: `${liveEvidenceCount} 个上线项目`,
      detail: "角色、问题、结果可核对",
    },
    {
      id: "comparison",
      label: "对比决策",
      value: `${Math.min(compareCount, compareLimit)} / ${compareLimit}`,
      detail: remainingComparisonCount === 0 ? "对比矩阵已就绪" : `再选 ${remainingComparisonCount} 个项目`,
    },
    {
      id: "directory",
      label: "当前目录",
      value: `${visibleProjectCount} / ${totalProjectCount}`,
      detail: "筛选、目标和对比可分享",
    },
  ];
}
