/**
 * country_spine2_types.ts , the typed contract for a spine-2 country data file.
 *
 * A country file (data/countries/<country>.json) is the hand-filled,
 * per-figure-provenanced data behind one country page. The page is the ratified,
 * frozen mockup at design/mockups/country.html: a hero plus twenty-one numbered
 * chapters, a closing "one thing to remember" band, and a trust band.
 *
 * WHY THIS PAGE TYPE WAS PARKED, AND WHAT UNPARKED IT.
 *
 * The country page sat unported for months behind one note: "no honest hero".
 * The dead end was specific and it was correct. Every candidate headline was a
 * sum of money, and a dollar figure cannot open a country page, because most of
 * the world does not price anything in dollars and a converted total says more
 * about the exchange rate on the day than about the place.
 *
 * The mockup resolves it by leading on a SHARE: "36% of profit goes to the
 * state, in tax, contributions and property rates combined". A share of profit
 * is currency-neutral. It is the same claim in Lagos, Warsaw and Osaka, it
 * survives a devaluation, and it is the one number that changes what an owner
 * takes home in every one of the 195 countries this page type has to render.
 *
 * So the hero slot in this contract is TYPED AS A SHARE, not as a free figure.
 * That is deliberate. A file cannot quietly put a currency total back in the
 * headline without changing this type, and changing this type is a decision
 * someone has to defend rather than an authoring convenience.
 *
 * THE COMPLETENESS RULE (ratified 2026-07-27). A page is always complete. Its
 * shape never varies by place. Every chapter always exists; where a figure is
 * missing the section still renders and states what it lacks. So every chapter
 * below is a REQUIRED key on CountryFile, even the ones that will be unfillable
 * for years (the six qualities, the under-served scatter, the abroad
 * comparison). A chapter with nothing behind it holds a NullFigure carrying its
 * reason, and the renderer prints the hole rather than hiding the chapter.
 *
 * The central distinction this contract exists to hold:
 *   - A country figure is about the RULES AND THE GROUND UNDER EVERYONE: what
 *     the state takes, how long a company takes to exist, what the wage floor
 *     is, what money costs. It is the same for every city and every trade.
 *   - A city figure is about one place inside it, and a trade figure is about
 *     one room. Those live in the city and cell files, never here.
 * Chapter 12 is the one place this page prints trade economics, and it prints
 * them as a comparison ACROSS trades at national scale. Each row must be read
 * from that trade's own national figures, never authored here, or the country
 * page and the trade page will drift apart. The city page has already had
 * exactly that defect and had to have it fixed.
 *
 * ONE FIGURE, ONE HOME. This mockup repeats itself more than the city one does,
 * and the repeats are the page's spine rather than an accident:
 *   36% of profit to the state   , hero headline, chapter 02, chapter 04, the
 *                                  verdict chip, and the closing band. Five.
 *   one day to register a company, hero glance, chapter 02, chapter 04,
 *                                  chapter 05, chapter 18. Five.
 *   the $24K full-time wage floor, hero glance, chapter 02, chapter 08 twice.
 *   five weeks to take money     , chapter 05 twice, chapter 18, the verdict.
 *   the five-part cost stack     , chapter 07 twice, and chapter 15's own side.
 *   86% of sales paid by card    , chapter 04 and chapter 10.
 *   9% to borrow                 , chapter 04 and chapter 17.
 *   $5.9K of property rates      , chapter 04 and chapter 18.
 * Each of those gets ONE field here, and the comment above it names every
 * chapter that renders it. Duplicated slots are how a page ends up disagreeing
 * with itself; the trade page's audit found several of exactly that kind.
 *
 * PROSE. Figures are typed; prose is not, with one exception: a sentence that
 * is irreducibly place-specific and cannot be derived from a figure on the same
 * screen is data, and is carried as a plain string (the hero's texture line, the
 * zones verdict, the myth, the judgement, the closing band). Sentences that
 * merely restate a figure printed beside them are the renderer's business and
 * have no field here.
 *
 * Constraint-safe: basis strings never name a source agency (the gate enforces
 * this); `sources` are metadata only and are never rendered.
 */

/** Provenance tier. measured = published record. built = computed from
 * published inputs, arithmetic shown. thin = nobody publishes it, so a range
 * or a grouping with a visible caveat. */
export type Tier = "measured" | "built" | "thin";

/** Metadata-only source reference. NEVER rendered to users. */
export type SourceRef = {
  name: string;
  dataset?: string;
  year: number | string;
};

/** Fields shared by every non-null figure. */
export type FigureMeta = {
  unit: string;
  tier: Tier;
  /** One-sentence build description, safe for user-facing render. */
  basis: string;
  /** Metadata only; never rendered. */
  sources?: SourceRef[];
  freshness: string;
  /** What observation would falsify or move this figure. */
  falsifier?: string;
  /** True when the figure is an output or input of the page's own model
   * rather than a public record; must carry the model tag on render. */
  fromModel?: boolean;
  /** Editorial/internal caveats; not part of the rendered figure. */
  notes?: string;
};

/** The same envelope for a figure whose payload is words rather than a measured
 * quantity, so a unit would be meaningless. Used by the myth, the zones verdict
 * and the licence matrix: they still have to say how solid they are and when
 * they were last looked at. */
export type ProseFigureMeta = Omit<FigureMeta, "unit">;

/** A single number, USD display with optional native-currency sidecar. */
export type PointFigure = FigureMeta & {
  value: number;
  /** The same value in `meta.currency.native`, where the file holds one. */
  native?: number;
};

/** A range, optionally with the point the headline takes. */
export type RangeFigure = FigureMeta & {
  lo: number;
  hi: number;
  taken?: number;
  native?: { lo: number; hi: number; taken?: number };
};

/** An ordered series (a cost split, a sparkline, a term structure). */
export type SeriesFigure = FigureMeta & {
  series: Array<{ x: number | string; value: number }>;
};

/** A claim-and-reality pair (chapter 18, the myth block). */
export type ClaimFigure = ProseFigureMeta & {
  claim: string;
  reality: string;
};

/**
 * An honest hole: no public counterpart exists, or the design states a thing
 * the data cannot. The reason is MANDATORY, because a hole must say why it is a
 * hole. A labelled proxy may ride along.
 */
export type NullFigure = {
  value: null;
  reason: string;
  proxy?: PointFigure | RangeFigure;
};

export type Figure =
  | PointFigure
  | RangeFigure
  | SeriesFigure
  | ClaimFigure
  | CountryStateTakeFigure
  | CountryQualitiesFigure
  | CountryReadingsFigure
  | CountryOpeningStepsFigure
  | CountryLicenceMatrixFigure
  | CountryCostStackFigure
  | CountryPayScaleFigure
  | CountryHouseholdSplitFigure
  | CountryCatchmentFigure
  | CountryTradeTakeHomeFigure
  | CountryNeighbourFigure
  | CountryUnderServedFigure
  | CountryAbroadFigure
  | CountryGroundFigure
  | NullFigure;

/* -------------------------------- meta ---------------------------------- */

export type CountryCurrency = {
  display: "USD";
  native: string;
  /** USD per one unit of `native`, pinned for the whole file. One rate for
   * every figure, so the parts still add to the whole after conversion. */
  usdPerNative: number;
  rateAsOf: string;
  rateBasis: string;
};

/**
 * A COUNTRY HAS THREE NAMES AND THE PAGE NEEDS ALL THREE.
 *
 * `name` is what the crumb and the title print: "United Kingdom". `shortName`
 * is what a sentence uses: "the UK". `informalName` is what a reader would
 * actually say out loud in the myth heading: "Britain". The mockup uses all
 * three within one page, and collapsing them produces either "The United
 * Kingdom versus its neighbours" in a chapter head that has to fit, or "The
 * biggest myth about the United Kingdom", which nobody says.
 *
 * `informalName` is optional and falls back to `shortName`, because most
 * countries have only two of the three.
 */
export type CountryNames = {
  slug: string;
  name: string;
  shortName: string;
  informalName?: string;
  /**
   * True where the name takes a definite article in a sentence: the United
   * Kingdom, the Netherlands, the Philippines, the United States.
   *
   * CARRIED, NOT GUESSED. The page's own title is a sentence, "Opening a
   * business in ...", and the first render of this page read "Opening a
   * business in United Kingdom", which no English speaker would write. There is
   * no rule that derives it: Ukraine dropped its article by political decision,
   * Gambia kept one, and plural-form names take one while identical-looking
   * singulars do not. So it is a property of the name, stated once, and the
   * crumb still prints the bare form because a label is not a sentence.
   */
  takesArticle?: boolean;
};

export type CountryMeta = {
  schema: "country.spine2";
  schemaVersion: number;
  id: string;
  country: CountryNames;
  /** The second half of the hero crumb, e.g. "Europe". Printed, not derived,
   * because which region a country belongs to is contested for enough of them
   * that a lookup table would be making a political claim in code. */
  region: string;
  urlPath: string;
  currency: CountryCurrency;
  freshness: string;
  /** Month precision is allowed: the page's trust band prints a month, not a
   * day, so a file that only knows the month is not lying by saying so. */
  reviewedAt: string;
  provenance?: {
    correctionsLedger?: string;
    familyDocs?: string[];
    correctionsApplied?: number[];
    correctionsOutOfScope?: Record<string, string>;
    freshnessWatch?: string[];
  };
};

/* ------------------------- 01 hero, "the answer" ------------------------- */

/**
 * WHAT THE STATE TAKES, AS A SHARE OF PROFIT, WITH ITS PARTS.
 *
 * The headline of the whole page. `sharePct` is the number the hero prints at
 * display size; `parts` is the stacked bar beneath it, and the parts MUST sum
 * to the share. That invariant is the reason they live in one figure rather
 * than four: a page whose headline is 36 and whose bar adds to 31 has published
 * two different answers to its own question, and a reader who adds up three
 * printed numbers is exactly the reader this page is written for.
 *
 * The bar spends NO accent. The mockup's own comment records why: painting
 * profit tax terracotta for being the largest slice read as "this is the
 * finding" about a component that is only arithmetic. The ramp orders it by
 * size and nothing else.
 *
 * RENDERED IN FIVE PLACES: the hero headline, chapter 02's first reading,
 * chapter 04's "What the state takes", the verdict's first chip, and the
 * closing band. One field, so those five cannot disagree.
 */
export type CountryStateTakePart = {
  label: string;
  sharePct: number;
};

export type CountryStateTakeFigure = FigureMeta & {
  sharePct: number;
  /** Largest first. Must sum to `sharePct`. */
  parts: CountryStateTakePart[];
};

/**
 * Chapter 01, id `ch-01`. The hero prints one share at headline size, a
 * one-sentence texture line above it, and a three-row glance panel beside it.
 *
 * ONLY the share, its sentence and the texture are authored here. The three
 * glance rows are rendered from canonical fields elsewhere in this file:
 *   headline profit tax      -> stateTake.parts[0]
 *   to register a company    -> opening.daysToRegister
 *   full-time wage floor     -> staffCost.wageFloor
 * The hero therefore cannot disagree with the chapters it is summarising.
 */
export type CountryHero = {
  stateTake: CountryStateTakeFigure | NullFigure;
  /** The sentence under the headline share. Place-specific, so authored. */
  headlineLabel: string;
  /** The small paragraph above the answer. `businesses` is the count it opens
   * on and is rendered again in the trust band; `line` is the rest of the
   * sentence, which is a claim about the SHAPE of the business base ("nearly
   * all of them small") and is not derivable from the count. */
  texture: {
    businesses: PointFigure | NullFigure;
    line: string;
  } | NullFigure;
};

/* ---------------------- 02 the country in eight numbers ------------------ */

/**
 * One row of the eight-number ruler in chapter 02, id `ch-02`.
 *
 * `position` is where the dot sits on a 0-to-100 ruler whose midpoint is the
 * world median. It is the COMPARISON, not the value, and it is what lets the
 * row read without a caption. The mockup paints the dot in the accent colour
 * only at the top or bottom tenth; that rule is DERIVED at render time from
 * the shared EIGHT_EXTREME constant and is never an authored flag. The mockup
 * itself shipped with the accent hand-set per row, which is how it came to
 * paint 68 and 6 while leaving 86 unmarked, stating a rule its own marks broke.
 */
export type CountryScorecardRow = {
  /** The printed name of the reading, e.g. "What the state takes". */
  label: string;
  /** The small qualifier beside it, e.g. "of profit", "world = 100". */
  sub?: string;
  figure: PointFigure | NullFigure;
  /** 0 to 100. 50 is the world median. */
  position: number;
};

/**
 * A scorecard row whose VALUE lives somewhere else in this file.
 *
 * Three of the eight readings are figures the page has already printed in a
 * chapter of their own: what the state takes, how many days a company takes,
 * and the wage floor. Giving them a second slot here is how the scorecard ends
 * up saying 36 while the hero says 34. So they carry their comparison and their
 * words, and the renderer reads the number from the canonical field named in
 * the comment above each one.
 */
export type CountryScorecardRef = Omit<CountryScorecardRow, "figure">;

/**
 * Chapter 02. Eight fixed readings, named keys rather than a list, so the
 * scorecard is the same eight things in every country and a place that cannot
 * fill one shows a hole rather than a shorter card.
 */
export type CountryScorecard = {
  /** What the ruler's midpoint means, e.g. "world median". Authored, because a
   * country page's peer set is every country we hold and that set grows. */
  baselineLabel: string;
  /** Value from `hero.stateTake.sharePct`. */
  stateTake: CountryScorecardRef;
  averageWage: CountryScorecardRow;
  netWealthPerAdult: CountryScorecardRow;
  /** Value from `opening.daysToRegister`. */
  daysToStart: CountryScorecardRef;
  easeOfBusiness: CountryScorecardRow;
  /** Value from `staffCost.wageFloor`. */
  minimumWage: CountryScorecardRef;
  population: CountryScorecardRow;
  costOfLiving: CountryScorecardRow;
};

/* --------------------- 03 what this country is like ---------------------- */

/**
 * THE SIX QUALITIES, ALL POINTING THE SAME WAY.
 *
 * Chapter 03, id `ch-03`, draws a hexagon under one rule the page states out
 * loud: further from the centre is better for an owner. That rule is the whole
 * reason the shape is readable, and it forces every axis to be NORMALISED
 * before it is stored: "cost to run" is dear here, and it is stored as 0.24
 * because dear is bad, not as 0.76 because dear is high.
 *
 * `value` is 0 to 1. `note` is the plain-words reading beside it in the key,
 * and it is authored because it names a figure from elsewhere on the page in
 * the page's own voice ("about 7 cents in the dollar").
 *
 * THE AXES ARE A CLOSED SET for the same reason the city's population types
 * are: a shape only means something if every country is drawn on the same six
 * axes. A country that invents a seventh stops being comparable with the rest,
 * which is the only thing this chapter is for.
 */
export const COUNTRY_QUALITY_KEYS = [
  "getting-in",
  "people",
  "demand",
  "what-you-keep",
  "cost-to-run",
  "stability",
] as const;

export type CountryQualityKey = (typeof COUNTRY_QUALITY_KEYS)[number];

export type CountryQuality = {
  key: CountryQualityKey;
  label: string;
  /** 0 to 1, normalised so that higher is always better for an owner. */
  value: number;
  note: string;
};

export type CountryQualitiesFigure = FigureMeta & {
  /** One entry per key in COUNTRY_QUALITY_KEYS, in that order. */
  axes: CountryQuality[];
};

/** Chapter 03. */
export type CountryShape = {
  qualities: CountryQualitiesFigure | NullFigure;
};

/* ------------------- 04 what the rules are like here --------------------- */

/**
 * THE GROUPS ARE THE ORDER A FOUNDER MEETS THEM, NOT DIFFICULTY ORDER.
 *
 * Ratified in the mockup 2026-07-26. Twelve readings on one shared scale used
 * to run as a single undifferentiated list, so "Paying by card" sat next to
 * "Borrowing to expand" next to "Foreign-owned businesses" with nothing to say
 * they answer different questions. Within each group the sort is still
 * easiest-first, so the one-scale promise in the caption still holds.
 *
 * A closed set, so the same four headings appear in every country.
 */
export const COUNTRY_READING_GROUPS = [
  "Getting in",
  "Trading here",
  "What it costs",
  "The market",
] as const;

export type CountryReadingGroup = (typeof COUNTRY_READING_GROUPS)[number];

/**
 * One reading on the twelve-row column.
 *
 * `position` is 0 for easy or light on an owner and 100 for hard or heavy, on
 * ONE scale shared by all four groups. `value` is the printed reading in the
 * page's own words ("1 day", "86% of sales", "3 to 6 weeks"): it is a string
 * because the twelve readings are not the same kind of quantity and forcing
 * them into one unit would either flatten them or invent a conversion.
 *
 * Whether a row is accented is DERIVED from `position` at render time, never
 * authored, exactly as in chapter 02.
 */
export type CountryReading = {
  /** Optional glyph key from the shared icon set. Presentational. */
  icon?: string;
  label: string;
  group: CountryReadingGroup;
  /** 0 easy, 100 hard. */
  position: number;
  value: string;
};

export type CountryReadingsFigure = FigureMeta & {
  readings: CountryReading[];
};

/** Chapter 04, id `ch-04`. */
export type CountryRules = {
  readings: CountryReadingsFigure | NullFigure;
};

/* ----------------------- 05 how long it takes to open -------------------- */

/**
 * One step on the road to the first sale.
 *
 * NO GEOMETRY IS CARRIED. The mockup positions each lane with a hand-placed
 * left and width; those are drawn positions, not measurements, and storing them
 * would let a file publish a schedule it never measured. What is real is the
 * step's name, what it costs and how long it takes where that is known, so
 * that is what this holds. A renderer that wants a Gantt can derive one from
 * `startsAfterWeeks` and `takesWeeks` once a file carries them.
 */
export type CountryOpeningStep = {
  label: string;
  /** Optional glyph key from the shared icon set. Presentational. */
  icon?: string;
  /** What the step costs. A step that is free carries a zero figure, not a
   * NullFigure: free is a measurement and "not published" is not. */
  cost: PointFigure | NullFigure;
  /** How long the step itself takes, where a duration is published. */
  takesWeeks: PointFigure | RangeFigure | NullFigure;
  /** How long after the start it can begin, where that is known. */
  startsAfterWeeks: PointFigure | NullFigure;
  /** True for the step that sets the opening date. At most one; the mockup
   * marks the bank account and says so in its own note. */
  bottleneck?: boolean;
};

export type CountryOpeningStepsFigure = FigureMeta & {
  steps: CountryOpeningStep[];
};

/**
 * Chapter 05, id `ch-05`.
 *
 * THE THREE HEADLINE FIGURES ARE CANONICAL AND ARE READ FROM HERE BY OTHER
 * CHAPTERS. `daysToRegister` is printed in the hero glance, chapter 02, chapter
 * 04, this chapter and chapter 18. `weeksToTakeMoney` is printed twice here,
 * in chapter 18 and in the verdict's second chip. `cashToSetUp` is printed here
 * and in chapter 18.
 *
 * The distance between the first two is the chapter's entire finding, and it is
 * derived rather than authored: a company exists in a day and cannot take money
 * for weeks.
 */
export type CountryOpening = {
  daysToRegister: PointFigure | NullFigure;
  weeksToTakeMoney: PointFigure | NullFigure;
  cashToSetUp: PointFigure | NullFigure;
  steps: CountryOpeningStepsFigure | NullFigure;
  /** The closing observation where it is place-specific, e.g. that the bank
   * account is what sets the opening date. Optional. */
  note?: string;
};

/* --------------------------- 06 licences by trade ------------------------ */

/**
 * How hard one licence is for one trade.
 *
 *   required , needed, and granted on the counter.
 *   slow     , needed, and it is the thing that will hold you up.
 *   none     , not needed for this trade.
 *
 * The row total is DERIVED by counting everything that is not `none`, never
 * authored, so the total column cannot disagree with the row it sits on.
 */
export type CountryLicenceLevel = "required" | "slow" | "none";

export const COUNTRY_LICENCE_KINDS = [
  "premises",
  "food",
  "alcohol",
  "late-hours",
  "special",
] as const;

export type CountryLicenceKind = (typeof COUNTRY_LICENCE_KINDS)[number];

export type CountryLicenceRow = {
  tradeSlug: string;
  tradeName: string;
  /** One entry per kind in COUNTRY_LICENCE_KINDS, in that order. A missing
   * kind would leave a hole in a grid the reader scans across, so a filled
   * file states every cell, `none` included. */
  licences: Array<{ kind: CountryLicenceKind; level: CountryLicenceLevel }>;
};

export type CountryLicenceMatrixFigure = ProseFigureMeta & {
  rows: CountryLicenceRow[];
};

/** Chapter 06, id `ch-06`. */
export type CountryLicences = {
  matrix: CountryLicenceMatrixFigure | NullFigure;
  /** The closing observation, e.g. that the slow licences gate exactly the
   * trades that most want them. Place-specific, so authored. Optional. */
  note?: string;
};

/* ---------------------------- 07 where margin goes ----------------------- */

/**
 * THE COST STACK, AS A PARTITION OF REVENUE.
 *
 * The parts must sum to 100, and the last of them is what the owner keeps. The
 * renderer refuses to draw a partition that does not add up, so a file whose
 * parts sum to 97 shows a stated gap rather than a column with a hole in it,
 * which is the correct outcome: three percent of a shop's money has gone
 * missing and nobody should be reading a chart about it.
 *
 * RENDERED IN THREE PLACES: the column in chapter 07, the three-row panel
 * beside it, and chapter 15's own side of the abroad comparison. One field.
 *
 * `tone` is the 0-to-4 step on the neutral ramp, carried rather than derived
 * from order, because a file may want the largest part dark whether or not it
 * happens to be listed first. `kept` marks the single accented segment, which
 * is the one thing on this page that IS the answer.
 */
export type CountryCostPart = {
  label: string;
  sharePct: number;
  tone: 0 | 1 | 2 | 3 | 4;
  kept?: boolean;
  /**
   * One of the lines the panel beside the column calls out as deciding it.
   *
   * AUTHORED, NOT DERIVED, and the mockup is the reason. Taking the three
   * largest parts would name running costs, at 15, and drop rent and rates, at
   * 13. The design names rent and rates, because "the three that decide it"
   * means the three an owner can actually move when signing a lease and a rota,
   * not the three with the biggest numbers. That is a judgement, so it is
   * stored rather than inferred, and inferring it would quietly print a
   * different panel from the one that was ratified.
   */
  decides?: boolean;
};

export type CountryCostStackFigure = FigureMeta & {
  /** In drawing order, top to bottom. Must sum to 100. */
  parts: CountryCostPart[];
  /** Which trade the stack describes, in plain words, e.g. "an everyday
   * trade". REQUIRED: a cost stack with no stated subject is a claim about
   * every business in the country at once, and no such business exists. */
  subject: string;
};

/** Chapter 07, id `ch-07`. */
export type CountryMarginStack = {
  stack: CountryCostStackFigure | NullFigure;
  /** The panel's heading, e.g. "The three that decide it". Authored, because
   * how many lines decide it is a country's own answer and the heading has to
   * agree with the parts marked `decides`. */
  decidedByLabel: string;
};

/* ---------------------------- 08 what staff cost ------------------------- */

/**
 * One role on the pay scale. `lo` and `hi` are the whiskers, `typical` is the
 * marker and the printed value.
 *
 * The wage floor appears here as a role whose three numbers are equal, which is
 * what the mockup draws, and it MUST be the same number as
 * `CountryStaffCost.wageFloor`. It is not a second field: the renderer reads
 * the floor from the canonical figure and appends it as the last row.
 */
export type CountryPayRow = {
  label: string;
  lo: number;
  typical: number;
  hi: number;
};

export type CountryPayScaleFigure = FigureMeta & {
  rows: CountryPayRow[];
  /** The drawn axis. Pinned rather than guessed from the rows, so two countries
   * with the same rows cannot get different axes by accident. */
  axis?: { lo: number; hi: number; ticks: number[] };
};

/**
 * Chapter 08, id `ch-08`.
 *
 * `wageFloor` is CANONICAL and is rendered in the hero glance, chapter 02,
 * this chapter's sentence and this chapter's pay scale.
 *
 * `employerOnCostPct` is the part first-timers miss: what an employer adds on
 * top of every wage. The worked example beside it ("a $30K hire really costs
 * $34.5K") is DERIVED from the two, not authored, so it cannot state a
 * surcharge the percentage above it contradicts.
 */
export type CountryStaffCost = {
  wageFloor: PointFigure | NullFigure;
  employerOnCostPct: PointFigure | NullFigure;
  /** The wage the worked example starts from, e.g. $30K. Authored, because
   * which wage makes the point is a country-specific editorial choice. */
  workedExampleWage: PointFigure | NullFigure;
  payScale: CountryPayScaleFigure | NullFigure;
  /** What overtime multiplies a wage by, above the stated hours. */
  overtimeMultiple: PointFigure | NullFigure;
  /** The threshold overtime starts at, in hours a week. */
  overtimeAfterHours: PointFigure | NullFigure;
  /** The closing observation where it is place-specific. Optional. */
  note?: string;
};

/* --------------------- 09 can you find and keep staff -------------------- */

/** Chapter 09, id `ch-09`. The hundred-square grid draws ONE attribute. The
 * mockup shipped drawing two independent attributes as one partition, 16
 * terracotta then 22 black, which read as "second language is a subset of
 * skilled". It is not, and the legend never said so. */
export type CountryStaffSupply = {
  /** Of a hundred working people, how many hold a degree or a skilled trade. */
  skilledInHundred: PointFigure | NullFigure;
  weeksToFillSkilledRole: PointFigure | NullFigure;
  /** Staff leaving in a year, and the trade that figure describes. The two are
   * one field because a churn rate with no stated trade is a claim about every
   * employer in the country at once, and the number would be meaningless. */
  churn: { subject: string; pct: PointFigure } | NullFigure;
  noticePeriodMonths: PointFigure | NullFigure;
  secondLanguagePct: PointFigure | NullFigure;
  /** Roles with a known shortage, named. Prose, so no unit. */
  shortages: ProseFigureMeta & { roles: string[] } | NullFigure;
  note?: string;
};

/* ----------------------- 10 who has money to spend ----------------------- */

/** How a household spends a hundred. The parts must sum to 100. */
export type CountryHouseholdSplitFigure = FigureMeta & {
  parts: Array<{ label: string; amount: number }>;
};

/** Chapter 10, id `ch-10`. */
export type CountryHouseholds = {
  split: CountryHouseholdSplitFigure | NullFigure;
  medianAfterTax: PointFigure | NullFigure;
  /** What is left after the necessary lines of `split`. Derivable where the
   * split names which lines are necessary; carried until it is. */
  discretionary: PointFigure | NullFigure;
  millionaireHouseholds: PointFigure | NullFigure;
  /** Rendered here and in chapter 04's "Paying by card". */
  paidByCardPct: PointFigure | NullFigure;
};

/* ------------------- 11 how many people you can reach -------------------- */

/** One ring of the catchment. `minutes` is the travel time, `people` is who is
 * inside it. */
export type CountryCatchmentFigure = FigureMeta & {
  rings: Array<{ minutes: number; label: string; people: number }>;
  /** What kind of site the rings are drawn from, e.g. "a city site". REQUIRED:
   * a catchment with no stated origin is a claim about nowhere. */
  origin: string;
};

/** Chapter 11, id `ch-11`. */
export type CountryReach = {
  catchment: CountryCatchmentFigure | NullFigure;
};

/* --------------------- 12 owner take-home, by trade ---------------------- */

/**
 * One trade's national economics.
 *
 * `tradeSlug` is an IDENTIFIER, not an accent flag: it says which trade a row
 * names, never which row the page should highlight. The mockup highlights the
 * top keeper and the renderer derives that by taking the maximum of
 * `ownerKeepsPct`, so an authored boolean can never mark the wrong row. Same
 * discipline as the city contract's trade rows.
 *
 * EVERY VALUE MUST BE READ FROM THAT TRADE'S OWN NATIONAL FIGURES. Authoring
 * them here is how the country page and the trade page end up quoting different
 * answers to one question, which is the oldest complaint on this project. The
 * city page had exactly this defect: it authored a restaurant set-up cost of
 * $197,000 while the reconciled trade file computed $231,134 by summing its own
 * opening lines, a gap of 17%.
 */
export type CountryTradeRow = {
  tradeSlug: string;
  tradeName: string;
  /** Optional glyph key from the shared icon set. Presentational. */
  icon?: string;
  ownerKeepsPct: number;
  costToOpen: number | null;
  revenue: number | null;
  /** How hard it is to get in, in the page's own words. A closed set, because
   * "Easier" in one country and "easier" in another must be the same claim. */
  breakIn: "easier" | "demanding" | "hardest";
};

export type CountryTradeTakeHomeFigure = FigureMeta & {
  trades: CountryTradeRow[];
};

/** Chapter 12, id `ch-12`. */
export type CountryTradeTakeHome = {
  trades: CountryTradeTakeHomeFigure | NullFigure;
  /** The closing observation, e.g. that revenue and take-home run opposite.
   * Place-specific, so authored. Optional. */
  note?: string;
};

/* ---------------------- 13 against neighbouring countries ---------------- */

/**
 * One country on the parallel-coordinates chart.
 *
 * Every axis is NORMALISED SO THAT HIGHER IS BETTER FOR AN OWNER, the same rule
 * as chapter 03's hexagon, and the page states it once above the chart. The
 * mockup shipped with each axis labelled at one pole only, and the word was
 * "high" under axes whose top means fast, cheap or generous, so a reader could
 * not tell which direction was good and the wording implied the opposite of the
 * truth. The poles are gone and the orientation is stated instead.
 *
 * `countrySlug` is an IDENTIFIER, not an accent flag: this country's own line
 * is found by matching meta.country.slug.
 */
export type CountryNeighbourRow = {
  country: string;
  countrySlug: string;
  /** One value per axis in `CountryNeighbourFigure.axes`, in that order. 0 to
   * 1, higher is better for an owner. */
  values: number[];
};

export type CountryNeighbourFigure = FigureMeta & {
  axes: string[];
  rows: CountryNeighbourRow[];
};

/** Chapter 13, id `ch-13`. */
export type CountryNeighbours = {
  comparison: CountryNeighbourFigure | NullFigure;
  /** The reading of the shape, e.g. that the country is fast to start in and
   * dear to run. Place-specific, so authored. Optional. */
  note?: string;
};

/* -------------------- 14 which trades are under-served ------------------- */

/**
 * One trade on the opportunity scatter.
 *
 * `density` is how many already operate; `money` is how much local spend sits
 * around them. Both 0 to 100. The opportunity corner is thin AND moneyed, and
 * which points sit in it is DERIVED from the two coordinates, never authored,
 * so the panel beside the chart cannot name a trade the chart does not place
 * there.
 */
export type CountryUnderServedRow = {
  tradeSlug: string;
  tradeName: string;
  /** Optional glyph key from the shared icon set. Presentational. */
  icon?: string;
  /** 0 thin on the ground, 100 crowded. */
  density: number;
  /** 0 little money around, 100 a great deal. */
  money: number;
};

export type CountryUnderServedFigure = FigureMeta & {
  rows: CountryUnderServedRow[];
};

/** Chapter 14, id `ch-14`. */
export type CountryUnderServed = {
  scatter: CountryUnderServedFigure | NullFigure;
  /** Why thin does not mean easy. Place-specific, so authored. Optional. */
  note?: string;
};

/* ----------------------- 15 the same business abroad --------------------- */

/**
 * One trade's cost stack, here against one other country.
 *
 * `here` is NOT stored: it is `marginStack.stack`, read from there at render
 * time, so the two chapters cannot draw different columns for the same country.
 * Only the other country's side is authored, and its figures must be read from
 * that country's own file once one exists.
 */
export type CountryAbroadFigure = FigureMeta & {
  tradeSlug: string;
  tradeName: string;
  peer: {
    country: string;
    countrySlug: string;
    parts: CountryCostPart[];
  };
};

/** Chapter 15, id `ch-15`. */
export type CountryAbroad = {
  comparison: CountryAbroadFigure | NullFigure;
  /** The reading of the two columns, e.g. that the margin is fatter where the
   * property is cheaper. Place-specific, so authored. Optional. */
  note?: string;
};

/* --------------------- 16 zones and special structures ------------------- */

/**
 * Chapter 16, id `ch-16`.
 *
 * THE COMMONEST HONEST ANSWER IS "NONE OF THIS HELPS YOU", and the mockup
 * prints exactly that. So the chapter's primary content is a VERDICT, not a
 * list: a country with no relevant zone still has something true to say, and
 * saying it is more useful than an empty table.
 *
 * `relevant` is the judgement the card leads with. `zones` is the list where
 * one exists and matters.
 */
export type CountryZone = {
  name: string;
  /** What it changes for an owner, in plain words. */
  effect: string;
  /** Which trades it actually reaches. Empty means none on the high street. */
  trades: string[];
};

export type CountryZones = {
  /** True when at least one zone changes the arithmetic for a high-street
   * trade. Authored, because it is a judgement, and stated so the card's
   * headline sentence cannot contradict its own list. */
  relevant: boolean;
  /** The card's sentence. Place-specific, so authored. */
  verdict: string;
  zones: (ProseFigureMeta & { list: CountryZone[] }) | NullFigure;
};

/* -------------------------- 17 stability and safety ---------------------- */

/**
 * One reading of the ground under a lease.
 *
 * `strength` is 0 to 100 where higher is better for an owner, the same
 * orientation as chapters 03 and 13. `word` is what the row prints, because
 * these are qualities rather than quantities and a number beside "the courts
 * work" would claim a precision nobody has.
 *
 * `costly` marks the readings that cost the owner money rather than reassuring
 * them. It is authored rather than derived from `strength`, because a reading
 * can be middling without being the thing that hurts.
 */
export type CountryGroundRow = {
  label: string;
  strength: number;
  word: string;
  costly?: boolean;
};

export type CountryGroundFigure = FigureMeta & {
  rows: CountryGroundRow[];
};

/** Chapter 17, id `ch-17`. */
export type CountryStability = {
  ground: CountryGroundFigure | NullFigure;
  /** Rendered here and in chapter 04's "Borrowing to expand". */
  costToBorrowPct: PointFigure | NullFigure;
  inflationPct: PointFigure | NullFigure;
  energyPerKwh: PointFigure | NullFigure;
  note?: string;
};

/* ------------------------------ 18 the myth ------------------------------ */

/**
 * Chapter 18, id `ch-18`. One claim-and-reality pair beside a four-row panel.
 *
 * THE PANEL HAS NO FIGURES OF ITS OWN. Its four rows are
 * `opening.daysToRegister`, `opening.weeksToTakeMoney`, `opening.cashToSetUp`
 * and the property-rates reading from chapter 04. A myth that argued from its
 * own private copies of those numbers could be corrected on one page and stay
 * wrong on the other.
 */
export type CountryMyth = {
  primary: ClaimFigure | NullFigure;
  /** The paragraph that reads the correction rather than restating it.
   * Place-specific, so authored. Optional. */
  note?: string;
  /** The panel's heading, e.g. "Easy in, dear to hold". Authored, because it is
   * the myth's own summary in three words. Optional: a file with no myth has
   * nothing to head the panel with, and a default would be inventing one. */
  panelLabel?: string;
  /** Property rates in year one. Rendered here and in chapter 04. */
  propertyRatesYearOne: PointFigure | NullFigure;
};

/* ----------------------------- 19 the verdict ---------------------------- */

/** Chapter 19, id `ch-19`. The page's one paragraph of judgement plus the
 * chips beneath it. */
export type CountryVerdict = {
  /** The judgement itself, place-specific, so authored. */
  text: string;
  /** The chips under the verdict. Each RESTATES a figure already in this file
   * in the page's own phrasing; a chip must never introduce a number that
   * appears nowhere else, because nothing would then carry its tier. */
  chips: Array<{
    /** Optional glyph key from the shared icon set. Presentational. */
    icon?: string;
    text: string;
  }>;
};

/* -------------------------- 20 how we work it out ------------------------ */

/** One row of the method ledger: what the figure is, how solid it is, and where
 * it comes from in plain words. */
export type CountryMethodRow = {
  /** The family of figures the row describes, e.g. "Wage floor and pay". */
  figure: string;
  tier: Tier;
  /** How it is built, in plain words, safe to render. */
  how: string;
};

/** Chapter 20, id `ch-20`. The trust band's tier counts are counted from these
 * rows and have no fields of their own. */
export type CountryMethodology = {
  rows: CountryMethodRow[];
};

/* ------------------- the closing "remember" band ------------------------- */

/**
 * The unnumbered band between chapters 20 and 21. One sentence and one large
 * figure.
 *
 * The figure RESTATES one already printed earlier in the page (in the mockup,
 * the same 36% the hero opens on). `figureSource` names the field it restates
 * so the renderer can resolve it rather than trust a copy; resolving is
 * strictly better than checking, because then the two cannot disagree in the
 * first place.
 */
export type CountryRemember = {
  text: string;
  figure: PointFigure | NullFigure;
  /** The line under the large figure, e.g. "of profit, to the state". */
  figureLabel: string;
  /** Dotted path of the canonical field this restates, e.g.
   * "hero.stateTake". */
  figureSource: string;
};

/* ------------------------- 21 where to go next --------------------------- */

/**
 * One onward tile.
 *
 * `gloss` is the small figure beside the label and it BELONGS TO THE LINKED
 * PAGE, not to this country: what a city spends per head, what a trade's owner
 * keeps. It is carried as an already-formatted string because it is read from
 * another file at build time and this file has no authority over its unit or
 * its tier.
 */
export type CountryNextTile = {
  kind: "city" | "trade" | "trades" | "countries";
  /** City slug, trade slug, or a literal for the index pages. */
  slug: string;
  label: string;
  gloss: string;
  /** Optional glyph key from the shared icon set. Presentational. */
  icon?: string;
  /** Set only where the target page exists. A tile with no href renders as a
   * flat card, which is what the mockup does for pages not yet built. */
  href?: string;
};

/** Chapter 21, id `ch-21`. */
export type CountryNext = {
  tiles: CountryNextTile[];
};

/* ------------------------------- the file -------------------------------- */

/**
 * One country page, whole.
 *
 * Every chapter is required. The trust band at the foot of the page has no
 * field of its own: its three readings are all derived, from meta.reviewedAt,
 * hero.texture.businesses with the length of tradeTakeHome.trades, and the tier
 * counts in methodology.rows.
 */
export type CountryFile = {
  meta: CountryMeta;
  /** 01 */ hero: CountryHero;
  /** 02 */ scorecard: CountryScorecard;
  /** 03 */ shape: CountryShape;
  /** 04 */ rules: CountryRules;
  /** 05 */ opening: CountryOpening;
  /** 06 */ licences: CountryLicences;
  /** 07 and 15's own side, one stack rendered twice */ marginStack: CountryMarginStack;
  /** 08 */ staffCost: CountryStaffCost;
  /** 09 */ staffSupply: CountryStaffSupply;
  /** 10 */ households: CountryHouseholds;
  /** 11 */ reach: CountryReach;
  /** 12 */ tradeTakeHome: CountryTradeTakeHome;
  /** 13 */ neighbours: CountryNeighbours;
  /** 14 */ underServed: CountryUnderServed;
  /** 15 */ abroad: CountryAbroad;
  /** 16 */ zones: CountryZones;
  /** 17 */ stability: CountryStability;
  /** 18 */ myth: CountryMyth;
  /** 19 */ verdict: CountryVerdict;
  /** 20 */ methodology: CountryMethodology;
  /** the closing band */ remember: CountryRemember;
  /** 21 */ next: CountryNext;
};

/* ------------------------------ type guards ------------------------------ */

export function isNullFigure(f: Figure): f is NullFigure {
  return "value" in f && f.value === null;
}

export function isRangeFigure(f: Figure): f is RangeFigure {
  return "lo" in f && "hi" in f;
}

export function isSeriesFigure(f: Figure): f is SeriesFigure {
  return "series" in f;
}

export function isClaimFigure(f: Figure): f is ClaimFigure {
  return "claim" in f && "reality" in f;
}

export function isPointFigure(f: Figure): f is PointFigure {
  return "value" in f && typeof (f as PointFigure).value === "number";
}

/** The headline number a figure contributes: the taken point of a range, else
 * the point value. Null figures contribute nothing. */
export function figureValue(f: PointFigure | RangeFigure): number {
  return isRangeFigure(f) ? (f.taken ?? (f.lo + f.hi) / 2) : f.value;
}

/**
 * DO THE PARTS ADD UP TO THE WHOLE.
 *
 * Used by the state-take bar, the cost stack and the household split, all three
 * of which print their parts beside their total and invite a reader to add
 * them. A tolerance of one is the rounding a file is allowed, not a licence.
 */
export function partsSumTo(parts: number[], whole: number, tolerance = 1): boolean {
  const sum = parts.reduce((a, b) => a + b, 0);
  return Math.abs(sum - whole) <= tolerance;
}

/**
 * How many licences a trade needs: everything that is not `none`. DERIVED, so
 * the total column cannot disagree with the row it sits on.
 */
export function licenceCount(row: CountryLicenceRow): number {
  return row.licences.filter((l) => l.level !== "none").length;
}

/**
 * The trade whose owner keeps most. Derived, so no authored boolean can mark
 * the wrong row.
 */
export function topKeepingTrade(rows: CountryTradeRow[]): CountryTradeRow | null {
  if (rows.length === 0) return null;
  return rows.reduce((best, r) => (r.ownerKeepsPct > best.ownerKeepsPct ? r : best));
}
