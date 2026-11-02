"use client";

/*
 * The 3D tooth that carries the homepage story.
 * Procedural geometry (no downloaded models): enamel crown, dentin, pulp chamber and canals, roots,
 * plus an implant set (post, abutment, crown) placed in a jaw section with neighbouring teeth.
 * Every state is driven by the shared scroll store, so the DOM never re-renders while scrolling.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { abutmentGeometry, crownGeometry, implantGeometry, postGeometry, rootGeometry } from "./geometry";
import { story } from "./store";

type KF = { x: number; y: number; rx: number; ry: number; s: number; fam: number; jaw: number; cam: number };
const K = (x: number, y: number, rx: number, ry: number, s: number, fam: number, jaw: number, cam: number): KF => ({ x, y, rx, ry, s, fam, jaw, cam });

// One keyframe per scene: 0 hero, 1 anatomy, 2 treatments, 3 implant, 4 family, 5 smile gallery,
// 6 dentist, 7 clinic, 8 why us, 9 booking. Scenes 5 to 8 sit on solid backgrounds that cover the stage.
const DESKTOP: KF[] = [
  K(-1.75, 0.0, 0.04, -0.25, 0.001, 0, 0, 7), // hidden: the illustrated family owns the hero; the tooth grows in place
  K(-1.75, 0.0, 0.04, -0.25, 0.86, 0, 0, 7),
  K(2.15, -0.05, 0.15, 0.25, 0.74, 0, 0, 7),
  K(1.8, -0.05, 0.15, -0.3, 0.001, 0, 1, 7),
  K(-2.35, -0.1, 0.12, 0.35, 0.6, 1, 0, 7.4),
  K(-2.35, -0.1, 0.12, 0.35, 0.6, 1, 0, 7.4),
  K(-2.35, -0.1, 0.12, 0.35, 0.6, 1, 0, 7.4),
  K(-2.35, -0.1, 0.12, 0.35, 0.6, 1, 0, 7.4),
  K(2.55, -0.1, 0.15, -0.4, 0.56, 1, 0, 7.2),
  K(2.55, -0.1, 0.15, -0.4, 0.56, 1, 0, 7.2),
];
const MOBILE: KF[] = [
  K(0, 1.2, 0.1, -0.4, 0.001, 0, 0, 8.2),
  K(0, 1.12, 0.04, -0.25, 0.6, 0, 0, 8),
  K(0, 1.4, 0.15, 0.25, 0.42, 0, 0, 8.2),
  K(0, 1.3, 0.15, -0.3, 0.001, 0, 1, 8.2),
  K(-0.45, 1.25, 0.12, 0.35, 0.4, 1, 0, 8.2),
  K(-0.45, 1.25, 0.12, 0.35, 0.4, 1, 0, 8.2),
  K(-0.45, 1.25, 0.12, 0.35, 0.4, 1, 0, 8.2),
  K(-0.45, 1.25, 0.12, 0.35, 0.4, 1, 0, 8.2),
  K(0.45, 1.25, 0.15, -0.4, 0.4, 1, 0, 8.2),
  K(0.45, 1.25, 0.15, -0.4, 0.4, 1, 0, 8.2),
];

const keys = Object.keys(DESKTOP[0]) as (keyof KF)[];
function sample(kfs: KF[], s: number): KF {
  const max = kfs.length - 1;
  const c = Math.min(max, Math.max(0, s));
  const i = Math.floor(c);
  const j = Math.min(max, i + 1);
  const f = c - i;
  const e = f * f * (3 - 2 * f);
  const out = { ...kfs[i] };
  for (const k of keys) out[k] = kfs[i][k] + (kfs[j][k] - kfs[i][k]) * e;
  return out;
}

const damp = THREE.MathUtils.damp;
const ss = (a: number, b: number, v: number) => THREE.MathUtils.smoothstep(v, a, b);

// Label anchors, in each layer's own space (the layers move apart in the exploded view).
export const LABELS = [
  { name: "Enamel", pos: [-1.02, 0.42, 0] as const, line: 44 },
  { name: "Dentin", pos: [-0.62, 0.02, 0] as const, line: 70 },
  { name: "Pulp", pos: [-0.14, -0.14, 0] as const, line: 96 },
  { name: "Root", pos: [-0.62, -1.4, 0] as const, line: 60 },
];

type RimUniforms = {
  uRimColor: { value: THREE.Color };
  uRim: { value: number };
  uFocus: { value: number };
  uSweep: { value: number };
  uStain: { value: THREE.Color };
};

/**
 * Adds a soft fresnel rim light and a focus glow to a standard/physical material.
 * With `sweep`, a whitening band moves down the crown: below it the enamel keeps its stained shade.
 */
function withRim(m: THREE.MeshStandardMaterial, color: string, rim: number, sweep = false): RimUniforms {
  const u: RimUniforms = {
    uRimColor: { value: new THREE.Color(color) },
    uRim: { value: rim },
    uFocus: { value: 0 },
    uSweep: { value: -1.6 },
    uStain: { value: new THREE.Color("#e3c896") },
  };
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vLocalY;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvLocalY = position.y;");
    sh.fragmentShader = sh.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform vec3 uRimColor;\nuniform float uRim;\nuniform float uFocus;\nuniform float uSweep;\nuniform vec3 uStain;\nvarying float vLocalY;",
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>\n${sweep ? "diffuseColor.rgb = mix(uStain, diffuseColor.rgb, smoothstep(uSweep - 0.2, uSweep + 0.2, vLocalY));" : ""}`,
      )
      .replace(
        "#include <lights_fragment_begin>",
        `{
          float fr = pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 2.4);
          totalEmissiveRadiance += uRimColor * fr * (uRim + uFocus * 1.4) + uRimColor * uFocus * 0.16;
          ${sweep ? "float band = exp(-pow((vLocalY - uSweep) / 0.07, 2.0)) * step(-1.4, uSweep); totalEmissiveRadiance += vec3(0.72, 0.9, 1.0) * band;" : ""}
        }
        #include <lights_fragment_begin>`,
      );
  };
  m.customProgramCacheKey = () => `rim-${sweep ? 1 : 0}`;
  return u;
}

function Tooth({ lowPower, labelEls }: { lowPower: boolean; labelEls: MutableRefObject<(HTMLDivElement | null)[]> }) {
  const { size, camera } = useThree();
  const mobile = size.width < 768;
  const seg = lowPower ? 112 : 168;

  const geo = useMemo(
    () => ({
      crown: crownGeometry(seg),
      crownSmall: crownGeometry(96),
      rootL: rootGeometry(-1),
      rootR: rootGeometry(1),
      canalL: rootGeometry(-1, 1.7, 0.08, 16),
      canalR: rootGeometry(1, 1.7, 0.08, 16),
      chamber: new THREE.SphereGeometry(1, 40, 28),
      implant: implantGeometry(),
      post: postGeometry(),
      abutment: abutmentGeometry(),
      gum: new RoundedBoxGeometry(3.7, 0.5, 1.45, 6, 0.22),
      bone: new RoundedBoxGeometry(3.55, 1.9, 1.3, 6, 0.32),
      ring: new THREE.TorusGeometry(1.12, 0.012, 8, 96),
      pulse: new THREE.TorusGeometry(1, 0.02, 8, 96),
    }),
    [seg],
  );

  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, -1), 50), []);
  const localPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, -1), 0), []);

  const mat = useMemo(() => {
    const enamel = new THREE.MeshPhysicalMaterial({
      color: "#fbfdff", roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.04, ior: 1.62, envMapIntensity: 1.45,
      sheen: 0.4, sheenColor: new THREE.Color("#e4f6ff"), sheenRoughness: 0.5, specularIntensity: 1,
      side: THREE.DoubleSide, clippingPlanes: [clipPlane],
    });
    const cementum = new THREE.MeshPhysicalMaterial({
      color: "#f3ead6", roughness: 0.36, clearcoat: 0.5, clearcoatRoughness: 0.22, envMapIntensity: 1.1,
      side: THREE.DoubleSide, clippingPlanes: [clipPlane],
    });
    const dentin = new THREE.MeshPhysicalMaterial({ color: "#f2d08f", roughness: 0.5, clearcoat: 0.25, side: THREE.DoubleSide, clippingPlanes: [clipPlane] });
    const pulp = new THREE.MeshPhysicalMaterial({ color: "#e2566c", roughness: 0.38, clearcoat: 0.6, emissive: new THREE.Color("#8a1428"), emissiveIntensity: 0.3 });
    const metal = new THREE.MeshStandardMaterial({ color: "#cfd5de", metalness: 1, roughness: 0.22, envMapIntensity: 1.5 });
    const enamel2 = new THREE.MeshPhysicalMaterial({ color: "#fbfdff", roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.06, ior: 1.62, envMapIntensity: 1.35 });
    const cementum2 = new THREE.MeshPhysicalMaterial({ color: "#f3ead6", roughness: 0.4, clearcoat: 0.4 });
    const gum = new THREE.MeshPhysicalMaterial({ color: "#ee8f9c", roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.3, transparent: true, opacity: 0.8, depthWrite: false });
    const bone = new THREE.MeshPhysicalMaterial({ color: "#f1e4c9", roughness: 0.85, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide });
    const glow = new THREE.MeshBasicMaterial({ color: "#cfeeff", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const pulseM = new THREE.MeshBasicMaterial({ color: "#ff6b7d", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const u = {
      enamel: withRim(enamel, "#9ad6ff", 0.32, true),
      cementum: withRim(cementum, "#8fd0ff", 0.3),
      dentin: withRim(dentin, "#ffcf7a", 0.18),
      enamel2: withRim(enamel2, "#9ad6ff", 0.32),
      cementum2: withRim(cementum2, "#8fd0ff", 0.28),
      metal: withRim(metal, "#9fd8ff", 0.25),
    };
    return { enamel, cementum, dentin, pulp, metal, enamel2, cementum2, gum, bone, glow, pulseM, u };
  }, [clipPlane]);

  const outer = useRef<THREE.Group>(null);
  const layer = {
    enamel: useRef<THREE.Group>(null),
    dentin: useRef<THREE.Group>(null),
    pulp: useRef<THREE.Group>(null),
    root: useRef<THREE.Group>(null),
  };
  const roots = useRef<THREE.Group>(null);
  const implant = useRef<THREE.Group>(null);
  const sweepRing = useRef<THREE.Mesh>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const sparkG = useRef<THREE.Group>(null);
  const compB = useRef<THREE.Group>(null);
  const compC = useRef<THREE.Group>(null);
  const red = useRef<THREE.PointLight>(null);
  const spark = useRef<THREE.PointLight>(null);
  // implant scene
  const jaw = useRef<THREE.Group>(null);
  const post = useRef<THREE.Group>(null);
  const abut = useRef<THREE.Group>(null);
  const crown = useRef<THREE.Group>(null);
  const seat = useRef<THREE.PointLight>(null);
  const jawSpark = useRef<THREE.Group>(null);

  const tmp = useMemo(() => new THREE.Vector3(), []);
  const cur = useRef<KF & { implant: number; sweep: number; famT: number; clip: number; explode: number; impl: number; focus: number[] }>({
    ...DESKTOP[0], implant: 0, sweep: -1.6, famT: 0, clip: 0, explode: 0, impl: 0, focus: [0, 0, 0, 0],
  });

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const t = state.clock.elapsedTime;
    const reduced = story.reduced;
    const fast = reduced || story.fast;
    const lam = fast ? 30 : 3.6;
    const target = sample(mobile ? MOBILE : DESKTOP, story.scene);
    const c = cur.current;
    const idle = reduced ? 0 : 1;

    // ---- treatment sub-states (scene 2) ----
    const tr = story.treat;
    const inTreat = tr > -0.5;
    const near = (k: number) => (inTreat ? Math.max(0, 1 - Math.abs(tr - (k + 0.5)) * 1.3) : 0);
    // whitening: a light band sweeps down the crown, leaving brighter enamel above it
    const sweepTarget = inTreat && tr < 1.15 ? THREE.MathUtils.lerp(1.15, -1.25, ss(0.15, 0.8, tr)) : -1.6;
    const implantTarget = near(1);
    const famTarget = Math.max(target.fam, near(3));

    // ---- anatomy (scene 1): turn 360°, cut away, explode, reassemble ----
    const anatW = Math.max(0, 1 - Math.abs(story.scene - 1));
    const a = story.anat;
    const spin = ss(0.02, 0.3, a) * Math.PI * 2;
    const focusing = story.focus >= 0 && anatW > 0.5;
    const clipT = Math.max(ss(0.24, 0.42, a) * (1 - ss(0.93, 1, a)), focusing ? 1 : 0) * anatW;
    const explodeT = Math.max(ss(0.46, 0.72, a) * (1 - ss(0.84, 0.97, a)), focusing ? 0.55 : 0) * anatW;

    for (const k of keys) c[k] = damp(c[k], target[k], lam, dt);
    c.implant = damp(c.implant, implantTarget, lam, dt);
    c.sweep = damp(c.sweep, sweepTarget, lam * 1.2, dt);
    c.famT = damp(c.famT, famTarget, lam, dt);
    c.clip = damp(c.clip, clipT, lam * 1.2, dt);
    c.explode = damp(c.explode, explodeT, lam, dt);
    c.impl = damp(c.impl, story.impl, fast ? 30 : 5, dt);
    for (let i = 0; i < 4; i++) c.focus[i] = damp(c.focus[i], focusing && story.focus === i ? 1 : 0, fast ? 30 : 6, dt);

    const g = outer.current;
    if (!g) return;
    const mx = mobile ? 0 : story.mouseX;
    const my = mobile ? 0 : story.mouseY;
    const cosmeticSpin = near(2) * t * 0.6 * idle;
    const still = Math.max(c.clip, c.explode);
    g.position.set(c.x, c.y - 0.18 * c.explode + Math.sin(t * 1.1) * 0.06 * idle * (1 - still), 0);
    g.rotation.set(
      c.rx + my * 0.16 * idle + c.explode * 0.12,
      c.ry + spin + Math.sin(t * 0.35) * 0.2 * idle * (1 - still) + mx * 0.3 * idle + cosmeticSpin,
      Math.sin(t * 0.5) * 0.03 * idle + Math.sin(t * 38) * 0.012 * near(4) * idle,
    );
    g.scale.setScalar(c.s * (1 - 0.14 * c.explode));
    g.visible = c.s > 0.01;

    // exploded layers
    const e = c.explode;
    layer.enamel.current?.position.set(0, 0.95 * e, 0);
    if (layer.enamel.current) layer.enamel.current.rotation.x = -0.18 * e;
    layer.dentin.current?.position.set(0, 0.28 * e, 0);
    layer.pulp.current?.position.set(0.5 * e, 0.12 * e, 0.95 * e);
    layer.root.current?.position.set(0, -0.78 * e, 0);

    // cross-section: a plane through the tooth's mid-plane slides in as clip -> 1
    localPlane.constant = THREE.MathUtils.lerp(1.4, 0, c.clip);
    g.updateMatrixWorld();
    clipPlane.copy(localPlane).applyMatrix4(g.matrixWorld);
    const inside = c.clip > 0.01 || c.explode > 0.01;
    if (layer.dentin.current) layer.dentin.current.visible = inside;
    if (layer.pulp.current) layer.pulp.current.visible = inside;

    // focus glow on the layer the visitor points at
    mat.u.enamel.uFocus.value = c.focus[0];
    mat.u.dentin.uFocus.value = c.focus[1];
    mat.pulp.emissiveIntensity = 0.3 + c.focus[2] * 0.9;
    mat.u.cementum.uFocus.value = c.focus[3];

    // implant preview in the treatments scene
    if (roots.current) {
      const r = Math.max(0.0001, 1 - c.implant);
      roots.current.scale.set(1, r, 1);
      roots.current.visible = r > 0.02;
    }
    if (implant.current) {
      implant.current.scale.setScalar(Math.max(0.0001, c.implant));
      implant.current.rotation.y = (1 - c.implant) * 7;
      implant.current.visible = c.implant > 0.02;
    }

    // whitening sweep + light ring
    mat.u.enamel.uSweep.value = c.sweep;
    if (sweepRing.current) {
      const on = c.sweep > -1.35 ? near(0) : 0;
      sweepRing.current.position.y = c.sweep;
      sweepRing.current.visible = on > 0.02;
      (sweepRing.current.material as THREE.MeshBasicMaterial).opacity = on * 0.9;
    }
    // cosmetic: sparkles and a brighter rim
    mat.u.enamel.uRim.value = 0.32 + near(2) * 0.5;
    if (sparkG.current) {
      const k = near(2);
      sparkG.current.visible = k > 0.03;
      sparkG.current.scale.setScalar(Math.max(0.0001, k));
    }
    if (spark.current) spark.current.intensity = near(2) * (6 + Math.sin(t * 3) * 3);
    // emergency: warm pulse light and an expanding ring
    const em = near(4);
    if (red.current) red.current.intensity = em * (4 + Math.sin(t * 4.5) * 3.5) * (reduced ? 0.6 : 1);
    if (pulse.current) {
      const ph = reduced ? 0.4 : (t * 0.7) % 1;
      pulse.current.visible = em > 0.03;
      pulse.current.scale.setScalar(1 + ph * 1.1);
      (pulse.current.material as THREE.MeshBasicMaterial).opacity = em * (1 - ph) * 0.8;
    }

    // family composition
    const side = c.x < 0 ? 1 : -1;
    const f = c.famT;
    const place = (ref: THREE.Group | null, ox: number, oy: number, oz: number, k: number, phase: number) => {
      if (!ref) return;
      ref.visible = f > 0.02;
      ref.position.set(c.x + side * ox * Math.max(c.s, 0.4), c.y + oy * Math.max(c.s, 0.4) + Math.sin(t * 1.1 + phase) * 0.05 * idle, oz);
      ref.scale.setScalar(Math.max(0.0001, f * k * Math.max(c.s, 0.4)));
      ref.rotation.set(0.1, -side * 0.4 + Math.sin(t * 0.4 + phase) * 0.15 * idle, 0);
    };
    place(compB.current, 1.35, 0.12, -0.6, 0.92, 1.3);
    place(compC.current, 0.66, -0.9, 0.7, 0.6, 2.4);

    // ---- implant scene (scene 3): post screws into the jaw, abutment, then crown ----
    const jg = jaw.current;
    if (jg) {
      const js = c.jaw * (mobile ? 0.5 : 0.66);
      jg.visible = js > 0.01;
      jg.position.set(c.x, c.y + (mobile ? 0.05 : -0.25), 0);
      jg.scale.setScalar(Math.max(0.0001, js));
      const p = c.impl;
      jg.rotation.set(0.3 + my * 0.08 * idle, -0.6 + p * 1.0 + mx * 0.2 * idle + Math.sin(t * 0.3) * 0.05 * idle, 0);
      const postK = ss(0.1, 0.48, p);
      if (post.current) {
        post.current.visible = p > 0.06;
        post.current.position.y = 0.1 + (1 - postK) * 2.6;
        post.current.rotation.y = -postK * Math.PI * 9;
        post.current.scale.setScalar(Math.max(0.0001, ss(0.06, 0.12, p)));
      }
      const abK = ss(0.52, 0.66, p);
      if (abut.current) {
        abut.current.visible = p > 0.49;
        abut.current.position.y = 0.1 + (1 - abK) * 1.8;
        abut.current.scale.setScalar(Math.max(0.0001, ss(0.49, 0.53, p)));
      }
      const crK = ss(0.68, 0.88, p);
      if (crown.current) {
        crown.current.visible = p > 0.65;
        crown.current.position.y = 0.78 + (1 - crK) * 2.2;
        crown.current.rotation.y = (1 - crK) * 0.8;
        crown.current.scale.setScalar(Math.max(0.0001, 0.6 * ss(0.65, 0.7, p)));
      }
      const landed = Math.exp(-Math.pow((p - 0.9) / 0.05, 2));
      if (seat.current) seat.current.intensity = landed * 9 * c.jaw;
      if (jawSpark.current) {
        jawSpark.current.visible = landed > 0.05 && c.jaw > 0.5;
        jawSpark.current.scale.setScalar(Math.max(0.0001, landed));
      }
    }

    // camera
    camera.position.x = damp(camera.position.x, mx * 0.25, 3, dt);
    camera.position.y = damp(camera.position.y, my * 0.15, 3, dt);
    camera.position.z = c.cam;
    camera.lookAt(0, 0, 0);

    // anatomy labels: projected from each moving layer, faded in one by one
    const refs = [layer.enamel.current, layer.dentin.current, layer.pulp.current, layer.root.current];
    LABELS.forEach((l, i) => {
      const el = labelEls.current[i];
      const lg = refs[i];
      if (!el || !lg) return;
      const on = !mobile && anatW > 0.6 && c.clip > 0.55 && (a > 0.3 + i * 0.035 || focusing);
      tmp.set(l.pos[0], l.pos[1], l.pos[2]).applyMatrix4(lg.matrixWorld).project(camera);
      const sx = (tmp.x * 0.5 + 0.5) * size.width;
      const sy = (-tmp.y * 0.5 + 0.5) * size.height;
      el.style.opacity = on ? "1" : "0";
      el.style.pointerEvents = on ? "auto" : "none";
      el.dataset.active = story.focus === i ? "true" : "false";
      el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-100%, -50%) translateX(${on ? 0 : 12}px)`;
    });
  });

  const body = (enamel: THREE.Material, cementum: THREE.Material, crownGeo = geo.crown) => (
    <group position={[0, 0.8, 0]}>
      <mesh geometry={crownGeo} material={enamel} />
      <group position={[0, -0.55, 0]}>
        <mesh geometry={geo.rootL} material={cementum} position={[-0.4, 0, 0]} />
        <mesh geometry={geo.rootR} material={cementum} position={[0.4, 0, 0]} />
      </group>
    </group>
  );

  return (
    <>
      <group ref={outer}>
        <group position={[0, 0.8, 0]}>
          <group ref={layer.enamel}>
            <mesh geometry={geo.crown} material={mat.enamel} />
            <mesh ref={sweepRing} geometry={geo.ring} material={mat.glow} rotation-x={Math.PI / 2} scale={[1.02, 0.86, 1]} visible={false} />
          </group>
          <group ref={layer.root}>
            <group ref={roots} position={[0, -0.55, 0]}>
              <mesh geometry={geo.rootL} material={mat.cementum} position={[-0.4, 0, 0]} />
              <mesh geometry={geo.rootR} material={mat.cementum} position={[0.4, 0, 0]} />
            </group>
          </group>
          <group ref={layer.dentin} visible={false}>
            <mesh geometry={geo.crown} material={mat.dentin} scale={[0.8, 0.78, 0.8]} position={[0, -0.06, 0]} />
            <group position={[0, -0.55, 0]}>
              <mesh geometry={geo.rootL} material={mat.dentin} position={[-0.4, 0.02, 0]} scale={[0.66, 0.92, 0.66]} />
              <mesh geometry={geo.rootR} material={mat.dentin} position={[0.4, 0.02, 0]} scale={[0.66, 0.92, 0.66]} />
            </group>
          </group>
          <group ref={layer.pulp} visible={false}>
            <group position={[0, -0.55, 0]}>
              <mesh geometry={geo.canalL} material={mat.pulp} position={[-0.4, 0.04, 0]} />
              <mesh geometry={geo.canalR} material={mat.pulp} position={[0.4, 0.04, 0]} />
            </group>
            <mesh geometry={geo.chamber} material={mat.pulp} scale={[0.4, 0.22, 0.3]} position={[0, -0.14, 0]} />
          </group>
          <group ref={implant} visible={false}>
            <mesh geometry={geo.implant} material={mat.metal} />
          </group>
        </group>
        <mesh ref={pulse} geometry={geo.pulse} material={mat.pulseM} position={[0, 0.85, 0]} rotation-x={Math.PI / 2} visible={false} />
        <group ref={sparkG} visible={false}>
          <Sparkles count={lowPower ? 18 : 36} scale={[3.2, 3.6, 2.4]} size={3.2} speed={0.45} color="#e8f7ff" opacity={0.9} />
        </group>
      </group>

      <group ref={compB} visible={false}>{body(mat.enamel2, mat.cementum2, geo.crownSmall)}</group>
      <group ref={compC} visible={false}>{body(mat.enamel2, mat.cementum2, geo.crownSmall)}</group>

      {/* jaw section for the implant story */}
      <group ref={jaw} visible={false}>
        <mesh geometry={geo.bone} material={mat.bone} position={[0, -1.25, 0]} renderOrder={2} />
        <mesh geometry={geo.gum} material={mat.gum} position={[0, -0.1, 0]} renderOrder={3} />
        <group position={[-1.2, 0.25, 0]} scale={0.6}>{body(mat.enamel2, mat.cementum2, geo.crownSmall)}</group>
        <group position={[1.2, 0.25, 0]} scale={0.6}>{body(mat.enamel2, mat.cementum2, geo.crownSmall)}</group>
        <group ref={post} visible={false}>
          <mesh geometry={geo.post} material={mat.metal} />
        </group>
        <group ref={abut} visible={false}>
          <mesh geometry={geo.abutment} material={mat.metal} />
        </group>
        <group ref={crown} visible={false}>
          <mesh geometry={geo.crownSmall} material={mat.enamel2} />
        </group>
        <pointLight ref={seat} position={[0, 0.9, 1.4]} intensity={0} distance={5} color="#dff3ff" />
        <group ref={jawSpark} position={[0, 0.8, 0]} visible={false}>
          <Sparkles count={lowPower ? 14 : 26} scale={[1.6, 1.4, 1.2]} size={3} speed={0.6} color="#ffffff" />
        </group>
      </group>

      <pointLight ref={spark} position={[1.6, 1.8, 2.6]} intensity={0} distance={7} color="#ffffff" />
      <pointLight ref={red} position={[0.5, -0.6, 2.4]} intensity={0} distance={7} color="#ff5468" />
    </>
  );
}

export default function ToothScene({ active, lowPower }: { active: boolean; lowPower: boolean }) {
  const labelEls = useRef<(HTMLDivElement | null)[]>([]);
  const setFocus = (i: number) => () => {
    story.focus = i;
  };
  return (
    <div className="absolute inset-0">
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={lowPower ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0, 0, 7], fov: 35, near: 0.1, far: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.NeutralToneMapping, toneMappingExposure: 1.05 }}
        onCreated={({ gl }) => {
          gl.localClippingEnabled = true;
          gl.setClearColor(0x000000, 0);
        }}
        style={{ pointerEvents: "none" }}
        aria-hidden
      >
        <hemisphereLight args={["#ffffff", "#cfe9ff", 0.95]} />
        <directionalLight position={[4, 6, 5]} intensity={2.3} color="#fffaf2" />
        <directionalLight position={[-5, 2, -4]} intensity={1.6} color="#8fd3ff" />
        <directionalLight position={[3, -2, -5]} intensity={1.1} color="#a8dcff" />
        <directionalLight position={[0, -4, 3]} intensity={0.7} color="#eaf7ff" />
        <Environment resolution={lowPower ? 128 : 256} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[10, 3, 1]} />
          <Lightformer form="rect" intensity={1.8} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} color="#bfe8ff" />
          <Lightformer form="rect" intensity={1.4} position={[5, 0, 2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
          <Lightformer form="rect" intensity={1.2} position={[0, -3, -4]} scale={[8, 2, 1]} color="#d6f0ff" />
          <Lightformer form="ring" intensity={1.8} position={[2, 2, 5]} scale={2} />
        </Environment>
        <Tooth lowPower={lowPower} labelEls={labelEls} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {LABELS.map((l, i) => (
          <button
            type="button"
            tabIndex={-1}
            key={l.name}
            ref={(el) => {
              labelEls.current[i] = el as unknown as HTMLDivElement;
            }}
            onPointerEnter={setFocus(i)}
            onPointerLeave={setFocus(-1)}
            onFocus={setFocus(i)}
            onBlur={setFocus(-1)}
            className="anat-label group absolute left-0 top-0 flex items-center gap-2 whitespace-nowrap"
            style={{ opacity: 0 }}
            aria-label={`Highlight the ${l.name.toLowerCase()}`}
          >
            <span className="anat-chip rounded-full bg-white/90 px-3 py-1 font-sans text-[13px] font-semibold text-brand-ink shadow-sm ring-1 ring-line backdrop-blur transition">{l.name}</span>
            <span className="h-px bg-brand/60" style={{ width: l.line }} />
            <span className="anat-dot h-2.5 w-2.5 rounded-full border-2 border-white bg-brand shadow transition" />
          </button>
        ))}
      </div>
    </div>
  );
}
