import { loadDataFile } from "../_lib/load.js";
import { loadQuoteBank } from "../_lib/validate-quotes.js";

// Joins bookshelf-data.js with the quote bank: counts, first-logged year, sample quote.
export default function () {
  const shelf = loadDataFile("bookshelf-data.js", "bookshelf");
  const quotes = loadQuoteBank();
  const slug = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const palette = ["blue", "ink", "bronze", "paper", "navy", "sand"];
  let hash = 0;
  // Catch the mistakes that would silently hide a book or leave it empty
  const shelfIds = shelf.shelves.map((s) => s.id);
  const problems = [];
  shelf.books.forEach((b, i) => {
    const where = `book ${i + 1}${b && b.title ? ` ("${b.title}")` : ""}`;
    for (const k of ["shelf", "title", "author", "origin"]) if (!b || typeof b[k] !== "string" || !b[k].trim()) problems.push(`${where}: "${k}" is missing.`);
    if (b && b.shelf && !shelfIds.includes(b.shelf)) problems.push(`${where}: shelf "${b.shelf}" doesn't exist (use one of: ${shelfIds.join(", ")}).`);
    if (b && b.color !== undefined && !palette.includes(b.color)) problems.push(`${where}: color "${b.color}" isn't a spine color (use one of: ${palette.join(", ")}).`);
  });
  if (problems.length) throw new Error(`bookshelf-data.js has ${problems.length} problem${problems.length > 1 ? "s" : ""}. Nothing was published; fix these and commit again:\n  - ${problems.join("\n  - ")}\n`);
  const books = shelf.books.map((b, i) => {
    const qs = quotes.filter((q) => q.origin === b.origin);
    const years = qs.map((q) => String(q.date || "").slice(0, 4)).filter((y) => /^\d{4}$/.test(y)).sort();
    const sample = qs.find((q) => q.favorite) || qs.find((q) => q.quote.length < 190) || qs[0];
    for (const c of b.title) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
    if (!qs.length) console.warn(`[bookshelf] no quotes match origin: ${b.origin}`);
    return {
      ...b,
      id: slug(b.title),
      quoteCount: qs.length,
      since: years[0] || "",
      sample: sample ? sample.quote : "",
      color: b.color || palette[i % palette.length],              // optional override in bookshelf-data.js
      height: 214 + (hash % 5) * 11,                                // spine height, px
      width: Math.round(34 + Math.min(qs.length, 48) * 0.75),       // thicker = more quotes logged
    };
  });
  const totalQuotes = books.reduce((n, b) => n + b.quoteCount, 0);
  // origin text -> book on the shelf (the quote deck links each quote to its book)
  const byOrigin = Object.fromEntries(books.map((b) => [b.origin, { id: b.id, title: b.title }]));
  return {
    books,
    byOrigin,
    shelves: shelf.shelves.map((s) => ({ ...s, books: books.filter((b) => b.shelf === s.id) })),
    count: books.length,
    totalQuotes,
  };
}
