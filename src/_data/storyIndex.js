import { loadDataFile, fileExists } from "../_lib/load.js";

/*
  The story index: every milestone in timeline-data.js, newest first, grouped
  by the year worked out from its `date`. Entries that carry extra content
  (`story` paragraphs and/or `photos`) also get their own page at /story/<slug>/.
*/
const slugify = (s) => String(s).toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function () {
  const timeline = loadDataFile("timeline-data.js", "timeline");

  const entries = timeline
    .map((t, i) => ({ ...t, feedIndex: i + 1 }))
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((t) => {
      const slug = t.slug || slugify(t.title);
      const story = (Array.isArray(t.story) ? t.story : String(t.story || "").split(/\n\s*\n/)).map((p) => p.trim()).filter(Boolean);
      const photos = (t.photos || []).filter((p) => {
        const ok = p && fileExists(p.src);
        if (p && !ok) console.warn(`[storyIndex] ${slug}: photo not found (${p.src})`);
        return ok;
      });
      const first = String(t.when).split(/\s+/)[0];
      const short = MONTHS.includes(first) ? first.slice(0, 3) : first; // "Jul", "Present", "Early"
      const hasStory = story.length > 0 || photos.length > 0;
      return {
        ...t, slug, story, photos, short, hasStory,
        year: +t.date.slice(0, 4),
        anchor: "m-" + slug,
        url: hasStory ? `/story/${slug}/` : null,
        link: hasStory ? `/story/${slug}/` : `/personal.html#m-${slug}`,
      };
    });

  const byYear = (list) => {
    const out = [];
    for (const e of list) {
      let g = out[out.length - 1];
      if (!g || g.year !== e.year) out.push((g = { year: e.year, entries: [] }));
      g.entries.push(e);
    }
    return out;
  };
  const threads = [...new Set(entries.map((e) => e.thread))];

  return {
    entries,
    years: byYear(entries),
    recent: byYear(entries.slice(0, 6)),
    threads,
    stories: entries.filter((e) => e.hasStory),
  };
}
