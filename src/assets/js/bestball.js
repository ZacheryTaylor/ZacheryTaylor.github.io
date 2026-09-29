/* Best Ball archive: the timeline is rendered at build time from
   bestball-data.js; this only wires up the "View full season" toggles. */
document.addEventListener("click", function (event) {
  var toggle = event.target.closest(".bestball-toggle");
  if (!toggle) return;
  var details = document.getElementById(toggle.getAttribute("aria-controls"));
  if (!details) return;
  var isOpen = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!isOpen));
  details.hidden = isOpen;
  toggle.innerHTML = isOpen
    ? 'View full season <span aria-hidden="true">+</span>'
    : 'Hide full season <span aria-hidden="true">−</span>';
});
