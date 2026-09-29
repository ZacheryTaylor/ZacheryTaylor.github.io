/*
  TIMELINE — the story index on the home page (latest six) and on
  Life & Interests (everything), plus the milestones in the RSS/JSON feeds.
  -----------------------------------------------------------------------
  Newest first. Copy an entry to add a milestone. Years and chapters are
  worked out automatically from `date` (chapters: see lifeChapters below).

  {
    when: "Month YYYY",          // shown as the date label
    date: "YYYY-MM-01",          // used for sorting, the year group + the feeds
    state: "future" | "present" | "past",
    thread: "work" | "life" | "writing" | "education" | "license",
    title: "Headline",           // the one-line entry
    text: "One or two sentences.", // shown when the entry is expanded

    // Optional: give a milestone its own story page at /story/<slug>/.
    // Add either (or both) and the entry gets a "Read the full story" link.
    slug: "custom-url-part",     // default: made from the title
    story: ["Paragraph one.", "Paragraph two."],   // or one string, blank-line separated
    photos: [{ src: "images/story/<file>.jpg", alt: "What it shows", caption: "Optional" }]
  }
*/

const timeline = [
  {
    when: "Early 2027",
    date: "2027-03-01",
    state: "future",
    thread: "writing",
    title: "Publish the Book Through ZT, LLC",
    text: "Complete the manuscript and publish the book through Amazon KDP and this website, turning the project into useful work that can reach and serve readers."
  },
  {
    when: "January 2027",
    date: "2027-01-01",
    state: "future",
    thread: "license",
    title: "Civil PE Exam — Scheduled",
    text: "Preparing to sit for the Civil Principles and Practice of Engineering exam, an important step toward PE licensure and expanded professional responsibility."
  },
  {
    when: "Present",
    date: "2026-09-01",
    state: "present",
    thread: "writing",
    title: "Writing the Book — ZT, LLC",
    text: "Writing and preparing the book for publication through ZT, LLC, the small Pensacola company I set up to publish it and to hold long-term projects."
  },
  {
    when: "July 2026",
    date: "2026-07-01",
    state: "past",
    thread: "writing",
    title: "Section I of the Book Completed",
    text: "Completed the first section of the book, establishing the foundation for the larger manuscript and its eventual publication through ZT, LLC."
  },
  {
    when: "May 2026",
    date: "2026-05-01",
    state: "past",
    thread: "education",
    title: "B.S. Mechanical Engineering",
    text: "Graduated from the University of West Florida with a mechanical engineering degree, strengthening systems thinking, technical rigor, and practical problem-solving."
  },
  {
    when: "January 2026",
    date: "2026-01-01",
    state: "past",
    thread: "life",
    title: "Married the Love of My Life",
    text: "Said \"I do\" to the woman that will forever be my endurance. Fortitudine Vincimus Mrs. Taylor"
  },
  {
    when: "December 2025",
    date: "2025-12-01",
    state: "past",
    thread: "license",
    title: "Fundamentals of Engineering Exam — Passed",
    text: "Passed the FE exam and became an Engineer Intern (EI), marking a major milestone on the long-term path toward Professional Engineer licensure."
  },
  {
    when: "July 2025 – Present",
    date: "2025-07-01",
    state: "present",
    thread: "work",
    title: "Civil Engineering Designer — Mullins, LLC",
    text: "Designing land-development infrastructure packages — roadway layout, site grading, stormwater systems, and utility plans — and managing submittals, utility coordination, and permitting milestones across concurrent developments."
  },
  {
    when: "June 2025",
    date: "2025-06-01",
    state: "past",
    thread: "life",
    title: "Proposed to Mrs. Taylor",
    text: "Asked the love of my life if she wanted to keep this journey going forever. She said 'Yes' and we couldn't stop smiling."
  },
  {
    when: "July 2024",
    date: "2024-07-01",
    state: "past",
    thread: "life",
    title: "Purchased First Home",
    text: "Purchased my first home at the age of 25 in Pensacola, FL. Laying a foundation to start a family and begin building equity in a home and city I love."
  },
  {
    when: "May 2021 – July 2025",
    date: "2021-05-01",
    state: "past",
    thread: "work",
    title: "Designer — McKim & Creed",
    text: "Supported land-development and municipal utility projects under licensed Professional Engineers, managing production for 10+ concurrent water, wastewater, storm drainage, and commercial site projects and resolving utility conflicts before construction."
  },
  {
    when: "December 2020",
    date: "2020-12-01",
    state: "past",
    thread: "education",
    title: "B.S. Mathematics",
    text: "Graduated with a mathematics degree and a minor in statistics, building the analytical structure, discipline, and reasoning that still inform my work."
  },
  {
    when: "September 2020",
    date: "2020-09-01",
    state: "past",
    thread: "life",
    title: "Started Dating Mrs. Taylor",
    text: "Made the girl of my dreams my girlfriend. A moment that changed my life forever."
  },
  {
    when: "July 2020 – May 2021",
    date: "2020-07-01",
    state: "past",
    thread: "work",
    title: "CAD Drafter — FlynnBuilt",
    text: "Drafted for a Pensacola custom home builder, developing 20+ home elevations and floor plans and cutting design turnaround time by 50%."
  }
];

/*
  LIFE CHAPTERS — each milestone is labelled with the chapter whose
  [from, to] range (YYYY-MM) contains its `date`; the chapter chips on
  Life & Interests filter by them. Add a chapter or move a boundary here.
  (`summary` is shown when a chapter chip is selected.)
*/
const lifeChapters = [
  {
    numeral: "I",
    title: "Foundations",
    from: "2020-01", to: "2021-04",
    summary: "A math degree, a drafting table at a custom home builder, and meeting the woman who would become my wife."
  },
  {
    numeral: "II",
    title: "Learning the trade",
    from: "2021-05", to: "2025-06",
    summary: "Four years at McKim & Creed, a first home in Pensacola, and a proposal."
  },
  {
    numeral: "III",
    title: "Engineer Intern",
    from: "2025-07", to: "2026-08",
    summary: "A new role at Mullins, the FE exam, a wedding, a second degree, and the first section of the book."
  },
  {
    numeral: "IV",
    title: "What comes next",
    from: "2026-09", to: "2027-12",
    summary: "Writing the book, sitting for the Civil PE exam, and publishing through ZT, LLC."
  }
];
