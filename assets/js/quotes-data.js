/*
  QUOTE BANK
  ----------
  Add a new entry by copying the template below and pasting it inside the
  quoteBank array. Keep the trailing comma after each entry except you may
  leave one on the last entry too -- trailing commas are safe in JS arrays.

  TEMPLATE:
  {
    id: "q000",              // unique id, just increment the number
    quote: "The quote text goes here.",
    origin: "Author / Book / Context",
    date: "2026-08-04",       // date you logged it, YYYY-MM-DD
    tags: ["discipline", "engineering"], // optional, used by search
    favorite: false           // set true to pre-star it
  }
*/

const quoteBank = [
  {
    id: "q001",
    quote: "Discipline equals freedom.",
    origin: "Jocko Willink",
    date: "2026-01-04",
    tags: ["discipline", "mindset"],
    favorite: true
  },
  {
    id: "q002",
    quote: "The obstacle is the way.",
    origin: "Marcus Aurelius, Meditations",
    date: "2026-02-11",
    tags: ["stoicism", "adversity"],
    favorite: false
  },
  {
    id: "q003",
    quote: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.",
    origin: "Stephen King, On Writing",
    date: "2026-03-02",
    tags: ["work ethic", "creativity"],
    favorite: true
  }
];
