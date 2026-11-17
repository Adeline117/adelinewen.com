"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

// Light or dark follows the visitor's system, live, unless they flipped the toggle during
// this visit (sessionStorage; matches the noFlash script in app/layout.tsx). The flip is a
// circular ink wipe from the click point (View Transitions API), a plain toggle elsewhere.
export function useTheme() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    // read after mount on purpose: storage and media queries don't exist on the server
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const pick = sessionStorage.getItem("theme-pick");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(pick ? pick === "dark" : mq.matches);
    const onChange = (e: MediaQueryListEvent) => {
      if (!sessionStorage.getItem("theme-pick")) setDark(e.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  useEffect(() => {
    if (dark === null) return;
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  const flipTheme = (e: React.MouseEvent) => {
    const next = !dark;
    try {
      sessionStorage.setItem("theme-pick", next ? "dark" : "light");
    } catch {}
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
    if (!doc.startViewTransition) {
      setDark(next);
      return;
    }
    document.documentElement.style.setProperty("--wx", `${e.clientX}px`);
    document.documentElement.style.setProperty("--wy", `${e.clientY}px`);
    // suspend the body's own 0.6s background fade so the wipe reveals a settled page
    document.documentElement.classList.add("theme-wiping");
    const vt = doc.startViewTransition(() => {
      flushSync(() => setDark(next));
      document.body.classList.toggle("dark", next); // ensure the DOM state is snapshotted
    });
    vt.finished.finally(() => document.documentElement.classList.remove("theme-wiping"));
  };

  return { dark, flipTheme };
}
