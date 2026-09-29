import { loadDataFile, fileExists } from "../_lib/load.js";

/*
  The story index: every milestone in timeline-data.js, newest first, with its
  year and life chapter worked out from the data (chapters come from the
  lifeChapters date ranges in the same file). Entries that carry extra content
  (`story` paragraphs and/or `photos`) also get their own page at /story/<slug>/.
*/
const slugify = (s) => String(s).toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function () {
  const timeline = loadDataFile("timeline-data.js", "timeline");
  const chapters = loadDataFile("timeline-data.js", "lifeChapters").map((c) => ({
    ...c,
    id: "ch-" + c.numeral.toLowerCase(),
    fromYear: +c.from.slice(0, 4),
    toYear: +c.to.slice(0, 4),
    count: 0,
  }));

  const entries = timeline
    .map((t, i) => ({ ...t, feedIndex: i + 1 }))
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((t) => {
      const ym = t.date.slice(0, 7);
      const ch = chapters.find((c) => ym >= c.from && ym <= c.to) || null;
      if (ch) ch.count++;
      else console.warn(`[storyIndex] "${t.title}" (${t.date}) falls outside every life chapter`);
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
        chapter: ch && { numeral: ch.numeral, title: ch.title, id: ch.id },
        url: hasStory ? `/story/${slug}/` : null,
        link: hasStory ? `/story/${slug}/` : `/personal.html#m-${slug}`,
      };
    });

  // Mark the newest entry of each chapter so the list can show a side label there.
  entries.forEach((e, i) => { e.chapterStart = !!e.chapter && (i === 0 || entries[i - 1].chapter?.id !== e.chapter.id); });

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
    chapters: chapters.filter((c) => c.count > 0).reverse(), // newest chapter first, like the list
    threads,
    stories: entries.filter((e) => e.hasStory),
  };
}
