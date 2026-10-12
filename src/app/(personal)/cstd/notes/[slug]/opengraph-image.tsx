import { ImageResponse } from "next/og";
import { CstdSocialImage, getCstdTechnicalNoteOpenGraphData } from "@/sites/personal-homepage/metadata";

export const alt = "Custard technical note";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function NoteOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getCstdTechnicalNoteOpenGraphData(slug);
  return new ImageResponse(
    <CstdSocialImage title={note?.title ?? "Field notes"} summary={note?.summary ?? "Decisions and lessons from real projects."} eyebrow={`FIELD NOTES / ${note?.readingMinutes ?? 5} MIN`} footnote="Systems · Data · Engineering" />,
    size,
  );
}
