import type { Metadata } from "next";
import { CstdLanding } from "@/components/cstd-landing";

export const metadata: Metadata = {
  title: "CSTD | 奶黄包的个人技术工作室",
  description: "CSTD 是 custard 的个人技术工作室，记录产品工程、边缘系统、AI 创作、数据研究与持续学习的真实轨迹。",
  alternates: {
    canonical: "https://custard.top/",
  },
  openGraph: {
    type: "website",
    siteName: "CSTD",
    title: "CSTD | 奶黄包的个人技术工作室",
    description: "把产品、数据、AI 和系统，慢慢做成能用的东西。",
    url: "https://custard.top/",
    images: [
      {
        url: "https://custard.top/cstd-og.svg",
        width: 1200,
        height: 630,
        alt: "CSTD 奶黄包个人技术工作室预览图",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CSTD | 奶黄包的个人技术工作室",
    description: "把产品、数据、AI 和系统，慢慢做成能用的东西。",
    images: ["https://custard.top/cstd-og.svg"],
  },
};

export default function CstdPage() {
  return <CstdLanding />;
}
