"use client";

import { useEffect, useRef } from "react";
import { COLS, ROWS, RGB } from "@/app/ben/grid";

// The photo, drawn in 0s and 1s. Every column of digits scrolls down at its own pace while
// the colours stay put, so the picture holds still and the binary flows through it; a
// brighter head runs down some columns, and hearts rise from between Ben and the puppy.
// A tap or click sends up a handful more. Only the colour grid ships, never the photo.
const CELL = 0.62; // digit width / height, as in scripts/ben-grid.py
const HEART_FROM = { x0: 0.46, x1: 0.62, y0: 0.5, y1: 0.62 }; // between Ben’s face and the puppy
const PINK = ["#ff5c8a", "#ff7aa2", "#ff3b6b", "#ffb3c7"];

type Heart = { x: number; y: number; vx: number; vy: number; s: number; life: number; age: number; c: string; ph: number };

export default function BenRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // the colour map as shipped (COLS x ROWS), one pixel per cell
    const src = Uint8Array.from(atob(RGB), (ch) => ch.charCodeAt(0));
    const full = new ImageData(COLS, ROWS);
    for (let i = 0; i < COLS * ROWS; i++) {
      full.data[i * 4] = src[i * 3];
      full.data[i * 4 + 1] = src[i * 3 + 1];
      full.data[i * 4 + 2] = src[i * 3 + 2];
      full.data[i * 4 + 3] = 255;
    }
    const fullMap = document.createElement("canvas");
    fullMap.width = COLS;
    fullMap.height = ROWS;
    fullMap.getContext("2d")!.putImageData(full, 0, 0);

    // the grid actually drawn: as many columns as keep each digit legible on this screen
    const map = document.createElement("canvas");
    let nc = COLS, nr = ROWS, px = new Uint8ClampedArray(0);
    const lum = (c: number, r: number) => {
      const k = (Math.min(nr - 1, Math.max(0, r)) * nc + c) * 4;
      return (0.3 * px[k] + 0.59 * px[k + 1] + 0.11 * px[k + 2]) / 255;
    };

    // each column: a looping strip of digits, its scroll offset and speed, and a bright head
    type Col = { bits: number[]; off: number; v: number; head: number; hv: number };
    let N = 0;
    let cols: Col[] = [];

    const mono = getComputedStyle(document.body).getPropertyValue("--font-mono").trim() || "monospace";
    const layer = document.createElement("canvas"); // white digits, then tinted by the map
    const lctx = layer.getContext("2d")!;
    let W = 0, H = 0, cw = 0, ch = 0, ox = 0, oy = 0, dpr = 1;
    const glyph: HTMLCanvasElement[] = [];
    const MIN_DIGIT = 5.5; // css px a digit needs to read as a 0 or a 1

    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = layer.width = Math.round(W * dpr);
      cv.height = layer.height = Math.round(H * dpr);
      // fit the whole picture, centred, with digits no smaller than MIN_DIGIT
      const rowsPerCol = ROWS / COLS;
      const fitW = Math.min(W, (H * CELL) / rowsPerCol);
      const n = Math.max(48, Math.min(COLS, Math.floor(fitW / MIN_DIGIT)));
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
      ch = Math.min(H / nr, W / (nc * CELL));
      cw = ch * CELL;
      ox = (W - cw * nc) / 2;
      oy = (H - ch * nr) / 2;
      // pre-drawn "0" and "1", so each frame is only image copies
      ["0", "1"].forEach((t, i) => {
        const g = (glyph[i] ??= document.createElement("canvas"));
        g.width = Math.ceil(cw * dpr);
        g.height = Math.ceil(ch * dpr);
        const gc = g.getContext("2d")!;
        gc.clearRect(0, 0, g.width, g.height);
        gc.fillStyle = "#fff";
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

      // 1. the digits, in white, each column at its own scroll offset
      lctx.setTransform(1, 0, 0, 1, 0, 0);
      lctx.clearRect(0, 0, layer.width, layer.height);
      lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (let c = 0; c < nc; c++) {
        const col = cols[c];
        if (!still) {
          col.off = (col.off + col.v * dt) % N;
          if (Math.random() < dt * 3) col.bits[Math.floor(Math.random() * N)] ^= 1; // a digit flips now and then
        }
        const whole = Math.floor(col.off);
        const frac = col.off - whole;
        const x = ox + c * cw;
        for (let r = -1; r < nr; r++) {
          const b = col.bits[(((r - whole) % N) + N) % N];
          const fade = intro < 1 ? Math.max(0, Math.min(1, intro * 2.2 - ((c * 7 + r * 13) % 17) / 17)) : 1;
          if (fade <= 0) continue;
          lctx.globalAlpha = fade;
          lctx.drawImage(glyph[b], x, oy + (r + frac) * ch, cw, ch);
        }
      }
      // 2. tinted by the photo: each digit takes the colour of the cell it is passing through
      lctx.globalAlpha = 1;
      lctx.globalCompositeOperation = "source-in";
      lctx.imageSmoothingEnabled = false;
      lctx.drawImage(map, ox, oy, cw * nc, ch * nr);
      lctx.globalCompositeOperation = "source-over";

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#0d0c0a";
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.drawImage(layer, 0, 0);

      // 3. bright heads running down some columns, only as bright as the picture beneath
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!still) {
        ctx.globalCompositeOperation = "lighter";
        for (let c = 0; c < nc; c++) {
          const col = cols[c];
          col.head += col.hv * dt;
          if (col.head > nr + 12) {
            col.head = -Math.random() * nr * 1.5;
            col.hv = (9 + Math.random() * 14) * (nr / 81);
          }
          const h = Math.floor(col.head);
          for (let k = 0; k < 8; k++) {
            const r = h - k;
            if (r < 0 || r >= nr) continue;
            const a = (1 - k / 8) * 0.55 * lum(c, r) * intro;
            if (a < 0.02) continue;
            ctx.globalAlpha = a;
            const whole = Math.floor(col.off);
            ctx.drawImage(glyph[col.bits[(((r - whole) % N) + N) % N]], ox + c * cw, oy + r * ch, cw, ch);
          }
        }
        ctx.globalCompositeOperation = "source-over";
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
