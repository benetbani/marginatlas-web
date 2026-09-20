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
const MARGIN_KICKER = "Net profit margin";
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
    /** The state word when no small-business regime row is held (catalogue I9). */
    absent: "Not measured yet",
    absentNote: "no small-business regime is on file for this country",
  },
  subtitle: {
    pays: "what a small business effectively pays the state",
    register: "what it costs to register one",
  },
  cells: {
    payroll: { label: "Payroll on wages", note: "charged on wages, on top of the rate on profit" },
    salesTax: { label: "Sales tax", note: "carried by the customer" },
    /** Founder verbatim, ruling 1 of 2026-09-04: the cells are the LLC's. */
    llcGroup: "To register an LLC",
    llcTime: { label: "Time", note: "until registered" },
    llcCost: { label: "Cost", note: "government fees only" },
  },
  /** A zero fee is the word, never $0 (blueprint rule). */
  free: "Free",
  /** The net-margin card (founder ruling 6, 2026-09-04: "net profit margin in %, vertical bars"). */
  margin: {
    kicker: MARGIN_KICKER,
    basis: "Of every $100 a typical shop sells here, what it keeps after all costs and tax.",
    worldBest: "world's best",
    withheldOne: "1 trade withheld: the model returns a loss or a floor for a typical shop.",
    withheldMany: "{n} trades withheld: the model returns a loss or a floor for a typical shop.",
    phoneHead: { trade: "Trade", value: "Net margin" },
  },
  /** The tiers table (registering, by legal form). The explainers are definitional, true in every country (rule 21). */
  tiers: {
    kicker: TIERS_KICKER,
    heads: { fee: "Fee", time: "Time", paperwork: "Paperwork" },
    legend: "Dots are the paperwork: one is an online form, five is a notary and a lawyer.",
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
    noSpread: "bottom and top tenth not researched yet for this country",
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
      foot: "of firms are foreign-owned",
    },
    people: {
      kicker: "Dealing with people",
      rows: {
        open: { name: "Openness", left: "Keep to themselves", right: "Quick to include you" },
        innovation: { name: "Innovation", left: "The old way rules", right: "New ideas land" },
        direct: { name: "Directness", left: "Read between the lines", right: "Said to your face" },
        punctual: { name: "Timekeeping", left: "Schedules drift", right: "Clocks are kept" },
        straight: { name: "Straight dealing", left: "Corners get cut", right: "A word is kept" },
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
      basisOwn: "All five reads are {city}'s own, modelled.",
      basisMixed: "{traits} {verb} {city}'s own; the rest are the country's, modelled.",
      basisCountry: "The country's reads, modelled; {city}'s own are not gathered yet.",
    },
  },
  /** The note list (what locals know): authored notes, the page's one editorial section. */
  locals: { kicker: LOCALS_KICKER },
  /** THE DRAWN BLOCKED SEATS on the country page (MODEL.md 8.2; plan step 31,
   *  2026-09-17 and 2026-09-18). Each is an opener, ONE stated line under
   *  fifteen words in the site's idiom ("Not gathered yet: ..."), and a foot
   *  naming the requirement it waits on in
   *  E:/atlas/design/loop/build/DATA-REQUIREMENTS.md. The lines are 8.2's own,
   *  verbatim, read aloud.
   *
   *  TWO SEATS STAND ON EVERY COUNTRY (`07 workforce` and `11 easiest`, the
   *  first dispatch): fourteen words on 07 (at the cap), thirteen on 11. The
   *  kicker on 11 is the shipped one; "easiest to start" is his ban.
   *
   *  FOUR SEATS STAND ON THE THIN COUNTRIES ONLY, where the drawn card's own
   *  floor leaves the block unbuilt (8.2's "THE THIN COUNTRY, SEATED", the
   *  seventh dispatch): `03 setup` on the 43 with no legal form on file
   *  (thirteen words, item 10), `09 peers` where the peer table does not
   *  resolve (thirteen words, item 57), `12 money` where the engine holds
   *  under two credible margins (thirteen words, item 8) and `16 locals`
   *  where no notes are authored (nine words, item 6). Their kickers are the
   *  drawn cards' own, referenced and never retyped, so the block reads under
   *  one name whether it is drawn or seated. */
  blocked: {
    workforce: {
      kicker: "Who you can hire",
      line: "Not gathered yet: how many are looking for work, and paid leave a year.",
      foot: "Waits on DATA-REQUIREMENTS items 40 and 17.",
    },
    easiest: {
      kicker: "Easiest to break in",
      line: "Not gathered yet: the payback, in years, for each of the six trades.",
      foot: "Waits on DATA-REQUIREMENTS item 8's addendum.",
    },
    setup: {
      kicker: TIERS_KICKER,
      line: "Not gathered yet: the legal forms here and what each costs to register.",
      foot: "Waits on DATA-REQUIREMENTS item 10.",
    },
    peers: {
      kicker: PEERS_KICKER,
      line: "Not gathered yet: the four countries most like this one, side by side.",
      foot: "Waits on DATA-REQUIREMENTS item 57.",
    },
    money: {
      kicker: MARGIN_KICKER,
      line: "Not gathered yet: what a shop in the six everyday trades keeps here.",
      foot: "Waits on DATA-REQUIREMENTS item 8.",
    },
    locals: {
      kicker: LOCALS_KICKER,
      line: "Not gathered yet: what locals know about opening here.",
      foot: "Waits on DATA-REQUIREMENTS item 6.",
    },
    /** THE CITIES SEAT, `10 cities` on the 90 countries with no covered city
     *  (MODEL.md 8.2's FLOOR bracket; plan step 49, decided 2026-09-19 by the
     *  controller, option A, reversible by his word). The line is COMPOSED by
     *  src/lib/spine/country_cities_seat.ts: `{cities}` takes the three
     *  largest covered cities of the country's own region, said the way a
     *  person says them ("Delhi, Dhaka and Mumbai"; "Lagos and Luanda" where
     *  the region holds two; "Cairo" where one), so the template stands at
     *  eight words and the longest composed line at fourteen, the cap
     *  (Latin America & Caribbean: "São Paulo, Mexico City and Buenos
     *  Aires"). The region is said as "Nearby", not by its name: its name
     *  runs to five words and no line naming both it and three cities fits
     *  the cap on any region but South Asia (the builder says so). `lineNone`
     *  is the line where the region holds no covered city, reachable by no
     *  live country today (every region holds twelve or more); it is drawn on
     *  the sheet from a cut of the list. No door: a seat carries none, and
     *  the names are text. The item is 82, appended for this seat: one covered
     *  city per country in data/cities/city_list_v1.json. */
    cities: {
      kicker: CITIES_KICKER,
      line: "Not gathered yet: any city here. Nearby: {cities}.",
      lineNone: "Not gathered yet: any city here, or nearby.",
      foot: "Waits on DATA-REQUIREMENTS item 82.",
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
      line: "Not gathered yet: what closes one of these.",
      foot: "Waits on DATA-REQUIREMENTS item 53.",
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
      line: "Not gathered yet: the neighbourhoods of {city} by name.",
      foot: "Waits on DATA-REQUIREMENTS item 30.",
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
      kicker: "What lifts revenue most",
      line: "Not gathered yet: what lifts revenue most in each district.",
      foot: "Waits on DATA-REQUIREMENTS item 70.",
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
      line: "Not gathered yet: rent by district in {city}.",
      foot: "Waits on DATA-REQUIREMENTS item 15.",
    },
    cityTrades: {
      kicker: CITY_TRADES_KICKER,
      line: "Not gathered yet: local figures for four trades in {city}.",
      foot: "Waits on DATA-REQUIREMENTS item 69.",
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
    rows: {
      clean: CLEAN_DEALING,
      admin: "Admin ease",
      llcDays: "Days to trade",
      salaryMonth: "Average salary",
      llcCost: "Cost to register",
    },
    units: { of100: "of 100", day: "day", days: "days", aMonth: "a month", allIn: "all in" },
    levels: { high: "High", medium: "Medium", low: "Low" },
    levelBasis: "Among the countries; the cost and the days are an LLC's.",
    placeholder: "Placeholder photograph",
  },
  /** THE CITY'S HERO BOARD (city_hero_board.ts, 2026-09-20 evening): his
   *  country hero at the city altitude. Labels under three words; the units
   *  beside the figures; the level basis says the chips are among the
   *  covered cities. */
  cityHeroBoard: {
    rows: { visitors: "Visitors", permits: "City permits", density: "Per 10,000 residents", gdp: "Metro GDP", living: "Cost of living" },
    units: { aYear: "a year", per10k: "businesses" },
    levelBasis: "Among the covered cities; the cost of living runs 1 at the cheapest to 100 at the dearest.",
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
    footModelled: "{what} {verb} modelled for this country.",
    /** `{n}` of the five cells, `{reasons}` the joined reasons below. */
    withheld: "{n} of 5 withheld: {reasons}.",
    reasons: {
      salary: "the average salary is not on file",
      /** The staff-cost card's own verdict (`pay.withheld`), two cells at once. */
      payDisagree: "the average and minimum salary on file disagree",
      wealth: "net wealth per adult is not curated for this country",
      minimum: "the minimum salary on file is not the legal floor",
      time: "the registration time is not on file",
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
      payroll: "Payroll on wages is not on file for this country.",
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
    /** HIS PLUS on the bill (correction 5 of 2026-09-20): the LLC's own facts behind a click, the summary line and the four row labels, each under three words. */
    detailSummary: "What the LLC involves",
    detailRows: { form: "The form here", fee: "Government fee", filing: "Filing time", paperwork: "Paperwork" },
    /** The basis clauses, joined with "; " where both figures print, each alone otherwise. */
    basisBill: "fees and a first licence, all in",
    basisDays: "days run until the last step clears",
    foot: "Share capital, where the law asks for one, is not in the bill.",
    /** `{what}` is "the bill", "the days" or "the bill and the days"; `{verb}` is "is" or "are". */
    footModelled: "{what} {verb} modelled for this country.",
    names: { bill: "the bill", days: "the days" },
    withheld: {
      bill: "The bill is withheld: two figures on record disagree.",
      days: "The days are withheld: two figures on record disagree.",
      billNotOnFile: "The bill is not on file for this country yet.",
      /** Reachable by the guard's shape and by no country today (the days are held for 195 of 195). */
      daysNotOnFile: "The days are not on file for this country yet.",
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
    rows: { electricity: "Electricity", living: "Cost of living" },
    units: { kwh: "a kilowatt hour", of100: "of 100" },
    cells: { electricity: "Electricity per kilowatt hour", living: "Cost of living" },
    /** The basis clauses, joined with "; " where both cells print, each alone otherwise. */
    basisElectricity: "commercial rate, 2024",
    basisLiving: "living costs with rent, cheapest city 1, dearest 100",
    footElectricityModelled: "The electricity rate is modelled for this country.",
    footLevels: "Levels are among the countries.",
    /** `{n}` is the count of covered cities the figure is weighted from, spelled out to ten. */
    footLivingModelled: "The cost of living is modelled from {n} cities here, weighted by population.",
    footLivingOneCity: "The cost of living is modelled from one city here.",
    withheld: {
      /** `{n}` is the number of countries whose file row holds the fill value, counted at build. */
      electricityFill: "The electricity rate is withheld: the figure on file cannot be told from the placeholder {n} countries share.",
      livingNotOnFile: "Living costs are not on file for this country yet; no city here is covered.",
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
    average: "Average salary",
    withheld: "The pay figures on file for this country disagree: the average is not ten percent above the minimum. Withheld until they do.",
    /** THE ON-COST ON THE BAR (section 9's plan, 2026-09-20): the darker piece at the average bar's end, said under the track; `{pct}` is the employer's payroll on-cost as printed. */
    employerAdds: "The employer adds {pct} on top.",
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
    basis: "A typical split of revenue for this trade, modelled worldwide rather than measured for this place.",
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
    lead: "The legal forms on offer, what each costs and takes to register, what each one is in plain words, and what the paperwork dots mean.",
    cells: "What a business pays",
    forms: "What each form is",
    dots: "What the paperwork dots mean",
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
    subtitle: "Opening a business in {country}",
    allCities: "All cities",
    answerLabel: "Typical customer pay",
    answerBasis: "Pay, a year.",
    answerBasisModelled: "Pay, a year; modelled.",
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
    footModelled: "{what} {verb} modelled.",
    /** The cells as the foot names them, singular so the sentence reads: "The permit days and the business count are modelled." */
    footNames: { days: "the permit days", density: "the business count" },
    /** `{n}` of the four cells, `{reasons}` the joined reasons below. */
    withheld: "{n} of 4 withheld: {reasons}.",
    reasons: {
      /** Item 20: the country's arrivals divided by a size-class constant, which is not a count of this city's visitors. */
      visitorsCountry: "the visitor count on file is the country's",
      visitorsNone: "the visitor count is not on file",
      /** Every row on file is the country's figure plus a step for the city's size class; no city holds a reading of its own. */
      hdi: "human development is the country's figure",
      daysNone: "the city's permit days are not on file",
      densityNone: "the business count is not on file",
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
    kickers: { rent: "Prime shop rent", empty: "Shops standing empty", fitOut: "Fit-out cost", deposit: "Deposit up front" },
    basis: {
      rent: "A square metre of prime shop space, a year",
      /** `{rate}` is the shard's rate as read. The count draws it to a whole shop; the second line says so, and only where the rate had to be rounded. */
      empty: "{rate} in every 100 shops",
      emptyRounded: "{rate} in every 100 shops, rounded to a whole shop",
      fitOut: "To fit out a square metre of shop space",
      deposit: "Months of rent held as the deposit on a shop",
    },
    /** Joined to a basis with "; " where a printed figure's tag is not held. */
    modelled: "modelled for this city",
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
      units: { sqmYear: "a square metre, a year", aYear: "a year", years: { one: "year", many: "years" }, months: { one: "month", many: "months" } },
    },
    /** PART 5's stated line, standing where the figure would, one per cell the bank does not hold. */
    withheld: {
      rent: "The prime rent is not on file for this city yet.",
      empty: "The empty-shop rate is not on file for this city yet.",
      /** Reachable by the guard's shape and by no city today (every rate on file sits between 0.5 and 41.3). */
      emptyNotAShare: "The empty-shop rate on file is not a share of 100 shops.",
      fitOut: "The fit-out cost is not on file for this city yet.",
      deposit: "The deposit is not on file for this city yet.",
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
    basis: "Typical pay here, a year; the spread is the country's.",
    basisAlone: "Typical pay here, a year.",
    noSpread: "The country's bottom and top tenth are not researched yet.",
    outside: "The country's spread is not drawn: the typical pay here sits outside it.",
    modelled: "The typical pay is modelled, not measured.",
    countryBasis: "Full-time pay a year across {country}; {city} not researched on its own yet.",
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
    /** `{what}` is a list of the names below; `{verb}` is "is" or "are". */
    footModelled: "{what} {verb} modelled.",
    footPlaceholder: "{what} {verb} placeholders until {city} is researched.",
    /** The cells as the foot names them: "The one-bed rent, groceries, the transit pass and the coffee are modelled." */
    footNames: { rent: "the one-bed rent", groceries: "groceries", transit: "the transit pass", coffee: "the coffee" },
    /** `{n}` of the four cells, `{reasons}` the joined reasons below. */
    withheld: "{n} of 4 withheld: {reasons}.",
    reasons: {
      rent: "the one-bed rent is not on file",
      groceries: "groceries are not on file",
      transit: "the transit pass is not on file",
      coffee: "a coffee is not on file",
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
    basis: "A year of one-bed rent, against a typical income here for a year.",
    footModelled: "{what} {verb} modelled.",
    footPlaceholder: "{what} {verb} placeholders until {city} is researched.",
    /** The inputs as the foot names them: "The rent and the typical income are modelled." */
    footNames: { rent: "the rent", income: "the typical income" },
    withheld: {
      over: "The share is withheld: a year of one-bed rent here is more than a year of typical income.",
      noRent: "The share is withheld: the one-bed rent is not on file for this city.",
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
    footModelled: "The spend is modelled for this city.",
    withheld: {
      placeholder: "The spend is withheld: the figure on file for {city} is a placeholder.",
      /** Reachable by the builder's shape and by no city today (252 of 252 hold the figure). */
      notOnFile: "The spend per resident is not on file for this city yet.",
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
    footModelled: "Both shares are modelled for this city.",
    footSlope: "Both shares are modelled from a year's arrivals and the resident count.",
    withheld: {
      clamp: "The split is withheld: the modelled share for this city sits at the model's limit.",
      noCount: "The split is withheld: no visitor count is on file for this city.",
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
    foot: "{n} named areas, each a door to the neighbourhoods page.",
    /** Where every card lands on the district's own page (the cities the
     *  hub's gate admits, London today; plan step 35, 2026-09-19), the foot
     *  says that instead: the door goes to the district, not to the hub. */
    footPages: "{n} named areas, each with a page of its own.",
  },
  /** The city cards in their three looks (B11, 2026-09-10). The unit is said
   *  ONCE for the whole row, never in a card (PART 5). `plain` says what the
   *  figure is and nothing else, and it is what prints when the look draws no
   *  tint and no mark, which happens for a country holding one covered city:
   *  a sentence reading the drawing when there is no drawing is a promise the
   *  card does not keep. The three looks add the clause that reads theirs. It
   *  never says what any of it means. */
  cityCards: {
    plain: { basis: "What an average customer earns in a year." },
    /* THE FIELD LOOK STOPPED DESCRIBING A DRAWING, 2026-09-11. It read "The
       darker the card, the more", which was true while the tint's depth was the
       figure. The photograph now sits under that tint and the tint is one fixed
       wash (CityCards.tsx), so the sentence would be describing a veil. The
       figure is printed on every card instead. */
    field: { basis: "What an average customer earns in a year." },
    plate: { basis: "What an average customer earns in a year." },
    column: { basis: "What an average customer earns in a year. The taller the mark, the more." },
  },
  /** The comparison table (the peers); the founder praised its desktop form unprompted on 2026-08-30. */
  peers: {
    kicker: PEERS_KICKER,
    cols: { country: "Country", tax: "Effective tax", payroll: "Payroll on staff", llcCost: "LLC fee", llcDays: "LLC time" },
    caveat: "Peers are picked for comparable size and market, not for sharing a border. Effective tax is what a small business typically pays under each country's own small-business rules. LLC fee is the government fee only and LLC time runs until the company is registered.",
  },
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
    caveat: "Cost of living with rent, cheapest city 1, dearest 100; typical pay and visitors a year.",
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
    basis: "{district} is the cheapest of the {count} districts we cover. Rents are modelled, not read off leases.",
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
    foot: "Local figures for {n} trades. Which is easiest to open here is not yet known.",
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
    setupWithheld: "Time until the doors open is withheld: nothing on file measures the wait between registering and trading.",
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
      withheldOne: "1 city withheld: no pay figure above zero is on file.",
      withheldMany: "{n} cities withheld: no pay figure above zero is on file.",
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
      withheldOne: "1 city withheld: no visitor figure above zero is on file.",
      withheldMany: "{n} cities withheld: no visitor figure above zero is on file.",
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
      withheldOne: "1 country withheld: the model returns a loss or a floor for a typical shop.",
      withheldMany: "{n} countries withheld: the model returns a loss or a floor for a typical shop.",
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
   *  world figures (R12: every shard figure prints as modelled). */
  tradeNet: {
    notes: {
      engine: "from this city's own figures",
      shard: "typical for the trade, modelled",
      profile: "the sector's typical, modelled",
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
    absent: "Not measured yet",
    absentNote: "the take-home is not measured for this trade in this city",
    cells: {
      net: "Net margin",
      firms: "Firms trading here",
      takings: "A typical year's takings",
      takingsNote: "sales, before any cost comes out",
    },
    withheld: "Not measured yet for this trade here: how many trade, and a year's takings.",
    /** The crumb's separator, the identity row's own since the first masthead. */
    crumbJoin: " · ",
  },
  /** `01 spread`: the kicker is 8.6's title; the marks take the customers
   *  strip's three names; the modelled basis is 8.6's own sentence, said on
   *  London where the three marks are fixed multipliers of the typical; the
   *  measured basis says whose figures they are on a trusted local cell; the
   *  withheld line stands where the figure would off `moneyShown`. */
  tradeSpread: {
    kicker: "A year's takings",
    basisModelled: "A modelled spread around the typical; measured where the city holds its own.",
    basisMeasured: "A year's turnover here, the bottom tenth to the top tenth.",
    withheld: "Not measured yet: a year's takings for this trade in this city.",
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
    notGathered: "Not gathered yet: who this trade suits, and who should think twice.",
    basis: "Written for the trade anywhere, not this city. Two questions, nothing scored.",
  },
  /** `03 permits` (MODEL.md 8.6; plan step 33's second dispatch, 2026-09-18):
   *  the kicker is 8.6's title; each licence is a label over its typical days
   *  (the shard's own name, never shortened); the basis is 8.6's own sentence;
   *  the foot says the waits are modelled in words, because the sample mark is
   *  behind his switch (every shard figure is modelled, R12). A licence whose
   *  wait is on file as zero days is not a wait, so it is withheld with the
   *  line, counted (one licence on one shard today). */
  tradePermits: {
    kicker: "The permits you need",
    basis: "Typical for the trade anywhere, not measured for this city.",
    foot: "The waits are modelled.",
    withheldOne: "One licence has no wait on file and is not shown.",
    withheldMany: "{n} licences have no wait on file and are not shown.",
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
    basisHeld: "The whole bill here and its lines; months and years modelled for the trade.",
    basisHeldCapped: "The whole bill here, its five biggest lines; months and years modelled for the trade.",
    /** Where the trade holds no shard for the foot: the total's own line, the foot withheld with its own. */
    basisHeldAlone: "The whole bill to open here, and its lines.",
    basisHeldCappedAlone: "The whole bill to open here, and its five biggest lines.",
    /** Under the bars where the bill runs past the five the vertical form holds (RankedBars turns six or more into a table): the rest counted and summed, never dropped. */
    tailOne: "The smallest line, {sum}, is in the total.",
    tailMany: "The {n} smallest lines, {sum} together, are in the total.",
    basisBaseline: "All three figures are typical for the trade, modelled, not this city's own.",
    basisBaselineAlone: "Typical for the trade, modelled; not this city's own figure.",
    withheld: "Not gathered yet: what it costs to open here.",
    foot: "Months and years are typical for the trade, modelled.",
    footWithheld: "Not gathered yet: the months to break even and the years to pay back.",
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
    kicker: "Net profit margin",
    basisShard: "Of every $100 of sales. Shares typical for the trade; net as on the opening card.",
    basisProfile: "Of every $100 of sales. Shares typical for the sector; net as on the opening card.",
    /** The withheld state draws no shares, so its basis names the net alone and the foot is not printed. */
    basisWithheld: "Of every $100 of sales, the net as on the opening card.",
    withheld: "The cost lines on file and the net come to more than $100.",
    foot: "The shares are modelled.",
    detail: {
      summary: "How much of the cost is fixed",
      fixed: "Fixed costs",
      variable: "Variable costs",
      note: "of the trade's costs, modelled",
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
    basis: "Pay from the country's median; roles typical for the trade.",
    foot: "Headcounts and pay are modelled.",
    noMedian: "Pay shows a dash: the country holds no credible median pay.",
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
    cols: { place: "Place", takings: "A year's takings" },
    basis: "A typical year's takings, before any cost comes out.",
    notGathered: "Not gathered yet: the same trade in other places.",
    homeWithheld: "Takings show a dash: not measured yet for this trade in this city.",
  },
  /** `08 clears` (MODEL.md 8.6; the same dispatch): the kicker is 8.6's
   *  title; the basis says what the figure is, in a person's words, and
   *  never what it means; the foot is the shard-fed cards' one sentence with
   *  "modelled" said in words, because the sample mark is behind his switch
   *  and the share is a trade figure on both of its feeds (the engine's
   *  share is the trade's cost shares over its gross margin, the city's
   *  takings cancel out of it; the shard's is the trade's researched share). */
  tradeClears: {
    kicker: "When it clears costs",
    basis: "Of a typical day's takings, the share that clears the costs.",
    foot: "Typical for the trade anywhere, not measured for this city; modelled.",
  },
  /** `09 lasts` (MODEL.md 8.6; the same dispatch): the kicker is 8.6's
   *  title; the three cell labels are one phrase each, read aloud under the
   *  kicker ("How many last: after five years, 50%"); the basis is the
   *  composition's one sentence for every shard-fed card (its section 5,
   *  item 16: `03`, `09`, `11`, `12`); the foot says what the figures are
   *  and that they are modelled (R12). No slope, no myth sentence (R5). */
  tradeLasts: {
    kicker: "How many last",
    cells: { yr5: "After five years", yr1: "After one year", yr3: "After three years" },
    basis: "Typical for the trade anywhere, not measured for this city.",
    foot: "Of every 100 that open, the share still trading; modelled.",
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
    basis: "Typical for the trade anywhere, not measured for this city.",
    foot: "Of every $100 of sales, the share from each; modelled.",
    withheld: "The parts on file do not make a whole and are not shown.",
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
  tradeMarket: {
    kickers: { firms: "Firms per 10,000 people", chains: "Held by chains", close: "Close in a year", swing: "The year's swing" },
    basis: {
      /** The opener says the unit, so the basis says whose figure it is (the clears foot's own sentence). */
      firms: "Typical for the trade anywhere, not measured for this city; modelled.",
      chains: "Of every 100 firms; typical for the trade anywhere, not this city's; modelled.",
      close: "Of every 100 firms; typical for the trade anywhere, not this city's; modelled.",
      /** Fourteen words, at the cap: the unit clause is the composition's phrase in a person's words. */
      swing: "How much more the busiest month sells than the quietest; the trade's figure, modelled.",
    },
    withheld: {
      firms: "The number of firms is not on file for this trade yet.",
      chains: "The share held by chains is not on file for this trade yet.",
      chainsNotAShare: "The share held by chains on file is not a share of 100 firms.",
      close: "How many close in a year is not on file for this trade yet.",
      closeNotAShare: "The closures on file are not a share of 100 firms.",
      swing: "The year's swing is not on file for this trade yet.",
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
   *  never this city's. The withheld line counts the siblings on the
   *  archetype's default (R11), the country money card's idiom. The state
   *  line stands where the list would when fewer than four siblings hold a
   *  figure (8.6: "full form with the withheld line counting the members it
   *  cannot print, never a short list"), in the site's idiom (M19); `{k}`
   *  is the count in words, "none" at zero. Where no sibling resolves at
   *  all the shorter line says so. */
  tradeRivals: {
    kicker: "Other trades to open",
    head: { name: "Trade", value: "To open" },
    basis: "Typical for each trade, modelled; not this city's own figures.",
    withheldOne: "One trade withheld: no cost to open is on file.",
    withheldMany: "{n} trades withheld: no cost to open is on file.",
    state: "Not gathered yet: what it costs to open the other trades here; {k} of the four the list needs hold a figure.",
    stateNone: "Not gathered yet: the other trades measured here.",
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
  tradeWorth: {
    kicker: "What one sells for",
    marks: { low: "Low end", high: "High end" },
    basis: "What a buyer would pay, worked from a year's owner take-home.",
    note: "The two ends are the trade's typical figures, modelled; the take-home is this city's.",
    withheld: "Not measured yet: the take-home here that a sale price is worked from.",
    otherBasis: "Not worked out yet: this trade's sale figures on file rest on operating earnings, not an owner's take-home.",
  },
  /** `15 close` (the same dispatch): the trade's three doors, 8.6's and
   *  M21's own words. Across to the industry page, up to the city page (the
   *  city masthead's own idiom, "Opening a business in"), and the compare
   *  pill last. Three first words, none shared; no pricing door, no sibling
   *  door (`13` is that door on every row). */
  tradeClose: {
    industryDoor: "See {trade} in other cities",
    cityDoor: "Opening a business in {city}",
    compareDoor: "Compare {trade} across cities",
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
    answerBasisShard: "Of every $100 a customer spends, after every cost; modelled for the trade anywhere.",
    answerBasisProfile: "Of every $100 a customer spends, after every cost; the sector's typical, modelled.",
    absent: "Not gathered yet",
    absentNote: "what this trade keeps of every $100 is not on file",
    cells: {
      cost: { label: "Cost to open", note: "typical for the trade, no one place" },
      spend: { label: "Spend per visit", note: "one customer, one visit" },
      visits: { label: "Visits a year", note: "a typical customer" },
    },
    /** The not-gathered line's parts, joined by the builder in the order the cells stand. */
    notGathered: "Not gathered yet: {parts}.",
    parts: { cost: "what it costs to open", spend: "what a customer spends", visits: "how often a customer buys" },
    /** The coverage sentence over the printed companions, their names filled in the cells' order. */
    footAll: "The {names} are typical for the trade anywhere, modelled.",
    footOne: "The {names} is typical for the trade anywhere, modelled.",
    names: { cost: "cost", spend: "spend", visits: "visits" },
  },
  /** `01 lasts` at the world altitude (8.7): the same builder and card as the
   *  trade's `09 lasts` (lasts_rows.ts, R5), the basis without the city
   *  clause because there is no city here; the kicker and the foot are the
   *  trade's, one literal each. */
  industryLasts: {
    basis: "Typical for the trade anywhere.",
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
    kicker: "The trades next door",
    basis: "Kept of every $100; the highest of {n} in {sector}; modelled.",
    topLabel: "The highest",
    withheldOne: "1 trade withheld: its keep is the sector's typical, not its own.",
    withheldMany: "{n} trades withheld: their keep is the sector's typical, not their own.",
    withheldSelf: "This trade is not ranked: its keep is the sector's typical, not its own.",
    withheldSelfAmong: "{n} trades withheld, this one among them: their keep is the sector's typical.",
    underFloorAll: "Only {rows} trades are in this sector; a ranking needs four.",
    underFloor: "{rows} of {members} trades in this sector hold a figure; a ranking needs four.",
    oneRow: "One of {members} trades in this sector holds a figure; a ranking needs four.",
    noRows: "Not gathered yet: what the {members} trades in this sector keep of every $100.",
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
    kicker: "Opening the doors",
    cells: { licences: "Licences to hold", slowest: "The slowest licence", breakEven: "To break even" },
    basis: "Typical for the trade anywhere.",
    foot: "The count, the waits and the months are modelled.",
    detail: {
      summary: "The licences, by name",
      withheldOne: "One licence has no wait on file and is not listed.",
      withheldMany: "{n} licences have no wait on file and are not listed.",
    },
    withheld: {
      licences: "Not gathered yet: the licences to hold.",
      slowest: "Not gathered yet: how long the slowest licence takes.",
      breakEven: "Not gathered yet: the months to break even.",
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
    kickers: { crew: "The starting crew", payback: "Until it pays back", fixed: "Fixed costs" },
    basis: {
      crew: "The people a typical one opens with; modelled.",
      crewRounded: "The people a typical one opens with, rounded to whole people; modelled.",
      payback: "Years until the capital put in comes back; typical for the trade, modelled.",
      /** The whole is said the way the market's count cells say it ("of every 100"); the part is what stands whatever it sells. */
      fixed: "Of every $100 of costs, the part paid whatever it sells; modelled.",
      share: "Of a typical day's takings, the share that clears the costs; modelled.",
    },
    withheld: {
      crew: "Not gathered yet: who a typical one opens with.",
      payback: "Not gathered yet: the years until the capital comes back.",
      fixed: "Not gathered yet: the fixed part of the costs.",
      fixedNotAShare: "The fixed part of the costs on file is not a share of 100.",
      share: "Not gathered yet: the share of a day that clears the costs.",
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
    basis: "After-tax take-home and the share of sales kept, from each city's own figures; modelled.",
    withheldOne: "1 city withheld: its revenue is a filled-in average, or its margin a floor.",
    withheldMany: "{n} cities withheld: their revenue is a filled-in average, or their margin a floor.",
    blocked: {
      none: "Not gathered yet: this trade in the {slate} cities compared; a table needs four.",
      one: "Not gathered yet: own figures in one of {slate} cities; a table needs four.",
      some: "Not gathered yet: own figures in {n} of {slate} cities; a table needs four.",
      foot: "Waits on DATA-REQUIREMENTS item 69.",
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
    kicker: "What each format keeps",
    head: { name: "Format", value: "Net margin" },
    basisShard: "Kept of every $100 a customer spends, by format; the trade's typical, modelled.",
    basisProfile: "Kept of every $100 a customer spends, by format; the sector's typical, modelled.",
    state: "Not gathered yet: what each format keeps; {k} of four hold a figure.",
  },
  /** `08 channels` at the world altitude (8.7; the same dispatch): the same
   *  builder and card as the trade's `11 mix` (mix_rows.ts, cell/turn-two.tsx
   *  MixCard), the basis without the city clause because there is no city
   *  here, the same words the survival grid and the licence card use at
   *  this altitude; the kicker, the foot and the withheld line are the
   *  trade's, one literal each. */
  industryMix: {
    basis: "Typical for the trade anywhere.",
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
    kicker: "Before you sign",
    notGatheredLabel: "What owners know",
    notGathered: "Not gathered yet: what a working owner would tell you about this trade.",
    basis: "Written for the trade anywhere, not one place; nothing here is measured.",
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
    kicker: "Who trades alongside you",
    notes: { chains: "of all firms", swing: "busiest month over the quietest" },
    basis: "Typical for the trade anywhere.",
    foot: "The density, the chain share and the swing are modelled.",
    cellBasis: {
      firms: "Typical for the trade anywhere; modelled.",
      chains: "Of every 100 firms; typical for the trade anywhere; modelled.",
      close: "Of every 100 firms; typical for the trade anywhere; modelled.",
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
    subtitle: "Shop rent, district by district",
    labelSpread: "Rent, {dearest} against {cheapest}",
    basis: "Shop rent, modelled from each district's character, not read off leases.",
    cells: { cheapest: "{district}, cheapest", dearest: "{district}, dearest", count: "Districts ranked" },
    foot: "The city's {count} broad districts; rents modelled, not read off leases.",
    footYear: "The city's {count} broad districts; visitor counts are {year} figures.",
  },
  hoodRank: {
    clipOne: "{district}: the figure is the model's ceiling, not a reading.",
    clipMany: "{districts}: the figures are the model's bounds, not readings.",
  },
  hoodPremium: {
    kicker: "Where visitors crowd in",
    head: { name: "District", value: "Visitors per resident" },
    basis: "Visitors a year for every resident, overnight and day trips.",
    basisYear: "Visitors a year for every resident; {year} counts at district level or finer.",
    basisYearEstimate: "Visitors a year for every resident; {year} figures, some estimated from the city's size.",
    withheldOne: "{n} district withheld: no visitor figure is on file.",
    withheldMany: "{n} districts withheld: no visitor figure is on file.",
  },
  hoodCompare: {
    kicker: "Districts, side by side",
    cols: { visitors: "Visitors per resident" },
    caveat: "Rent against {cheapest}, modelled; visitors a year for every resident.",
    caveatYear: "Rent against {cheapest}, modelled; visitors a year for every resident, {year} counts.",
    dash: "A dash: no visitor figure is on file for that district.",
  },
  hoodChapters: {
    rent: "What rent costs, district by district",
    works: "What lifts revenue, and what the place is like",
  },
  hoodCharacter: {
    kicker: "What it is like",
    kickerNamed: "What {district} is like",
    rows: { sentence: "The note's first line", who: "Who is here", price: "Price tier", description: "In brief" },
    sentenceWithheld: "Not printed: the note's opening sentence runs past the card's four lines.",
    foot: "The other {n} districts' notes are on their own pages.",
  },
  /** Words that must never appear in an archetype's copy: the corporate register.
   *  "world's highest" joined 2026-09-08 (task 9), after his ruling that the
   *  pay bars' edge must never name the country and figure that hold it: a
   *  machine guard against the phrase returning in any future card's text, not
   *  just the one label it was found in. */
  banned: ["leverage", "utilise", "utilize", "synerg", "stakeholder", "ecosystem", "framework", "robust", "holistic", "streamline", "empower", "solution", "optimis", "optimiz", "against the", "a square metre a year", "world's highest"],
} as const;
