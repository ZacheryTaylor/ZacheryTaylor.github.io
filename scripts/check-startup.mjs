// Startup performance guard (part of the quality gate).
//   node scripts/check-startup.mjs [BASE_URL]
// CHROME_PATH=/usr/bin/google-chrome uses a system Chrome instead of Playwright's.
//
// Lighthouse on the real network swings a lot, so this checks the *causes* of the
// mobile-score dips found in Sept 2026, deterministically:
//  1. No visible text renders with a system fallback font. A character the webfont
//     files don't cover (e.g. a new arrow or symbol) makes the browser search the
//     system fonts during the first layout: on a cold start that search was most of
//     the page's first layout, one long task. Add such characters to ZT Symbols
//     (src/assets/fonts-src/README-zt-symbols.txt) instead.
//  2. No script forces a layout during page startup outside an animation frame. Reading
//     scrollY/offsetHeight/getBoundingClientRect etc. while the page is loading makes the
//     browser lay out the whole document inside that script. (Layout forced inside
//     requestAnimationFrame is fine: it's the frame's own layout.)
//  3. Home: #anchor jumps land exactly, from another page and via an in-page link.
import { chromium } from "playwright";

const BASE = (process.argv[2] || "http://localhost:8080/zt-site-staging/").replace(/\/?$/, "/");
const PAGES = ["", "civil.html", "academic.html", "personal.html", "book.html", "now.html", "bookshelf.html", "notes/", "resume.html"];
const LIMIT_MS = 8; // throttled 4x; anything forced and bigger than this is a real reflow
let fails = 0;
const ok = (c, m) => { if (!c) fails++; console.log((c ? "  ok   " : "  FAIL ") + m); };

const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const mobile = { viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true };

// 1. system font fallback
for (const pg of PAGES) {
  const c = await b.newContext(mobile);
  const p = await c.newPage();
  await p.goto(BASE + pg, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const s = await c.newCDPSession(p);
  await s.send("DOM.enable"); await s.send("CSS.enable");
  const { root } = await s.send("DOM.getDocument", { depth: -1, pierce: false });
  const nodes = [];
  const walk = (n) => {
    if (n.nodeType === 1 && !/^(SCRIPT|STYLE|TEMPLATE|NOSCRIPT|HEAD)$/.test(n.nodeName)) nodes.push(n);
    (n.pseudoElements || []).forEach((q) => nodes.push(q));
    (n.children || []).forEach(walk);
  };
  walk(root);
  const bad = new Map();
  for (const n of nodes) {
    let r; try { r = await s.send("CSS.getPlatformFontsForNode", { nodeId: n.nodeId }); } catch (e) { continue; }
    for (const f of r.fonts || []) if (!f.isCustomFont) {
      const k = f.familyName; const tag = n.localName || n.nodeName.toLowerCase();
      const cls = (n.attributes || []).reduce((a, v, i, arr) => (v === "class" ? arr[i + 1] : a), "");
      if (!bad.has(k)) bad.set(k, `${tag}${cls ? "." + cls.split(" ")[0] : ""}${n.pseudoType ? "::" + n.pseudoType : ""}`);
    }
  }
  await c.close();
  ok(!bad.size, `${pg || "home"}: all visible text uses the site's own fonts${bad.size ? " — system fallback: " + [...bad].map(([f, w]) => `${f} (e.g. ${w})`).join(", ") : ""}`);
}

// 2. script-forced layout at startup
for (const pg of PAGES) {
  const c = await b.newContext(mobile);
  const p = await c.newPage();
  const s = await c.newCDPSession(p);
  await s.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await b.startTracing(p, { categories: ["devtools.timeline", "disabled-by-default-devtools.timeline", "disabled-by-default-devtools.timeline.stack"] });
  await p.goto(BASE + pg, { waitUntil: "load" });
  await p.waitForTimeout(3000); // idle-time work (deck data, section release) included
  const ev = JSON.parse(await b.stopTracing()).traceEvents;
  await c.close();
  const frames = ev.filter((e) => e.name === "FireAnimationFrame" && e.dur);
  const inFrame = (e) => frames.some((f) => f.tid === e.tid && f.ts <= e.ts && e.ts < f.ts + f.dur);
  const forced = ev.filter((e) => (e.name === "Layout" || e.name === "UpdateLayoutTree") && e.dur / 1000 > LIMIT_MS)
    .map((e) => ({ e, st: (e.args && (e.args.beginData || e.args.data) || {}).stackTrace }))
    .filter((x) => x.st && x.st.length && !inFrame(x.e));
  const where = forced.map((x) => `${x.e.name} ${(x.e.dur / 1000).toFixed(0)}ms at ${x.st.slice(0, 2).map((f) => `${(f.url || "").split("/").pop()}:${f.lineNumber + 1} ${f.functionName || "(anon)"}`).join(" < ")}`);
  ok(!forced.length, `${pg || "home"}: no script-forced layout at startup${where.length ? " — " + where.join("; ") : ""}`);
}

// 3. Home: anchors land where they should
{
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await c.newPage();
  const top = (id) => p.evaluate((id) => Math.round(document.getElementById(id).getBoundingClientRect().top), id);
  // where a jump should land: html scroll-padding-top + the section's scroll-margin-top
  const margin = async (id) => p.evaluate((id) => (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) + (parseFloat(getComputedStyle(document.getElementById(id)).scrollMarginTop) || 0), id);
  for (const id of ["story", "contact"]) {
    await p.goto(BASE + "civil.html");
    await p.goto(BASE + "#" + id);
    await p.waitForTimeout(3000);
    const t = await top(id), m = await margin(id);
    ok(Math.abs(t - m) <= 4, `home: /#${id} from another page lands at ${t}px (expected ${m})`);
  }
  await p.goto(BASE);
  await p.evaluate(() => { const a = document.createElement("a"); a.href = "#contact"; a.textContent = "x"; document.body.appendChild(a); a.click(); });
  await p.waitForTimeout(3000);
  const t = await top("contact"), m = await margin("contact");
  ok(Math.abs(t - m) <= 4, `home: in-page #contact link right after load lands at ${t}px (expected ${m})`);
  await c.close();
}
await b.close();
console.log(fails ? `FAILURES: ${fails}` : "ALL PASS");
process.exit(fails ? 1 : 0);
