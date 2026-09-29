// Every note uses the note layout and lives at /notes/<file-name>/.
// `draft: true` in a note's front matter keeps it out of the build entirely
// (no page, not in the index, sitemap or feeds) unless INCLUDE_DRAFTS is set.
const showDrafts = !!process.env.INCLUDE_DRAFTS;
export default {
  layout: "note.njk",
  navKey: "notes",
  ogType: "article",
  eleventyComputed: {
    permalink: (data) => (data.draft && !showDrafts ? false : `/notes/${data.page.fileSlug}/`),
    eleventyExcludeFromCollections: (data) => !!(data.draft && !showDrafts),
    sheet: (data) => data.sheet || "W-410",
    sheetTitle: (data) => data.title,
  },
};
