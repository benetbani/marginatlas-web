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
    kicker: "Power and living costs",
    cells: { electricity: "Electricity per kilowatt hour", living: "Cost of living" },
    /** The basis clauses, joined with "; " where both cells print, each alone otherwise. */
    basisElectricity: "the commercial rate, 2024",
    basisLiving: "living costs with rent, where New York is 100",
    footElectricityModelled: "The electricity rate is modelled for this country.",
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
    costs: "What it costs to open, and to run",
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
    /** One unit clause per printed cell, joined with "; " (both print on every city today: "GDP across the metro area in a year; living costs with rent, where New York is 100."). */
    units: { gdp: "GDP across the metro area in a year", living: "living costs with rent, where New York is 100" },
    /** The foot is composed: the modelled clauses that apply (the GDP on every city; the cost of living on the 239 hand-anchored rows, not on the 13 read city-level), joined with " and ", then the placement sentence, whose pronoun follows the count of cells ("each" over two, "it" over one). On the exemplar: "The metro GDP is approximate and the cost of living is anchored by hand; where each sits among the cities is not shown yet." The word "index" never prints: BANNED CONSTRUCTION names it as machinery. */
    footGdp: "the metro GDP is approximate",
    footLiving: "the cost of living is anchored by hand",
    footPlacement: "where each sits among the cities is not shown yet.",
    footPlacementOne: "where it sits among the cities is not shown yet.",
  },
  /** The city's terminus (city:close, run 19): the doors out of a city page; the kicker is the close's. */
  cityClose: { districtDoor: "Start in {district}", districtsDoor: "Every district of {city}", countryDoor: "Open a business in {country}", compareDoor: "Compare {city} with other cities" },
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
    /** The season card (item 27): the split is a slope over arrivals for every city, and now says so. */
    seasonKicker: "How seasonal it is",
    seasonBasis: "The visitor share is modelled from a year's arrivals and the resident count, not counted at the till.",
  },
  /** The card pager (the cities). */
  cities: { kicker: "The cities", allLabel: "Every covered city", prev: "Previous cities", next: "More cities" },
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
    caveat: "Cost of living against a leading metro; typical pay and visitors a year.",
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
    kicker: "Rent by district",
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
    kicker: "Trades with local figures",
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
  /** Words that must never appear in an archetype's copy: the corporate register.
   *  "world's highest" joined 2026-09-08 (task 9), after his ruling that the
   *  pay bars' edge must never name the country and figure that hold it: a
   *  machine guard against the phrase returning in any future card's text, not
   *  just the one label it was found in. */
  banned: ["leverage", "utilise", "utilize", "synerg", "stakeholder", "ecosystem", "framework", "robust", "holistic", "streamline", "empower", "solution", "optimis", "optimiz", "against the", "a square metre a year", "world's highest"],
} as const;
