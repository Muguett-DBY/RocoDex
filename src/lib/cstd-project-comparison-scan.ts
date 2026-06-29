import { CSTD_PROJECT_COMPARISON_LIMIT, type CstdProjectComparison } from "./cstd-project-comparison";
import type { CstdProjectComparisonFit } from "./cstd-project-comparison-fit";

export type CstdProjectComparisonScanTone = "direct" | "reference" | "evidence" | "unscoped";

export type CstdProjectComparisonScanItem = {
  id: "direct" | "reference" | "evidence";
  label: string;
  value: string;
  tone: CstdProjectComparisonScanTone;
};

export function getCstdProjectComparisonScanSummary(
  comparison: CstdProjectComparison,
  fit: CstdProjectComparisonFit,
): CstdProjectComparisonScanItem[] {
  const directItem = fit.items.find((item) => item.kind === "direct");
  const referenceItems = fit.items.filter((item) => item.kind === "reference");
  const unscoped = fit.items.some((item) => item.kind === "unscoped");

  return [
    {
      id: "direct",
      label: "目标命中",
      value: directItem?.title ?? (unscoped ? "先选择目标" : "未包含直达项目"),
      tone: directItem ? "direct" : "unscoped",
    },
    {
      id: "reference",
      label: "横向参照",
      value: referenceItems.length > 0
        ? referenceItems.map((item) => item.title).join(" / ")
        : `${comparison.projects.length} 个待判断项目`,
      tone: referenceItems.length > 0 ? "reference" : "unscoped",
    },
    {
      id: "evidence",
      label: "证据维度",
      value: comparison.ready ? `${comparison.rows.length} 项已对齐` : `已选 ${comparison.projects.length} / ${CSTD_PROJECT_COMPARISON_LIMIT}`,
      tone: "evidence",
    },
  ];
}
