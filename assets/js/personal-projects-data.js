const projects = [
  {
    id: "bestball-archive",
    type: "Fantasy Football",
    date: "2021–Present",
    title: "Best Ball Archive",

    placeholder: true,

    cardDescription:
      "A season-by-season archive of Best Ball entries, contest advancement, strategy development, research, and results.",

    description:
      "A long-term Best Ball research archive documenting contest participation, drafting theory, decision-making, tournament advancement, and post-season lessons. The archive began with small-stakes entries in 2021 and has developed into a structured record of strategy, research, and performance.",

    summary: [
      {
        heading: "History",
        text:
          "Track annual entries, tournament formats, advancement results, payouts, and milestones from 2021 onward."
      },
      {
        heading: "Theory",
        text:
          "Document roster construction, player correlation, draft timing, ADP, contest selection, uniqueness, and exposure ideas."
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
        label: "Open Best Ball Timeline",
        href: "bestball.html",
        primary: true
      }
    ]
  },

  {
    id: "fantasy-cooccurrence",
    type: "Fantasy Research",
    date: "Ongoing",
    title: "Best Ball Co-Occurrence Matrix",

    image: "images/personal/fantasy/bestball/BBallCooccurrence.png",
    imageAlt:
      "Abstract data visualization representing a Best Ball player co-occurrence matrix",

    cardDescription:
      "A Google Sheets–based Best Ball portfolio tool that maps how often players appear together across completed drafts.",

    description:
      "A personal Best Ball research tool that converts completed roster data into a player-by-player co-occurrence matrix. Rather than only showing individual player exposure, it counts how often every pair of players appears together on the same roster. This provides a structured way to review intentional stacks, repeated player pairings, correlated exposure, and potential concentration risk across a draft portfolio.",

    summary: [
      {
        heading: "Purpose",
        text:
          "Evaluate portfolio relationships that are not visible in a standard exposure table, including which players repeatedly appear together across completed Best Ball rosters."
      },
      {
        heading: "Matrix method",
        text:
          "Each row and column represents a player. The value where two players intersect equals the number of completed teams containing both players; diagonal cells represent each player’s own roster count."
      },
      {
        heading: "Exposure context",
        text:
          "Player exposure percentages appear along both matrix axes so pair frequency can be evaluated alongside each player’s overall portfolio exposure."
      },
      {
        heading: "Visual analysis",
        text:
          "Conditional color scales highlight low, medium, and high co-occurrence values, while zero values are visually minimized to make meaningful player relationships easier to scan."
      },
      {
        heading: "Interactive review",
        text:
          "Spreadsheet controls support player lookup, metadata filtering, conditional highlighting, and column hiding to isolate specific player groups and pairing patterns."
      },
      {
        heading: "Use case",
        text:
          "Audit stacking patterns, identify repeated correlations, evaluate exposure concentration, and distinguish intentional roster construction from unintended portfolio overlap."
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
  },

  {
    id: "bestball-draft-valuation",
    type: "Fantasy Research",
    date: "Ongoing",
    title: "Best Ball Draft Valuation & Stack Analysis",

    image: "images/personal/fantasy/bestball/BBallValue.png",
    imageAlt:
      "Abstract mathematical data visualization representing Best Ball draft valuation and stack analysis",

    cardDescription:
      "A spreadsheet-based draft review tool that combines ADP-based draft value with a weighted measure of Week 17 game-stack strength.",

    description:
      "A Best Ball draft-analysis tool designed to review two distinct parts of roster construction: the value captured at each draft pick relative to player ADP, and the quality of Week 17 game correlations within the final roster. Together, the calculations provide a repeatable framework for comparing completed drafts, reviewing draft process, and identifying strengths or tradeoffs in portfolio construction.",

    summary: [
      {
        heading: "Draft Value Score",
        text:
          "Calculates the cumulative value gained or lost across a completed roster by comparing each player’s ADP with the pick used to select that player. The score uses a logarithmic transformation so draft value is measured proportionally rather than treating every pick difference as equal."
      },
      {
        heading: "Formula",
        text:
          "For each drafted player, the calculation compares log(ADP + 10) against log(Pick + 10), then sums the results and multiplies by 100 for readability. Drafting a player after their ADP contributes positive value; drafting before ADP reduces the score."
      },
      {
        heading: "Why the offset matters",
        text:
          "Adding 10 inside each logarithm prevents an undefined log(0) calculation and stabilizes the score for early-round selections, where small pick differences should not overwhelm the full-draft evaluation."
      },
      {
        heading: "Week 17 Stack Value",
        text:
          "Measures game-correlation strength by assigning position weights to players included in Week 17 game stacks. Higher scores indicate more or stronger stack combinations designed to increase access to the ceiling outcomes that matter in Best Ball playoff weeks."
      },
      {
        heading: "Position weights",
        text:
          "The stack calculation currently applies weights of 2.0 for quarterbacks, 1.5 for wide receivers, 1.2 for running backs, and 1.3 for tight ends. These weights reflect the differing roles each position can play in creating a correlated game environment."
      },
      {
        heading: "Score guide",
        text:
          "A score of 0 indicates no game stacks; 1–3.5 represents a weak or low-impact stack; 4–6 indicates one solid stack; 6.5–9 reflects strong stacking; and 9.5 or higher represents multiple strong stacks."
      },
      {
        heading: "Draft review",
        text:
          "The tool is used as a review framework, not a standalone ranking system. A strong draft can sacrifice some ADP value for roster uniqueness, structural requirements, player conviction, or a higher-quality Week 17 correlation profile."
      }
    ]
  }
];
