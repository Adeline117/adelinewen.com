"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// A monochrome "binary black hole ∞" field behind the cover.
// Two event horizons sit at the lobes of a lemniscate; gas/ink swirls around
// and between them along the ∞. One shader, two readings:
//   light theme → sumi-e ink on paper (Beer-Lambert + edge-darkening rim)
//   dark  theme → cosmic gas + starfield on black
// Stylised, not a physics sim: cheap full-screen fragment shader.
const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform float uDark;      // 0 light / 1 dark
uniform vec2 uMouse;      // -0.5..0.5, smoothed
uniform float uReveal;    // 0..1 load fade

float hash(vec2 p){ p = fract(p*vec2(123.34,345.45)); p += dot(p, p+34.345); return fract(p.x*p.y); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f*f*(3.0-2.0*f);
  float a = hash(i), b = hash(i+vec2(1,0)), c = hash(i+vec2(0,1)), d = hash(i+vec2(1,1));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}
float fbm(vec2 p){
  float s = 0.0, a = 0.5;
  for(int i=0;i<5;i++){ s += a*vnoise(p); p = p*2.02 + 7.1; a *= 0.5; }
  return s;
}
// rotate p around centre c by angle that grows near the core → accretion swirl
vec2 swirl(vec2 p, vec2 c, float dir){
  vec2 d = p - c;
  float r = length(d);
  float a = dir * 0.85 / (r + 0.16);
  float s = sin(a), co = cos(a);
  return c + mat2(co, -s, s, co) * d;
}

void main(){
  float aspect = uRes.x / uRes.y;
  vec2 p = vUv - 0.5;
  p.x *= aspect;

  float t = uTime * 0.05;
  // the two black holes — foci of the ∞ — with a whisper of mouse parallax
  vec2 cL = vec2(-0.52, 0.0) + uMouse * 0.05;
  vec2 cR = vec2( 0.52, 0.0) + uMouse * 0.05;

  // counter-rotating binary: swirl space around each core in turn
  vec2 q = swirl(p, cL,  1.0);
  q = swirl(q, cR, -1.0);

  // domain-warped gas advected by the swirl + slow drift
  vec2 w = vec2(fbm(q*1.7 + t), fbm(q*1.7 - t + 4.0));
  float gas = fbm(q*2.1 + w*1.4 + vec2(0.0, t*1.5));

  float dL = length(p - cL);
  float dR = length(p - cR);
  // event horizons: matter falls to black at the two cores
  float core = max(smoothstep(0.15, 0.0, dL), smoothstep(0.15, 0.0, dR));
  // accretion rings hugging each horizon
  float ring = max(exp(-pow((dL-0.23)/0.11, 2.0)), exp(-pow((dR-0.23)/0.11, 2.0)));

  float density = gas*0.6 + ring*0.5;
  density *= (1.0 - core);
  // vignette so the field is densest centre-stage, calm at the edges/type
  density *= smoothstep(1.12, 0.42, length(p));

  // watercolour edge-darkening (the recognisable ink rim) — cheap screen deriv
  float edge = 1.0 + 1.1 * clamp(length(vec2(dFdx(density), dFdy(density))) * 30.0, 0.0, 1.0);

  vec3 col;
  if(uDark > 0.5){
    // cosmos: silver gas on charcoal, black holes at the cores, a few stars.
    // kept dim so the type stays legible — a backdrop, not a spotlight.
    vec3 base = vec3(0.075);
    float g = clamp(density*edge*0.7, 0.0, 0.7);
    col = base + vec3(0.62) * g;
    float star = smoothstep(0.9965, 1.0, hash(floor((vUv*uRes)/2.0)));
    col += star * (0.35 + 0.25*sin(uTime*2.0 + hash(floor(vUv*uRes))*30.0)) * (1.0-core);
    col = mix(col, vec3(0.0), core);
  } else {
    // ink wash: Beer-Lambert transmittance through paper, edge rim, dark cores
    vec3 paper = vec3(0.968);
    float ink = clamp(density*edge, 0.0, 1.3);
    col = paper * exp(-ink * 0.5);
    col = mix(col, vec3(0.08), core*0.85);
  }

  gl_FragColor = vec4(col, uReveal * 0.82);
}
`;

const VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

export default function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const uniforms = {
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uDark: { value: document.body.classList.contains("dark") ? 1 : 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uReveal: { value: 0 },
    };
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    scene.add(mesh);

    const themeObs = new MutationObserver(() => {
      uniforms.uDark.value = document.body.classList.contains("dark") ? 1 : 0;
      if (prefersReduced) renderer.render(scene, camera);
    });
    themeObs.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    const resize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
    };
    resize();
    window.addEventListener("resize", resize);

    let mx = 0, my = 0, smx = 0, smy = 0;
    const onPointer = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onPointer);

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      uniforms.uTime.value = clock.getElapsedTime();
      smx += (mx - smx) * 0.03;
      smy += (my - smy) * 0.03;
      uniforms.uMouse.value.set(smx, smy);
      uniforms.uReveal.value = Math.min(1, uniforms.uReveal.value + 0.012);
      renderer.render(scene, camera);
    };

    if (prefersReduced) {
      uniforms.uReveal.value = 1;
      renderer.render(scene, camera);
    } else {
      tick();
    }

    return () => {
      cancelAnimationFrame(raf);
      themeObs.disconnect();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      mesh.geometry.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} className="field-canvas" aria-hidden="true" />;
}
