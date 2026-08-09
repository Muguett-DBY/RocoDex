import { ImageResponse } from "next/og";
import { getCstdCaseStudyOpenGraphData } from "@/sites/personal-homepage/metadata";

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
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: "#050709", color: "#f2efe7", fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", backgroundImage: "linear-gradient(rgba(36,224,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(36,224,255,.08) 1px, transparent 1px)", backgroundSize: "54px 54px" }} />
      <div style={{ position: "absolute", inset: "42px", display: "flex", border: "1px solid rgba(255,255,255,.16)" }} />
      <div style={{ position: "absolute", right: -80, top: 110, width: 430, height: 430, display: "flex", border: "2px solid rgba(244,212,49,.62)", transform: "rotate(45deg)" }} />
      <div style={{ position: "absolute", right: 85, top: 215, width: 170, height: 170, display: "flex", background: "#24e0ff", transform: "rotate(45deg)", opacity: .72 }} />
      <div style={{ position: "relative", width: 850, padding: "72px 0 66px 76px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, color: "#f4d431", fontSize: 19, fontWeight: 800 }}><span style={{ display: "flex", width: 12, height: 12, background: "#3dff8f" }} />CSTD / EXECUTABLE CASE</div>
        <div style={{ display: "flex", flexDirection: "column" }}><div style={{ display: "flex", maxWidth: 800, fontSize: 68, lineHeight: 1.02, fontWeight: 850 }}>{title}</div><div style={{ display: "flex", marginTop: 24, maxWidth: 720, color: "#aeb8bb", fontSize: 24, lineHeight: 1.35 }}>{summary}</div></div>
        <div style={{ display: "flex", color: "#24e0ff", fontSize: 16, fontWeight: 800 }}>{technologies}</div>
      </div>
    </div>,
    size,
  );
}
