import { ImageResponse } from "next/og";
import { getCstdTechnicalNoteOpenGraphData } from "@/sites/personal-homepage/metadata";

export const alt = "CSTD technical note";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function NoteOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getCstdTechnicalNoteOpenGraphData(slug);
  const title = note?.title ?? "CSTD Technical Note";
  const summary = note?.summary ?? "A durable engineering decision record.";
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: "#07100d", color: "#f2efe7", fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", backgroundImage: "linear-gradient(rgba(61,255,143,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(61,255,143,.08) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 18, height: "100%", display: "flex", background: "#3dff8f" }} />
      <div style={{ position: "absolute", right: 74, top: 74, width: 270, height: 482, display: "flex", border: "1px solid rgba(61,255,143,.45)", background: "rgba(5,7,9,.72)" }} />
      <div style={{ position: "absolute", right: 126, top: 132, width: 166, height: 166, display: "flex", border: "2px solid #f4d431", transform: "rotate(45deg)" }} />
      <div style={{ position: "relative", width: 830, padding: "72px 0 66px 76px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", color: "#3dff8f", fontSize: 19, fontWeight: 800 }}>CSTD / DECISION RECORD / {note?.readingMinutes ?? 5} MIN</div>
        <div style={{ display: "flex", flexDirection: "column" }}><div style={{ display: "flex", maxWidth: 790, fontSize: 64, lineHeight: 1.03, fontWeight: 850 }}>{title}</div><div style={{ display: "flex", marginTop: 26, maxWidth: 720, color: "#b4bfbb", fontSize: 24, lineHeight: 1.35 }}>{summary}</div></div>
        <div style={{ display: "flex", color: "#f4d431", fontSize: 16, fontWeight: 800 }}>SOURCE-LINKED / BILINGUAL / VERSIONED</div>
      </div>
    </div>,
    size,
  );
}
