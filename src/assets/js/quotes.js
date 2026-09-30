/*
  QUOTE DECK
  ----------
  One flashcard component (QuoteDeck) drives both the home page card and the
  Life & Interests deck: prev/next, swipe, arrow keys, Shuffle, "n / total",
  copy link, a slide transition (instant under reduced motion) and a polite
  live region that announces each quote. Markup: _includes/quote-card.njk.

  Home (#home-deck): the card is rendered at build time; quotes-data.js loads
  when the browser is idle (or on the first button press).
  Life & Interests (#quote-deck): every quote is rendered at build time in
  #qd-list (list view + no-JS fallback); search, topic chips, the source
  filter, the spine strip and #q-037 deep links narrow or jump the deck.
  Downloads of the full bank are static files built by scripts/quote-downloads.mjs.
*/
(function () {
  "use strict";
  var doc = document;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var script = doc.currentScript;
  var base = script ? script.src.replace(/quotes\.js(\?.*)?$/, "") : "assets/js/";
  var dataPromise = null;
  // ids are "q001"...; a bare number means the same (entry 262 is `id: "262"`)
  var normId = function (id) { id = String(id); return /^\d+$/.test(id) ? "q" + ("00" + id).slice(-Math.max(3, id.length)) : id; };
  var hashOf = function (id) { return "q-" + String(id).replace(/^q/i, ""); };
  function loadQuotes() {
    /* global quoteBank */
    if (typeof quoteBank !== "undefined") return Promise.resolve(quoteBank);
    if (!dataPromise) {
      dataPromise = new Promise(function (resolve, reject) {
        var s = doc.createElement("script");
        s.src = base + "quotes-data.js";
        s.onload = function () { resolve(typeof quoteBank !== "undefined" ? quoteBank : []); };
        s.onerror = reject;
        doc.head.appendChild(s);
      });
    }
    return dataPromise;
  }

  /* ---------- the shared flashcard ---------- */
  // opts: { items, deckUrl (page that owns #q- links), setHash, openLink, ready (Promise) }
  function QuoteDeck(root, opts) {
    var q$ = function (sel) { return root.querySelector(sel); };
    var card = q$(".qd-card"), textEl = q$(".qd-text"), srcEl = q$(".qd-source"), dateEl = q$(".qd-date"),
        countEl = q$(".qd-count"), shelfLink = q$(".qd-shelf-link"), copyBtn = q$(".qd-copy"),
        live = root.querySelector(".qd-live") || root.parentNode.querySelector(".qd-live");
    var shelfBase = shelfLink.href.split("#")[0];
    var self = { deck: [], pos: 0 };
    var ready = opts.ready || Promise.resolve();
    var textScrolled = false;
    textEl.addEventListener("scroll", function () { textScrolled = textEl.scrollTop > 0; }, { passive: true });

    var paint = function (q) {
      card.setAttribute("data-id", q.id);
      textEl.textContent = "\u201C" + q.quote + "\u201D";
      if (textScrolled) { textEl.scrollTop = 0; textScrolled = false; } // a write forces layout: only when needed
      srcEl.textContent = "\u2014 " + q.origin;
      dateEl.textContent = (q.fav ? "\u2605 " : "") + (q.date || "");
      if (q.book) { shelfLink.hidden = false; shelfLink.href = shelfBase + "#book-" + q.book; } else shelfLink.hidden = true;
      countEl.textContent = (self.pos + 1) + " / " + self.deck.length;
      if (opts.openLink) opts.openLink.href = opts.openLink.href.split("#")[0] + "#" + q.hash;
    };
    // One slide at a time. A press during the slide only moves `pos`; the pending
    // slide then paints whatever is current, so the card never shows a stale quote.
    var timer = null, pending = {};
    var done = function (o) {
      var q = self.deck[self.pos]; if (!q) return;
      if (o.announce !== false) live.textContent = (o.prefix || "") + "Quote " + (self.pos + 1) + " of " + self.deck.length + ": " + q.quote + " \u2014 " + q.origin;
      if (opts.setHash && o.hash !== false) { try { history.replaceState(null, "", "#" + q.hash); } catch (e) {} }
    };
    // dir: 1 next, -1 previous, 0 jump; o: { instant, announce, hash, prefix, shuffle }
    self.show = function (pos, dir, o) {
      o = o || {};
      if (!self.deck.length) return;
      self.pos = (pos + self.deck.length) % self.deck.length;
      if (reduce || o.instant) {
        if (timer) { clearTimeout(timer); timer = null; card.classList.remove("is-out", "is-shuffling"); }
        paint(self.deck[self.pos]); done(o); return;
      }
      pending = o;
      if (timer) return;
      card.classList.toggle("is-shuffling", !!o.shuffle);
      card.style.setProperty("--dx", (dir || 0) * -28 + "px");
      card.classList.add("is-out");
      timer = setTimeout(function () {
        timer = null;
        paint(self.deck[self.pos]);
        card.style.setProperty("--dx", (dir || 0) * 28 + "px");
        card.classList.remove("is-out"); card.classList.add("is-in");
        void card.offsetWidth; // restart the transition from the entry side
        card.classList.remove("is-in", "is-shuffling");
        done(pending);
      }, 170);
    };
    // replace the deck; keep showing keepId if it's still in it
    self.setDeck = function (list, keepId, silent) {
      self.deck = list;
      var idx = 0;
      if (keepId) for (var i = 0; i < list.length; i++) if (list[i].id === keepId) { idx = i; break; }
      self.pos = idx;
      // skip the repaint when the card already shows exactly this (e.g. the home card's
      // build-time quote once the full bank arrives): no DOM writes, no layout
      var same = list.length && card.getAttribute("data-id") === list[idx].id &&
        countEl.textContent === (idx + 1) + " / " + list.length;
      if (list.length && !silent && !timer && !same) paint(list[idx]);
    };
    self.current = function () { return self.deck[self.pos]; };
    // Shuffle = pull a random quote from the deck (on Life & Interests: the current
    // filtered set), never the one on screen. A no-repeat bag: every quote comes up
    // once before any repeats, then the bag refills. Order is untouched, so Prev/Next
    // carry on from where it landed and the counter shows its real position.
    var bag = [], bagKey = "";
    self.shuffle = function () {
      var n = self.deck.length; if (n < 2) return;
      var key = self.deck.map(function (q) { return q.id; }).join();
      if (key !== bagKey) { bagKey = key; bag = []; }
      var pick = -1;
      while (pick < 0) {
        if (!bag.length) for (var i = 0; i < n; i++) if (i !== self.pos) bag.push(i);
        var k = Math.floor(Math.random() * bag.length), idx = bag[k];
        bag[k] = bag[bag.length - 1]; bag.pop();
        if (idx !== self.pos) pick = idx;
      }
      self.show(pick, 0, { shuffle: true, prefix: "Random quote. " });
    };
    var act = function (fn) { return function () { ready.then(fn); }; };
    q$(".qd-prev").addEventListener("click", act(function () { self.show(self.pos - 1, -1); }));
    q$(".qd-next").addEventListener("click", act(function () { self.show(self.pos + 1, 1); }));
    q$(".qd-shuffle").addEventListener("click", act(function () { self.shuffle(); }));
    copyBtn.addEventListener("click", act(function () {
      var q = self.current(); if (!q) return;
      var url = new URL(opts.deckUrl || location.href.split("#")[0], location.href).href.split("#")[0] + "#" + q.hash;
      var lbl = copyBtn.querySelector(".lbl");
      var ok = function () { lbl.textContent = "Copied"; live.textContent = "Link to this quote copied."; setTimeout(function () { lbl.textContent = "Link"; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok, function () { window.prompt("Copy this link:", url); });
      else window.prompt("Copy this link:", url);
    }));
    // arrow keys anywhere in the deck (not while typing)
    root.addEventListener("keydown", function (e) {
      if (self.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
      var tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "select" || tag === "textarea") return;
      if (e.key === "ArrowLeft") { e.preventDefault(); act(function () { self.show(self.pos - 1, -1); })(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); act(function () { self.show(self.pos + 1, 1); })(); }
    });
    // swipe (touch / pen); vertical scrolling stays native (touch-action: pan-y)
    var sx = null, sy = 0;
    card.addEventListener("pointerdown", function (e) { if (e.pointerType === "mouse") return; sx = e.clientX; sy = e.clientY; });
    card.addEventListener("pointerup", function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) act(function () { if (dx < 0) self.show(self.pos + 1, 1); else self.show(self.pos - 1, -1); })();
    });
    card.addEventListener("pointercancel", function () { sx = null; });
    if (opts.items) self.setDeck(opts.items, card.getAttribute("data-id"));
    return self;
  }

  /* ---------- Home: the same card over the whole bank ---------- */
  var home = doc.getElementById("home-deck");
  if (home) {
    var books = {};
    try { books = JSON.parse(doc.getElementById("qdh-books").textContent); } catch (e) {}
    var homeDeck;
    var homeReady = new Promise(function (resolve) {
      // Any of three triggers may fire (first press, focus, idle); only the first
      // loads the deck (each used to reset it to the start, undoing a Shuffle).
      var started = false;
      var go = function () {
        if (started) return;
        started = true;
        loadQuotes().then(function (all) {
          // newest first, like the full deck; start on the build-time pick
          var items = all.slice().reverse().map(function (q) {
            var id = normId(q.id);
            return { id: id, hash: hashOf(id), quote: q.quote, origin: q.origin, date: q.date, fav: !!q.favorite, book: books[q.origin] ? books[q.origin].id : null };
          });
          homeDeck.setDeck(items, home.getAttribute("data-start"));
          resolve();
        });
      };
      home.addEventListener("pointerdown", go, { once: true });
      home.addEventListener("focusin", go, { once: true });
      if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 4000 }); else setTimeout(go, 2500);
    });
    homeDeck = QuoteDeck(home, { deckUrl: home.getAttribute("data-deck-url"), openLink: doc.getElementById("qdh-open"), ready: homeReady });
  }

  /* ---------- Life & Interests: the full deck ---------- */
  var root = doc.getElementById("quote-deck");
  if (root) {
    var $ = function (id) { return doc.getElementById(id); };
    var stage = $("qd-stage"), status = $("qd-status"), listEl = $("qd-list"), emptyEl = $("qd-empty"),
        moreEl = $("qd-more"), searchEl = $("qd-search"), sourceEl = $("qd-source"),
        dlFiltered = $("qd-dl-filtered"), dlN = $("qd-dl-n");
    var chips = [].slice.call(root.querySelectorAll(".qd-chip"));
    var viewBtns = [].slice.call(root.querySelectorAll(".qd-view-btn"));
    var spines = [].slice.call(doc.querySelectorAll(".shelf-mini .spine"));
    var TOTAL = +root.getAttribute("data-total");
    var LIST_PAGE = 12;
    var items = [].slice.call(listEl.children).map(function (li) {
      var t = li.querySelector(".qd-list-text").textContent;
      return {
        li: li, id: li.getAttribute("data-id"), hash: li.id,
        quote: t.replace(/^\u201C|\u201D$/g, ""), origin: li.getAttribute("data-origin"),
        date: li.getAttribute("data-date"), tags: (li.getAttribute("data-tags") || "").split(" ").filter(Boolean),
        fav: li.hasAttribute("data-fav"), book: li.getAttribute("data-book"),
        hay: (t + " " + li.getAttribute("data-origin") + " " + li.getAttribute("data-tags")).toLowerCase()
      };
    });
    var state = { term: "", topic: "", source: "", view: "card", order: items.slice(), listLimit: LIST_PAGE };
    var deck = QuoteDeck(root, { setHash: true, deckUrl: location.pathname });

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

    var renderList = function () {
      items.forEach(function (q) { q.li.hidden = true; });
      deck.deck.forEach(function (q, i) { if (i < state.listLimit) { q.li.hidden = false; listEl.appendChild(q.li); } });
      moreEl.hidden = state.view !== "list" || deck.deck.length <= state.listLimit;
    };
    var rebuild = function (keepId, silent) {
      var list = state.order.filter(matches), n = list.length;
      status.textContent = !filtered()
        ? "All " + TOTAL + " quotes, newest first."
        : n + (n === 1 ? " quote matches" : " quotes match") + (state.term ? " \u201C" + searchEl.value.trim() + "\u201D" : "") + ".";
      emptyEl.hidden = n !== 0;
      stage.hidden = n === 0 || state.view !== "card";
      deck.hidden = state.view !== "card";
      listEl.hidden = n === 0 || state.view !== "list";
      state.listLimit = LIST_PAGE;
      if (dlFiltered) { dlFiltered.hidden = !filtered() || !n; dlN.textContent = n; }
      deck.setDeck(list, keepId, silent);
      if (!n) { moreEl.hidden = true; return; }
      if (state.view === "list") renderList();
    };

    var t;
    searchEl.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () { state.term = searchEl.value.trim().toLowerCase(); rebuild(); }, 180);
    });
    var syncSpines = function () {
      spines.forEach(function (sp) { sp.setAttribute("aria-pressed", String(!!state.source && sp.getAttribute("data-origin") === state.source)); });
    };
    sourceEl.addEventListener("change", function () { state.source = sourceEl.value; syncSpines(); rebuild(); });
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        state.topic = c.getAttribute("data-topic");
        chips.forEach(function (o) { o.setAttribute("aria-pressed", String(o === c)); });
        rebuild();
      });
    });
    spines.forEach(function (sp) {
      sp.addEventListener("click", function () {
        var o = sp.getAttribute("data-origin");
        state.source = state.source === o ? "" : o;
        sourceEl.value = state.source;
        syncSpines(); rebuild();
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
      rebuild(deck.current() && deck.current().id);
    };
    viewBtns.forEach(function (b) { b.addEventListener("click", function () { setView(b.getAttribute("data-view")); }); });
    moreEl.querySelector("button").addEventListener("click", function () { state.listLimit += LIST_PAGE; renderList(); });

    // list item -> open it on the card
    listEl.addEventListener("click", function (e) {
      var a = e.target.closest("a"); if (!a) return;
      e.preventDefault();
      setView("card");
      rebuild(a.parentNode.getAttribute("data-id"));
      deck.show(deck.pos, 0, { instant: true });
      $("qd-card").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      root.querySelector(".qd-text").focus({ preventScroll: true });
    });

    // download just the filtered quotes (the full bank is a static file)
    root.parentNode.addEventListener("click", function (e) {
      var b = e.target.closest("[data-dl]"); if (!b) return;
      var list = deck.deck, kind = b.getAttribute("data-dl"), body, type;
      if (kind === "csv") {
        var esc = function (v) { v = String(v == null ? "" : v); return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
        body = "\uFEFFid,quote,source,date,tags,favorite\r\n" + list.map(function (q) { return [q.id, q.quote, q.origin, q.date, q.tags.join("; "), q.fav ? "yes" : ""].map(esc).join(","); }).join("\r\n") + "\r\n";
        type = "text/csv";
      } else {
        body = list.map(function (q) { return "\u201C" + q.quote + "\u201D\n  \u2014 " + q.origin + " \u00B7 " + q.id + " \u00B7 " + (q.date || "") + (q.tags.length ? " \u00B7 " + q.tags.join(", ") : "") + (q.fav ? " \u00B7 \u2605" : ""); }).join("\n\n") + "\n";
        type = "text/plain";
      }
      var url = URL.createObjectURL(new Blob([body], { type: type + ";charset=utf-8" }));
      var a = doc.createElement("a");
      a.href = url; a.download = "Zachery-Taylor-quotes-filtered." + kind;
      doc.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    });

    // deep links: #q-037 opens that quote on the card
    var fromHash = function (scroll) {
      var m = /^#?q-?q?(\d+)$/i.exec(location.hash || "");
      if (!m) return false;
      var id = "q" + ("000" + m[1]).slice(-Math.max(3, m[1].length));
      if (!items.some(function (q) { return q.id === id; })) return false;
      clearAll();
      if (state.view !== "card") setView("card");
      rebuild(id);
      deck.show(deck.pos, 0, { instant: true, announce: false, hash: false });
      if (scroll) setTimeout(function () { $("qd-card").scrollIntoView({ block: "center" }); }, 0);
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
})();
