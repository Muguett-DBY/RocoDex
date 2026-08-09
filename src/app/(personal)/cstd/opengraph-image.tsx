import { ImageResponse } from "next/og";

export const alt = "Custard personal engineering universe, CSTD 17.0";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: "#050709", color: "#f2efe7", fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", backgroundImage: "linear-gradient(rgba(36,224,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(36,224,255,.08) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      <div style={{ position: "absolute", width: 520, height: 520, right: -80, top: 52, display: "flex", border: "1px solid rgba(36,224,255,.36)", transform: "rotate(45deg)" }} />
      <div style={{ position: "absolute", width: 340, height: 340, right: 10, top: 142, display: "flex", border: "2px solid rgba(244,212,49,.55)", transform: "rotate(45deg)" }} />
      <div style={{ position: "absolute", right: 124, top: 244, width: 180, height: 180, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,77,67,.65)", background: "rgba(255,77,67,.08)", transform: "rotate(45deg)" }}>
        <div style={{ width: 78, height: 78, display: "flex", background: "#ff4d43", transform: "rotate(45deg)" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 14, height: "100%", display: "flex", background: "#f4d431" }} />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", width: 790, padding: "64px 0 58px 74px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 20, fontWeight: 700, color: "#24e0ff" }}>
          <span style={{ width: 12, height: 12, display: "flex", background: "#3dff8f" }} />
          CUSTARD / PERSONAL ENGINEERING UNIVERSE / RELEASE 17
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 118, lineHeight: 0.78, fontWeight: 900, letterSpacing: 0 }}>CUSTARD</div>
          <div style={{ marginTop: 34, display: "flex", fontSize: 38, lineHeight: 1.15, fontWeight: 700 }}>Systems that run.<br />Evidence you can operate.</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 18, fontWeight: 700, color: "#f4d431" }}>
          PRODUCT / AI / DATA / EDGE / RESEARCH / CSTD 17
          <span style={{ width: 92, height: 2, display: "flex", background: "#f4d431" }} />
        </div>
      </div>
    </div>,
    size,
  );
}
