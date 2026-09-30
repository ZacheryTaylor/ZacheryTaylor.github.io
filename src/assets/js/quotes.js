/*
  QUOTE ENGINE
  ------------
  Home: the flashcard is rendered at build time with one quote; Shuffle and
  the Favorites switch load quotes-data.js on demand.
  Life & Interests: every quote is rendered at build time (list view and
  no-JS fallback); this turns it into a flashcard deck with search, topic and
  source filters, shuffle, swipe/arrow keys, a list view and #q-037 deep links.
  Favorites come only from `favorite: true` in quotes-data.js.
*/
(function () {
  "use strict";
  var doc = document;
  var script = doc.currentScript;
  var base = script ? script.src.replace(/quotes\.js(\?.*)?$/, "") : "assets/js/";
  var dataPromise = null;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = doc.createElement("script");
      s.src = src; s.onload = resolve; s.onerror = reject;
      doc.head.appendChild(s);
    });
  }
  function loadQuotes() {
    /* global quoteBank */
    if (typeof quoteBank !== "undefined") return Promise.resolve(quoteBank);
    if (!dataPromise) {
      dataPromise = loadScript(base + "quotes-data.js").then(function () {
        // quotes-data.js declares `const quoteBank` at top level
        /* global quoteBank */
        return typeof quoteBank !== "undefined" ? quoteBank : [];
      });
    }
    return dataPromise;
  }

  /* ---------- Home flashcard ---------- */
  var card = doc.getElementById("quote-flashcard");
  if (card) {
    var text = doc.getElementById("quote-flashcard-text");
    var origin = doc.getElementById("quote-flashcard-origin");
    var shuffle = doc.getElementById("quote-flashcard-shuffle");
    var fav = doc.getElementById("quote-flashcard-fav-toggle");
    var empty = doc.getElementById("quote-flashcard-empty");
    var openLink = doc.getElementById("quote-flashcard-open");
    var currentId = card.getAttribute("data-quote-id");

    var show = function () {
      loadQuotes().then(function (all) {
        var pool = fav && fav.checked ? all.filter(function (q) { return q.favorite; }) : all;
        if (!pool.length) { if (empty) empty.style.display = "block"; return; }
        if (empty) empty.style.display = "none";
        var choices = pool.length > 1 ? pool.filter(function (q) { return q.id !== currentId; }) : pool;
        var q = choices[Math.floor(Math.random() * choices.length)];
        card.classList.add("is-flipping");
        setTimeout(function () {
          currentId = q.id;
          // "Open the full deck" opens this same quote on the Life & Interests deck
          if (openLink) openLink.href = openLink.href.split("#")[0] + "#q-" + q.id.replace(/^q/i, "");
          text.textContent = "\u201C" + q.quote + "\u201D";
          origin.textContent = "\u2014 " + q.origin;
          card.classList.remove("is-flipping");
        }, 180);
      });
    };
    if (shuffle) shuffle.addEventListener("click", show);
    if (fav) fav.addEventListener("change", show);
    if ("requestIdleCallback" in window) requestIdleCallback(function () { loadQuotes(); }, { timeout: 4000 });
  }

  /* ---------- Life & Interests: the quote deck ---------- */
  // One flashcard at a time; search / topic chips / source narrow the deck.
  // The build renders every quote as <li> in #qd-list (list view + no-JS
  // fallback); the deck reads its data from those items.
  var root = doc.getElementById("quote-deck");
  if (root) {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var $ = function (id) { return doc.getElementById(id); };
    var card = $("qd-card"), stage = $("qd-stage"), textEl = $("qd-text"), originEl = $("qd-origin"),
        dateEl = $("qd-date"), countEl = $("qd-count"), shelfLink = $("qd-shelf-link"),
        status = $("qd-status"), live = $("qd-live"), listEl = $("qd-list"), emptyEl = $("qd-empty"),
        moreEl = $("qd-more"), searchEl = $("qd-search"), sourceEl = $("qd-source"), copyBtn = $("qd-copy");
    var chips = [].slice.call(root.querySelectorAll(".qd-chip"));
    var viewBtns = [].slice.call(root.querySelectorAll(".qd-view-btn"));
    var spines = [].slice.call(doc.querySelectorAll(".shelf-mini .spine"));
    var TOTAL = +root.getAttribute("data-total");
    var shelfBase = shelfLink.href.split("#")[0];
    var LIST_PAGE = 12;
    var items = [].slice.call(listEl.children).map(function (li, i) {
      var t = li.querySelector(".qd-list-text").textContent;
      return {
        li: li, order: i, id: li.getAttribute("data-id"), hash: li.id,
        quote: t.replace(/^\u201C|\u201D$/g, ""), origin: li.getAttribute("data-origin"),
        date: li.getAttribute("data-date"), tags: (li.getAttribute("data-tags") || "").split(" ").filter(Boolean),
        fav: li.hasAttribute("data-fav"), book: li.getAttribute("data-book"),
        hay: (t + " " + li.getAttribute("data-origin") + " " + li.getAttribute("data-tags")).toLowerCase()
      };
    });
    var state = { term: "", topic: "", source: "", view: "card", order: items.slice(), shuffled: false, deck: [], pos: 0, listLimit: LIST_PAGE };

    root.classList.add("is-enhanced");
    listEl.hidden = true;

    var matches = function (q) {
      if (state.topic === "favorite" && !q.fav) return false;
      if (state.topic && state.topic !== "favorite" && q.tags.indexOf(state.topic) === -1) return false;
      if (state.source && q.origin !== state.source) return false;
      if (state.term && q.hay.indexOf(state.term) === -1) return false;
      return true;
    };
    var filtered = function () { return !!(state.term || state.topic || state.source); };

    var paint = function (q) {
      card.setAttribute("data-id", q.id);
      textEl.textContent = "\u201C" + q.quote + "\u201D";
      textEl.scrollTop = 0;
      originEl.textContent = "\u2014 " + q.origin;
      dateEl.textContent = (q.fav ? "\u2605 " : "") + (q.date || "");
      if (q.book) { shelfLink.hidden = false; shelfLink.href = shelfBase + "#book-" + q.book; }
      else shelfLink.hidden = true;
      countEl.textContent = (state.pos + 1) + " / " + state.deck.length;
    };
    var announce = function (q) {
      live.textContent = "Quote " + (state.pos + 1) + " of " + state.deck.length + ": " + q.quote + " \u2014 " + q.origin;
    };
    var setHash = function (q) {
      try { history.replaceState(null, "", "#" + q.hash); } catch (e) {}
    };
    var busy = false;
    // dir: 1 next, -1 prev, 0 jump (fade only)
    var show = function (pos, dir, opts) {
      opts = opts || {};
      if (!state.deck.length) return;
      state.pos = (pos + state.deck.length) % state.deck.length;
      var q = state.deck[state.pos];
      var done = function () {
        if (opts.announce !== false) announce(q);
        if (opts.hash !== false) setHash(q);
      };
      if (reduce || opts.instant) { paint(q); done(); return; }
      if (busy) { paint(q); done(); return; }
      busy = true;
      card.style.setProperty("--dx", (dir || 0) * -28 + "px");
      card.classList.add("is-out");
      setTimeout(function () {
        paint(q);
        card.style.setProperty("--dx", (dir || 0) * 28 + "px");
        card.classList.remove("is-out"); card.classList.add("is-in");
        void card.offsetWidth; // restart transition from the entry side
        card.classList.remove("is-in");
        busy = false; done();
      }, 170);
    };

    var renderList = function () {
      var shown = 0;
      items.forEach(function (q) { q.li.hidden = true; });
      state.deck.forEach(function (q, i) {
        if (i < state.listLimit) { q.li.hidden = false; shown++; listEl.appendChild(q.li); }
      });
      moreEl.hidden = state.view !== "list" || state.deck.length <= state.listLimit;
    };

    var rebuild = function (keepId) {
      state.deck = state.order.filter(matches);
      var n = state.deck.length;
      var msg;
      if (!filtered()) msg = "All " + TOTAL + " quotes" + (state.shuffled ? ", shuffled." : ", newest first.");
      else msg = n + (n === 1 ? " quote matches" : " quotes match") + (state.term ? " \u201C" + searchEl.value.trim() + "\u201D" : "") + ".";
      status.textContent = msg;
      emptyEl.hidden = n !== 0;
      stage.hidden = n === 0 || state.view !== "card";
      listEl.hidden = n === 0 || state.view !== "list";
      state.listLimit = LIST_PAGE;
      if (!n) { moreEl.hidden = true; return; }
      var idx = 0;
      if (keepId) { for (var i = 0; i < n; i++) if (state.deck[i].id === keepId) { idx = i; break; } }
      state.pos = idx;
      paint(state.deck[idx]);
      if (state.view === "list") renderList();
    };

    // --- controls
    var t;
    searchEl.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () { state.term = searchEl.value.trim().toLowerCase(); rebuild(); }, 180);
    });
    sourceEl.addEventListener("change", function () { state.source = sourceEl.value; syncSpines(); rebuild(); });
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        state.topic = c.getAttribute("data-topic");
        chips.forEach(function (o) { o.setAttribute("aria-pressed", String(o === c)); });
        rebuild();
      });
    });
    var syncSpines = function () {
      spines.forEach(function (sp) { sp.setAttribute("aria-pressed", String(!!state.source && sp.getAttribute("data-origin") === state.source)); });
    };
    spines.forEach(function (sp) {
      sp.addEventListener("click", function () {
        var o = sp.getAttribute("data-origin");
        state.source = state.source === o ? "" : o;
        sourceEl.value = state.source;
        syncSpines(); rebuild();
        if (state.view === "card") show(0, 0, { instant: true });
        root.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      });
    });
    var clearAll = function () {
      state.term = ""; state.topic = ""; state.source = "";
      searchEl.value = ""; sourceEl.value = "";
      chips.forEach(function (o, i) { o.setAttribute("aria-pressed", String(i === 0)); });
      syncSpines();
    };
    root.querySelector(".qd-clear").addEventListener("click", function () { clearAll(); rebuild(); });
    var setView = function (v) {
      state.view = v;
      viewBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-view") === v)); });
      root.classList.toggle("is-list", v === "list");
      rebuild(state.deck[state.pos] && state.deck[state.pos].id);
    };
    viewBtns.forEach(function (b) { b.addEventListener("click", function () { setView(b.getAttribute("data-view")); }); });
    moreEl.querySelector("button").addEventListener("click", function () { state.listLimit += LIST_PAGE; renderList(); });

    $("qd-prev").addEventListener("click", function () { show(state.pos - 1, -1); });
    $("qd-next").addEventListener("click", function () { show(state.pos + 1, 1); });
    $("qd-shuffle").addEventListener("click", function () {
      var a = items.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; }
      state.order = a; state.shuffled = true;
      var cur = state.deck[state.pos] && state.deck[state.pos].id;
      rebuild();
      // never land on the same quote twice in a row
      if (state.deck.length > 1 && state.deck[0].id === cur) state.deck.push(state.deck.shift());
      show(0, 1);
    });
    copyBtn.addEventListener("click", function () {
      var q = state.deck[state.pos]; if (!q) return;
      var url = location.href.split("#")[0] + "#" + q.hash;
      var lbl = copyBtn.querySelector(".lbl");
      var ok = function () { lbl.textContent = "Copied"; live.textContent = "Link to this quote copied."; setTimeout(function () { lbl.textContent = "Link"; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok, function () { window.prompt("Copy this link:", url); });
      else window.prompt("Copy this link:", url);
    });

    // list item -> open as the card
    listEl.addEventListener("click", function (e) {
      var a = e.target.closest("a"); if (!a) return;
      e.preventDefault();
      var id = a.parentNode.getAttribute("data-id");
      setView("card");
      rebuild(id);
      show(state.pos, 0, { instant: true });
      card.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      textEl.focus({ preventScroll: true });
    });

    // arrow keys anywhere in the deck (not while typing)
    root.addEventListener("keydown", function (e) {
      if (state.view !== "card" || e.altKey || e.ctrlKey || e.metaKey) return;
      var tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "select" || tag === "textarea") return;
      if (e.key === "ArrowLeft") { e.preventDefault(); show(state.pos - 1, -1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); show(state.pos + 1, 1); }
    });

    // swipe (touch / pen); vertical scrolling stays native (touch-action: pan-y)
    var sx = null, sy = 0;
    card.addEventListener("pointerdown", function (e) { if (e.pointerType === "mouse") return; sx = e.clientX; sy = e.clientY; });
    card.addEventListener("pointerup", function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) { if (dx < 0) show(state.pos + 1, 1); else show(state.pos - 1, -1); }
    });
    card.addEventListener("pointercancel", function () { sx = null; });

    // deep links: #q-037 opens that quote on the card
    var fromHash = function (scroll) {
      var h = (location.hash || "").replace(/^#/, "");
      var m = /^q-?q?(\d+)$/i.exec(h);
      if (!m) return false;
      var id = "q" + ("000" + m[1]).slice(-Math.max(3, m[1].length));
      var hit = items.some(function (q) { return q.id === id; });
      if (!hit) return false;
      clearAll(); state.order = items.slice(); state.shuffled = false;
      if (state.view !== "card") setView("card");
      rebuild(id);
      show(state.pos, 0, { instant: true, announce: false, hash: false });
      if (scroll) setTimeout(function () { card.scrollIntoView({ block: "center" }); }, 0);
      return true;
    };
    window.addEventListener("hashchange", function () { fromHash(true); });

    // ?q=term (e.g. from the bookshelf) pre-fills the search
    try {
      var q0 = new URLSearchParams(location.search).get("q");
      if (q0) { searchEl.value = q0; state.term = q0.trim().toLowerCase(); }
    } catch (e) {}
    if (!fromHash(true)) rebuild();
  }

  /* ---------- Quote bank PDF export (jsPDF loaded only when asked) ---------- */
  doc.addEventListener("click", function (e) {
    var btn = e.target.closest('[data-action="quote-export-pdf"], a[href$="#quote-bank-export"]');
    if (!btn) return;
    e.preventDefault();
    var label = btn.textContent;
    btn.textContent = "Preparing PDF…";
    Promise.all([
      loadQuotes(),
      window.jspdf ? Promise.resolve() : loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js")
    ]).then(function (res) {
      var bank = res[0];
      var jsPDF = window.jspdf.jsPDF;
      var pdf = new jsPDF({ unit: "pt", format: "letter" });
      var left = 48, top = 56, lh = 16;
      var h = pdf.internal.pageSize.getHeight(), w = pdf.internal.pageSize.getWidth();
      var y = top;
      var line = function (t) {
        if (y > h - top) { pdf.addPage(); y = top; }
        pdf.text(t, left, y); y += lh;
      };
      pdf.setFont("Times", "Normal"); pdf.setFontSize(14);
      pdf.text("Quote Bank Export", left, y); y += 2 * lh;
      pdf.setFontSize(11);
      bank.forEach(function (q, i) {
        if (i > 0) y += lh;
        pdf.splitTextToSize("\u201C" + q.quote + "\u201D", w - 2 * left).forEach(line);
        ["\u2014 " + q.origin, q.date || "", q.tags && q.tags.length ? "Tags: " + q.tags.join(", ") : "", q.favorite ? "\u2605 Favorite" : ""]
          .forEach(function (t) { if (t) line(t); });
      });
      pdf.save("quote-bank.pdf");
      btn.textContent = label;
    }).catch(function () { btn.textContent = label; });
  });
})();
