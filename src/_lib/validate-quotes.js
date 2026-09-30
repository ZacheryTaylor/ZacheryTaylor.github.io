/*
  Checks quotes-data.js at build time so a typo fails the build with a plain
  message (and the live site keeps its last good version) instead of quietly
  breaking a count, a deep link or the downloads. See README "How to add a quote".
*/
import { loadDataFile } from "./load.js";

const KEYS = ["id", "quote", "origin", "date", "tags", "favorite"];
// ids are "q001"...; a bare number means the same (entry 262 is written `id: "262"`)
export const normId = (id) => (/^\d+$/.test(String(id)) ? "q" + String(id).padStart(3, "0") : id);

// The one way the build reads the quote bank: load, normalise ids, check.
export function loadQuoteBank() {
  const all = loadDataFile("quotes-data.js", "quoteBank").map((q) => (q && typeof q === "object" ? { ...q, id: normId(q.id) } : q));
  validateQuotes(all);
  return all;
}
const DATE = /^\d{4}(-\d{2}(-\d{2})?)?$/; // 2026, 2026-09 or 2026-09-30

export function validateQuotes(all, file = "quotes-data.js") {
  if (!Array.isArray(all) || !all.length) throw new Error(`${file}: quoteBank should be a list [ ... ] of quotes.`);
  const problems = [], warnings = [], seen = new Map();
  const nums = all.map((q) => +(/^q(\d+)$/.exec(q && q.id) || [0, 0])[1]);
  const nextId = "q" + String(Math.max(0, ...nums) + 1).padStart(3, "0");
  all.forEach((q, i) => {
    const where = `entry ${i + 1}${q && q.id ? ` (${q.id})` : ""}`;
    const bad = (m) => problems.push(`${where}: ${m}`);
    if (!q || typeof q !== "object" || Array.isArray(q)) return bad("isn't a { ... } entry.");
    if (typeof q.id !== "string" || !/^q\d{3,}$/.test(q.id)) bad(`id should look like "q123" (the next free one is "${nextId}").`);
    else if (seen.has(q.id)) bad(`id "${q.id}" is already used by entry ${seen.get(q.id)} (the next free one is "${nextId}").`);
    else seen.set(q.id, i + 1);
    if (typeof q.quote !== "string" || !q.quote.trim()) bad("quote is missing or empty.");
    if (typeof q.origin !== "string" || !q.origin.trim()) bad('origin (who said it / which book) is missing. Use "UNKNOWN" if you don\'t know.');
    else if (q.origin !== q.origin.trim()) bad(`origin has a space at the start or end: "${q.origin}".`);
    if (q.date === undefined || q.date === "") bad('date is missing: use the year ("2026") or the full date ("2026-09-30").');
    else if (!DATE.test(String(q.date))) bad(`date "${q.date}" should be a year ("2026") or YYYY-MM-DD ("2026-09-30").`);
    if (q.tags !== undefined && (!Array.isArray(q.tags) || q.tags.some((t) => typeof t !== "string" || !t.trim())))
      bad('tags should be a list of words in quotes, e.g. ["mindset", "business"] (or [] for none).');
    if (q.favorite !== undefined && typeof q.favorite !== "boolean") bad(`favorite should be true or false without quotes (it's ${JSON.stringify(q.favorite)}).`);
    const extra = Object.keys(q).filter((k) => !KEYS.includes(k));
    if (extra.length) bad(`unknown field${extra.length > 1 ? "s" : ""} ${extra.map((k) => `"${k}"`).join(", ")} (allowed: ${KEYS.join(", ")}). A typo like "favourite"?`);
  });
  // Same source spelled two ways splits its count and its shelf book
  const byKey = {};
  all.forEach((q) => { if (q && typeof q.origin === "string") { const k = q.origin.toLowerCase().replace(/[^a-z0-9]/g, ""); (byKey[k] = byKey[k] || new Set()).add(q.origin); } });
  Object.values(byKey).filter((s) => s.size > 1).forEach((s) => warnings.push(`the same source is spelled ${s.size} ways: ${[...s].map((o) => `"${o}"`).join(" / ")}. Pick one so they count together.`));
  warnings.forEach((w) => console.warn(`[quotes] warning: ${w}`));
  if (problems.length) {
    throw new Error(`${file} has ${problems.length} problem${problems.length > 1 ? "s" : ""}. Nothing was published; fix these and commit again:\n  - ${problems.join("\n  - ")}\n`);
  }
  return { nextId };
}
