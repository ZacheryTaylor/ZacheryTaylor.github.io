const projects = [
  {
    id: "bestball-archive",
    type: "Fantasy Football",
    date: "2021–Present",
    title: "BestBall Archive",

    placeholder: true,

    cardDescription:
      "A season-by-season archive of BestBall entries, contest advancement, strategy development, research, and results.",

    description:
      "A long-term BestBall research archive documenting contest participation, drafting theory, decision-making, tournament advancement, and post-season lessons. The archive began with small-stakes entries in 2021 and has developed into a structured record of strategy, research, and performance.",

    summary: [
      {
        heading: "History",
        text:
          "Track annual entries, tournament formats, advancement results, and milestones from 2021 onward."
      },
      {
        heading: "Theory",
        text:
          "Document roster construction, player correlation, draft timing, ADP, contest selection, and exposure ideas."
      },
      {
        heading: "Research",
        text:
          "Connect season review to supporting tools such as player co-occurrence and draft-value analysis."
      },
      {
        heading: "Current focus",
        text:
          "Maintain a clean 2026 record while preserving prior seasons in an expandable historical timeline."
      }
    ],

    links: [
      {
        label: "Open BestBall Timeline",
        href: "bestball.html",
        primary: true
      }
    ]
  },

  {
    id: "fantasy-cooccurrence",
    type: "Fantasy Research",
    date: "Ongoing",
    title: "Fantasy Co-Occurrence Matrix",

    placeholder: true,

    cardDescription:
      "A spreadsheet-based research tool for examining repeated player relationships and correlations across fantasy-football datasets.",

    description:
      "A personal fantasy-football research project that organizes player relationships into a co-occurrence matrix. It supports analysis of repeated player pairings, team environments, stacking patterns, and relationships worth evaluating in BestBall drafts.",

    summary: [
      {
        heading: "Purpose",
        text:
          "Explore which player combinations and team relationships occur together across selected fantasy-football data."
      },
      {
        heading: "Format",
        text:
          "A spreadsheet-based matrix that can be updated, filtered, and expanded as new seasons or research ideas are added."
      },
      {
        heading: "Use case",
        text:
          "Support BestBall research with a structured way to review correlation, stacking, and player-pairing ideas."
      }
    ]

    /*
      Add a `links` array here later only when the spreadsheet,
      PDF, or a public project page is ready.

      Example:

      links: [
        {
          label: "Open Research Tool",
          href: "files/personal/fantasy-cooccurrence.xlsx",
          primary: true,
          newTab: true
        }
      ]
    */
  }
];
