import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Adeline Wen — Researcher & Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Warm-paper editorial card in the site's own type: Fraunces, ink, one ∞.
export default async function OpengraphImage() {
  const fraunces = await readFile(join(process.cwd(), "app/og-assets/fraunces-340.ttf"));
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
          background: "#f7f5f1",
          color: "#15130f",
          fontFamily: "Fraunces",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 6, color: "#6b675f" }}>
          <span>RESEARCHER · DEVELOPER</span>
          <span>SEATTLE · 2026</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <svg width="184" height="96" viewBox="0 0 84 44" style={{ marginBottom: 30 }}>
            <path
              d="M42 22 C 35 12 28 8 22 8 A 14 14 0 1 0 22 36 C 28 36 35 32 42 22 C 49 12 56 8 62 8 A 14 14 0 1 1 62 36 C 56 36 49 32 42 22 Z"
              fill="none"
              stroke="#15130f"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ fontSize: 112, fontWeight: 300, letterSpacing: -3, lineHeight: 1 }}>
            Adeline Wen
          </div>
          <div style={{ fontSize: 32, color: "#6b675f", marginTop: 22 }}>
            UW Decentralized Computing Lab · independent developer of arenafi.org
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#6b675f" }}>
          <span>hascidb.org · arenafi.org</span>
          <span style={{ color: "#15130f" }}>adelinewen.com</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Fraunces", data: fraunces, weight: 300, style: "normal" }],
    }
  );
}
