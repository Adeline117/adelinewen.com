"use client";

import { useState } from "react";

// A paper's BibTeX, folded under its entry: open to read, one click to copy. Plain
// <details>, so it reads (and is indexed) without JavaScript.
export default function Cite({ bib, lang }: { bib: string; lang: "en" | "zh" }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(bib);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {}
  };
  return (
    <details className="cite">
      <summary>{lang === "zh" ? "引用 · BibTeX" : "Cite · BibTeX"}</summary>
      <pre>{bib}</pre>
      <button type="button" onClick={copy}>
        {copied ? (lang === "zh" ? "已复制" : "Copied") : lang === "zh" ? "复制" : "Copy"}
      </button>
    </details>
  );
}
