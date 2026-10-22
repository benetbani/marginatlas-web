/**
 * THE COPY TABLE for the archetypes. Every label, note and basis line the
 * archetypes print lives here, once, in the founder's register: practical and
 * direct, never corporate or institutional (his ruling 11 of 2026-09-04; the
 * rejected example was "x7.7 prime street against the edge of town, rent a
 * square metre a year"). A label is a noun phrase of four words or fewer; a
 * note is one plain line that qualifies its figure and never retracts it.
 *
 * Words the founder ruled verbatim are marked. A page never types a label of
 * its own; it takes it from here, so a ruling changes one line and every
 * instance follows. Constraint-safe: no em-dashes, no source-agency names.
 */
/** The customers strip's own kicker, held once so the detail panel's summary
 * below can REFERENCE it rather than retype it (review finding 6): a second
 * literal of the same string drifts silently on the next edit to either one. */
const CUSTOMERS_KICKER = "What customers earn";
/** The net-margin metric's one name, held once for the same reason: the money
 *  card and the mark list both open with it, and a second literal would drift
 *  the day either one is reworded. */
const MARGIN_KICKER = "Profit margin by trade";
/** "Clean dealing" is the state table's bribery row AND the footing card's
 *  first cell (MODEL.md 8.2, `17 footing`: "reused from copy.ts line 98"); one
 *  literal, so the two never drift. */
const CLEAN_DEALING = "Clean dealing";
/** THE THREE KICKERS A DRAWN BLOCKED SEAT SHARES WITH THE CARD IT STANDS FOR
 *  (MODEL.md 8.2, "THE THIN COUNTRY, SEATED"; plan step 31's seventh dispatch,
 *  2026-09-18): the registering table and its seat, the peers table and its
 *  seat, the note list and its seat open with one literal each, so the kicker
 *  a reader meets on Afghanistan is byte for byte the one on the United
 *  Kingdom, and a rewording changes both. The money seat takes MARGIN_KICKER
 *  above for the same reason. */
const TIERS_KICKER = "Registering, by legal form";
const PEERS_KICKER = "Against the peers";
const LOCALS_KICKER = "What locals know";
/** The cities' kicker, one literal for the card gallery and for the seat that
 *  stands where it would on a country with no covered city (MODEL.md 8.2's
 *  FLOOR bracket, plan step 49, 2026-09-19). */
const CITIES_KICKER = "The cities";
/** The city page's `03 districts` and `09 trades` kickers, one literal each
 *  for the drawn card and for the seat that stands where it would on a city
 *  whose data is absent (QUEUE launch:city-seats-off-london, 2026-09-19): off
 *  London the districts ranking has no rents to rank, and under four local
 *  trades the rows have no card to fill, so the block draws the seat with its
 *  line instead of leaving the band absent (PART 4's idiom; the country's
 *  `07 workforce` is the exemplar). */
const CITY_DISTRICTS_KICKER = "Rent by district";
const CITY_TRADES_KICKER = "Trades with local figures";
/** Turn one's heading on every page (M7): the country's, the city's and the
 *  trade's open the same chapter with one literal, so a rewording changes
 *  all three. */
const COSTS_CHAPTER = "What it costs to open, and to run";
/** Turn three's heading on the trade page and the industry page (8.6, 8.7):
 *  "What the place is like" with the subject swapped, one literal for both,
 *  so a rewording changes the pair. */
const TRADE_CHAPTER = "What the trade is like";
export const COPY = {
  answer: {
    /** Founder verbatim, 2026-08-30: "the total effective tax burden". */
    label: "Total effective tax burden",
    /** The basis clause; the regime name is appended in ink by the card. */
    basis: "on profit, for a small business",
    basisUnder: "under",
    /** The United Kingdom's worked figure (plan 06, task B1): income tax and national insurance on the stated profit. */
    basisUk: "on {profit} of profit, a sole trader under Self Assessment",
    /** The state word when no small-business regime row is held (catalogue I9). */
    absent: "Not known yet",
    absentNote: "we have no small-business tax regime for this country yet",
  },
  cells: {
    payroll: { label: "Payroll on wages", note: "on wages, on top of profit tax" },
    salesTax: { label: "Sales tax", note: "carried by the customer" },
    /** Founder verbatim, ruling 1 of 2026-09-04: the cells are the LLC's. */
    llcGroup: "To register an LLC",
    llcTime: { label: "Time", note: "until registered" },
    llcCost: { label: "Cost", note: "government fees only" },
  },
  /** A zero fee in running prose or a step is the word. IN A COLUMN OF FIGURES IT IS "$0" (2026-09-25): his law "never a word where a
   *  number goes" is newer than the blueprint's "the word, never $0", and the model laws' UNIT MIX read "Free" in the registering
   *  table's fee column as a word among figures. The tables and the hero board print `usd(0)` there; this word stays for the rest. */
  free: "Free",
  /** The net-margin card (founder ruling 6, 2026-09-04: "net profit margin in %, vertical bars"). */
  margin: {
    kicker: MARGIN_KICKER,
    basis: "",
    worldBest: "world's best",
    withheldOne: "1 trade left out: our figure for it isn't reliable.",
    withheldMany: "{n} trades left out: our figures for them aren't reliable.",
    phoneHead: { trade: "Trade", value: "Net margin" },
  },
  /** The tiers table (registering, by legal form). The explainers are definitional, true in every country (rule 21). */
  tiers: {
    kicker: TIERS_KICKER,
    heads: { fee: "Fee", time: "Time", paperwork: "Paperwork" },
    legend: "More dots, more paperwork: one is an online form, five a lawyer.",
    /** The legend drawn (2026-09-25): one dot and five, each with its words, in place of the sentence above. */
    legendEnds: { one: "Online form", five: "Lawyer" },
    /** Founder ruling 8, 2026-09-04: the section leads to this page. */
    door: "How to open a business in {country}",
    explainers: {
      Freelancer: "Self-employed with no separate company behind you. The income is taxed as your own and the debts are your own, and many countries offer a simplified tax regime for it. The lightest way to be paid for your own work.",
      "Sole Trader": "One person trades under their own name. There is no wall between the owner and the business: debts are personal, and so are the profits. The fastest and cheapest way in, and the form most small shops start with.",
      LLC: "A company that stands apart from its owner: liability stops at what the company owns. More paperwork and a public filing, in exchange for that wall. The usual step up once a shop takes on staff or signs a lease.",
      "Joint-Stock": "A company built to carry many shareholders and outside capital: boards, audits, public accounts. The heaviest form to run, and rarely the first one a small shop needs.",
    },
    paperwork: {
      1: "An online form in under an hour. No notary, no capital, nobody to visit.",
      2: "Online in a day, with a little documentation and no notary.",
      3: "Several steps, a registered office and a tax registration, done in a week or two.",
      4: "A notary or a court, minimum capital and signed articles. Three to six weeks.",
      5: "A lawyer, a notary, several offices to visit and capital to deposit. Often two months.",
    },
  },
  /** The range strips. Founder ruling 12 (2026-09-04): premises "in five metrics"; the four he named and the fifth reserved. */
  premises: {
    kicker: "What premises cost to run",
    basis: "Rent for a square metre of shop a year, the country's average by city size.",
    electricity: "a kilowatt hour, the commercial rate",
    /** THE MARKS ARE RENT BY CITY SIZE, NOT BY STREET (the build loop's run 13, 2026-09-06). The profile's three rent fields are defined as the tier-1 city, tier-2 city and tier-3 or smaller city averages (the v29 cost-engine plan defines them so, the cost engine picks one by the city's tier, and the research cards call the single figure "a Tier-1 average"); until run 13 they were labelled Prime street, Ordinary street and Edge of town, which is the street axis the data does not hold. */
    marks: { t1: "Biggest cities", t2: "Major cities", t3: "Smaller cities" },
    /** The founder's five metrics, held for the day the data carries them. */
    target: ["Prime street, metropolis", "Secondary street, metropolis", "Prime street, city", "Secondary street, city", "Edge of town"],
  },
  customers: {
    kicker: CUSTOMERS_KICKER,
    basis: "Full-time pay, a year.",
    marks: { bottom: "Bottom tenth", typical: "Typical", top: "Top tenth" },
  },
  /** The spectra tables (the character): the founder's personal keep since 2026-06-18, two six-spectra tables, his six orders of 2026-08-30 (explanatory poles, best on the right, ink dots for the state and terracotta for people, a foot figure under each). The words are his kept build's. */
  character: {
    state: {
      kicker: "Dealing with the state",
      rows: {
        tax: { name: "Tax predictability", left: "Rules change yearly", right: "Set for years" },
        bribery: { name: CLEAN_DEALING, left: "Bribes expected", right: "By the book" },
        tasks: { name: "Getting things done", left: "Weeks of stamps", right: "Same-week answers" },
        time: { name: "Waiting time", left: "Queues for months", right: "Days, not months" },
        courts: { name: "Courts", left: "Connections decide", right: "Contracts hold" },
        new: { name: "Openness to the new", left: "New ways resisted", right: "New ways welcomed" },
      },
      foot: "foreign-owned firms",
    },
    people: {
      kicker: "Dealing with people",
      rows: {
        /* THREE WORDS A POLE AT MOST (2026-09-25; the model laws' ROW SENTENCE read five four-word poles on this table): a pole is a
           label a reader takes in at a glance, the state table's own measure. */
        open: { name: "Openness", left: "Keep to themselves", right: "Welcome newcomers" },
        innovation: { name: "Innovation", left: "Old ways rule", right: "New ideas land" },
        direct: { name: "Directness", left: "Talk around it", right: "Say it plainly" },
        punctual: { name: "Timekeeping", left: "Schedules drift", right: "Clocks are kept" },
        straight: { name: "Straight dealing", left: "Corners get cut", right: "Promises are kept" },
        ambition: { name: "Ambition", left: "Kept quiet", right: "Worn openly" },
      },
      foot: "born abroad",
      /** The city table's foot where the city file holds no share of its own:
       *  the country's share, and the label says so (plan step 32's sixth
       *  dispatch, 2026-09-18; a national figure under a city's name needs
       *  the word). */
      footCountry: "born abroad, nationwide",
    },
    /** THE CITY'S PEOPLE TABLE (MODEL.md 8.3, `12 character-people`; plan step
     *  32's sixth dispatch, 2026-09-18) ships at full form on every city, six
     *  traits: the city's own read where the city signature file holds one
     *  (19 cities, London three), the country's read where it does not, and
     *  the basis says which and says modelled, because the sample mark is
     *  switched off site-wide and the basis is the only line left that can.
     *  The country is never named (it is the masthead's subtitle, and a
     *  country name in a chart's furniture is PART 8.5's ban); "the
     *  country's" is what a person says. Fourteen words at most, measured on
     *  the longest case (three own reads and a two-word city). */
    city: {
      basisOwn: "",
      basisMixed: "{traits} {verb} {city}'s own. The rest are the country's.",
      basisCountry: "These describe the country, not {city} alone.",
    },
  },
  /** The note list (what locals know): authored notes, the page's one editorial section. */
  locals: { kicker: LOCALS_KICKER },
  /** THE DRAWN BLOCKED SEATS (MODEL.md 8.2; plan step 31, 2026-09-17 and
   *  2026-09-18). Each is an opener, ONE stated line under the seat law's word
   *  cap in the site's idiom ("Not gathered yet: ..."), and a foot naming the
   *  requirement it waits on in E:/atlas/design/loop/build/DATA-REQUIREMENTS.md.
   *  The lines are 8.2's own, verbatim, read aloud.
   *
   *  The country page seats none since plan 2026-10-13 country-page-journey (a
   *  slot without its data omits itself; the note inside the object below).
   *  Two seats stay for the pages that still draw them: `peers` where the peer
   *  table does not resolve and `locals` where no notes are authored. Their
   *  kickers are the drawn cards' own, referenced and never retyped, so the
   *  block reads under one name whether it is drawn or seated. */
  blocked: {
    /* The country's own seats (workforce, easiest, setup, money) left with the seats themselves (plan 2026-10-13 country-page-journey;
       final review M5, 2026-10-15): a slot without its data omits itself. Peers and locals stay, drawn by the trade, city and how-to pages. */
    peers: {
      kicker: PEERS_KICKER,
      line: "We don't have countries to compare this one with yet.",
      foot: "",
    },
    locals: {
      kicker: LOCALS_KICKER,
      line: "We don't have local tips for this country yet.",
      foot: "",
    },
    /** THE TRADE PAGE'S ONE DRAWN BLOCKED SEAT, `10 watch` (MODEL.md 8.6;
     *  plan step 33's fifth dispatch, 2026-09-18): his B1 bars wait on item
     *  53 (causes of closure with shares, 0 of 243), so the block stands on
     *  every trade cell as the seat, eight words, the kicker 8.6's title.
     *  Never the four London titles the old `#risks` card drew (authored for
     *  every storefront trade, scored by hand), never churn dressed as a
     *  cause: `12 market` prints churn as what it is. */
    watch: {
      kicker: "What closes one",
      line: "We don't know yet what closes these shops.",
      foot: "",
    },
    /** THE CITY'S SEATS (MODEL.md 8.3; plan step 32's sixth dispatch,
     *  2026-09-18). `13 locals` stands as the seat on every city, the same
     *  three strings as the country's (M19: one idiom on both pages; no city
     *  holds authored notes, item 6, and the country's notes never print under
     *  the city's kicker). `14 neighbourhoods` stands as the seat on the 209
     *  cities whose scheme is the compass placeholder (a placeholder name never
     *  prints); the line names the city, the way the demand card's withheld
     *  line does, and runs twelve words on the longest city name in the set
     *  ("Ho Chi Minh City"). The item is 30, the neighbourhood names (the
     *  city synthesis's item 29 became DATA-REQUIREMENTS item 30 in the merge;
     *  item 29 is the season slope). */
    cityNeighbourhoods: {
      kicker: "The city's neighbourhoods",
      line: "We don't have {city}'s neighbourhoods yet.",
      foot: "",
    },
    /** THE NEIGHBOURHOOD PAGE'S ONE DRAWN BLOCKED SEAT, `04 works` (MODEL.md
     *  8.8; plan step 35, 2026-09-19, the controller's ruling (d)): what lifts
     *  revenue most in each district waits on item 70 (the engine's district
     *  coefficients are within 30 percent of the measured turnover on 4 of
     *  21 London rows), not on the slug fault; printing the engine's lists
     *  would put figures the measurement says are wrong on 17 of 21 rows.
     *  The kicker is 8.8's title within four words; the line is the
     *  controller's, ten words. */
    hoodWorks: {
      kicker: "What lifts sales most",
      line: "We don't know yet what lifts sales most in each district.",
      /* What the page has instead (the goal's D3 law, his correction of 2026-09-24): true on the hub and on every district page, where rent and visitors stand above this seat. */
      foot: "Rent and visitors by district are above.",
    },
    /** THE CITY PAGE'S TWO SEATS OFF LONDON, `03 districts` and `09 trades`
     *  (MODEL.md 8.3; QUEUE launch:city-seats-off-london, 2026-09-19, the
     *  controller's, from plan step 50's first run: Frankfurt and Abidjan
     *  drew 14 of 17 because both blocks self-omitted where the country page
     *  draws the seat). The kickers are the drawn cards' own, referenced.
     *  Each line names the city the way the neighbourhoods seat does and
     *  runs eleven words on the longest city name in the set ("Ho Chi Minh
     *  City"); the districts seat waits on the district rents themselves
     *  (item 15: no city but London has ranked districts), not on item 70,
     *  which is the keep half London lacks too; the trades seat waits on the
     *  per-city trade cells (item 69: the rows need four local trades and
     *  151 cities hold none). Both read aloud. */
    cityDistricts: {
      kicker: CITY_DISTRICTS_KICKER,
      line: "We don't have rent by district for {city} yet.",
      foot: "",
    },
    cityTrades: {
      kicker: CITY_TRADES_KICKER,
      line: "We don't have local trade figures for {city} yet.",
      foot: "",
    },
  },
  /** THE FOOTING SEAT (MODEL.md 8.2, `17 footing`): the calibrated meter is a
   *  form he has not clicked, so the catalogued form nearest it, KvGrid, holds
   *  the seat with the two readings as whole numbers, 0 to 100. "Clean
   *  dealing" is the state table's own row name, shared above; the basis says
   *  what the two figures are and that most countries' rows are interpolated
   *  (50 of 197 measured), because the sample mark is switched off site-wide
   *  and the basis is the only line left that can say it. */
  footing: {
    kicker: "The ground under you",
    cells: { clean: CLEAN_DEALING, admin: "Admin ease" },
    basis: "Two published indices, 0 to 100; interpolated for most countries.",
  },
  /** THE HERO BOARD (his design of 2026-09-20, MODEL.md 8.2 row `00 take`'s
   *  bracket; hero_board.ts): the column of supporting figures on the right of
   *  the country's masthead, each a label, a figure, its unit, and a level
   *  word that says where the country stands among the countries. The row
   *  labels are the site's own names for the figures they print (the footing
   *  card's "Clean dealing" and "Admin ease" referenced, never retyped; the
   *  pay pair's "Average salary" said monthly). The level words are three
   *  literals and say the level only, never good or bad. The placeholder line
   *  under the image says what the image is until a real photograph lands
   *  (his word: "put a placeholder at this moment"). Every string read aloud. */
  heroBoard: {
    /** The readout wrapper's name for a screen reader (goal 2026-09-26, M1). */
    marksLabel: "The six figures, among the countries",
    rows: {
      clean: CLEAN_DEALING,
      admin: "Admin ease, 2020",
      llcDays: "Days to register",
      salaryMonth: "Typical salary",
      llcCost: "Register a company",
    },
    /** The plus under the answer: its name, and the notes and fallback labels of its rows. */
    taxes: { summary: "The other taxes" },
    taxNotes: { vatFrom: "once sales pass {amount} a year", salesTax: "Sales tax", /* Three words, a row label (ROW SENTENCE, read behind the plus since plan 2026-10-13, Task 1E). */ companyTax: "Company profit tax" },
    /* FEWER WORDS, THE SAME MEANING (2026-09-25, his word that night: "symbols ... can be used to replace words in our sections
       that are soooo verbose"): "/100" and "/mo" for "of 100" and "a month", no "all in" (the row names the company), and the
       levels drawn as a three-step mark, their key four words. */
    units: { of100: "/100", day: "day", days: "days", aMonth: "/mo", allIn: "" },
    levels: { high: "High", medium: "Medium", low: "Low" },
    levelBasis: "Marks rank the countries.",
    /** The answer drawn: the two parts under the cells (labels, never a sentence), and the bar's name for a screen reader after the figure ("20% of profit"). */
    share: { part: "Tax", rest: "You keep", of: "of profit" },
    placeholder: "Illustrative photo",
  },
  /** THE CITY'S HERO BOARD (city_hero_board.ts, 2026-09-20 evening): his
   *  country hero at the city altitude. Labels under three words; the units
   *  beside the figures; the level basis says the chips are among the
   *  covered cities. */
  /** THE MONTH COLUMNS (MonthBars.tsx; his gold standard's B30 drawn as columns since his ruling of 2026-09-23): the twelve initials along the foot, the aria sentence. */
  monthLine: {
    initials: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    /** Full names for the drawing's spoken label and each month's readout (2026-09-26): "busiest in D" read as a letter. */
    names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    aria: "The year month by month, busiest in {peak}, quietest in {trough}: {months}",
    readout: "{month}, of the busiest month",
  },
  cityHeroBoard: {
    /** `permitsLongest`: the same figure where the page holds only sourced or marked figures (a city held to a register region,
     *  London): it is the longest single wait among the city's permits, not a total (masterplan step 03, labels audit item 24). */
    rows: { visitors: "Visitors", permits: "City permits", permitsLongest: "Longest permit wait", density: "Per 10,000 residents", gdp: "Metro GDP", living: "Cost of living" },
    units: { aYear: "a year", per10k: "businesses" },
    levelBasis: "Levels compare cities. Cost of living: cheapest city 1, dearest 100.",
    /** The level line where the cost of living does not print (a city held to a register region, London: no source holds the
     *  index). It says the board's one estimate in words (plan 2026-10-08): the row's tag is drawn by nothing on the board, and
     *  the visitors above it are counted. Since plan 2026-10-12 (Task 4) the board prints the permit wait's LEVEL and no figure
     *  (the permits section prints the wait), so the line names the level, which is what the board draws. */
    levelBasisNoLiving: "The permit level is an estimate. Levels compare cities.",
    /** A UK city held to no register region (the six; plan 2026-10-08, uk:cities-sourced-or-marked): every row is an estimate,
     *  and the line says so first. */
    levelBasisEstimates: "Estimates. Levels compare cities. Cost of living: cheapest city 1, dearest 100.",
    /** The answer drawn: the typical pay's place among the covered cities, its two ends named (labels, never a city). */
    pay: { low: "Lowest pay", high: "Highest pay", aria: "Typical pay among the cities we cover" },
  },
  /** THE CITY'S OWN PERMITS, GATE BY GATE (city_gates_rows.ts, `17 gates`,
   *  2026-09-20 late evening; his "more sections" from what the files hold).
   *  The kicker names the subject; the heads are one word each; the focal's
   *  label says what the fee total is; a gate the city does not require says
   *  so under its name. */
  cityGates: {
    kicker: "The city's own permits",
    heads: { gate: "Permit", wait: "Wait", fee: "Fee" },
    units: { day: "day", days: "days" },
    notRequired: "Not required here",
    focalLabel: "All the city's fees",
    basis: "On top of registering the company. The slowest sets your opening date.",
    /** A page held to a register region: the fees and waits have no source but one, food registration, free and looked up
     *  (registering a food business with the council, at least 28 days before trading; research 2026-09-25, item 25). */
    basisSourcedOnly: "Estimates, but food registration is free. The slowest sets your opening date.",
    footModelled: "",
  },
  /** WHO IS ALREADY TRADING HERE (city_market_rows.ts, `18 market`, the same
   *  evening): businesses for every 10,000 residents by trade as his bars,
   *  each row with its trade's tile; the market in figures behind his plus. */
  cityMarket: {
    kicker: "Who is already trading",
    /** The focal's words when the count of every business stands at 30 above the bars; the bars' own basis otherwise. */
    basisWithFocal: "Businesses trading in the city.",
    basis: "Businesses for every 10,000 residents, by trade.",
    /** The six UK cities held to no register region (plan 2026-10-08, uk:cities-sourced-or-marked): the same two lines, each
     *  saying the figures are estimates. */
    basisWithFocalEstimate: "Estimates of the businesses trading in the city.",
    basisEstimate: "Estimated businesses for every 10,000 residents, by trade.",
    footModelled: "",
    phoneHead: { trade: "Trade", value: "Per 10,000" },
    /** The ceiling's name at the far end of every track (the districts card's "Dearest district"). */
    densest: "Densest trade",
    detail: {
      summary: "The market in figures",
      rows: { all: "All businesses", newYear: "New each year", closeYear: "Close each year", independents: "Independents" },
    },
    /** A city held to a register region (London, Greater London; plan 06, task B3): the register's counts, one row a code, each
     *  named as the code's group (a shared code is never one trade's). The basis is the trade pages' own foot, so one count reads
     *  the same on both. */
    register: {
      /** Under the focal (every registered business in the trades drawn, the bars' sum) and over the bars, one line for both. */
      basis: "Registered businesses in these trades, {city}, March 2026.",
      phoneValue: "Businesses",
      top: "Largest trade",
      /** Three words at the most (the model laws' ROW SENTENCE), each the code's own group in plain words. */
      names: {
        restaurants: "Restaurants",
        "cafes-coffee-shops": "Cafés, unlicensed restaurants",
        "pubs-taverns": "Pubs and bars",
        "hairdressers-beauty": "Hair and beauty",
        "grocery-stores": "Grocery and convenience",
        "yoga-pilates-studios": "Gyms, fitness studios",
      } as Record<string, string>,
    },
  },
  /** AT A GLANCE (MODEL.md 8.2, `01 glance`; plan step 31, second dispatch,
   *  2026-09-17): the country's own figures, each in its own unit, no rank
   *  and no verdict. The pay cells take the pay bars' own words above
   *  (`pay.average`, `pay.minimum`, his ruling 14 of 2026-09-04: "replace
   *  words with minimum salary and average salary"; "typical pay" is the
   *  word he replaced), referenced and never retyped, so one figure has one
   *  name on the page. The foot carries the year of the published GDP figure
   *  and names the cells that are modelled, because the sample mark is
   *  switched off and the foot is the only line left that can say it. The
   *  withheld line names each cell the card does not hold and why (PART 5).
   *  Every string here was read aloud first. */
  glance: {
    kicker: "At a glance",
    cells: { gdp: "GDP per person", wealth: "Net wealth per adult", time: "Time to register" },
    /** The basis is composed from the cells the card prints, one unit clause
     *  each, joined with "; " (on the exemplar: "Salary a year; wealth per
     *  adult after debts; registration time for an LLC."), so a withheld cell
     *  never has a unit said for it. */
    units: { salary: "salary a year", wealth: "wealth per adult after debts", time: "registration time for an LLC" },
    /** `{year}` is the snapshot's own year, read from the file, never typed. */
    footYear: "GDP per person is the published {year} figure.",
    /** `{what}` is a list of cell names; `{verb}` is "is" or "are". */
    footModelled: "",
    /** `{n}` of the five cells, `{reasons}` the joined reasons below. */
    withheld: "{n} of 5 left out: {reasons}.",
    reasons: {
      salary: "no average salary yet",
      /** The staff-cost card's own verdict (`pay.withheld`), two cells at once. */
      payDisagree: "our salary figures disagree",
      wealth: "no wealth figure yet",
      minimum: "our minimum salary isn't the legal one",
      time: "no registration time yet",
    },
  },
  /** AMONG THE COUNTRIES (MODEL.md 8.2, `02 world-seat`; the same dispatch).
   *  The placed-figures form he has not clicked would carry a placement
   *  sentence under each figure; until then KvGrid holds the seat with the
   *  figures alone, and the foot says the placement is not drawn. The rent
   *  is the major-cities tier, the premises strip's own word for it
   *  (`premises.marks.t2`); the payroll label is the hero's (`cells.payroll`).
   *  The lending rate is withheld by DATA-REQUIREMENTS item 38: the field has
   *  no published definition. */
  worldSeat: {
    kicker: "Among the countries",
    cells: { rent: "Shop rent, major cities" },
    /** The units, one clause per cell the card prints: both cells, or the rent alone where payroll is withheld. */
    basis: "Rent for a square metre of shop a year; payroll on gross wages.",
    basisRentOnly: "Rent for a square metre of shop a year.",
    /** The foot's pronoun follows the count: "each" over two figures, "it" over one. */
    foot: "Typical for the country; where each sits among the countries is not shown yet.",
    footOne: "Typical for the country; where it sits among the countries is not shown yet.",
    withheld: {
      payroll: "No payroll figure for this country yet.",
      lending: "A lending rate is held but its definition is not.",
    },
  },
  /** THE BILL TO REGISTER (MODEL.md 8.2, `04 entry-bill`; plan step 31, third
   *  dispatch, 2026-09-17, which closes plan step 44). The kicker is the
   *  cross-page correction's (M13: "The bill to register", so a reader never
   *  hears it as the trade page's "The cost to open", two orders larger). The
   *  second figure's words are the warehouse schema's own reading of
   *  `setup.total_days` ("realistic time to be trading"), not "until the doors
   *  open", because the figure stops at the last filing step and the doors
   *  also wait for a fit-out nobody measured. The basis is composed from the
   *  figures the card prints, one clause each (the glance's rule): both on
   *  the 91 countries where both print ("Fees and a first licence, all in;
   *  days run until the last step clears.", fourteen words, PART 7's cap,
   *  the skeptic's own count), one on the 70 where one does. The foot is the
   *  exclusion the reader needs where the bill prints (thirteen words), and
   *  names a modelled figure in words, because the sample mark is switched
   *  off and the foot is the only line left that can say it. The three
   *  withheld lines are the brief's, verbatim, in PART 5's shape. Every
   *  string here was read aloud first. */
  entryBill: {
    kicker: "The bill to register",
    /** After the second figure, on its line: "21 days until you can trade". */
    daysWords: "until you can trade",
    /** The figure's words under the bill (2026-09-25), and the plus of licences by trade (country_licences_rows.ts). */
    focalWords: "limited company, all in",
    /** Where one step is the only one that costs money (the bill is that fee): the line says the rest are free. */
    focalWordsOneFee: "limited company, all in: the other {n} steps are free",
    focalWordsLocalFee: "limited company, all in: the {fee} online fee, the other {n} steps free",
    licences: { summary: "Licences by trade", noWait: "0 days", noLicence: "No licence needed", /** A shard's trade name over three words, as a row label (ROW SENTENCE; plan 2026-10-13 country-page-journey, Task 3D). */ short: { "Bar / restaurant (alcohol)": "Selling alcohol", "Taxi / private hire": "Taxi or minicab", "Most retail and online": "Retail and online" } as Record<string, string> },
    /** The one line: the bill's where it prints, the days' otherwise (entry_bill_rows.ts). */
    basisBill: "Fees and a first licence, not share capital.",
    basisDays: "Days until the last step clears.",
    foot: "",
    /** `{what}` is "the bill", "the days" or "the bill and the days"; `{verb}` is "is" or "are". */
    footModelled: "",
    names: { bill: "the bill", days: "the days" },
    withheld: {
      bill: "No reliable figure for the bill yet.",
      days: "No reliable count of the days yet.",
      billNotOnFile: "No figure for the bill yet.",
      /** Reachable by the guard's shape and by no country today (the days are held for 195 of 195). */
      daysNotOnFile: "No count of the days yet.",
    },
  },
  /** POWER AND LIVING COSTS (MODEL.md 8.2, `06 running-costs`; plan step 31,
   *  fourth dispatch, 2026-09-18). The kicker is the brief's, four words, and
   *  promises only what the card holds (the block's own name, "What else the
   *  month costs", stays in the rail and the skeleton). The two labels are
   *  the brief's: four words and three, the fact-cell cap. The basis is
   *  composed from the cells the card prints, one clause each (the glance's
   *  rule): "The commercial rate, 2024; living costs with rent, where New York
   *  is 100." on the 91 countries where both print, thirteen words, the
   *  brief's own line; the year is the profile file's stated convention, and
   *  New York is the published scale's reference, named because PART 5 says
   *  a base has to be named and never a coined word. The foot names in words
   *  what is modelled, because the sample mark is switched off: the
   *  electricity rate where the profile row is interpolated (tier B or C),
   *  and the cost of living always, since the country figure is the covered
   *  cities' readings weighted by population, a weighting this repo chose,
   *  and the foot says how many cities it stands on so a reader knows when
   *  it is one city's number. The two withheld lines stand in PART 5's shape:
   *  the electricity rate wherever the file holds the fill value (R11, clause
   *  46; `{n}` is the number of countries sharing it, counted off the file,
   *  never typed), and living costs where no covered city holds a reading.
   *  Every string here was read aloud first. */
  runningCosts: {
    /** RUNNING COSTS (his corrections 6 and 7 of 2026-09-20): the costs that
     *  are the same everywhere in the country, placed among the countries;
     *  "premises" and "power and living costs" are gone as names. The rows
     *  print a label under three words (PART 9 clause 13) with the unit beside
     *  the figure; the cost of living stands on the city scale, 1 at the
     *  cheapest covered city and 100 at the dearest, and the basis says so
     *  without naming either city (his ruling). The cells and the old basis
     *  stay for the copy gate's sweep and the builder's other readers. */
    kicker: "Running costs",
    rows: { electricity: "Business electricity", living: "Cost of living" },
    units: { kwh: "a kilowatt hour", of100: "/100" },
    cells: { electricity: "Electricity per kilowatt hour", living: "Cost of living" },
    /** The one line explains the cost of living's 1-to-100 scale; the electricity row names its own rate ("Business electricity"), so it adds no clause. */
    basisElectricity: "",
    basisLiving: "Cost of living: cheapest city 1, dearest 100.",
    footElectricityModelled: "",
    footLevels: "",
    /** `{n}` is the count of covered cities the figure is weighted from, spelled out to ten. */
    footLivingModelled: "",
    footLivingOneCity: "",
    withheld: {
      /** `{n}` is the number of countries whose file row holds the fill value, counted at build. */
      electricityFill: "No reliable electricity rate for this country yet.",
      livingNotOnFile: "No living costs yet: we cover no city here.",
    },
  },
  /** The terminus (where to next): doors that leave the page. Run 4 of the architecture loop refused "with Pro" while Pro cannot be bought and "the deepest city" as jargon; the city door says a figure the list holds. */
  close: {
    kicker: "Where to next",
    cityDoor: "Start in {city}",
    cityDoorMany: "Start in {city}, the largest of {n} cities here",
    tradesDoor: "See every trade measured here",
    proDoor: "Get notified when Pro opens",
  },
  /** BEFORE YOU COMMIT (MODEL.md 8.2, `18 checks`; plan step 31, fifth
   *  dispatch, 2026-09-18): THE SITE'S ONE QUESTION BANK, the strings of the
   *  composition's section 9 verbatim (research/2026-09-11/country/
   *  COMPOSITION.md), read aloud there and not rewritten here. A check is a
   *  QUESTION, never a verdict (PART 9 clause 45, R10: "Registering is the easy
   *  part" was a verdict asserted on 43 pages holding no registration time,
   *  and it is gone with "is not instant"). The country is not named in any
   *  row: the h1 names the place once and clause 11 bans naming it twice.
   *  Each question with its character count, the E1 gate's arithmetic (runs of
   *  30 or more characters carrying a space, summed, red over 220 on a card
   *  without the editorial exemption, which this card does not carry):
   *  price 42; margin held 50, not held 43; wait over 21 days 52, 21 or under
   *  51; the basis 32. Worst case 42 + 50 + 52 + 32 = 176 of 220, best 117.
   *  The trade page's `02 suits` (plan step 33) reads the same rows from
   *  checks_rows.ts where its subject matches, so a check is the same words
   *  on both pages (M20). The basis says in four words that nothing is
   *  scored, saved or tapped, so a reader does not look for a control that is
   *  not there; "Two questions" where the third row self-omits. */
  checks: {
    kicker: "Before you commit",
    basis: { three: "Three questions, nothing scored.", two: "Two questions, nothing scored." },
    rows: {
      price: { label: "Your price", question: "Can customers here pay the price you need?" },
      margin: {
        label: "The margin",
        held: "Is there a real margin left after tax and payroll?",
        notHeld: "Do you know what tax and payroll will take?",
      },
      wait: {
        label: "The wait",
        over: "Have you planned for the weeks before you can trade?",
        under: "Have you tested the demand before you sign a lease?",
      },
    },
  },
  /** COMPARE COUNTRIES (MODEL.md 8.2, `19 compare`; the same dispatch): one
   *  pill door to the compare tool, the same construction as the city's
   *  `cityClose.compareDoor` on the other noun, the name through
   *  `inSentence()` ("the United Kingdom", "France"). The kicker is two words
   *  and descriptive; the old eyebrow "Next move" is clause 11's ban. No basis
   *  line: the card measures nothing, and the old sentence naming the three
   *  things compared was a paragraph (PART 7). */
  compare: { kicker: "Compare countries", door: "Compare {country} with other countries" },
  /** The pay bars (what staff cost), founder rulings 13 and 14 of 2026-09-04: the words "minimum salary" and "average salary", the edge at the world's highest, a pair under ten percent apart withheld.
   *  THE EDGE LOST ITS NAME (his words, 2026-09-07): "you point the thing which
   *  says the world's highest, which is Switzerland. That's very bad. You
   *  should never put the limit out there." The track still ends at the
   *  world's highest (worldMax still sets it, ruling 13 stands); only the
   *  label naming the country and figure at that edge is gone, so `edge` is
   *  deleted rather than reworded. */
  pay: {
    kicker: "What staff cost",
    minimum: "Minimum salary",
    average: "Typical salary",
    withheld: "Pay is not shown: typical pay sits too close to the minimum.",
    /** The employer's share standing as its own figure where no hire's lever draws (milestone 1, M3: the average's bar it rode on left the card). */
    employerShare: "employer's share on top of pay",
    /** The staff card's one figure since milestone 1, M3: the minimum wage's cost of a full-time year. */
    focalWords: "a year, full time at the minimum wage",
  },
  /** THE PLACEMENT SENTENCE (MODEL.md PART 6, decision 2; PART 9 clause 37,
   *  R2): one fixed wording, one direction, on every page of the site, beside
   *  every figure drawn on a world track. `{n}` is a tenth in words, one to
   *  nine; `{noun}` is "countries" or "cities" (the singular for one). The
   *  bottom tenth has its own sentence rather than a second direction. Filled
   *  by ONE builder, src/lib/spine/placement.ts, and by nothing else; the copy
   *  gate reads the filled sentences off that builder. */
  placement: {
    higher: "Higher than {n} {noun} in ten.",
    lowest: "Among the lowest tenth.",
  },
  /** THE COUNTRY PAGE'S THREE CHAPTER TURNS (MODEL.md 8.2, verbatim; PART 1:
   *  only the three turns carry a chapter break, "a spread does not number its
   *  cover or its back page"). Drawn by the kit's Movement, the index and one
   *  plain heading, no eyebrow, no icon (8.4). */
  chapters: {
    costs: COSTS_CHAPTER,
    where: "Where to open it, and what to open",
    place: "What the place is like",
  },
  /** THE KIT TO OPEN, AT FOUR BUDGETS (sections/StockTiers.tsx, 2026-09-25; his "cheap, medium, premium, luxury ... 3 chairs of
   *  different kinds"). Labels, never sentences; the one line under the span names the shop and the VAT, nothing else. */
  stock: {
    kicker: "Kit to open",
    spanWords: "the kit for {shop}, before VAT",
    spanJoin: "to",
    tiers: { budget: "Budget", mid: "Mid-range", premium: "Premium", luxury: "Luxury" },
    pick: "Budget",
    more: "{n} more items",
    cats: {
      chair: "Chairs", clippers: "Clippers", trimmer: "Trimmers", foil_shaver: "Shavers", station: "Stations", backwash: "Backwash",
      hot_towel_cabinet: "Towel warmer", steriliser: "Steriliser", scissors: "Scissors", cape: "Capes", card_reader: "Card reader",
      "card-reader": "Card reader", reception_desk: "Reception desk", "espresso-machine": "Espresso machine", grinder: "Grinders",
      "water-filter": "Water filter", "undercounter-fridge": "Fridges", "display-chiller": "Display chiller", dishwasher: "Dishwasher",
      "batch-brewer": "Batch brewer", blender: "Blender", chairs: "Chairs", tables: "Tables", crockery: "Cups and saucers",
    } as Record<string, string>,
  },
  /** WHO MAKES IT PAST THE FIRST YEARS, AND WHAT HOLDS SMALL FIRMS BACK (sections/FirstYears.tsx, Obstacles.tsx, 2026-09-25). */
  firstYears: {
    /** The region lever (goal 2026-09-26): its label, the words with a region, and the default option where the file names no place. */
    choose: "Region",
    focalWordsIn: "of new firms still trading after {n} years in {region}",
    countryFallback: "The whole country",
    kicker: "Who is still trading",
    focalWords: "of new firms still trading after {n} years",
    start: "Start",
    year: "Year {n}",
    regions: "By region, year {n}",
    obstaclesWords: "of small employers call {item} a major obstacle",
    obstacles: {
      tax: "Tax", energy: "Energy prices", "red-tape": "Red tape", competition: "Rivals", staff: "Finding staff",
      "late-payment": "Late payment", premises: "Premises", finance: "Getting finance",
    } as Record<string, string>,
  },
  /** WHO SPENDS ON IT, BY INCOME (sections/SpendByIncome.tsx, 2026-09-25; his "By purchasing power"). The item named as a reader
   *  says it; the survey's tenths are named at the two ends only. */
  spendByIncome: {
    kicker: "Spending by income",
    focalWords: "of {item} spending comes from the richest fifth",
    items: { hairdressing: "hairdressing and beauty", "eating-out": "eating-out", groceries: "food and drink" } as Record<string, string>,
    caption: "A household's week, by income tenth",
    /** A column's readout (2026-09-26): its tenth, poorest the first. */
    readout: "a week, income tenth {n} of 10",
    poorest: "Poorest tenth",
    richest: "Richest tenth",
  },
  /** WHO SPENDS ON IT, BY AGE (sections/SpendByAge.tsx, 2026-09-26). The survey's "age of the household reference person" said as
   *  who leads the household; the category as the survey names it, so "restaurants and hotels" and never "eating out", which it is
   *  not (it holds hotel stays). */
  spendByAge: {
    kicker: "Spending by age",
    focalWords: "of spending on {item} comes from households led by {who}",
    items: { "restaurants-hotels": "restaurants and hotels", food: "food and soft drinks", clothing: "clothes and shoes", recreation: "leisure" } as Record<string, string>,
    bands: { under30: "Under 30", "30to49": "30 to 49", "50to64": "50 to 64", "65to74": "65 to 74", "75plus": "75 and over" } as Record<string, string>,
    who: { under30: "under-30s", "30to49": "30 to 49 year olds", "50to64": "50 to 64 year olds", "65to74": "65 to 74 year olds", "75plus": "people 75 and over" } as Record<string, string>,
    bars: { households: "Households", money: "The money" },
  },
  /** THE APPS A SHOP RUNS ON (sections/LocalApps.tsx, 2026-09-25). The fee's unit as a symbol after the figure, never a phrase. */
  localApps: {
    kicker: "The apps shops use",
    of: "of",
    /* Read with the figure: "12 of 19" then "listed apps were founded here" (the first words, "of these apps ...", doubled the
       figure's own "of"). */
    focalWords: "listed apps were founded here",
    allFree: "All free",
    jobs: { bookings: "Bookings", payments: "Card payments", accounts: "Accounts", banking: "Banking", payroll: "Payroll", reviews: "Reviews", hiring: "Hiring" } as Record<string, string>,
    fee: { free: "Free", perSale: "/sale", perNewClient: "/new client", perMonth: "/mo", perYear: "/yr", perAd: "/ad" },
  },
  /** WHO HOLDS THE MARKET (sections/MarketHold.tsx, 2026-09-25). */
  marketHold: {
    kicker: "Who holds the market",
    markets: { grocery: "groceries" } as Record<string, string>,
    focalWords: "of {market} sold by the {n} biggest chains",
    rest: "Everyone else",
  },
  /** THE JOB MARKET (sections/JobMarket.tsx, 2026-09-25). */
  jobMarket: {
    focalWords: "out of work and looking",
    /* "Under 25", not "Aged 16 to 24" (the model laws' ROW SENTENCE, four words, on the page's first render): the rate counts the
       16 to 24s, and nobody under 16 is in the count, so the two say the same. */
    rates: { all: "Everyone", youth: "Under 25" } as Record<string, string>,
    sectors: { hospitality: "Hospitality" } as Record<string, string>,
    vacancies: "vacancies per 100 jobs",
    payroll: "staff on payroll, a year on",
  },
  /** WHO THE CUSTOMERS ARE (sections/AgeMix.tsx, CustomersCome.tsx, Origin.tsx, 2026-09-25; his "By age ... By origin, native,
   *  immigrant, tourist ... pedestrians, car or online"). Labels, never sentences. */
  people: {
    age: {
      kicker: "People by age",
      focalWords: "of people in {place} are 25 to 49",
      bands: { under16: "Under 16", "16to24": "16 to 24", "25to49": "25 to 49", "50to64": "50 to 64", "65plus": "65 and over" } as Record<string, string>,
    },
    come: {
      kicker: "How customers come",
      focalWords: "of retail sales are made online",
      trips: "Trips in {place}",
      modes: { walk: "On foot", car: "By car", public: "Bus and train", other: "Other" } as Record<string, string>,
    },
    origin: {
      kicker: "Born abroad, and visitors",
      focalWords: "of people in {place} were born abroad",
      visits: "visits from abroad a year",
      overnight: "overnight visits from abroad a year",
    },
  },
  /** THE LINES A FIRST YEAR CROSSES (sections/Thresholds.tsx, 2026-09-25). A note is five words or fewer. */
  thresholds: {
    kicker: "Lines to cross",
    lines: {
      vat: { label: "VAT registration", note: "", words: "of sales in 12 months, and VAT registration begins" },
      rates: { label: "No business rates", note: "rateable value or less" },
      wage: { label: "Minimum wage", note: "from age 21", unit: "/h" },
      allowance: { label: "Employment allowance", note: "off employer's National Insurance" },
      /* The rates from the file, never written here (a country's figure is the file's to hold), and in the note: "Profit taxed at
         19%" was a four-word label, the model laws' ROW SENTENCE, on the trade page's first render. */
      "small-profits": { label: "Lower profit tax", note: "{rate} up to this, {pct} over {upper}" },
    } as Record<string, { label: string; note: string; words?: string; unit?: string }>,
  },
  /** THE COUNTRY PAGE'S NEW SECTIONS (country_depth_rows.ts, 2026-09-25). Labels the same on every country; a note is the one short
   *  line that says what the figure is, never a method line. */
  employment: {
    focalWords: "out of work and looking",
    leaveWords: "paid holiday a year, bank holidays included",
    cells: { leave: "Paid leave", out: "Unemployed", week: "Longest week", sick: "Sick pay", dismissal: "Unfair dismissal", maternity: "Maternity pay" },
    notes: { leave: "a year, with bank holidays", out: "", week: "opt-out allowed", sick: "a week, from day one", dismissal: "of service before a claim", maternity: "at the statutory rate" },
  },
  /** THE RULES THAT CHANGED AND THE ONES COMING (2026-10-04, the UK page reform; DatedChanges.tsx, country_rules.ts). */
  changes: { kicker: "Changes to the rules", comingKicker: "Rule changes coming", madeKicker: "Recent rule changes", more: "{n} more changes", moreOne: "1 more change" },
  /** THE LAW BEHIND A SECTION'S FIGURE, as ruled rows (2026-10-04; rules.json through country_rules.ts). Labels three words or
   *  fewer, notes eight or fewer, never a sentence that concludes. */
  rulesRows: {
    payments: {
      readers: "Card readers",
      readersNote: "in person, no monthly fee",
      payoutNote: "some readers within minutes",
      cash: "Cash, all payments",
      cashNote: "{then} in {thenYear}",
      basis: "Shop sales by number of payments, {period}",
    },
    ratesNote: "per £1 of value, England",
    reliefNote: "rateable value, one property",
    retailNote: "below £51,000, England",
    sickNote: "from day one",
    noticeNote: "per year worked, to 12 weeks",
    holidaysNote: "{year}, England and Wales",
    lateAccountsNote: "1 to over 6 months late",
    statementWords: "a year to file the company statement, online",
  },
  financing: {
    focalWords: "average rate on a new small-business loan",
    cells: { base: "Central bank rate", startup: "Start-up loans" },
    notes: { base: "", startup: "{rate} fixed, {min} to {max} years", startupLocal: "{min} to {max}, {rate} fixed", grantFor: "for" },
    /** The start-up loan's term, read by the note and the loan lever alike, so the two never disagree. */
    startupTerm: { min: 1, max: 5 },
    /** The loan lever (goal 2026-09-26, M3). */
    loan: { label: "A start-up loan", perMonth: "a month", amount: "Amount", years: "Years", yearsUnit: "years", total: "repaid in all" },
  },
  /** The world's range under a figure (charts/WorldRange.tsx, 2026-09-25): the median's word and the rows' labels and units. */
  ranged: { ends: { lowest: "Lowest", highest: "Highest" }, electricity: "Business electricity", electricityWords: "per kWh of business electricity", perKwh: "/kWh", diesel: "Diesel", dieselNote: "at the pump", perLitre: "/L", lending: "Rate on a small-business loan", peers: "Peers" },
  /** What a full-time hire at the average salary costs the employer (the staff card, 2026-09-25). */
  hireCost: { label: "A full-time hire", labelFirst: "A first hire", unit: "a year", pay: "pay", salary: "Salary", onCost: "employer's share", pension: "pension", ni: "employer NI", rule: "{rate} on pay above {threshold} a year.", niLabel: "Employer NI", niRule: "{rate} above {threshold}, less the {allowance} allowance", pensionLabel: "Pension", pensionRule: "{rate} of pay from {lower} to {upper}", lever: "Pay" },
  /** WHAT LONDON'S TRADES TAKE (country_depth_rows.ts `buildLondonTradeSales`; plan 06, task B3b, 2026-10-04): the register's
   *  typical yearly sales by trade, the figure each trade page's head prints, in place of the curated file's net margins. */
  londonSales: {
    kicker: "What London's trades take",
    more: "{n} more trades",
    /** The key under the bars for the tick at the middle trade (goal 2026-09-26, M6). */
    middleKey: "Middle trade",
    /* Read with the figure: "$212K typical yearly sales of the middle trade", the trade pages' own label for the median. */
    focalWords: "typical yearly sales of the middle trade",
    /** A row's label in three words or fewer (the model laws' ROW SENTENCE read three four-word trade names on the UK page,
     *  2026-09-25): the registry's name where it is short enough, this where it is not. The row still opens the trade's page. */
    short: {
      "marketing-design-agencies": "Marketing agencies",
      "veterinary-pet-care": "Veterinary care",
      "dry-cleaning-laundry": "Dry cleaners",
      "cafes-coffee-shops": "Cafés",
    } as Record<string, string>,
    /** A shared code's row, keyed by its codes joined with "+": the code's own name in plain words, three words at the most, since
     *  the figure is every business on the code (barbershops and nail salons read one code, 96020). A shared code without a name
     *  here draws no row. */
    groups: {
      "96020": "Hair and beauty",
      "56302+56301": "Bars and clubs",
      "93130+93110": "Sports and fitness",
      "45200": "Motor repair",
      "55100": "Hotels and guesthouses",
      "56103": "Takeaway food",
      "56102": "Cafés, unlicensed restaurants",
    } as Record<string, string>,
  },
  /** The income breakdown (task 11, his most literal instruction, 2026-09-10):
   *  "the income breakdown is used exactly for income breakdown with the main
   *  figure being the net income percentage." It replaces the section he
   *  called totally broken ("for the net profit margin, this section that
   *  you have created, it's totally broken") with his own form: a headline
   *  percentage, one segmented bar, a legend beneath. The nine cost lines
   *  are a GLOBAL BASELINE (data/finance/industry_cost_profile_v1.json's own
   *  `anchor` field), flexed by country elsewhere in the product but not
   *  here, so every figure this card prints is modelled rather than measured
   *  for any one place: his ruling of 2026-09-08 on this exact section ships
   *  it "labelled sample, and quiet", the accent moved off it. */
  incomeBreakdown: {
    kicker: "Income breakdown",
    netLabel: "Net income",
    /** The costs-only bar's words for a screen reader (2026-09-26): its shares are of the costs, not of sales. */
    ofCosts: "of the costs",
    /** The costs-only legend's head, a label (2026-09-26). */
    costsHead: "Share of costs",
    basis: "This trade's typical split of revenue, the same everywhere.",
    otherLabel: "Smaller costs",
    residualLabel: "Unallocated",
    /** One word per cost line the source file can name, in the practical
     *  register. `otherLabel` above is a different concept (the builder's
     *  own aggregate of the lines too small to name) and stays distinct from
     *  "Overhead" here, which is one specific line, so a reader never sees
     *  the two side by side and mistakes one for the other. */
    lines: {
      cogs_share: "Cost of goods",
      labor_share: "Labor",
      rent_share: "Rent",
      energy_share: "Energy",
      marketing_share: "Marketing",
      software_share: "Software",
      insurance_share: "Insurance",
      motor_vehicle_share: "Vehicles",
      other_overhead_share: "Overhead",
    },
  },
  /** The how-to page, "How to open a business in [country name]" (founder ruling 8, 2026-09-04). */
  howto: {
    title: "How to open a business in {country}",
    lead: "",
    cells: "What a business pays",
    forms: "What each form is",
    dots: "What the dots mean",
    dotLabels: ["One dot", "Two dots", "Three dots", "Four dots", "Five dots"],
    back: "Back to {country}",
  },
  /** The city masthead through the answer card. THE ANSWER'S LABEL is
   *  "Typical customer pay" (MODEL.md 8.3, `00 masthead`; plan step 32's
   *  fourth dispatch, 2026-09-18): the figure comes from the one builder for
   *  a city's typical income (city_income.ts, `owner_col.median_salary_usd_mo`
   *  times twelve), a median, so the label says typical and never average
   *  (the first dispatch's "Average customer pay" named the city list's mean,
   *  which the masthead no longer prints; a mean is never printed under
   *  "typical" nor a median under "average"). M16: "What customers earn" is
   *  `07`'s kicker, and the two cards now share one FIGURE, not one name.
   *  The basis says the unit and neither "before tax" nor "take-home": the
   *  shard carries no marker (item 24); it gains the word "modelled" where
   *  the figure's tag is not held, since the mark is off site-wide; and where
   *  the builder falls back to the country's typical it is
   *  `cityCustomers.countryBasis`, naming the country (no city today). */
  cityHero: {
    subtitle: "",
    allCities: "All cities",
    answerLabel: "Typical customer pay",
    answerBasis: "Pay, a year.",
    answerBasisModelled: "Pay, a year.",
  },
  /** AT A GLANCE, the city's (MODEL.md 8.3, `01 glance`; plan step 32's
   *  first dispatch, 2026-09-18): the country's form one altitude down (R8,
   *  clause 43), the kicker the country's own (`glance.kicker`). Four cells
   *  are the card's to print and three of 8.3's seven are printed elsewhere
   *  on the page and never here (M1, one figure once): the metro GDP and the
   *  cost of living are `02`'s, and the average pay is the masthead's
   *  answer. The withheld line names each cell the card does not hold and
   *  why, with the count (PART 5); the foot names the modelled cells in
   *  words, because the sample mark is switched off. Every string here was
   *  read aloud first. */
  cityGlance: {
    /** "Per 10,000 residents" over "371 businesses", not "Businesses per
     *  10,000 residents" over "371": the longer label wrapped at the 220px cell
     *  of a 1-1 band at lg, where the grid reserves one line, photographed on
     *  London with "371" a line under "56 days" beside it (ruling 8, figures
     *  in one row level); and the noun on the figure spares the basis a clause
     *  (the art-direction gate's E1 budget of 220 characters of prose a card,
     *  which the first draft's three lines ran to 231 on London and would have
     *  run to 273 on Frankfurt, two withheld). Every string here is sized so
     *  the worst case, two withheld and two modelled, stays under 220. */
    cells: { visitors: "Visitors a year", days: "City permits", density: "Per 10,000 residents" },
    /** The one unit clause the labels do not carry themselves: "56 days" of what. Visitors a year and businesses per 10,000 residents say their unit in the label and the figure. */
    units: { days: "days to clear the city's own permits" },
    /** `{what}` is a list of the names below; `{verb}` is "is" or "are". */
    footModelled: "{what} {verb} estimated.",
    /** The cells as the foot names them, singular so the sentence reads: "The permit days and the business count are modelled." */
    footNames: { days: "the permit days", density: "the business count" },
    /** `{n}` of the four cells, `{reasons}` the joined reasons below. */
    withheld: "{n} of 4 left out: {reasons}.",
    reasons: {
      /** Item 20: the country's arrivals divided by a size-class constant, which is not a count of this city's visitors. */
      visitorsCountry: "the visitor count is the country's",
      visitorsNone: "no visitor count yet",
      /** Every row on file is the country's figure plus a step for the city's size class; no city holds a reading of its own. */
      hdi: "human development is the country's figure",
      daysNone: "no permit days yet",
      densityNone: "no business count yet",
    },
  },
  /** AMONG THE CITIES, the city's `02 among-cities` (MODEL.md 8.3; the same
   *  dispatch): the seat of the placement form (candidate 2 in
   *  FORM-CATALOG's CANDIDATES AWAITING HIS CLICK), held by KvGrid with the
   *  two figures alone until he clicks; the foot says the placement is not
   *  drawn and names what is modelled (item 31: the metro GDP has no source
   *  on any row and the file calls it approximate; the cost of living is an
   *  analyst's hand anchor on 239 of 252 rows). The cost of living's label is
   *  the country's running-costs cell's own, so one reading has one name. */
  citySeat: {
    kicker: "Among the cities",
    cells: { gdp: "Metro GDP" },
    /** One unit clause per printed figure, joined with "; " (both print on every city today: "GDP across the metro area in a year; living costs with rent, cheapest city 1, dearest 100."). The living clause is the country card's since 2026-09-20 (his ruling: the scale's ends are never named). */
    units: { gdp: "GDP across the metro area in a year", living: "living costs with rent, cheapest city 1, dearest 100" },
    /** The foot is composed: the modelled clauses that apply (the GDP on every city; the cost of living on the 239 hand-anchored rows, not on the 13 read city-level), joined with " and ", then the placement sentence, whose pronoun follows the count of cells ("each" over two, "it" over one). On the exemplar: "The metro GDP is approximate and the cost of living is anchored by hand; where each sits among the cities is not shown yet." The word "index" never prints: BANNED CONSTRUCTION names it as machinery. */
    footGdp: "the metro GDP is approximate",
    footLiving: "the cost of living is anchored by hand",
    footPlacement: "where each sits among the cities is not shown yet.",
    footPlacementOne: "where it sits among the cities is not shown yet.",
    /** Since 2026-09-20 the cost of living stands on the city scale (the bar), so only the GDP's placement is unshown and the sentence names it. */
    footPlacementGdp: "the GDP's place among the cities is not shown yet.",
  },
  /** The city's terminus (city:close, run 19): the doors out of a city page; the kicker is the close's.
   *  THE DISTRICT DOOR NAMES NO DISTRICT (plan step 32's sixth dispatch,
   *  2026-09-18). It read "Start in {district}" for the lightest-rent district
   *  on London; that is the cheapest member featured for being the cheapest,
   *  the reason he struck out on 2026-09-10 ("featuring one neighborhood ...
   *  just for the fact that it's cheaper. It is not justifiable"), and a door
   *  is a recommendation a reader follows. The door is the districts page's on
   *  every city, 8.3's "the districts door". */
  cityClose: { districtsDoor: "Every district of {city}", countryDoor: "Open a business in {country}", compareDoor: "Compare {city} with other cities" },
  /** THE PREMISES BENTO, the city's `04 premises` (MODEL.md 8.3; plan step
   *  32, second dispatch, 2026-09-18): four readings of the city's own shop
   *  space off the shard's `realestate.*`, his A2 cluster in his B4 cells. The
   *  four openers are 8.3's own words, verbatim. No cell prints a label under
   *  its figure: the opener says what the figure is (PART 5, the bento's own
   *  clause). A basis says the unit in a person's words and never what the
   *  figure means; where the figure's tag is not held it gains "; modelled
   *  for this city" (the sample mark is behind the switch, so the basis is
   *  the only line that can say it). Every string here was read aloud.
   *  "a square metre a year" is on the banned list below, so the rent's line
   *  names the space and then the year. The builder is premises_bento_rows.ts.
   *  The strip of the country's three rents by city size that held this seat
   *  (city:premises, run 13; `COPY.cityPremises`) left with it: it printed a
   *  country average under a city's name. */
  premisesBento: {
    /** `rentValued`: the rent cell's opener where the figure is the official valuation of the region's shops, an average and not a
     *  prime rent (a city held to a register region, London; masterplan step 03, 2026-10-05; the labels audit's item 24). */
    kickers: { rent: "Prime shop rent", rentValued: "Shop rent", empty: "Shops standing empty", fitOut: "Fit-out cost", deposit: "Deposit up front" },
    /** The valued rent's second reading (clause 65): the same valuation for England's shops. */
    rentEngland: "across England",
    basis: {
      rent: "A square metre of prime shop space, a year",
      /** The valuation's own date: the rateable value estimates the rent at 1 April 2021. */
      rentValued: "A square metre of shop space, a year, at 2021 values",
      /** The fit-out on a page that prints a sourced figure or a marked one: no source holds it or its rent-free months. The line is one plain
       *  line that keeps the figure's unit and opens with the plural "Estimates", which covers the figure and its companion, the rent-free
       *  months, by the convention rentEstimate's comment states below. The line does not name the months. */
      fitOutEstimate: "Estimates: a square metre fitted out",
      /** The six UK cities held to sources and to no register region (plan 2026-10-08, uk:cities-sourced-or-marked): the shard's
       *  figures, each cell's one line saying they are estimates; "Estimates" covers the cell's details and its companion. */
      rentEstimate: "Estimates: a square metre of prime shop space, a year",
      depositEstimate: "Estimates: months of rent held as the deposit, and the lease term",
      emptyEstimate: "Out of every 100 shops, an estimate",
      /** The count prints the shard's rate as read and draws it, a part unit and all (2026-09-26); the line frames it and prints no figure. */
      empty: "Out of every 100 shops",
      fitOut: "To fit out a square metre of shop space",
      deposit: "Months of rent held as the deposit on a shop",
    },
    /** Joined to a basis with "; " where a printed figure's tag is not held. */
    modelled: "",
    /** The deposit's unit words, beside its figure: "6 months", "1 month". */
    months: { one: "month", many: "months" },
    /** THE DETAILS BEHIND A FIGURE, his plus (his word after the push of
     *  2026-09-20: "prime shop rent $5,000, the fit-out cost, all of these
     *  things need details"; MODEL PART 9 clause 60): the fields the shard
     *  holds around the figure, drawn on DetailPanel under the cell, closed
     *  on arrival. The rent's three: the secondary-street rent, the service
     *  charge, the rent's yearly trend. The deposit's two: the lease term and
     *  the rent-free months. The fit-out and the empty shops hold no second
     *  field on any shard today (DATA-REQUIREMENTS item 85). Labels under
     *  three words; a value is a figure with its unit. */
    detail: {
      rent: { summary: "What the rent comes with", rows: { secondary: "Secondary street", service: "Service charge", trend: "Rent trend" } },
      deposit: { summary: "The lease terms", rows: { lease: "Lease term", rentFree: "Rent-free months" } },
      /** The companions beside a figure (2026-09-20 night, clause 65): the fit-out's rent-free months, the deposit's lease term; each in the companion row's words. */
      companions: { rentFree: "rent-free to fit out", lease: "the lease it is held on" },
      units: { sqmYear: "a square metre, a year", aYear: "a year", years: { one: "year", many: "years" }, months: { one: "month", many: "months" } },
    },
    /** PART 5's stated line, standing where the figure would, one per cell the bank does not hold. */
    withheld: {
      rent: "No prime rent figure for this city yet.",
      empty: "No empty-shop rate for this city yet.",
      /** Reachable by the guard's shape and by no city today (every rate on file sits between 0.5 and 41.3). */
      emptyNotAShare: "No reliable empty-shop rate for this city yet.",
      fitOut: "No fit-out cost for this city yet.",
      deposit: "No deposit figure for this city yet.",
    },
  },
  /** WHAT CUSTOMERS EARN, the city's `07 earnings` (MODEL.md 8.3; plan step
   *  32's fourth dispatch, 2026-09-18): the kicker is the country's words
   *  (M16, `CUSTOMERS_KICKER`). The strip's middle mark is the city's own
   *  typical pay from the one builder (city_income.ts) and the outer marks
   *  are the country's bottom and top tenth, so the basis says whose each is
   *  (M5's words: "Typical pay here; the spread is the country's"). Where the
   *  country holds no deciles, or the city's typical falls outside them (a
   *  net figure under a gross bottom tenth: 15 cities below, 1 above, counted
   *  2026-09-18), the typical stands alone and the note says why the spread is
   *  not drawn. Where the city holds no typical of its own the whole strip is
   *  the country's and `countryBasis` says so (no city today). "Modelled" in
   *  the note where the figure's tag is not held. Never "before tax" or
   *  "take-home" (item 24), never "median". */
  cityCustomers: {
    kicker: CUSTOMERS_KICKER,
    basis: "Typical pay here, a year. Both tenths are for the whole country.",
    basisAlone: "Typical pay here, a year.",
    noSpread: "",
    outside: "",
    modelled: "",
    countryBasis: "Full-time pay a year across {country}.",
  },
  /** THE THREE CARDS THE CITY FACT BANK FEEDS (2026-09-17, CITY-PROGRAMME step
   *  1a, research item 21): one person's living costs, a year of rent against
   *  a year of typical income, and what a resident spends. The builders are
   *  in src/lib/spine/fact_rows.ts; every string here was read aloud first.
   *
   *  THE FOOT CARRIES THE WORD "MODELLED" OR "PLACEHOLDER" WHERE A FIGURE IS
   *  NOT HELD, because the sample mark is switched off site-wide
   *  (areSampleMarksVisible, 2026-09-11) and the foot is the only line left
   *  that can say it, the glance's idiom. A card on a modelled figure that
   *  said nothing would be asserting a measurement. The foot names WHICH
   *  cells are weak, so a held rent beside a modelled pay does not tar the rent. */
  /** WHAT LIVING HERE COSTS, the city's `05 living` (MODEL.md 8.3; plan step
   *  32's third dispatch, 2026-09-18): the fact card, four cells on KvGrid,
   *  the seat of candidate 1 (the fact card with a focal) until his click. The
   *  kicker is 8.3's own title. The unit sits in each cell's qualifier line
   *  ("a month", "a cup"), the mockup's markup, so the click changes the rung
   *  and nothing else. The basis says whose prices these are (founder C4,
   *  2026-07-11: personal, never the shop's) and never what they mean. The
   *  withheld line names each cell the card does not hold and why, with the
   *  count (PART 5); no city takes it today (252 of 252 hold all four). */
  cityLiving: {
    kicker: "What living here costs",
    cells: { rent: "One-bed rent", groceries: "Groceries", transit: "Transit pass", coffee: "A coffee" },
    units: { month: "a month", cup: "a cup" },
    basis: "Prices for one person living here, not for the shop.",
    /** A page held to a register region: no source holds these prices, so the line says they are estimates. */
    basisSourcedOnly: "Estimates for one person living here, not for the shop.",
    /** `{what}` is a list of the names below; `{verb}` is "is" or "are". */
    footModelled: "",
    footPlaceholder: "{what} {verb} placeholders until {city} is researched.",
    /** The cells as the foot names them: "The one-bed rent, groceries, the transit pass and the coffee are modelled." */
    footNames: { rent: "the one-bed rent", groceries: "groceries", transit: "the transit pass", coffee: "the coffee" },
    /** `{n}` of the four cells, `{reasons}` the joined reasons below. */
    withheld: "{n} of 4 left out: {reasons}.",
    reasons: {
      rent: "no one-bed rent yet",
      groceries: "no grocery prices yet",
      transit: "no transit pass price yet",
      coffee: "no coffee price yet",
    },
  },
  /** RENT AGAINST INCOME, the city's `06 runway` (MODEL.md 8.3; the same
   *  dispatch): one KvGrid row of two cells, the seat of candidate 3 (the
   *  derived-ratio card) until his click: the share, a year of one-bed rent
   *  over a year of typical income, and the typical income a year, the one
   *  absolute `05` does not hold (M1). "Typical", never "median" (item 24).
   *  The basis says "a typical income" and neither "before tax" nor "after
   *  tax", because the bank carries no marker on the row (item 24 carries
   *  the requirement). The withheld lines stand where the share would: on the
   *  thirty cities where a year of rent is more than a year of income
   *  (item 24), and where the rent is not on file (no city today); a city
   *  with no typical income on file holds no cell and draws nothing, the
   *  glance's rule (none today, 252 of 252 hold it). */
  cityRunway: {
    kicker: "Rent against income",
    cells: { share: "Rent's share of income", income: "Typical income" },
    units: { year: "a year" },
    basis: "One-bed rent for a year, against a typical income.",
    /** A page held to a register region: the rent has no source, so the line says it is an estimate. */
    basisSourcedOnly: "An estimated one-bed rent for a year, against a typical income.",
    footModelled: "",
    footPlaceholder: "{what} {verb} placeholders until {city} is researched.",
    /** The inputs as the foot names them: "The rent and the typical income are modelled." */
    footNames: { rent: "the rent", income: "the typical income" },
    withheld: {
      over: "A year's rent here is more than a typical year's income.",
      noRent: "No one-bed rent figure for this city yet.",
    },
  },
  /** WHAT RESIDENTS SPEND, the city's `08 demand` (MODEL.md 8.3; plan step
   *  32's fourth dispatch, 2026-09-18): the plain figure on BentoMetric, the
   *  kicker 8.3's own title. The basis says what the figure is and its unit;
   *  the foot says "modelled" where the tag is not held (248 of 252), the
   *  bill's idiom; the withheld lines stand where the figure would, PART 5's
   *  shape: the placeholder (London, the set's one, item 23) is never printed,
   *  and a shard with no figure (no city today) says so. */
  cityDemand: {
    kicker: "What residents spend",
    basis: "What one resident spends in a year, on everything.",
    /** The six UK cities (plan 2026-10-08, uk:cities-sourced-or-marked): the shard's spend, a share of metro GDP, said once. */
    basisEstimate: "An estimate of what one resident spends in a year, on everything.",
    footModelled: "",
    withheld: {
      placeholder: "No reliable spend figure for {city} yet.",
      /** Reachable by the builder's shape and by no city today (252 of 252 hold the figure). */
      notOnFile: "No spend figure for this city yet.",
    },
  },
  /** RESIDENTS AND VISITORS, the city's `15 season` (MODEL.md 8.3; plan step
   *  32's sixth dispatch, 2026-09-18): two shares of a hundred on a KvGrid
   *  pair, in ink. The kicker changes from "How seasonal it is": an annual
   *  share is not a season, and the old name returns the day a month shape
   *  exists (item 29). The basis says what the two figures are; the foot says
   *  "modelled" where the shard's tag is not held (239 of 252) or where the
   *  share is the slope over arrivals (London, the one city with no footfall
   *  row in its shard); the withheld lines stand where the shares would, and
   *  both are reachable by the builder's shape and by no city today. "Footfall"
   *  is the trade's own word for the people passing a door, and the field's.
   *  Every string here was read aloud. No "against": it is a comparator with
   *  no subject to the copy gate, and the sentence needs none. */
  citySeason: {
    kicker: "Residents and visitors",
    cells: { residents: "Residents", visitors: "Visitors" },
    /** The unit beside the residents' share on the segmented bar (2026-09-20). */
    unit: "of footfall",
    basis: "Of the year's footfall, the share who live here and the share visiting.",
    footModelled: "",
    /** The six UK cities (plan 2026-10-08): the shard's split, under the drawn bar, whatever its tag. */
    footEstimate: "An estimated split of the year's footfall.",
    withheld: {
      /** Plan 06, task B3: no city's own footfall row (London; the slope that stood in is gone). The card draws nothing there. */
      noSplit: "No split of residents and visitors for this city yet.",
      noCount: "No visitor count for this city yet.",
    },
  },
  /** The card pager (the cities). */
  cities: { kicker: CITIES_KICKER, allLabel: "Every covered city", prev: "Previous cities", next: "More cities" },
  /** THE CITY'S NEIGHBOURHOODS, `14 neighbourhoods` (MODEL.md 8.3; the same
   *  dispatch): the card pager, four a row, a name and an arrow, no image, no
   *  sub-line (a district's character tag is a one-word summary of a place,
   *  clause 19). The "all" link and the arrows' names follow the cities
   *  pager's grammar. The foot is the coverage form, the count as a word, on
   *  the 43 cities whose scheme holds real names; the 209 on the compass
   *  placeholders draw the blocked seat below (a placeholder name never
   *  prints, clause 32, R11). */
  cityNeighbourhoods: {
    kicker: "The city's neighbourhoods",
    allLabel: "Every neighbourhood",
    prev: "Previous neighbourhoods",
    next: "More neighbourhoods",
    foot: "",
    /** Where every card lands on the district's own page (the cities the
     *  hub's gate admits, London today; plan step 35, 2026-09-19), the foot
     *  says that instead: the door goes to the district, not to the hub. */
    footPages: "",
  },
  /** The city cards in their three looks (B11, 2026-09-10). The unit is said
   *  ONCE for the whole row, never in a card (PART 5). `plain` says what the
   *  figure is and nothing else, and it is what prints when the look draws no
   *  tint and no mark, which happens for a country holding one covered city:
   *  a sentence reading the drawing when there is no drawing is a promise the
   *  card does not keep. The three looks add the clause that reads theirs. It
   *  never says what any of it means. */
  cityCards: {
    plain: { basis: "A typical customer’s pay, a year." },
  },
  /** The comparison table (the peers); the founder praised its desktop form unprompted on 2026-08-30. */
  peers: {
    kicker: PEERS_KICKER,
    /* The LLC's two columns are the hero's concepts since 2026-09-25 (his rulings 3 and 4 of 2026-09-04: the total cost to put an LLC
       in action, the time until the business opens), and the average salary is his plan's fourth column. */
    cols: { country: "Country", tax: "Effective tax", payroll: "Payroll on staff", llcCost: "LLC, all in", llcDays: "Days to register", salary: "Typical salary" },
    caveat: "Countries of similar size and market, not neighbours.",
    /** The UK's page (masterplan step 04, 2026-10-05; the labels audit's item 17): its own row is sourced, the peers' figures are not, and the
     *  line says so once (M9: a figure outside the United Kingdom is an estimate, said once). */
    /* His ruling of 2026-10-05 on PARKED P04.2: the peers kept, called estimates; the choice of rows is not explained (the copy ruling of 2026-09-25). */
    caveatEstimates: "The peers' figures are estimates.",
  },
  /** A table's heads order its rows (the goal of 2026-09-26, M5; interact/SortTable.tsx): the polite line a screen reader hears
   *  after a press. */
  sort: { said: "Sorted by {head}, {dir}", low: "lowest first", high: "highest first" },
  /** The city's peers table (city:peers, run 22): cities as rows, three measures as columns, every figure read beside the home city; no unit word a reader has to know.
   *  CAVEAT TRIMMED 2026-09-08 (E1, found once the card-detection repoint could finally see this
   *  card at all): the sentence carried the same facts in 255 characters, over the page's 220-char
   *  prose budget by itself, and was ALSO being counted twice, once from a visible paragraph and
   *  once from a screen-reader-only caption saying the same words for assistive tech; that double
   *  count is now excluded at the instrument (verify_art_direction.mjs). The facts kept: what each
   *  column measures, that higher reads better throughout, and that peers match on size and market
   *  rather than sharing a border.
   *  CAVEAT TRIMMED AGAIN 2026-09-10 (his B7, the comparison, design/references/founder-2026-09-10.md; the old "M3" label was a slip, no M mechanics exist there): the table now
   *  marks the winning cell in every column with a tick (CompareTable.tsx), so the direction
   *  sentence ("lower is cheaper", "higher is better on both") is no longer the only way a reader
   *  can tell which value won, and is gone, along with the peer-matching sentence that went with
   *  it under the same rule: what a tick cannot say is only what the figures are and over what
   *  period, so that is all that is left. */
  /** THE WORDS ARE 8.3's `11 peers` (plan step 32's fifth dispatch,
   *  2026-09-18), each read aloud. The kicker was "Peer cities, side by side",
   *  five words, over PART 7's four-word cap; "Against other cities" is what
   *  the table does. The first column head was "Cheaper to live", a
   *  comparative over a column that prints the absolute index (PART 5: a
   *  comparison table never prints a comparison, and a head names the thing
   *  measured); it is "Cost of living", the figure's own name. The income head
   *  was "Customer income" and the column has printed the one builder's
   *  typical pay since the fourth dispatch; the label follows the figure. */
  cityPeers: {
    kicker: "Against other cities",
    cols: { city: "City", living: "Cost of living", income: "Typical pay", visitors: "Visitors" },
    /** THE BARE WORD IS GONE (his words, 2026-09-07): "for the table, you say
     *  cheaper to live, customer income, visitors, and then you just say you
     *  mention the word same. That's a major mistake." `same` printed for any
     *  peer that tied the home row on a signed-difference column; the column
     *  is now the absolute figure itself (peer_rows.ts), so every row reads a
     *  real number and the home row needs no special case at all. */
    /** THE INCOME COLUMN IS THE ONE BUILDER'S FIGURE (plan step 32's fourth
     *  dispatch, 2026-09-18): every row's income is `cityTypicalIncome(slug)`
     *  for that city, the same figure the home city's masthead prints, so the
     *  caveat says "typical pay" and one basis serves the column. */
    /** The living column on the city scale since 2026-09-20 (his ruling: the ends are the cheapest and dearest covered cities, never named). */
    caveat: "Pay and visitors, a year.",
    /** A page held to a register region: the cost of living column prints a dash in every row (no source holds any city's
     *  index; PART 9 clause 18, a dash explained once), and this is the once. */
    caveatNoLiving: "Pay and visitors, a year. No source holds a cost of living.",
    /** A UK city held to no register region (the six; plan 2026-10-08, uk:cities-sourced-or-marked): every figure kept, the line
     *  saying once which are estimates, the cost of living and the pay of the cities abroad; the visitors named only where their
     *  column draws. */
    caveatEstimates: "Pay and visitors, a year. Estimates: cost of living, and pay abroad.",
    caveatEstimatesNoVisitors: "Pay, a year. Estimates: cost of living, and pay abroad.",
  },
  /** THE CITY'S DISTRICT RANKING (city:districts, run 25, rebased task 13,
   *  reworded and unfeatured task 14, 2026-09-10). Every district's shop rent
   *  measured against the cheapest district, which is drawn and named on the
   *  same card. `{district}` is that reference and `{count}` the size of the
   *  set; both are composed in district_rows.ts, so the two cards on this page
   *  say the same thing the same way and neither hardcodes a place.
   *
   *  READ EVERY ONE OF THESE ALOUD BEFORE CHANGING IT. Three of the four
   *  strings here were struck out by the founder on 2026-09-10, and the one he
   *  quoted back was the column head: "like you say districts and time's the
   *  cheapest. What the fuck is time's the cheapest? What, what, what's that
   *  sort of wording? It's unnatural." A head is not a formula written in
   *  words. It names the thing measured and what it is measured against, in
   *  the order a person would say them. */
  cityDistricts: {
    /* THE KICKER IS 8.3's OWN TITLE (plan step 32's fifth dispatch,
       2026-09-18): "Rent by district", three words, naming the thing measured
       and the set it is measured over. "By district" said the set and not the
       thing, and read against the model's letter it was the one string on
       this card that disagreed. */
    kicker: CITY_DISTRICTS_KICKER,
    /* WHAT THE OLD BASIS DID WRONG: "Each district's shop rent set against
       {district}, the cheapest here" made the reader carry a clause inside a
       clause to learn one fact, and "the cheapest here" left "here" doing work
       no word should do on a page that covers seven districts of one city out
       of dozens. Two plain sentences instead, the first naming the reference
       and the size of the set it is cheapest OF, the second saying where the
       figures come from. */
    basis: "",
    /* A PAGE HELD TO A REGISTER REGION (London; masterplan step 03, 2026-10-05, the labels audit's item 19): the rents are the
       engine's multipliers, a function of each district's tags, so the line says they are estimates. The valuation statistics
       hold rent by borough, and of the seven districts only the City of London is a whole borough: one figure is no ranking. */
    basisEstimate: "Estimated rents against {district}.",
    /* THE FAR END OF EVERY TRACK, in the words a person would use for it. It
       read "heaviest in the city", from an internal phrase for a burden ("rent
       load") that no shopkeeper has ever said out loud; and it was measured
       against this card's own set, not the city, so it also overclaimed. */
    dearest: "Dearest district",
    /* THE COLUMN HEAD, HIS RULING OF 2026-09-10. Four words when composed, one
       over the model's three-word cap for a label: a head that names its
       reference district cannot be shorter, and the model records the
       exception rather than this file quietly keeping a shorter, worse head.
       The reference district is filled in from the data, never typed. */
    phoneHead: { name: "District", value: "Rent, against {district}" },
  },
  /** THE TRADES WITH LOCAL FIGURES (MODEL.md 8.3 `09 trades`; plan step 32's
   *  fifth dispatch, 2026-09-18): the trade rows, no figure per row (take-home
   *  and margin are stripped upstream by the 2026-07-11 ban), so the card's
   *  one line is the foot in the coverage form PART 7 puts there, in the
   *  model's own words. `{n}` is the count of trades the card draws, composed
   *  in city-view.tsx as a word ("seven"): digits are what a figure cell is
   *  for and a sentence takes the word (district_rows.ts, countWord). The
   *  second sentence says on the page what the model knows about `10
   *  easiest`: it has no seat here until ruling 30 lands. Both read aloud. */
  cityTrades: {
    kicker: CITY_TRADES_KICKER,
    foot: "",
  },
  /** THE FOUNDER'S PLUS (2026-09-08): the detail panel's summary lines, one for
   * each query a reader clicks open. Reused, not invented per instance: the
   * setup summary answers what a registration fee covers, the pay summary
   * answers what moves the figure a bar just drew. The customers summary
   * REFERENCES the strip's own kicker (review finding 6: a byte-identical
   * retyped copy drifts silently on the next edit to either string) and adds
   * what actually opens, the bottom-to-top spread, so the plus does not just
   * repeat the heading printed directly above it. */
  detail: {
    setup: "What the fee covers",
    /* THE WITHHELD ROW (2026-09-10). Founder ruling 8 of 2026-09-04 named
       "time until opening" as wanted beside the registration fee and the
       registration wait, and nothing on file measures it. PART 5 is explicit
       about what that means: "A LABEL NEVER STANDS WHERE A NUMBER GOES ... a
       cell that cannot hold an honest figure is WITHHELD with a stated line
       saying which rows are missing and why, the way the country money card
       withholds its four trades." So the row is not drawn holding the words
       "not measured yet" , a word standing in the figure column is the exact
       shape he struck out , and this line says which row is missing and why.
       It goes the day the wait between registering and trading lands in
       data/legal/business_formation_costs_v1.json, and the row returns. */
    setupWithheld: "The wait between registering and opening is not known yet.",
    pay: "What moves this figure",
    customers: `${CUSTOMERS_KICKER}, by tenth`,
  },
  /** THE BENTO BAND'S TWO CELL TYPES (2026-09-10, his A2 and B4). Every string
   *  here was read aloud before it shipped, which is the only check that would
   *  have caught "Times the cheapest". A kicker names the thing; a label says
   *  what the figure is in the words a person would use; a basis says what is
   *  measured and never what it means. */
  /* NO CELL CARRIES A LABEL UNDER ITS FIGURE. Every opener here already says
     what its figure is, so a label would be the same sentence twice, and the
     extra line makes the cell about 40px taller, which stretches the tall cell
     beside it past its own content and opens a hole in it. Measured on this
     archetype's own stories. `BentoMetric` and `BentoCount` still take a label
     for the case where an opener genuinely cannot say it. */
  bento: {
    /** The paperwork score, the same 1 to 5 the tiers table draws as dots; the
     *  two ends are said here rather than left as an unexplained scale. */
    paperwork: {
      kicker: "Paperwork to register",
      basis: "One is an online form, five is a notary and a lawyer.",
    },
    /** The everyday set drawn whole, with the trades this city holds a local
     *  measurement for read against it. */
    everydayTrades: {
      kicker: "Trades with local figures",
      basis: "Eight everyday trades, and how many have local figures.",
    },
    /** The city's typical customer pay, the strip's own middle mark. */
    cityPay: {
      kicker: "What customers earn",
      basis: "The typical earner, a year.",
    },
    /** The effective burden, the country page's own answer figure. */
    burden: {
      kicker: "Total effective tax burden",
      basis: "On profit, for a small business, from the published rates.",
    },
    /** What an employer pays on top of a wage. */
    payroll: {
      kicker: "Payroll on wages",
      basis: "Charged on wages, on top of the rate on profit.",
    },
    /** The sales tax, which the customer carries and the owner collects. */
    salesTax: {
      basis: "The customer carries it, so it is not the owner's burden.",
    },
  },
  /** THE MARK LIST (B3, 2026-09-10, his "pretty universal but the use can be
   *  beyond the use of flags itself, universal format"). One headline figure
   *  for a whole set, then its highest few members as rows. One block per
   *  subject the card serves, because every subject needs its own words and
   *  none of them needs its own component.
   *
   *  EVERY STRING HERE WAS READ ALOUD BEFORE IT SHIPPED, which is the only
   *  check that catches what the gates cannot: his "like you say districts and
   *  time's the cheapest. What the fuck is time's the cheapest? What's that
   *  sort of wording? It's unnatural."
   *
   *  THE UNIT IS SAID ONCE, IN THE COLUMN HEAD (PART 5), so no basis line here
   *  repeats it: the pay basis qualifies the figure ("before tax") and the
   *  visitors basis says nothing about the unit at all, because "Visitors a
   *  year" is already standing over the column. A basis that says what the
   *  head says is the same sentence twice. */
  markList: {
    /** THE HEADLINE'S WORDS WHEN THE LIST IS THE WHOLE SET, and it is an
     *  honesty fix rather than a flourish (found by looking at the thin card's
     *  photograph, 2026-09-10). The headline is the middle of the members that
     *  HOLD a figure. On the city cards that is 246 or 252 of the 252 the basis
     *  names, so "Middle city" is true of the set a reader thinks it is true
     *  of. On the trade card only FOUR of 188 countries hold a credible
     *  margin, and "Middle country" over a card whose basis says 188 claims a
     *  world middle that nobody measured. So when every member holding a
     *  figure is drawn on the card, the label says which four it is the middle
     *  of, and the reader can see all of them. */
    middleOfDrawn: "Middle of the {n}",
    /** The covered cities by what a customer earns there, which is the figure
     *  the city pages themselves open with. The kicker is the customers
     *  strip's own, referenced rather than retyped. */
    pay: {
      kicker: CUSTOMERS_KICKER,
      middle: "Middle city",
      head: { name: "City", value: "Pay a year" },
      basis: "The {n} highest-paying of the {universe} cities we cover. Pay before tax.",
      basisIn: "The {n} highest-paying of the {universe} cities we cover in {country}. Pay before tax.",
      withheldOne: "1 city left out: no pay figure yet.",
      withheldMany: "{n} cities left out: no pay figures yet.",
    },
    /** The covered cities by visitors in a year, the one city field with real
     *  gaps in it, which is why the withheld line here is a line a reader
     *  actually meets rather than a branch nothing reaches.
     *
     *  THE REASON SAYS "ABOVE ZERO" BECAUSE THE GAP HAS TWO SHAPES AND ONE
     *  SENTENCE HAS TO COVER BOTH HONESTLY: six of the 252 cities carry no
     *  visitor field at all, and five more carry a literal 0 left behind by an
     *  extrapolation that rounded down (Dhaka and Kyiv among them, which
     *  plainly do have visitors). "No visitor figure is on file" would be
     *  false for those five, and drawing 0.0M for Dhaka would be a visibly
     *  wrong number, which is the one thing this site does not ship. */
    visitors: {
      kicker: "Where visitors go",
      middle: "Middle city",
      head: { name: "City", value: "Visitors a year" },
      basis: "The {n} most visited of the {universe} cities we cover.",
      basisIn: "The {n} most visited of the {universe} cities we cover in {country}.",
      withheldOne: "1 city left out: no visitor figure yet.",
      withheldMany: "{n} cities left out: no visitor figures yet.",
    },
    /** One trade across every country the margin model measures. The kicker is
     *  the money card's own, and the withheld sentence is the money card's own
     *  reason with countries in place of trades, because it is the same engine
     *  and the same floor doing the withholding. */
    trade: {
      kicker: MARGIN_KICKER,
      middle: "Middle country",
      head: { name: "Country", value: "Net margin" },
      basis: "The {n} highest of the {universe} countries measured. What a shop keeps after costs and tax.",
      withheldOne: "1 country left out: our figure for it isn't reliable.",
      withheldMany: "{n} countries left out: our figures for them aren't reliable.",
    },
  },
  /** THE TRADE PAGE'S OPENING (MODEL.md 8.6, `00 take`, `01 spread`, `02
   *  suits`; plan step 33's first dispatch, 2026-09-18). Every string here was
   *  read aloud first, in the practical register, and the ones another page
   *  already prints are referenced and never retyped (M20: the two checks on
   *  `02` are the country's `18 checks` bank, word for word; the strip's
   *  three mark names are the customers strip's own). */
  /** THE ONE NET BUILDER'S QUALIFIER (trade_net.ts, R7, item 58): one line
   *  under the companion cell, under 48 characters, saying where the figure
   *  came from, because the sample mark is off site-wide and the cell is the
   *  only place left that can say it. The engine's is a model over the city's
   *  own revenue and payroll; the shard's and the profile's are the trade's
   *  world figures (R12 said every shard figure prints as modelled; his copy correction of 2026-09-24
   *  struck the word, so the note says whose figure it is, not how it was made). */
  tradeNet: {
    notes: {
      engine: "from this city's own figures",
      shard: "typical for the trade",
      profile: "typical for the sector",
    },
  },
  /** `00 take`: the answer label is 8.6's title; the basis says what the
   *  figure is (a year, after every cost) and never what it means. The state
   *  word stands where the answer would when money is not shown for the cell
   *  (an untrusted read, trust.ts), and its note says what is not measured
   *  without naming the place, which the crumb names once (clause 11). The
   *  three companions are 8.6's own; no ease score (clause 17). The withheld
   *  foot counts what the card does not hold off `moneyShown` (PART 5). */
  tradeHero: {
    answerLabel: "A typical owner keeps",
    answerBasis: "a year, after every cost is paid",
    absent: "Not known yet",
    absentNote: "we have no take-home for this trade here yet",
    cells: {
      net: "Net margin",
      firms: "Firms trading here",
      takings: "Sales a year",
      takingsNote: "before any costs",
    },
    withheld: "No figures yet for this trade here.",
    /* THE PAGE'S ONE WORD ON ESTIMATES (his correction of 2026-09-24, evening: "the disclaimers are so disgusting"): said once, at the hero's foot, in plain words; no card repeats it (COPY-STYLE.md). */
    honest: "Estimates for a typical {noun}.",
    honestFrom: "Estimates for a typical {noun}, from {source}.",
    /** The crumb's separator, the identity row's own since the first masthead. */
    crumbJoin: " · ",
  },
  /** `01 spread`: the kicker is 8.6's title; the marks take the customers
   *  strip's three names; the modelled basis is 8.6's own sentence, said on
   *  London where the three marks are fixed multipliers of the typical; the
   *  measured basis says whose figures they are on a trusted local cell; the
   *  withheld line stands where the figure would off `moneyShown`. */
  /** A London trade's masthead and sales strip from the register and the engine (plan 06, task A5; his rulings of 2026-10-04:
   *  Greater London; break-even leads with the middle owner's keeps as a sole trader beside it, the company's under the plus).
   *  Labels of three words at most; "an estimate" beside engine money (its range covers the band shapes only); no agency names. */
  /** The thin page's one ask (milestone 1, M9; his words of 2026-09-26: "notify me when my place reaches this depth"). */
  depthNotify: {
    label: "Notify me when {place} reaches this depth",
    placeholder: "Your email",
    button: "Notify me",
    sent: "Thanks. We will write when it does.",
    failed: "That address did not go through. Check it and try again.",
  },
  londonTrade: {
    /** Where the register holds no row (milestone 1, M8): the cost to open, its words the open card's own; else the UK's survival. */
    openLabel: "Cost to open",
    lastsLabel: "Still trading after five years",
    lastsBasis: "of UK {group} that open, at recent rates",
    breakEvenLabel: "Sales to break even",
    breakEvenBasis: "a year, to carry an average London {noun}",
    salesLabel: "Typical yearly sales",
    salesBasis: "the middle registered business in London",
    salesBasisGroup: "the middle {group} in London",
    cells: {
      /** "Already" says these are businesses trading today; the home's worked example runs the same words after its figure (plan
       *  2026-10-10, home reform, Task 3; the critique's P1.5). */
      above: "Already take that much",
      keeps: "Middle one keeps",
      keepsNote: "as a sole trader, an estimate",
      firms: "Registered businesses",
      firmsGroup: "every {group}",
      under: "Take under {edge}",
    },
    companySummary: "What a company keeps",
    companyRow: "A company",
    soleTraderRow: "A sole trader",
    foot: "Registered businesses in London, March 2026.",
    stripBasis: "Registered businesses in London.",
    stripBasisGroup: "Every {group} in London.",
    under: "under",
    over: "over",
  },
  tradeSpread: {
    kicker: "Sales a year",
    basisModelled: "From a quiet shop to a busy one.",
    basisMeasured: "From a quiet shop to a busy one.",
    withheld: "No sales figures for this trade here yet.",
  },
  /** `02 suits`: the page's one prose section. Two notes off the trade's
   *  authored character (edge and watch-out, one each; the file holds one of
   *  each per trade), then the two checks from the country's bank (M20). On a
   *  trade with no character the two notes are ONE row in the site's idiom
   *  (M19). The basis says whose words the notes are and that the questions
   *  score nothing, the checks card's own words. */
  tradeSuits: {
    kicker: "Who this suits",
    labels: { suits: "Who does well", thinkTwice: "Think twice", notGathered: "The people it suits" },
    notGathered: "No notes on who this suits yet.",
    basis: "",
  },
  /** `03 permits` (MODEL.md 8.6; plan step 33's second dispatch, 2026-09-18):
   *  the kicker is 8.6's title; each licence is a label over its typical days
   *  (the shard's own name, never shortened); the basis is 8.6's own sentence;
   *  the foot says the waits are modelled in words, because the sample mark is
   *  behind his switch (every shard figure is modelled, R12). A licence whose
   *  wait is on file as zero days is not a wait, so it is withheld with the
   *  line, counted (one licence on one shard today). */
  tradePermits: {
    kicker: "Licences you need",
    /** The fee band under each wait, a category label (2026-09-20 late evening, clause 60): the shard's `typical_cost_band`. */
    feeBand: { low: "Low fee", medium: "Medium fee", high: "High fee" },
    /** The plus under the waits (2026-09-24, goal B1): each licence's fee band, a category and never a figure, behind a click so the waits read first. */
    feeSummary: "The fees, by licence",
    /* The card's shape says the longest wait leads (the figure at 30 over the
       rest at 16); a sentence saying so pushed the card to 240 characters of
       prose against the art-direction budget of 220 (E1, 2026-09-24). */
    basis: "",
    foot: "",
    withheldOne: "Plus 1 licence with no known wait.",
    withheldMany: "Plus {n} licences with no known wait.",
    /* The goal's A9 (permits_rows.ts `isUsJurisdictionLicence`): a licence named for a United States jurisdiction, withheld off a US page. */
    foreignOne: "1 US-only licence left out.",
    foreignMany: "{n} US-only licences left out.",
  },
  /** `04 open` (MODEL.md 8.6; the same dispatch): one card, three states. The
   *  held basis says what the total is (the whole bill here) and what the
   *  rows are (its lines, biggest first), never the sum reading, which is
   *  `05`'s (M2). The baseline basis is R3's sentence in plain words: the
   *  trade's typical figure, modelled, not this city's own. The withheld line
   *  stands where the total would, in the site's idiom (M19). The foot's two
   *  companions carry their own words; the foot line says they are modelled,
   *  the shard's figures for the trade (R12). The table's two heads are one
   *  word each. */
  tradeOpen: {
    kicker: "The cost to open",
    /** One basis per card in every state (the baseline's rule): what the total is, what the bars are, and that the foot's two figures are the trade's, modelled. No order word: the vertical form stands its leader at the right. */
    basisHeld: "",
    basisHeldCapped: "",
    /** Where the trade holds no shard for the foot: the total's own line, the foot withheld with its own. */
    basisHeldAlone: "",
    basisHeldCappedAlone: "",
    /** Under the bars where the bill runs past the five the vertical form holds (RankedBars turns six or more into a table): the rest counted and summed, never dropped. */
    tailOne: "The smallest cost, {sum}, is in the total.",
    tailMany: "The {n} smaller costs, {sum} together, are in the total.",
    basisBaseline: "",
    basisBaselineAlone: "",
    /** The baseline state with the kinds of shop (2026-09-24, the goal's B10): each kind worked from the typical and its own difference. NO LINE (A20, the same evening): the rows name each kind of shop, and "For each kind of shop." said it again. */
    basisFormats: "",
    basisFormatsAlone: "",
    /** The withheld state earns it back (the same day, the goal's A4): the two figures the card holds, no stated line. */
    /** At a city's prices (plan 06, task A6): the keyed New York index times the city's place factor, called an estimate. */
    basisPlace: "An estimate at {city} prices.",
    /** WHOSE BILL IT IS (plan 2026-10-11): the label under the held total, by the bill's country (setup_items.ts scope); a country with no words here prints no bill. A label, never a sentence.
     *  ONLY GB HAS WORDS (review tf-review-2 I-1; QUEUE us:cells-master-parent-mark): a US state page reads cells_master, whose path never marks a row borrowed from a parent trade, so a
     *  sub-niche (pizzerias, fast casual) could print the full-service bill as "A US-wide estimate", stamped as its own trade. US takes its words back when that path marks a parent's row. */
    heldScope: { GB: "A UK-wide estimate" },
    kickerRecover: "Earning it back",
    basisRecover: "",
    withheld: "No cost figures for this trade here yet.",
    foot: "",
    footWithheld: "No break-even figures yet.",
    breakEven: "to break even",
    payBack: "to pay back",
    biggest: "The biggest line",
    phoneHead: { name: "Line", value: "Cost" },
  },
  /** THE TRADE PAGE'S THREE CHAPTER HEADINGS (8.6's own titles): turn one is
   *  the site's string (M7), referenced; turn two's stands with its written
   *  reason (the reader arrives with the place chosen, so "where" is `07
   *  peers` inside turn one); turn three parallels "What the place is like"
   *  with the subject swapped. */
  tradeChapters: {
    costs: COSTS_CHAPTER,
    keep: "What it takes to keep it open",
    trade: TRADE_CHAPTER,
  },
  /** `05 split` (MODEL.md 8.6; plan step 33's third dispatch, 2026-09-18):
   *  the kicker is his name for the B6 seat (M15); the focal's label is the
   *  same words `00 take`'s companion prints, because they are one figure
   *  from one builder (R7, M20); the basis is 8.6's own sentence where the
   *  shard's held drivers feed the bar, and names the sector where the
   *  profile does; the withheld line stands where the bar would when the
   *  lines on file and the net come to more than every $100 (the residual
   *  law's refusal, never a bar scaled to fit); the plus holds the two cost
   *  shares in words a person says. Every figure is modelled (R12) and the
   *  foot says so, because the sample mark is behind his switch. */
  tradeSplit: {
    kicker: "Where each $100 goes",
    /** THE TITLE WHEN THE COSTS ARE DRAWN ON THEIR OWN BASE (2026-09-26, QUEUE trade:split-withheld-sense): the bar is no longer
     *  each $100 of sales, so the card is named for the two things it holds. */
    kickerCosts: "Costs and margin",
    basisShard: "Out of every $100 in sales.",
    basisProfile: "Out of every $100 in sales.",
    /** The withheld state draws no shares, so its basis names the net alone and the foot is not printed. */
    basisWithheld: "Out of every $100 in sales.",
    withheld: "Our cost figures add up to more than $100, so only costs are shown.",
    /** The withheld state's second drawing (2026-09-24, the goal's B8): the lines on file split among themselves; the base said, so no share of sales is claimed. */
    mixBasis: "",
    foot: "",
    detail: {
      summary: "How much of the cost is fixed",
      fixed: "Fixed costs",
      variable: "Variable costs",
      note: "of the costs",
    },
    /** THE SHARD'S DRIVER NAMES, SHORTENED FOR THE LEGEND (PART 5: a label is
     *  three words at most, a copy fault fixed in copy and never a taller
     *  row; PART 9 clause 31: a name truncated on a phone). The 79 shards
     *  whose cost drivers are tagged held name their lines in up to six
     *  words ("Vessel, gear or tank depreciation and maintenance"); 179 of
     *  the 271 distinct names run past three, counted 2026-09-18. Each entry
     *  is keyed by the shard's exact name and gives the legend a noun phrase
     *  of three words at most that says what the line is; a name of three
     *  words or fewer prints as the shard's own. The copy gate holds every
     *  held shard to this table both ways: a name over three words with no
     *  entry is a red, and an entry naming no shard line is a dead row. */
    lineLabels: {
      "Adhesives, disposables and supplies": "Adhesives and disposables",
      "Admin and management overhead": "Admin and management",
      "Admin, software and marketing": "Admin, software, marketing",
      "Aircraft ownership, lease and depreciation": "Aircraft and leases",
      "Airport, navigation and ground fees": "Airport and navigation",
      "Barber pay and commission": "Barber pay",
      "Beverage and product (pour cost)": "Beverage and product",
      "Billing, insurance, and admin": "Billing, insurance, admin",
      "Building, utilities, and insurance": "Building, utilities, insurance",
      "Business development and marketing": "Sales and marketing",
      "Card fees and other": "Card fees",
      "Card fees, marketing and admin": "Card fees, marketing",
      "Clinician and support payroll": "Clinician payroll",
      "Color and styling product": "Styling product",
      "Compliance, environmental and insurance": "Compliance and insurance",
      "Compliance, safety and licensing": "Compliance and licensing",
      "Cost of drugs and inventory": "Drugs and inventory",
      "Cost of goods (frames, lenses, contacts)": "Frames and lenses",
      "Cost of goods (inventory)": "Cost of goods",
      "Cost of goods (product purchases)": "Cost of goods",
      "Cost of goods sold": "Cost of goods",
      "Delivery commissions and fees": "Delivery commissions",
      "Delivery, logistics, and other operating": "Delivery and logistics",
      "Delivery, logistics, and warehousing": "Delivery and warehousing",
      "Design, sales, and admin": "Design, sales, admin",
      "Driver labor and payroll": "Driver pay",
      "Driver pay and labor": "Driver pay",
      "Drugs, supplies and lab (COGS)": "Drugs, supplies, lab",
      "Dyes, chemicals and finishing": "Dyes and finishing",
      "Energy and melting fuel": "Energy and fuel",
      "Equipment maintenance and other": "Equipment maintenance",
      "Equipment, fuel and transport": "Equipment, fuel, transport",
      "Equipment, fuel, and vehicles": "Equipment, fuel, vehicles",
      "Equipment, insurance and admin": "Equipment, insurance, admin",
      "Equipment, supplies, and software": "Equipment, supplies, software",
      "Event labor (kitchen and service)": "Event labor",
      "Excise tax, distribution and admin": "Excise and distribution",
      "Excise tax, distribution, fees": "Excise and distribution",
      "Exhibitions, collection care, and programs": "Exhibitions and programs",
      "Facilities, platform and materials": "Facilities and materials",
      "Facility and floor-plan interest": "Facility and interest",
      "Facility rent and utilities": "Rent and utilities",
      "Facility, rent and upkeep": "Rent and upkeep",
      "Factory overhead and machines": "Factory overhead",
      "Feed (aquaculture) or fuel and bait (wild catch)": "Feed, fuel, bait",
      "Feedstock and raw materials": "Feedstock",
      "Fertilizer and soil inputs": "Fertilizer and soil",
      "Field labor and crew": "Field labor",
      "Finishing, delivery, and logistics": "Finishing and delivery",
      "Food and beverage (COGS)": "Food and beverage",
      "Food and beverage cost": "Food and beverage",
      "Food and ingredient cost": "Food and ingredients",
      "Food, supplies and program materials": "Food and supplies",
      "Fuel, machinery and repairs": "Fuel and machinery",
      "Guard wages and payroll taxes": "Guard wages",
      "Hardware and product pass-through": "Hardware and product",
      "Ingredients and raw materials": "Ingredients and materials",
      "Ingredients, packaging and beer COGS": "Ingredients and packaging",
      "Insurance, IT, and admin": "Insurance, IT, admin",
      "Insurance, admin, and marketing": "Insurance, admin, marketing",
      "Insurance, licensing and admin": "Insurance, licensing, admin",
      "Insurance, marketing, and admin": "Insurance, marketing, admin",
      "Insurance, overhead, and admin": "Insurance, overhead, admin",
      "Insurance, tools and shop supplies": "Insurance and tools",
      "Job-board, ATS and marketing spend": "Job boards, marketing",
      "Kitchen and counter labor": "Kitchen, counter labor",
      "Labor (crew and owner time)": "Labor",
      "Labor (crew and site hours)": "Labor",
      "Labor (kitchen, counter, delivery)": "Labor",
      "Labor and baking staff": "Baking staff",
      "Labor and brewing staff": "Brewing staff",
      "Land rent or ownership cost": "Land rent",
      "Liability and workers comp insurance": "Liability insurance",
      "Licenses, insurance and admin": "Licences, insurance, admin",
      "Licensing, insurance and compliance": "Licensing and insurance",
      "Licensing, insurance and other": "Licensing and insurance",
      "Machinery depreciation and maintenance": "Machinery upkeep",
      "Marketing and card fees": "Marketing, card fees",
      "Marketing and customer acquisition": "Marketing",
      "Marketing and delivery fees": "Marketing and delivery",
      "Marketing and lead generation": "Marketing and leads",
      "Marketing, card fees and admin": "Marketing, card fees",
      "Marketing, delivery fees and admin": "Marketing and delivery",
      "Marketing, insurance, and admin": "Marketing, insurance, admin",
      "Marketing, utilities and other overhead": "Marketing and utilities",
      "Materials (lumber, fixings, hardware)": "Lumber and hardware",
      "Materials (panels, hardware, finishes)": "Panels and hardware",
      "Materials (plaster, board, beading)": "Plaster and board",
      "Materials (wood, panels, fabric, hardware)": "Wood and materials",
      "Materials, plants, and mulch": "Plants and materials",
      "Materials, technology and supplies": "Materials and supplies",
      "Medical and office supplies": "Medical supplies",
      "Merchandise cost of goods and markdowns": "Merchandise and markdowns",
      "Office, insurance and admin": "Office, insurance, admin",
      "Office, rent and admin": "Office, rent, admin",
      "Other overhead: waste, packaging, admin": "Waste, packaging, admin",
      "Overhead (office, insurance, vehicles, marketing)": "Overhead",
      "Overhead and general expenses": "Overhead",
      "Overhead, admin and marketing": "Overhead, admin, marketing",
      "Overhead, compliance and freight": "Overhead and freight",
      "Overhead, office and insurance": "Overhead and insurance",
      "Overhead: shop, power and equipment": "Shop, power, equipment",
      "Owner pay and admin": "Owner pay, admin",
      "Owner pay, insurance, admin": "Owner pay, insurance",
      "Packaging (bottles, cans, labels)": "Packaging",
      "Parts, fixtures, and materials": "Parts and materials",
      "Payroll and pharmacist labor": "Pharmacist payroll",
      "Placed-worker wages and payroll burden": "Placed-worker wages",
      "Plant labor and overhead": "Plant labor",
      "Plant, depreciation and maintenance": "Plant and upkeep",
      "Plant, equipment upkeep and depreciation": "Plant and equipment",
      "Production and delivery labor": "Production labor",
      "Property finance, rent and taxes": "Property and rent",
      "Raw fiber and yarn": "Fiber and yarn",
      "Raw materials (resin, rubber compound)": "Raw materials",
      "Raw metal and materials": "Raw metal",
      "Raw metal and scrap inputs": "Metal and scrap",
      "Recruiters and internal staff": "Recruiters and staff",
      "Rent and clinic facility": "Rent and clinic",
      "Rent and shop space": "Shop rent",
      "Rent, admin, and marketing": "Rent, admin, marketing",
      "Rent, equipment, and utilities": "Rent, equipment, utilities",
      "Rent, utilities and equipment": "Rent, utilities, equipment",
      "Salaries and staff labor": "Salaries",
      "Sales and admin staff": "Sales and admin",
      "Sales and lead generation": "Sales and leads",
      "Sales and management overhead": "Sales and management",
      "Sales commissions and staff": "Commissions and staff",
      "Sales staff and wages": "Sales staff",
      "Sales, admin and delivery": "Sales, admin, delivery",
      "Sales, marketing and admin": "Sales, marketing, admin",
      "Shop and cafe cost of goods": "Goods for sale",
      "Shop labor and finishing": "Shop labor",
      "Shop labor and welders": "Shop labor",
      "Showroom rent and occupancy": "Showroom rent",
      "Software, insurance and other overhead": "Software and insurance",
      "Software, tools and hosting": "Software and hosting",
      "Software, tools and subscriptions": "Software and tools",
      "Staff and clinician payroll": "Staff payroll",
      "Staff and contractor labor": "Staff and contractors",
      "Staff and producer compensation": "Staff and producers",
      "Staff and volunteers coordination": "Staff and volunteers",
      "Staff payroll (non-OD)": "Staff payroll",
      "Staff payroll (ratio-driven)": "Staff payroll",
      "Staff wages and commission": "Staff wages",
      "Stylist wages and commission": "Stylist wages",
      "Subcontractor and site labor": "Subcontractors and labor",
      "Supervision, scheduling and admin": "Supervision and admin",
      "Supplies, linen and maintenance": "Supplies and linen",
      "Taproom and production labor": "Taproom and production",
      "Teaching and staff salaries": "Teaching salaries",
      "Teaching and support staff wages": "Teaching staff wages",
      "Technician and engineer labor": "Technician labor",
      "Technician labor and commission": "Technician labor",
      "Technician labor and commissions": "Technician labor",
      "Technician labor and payroll": "Technician labor",
      "Technician wages and benefits": "Technician wages",
      "Therapist pay and labor": "Therapist pay",
      "Tool stack and software licensing": "Tools and software",
      "Training, licensing and recruiting": "Training and recruiting",
      "Truck payment or lease": "Truck payments",
      "Trucks, fuel and equipment": "Trucks, fuel, equipment",
      "Uniforms, equipment and vehicles": "Uniforms, equipment, vehicles",
      "Utilities (power, water, gas)": "Utilities",
      "Utilities, insurance and software": "Utilities, insurance, software",
      "Utilities, marketing and other overhead": "Utilities and marketing",
      "Utilities, oil and equipment": "Utilities, oil, equipment",
      "Utilities, packaging and supplies": "Utilities, packaging, supplies",
      "Utilities, packaging, delivery fees, marketing": "Utilities, packaging, delivery",
      "Utilities, supplies and other operating": "Utilities and supplies",
      "Utilities, supplies, and other": "Utilities and supplies",
      "Vehicle maintenance, insurance, depreciation": "Vehicle upkeep",
      "Vehicle, fuel and equipment": "Vehicle, fuel, equipment",
      "Vehicle, fuel, and maintenance": "Vehicle, fuel, maintenance",
      "Vehicle, tools, and fuel": "Vehicle, tools, fuel",
      "Vehicles, delivery, admin, insurance": "Vehicles and delivery",
      "Vehicles, fuel and equipment": "Vehicles, fuel, equipment",
      "Vessel, gear or tank depreciation and maintenance": "Vessel and gear",
      "Veterinarian and clinical staff pay": "Veterinarian pay",
      "Warehouse, logistics and freight": "Warehouse and freight",
      "Workshop, machinery, and utilities": "Workshop and machinery",
    } as Record<string, string>,
  },
  /** `06 team` (MODEL.md 8.6; the same dispatch): the kicker is the
   *  country's shipped words (M14); the two heads say one unit each, a count
   *  and a year's pay; the basis is 8.6's own sentence; the foot says the
   *  figures are modelled (the roles are the shard's, R12; the pay is an
   *  index times the country's median, never measured for the role); the
   *  no-median line is said once where the pay column prints dashes (clause
   *  18: a dash is explained once, a column never dropped). */
  tradeTeam: {
    kicker: "What staff cost",
    heads: { name: "Role", count: "How many", pay: "Pay a year" },
    basis: "",
    foot: "",
    noMedian: "A dash means no pay figure for this country yet.",
  },
  /** `07 peers` (MODEL.md 8.6; plan step 33's fourth dispatch, 2026-09-18):
   *  the kicker is M12's, the compare table opening on the same word on
   *  every page ("Against other cities" on the city's); the one figure
   *  column's head is the strip's own kicker, because it is the strip's own
   *  figure (`headline.rev_p50_usd`, M20: the same figure the same words);
   *  the basis says what the column holds in the hero's words for the same
   *  figure ("before any cost comes out"). The not-gathered line is the
   *  site's idiom (M19) and stands where no peer resolves, off the United
   *  States; the dash line is the team card's idiom for a dashed cell and
   *  stands where the home row's takings are not shown (off `moneyShown`),
   *  so the card says once what its one dash means (PART 5). */
  tradePeers: {
    kicker: "Against other places",
    cols: { place: "Place", takings: "Sales a year" },
    basis: "",
    notGathered: "No other places to compare yet.",
    homeWithheld: "A dash means no figure for this city yet.",
  },
  /** `08 clears` (MODEL.md 8.6; the same dispatch): the kicker is 8.6's
   *  title; the basis says what the figure is, in a person's words, and
   *  never what it means; the foot is the shard-fed cards' one sentence with
   *  "modelled" said in words, because the sample mark is behind his switch
   *  and the share is a trade figure on both of its feeds (the engine's
   *  share is the trade's cost shares over its gross margin, the city's
   *  takings cancel out of it; the shard's is the trade's researched share). */
  tradeClears: {
    kicker: "Covering the costs",
    basis: "Of each day's sales, the part that pays the costs.",
    foot: "",
  },
  /** `09 lasts` (MODEL.md 8.6; the same dispatch): the kicker is 8.6's
   *  title; the three cell labels are one phrase each, read aloud under the
   *  kicker ("How many last: after five years, 50%"); the basis is the
   *  composition's one sentence for every shard-fed card (its section 5,
   *  item 16: `03`, `09`, `11`, `12`); the foot says what the figures are
   *  and that they are modelled (R12). No slope, no myth sentence (R5). */
  tradeLasts: {
    kicker: "How many survive",
    cells: { yr5: "After five years", yr1: "After one year", yr3: "After three years" },
    /** The two readings under year five on the worked-figure card (2026-09-24, goal B1), in the working row's lower case, as the customers card writes "a visit". */
    working: { yr1: "after one year", yr3: "after three years", cohort: "of the 2019 starters" },
    basis: "",
    foot: "Out of every 100 that open.",
    /** On a UK page (plan 06, task A2): the period figure's rates and the group it is read for, which is broader than the trade;
     *  seven words and the group's five at most, inside the copy gate's twelve. */
    footUk: "Per 100 that open, recent rates, UK {group}.",
    /** On the industry page (his interview of 2026-09-26, answer 32; milestone 1, M7): the trade's own figure, said to be no one
     *  country's, twelve words. */
    footWorld: "Out of every 100 that open, the trade anywhere, not one country's.",
    /** The drawn hundred's name for a screen reader, after the count: "50 of every 100 still open after five years". */
    drawn: "of every 100 still open after five years",
  },
  /** `11 mix` (MODEL.md 8.6; plan step 33's fifth dispatch, 2026-09-18):
   *  the kicker is 8.6's title; each part's label is the shard's own channel
   *  name, never shortened (the permits' rule); the basis is the shard-fed
   *  cards' one sentence; the foot says what the shares are in the split
   *  card's own words ("Of every $100 of sales", M20) and that they are
   *  modelled (R12), because the sample mark is behind his switch. The
   *  withheld line stands where the parts would when they do not add up to a
   *  whole (outside 95 to 105 of 100; no shard today, every file sums to 100
   *  exactly, counted 2026-09-18). The donut is candidate 5 awaiting his
   *  click; the seat is KvGrid. */
  tradeMix: {
    kicker: "Where sales come from",
    basis: "",
    foot: "Out of every $100 in sales.",
    withheld: "Our figures here don't add up to a whole, so they're not shown.",
  },
  /** `12 market` (MODEL.md 8.6; the same dispatch): the bento's four openers,
   *  each within PART 7's four words and read aloud; the composition's
   *  longer phrases ("firms for every 10,000 people", "the busiest month
   *  over the quietest") are carried by the two metric cells' basis lines,
   *  which say what each figure is and in what unit. The count cells' basis
   *  says the whole ("of every 100 firms") the way 8.6 words it. Every
   *  basis says the figure is the trade's, not this city's, and modelled
   *  (R12), because the cluster has no line of its own and the sample mark
   *  is behind his switch. A withheld line per cell stands where a figure
   *  would when the shard does not hold it (no shard today, 243 of 243 hold
   *  all four); the count cells' second line is the guard's, for a share
   *  over 100 that is not a count of firms (none on file: 3 to 92, 1 to 30). */
  /** THE TRADE'S TYPICAL, SAID ONCE ON A UK TRADE PAGE (masterplan step 04, 2026-10-05; the labels audit's item 10). A London
   *  trade page prints sourced figures or marked ones, and these cards print the trade's figure, not London's, so each card's one
   *  line says so (never the struck "typical for the trade anywhere"). Read by src/lib/spine/uk_trade_typical.ts. */
  tradeTypical: {
    split: "Out of every $100 in sales, the trade's typical.",
    splitProfile: "Out of every $100 in sales, typical for its sector.",
    team: "Roles typical for the trade, pay from the UK's median.",
    clears: "The trade's typical part of each day's sales that pays costs.",
    clearsEstimate: "Of each day's sales, the part that pays the costs, an estimate.",
    mix: "Out of every $100 in sales, the trade's typical.",
    customers: "Spend per visit times visits a year, the trade's typical.",
    market: {
      firms: "The trade's typical.",
      chains: "Out of every 100 firms, the trade's typical.",
      swing: "The busiest month over the quietest, the trade's typical.",
      dayparts: "Out of every $100 taken in a week, the trade's typical.",
      /** The city's own density on a UK trade page outside London (plan 2026-10-08): the shard's figure, beside the trade's typical. */
      firmsHere: "Estimated here, beside the trade's typical.",
      /** The words of the companion that carries the trade's typical beside that density: the foot above already says "beside the
       *  trade's typical", so the companion names it in those words and not "the trade anywhere" (tradeMarket.rivals.typicalWords,
       *  which every page outside the UK ships), which would name one figure twice. */
      firmsHereTypical: "the trade's typical",
    },
    /** The rivals cell's companion: the UK's company insolvencies for the trade in a year, per 100 live companies. */
    insolvent: "of 100 UK companies insolvent a year",
  },
  tradeMarket: {
    kickers: { firms: "Firms per 10,000 people", chains: "Chain-owned", close: "Close in a year", swing: "Busy and quiet months", dayparts: "When the week pays" },
    /** THE RIVALS CELL (2026-09-20 night, clause 65): the trade's typical density at 30 with its companions in one row: this city's own where the city shard names the trade ("here"), and the share that closes each year, so the cell is never one number. The kicker is the firms'. */
    rivals: { here: "here, this city's own", close: "of 100 close a year", hereMark: "Here", typicalMark: "The trade anywhere", typicalWords: "the trade anywhere", basisHere: "Firms per 10,000 people here, beside the usual for this trade" },
    /** The dayparts cell's basis (2026-09-20 late evening, the bento's fifth cell): the parts are of the week's takings, the trade's figure. */
    daypartsBasis: "Out of every $100 taken in a week.",
    /** The month line's own line under the swing figure: what the twelve points are. */
    monthsBasis: "",
    basis: {
      /** The opener says the unit, so the basis says whose figure it is (the clears foot's own sentence). */
      firms: "",
      chains: "Out of every 100 firms.",
      close: "Out of every 100 firms.",
      /** Fourteen words, at the cap: the unit clause is the composition's phrase in a person's words. */
      swing: "The busiest month over the quietest.",
    },
    withheld: {
      firms: "No firm count for this trade yet.",
      chains: "No chain figure for this trade yet.",
      chainsNotAShare: "Our chain figure doesn't add up, so it's not shown.",
      close: "No closure figure for this trade yet.",
      closeNotAShare: "Our closure figure doesn't add up, so it's not shown.",
      swing: "No monthly figures for this trade yet.",
      dayparts: "No weekly pattern for this trade yet.",
    },
  },
  /** `13 rivals` (MODEL.md 8.6; plan step 33's sixth dispatch, 2026-09-18):
   *  the kicker is 8.6's title; the two heads are one word and two (PART 5,
   *  the unit in the figure's own notation, "$300K"); the headline's label is
   *  the mark list's own "Middle of the {n}", because the rows are every
   *  sibling that holds a figure, so the middle is the middle of what is
   *  printed (the form's law). The basis is 8.6's sentence without the word
   *  the shape gate bans as machinery ("baseline"; the second dispatch's
   *  finding), read aloud: each trade's typical figure, modelled (R3, R12),
   *  never this city's. The withheld line counts the siblings whose shard
   *  holds no payback (R11), the country money card's idiom. The state
   *  line stands where the list would when fewer than four siblings hold a
   *  figure (8.6: "full form with the withheld line counting the members it
   *  cannot print, never a short list"), in the site's idiom (M19); `{k}`
   *  is the count in words, "none" at zero. Where no sibling resolves at
   *  all the shorter line says so. */
  tradeRivals: {
    kicker: "Other trades to open",
    /** Each row's figure is the trade's own years to pay back (2026-10-15, release 2 job A: the typed cost to open left). */
    head: { name: "Trade", value: "Pays back" },
    basis: "Each trade's typical years to pay back, an estimate.",
    withheldOne: "1 trade left out: no payback figure yet.",
    withheldMany: "{n} trades left out: no payback figures yet.",
    state: "Only {k} other trades here have payback figures, too few to compare.",
    stateNone: "No other trades here have payback figures yet.",
  },
  /** `14 worth` (the same dispatch): the kicker is 8.6's title; the two marks
   *  are the ends of what a business like this sells for, in a person's
   *  words; the basis is 8.6's own sentence, verbatim. The note under it is
   *  the strip's own second line (RangeStrip's `note`) and says whose each
   *  figure is, because the two ends rest on two sources: the sale figures
   *  are the trade's, off the shard, modelled (R3, R12; the mark is behind
   *  his switch, so the word is said), and the take-home they multiply is
   *  this city's, the figure `00 take` prints. The withheld line stands where
   *  the strip would off `moneyShown` (no take-home to work from). The last
   *  line stands on the 38 shards whose sale figures rest on operating
   *  earnings (item 52): a figure worked from an owner's take-home would be
   *  the wrong base, so none prints; the word the shape gate bans
   *  ("multiple") is not used. */
  /** WHAT A CUSTOMER SPENDS, the trade's `16 customers` (trade_customers_rows.ts, 2026-09-20 night, his "more sections"): the kicker names the subject; the cells are one figure with its unit; the year is the computation, named in the basis (his standard of 2026-09-19); the foot says modelled. */
  /** THE GLOSSARY, his pop-up (2026-09-22, QUEUE ui:the-gloss). One entry per term of art a first-time owner meets in an opener; each says what the WORD means in a sentence a person would say out loud, never what the figure is measured on (the basis line under the figure keeps that job) and never where a number came from. Under 140 characters, so the panel stays one short paragraph beside the "?". */
/** THE TRAIL'S OWN WORDS (crumb_rows.ts, 2026-09-22): the steps that are not a place's or a trade's name. Each is what the page it points at is called, never a label invented for the trail. */
  /** THE STEPS TO REGISTER, the how-to page's `01 steps` (howto_steps_rows.ts, 2026-09-23). The kicker names the sequence; the total says how long the whole thing takes, which is the shard's own figure and NOT the sum of the steps, because steps overlap; the basis says so in a person's words. */
  howToSteps: {
    kicker: "The steps, in order",
    totalLabel: "Start to finish",
    units: { day: "day", days: "days" },
    /** The file's word for how a step is done, as a reader says it (2026-09-25: "Either" said nothing). */
    how: { either: "Online or in branch", online: "Online", "in person": "In person", paper: "On paper" } as Record<string, string>,
    basis: "Some steps run at the same time, so the total is shorter.",
    /** Where a step's wait has no source and so no total stands (the UK's bank account: banks publish no common figure; masterplan step 04, 2026-10-05). */
    basisNoTotal: "Banks publish no common wait for an account, so no total.",
    /** The card's figure where no total stands: how many steps the list holds (PART 4, one figure at 30). */
    countLabel: "Steps in all",
    foot: "",
  },
  /** WHEN THIS CITY SPENDS, the city's `19 calendar` (city_calendar_rows.ts, 2026-09-23, brief row Y1): the kicker names the subject, the label names the figure, the basis says what the twelve columns are and what the swing is, and the foot says the figures are the city's own calendar. */
  /** WHAT A BUSINESS HERE SELLS FOR, the country's `17 exit` (country_exit_rows.ts, 2026-09-23, brief row C3). The marks are the usual band as a multiple of EARNINGS, never of sales; the basis says so in a person's words, and the climate word is the file's own, rewritten for a reader. */
  /** HOW LONG IT TAKES TO SELL, the country's `17 exit` (country_exit_rows.ts, 2026-09-23, brief row C3). THE SALE PRICE IS NOT HERE: the file holds it as a multiple of earnings and clause 15 says a price is currency and never a multiple, so it waits on an earnings base. The buyers line is a sentence because the file's value is a word, and PART 5 keeps a word out of a figure's slot. */
  countryExit: {
    kicker: "Time to sell",
    marks: { quick: "A quick sale", slow: "A slow one" },
    month: "month",
    months: "months",
    climateLine: { active: "Buyers are about: a business here usually finds one.", steady: "Buyers are around, and a sale takes patience.", thin: "Buyers are few, and a sale can take a year or more." },
    /* THE WORLD'S OWN FIGURES, under the hairline (2026-09-23 afternoon): what
       the months above stand against, without which they are a number nobody
       can place (VISUAL-CHOICE section 0). Both are worked from the same field
       across the whole bank and the builder says how. */
    world: { usual: "the usual anywhere", longer: "countries where a sale can take longer", longerLean: "countries where selling takes longer" },
    here: "Here",
    usualAnywhere: "Usual anywhere",
    /** The buyers as a label on the lean card (2026-09-25): the file's three words, said as a reader says them. */
    buyers: { active: "Plenty of buyers", steady: "Some buyers", thin: "Few buyers" } as Record<string, string>,
    basis: "From listing to money, for a small business changing hands.",
    foot: "",
  },
  /** WHAT HOUSEHOLDS SPEND ON, the country's `18 spend` (country_spend_rows.ts,
   *  2026-09-23, brief row C5). The categories are the file's seven machine
   *  keys said in a person's words, and a key with no words here withholds the
   *  whole card rather than printing "household_goods". The focal is not one of
   *  the rows: it is eating out measured against all the food money, and the
   *  basis names that division in the words a person would use. The ceiling is
   *  the whole budget, so the same line names it at the head of the track. */
  countrySpend: {
    /** The bracket over eating out and groceries, the two parts the card's figure is worked from (goal 2026-09-26, M6). */
    bracket: "Food",
    categories: {
      housing_utilities: "Housing and bills",
      transport: "Getting around",
      food_drink: "Groceries",
      recreation: "Leisure and holidays",
      dining_out: "Eating out",
      /* THREE WORDS, NOT FOUR: "Things for the home" is the natural phrase and
         the model laws read a four-word row label as a sentence (ROW SENTENCE,
         measured on both country pages the day this card was built). */
      household_goods: "Furniture and appliances",
      other: "Everything else",
    },
    outWords: "of the food money goes on eating out",
    phoneHead: { name: "What it goes on", value: "Share" },
    /* NO LINE (his correction of 2026-09-24, evening): the title asks the
       question, the rows' heads say "What it goes on" and "Share", and the
       focal's words name its division ("of the food money goes on eating
       out"); a line under them ("Shares of a household's spending") said the
       title again. */
    basis: "",
  },
  /** WHAT THE CREW COSTS, the city's `20 crew` (city_crew_rows.ts, 2026-09-23,
   *  brief row Y3). The role names are the shard's own and are not here; what
   *  is here is the column heads (the unit said once, PART 5), the words over
   *  the set's middle, and the basis naming whose figures these are. */
  cityCrew: {
    kicker: "What the crew costs",
    middle: "Middle of the {n}",
    head: { name: "The role", value: "A month, gross" },
    week: "hours in the usual week",
    basis: "Five roles a small business hires.",
    /** A UK city's page (held to sources): no source holds the pay by role or the usual week, so the line says both are estimated
     *  (plan 2026-10-08: the week printed unmarked on London until then). */
    basisSourcedOnly: "Estimated pay and hours for five roles a small business hires.",
  },
  /** HOW THIS CITY DOES BUSINESS, the city's `21 texture` (city_texture_rows.ts,
   *  2026-09-23). The poles are the shard's own words; these are the SUBJECTS,
   *  keyed by the pair so a name cannot drift from the ends it names, and the
   *  order is the card's reading order: how a deal is done, how money is taken,
   *  how the rules are enforced, whose document the lease is, how work is won,
   *  then the pace, which is the sixth and drops under his five-row cap. */
  cityTexture: {
    kicker: "Doing business here",
    /* THE SUBJECT AND ITS TWO ENDS, keyed by the pair as the shard writes it.
       The ends are the shard's own words except one: "Slow to open up" is four
       words, and a pole of four words is a sentence by the model laws' own
       measure (ROW SENTENCE), so this site says "Slow to trust", which is what
       the shard's takeaway lines mean by it. Every other end is verbatim. */
    traits: {
      "Slow to open up | Quick to deal": { name: "Doing a deal", left: "Slow to trust", right: "Quick to deal" },
      "Cash-friendly | Card-first": { name: "Taking payment", left: "Cash-friendly", right: "Card-first" },
      "Loose on rules | Strict compliance": { name: "The rules", left: "Loose on rules", right: "Strict compliance" },
      "Landlord-friendly | Tenant-friendly": { name: "The lease", left: "Landlord-friendly", right: "Tenant-friendly" },
      "Relationship-led | Transactional": { name: "Winning work", left: "Relationship-led", right: "Transactional" },
      "Relaxed pace | Always-on": { name: "The pace", left: "Relaxed pace", right: "Always-on" },
    },
    /** The card's one figure: how often somebody official walks in, off `reg.inspections_per_yr`. */
    visits: { one: "Official visit a year", many: "Official visits a year" },
    basis: "",
    /** A page held to a register region: the card's one figure has no source, so the line says so (the reads are drawn as reads). */
    basisSourcedOnly: "The count of official visits is an estimate.",
  },
  cityCalendar: {
    kicker: "When this city spends",
    swingLabel: "Busiest over quietest",
    basis: "Spending each month, with the busiest set to 100.",
    /** The six UK cities (plan 2026-10-08): the shard's modelled months. */
    basisEstimate: "Estimated spending each month, with the busiest set to 100.",
    foot: "",
  },
  crumbs: {
    districts: "Districts",
    howTo: "How to open a business",
    industries: "Trades",
  },
  glossary: {
    netMargin: "The share of every $100 of sales that is still there once every cost of running the business has been paid.",
    fitOut: "What it costs to turn an empty shop into your shop: counters, wiring, a kitchen, signs, the work before the doors open.",
    /* 2026-09-24, the goal's B4 (QUEUE ui:the-gloss): the registering card (the country and how-to pages) and the district rent card (the city and the district hub), the pages that carried none. */
    legalForm: "The shape a business takes in law: who owns it, who answers for its debts, and what it must file each year.",
    rentAgainst: "Each district's shop rent divided by the cheapest district's, so the cheapest reads one and every dearer district reads more.",
  },
  tradeCustomers: {
    kicker: "What a customer spends",
    yearLabel: "A regular's year",
    cells: { spend: "a visit", visits: "visits a year", visitsBetween: "years between visits" },
    basis: "Spend per visit, times visits a year.",
    foot: "",
  },
  tradeWorth: {
    kicker: "What one sells for",
    marks: { low: "Low end", high: "High end" },
    basis: "What a buyer might pay, based on a year's profit.",
    note: "",
    withheld: "No sale price yet: we have no take-home for this trade here.",
    otherBasis: "No sale price yet for this trade.",
  },
  /** THE OPENING PAGE'S OWN WORDS (2026-10-15, release 2 job A): the typed start figures (a total to open, capital, permits in
   *  dollars, weeks, first hires, a payback) left /opening, and the trade page's held figures stand in their place: the licences
   *  with their waits and fee bands, and the trade's first-year figures. Four-word headings, one supporting line each. */
  opening: {
    /** The line under the lead figure (fix round 1: eleven words; the thirteen it had broke the twelve-word line). */
    verdict: "The licences to get, and how long to earn it back.",
    leadWait: "Longest required licence wait, an estimate",
    /** Under the months to break even where the place prints no licence list: "{words}" is the figure's own words ("To break even"). */
    leadEarning: "{words}, an estimate",
    noLead: "No licence or payback figures for this trade yet.",
    licencesHead: "Licences you need",
    licencesLine: "Each licence's typical wait and fee band, for the trade.",
    noLicences: "No licence list for this trade here yet.",
    earningHead: "Earning it back",
    earningLine: "The trade's typical first year, an estimate.",
    takeHomeLabel: "A typical owner keeps a year here",
    peersHead: "The same business elsewhere",
    peersLine: "What a typical owner keeps a year in other places.",
    /** The dealbreaker (src/lib/open/dealbreakers.ts): its lead words, and the line under it where the trade's shard holds a held figure;
     *  "{pct}" is that figure, stamped, and the line says it is an estimate (release 3 job A: the typed "about 12% of sales" and the "Directional"
     *  disclaimer left; fix round 1, I-2: the estimate word). */
    dealbreakerLead: "Do not open unless",
    dealbreakerFigure: "Across the trade, rent and occupancy take {pct} of sales, an estimate.",
  },
  /** THE BUY-OR-START PAGE'S START SIDE: no start cost is held. The hero leads with the longest required licence wait, else the trade's years
   *  to pay back (release 3 job A and its fix round 1), and the compare card says the gap once in its cash row and carries the figure the hero
   *  did not lead with; where neither is held the hero says the gap. */
  buyOrStart: {
    startCash: "No start cost held yet.",
    /** The hero's start side leads with a held figure (release 3 job A), labelled as the buy side's "To buy, estimated" is. */
    leadWait: "To start, the longest required licence wait, estimated",
    leadPayback: "To start, the time to pay back, estimated",
    cashLabel: "Cash needed",
    waitLabel: "Longest required licence wait",
    waitNote: "the slowest licence every shop needs, an estimate",
    noWait: "No required licence wait here yet.",
    paybackLabel: "Time to pay back",
    paybackNote: "the trade's typical, an estimate",
  },
  /** `15 close` (the same dispatch): the trade's three doors, 8.6's and
   *  M21's own words. Across to the industry page, up to the city page (the
   *  city masthead's own idiom, "Opening a business in"), and the compare
   *  pill last. Three first words, none shared; no pricing door, no sibling
   *  door (`13` is that door on every row).
   *  The run door since plan 2026-10-13 cost-simulator (Q3, answer A): the calculator with the page's place and trade, before the pill, a fourth door. */
  tradeClose: {
    industryDoor: "See {trade} in other cities",
    cityDoor: "Opening a business in {city}",
    compareDoor: "Compare {trade} across cities",
    runDoor: "Run your own numbers",
  },
  /** THE INDUSTRY PAGE'S `00 take` (MODEL.md 8.7; plan step 34's first
   *  dispatch, 2026-09-18): the answer label is the trade's keep in four
   *  words (8.7's title, "What this trade keeps of every $100 a customer
   *  spends", is the question; the basis carries the rest of it). One basis
   *  per branch of the one net builder (trade_net.ts, R7): the shard's
   *  ladder says the figure is the trade's, modelled; the sector profile's
   *  residual says whose it is, since it is not this trade's own (R12: every
   *  shard figure prints as modelled, and the sample mark is off). The state
   *  word stands where the answer would when neither holds a figure (no
   *  trade today; the copy exists so the card can say it). The three
   *  companions are 8.7's own, each with its qualifier under 48 characters
   *  (the word modelled is said once for the three, in the foot, not three
   *  times under three figures); the cost is a trade figure marked modelled
   *  (R3), never a place's, and its note says so. The
   *  foot is the coverage line: the not-gathered idiom (M19) for whichever
   *  companions are withheld (the 90 on the archetype's default, R11; the
   *  seven business-to-business shards whose spend is on file as zero), then
   *  one sentence saying the printed ones are the trade's, modelled. The
   *  crumb is the sector, the altitude above the trade, named once. */
  industryHero: {
    answerLabel: "What this trade keeps",
    answerBasisShard: "Out of every $100 a customer spends, after all costs.",
    answerBasisProfile: "Out of every $100 a customer spends, typical for its sector.",
    absent: "Not known yet",
    absentNote: "we have no figure for what this trade keeps",
    cells: {
      spend: { label: "Spend per visit", note: "one customer, one visit" },
      visits: { label: "Visits a year", labelBetween: "Years between visits", note: "a typical customer" },
    },
    /** The not-gathered line's parts, joined by the builder in the order the cells stand. */
    notGathered: "We don't have {parts} yet.",
    parts: { spend: "what a customer spends", visits: "how often a customer buys" },
    /** The coverage sentence over the printed companions, their names filled in the cells' order. */
    footAll: "Estimates for a typical {noun}, not any one place.",
    footOne: "Estimates for a typical {noun}, not any one place.",
    names: { spend: "spend", visits: "visits" },
    /** The answer drawn under the net: its two parts, labels only, and the drawing's name for a screen reader after the figure. */
    bar: { part: "Kept", rest: "Costs", of: "of every $100 of sales kept" },
  },
  /** `01 lasts` at the world altitude (8.7): the same builder and card as the
   *  trade's `09 lasts` (lasts_rows.ts, R5), the basis without the city
   *  clause because there is no city here; the kicker and the foot are the
   *  trade's, one literal each. */
  industryLasts: {
    basis: "",
  },
  /** `02 benchmark` (8.7): the trades next door, on RankedBars with a set
   *  ceiling. The kicker is four words; the basis says the rows are the
   *  highest of the sector's count and names the sector, composed by the
   *  builder (the sector's name read aloud, "food and drink", never the
   *  taxonomy's ampersand), within fourteen words on every one of the 25
   *  sectors (four of them are four words long); the ceiling's words
   *  stand at the rule's free end; the two heads are the country money
   *  card's, one literal (COPY.margin.phoneHead). The withheld lines, each
   *  under fourteen words: a member on the sector profile (its keep is the
   *  sector's, not its own) is counted and never ranked (clause 46); under
   *  four members holding a figure the card draws what it has under the
   *  count (clause 22; 8.7's own row); with none or one it holds the
   *  not-gathered line where the rows would stand (M19). */
  industryBenchmark: {
    kicker: "Similar trades",
    /* The words under the focal, the trade's place and the set it is placed in (the goal's B6; A17, 2026-09-24): "Joint 8th", "of 13 in food and drink". "in {sector}" and not "{sector} trades": "of 9 trades and home services trades" doubled the noun on four sectors. */
    rankWords: "of {n} in {sector}",
    /** The one line: what the set is ranked by where it ranks, what the rows are where it does not. */
    basisRanked: "Ranked by profit on each $100 of sales.",
    basis: "Profit on each $100 of sales.",
    topLabel: "The highest",
    withheldOne: "1 trade left out: we only have its sector's figure.",
    withheldMany: "{n} trades left out: we only have their sector's figure.",
    withheldSelf: "This trade is not ranked: we only have its sector's figure.",
    withheldSelfAmong: "{n} trades left out, this one too: we only have their sector's figure.",
    underFloorAll: "Only {rows} trades in this sector, too few to rank.",
    underFloor: "Only {rows} of {members} trades here have figures, too few to rank.",
    oneRow: "Only 1 of {members} trades here has a figure.",
    noRows: "No figures yet for the {members} trades in this sector.",
  },
  /** THE INDUSTRY PAGE'S THREE CHAPTER HEADINGS (8.7's own titles, the
   *  first dispatch): turn one is the spine's string and not yet the site's
   *  (8.7's chapter-turns paragraph leaves the two industry strings to the
   *  composition round and names no winner; M7 bound the trade page alone),
   *  so the spine's stands until the controller rules; turn two is the
   *  spine's; turn three shares the trade's literal, the site's pattern with
   *  the subject swapped. */
  industryChapters: {
    costs: "What it costs to open, and what it keeps",
    where: "Where it pays, and what to sell",
    trade: TRADE_CHAPTER,
  },
  /** `03 split` at the world altitude (8.7; plan step 34's second dispatch,
   *  2026-09-18) carries NO strings of its own: it is the trade's card off
   *  the trade's builder (split_rows.ts, `buildIndustrySplit`), so the
   *  kicker (his name for the B6 seat, M15), the two basis lines, the
   *  withheld line, the foot and the plus are `tradeSplit`'s, one literal on
   *  both pages, as `01 lasts` shares `tradeLasts`'s.
   *
   *  `04 open` (8.7): the kicker is four words in a person's mouth for the
   *  spine's question ("what it takes to be allowed to open the doors"); the
   *  three cell labels are read aloud under it ("Opening the doors: licences
   *  to hold, 4; the slowest licence, 75 days; to break even, 6 months"), a
   *  noun phrase each, the unit in the figure, never a word where a figure
   *  goes (the cost band word is not printed, PART 5); the basis is the
   *  shard-fed cards' sentence with no city clause, the brief's own; the foot
   *  says the three are modelled in words (R12), because the sample mark is
   *  behind his switch. The plus's summary is one line a person says; its
   *  rows are the licences by name with their days, the permits' own cells,
   *  and its withheld line counts a licence with no wait on file (the
   *  permits' one). A cell whose figure is not on file is withheld with its
   *  line in the site's idiom (M19; no shard today, 243 hold all three). */
  industryOpen: {
    kicker: "Licences you need",
    cells: { licences: "Licences to hold", slowest: "The slowest licence", breakEven: "To break even" },
    /* The companions under the slowest wait (the goal's B6): the figure then its words, read aloud ("4 licences to hold", "6 months to break even"). */
    companions: { licences: "licences to hold", breakEven: "to break even" },
    basis: "",
    foot: "",
    detail: {
      summary: "The licences, by name",
      withheldOne: "Plus 1 licence with no known wait.",
      withheldMany: "Plus {n} licences with no known wait.",
      /* The goal's A9b: a licence named for a United States jurisdiction, not listed at the world altitude. */
      usNamedOne: "1 US-only licence left out.",
      usNamedMany: "{n} US-only licences left out.",
      /** A licence whose shard name runs past three words takes its kind as the row's label, its name as the row's note (plan 2026-10-13
       *  country-page-journey, Task 1E: ROW SENTENCE, read behind the plus for the first time). A closed list, read in industry_open_rows.ts. */
      kinds: { alcohol: "Alcohol licence", foodSafety: "Food safety", food: "Food licence", tax: "Tax registration", insurance: "Insurance", health: "Health permit", environment: "Environment permit", premises: "Premises permit", vehicle: "Vehicle licence", customs: "Customs registration", certificate: "Certification", accreditation: "Accreditation", checks: "Staff checks", compliance: "Compliance", registration: "Registration", licence: "Trade licence", other: "Other requirement" },
    },
    withheld: {
      licences: "No licence list for this trade yet.",
      slowest: "No licence waits for this trade yet.",
      breakEven: "No break-even figure yet.",
    },
  },
  /** `05 pays` (8.7; the same dispatch): the bento's openers, each within
   *  PART 7's four words and read aloud over its figure ("Until it pays
   *  back, 2.5 years"; "The starting crew, 11"; "Fixed costs, 30 of 100";
   *  the share cell takes the trade page's own opener for the same field,
   *  `tradeClears`'s "When it clears costs", one literal for one figure at
   *  two altitudes, M20). Each cell's basis says what its figure is and that
   *  it is modelled (R12), within fourteen words, because the cluster has no
   *  line of its own and the sample mark is behind his switch; the crew's
   *  second basis is the premises' idiom for a whole the drawing had to
   *  round (a fraction of a person on three shards). The withheld lines
   *  stand where a figure would when the shard does not hold it (no shard
   *  today, 243 of 243 hold all four); the crew's is for a shard whose
   *  roles add to nothing, the fixed part's second for a share over 100
   *  that is not a share (the market's guard). */
  industryPays: {
    kickers: { crew: "The starting crew", payback: "Payback", fixed: "Fixed costs" },
    /** The payback's companion (2026-09-20 night, clause 65): "6 months until a day clears its costs". */
    ramp: { month: "month", months: "months", words: "until a day clears its costs" },
    /** The fixed-costs bar's words (the segmented bar, his B27) and the share ring's caption (his B31), the same night. */
    fixedBar: { label: "Fixed", variableLabel: "Variable", unit: "of 100", basisPair: "Out of every $100 of costs." },
    shareCaption: "of a day's sales",
    basis: {
      crew: "",
      crewRounded: "Rounded to whole people.",
      payback: "Years to earn back the money put in.",
      /** The whole is said the way the market's count cells say it ("of every 100"); the part is what stands whatever it sells. */
      fixed: "Costs you pay whatever you sell, out of $100.",
      share: "The part of a day's sales that pays the costs.",
    },
    withheld: {
      crew: "No crew figures for this trade yet.",
      payback: "No payback figure for this trade yet.",
      fixed: "No fixed-cost figure for this trade yet.",
      fixedNotAShare: "Our fixed-cost figure doesn't add up, so it's not shown.",
      share: "No figure yet for the part of a day that pays the costs.",
    },
  },
  /** `06 places` (MODEL.md 8.7; plan step 34's third dispatch, 2026-09-19),
   *  the page's one table, on CompareTable. The kicker is 8.7's title in four
   *  words, read aloud over the rows ("Where it pays best: New York, $25K,
   *  5%"); the two column heads say the unit once each, the money column as
   *  a year's take-home and the margin as a net margin, the country money
   *  card's own head (M20); the basis says what the two figures are (after
   *  tax, the share of sales kept, each city's own cell) and that they are
   *  modelled (the estimator's model over the cell's read revenue, the trade
   *  page's own engine branch), within fourteen words, because the sample
   *  mark is behind his switch. The withheld lines under the table count the
   *  resolved cities that are not rows and say why in a person's words (the
   *  revenue an average filled in for a row that held none of its own, or
   *  the margin the model's floor), digits as the withheld lines have them
   *  (the money card's "1 trade withheld: the model returns a loss or a
   *  floor", M20); today every trade's slate is seated, so the lines are
   *  reachable on fixtures alone. The seat's lines (under four cities of
   *  their own, the drawn blocked seat at the table's full width) open "Not
   *  gathered yet:" (M19), name the count of own figures the trade holds
   *  among the slate's cities and that a table needs four, each fourteen
   *  words with the slate's size composed in (never typed); the foot names
   *  the requirement (DATA-REQUIREMENTS item 69). */
  industryPlaces: {
    kicker: "Where it pays best",
    cols: { city: "City", takeHome: "Take-home a year", netMargin: "Net margin" },
    basis: "Take-home after tax, and the share of sales kept.",
    withheldOne: "1 city left out: its figures aren't reliable enough.",
    withheldMany: "{n} cities left out: their figures aren't reliable enough.",
    blocked: {
      none: "No city of {slate} has its own figures yet, so nothing to compare.",
      one: "Only 1 of {slate} cities has its own figures, too few to compare.",
      some: "Only {n} of {slate} cities have their own figures, too few to compare.",
      foot: "",
    },
  },
  /** `07 formats` (8.7; the same dispatch), the mark list with no marks. The
   *  kicker is 8.7's title in four words, read aloud over the rows ("What
   *  each format keeps: fast casual, 8%"); the two heads are the list's, the
   *  value head the money card's own name for the figure (M20); the two
   *  bases name the branch the one net builder printed the trade's net on,
   *  in the hero's own words for each ("the trade's typical" off the shard's
   *  ladder, "the sector's typical" off the profile's residual on the 38
   *  fill shards), and say modelled (R12), within fourteen words. The state
   *  line stands where the list would under four formats (no shard today),
   *  counting them the rivals' way. */
  industryFormats: {
    kicker: "Which format keeps most",
    head: { name: "Format", value: "Net margin" },
    basisShard: "Out of every $100 a customer spends.",
    basisProfile: "Out of every $100 a customer spends.",
    state: "Only {k} formats have figures, too few to compare.",
  },
  /** `08 channels` at the world altitude (8.7; the same dispatch): the same
   *  builder and card as the trade's `11 mix` (mix_rows.ts, cell/turn-two.tsx
   *  MixCard), the basis without the city clause because there is no city
   *  here, the same words the survival grid and the licence card use at
   *  this altitude; the kicker, the foot and the withheld line are the
   *  trade's, one literal each. */
  industryMix: {
    basis: "",
  },
  /** `09 know` (MODEL.md 8.7; plan step 34's fourth dispatch, 2026-09-19),
   *  THE PAGE'S ONE PROSE SECTION on NoteList (R9). The kicker is 8.7's
   *  question in three words a person says ("what a working owner would tell
   *  you before you sign"); the two character notes take the trade page's
   *  own labels (`tradeSuits.labels`, one literal on both pages), the
   *  failure modes their file's own labels, so nothing here names them. The
   *  not-gathered row is the brief's line in the site's idiom (M19), under
   *  its own label, the shape the trade page's 240 would take; the basis
   *  says whose words the notes are and that nothing on the card is a
   *  measurement, within fourteen words (PART 7: what it is, never what it
   *  means). No foot: PART 7's foot holds a coverage statement or a
   *  companion figure, and the close's doors navigate. */
  industryKnow: {
    kicker: "Lessons from owners",
    notGatheredLabel: "What owners know",
    notGathered: "No owner notes for this trade yet.",
    basis: "",
  },
  /** `10 field` (8.7; the same dispatch): the trade's market builder at the
   *  world altitude (market_rows.ts, the lasts idiom), on KvGrid. The kicker
   *  is 8.7's question in four words ("who you would be trading alongside");
   *  the three cell labels are the trade market's own openers by key
   *  (`tradeMarket.kickers`, one literal at two altitudes), the chains and
   *  swing cells carrying a note under the figure that says the whole in a
   *  person's words (the hero cells' idiom, under 48 characters); the basis
   *  is the world idiom the survival grid, the licence card and the mix use
   *  here; the foot says the three are modelled in words (R12), because the
   *  sample mark is behind his switch. The builder's world bases, one per
   *  cell, are the trade's without their city clause (the swing's carries
   *  none and is the trade's literal); the churn cell is built at both
   *  altitudes and drawn on the trade page alone (8.7: beside `01 lasts` it
   *  is a second view of one reading). */
  industryField: {
    kicker: "The competition",
    notes: { chains: "of all firms", swing: "busiest month over the quietest" },
    /* The companions under the density (the goal's B6): the figure then its words, read aloud ("32% held by chains", "1.4x busiest month over the quietest"). */
    companions: { chains: "held by chains", swing: "busiest month over the quietest" },
    basis: "",
    foot: "",
    cellBasis: {
      firms: "",
      chains: "Out of every 100 firms.",
      close: "Out of every 100 firms.",
    },
  },
  /** `11 close` (8.7; the same dispatch), on Terminus, the kicker the
   *  site's `close.kicker`. Three doors at most, the pill last (M21): the
   *  best-paying city's trade page off `06`'s top row ("See {trade} in
   *  {city}", the trade page's own verb; drawn only where the table draws,
   *  no trade today), the trade next door off `02`'s rows ("{Leader}, the
   *  trade next door": the highest other member of the sector whose page
   *  exists, named after `02`'s own kicker and claiming no superlative,
   *  because a retired leader's page is a redirect and the door then goes
   *  to the next member in scope), and the compare pill, the trade page's
   *  own literal (`tradeClose.compareDoor`). No sector door: no sector route
   *  exists in the app folder. No two doors share a first word: "See",
   *  the leader's name, "Compare". */
  industryClose: {
    cityDoor: "See {trade} in {city}",
    leaderDoor: "{leader}, the trade next door",
  },
  /** THE NEIGHBOURHOOD PAGES (MODEL.md 8.8; plan step 35, 2026-09-19), the
   *  hub and the district page, every string read aloud. The rent figure's
   *  words are the city's district card's own wherever the two print one
   *  thing (`cityDistricts`: the kicker, the head "Rent, against {district}",
   *  the basis naming the cheapest, "Dearest district"), referenced there and
   *  never retyped, so a reader who came down from the city page meets the
   *  same words for the same table (M16, M20).
   *
   *  THE TAKE. The label names both ends of the set and the figure is the
   *  spread between them ("Rent, West End against South London: 2.50x");
   *  hood_take_rows.ts says why the 40 is not the cheapest district's own
   *  figure. The cells' labels are the district's name and its place in the
   *  set, in the city card's own two words, "cheapest" and "dearest"; a
   *  three-word district name runs the label to five, the reference-name
   *  exception. The basis says the figure is modelled shop rent; the foot is
   *  the provenance line the old masthead printed under itself. "against the"
   *  is on the banned list below, so no string here carries it: the
   *  comparator always names the district.
   *
   *  THE VISITOR FIGURE is `tourism_intensity`, annual visitors per resident,
   *  overnight and day trips (the intensity file's own convention): the head
   *  says the unit once in three words, the basis says the year and that the
   *  counts are at district level or finer (source quality A or B; a C among
   *  them swaps the clause for "some estimated from the city's size").
   *
   *  THE CHARACTER CARD's first row is the note's opening sentence
   *  (hood_character_rows.ts says why a paragraph cannot stand as a fact),
   *  under the label "The note's first line", which says what it is, so the
   *  card carries no basis line: measured 2026-09-19, the basis was the one
   *  line that stood the notes at 277 beside the seat's 171 in the 1-2 band,
   *  where the seat read 54 percent ink under the art-direction gate's 60.
   *  Never "foot traffic" (8.8: it reads as the cut footfall metric). */
  hoodTake: {
    subtitle: "",
    labelSpread: "Rent, {dearest} against {cheapest}",
    basis: "Estimates from each district's character, not from leases.",
    cells: { cheapest: "Cheapest district", dearest: "Dearest district", count: "Districts ranked" },
    foot: "",
    footYear: "",
  },
  hoodRank: {
    clipOne: "{district} may be dearer than shown.",
    clipOneLow: "{district} may be cheaper than shown.",
    clipMany: "{districts} may be dearer or cheaper than shown.",
  },
  hoodPremium: {
    kicker: "Where visitors crowd in",
    head: { name: "District", value: "Visitors per resident" },
    basis: "Visitors a year for every resident, overnight and day trips.",
    basisYear: "Visitors a year for every resident, {year}.",
    basisYearEstimate: "Visitors a year for every resident, {year}. Some are estimates.",
    withheldOne: "{n} district left out: no visitor figure yet.",
    withheldMany: "{n} districts left out: no visitor figures yet.",
  },
  hoodCompare: {
    kicker: "Districts, side by side",
    cols: { visitors: "Visitors per resident" },
    caveat: "",
    caveatYear: "",
    dash: "A dash means no visitor figure yet.",
  },
  hoodChapters: {
    rent: "What rent costs, district by district",
    works: "What the place is like",
  },
  hoodCharacter: {
    kicker: "What it is like",
    kickerNamed: "About {district}",
    rows: { sentence: "In short", who: "Who is here", price: "Price tier", description: "In brief" },
    foot: "",
  },
  /** IF IT FAILS (masterplan step 29; his ruling 28 of 2026-09-26; DATA-REQUIREMENTS item 76): chapter 02's level after borrowing.
   *  Its figure is the months until a bankrupt sole trader is freed from the debts; its rows what failing costs the owner of a sole
   *  trade or a company (src/lib/spine/sections/if_it_fails.ts). The strike-off is the paperwork card's and is never printed here. */
  ifItFails: {
    months: "months",
    words: "until a bankrupt sole trader is freed from the debts",
  },
  /** OPENING FROM ABROAD (masterplan step 27; his ruling 28 of 2026-09-26; DATA-REQUIREMENTS item 74): chapter 01's level after
   *  registering. Its figure is the Innovator Founder route's fees for three years per person; its rows the walls in the research's
   *  order (src/lib/spine/sections/from_abroad.ts), each its cost or its time where open, its state where not. */
  fromAbroad: {
    words: "Founder visa fees for 3 years, per person, decided in {weeks} weeks.",
    state: { open: "Open", conditional: "Depends", closed: "Closed" },
  },
  /** THE LEASE, BY LAW (masterplan step 25; his ruling 28 of 2026-09-26; DATA-REQUIREMENTS item 73): chapter 01's level after the
   *  running costs. Its figure is the least notice a landlord must give to end a protected lease; its rows the clauses in plain
   *  words and the stamp duty on an 80 square metre London shop's lease (src/lib/spine/sections/lease_by_law.ts). */
  leaseByLaw: {
    months: "months",
    words: "The least notice a landlord gives to end a protected lease.",
    taxLabel: { 5: "5-year lease", 10: "10-year lease" },
    taxNote: "Stamp duty, 80 m² London shop",
    taxNoteDue: "Same shop, due in {days}\u00a0days",
  },
  /** ONE HIRE, ALL IN (masterplan step 23; his ruling 28 of 2026-09-26; DATA-REQUIREMENTS item 77): the staff level's third card.
   *  Its figure is one worked hour of a minimum-wage hire, all in (src/lib/spine/sections/hire_all_in.ts); its rows what letting
   *  that hire go costs after one, three and ten years, and the law's amounts the page prints nowhere else. */
  hireAllIn: {
    words: "One worked hour at the minimum wage, with the allowance.",
    parting: { 1: "Parting, 1 year", 3: "Parting, 3 years", 10: "Parting, 10 years" },
    partingNote: "Redundancy and notice, at 35",
    partingNoteNotice: "Notice only, no redundancy",
  },
  /** THE LOCKED SECTION (masterplan step 15; his interview of 2026-09-26: 18, half of every UK chapter behind Pro; 22, "title
   *  and icon, the drawing blurred behind, one line, one button; no pop-up"). One button, and one line for every section id a UK
   *  page can lock (the levels after the first of each chapter on /gb, the UK city pages and the London trade pages, read off
   *  their renders of 2026-10-05): what the section answers, in the reader's words, no figure. */
  /** THE HOME PAGE (plan 2026-10-13 home-quiet-editorial: the positioning line, his h1 with its business and city rotating between the
   *  words, the contents, the band, the colophon); its other keys are the sections it once drew, now on /gb and /new-businesses, which
   *  read them from here. */
  home: {
    h1: { lead: "How much does a", middle: "make in" },
    /** THE POSITIONING LINE (plan 2026-10-13 home-quiet-editorial, Task 2; the spec's section 2, item 1): his pick of 2026-10-13, the
     *  category the site owns, said above his h1 beside the compass mark; a statement, never a rank (no ranking evidence is held). The one
     *  exception the no-eyebrow rule names (scripts/verify_no_eyebrow.ts). */
    positioning: "The reference atlas of small-business earnings.",
    /** THE ATLAS AS A CONTENTS PAGE (plan 2026-10-13 home-quiet-editorial, Task 4A; the spec's section 2, item 3): the zone's name (a data
     *  attribute, not a printed word); each department's title (four words at most), its one line (twelve words at most, true of every
     *  member its rule can draw) and its door; the tools' and the method's member names (the sources' name is the foot's own,
     *  UK_SOURCES_FOOT.link; the tracks' are the learn page's own titles, src/lib/learn/tracks.ts); the trade figure's unit, said to a screen reader (the trades' line says it once for the eye). */
    contents: {
      label: "The atlas",
      depts: {
        countries: { title: "Countries", line: "What it takes to run a business, country by country.", door: "All countries" },
        cities: { title: "Cities", line: "What a typical customer earns, city by city.", door: "All cities" },
        trades: { title: "Trades", line: "What each trade keeps from its sales, after all costs.", door: "Every trade" },
        tools: { title: "Tools", line: "Put the figures to work on your own plan.", door: "All tools" },
        reading: { title: "Reading", line: "Plain guides to revenue and margins, and how to read a figure.", door: "All reading" },
        method: { title: "How it is made", line: "Where each figure comes from, and every correction made.", door: "About the figures" },
      },
      tools: { decide: "Decide", check: "Check", calculator: "Calculator", compare: "Compare" },
      method: { corrections: "Corrections", coverage: "Coverage report" },
      unit: "of sales kept",
    },
    searchLabel: "Search",
    /** THE HOME PAGE'S ASK (his interview of 2026-09-26: "notify me when my place reaches this depth"; the checkup of 2026-10-06,
     *  finding 5): in place of a free report nobody is writing, a city to wait for (src/lib/home/depth_places.ts). Drawn by the live
     *  home only since 2026-10-07: the rebuilt home leaves the asking to the footer's bar. */
    notify: {
      eyebrow: "Your city",
      title: "Notify me when my city reaches this depth",
      line: "We write when your city’s page holds what London’s does.",
      label: "Your email",
      choose: "City",
      pick: "Choose a city",
      placeholder: "you@example.com",
      button: "Notify me",
      sent: "Thanks. We will write when it does.",
      failed: "Choose a city and check the address, then try again.",
    },
    /** THE DUEL (his ruling of 2026-10-05 on PARKED P36.2): the line under the set's middle, the top rule, the phone's heads. The
     *  question itself is the feed's own title. ONE LINE, AND NO MONTH IN IT (his instruction of 2026-10-07, the home's words cut by
     *  half): the item prints only while fresh (the 45-day rule), so the month told the reader less than its words cost. */
    duel: {
      words: "of 100 companies insolvent a year, the middle trade",
      topLabel: "Highest",
      phoneName: "Trade",
      phoneValue: "Of 100",
      /** A row's name where the official code's own runs past three words (his labels rule); the duel's test fails on any other. */
      names: { "Public houses and bars": "Pubs and bars" } as Record<string, string>,
    },
    /** THE RANKED LIST BESIDE THE DUEL (his ruling of 2026-10-05 on PARKED P36.2b, option (a): "Where kitchens score five"). The
     *  title is the feed's; the figure is the set's middle borough, its label the card's one line (his instruction of 2026-10-07:
     *  one heading and one line; the basis under it left, and the month with the duel's); what is counted is said by the title
     *  and the column head, "of 100" as the duel's phone head says it. */
    kitchens: {
      headline: "The middle borough",
      headName: "Borough",
      headValue: "Of 100",
      /** A member's plain name where the ratings' own runs long or official. */
      names: { "City of London Corporation": "City of London" } as Record<string, string>,
    },
    /** WHERE NEW FIRMS LAST (plan 2026-10-08, home sections, section 1): the title, the lead city's one line (it leads a measured
     *  ranking, the reason his featuring rule asks for), the key of the bars' tick at the UK's share, the bars' spoken unit. */
    firmsLast: {
      kicker: "Where new firms last",
      words: "{city}, of 100 firms born in {cohort} still trading in {year}",
      ukKey: "The UK",
    },
    /** WHERE NEW COMPANIES OPEN (plan 2026-10-08, home sections, section 2): the title, the yardstick's label (the UK's own figure,
     *  for scale; it ranks nothing), the one line (the measure said once: limited companies, per 1,000 of working age, the year),
     *  the value column's head, each region's name and its plus. */
    newCompanies: {
      kicker: "Where new companies open",
      headline: "The UK, for scale",
      basis: "New limited companies per 1,000 people of working age, {year}, where published.",
      headName: "Country",
      headValue: "Per 1,000",
      regions: { latam: "Latin America and the Caribbean", africa: "Africa" },
      more: "{n} more in {region}",
    },
    /** WHERE US RESTAURANTS GREW AND SHRANK (plan 2026-10-08, home sections, section 3): the title, the lead's one line (the
     *  narrower trade named, the metro last so a long name still fits twelve words), the two tables' heads. */
    usRestaurants: {
      kicker: "US restaurants since {from}",
      words: "Full-service restaurants added since {from}, most among {n} metros: {city}",
      added: "Most added",
      lost: "Most lost",
    },
    /** WHERE TO NEXT (plan 2026-10-09, home introduction; the spec's section 6, DRAFT approved as written): eight doors, no counts (his
     *  ruling of 2026-10-07), drawn by src/components/spine/WhereNext.tsx from src/lib/home/next_doors.ts. */
    next: {
      title: "Where to next",
      doors: {
        uk: "The United Kingdom",
        countries: "Every country",
        cities: "Every city",
        trades: "Every trade",
        openings: "Where new businesses open",
        about: "About the figures",
        blog: "From the blog",
      },
    },
    /** WHAT THE SITE IS, ONCE (plan 2026-10-09, home introduction): the site's one sentence for the head's description, the manifest, the
     *  share card and the structured data (src/app/layout.tsx, manifest.ts, og/default/route.tsx, src/components/StructuredData.tsx). The
     *  home no longer prints it since plan 2026-10-13: the positioning line says what the site is. */
    definition: "Margin Atlas shows what a small business earns and its owner keeps.",
    /** THE BAND, ONE SOLID STATEMENT (plan 2026-10-13 home-quiet-editorial, Task 5; the spec's section 2, item 4; his decision of
     *  2026-10-13): the zone's name (a data attribute, not a printed word) and its one sentence, how every figure on the site is made, in
     *  About the figures' four words (the provenance stamp's kinds); its link is that page's name, ABOUT_THE_FIGURES. No figure, no count. */
    band: {
      label: "How figures are made",
      line: "Each figure is counted, worked out, looked up or estimated.",
    },
    /** THE COLOPHON (plan 2026-10-13 home-quiet-editorial, Task 6; the spec's section 2, item 5): its name to a screen reader and the
     *  status page's link; the rest are the foot's own words (COPY.pageFoot, UK_SOURCES_FOOT) and the corrections log's (contents.method). */
    colophon: {
      label: "Sources and corrections",
      status: "Status",
    },
    /** PRO, QUIETLY (masterplan step 35; his ruling 23): drawn only while the paywall's switch is on. The year leads (his decision of
     *  2026-10-09): its row says how it is billed and the month's price is the second row, both figures from the plan. */
    pro: {
      kicker: "Pro",
      words: "The second half of every UK chapter, and four Pro sections.",
      yearLabel: "Billed yearly",
      monthLabel: "Month to month",
      button: "See what Pro opens",
    },
  },
  /** WHERE NEW BUSINESSES OPEN, /new-businesses (plan 2026-10-09, home introduction; the home's spec, section 6, DRAFT approved as
   *  written): its question as the h1, and its pair's level name (a data attribute the checks read, not a word the page prints). */
  openings: {
    h1: "Where new businesses open",
    pairLabel: "New companies and US restaurants",
  },
  /** THE PAGE FOOT (masterplan step 31; QUEUE close:furniture-lines): the link to the correction page and, where the data holds a
   *  date, the date its figures were checked (src/components/spine/ReportFoot.tsx). */
  pageFoot: {
    report: "Report a mistake",
    checked: "Checked",
  },
  /** THE FREE DOORS ON A LOCKED PAGE (his ruling of 2026-10-05 on PARKED P20.1): names only, in the page's free close, so locking
   *  never cuts the site's paths (src/components/spine/FreeDoors.tsx). `{city}` is the trade page's city. */
  freeDoors: {
    cities: "The UK’s cities",
    trades: "Other trades in {city}",
  },
  locked: {
    button: "Open with Pro",
    lines: {
      "running-costs": "What it costs to keep the doors open.",
      peers: "How the UK compares with countries like it.",
      "age-mix": "Who lives here, by age.",
      cities: "The UK’s cities, side by side.",
      locals: "Things worth knowing before you open here.",
      spend: "What households here spend their money on.",
      /* The country page's slots that lock (plan 2026-10-13 country-page-journey, Task 5): spend, running-costs and peers hold their lines above. */
      /* Keyed apart from the city page's "trades" line below (src/lib/spine/slots/locks.ts, lockLineKey). */
      "london-trades": "What London’s trades take in a year.",
      margins: "What share of each sale the trades keep.",
      credit: "What borrowing costs, and how customers pay you.",
      filings: "What you must file, and when it is due.",
      exit: "What failing costs you, and how long it takes.",
      changes: "What changed in the rules, and what is coming.",
      "character-people": "How people here like to do business.",
      gates: "The permits this city asks for before you open.",
      market: "Who already trades here, and how crowded it is.",
      living: "What it costs your staff to live here.",
      runway: "How rent here compares with what people earn.",
      earnings: "What your customers here earn.",
      demand: "What residents here spend in a year.",
      crew: "What staff cost in this city.",
      texture: "What doing business here is like, day to day.",
      calendar: "When this city spends, month by month.",
      season: "When residents and visitors spend through the year.",
      neighbourhoods: "The city’s neighbourhoods, one by one.",
      split: "Where your sales money goes, cost by cost.",
      team: "What staff cost in this trade.",
      stock: "The kit you need to open.",
      thresholds: "The tax and pay lines you cross as you grow.",
      mix: "Where this trade’s sales come from.",
      rivals: "Other trades you could open instead.",
      apps: "The apps shops here use to sell and get paid.",
      "spend-income": "What households spend on this, by income.",
      customers: "What one customer spends with you.",
      worth: "What a business like this sells for.",
      "market-hold": "How much of the market the biggest chains hold.",
      "trade-peers": "How this trade does here against other places.",
      districts: "What rent costs in each part of the city.",
      trades: "Trades with figures for this city.",
    },
  },
  /** THE COST SIMULATOR, /calculator (plan 2026-10-13 cost-simulator; spec docs/superpowers/specs/2026-10-13-cost-simulator-design.md,
   *  section 4; R7 4.6's headings). The masthead, the answer, the levers, the month, what moves it most, the money to open it, where figures come
   *  from; each default's line (R7 4.1 and 4.3: "London holds none. This is the UK's."), each empty figure's reason, the sources' notes. Headings
   *  of four words, lines of twelve, labels of three; tests/simulator/display.test.ts reads every string. */
  calculator: {
    title: "What your business costs",
    metaTitle: "What your business costs | Margin Atlas",
    metaDescription: "The sales your business needs to break even, with every cost shown.",
    yoursTail: ", with your figures",
    pick: { label: "Place and trade", country: "Country", city: "City", trade: "Trade", anywhere: "Anywhere in {country}", failed: "That place did not load. Try again." },
    answer: { title: "Sales to break even", month: "Each month must take this much to cover every cost.", day: "A day", customers: "Customers a day", customersNote: "Every day of the year", firms: "Firms above it", firmsNote: "Registered firms in the place", firmsNoteCell: "Local firms of the trade", goal: "For your goal", goalNote: "A month, after tax", goalNoteWorld: "A month, before tax", basis: "Fixed costs over what each sale keeps.", basisYours: "Fixed costs over what each sale keeps, with your figures." },
    margin: { title: "Your margin", words: "of each sale you keep, before tax", wordsNoTax: "of each sale you keep, before any tax", after: "After tax", placement: "Your sales top {pct} of firms here." },
    levers: {
      title: "Your numbers",
      fixed: "fixed costs a month, whatever you sell",
      groups: { team: "Team", premises: "Premises", sales: "Sales", you: "You", loan: "Loan" },
      reset: "Reset",
      yourFigure: "Your figure.",
      add: "Add one",
      remove: "Remove one",
      payYourself: "Pay yourself",
      stopPaying: "Stop paying yourself",
      setTarget: "Set a profit goal",
      dropTarget: "Drop the profit goal",
      form: "Legal form",
      sole: "Sole trader",
      company: "Company",
      staffLine: "The trade's staff line pays the usual team.",
      hireOnTop: "Hires you add stand on top of it.",
      effect: "Break-even now",
      effectTail: "a month",
      labels: { area: "Floor space", rent: "Rent per m2", service: "Service charge", oncost: "Employer charges", sales: "Sales a year", ticket: "Spend per customer", goods: "Cost of goods", runShare: "Running costs", owner: "Your pay", target: "Profit goal", loanAmount: "Loan", loanRate: "Interest rate", loanYears: "Years to repay", opening: "Money to open", pay: "Pay a year" },
      units: { m2: "m2", year: "a year", head: "a head", share: "of sales", pay: "of pay", years: "years", pct: "%" },
    },
    month: { title: "Your month", profit: "profit a month at your sales", loss: "loss a month at your sales", basis: "At sales of {sales} a year.", span: "Show the bill", monthTab: "A month", yearTab: "A year", key: { variable: "Costs per sale", fixed: "Fixed costs", profit: "Profit", loss: "Loss" }, tick: "Break-even", bar: "Your month: costs that follow sales, fixed costs and {last}." },
    bill: { goods: "Cost of goods", running: "Running costs", team: "Your team", teamNote: "{n} people with employer costs", crew: "Staff", rent: "Rent", service: "Service charge", rates: "Business rates", ratesNote: "2026-27 rates on the rent", ratesStandard: "2026-27 rates, standard multiplier", loan: "Loan repayments", owner: "Your pay" },
    moves: { title: "What moves it most", focal: "of sales cover each 100 of fixed costs", basis: "Each figure moved up a tenth, or one more hire.", top: "Largest", phoneHead: { name: "Figure moved", value: "Rise a year" }, rows: { area: "More floor space", rent: "Higher rent", service: "Higher service charge", pay: "Higher pay", goods: "Dearer goods", running: "Higher running costs", owner: "Your higher pay", loan: "A bigger loan", crew: "More staff cost" } },
    opening: { title: "Money to open it", months: "months to earn back the money to open", monthsUk: "months to earn it back, after tax", total: "In all", yours: "Your figure" },
    reasons: { needs: "Fill the empty fields above to see this.", noMargin: "Each sale costs more than it brings in.", noSales: "Type your sales to see this.", loss: "No payback while the month runs at a loss.", noTicket: "Type a spend per customer to see this.", noOpening: "No cost to open is held for this trade.", outOfReach: "Past a {threshold} rateable value, rates take a higher rule.", beyondSpread: "Past the range of firms held here.", noSpread: "No register of firms is held here.", noTarget: "Set a profit goal to see this." },
    fallback: "{city} holds none. This is {country}'s.",
    lines: {
      area: { valuation: "Average premises of the trade's kind, 2021 valuation.", perWorker: "{m2} m2 a worker in this sector, for the team.", none: "No floor space is held here. Type yours." },
      rent: { valuation: "The 2021 valuation's rent for these premises.", city: "Secondary shop rent in {city}.", country: "The country's average commercial rent.", none: "No rent is held here. Type yours." },
      service: { city: "Service charge in {city}.", valuation: "The valuation's rent holds none. Type yours if you pay one.", none: "No service charge is held here." },
      team: { roles: "The trade's usual team, at its typical counts.", sector: "The trade holds no roles. This is its sector's.", none: "No team is held for this trade.", ukLaw: "Employer NI and pension, 2026-27 law." },
      oncost: { country: "{country}'s employer charges, a share of pay.", none: "No employer charges are held here. Type yours." },
      pay: { city: "{index} times average pay in {city}.", country: "{index} times the country's median pay.", none: "No pay is held here. Type it." },
      sales: { register: "Average sales of registered firms under £5m, March 2026.", cell: "Typical yearly sales for the trade here.", none: "No sales are held here. Type yours." },
      ticket: { trade: "Spend per customer for the trade.", tier: "Spend per customer, set for a city this size.", none: "No spend per customer is held. Type yours." },
      goods: { recipe: "The trade's cost of goods, a share of each sale.", driver: "The trade's goods and supplies, a share of each sale.", margin: "What the gross margin leaves, which may include direct labour.", sector: "The sector's cost of goods. The trade holds none.", none: "No cost of goods is held. Type yours." },
      running: { recipe: "Utilities, supplies and running costs, a share of sales.", sector: "The sector's energy, marketing, software and insurance.", none: "No running costs are held. Type yours." },
      owner: { off: "None by default. You keep the profit.", city: "Typical income in {city}.", country: "The country's median pay.", none: "No income figure is held here. Type yours." },
      target: { uk: "The profit you want each year, after tax.", world: "The profit you want each year, before tax." },
      loan: { amount: "None by default. Type a loan if you take one.", uk: "The UK start-up loan rate.", country: "{country}'s bank lending rate.", noRate: "No lending rate is held here. Type yours.", years: "Type the years to repay." },
      opening: { held: "The trade's opening bill for {country}.", built: "Fit-out, deposit and registration. Kit and stock are not in it.", none: "No cost to open is held for this trade." },
      openingItems: { fitOut: "Fit-out", deposit: "Lease deposit", registration: "Registration" },
      form: "Sole trader by default. Tax follows 2026-27 law.",
    },
    sources: {
      title: "Where figures come from",
      yours: { label: "Your figures", fact: "Kept in this page's address." },
      register: { label: "Registered firms", fact: "Sales by band, March 2026." },
      valuation: { label: "Premises and rents", fact: "The valuation of April 2021." },
      law: { label: "UK law", fact: "Rates, payroll, tax, 2026-27." },
      cell: { label: "Local firms", fact: "The trade's local figures." },
      trade: { label: "The trade", fact: "Team and costs, as estimates." },
      place: { label: "The place", fact: "Rent and wages, as estimates." },
    },
  },
  /** THE COUNTRY PAGE BY THE VISITOR'S JOURNEY (plan 2026-10-13 country-page-journey; spec E:/atlas/docs/superpowers/specs/2026-10-13-
   *  country-page-journey-design.md; his direction of 2026-10-13). The chapters' titles are the spec's stage names; a slot's heading is
   *  four words at most and its line twelve at most; a plus's head is a label, its unit said there where its rows are bare numbers; the
   *  signal's five words are its accessible names and its key is the page's one line about it. Read aloud, every one. */
  journey: {
    stages: { market: "The market", open: "To open", run: "To run", last: "To last", rules: "The rules" },
    slots: {
      "tax-on-profit": { heading: "Tax on profit" },
      "where-it-stands": { heading: "Where it stands" },
      customers: { heading: "Customers, city by city", words: "typical full-time pay, a year, nationwide" },
      spend: { heading: "What households spend on" },
      trades: { heading: "What trades take", words: "typical yearly sales, the middle of London's trades" },
      /* Slot 5b, the controller's ruling on Q1 (2026-10-13): the trades' net margins, a share, where the country holds them. */
      margins: { heading: "What trades keep", words: "of sales kept as profit, the middle of the trades" },
      open: { heading: "Forms, fees and days" },
      hire: { heading: "What a hire costs" },
      "running-costs": { heading: "Running costs" },
      credit: { heading: "Credit and card fees" },
      filings: { heading: "Filing deadlines", words: "after the year end, to file the accounts" },
      peers: { heading: "Against the peers" },
      lasting: { heading: "How many last" },
      exit: { heading: "Selling or failing" },
      dealings: { heading: "How dealings go" },
      changes: { heading: "Rule changes" },
      close: { heading: "Where to next" },
    },
    more: {
      cities: "Customer pay by city",
      tenths: "Bottom and top tenth",
      trades: "More London trades",
      steps: "The steps, in days",
      stepsHow: "How each step goes",
      stepCosts: "Each step's cost",
      licenceWaits: "Licence waits, in days",
      abroad: "From abroad",
      abroadCosts: "From abroad, costs",
      abroadWaits: "From abroad, in days",
      employing: "Rules of employing",
      hiring: "How hiring goes",
      adds: "What the employer adds",
      hour: "An hour, all in",
      jobs: "The job market",
      statutory: "Statutory pay a week",
      premises: "Premises tax",
      insurance: "Insurance by law",
      lease: "The lease, by law",
      leaseTerms: "The lease, its terms",
      leaseCosts: "The lease, its costs",
      peersPower: "Peers' electricity",
      loans: "Loans and grants",
      pay: "How customers pay",
      lands: "When money lands",
      filingCosts: "Filing costs",
      back: "What holds firms back",
      byCity: "By city",
      failMost: "Trades that fail most",
      failCosts: "Costs of failing",
      failReach: "What failing reaches",
      whoTrades: "Who trades here",
    },
    /** A people file's bands of ages, headed by its place: "London by age". */
    ageOf: "{place} by age",
    /** Slot 1's thin state (spec section 3): the company tax rate under its own label, never "Not known yet". */
    thinTax: { label: "Tax on company profit", words: "the headline rate on a company's profit" },
    hiringRows: { hire: "Taking on staff", contracts: "Contracts", fire: "Letting go", depth: "People to hire" },
    hiringWords: { easy: "Easy", moderate: "Moderate", hard: "Hard", deep: "Deep", fair: "Fair", thin: "Thin" } as Record<string, string>,
    /** A step's label from a closed list, by the words its shard's name holds (src/lib/spine/slots/open.ts, stepLabel); the shard's own words stand under it as its note. */
    stepLabels: { name: "Name check", register: "Registration", tax: "Tax number", vat: "Sales tax", bank: "Bank account", licence: "Licence", social: "Social insurance", notary: "Notary", seal: "Company seal", other: "Other step" },
    signal: { key: "Up is easier for an owner, down is harder.", words: { 1: "Very good", 2: "Good", 3: "Middle", 4: "Poor", 5: "Very poor" }, /** A placed row's readout: the state's word, then its placement sentence. */ readout: "{word} for an owner." },
    buyers: { active: "with plenty of buyers", steady: "with some buyers", thin: "with few buyers" } as Record<string, string>,
    exitWords: "to sell a business here",
    views: { state: "With the state", people: "With people" },
    /** Slot 14's "Who trades here" rows from the profile (final review I1): the shares every country but the UK printed under its staff card. */
    whoRows: { labour: "Labour force, adults", informal: "Informal economy" },
    runs: { coming: "Coming", recent: "Recent" },
    /** The admin index's year, said in the board row's readout once its label carries the unit (the plan's Reading 8). */
    adminNote: "Last published in 2020.",
    /** The board's rows (slot 2), each label carrying its unit within three words (spec section 3; ROW SENTENCE). The two registering rows
     *  stand until the rhythm plan's Task 4 takes them to the registering table (fact-once). */
    /** Slot 6's own row: the days until trading (the shard's total), its unit in its label. */
    openRows: { trading: "Until trading, days" },
    /** The UK's walls from abroad behind slot 6's plus: the founder route's fees, the decision's wait, a fee that buys a stay. */
    /** A rule the changes ledger dates, on its own row (spec section 2; slots/dated.ts): the coming value and its day, or the day it began. */
    dated: { coming: "{to} from {date}", since: "since {date}" },
    /** Slot 7: the share riding the lead where it stands alone (Reading 15), the rows' labels the file's own are too long for. */
    hire: { leadShare: "a full-time year at the minimum wage, plus {share} from the employer", employer: "Employer's share", hourly: "Hourly minimum wage", hour: "One worked hour", vacancies: "Vacancies per 100", payroll: "Payroll change", over: "on pay over {amount} a year" },
    /** The rules of employing, a time each, its unit in its label (spec section 3: "units sit in the label"). */
    employ: { holiday: "Paid holiday, days", week: "Longest week, hours", dismissal: "Unfair dismissal, months", maternity: "Maternity pay, weeks", notice: "Notice, weeks", sick: "Sick pay, weeks", bankHolidays: "Bank holidays, days" },
    /** Slot 8's own row and the UK's three premises rules, their labels as the page printed them. */
    run: { diesel: "Diesel per litre" },
    premises: { relief: "Full rates relief", rates: "Business rates", retail: "Shops and cafés" },
    /** The UK's lease, split by answer type: its rules' states, its terms with their units, its costs. */
    lease: { notice: "Landlord notice, months", noticeNote: "to end a protected lease", optOut: "Opting out, days", request: "Renewal request, months", newLease: "New lease, years", short: "Short leases, months", registered: "Registered over, years", exempt: "Exempt", compensated: "Compensated" },
    /** Slot 9: the lead's words, the UK's loan rate row, the waits' labels. */
    credit: { words: "a year, the average rate on a business bank loan", loanRate: "Start-up loan rate", payouts: "Card payouts, days", terms: "Payment terms, days", agreed: "Agreed limit, days" },
    /** Slot 10: the UK's deadlines, a time each, its unit in its label. */
    filings: { taxReturn: "Tax return, months", taxPayment: "Tax payment, months", vatReturn: "VAT return, months", andDays: "plus {n} days, {note}", andDay: "plus 1 day, {note}" },
    /** Slot 12's pluses: the first row's note in each, the duel's middle trade. */
    lastRows: { cohort: "born in {cohort}, still trading in {year}", insolvent: "of companies insolvent a year", middle: "Middle trade", ofTrades: "the middle of {n} trades" },
    /** Slot 13 on the UK: its times, each unit in its label. */
    exit: { liquidation: "Liquidation, months", ban: "Director ban, years", strikeNotice: "Strike-off notice, months", noTrading: "No-trading period, months" },
    abroad: { founder: "Founder visa fees", founderNote: "For {years} years, per person", decision: "Visa decision", decisionNote: "Applying from outside the UK", forTime: "Fee and surcharge for {time}" },
    boardRows: { clean: "Clean dealing /100", admin: "Admin ease /100", salary: "Monthly salary", living: "Living cost /100" },
    /** The UK's charge on a director's loan, a tax, standing in the other taxes of slot 1. */
    directorsLoan: { label: "Director's loan charge", note: "Company pays, until repaid" },
  },
  /** THE INDUSTRY PAGE, TARGET v4 (his "Go" of 2026-10-21, FOUNDER-VERDICTS "The industry page (/industries/restaurants) v4
   *  approved"): the target's words exactly (sheets/industry/v4/src/build_industry_v4.py), in its order, for
   *  src/components/spine/industry/sourced-view.tsx. "Operating profit", never net profit: his "Call it operating profit" for the
   *  same figure (FOUNDER-VERDICTS 1919). `{x}` is a figure the builder (src/lib/spine/industry_v4.ts) reads from data/sourced/. */
  industryV4: {
    hero: {
      kicker: "A trade",
      lede: "How the trade makes money, country by country.",
      photoAlt: "An empty restaurant dining room laid with white tablecloths, daylight through tall windows",
      answerLabel: "Operating profit",
      answerUnit: "of every 100 of sales",
      basis: "The European Union's restaurants, before tax, interest and the owner's own pay",
      cells: { high: "Highest country", low: "Lowest country", all: "All businesses", next: "Bars and cafes" },
      place: "European Union, 2026.",
      how: "How the figures are calculated",
    },
    openingTitle: "How the trade fares",
    chapters: { money: "How it makes money", where: "Where it pays best", like: "What the trade is like" },
    eu: "European Union, 2026.",
    lasts: {
      title: "How many last",
      ask: "Of every 100 restaurants that open, how many are still open.",
      unit: "are still open after five years",
      caption: "Still open, of every 100 that open",
      head: { open: "Still open", trade: "Restaurants", all: "All businesses" },
      years: { y1: "After 1 year", y2: "After 2 years", y3: "After 3 years", y5: "After 5 years" },
      note: "Counted for restaurants, cafes and bars together. No five-year count is published for all businesses.",
    },
    nextDoor: {
      title: "Trades next door",
      ask: "What each of five nearby trades keeps of every 100 of sales.",
      unit: "of five trades that serve food, drink or a bed, by operating profit",
      aria: "Operating profit of every 100 of sales: {list}, all businesses {all}",
      allKey: "All businesses, {all}",
      fold: "What they do",
      names: { hotels: "Hotels", eventCatering: "Event catering", barsCafes: "Bars and cafes", restaurants: "Restaurants", canteens: "Canteens" },
      defs: {
        hotels: "let rooms with daily service, often with a restaurant inside.",
        eventCatering: "cooks and serves food for weddings, parties and meetings.",
        barsCafes: "serve drinks to drink on the spot, with little or no cooking.",
        restaurants: "cook and serve meals, to eat in or take away.",
        canteens: "run kitchens for offices, schools and hospitals under contract.",
      },
    },
    split: {
      title: "Where each 100 goes",
      ask: "Of every 100 of sales, what goes on purchases, on staff, and what is operating profit.",
      unit: "of every 100 goes on staff, nearly twice the {all} of all businesses",
      aria: "Of every 100 of sales: restaurants purchases {p}, staff {s}, operating profit {k}, all businesses {ap}, {as}, {ak}",
      rows: { trade: "Restaurants", all: "All businesses" },
      key: { purchases: "Purchases", staff: "Staff", left: "Operating profit" },
      note: "Purchases are stock, rent and bills. Operating profit is before tax, interest and the owner's own pay.",
    },
    year: {
      title: "What a year leaves",
      ask: "A typical restaurant's year in money, before the owner is paid.",
      unit: "left a year, from which come the owner's own pay, the loan, the kitchen's wear and the tax",
      rows: { sales: "Sales", bought: "Bought in", staff: "Staff", left: "Left" },
      /* Two sentences, drawn as two lines of one note (the view sets the first on its own line). */
      note: "Bought in is food, drink, rent and bills.",
      noteAll: "In the average business of any kind {all} is left.",
    },
    hour: {
      title: "An hour of work",
      ask: "What an hour of staff time costs, and what it brings in.",
      /* One sentence, drawn as two lines (the view sets the first on its own line). */
      unit: "is what a staff hour leaves,",
      unitAll: "against {all} in the average business",
      costs: "Costs",
      adds: "Adds",
      aria: "An hour of staff time costs {c} euros and adds {v} euros, so it leaves {l}",
      note: "What an hour brings in is its share of sales once food, drink, rent and bills are paid. The dark stretch is what is left for the owner, the loan, the kitchen and the tax.",
    },
    people: {
      title: "Who works in it",
      ask: "How many people work in a typical restaurant, the owner included.",
      fig: "{n} people",
      unit: "in a typical restaurant, against {all} in the average business",
      rows: { wage: "On a wage", owners: "Owner or family", jobs: "Full-time jobs" },
      note: "The ones on a wage add up to {jobs} full-time jobs: much of the work is part-time. The owner and family are paid only from what is left.",
    },
    putsBack: {
      title: "What it puts back",
      ask: "What goes back into the kitchen, the fittings and the building each year.",
      unit: "of what is left goes back into equipment, fittings and the building",
      rows: { put: "Put back a year", left: "Left a year", all: "All businesses" },
      allValue: "{n}% put back",
      note: "Set against what is left, before the owner is paid. A loan can pay for it instead, and then the loan is paid from what is left.",
    },
    smallBig: {
      title: "Small and big",
      ask: "What a restaurant sells in a year, by the people it employs.",
      unit: "a year for one under 10 people, as {n} of every 100 restaurants are",
      sizes: ["Under 10 people", "10 to 19 people", "20 to 49 people", "50 to 249 people", "250 or more"],
      note: "One with 20 to 49 people sells about {n} times as much as one under 10.",
    },
    table: {
      title: "Country by country",
      ask: "What a restaurant keeps, sells and employs, and how many last, in {n} countries.",
      country: "Country",
      heads: [["Operating profit", "of every 100"], ["Sales", "a year"], ["People", "a business"], ["Open", "after 5 years"]],
      captionFirst: "Restaurants in the 8 countries that keep the most, and the United States",
      fold: "{n} more countries",
      captionRest: "Restaurants in the other {n} countries",
      key: "The best of the European survey in each column. Sales in thousands. The United Kingdom and the United States from their own counts.",
      usNote: "The United States counts companies with staff and their employees only, and how many last together with hotels.",
      caption: "Europe and the United States, 2026.",
    },
    currency: { group: "Currency shown first" },
    months: {
      title: "Busy and quiet months",
      tag: "Estimate",
      ask: "Each month's sales against the year's average.",
      unit: "more sales in {busiest}, the busiest month, than in {quietest}, the quietest",
      aria: "Sales each month against the year's average: {list}",
      names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      letters: "JFMAMJJASOND",
      note: "Restaurants, cafes and bars together, in {n} EU countries, each weighted by its restaurants' sales.",
    },
    density: {
      title: "How crowded it is",
      ask: "Restaurants for every 10,000 people, country by country.",
      unit: "restaurants for every 10,000 people in the EU, against {n} countries",
      levels: { Low: "Low", Middle: "Middle", High: "High" },
      lowest: "{name}, the lowest",
      highest: "{name}, the highest",
      caption: "Europe, 2026.",
    },
    donut: {
      title: "Who makes the sales",
      ask: "Of every 100 of sales, the share made by each size of restaurant.",
      unit: "of sales are made by small restaurants, under 10 people",
      parts: { small: "Small, under 10", medium: "Medium, 10 to 49", large: "Large, 50 to 249", corporate: "Corporate, 250 or more" },
      aria: "Of every 100 of sales: {list}",
      note: "Medium adds two published size groups, 10 to 19 and 20 to 49.",
    },
    close: {
      title: "Where to next",
      doors: [
        /* Each city door names its place here, beside the words that name it, so a door's label and its address cannot disagree
           (the hardcoded-place gate's fault is a link that promises one place and lands on another). */
        { kind: "A city", title: "Restaurants in London", line: "What one takes in, and what it keeps.", country: "gb", city: "london" },
        { kind: "A city", title: "Restaurants in Manchester", line: "The same measures, for Manchester.", country: "gb", city: "manchester" },
        { kind: "Side by side", title: "Restaurants in seven UK cities", line: "One trade, city by city.", country: null, city: null },
      ],
      how: "How the figures are calculated",
      report: "Report a mistake",
      checked: "Checked {date}",
    },
  },
  /**
   * THE INDUSTRY PAGE v7 (FOUNDER-VERDICTS "The industry page (/industries/restaurants) v7 approved, his choice delegated"): its
   * words, as the target prints them (sheets/industry/v7/src/build_industry_v7.py, every string). v7 is v6's words with the kit
   * review's tips: one name a quantity (operating profit, never "left" or "operating surplus"; purchases, never "bought in"; all
   * businesses, never "All" or "the average business"; his sizes Small, Medium, Large, Corporate, FV 1679), the review's questions, the
   * receipt, the country table's own counts, chapter 04 "Season, crowd and size", the close's Hotels and 34 countries. v6's words are
   * gone: this is the page's one block. Drawn by src/components/spine/industry/kit3-view.tsx. A `{name}` is filled by the view from the
   * builder's figures (src/lib/spine/industry_v7.ts); no figure is typed here.
   */
  industryV7: {
    hero: {
      kicker: "A trade",
      name: "Restaurants",
      lede: "How the trade makes money, country by country.",
      photoAlt: "An empty restaurant dining room laid with white tablecloths, daylight through tall windows",
      answerLabel: "Operating profit",
      answerUnit: "of every 100 of sales",
      basis: "The European Union's restaurants, before tax, interest and the owner's own pay",
      cells: { high: "Highest country", low: "Lowest country", all: "All businesses", next: "Bars and cafes" },
      /* each cell with its unit (the review); all businesses keep the answer's own figure, said in words (one 11.7 a section) */
      unit: "of 100",
      unitPlace: "of 100, {name}",
      same: "The same",
      place: "European Union, 2026.",
      how: "How the figures are calculated",
    },
    openingTitle: "How the trade fares",
    chapters: { money: "How it makes money", ratios: "The ratios it runs on", where: "Where it pays best", like: "Season, crowd and size" },
    eu: "European Union, 2026.",
    lasts: {
      title: "How many last",
      ask: "How many are still open after five years?",
      unit: "are still open after five years",
      caption: "Still open, of every 100 that open",
      head: { open: "Still open", trade: "Restaurants", all: "All businesses" },
      label: { trade: "Restaurants", all: "All businesses" },
      years: { y1: "After 1 year", y2: "After 2 years", y3: "After 3 years", y5: "After 5 years" },
      note: "Restaurants, cafes and bars counted together. No five-year count for all businesses.",
    },
    nextDoor: {
      title: "Trades next door",
      ask: "What each of five nearby trades keeps of every 100 of sales.",
      unit: "of five trades that serve food, drink or a bed, by operating profit",
      aria: "Operating profit of every 100 of sales: {list}, all businesses {all}",
      allKey: "All businesses",
      fold: "What they do",
      names: { hotels: "Hotels", eventCatering: "Event catering", barsCafes: "Bars and cafes", restaurants: "Restaurants", canteens: "Canteens" },
      defs: {
        hotels: "let rooms with daily service, often with a restaurant inside.",
        eventCatering: "cooks and serves food for weddings, parties and meetings.",
        barsCafes: "serve drinks to drink on the spot, with little or no cooking.",
        restaurants: "cook and serve meals, to eat in or take away.",
        canteens: "run kitchens for offices, schools and hospitals under contract.",
      },
    },
    split: {
      title: "Where each 100 goes",
      ask: "Where does each 100 of sales go?",
      unit: "of every 100 goes on staff, nearly twice the {all} of all businesses",
      aria: "Of every 100 of sales: restaurants purchases {p}, staff {s}, operating profit {k}, all businesses {ap}, {as}, {ak}",
      rows: { trade: "Restaurants", all: "All businesses" },
      said: { trade: "{k} operating profit", all: "The same" },
      key: { purchases: "Purchases", staff: "Staff", left: "Operating profit" },
      note: "Purchases are food, drink, rent and bills.",
    },
    year: {
      title: "What a year leaves",
      ask: "A typical restaurant's year in money, before the owner is paid.",
      unit: "operating profit a year, before the owner's pay, the loan, wear and tax",
      /* a receipt (the review): sales, less purchases, less staff, a sum line, operating profit */
      rows: { sales: "Sales", purchases: "Purchases", staff: "Staff", profit: "Operating profit" },
      minus: "−",
      note: "In all businesses, {all} operating profit a year.",
    },
    hour: {
      title: "An hour of work",
      ask: "What an hour of staff time costs, and what it brings in.",
      unit: "operating profit a staff hour, against {all} in all businesses",
      costs: "Costs",
      adds: "Adds",
      aria: "An hour of staff time costs {c} euros and adds {v} euros: {l} euros of operating profit",
      note: "Adds is sales after purchases. The coloured stretch is operating profit.",
    },
    people: {
      title: "Who works in it",
      ask: "How many people work in a typical restaurant, the owner included.",
      fig: "{n} people",
      unit: "in a typical restaurant, against {all} across all businesses",
      rows: { wage: "On a wage", owners: "Owner or family", jobs: "Full-time jobs" },
      note: "Much of the work is part-time. Owners are paid from operating profit.",
    },
    putsBack: {
      title: "What it puts back",
      ask: "What goes back into the kitchen, the fittings and the building each year.",
      unit: "of operating profit goes back into equipment, fittings and the building",
      rows: { put: "Put back a year", profit: "Operating profit a year", all: "All businesses" },
      allValue: "{n}% put back",
      note: "A loan can pay instead, then operating profit repays the loan.",
    },
    salesBySize: {
      title: "Sales by size",
      ask: "What a restaurant sells in a year, by the people it employs.",
      unit: "a year for a small one, as {n} of every 100 restaurants are",
      /* his sizes (FV 1679): "1 to 9 small businesses, 10 to 49 medium, 50 to 249 large, 250 or more corporate" */
      sizes: { small: "Small, under 10", medium: "Medium, 10 to 49", large: "Large, 50 to 249", corporate: "Corporate, 250 or more" },
      note: "A medium one sells about {n} times as much as a small one.",
    },
    ratios: {
      official: {
        title: "The official ratios",
        ask: "What restaurants run on, beside all businesses and the countries.",
        head: { ratio: "Ratio", trade: "Restaurants", all: "All businesses", range: "Lowest to highest" },
        label: { trade: "Restaurants", all: "All businesses", range: "Lowest to highest" },
        captionFirst: "The first eight official ratios of restaurants",
        fold: "{n} more ratios",
        hour: { title: "An hour of staff time", caption: "Four official ratios of an hour of staff time" },
        trade: { title: "The business and the trade", caption: "Five official ratios of the business and the trade" },
        swingNote: "The EU's season swing is an estimate.",
        note: "No five-year survival is published for all businesses.",
      },
      say: {
        title: "What they say",
        ask: "The ratios in plain words, against all businesses.",
        lines: [
          "Restaurants keep {operating-margin} of sales as operating profit, as all businesses do.",
          "Purchases take less, {bought-in-ratio} against {bought-in-ratio:all}, and the difference goes on people.",
          "Staff take {staff-cost-ratio} of every sale, against {staff-cost-ratio:all} in all businesses.",
          "Of what the kitchen and the floor add, {wage-share} goes on wages, against {wage-share:all}.",
          "A staff hour sells {sales-per-staff-hour} here, {third} of what it sells in all businesses.",
          "Staff work {full-time-share} of full-time hours, against {full-time-share:all}: much of the work is part-time.",
          "{reinvestment-ratio} of operating profit goes back into the place, against {reinvestment-ratio:all}.",
          "Five years on, {five-year-survival} of restaurants are still open.",
        ],
        third: { under: "under a third", about: "about a third" },
        kinds: [
          { term: "Official", rest: "ratios come from surveys of every business in the trade, beside all businesses and the countries." },
          { term: "The owner's", rest: "ratios below carry no number: only the formula and what moves it." },
          { term: "Rules of thumb", rest: "never appear here." },
        ],
      },
      openAll: "Open all",
      closeAll: "Close all",
      anyCountry: "Any country, 2026.",
      money: {
        title: "Money in and out",
        ask: "The owner's ratios of costs and money: each formula, and what moves it.",
        items: [
          { name: "Food cost", formula: "food bought ÷ food sold", answer: "How much of a plate's price goes on what is on it. It moves with portion sizes, waste and spoilage, what suppliers charge and the menu's prices." },
          { name: "Drink cost", formula: "drink bought ÷ drink sold", answer: "How much of a drink's price goes on the drink. It moves with pour sizes, drinks given away or spilt, bottles against draught and house wine, and the prices." },
          { name: "Prime cost", formula: "(food and drink bought + staff cost) ÷ sales", answer: "The two bills an owner can change week by week. It moves with the rota against the covers, waste and which dishes sell. The official purchases ratio also holds rent, so it is a different number." },
          { name: "Rent ratio", formula: "rent ÷ sales", answer: "How much of every sale goes to the landlord. The rent stays the same every month, so the ratio moves with sales: low in the busy months, high in the quiet ones." },
          { name: "Break-even sales", formula: "fixed costs ÷ (1 − variable costs ÷ sales)", answer: "The sales a month needs before there is any operating profit. Rent and salaried staff stay fixed. Food, drink and hourly staff move with sales. Prices change what each sale leaves." },
          { name: "Payback", formula: "cost to open ÷ operating profit a year", answer: "The years until the money put in comes back. It moves with what the fit-out cost, the operating profit each year, and the owner's own pay taken out first." },
        ],
      },
      guests: {
        title: "Guests and seats",
        ask: "The owner's ratios of guests and seats: each formula, and what moves it.",
        items: [
          { name: "Average spend", formula: "sales ÷ covers", answer: "What one guest pays. A cover is one person served. It moves with menu prices, the starters, desserts and drinks added, and set menus and offers." },
          { name: "Seat turnover", formula: "covers ÷ seats, one service", answer: "How many times a seat is used in one lunch or one dinner. It moves with how fast the kitchen and the floor work, booking slots and how the tables are laid out." },
          { name: "Sales per seat hour", formula: "sales ÷ (seats × hours open)", answer: "Whether the seats earn, hour by hour. The trade calls it RevPASH. It moves with opening hours, quiet afternoons, and spend and turnover together." },
          { name: "Margin per cover", formula: "average spend − food and drink cost per cover", answer: "What each guest leaves to pay the staff, the rent and the owner. It moves with prices, food and drink cost, and what guests order." },
          { name: "Staff hours per cover", formula: "hours worked ÷ covers", answer: "How much work each guest takes, the owner's side of the official sales per staff hour. It moves with the rota, kitchen preparation, and quiet shifts kept fully staffed." },
          { name: "Menu mix", formula: "each dish: how often it sells × what it leaves", answer: "Which dishes carry the business, and which only take space. It moves with how the menu is laid out, each dish's price, and dropping dishes that neither sell nor earn." },
        ],
      },
    },
    table: {
      title: "Country by country",
      ask: "What a restaurant keeps, sells and employs, and how many last, in {n} countries.",
      country: "Country",
      heads: [["Operating profit", "of every 100"], ["Sales", "a year"], ["People", "a business"], ["Open", "after 5 years"]],
      captionFirst: "Restaurants in the {n} European countries that keep the most, then the United Kingdom and the United States",
      own: "From their own counts",
      fold: "{n} more countries",
      captionRest: "Restaurants in the other {n} European countries",
      key: "The best in each column. Sales in thousands, compared within the European survey.",
      usNote: "The United States counts companies with staff, and how many last with hotels.",
      caption: "Europe and the United States, 2026.",
    },
    currency: { group: "Currency shown first" },
    months: {
      title: "Busy and quiet months",
      tag: "Estimate",
      ask: "When does the money come in?",
      unit: "more sales in {busiest}, the busiest month, than in {quietest}, the quietest",
      aria: "Sales each month against the year's average, 100: {list}",
      average: "Average",
      names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      letters: "JFMAMJJASOND",
      note: "Restaurants, cafes and bars together, in {n} EU countries, weighted by sales.",
    },
    density: {
      title: "How crowded it is",
      ask: "Restaurants for every 10,000 people.",
      unit: "restaurants for every 10,000 people in the EU, {level} among {n} countries",
      levels: { Low: "low", Middle: "middle", High: "high" },
      lowest: "{name}, the lowest",
      highest: "{name}, the highest",
      caption: "Europe, 2026.",
    },
    donut: {
      title: "Who makes the sales",
      ask: "Do the small ones sell the most?",
      unit: "of sales are made by small restaurants, under 10 people",
      /* his sizes (FV 1679), each name over its range */
      parts: { small: "Small", medium: "Medium", large: "Large", corporate: "Corporate" },
      ranges: { small: "under 10", medium: "10 to 49", large: "50 to 249", corporate: "250 or more" },
      aria: "Of every 100 of sales: {list}",
      note: "Medium adds two published groups, 10 to 19 and 20 to 49.",
    },
    close: {
      title: "Where to next",
      doors: [
        /* The city door names its place here, beside the words that name it (the hardcoded-place gate), as v4's do. Hotels goes to the
           site's own hotels trade page (/industries/* in src/lib/routing/route_shapes.ts, the slug hotels-lodging); the countries side by
           side to the compare tool (the site holds no page of one trade in every country), as v6's third door; its count is the table's. */
        { kind: "A city", title: "Restaurants in London", line: "What one takes in, and what it keeps.", country: "gb", city: "london", href: null },
        { kind: "A trade", title: "Hotels", line: "The nearby trade that keeps the most.", country: null, city: null, href: "/industries/hotels-lodging" },
        { kind: "Side by side", title: "Restaurants in {n} countries", line: "One trade, country by country.", country: null, city: null, href: "/compare" },
      ],
      how: "How the figures are calculated",
      report: "Report a mistake",
      checked: "Checked {date}",
    },
  },
  /** Words that must never appear in an archetype's copy: the corporate register.
   *  "world's highest" joined 2026-09-08 (task 9), after his ruling that the
   *  pay bars' edge must never name the country and figure that hold it: a
   *  machine guard against the phrase returning in any future card's text, not
   *  just the one label it was found in. */
  banned: ["leverage", "utilise", "utilize", "synerg", "stakeholder", "ecosystem", "framework", "robust", "holistic", "streamline", "empower", "solution", "optimis", "optimiz", "against the", "a square metre a year", "world's highest"],
} as const;
