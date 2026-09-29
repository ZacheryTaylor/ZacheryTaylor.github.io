/*
  Round 3 monogram options (H–K): "statement" marks. Bold, flat, one idea each,
  built on a 64-unit grid from plain geometry (no fonts). Every mark has:
    monogram-<k>.svg       colour: blueprint blue + paper (+ bronze on H)
    monogram-<k>-mono.svg  single-colour black silhouette (letters knocked out),
                           for hard hats, stamps, embroidery, a book spine.
    node scripts/make-monograms-round3.mjs
  Needs the dev dependency polygon-clipping (boolean ops for the knock-outs).
*/
import fs from "node:fs";
import path from "node:path";
import pc from "polygon-clipping";

const out = path.resolve("src/assets/brand");
const C = { paper: "#f3f0e8", blue: "#0a4f9c", bronze: "#d2a766", black: "#000000" };

/* ---- geometry helpers ---- */
const R = (x1, y1, x2, y2) => [[[x1, y1], [x2, y1], [x2, y2], [x1, y2], [x1, y1]]];
const P = (...pts) => [[...pts, pts[0]]];
const circle = (cx, cy, r, n = 144) =>
  [[...Array.from({ length: n }, (_, i) => [cx + r * Math.cos((2 * Math.PI * i) / n), cy + r * Math.sin((2 * Math.PI * i) / n)]), [cx + r, cy]]];
function roundRect(x1, y1, x2, y2, r, n = 14) {
  const pts = [];
  const corner = (cx, cy, a0) => { for (let i = 0; i <= n; i++) { const a = a0 + (Math.PI / 2) * (i / n); pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } };
  corner(x2 - r, y1 + r, -Math.PI / 2); corner(x2 - r, y2 - r, 0); corner(x1 + r, y2 - r, Math.PI / 2); corner(x1 + r, y1 + r, Math.PI);
  return [[...pts, pts[0]]];
}
function bez(p0, p1, p2, p3, n = 28) {
  const o = [];
  for (let i = 1; i <= n; i++) { const t = i / n, u = 1 - t;
    o.push([0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k])); }
  return o;
}
const num = (v) => (Math.round(v * 100) / 100).toString();
const d = (mp) => mp.map((poly) => poly.map((ring) => "M" + ring.slice(0, -1).map(([x, y]) => `${num(x)} ${num(y)}`).join("L") + "Z").join("")).join("");

const header = (title, desc) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-labelledby="t d">\n  <title id="t">${title}</title>\n  <desc id="d">${desc}</desc>\n`;

/* A solid shape with letters knocked out: colour = blue shape + paper letters
   (so it reads on any background); mono = black shape, letters truly cut out. */
function knockout(shape, letters, name, desc, extra = "") {
  const body = pc.difference(shape, letters);
  const inner = pc.intersection(shape, letters);
  return {
    color: header(name, desc) + `  <path fill="${C.paper}" stroke="${C.paper}" stroke-width=".5" d="${d(inner)}"/>\n  <path fill="${C.blue}" d="${d(body)}"/>\n${extra}</svg>\n`,
    mono: header(name + " (single colour)", desc) + `  <path fill="${C.black}" d="${d(body)}"/>\n</svg>\n`,
  };
}

const marks = {};

/* (h) Refined contour: one continuous heavy line draws the Z; the top stroke
   carries on as a survey point, so stroke + point read as a T crossbar with the
   diagonal as its stem. */
{
  const line = "M11.5 20H34L16.5 44.5H40";
  const stroke = `fill="none" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round"`;
  const name = "ZT monogram — option H, contour line";
  const desc = "One continuous heavy line forms the Z; its top stroke ends in a survey point, so stroke and point read as the crossbar of a T.";
  marks.h = {
    color: header(name, desc) + `  <rect width="64" height="64" rx="14" fill="${C.blue}"/>\n  <path d="${line}" stroke="${C.paper}" ${stroke}/>\n  <circle cx="48.5" cy="20" r="6.2" fill="${C.bronze}"/>\n</svg>\n`,
    mono: header(name + " (single colour)", desc) + `  <path d="${line}" stroke="${C.black}" ${stroke}/>\n  <circle cx="48.5" cy="20" r="6.2" fill="${C.black}"/>\n</svg>\n`,
  };
}

/* (i) Lot split: a square parcel cut by a Z-shaped right-of-way (enters the
   left edge, exits the right). The road's lower run doubles as a frontage road,
   and a lot line dropping from it makes the T. */
{
  const parcel = roundRect(2, 2, 62, 62, 7);
  const row = pc.union(R(-2, 9, 35, 18), P([35, 9], [45.5, 9], [25.5, 37], [15, 37]), R(25.5, 28, 66, 37), R(39.5, 37, 48.5, 66));
  marks.i = knockout(parcel, row, "ZT monogram — option I, lot split",
    "A square parcel split by a Z-shaped right-of-way; the road's lower run is the frontage and a lot line dropping from it forms the T.");
}

/* (j) Section cut: the section-marker head (circle + view arrow), with a bold
   ZT ligature standing on the marker's cut line. */
{
  const cx = 28, cy = 32, r = 27, apex = [63.5, 32];
  const th = Math.acos(r / (apex[0] - cx));
  const head = pc.union(circle(cx, cy, r), P(apex, [cx + r * Math.cos(th), cy - r * Math.sin(th)], [cx + r * Math.cos(th), cy + r * Math.sin(th)]));
  const zt = pc.union(R(-2, 30, 70, 37.5), R(11, 11.5, 45, 18.5), P([22.5, 18.5], [31.5, 18.5], [20, 30], [11, 30]), R(32.5, 18.5, 40, 30));
  marks.j = knockout(head, zt, "ZT monogram — option J, section cut",
    "An engineering section-cut marker, circle and view arrow, with a bold ZT ligature standing on the cut line that splits the marker.");
}

/* (k) Route shield: a highway route-marker shield with a heavy ZT ligature
   (one shared top stroke) knocked out. */
{
  const top = [[4, 8], ...bez([4, 8], [12, 8], [14, 3], [18, 3], 12), [46, 3], ...bez([46, 3], [50, 3], [52, 8], [60, 8], 12)];
  const pts = [...top, [60, 30], ...bez([60, 30], [60, 47], [48, 56], [32, 62]), ...bez([32, 62], [16, 56], [4, 47], [4, 30])];
  const shield = [[...pts, pts[0]]];
  const zt = pc.union(R(11, 14, 54, 22.5), P([25, 22.5], [35, 22.5], [21, 41], [11, 41]), R(11, 41, 33, 49.5), R(37.5, 22.5, 46.5, 53));
  marks.k = knockout(shield, zt, "ZT monogram — option K, route shield",
    "A highway route-marker shield with a heavy ZT ligature, the Z and T sharing one top stroke, cut out of it.");
}

for (const [k, v] of Object.entries(marks)) {
  fs.writeFileSync(path.join(out, `monogram-${k}.svg`), v.color);
  fs.writeFileSync(path.join(out, `monogram-${k}-mono.svg`), v.mono);
}
console.log("wrote monogram-{h,i,j,k}.svg + -mono.svg");
