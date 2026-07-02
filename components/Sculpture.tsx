"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Bernoulli lemniscate (∞) as a closed 3D curve; the sin(a) lift pulls the two
// crossing strands apart so the centre reads as a sculptural over/under weave
class Lemniscate extends THREE.Curve<THREE.Vector3> {
  s: number;
  constructor(s = 2.4) {
    super();
    this.s = s;
  }
  getPoint(u: number, target = new THREE.Vector3()) {
    const a = u * Math.PI * 2;
    const d = 1 + Math.sin(a) * Math.sin(a);
    return target.set(
      (this.s * Math.cos(a)) / d,
      (this.s * Math.sin(a) * Math.cos(a)) / d,
      Math.sin(a) * 0.55
    );
  }
}

// A matte, monochrome ∞ — a still-life object on the cover, not an effect.
// No bloom, no color, no gloss: porcelain on paper, charcoal in the dark theme.
export default function Sculpture() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 0, 9.5);

    // soft studio light: one key, one fill, gentle ambient — plaster shading
    const key = new THREE.DirectionalLight(0xffffff, 1.9);
    key.position.set(-3, 5, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.5);
    fill.position.set(4, -2, 3);
    scene.add(fill);
    const amb = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(amb);

    const mat = new THREE.MeshStandardMaterial({ color: "#eceae5", roughness: 0.82, metalness: 0 });
    const geo = new THREE.TubeGeometry(new Lemniscate(2.4), 320, 0.42, 26, true);
    const group = new THREE.Group();
    group.add(new THREE.Mesh(geo, mat));
    group.rotation.x = -0.35; // tipped like an object set down on a table
    scene.add(group);

    const applyTheme = () => {
      const dark = document.body.classList.contains("dark");
      mat.color.set(dark ? "#2e2e2e" : "#eceae5");
      key.intensity = dark ? 2.3 : 1.9; // form needs a touch more key in the dark
      amb.intensity = dark ? 0.4 : 0.55;
      if (prefersReduced) renderer.render(scene, camera); // static frame won't re-tick
    };
    const themeObs = new MutationObserver(applyTheme);
    themeObs.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    const resize = () => {
      const w = canvas.clientWidth || 320;
      const h = canvas.clientHeight || 320;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    // the cursor tilts the object a few degrees — an object you walk around,
    // not a tracker following you
    let mx = 0;
    let my = 0;
    let smx = 0;
    let smy = 0;
    const onPointer = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onPointer);

    // stop rendering when the cover (and the canvas with it) scrolls away
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      const t = clock.getElapsedTime();
      smx += (mx - smx) * 0.04;
      smy += (my - smy) * 0.04;
      group.rotation.y = Math.sin(t * 0.12) * 0.3 + smx * 0.35;
      group.rotation.x = -0.35 + Math.sin(t * 0.09) * 0.08 + smy * 0.25;
      renderer.render(scene, camera);
    };

    applyTheme();
    if (prefersReduced) renderer.render(scene, camera);
    else tick();

    return () => {
      cancelAnimationFrame(raf);
      themeObs.disconnect();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} className="still-canvas" aria-hidden="true" />;
}
