/*
  Round 2 monogram options (D–G). Same approach as make-monograms.mjs:
  plain SVG, letterforms converted to outlines, no fonts or ids needed.

    node scripts/make-monograms-round2.mjs

  Output: src/assets/brand/monogram-{d,e,f,g}.svg  (square marks: nav + favicons)
          src/assets/brand/lockup-g.svg            (horizontal nav lockup for G)
  Any option with a lockup-<key>.svg uses it in the nav automatically.
*/
import fs from "node:fs";
import path from "node:path";
import opentype from "opentype.js";

const out = path.resolve("src/assets/brand");
const C = {
  paper: "#f3f0e8", ink: "#0f1419", blue: "#0a4f9c", blueDeep: "#073a75",
  bronze: "#86612a", bronzeMid: "#9a6f2f", bronzeLight: "#d2a766", grey: "#5f6b75",
};
const load = (p) => { const b = fs.readFileSync(p); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
const serif = load("node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff");
const sans7 = load("node_modules/@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff");
const sans6 = load("node_modules/@fontsource/dm-sans/files/dm-sans-latin-600-normal.woff");

function textPath(font, text, x, y, size, tracking = 0) {
  const p = new opentype.Path(); let pen = x;
  for (const ch of text) { const g = font.charToGlyph(ch); p.extend(g.getPath(pen, y, size)); pen += (g.advanceWidth / font.unitsPerEm) * size + tracking * size; }
  return p;
}
/* Own serializer: opentype's toPathData(2) can print "NaN" for some values. */
const num = (n) => (Math.round(n * 100) / 100).toString();
function pathData(p) {
  return p.commands.map((c) =>
    c.type === "Z" ? "Z"
    : c.type === "Q" ? `Q${num(c.x1)} ${num(c.y1)} ${num(c.x)} ${num(c.y)}`
    : c.type === "C" ? `C${num(c.x1)} ${num(c.y1)} ${num(c.x2)} ${num(c.y2)} ${num(c.x)} ${num(c.y)}`
    : `${c.type}${num(c.x)} ${num(c.y)}`).join("");
}
function fitted(font, text, { cx, cy, height, tracking = 0 }) {
  const probe = textPath(font, text, 0, 0, 100, tracking).getBoundingBox();
  const size = (100 * height) / (probe.y2 - probe.y1);
  const bb = textPath(font, text, 0, 0, size, tracking).getBoundingBox();
  return pathData(textPath(font, text, cx - (bb.x1 + bb.x2) / 2, cy - (bb.y1 + bb.y2) / 2, size, tracking));
}
/* Text on a baseline, sized by cap height; returns path data + measured box. */
function capText(font, text, { x, baseline, cap, tracking = 0 }) {
  const capH = (font.tables.os2.sCapHeight || font.unitsPerEm * 0.7) / font.unitsPerEm;
  const size = cap / capH;
  const p = textPath(font, text, x, baseline, size, tracking);
  return { d: pathData(p), box: p.getBoundingBox() };
}
const header = (title, desc, vb = "0 0 64 64") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-labelledby="t d">\n` +
  `  <title id="t">${title}</title>\n  <desc id="d">${desc}</desc>\n`;
const f2 = (n) => +n.toFixed(2);

/* (d) North arrow: T is the arrow + shaft, Z is the bronze diagonal ------- */
const tick = (a, r1, r2) => { const s = Math.sin(a), c = Math.cos(a); return `M${f2(32 + r1 * s)} ${f2(32 - r1 * c)}L${f2(32 + r2 * s)} ${f2(32 - r2 * c)}`; };
const dTicks = [Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a) => tick(a, 24.8, 29)).join("")
  + [45, 135, 225, 315].map((deg) => tick((deg * Math.PI) / 180, 26.8, 29)).join("");
const d =
  header("ZT monogram — option D, north arrow",
    "A surveyor's north arrow in a compass ring: the T is the arrow (half-filled north point, crossbar, shaft) and its crossbar doubles as the top of a bronze Z.") +
  `  <circle cx="32" cy="32" r="31" fill="${C.blue}"/>
  <circle cx="32" cy="32" r="27.4" fill="none" stroke="${C.paper}" stroke-opacity=".38" stroke-width="1"/>
  <path d="${dTicks}" stroke="${C.paper}" stroke-opacity=".75" stroke-width="1.6" stroke-linecap="round"/>
  <!-- north point: classic half-filled arrowhead -->
  <path d="M32 4.6L40.2 20.4H23.8z" fill="${C.paper}"/>
  <path d="M32 4.6L40.2 20.4H32z" fill="${C.bronzeLight}"/>
  <!-- Z: shares the T crossbar as its top stroke; diagonal + base in bronze -->
  <path d="M40.4 25.4H47L23.6 45H17z" fill="${C.bronzeLight}"/>
  <path d="M17 45h30v5H17z" fill="${C.bronzeLight}"/>
  <!-- T (paper): crossbar = arrow base + Z top, stem = arrow shaft -->
  <path d="M17 20.4h30v5H17z" fill="${C.paper}"/>
  <path d="M29.5 25.4h5V50h-5z" fill="${C.paper}"/>
</svg>
`;

/* (e) Contour lines: ZT is the ridge, contours follow it outward --------- */
const zLine = "M11.5 19H27L11.5 45H27";
const tLine = "M35.5 19H52.5M44 19V45";
const both = `${zLine}${tLine}`;
// Painted outer → inner; each paper stroke erases the inside of the ring before it.
const layer = (w, color, extra = "") => `  <path d="${both}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${extra}/>`;
const e =
  header("ZT monogram — option E, contour lines",
    "ZT drawn as a ridge on a topographic map: the letters are the high ground and contour lines step out around them, the outer one a bronze index contour.") +
  `  <rect width="64" height="64" rx="9" fill="${C.paper}"/>
  <rect x="1" y="1" width="62" height="62" rx="8" fill="none" stroke="${C.blue}" stroke-opacity=".4" stroke-width="1.6"/>
  <g transform="translate(32 32) scale(.86) translate(-32 -32)">
${layer(24, C.bronzeMid)}
${layer(21.6, C.paper)}
${layer(18, C.blue, ' stroke-opacity=".5"')}
${layer(16, C.paper)}
${layer(12.2, C.blue, ' stroke-opacity=".75"')}
${layer(10.4, C.paper)}
${layer(7.2, C.blue)}
  </g>
</svg>
`;

/* (f) Lettering-guide stencil: ZT cut out of a dark template -------------- */
const scaleTicks = Array.from({ length: 11 }, (_, i) => { const x = 10 + i * 4.4; return `M${f2(x)} 56.2v${i % 5 === 0 ? -3.6 : -2}`; }).join("");
const f =
  header("ZT monogram — option F, lettering stencil",
    "Bold stencil ZT cut from an ink lettering template, with stencil bridges, a scale along the bottom edge and a registration hole.") +
  `  <rect width="64" height="64" rx="9" fill="${C.ink}"/>
  <rect x="1.5" y="1.5" width="61" height="61" rx="7.5" fill="none" stroke="${C.paper}" stroke-opacity=".16"/>
  <!-- Z (bridged: bar / diagonal / bar) -->
  <path d="M9.5 11.5h21v7h-21z" fill="${C.paper}"/>
  <path d="M23.2 21h7.3L16.8 40.5H9.5z" fill="${C.paper}"/>
  <path d="M9.5 43h21v7h-21z" fill="${C.paper}"/>
  <!-- T (bridged: crossbar / stem) -->
  <path d="M33.5 11.5h21v7h-21z" fill="${C.paper}"/>
  <path d="M40.5 21h7v29h-7z" fill="${C.paper}"/>
  <path d="${scaleTicks}" stroke="${C.paper}" stroke-opacity=".45" stroke-width=".9"/>
  <circle cx="55" cy="53" r="2.6" fill="none" stroke="${C.bronzeLight}" stroke-width="1.4"/>
</svg>
`;

/* (g) Firm block: square mark + horizontal lockup -------------------------- */
const zG = fitted(sans7, "ZT", { cx: 32, cy: 29.5, height: 23, tracking: -0.01 });
const g =
  header("ZT monogram — option G, firm block",
    "The ZT cell of a drawing sheet's firm block: bold ZT inside a heavy outer border and a fine inner rule, with a bronze rule below.") +
  `  <rect width="64" height="64" rx="4.75" fill="${C.ink}"/>
  <rect x="4.5" y="4.5" width="55" height="55" rx=".6" fill="${C.paper}"/>
  <rect x="8" y="8" width="48" height="48" fill="none" stroke="${C.ink}" stroke-opacity=".4" stroke-width=".7"/>
  <path d="${zG}" fill="${C.ink}"/>
  <path d="M17 47.5h30" stroke="${C.bronze}" stroke-width="2.6"/>
</svg>
`;

// Lockup: [ZT cell] | Zachery Taylor / CIVIL DESIGNER · EI — line weights heavy / medium / fine.
const cell = 64, padL = 12;
const name = capText(serif, "Zachery Taylor", { x: cell + padL, baseline: 30, cap: 19.5, tracking: 0 });
const sub = capText(sans6, "CIVIL DESIGNER · EI", { x: cell + padL + 1, baseline: 52, cap: 7.6, tracking: 0.16 });
const W = Math.ceil(Math.max(name.box.x2, sub.box.x2) + 12);
const zCell = fitted(sans7, "ZT", { cx: cell / 2 + 0.5, cy: 30, height: 22, tracking: -0.01 });
const lockup =
  header("Zachery Taylor — firm block lockup (option G)",
    "Horizontal lockup like the firm block on a drawing sheet: a ZT cell, then Zachery Taylor over a fine rule and Civil Designer, EI.",
    `0 0 ${W} 64`) +
  `  <rect x="1.5" y="1.5" width="${W - 3}" height="61" rx="3" fill="${C.paper}" stroke="${C.ink}" stroke-width="2.6"/>
  <path d="M${cell} 1.5V62.5" stroke="${C.ink}" stroke-width="1.3"/>
  <path d="M${cell} 40H${W - 1.5}" stroke="${C.ink}" stroke-opacity=".55" stroke-width=".7"/>
  <path d="${zCell}" fill="${C.ink}"/>
  <path d="M16 47.5h33" stroke="${C.bronze}" stroke-width="2.4"/>
  <path d="${name.d}" fill="${C.ink}"/>
  <path d="${sub.d}" fill="${C.blue}"/>
</svg>
`;

for (const [k, v] of Object.entries({ "monogram-d": d, "monogram-e": e, "monogram-f": f, "monogram-g": g, "lockup-g": lockup }))
  fs.writeFileSync(path.join(out, `${k}.svg`), v);
console.log("wrote monogram-d/e/f/g.svg + lockup-g.svg (lockup width", W, ")");
