/*
  QUOTE ENGINE
  ------------
  Favorites are determined solely by the `favorite` flag set in
  quotes-data.js. The toggle filters which pool gets shuffled; it does
  not modify the underlying data.
*/

const QuoteEngine = (function () {
  function getAll() {
    return quoteBank.slice();
  }

  function getFavorites() {
    return quoteBank.filter(function (q) {
      return !!q.favorite;
    });
  }

  function getPool(favoritesOnly) {
    return favoritesOnly ? getFavorites() : getAll();
  }

  function getRandom(favoritesOnly, excludeId) {
    let pool = getPool(favoritesOnly);
    if (pool.length === 0) return null;
    if (pool.length > 1 && excludeId) {
      const filtered = pool.filter(function (q) {
        return q.id !== excludeId;
      });
      if (filtered.length > 0) pool = filtered;
    }
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
  }

  function search(term, favoritesOnly) {
    const pool = getPool(favoritesOnly);
    if (!term) return pool;
    const needle = term.trim().toLowerCase();
    if (!needle) return pool;
    return pool.filter(function (q) {
      const haystack = [q.quote, q.origin, (q.tags || []).join(" ")]
        .join(" ")
        .toLowerCase();
      return haystack.indexOf(needle) !== -1;
    });
  }

  return {
    getAll: getAll,
    getFavorites: getFavorites,
    getRandom: getRandom,
    search: search
  };
})();

/* ---------- Home page flashcard ---------- */

function initQuoteFlashcard() {
  const card = document.getElementById("quote-flashcard");
  if (!card) return;

  const quoteText = document.getElementById("quote-flashcard-text");
  const quoteOrigin = document.getElementById("quote-flashcard-origin");
  const shuffleBtn = document.getElementById("quote-flashcard-shuffle");
  const favToggleInput = document.getElementById("quote-flashcard-fav-toggle");
  const emptyState = document.getElementById("quote-flashcard-empty");

  let current = null;

  function applyContent() {
    current = QuoteEngine.getRandom(
      favToggleInput ? favToggleInput.checked : false,
      current ? current.id : null
    );

    if (!current) {
      card.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    card.style.display = "flex";
    if (emptyState) emptyState.style.display = "none";

    quoteText.textContent = "\u201C" + current.quote + "\u201D";
    quoteOrigin.textContent = "\u2014 " + current.origin;
  }

  function flipToNext() {
    card.classList.add("is-flipping");

    setTimeout(function () {
      applyContent();
      card.classList.remove("is-flipping");
    }, 200);
  }

  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", flipToNext);
  }

  if (favToggleInput) {
    favToggleInput.addEventListener("change", flipToNext);
  }

  applyContent();
}

/* ---------- Personal Projects quote log ---------- */

function initQuoteLog() {
  const list = document.getElementById("quote-log-list");
  if (!list) return;

  const searchInput = document.getElementById("quote-log-search");
  const favToggleInput = document.getElementById("quote-log-fav-toggle");
  const countLabel = document.getElementById("quote-log-count");
  const emptyState = document.getElementById("quote-log-empty");

  function renderList() {
    const term = searchInput ? searchInput.value : "";
    const favoritesOnly = favToggleInput ? favToggleInput.checked : false;
    const results = QuoteEngine.search(term, favoritesOnly).slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    list.innerHTML = "";

    if (results.length === 0) {
      if (emptyState) emptyState.style.display = "block";
    } else {
      if (emptyState) emptyState.style.display = "none";
    }

    if (countLabel) {
      countLabel.textContent = results.length + (results.length === 1 ? " entry" : " entries");
    }

    results.forEach(function (entry) {
      const item = document.createElement("li");
      item.className = "quote-log-item";

      const text = document.createElement("p");
      text.className = "quote-log-text";
      text.textContent = "\u201C" + entry.quote + "\u201D";

      const meta = document.createElement("div");
      meta.className = "quote-log-meta";

      const origin = document.createElement("span");
      origin.className = "quote-log-origin";
      origin.textContent = entry.origin;

      const date = document.createElement("span");
      date.className = "quote-log-date";
      date.textContent = entry.date;

      const star = document.createElement("span");
      star.className = "quote-log-star";
      if (entry.favorite) star.classList.add("is-active");
      star.textContent = entry.favorite ? "\u2605" : "\u2606";
      star.setAttribute("aria-label", entry.favorite ? "Favorited" : "Not favorited");

      meta.appendChild(origin);
      meta.appendChild(date);
      meta.appendChild(star);

      item.appendChild(text);
      item.appendChild(meta);
      list.appendChild(item);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", renderList);
  }

  if (favToggleInput) {
    favToggleInput.addEventListener("change", renderList);
  }

  renderList();
}

document.addEventListener("DOMContentLoaded", function () {
  initQuoteFlashcard();
  initQuoteLog();
});
