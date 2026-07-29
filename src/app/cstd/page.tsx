import type { Metadata } from "next";
import { CstdLanding } from "@/components/cstd-landing";

export const metadata: Metadata = {
  title: "CSTD | 独立产品工作室",
  description: "CSTD 是 custard 的独立产品工作室，展示游戏数据、影像服务、投资研究、AI 创作与业务系统等已上线项目。",
  alternates: {
    canonical: "https://custard.top/",
  },
  openGraph: {
    type: "website",
    siteName: "CSTD",
    title: "CSTD | 独立产品工作室",
    description: "把灵感做成真正能用的产品。浏览 CSTD 已上线的游戏数据、影像、研究、AI 与业务系统。",
    url: "https://custard.top/",
    images: [
      {
        url: "https://custard.top/cstd-og.svg",
        width: 1200,
        height: 630,
        alt: "CSTD 奶黄包项目集预览图",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CSTD | 独立产品工作室",
    description: "把灵感做成真正能用的产品。浏览 CSTD 已上线的游戏数据、影像、研究、AI 与业务系统。",
    images: ["https://custard.top/cstd-og.svg"],
  },
};

export default function CstdPage() {
  return <CstdLanding />;
}
