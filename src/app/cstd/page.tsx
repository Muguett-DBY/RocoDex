import type { Metadata } from "next";
import { CstdLanding } from "@/components/cstd-landing";

export const metadata: Metadata = {
  title: "CSTD | 奶黄包的奇思妙想实验田",
  description: "CSTD 是 custard 的个人项目集，记录技术、设计、文化、投资研究与游戏相关的混合实验。",
  alternates: {
    canonical: "https://custard.top/",
  },
  openGraph: {
    type: "website",
    siteName: "CSTD",
    title: "CSTD | 奶黄包的奇思妙想实验田",
    description: "从奶黄包出发，孵化技术、设计、文化、投资研究与游戏的个人项目实验田。",
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
    title: "CSTD | 奶黄包的奇思妙想实验田",
    description: "从奶黄包出发，孵化技术、设计、文化、投资研究与游戏的个人项目实验田。",
    images: ["https://custard.top/cstd-og.svg"],
  },
};

export default function CstdPage() {
  return <CstdLanding />;
}
