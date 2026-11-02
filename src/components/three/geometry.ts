import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function finish(g: THREE.BufferGeometry) {
  g.deleteAttribute("normal");
  g.deleteAttribute("uv");
  const m = mergeVertices(g, 1e-4);
  m.computeVertexNormals();
  g.dispose();
  return m;
}

/** Molar crown: a sphere sculpted into a rounded-square crown with four cusps, a central fossa and grooves. */
export function crownGeometry(seg = 160) {
  const g = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.75));
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const { x, y, z } = v;
    const rho = Math.sqrt(x * x + z * z);
    const th = Math.atan2(z, x);
    const corner = 1 + 0.09 * Math.pow(Math.sin(2 * th), 2);
    const bulge = 1 + 0.05 * Math.exp(-Math.pow((y - 0.18) / 0.35, 2));
    const pinch = y < 0 ? 1 - 0.22 * Math.pow(-y, 1.3) : 1;
    const rx = x * 1.04 * corner * bulge * pinch;
    const rz = z * 0.9 * corner * bulge * pinch;
    let ry = y >= 0 ? y * 0.95 : y * 0.88;
    if (y > 0.25) {
      const t = smooth(0.25, 0.98, y);
      ry -= t * t * 0.26; // flatten the occlusal table
      const cusp = Math.pow(0.5 + 0.5 * Math.cos(4 * (th - Math.PI / 4)), 2.4);
      const ring = Math.exp(-Math.pow((rho - 0.52) / 0.22, 2));
      ry += t * 0.22 * cusp * ring; // four cusps
      ry -= t * 0.14 * Math.exp(-(rho * rho) / 0.05); // central fossa
      const s2 = Math.sin(2 * th);
      ry -= t * 0.045 * Math.exp(-(s2 * s2) / 0.03) * Math.exp(-Math.pow((rho - 0.3) / 0.25, 2)); // grooves
    }
    p.setXYZ(i, rx, ry, rz);
  }
  return finish(g);
}

/** A tapered, slightly flared root (or a root canal when the radius is small). side = -1 | 1 */
export function rootGeometry(side: number, len = 1.9, radius = 0.44, radial = 40) {
  const pts: THREE.Vector2[] = [];
  const N = 30;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const y = -len + t * (len + 0.1);
    const r = radius * Math.pow(t, 0.42) * (1 - 0.1 * t);
    pts.push(new THREE.Vector2(Math.max(r, 0.0005), y));
  }
  const g = new THREE.LatheGeometry(pts, radial);
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const d = Math.max(0, -v.y) / len;
    p.setXYZ(i, v.x * 0.8 + side * 0.16 * Math.pow(d, 1.7), v.y, v.z * 1.1 - 0.05 * d * d);
  }
  return finish(g);
}

/** Threaded titanium implant post with a short abutment on top. */
export function implantGeometry() {
  const pts: THREE.Vector2[] = [];
  const top = -0.3;
  const bottom = -1.95;
  const pitch = 0.1;
  pts.push(new THREE.Vector2(0.0005, bottom - 0.04));
  for (let y = bottom; y <= top; y += pitch / 4) {
    const k = Math.round((y - bottom) / (pitch / 4)) % 4;
    const taper = smooth(bottom, bottom + 0.35, y);
    const core = 0.19 * (0.55 + 0.45 * taper);
    const thread = k === 1 ? 0.075 : k === 2 ? 0.035 : 0;
    pts.push(new THREE.Vector2(core + thread * taper, y));
  }
  pts.push(new THREE.Vector2(0.21, top + 0.02));
  pts.push(new THREE.Vector2(0.17, top + 0.05));
  pts.push(new THREE.Vector2(0.15, top + 0.3));
  pts.push(new THREE.Vector2(0.0005, top + 0.31));
  const g = new THREE.LatheGeometry(pts, 48);
  g.computeVertexNormals();
  return g;
}

/** Threaded implant post only (top of the post at y = 0, tip at y = -1.6). */
export function postGeometry() {
  const pts: THREE.Vector2[] = [];
  const top = 0;
  const bottom = -1.6;
  const pitch = 0.1;
  pts.push(new THREE.Vector2(0.0005, bottom - 0.05));
  for (let y = bottom; y <= top - 0.08; y += pitch / 4) {
    const k = Math.round((y - bottom) / (pitch / 4)) % 4;
    const taper = smooth(bottom, bottom + 0.4, y);
    const core = 0.17 * (0.5 + 0.5 * taper);
    const thread = k === 1 ? 0.07 : k === 2 ? 0.032 : 0;
    pts.push(new THREE.Vector2(core + thread * taper, y));
  }
  pts.push(new THREE.Vector2(0.2, top - 0.06));
  pts.push(new THREE.Vector2(0.2, top));
  pts.push(new THREE.Vector2(0.0005, top + 0.001));
  const g = new THREE.LatheGeometry(pts, 56);
  g.computeVertexNormals();
  return g;
}

/** Tapered abutment that joins the post to the crown (base at y = 0). */
export function abutmentGeometry() {
  const pts = [
    new THREE.Vector2(0.0005, 0),
    new THREE.Vector2(0.19, 0),
    new THREE.Vector2(0.2, 0.08),
    new THREE.Vector2(0.15, 0.12),
    new THREE.Vector2(0.13, 0.42),
    new THREE.Vector2(0.1, 0.46),
    new THREE.Vector2(0.0005, 0.47),
  ];
  const g = new THREE.LatheGeometry(pts, 48);
  g.computeVertexNormals();
  return g;
}
