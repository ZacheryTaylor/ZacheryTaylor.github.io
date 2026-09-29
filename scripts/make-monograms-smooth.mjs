/*
  Smooth lot-split variants (L1–L6): option H's heavy rounded-stroke letters
  (round caps + joins, soft curves) set inside a lot-split parcel.
    node scripts/make-monograms-smooth.mjs
  Output per variant: src/assets/brand/monogram-l<n>.svg (colour) and
  monogram-l<n>-mono.svg (one-colour black silhouette, a single path).

  Rules from Zach's feedback: no survey dot, no circle container, and the
  letters sit inside the parcel with a clear margin (nothing bleeds off the
  edge). The Z's diagonal divides the parcel's open ground into two lots; the
  T stands on the upper lot. Strokes are built as real outlines (capsules),
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

/* ---- letterforms (64 grid). Z and T share the same cap height. ----
   join: "shared"  one stroke is the Z's top and the T's crossbar
         "touch"   the Z's top and the T's crossbar meet cap to cap
         "gap"     a small gap separates the two letters                   */
function letters({ w = 8, join = "shared", top = 20, base = 44, zl = 13.5, zr = 28, tr = 50.5, stem = 40, gap = 3, soft = 0 }) {
  const Z = [[zl, top], [zr, top], [zl, base], [zr, base]];
  // soft: the diagonal becomes a gentle S-curve (like a road easing through a
  // curve) that leaves the top and meets the base more steeply, softening both corners
  const zPts = soft
    ? [[zl, top], [zr, top], ...bez([zr, top], [zr - soft * 0.2, top + soft], [zl + soft * 0.2, base - soft], [zl, base], 32), [zr, base]]
    : Z;
  if (join === "shared") return pc.union(stroke([[zl, top], [tr, top]], w), stroke(zPts, w), stroke([[stem, top], [stem, base]], w));
  // separate letters: the T's crossbar starts one stroke-width (touch) or
  // stroke-width + gap to the right of the Z's top-right cap centre
  const tl = zr + w + (join === "gap" ? gap : 0);
  const st = (tl + tr) / 2;
  return pc.union(stroke(zPts, w), stroke([[tl, top], [tr, top]], w), stroke([[st, top], [st, base]], w));
}

/* ---- parcels ---- */
const rounded = roundRect(2, 2, 62, 62, 13);
const sharp = R(3, 3, 61, 61);

function solid(parcel, mark, fill = C.blue) {
  const body = pc.difference(parcel, mark);
  return {
    color: `  <path fill="${fill}" d="${d(parcel)}"/>\n  <path fill="${C.paper}" d="${d(pc.intersection(parcel, mark))}"/>\n`,
    mono: `  <path fill="${C.black}" d="${d(body)}"/>\n`,
  };
}
function outlined(outer, inner, mark, line = C.blue) {
  const ring = pc.difference(outer, inner);
  return {
    color: `  <path fill="${C.paper}" d="${d(outer)}"/>\n  <path fill="${line}" d="${d(pc.union(ring, mark))}"/>\n`,
    mono: `  <path fill="${C.black}" d="${d(pc.union(ring, mark))}"/>\n`,
  };
}

const V = [
  { k: "l1", name: "Shared stroke",
    line: "H's smooth heavy line as a ZT ligature: one rounded stroke is both the Z's top and the T's crossbar, cut from a rounded blue parcel.",
    ...solid(rounded, letters({ w: 8.5, join: "shared" })) },
  { k: "l2", name: "Touching",
    line: "The Z and T are separate smooth strokes whose round ends just meet, so the pinch between them marks the lot corner.",
    ...solid(rounded, letters({ w: 8.5, join: "touch", zl: 12, zr: 26, tr: 52 })) },
  { k: "l3", name: "Small gap, lighter",
    line: "A lighter stroke with a small gap between the letters: the most open and legible pair, like two lots with a setback.",
    ...solid(rounded, letters({ w: 7, join: "gap", gap: 3.2, zl: 13, zr: 26.5, tr: 51 })) },
  { k: "l4", name: "Sharp parcel, heavy",
    line: "The shared-stroke ligature at its heaviest, on a square-cornered parcel: a crisp survey-lot outline around soft letters.",
    ...solid(sharp, letters({ w: 9.5, join: "shared", top: 20.5, base: 43.5, zl: 14, zr: 28.5, tr: 50, stem: 40.5 })) },
  { k: "l5", name: "Outlined parcel",
    line: "Plat-map version: a heavy rounded boundary line on paper with the smooth blue ZT standing inside the lot.",
    ...outlined(rounded, roundRect(7.5, 7.5, 56.5, 56.5, 8), letters({ w: 7.5, join: "shared", top: 21.5, base: 42.5, zl: 16, zr: 29, tr: 48, stem: 39.5 })) },
  { k: "l6", name: "Soft curves",
    line: "The Z's diagonal eases through a gentle S-curve, like a road winding between the two lots, with the shared top stroke to the T.",
    ...solid(rounded, letters({ w: 8.5, join: "shared", soft: 9 })) },
];

for (const v of V) {
  const title = `ZT monogram — option ${v.k.toUpperCase()}, smooth lot split: ${v.name}`;
  fs.writeFileSync(path.join(out, `monogram-${v.k}.svg`), header(title, v.line) + v.color + "</svg>\n");
  fs.writeFileSync(path.join(out, `monogram-${v.k}-mono.svg`), header(title + " (single colour)", v.line) + v.mono + "</svg>\n");
}
fs.writeFileSync(path.resolve("scripts/smooth-variants.json"), JSON.stringify(V.map(({ k, name, line }) => ({ k, name, line })), null, 2) + "\n");
console.log("wrote", V.map((v) => v.k).join(", "));
