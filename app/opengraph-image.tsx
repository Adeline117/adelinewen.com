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
          <svg width="184" height="96" viewBox="0 0 84 44" style={{ marginBottom: 28 }}>
            <path
              d="M42 22 C 35 12 28 8 22 8 A 14 14 0 1 0 22 36 C 28 36 35 32 42 22 C 49 12 56 8 62 8 A 14 14 0 1 1 62 36 C 56 36 49 32 42 22 Z"
              fill="none"
              stroke="#141414"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
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
