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
    kicker: "Net profit margin",
    basis: "Of every $100 a typical shop sells here, what it keeps after all costs and tax.",
    worldBest: "world's best",
    withheldOne: "1 trade withheld: the model returns a loss or a floor for a typical shop.",
    withheldMany: "{n} trades withheld: the model returns a loss or a floor for a typical shop.",
    phoneHead: { trade: "Trade", value: "Net margin" },
  },
  /** The tiers table (registering, by legal form). The explainers are definitional, true in every country (rule 21). */
  tiers: {
    kicker: "Registering, by legal form",
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
        bribery: { name: "Clean dealing", left: "Bribes expected", right: "By the book" },
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
  locals: { kicker: "What locals know" },
  /** The terminus (where to next): doors that leave the page. Run 4 of the architecture loop refused "with Pro" while Pro cannot be bought and "the deepest city" as jargon; the city door says a figure the list holds. */
  close: {
    kicker: "Where to next",
    cityDoor: "Start in {city}",
    cityDoorMany: "Start in {city}, the largest of {n} cities here",
    tradesDoor: "See every trade measured here",
    proDoor: "Get notified when Pro opens",
  },
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
  /** The city masthead through the answer card. */
  cityHero: { subtitle: "Opening a business in {country}", allCities: "All cities" },
  /** The city's quick reads (city:quick-reads, run 16): the kicker and the foot's words; the reads' own words are composed by the adapter that ranks them. */
  cityReads: { kicker: "Quick reads", daysOne: "day of paperwork to register a business", daysMany: "days of paperwork to register a business" },
  /** The city's terminus (city:close, run 19): the doors out of a city page; the kicker is the close's. */
  cityClose: { districtDoor: "Start in {district}", districtsDoor: "Every district of {city}", countryDoor: "Open a business in {country}", compareDoor: "Compare {city} with other cities" },
  /** The city's premises strip (city:premises, run 13): the country's three averages by city size, the city's own size class in the accent, the basis line saying so. */
  cityPremises: {
    basis: "Rent for a square metre of shop a year, the average across {country} by city size; {city} counts among the {tier}.",
    basisNoTier: "Rent for a square metre of shop a year, the average across {country} by city size.",
  },
  /** The city's customers strip (city:earnings, run 11): the city's own spread where held, the country's typical pay where not, the basis line saying which. */
  cityCustomers: {
    kicker: "What customers earn here",
    basis: "Pay a year across the city, before tax.",
    modelled: "the spread is modelled on the city's average pay, not measured",
    spreadWord: "is how the money is spread here",
    countryBasis: "Full-time pay a year across {country}; {city} not researched on its own yet.",
  },
  /** The card pager (the cities). */
  cities: { kicker: "The cities", allLabel: "Every covered city", prev: "Previous cities", next: "More cities" },
  /** The comparison table (the peers); the founder praised its desktop form unprompted on 2026-08-30. */
  peers: {
    kicker: "Against the peers",
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
   *  CAVEAT TRIMMED AGAIN 2026-09-10 (M3, design/references/founder-2026-09-10.md): the table now
   *  marks the winning cell in every column with a tick (CompareTable.tsx), so the direction
   *  sentence ("lower is cheaper", "higher is better on both") is no longer the only way a reader
   *  can tell which value won, and is gone, along with the peer-matching sentence that went with
   *  it under the same rule: what a tick cannot say is only what the figures are and over what
   *  period, so that is all that is left. */
  cityPeers: {
    kicker: "Peer cities, side by side",
    cols: { city: "City", cheaper: "Cheaper to live", income: "Customer income", visitors: "Visitors" },
    /** THE BARE WORD IS GONE (his words, 2026-09-07): "for the table, you say
     *  cheaper to live, customer income, visitors, and then you just say you
     *  mention the word same. That's a major mistake." `same` printed for any
     *  peer that tied the home row on a signed-difference column; the column
     *  is now the absolute figure itself (peer_rows.ts), so every row reads a
     *  real number and the home row needs no special case at all. */
    caveat: "Cost of living against a leading metro; income and visitors a year.",
  },
  /** THE CITY'S VERDICT CARD (city:verdict, run 23, rebased task 13 2026-09-10).
   *  It printed the same figures as the district card below it, so it moves with
   *  them: the two ends of the ranking are one answer, "the dearest district
   *  costs this many times the cheapest", and the two cells are the things that
   *  answer cannot carry, the middle of the ranking and how many districts stand
   *  behind the claim. WHAT WENT WITH THE OLD BASIS: the answer "the lightest
   *  rent load, x1.20", which under a basis where the lightest IS the reference
   *  would read x1.00 and say nothing; and the "City average / 1 / the baseline"
   *  cell, his exact complaint ("then you say the city average times one which is
   *  the baseline"), a cell whose value was 1 for every city on earth by
   *  definition. */
  cityVerdict: {
    kicker: "The rent, district by district",
    answerLabel: "The rent gap",
    /* THE SUBJECT IS SAID, NOT ASSUMED (2026-09-10, his "the language ... should
       be quite natural language for this kind of pages"). This line read
       "{dearest} against {cheapest}", two place names either side of a
       comparator and nothing saying WHAT was set against what: a reader met
       "West End against South London" under a figure and had to guess it meant
       rent. One word fixes it, and it is the word the card is about. */
    basis: "{dearest} rent, against {cheapest}",
    /* TWO WORDS EACH, AND NEAR THE SAME LENGTH ON PURPOSE. The cell label
       reserves 2.6em below the wide layout and then grows, so a label that
       wraps to three lines while its neighbour wraps to two pushes one figure
       5px below the other, which the archetype harness reports as UNEQUAL
       (his ruling 7: equivalent elements are the same height, no matter
       what). "The middle district" did exactly that at 375. */
    cells: { middle: "Middle district", ranked: "Districts ranked" },
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
    kicker: "By district",
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
    pay: "What moves this figure",
    customers: `${CUSTOMERS_KICKER}, by tenth`,
  },
  /** THE BENTO BAND'S TWO CELL TYPES (2026-09-10, his A2 and B4). Every string
   *  here was read aloud before it shipped, which is the only check that would
   *  have caught "Times the cheapest". A kicker names the thing; a label says
   *  what the figure is in the words a person would use; a basis says what is
   *  measured and never what it means. */
  bento: {
    /** The cost to register, from the country's own formation file. The cell
     *  carries no label under its figure: the opener already says what the
     *  figure is, and saying it twice costs a line the composition needs. */
    registerCost: {
      kicker: "What it costs to register",
      basis: "Government fees for a private limited company.",
    },
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
      basis: "The typical earner, a year, before tax.",
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
  /** Words that must never appear in an archetype's copy: the corporate register.
   *  "world's highest" joined 2026-09-08 (task 9), after his ruling that the
   *  pay bars' edge must never name the country and figure that hold it: a
   *  machine guard against the phrase returning in any future card's text, not
   *  just the one label it was found in. */
  banned: ["leverage", "utilise", "utilize", "synerg", "stakeholder", "ecosystem", "framework", "robust", "holistic", "streamline", "empower", "solution", "optimis", "optimiz", "against the", "a square metre a year", "world's highest"],
} as const;
