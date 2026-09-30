import fs from "node:fs";
import path from "node:path";
import { HtmlBasePlugin } from "@11ty/eleventy";
import Image from "@11ty/eleventy-img";
import sharp from "sharp";
import sizeOf from "image-size";
import { transform as cssTransform } from "lightningcss";
import site from "./site.config.js";
import { buildQuoteDownloads } from "./scripts/quote-downloads.mjs";

const OUT = "_site";
const IMG_OPTS = {
  formats: ["avif", "webp", "auto"],
  outputDir: path.join(OUT, "img"),
  urlPath: "/img/",
  sharpAvifOptions: { quality: 52, effort: 3 },
  sharpWebpOptions: { quality: 74 },
  sharpJpegOptions: { quality: 78, mozjpeg: true, progressive: true },
  sharpPngOptions: { compressionLevel: 9, palette: true, quality: 85 },
  filenameFormat: (id, src, width, format) =>
    `${path.basename(src, path.extname(src)).toLowerCase()}-${id}-${width}.${format}`,
};

/* Width presets: every <img> on the site goes through one of these. */
const PRESETS = {
  card: { widths: [420, 720], sizes: "(max-width: 620px) 92vw, (max-width: 840px) 46vw, 360px" },
  hero: { widths: [720, 1100, 1600], sizes: "(max-width: 900px) 100vw, 900px" },
  gallery: { widths: [640, 1100, 1600], sizes: "(max-width: 960px) 96vw, 900px" },
  portrait: { widths: [160, 320], sizes: "130px" },
  compare: { widths: [640, 1100], sizes: "(max-width: 900px) 96vw, 860px" },
};

const srcPath = (p) => path.join("src", String(p).replace(/^\/+/, ""));
const exists = (p) => !!p && fs.existsSync(srcPath(p));

export default function (eleventyConfig) {
  eleventyConfig.setInputDirectory("src");
  eleventyConfig.setOutputDirectory(OUT);
  eleventyConfig.setIncludesDirectory("_includes");
  eleventyConfig.setDataDirectory("_data");

  /* ---- path prefix: ONE value (site.config.js / PATH_PREFIX env) ---- */
  eleventyConfig.addPlugin(HtmlBasePlugin);

  /* ---- static files ---- */
  eleventyConfig.addPassthroughCopy({ "src/pdfs": "pdfs" });
  eleventyConfig.addPassthroughCopy({ "src/resume.pdf": "resume.pdf" });
  eleventyConfig.addPassthroughCopy({ "src/contact.vcf": "contact.vcf" });
  eleventyConfig.addPassthroughCopy({ "src/assets/brand": "assets/brand" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2": "assets/fonts/dm-sans-latin-wght-normal.woff2",
    "node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-italic.woff2": "assets/fonts/dm-sans-latin-wght-italic.woff2",
    "node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2": "assets/fonts/instrument-serif-latin-400-normal.woff2",
    "node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2": "assets/fonts/instrument-serif-latin-400-italic.woff2",
  });
  // Original, full-resolution images stay in src/images (the archive). New pages only
  // use the optimized derivatives from the image pipeline (/img/…). The originals are
  // also copied, byte for byte, to their pre-2026 URLs (/images/…) so old external links
  // keep working. Plain copies: nothing links to or preloads them, so pages don't get heavier.
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.ignores.add("src/images/**");
  eleventyConfig.ignores.add("src/assets/**");
  eleventyConfig.ignores.add("src/pdfs/**");
  eleventyConfig.ignores.add("src/_lib/**");
  eleventyConfig.watchIgnores.add("_site/**");

  /* ---- responsive images: <picture> with AVIF/WebP + width/height ----
     Synchronous (statsSync) so it works inside Nunjucks macros; the actual
     encoding runs in the background and is awaited before the build ends. */
  const pending = [];
  const fallbackFormat = (src) => (/\.png$/i.test(src) ? "png" : "jpeg");
  const optsFor = (preset, src) => ({
    ...IMG_OPTS,
    formats: ["avif", "webp", fallbackFormat(src)],
    widths: (PRESETS[preset] || PRESETS.card).widths,
  });
  function generate(src, opts) {
    const job = Image(srcPath(src), opts);
    pending.push(job);
    // Use EXIF-orientation-aware dimensions (phone photos are often stored
    // sideways), otherwise the predicted file names/widths won't match the output.
    const d = sizeOf(srcPath(src));
    const rotated = d.orientation >= 5 && d.orientation <= 8;
    return Image.statsByDimensionsSync(srcPath(src), rotated ? d.height : d.width, rotated ? d.width : d.height, opts);
  }
  eleventyConfig.addShortcode("picture", function (src, alt = "", preset = "card", attrs = {}) {
    if (!exists(src)) {
      console.warn(`[picture] missing image: ${src}`);
      return "";
    }
    const meta = generate(src, optsFor(preset, src));
    return Image.generateHTML(meta, {
      alt,
      sizes: attrs.sizes || (PRESETS[preset] || PRESETS.card).sizes,
      loading: attrs.loading || "lazy",
      decoding: "async",
      ...(attrs.class ? { class: attrs.class } : {}),
      ...(attrs.fetchpriority ? { fetchpriority: attrs.fetchpriority } : {}),
    });
  });
  /* Single optimized URL, e.g. for a CSS background or JSON-LD image. */
  eleventyConfig.addShortcode("imageUrl", function (src, width = 1200, format = "jpeg") {
    if (!exists(src)) return "";
    const meta = generate(src, { ...IMG_OPTS, widths: [width], formats: [format] });
    return meta[format][0].url;
  });
  eleventyConfig.on("eleventy.after", async () => {
    await Promise.all(pending.splice(0));
  });

  /* ---- CSS: minified + inlined (no render-blocking requests) ---- */
  const cssCache = new Map();
  eleventyConfig.addFilter("inlineCss", function (files) {
    const list = Array.isArray(files) ? files : [files];
    return list
      .map((f) => {
        if (cssCache.has(f) && process.env.ELEVENTY_RUN_MODE === "build") return cssCache.get(f);
        const raw = fs.readFileSync(srcPath(f), "utf8");
        let { code } = cssTransform({ filename: f, code: Buffer.from(raw), minify: true, targets: { chrome: 100 << 16, safari: 15 << 16, firefox: 100 << 16 } });
        const prefix = site.pathPrefix.replace(/\/$/, "");
        const css = code.toString().replace(/url\(\/(?!\/)/g, `url(${prefix}/`);
        cssCache.set(f, css);
        return css;
      })
      .join("\n");
  });

  /* ---- misc filters ---- */
  eleventyConfig.addFilter("fileExists", exists);
  eleventyConfig.addFilter("json", (v) => JSON.stringify(v));
  eleventyConfig.addFilter("absUrl", (url) => {
    const prefix = site.pathPrefix.replace(/\/$/, "");
    const u = String(url || "/");
    if (/^https?:/.test(u)) return u;
    return site.url.replace(/\/$/, "") + prefix + (u.startsWith("/") ? u : "/" + u);
  });
  // Make root-relative links/images in note HTML absolute (for RSS / JSON feed readers).
  eleventyConfig.addFilter("absContent", (html) =>
    String(html || "").replace(/(href|src)="\/(?!\/)([^"]*)"/g, (m, attr, rest) => {
      const prefix = site.pathPrefix.replace(/\/$/, "");
      const pathOnly = ("/" + rest).startsWith(prefix + "/") && prefix ? "/" + rest : prefix + "/" + rest;
      return `${attr}="${site.url.replace(/\/$/, "")}${pathOnly}"`;
    }));
  eleventyConfig.addFilter("readingTime", (html) => {
    const words = String(html || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 230)) + " min read";
  });

  /* ---- Notes (src/notes/*.md). Drafts (draft: true) are never published;
     run `npm run start:drafts` to preview them locally. ---- */
  eleventyConfig.addCollection("notes", (api) =>
    api.getFilteredByGlob("src/notes/*.md")
      .filter((n) => !n.data.draft || process.env.INCLUDE_DRAFTS)
      .sort((a, b) => b.date - a.date));
  eleventyConfig.addFilter("prefixed", (u) => site.pathPrefix.replace(/\/$/, "") + u);
  eleventyConfig.addFilter("lines", (v) => String(v || "").split("\n"));
  eleventyConfig.addFilter("oneLine", (v) => String(v || "").replace(/\s*\n\s*/g, " · "));
  // "2026-09-29" (or a Date) -> "September 29, 2026", no timezone drift.
  eleventyConfig.addFilter("longDate", (d) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(typeof d === "string" ? d : "");
    // Front-matter dates are UTC midnight; format them in UTC so they don't slip a day.
    const date = m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : new Date(d);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  });
  eleventyConfig.addFilter("fixed", (n, d = 2) => Number(n).toFixed(d));
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString());
  eleventyConfig.addFilter("rfc822", (d) => new Date(d).toUTCString());
  eleventyConfig.addFilter("truncate", (s, n = 155) => {
    s = String(s || "");
    return s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…";
  });
  eleventyConfig.addFilter("svgInline", (file) => fs.readFileSync(srcPath(file), "utf8").replace(/<\?xml[^>]*>/, ""));
  // Decorative inline monogram: strip title/desc/ids so it can repeat on a page.
  eleventyConfig.addFilter("monogram", (option) =>
    fs.readFileSync(srcPath(`assets/brand/monogram-${option || site.monogram}.svg`), "utf8")
      .replace(/<title[^>]*>.*?<\/title>\s*/s, "")
      .replace(/<desc[^>]*>.*?<\/desc>\s*/s, "")
      .replace(/\srole="img"/, "")
      .replace(/\saria-labelledby="[^"]*"/, "")
      .replace("<svg ", '<svg aria-hidden="true" focusable="false" '));
  // Horizontal lockup for options that have one (assets/brand/lockup-<key>.svg); "" otherwise.
  eleventyConfig.addFilter("lockup", (option) => {
    const f = srcPath(`assets/brand/lockup-${option || site.monogram}.svg`);
    if (!fs.existsSync(f)) return "";
    return fs.readFileSync(f, "utf8")
      .replace(/<title[^>]*>.*?<\/title>\s*/s, "")
      .replace(/<desc[^>]*>.*?<\/desc>\s*/s, "")
      .replace(/\srole="img"/, "")
      .replace(/\saria-labelledby="[^"]*"/, "")
      .replace("<svg ", '<svg aria-hidden="true" focusable="false" ');
  });
  eleventyConfig.addFilter("where", (arr, key, val) => (arr || []).filter((x) => x[key] === val));

  /* ---- favicons + app icons from the selected monogram ----
     favicon.svg          the mark itself (container-less marks adapt to the
                          OS light/dark setting through their own <style>)
     favicon.ico, favicon-16/32.png, icon-192/512.png
                          from monogram-<key>-tile.svg when it exists (a solid
                          tile reads on light and dark browser chrome alike)
     apple-touch-icon.png, icon-maskable-192/512.png
                          from monogram-<key>-app.svg (full-bleed, safe zone) */
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const base = `assets/brand/monogram-${site.monogram}`;
    const pick = (...c) => c.map((f) => srcPath(`${base}${f}.svg`)).find((f) => fs.existsSync(f));
    const svg = pick(""), tile = pick("-tile", ""), app = pick("-app", "-tile", "");
    const out = dir.output;
    fs.copyFileSync(svg, path.join(out, "favicon.svg"));
    const raster = (src, size) => sharp(src, { density: 600 }).resize(size, size).png().toBuffer();
    const write = async (src, size, file) => fs.writeFileSync(path.join(out, file), await raster(src, size));
    await write(tile, 16, "favicon-16.png");
    await write(tile, 32, "favicon-32.png");
    await write(tile, 192, "icon-192.png");
    await write(tile, 512, "icon-512.png");
    await write(app, 180, "apple-touch-icon.png");
    await write(app, 192, "icon-maskable-192.png");
    await write(app, 512, "icon-maskable-512.png");
    // ICO container holding the 16 px and 32 px PNGs.
    const imgs = [await raster(tile, 16), await raster(tile, 32)];
    const head = Buffer.alloc(6 + 16 * imgs.length);
    head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(imgs.length, 4);
    let offset = head.length;
    imgs.forEach((buf, i) => {
      const size = i ? 32 : 16, o = 6 + 16 * i;
      head.writeUInt8(size, o); head.writeUInt8(size, o + 1); head.writeUInt8(0, o + 2); head.writeUInt8(0, o + 3);
      head.writeUInt16LE(1, o + 4); head.writeUInt16LE(32, o + 6);
      head.writeUInt32LE(buf.length, o + 8); head.writeUInt32LE(offset, o + 12);
      offset += buf.length;
    });
    fs.writeFileSync(path.join(out, "favicon.ico"), Buffer.concat([head, ...imgs]));
  });

  /* ---- Quote bank downloads: /downloads/quote-bank.pdf, .csv and .txt, always the
     full bank from quotes-data.js (see scripts/quote-downloads.mjs). Static files,
     so the download works the same in every browser, iOS Safari included. */
  eleventyConfig.addWatchTarget("./scripts/quote-downloads.mjs");
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const deckUrl = site.url.replace(/\/$/, "") + site.pathPrefix.replace(/\/$/, "") + "/personal.html";
    const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Chicago" });
    await buildQuoteDownloads(dir.output, { deckUrl, date });
  });

  return {
    pathPrefix: site.pathPrefix,
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
