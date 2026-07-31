/**
 * city_spine2_types.ts - the typed contract for a spine-2 city data file.
 *
 * A city file (data/cities/<city>-<country>.json) is the hand-filled,
 * per-figure-provenanced data behind one city page. The page is the ratified,
 * frozen mockup at design/mockups/city.html: a hero plus seventeen numbered
 * chapters, a closing "one thing to remember" band, and a trust band.
 *
 * THE COMPLETENESS RULE (ratified 2026-07-27). A page is always complete. Its
 * shape never varies by place. Every chapter always exists; where a figure is
 * missing the section still renders and states what it lacks. So every chapter
 * below is a REQUIRED key on CityFile, even the ones that are often unfillable
 * (visitor seasonality, population archetypes, operator voices, peer rents).
 * A chapter with nothing behind it holds a NullFigure carrying its reason, and
 * the renderer prints the hole rather than hiding the chapter.
 *
 * The central distinction this contract exists to hold:
 *   - A city figure is about the GROUND: what it costs to stand somewhere,
 *     who walks past, what they can spend. It is the same for every trade.
 *   - A trade figure is about the ROOM: revenue, the cost stack, what an
 *     owner keeps. Those live in the cell file, never here.
 * Chapter 07 is the one place the page prints trade economics, and it prints
 * them as a comparison ACROSS trades. Each row must be read from that trade's
 * own cell file, never authored here, or the two pages will drift apart.
 *
 * ONE FIGURE, ONE HOME. The mockup prints several numbers more than once: the
 * spend per resident appears in the hero, the scorecard and chapter 03; the
 * commercial-rent multiple appears in the hero, the scorecard and the closing
 * band; the six districts are rendered twice, as a rent scale in chapter 08
 * and as character cards in chapter 10. This contract gives each of those a
 * single field and names, in the comment above it, every chapter that renders
 * it. Duplicated slots are how a page ends up disagreeing with itself, and the
 * cell page's audit found several of exactly that kind.
 *
 * PROSE. Figures are typed; prose is not, with one exception: a sentence that
 * is irreducibly place-specific and cannot be derived from a figure on the
 * same screen is data, and is carried as a plain string (district character,
 * local knowledge, operator quotes, the myth, the verdict, the closing band).
 * Sentences that merely restate a figure printed beside them are the
 * renderer's business and have no field here.
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

/** The same envelope for a figure whose payload is words rather than a
 * measured quantity, so a unit would be meaningless. Used by the myth, the
 * local-knowledge list and the operator quotes: they still have to say how
 * solid they are and when they were last looked at. */
export type ProseFigureMeta = Omit<FigureMeta, "unit">;

/** A single number, USD display with optional native-currency sidecar. */
export type PointFigure = FigureMeta & {
  value: number;
  /** The native-currency value. The field name is historic and means "the
   * value in meta.currency.native", whatever that currency is. */
  gbp?: number;
};

/** A range, optionally with the point the headline takes. */
export type RangeFigure = FigureMeta & {
  lo: number;
  hi: number;
  taken?: number;
  gbp?: { lo: number; hi: number; taken?: number };
};

/** An ordered series (visitor seasonality, a cost split, a sparkline). */
export type SeriesFigure = FigureMeta & {
  series: Array<{ x: number | string; value: number }>;
};

/** A claim-and-reality pair (chapter 12, the myth block). */
export type ClaimFigure = ProseFigureMeta & {
  claim: string;
  reality: string;
};

/** An honest hole: no public counterpart exists, or the design states a thing
 * the data cannot. The reason is MANDATORY, because a hole must say why it is
 * a hole. A labelled proxy may ride along. */
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
  | CityRankFigure
  | CityIncomeSpreadFigure
  | CityWealthBandsFigure
  | CityArchetypesFigure
  | CityTradeEconomicsFigure
  | CityDistrictsFigure
  | CityTradeFitFigure
  | CityTradeVersusPeerFigure
  | CityPeerRentFigure
  | CityPressuresFigure
  | CityLocalKnowledgeFigure
  | CityVoicesFigure
  | NullFigure;

/* -------------------------------- meta ---------------------------------- */

export type CityCurrency = {
  display: "USD";
  native: string;
  /** USD per one unit of `native`, pinned for the whole file. The name is
   * historic. One rate for every figure, so the parts still add to the whole
   * after conversion. */
  usdPerGbp: number;
  rateAsOf: string;
  rateBasis: string;
};

export type CityMeta = {
  schema: "city.spine2";
  schemaVersion: number;
  id: string;
  country: { slug: string; name: string };
  city: { slug: string; name: string };
  urlPath: string;
  currency: CityCurrency;
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

/** A placing inside a ranked set. Carried as its own figure shape because a
 * rank without its denominator is a boast, not a reading. */
export type CityRankFigure = FigureMeta & {
  rank: number;
  of: number;
};

/**
 * Chapter 01, id `ch-01`. The hero prints one number at headline size plus a
 * four-row glance panel.
 *
 * ONLY the headline, its sentence and the rank are authored here. The four
 * glance rows are rendered from canonical fields elsewhere in this file:
 *   business climate  -> scorecard.businessClimate  (rank sub-line from here)
 *   commercial rent   -> scorecard.commercialRent
 *   median earner     -> scorecard.medianPay
 *   visitor share     -> visitors.shareOfCitySpend
 * The hero therefore cannot disagree with the chapters it is summarising.
 */
export type CityHero = {
  /** The one number the page opens on. In the mockup, consumer spend per
   * resident per year: the pot a high-street trade competes for. This is the
   * same figure as scorecard.spendPerResident and must be rendered from it;
   * the slot here exists only for cities whose answer is a different number. */
  headline: PointFigure | NullFigure;
  /** The sentence under the headline number. Place-specific, so authored. */
  headlineLabel: string;
  /** The sub-line on the hero's business-climate row, and nowhere else. */
  businessClimateRank: CityRankFigure | NullFigure;
};

/* ---------------------- 02 the city in seven numbers --------------------- */

/**
 * One row of the seven-number ruler in chapter 02, id `ch-02`.
 *
 * `position` is where the dot sits on a 0-to-100 ruler whose midpoint is
 * `CityScorecard.baselineLabel`. It is the COMPARISON, not the value, and it
 * is what lets the row read without a caption. The mockup paints the dot in
 * the accent colour when position is at or beyond 85, or at or below 15; that
 * rule is derived at render time and is never an authored flag.
 */
export type CityScorecardRow = {
  /** The printed name of the reading, e.g. "Spend per resident". */
  label: string;
  /** The small qualifier beside it, e.g. "a year", "of 100". */
  sub?: string;
  figure: PointFigure | NullFigure;
  /** 0 to 100. 50 is the baseline. */
  position: number;
};

/** Chapter 02. Seven fixed readings, named keys rather than a list, so the
 * scorecard is the same seven things in every city and a place that cannot
 * fill one shows a hole rather than a shorter card. */
export type CityScorecard = {
  /** What the ruler's midpoint means, e.g. "UK city average". Authored
   * because the peer set is country-specific. */
  baselineLabel: string;
  spendPerResident: CityScorecardRow;
  medianPay: CityScorecardRow;
  costOfLiving: CityScorecardRow;
  commercialRent: CityScorecardRow;
  visitors: CityScorecardRow;
  unemployment: CityScorecardRow;
  businessClimate: CityScorecardRow;
};

/* ------------------- 03 household income and wealth ---------------------- */

/** One dumbbell in the income spread: a low, a median and a high for one slice
 * of earners. lo and hi are the whiskers the mockup draws as caps; median is
 * the marker and the printed value. */
export type CityIncomeBand = {
  label: string;
  lo: number;
  median: number;
  hi: number;
};

export type CityIncomeSpreadFigure = FigureMeta & {
  rows: CityIncomeBand[];
  /** The drawn log scale. The mockup pins both ends and the tick values, so
   * they are carried rather than guessed from the rows; two cities with the
   * same rows should not get different axes by accident. */
  axis?: { lo: number; hi: number; ticks: number[] };
};

/**
 * Chapter 03, id `ch-03`. Two panels: an income spread on a log axis, and a
 * four-row "the customer" block.
 *
 * The customer block's four rows come from four different homes:
 *   spend per resident     -> scorecard.spendPerResident
 *   millionaire households -> people.millionaireHouseholds
 *   paid by card           -> here
 *   residents              -> people.residents
 * Only `paidByCard` is unique to this chapter.
 */
export type CityIncomeAndWealth = {
  /** The panel's headline multiple: the top tenth against the middle earner.
   * It restates the ratio of two rows of `spread`, and a filled file should
   * re-derive it rather than author a second opinion. */
  topTenthVsMiddle: PointFigure | NullFigure;
  spread: CityIncomeSpreadFigure | NullFigure;
  /** Share of payments made by card. Printed only here. */
  paidByCard: PointFigure | NullFigure;
};

/* ---------------------- 04 visitors through the year --------------------- */

/**
 * Chapter 04, id `ch-04`. A twelve-bar seasonality chart against a drawn
 * annual average, plus a four-figure cluster.
 *
 * The chapter's two sentences are derived and have no field: the peak and
 * trough months and their distance from the year are read off `monthlyIndex`,
 * and spend per visitor is `spend` over `count`.
 */
export type CityVisitors = {
  /** Twelve points, x = month, value = index where 100 is the year average.
   * A city with no measured visitor seasonality holds a NullFigure here and
   * the chart renders as a stated hole. */
  monthlyIndex: SeriesFigure | NullFigure;
  count: PointFigure | NullFigure;
  spend: PointFigure | NullFigure;
  /** Printed in the cluster; derivable from spend over count, and a filled
   * file should re-derive rather than author a second opinion. */
  spendPerVisitor: PointFigure | NullFigure;
  /** Visitor money as a share of ALL spend in the city. Rendered here, in the
   * hero glance and in the verdict chips. */
  shareOfCitySpend: PointFigure | NullFigure;
  /** The one district where visitor money dominates, named in the closing
   * sentence. `districtName` is free text: the mockup names a district that is
   * not one of the six in chapter 10, so this must not be keyed to that list. */
  topDistrict: {
    districtName: string;
    shareOfSpend: PointFigure | NullFigure;
  } | NullFigure;
};

/* ------------------ 05 who lives here, what they can spend --------------- */

/** One band of the household wealth spread. Both numbers are printed: the
 * share sets the segment width, the count sits in the legend. */
export type CityWealthBand = {
  label: string;
  sharePct: number;
  households: number;
};

export type CityWealthBandsFigure = FigureMeta & {
  bands: CityWealthBand[];
};

/**
 * One population type on the archetype strip.
 *
 * `tone` is the 0-to-4 step on the neutral ramp the mockup paints the segment
 * and card with. It is carried rather than mapped from `spendingPowerLabel`,
 * because the mockup's mapping is a nine-string lookup that silently sends any
 * unrecognised label to the top of the ramp. `accent` marks the single type the
 * page paints in the accent colour, at most one per file.
 */
/**
 * THE CAPPED POPULATION VOCABULARY.
 *
 * The ratified POPs spec (PRODUCT-DIRECTION.md §3, 2026-06-22) says "8 to 10
 * CAPPED archetypes". The cap is the whole mechanism, not a tidiness rule: a
 * composition mix only means something if every place is describing itself in
 * the same words. The moment one city invents a tenth type, "students 15" in
 * London and "students 15" in Lisbon stop being the same claim, and the layer
 * that was supposed to make places comparable quietly stops doing it.
 *
 * These nine are the ones the London file already uses. Adding a tenth is a
 * founder decision, not an authoring convenience, which is why this is a closed
 * union and a gate rather than a comment.
 */
export const CITY_ARCHETYPE_KEYS = [
  "young-renters",
  "young-professionals",
  "families-with-kids",
  "established-owners",
  "wealthy-households",
  "retired-residents",
  "students",
  "recent-arrivals",
  "shift-and-service",
] as const;

export type CityArchetypeKey = (typeof CITY_ARCHETYPE_KEYS)[number];

export type CityArchetype = {
  /** Stable key for the type, used for selection state and deep links.
   * Closed: see CITY_ARCHETYPE_KEYS. */
  key: CityArchetypeKey;
  name: string;
  /** Optional glyph key from the shared icon set. Presentational, and absent
   * means the card renders without one; the mockup leaves three of nine bare. */
  icon?: string;
  sharePct: number;
  spendingPowerLabel: string;
  tone: 0 | 1 | 2 | 3 | 4;
  accent?: boolean;
  incomeAfterTax: number;
  savings: number;
  /** Free text, not a range: the mockup's last band is open-ended. */
  ageRange: string;
  /** How they live, e.g. "Renting, shared", "Owned outright". */
  tenure: string;
  buys: string[];
  /** Trades that index high against this type. Display names, which should
   * match the trade taxonomy so the renderer can link them. */
  tradesThatIndexHigh: string[];
};

export type CityArchetypesFigure = FigureMeta & {
  types: CityArchetype[];
};

/**
 * Chapter 05, id `ch-05`. The longest chapter: a wealth spread with a legend,
 * a four-figure row, a savings panel, a discretionary-spend panel, and the
 * archetype strip.
 *
 * Two sentences here are derived and have no field: "a third of households
 * could not absorb a small emergency" restates `householdsUnderThinCushion`,
 * and "the top tenth has almost seven times the discretionary money of the
 * middle" is the ratio of the two discretionary figures.
 */
export type CityPeople = {
  /** Rendered in chapter 03's customer block and in the trust band. */
  residents: PointFigure | NullFigure;
  wealthBands: CityWealthBandsFigure | NullFigure;
  /** Rendered in chapter 03's customer block and in this chapter's figure row. */
  millionaireHouseholds: PointFigure | NullFigure;
  /** "630K households over $150K": the count and the line it sits above. The
   * threshold is authored because it differs by country and by currency. */
  householdsOverThreshold: {
    threshold: PointFigure;
    count: PointFigure;
  } | NullFigure;
  belowPovertyLine: PointFigure | NullFigure;
  /** The middle household's savings. Printed twice inside this chapter, in the
   * figure row and on the savings scale; one field, so they cannot disagree. */
  typicalHouseholdSavings: PointFigure | NullFigure;
  topTenthSavings: PointFigure | NullFigure;
  /** "Households with under $1,000 saved: 1 in 3". `oneInEvery` is carried as
   * the denominator the design prints, not as a percentage, so the renderer
   * can print the mockup's own phrasing without reformatting it. */
  householdsUnderThinCushion: {
    threshold: PointFigure;
    oneInEvery: PointFigure;
  } | NullFigure;
  discretionary: {
    middleHousehold: PointFigure | NullFigure;
    topTenth: PointFigure | NullFigure;
    /** Of discretionary spend, the share that lands on the high street. */
    shareOnHighStreet: PointFigure | NullFigure;
  };
  archetypes: CityArchetypesFigure | NullFigure;
};

/* -------------------------- 06 what space costs -------------------------- */

/** One row of the "a typical unit, by size" block. `annualCost` is what the
 * mockup prints beside the size; the design does not say whether it is rent
 * alone or the full standing cost, so the figure's basis must. */
export type CityUnitSize = {
  label: string;
  /** The plain-words gloss, e.g. "a kiosk", "a big room". */
  description: string;
  floorAreaSqm: PointFigure;
  annualCost: PointFigure | NullFigure;
};

/**
 * The worked example the chapter closes on: one named trade, its room size,
 * its daily demand and what it pays for space.
 *
 * EVERY FIGURE HERE BELONGS TO THAT TRADE'S CELL FILE and must be read from it
 * at build time. Authoring them independently is how the city page and the
 * trade page end up quoting different numbers for the same room.
 */
export type CityAnchorTrade = {
  tradeSlug: string;
  tradeName: string;
  floorAreaSqm: PointFigure;
  /** The trade's own demand unit, e.g. orders a day. */
  demandPerDay: PointFigure | NullFigure;
  annualSpaceCost: PointFigure;
};

/** Chapter 06, id `ch-06`. */
export type CitySpaceCosts = {
  /** The composition of a high-street unit's cost, stated per 100 of currency
   * so the parts read as a split. Three parts is the floor; below that it is
   * not a split. */
  costSplit: SeriesFigure | NullFigure;
  sizes: {
    small: CityUnitSize;
    medium: CityUnitSize;
    large: CityUnitSize;
  };
  anchorTrade: CityAnchorTrade | NullFigure;
  /** The chapter's closing observation where it is place-specific, e.g. that
   * the quoted rent sits in the top third of the trade. Optional. */
  note?: string;
};

/* -------------------------- 07 what owners keep -------------------------- */

/**
 * One trade in the city's cross-trade comparison.
 *
 * `tradeSlug` is an IDENTIFIER, not an accent flag: it says which trade a row
 * names, never which row the page should highlight. The mockup highlights the
 * top keeper, and the renderer derives that by taking the maximum of
 * `ownerKeeps`, so an authored boolean can never mark the wrong row. This is
 * the same discipline as the cell contract's CityPeerRow.
 *
 * Every value must be read from that trade's own cell file.
 */
export type CityTradeRow = {
  tradeSlug: string;
  tradeName: string;
  revenue: number;
  ownerKeeps: number;
  /** What it costs to open. Null where the trade's cell file has no set-up
   * total yet; the table cell then renders empty rather than guessed. */
  costToOpen: number | null;
};

export type CityTradeEconomicsFigure = FigureMeta & {
  trades: CityTradeRow[];
};

/** Chapter 07, id `ch-07`. A slope chart with a table behind a disclosure. */
export type CityTradeEconomics = {
  trades: CityTradeEconomicsFigure | NullFigure;
};

/* ----------- 08 rent by district AND 10 the districts, one list ---------- */

/**
 * One district. The SAME list drives two chapters: chapter 08, id `ch-08`,
 * renders it as a rent scale plus a three-row cost panel, and chapter 10, id
 * `ch-10`, renders it as character cards. They share one field precisely so
 * they cannot print different multiples for the same place.
 *
 * The bar lengths in both chapters are `rentMultiple` against the largest
 * `rentMultiple` in the list, derived at render time.
 */
export type CityDistrictRow = {
  slug: string;
  name: string;
  /** Rent as a multiple of the city rate. 1.0 is the city rate itself. */
  rentMultiple: number;
  /** One sentence of character, printed on the chapter 10 card. */
  blurb: string;
  /** Optional glyph key from the shared icon set. Presentational. */
  icon?: string;
  /** What `CityDistricts.unitPriced` costs a year in this district. Chapter 08
   * prints only some of these, so a district with no priced unit holds a
   * NullFigure with its reason rather than being quietly left out. */
  annualUnitCost: PointFigure | NullFigure;
};

export type CityDistrictsFigure = FigureMeta & {
  districts: CityDistrictRow[];
};

/**
 * HOW RICH OR POOR A DISTRICT IS, AS A BAND. NEVER AS AN INDEX NUMBER.
 *
 * Ratified 2026-07-31, decision 1, and the reason is evidence rather than
 * taste. Commissioned research found:
 *
 *   - roughly 84% of household income variance sits WITHIN a small area rather
 *     than between areas, so a district figure describes a minority of what
 *     people there actually earn, before any estimation error at all;
 *   - where district boundaries do not nest inside official ones, interpolated
 *     median household income is wrong by more than 10% in about 44% of cases;
 *   - simple areal weighting puts 16.8% of zones off by a factor of two;
 *   - UK small-area guidance holds that differences under 5 to 10% between two
 *     small areas are not defensible at all.
 *
 * So "Shoreditch 118" claims a precision that does not exist, while "well above
 * the city average" survives every one of those findings. **Do not add an index
 * number beside the band.** That was foreclosed by name.
 *
 * THE BANDS ARE RELATIVE TO THIS CITY ONLY. "Well above" in London and "well
 * above" in Lagos are not the same money and must never be compared, ranked or
 * put in one table. This is the founder's standing rule against ranking across
 * geographies, applied to a scale that invites exactly that misreading.
 */
export type CityDistrictWealthBand =
  | "well-above"
  | "above"
  | "around"
  | "below"
  | "well-below";

export const CITY_DISTRICT_WEALTH_BANDS = [
  "well-above",
  "above",
  "around",
  "below",
  "well-below",
] as const;

/**
 * One district's two wealth reads, which are genuinely different questions.
 *
 * `resident` is who sleeps here. `daytime` is who is here during the working
 * day. A financial district is poor residentially and rich commercially, and a
 * lunch counter and an evening restaurant want opposite answers, so collapsing
 * these into one number would mislead half the readers who use it.
 */
export type CityDistrictWealthRow = {
  districtSlug: string;
  resident: CityDistrictWealthBand;
  daytime: CityDistrictWealthBand;
};

export type CityDistrictWealthFigure = FigureMeta & {
  /** One row per district in `CityDistricts.list`, in that list's order. A
   * district missing from this list would leave a hole in a grid the reader
   * scans, so a filled file states every district. */
  rows: CityDistrictWealthRow[];
};

export type CityDistricts = {
  /** Which unit the `annualUnitCost` figures price, in plain words. REQUIRED,
   * because "the same unit, three districts" is meaningless until the page
   * says what the unit is, and the mockup does not. */
  unitPriced: string;
  list: CityDistrictsFigure | NullFigure;
  /** Ratified 2026-07-31. Most cities will carry this as `estimated` for years
   * and that is the intended state, not a failure: the founder ruled that a
   * tagged estimate beats a blank. A city with nothing holds a NullFigure. */
  wealth: CityDistrictWealthFigure | NullFigure;
};

/* ---------------------- 09 best area for each trade ---------------------- */

/** best = the district that suits this trade most, drawn as the accent dot.
 * good = a workable second rank. weak = the mockup's empty dot. */
export type CityTradeFitLevel = "best" | "good" | "weak";

export type CityTradeFitRow = {
  tradeSlug: string;
  tradeName: string;
  /** One entry per district in CityDistricts.list, in that list's order.
   * A district missing from a row would leave a hole in the grid, so a filled
   * file must state every cell, weak included. */
  fits: Array<{ districtSlug: string; level: CityTradeFitLevel }>;
};

export type CityTradeFitFigure = FigureMeta & {
  rows: CityTradeFitRow[];
};

/** Chapter 09, id `ch-09`. The chapter's opening sentence names the best
 * district for two trades; it is derived from the `best` cells. */
export type CityTradeFit = {
  grid: CityTradeFitFigure | NullFigure;
};

/* ------------------------ 11 where the city heads ------------------------ */

/**
 * One tile on the direction row.
 *
 * `direction` is carried rather than taken from the sign of `changePct`,
 * because a tile whose change is a NullFigure still knows which way the thing
 * is moving, and the caption depends on it.
 */
export type CityTrend = {
  label: string;
  changePct: PointFigure | NullFigure;
  direction: "up" | "down";
  /** The small line under the sparkline: the horizon or the reading, e.g.
   * "over ten years", "fewer vacancies". Place-specific, so authored. */
  caption: string;
  /** The sparkline's own series. The mockup draws these from hand-placed
   * coordinates rather than from stated values, so a file with no measured
   * series holds a NullFigure and the tile renders the change without a line. */
  spark: SeriesFigure | NullFigure;
};

/** Chapter 11, id `ch-11`. Four fixed tiles, named keys so the row is the same
 * four readings in every city. */
export type CityDirection = {
  rent: CityTrend;
  footfall: CityTrend;
  emptyUnits: CityTrend;
  population: CityTrend;
};

/* ----------------------------- 12 the myths ------------------------------ */

/**
 * The chapter's supporting block: one trade, this city against one peer city.
 *
 * The two percentages the mockup prints at the bottom of the block, the
 * revenue gap and the take-home gap, are derived from these four numbers and
 * have no fields. Both cities' figures must be read from their own cell files.
 */
export type CityTradeVersusPeerFigure = FigureMeta & {
  tradeSlug: string;
  tradeName: string;
  here: { revenue: number; ownerKeeps: number };
  peer: {
    city: string;
    citySlug: string;
    revenue: number;
    ownerKeeps: number;
  };
};

/** Chapter 12, id `ch-12`. The mockup's heading is plural but the design holds
 * exactly one claim-and-reality pair beside one comparison block, so the
 * contract holds one. */
export type CityMyths = {
  primary: ClaimFigure | NullFigure;
  /** The second paragraph, which reads the comparison rather than restating
   * it. Place-specific, so authored. Optional. */
  note?: string;
  tradeAgainstPeer: CityTradeVersusPeerFigure | NullFigure;
};

/* -------------------------- 13 versus peer cities ------------------------ */

/**
 * One city on the peer strip.
 *
 * `rentVsThisCityPct` is commercial rent against THIS city as a percentage,
 * so this city's own row is 0 and prints as "level". `citySlug` is an
 * IDENTIFIER, not an accent flag: the adapter finds this city's row by matching
 * meta.city.slug, so an authored boolean can never mark the wrong row.
 */
export type CityPeerRentRow = {
  city: string;
  citySlug: string;
  rentVsThisCityPct: number;
};

export type CityPeerRentFigure = FigureMeta & {
  cities: CityPeerRentRow[];
};

/** Chapter 13, id `ch-13`. Ships only once peer cities have their own files,
 * built the same way as this one; until then this is a NullFigure and the
 * chapter states that it has no peer set yet. */
export type CityPeers = {
  rent: CityPeerRentFigure | NullFigure;
};

/* ---------------------------- 14 what to watch --------------------------- */

/**
 * One pressure on the watch list.
 *
 * `severity` is the 0-to-100 bar length: how hard the pressure bites, which is
 * an editorial ordering and not the same thing as the size of the change.
 * `change` is the measured size where one exists. Where the direction is known
 * but no magnitude is published, `change` is a NullFigure and `wordValue`
 * carries the word the row prints instead.
 */
export type CityPressure = {
  label: string;
  severity: number;
  change: PointFigure | NullFigure;
  wordValue?: string;
};

export type CityPressuresFigure = FigureMeta & {
  pressures: CityPressure[];
};

/** The "what locals know" list: observations that no register holds and that
 * only someone trading in the city would tell you. Prose, so no unit. */
export type CityLocalKnowledgeFigure = ProseFigureMeta & {
  lines: string[];
};

/** Chapter 14, id `ch-14`. Two panels, either of which can be a stated hole
 * while the other renders. */
export type CityWatch = {
  pressures: CityPressuresFigure | NullFigure;
  localKnowledge: CityLocalKnowledgeFigure | NullFigure;
};

/* -------------------------- 15 what operators say ------------------------ */

/**
 * One operator quote.
 *
 * `pull` is the number the design sets beside the quote. Its unit is whatever
 * the quote is about, so it varies row to row; a quote with no number holds a
 * NullFigure and renders without the pull.
 */
export type CityQuote = {
  quote: string;
  /** The trade the speaker runs, as printed, e.g. "Cafe". */
  trade: string;
  /** Where they trade, as printed. Free text: the mockup names a district
   * outside the six in chapter 10, so this must not be keyed to that list. */
  district: string;
  pull: PointFigure | NullFigure;
};

export type CityVoicesFigure = ProseFigureMeta & {
  quotes: CityQuote[];
};

/** Chapter 15, id `ch-15`. */
export type CityVoices = {
  operators: CityVoicesFigure | NullFigure;
};

/* ----------------------------- 16 the verdict ---------------------------- */

/** Chapter 16, id `ch-16`. The page's one paragraph of judgement plus the
 * chips beneath it. */
export type CityVerdict = {
  /** The judgement itself, place-specific, so authored. */
  text: string;
  /** The chips under the verdict. Each RESTATES a figure already in this file
   * in the page's own phrasing; a chip must never introduce a number that
   * appears nowhere else, because nothing would then carry its tier. */
  chips: string[];
};

/* -------------------------- 17 how we work it out ------------------------ */

/** One row of the method ledger: what the figure is, how solid it is, and
 * where it comes from in plain words. */
export type CityMethodRow = {
  /** The family of figures the row describes, e.g. "Rent by district". */
  figure: string;
  tier: Tier;
  /** How it is built, in plain words, safe to render. */
  how: string;
};

/** Chapter 17, id `ch-17`. The trust band's tier counts ("3 measured, 3 built,
 * 2 thin") are counted from these rows and have no fields of their own. */
export type CityMethodology = {
  rows: CityMethodRow[];
};

/* ------------------- the closing "remember" band ------------------------- */

/**
 * The unnumbered band between chapters 17 and 18. One sentence and one large
 * figure.
 *
 * The figure RESTATES one already printed earlier in the page (in the mockup,
 * commercial rent against the country). `figureSource` names the field it
 * restates so a checker can prove the two agree; the value must be copied from
 * that field, never re-derived independently.
 */
export type CityRemember = {
  text: string;
  figure: PointFigure | NullFigure;
  /** The line under the large figure, e.g. "the UK rent, for the same room". */
  figureLabel: string;
  /** Dotted path of the canonical field this restates, e.g.
   * "scorecard.commercialRent". */
  figureSource: string;
};

/* ------------------------- 18 where to go next --------------------------- */

/**
 * One onward tile.
 *
 * `gloss` is the small figure beside the label and it BELONGS TO THE LINKED
 * PAGE, not to this city: what a trade's owner keeps, what a peer city spends
 * per head, what a country takes. It is carried as an already-formatted string
 * because it is read from another file at build time and this file has no
 * authority over its unit or its tier.
 */
export type CityNextTile = {
  kind: "trade" | "districts" | "city" | "country";
  /** Trade slug, city slug, country slug, or a literal for the district hub. */
  slug: string;
  label: string;
  gloss: string;
  /** Optional glyph key from the shared icon set. Presentational. */
  icon?: string;
  /** Set only where the target page exists. A tile with no href renders as a
   * flat card, which is what the mockup does for pages not yet built. */
  href?: string;
};

/** Chapter 18, id `ch-18`. */
export type CityNext = {
  tiles: CityNextTile[];
};

/* ------------------------------- the file -------------------------------- */

/**
 * One city page, whole.
 *
 * Every chapter is required. The trust band at the foot of the page has no
 * field of its own: its four readings are all derived, from meta.reviewedAt,
 * people.residents, the length of districts.list, and the tier counts in
 * methodology.rows.
 */
export type CityFile = {
  meta: CityMeta;
  /** 01 */ hero: CityHero;
  /** 02 */ scorecard: CityScorecard;
  /** 03 */ incomeAndWealth: CityIncomeAndWealth;
  /** 04 */ visitors: CityVisitors;
  /** 05 */ people: CityPeople;
  /** 06 */ spaceCosts: CitySpaceCosts;
  /** 07 */ tradeEconomics: CityTradeEconomics;
  /** 08 and 10, one list rendered twice */ districts: CityDistricts;
  /** 09 */ tradeFit: CityTradeFit;
  /** 11 */ direction: CityDirection;
  /** 12 */ myths: CityMyths;
  /** 13 */ peers: CityPeers;
  /** 14 */ watch: CityWatch;
  /** 15 */ voices: CityVoices;
  /** 16 */ verdict: CityVerdict;
  /** 17 */ methodology: CityMethodology;
  /** the closing band */ remember: CityRemember;
  /** 18 */ next: CityNext;
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

/** Where the accent dot sits on the scorecard ruler is a DERIVED rule, not an
 * authored flag: the mockup marks a reading only when it lands in the top or
 * bottom tenth of the ruler. */
export function isScorecardExtreme(row: CityScorecardRow): boolean {
  return row.position >= 85 || row.position <= 15;
}

/** The trade the chapter-07 slope highlights: the one whose owner keeps most.
 * Derived, so no authored boolean can mark the wrong line. */
export function topKeepingTrade(rows: CityTradeRow[]): CityTradeRow | null {
  if (rows.length === 0) return null;
  return rows.reduce((best, r) => (r.ownerKeeps > best.ownerKeeps ? r : best));
}
