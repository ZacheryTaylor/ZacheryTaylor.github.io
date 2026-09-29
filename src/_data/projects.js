import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { loadDataFile, fileExists } from "../_lib/load.js";

/* 1200x630 social-card crop of the cover for og:image / twitter:image */
async function ogImage(p) {
  if (!p.coverImage) return null;
  const rel = `/img/og/${p.slug}.jpg`;
  const out = path.join("_site", rel);
  if (!fs.existsSync(out)) {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await sharp(path.join("src", p.coverImage)).rotate()
      .resize(1200, 630, { fit: "cover", position: "attention" })
      .jpeg({ quality: 80, mozjpeg: true }).toFile(out);
  }
  return rel;
}

const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function normalize(p, section) {
  const warn = (msg) => console.warn(`[projects] ${p.id}: ${msg}`);
  const out = { ...p, section, slug: slugify(p.id) };
  out.url = `/projects/${out.slug}/`;
  if (p.pdf && !fileExists(p.pdf)) { warn(`PDF not found, link hidden (${p.pdf})`); out.pdf = null; }
  if (p.presentationPdf && !fileExists(p.presentationPdf)) { warn(`presentation not found (${p.presentationPdf})`); out.presentationPdf = null; }
  if (p.coverImage && !fileExists(p.coverImage)) { warn(`cover not found (${p.coverImage})`); out.coverImage = null; }
  out.gallery = (p.gallery || []).filter((g) => {
    const ok = g.type === "video" || fileExists(g.src);
    if (!ok) warn(`gallery image not found (${g.src})`);
    return ok;
  });
  if (p.compare && !(fileExists(p.compare.before?.src) && fileExists(p.compare.after?.src))) {
    warn("compare images missing, slider hidden"); out.compare = null;
  }
  // Links: internal .html links are made root-relative so the path prefix applies.
  out.links = (p.links || p.actions || [])
    .filter((l) => l && l.label && l.href)
    .map((l) => ({
      ...l,
      href: /^(https?:|mailto:|#)/.test(l.href) ? l.href : "/" + l.href.replace(/^\/+/, ""),
    }));
  out.dateLine = String(p.date || "").replace(/\s*\n\s*/g, " · ");
  return out;
}

const pad = (n) => String(n).padStart(2, "0");
const academic = loadDataFile("academic-projects-data.js", "projects")
  .map((p) => normalize(p, "academic"))
  .map((p, i) => ({ ...p, sheet: `M-2${pad(i + 2)}` }));
const life = loadDataFile("personal-projects-data.js", "projects")
  .map((p) => normalize(p, "life"))
  .map((p, i) => ({ ...p, sheet: `L-3${pad(i + 11)}` }));

export default async function () {
  for (const p of [...academic, ...life]) {
    p.ogImage = await ogImage(p);
    if (p.coverImage) {
      const m = await sharp(path.join("src", p.coverImage)).metadata();
      p.coverWide = m.width / m.height >= 1.45; // wide covers fill the banner; others are shown whole
    }
  }
  return { academic, life, all: [...academic, ...life] };
}
