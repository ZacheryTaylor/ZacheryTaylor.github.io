import fs from "node:fs";
import path from "node:path";
import { HtmlBasePlugin } from "@11ty/eleventy";
import Image from "@11ty/eleventy-img";
import sharp from "sharp";
import { transform as cssTransform } from "lightningcss";
import site from "./site.config.js";

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
  // Original, full-resolution images stay in src/images (the archive);
  // only optimized derivatives from the image pipeline are published.
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
    return Image.statsSync(srcPath(src), opts);
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
  eleventyConfig.addFilter("prefixed", (u) => site.pathPrefix.replace(/\/$/, "") + u);
  eleventyConfig.addFilter("lines", (v) => String(v || "").split("\n"));
  eleventyConfig.addFilter("oneLine", (v) => String(v || "").replace(/\s*\n\s*/g, " · "));
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
  eleventyConfig.addFilter("where", (arr, key, val) => (arr || []).filter((x) => x[key] === val));

  /* ---- favicons from the selected monogram ---- */
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const svg = srcPath(`assets/brand/monogram-${site.monogram}.svg`);
    const out = dir.output;
    fs.copyFileSync(svg, path.join(out, "favicon.svg"));
    const png = async (size, file) =>
      sharp(svg, { density: 600 }).resize(size, size).png().toFile(path.join(out, file));
    await png(180, "apple-touch-icon.png");
    await png(192, "icon-192.png");
    await png(512, "icon-512.png");
    const ico32 = await sharp(svg, { density: 600 }).resize(32, 32).png().toBuffer();
    // Minimal ICO container wrapping a 32px PNG (supported by all modern browsers).
    const header = Buffer.alloc(22);
    header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
    header.writeUInt8(32, 6); header.writeUInt8(32, 7); header.writeUInt8(0, 8); header.writeUInt8(0, 9);
    header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
    header.writeUInt32LE(ico32.length, 14); header.writeUInt32LE(22, 18);
    fs.writeFileSync(path.join(out, "favicon.ico"), Buffer.concat([header, ico32]));
  });

  return {
    pathPrefix: site.pathPrefix,
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
