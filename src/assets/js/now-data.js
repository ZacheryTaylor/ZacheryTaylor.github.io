/*
  NOW — what I'm focused on right now (now.html). Inspired by nownownow.com.
  -------------------------------------------------------------------------
  Update `updated` whenever you edit this file; it's shown on the page.
  status: "active" | "scheduled" | "ongoing"
*/

const now = {
  updated: "2026-09-29",
  location: "Pensacola, Florida",

  focus: [
    {
      label: "Licensure",
      title: "Preparing for the Civil PE exam",
      text: "Studying for the Civil Principles and Practice of Engineering exam, scheduled for January 2027. Passed the FE in December 2025 and working as an Engineer Intern in the meantime.",
      status: "scheduled",
      when: "Exam · Jan 2027"
    },
    {
      label: "Writing",
      title: "Writing the book",
      text: "Section I is complete. Working through the rest of the manuscript on vision, curiosity, and relationships, with self-publishing planned for early 2027. The title is still undecided.",
      status: "active",
      when: "Target · early 2027",
      href: "/book.html"
    },
    {
      label: "Company",
      title: "ZT, LLC",
      text: "Building out ZT, LLC, my single-member company in Pensacola, as the publisher for the book and a home for long-term projects.",
      status: "ongoing",
      when: "Pensacola, FL"
    },
    {
      label: "Work",
      title: "Civil Engineering Designer at Mullins, LLC",
      text: "Designing land-development packages: roadway layout, site grading, stormwater systems, and utility plans. Also coordinating submittals, utilities, and permitting across concurrent developments.",
      status: "active",
      when: "Since Jul 2025",
      href: "/civil.html"
    }
  ],

  recently: [
    { when: "July 2026", text: "Finished Section I of the book." },
    { when: "May 2026", text: "Graduated from UWF with a B.S. in Mechanical Engineering." },
    { when: "January 2026", text: "Married Mrs. Taylor." },
    { when: "December 2025", text: "Passed the FE exam and became an Engineer Intern (EI)." }
  ]
};
