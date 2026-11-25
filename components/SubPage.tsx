"use client";

import { useEffect, type ReactNode } from "react";
import { useTheme } from "./useTheme";

type Lang = "en" | "zh";

// The frame for a page of its own (/research and /zh/research): the same nav
// bar, theme and reveals as the home page, the paper tone of its chapter, and a foot that
// leads back home and on to the other page.
export default function SubPage({
  lang,
  paper,
  other,
  next,
  children,
}: {
  lang: Lang;
  paper: "research";
  other: string; // the same page in the other language
  next: { href: string; text: string }; // where to go on from here
  children: ReactNode;
}) {
  const { dark, flipTheme } = useTheme();
  const home = lang === "zh" ? "/zh" : "/";

  useEffect(() => {
    document.documentElement.dataset.paper = paper;
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting || e.target.classList.contains("on")) return;
          e.target.classList.add("on");
          const t = e.target;
          window.setTimeout(() => t.classList.add("settled"), 1400);
        }),
      { threshold: 0, rootMargin: "0px 0px -15% 0px" },
    );
    document.querySelectorAll(".sec").forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [paper]);

  return (
    <>
      <a href="#main" className="skip">
        {lang === "zh" ? "跳到内容" : "Skip to content"}
      </a>
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
        <filter id="ink" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <nav>
        <a className="logo" href={home}>
          <span className="logo-name">Adeline Wen</span>
        </a>
        <div className="navright">
          <div className="controls">
            <a className="toggle" href={other} hrefLang={lang === "en" ? "zh" : "en"} aria-label={lang === "en" ? "切换到中文" : "Switch to English"}>
              {lang === "en" ? "中文" : "EN"}
            </a>
            <button
              className="toggle"
              aria-label={lang === "zh" ? "切换深色模式" : "Toggle dark mode"}
              aria-pressed={dark === true}
              onClick={flipTheme}
            >
              ◐
            </button>
          </div>
        </div>
      </nav>
      <main id="main" tabIndex={-1} className="page">
        {children}
        <footer className="page-foot">
          <a className="more" href={home}>
            {lang === "zh" ? "← 回到主页" : "← adelinewen.com"}
          </a>
          <a className="more" href={next.href}>
            {next.text}
          </a>
          <span className="page-colophon">© 2026 Adeline Wen</span>
        </footer>
      </main>
    </>
  );
}
