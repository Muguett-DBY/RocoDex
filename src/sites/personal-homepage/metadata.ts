import type { Metadata } from "next";

export const personalHomepageMetadata: Metadata = {
  title: "CSTD // Night Operations | 奶黄包个人技术工作室",
  description: "奶黄包的独立技术工作室：把产品、数据、AI、研究与边缘系统编译成真正运行的作品。",
  alternates: {
    canonical: "https://custard.top/",
  },
  openGraph: {
    type: "website",
    siteName: "CSTD",
    title: "CSTD // Night Operations",
    description: "把代码写进现实，让系统在霓虹里运行。",
    url: "https://custard.top/",
    images: [
      {
        url: "https://custard.top/cstd-og-v2.webp",
        width: 1200,
        height: 630,
        alt: "CSTD Night Runner 个人技术工作室预览图",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CSTD // Night Operations",
    description: "把代码写进现实，让系统在霓虹里运行。",
    images: ["https://custard.top/cstd-og-v2.webp"],
  },
};
