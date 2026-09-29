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

function createStats(stats = []) {
  if (!stats.length) {
    return "";
  }

  return `
    <div class="bestball-stats">
      ${stats
        .map(
          (stat) => `
            <div class="bestball-stat">
              <span>${escapeHtml(stat.label)}</span>
              <strong>${escapeHtml(stat.value)}</strong>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function createDetails(details = []) {
  if (!details.length) {
    return "";
  }

  return `
    <div class="bestball-detail-grid">
      ${details
        .map(
          (item) => `
            <article class="bestball-detail">
              <h4>${escapeHtml(item.heading)}</h4>
              <p>${escapeHtml(item.text)}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function createTakeaways(takeaways = []) {
  if (!takeaways.length) {
    return "";
  }

  return `
    <div class="bestball-takeaways">
      <h4>Season takeaways</h4>

      <ul>
        ${takeaways
          .map((item) => `<li>${escapeHtml(item)}</li>`)
          .join("")}
      </ul>
    </div>
  `;
}

function createTimelineItem(season, index) {
  return `
    <article class="bestball-item status-${escapeHtml(season.status)}">
      <span class="bestball-marker" aria-hidden="true"></span>

      <div class="bestball-item-content">
        <p class="bestball-date">
          ${escapeHtml(season.year)} · ${escapeHtml(season.label)}
        </p>

        <h3>${escapeHtml(season.title)}</h3>

        <p class="bestball-description">
          ${escapeHtml(season.summary)}
        </p>

        ${createStats(season.stats)}

        <button
          class="bestball-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="bestball-details-${index}"
        >
          View full season
          <span aria-hidden="true">+</span>
        </button>

        <div
          class="bestball-details"
          id="bestball-details-${index}"
          hidden
        >
          ${createDetails(season.details)}
          ${createTakeaways(season.takeaways)}
        </div>
      </div>
    </article>
  `;
}

function renderBestballTimeline() {
  if (!bestballTimeline) {
    return;
  }

  if (
    typeof bestballSeasons === "undefined" ||
    !Array.isArray(bestballSeasons)
  ) {
    bestballTimeline.innerHTML = `
      <p class="bestball-empty">
        Timeline data could not load. Check bestball-data.js.
      </p>
    `;
    return;
  }

  if (!bestballSeasons.length) {
    bestballTimeline.innerHTML = `
      <p class="bestball-empty">
        No BestBall seasons have been added yet.
      </p>
    `;
    return;
  }

  bestballTimeline.innerHTML = bestballSeasons
    .map(createTimelineItem)
    .join("");
}

document.addEventListener("click", (event) => {
  const toggle = event.target.closest(".bestball-toggle");

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
  details.hidden = isOpen;

  toggle.innerHTML = isOpen
    ? 'View full season <span aria-hidden="true">+</span>'
    : 'Hide full season <span aria-hidden="true">−</span>';
});

renderBestballTimeline();

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
