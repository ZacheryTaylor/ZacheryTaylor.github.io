/*
  RÉSUMÉ — drives the HTML résumé at /resume.html (which prints to a clean,
  one-page PDF). Wording mirrors resume.pdf; keep the two in step when either
  changes. The PDF stays available at /resume.pdf.
  Phone and email are left out of the web page on purpose (they're in the
  PDF); the page links to the contact form and vCard instead.
*/
const resume = {
  name: "Zachery Taylor",
  credential: "EI",
  headline: "Civil Engineering Designer · Engineer Intern",
  location: "Pensacola, FL",
  linkedin: "https://www.linkedin.com/in/zacheryalexandertaylor",
  linkedinLabel: "linkedin.com/in/zacheryalexandertaylor",

  summary:
    "Civil Engineering Designer and Engineer Intern with 5+ years of experience supporting land development, utility coordination, and municipal infrastructure projects. Experienced in commercial site design, subdivision design, grading, stormwater management, and water/wastewater systems using AutoCAD Civil 3D, HydroCAD, and Bluebeam, with a track record of managing multiple project deadlines and coordinating with engineers, reviewers, and contractors. Brings additional mechanical design strength through prototype development, SOLIDWORKS, and cross-disciplinary project leadership.",

  experience: [
    {
      role: "Civil Engineering Designer",
      org: "Mullins, LLC",
      orgType: "Civil Engineering Firm",
      start: "2025-07", end: "", dates: "07/2025 – Present",
      location: "Pensacola, FL",
      points: [
        "Designed land development infrastructure packages including roadway layout, site grading, stormwater systems, and utility plans in compliance with local and municipal standards.",
        "Coordinated with contractors and internal design teams to resolve field conditions, design revisions, and constructability issues during active project phases.",
        "Managed project deadlines, plan submittals, utility coordination tasks, and permitting milestones across multiple concurrent developments."
      ]
    },
    {
      role: "Designer",
      org: "McKim & Creed",
      orgType: "Civil Engineering Firm",
      start: "2021-05", end: "2025-07", dates: "05/2021 – 07/2025",
      location: "Pensacola, FL",
      points: [
        "Supported land development and municipal utility projects, managing production schedules and deliverables for 10+ concurrent water, wastewater, storm drainage, and commercial site civil projects under licensed Professional Engineers.",
        "Performed utility conflict analysis to identify and resolve interferences among proposed storm, sewer, water, and electrical features from various design teams prior to construction."
      ]
    },
    {
      role: "Computer Aided Design Drafter",
      org: "FlynnBuilt",
      orgType: "Custom Home Builder",
      start: "2020-07", end: "2021-05", dates: "07/2020 – 05/2021",
      location: "Pensacola, FL",
      points: [
        "Reduced design turnaround time by 50% and developed 20+ home elevations and floorplans."
      ]
    }
  ],

  projects: [
    {
      name: "Electric Jet-Driven Surfboard",
      dates: "2025 – 2026",
      points: [
        "Designed and developed an electric jet-driven surfboard prototype with a modular propulsion unit, using CAD-based design, component integration, and system packaging to balance manufacturability, maintenance access, structural constraints, and future upgrades."
      ]
    },
    {
      name: "SAE Baja – Executive Board / Treasurer",
      dates: "2025 – Present",
      points: [
        "Secured $28,000 in record funding through grant writing and outreach initiatives while establishing long-term team stability by creating a UWF Foundation account and formalizing SGA club status."
      ]
    }
  ],

  education: {
    school: "University of West Florida",
    location: "Pensacola, FL",
    degrees: [
      { name: "Bachelor of Science in Mechanical Engineering", year: "2026" },
      { name: "Bachelor of Science in Mathematics, Minor in Statistics", year: "2020" }
    ],
    honors: "GPA (Program): 3.46 (3.91) | President’s List (7 semesters), Dean’s List (4 semesters)"
  },

  licensure: [
    { name: "Engineer Intern (EI)", detail: "FE exam passed December 2025" }
  ],

  skills: [
    { group: "Design & Drafting", items: ["AutoCAD Civil 3D", "Inventor", "AutoCAD", "SOLIDWORKS (CSWA)", "Bluebeam"] },
    { group: "Analysis & Simulation", items: ["HydroCAD", "AutoTurn", "ANSYS Fluent", "MATLAB", "Multisim"] },
    { group: "Programming", items: ["Arduino (C++)", "Python", "JavaScript", "SAS", "Microsoft Office Suite"] }
  ]
};
