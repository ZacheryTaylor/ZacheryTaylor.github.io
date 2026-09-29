/*
  Link check for the built site. Crawls from the home page over HTTP (run
  scripts/serve.mjs first) and verifies every internal href/src/srcset,
  including #fragments. Internal problems fail the run (exit 1).
  External links are checked with --external and only reported as warnings:
  sites like LinkedIn block bots, so they can't reliably gate a build.
    node scripts/check-links.mjs http://localhost:8080/zt-site-staging/ [--external]
*/
const base = process.argv[2] || "http://localhost:8080/zt-site-staging/";
const checkExternal = process.argv.includes("--external");
const origin = new URL(base).origin;
// The site's own public URL (canonical/og tags): not "external", and new pages
// won't exist there until deployed, so skip it.
const self = (process.env.SITE_URL || "https://zacherytaylor.github.io").replace(/\/$/, "");
const status = new Map();      // url (no hash) -> http status
const ids = new Map();         // page url -> Set of ids
const frags = [];              // [pageUrl, fragment, fromPage]
const external = new Map();    // url -> first page it appears on
const queue = [base];
const queued = new Set(queue);
const problems = [];

const head = async (u) => {
  try {
    let r = await fetch(u, { method: "HEAD", redirect: "follow" });
    if (r.status >= 400) r = await fetch(u, { redirect: "follow" });
    return r.status;
  } catch (e) { return "ERR " + (e.cause?.code || e.message); }
};

// Also seed from the sitemap (catches orphan pages) and the custom 404 page.
try {
  const sm = await (await fetch(new URL("sitemap.xml", base))).text();
  for (const [, loc] of sm.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const local = new URL(new URL(loc).pathname, base).toString();
    if (!queued.has(local)) { queued.add(local); queue.push(local); }
  }
} catch {}
for (const extra of ["404.html"]) { const x = new URL(extra, base).toString(); if (!queued.has(x)) { queued.add(x); queue.push(x); } }

while (queue.length) {
  const u = queue.shift();
  const r = await fetch(u);
  status.set(u, r.status);
  if (!(r.headers.get("content-type") || "").includes("html")) continue;
  const html = await r.text();
  ids.set(u, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  const refs = new Set();
  // Walk tags so JS-only action links (data-action="…") can be skipped.
  for (const [tag] of html.matchAll(/<[a-z][^>]*>/gi)) {
    if (/\sdata-action=/.test(tag)) continue;
    for (const m of tag.matchAll(/\s(?:href|src|poster|data-src|data-full)="([^"]+)"/g)) refs.add(m[1]);
    for (const m of tag.matchAll(/\ssrcset="([^"]+)"/g)) m[1].split(",").forEach((x) => refs.add(x.trim().split(/\s+/)[0]));
  }
  for (let ref of refs) {
    ref = ref.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n)).replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    if (/^(mailto|tel|javascript|data|sms):/.test(ref)) continue;
    const abs = new URL(ref, u);
    const hash = decodeURIComponent(abs.hash.slice(1));
    abs.hash = "";
    const s = abs.toString();
    if (abs.origin !== origin) { if (/^https?:$/.test(abs.protocol) && !s.startsWith(self + "/") && !external.has(s)) external.set(s, u); continue; }
    if (!s.startsWith(base)) { problems.push(`outside prefix: ${s} (on ${u})`); continue; }
    const pageLike = /\.html$|\/$/.test(abs.pathname);
    if (hash && pageLike) frags.push([s.split("?")[0], hash, u]);
    if (queued.has(s)) continue;
    queued.add(s);
    if (pageLike) queue.push(s); else status.set(s, await head(s));
  }
}

for (const [u, st] of status) if (st !== 200) problems.push(`${st}: ${u}`);
for (const [pageUrl, hash, from] of frags) {
  const set = ids.get(pageUrl);
  if (set && !set.has(hash)) problems.push(`missing #${hash} on ${pageUrl} (linked from ${from})`);
}

console.log(`Internal: ${status.size} URLs, ${frags.length} fragment links checked.`);
if (checkExternal) {
  let warn = 0;
  for (const [s, from] of external) {
    const st = await head(s);
    if (st !== 200) { warn++; console.log(`::warning::external ${st}: ${s} (on ${from})`); }
  }
  console.log(`External: ${external.size} checked, ${warn} warning(s).`);
}
if (problems.length) {
  problems.forEach((p) => console.log(`::error::${p}`));
  console.log(`FAILED: ${problems.length} internal link problem(s).`);
  process.exit(1);
}
console.log("OK: no broken internal links.");
