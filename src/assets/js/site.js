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
    var mq = window.matchMedia("(max-width: 840px), (max-height: 500px) and (pointer: coarse)");
    var setOpen = function (open, returnFocus) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".nav-toggle-label").textContent = open ? "Close" : "Menu";
      menu.classList.toggle("is-open", open);
      // lock page scroll (class on <html> so iOS Safari honours overflow:hidden)
      doc.documentElement.classList.toggle("menu-open", open);
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
    // Tap/click anywhere outside the panel (scrim, header, page) closes it;
    // the Menu button and theme toggle keep their own behaviour. Handlers are
    // bound on the scrim and header themselves as well as the document, because
    // iOS Safari doesn't fire click for taps on non-interactive elements unless
    // the element (or an ancestor below <body>) has a click listener.
    var outside = function (e) {
      if (!menu.classList.contains("is-open")) return;
      var t = e.target;
      if (menu.contains(t) || toggle.contains(t) || (t.closest && t.closest(".theme-toggle"))) return;
      setOpen(false);
    };
    var scrim = doc.querySelector(".nav-scrim");
    if (scrim) scrim.addEventListener("click", outside);
    var header = doc.querySelector(".site-nav");
    if (header) header.addEventListener("click", outside);
    doc.addEventListener("click", outside);
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
    // Older iOS ignores overflow:hidden for touch scrolling: block touch-scrolls
    // that start outside the menu panel while it is open.
    doc.addEventListener("touchmove", function (e) {
      if (menu.classList.contains("is-open") && !menu.contains(e.target)) e.preventDefault();
    }, { passive: false });
  }

  /* ---------- Home: release the load-time content-visibility (see site.css) ---------- */
  // One section per idle slot keeps each layout small; an in-page # link, a hash change or
  // printing releases everything at once so anchors land exactly where they should.
  if (doc.documentElement.classList.contains("cv")) {
    var cvSecs = [].slice.call(doc.querySelectorAll("main > .hero ~ section"));
    var cvAll = function () {
      if (!doc.documentElement.classList.contains("cv")) return;
      doc.documentElement.classList.remove("cv");
      doc.removeEventListener("click", cvClick, true);
    };
    var cvClick = function (e) {
      var a = e.target.closest && e.target.closest("a[href*='#']");
      if (a && a.pathname === location.pathname) cvAll();
    };
    doc.addEventListener("click", cvClick, true);
    window.addEventListener("hashchange", cvAll);
    window.addEventListener("beforeprint", cvAll);
    if (!cvSecs.length) cvAll();
    else {
      var idle = window.requestIdleCallback ? function (f) { requestIdleCallback(f, { timeout: 2000 }); } : function (f) { setTimeout(f, 120); };
      var cvNext = function () {
        var sec = cvSecs.shift();
        if (!sec || !doc.documentElement.classList.contains("cv")) return cvAll();
        sec.classList.add("cv-done");
        if (cvSecs.length) idle(cvNext); else idle(cvAll);
      };
      var cvStart = function () { idle(cvNext); };
      if (doc.readyState === "complete") cvStart(); else window.addEventListener("load", cvStart, { once: true });
    }
  }

  /* ---------- Back to top ---------- */
  // Shown only once the reader has scrolled past the first full viewport.
  var toTop = doc.querySelector(".to-top");
  if (toTop) {
    toTop.hidden = false;
    var ticking = false;
    var update = function () {
      ticking = false;
      var show = (window.scrollY || doc.documentElement.scrollTop) > window.innerHeight;
      toTop.classList.toggle("is-visible", show);
    };
    var onScroll = function () { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    // first check on the next frame: reading scrollY now would force a full-page
    // layout inside this script, before the browser's own first layout (a long task).
    onScroll();
    toTop.addEventListener("click", function () {
      // "auto" follows CSS, which is scroll-behavior:auto (instant) under reduced motion
      window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? "auto" : "smooth" });
      // hand focus back to the top of the document (skip link) without a second jump
      var target = doc.querySelector(".skip-link") || doc.getElementById("main");
      if (target) target.focus({ preventScroll: true });
    });
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

  /* ---------- Forms: work with a service when configured, email fallback otherwise ----------
     Configured (site.config.js): POST in place (Web3Forms / Formspree / newsletter).
     Not configured, or the service fails: open the visitor's email app, message pre-filled,
     so nothing they typed is lost. Honeypot fields (_gotcha, botcheck) drop bot submissions. */
  doc.querySelectorAll("form[data-fallback-email]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var btn = form.querySelector('[type="submit"]');
    // hCaptcha (contact form + Web3Forms): loaded only when the form nears the viewport
    // or gets focus, so it costs nothing on page load. Light/dark follows the site theme.
    var cap = form.querySelector(".captcha-slot"), capId = null, capState = "";
    var capTheme = function () { return doc.documentElement.dataset.theme === "dark" ? "dark" : "light"; };
    var capRender = function () {
      if (!window.hcaptcha || !cap) return;
      if (capId !== null) { try { window.hcaptcha.remove(capId); } catch (e) {} }
      cap.textContent = "";
      capId = window.hcaptcha.render(cap.appendChild(doc.createElement("div")), {
        sitekey: cap.getAttribute("data-sitekey"), theme: capTheme(),
        size: cap.classList.contains("is-compact") ? "compact" : "normal"
      });
      cap.setAttribute("data-theme", capTheme());
    };
    var capLoad = function () {
      if (!cap || capState) return;
      capState = "loading";
      cap.classList.toggle("is-compact", cap.clientWidth < 304); // reserve the widget's height now
      window.ztCaptchaReady = function () { capState = "ready"; capRender(); };
      var s = doc.createElement("script");
      s.src = "https://js.hcaptcha.com/1/api.js?render=explicit&onload=ztCaptchaReady&recaptchacompat=off";
      s.async = true;
      s.onerror = function () { capState = "failed"; };
      doc.head.appendChild(s);
    };
    if (cap) {
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (en) { if (en.some(function (x) { return x.isIntersecting; })) { io.disconnect(); capLoad(); } }, { rootMargin: "300px 0px" });
        io.observe(form);
      }
      form.addEventListener("focusin", capLoad);
      // re-draw in the new theme if it hasn't been ticked yet
      new MutationObserver(function () {
        if (capState === "ready" && cap.getAttribute("data-theme") !== capTheme() && !(window.hcaptcha.getResponse(capId))) capRender();
      }).observe(doc.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    }
    var mailto = function (data) {
      var subject = form.getAttribute("data-subject") || "Hello from your website";
      var lines = [];
      var skip = ["botcheck", "access_key", "subject", "from_name", "h-captcha-response", "g-recaptcha-response"];
      data.forEach(function (v, k) { if (k.charAt(0) !== "_" && skip.indexOf(k) === -1 && v) lines.push(k.charAt(0).toUpperCase() + k.slice(1) + ": " + v); });
      return "mailto:" + form.getAttribute("data-fallback-email") +
        "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n\n"));
    };
    var say = function (text, link) {
      if (!status) return;
      status.textContent = text;
      if (link) {
        var a = doc.createElement("a");
        a.href = link; a.textContent = "Send it by email instead";
        status.appendChild(doc.createTextNode(" ")); status.appendChild(a);
      }
    };
    form.addEventListener("submit", function (e) {
      var configured = form.getAttribute("data-configured") === "true";
      var data = new FormData(form);
      if (data.get("_gotcha") || data.get("botcheck")) { e.preventDefault(); return; } // honeypot: drop silently
      if (!configured) {
        e.preventDefault();
        window.location.href = mailto(data);
        say("Opening your email app…");
        return;
      }
      if (cap && !data.get("h-captcha-response")) {
        e.preventDefault();
        capLoad();
        if (capState === "failed") say("The spam check didn't load.", mailto(data));
        else say("Please tick \u201CI am human\u201D above, then send.");
        return;
      }
      if (form.getAttribute("data-ajax") === "true" && window.fetch) {
        e.preventDefault();
        say("Sending…");
        if (btn) btn.disabled = true;
        data.delete("_gotcha"); data.delete("botcheck");
        fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(function (r) {
            return r.json().catch(function () { return {}; }).then(function (j) {
              if (!r.ok || j.success === false) throw new Error(j.message || String(r.status));
            });
          })
          .then(function () {
            form.reset();
            say(form.getAttribute("data-success") || "Thanks — sent.");
          })
          .catch(function () {
            say("Sorry, that didn't go through.", mailto(data));
          })
          .then(function () {
            if (btn) btn.disabled = false;
            if (cap && window.hcaptcha && capId !== null) { try { window.hcaptcha.reset(capId); } catch (e) {} } // tokens are single-use
          });
      }
    });
  });

  /* ---------- Theme (light / dark "night sheet") ----------
     The <head> script already applied the saved or system theme; this wires
     the toggle, saves an explicit choice, and follows the system until then. */
  var themeBtn = doc.querySelector(".theme-toggle");
  if (themeBtn) {
    var root = doc.documentElement;
    var themeMeta = doc.querySelector('meta[name="theme-color"]');
    var sysDark = window.matchMedia("(prefers-color-scheme: dark)");
    var saved = function () { try { return localStorage.getItem("zt-theme"); } catch (e) { return null; } };
    var apply = function (t) {
      root.dataset.theme = t;
      themeBtn.setAttribute("aria-pressed", String(t === "dark"));
      if (themeMeta) themeMeta.content = t === "dark" ? "#0d1823" : "#f3f0e8";
    };
    apply(root.dataset.theme === "dark" ? "dark" : "light");
    themeBtn.hidden = false;
    themeBtn.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem("zt-theme", next); } catch (e) {}
      if (doc.startViewTransition && !reduceMotion) doc.startViewTransition(function () { apply(next); });
      else apply(next);
    });
    var onSys = function (e) { if (!saved()) apply(e.matches ? "dark" : "light"); };
    if (sysDark.addEventListener) sysDark.addEventListener("change", onSys);
  }

  /* ---------- Revision clouds (decorative, drawn to fit their box) ---------- */
  var clouds = doc.querySelectorAll("svg.rev-cloud");
  if (clouds.length) {
    var drawCloud = function (svg) {
      var w = svg.clientWidth, h = svg.clientHeight;
      if (!w || !h) return;
      var inset = 8, r = Math.min(46, h / 4), step = 26;
      var x0 = inset, y0 = inset, x1 = w - inset, y1 = h - inset;
      // sample a rounded rectangle clockwise, then bulge an arc between samples
      var pts = [], seg = function (ax, ay, bx, by) { var len = Math.hypot(bx - ax, by - ay), n = Math.max(1, Math.round(len / step)); for (var i = 0; i < n; i++) pts.push([ax + (bx - ax) * i / n, ay + (by - ay) * i / n]); };
      var corner = function (cx, cy, a0) { for (var i = 0; i < 3; i++) { var a = a0 + (i / 3) * Math.PI / 2; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } };
      seg(x0 + r, y0, x1 - r, y0); corner(x1 - r, y0 + r, -Math.PI / 2);
      seg(x1, y0 + r, x1, y1 - r); corner(x1 - r, y1 - r, 0);
      seg(x1 - r, y1, x0 + r, y1); corner(x0 + r, y1 - r, Math.PI / 2);
      seg(x0, y1 - r, x0, y0 + r); corner(x0 + r, y0 + r, Math.PI);
      var d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
      for (var i = 1; i <= pts.length; i++) {
        var a = pts[i - 1], b = pts[i % pts.length], rr = Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.62;
        d += "A" + rr.toFixed(1) + " " + rr.toFixed(1) + " 0 0 1 " + b[0].toFixed(1) + " " + b[1].toFixed(1);
      }
      svg.setAttribute("viewBox", "0 0 " + w + " " + h);
      svg.innerHTML = '<path d="' + d + 'Z"/>';
    };
    clouds.forEach(function (svg) {
      // ResizeObserver's first callback runs after layout, so no forced reflow here
      if (window.ResizeObserver) new ResizeObserver(function () { drawCloud(svg); }).observe(svg);
      else drawCloud(svg);
    });
  }

  /* ---------- Story index: type filter, open linked entries ---------- */
  doc.querySelectorAll("[data-story-index]").forEach(function (idx) {
    var bar = idx.querySelector("[data-si-filters]");
    var rows = [].slice.call(idx.querySelectorAll(".si-row"));
    if (bar) {
      var status = bar.querySelector("[data-si-status]");
      var state = { thread: "all" };
      var apply = function () {
        var shown = 0;
        rows.forEach(function (r) {
          var ok = state.thread === "all" || r.getAttribute("data-thread") === state.thread;
          r.hidden = !ok; if (ok) shown++;
        });
        idx.querySelectorAll(".si-year").forEach(function (y) { y.hidden = !y.querySelector(".si-row:not([hidden])"); });
        status.textContent = "Showing " + shown + " of " + rows.length + " milestones.";
      };
      bar.hidden = false;
      bar.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-f]");
        if (!b) return;
        var f = b.getAttribute("data-f");
        state[f] = b.getAttribute("data-v");
        bar.querySelectorAll('[data-f="' + f + '"]').forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        apply();
      });
      apply();
    }
  });
  var openTarget = function () {
    var id = decodeURIComponent(location.hash.slice(1));
    var el = id && doc.getElementById(id);
    if (el && el.classList.contains("si-row")) {
      el.hidden = false;
      var d = el.querySelector("details"); if (d) d.open = true;
    }
  };
  openTarget();
  window.addEventListener("hashchange", openTarget);
})();
