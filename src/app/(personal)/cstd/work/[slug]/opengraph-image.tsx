import { ImageResponse } from "next/og";
import { CstdSocialImage, getCstdCaseStudyOpenGraphData } from "@/sites/personal-homepage/metadata";

export const alt = "CSTD engineering case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function CaseOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getCstdCaseStudyOpenGraphData(slug);
  const title = entry?.title ?? "CSTD Engineering Case";
  const summary = entry?.summary ?? "A shipped system with inspectable decisions and evidence.";
  const technologies = entry?.technologies.slice(0, 5).join(" / ") ?? "PRODUCT / DATA / AI / EDGE";
  return new ImageResponse(
    <CstdSocialImage title={title} summary={summary} eyebrow="SELECTED WORK" footnote={technologies} />,
    size,
  );
}
