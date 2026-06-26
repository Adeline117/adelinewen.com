"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

// Bernoulli lemniscate (∞) as a 3D curve
class Lemniscate extends THREE.Curve<THREE.Vector3> {
  s: number;
  constructor(s = 2.6) {
    super();
    this.s = s;
  }
  getPoint(u: number, target = new THREE.Vector3()) {
    const a = u * Math.PI * 2;
    const d = 1 + Math.sin(a) * Math.sin(a);
    return target.set(
      (this.s * Math.cos(a)) / d,
      (this.s * Math.sin(a) * Math.cos(a)) / d,
      // keep the original gentle wave, plus a sin(a) term that lifts the two
      // crossing strands apart in depth (one in front, one behind) so the centre
      // reads as a smooth over/under weave instead of a hard intersection
      Math.sin(a * 2) * 0.35 + Math.sin(a) * 0.3
    );
  }
}

export default function InfinityHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile =
      window.matchMedia("(max-width: 760px)").matches || navigator.maxTouchPoints > 0;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as { connection?: { saveData?: boolean } }).connection?.saveData;
    const isStatic = prefersReduced || !!saveData;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // toneMappingExposure is set per-theme by applyTheme() below

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const l1 = new THREE.DirectionalLight(0xffffff, 2.2);
    l1.position.set(4, 5, 3);
    scene.add(l1);
    const l2 = new THREE.PointLight(0x7c5cf0, 70, 40);
    l2.position.set(-5, -1, 3);
    scene.add(l2);
    const l3 = new THREE.PointLight(0x896afb, 45, 40);
    l3.position.set(4, -4, -2);
    scene.add(l3);

    const curve = new Lemniscate(2.6);
    const group = new THREE.Group();
    scene.add(group);

    const tubeGeo = new THREE.TubeGeometry(curve, isMobile ? 240 : 480, 0.2, isMobile ? 18 : 32, true);
    tubeGeo.computeTangents(); // needed for anisotropic highlights along the tube
    const glass = new THREE.MeshPhysicalMaterial({
      transmission: 1,
      thickness: 1.6,
      roughness: 0,
      ior: 1.7,
      dispersion: 3.0,
      iridescence: 1,
      iridescenceIOR: 1.45,
      iridescenceThicknessRange: [120, 500],
      anisotropy: 0.3, // stretches speculars along the curve — softer, glassier highlights
      anisotropyRotation: Math.PI / 2,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      color: new THREE.Color("#c6bbff"),
      attenuationColor: new THREE.Color("#7c5cf0"),
      attenuationDistance: 2.2,
      envMapIntensity: 1.6,
    });
    const tube = new THREE.Mesh(tubeGeo, glass);
    group.add(tube);

    const bead = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xcfc2ff })
    );
    group.add(bead);
    const beadLight = new THREE.PointLight(0x896afb, 6, 5);
    bead.add(beadLight);

    const stationsU = [0.18, 0.42, 0.68, 0.92];
    const stations: THREE.Mesh[] = [];
    stationsU.forEach((u) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 18, 18),
        new THREE.MeshBasicMaterial({ color: 0x7c5cf0, transparent: true, opacity: 0.4 })
      );
      m.position.copy(curve.getPoint(u));
      group.add(m);
      stations.push(m);
    });

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.5, // strength (set per-theme below)
      0.8, // radius — slightly wider, softer halo
      0.84 // threshold
    );
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    // Theme-aware glow: additive bloom pops on dark but washes out on the light
    // cream bg — there the loop reads better as crisper, lower-key glass.
    const applyTheme = () => {
      const dark = document.body.classList.contains("dark");
      bloom.strength = isMobile ? (dark ? 0.32 : 0.22) : dark ? 0.5 : 0.34;
      renderer.toneMappingExposure = dark ? 1.18 : 1.05;
      if (isStatic) composer.render(); // static frame won't re-tick, so repaint now
    };
    const themeObs = new MutationObserver(applyTheme);
    themeObs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    applyTheme();

    let mx = 0;
    let my = 0;
    const onPointer = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onPointer);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    const tmp = new THREE.Vector3();
    let curU = 0;
    let smx = 0; // smoothed cursor → glides the light, not the geometry
    let smy = 0;
    let curOpacity = 0; // starts hidden → eases in on load, and smooths scroll fades
    let raf = 0;
    let frame = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return; // don't burn GPU/battery on a hidden tab

      // once scrolled past the hero the loop is just a faint backdrop (≈0.14 opacity) —
      // render it at half rate to save GPU/battery; full rate while the hero is on screen
      frame++;
      const pastHero = window.scrollY > window.innerHeight && curOpacity < 0.2;
      if (pastHero && frame % 2 === 0) return;

      const t = clock.getElapsedTime();
      const max = document.body.scrollHeight - window.innerHeight;
      const targetU = max > 0 ? window.scrollY / max : 0;
      curU += (targetU - curU) * 0.06;

      curve.getPoint(curU % 1, tmp);
      bead.position.copy(tmp);

      // fade the loop to an ambient backdrop once past the hero (eased → also fades in on load)
      const targetOpacity = Math.max(0.14, 1 - (window.scrollY / window.innerHeight) * 0.95);
      curOpacity += (targetOpacity - curOpacity) * 0.08;
      canvas.style.opacity = String(curOpacity);

      if (!prefersReduced) {
        // Keep the loop near front-facing so its silhouette stays a balanced,
        // symmetric ∞ — only a whisper of slow tilt for life. (Bigger rotation
        // projected the depth-weave into the outline and read as lopsided.)
        group.rotation.y = Math.sin(t * 0.16) * 0.05;
        group.rotation.x = -0.05 + Math.sin(t * 0.11) * 0.025;
        // The cursor glides the light across the glass — the loop itself stays calm.
        // (Tilting the whole ∞ toward the pointer felt dizzy and fought the hero text.)
        smx += (mx - smx) * 0.05;
        smy += (my - smy) * 0.05;
        l2.position.set(-5 + smx * 2.5, -1 - smy * 2, 3);
        l3.position.set(4 - smx * 2.5, -4 - smy * 2, -2);
        // subtle life: the bead breathes, its light pulses, the station nodes twinkle
        bead.scale.setScalar(1 + Math.sin(t * 2.2) * 0.09);
        beadLight.intensity = 6 + Math.sin(t * 2.2) * 2;
        for (let i = 0; i < stations.length; i++) {
          const mat = stations[i].material as THREE.MeshBasicMaterial;
          mat.opacity = 0.4 + Math.sin(t * 1.3 + i * 1.7) * 0.22;
        }
      } else {
        group.rotation.x = -0.13;
      }
      camera.lookAt(0, 0, 0);
      composer.render();
    };

    if (isStatic) {
      // static frame — no continuous loop (saves battery / data)
      group.rotation.x = -0.13;
      curve.getPoint(0, tmp);
      bead.position.copy(tmp);
      canvas.style.opacity = "0.85";
      composer.render();
    } else {
      tick();
    }

    return () => {
      cancelAnimationFrame(raf);
      themeObs.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      composer.dispose();
      tubeGeo.dispose();
      glass.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas id="scene" ref={canvasRef} aria-hidden="true" />;
}
