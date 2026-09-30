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
  - `quotes-data.js`, `bestball-data.js` — unchanged format. On Life & Interests the quotes
    form the **Reading & quotes** deck (`partials/reading-quotes.njk` + `assets/js/quotes.js`):
    one flashcard at a time with prev/next, swipe, arrow keys and Shuffle; search, topic chips
    (tags used 8+ times) and a source filter narrow the deck; a List view shows 12 at a time.
    Every quote has a deep link, `personal.html#q-037` for `id: "q037"`. The strip of spines
    under the deck filters it by book and links to the Bookshelf.
    The card itself is the `quote-card.njk` macro and one shared `QuoteDeck` in `quotes.js`;
    the homepage uses the same card and controls (`#home-deck`), loads `quotes-data.js` on idle
    or first interaction, and its "Open the full deck" link follows the current quote.
  - **Quote downloads** — `scripts/quote-downloads.mjs` runs after every build (`eleventy.after`)
    and writes `_site/downloads/quote-bank.pdf` (US Letter, drawing-sheet cover, contents,
    grouped by source, fonts embedded via pdfkit), `quote-bank.csv` and `quote-bank.txt`. They
    always hold every quote; they are static files so a plain `<a download>` works everywhere,
    including iOS Safari. When filters are active, the deck also offers the filtered set as
    CSV/text, generated in the browser. The quote-bank-export project links to the same PDF.
  - `bookshelf-data.js` — the Bookshelf page (`/bookshelf.html`, in the nav under Life &
    Interests). Quote counts and samples are computed from `quotes-data.js` by `origin`.
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
  favicons and app icons from the chosen monogram (`favicon.svg` is the mark itself; `favicon.ico`,
  `favicon-16/32.png` and `icon-192/512.png` use its blue tile `monogram-<key>-tile.svg`;
  `apple-touch-icon.png` and `icon-maskable-192/512.png` use the full-bleed `monogram-<key>-app.svg`),
  and 1200×630 social cards per project. The default share card `assets/brand/og-default.png` is
  rendered from `scripts/og-card.html`.
- A reference or image that doesn't exist (e.g. a PDF not uploaded yet) is **skipped with a
  build warning** instead of producing a dead link.

### Local development

```bash
npm ci
npm start            # http://localhost:8080/zt-site-staging/
npm run build        # writes _site/
```

## How to add a quote (no tools needed)

Quotes live in one file: **`src/assets/js/quotes-data.js`**. Everything else is worked out
from it on every build: the totals ("291 quotes"), the favorites count and chip, the topic
chips, the source list, "logged since …", the homepage card, each book's quote count and
spine thickness on the Bookshelf, and the PDF / CSV / text downloads. You never update a
number by hand.

1. On github.com (a phone browser works; the GitHub app can't edit files), open
   `src/assets/js/quotes-data.js` in this repo and tap the pencil (✎ Edit).
2. Scroll to the very bottom. Just above the final `];`, paste this and fill it in:

   ```js
     {
       id: "q291",
       quote: "The line, exactly as you wrote it.",
       origin: "Author Name, Book Title",
       date: "2026",
       tags: ["mindset"],
       favorite: false
     },
   ```

   - **id** — the next number: one more than the last entry (the last is `q290` today). If
     you get it wrong the build tells you the next free one.
   - **quote** — the text between the straight `"` marks. If the quote itself contains a `"`,
     type it as `\"` or use curly quotes “ ”. For a line break, type `\n`.
   - **origin** — who/which book, as `Author, Title`. Copy it **exactly** from an earlier
     quote of the same book (same spelling and commas) so the counts and the shelf match.
     `UNKNOWN` if you don't know.
   - **date** — the year (`"2026"`) or the full date (`"2026-09-30"`).
   - **tags** — optional topics, e.g. `["business", "mindset"]`, or `[]`. Tags used by 8+
     quotes become filter chips automatically.
   - **favorite** — `true` stars it (the ★, the Favorites chip, the homepage pick, the stars
     in the PDF); `false` otherwise. No quotes around true/false.
3. Tap **Commit changes** → "Commit directly to the `main` branch". In about 2 minutes the
   staging site is rebuilt with the new quote everywhere, downloads included. (This is the
   staging repo: new quotes reach the live site when staging is promoted, see below.)
4. If something is off (a missing comma, a duplicate id, `favorite: "true"` in quotes…), the
   build stops, **nothing is published** (the site keeps its last good version), and GitHub
   emails you (its default for failed runs). Open the failed run under **Actions** → it lists each problem in plain words
   with the entry number, e.g. `entry 291 (q291): date "Sept 2026" should be a year…`. Fix
   and commit again.

Several quotes at once: paste one block per quote, each ending in `},`.

**Putting a new book on the shelf.** The Bookshelf shows the books in
`src/assets/js/bookshelf-data.js`. After you've added the book's quotes:

1. Edit that file and add one line **at the end of the `books` list**:
   `{ shelf: "mind", title: "Book Title", author: "Author Name", origin: "Author Name, Book Title" },`
   - `shelf` is one of `money`, `business`, `mind` (the three shelves at the top of the file).
   - `origin` must be **exactly** the origin you used on the quotes; that's how its quotes
     are counted and linked ("On the shelf →" on the card, the spine strip under the deck).
2. Spine: its thickness grows with the number of quotes; its height is automatic. The color
   cycles through six (blue, ink, bronze, paper, navy, sand) in list order, which is why new
   books go at the end (the other spines keep their colors). To pick one, add
   `color: "bronze"` (any of the six) to the line. There are no cover images on the shelf;
   the spine and the book's card (title, author, count, since, a sample quote) are drawn by
   the site. Optional: `note: "why it mattered"`, `status: "reading"` (shows a badge).
3. Commit. A mistake (unknown shelf, missing title, a color that isn't one of the six) stops
   the build with a message, like the quotes.

Sources that aren't books (e.g. `ZT`, `Elon Musk`, `UNKNOWN`) simply stay off the shelf; their
quotes are still in the deck, the source filter and the downloads.

Not derived from the data: the phrase "more than a hundred books" (index, Life & Interests,
the quote-bank project page). It's Zach's own wording, so change it by hand if you want.

## The contact form (on: Web3Forms + hCaptcha)

"Send a message" sends in place through **Web3Forms** (free) and lands in
`zach811taylor@gmail.com`. It's switched on in **`site.config.js`**:
`contactForm: { provider: "web3forms", key: "9bee6a74-…", hcaptcha: true }`.
The key is meant to be public (it can only send mail **to** you), so it's fine in the repo.

Spam protection, three layers:
- two hidden honeypot fields (`_gotcha`, `botcheck`). Anything that fills them is dropped;
- Web3Forms' **Advanced Spam Filter** (Basic level, set in their dashboard);
- Web3Forms' free **hCaptcha** ("I am human" box). It loads only once the form is scrolled
  near or focused, so the page stays fast. It follows light/dark mode and goes compact
  on phones. **One-time step (about 1 minute):** in the Web3Forms dashboard → your form →
  *Settings → Spam protection*, pick **hCaptcha**, so their side also rejects sends without it.
  To turn the captcha off, set `hcaptcha: false` (and switch it off in the dashboard).

Free plan: 250 messages a month, emails carry a small Web3Forms footer, 30 days of history
in their dashboard. The first message can land in spam: mark it "Not spam" once. Replying to
the notification replies to the visitor. If Web3Forms or the captcha ever fails to load,
the visitor gets "Send it by email instead", with their message still filled in. To change
the key, edit it in `site.config.js`. Empty key = the form opens a pre-filled email instead.
Formspree also works: `provider: "formspree"`, `key` = the form id (free: 50 a month).

## The one config file: `site.config.js`

| Setting | What it does |
|---|---|
| `pathPrefix` | `/zt-site-staging/` on staging, `/` on live or a custom domain. **In CI it is filled in automatically** from `actions/configure-pages`, so links/assets work on staging, at the root, or on a custom domain without edits. |
| `indexable` | `false` on staging (noindex), `true` automatically when built from the live repo. Override with env `SITE_INDEXABLE`. |
| `monogram` | `"n1"` (selected: N1 · Ligature). Other explored keys: `"a"`–`"k"`, `"i1"`–`"i8"`, `"l1"`–`"l6"`, `"n2"`–`"n8"` — swaps the nav mark, footer mark, and all favicons. Options with a `lockup-<key>.svg` (currently G) use that horizontal lockup in the nav. See `/brand.html`; regenerate the SVGs with `scripts/make-monograms*.mjs` (round 3 also writes one-colour `monogram-<key>-mono.svg` files). |
| `goatcounter` | GoatCounter site code → enables the privacy-friendly analytics snippet. Empty = off. |
| `contactForm` | `{ provider: "web3forms" \| "formspree", key, hcaptcha }` → the contact form posts there (see *The contact form*). Empty key = the form opens a pre-filled email instead. |
| `newsletter` | `{ provider: "buttondown" \| "kit", id }` → the book email sign-up posts to that list. Empty = opens a pre-filled email. |

On staging, anything not yet configured shows a small dashed **“pending”** badge so it's easy to spot.
Those badges never appear on the live build.

## Workflow: staging first, then live

Two repos, one codebase:

| Repo | URL | Role |
|---|---|---|
| `ZacheryTaylor/zt-site-staging` | https://zacherytaylor.github.io/zt-site-staging/ | **Test ground.** Every new feature lands here first. noindex, with the "STAGING PREVIEW" badge and "pending" badges. |
| `ZacheryTaylor/ZacheryTaylor.github.io` | https://zacherytaylor.github.io/ | **Live site.** Only receives commits that already passed on staging. Indexable, no badges. |

The same code builds both. Nothing is edited per repo: the workflow's `configure-pages`
step reports the path (`/zt-site-staging/` vs `/`), and a repo named `*.github.io` is built
indexable with no staging badges (`site.config.js` → `indexable`). Canonical, sitemap, Open
Graph and quote-download links all follow automatically.

**Ongoing routine for a new feature:**

1. Commit it to **staging** `main` (one commit per change). The *Build & deploy* workflow
   publishes it to the staging URL and the *Quality gate* checks it: build, zero broken links,
   quote-deck shuffle test, startup guard (no script-forced layout while a page loads, home
   anchors land exactly: `scripts/check-startup.mjs`), Lighthouse ≥ 95. After each deploy,
   *Build & deploy* also runs Lighthouse 5 times on the real deployed home page and writes the
   median in the run summary. It only warns below 95 (real-network scores vary run to run).
2. Review it on the staging URL (phone and desktop).
3. When approved, **promote** it with a normal fast-forward push. Never force-push:
   ```bash
   git clone https://github.com/ZacheryTaylor/zt-site-staging.git && cd zt-site-staging
   git remote add live https://github.com/ZacheryTaylor/ZacheryTaylor.github.io.git
   git fetch live
   git merge-base --is-ancestor live/main main && echo "fast-forward OK"
   git push live main:main
   ```
   The live repo runs the same two workflows, and its Pages source is already set to
   *GitHub Actions*.
4. Check https://zacherytaylor.github.io/ once the live deploy finishes (about 1 minute).

**Keep live a straight copy of staging.** Don't commit directly to the live repo. If someone
does, the ancestry check fails: run `git merge live/main` on staging, push it to staging
first, then promote. The old URLs (`/academic.html`, `/personal.html`, `/bestball.html`,
`/resume.pdf`, `/contact.vcf`, `/pdfs/academic/…`, and the original photos at `/images/…`,
copied as-is from `src/images`) still work. The other project sites
(`/dwts-draft/`, `/bet-tracker/`) are separate repos and unaffected. `/brand.html` (the
monogram options) is published but noindex; delete `src/brand.njk` to remove it.

**Custom domain later:** add it in the repo's *Settings → Pages*. `configure-pages` passes the
new origin automatically; if that repo isn't named `*.github.io`, set `SITE_INDEXABLE: "true"`
in the workflow's build `env`.
