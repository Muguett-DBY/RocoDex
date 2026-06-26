export type CstdHomepageUpdate = {
  label: string;
  detail: string;
};

export const cstdHomepageUpdates: readonly CstdHomepageUpdate[] = [
  { label: "项目搜索", detail: "按关键词、标签和问题快速定位项目" },
  { label: "案例导航", detail: "焦点面板支持上一个 / 下一个项目" },
  { label: "摘要复制", detail: "一键复制项目角色、问题、交付和链接" },
  { label: "CI 绿色", detail: "GitHub Actions 与 Vercel 已验证" },
] as const;

export function getCstdHomepageUpdateSummary(updates: readonly CstdHomepageUpdate[]) {
  return `最近优化 ${updates.length} 项：${updates.map((update) => update.label).join("、")}`;
}
