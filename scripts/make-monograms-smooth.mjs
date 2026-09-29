/*
  Smooth lot-split variants (L1–L6): option H's heavy rounded-stroke letters
  (round caps + joins, soft curves) set inside a lot-split parcel.
    node scripts/make-monograms-smooth.mjs
  Output per variant: src/assets/brand/monogram-l<n>.svg (colour) and
  monogram-l<n>-mono.svg (one-colour black silhouette, a single path).

  Rules from Zach's feedback: no survey dot, no circle container, and the
  letters sit inside the parcel with a clear margin (nothing bleeds off the
  edge). Balance (Zach's second note): Z and T are the same height, width
  and stroke; the pair is centred with equal margins (optically nudged, see
  balanced()); and the gap between the letters is the lot line, splitting
  the parcel into two lots of near-equal area. Strokes are built as real outlines (capsules),
  so the colour and one-colour files are flat filled shapes, no SVG strokes.
*/
import fs from "node:fs";
import path from "node:path";
import { pc, R, circle, roundRect, bez, d, header } from "./lib/geo.mjs";

const out = path.resolve("src/assets/brand");
const C = { paper: "#f3f0e8", blue: "#0a4f9c", ink: "#0f1419", black: "#000000" };

/* ---- round-cap, round-join stroke of a polyline, as a filled outline ---- */
function capsule([x1, y1], [x2, y2], r) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
  const nx = (-dy / L) * r, ny = (dx / L) * r;
  return [[[x1 + nx, y1 + ny], [x2 + nx, y2 + ny], [x2 - nx, y2 - ny], [x1 - nx, y1 - ny], [x1 + nx, y1 + ny]]];
}
function stroke(pts, w) {
  const r = w / 2, parts = pts.map(([x, y]) => circle(x, y, r, 96));
  for (let i = 1; i < pts.length; i++) parts.push(capsule(pts[i - 1], pts[i], r));
  return pc.union(...parts);
}

/* ---- balanced letterforms (64 grid) ----
   The letter block is a square centred on the parcel (equal margins on all
   four sides). It is split down the vertical centre line x = 32: the Z fills
   the left half, the T the right half, so both letters have the same width,
   the same height and the same stroke, and the two "lots" either side of the
   centre line are equal in area.
   box:  [x0, y0, x1, y1] outer edge of the letter block (strokes included)
   gap:  space between the letters, straddling x = 32
   join: "shared" one stroke is the Z's top and the T's crossbar
         "touch"  the round ends meet on the centre line
         "gap"    a clear gap on the centre line
   soft: bulge of an S-curved diagonal (0 = straight)                     */
function letters({ w = 8, box = [12, 12, 52, 52], gap = 3, join = "gap", soft = 0, split }) {
  const [x0, y0, x1, y1] = box, r = w / 2, cx = split ?? (x0 + x1) / 2;
  const g = join === "touch" ? 0 : gap;
  const top = y0 + r, base = y1 - r;
  const zl = x0 + r, zr = cx - g / 2 - r;          // Z centreline, left half
  const tl = cx + g / 2 + r, tr = x1 - r;          // T crossbar, right half
  const st = (tl + tr) / 2;                        // T stem centred on its crossbar
  const diag = soft
    ? bez([zr, top], [zr - soft * 0.2, top + soft], [zl + soft * 0.2, base - soft], [zl, base], 32)
    : [[zl, base]];
  const Z = stroke([[zl, top], [zr, top], ...diag, [zr, base]], w);
  const T = pc.union(stroke([[tl, top], [tr, top]], w), stroke([[st, top], [st, base]], w));
  const parts = [Z, T];
  if (join === "shared") parts.push(stroke([[zr, top], [tl, top]], w));
  return pc.union(...parts);
}

/* Optical balance: the Z has three strokes and the T two, and the T's right
   side is open under its crossbar, so with a geometrically centred block the
   ink leans left (its centre of mass sits ~1.2 units left of the centre line).
   balanced() keeps the letters identical (equal widths, height and stroke)
   and slides the pair right until the ink's centre of mass sits exactly on
   x = 32: optical centring. L3 skips this and stays geometrically strict. */
function ringStats(ring) {
  let a = 0, cx = 0;
  for (let j = 0; j < ring.length - 1; j++) {
    const [x1, y1] = ring[j], [x2, y2] = ring[j + 1], c = x1 * y2 - x2 * y1;
    a += c; cx += (x1 + x2) * c;
  }
  return { a: a / 2, cx: a ? cx / (3 * a) : 0 };
}
function centroidX(g) {
  let A = 0, M = 0;
  for (const poly of g) poly.forEach((ring, i) => {
    const { a, cx } = ringStats(ring), aa = Math.abs(a) * (i === 0 ? 1 : -1);
    A += aa; M += aa * cx;
  });
  return M / A;
}
const shiftX = (g, dx) => g.map((poly) => poly.map((ring) => ring.map(([x, y]) => [x + dx, y])));
function balanced(opts) {
  const g = letters(opts);
  return shiftX(g, 32 - centroidX(g));
}

/* ---- parcels ---- */
const rounded = roundRect(2, 2, 62, 62, 13);
const sharp = R(3, 3, 61, 61);


function solid(parcel, mark, fill = C.blue) {
  const body = pc.difference(parcel, mark);
  return { mark,
    color: `  <path fill="${fill}" d="${d(parcel)}"/>\n  <path fill="${C.paper}" d="${d(pc.intersection(parcel, mark))}"/>\n`,
    mono: `  <path fill="${C.black}" d="${d(body)}"/>\n`,
  };
}
function outlined(outer, inner, mark, line = C.blue) {
  const ring = pc.difference(outer, inner);
  return { mark,
    color: `  <path fill="${C.paper}" d="${d(outer)}"/>\n  <path fill="${line}" d="${d(pc.union(ring, mark))}"/>\n`,
    mono: `  <path fill="${C.black}" d="${d(pc.union(ring, mark))}"/>\n`,
  };
}

const V = [
  { k: "l1", name: "Shared stroke",
    line: "One smooth top stroke is both the Z's top and the T's crossbar; equal-width letters, optically centred, splitting the rounded parcel into two near-equal lots.",
    ...solid(rounded, balanced({ w: 8, join: "shared", gap: 3, box: [11, 11, 53, 53] })) },
  { k: "l2", name: "Touching",
    line: "Two identical-width smooth letters whose round ends meet on the lot line, optically centred so neither side of the parcel feels heavier.",
    ...solid(rounded, balanced({ w: 8, join: "touch", box: [11, 11, 53, 53] })) },
  { k: "l3", name: "Centre line (symmetric)",
    line: "The strictly symmetric version: equal margins on all four sides, equal-width letters, and the gap exactly on the vertical axis, so the two lots are exactly equal.",
    ...solid(rounded, letters({ w: 7.5, join: "gap", gap: 4, box: [12.5, 12.5, 51.5, 51.5] })) },
  { k: "l4", name: "Sharp parcel, heavy",
    line: "The heaviest stroke on a square-cornered survey parcel: two equal letters with a small gap for the lot line, optically centred.",
    ...solid(sharp, balanced({ w: 9.5, join: "gap", gap: 3, box: [10.5, 10.5, 53.5, 53.5] })) },
  { k: "l5", name: "Outlined parcel",
    line: "Plat-map version: a heavy rounded boundary line on paper, with the smooth blue ZT (equal letters, small gap) optically centred inside it.",
    ...outlined(rounded, roundRect(7.5, 7.5, 56.5, 56.5, 8), balanced({ w: 7, join: "gap", gap: 3.5, box: [15, 15, 49, 49] })) },
  { k: "l6", name: "Soft curves",
    line: "The Z's diagonal eases through a gentle S-curve, like a road winding between the two lots; equal letters with a gap, optically centred.",
    ...solid(rounded, balanced({ w: 8, join: "gap", gap: 3.5, soft: 9, box: [11, 11, 53, 53] })) },
];

/* Balance check: letter bounding box vs. tile, and how the ink splits
   either side of the centre line x = 32 (printed, not written to the SVGs). */
const area = (g) => g.reduce((A, poly) => A + poly.reduce((a, ring, i) => {
  let s = 0; for (let j = 0; j < ring.length - 1; j++) s += ring[j][0] * ring[j + 1][1] - ring[j + 1][0] * ring[j][1];
  return a + (i === 0 ? 1 : -1) * Math.abs(s / 2);
}, 0), 0);
for (const v of V) {
  const m = v.mark, pts = m.flat(2);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const L = area(pc.intersection(m, R(-10, -10, 32, 74))), Rr = area(pc.intersection(m, R(32, -10, 74, 74)));
  console.log(`${v.k}: margins L ${(Math.min(...xs)).toFixed(1)} R ${(64 - Math.max(...xs)).toFixed(1)} T ${(Math.min(...ys)).toFixed(1)} B ${(64 - Math.max(...ys)).toFixed(1)} · ink centre x ${centroidX(m).toFixed(2)} · ink left/right of axis ${(L / Rr).toFixed(2)}`);
}
for (const v of V) {
  const title = `ZT monogram — option ${v.k.toUpperCase()}, smooth lot split: ${v.name}`;
  fs.writeFileSync(path.join(out, `monogram-${v.k}.svg`), header(title, v.line) + v.color + "</svg>\n");
  fs.writeFileSync(path.join(out, `monogram-${v.k}-mono.svg`), header(title + " (single colour)", v.line) + v.mono + "</svg>\n");
}
fs.writeFileSync(path.resolve("scripts/smooth-variants.json"), JSON.stringify(V.map(({ k, name, line }) => ({ k, name, line })), null, 2) + "\n");
console.log("wrote", V.map((v) => v.k).join(", "));
