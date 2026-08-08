import type { CstdSystem } from "./systems";
import { cstdDistrictAccents } from "./district-tokens";

export type CstdDistrictArt = Readonly<{
  accent: string;
  secondaryAccent: string;
  image: string;
  imageAlt: Readonly<{ zh: string; en: string }>;
  material: Readonly<{ zh: string; en: string }>;
  motion: Readonly<{ zh: string; en: string }>;
  atmosphere: Readonly<{ zh: string; en: string }>;
}>;

export const cstdArtBible = {
  "product-surfaces": {
    accent: cstdDistrictAccents["product-surfaces"],
    secondaryAccent: "#24e0ff",
    image: "/cstd-districts/product-surfaces-v1.webp",
    imageAlt: { zh: "黑金玻璃构成的产品界面铸造区", en: "A black-glass product interface foundry" },
    material: { zh: "黑玻璃 / 拉丝金属 / 温暖光面", en: "Black glass / brushed metal / warm light" },
    motion: { zh: "界面平面沿网格精确咬合", en: "Interface planes lock precisely to the grid" },
    atmosphere: { zh: "温和、清晰、以使用者为中心", en: "Warm, legible, and user-centered" },
  },
  "edge-operations": {
    accent: cstdDistrictAccents["edge-operations"],
    secondaryAccent: "#f4d431",
    image: "/cstd-districts/edge-operations-v1.webp",
    imageAlt: { zh: "夜色中的云边缘部署港与信号塔", en: "A cloud-edge deployment harbor at night" },
    material: { zh: "冷钢 / 雾面玻璃 / 光纤", en: "Cold steel / misted glass / fiber" },
    motion: { zh: "信号以稳定脉冲跨节点传播", en: "Signals travel across nodes in stable pulses" },
    atmosphere: { zh: "可靠、清醒、始终可观测", en: "Reliable, alert, and observable" },
  },
  "ai-creation": {
    accent: cstdDistrictAccents["ai-creation"],
    secondaryAccent: "#24e0ff",
    image: "/cstd-districts/ai-creation-v1.webp",
    imageAlt: { zh: "红色信号核心与证据链构成的 AI 观测站", en: "An AI observatory built around a red signal core and evidence paths" },
    material: { zh: "烟黑玻璃 / 红色信号体 / 透明证据层", en: "Smoke glass / red signal core / transparent evidence planes" },
    motion: { zh: "推理路径汇聚、分叉并回到证据", en: "Reasoning paths converge, branch, and return to evidence" },
    atmosphere: { zh: "锋利但克制，智能必须可追溯", en: "Sharp but restrained; intelligence stays traceable" },
  },
  "research-models": {
    accent: cstdDistrictAccents["research-models"],
    secondaryAccent: "#f4d431",
    image: "/cstd-districts/research-models-v1.webp",
    imageAlt: { zh: "由概率曲面和实验轨迹构成的研究观测站", en: "A research observatory formed by probability surfaces and experiment traces" },
    material: { zh: "深色矿物 / 分析玻璃 / 校准灯", en: "Dark mineral / analytic glass / calibration light" },
    motion: { zh: "曲线缓慢校准，结论保持稳定", en: "Curves calibrate slowly while conclusions remain stable" },
    atmosphere: { zh: "沉静、精确、允许不确定性存在", en: "Contemplative, precise, and honest about uncertainty" },
  },
  "data-systems": {
    accent: cstdDistrictAccents["data-systems"],
    secondaryAccent: "#ffb24d",
    image: "/cstd-districts/data-systems-v1.webp",
    imageAlt: { zh: "发光数据纤维穿过存储穹顶的数据织机", en: "A data loom threading luminous streams through storage vaults" },
    material: { zh: "冰蓝光纤 / 抛光金属 / 数据穹顶", en: "Ice-blue fiber / polished metal / data vaults" },
    motion: { zh: "数据流按检查点编织成可复现管线", en: "Streams weave into reproducible pipelines through checkpoints" },
    atmosphere: { zh: "连续、透明、对数据血缘负责", en: "Continuous, transparent, and accountable to lineage" },
  },
} as const satisfies Record<CstdSystem["id"], CstdDistrictArt>;

export function getCstdDistrictArt(systemId: CstdSystem["id"]) {
  return cstdArtBible[systemId];
}
