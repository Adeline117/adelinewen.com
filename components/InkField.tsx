"use client";

import { useEffect, useRef } from "react";

// A living "ink on paper" field: domain-warped fbm noise that breathes slowly
// and warps toward the cursor, posterized into a few ink levels so it reads as
// banknote/engraving marbling rather than a gradient. Warm ink on warm paper,
// pure monochrome. Replaces the technical needle field with something hand-made.
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;   // pixels; large negative when inactive
uniform float uActive;
uniform vec3 uInk;
uniform vec3 uPaper;

float hash(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.,0.)), c = hash(i + vec2(0.,1.)), d = hash(i + vec2(1.,1.));
  vec2 u = f * f * (3. - 2. * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p){
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){ s += a * noise(p); p *= 2.03; a *= 0.5; }
  return s;
}
void main(){
  float ar = uRes.x / uRes.y;
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = vec2(uv.x * ar, uv.y) * 2.3;
  float t = uTime * 0.025;

  // cursor stirs the ink: a smooth rotational swirl (zero at the pointer, so
  // no radial singularity), falling off with distance
  vec2 m = vec2((uMouse.x / uRes.x) * ar, uMouse.y / uRes.y) * 2.3;
  vec2 d = p - m;
  float md = uActive > 0.5 ? exp(-dot(d, d) * 0.85) : 0.0;
  vec2 swirl = vec2(-d.y, d.x);              // perpendicular = rotation

  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, -t) + 1.3));
  vec2 warp = 3.2 * q + md * 1.7 * swirl;
  vec2 r = vec2(fbm(p + warp + vec2(1.7, 9.2)), fbm(p + warp + vec2(8.3, 2.8)));
  float f = fbm(p + 3.4 * r);

  // engraving: soften then pull toward quantized bands
  f = smoothstep(0.30, 0.78, f);
  float bands = floor(f * 4.0 + 0.5) / 4.0;
  f = mix(f, bands, 0.5);

  float ink = f * 0.165 + md * 0.03;          // faint enough to sit behind the type
  vec3 col = mix(uPaper, uInk, clamp(ink, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}`;

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

function hexToRgb(v: string): [number, number, number] {
  const h = v.trim().replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const i = parseInt(n, 16);
  return [((i >> 16) & 255) / 255, ((i >> 8) & 255) / 255, (i & 255) / 255];
}

export default function InkField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uActive = gl.getUniformLocation(prog, "uActive");
    const uInk = gl.getUniformLocation(prog, "uInk");
    const uPaper = gl.getUniformLocation(prog, "uPaper");

    // theme colours from the design tokens; update on theme flip
    let ink: [number, number, number] = [0.08, 0.075, 0.06];
    let paper: [number, number, number] = [0.97, 0.96, 0.945];
    const readColors = () => {
      const cs = getComputedStyle(document.body);
      const i = cs.getPropertyValue("--ink").trim();
      const b = cs.getPropertyValue("--bg").trim();
      if (i.startsWith("#")) ink = hexToRgb(i);
      if (b.startsWith("#")) paper = hexToRgb(b);
    };
    readColors();
    const themeObs = new MutationObserver(readColors);
    themeObs.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    let dpr = 1, W = 0, H = 0;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let mx = -9999, my = -9999, tmx = -9999, tmy = -9999, active = 0;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      tmx = (e.clientX - r.left) * dpr;
      tmy = (r.height - (e.clientY - r.top)) * dpr; // gl y is bottom-up
      active = 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const onOut = (e: PointerEvent) => { if (!e.relatedTarget) active = 0; };
    window.addEventListener("pointerout", onOut);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    let raf = 0, t0 = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      if (!t0) t0 = now;
      const t = (now - t0) / 1000;
      if (mx < -9000) { mx = tmx; my = tmy; }
      mx += (tmx - mx) * 0.06; my += (tmy - my) * 0.06;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduced ? 0 : t);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform1f(uActive, reduced ? 0 : active);
      gl.uniform3fv(uInk, ink);
      gl.uniform3fv(uPaper, paper);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(frame);
    if (reduced) { /* one static frame is enough */ }

    return () => {
      cancelAnimationFrame(raf);
      themeObs.disconnect();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onOut);
    };
  }, []);

  return <canvas ref={ref} className="field-canvas" aria-hidden="true" />;
}
