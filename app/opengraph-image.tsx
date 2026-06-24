import { ImageResponse } from "next/og";

export const alt = "Adeline Wen — Software & Research";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background:
            "radial-gradient(ellipse 90% 80% at 60% 40%, #241e42, #0c0a14 62%, #050309)",
          color: "#f6f4fc",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 6, color: "#ada8c6" }}>
          <span>SOFTWARE · RESEARCH</span>
          <span>SEATTLE · 2026</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <svg width="180" height="96" viewBox="0 0 32 18" style={{ marginBottom: 28 }}>
            <path
              d="M16 9 C16 3 6 3 6 9 C6 15 16 15 16 9 C16 3 26 3 26 9 C26 15 16 15 16 9 Z"
              fill="none"
              stroke="#896afb"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <div style={{ fontSize: 96, fontWeight: 600, letterSpacing: -3, lineHeight: 1 }}>
            Adeline Wen
          </div>
          <div style={{ fontSize: 34, color: "#c4bbff", marginTop: 16 }}>
            The infinite loop of craft.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#ada8c6" }}>
          <span>Decentralized computing · crafted software</span>
          <span style={{ color: "#896afb" }}>adelinewen.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
