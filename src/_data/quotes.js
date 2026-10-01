import { loadQuoteBank, validateQuotes } from "../_lib/validate-quotes.js";
const all = loadQuoteBank();
const { nextId } = validateQuotes(all);
const favorites = all.filter((q) => q.favorite);
// Build-time pick so the card is never empty before JS runs (no layout shift).
const pool = favorites.length ? favorites : all;
const featured = pool[Math.floor(Math.random() * pool.length)];
// Deck order: newest logged first (quotes-data.js is appended chronologically).
const deck = all.slice().reverse();
// Deep-link hash for a quote: q038 -> "q-038"
const anchor = (id) => "q-" + String(id).replace(/^q/i, "");
// Filter chips: topics used by at least 8 quotes, most-used first.
const tagCounts = {};
all.forEach((q) => (q.tags || []).forEach((t) => (tagCounts[t] = (tagCounts[t] || 0) + 1)));
const topics = Object.entries(tagCounts).filter(([, n]) => n >= 8).sort((a, b) => b[1] - a[1]).map(([tag, count]) => ({ tag, count }));
// Source filter: every origin, most-quoted first.
const originCounts = {};
all.forEach((q) => (originCounts[q.origin] = (originCounts[q.origin] || 0) + 1));
const origins = Object.entries(originCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([origin, count]) => ({ origin, count }));
const featuredPos = deck.indexOf(featured) + 1;
// First year logged ("logged since 2020"), computed so the copy follows the data
const years = all.map((q) => String(q.date).slice(0, 4)).filter((y) => /^\d{4}$/.test(y)).sort();
const since = years[0] || "";
const sources = origins.length;
export default { all, deck, featuredPos, since, sources, nextId, favorites, featured, count: all.length, topics, origins, anchor: anchor(featured.id), anchorOf: Object.fromEntries(all.map((q) => [q.id, anchor(q.id)])) };
