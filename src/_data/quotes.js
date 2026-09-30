import { loadDataFile } from "../_lib/load.js";
const all = loadDataFile("quotes-data.js", "quoteBank");
const favorites = all.filter((q) => q.favorite);
// Build-time pick so the card is never empty before JS runs (no layout shift).
const pool = favorites.length ? favorites : all;
const featured = pool[Math.floor(Math.random() * pool.length)];
// Deck order: newest logged first (quotes-data.js is appended chronologically).
const deck = all.slice().reverse();
// Deep-link hash for a quote: q037 -> "q-037"
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
export default { all, deck, featuredPos, favorites, featured, count: all.length, topics, origins, anchor: anchor(featured.id), anchorOf: Object.fromEntries(all.map((q) => [q.id, anchor(q.id)])) };
