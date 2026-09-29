/* Résumé: reveal the print button (it needs JS) and wire it up. */
(function () {
  var b = document.querySelector("[data-print]");
  if (!b) return;
  b.hidden = false;
  b.addEventListener("click", function () { window.print(); });
})();
