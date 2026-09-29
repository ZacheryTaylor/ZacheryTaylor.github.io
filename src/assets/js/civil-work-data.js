/*
  CIVIL WORK — content for civil.html and the home-page Civil Work section.
  -------------------------------------------------------------------------
  Scope is described generically on purpose: client and project names stay
  private unless they are already public and cleared to share.
  Licensing note: this describes work performed as a designer / Engineer
  Intern under licensed Professional Engineers — not engineering services
  offered to the public.
*/

const civilWork = {
  summary:
    "Five-plus years in civil site design and drafting in Pensacola — land development, utility coordination, and municipal infrastructure, delivered under licensed Professional Engineers.",

  projectTypes: [
    "Commercial site design",
    "Subdivision design",
    "Municipal water & wastewater",
    "Storm drainage",
    "Custom residential"
  ],

  scope: [
    {
      code: "C-100",
      title: "Site layout & roadway",
      text: "Roadway layout and site plans for land-development packages, drawn to local and municipal standards."
    },
    {
      code: "C-200",
      title: "Grading & stormwater",
      text: "Site grading and stormwater management systems, modeled in HydroCAD and produced in AutoCAD Civil 3D."
    },
    {
      code: "C-300",
      title: "Water, sewer & storm utilities",
      text: "Utility plans for commercial sites, subdivisions, and municipal water, wastewater, and storm drainage projects."
    },
    {
      code: "C-400",
      title: "Utility conflict analysis",
      text: "Finding and resolving interferences among proposed storm, sewer, water, and electrical features from different design teams — before they reach construction."
    },
    {
      code: "C-500",
      title: "Production, submittals & permitting",
      text: "Running production schedules, plan submittals, utility coordination, and permitting milestones across many concurrent developments — 10+ at a time at McKim & Creed."
    },
    {
      code: "C-600",
      title: "Construction-phase support",
      text: "Working with contractors and internal design teams to resolve field conditions, design revisions, and constructability issues while projects are active."
    }
  ],

  roles: [
    {
      role: "Civil Engineering Designer",
      firm: "Mullins, LLC",
      firmType: "Civil engineering firm",
      dates: "07/2025 – Present",
      location: "Pensacola, FL",
      points: [
        "Design land-development infrastructure packages including roadway layout, site grading, stormwater systems, and utility plans in compliance with local and municipal standards.",
        "Coordinate with contractors and internal design teams to resolve field conditions, design revisions, and constructability issues during active project phases.",
        "Manage project deadlines, plan submittals, utility coordination tasks, and permitting milestones across multiple concurrent developments."
      ]
    },
    {
      role: "Designer",
      firm: "McKim & Creed",
      firmType: "Civil engineering firm",
      dates: "05/2021 – 07/2025",
      location: "Pensacola, FL",
      points: [
        "Supported land development and municipal utility projects, managing production schedules and deliverables for 10+ concurrent water, wastewater, storm drainage, and commercial site civil projects under licensed Professional Engineers.",
        "Performed utility conflict analysis to identify and resolve interferences among proposed storm, sewer, water, and electrical features from various design teams prior to construction."
      ]
    },
    {
      role: "Computer Aided Design Drafter",
      firm: "FlynnBuilt",
      firmType: "Custom home builder",
      dates: "07/2020 – 05/2021",
      location: "Pensacola, FL",
      points: [
        "Reduced design turnaround time by 50% and developed 20+ home elevations and floorplans."
      ]
    }
  ],

  tools: {
    "Design & drafting": ["AutoCAD Civil 3D", "AutoCAD", "Bluebeam", "Inventor", "SOLIDWORKS (CSWA)"],
    "Analysis": ["HydroCAD", "AutoTurn", "ANSYS Fluent", "MATLAB"],
    "Programming": ["Python", "JavaScript", "Arduino (C++)", "SAS"]
  },

  /*
    PROJECTS — the civil project gallery on civil.html (and the home page).
    Same shape as academic-projects-data.js: every entry with a `title`
    becomes a card plus its own page at /projects/<id>/, with the quick view,
    photo gallery, PDF and links handled exactly like the academic projects.
    Leave `title` empty and the slot renders as a blank "coming soon" plan
    sheet (keep `type` and `sheet` so the placeholder still reads right).
    Only add projects that are public / cleared to share.

    {
      id: "example-subdivision",            // URL: /projects/example-subdivision/
      sheet: "CS-01",
      type: "Subdivision",
      date: "Mullins, LLC\n2025",           // "\n" becomes " · "
      title: "Project name",
      cardDescription: "One sentence for the card.",
      coverImage: "images/civil/<file>.jpg",  // under src/ (optional)
      coverAlt: "What the cover shows",
      description: "A paragraph on the problem and what you designed.",
      summary: [ { heading: "Scope", text: "Grading, stormwater, utilities." },
                 { heading: "My role", text: "Designer under the EOR." } ],
      gallery: [ { src: "images/civil/<file>.jpg", alt: "...", caption: "..." } ],
      links: [ { label: "Project website", href: "https://..." } ],
      pdf: ""                                  // e.g. "pdfs/civil/<file>.pdf"
    }
  */
  projects: [
    { sheet: "CS-01", type: "Commercial site", title: "" },
    { sheet: "CS-02", type: "Subdivision", title: "" },
    { sheet: "CS-03", type: "Municipal utilities", title: "" }
  ],

  credentials: [
    { label: "Engineer Intern (EI)", detail: "FE exam passed December 2025" },
    { label: "Civil PE exam", detail: "Scheduled January 2027" },
    { label: "B.S. Mechanical Engineering", detail: "University of West Florida, 2026" },
    { label: "B.S. Mathematics, minor in Statistics", detail: "University of West Florida, 2020" }
  ]
};
