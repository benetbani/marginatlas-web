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
    kicker: "What customers earn",
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
  /** The pay bars (what staff cost), founder rulings 13 and 14 of 2026-09-04: the words "minimum salary" and "average salary", the edge at the world's highest, a pair under ten percent apart withheld. */
  pay: {
    kicker: "What staff cost",
    minimum: "Minimum salary",
    average: "Average salary",
    edge: "World's highest: {name}, {figure}",
    withheld: "The pay figures on file for this country disagree: the average is not ten percent above the minimum. Withheld until they do.",
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
  /** Words that must never appear in an archetype's copy: the corporate register. */
  banned: ["leverage", "utilise", "utilize", "synerg", "stakeholder", "ecosystem", "framework", "robust", "holistic", "streamline", "empower", "solution", "optimis", "optimiz", "against the", "a square metre a year"],
} as const;
