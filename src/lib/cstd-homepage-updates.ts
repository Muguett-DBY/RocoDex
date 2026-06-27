export type CstdHomepageUpdate = {
  label: string;
  detail: string;
};

export type CstdHomepageCapability = {
  label: string;
  detail: string;
};

export type CstdHomepageAcceptanceItem = {
  label: string;
  detail: string;
};

export const cstdHomepageUpdates: readonly CstdHomepageUpdate[] = [
  { label: "视图记忆", detail: "筛选和搜索写入 URL，可刷新恢复" },
  { label: "当前视图", detail: "一键复制带条件的项目目录链接" },
  { label: "项目对比", detail: "两个 live 项目可并排查看证据" },
  { label: "运行时清洁", detail: "3D 奶黄包控制台告警已清零" },
] as const;

export const cstdHomepageCapabilities: readonly CstdHomepageCapability[] = [
  { label: "可搜索", detail: "分类、关键词和问题证据都能检索" },
  { label: "可分享", detail: "目录视图、项目焦点和案例摘要都能复制" },
  { label: "可对比", detail: "live 项目能用同一证据结构决策" },
  { label: "可验证", detail: "每个上线项目有角色、问题、交付和现状" },
  { label: "可上线", detail: "本地验证、Actions 和 Vercel 持续闭环" },
] as const;

export const cstdHomepageAcceptance: readonly CstdHomepageAcceptanceItem[] = [
  { label: "目录深链", detail: "分类和搜索状态可恢复、可分享" },
  { label: "项目对比", detail: "两项 live 项目证据矩阵已上线" },
  { label: "3D 运行时", detail: "浏览器控制台无 Three.js Clock 告警" },
  { label: "远端绿色", detail: "GitHub Actions 与 Vercel 生产部署已通过" },
] as const;

export function getCstdHomepageUpdateSummary(updates: readonly CstdHomepageUpdate[]) {
  return `最近优化 ${updates.length} 项：${updates.map((update) => update.label).join("、")}`;
}

export function getCstdHomepageCapabilitySummary(capabilities: readonly CstdHomepageCapability[]) {
  return `主页能力 ${capabilities.length} 项：${capabilities.map((capability) => capability.label).join("、")}`;
}

export function getCstdHomepageAcceptanceSummary(items: readonly CstdHomepageAcceptanceItem[]) {
  return `本轮验收 ${items.length} 项：${items.map((item) => item.label).join("、")}`;
}
