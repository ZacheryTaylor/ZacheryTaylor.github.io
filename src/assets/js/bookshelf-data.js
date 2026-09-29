/*
  BOOKSHELF — the books behind the quote bank (bookshelf.html).
  --------------------------------------------------------------
  Seeded from the `origin` of entries in quotes-data.js. Quote counts, the
  year each book first shows up in the quote bank, and the sample quote are
  all computed at build time from quotes-data.js, so they stay in sync.

  To add a book: copy an entry. `origin` must match the quote bank's origin
  text exactly if you want its quotes counted and linked.
  Optional fields: note: "why it mattered", status: "reading" (shows a badge).
*/

const bookshelf = {
  shelves: [
    { id: "money", title: "Money & investing" },
    { id: "business", title: "Business & building" },
    { id: "mind", title: "Mind, decisions & the future" }
  ],
  books: [
    { shelf: "money", title: "Rich Dad Poor Dad", author: "Robert T. Kiyosaki", origin: "Robert T. Kiyosaki, Rich Dad Poor Dad" },
    { shelf: "money", title: "Common Stocks and Uncommon Profits", author: "Philip A. Fisher", origin: "Philip A. Fisher, Common Stocks and Uncommon Profits" },
    { shelf: "money", title: "Conservative Investors Sleep Well", author: "Philip A. Fisher", origin: "Philip A. Fisher, Conservative Investors Sleep Well" },
    { shelf: "money", title: "Developing an Investment Philosophy", author: "Philip A. Fisher", origin: "Philip A. Fisher, Developing an Investment Philosophy" },
    { shelf: "money", title: "Invested", author: "Danielle Town", origin: "Danielle Town, Invested" },
    { shelf: "money", title: "I Will Teach You To Be Rich", author: "Ramit Sethi", origin: "Ramit Sethi, I Will Teach You To Be Rich" },
    { shelf: "money", title: "The Richest Man in Babylon", author: "George S. Clason", origin: "George S. Clason, The Richest Man in Babylon" },
    { shelf: "money", title: "Think and Grow Rich", author: "Napoleon Hill", origin: "Napoleon Hill, Think and Grow Rich" },

    { shelf: "business", title: "Zero to One", author: "Peter Thiel", origin: "Peter Thiel, Zero to One" },
    { shelf: "business", title: "Getting More", author: "Stuart Diamond", origin: "Stuart Diamond, Getting More" },
    { shelf: "business", title: "The Innovator's Dilemma", author: "Clayton M. Christensen", origin: "Clayton M. Christensen, The Innovator's Dilemma" },
    { shelf: "business", title: "Rework", author: "Jason Fried & David Hansson", origin: "Jason Fried & David Hansson, Rework" },
    { shelf: "business", title: "Change is Good... You Go First", author: "Mac Anderson & Tom Feltenstein", origin: "Mac Anderson & Tom Feltenstein, Change is Good... You Go First" },

    { shelf: "mind", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", origin: "Daniel Kahneman, Thinking, Fast and Slow" },
    { shelf: "mind", title: "Thinking in Bets", author: "Annie Duke", origin: "Annie Duke, Thinking in Bets" },
    { shelf: "mind", title: "Predictably Irrational", author: "Dan Ariely", origin: "Dan Ariely, Predictably Irrational" },
    { shelf: "mind", title: "Reboot", author: "Jerry Colonna", origin: "Jerry Colonna, Reboot" },
    { shelf: "mind", title: "Superintelligence", author: "Nick Bostrom", origin: "Nick Bostrom, Superintelligence" }
  ]
};
