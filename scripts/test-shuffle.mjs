// Shuffle regression test for both quote decks (home + Life & Interests).
//   node scripts/test-shuffle.mjs [BASE_URL] [--engines=chromium,webkit]
// BASE_URL defaults to http://localhost:8081/zt-site-staging/ (scripts/serve.mjs).
// CHROME_PATH=/usr/bin/google-chrome uses a system Chrome instead of Playwright's.
// Guards against: a Shuffle being undone by the home deck's lazy load; the card
// showing a stale quote after presses during the slide; Shuffle repeating the
// current quote; the shuffled order not being visible or undoable.
import { chromium, webkit } from "playwright";

const args = process.argv.slice(2);
const B = args.find((a) => !a.startsWith("--")) || "http://localhost:8081/zt-site-staging/";
const engines = (args.find((a) => a.startsWith("--engines=")) || "--engines=chromium,webkit").split("=")[1].split(",");
const pw = { chromium, webkit };
let fails = 0;
const ok = (c, m) => { if (!c) fails++; console.log((c ? "  ok   " : "  FAIL ") + m); };

for (const eng of engines) for (const w of [390, 1440]) {
  console.log(`${eng} ${w}`);
  const b = await pw[eng].launch(eng === "chromium" && process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const c = await b.newContext({ viewport: { width: w, height: w < 500 ? 844 : 900 } });
  // Safari has no requestIdleCallback (the home deck falls back to a 2.5 s timer);
  // make Chromium's idle trigger late too, like on a busy page.
  await c.addInitScript(() => { if (window.requestIdleCallback) window.requestIdleCallback = (f) => setTimeout(f, 3000); });
  const p = await c.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  const click = (id) => p.evaluate((id) => { const e = document.getElementById(id); if (e) e.click(); }, id);
  const cur = (P) => p.evaluate((P) => {
    const o = document.getElementById(P + "-order");
    return {
      id: document.getElementById(P + "-card").dataset.id,
      count: document.getElementById(P + "-count").textContent,
      live: document.getElementById(P + "-live").textContent,
      order: o && !o.hidden && o.offsetParent !== null ? o.textContent.trim() : "",
    };
  }, P);
  const total = async () => +(await p.getAttribute("[data-total]", "data-total"));

  // 1. home: an early Shuffle must survive the lazy-load trigger
  await p.goto(B, { waitUntil: "domcontentloaded" });
  const featured = await p.getAttribute("#qdh-card", "data-id");
  await p.click("#qdh-shuffle"); await p.waitForTimeout(700);
  const a = await cur("qdh"); await p.waitForTimeout(3600);
  const a2 = await cur("qdh");
  ok(a.id !== featured && a2.id === a.id, `home early shuffle sticks (${featured} → ${a.id} → ${a2.id})`);

  for (const [page, P] of [["", "qdh"], ["personal.html", "qd"]]) {
    await p.goto(B + page); await p.waitForTimeout(page ? 600 : 3600);
    const N = await total();
    // 2. random, never the current quote
    let prev = (await cur(P)).id, same = 0; const seen = new Set();
    for (let i = 0; i < 25; i++) {
      await click(P + "-shuffle"); await p.waitForTimeout(230);
      const s = (await cur(P)).id; if (s === prev) same++; seen.add(s); prev = s;
    }
    ok(same === 0 && seen.size >= 20, `${P} 25 shuffles: ${seen.size} distinct, ${same} repeats`);
    // 3. obvious: the shuffled state is visible + announced, and undoing it keeps the quote
    const s = await cur(P);
    ok(/shuffled/i.test(s.order) && /shuffled/i.test(s.live), `${P} shuffled indicator "${s.order}" / live "${s.live.slice(0, 30)}"`);
    await click(P + "-order"); await p.waitForTimeout(400);
    const r = await cur(P);
    const want = await p.evaluate((id) => { /* newest first: position of id among all ids, descending */
      const ids = (window.quoteBank || []).map((q) => q.id);
      return ids.length ? (ids.length - ids.indexOf(id)) + " / " + ids.length : "";
    }, s.id);
    const expect = want || (N + 1 - +s.id.slice(1)) + " / " + N;
    ok(r.id === s.id && !r.order && r.count === expect, `${P} restore order keeps ${s.id}: ${r.count} (want ${expect})`);
    // 4. presses during the slide must not leave the card out of sync with the deck
    let bad = 0;
    for (const seq of [["shuffle", "shuffle"], ["next", "next"], ["shuffle", "next"], ["prev", "shuffle"]]) {
      await p.evaluate(([P, x, y]) => new Promise((res) => {
        document.getElementById(P + "-" + x).click();
        setTimeout(() => { document.getElementById(P + "-" + y).click(); res(); }, 60);
      }), [P, ...seq]);
      await p.waitForTimeout(600);
      const x = await cur(P);
      await click(P + "-next"); await p.waitForTimeout(400); await click(P + "-prev"); await p.waitForTimeout(400);
      const y = await cur(P);
      if (x.id !== y.id || x.count !== y.count) { bad++; console.log(`     desync ${seq.join("+")}: ${x.id} ${x.count} → ${y.id} ${y.count}`); }
    }
    ok(bad === 0, `${P} rapid presses keep the card in sync (${bad}/4 desync)`);
  }
  // 5. a small filtered deck: Shuffle alternates, never repeats
  await p.goto(B + "personal.html"); await p.waitForTimeout(500);
  const small = await p.evaluate(() => { const o = [...document.querySelectorAll("#qd-source option")].find((o) => /\((2|3)\)/.test(o.textContent)); return o && o.value; });
  if (small) {
    await p.selectOption("#qd-source", small); await p.waitForTimeout(300);
    let pv = (await cur("qd")).id, rep = 0;
    for (let i = 0; i < 6; i++) { await click("qd-shuffle"); await p.waitForTimeout(250); const s = (await cur("qd")).id; if (s === pv) rep++; pv = s; }
    ok(rep === 0, `small filter (${small}): Shuffle never repeats (${rep})`);
  }
  ok(errs.length === 0, "no page errors " + errs.join(" | "));
  await b.close();
}
console.log(fails ? `FAILURES ${fails}` : "ALL PASS");
process.exit(fails ? 1 : 0);
