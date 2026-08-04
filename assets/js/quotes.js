/*
  QUOTE ENGINE
  ------------
  Shared logic for the home page flashcard and the Personal Projects
  quote log. Depends on quoteBank from quotes-data.js being loaded first.
*/

const QuoteEngine = (function () {
  const STORAGE_KEY = "quoteFavorites";

  function loadFavoriteOverrides() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      return {};
    }
  }

  function saveFavoriteOverrides(overrides) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch (err) {
      /* localStorage unavailable, favorites will not persist */
    }
  }

  let favoriteOverrides = loadFavoriteOverrides();

  function isFavorite(entry) {
    if (Object.prototype.hasOwnProperty.call(favoriteOverrides, entry.id)) {
      return favoriteOverrides[entry.id];
    }
    return !!entry.favorite;
  }

  function toggleFavorite(id) {
    const entry = quoteBank.find(function (q) {
      return q.id === id;
    });
    if (!entry) return false;
    const newValue = !isFavorite(entry);
    favoriteOverrides[id] = newValue;
    saveFavoriteOverrides(favoriteOverrides);
    return newValue;
  }

  function getAll() {
    return quoteBank.slice();
  }

  function getFavorites() {
    return quoteBank.filter(isFavorite);
  }

  function getPool(favoritesOnly) {
    const pool = favoritesOnly ? getFavorites() : getAll();
    return pool;
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
    search: search,
    isFavorite: isFavorite,
    toggleFavorite: toggleFavorite
  };
})();

/* ---------- Home page flashcard ---------- */

function initQuoteFlashcard() {
  const card = document.getElementById("quote-flashcard");
  if (!card) return;

  const quoteText = document.getElementById("quote-flashcard-text");
  const quoteOrigin = document.getElementById("quote-flashcard-origin");
  const shuffleBtn = document.getElementById("quote-flashcard-shuffle");
  const favBtn = document.getElementById("quote-flashcard-fav");
  const favToggle = document.getElementById("quote-flashcard-fav-toggle");
  const emptyState = document.getElementById("quote-flashcard-empty");

  let current = null;
  let favoritesOnly = false;

  function render() {
    current = QuoteEngine.getRandom(favoritesOnly, current ? current.id : null);

    if (!current) {
      card.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    card.style.display = "flex";
    if (emptyState) emptyState.style.display = "none";

    quoteText.textContent = "\u201C" + current.quote + "\u201D";
    quoteOrigin.textContent = "\u2014 " + current.origin;
    updateFavButton();
  }

  function updateFavButton() {
    if (!favBtn || !current) return;
    const active = QuoteEngine.isFavorite(current);
    favBtn.classList.toggle("is-active", active);
    favBtn.setAttribute("aria-pressed", active ? "true" : "false");
    favBtn.textContent = active ? "\u2605 Favorited" : "\u2606 Favorite";
  }

  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", render);
  }

  if (favBtn) {
    favBtn.addEventListener("click", function () {
      if (!current) return;
      QuoteEngine.toggleFavorite(current.id);
      updateFavButton();
    });
  }

  if (favToggle) {
    favToggle.addEventListener("click", function () {
      favoritesOnly = !favoritesOnly;
      favToggle.classList.toggle("is-active", favoritesOnly);
      favToggle.setAttribute("aria-pressed", favoritesOnly ? "true" : "false");
      favToggle.textContent = favoritesOnly
        ? "Showing favorites only"
        : "Show favorites only";
      render();
    });
  }

  render();
}

/* ---------- Personal Projects quote log ---------- */

function initQuoteLog() {
  const list = document.getElementById("quote-log-list");
  if (!list) return;

  const searchInput = document.getElementById("quote-log-search");
  const favToggle = document.getElementById("quote-log-fav-toggle");
  const countLabel = document.getElementById("quote-log-count");
  const emptyState = document.getElementById("quote-log-empty");

  let favoritesOnly = false;

  function renderList() {
    const term = searchInput ? searchInput.value : "";
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

      const starBtn = document.createElement("button");
      starBtn.type = "button";
      starBtn.className = "quote-log-star";
      const active = QuoteEngine.isFavorite(entry);
      starBtn.classList.toggle("is-active", active);
      starBtn.setAttribute("aria-pressed", active ? "true" : "false");
      starBtn.textContent = active ? "\u2605" : "\u2606";
      starBtn.setAttribute("aria-label", "Toggle favorite");
      starBtn.addEventListener("click", function () {
        QuoteEngine.toggleFavorite(entry.id);
        renderList();
      });

      meta.appendChild(origin);
      meta.appendChild(date);
      meta.appendChild(starBtn);

      item.appendChild(text);
      item.appendChild(meta);
      list.appendChild(item);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", renderList);
  }

  if (favToggle) {
    favToggle.addEventListener("click", function () {
      favoritesOnly = !favoritesOnly;
      favToggle.classList.toggle("is-active", favoritesOnly);
      favToggle.setAttribute("aria-pressed", favoritesOnly ? "true" : "false");
      favToggle.textContent = favoritesOnly
        ? "Showing favorites only"
        : "Show favorites only";
      renderList();
    });
  }

  renderList();
}

document.addEventListener("DOMContentLoaded", function () {
  initQuoteFlashcard();
  initQuoteLog();
});
