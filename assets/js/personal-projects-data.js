const projects = [
  {
    id: "fantasy-cooccurrence-matrix",
    type: "Data Analysis",
    date: "Personal Project\n2026",
    title: "Fantasy Football Co-Occurrence Matrix",

    cardDescription:
      "A data-analysis tool that identifies player pairings, roster overlap, and recurring co-occurrence patterns across fantasy-football datasets.",

    coverImage:
      "images/personal/fantasy-cooccurrence/fantasy-cooccurrence-cover.png",

    coverAlt:
      "Heat map showing player co-occurrence patterns in a fantasy football dataset",

    description:
      "An independent data-analysis project that organizes fantasy-football records into a co-occurrence matrix to explore player relationships, recurring combinations, and draft or roster patterns.",

    summary: [
      {
        heading: "Objective",
        text:
          "Identify meaningful player pairings and repeated associations within the selected fantasy-football data."
      },
      {
        heading: "Method",
        text:
          "Cleaned source data, constructed a player-by-player co-occurrence matrix, and evaluated the results with tables and visualizations."
      },
      {
        heading: "Deliverables",
        text:
          "An Excel workbook, supporting data files, visualizations, and a short explanation of the analysis."
      }
    ],

    gallery: [
      {
        src:
          "images/personal/fantasy-cooccurrence/matrix-heatmap.png",
        alt:
          "Heat map visualizing player co-occurrence values in the fantasy football dataset",
        caption:
          "Co-occurrence heat map for the selected player dataset."
      },
      {
        src:
          "images/personal/fantasy-cooccurrence/workbook-preview.png",
        alt:
          "Spreadsheet view of the fantasy football co-occurrence matrix",
        caption:
          "Workbook output containing the player co-occurrence matrix."
      }
    ],

    downloads: [
      {
        label: "Download Excel Workbook",
        href:
          "files/personal/fantasy-cooccurrence/fantasy-cooccurrence-matrix.xlsx",
        download: true
      },
      {
        label: "Download CSV Data",
        href:
          "files/personal/fantasy-cooccurrence/fantasy-cooccurrence-matrix.csv",
        download: true
      }
    ]
  }
];
