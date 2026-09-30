// Shuffle regression test for both quote decks (home + Life & Interests).
//   node scripts/test-shuffle.mjs [BASE_URL] [--engines=chromium,webkit]
// BASE_URL defaults to http://localhost:8081/zt-site-staging/ (scripts/serve.mjs).
// CHROME_PATH=/usr/bin/google-chrome uses a system Chrome instead of Playwright's.
// Shuffle = a random quote on every tap (from the filtered set on Life & Interests),
// never the one showing, no repeats until the set is used up; order untouched.
// Also guards against: a Shuffle being undone by the home deck's lazy load, and the
// card showing a stale quote after presses during the slide.
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

  // 1. home: an early Shuffle must survive the lazy-load trigger
  await p.goto(B, { waitUntil: "domcontentloaded" });
  const featured = await p.getAttribute("#qdh-card", "data-id");
  await p.click("#qdh-shuffle"); await p.waitForTimeout(700);
  const a = await cur("qdh"); await p.waitForTimeout(3600);
  const a2 = await cur("qdh");
  ok(a.id !== featured && a2.id === a.id, `home early shuffle sticks (${featured} → ${a.id} → ${a2.id})`);

  for (const [page, P] of [["", "qdh"], ["personal.html", "qd"]]) {
    await p.goto(B + page); await p.waitForTimeout(page ? 600 : 3600);
    // the deck's real order (newest first): ids by position
    const order = await p.evaluate((P) => P === "qd"
      ? [...document.querySelectorAll("#qd-list > li")].map((li) => li.dataset.id)
      : (typeof quoteBank !== "undefined" ? quoteBank : []).slice().reverse().map((q) => (/^\d+$/.test(String(q.id)) ? "q" + String(q.id).padStart(3, "0") : q.id)), P);
    const N = order.length;
    // 2. every tap: a random quote, never the one showing; the counter is its real position
    let prev = (await cur(P)).id, same = 0, badCount = 0; const seen = new Set();
    for (let i = 0; i < 20; i++) {
      await click(P + "-shuffle"); await p.waitForTimeout(260);
      const s = await cur(P);
      if (s.id === prev) same++;
      if (s.count !== (order.indexOf(s.id) + 1) + " / " + N) { badCount++; console.log(`     count ${s.count} for ${s.id} (want ${order.indexOf(s.id) + 1} / ${N})`); }
      seen.add(s.id); prev = s.id;
    }
    ok(same === 0 && seen.size >= 15, `${P} 20 taps: ${seen.size} distinct, ${same} equal to the previous one`);
    ok(badCount === 0, `${P} counter shows the quote's real position (${badCount} wrong)`);
    // 3. no shuffled mode: no pill, no toggled button; announced; Prev/Next continue in order
    const s = await cur(P);
    const mode = await p.evaluate((P) => ({ pill: !!document.getElementById(P + "-order"), toggled: document.getElementById(P + "-card").classList.contains("is-shuffled") }), P);
    ok(!mode.pill && !mode.toggled && /^Random quote\. Quote \d+ of \d+/.test(s.live), `${P} no shuffled mode; live "${s.live.slice(0, 32)}"`);
    const at = order.indexOf(s.id);
    await click(P + "-next"); await p.waitForTimeout(400); const nx = await cur(P);
    await click(P + "-prev"); await p.waitForTimeout(400); await click(P + "-prev"); await p.waitForTimeout(400); const pv = await cur(P);
    ok(nx.id === order[(at + 1) % N] && pv.id === order[(at - 1 + N) % N], `${P} Next/Prev carry on in order from ${s.id} (${nx.id}, ${pv.id})`);
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
  // 5. filtered sets: random within the filter; no repeats until the set is used up
  await p.goto(B + "personal.html"); await p.waitForTimeout(500);
  const opts = await p.evaluate(() => [...document.querySelectorAll("#qd-source option")].map((o) => ({ v: o.value, n: +(/\((\d+)\)$/.exec(o.textContent) || [0, 0])[1] })).filter((o) => o.v));
  for (const o of [opts.find((x) => x.n === 2), opts.find((x) => x.n >= 9 && x.n <= 15)].filter(Boolean)) {
    await p.selectOption("#qd-source", o.v); await p.waitForTimeout(300);
    const ids = await p.evaluate(() => [...document.querySelectorAll("#qd-list > li")].filter((li) => li.dataset.origin === document.getElementById("qd-source").value).map((li) => li.dataset.id));
    let pv = (await cur("qd")).id; const got = [pv]; let rep = 0, out = 0;
    for (let i = 0; i < o.n - 1; i++) { await click("qd-shuffle"); await p.waitForTimeout(260); const s = await cur("qd"); if (s.id === pv) rep++; if (!ids.includes(s.id) || !s.count.endsWith("/ " + o.n)) out++; got.push(s.id); pv = s.id; }
    ok(rep === 0 && out === 0 && new Set(got).size === o.n, `filter "${o.v}" (${o.n}): ${o.n - 1} taps cover the set with no repeats (${new Set(got).size} distinct, ${out} outside)`);
  }
  ok(errs.length === 0, "no page errors " + errs.join(" | "));
  await b.close();
}
console.log(fails ? `FAILURES ${fails}` : "ALL PASS");
process.exit(fails ? 1 : 0);
