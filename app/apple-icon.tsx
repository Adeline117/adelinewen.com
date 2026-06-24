import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0a14",
        }}
      >
        <svg width="120" height="68" viewBox="0 0 32 18">
          <path
            d="M16 9 C16 3 6 3 6 9 C6 15 16 15 16 9 C16 3 26 3 26 9 C26 15 16 15 16 9 Z"
            fill="none"
            stroke="#896afb"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
