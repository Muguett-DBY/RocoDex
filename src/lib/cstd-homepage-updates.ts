export type CstdHomepageUpdate = {
  label: string;
  detail: string;
};

export type CstdHomepageCapability = {
  label: string;
  detail: string;
};

export const cstdHomepageUpdates: readonly CstdHomepageUpdate[] = [
  { label: "项目搜索", detail: "按关键词、标签和问题快速定位项目" },
  { label: "案例导航", detail: "焦点面板支持上一个 / 下一个项目" },
  { label: "摘要复制", detail: "一键复制项目角色、问题、交付和链接" },
  { label: "CI 绿色", detail: "GitHub Actions 与 Vercel 已验证" },
] as const;

export const cstdHomepageCapabilities: readonly CstdHomepageCapability[] = [
  { label: "可搜索", detail: "分类、关键词和问题证据都能检索" },
  { label: "可验证", detail: "每个上线项目有角色、问题、交付和现状" },
  { label: "可复制", detail: "案例摘要和项目组合摘要可带走" },
  { label: "可深链", detail: "项目焦点链接可直接打开" },
  { label: "可部署", detail: "本地验证、Actions 和 Vercel 持续闭环" },
] as const;

export function getCstdHomepageUpdateSummary(updates: readonly CstdHomepageUpdate[]) {
  return `最近优化 ${updates.length} 项：${updates.map((update) => update.label).join("、")}`;
}

export function getCstdHomepageCapabilitySummary(capabilities: readonly CstdHomepageCapability[]) {
  return `主页能力 ${capabilities.length} 项：${capabilities.map((capability) => capability.label).join("、")}`;
}
