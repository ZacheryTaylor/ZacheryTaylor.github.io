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
    quote: "There is a difference between being poor and being broke. Broke is temporary. Poor is eternal.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q002",
    quote: "Learn from the push [of life] and move on.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["adversity"],
    favorite: false
  },
  {
    id: "q003",
    quote: "You're only poor if you give up.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q004",
    quote: "You wanted to win, but the fear of losing was greater than the excitement of winning.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q005",
    quote: "Learn to use your emotions to think, not think with your emotions.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["psychology"],
    favorite: false
  },
  {
    id: "q006",
    quote: "A job is only a short-term solution to a long-term problem.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q007",
    quote: "Rich people acquire assets. The poor and middle class acquire liabilities that they think are assets.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q008",
    quote: "Don't be too proud to admit something doesn't make sense.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["learning"],
    favorite: true
  },
  {
    id: "q009",
    quote: "Money only accentuates the cash-flow pattern running in your head.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q010",
    quote: "Financial Aptitude - what you do with your money once you make it.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["assets"],
    favorite: true
  },
  {
    id: "q011",
    quote: "If you have dug yourself into a hole... stop digging.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q012",
    quote: "The fear of being different prevents most people from seeking new ways to solve their problems.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q013",
    quote: "An intelligent person hires people who are more intelligent than they are.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q014",
    quote: "Schools are designed to create good employees, instead of employers.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["business","school"],
    favorite: false
  },
  {
    id: "q015",
    quote: "Don't let your expenses grow with your income.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q016",
    quote: "Wealth is a person's ability to survive so many number of days forward. If I stopped working today, how long could I survive?",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q017",
    quote: "I'm not in the hamburger business. My business is real estate. Now the largest single owner of real estate in the world, more than the Catholic Church.",
    origin: "Ray Kroc, McDonalds",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q018",
    quote: "Don't confuse your profession with your business.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q019",
    quote: "Financial struggle is often the result of people working all their lives for someone else.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q020",
    quote: "Acquire assets you LOVE. If you don't love it, you won't take care of it.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q021",
    quote: "Keep your day job, be a great hardworking employee, but keep building that asset column.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q022",
    quote: "An employee with a safe, secure job, without financial aptitude, has no escape.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q023",
    quote: "Invest in companies you wish you could buy, instead of just invest in.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q024",
    quote: "Each dollar in my asset column is a great employee, working hard to make more employees and buy the boss a new Porsche.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["assets","business"],
    favorite: false
  },
  {
    id: "q025",
    quote: "It was full of turmoil, and it was exciting.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["business","mindset"],
    favorite: false
  },
  {
    id: "q026",
    quote: "Don't just sit there and wait for the right opportunity to come your way.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q027",
    quote: "Money is not REAL.",
    origin: "ZT",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q028",
    quote: "The single most powerful asset we all have is our mind. If it is trained well, it can create enormous wealth.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q029",
    quote: "Plant seeds in your asset column.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q030",
    quote: "The problem with 'secure' investments is that they are often sanitized, that is, make so safe that the gains are less.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q031",
    quote: "Winners are not afraid of losing. But losers are. Failure is part of the process of success. People who avoid failure also avoid success.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q032",
    quote: "Learn how to put the pieces together.\n1. Find an opportunity that everyone else missed.\n2. Raise money.\n3. Organize smart people.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q033",
    quote: "Don't let the only skill you know to make money be to 'work hard'.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q034",
    quote: "Workers work hard enough to not be fired, and owners pay just enough so that workers won't quit.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q035",
    quote: "Seek work for what you'll learn, not what you'll earn.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["business","career"],
    favorite: true
  },
  {
    id: "q036",
    quote: "I have never met a rich person who has never lost money. If you hate risk and worry, start early",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q037",
    quote: "Invest in companies you wish you could buy, instead of just invest in.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q038",
    quote: "Everyone wants to go to Heaven, but no one wants to die.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q039",
    quote: "Failure inspires winners. Failure defeats losers.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q040",
    quote: "You play to win the game.",
    origin: "ZT",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q041",
    quote: "Overcoming Cynicism - Our doubts often paralyze us.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q042",
    quote: "Don't take risk advice from someone who hasn't dealt with that risk.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["assets","business"],
    favorite: false
  },
  {
    id: "q043",
    quote: "Overcoming Laziness - Don't be busy to stay busy, as a way of avoiding something you do not want to face.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["mindset"],
    favorite: true
  },
  {
    id: "q044",
    quote: "How can I afford to never work again?",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q045",
    quote: "Pay yourself FIRST.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q046",
    quote: "If I had paid myself last, I would have felt no pressure, but I'd be broke.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q047",
    quote: "If I pay myself first, I get financially stronger, mentally and fiscally.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q048",
    quote: "There is gold everywhere. Most people are not trained to see it.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q049",
    quote: "Don't wants: to be a slave to my job.\nto miss out on the world.\nto miss out on my kids lives.\nto work for money.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["assets"],
    favorite: true
  },
  {
    id: "q050",
    quote: "Buy the pie, and cut it in pieces. Most people look for what they can afford, so they look too small.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q051",
    quote: "Small people remain small because they think small; act alone or don't act at all.",
    origin: "Robert T. Kiyosaki, Rich Dad Poor Dad",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q052",
    quote: "The basic ideas of investing are to look at stocks as businesses, use market fluctuations to your advantage, and seek a Margin of Safety.",
    origin: "Danielle Town, Invested",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q053",
    quote: "You have to invest just to tread water. Saving loses you 3% every year.",
    origin: "Danielle Town, Invested",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q054",
    quote: "Conscious learning becomes unconscious knowledge.",
    origin: "Danielle Town, Invested",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q055",
    quote: "Your NUMBER is the amount of money you need saved before you can quit your job, if you want to.",
    origin: "Danielle Town, Invested",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q056",
    quote: "As a consumer, you vote every single day with your dollars. If you bought organic, it encouraged more organic.",
    origin: "Danielle Town, Invested",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q057",
    quote: "Vote for companies that have a mission to change the world for the better, not just the short-term bottom dollar.",
    origin: "Danielle Town, Invested",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q058",
    quote: "Efficient Market Hypothesis - The market constantly prices in information, therefore it is always 'accurate' to value.",
    origin: "Danielle Town, Invested",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q059",
    quote: "An Event - An unexpected, yet temporary and rectifiable, disaster that creates short-to-medium term uncertainty about the cash flow of a company.",
    origin: "Danielle Town, Invested",
    date: "2020",
    tags: ["assets","business"],
    favorite: false
  },
  {
    id: "q060",
    quote: "Circle of Competence:\nWhat do I vote for with my money?\nWhat am I passionate about?\nWhere do I make my money?",
    origin: "Danielle Town, Invested",
    date: "2020",
    tags: ["assets","business"],
    favorite: true
  },
  {
    id: "q061",
    quote: "Moat - A competitive advantage that cannot be seperated from their business and is difficult and/or expensive to overcome as a competitor or consumer.",
    origin: "Danielle Town, Invested",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q062",
    quote: "Moat #1: Brand\nSometimes created by being the first mover. The industry identified with them.",
    origin: "Danielle Town, Invested",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q063",
    quote: "Moat #2: Switching\nDifficult/expensive/painful to switch away. Apple iPhone, Laptop, iPad = you aren't buying a Samsung desktop.",
    origin: "Danielle Town, Invested",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q064",
    quote: "Moat #2.5: Network Effects\nIf your friend group or market is all using the same thing you won't change to leave them.",
    origin: "Danielle Town, Invested",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q065",
    quote: "Moat #3: Toll Bridge\nThe only product in a big niche. Typically via government regulation.",
    origin: "Danielle Town, Invested",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q066",
    quote: "Moat #4: Secrets\nPatents, trade secrets, or intellectual property. Similarly, something that isn't patented so that people can't reverse engineer it.",
    origin: "Danielle Town, Invested",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q067",
    quote: "Moat #5: Price\nA company is the low-cost provider because it can make something the cheapest. Costco can undercut almost all retailers because of how it buys/markets/sells products.",
    origin: "Danielle Town, Invested",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q068",
    quote: "Invest in a business an idiot could run, one day an idiot will.",
    origin: "Danielle Town, Invested",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q069",
    quote: "Margin of Safety - A price below the company's value that will protect us from most mistakes.",
    origin: "Danielle Town, Invested",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q070",
    quote: "Avoid regret, but ruthlessly assess why you made that mistake.",
    origin: "Danielle Town, Invested",
    date: "2020",
    tags: ["mindset","business"],
    favorite: true
  },
  {
    id: "q071",
    quote: "Be ready to run outside with a washtub when it's raining gold.",
    origin: "Warren Buffet",
    date: "2020",
    tags: ["business"],
    favorite: true
  },
  {
    id: "q072",
    quote: "Only sell when the STORY changes. Buy as if you will hold the company forever.",
    origin: "Danielle Town, Invested",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q073",
    quote: "Every credit card you own should have automatic payments setup for the full amount.",
    origin: "Ramit Sethi, I Will Teach You To Be Rich",
    date: "2020",
    tags: ["credit"],
    favorite: false
  },
  {
    id: "q074",
    quote: "Credit Score Breakdown:\nPayment History - 35%, Amounts Owed - 30%, Length of History - 15%, New Credit - 10%, Types of Credit - 10%.",
    origin: "Ramit Sethi, I Will Teach You To Be Rich",
    date: "2020",
    tags: ["credit"],
    favorite: false
  },
  {
    id: "q075",
    quote: "Be a deadbeat to the credit card companies.",
    origin: "Ramit Sethi, I Will Teach You To Be Rich",
    date: "2020",
    tags: ["credit"],
    favorite: false
  },
  {
    id: "q076",
    quote: "Financial 'experts' hid bad performance by removing them from the dataset.",
    origin: "Ramit Sethi, I Will Teach You To Be Rich",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q077",
    quote: "80% of Millionaires are 1st time family Millionaires.",
    origin: "ZT",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q078",
    quote: "There isn't a single hand-picked 20-year period where the S&P500 has lost money.",
    origin: "ZT",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q079",
    quote: "Does the company have products or services with sufficient market potential to make possible a sizeable increase in sales for at least several years?",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["credit"],
    favorite: false
  },
  {
    id: "q080",
    quote: "Does the management have a determination to continue to develop products or processes that will further increase total sales when attractive product lines have largely been exploited?",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q081",
    quote: "How effective are the company's research and development efforts in relation to its size?",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q082",
    quote: "Does the company have and above-average sales organization?",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q083",
    quote: "Does the company have a worthwhile profit margin?",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q084",
    quote: "What is the company doing to maintain or improve profit margins?",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q085",
    quote: "Does the company have outstanding labor and personnel relations?",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q086",
    quote: "Does the compnay have outstanding executive relations?",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q087",
    quote: "Does the company have depth to its management?",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q088",
    quote: "How good are the company's cost analysis and accounting controls?",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q089",
    quote: "Are the other aspects of the business somewhat peculiar to the industry involved, which will give the investor important clues as to how outstanding the company may be in relation to its competition?",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q090",
    quote: "Does the company have a short-range and long-range outlook in regard to profits?",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q091",
    quote: "In the forseeable future will the growth of the company require sufficient equity financing so that the larger number of shares then outstanding will largely cancel the existing stockholders' benefit from this anticipated growth?",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q092",
    quote: "Does the management talk freely to investors about its affairs when things are going well but clam up when troubles and disappointments occur?",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q093",
    quote: "Does the company have a management of unquestionable integrity?",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q094",
    quote: "It is important to view knowledge as sort of the semantic tree - make sure you understand the fundamental principles, i.e. the trunk and big branches, before you get into the leaves/details on there is nothing for them to hang on to.",
    origin: "Elon Musk",
    date: "2020",
    tags: ["mindset","career"],
    favorite: true
  },
  {
    id: "q095",
    quote: "Companies that are the most desireable:\nWorking on the frontiers of technology.\nVarious new products and processes.",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q096",
    quote: "Postponing an attractive purchase because of fear of what the general market might do will, over the years, prove very costly.",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q097",
    quote: "Reasons to Sell:\n1. A mistake has been made in purchasing.\n2. A deteriorating business or losing its 15 values.\n3. Opportunities for attractive investments are hard to find.",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q098",
    quote: "The stock ran up, it can't go up anymore... Is it still the right company?",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q099",
    quote: "Managements with inefficient and sub-standard operations do NOT meet the 15 Points.",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q100",
    quote: "Good management teams DON'T just pile up cash.",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q101",
    quote: "Misconceptions of who benefits from dividends:\nIf its the right company and you are just doing a DRIP method then the dividend is losing you upwards of 20% in taxes.",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q102",
    quote: "Misconceptions of who benefits from dividends:\nA fast growing company with great management will out-pace even a high yield with ease.",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q103",
    quote: "Misconceptions of who benefits from dividends:\nManagement teams get put into a situation where they have to continue the dividend, even if they find a better opportunity to spend earnings, for fear of losing long term shareholders who rely on that dividend.",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q104",
    quote: "Misconceptions of who benefits from dividends:\nLike a farmer who rushes his magnificent livestock to market the minute he can sell them rather than raising them to the point where he can get the maximum price above his costs.",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q105",
    quote: "Money is just an information system for the allocation of labor.",
    origin: "Elon Musk",
    date: "2020",
    tags: ["business","mindset"],
    favorite: true
  },
  {
    id: "q106",
    quote: "Don't let a bad company mask its lack of creativity and vision with a consistent paying dividend. If the management is bad, no matter how long the dividend has been paid.",
    origin: "ZT",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q107",
    quote: "Don't buy into promotional companies.",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q108",
    quote: "Don't ignore a good stock just because it is traded 'over the counter.'",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q109",
    quote: "Don't buy just because you like the 'tone' of the annual report.",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q110",
    quote: "Don't assume that the high price at which a stock may be selling in relation to earnings is necessarily an indication that further growth in those earnings has largely been already priced in.",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q111",
    quote: "Don't quibble over fractions and pennies.",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q112",
    quote: "Don't overstress diversification.",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q113",
    quote: "Don't be afraid to buy on a war scare.",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q114",
    quote: "Don't forget history doesn't predict the future, that's illogical.",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q115",
    quote: "Don't forget to consider time as well as price in buying a true growth stock.",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q116",
    quote: "Don't follow the crowd.",
    origin: "Philip A. Fisher, Common Stocks and Uncommon Profits",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q117",
    quote: "The company must recognize that the world in which it is operating is changing at an ever-increasing rate.",
    origin: "Philip A. Fisher, Conservative Investors Sleep Well",
    date: "2020",
    tags: ["assets","business"],
    favorite: false
  },
  {
    id: "q118",
    quote: "There must be a conscious and co5ntinuous effort to make sure their company is a good place to work, at all levels.",
    origin: "Philip A. Fisher, Conservative Investors Sleep Well",
    date: "2020",
    tags: ["assets","business"],
    favorite: false
  },
  {
    id: "q119",
    quote: "Management must submit to the stigma of a strong bottom-line when TRUE growth opportunities are available.",
    origin: "Philip A. Fisher, Conservative Investors Sleep Well",
    date: "2020",
    tags: ["assets","business"],
    favorite: false
  },
  {
    id: "q119",
    quote: "Treat customers like you would if you were a small startup business.",
    origin: "Philip A. Fisher, Conservative Investors Sleep Well",
    date: "2020",
    tags: ["assets","business"],
    favorite: false
  },
  {
    id: "q120",
    quote: "Ask yourself, 'What can this particular company do that others would not be able to do quite as well?'",
    origin: "Philip A. Fisher, Conservative Investors Sleep Well",
    date: "2020",
    tags: ["assets","business"],
    favorite: false
  },
  {
    id: "q121",
    quote: "If the fundamentals are genuinely strong, these companies will in time increase earnings not only enough to justify present prices but to justify considerably higher prices.",
    origin: "Philip A. Fisher, Conservative Investors Sleep Well",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q122",
    quote: "All the correct reasoning in the world is of no benefit in stock investment unless it is turned into specific action.",
    origin: "Philip A. Fisher, Developing an Investment Philosophy",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q123",
    quote: "To a CEO: What do you consider to be the most important long-range problem facing your company?",
    origin: "Philip A. Fisher, Developing an Investment Philosophy",
    date: "2020",
    tags: ["assets","business"],
    favorite: false
  },
  {
    id: "q124",
    quote: "Never promote someone who hasn't made some bad mistakes. If you do, you are promoting someone who has NEVER done anything.",
    origin: "Dr. Herber Dow",
    date: "2020",
    tags: ["assets","business","mindset"],
    favorite: true
  },
  {
    id: "q125",
    quote: "If you can't do something better than others are doing it, don't do it at all.",
    origin: "Dr. Herber Dow",
    date: "2020",
    tags: ["assets","business","mindset"],
    favorite: false
  },
  {
    id: "q126",
    quote: "Don't grow complacent on past gains. Continue to build upon your skills and tend to the sheep at hand.",
    origin: "Philip A. Fisher, Developing an Investment Philosophy",
    date: "2020",
    tags: ["assets"],
    favorite: false
  },
  {
    id: "q127",
    quote: "A profit should never be taken just for the satisfaction of taking it.",
    origin: "Philip A. Fisher, Developing an Investment Philosophy",
    date: "2020",
    tags: ["assets","business"],
    favorite: false
  },
  {
    id: "q128",
    quote: "When faced with defeat the easiest and most logical thing to do is to quit. That is exactly what the majority of people do.",
    origin: "Napoleon Hill, Think and Grow Rich",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q129",
    quote: "Failure comes to those who indifferently allow themselves to become failure conscious.",
    origin: "Napoleon Hill, Think and Grow Rich",
    date: "2020",
    tags: ["mindset"],
    favorite: true
  },
  {
    id: "q130",
    quote: "I will burn all bridges behind me, and stake my entire future on my ability to get what I want.\nHe left himself no possible way to retreat. He had to win or perish.",
    origin: "Napoleon Hill, Think and Grow Rich",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q131",
    quote: "Put yourself out there and make a point to get what you want. Be willing to give up EVERYTHING to get it.",
    origin: "Napoleon Hill, Think and Grow Rich",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q132",
    quote: "Teaching Financial Literacy: 1) Reduce FRICTION. 2) Load as much FUEL as possible.\nFriction: Don't give people a 'no-action' option; where is there friction that is slowing down the act we want?\nFuel: What is their biggest source of motivation? Make these invisible systems visible.",
    origin: "Dan Ariely, Chief Behavioral Officer for Lemonade",
    date: "2020",
    tags: ["learning","mindset"],
    favorite: false
  },
  {
    id: "q133",
    quote: "Knowledge will not attract money unless it is organized and intelligently directed through practical plans of action to the definite end of accumulation of money.",
    origin: "Napoleon Hill, Think and Grow Rich",
    date: "2020",
    tags: ["learning","mindset"],
    favorite: false
  },
  {
    id: "q134",
    quote: "Knowledge =/= Power. It equates to potential power. It becomes power when it is organized into a definite plan.",
    origin: "Napoleon Hill, Think and Grow Rich",
    date: "2020",
    tags: ["learning","mindset"],
    favorite: false
  },
  {
    id: "q135",
    quote: "Reasoning by analogy or comparison is just wrong. Down to a first principles level it just doesn't hold up, just like the past doesn't project the future. Don't miss out on an opportunity that could change the world because you are too busy trying to find what it is similar to.",
    origin: "UNKNOWN",
    date: "2020",
    tags: ["learning","mindset","business"],
    favorite: true
  },
  {
    id: "q136",
    quote: "Roadways we drive on are based on a 'passive optical' experience; being able to read road signs and curves at various distances. So the way to solve autonomous driving isn't by INPUTTING all road speeds, signs, etc. It is  by solving the problem of AI learning on passive optical vision as a human would.",
    origin: "UNKNOWN",
    date: "2020",
    tags: ["learning","mindset","business"],
    favorite: true
  },
  {
    id: "q137",
    quote: "The six basic fears:\nPoverty, Criticism, Ill Health, Loss of Love of Someone, Old Age, Death",
    origin: "UNKNOWN",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q138",
    quote: "Fears are nothing more than states of mind.\nYour state of mind is subject to control and direction of the body and mind.",
    origin: "Napoleon Hill, Think and Grow Rich",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q139",
    quote: "Criticism is given out too lightly; it is evil, desctructive, hurtful, and unnecessary in most instances. It will plant fear and resentment in the human hurt but iti will not build love or affection.",
    origin: "Napoleon Hill, Think and Grow Rich",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q140",
    quote: "An unsettled mind is helpless. Indecision makes an unsettled mind.",
    origin: "Napoleon Hill, Think and Grow Rich",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q141",
    quote: "Self-analysis Test Questions:\nI am too sarcastic in my conversations, this is from the urge of seeking attention and is unacceptable. This criticism is hurtful whether it be sarcastic or not.",
    origin: "Napoleon Hill, Think and Grow Rich",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q142",
    quote: "Self-analysis Test Questions:\nI am gaining self-confidence as I grow older and look to continue this growth as I age. I have come a long way but there is still much more to be gained.",
    origin: "Napoleon Hill, Think and Grow Rich",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q143",
    quote: "Self-analysis Test Questions:\nI learn from all my mistakes, they happened for a reason.",
    origin: "Napoleon Hill, Think and Grow Rich",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q144",
    quote: "Self-analysis Test Questions:\nI value the privilege of controlling my own thoughts more than material possessions.",
    origin: "Napoleon Hill, Think and Grow Rich",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q145",
    quote: "Self-analysis Test Questions:\nBeing interrupted is the one habit that people do that annoys me the most. It is because I won't be heard in my full entirity, not just some of what I have to say.",
    origin: "Napoleon Hill, Think and Grow Rich",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q146",
    quote: "Most of the ugliness I saw in others was but a reflection of my own nature.",
    origin: "Napoleon Hill, Think and Grow Rich",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q147",
    quote: "Of course it's easier to copy a model than to make something new. Doing what we already know how to do takes the world from 1 to n, adding more of something familiar. But every time we create something new, we go from 0 to 1! The act of creation is singular, as is the moment of creation, and the result is something fresh and strange.",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["mindset","learning","business"],
    favorite: false
  },
  {
    id: "q148",
    quote: "The division of our world into 'developed' and 'developing' nations implies the 'developed' world has already achieved the achievable, and poorer nations just need to catch up.",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["mindset","learning","business"],
    favorite: false
  },
  {
    id: "q149",
    quote: "In a world of scarce resources, globalization without new technology is unsustainable!",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["mindset","business"],
    favorite: false
  },
  {
    id: "q150",
    quote: "Bureaucratic hierarchies move slowly, and entrenched interests shy away from risk.",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q151",
    quote: "The first step to thinking clearly is to question what we think we know about the past.",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q152",
    quote: "Perfect Competition:\nEvery firm in a competitive market is undifferentiated and sells the same homogeneous products.",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q153",
    quote: "Monopoly:\nOne company is so good at what it does that no other firm can offer a close substitute.",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q154",
    quote: "If you want to create and capture lasting value, don't build an undifferentiated commodity business.",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q155",
    quote: "More times than not the monopoly will treat its workers better due to the control in pricing of their goods, not having cut every corner to make ends meet. In the competitive market the companies must be ruthless. Monopolies can afford to think about things other than money.",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q156",
    quote: "Monopolies deserve their bad reputation - but only in a world where nothing changes.",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q157",
    quote: "If the government would have let the oil and gas industries stay as monopolies would we have had more advancements to remove the NEED of those fossil fuels.",
    origin: "ZT",
    date: "2020",
    tags: ["business","theory"],
    favorite: TRUE
  },
  {
    id: "q158",
    quote: "Competition = allegedy necessary, supposedly valiant, but ultimately destructive.",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q159",
    quote: "An imitator is a loser. Sooner or later they will lose.",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q160",
    quote: "Winning is better than losing, but everybody loses when the war isn't one worth fighting.",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business","mindset"],
    favorite: false
  },
  {
    id: "q161",
    quote: "The value of a business today is the sum of all the money it will make in the future.",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business","investing"],
    favorite: false
  },
  {
    id: "q162",
    quote: "Characteristics of a Monopoly\n1) Proprietary Technology: Must be 10 times better than its closest substitute, an order of magnitude.",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q163",
    quote: "Characteristics of a Monopoly\n2) Network Effects: Make a product more useful as people use it.",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q164",
    quote: "Characteristics of a Monopoly\n3) Economics of Scale: Fixed cost of creating but spread out over sales. Don't be limited by your service or number of workers.",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: TRUE
  },
  {
    id: "q165",
    quote: "Characteristics of a Monopoly\n4) Branding: Monopoly built soley on its own brand.",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q166",
    quote: "Where can you create or capture ALPHA from the market.",
    origin: "UNKNOWN",
    date: "2020",
    tags: ["business","mindset"],
    favorite: false
  },
  {
    id: "q167",
    quote: "First dominate a specific niche, and then scale to adjacent markets.",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q168",
    quote: "A business with a good definite plan will always be underrated in a world where people see the future as random.",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q169",
    quote: "ALL OF CHAPTER 7.",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q170",
    quote: "A company must try to disrupt itself, otherwise another company will come along and do it.",
    origin: "ZT",
    date: "2020",
    tags: ["mindset"],
    favorite: false
  },
  {
    id: "q171",
    quote: "Great companies have secrets: specific reasons for success that other people don't see.",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q172",
    quote: "The Engineering Question:\nBreakthrough technology instead of incremental improvement?",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q173",
    quote: "The Timing Question:\nIs now the right time to start?",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q174",
    quote: "The Monopoly Question:\nAre you starting with a big share of a small market?",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q175",
    quote: "The People Question:\nDo you have the right team?",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q176",
    quote: "The Distribution Question:\nDo you have a way to not just create but deliver your product?",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q177",
    quote: "The Durability Question:\nWill your market position be defensible 10 and 20 years into the future?",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q178",
    quote: "The Secret Question:\nHave you identified a unique opportunity that others don't see?",
    origin: "Peter Thiel, Zero to One",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q179",
    quote: "The question is, is the company using/supporting sustaining technologies or disruptive technologies?",
    origin: "Clayton M. Christensen, The Innovator's Dilemma",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q180",
    quote: "Sustaining Technology Changes\nSustained or reinforced established trajectories of product performance improvement.",
    origin: "Clayton M. Christensen, The Innovator's Dilemma",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q181",
    quote: "The downfall of a great company:\nClearly, they were technologically capable of producing _________. Their falure resulted from delay in making the strategic commitment to enter the emerging market...",
    origin: "Clayton M. Christensen, The Innovator's Dilemma",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q182",
    quote: "Sustaining technologies fail, and the businesses that use them, because the ~new~ or ~niche~ disruptive technologies don't benefit their CURRENT value network.",
    origin: "Clayton M. Christensen, The Innovator's Dilemma",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q183",
    quote: "Sound managerial decisions are at the very root of their impending fall from industry leadership.",
    origin: "Clayton M. Christensen, The Innovator's Dilemma",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q184",
    quote: "Buying Hierarchy:\n1) Functionality - only product in the market\n2) Reliability - two or more products, so the best\n3) Convinience - most convinient to deal with\n4) Price - last phase before the next performance oversupply",
    origin: "Clayton M. Christensen, The Innovator's Dilemma",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q185",
    quote: "Questions to ask when faced with a disruptive technological change:\nHow can we know if a technology is disruptive?\nGraph the trajectories of performance improvement demanded in the market vs. performance improvement supplied.",
    origin: "Clayton M. Christensen, The Innovator's Dilemma",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q186",
    quote: "Questions to ask when faced with a disruptive technological change:\nWhere is the market for _____?\nAcknowledge it can't be used in mainstream right now/immediately. Its not in an established market.",
    origin: "Clayton M. Christensen, The Innovator's Dilemma",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q187",
    quote: "Questions to ask when faced with a disruptive technological change:\nWhat should be our product, technology, and disruption strategies?\nLooking to produce a performance oversupply.",
    origin: "Clayton M. Christensen, The Innovator's Dilemma",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
  {
    id: "q188",
    quote: "Questions to ask when faced with a disruptive technological change:\nWhat organization best serves disruptive innovations?\nCreate a subdivision that is independently focused on that product/value network.",
    origin: "Clayton M. Christensen, The Innovator's Dilemma",
    date: "2020",
    tags: ["business"],
    favorite: false
  },
];
