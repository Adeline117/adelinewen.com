import Link from "next/link";
import type { Metadata } from "next";
import BrokenPipa from "@/components/BrokenPipa";

export const metadata: Metadata = { title: "Page not found · Adeline Wen" };

// In-system 404: same paper, same type; the pipa from About, one string snapped.
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
      <BrokenPipa />
      <h1 style={{ fontWeight: 330, fontSize: "clamp(72px, 14vw, 200px)", lineHeight: 0.9, letterSpacing: "-0.03em", margin: 0 }}>
        4<em style={{ fontStyle: "italic" }}>0</em>4
      </h1>
      <p style={{ marginTop: 28, fontSize: "clamp(15px, 1.5vw, 18px)", lineHeight: 1.65, color: "var(--text)", maxWidth: "38ch" }}>
        This page doesn&rsquo;t exist. 这一页不存在。
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
