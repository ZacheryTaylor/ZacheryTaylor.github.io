// Startup performance guard (part of the quality gate).
//   node scripts/check-startup.mjs [BASE_URL]
// CHROME_PATH=/usr/bin/google-chrome uses a system Chrome instead of Playwright's.
//
// Lighthouse on the real network swings a lot, so this checks the *cause* of the
// mobile-score dips found in Sept 2026, deterministically:
//  1. No script forces a layout during page startup outside an animation frame. Reading
//     scrollY/offsetHeight/getBoundingClientRect etc. while the page is loading makes the
//     browser lay out the whole document inside that script, one long task that can land
//     after first paint. (Layout forced inside requestAnimationFrame is fine: it's the
//     frame's own layout.)
//  2. Home: the load-time content-visibility (html.cv, see site.css) is released after
//     load, and #anchor jumps land exactly, from another page and via an in-page link.
import { chromium } from "playwright";

const BASE = (process.argv[2] || "http://localhost:8080/zt-site-staging/").replace(/\/?$/, "/");
const PAGES = ["", "civil.html", "academic.html", "personal.html", "book.html", "now.html", "bookshelf.html", "notes/", "resume.html"];
const LIMIT_MS = 8; // throttled 4x; anything forced and bigger than this is a real reflow
let fails = 0;
const ok = (c, m) => { if (!c) fails++; console.log((c ? "  ok   " : "  FAIL ") + m); };

const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const mobile = { viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true };

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

// Home: deferred sections are released; anchors land where they should
{
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await c.newPage();
  const top = (id) => p.evaluate((id) => Math.round(document.getElementById(id).getBoundingClientRect().top), id);
  // where a jump should land: html scroll-padding-top + the section's scroll-margin-top
  const margin = async (id) => p.evaluate((id) => (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) + (parseFloat(getComputedStyle(document.getElementById(id)).scrollMarginTop) || 0), id);
  await p.goto(BASE);
  const cv0 = await p.evaluate(() => document.documentElement.classList.contains("cv"));
  await p.waitForTimeout(4000);
  const rel = await p.evaluate(() => ({ cv: document.documentElement.classList.contains("cv"), vis: [...document.querySelectorAll("main > .hero ~ section")].every((s) => getComputedStyle(s).contentVisibility === "visible") }));
  ok(cv0 && !rel.cv && rel.vis, `home: off-screen sections deferred during load (${cv0}) and released after (${!rel.cv && rel.vis})`);
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
