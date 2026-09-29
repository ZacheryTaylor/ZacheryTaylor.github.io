/*
  Tiny zero-dependency static server for CI checks (link check + Lighthouse).
  Serves _site/ under the same path prefix the site was built with, so every
  URL behaves exactly as on GitHub Pages (including the custom 404 page).
    node scripts/serve.mjs [port]      → http://localhost:8080/zt-site-staging/
*/
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import config from "../site.config.js";

const root = path.resolve("_site");
const prefix = config.pathPrefix.replace(/\/?$/, "/");
const port = Number(process.argv[2] || process.env.PORT || 8080);
const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript",
  ".json": "application/json", ".xml": "application/xml", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".gif": "image/gif",
  ".ico": "image/x-icon", ".woff2": "font/woff2", ".pdf": "application/pdf", ".vcf": "text/vcard",
  ".webmanifest": "application/manifest+json", ".txt": "text/plain", ".mp4": "video/mp4",
};

function resolve(urlPath) {
  if (!urlPath.startsWith(prefix)) return null;
  let rel = decodeURIComponent(urlPath.slice(prefix.length));
  let file = path.join(root, rel);
  if (!file.startsWith(root)) return null;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  return fs.existsSync(file) ? file : null;
}

http.createServer((req, res) => {
  const { pathname } = new URL(req.url, "http://x");
  if (pathname === prefix.slice(0, -1)) { res.writeHead(301, { Location: prefix }); return res.end(); }
  const file = resolve(pathname);
  // gzip text like GitHub Pages does, so Lighthouse numbers match production.
  const send = (status, f) => {
    const type = types[path.extname(f).toLowerCase()] || "application/octet-stream";
    const gz = /text|json|xml|svg|javascript|manifest/.test(type) && /\bgzip\b/.test(req.headers["accept-encoding"] || "");
    res.writeHead(status, { "Content-Type": type, "Cache-Control": "max-age=600", ...(gz && { "Content-Encoding": "gzip", Vary: "Accept-Encoding" }) });
    if (req.method === "HEAD") return res.end();
    const stream = fs.createReadStream(f);
    (gz ? stream.pipe(zlib.createGzip()) : stream).pipe(res);
  };
  if (file) return send(200, file);
  const notFound = path.join(root, "404.html");
  if (fs.existsSync(notFound)) return send(404, notFound);
  res.writeHead(404); res.end("Not found");
}).listen(port, () => console.log(`Serving _site at http://localhost:${port}${prefix}`));
