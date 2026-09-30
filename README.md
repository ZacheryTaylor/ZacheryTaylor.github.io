# zt-site-staging — staging / working copy of zacherytaylor.github.io

**This repository is the STAGING copy of Zachery Taylor's personal site.**
Changes are made and reviewed here first; nothing here touches the live site
until it is deliberately promoted.

| | |
|---|---|
| Live site (unchanged) | https://zacherytaylor.github.io · repo [`ZacheryTaylor/ZacheryTaylor.github.io`](https://github.com/ZacheryTaylor/ZacheryTaylor.github.io) |
| **Staging preview** | **https://zacherytaylor.github.io/zt-site-staging/** |
| Monogram options | https://zacherytaylor.github.io/zt-site-staging/brand.html |

The full history of the live repo is preserved here; the staging work starts
at the commit *"Move site source into src/ …"*.

> **Staging is `noindex`.** Every page carries `<meta name="robots" content="noindex, nofollow">`
> and `robots.txt` disallows crawling, so the preview never competes with the live
> site in search. This switches off **automatically** when the same code is built from
> the live `*.github.io` repo (see `indexable` in `site.config.js`), so there is nothing
> to remove by hand on promotion.

---

## How the site is built

- **Eleventy (11ty) 3**, run by GitHub Actions (`.github/workflows/deploy.yml`) and
  deployed to GitHub Pages (Pages source = *GitHub Actions*). 100% on GitHub; output is
  plain static HTML/CSS/JS.
- **One layout** (`src/_includes/base.njk`) with shared partials: `head` (meta, OG/Twitter,
  canonical, favicons, JSON-LD), `nav` (with the accessible mobile menu), and `footer`
  (the drawing *title block*). Change them once, every page updates.
- **Content still lives in the same data files** you already edit, now under `src/assets/js/`:
  - `academic-projects-data.js`, `personal-projects-data.js` — every entry automatically gets
    its own shareable page at `/projects/<id>/` with its own OG image, plus a quick-view dialog.
    Optional `compare: { before, after }` adds a before/after slider to that project page.
  - `quotes-data.js`, `bestball-data.js` — unchanged format.
  - **new** `timeline-data.js` — the story index (home shows the latest slice, Life &
    Interests shows every milestone grouped by year, with a type filter). Year groups
    are derived from the entries; add `story` (paragraphs) and/or `photos` to an
    entry to give it its own page at `/story/<slug>/`. Also published as `feed.xml` / `feed.json`.
  - **new** `civil-work-data.js` — the Civil Work page. Its `projects` list uses the same
    shape as the academic projects: an entry with a `title` gets a gallery card and its own
    `/projects/<id>/` page; an entry without one stays a blank “coming soon” plan sheet.
- **Image pipeline**: originals stay in `src/images/` (the archive — never published as-is).
  The build emits AVIF + WebP + JPEG/PNG at several widths with `width`/`height`, lazy-loading
  below the fold. Gallery and dialog images are inside `<template>` so they download only
  when opened.
- **Generated**: `sitemap.xml`, `robots.txt`, `feed.xml`, `feed.json`, `site.webmanifest`,
  favicons (`favicon.svg/.ico`, `apple-touch-icon.png`, `icon-192/512.png`) from the chosen
  monogram, and 1200×630 social cards per project.
- A reference or image that doesn't exist (e.g. a PDF not uploaded yet) is **skipped with a
  build warning** instead of producing a dead link.

### Local development

```bash
npm ci
npm start            # http://localhost:8080/zt-site-staging/
npm run build        # writes _site/
```

## The one config file: `site.config.js`

| Setting | What it does |
|---|---|
| `pathPrefix` | `/zt-site-staging/` on staging, `/` on live or a custom domain. **In CI it is filled in automatically** from `actions/configure-pages`, so links/assets work on staging, at the root, or on a custom domain without edits. |
| `indexable` | `false` on staging (noindex), `true` automatically when built from the live repo. Override with env `SITE_INDEXABLE`. |
| `monogram` | `"a"`–`"k"`, `"i1"`–`"i8"`, `"l1"`–`"l6"` or `"n1"`–`"n8"` — swaps the nav mark, footer mark, and all favicons. Options with a `lockup-<key>.svg` (currently G) use that horizontal lockup in the nav. See `/brand.html`; regenerate the SVGs with `scripts/make-monograms*.mjs` (round 3 also writes one-colour `monogram-<key>-mono.svg` files). |
| `goatcounter` | GoatCounter site code → enables the privacy-friendly analytics snippet. Empty = off. |
| `formspree` | Formspree form id → the contact form posts there. Empty = the form opens a pre-filled email instead. |
| `newsletter` | `{ provider: "buttondown" \| "kit", id }` → the book email sign-up posts to that list. Empty = opens a pre-filled email. |

On staging, anything not yet configured shows a small dashed **“pending”** badge so it's easy to spot.
Those badges never appear on the live build.

## Promote staging → live (when approved)

Staging `main` descends from live `main`, so promotion is a fast-forward push — no force-push.

1. **Switch the live repo's Pages source to Actions** (one time):
   *ZacheryTaylor.github.io → Settings → Pages → Build and deployment → Source: **GitHub Actions***
   (or `gh api -X PUT repos/ZacheryTaylor/ZacheryTaylor.github.io/pages -f build_type=workflow`).
2. **Push staging to live:**
   ```bash
   git clone https://github.com/ZacheryTaylor/zt-site-staging.git && cd zt-site-staging
   git remote add live https://github.com/ZacheryTaylor/ZacheryTaylor.github.io.git
   git fetch live
   git merge-base --is-ancestor live/main main && echo "fast-forward OK"
   git push live main:main
   ```
   If the check fails, someone committed to live after staging was created: `git merge live/main`,
   move any edits of old root paths (`assets/js/…`, `images/…`) to `src/…`, then push.
3. The same workflow runs in the live repo. There `configure-pages` reports path `/` and the repo
   name ends in `.github.io`, so the build is **root-prefixed and indexable automatically**
   (noindex removed, `robots.txt` allows crawling and lists the sitemap).
4. Check https://zacherytaylor.github.io/ — the old URLs (`/academic.html`, `/personal.html`,
   `/bestball.html`, `/resume.pdf`, `/contact.vcf`) are unchanged; the other project sites
   (`/dwts-draft/`, `/bet-tracker/`) are separate repos and unaffected.
5. Optional: delete `src/brand.njk` (the monogram review page) once a monogram is chosen.

**Custom domain later:** add it in the repo's *Settings → Pages*. `configure-pages` passes the
new origin automatically; if that repo isn't named `*.github.io`, set `SITE_INDEXABLE: "true"`
in the workflow's build `env`.
