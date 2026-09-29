/* ZT site — shared progressive enhancements (no dependencies).
   Everything here is optional: pages work without JavaScript. */
(function () {
  "use strict";
  var doc = document;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select, textarea, video[controls], [tabindex]:not([tabindex="-1"])';

  /* ---------- Mobile navigation ---------- */
  var toggle = doc.querySelector(".nav-toggle");
  var menu = doc.getElementById("nav-menu");
  if (toggle && menu) {
    var mq = window.matchMedia("(max-width: 840px)");
    var setOpen = function (open, returnFocus) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".nav-toggle-label").textContent = open ? "Close" : "Menu";
      menu.classList.toggle("is-open", open);
      doc.body.classList.toggle("menu-open", open);
      if (open) {
        var first = menu.querySelector("a");
        if (first) first.focus();
      } else if (returnFocus) {
        toggle.focus();
      }
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    doc.addEventListener("keydown", function (e) {
      if (!menu.classList.contains("is-open")) return;
      if (e.key === "Escape") { setOpen(false, true); return; }
      if (e.key === "Tab") {
        // keep focus within toggle + menu while the full-screen menu is open
        var items = [toggle].concat([].slice.call(menu.querySelectorAll("a")));
        var i = items.indexOf(doc.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
        else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    });
    mq.addEventListener("change", function () { if (!mq.matches) setOpen(false); });
  }

  /* ---------- Native <dialog> modals ---------- */
  var openers = [];
  function hydrate(dialog) {
    var tpl = dialog.querySelector(":scope > template");
    if (tpl) {
      dialog.appendChild(tpl.content.cloneNode(true));
      tpl.remove();
      dialog.querySelectorAll("[data-gallery]").forEach(initGallery);
    }
  }
  function openDialog(dialog, opener) {
    if (!dialog || typeof dialog.showModal !== "function") return false;
    hydrate(dialog);
    openers.push(opener || doc.activeElement);
    dialog.showModal();
    var close = dialog.querySelector("[data-close]");
    if (close) close.focus();
    var track = dialog.querySelector(".gallery-track");
    if (track) { track.scrollLeft = 0; }
    return true;
  }
  doc.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-dialog]");
    if (trigger) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // let "open in new tab" work
      if (openDialog(doc.getElementById(trigger.getAttribute("data-dialog")), trigger)) e.preventDefault();
      return;
    }
    var closeBtn = e.target.closest("[data-close]");
    if (closeBtn) { closeBtn.closest("dialog").close(); return; }
    // click on the backdrop (outside the dialog box) closes it
    if (e.target.tagName === "DIALOG" && e.target.open) {
      var r = e.target.getBoundingClientRect();
      var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside || e.clientX === 0) e.target.close();
    }
  });
  doc.querySelectorAll("dialog.modal").forEach(function (dialog) {
    dialog.addEventListener("close", function () {
      dialog.querySelectorAll("video").forEach(function (v) { v.pause(); });
      var opener = openers.pop();
      if (opener && doc.contains(opener)) opener.focus();
    });
    // explicit focus trap (native modal already makes the page inert;
    // this also keeps Tab from escaping into browser chrome)
    dialog.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var f = [].slice.call(dialog.querySelectorAll(FOCUSABLE)).filter(function (el) { return el.offsetParent !== null || el === doc.activeElement; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  });
  // Deep link: /academic.html#dlg-surfboard opens that project's quick view
  if (location.hash.indexOf("#dlg-") === 0) {
    var d = doc.getElementById(location.hash.slice(1));
    if (d && d.tagName === "DIALOG") openDialog(d, null);
  }

  /* ---------- Galleries (modal + inline) ---------- */
  function initGallery(root) {
    if (root.__init) return; root.__init = true;
    var track = root.querySelector(".gallery-track");
    if (!track) return;
    var items = track.children;
    var current = root.querySelector("[data-current]");
    var dots = root.querySelectorAll(".gallery-dot");
    var index = function () { return Math.round(track.scrollLeft / Math.max(track.clientWidth, 1)); };
    var go = function (i) {
      i = Math.max(0, Math.min(items.length - 1, i));
      track.scrollTo({ left: i * track.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
    };
    var sync = function () {
      var i = index();
      if (current) current.textContent = String(i + 1);
      dots.forEach(function (d, j) { d.setAttribute("aria-current", j === i ? "true" : "false"); });
    };
    track.addEventListener("scroll", function () { window.requestAnimationFrame(sync); }, { passive: true });
    root.addEventListener("click", function (e) {
      if (e.target.closest("[data-prev]")) go(index() - 1);
      else if (e.target.closest("[data-next]")) go(index() + 1);
      else { var dot = e.target.closest(".gallery-dot"); if (dot) go(Number(dot.getAttribute("data-index"))); }
    });
    (root.closest("dialog") || root).addEventListener("keydown", function (e) {
      if (e.target.closest("input, textarea, video")) return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(index() + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(index() - 1); }
    });
  }
  doc.querySelectorAll(".gallery-inline [data-gallery]").forEach(initGallery);

  /* ---------- Before / after slider ---------- */
  doc.querySelectorAll("[data-compare]").forEach(function (fig) {
    var frame = fig.querySelector(".compare-frame");
    var range = fig.querySelector(".compare-range");
    var set = function () { frame.style.setProperty("--pos", range.value + "%"); };
    range.addEventListener("input", set);
    set();
    var img = fig.querySelector(".before img");
    var ratio = function () { if (img && img.naturalWidth) frame.style.setProperty("--ratio", img.naturalWidth + " / " + img.naturalHeight); };
    if (img) { if (img.complete) ratio(); else img.addEventListener("load", ratio); }
  });

  /* ---------- Timeline thread filter ---------- */
  var filter = doc.querySelector("[data-thread-filter]");
  if (filter) {
    filter.hidden = false;
    filter.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-thread]");
      if (!b) return;
      var t = b.getAttribute("data-thread");
      filter.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      doc.querySelectorAll(".timeline .t-item").forEach(function (li) {
        li.hidden = t !== "all" && li.getAttribute("data-thread") !== t;
      });
    });
  }

  /* ---------- Forms: work with a service when configured, email fallback otherwise ---------- */
  doc.querySelectorAll("form[data-fallback-email]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (e) {
      var configured = form.getAttribute("data-configured") === "true";
      var data = new FormData(form);
      if (data.get("_gotcha")) { e.preventDefault(); return; } // honeypot
      if (!configured) {
        e.preventDefault();
        var subject = form.getAttribute("data-subject") || "Hello from your website";
        var lines = [];
        data.forEach(function (v, k) { if (k.charAt(0) !== "_" && v) lines.push(k.charAt(0).toUpperCase() + k.slice(1) + ": " + v); });
        window.location.href = "mailto:" + form.getAttribute("data-fallback-email") +
          "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n\n"));
        if (status) status.textContent = "Opening your email app…";
        return;
      }
      if (form.getAttribute("data-ajax") === "true" && window.fetch) {
        e.preventDefault();
        if (status) status.textContent = "Sending…";
        fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(function (r) {
            if (!r.ok) throw new Error(String(r.status));
            form.reset();
            if (status) status.textContent = form.getAttribute("data-success") || "Thanks — sent.";
          })
          .catch(function () {
            if (status) status.textContent = "Something went wrong. Please email " + form.getAttribute("data-fallback-email") + ".";
          });
      }
    });
  });
})();
