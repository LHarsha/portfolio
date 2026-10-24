import { rng } from './rng.js';

const f = (n) => n.toFixed(1);

// Polar points with seeded radius noise, joined by quadratic curves.
// Low jag = egg, high jag = splash.
// splash > 0 pushes every other point outward for a spiky, splashy edge.
// boil + boilSeed add a small extra jitter on top of the same shape: draw one shape with a few
// boilSeeds and flip between them for hand-drawn line boil without an SVG filter.
export function blobPath({ cx = 0, cy = 0, r = 100, rx, ry, points = 24, jag = 0.08, splash = 0, seed = 1, boil = 0, boilSeed = 0 }) {
  const rand = rng(seed);
  const shake = rng(boilSeed * 7919 + 1);
  const ax = rx ?? r;
  const ay = ry ?? r;
  const pts = Array.from({ length: points }, (_, i) => {
    const a = (i / points) * Math.PI * 2;
    const k = 1 + (rand() * 2 - 1) * jag + (i % 2 ? splash * (0.4 + rand() * 0.6) : 0) + (boil ? (shake() * 2 - 1) * boil : 0);
    return [cx + Math.cos(a) * ax * k, cy + Math.sin(a) * ay * k];
  });
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const start = mid(pts[points - 1], pts[0]);
  let d = `M${f(start[0])} ${f(start[1])}`;
  pts.forEach((p, i) => {
    const m = mid(p, pts[(i + 1) % points]);
    d += `Q${f(p[0])} ${f(p[1])} ${f(m[0])} ${f(m[1])}`;
  });
  return d + 'Z';
}

// One arm of a flat spiral, as a polyline path from inner to outer radius.
export function spiralArm({ r0 = 20, r1 = 150, turns = 0.9, offset = 0, steps = 40 }) {
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = offset + t * turns * Math.PI * 2;
    const r = r0 + (r1 - r0) * t;
    d += `${i ? 'L' : 'M'}${f(Math.cos(a) * r)} ${f(Math.sin(a) * r)}`;
  }
  return d;
}

// A rounded drop hanging from y=0: straight sides, round bulb at the bottom.
export function dripPath(x, w, len) {
  return `M${f(x - w)} 0L${f(x - w * 0.8)} ${f(len - w)}A${f(w)} ${f(w)} 0 0 0 ${f(x + w)} ${f(len - w)}L${f(x + w * 0.9)} 0Z`;
}

// A tapered drip from y=top: wide where it leaves the surface, a thin neck, a round bulb at the end.
export function taperedDrip(x, w, len, top = 0) {
  const n = w * 0.36;
  const r = w * 0.66;
  const cy = top + len - r;
  const ny = cy - Math.sqrt(r * r - n * n);
  const k = (ny - top) * 0.5;
  return `M${f(x - w)} ${f(top)}C${f(x - w)} ${f(top + k)} ${f(x - n)} ${f(ny - k * 0.7)} ${f(x - n)} ${f(ny)}A${f(r)} ${f(r)} 0 1 0 ${f(x + n)} ${f(ny)}C${f(x + n)} ${f(ny - k * 0.7)} ${f(x + w)} ${f(top + k)} ${f(x + w)} ${f(top)}Z`;
}

// A falling drop, point up, from y=top.
export function fallingDrop(x, r, top) {
  return `M${f(x)} ${f(top)}Q${f(x + r * 1.1)} ${f(top + r * 1.5)} ${f(x)} ${f(top + r * 2.3)}Q${f(x - r * 1.1)} ${f(top + r * 1.5)} ${f(x)} ${f(top)}Z`;
}

// 4-point cartoon sparkle centred on (x, y).
export function sparklePath(x, y, s) {
  const k = s * 0.22;
  return `M${f(x)} ${f(y - s)}Q${f(x + k)} ${f(y - k)} ${f(x + s)} ${f(y)}Q${f(x + k)} ${f(y + k)} ${f(x)} ${f(y + s)}Q${f(x - k)} ${f(y + k)} ${f(x - s)} ${f(y)}Q${f(x - k)} ${f(y - k)} ${f(x)} ${f(y - s)}Z`;
}
