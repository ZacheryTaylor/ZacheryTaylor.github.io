/*
  Lot-split variants (I1–I8) of monogram I, the direction Zach picked.
  A parcel, a Z-shaped road, and a T, built as flat 64-grid geometry.
    node scripts/make-monograms-lotsplit.mjs
  Output per variant: src/assets/brand/monogram-i<n>.svg (colour) and
  monogram-i<n>-mono.svg (one-colour black silhouette).

  Fix vs. round-3 "I": the T is now as tall as the Z (the Z's bottom run IS the
  T's crossbar, and the stem runs the full lower half), and the road splits the
  parcel into exactly two lots (no accidental third lot).
*/
import fs from "node:fs";
import path from "node:path";
import { pc, R, P, circle, roundRect, bez, d, header } from "./lib/geo.mjs";

const out = path.resolve("src/assets/brand");
const C = { paper: "#f3f0e8", blue: "#0a4f9c", ink: "#0f1419", bronze: "#d2a766", bronzeDeep: "#9a6f2f", black: "#000000" };

/* ---- road layouts (road width 8.5) ---- */
// Frontage + lot line: the Z road runs edge to edge (left in, right out), so
// the parcel splits into exactly two lots. Its lower run is the frontage road
// and doubles as the T's crossbar; the T's stem is a lot-line/driveway spur that
// stops inside the lower lot (no third lot). Z and T are the same height.
function frontage({ stemEnd = 55, bulb = false } = {}) {
  const parts = [R(-4, 9, 40.5, 17.5), P([30.5, 9], [40.5, 9], [22, 36.5], [12, 36.5]), R(12, 28, 70, 36.5)];
  if (bulb) parts.push(R(40.5, 36.5, 49, stemEnd - 8), circle(44.75, stemEnd - 7, 7.3));
  else parts.push(R(40.5, 36.5, 49, stemEnd));
  return pc.union(...parts);
}
// Shared lot line (ligature): the road enters on the left along the top as a
// frontage road (Z top + T crossbar in one stroke) and leaves through the
// bottom as the T's stem, the lot line both lots share. The Z's diagonal and
// lower run are a dead-end spur, so there are exactly two lots.
function ligature({ top = 9, bottom = 55.5, zLeft = 10 } = {}) {
  const w = 8.5;
  return pc.union(
    R(-4, top, 55, top + w),
    P([24.5, top], [33.5, top], [zLeft + 9, bottom], [zLeft, bottom]),
    R(zLeft, bottom - w, 35, bottom),
    R(40, top + w, 48.5, 70),
  );
}
/* ---- containers ---- */
const sqRound = roundRect(2, 2, 62, 62, 9);
const sqSharp = R(3, 3, 61, 61);
const disc = circle(32, 32, 30.5);
const shieldPts = [[4, 8], ...bez([4, 8], [12, 8], [14, 3], [18, 3], 12), [46, 3], ...bez([46, 3], [50, 3], [52, 8], [60, 8], 12),
  [60, 30], ...bez([60, 30], [60, 47], [48, 56], [32, 62]), ...bez([32, 62], [16, 56], [4, 47], [4, 30])];
const shield = [[...shieldPts, shieldPts[0]]];

/* Solid parcel, road knocked out. Colour: parcel + road colour (road drawn
   under with a hairline overlap so no seam shows). Mono: black parcel, road cut. */
function solid(shape, road, { parcel = C.blue, roadFill = C.paper } = {}) {
  const body = pc.difference(shape, road), cut = pc.intersection(shape, road);
  return {
    color: `  <path fill="${roadFill}" stroke="${roadFill}" stroke-width=".5" d="${d(cut)}"/>\n  <path fill="${parcel}" d="${d(body)}"/>\n`,
    mono: `  <path fill="${C.black}" d="${d(body)}"/>\n`,
  };
}
/* Outlined parcel on a paper tile, road drawn solid inside the boundary. */
function outlined(outer, inner, road, { line = C.blue, roadFill = C.blue, extra = "" } = {}) {
  const ring = pc.difference(outer, inner);
  const r = pc.intersection(road, outer);
  const mark = pc.union(ring, r);
  return {
    color: `  <path fill="${C.paper}" d="${d(outer)}"/>\n  <path fill="${roadFill}" d="${d(r)}"/>\n  <path fill="${line}" d="${d(ring)}"/>\n${extra}`,
    mono: `  <path fill="${C.black}" d="${d(mark)}"/>\n`,
  };
}

const V = [
  { k: "i1", name: "Frontage + lot line",
    line: "Refined I: the Z road runs edge to edge (exactly two lots), its lower run is the frontage and the T's crossbar, and a lot line forms the stem.",
    ...solid(sqRound, frontage()) },
  { k: "i2", name: "Shared lot line",
    line: "The road enters along the top (one stroke for the Z top and T crossbar) and leaves through the T's stem, the line the two lots share.",
    ...solid(sqRound, ligature()) },
  { k: "i3", name: "Bronze road",
    line: "I1's two-lot frontage split with the right-of-way picked out in bronze on the blue parcel.",
    ...solid(sqRound, frontage(), { roadFill: C.bronze }) },
  { k: "i4", name: "Cul-de-sac",
    line: "The T's stem becomes a dead-end street ending in a cul-de-sac bulb inside the lower lot.",
    ...solid(sqRound, frontage({ bulb: true })) },
  { k: "i5", name: "Ink, sharp corners",
    line: "I2's shared-lot-line split on an ink parcel with sharp survey corners: the most graphic, stamp-like version.",
    ...solid(sqSharp, ligature({ top: 10, bottom: 54.5 }), { parcel: C.ink }) },
  { k: "i6", name: "Plat map",
    line: "Outlined parcel on paper: heavy ink boundary, blue road, plus a thin dashed property line and bearing tick that drop out at small sizes.",
    ...outlined(R(3, 3, 61, 61), R(7.5, 7.5, 56.5, 56.5), frontage({ stemEnd: 52 }), { line: C.ink,
      extra: `  <path d="M11 49.5h22" stroke="${C.bronzeDeep}" stroke-width="1.3" stroke-dasharray="2.4 1.8" fill="none"/>\n  <path d="M26.5 45.8l3.2 7.4" stroke="${C.bronzeDeep}" stroke-width="1.3" fill="none"/>\n` }) },
  { k: "i7", name: "Circle parcel",
    line: "I1's frontage split inside a round parcel, like a site-location bubble or a hard-hat decal.",
    ...solid(disc, frontage({ stemEnd: 52 })) },
  { k: "i8", name: "Shield parcel",
    line: "I2's shared-lot-line split inside the route-marker shield: badge-like, strongest on a hard hat or a truck door.",
    ...solid(shield, ligature({ top: 11, bottom: 48.5, zLeft: 14 })) },
];

for (const v of V) {
  const title = `ZT monogram — option ${v.k.toUpperCase()}, lot split: ${v.name}`.replace(/&/g, "&amp;");
  fs.writeFileSync(path.join(out, `monogram-${v.k}.svg`), header(title, v.line) + v.color + "</svg>\n");
  fs.writeFileSync(path.join(out, `monogram-${v.k}-mono.svg`), header(title + " (single colour)", v.line) + v.mono + "</svg>\n");
}
fs.writeFileSync(path.resolve("scripts/lotsplit-variants.json"), JSON.stringify(V.map(({ k, name, line }) => ({ k, name, line })), null, 2) + "\n");
console.log("wrote", V.map((v) => v.k).join(", "));
