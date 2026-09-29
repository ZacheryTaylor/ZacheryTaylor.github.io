import { loadDataFile } from "../_lib/load.js";
const all = loadDataFile("quotes-data.js", "quoteBank");
const favorites = all.filter((q) => q.favorite);
// Build-time pick so the card is never empty before JS runs (no layout shift).
const pool = favorites.length ? favorites : all;
const featured = pool[Math.floor(Math.random() * pool.length)];
export default { all, favorites, featured, count: all.length };
