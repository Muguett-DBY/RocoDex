import { CstdMapPage } from "@/sites/personal-homepage/routes";
import { createCstdMetadata } from "@/sites/personal-homepage/metadata";

export const metadata = createCstdMetadata({
  locale: "zh",
  path: "/map",
  title: "CSTD 全局知识图谱",
  description: "连接奶黄包的系统能力、案例、技术札记、交互实验与成长轨迹。",
  image: "/cstd-districts/data-systems-v1.webp",
});

export default function MapPage() {
  return <CstdMapPage locale="zh" />;
}
