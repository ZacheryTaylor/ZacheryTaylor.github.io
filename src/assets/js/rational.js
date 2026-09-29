/* Rational Method — educational calculator. Q = C·i·A (cfs, in/hr, acres). */
(function () {
  var form = document.getElementById("rational");
  if (!form) return;
  var groups = JSON.parse(document.getElementById("rational-data").textContent);
  var types = {};
  groups.forEach(function (g) { g.items.forEach(function (c) { types[c.id] = c; }); });
  var $ = function (id) { return document.getElementById(id); };
  var rows = $("subarea-rows");
  var AREA = { ac: 1, sf: 1 / 43560, ha: 2.4710538 };  // → acres
  var AREA_LABEL = { ac: "ac", sf: "ft²", ha: "ha" };
  var INT = { inhr: 1, mmhr: 1 / 25.4 };                // → in/hr
  var n = 0;
  var lastUnit = "ac";

  function mid(t) { return Math.round(((t.min + t.max) / 2) * 100) / 100; }
  function fmt(x, d) {
    if (!isFinite(x)) return "—";
    return x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  function sig(x) { return x >= 100 ? fmt(x, 0) : x >= 10 ? fmt(x, 1) : x >= 0.1 || x === 0 ? fmt(x, 2) : String(+x.toPrecision(2)); }
  function num(el) { var v = parseFloat(el.value); return isFinite(v) && v >= 0 ? v : NaN; }

  function options(sel) {
    return groups.map(function (g) {
      return '<optgroup label="' + g.group + '">' + g.items.map(function (c) {
        return '<option value="' + c.id + '"' + (c.id === sel ? " selected" : "") + ">" + c.label + "</option>";
      }).join("") + "</optgroup>";
    }).join("");
  }

  function addRow(type, area) {
    n++;
    var t = types[type];
    var tr = document.createElement("tr");
    tr.innerHTML =
      '<td><label class="visually-hidden" for="st-' + n + '">Surface ' + n + '</label><select id="st-' + n + '" data-k="type">' + options(type) + "</select></td>" +
      '<td><label class="visually-hidden" for="sa-' + n + '">Area of surface ' + n + '</label><input id="sa-' + n + '" data-k="area" type="number" inputmode="decimal" min="0" step="0.01" value="' + area + '"></td>' +
      '<td><label class="visually-hidden" for="sc-' + n + '">C for surface ' + n + '</label><input id="sc-' + n + '" data-k="c" type="number" inputmode="decimal" min="0" max="1" step="0.01" value="' + mid(t).toFixed(2) + '"><span class="range" data-k="range">' + t.min.toFixed(2) + "–" + t.max.toFixed(2) + "</span></td>" +
      '<td><button type="button" class="row-del" aria-label="Remove surface ' + n + '">×</button></td>';
    rows.appendChild(tr);
    sync();
  }

  function mode() { return form.querySelector('input[name="cmode"]:checked').value; }

  function sync() {
    var dels = rows.querySelectorAll(".row-del");
    dels.forEach(function (b) { b.disabled = dels.length < 2; });
    calc();
  }

  function calc() {
    var au = $("a-unit").value, iu = $("i-unit").value;
    var cf = parseFloat($("cf").value) || 1;
    var composite = mode() === "composite";
    var C, Araw, lines = [];

    if (composite) {
      var sumCA = 0, sumA = 0, parts = [];
      rows.querySelectorAll("tr").forEach(function (tr) {
        var a = num(tr.querySelector('[data-k="area"]'));
        var c = Math.min(1, num(tr.querySelector('[data-k="c"]')));
        if (!isFinite(a) || !isFinite(c)) return;
        sumCA += c * a; sumA += a;
        parts.push(fmt(c, 2) + "×" + sig(a));
      });
      C = sumA > 0 ? sumCA / sumA : NaN;
      Araw = sumA;
      $("a-total").value = sumA ? +sumA.toFixed(4) : 0;
      if (parts.length) lines.push("C = (" + parts.join(" + ") + ") / " + sig(sumA) + " = " + fmt(C, 3));
    } else {
      C = Math.min(1, num($("c-direct")));
      Araw = num($("a-total"));
      lines.push("C = " + fmt(C, 2));
    }

    var Cadj = Math.min(1, C * cf);
    if (cf !== 1) lines.push("C·Cf = " + fmt(C, 3) + " × " + cf.toFixed(2) + " = " + fmt(C * cf, 3) + (C * cf > 1 ? " → capped at 1.00" : ""));
    var A = Araw * AREA[au], iRaw = num($("i-val")), i = iRaw * INT[iu];
    if (au !== "ac") lines.push("A = " + sig(Araw) + " " + AREA_LABEL[au] + " = " + sig(A) + " ac");
    if (iu !== "inhr") lines.push("i = " + sig(iRaw) + " mm/hr ÷ 25.4 = " + fmt(i, 2) + " in/hr");
    var Q = Cadj * i * A;
    var ok = isFinite(Q) && A > 0 && i > 0;
    if (ok) lines.push("Q = C·i·A = " + fmt(Cadj, 3) + " × " + fmt(i, 2) + " in/hr × " + sig(A) + " ac = " + sig(Q) + " cfs");
    $("q-cfs").textContent = ok ? sig(Q) : "—";
    $("q-gpm").textContent = ok ? fmt(Q * 448.831, 0) : "—";
    $("q-cms").textContent = ok ? fmt(Q * 0.0283168, 3) : "—";
    $("q-ls").textContent = ok ? fmt(Q * 28.3168, 0) : "—";
    $("work-lines").textContent = ok ? lines.join("\n") : "Enter a positive area and intensity to see the calculation.";
  }

  rows.addEventListener("change", function (e) {
    if (e.target.dataset.k === "type") {
      var t = types[e.target.value], tr = e.target.closest("tr");
      tr.querySelector('[data-k="c"]').value = mid(t).toFixed(2);
      tr.querySelector('[data-k="range"]').textContent = t.min.toFixed(2) + "–" + t.max.toFixed(2);
    }
    calc();
  });
  rows.addEventListener("click", function (e) {
    var b = e.target.closest(".row-del");
    if (!b || b.disabled) return;
    var tr = b.closest("tr"), next = tr.nextElementSibling || tr.previousElementSibling;
    tr.remove(); sync();
    if (next) next.querySelector("select").focus();
  });
  $("add-row").addEventListener("click", function () {
    addRow("lawn-sand-avg", 0.5);
    rows.lastElementChild.querySelector("select").focus();
  });
  // Changing area units converts the numbers, so the physical area stays put.
  $("a-unit").addEventListener("change", function () {
    var f = AREA[lastUnit] / AREA[this.value];
    lastUnit = this.value;
    var round = function (v) { return +(v * f).toPrecision(6); };
    rows.querySelectorAll('[data-k="area"]').forEach(function (el) { var v = num(el); if (isFinite(v)) el.value = round(v); });
    var t = num($("a-total")); if (isFinite(t)) $("a-total").value = round(t);
  });
  form.addEventListener("input", calc);
  form.addEventListener("change", function (e) {
    if (e.target.name === "cmode") {
      var comp = mode() === "composite";
      form.querySelector('[data-mode="composite"]').hidden = !comp;
      form.querySelector('[data-mode="direct"]').hidden = comp;
      form.querySelector("[data-composite-hint]").hidden = !comp;
      $("a-total").readOnly = comp;
    }
    calc();
  });
  form.addEventListener("submit", function (e) { e.preventDefault(); });

  // Example: a small commercial lot (roof + paving + sandy-soil lawn).
  $("a-total").readOnly = true;
  addRow("roofs", 0.6);
  addRow("asphalt", 1.2);
  addRow("lawn-sand-avg", 0.7);
})();
