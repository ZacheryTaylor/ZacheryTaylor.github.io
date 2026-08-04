const projects = [
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
    date: "Podcast\nActive",
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
