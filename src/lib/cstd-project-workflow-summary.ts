export type CstdProjectWorkflowTarget = "#project-guide" | "#project-evidence" | "#project-comparison" | "#project-directory";

export type CstdProjectWorkflowSummaryItem = {
  id: "goal" | "evidence" | "comparison" | "directory";
  href: CstdProjectWorkflowTarget;
  label: string;
  value: string;
  detail: string;
};

export type CstdProjectWorkflowAction = {
  href: CstdProjectWorkflowTarget;
  label: string;
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
  const selectedComparisonCount = Math.min(Math.max(compareCount, 0), compareLimit);
  const remainingComparisonCount = Math.max(compareLimit - selectedComparisonCount, 0);

  return [
    {
      id: "goal",
      href: "#project-guide",
      label: "目标路径",
      value: guideGoal ?? "先选目标",
      detail: guideGoal ? "已匹配推荐项目" : "按意图进入项目路径",
    },
    {
      id: "evidence",
      href: "#project-evidence",
      label: "证据底座",
      value: `${liveEvidenceCount} 个上线项目`,
      detail: "角色、问题、结果可核对",
    },
    {
      id: "comparison",
      href: selectedComparisonCount > 0 ? "#project-comparison" : "#project-directory",
      label: "对比决策",
      value: `${selectedComparisonCount} / ${compareLimit}`,
      detail: remainingComparisonCount === 0 ? "对比矩阵已就绪" : `再选 ${remainingComparisonCount} 个项目`,
    },
    {
      id: "directory",
      href: "#project-directory",
      label: "当前目录",
      value: `${visibleProjectCount} / ${totalProjectCount}`,
      detail: "筛选、目标和对比可分享",
    },
  ];
}

export function getCstdProjectWorkflowAction({
  compareCount,
  compareLimit,
  hasGuide,
}: {
  compareCount: number;
  compareLimit: number;
  hasGuide: boolean;
}): CstdProjectWorkflowAction {
  const selectedComparisonCount = Math.min(Math.max(compareCount, 0), compareLimit);
  const remainingComparisonCount = Math.max(compareLimit - selectedComparisonCount, 0);

  if (!hasGuide) {
    return {
      href: "#project-guide",
      label: "先选择访问目标",
      detail: "从 4 条目标路径开始",
    };
  }

  if (selectedComparisonCount === 0) {
    return {
      href: "#project-guide",
      label: "加入推荐项目",
      detail: "把当前匹配放入对比矩阵",
    };
  }

  if (remainingComparisonCount > 0) {
    return {
      href: "#project-directory",
      label: `再选 ${remainingComparisonCount} 个对比项目`,
      detail: "从项目目录补齐决策证据",
    };
  }

  return {
    href: "#project-comparison",
    label: "查看对比矩阵",
    detail: "并排核对角色、问题与结果",
  };
}
