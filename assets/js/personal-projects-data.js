const projects = [
{
  id: "quote-bank-export",
  type: "Learning",
  date: "Personal Knowledge\n2020–Present",
  title: "Quote Bank Export",

  cardDescription:
    "A curated archive of handwritten quotes that shaped my thinking, preserved for future writing, review, and inclusion in my own book.",

  coverImage: "images/personal/Quotes.png",
  coverAlt: "Quote bank flashcard and log interface",

  description:
    "Quote Bank Export is the home for the lines that were worth stopping to write down by hand. Pulled from more than a hundred books, these quotes mark ideas that changed how I see money, work, engineering, and life. The project keeps those highlights together in one place so they can influence my writing style, show up in future chapters of my own book, and stay available for focused review instead of getting lost in old notebooks.",

  summary: [
    {
      heading: "Handwritten highlights",
      text:
        "Collect the passages I cared enough to copy by hand—moments that felt important, clarifying, or worth carrying forward beyond the first read."
    },
    {
      heading: "Reading distilled",
      text:
        "Filter more than a hundred books down to the quotes that actually stuck, turning scattered margins and notebooks into a single, coherent record of what mattered."
    },
    {
      heading: "Writing influence",
      text:
        "Use the quote bank as a reference for tone, structure, and ideas that inform my own style, helping future essays and book chapters stay rooted in the lessons that impacted me most."
    },
    {
      heading: "Future review",
      text:
        "Return to these pages when planning, drafting, or reassessing direction, treating the archive as a personal library of reminders, principles, and questions to revisit over time."
    }
  ],
  
    links: [
      {
        label: "Export quote bank to PDF",
        href: "#quote-bank-export",
        primary: true,
        id: "quote-export-pdf"
      }
    ]
  },
  {
    id: "bestball-archive",
    type: "Journey",
    date: "Fantasy Football\n2021–Present",
    title: "Best Ball Archive",

    cardDescription:
      "A season-by-season archive of Best Ball entries, contest advancement, strategy development, research, and results.",

    coverImage:
      "images/personal/fantasy/bestball/BBallArchive.png",
    coverAlt:
      "Timeline of Best Ball participation",
    
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
    id: "dynasty-dimwits-podcast",
    type: "Host",
    date: "Podcast\n2022-Present",
    title: "Dynasty Dimwits Podcast",

    cardDescription:
      "An ongoing interview-led podcast that keeps a dynasty fantasy-football league connected, active, and engaged throughout the year.",

    coverImage: "images/personal/Dimwits.png",
    coverAlt:
      "Dynasty Dimwits Podcast Logo",
      
    description:
      "Dynasty Dimwits Podcast is an ongoing show built for the Dynasty Dimwits Fantasy Football League. Hosted by Zach Taylor, each episode brings a different league member into a guided conversation about dynasty football, league activity, current events, and the personalities that make the league competitive and connected.",

    summary: [
      {
        heading: "Purpose",
        text:
          "Create a recurring space for league members to stay connected, share perspectives, and remain engaged beyond the weekly fantasy-football matchup."
      },
      {
        heading: "Host format",
        text:
          "Host and guide each episode as a different league member joins the show, giving the guest room to explain opinions, decisions, league experiences, and their approach to dynasty football."
      },
      {
        heading: "League engagement",
        text:
          "Use conversations to keep members involved throughout the year, maintain relationships across the league, and generate new discussion around trades, roster decisions, and league storylines."
      },
      {
        heading: "Ongoing archive",
        text:
          "The podcast continues to grow as new members join the conversation and new league developments create fresh topics to explore."
      }
    ],

    links: [
      {
        label: "Listen on Spotify",
        href: "https://open.spotify.com/show/52Uebn7h8aZh7mfiX1vBZt",
        primary: true,
        newTab: true
      }
    ]
  },

  {
    id: "bestball-value-surplus",
    type: "Data Analysis",
    date: "Fantasy Football\n2026",
    title: "Best Ball Value Surplus Tracker",
  
    cardDescription:
      "A slot-adjusted Best Ball draft tool that measures ADP value gained or lost against a snake-draft baseline.",
  
    coverImage:
      "images/personal/fantasy/bestball/BBallValueSurplus.png",
    coverAlt:
      "Best Ball draft value surplus tracker with ADP data and pick-value analysis",
  
    description:
      "A personal Best Ball draft analysis tool built to evaluate the value captured by a roster relative to its exact snake-draft position. Instead of treating every ADP difference equally, the tracker converts ADP into a nonlinear value curve that assigns greater importance to early-round selections. It maps the pick sequence for a selected draft slot, pulls the ADP of each drafted player from a live Big Board, and compares the roster’s cumulative actual value with the value expected from drafting exactly at ADP.",
  
    summary: [
      {
        heading: "Slot-adjusted baseline",
        text:
          "Calculates the full snake-draft pick sequence for a selected 12-team draft slot, creating an expected baseline based on the overall picks available to that roster in every round."
      },
      {
        heading: "Nonlinear ADP value",
        text:
          "Uses an exponential decay curve to translate ADP into pick value, recognizing that value differences near the top of a Best Ball draft matter more than the same ADP difference in later rounds."
      },
      {
        heading: "Automated ADP lookup",
        text:
          "Connects the draft tracker to a Big Board where drafted players are marked by overall pick number, allowing the sheet to retrieve each selected player’s ADP automatically during or after a draft."
      },
      {
        heading: "Cumulative scoring",
        text:
          "Builds running baseline and actual-value totals after every selection, making it possible to see when a roster gained or lost value as the draft developed."
      },
      {
        heading: "Value Surplus Percentage",
        text:
          "Compares actual cumulative value against the slot-specific baseline and expresses the difference as a normalized percentage, allowing teams drafted from different starting positions to be evaluated on the same scale."
      },
      {
        heading: "Model calibration",
        text:
          "Uses an adjustable decay constant to control how heavily the model weights early-round value. Testing across completed teams showed that a value near 0.08 creates meaningful separation without allowing one early reach or value pick to overwhelm the full-draft result."
      },
      {
        heading: "Draft review",
        text:
          "Supports a more disciplined post-draft review by separating ADP value from other strategic decisions, including correlation, uniqueness, positional structure, and player conviction."
      }
    ]
  },
  
  {
    id: "fantasy-cooccurrence",
    type: "Data Analysis",
    date: "Fantasy Football\n2025",
    title: "Best Ball Co-Occurrence Matrix",

    cardDescription:
      "A Google Sheets–based Best Ball portfolio tool that maps how often players appear together across completed drafts.",

    coverImage:
      "images/personal/fantasy/bestball/BBallCooccurrence.png",
    coverAlt:
      "Data visualization representing a Best Ball player co-occurrence matrix",

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
  },

  {
    id: "bestball-draft-valuation",
    type: "Data Analysis",
    date: "Fantasy Football\n2025",
    title: "Best Ball Draft Valuation & Stack Analysis",

    cardDescription:
      "A spreadsheet-based draft review tool that combines ADP-based draft value with a weighted measure of Week 17 game-stack strength.",

    coverImage: "images/personal/fantasy/bestball/BBallValue.png",
    coverAlt:
      "Mathematical data visualization representing Best Ball draft valuation and stack analysis",

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
  },

    {
    id: "bestball-drafting-plan",
    type: "Portfolio Management",
    date: "Fantasy Football\n2025",
    title: "Best Ball Drafting Plan",

    cardDescription:
      "A phase-based drafting tracker that sets entry-volume and spending targets across the Best Ball offseason.",
      
    coverImage: "images/personal/fantasy/bestball/BBallTracker.png",
    coverAlt:
      "Offseason tracker for teams drafted based on quatity and price evaluation",
      
    description:
      "A spreadsheet-based planning tool used to set a deliberate Best Ball drafting schedule before and throughout the offseason. The tracker separates the calendar into defined draft windows, assigns target entries and budget by contest, and monitors progress against the plan. Its purpose is to keep portfolio construction intentional rather than allowing short-term excitement, changing ADP, or the slow pace of the offseason to dictate entry volume.",

    summary: [
      {
        heading: "Draft windows",
        text:
          "Organizes the offseason into defined phases, from the pre-NFL Draft period through schedule release, late summer, and the final pre-season drafting window."
      },
      {
        heading: "Entry targets",
        text:
          "Sets a rough target number of entries for each contest within each phase, creating an actionable draft-volume plan instead of deciding every entry in the moment."
      },
      {
        heading: "Budget control",
        text:
          "Tracks entry fees, total planned spend, completed drafts, remaining drafts, and completion percentages to keep spending and volume aligned with the intended portfolio."
      },
      {
        heading: "Phase allocation",
        text:
          "Summarizes draft count and dollar exposure by phase, making it easier to compare early, post-draft, and late-offseason allocation."
      },
      {
        heading: "Decision discipline",
        text:
          "Creates structure against two opposing risks: drafting too aggressively during high-interest periods and falling behind the intended pace when the offseason feels slow or uncertain."
      },
      {
        heading: "Flexible framework",
        text:
          "Acts as a guide rather than a rigid rulebook, leaving room to adjust when contest availability, ADP movement, player news, or a clear strategic edge changes the original plan."
      }
    ]
  },

      {
    id: "break-starter-podcast",
    type: "Co-Host",
    date: "Podcast\n2020–2023",
    title: "Break Starter Podcast",

    cardDescription:
      "A weekly NBA basketball podcast blending current events, theory crafting, creative analysis, and long-form discussion.",

    coverImage: "images/personal/BreakStarter.png",
    coverAlt:
      "Break Starter Podcast Logo",
        
    description:
      "Break Starter Podcast is a weekly NBA basketball show co-hosted by Sean Philson and Zach Taylor. The show combines coverage of current league developments with theory crafting, creative discussion, and a broader analytical perspective shaped by more than 24 years of combined basketball knowledge.",

    summary: [
      {
        heading: "Concept",
        text:
          "A weekly NBA-focused podcast built to go beyond headline recaps by pairing current basketball conversation with original ideas, hypothetical scenarios, and creative theory crafting."
      },
      {
        heading: "Co-hosting",
        text:
          "Co-hosted the show alongside Sean Philson, sharing responsibility for episode discussion, topic development, league analysis, and the overall direction of the podcast."
      },
      {
        heading: "Format",
        text:
          "Episodes examine the NBA’s weekly events while leaving room for broader player, team-building, league-history, and basketball-theory conversations."
      },
      {
        heading: "Archive",
        text:
          "Published 165 episodes, creating a substantial body of long-form basketball discussion and collaborative media work."
      }
    ],

    links: [
      {
        label: "Listen on Spotify",
        href: "https://open.spotify.com/show/1nuAoiG4IdKHW1okwsYqX7",
        primary: true,
        newTab: true
      }
    ]
  }
  
];
