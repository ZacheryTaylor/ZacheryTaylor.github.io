/*
  Generates the three ZT monogram options as dependency-free SVG files
  (letterforms are converted to outlines, so no fonts are needed to render).

    node scripts/make-monograms.mjs

  Output: src/assets/brand/monogram-{a,b,c}.svg
  Pick the active one in site.config.js -> monogram: "a" | "b" | "c".
*/
import fs from "node:fs";
import path from "node:path";
import opentype from "opentype.js";

const out = path.resolve("src/assets/brand");
fs.mkdirSync(out, { recursive: true });

const C = {
  paper: "#f3f0e8",
  ink: "#0f1419",
  blue: "#0a4f9c",
  blueDeep: "#073a75",
  bronze: "#86612a",
  bronzeLight: "#d2a766",
};

const load = (p) => {
  const buf = fs.readFileSync(p);
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const serif = load("node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff");
const serifItalic = load("node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff");
const sans = load("node_modules/@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff");

/* Glyph outlines via charToGlyph (avoids shaping), laid out manually. */
function textPath(font, text, x, y, size, tracking = 0) {
  const p = new opentype.Path();
  let pen = x;
  for (const ch of text) {
    const g = font.charToGlyph(ch);
    const gp = g.getPath(pen, y, size);
    p.extend(gp);
    pen += (g.advanceWidth / font.unitsPerEm) * size + tracking * size;
  }
  return p;
}
/* Fit text so its outline box is centred on (cx, cy) at a given height. */
function fitted(font, text, { cx, cy, height, tracking = 0 }) {
  const probe = textPath(font, text, 0, 0, 100, tracking).getBoundingBox();
  const size = (100 * height) / (probe.y2 - probe.y1);
  const bb = textPath(font, text, 0, 0, size, tracking).getBoundingBox();
  return textPath(font, text, cx - (bb.x1 + bb.x2) / 2, cy - (bb.y1 + bb.y2) / 2, size, tracking).toPathData(2);
}
const glyph = (font, ch, o) => fitted(font, ch, o);
const word = (font, text, o) => fitted(font, text, o);

const header = (title, desc) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-labelledby="t d">\n` +
  `  <title id="t">${title}</title>\n  <desc id="d">${desc}</desc>\n`;

/* (a) Interlocking Z/T inside a blueprint title-block frame ---------------- */
const a =
  header(
    "ZT monogram — option A, title block",
    "Z and T sharing one top stroke, set inside a blueprint sheet frame with a title-block strip."
  ) +
  `  <rect width="64" height="64" rx="9" fill="${C.blue}"/>
  <rect x="5.5" y="5.5" width="53" height="53" rx="3" fill="none" stroke="${C.paper}" stroke-opacity=".55" stroke-width="1.2"/>
  <path d="M5.5 46.5h53M40 46.5v12" stroke="${C.paper}" stroke-opacity=".55" stroke-width="1.2"/>
  <path d="M10 51h24M10 54.5h16" stroke="${C.paper}" stroke-opacity=".4" stroke-width="1.2"/>
  <rect x="45" y="50" width="9" height="5" rx="1" fill="${C.bronzeLight}"/>
  <!-- one shared top stroke = Z top bar + T crossbar -->
  <path d="M11 11h42v5.4H11z" fill="${C.paper}"/>
  <path d="M28.2 16.4h6.8L18.6 35.6h-6.8z" fill="${C.paper}"/>
  <path d="M11.8 35.6h23.2V41H11.8z" fill="${C.paper}"/>
  <path d="M41.4 16.4h5.4V41h-5.4z" fill="${C.paper}"/>
</svg>
`;

/* (b) Serif Z + italic T ligature (Instrument Serif outlines) ------------- */
const zB = glyph(serif, "Z", { cx: 24.5, cy: 31, height: 31 });
const tB = glyph(serifItalic, "T", { cx: 40.5, cy: 31, height: 31 });
const b =
  header(
    "ZT monogram — option B, serif ligature",
    "An Instrument Serif Z overlapped by an italic bronze T, on paper."
  ) +
  `  <rect width="64" height="64" rx="9" fill="${C.paper}"/>
  <rect x="3.5" y="3.5" width="57" height="57" rx="6.5" fill="none" stroke="${C.ink}" stroke-opacity=".12"/>
  <path d="${zB}" fill="${C.ink}"/>
  <path d="${tB}" fill="${C.blue}"/>
  <path d="M16 53h32" stroke="${C.bronze}" stroke-width="1.6"/>
</svg>
`;

/* (c) Survey benchmark / section-marker circle ---------------------------- */
const ticks = Array.from({ length: 36 }, (_, i) => {
  const ang = (i * 10 * Math.PI) / 180;
  const r1 = i % 9 === 0 ? 25.2 : 27.2;
  const r2 = 29.6;
  const f = (n) => n.toFixed(2);
  return `M${f(32 + r1 * Math.sin(ang))} ${f(32 - r1 * Math.cos(ang))}L${f(32 + r2 * Math.sin(ang))} ${f(32 - r2 * Math.cos(ang))}`;
}).join("");
const zt = word(sans, "ZT", { cx: 32, cy: 24.2, height: 11.5, tracking: 0.02 });
const c =
  header(
    "ZT monogram — option C, benchmark",
    "A survey benchmark disk: graduated outer ring, section-marker circle split by a datum line, ZT above and a benchmark triangle below."
  ) +
  `  <circle cx="32" cy="32" r="31" fill="${C.paper}"/>
  <path d="${ticks}" stroke="${C.ink}" stroke-width="1.3" stroke-linecap="round"/>
  <circle cx="32" cy="32" r="22.5" fill="${C.blue}"/>
  <path d="M9.5 32h45" stroke="${C.paper}" stroke-width="1.6"/>
  <path d="${zt}" fill="${C.paper}"/>
  <path d="M32 36.2l6.2 10.3H25.8z" fill="${C.bronzeLight}"/>
  <circle cx="32" cy="32" r="1.9" fill="${C.paper}"/>
</svg>
`;

fs.writeFileSync(path.join(out, "monogram-a.svg"), a);
fs.writeFileSync(path.join(out, "monogram-b.svg"), b);
fs.writeFileSync(path.join(out, "monogram-c.svg"), c);
console.log("wrote monogram-a/b/c.svg to", out);
