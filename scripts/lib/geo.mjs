/* Small geometry kit for the flat monograms (64-unit grid). Shapes are
   polygon-clipping multipolygons; d() turns one into SVG path data. */
import pc from "polygon-clipping";
export { pc };
export const R = (x1, y1, x2, y2) => [[[x1, y1], [x2, y1], [x2, y2], [x1, y2], [x1, y1]]];
export const P = (...pts) => [[...pts, pts[0]]];
export const circle = (cx, cy, r, n = 144) =>
  [[...Array.from({ length: n }, (_, i) => [cx + r * Math.cos((2 * Math.PI * i) / n), cy + r * Math.sin((2 * Math.PI * i) / n)]), [cx + r, cy]]];
export function roundRect(x1, y1, x2, y2, r, n = 14) {
  if (!r) return R(x1, y1, x2, y2);
  const pts = [];
  const corner = (cx, cy, a0) => { for (let i = 0; i <= n; i++) { const a = a0 + (Math.PI / 2) * (i / n); pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } };
  corner(x2 - r, y1 + r, -Math.PI / 2); corner(x2 - r, y2 - r, 0); corner(x1 + r, y2 - r, Math.PI / 2); corner(x1 + r, y1 + r, Math.PI);
  return [[...pts, pts[0]]];
}
export function bez(p0, p1, p2, p3, n = 28) {
  const o = [];
  for (let i = 1; i <= n; i++) { const t = i / n, u = 1 - t;
    o.push([0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k])); }
  return o;
}
const num = (v) => (Math.round(v * 100) / 100).toString();
export const d = (g) => (typeof g[0][0][0] === "number" ? [g] : g).map((poly) => poly.map((ring) => "M" + ring.slice(0, -1).map(([x, y]) => `${num(x)} ${num(y)}`).join("L") + "Z").join("")).join("");
export const header = (title, desc) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-labelledby="t d">\n  <title id="t">${title}</title>\n  <desc id="d">${desc}</desc>\n`;
