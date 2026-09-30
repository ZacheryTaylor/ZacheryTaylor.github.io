/*
  SITE CONFIG — the one file to edit for deploy target and third-party services.
  ---------------------------------------------------------------------------
  Everything that differs between staging, live, and a future custom domain
  lives here. In GitHub Actions the workflow passes the real Pages URL/path in
  via env vars (from actions/configure-pages), so you normally never touch
  `url` or `pathPrefix` by hand.
*/

const repo = (process.env.GITHUB_REPOSITORY || "").toLowerCase();
const isLiveRepo = repo.endsWith(".github.io");

export default {
  /* ---------- Deploy target ---------- */

  // Origin the site is served from (no trailing slash).
  url: process.env.SITE_URL || "https://zacherytaylor.github.io",

  // THE path-prefix value. "/zt-site-staging/" on staging, "/" on the live
  // user site or a custom domain. CI fills this from configure-pages.
  pathPrefix: process.env.PATH_PREFIX || "/zt-site-staging/",

  // Search-engine indexing. Staging is noindex so it never competes with the
  // live site. Auto-enabled only when built from the *.github.io repo; set
  // SITE_INDEXABLE=true|false to override (e.g. for a custom domain repo).
  indexable: process.env.SITE_INDEXABLE
    ? process.env.SITE_INDEXABLE === "true"
    : isLiveRepo,

  /* ---------- Brand ---------- */

  // Which monogram drives the nav mark, footer mark + favicons (N1 is Zach's pick):
  // "a" | "b" | "c" (round 1), "d" | "e" | "f" | "g" (round 2),
  // "h" | "i" | "j" | "k" (round 3, statement marks),
  // "i1" … "i8" (variants of I, lot split),
  // "l1" … "l6" (smooth lot split: H-style rounded letters inside the parcel),
  // or "n1" … "n8" (fresh concepts: crisp, precise marks).
  // Options with a horizontal lockup (currently "g") use it in the nav automatically.
  // See /brand.html for all options.
  monogram: "n1",

  /* ---------- Third-party services (all optional) ---------- */
  // Leave a value empty ("") and the feature degrades gracefully:
  // forms fall back to a pre-filled email, analytics stays off.

  // GoatCounter analytics: the "code" part of https://CODE.goatcounter.com
  goatcounter: "",

  // Formspree contact form: the form id from https://formspree.io/f/XXXXXXX
  formspree: "",

  // Book email list. provider: "buttondown" | "kit"
  //   buttondown -> id = your Buttondown username
  //   kit        -> id = numeric Kit (ConvertKit) form id
  newsletter: { provider: "buttondown", id: "" },

  /* ---------- Identity (used in meta tags / JSON-LD) ---------- */
  author: {
    name: "Zachery Taylor",
    shortName: "Zach Taylor",
    jobTitle: "Civil Engineering Designer, Engineer Intern (EI)",
    email: "zach811taylor@gmail.com",
    phone: "+18502611370",
    phoneDisplay: "(850) 261-1370",
    linkedin: "https://www.linkedin.com/in/zacheryalexandertaylor/",
    city: "Pensacola",
    region: "FL",
  },
};
