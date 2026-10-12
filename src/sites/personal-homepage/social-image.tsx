export function CstdSocialImage({ title, summary, eyebrow, footnote }: { title: string; summary: string; eyebrow: string; footnote: string }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: "#f8f5ef", color: "#242b27", fontFamily: "Arial, sans-serif" }}>
      <svg width="380" height="380" viewBox="0 0 40 40" style={{ position: "absolute", right: -70, top: 130, opacity: .2 }}><path d="M29.8 10.2a14 14 0 1 0 0 19.6" fill="none" stroke="#b2945c" strokeWidth="6" /></svg>
      <div style={{ width: "100%", margin: "48px 64px", borderTop: "1px solid #d2d3c9", borderBottom: "1px solid #d2d3c9", padding: "28px 0", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#72582f", fontSize: 16, letterSpacing: 2 }}><span>CUSTARD / PERSONAL STUDIO</span><span>{eyebrow}</span></div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 930 }}><div style={{ display: "flex", fontSize: 60, lineHeight: 1.15, fontWeight: 600, letterSpacing: -1 }}>{title}</div><div style={{ display: "flex", marginTop: 24, color: "#535c54", fontSize: 23, lineHeight: 1.5 }}>{summary}</div></div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 28, color: "#667064", fontSize: 14 }}><span>{footnote}</span><span>CUSTARD.TOP</span></div>
      </div>
    </div>
  );
}
