const bestballSummary = document.getElementById("bestball-summary");
const bestballTimeline = document.getElementById("bestball-timeline");
const yearElement = document.getElementById("year");

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createSummaryCard(label, value) {
  return `
    <article class="bestball-summary-card">
      <p>${escapeHtml(label)}</p>
      <strong>${escapeHtml(value)}</strong>
    </article>
  `;
}

function createSeasonCard(season, index) {
  const stats = season.stats
    .map(
      (stat) => `
        <div class="season-stat">
          <span>${escapeHtml(stat.label)}</span>
          <strong>${escapeHtml(stat.value)}</strong>
        </div>
      `
    )
    .join("");

  const details = season.details
    .map(
      (item) => `
        <div class="season-detail">
          <h4>${escapeHtml(item.heading)}</h4>
          <p>${escapeHtml(item.text)}</p>
        </div>
      `
    )
    .join("");

  const takeaways = season.takeaways
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  return `
    <article class="season-card status-${escapeHtml(season.status)}">
      <div class="season-rail">
        <span class="season-dot" aria-hidden="true"></span>
      </div>

      <div class="season-main">
        <div class="season-topline">
          <p class="season-year">${escapeHtml(season.year)}</p>
          <p class="season-label">${escapeHtml(season.label)}</p>
        </div>

        <h3>${escapeHtml(season.title)}</h3>

        <p class="season-summary">${escapeHtml(season.summary)}</p>

        <div class="season-stats">
          ${stats}
        </div>

        <button
          class="season-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="season-details-${index}"
        >
          View season <span aria-hidden="true">+</span>
        </button>

        <div
          class="season-details"
          id="season-details-${index}"
          hidden
        >
          <div class="season-detail-grid">
            ${details}
          </div>

          <div class="season-takeaways">
            <h4>Season takeaways</h4>

            <ul>
              ${takeaways}
            </ul>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderBestballArchive() {
  if (!bestballSummary || !bestballTimeline) {
    return;
  }

  if (
    typeof bestballSeasons === "undefined" ||
    !Array.isArray(bestballSeasons)
  ) {
    bestballTimeline.innerHTML = `
      <p class="bestball-empty">
        Timeline data could not load.
      </p>
    `;
    return;
  }

  const completedSeasons = bestballSeasons.filter(
    (season) => season.status !== "current"
  ).length;

  bestballSummary.innerHTML = [
    createSummaryCard("Archive begins", "2021"),
    createSummaryCard("Seasons tracked", String(bestballSeasons.length)),
    createSummaryCard("Completed seasons", String(completedSeasons)),
    createSummaryCard("Current focus", "2026 tracking")
  ].join("");

  bestballTimeline.innerHTML = bestballSeasons
    .map(createSeasonCard)
    .join("");
}

document.addEventListener("click", (event) => {
  const toggle = event.target.closest(".season-toggle");

  if (!toggle) {
    return;
  }

  const details = document.getElementById(
    toggle.getAttribute("aria-controls")
  );

  if (!details) {
    return;
  }

  const isOpen = toggle.getAttribute("aria-expanded") === "true";

  toggle.setAttribute("aria-expanded", String(!isOpen));
  toggle.innerHTML = isOpen
    ? 'View season <span aria-hidden="true">+</span>'
    : 'Hide season <span aria-hidden="true">−</span>';

  details.hidden = isOpen;
});

renderBestballArchive();

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
