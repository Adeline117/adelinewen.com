import { ImageResponse } from "next/og";

export const alt = "Adeline Wen — Researcher & Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Swiss-white editorial card: paper, ink, one hairline ∞ — matches the site.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#f7f7f7",
          color: "#141414",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 6, color: "#6b6b6b" }}>
          <span>RESEARCHER · DEVELOPER</span>
          <span>SEATTLE · 2026</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <svg width="180" height="96" viewBox="0 0 32 18" style={{ marginBottom: 28 }}>
            <path
              d="M16 9 C16 3 6 3 6 9 C6 15 16 15 16 9 C16 3 26 3 26 9 C26 15 16 15 16 9 Z"
              fill="none"
              stroke="#141414"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </svg>
          <div style={{ fontSize: 96, fontWeight: 600, letterSpacing: -3, lineHeight: 1 }}>
            Adeline Wen
          </div>
          <div style={{ fontSize: 34, color: "#6b6b6b", marginTop: 16 }}>
            The infinite loop of craft.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#6b6b6b" }}>
          <span>UW Decentralized Computing Lab · arenafi.org</span>
          <span style={{ color: "#141414" }}>adelinewen.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
