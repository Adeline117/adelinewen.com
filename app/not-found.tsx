import Link from "next/link";

// In-system 404: same paper, same type, the ∞ as the quiet mark.
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "0 clamp(24px, 8vw, 120px)",
        position: "relative",
        zIndex: 2,
      }}
    >
      <svg width="70" height="44" viewBox="7 0 70 44" aria-hidden="true" style={{ marginBottom: 28, opacity: 0.35 }}>
        <path
          d="M42 22 C 35 12 28 8 22 8 A 14 14 0 1 0 22 36 C 28 36 35 32 42 22 C 49 12 56 8 62 8 A 14 14 0 1 1 62 36 C 56 36 49 32 42 22 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <h1 style={{ fontWeight: 330, fontSize: "clamp(72px, 14vw, 200px)", lineHeight: 0.9, letterSpacing: "-0.03em", margin: 0 }}>
        4<em style={{ fontStyle: "italic" }}>0</em>4
      </h1>
      <p style={{ marginTop: 28, fontSize: "clamp(15px, 1.5vw, 18px)", lineHeight: 1.65, color: "var(--text)", maxWidth: "38ch" }}>
        This page doesn&rsquo;t exist — the loop closes elsewhere. 这一页不存在。
      </p>
      <Link
        href="/"
        className="tlink"
        style={{
          marginTop: 36,
          fontFamily: "var(--font-mono), monospace",
          fontSize: "var(--fs-label)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--ink)",
          paddingBottom: 6,
        }}
      >
        Back to the start ↗
      </Link>
    </main>
  );
}
