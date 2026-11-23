"use client";

import { useEffect, useRef } from "react";
import { COLS, ROWS, INK } from "@/app/ben/grid";

// The photo drawn by 0s and 1s alone: on the site's paper, each digit carries as much ink
// as that spot of the photo is dark (or sits on an edge), and outside Ben and the puppy
// there are no digits at all. Every column scrolls down at its own pace while the ink
// stays put, so the figure holds still and the binary flows through it; now and then a
// darker wave runs down a column. Pink hearts, the only colour, rise from between Ben and
// the puppy; a tap or click sends up more. Only the ink grid ships, never the photo.
const CELL = 0.62; // digit width / height, as in scripts/ben-grid.py
const HEART_FROM = { x0: 0.46, x1: 0.62, y0: 0.5, y1: 0.62 }; // between Ben’s face and the puppy
const PINK = ["#f0527f", "#f77199", "#e83a68", "#f9a3bd"];

type Heart = { x: number; y: number; vx: number; vy: number; s: number; life: number; age: number; c: string; ph: number };

export default function BenRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // the colour map as shipped (COLS x ROWS), one pixel per cell
    const src = Uint8Array.from(atob(INK), (ch) => ch.charCodeAt(0));
    const full = new ImageData(COLS, ROWS);
    for (let i = 0; i < COLS * ROWS; i++) full.data[i * 4 + 3] = src[i];
    const fullMap = document.createElement("canvas");
    fullMap.width = COLS;
    fullMap.height = ROWS;
    fullMap.getContext("2d")!.putImageData(full, 0, 0);

    // the grid actually drawn: as many columns as keep each digit legible on this screen
    const map = document.createElement("canvas");
    let nc = COLS, nr = ROWS, px = new Uint8ClampedArray(0);
    const lum = (c: number, r: number) => {
      const k = (Math.min(nr - 1, Math.max(0, r)) * nc + c) * 4;
      return px[k + 3] / 255;
    };

    // each column: a looping strip of digits, its scroll offset and speed, and a bright head
    type Col = { bits: number[]; off: number; v: number; head: number; hv: number };
    let N = 0;
    let cols: Col[] = [];

    const mono = getComputedStyle(document.body).getPropertyValue("--font-mono").trim() || "monospace";
    let W = 0, H = 0, cw = 0, ch = 0, ox = 0, oy = 0, dpr = 1;
    const glyph: HTMLCanvasElement[] = [];
    const MIN_DIGIT = 5.5; // css px a digit needs to read as a 0 or a 1 (4.8 on big screens, where detail counts more)

    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      // fit the whole picture, centred, with digits no smaller than MIN_DIGIT
      const rowsPerCol = ROWS / COLS;
      const fitW = Math.min(W * 0.92, (H * 0.86 * CELL) / rowsPerCol);
      const n = Math.max(48, Math.min(COLS, Math.floor(fitW / (W > 900 ? 4.8 : MIN_DIGIT))));
      if (n !== nc || !px.length) {
        nc = n;
        nr = Math.round(n * rowsPerCol);
        map.width = nc;
        map.height = nr;
        const mc = map.getContext("2d", { willReadFrequently: true })!;
        mc.imageSmoothingQuality = "high";
        mc.drawImage(fullMap, 0, 0, nc, nr);
        px = mc.getImageData(0, 0, nc, nr).data;
        N = nr + 24;
        cols = Array.from({ length: nc }, () => ({
          bits: Array.from({ length: N }, () => (Math.random() < 0.5 ? 0 : 1)),
          off: Math.random() * N,
          v: 1.2 + Math.random() * 2.6, // cells per second
          head: -Math.random() * nr * 2,
          hv: (9 + Math.random() * 14) * (nr / 81),
        }));
      }
      ch = Math.min((H * 0.86) / nr, (W * 0.92) / (nc * CELL));
      cw = ch * CELL;
      ox = (W - cw * nc) / 2;
      oy = (H - ch * nr) / 2;
      // "0" and "1" pre-drawn in the page's ink (light on the dark sheet), so a frame is only copies
      ["0", "1"].forEach((t, i) => {
        const g = (glyph[i] ??= document.createElement("canvas"));
        g.width = Math.ceil(cw * dpr);
        g.height = Math.ceil(ch * dpr);
        const gc = g.getContext("2d")!;
        gc.clearRect(0, 0, g.width, g.height);
        gc.fillStyle = getComputedStyle(document.body).getPropertyValue("--ink").trim() || "#15130f";
        gc.font = `${ch * 0.92 * dpr}px ${mono}`;
        gc.textAlign = "center";
        gc.textBaseline = "middle";
        gc.fillText(t, g.width / 2, g.height / 2 + 0.04 * ch * dpr);
      });
    };
    size();
    window.addEventListener("resize", size);

    const hearts: Heart[] = [];
    const heart = (x: number, y: number, burst = false) =>
      hearts.push({
        x, y,
        vx: (Math.random() - 0.5) * (burst ? 90 : 14),
        vy: -(burst ? 40 + Math.random() * 70 : 18 + Math.random() * 22),
        s: ch * (burst ? 1.4 + Math.random() * 1.6 : 1.2 + Math.random() * 1.8),
        life: 3 + Math.random() * 2.5,
        age: 0,
        c: PINK[Math.floor(Math.random() * PINK.length)],
        ph: Math.random() * 6.28,
      });
    const onTap = (e: PointerEvent) => {
      for (let i = 0; i < 9; i++) heart(e.clientX, e.clientY, true);
    };
    cv.addEventListener("pointerdown", onTap);

    let raf = 0, prev = 0, t = 0, spawn = 0;
    const frame = (now: number) => {
      const dt = prev ? Math.min(0.05, (now - prev) / 1000) : 0.016;
      prev = now;
      t += dt;
      const intro = Math.min(1, t / 1.8); // the picture resolves out of noise

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (let c = 0; c < nc; c++) {
        const col = cols[c];
        if (!still) {
          col.off = (col.off + col.v * dt) % N;
          if (Math.random() < dt * 3) col.bits[Math.floor(Math.random() * N)] ^= 1;
          col.head += col.hv * dt;
          if (col.head > nr + 12) {
            col.head = -Math.random() * nr * 2.5;
            col.hv = (8 + Math.random() * 12) * (nr / 80);
          }
        }
        const whole = Math.floor(col.off);
        const frac = col.off - whole;
        for (let r = 0; r < nr; r++) {
          const k = lum(c, r);
          if (k < 0.04) continue; // blank paper outside the figure
          const behind = col.head - r; // a darker wave running down the column
          const wave = behind >= 0 && behind < 10 ? (1 - behind / 10) * 0.6 : 0;
          ctx.globalAlpha = Math.min(1, (0.12 + 0.88 * k) * (1 + wave)) * intro; // a floor so light skin still reads
          ctx.drawImage(glyph[col.bits[(((r - whole) % N) + N) % N]], ox + c * cw, oy + (r + frac) * ch, cw, ch);
        }
      }

      // 4. hearts, rising from between Ben and the puppy
      if (!still && t > 1.2) {
        spawn += dt * 2.2;
        while (spawn > 1) {
          spawn--;
          heart(
            ox + cw * nc * (HEART_FROM.x0 + Math.random() * (HEART_FROM.x1 - HEART_FROM.x0)),
            oy + ch * nr * (HEART_FROM.y0 + Math.random() * (HEART_FROM.y1 - HEART_FROM.y0)),
          );
        }
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = hearts.length - 1; i >= 0; i--) {
        const p = hearts[i];
        p.age += dt;
        if (p.age > p.life) {
          hearts.splice(i, 1);
          continue;
        }
        p.vx *= 1 - dt * 1.5;
        p.x += (p.vx + Math.sin(p.age * 2.4 + p.ph) * 10) * dt;
        p.y += p.vy * dt;
        const k = p.age / p.life;
        ctx.globalAlpha = Math.min(1, p.age * 3) * (1 - k * k);
        ctx.fillStyle = p.c;
        ctx.font = `${p.s * (0.8 + 0.2 * Math.sin(p.age * 5 + p.ph))}px system-ui, sans-serif`;
        ctx.fillText("♥", p.x, p.y);
      }
      ctx.globalAlpha = 1;

      raf = still ? 0 : requestAnimationFrame(frame);
    };
    if (still) {
      t = 2;
      frame(0);
    } else raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      cv.removeEventListener("pointerdown", onTap);
    };
  }, []);

  return <canvas ref={ref} className="ben" role="img" aria-label="Ben with a puppy, drawn in scrolling 0s and 1s, with hearts" />;
}
