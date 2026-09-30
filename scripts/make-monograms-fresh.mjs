/*
  Fresh concepts N1–N8 (round 5, from scratch after the L round).
    node scripts/make-monograms-fresh.mjs
  Brief: crisp and refined, not puffy/retro/bubble; precise geometry,
  medium-bold weights, sharp or subtly chamfered corners, strong negative
  space, balanced and optically centred, letters inside their container with
  margin (or no container). Every mark is flat filled polygons, so the
  one-colour file (monogram-<key>-mono.svg) is the same geometry in black.

  Container-less marks colour themselves from the page: fill uses
  var(--mark-ink) / var(--mark-accent) (set in site.css per theme) and falls
  back to ink/blue, or paper/light blue when the OS is in dark mode (e.g. a
  favicon in a dark browser tab).
*/
import fs from "node:fs";
import path from "node:path";
import { pc, R, P, d, header } from "./lib/geo.mjs";

const out = path.resolve("src/assets/brand");
const C = { paper: "#f3f0e8", blue: "#0a4f9c", ink: "#0f1419", black: "#000000" };
const U = (...g) => pc.union(...g);

/* ---------- letter kit (sharp, flat) ---------- */
// Z in box [x0,y0,x1,y1]: bars of height h, diagonal of perpendicular width w.
function Z([x0, y0, x1, y1], h, w = h) {
  const dy = y1 - y0 - 2 * h;
  let dw = w;
  for (let i = 0; i < 20; i++) { const th = Math.atan2(dy, x1 - x0 - dw); dw = w / Math.sin(th); }
  return U(R(x0, y0, x1, y0 + h), R(x0, y1 - h, x1, y1),
    P([x1 - dw, y0 + h], [x1, y0 + h], [x0 + dw, y1 - h], [x0, y1 - h]));
}
// T in box: crossbar height h, stem width w centred (or at stemX).
function T([x0, y0, x1, y1], h, w = h, stemX = (x0 + x1) / 2) {
  return U(R(x0, y0, x1, y0 + h), R(stemX - w / 2, y0, stemX + w / 2, y1));
}
// Rectangle / square with 45° chamfered corners.
function chamferRect(x0, y0, x1, y1, c) {
  return P([x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]);
}
// Outline (ring) of a rectangle with stroke s, optional chamfer.
const ring = (x0, y0, x1, y1, s, c = 0) =>
  pc.difference(c ? chamferRect(x0, y0, x1, y1, c) : R(x0, y0, x1, y1), c ? chamferRect(x0 + s, y0 + s, x1 - s, y1 - s, Math.max(0, c - s * 0.41)) : R(x0 + s, y0 + s, x1 - s, y1 - s));

/* ---------- optical centring: slide a shape so its ink centroid is on x = 32 ---------- */
function centroid(g) {
  let A = 0, X = 0, Y = 0;
  for (const poly of g) poly.forEach((rg, i) => {
    let a = 0, cx = 0, cy = 0;
    for (let j = 0; j < rg.length - 1; j++) {
      const [x1, y1] = rg[j], [x2, y2] = rg[j + 1], k = x1 * y2 - x2 * y1;
      a += k; cx += (x1 + x2) * k; cy += (y1 + y2) * k;
    }
    const s = (i === 0 ? 1 : -1) * Math.sign(a) || 1, aa = Math.abs(a / 2) * (i === 0 ? 1 : -1);
    if (a) { A += aa; X += aa * (cx / (3 * a)); Y += aa * (cy / (3 * a)); }
    void s;
  });
  return [X / A, Y / A];
}
const move = (g, dx, dy = 0) => g.map((p) => p.map((r) => r.map(([x, y]) => [x + dx, y + dy])));
const bbox = (g) => { const p = g.flat(2); const xs = p.map((q) => q[0]), ys = p.map((q) => q[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
// Centre horizontally by ink centroid (optical), vertically by bounding box.
function opticalCentre(g, { cx = 32, cy = 32, k = 1 } = {}) {
  const [x] = centroid(g), [, y0, , y1] = bbox(g);
  const bx = (bbox(g)[0] + bbox(g)[2]) / 2;
  return move(g, (cx - (bx + (x - bx) * k)), cy - (y0 + y1) / 2);
}

/* ---------- colour helpers ---------- */
const themed = (k) => `  <style>.${k}-i{fill:var(--mark-ink,${C.ink})}.${k}-a{fill:var(--mark-accent,${C.blue})}@media (prefers-color-scheme:dark){.${k}-i{fill:var(--mark-ink,#ece7db)}.${k}-a{fill:var(--mark-accent,#8ab8f0)}}</style>\n`;
function free(k, parts) { // container-less: parts = [{ g, c: "i" | "a" }]
  return { mark: U(...parts.map((p) => p.g)),
    color: themed(k) + parts.map((p) => `  <path class="${k}-${p.c}" d="${d(p.g)}"/>\n`).join(""),
    mono: `  <path fill="${C.black}" d="${d(U(...parts.map((p) => p.g)))}"/>\n`,
  };
}
function tile(shape, letters, fill = C.blue, letterFill = C.paper) { // solid tile, letters knocked out
  return { mark: letters,
    color: `  <path fill="${fill}" d="${d(shape)}"/>\n  <path fill="${letterFill}" d="${d(pc.intersection(shape, letters))}"/>\n`,
    mono: `  <path fill="${C.black}" d="${d(pc.difference(shape, letters))}"/>\n`,
  };
}

/* ---------- the concepts ---------- */
const V = [];

// N1 · Ligature — no container. One top stroke is the Z's top and the T's
// crossbar; the T's stem sits centred under its own half.
{
  const h = 6, top = 17.5, base = 46.5;
  const z = Z([9, top, 31.5, base], h, 6.8);
  const bar = R(31.5, top, 55, top + h);
  const t = R(44 - 3.3, top, 44 + 3.3, base);
  const g = opticalCentre(U(z, bar, t), { k: 0.6 });
  V.push({ k: "n1", name: "Ligature", line: "A pure ZT ligature with no container: one sharp top stroke is both the Z's top and the T's crossbar, medium-bold, optically centred.",
    ...free("n1", [{ g, c: "a" }]) });
}

// N2 · Monoline — ink frame and blue letters drawn in one precise stroke weight.
{
  const s = 4.5;
  const frame = ring(6, 6, 58, 58, s);
  const lz = Z([17, 18, 30.5, 46], s, 5), lt = T([33.5, 18, 47, 46], s, s);
  const letters = opticalCentre(U(lz, lt), { k: 0.6 });
  V.push({ k: "n2", name: "Monoline", line: "Frame and letters share one precise line weight, like an architect's stamp: square-cut ends, sharp corners, generous margin inside the frame.",
    ...free("n2", [{ g: frame, c: "i" }, { g: letters, c: "a" }]) });
}

// N3 · Negative space — ZT cut from a solid blue square with subtly chamfered corners.
{
  const sq = chamferRect(4, 4, 60, 60, 4);
  const h = 7;
  const letters = opticalCentre(U(Z([14, 19, 31, 45], h, 7.5), T([34, 19, 50, 45], h, 7.5)), { k: 0.6 });
  V.push({ k: "n3", name: "Negative space", line: "ZT knocked out of a solid blue square with subtly chamfered corners: two equal, sharp letters with a clean channel between them.",
    ...tile(sq, letters) });
}

// N4 · Step — the Z's bottom stroke continues as the T's crossbar, so the
// mark steps down from top-left to bottom-right (the flow of the lot split).
{
  const h = 6.5;
  const z = Z([9, 9, 32, 34], h, 7);
  const bar = R(32, 34 - h, 55, 34);
  const stem = R(43.5 - 3.5, 34 - h, 43.5 + 3.5, 55);
  const g = opticalCentre(U(z, bar, stem), { k: 0.5 });
  V.push({ k: "n4", name: "Step", line: "The Z's bottom stroke runs on to become the T's crossbar, so the mark steps down from top-left to bottom-right: one shared line, the flow of the lot split.",
    ...free("n4", [{ g, c: "a" }]) });
}

// N5 · Engineered serif — thin horizontals, heavy verticals/diagonal, and
// small 45° wedge serifs, like lettering on an engineered drawing.
{
  const hb = 3.6, thick = 8.5;
  const x0 = 9, x1 = 30, y0 = 15, y1 = 49;
  const z = U(Z([x0, y0, x1, y1], hb, thick),
    P([x0, y0 + hb], [x0 + 3.6, y0 + hb], [x0, y0 + hb + 3.6]),            // beak under the top-left end
    P([x1, y1 - hb], [x1 - 3.6, y1 - hb], [x1, y1 - hb - 3.6]));            // beak over the bottom-right end
  const tx0 = 34, tx1 = 55, sx = (tx0 + tx1) / 2;
  const t = U(R(tx0, y0, tx1, y0 + hb), R(sx - thick / 2, y0, sx + thick / 2, y1),
    P([tx0, y0 + hb], [tx0 + 3.6, y0 + hb], [tx0, y0 + hb + 3.6]),
    P([tx1, y0 + hb], [tx1 - 3.6, y0 + hb], [tx1, y0 + hb + 3.6]),
    P([sx - thick / 2 - 3.2, y1], [sx - thick / 2, y1 - 3.2], [sx - thick / 2, y1]),   // foot flare
    P([sx + thick / 2 + 3.2, y1], [sx + thick / 2, y1 - 3.2], [sx + thick / 2, y1]));
  const g = opticalCentre(U(z, t), { k: 0.6 });
  V.push({ k: "n5", name: "Engineered serif", line: "A serif/engineered hybrid: hairline-thin bars, heavy stems and diagonal, and small 45° wedge serifs, precise as lettering on a drawing.",
    ...free("n5", [{ g, c: "i" }]) });
}

// N6 · Dimension — sharp ZT over a single dimension line with architectural ticks.
{
  const h = 6;
  const letters = U(Z([12, 11, 30, 39], h, 6.5), T([34, 11, 52, 39], h, 6.5));
  const dimY = 49, lw = 2;
  const dim = U(R(12, dimY - lw / 2, 52, dimY + lw / 2), R(12 - lw / 2, 45, 12 + lw / 2, 53), R(52 - lw / 2, 45, 52 + lw / 2, 53),
    P([9.6, dimY + 3.4], [11.4, dimY + 5.2], [14.4, dimY - 3.4], [12.6, dimY - 5.2]),
    P([49.6, dimY + 3.4], [51.4, dimY + 5.2], [54.4, dimY - 3.4], [52.6, dimY - 5.2]));
  const [, , , yb] = bbox(dim), [, ya] = bbox(letters), dy = 32 - (ya + yb) / 2;
  V.push({ k: "n6", name: "Dimension", line: "Sharp ZT standing on one architectural dimension line with 45° ticks: the drafting reference is a single quiet rule that drops away at small sizes.",
    ...free("n6", [{ g: move(letters, 0, dy), c: "i" }, { g: move(dim, 0, dy), c: "a" }]) });
}

// N7 · Section cut — the N1 ligature knocked out of a sharp blue square and
// sliced by one hairline section line at the letters' mid-height.
{
  const sq = R(4, 4, 60, 60);
  const h = 6.5, top = 20, base = 44;
  const lig = U(Z([15, top, 32, base], h, 7), R(32, top, 49, top + h), R(41 - 3.4, top, 41 + 3.4, base));
  const cut = R(0, 32.4, 64, 34);
  const letters = opticalCentre(pc.difference(lig, cut), { k: 0.6 });
  V.push({ k: "n7", name: "Section cut", line: "The ligature knocked out of a sharp blue square and sliced by one hairline section line, the cut every plan set is read through.",
    ...tile(sq, letters) });
}

// N8 · Column — an abstract structural mark: the silhouette is a bold T (a
// beam on its column); the Z is the negative space cut through the column.
{
  const beam = R(8, 8, 56, 21), col = R(20, 21, 44, 56);
  const body = U(beam, col);
  const z = Z([24.5, 26.5, 39.5, 51.5], 4.4, 5.2);
  V.push({ k: "n8", name: "Column", line: "An abstract structural symbol: the silhouette is a bold T, a beam on its column, and the Z is carved through the column as negative space.",
    ...tile(body, z) });
}

/* ---------- app/favicon tiles for the chosen mark (N1) ----------
   monogram-n1-tile.svg  rounded blue tile, paper N1: raster favicons (ico,
                          16/32 png) and the "any" manifest icons, legible on
                          light and dark browser chrome alike.
   monogram-n1-app.svg   full-bleed blue square, N1 inside the maskable safe
                          zone: apple-touch-icon and the maskable icons. */
{
  const n1 = V.find((v) => v.k === "n1");
  const g = n1.mark;
  const [bx0, by0, bx1, by1] = bbox(g), mx = (bx0 + bx1) / 2, my = (by0 + by1) / 2;
  const [cxn] = centroid(g);
  const scaled = (k) => g.map((p) => p.map((r) => r.map(([x, y]) => [32 + (x - mx) * k + (mx - cxn) * k * 0.6, 32 + (y - my) * k])));
  const tileT = "ZT monogram — N1 on a blue tile (favicon)", appT = "ZT monogram — N1 app icon";
  const desc = "The N1 ligature in paper on the brand blue.";
  fs.writeFileSync(path.join(out, "monogram-n1-tile.svg"), header(tileT, desc) +
    `  <rect width="64" height="64" rx="12" fill="${C.blue}"/>\n  <path fill="${C.paper}" d="${d(scaled(0.8))}"/>\n</svg>\n`);
  fs.writeFileSync(path.join(out, "monogram-n1-app.svg"), header(appT, desc) +
    `  <rect width="64" height="64" fill="${C.blue}"/>\n  <path fill="${C.paper}" d="${d(scaled(0.62))}"/>\n</svg>\n`);
}

for (const v of V) {
  const title = `ZT monogram — option ${v.k.toUpperCase()}, ${v.name}`;
  fs.writeFileSync(path.join(out, `monogram-${v.k}.svg`), header(title, v.line) + v.color + "</svg>\n");
  fs.writeFileSync(path.join(out, `monogram-${v.k}-mono.svg`), header(title + " (single colour)", v.line) + v.mono + "</svg>\n");
}
fs.writeFileSync(path.resolve("scripts/fresh-variants.json"), JSON.stringify(V.map(({ k, name, line }) => ({ k, name, line })), null, 2) + "\n");
console.log("wrote", V.map((v) => v.k).join(", "));
