/*
  QUOTE ENGINE
  ------------
  Home: the flashcard is rendered at build time with one quote; Shuffle and
  the Favorites switch load quotes-data.js on demand.
  Life & Interests: the full quote log is rendered at build time; this adds
  search, the favorites filter, "show more", and the PDF export.
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

  /* ---------- Life & Interests quote log ---------- */
  var list = doc.getElementById("quote-log-list");
  if (list) {
    var search = doc.getElementById("quote-log-search");
    var favOnly = doc.getElementById("quote-log-fav-toggle");
    var count = doc.getElementById("quote-log-count");
    var more = doc.getElementById("quote-log-more");
    var none = doc.getElementById("quote-log-empty");
    var items = [].slice.call(list.children);
    var PAGE = 24, limit = PAGE;

    var render = function () {
      var term = (search && search.value || "").trim().toLowerCase();
      var onlyFav = favOnly && favOnly.checked;
      var shown = 0, matched = 0;
      items.forEach(function (li) {
        var ok = (!onlyFav || li.hasAttribute("data-fav")) &&
          (!term || li.textContent.toLowerCase().indexOf(term) !== -1);
        if (ok) matched++;
        var visible = ok && (term || onlyFav || matched <= limit);
        li.hidden = !visible;
        if (visible) shown++;
      });
      if (count) count.textContent = matched + (matched === 1 ? " quote" : " quotes");
      if (more) more.hidden = !!(term || onlyFav) || matched <= limit;
      if (none) none.hidden = matched !== 0;
    };
    if (search) search.addEventListener("input", render);
    if (favOnly) favOnly.addEventListener("change", render);
    if (more) more.querySelector("button").addEventListener("click", function () { limit += PAGE * 2; render(); });
    render();
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
