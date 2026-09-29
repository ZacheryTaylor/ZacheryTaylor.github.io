import { loadDataFile } from "../_lib/load.js";

// Groups every timeline entry into a life chapter (oldest first inside each).
export default function () {
  const timeline = loadDataFile("timeline-data.js", "timeline");
  const chapters = loadDataFile("timeline-data.js", "lifeChapters");
  const ym = (d) => String(d).slice(0, 7);
  const out = chapters.map((c) => ({
    ...c,
    id: "ch-" + c.numeral.toLowerCase(),
    fromYear: +c.from.slice(0, 4),
    toYear: +c.to.slice(0, 4),
    entries: timeline
      .filter((t) => ym(t.date) >= c.from && ym(t.date) <= c.to)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((t) => ({ ...t, year: +t.date.slice(0, 4) })),
  }));
  const placed = out.reduce((n, c) => n + c.entries.length, 0);
  if (placed !== timeline.length) console.warn(`[lifeChapters] ${timeline.length - placed} timeline entries fall outside every chapter`);
  const years = [];
  for (let y = out[0].fromYear; y <= out[out.length - 1].toYear; y++) years.push(y);
  // Only offer years that have an entry, so the scrubber never lands on an empty spot.
  const withEntries = years.filter((y) => out.some((c) => c.entries.some((e) => e.year === y)));
  return { chapters: out, years: withEntries };
}
