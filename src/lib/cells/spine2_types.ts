/**
 * spine2_types.ts - the typed contract for a spine-2 cell data file.
 *
 * A cell file (data/cells/<trade>-in-<city>.json) is the hand-filled,
 * per-figure-provenanced data behind one trade-in-city page. The launch bar
 * (DECISIONS-PORT-AND-LAUNCH): the headline and the full cost stack must be
 * real; everything below can ship tagged. Every figure carries a tier, a
 * user-facing-safe basis sentence, and its GBP native alongside the USD
 * display value at one pinned rate.
 *
 * The central distinction this schema exists to hold:
 *   - `modelRoom` is the explicit modeled scenario (the 100 sqm room the
 *     calculator and cost stack describe). Built, internally exact, and NOT
 *     the typical room.
 *   - `population` is what the trade measurably does (median, quartiles,
 *     survival), from public registers.
 * The page may render both, typed distinctly, and must never let one borrow
 * the other's authority.
 *
 * Constraint-safe: basis strings never name a source agency (the gate
 * enforces this); `sources` are metadata only and are never rendered.
 */

/** Provenance tier. measured = published record. built = computed from
 * published inputs, arithmetic shown. thin = nobody publishes it, so a range
 * with a visible caveat. */
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

/** A single number, USD display with optional GBP native. */
export type PointFigure = FigureMeta & {
  value: number;
  gbp?: number;
};

/** A range, optionally with the point the headline takes. */
export type RangeFigure = FigureMeta & {
  lo: number;
  hi: number;
  taken?: number;
  gbp?: { lo: number; hi: number; taken?: number };
};

/** An ordered series (survival curve, seasonality, band counts). */
export type SeriesFigure = FigureMeta & {
  series: Array<{ x: number | string; value: number }>;
};

/** A claim-and-reality pair (the myth block). */
export type ClaimFigure = Omit<FigureMeta, "unit"> & {
  claim: string;
  reality: string;
};

/** An honest hole: no public counterpart exists. The reason is mandatory;
 * a labelled proxy may ride along. */
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
  | CityComparisonFigure
  | NullFigure;

/* -------------------------------- meta ---------------------------------- */

export type CellCurrency = {
  display: "USD";
  native: string;
  /** USD per one unit of native currency, pinned for the whole file. */
  usdPerGbp: number;
  rateAsOf: string;
  rateBasis: string;
};

export type CellMeta = {
  schema: "cell.spine2";
  schemaVersion: number;
  id: string;
  country: { slug: string; name: string };
  city: { slug: string; name: string };
  trade: { slug: string; name: string; noun: string };
  urlPath: string;
  currency: CellCurrency;
  freshness: string;
  reviewedAt: string;
  provenance?: {
    correctionsLedger?: string;
    familyDocs?: string[];
    correctionsApplied?: number[];
    correctionsOutOfScope?: Record<string, string>;
    freshnessWatch?: string[];
  };
};

/* ------------------------------ population ------------------------------ */

export type CellPopulation = {
  sites: PointFigure;
  enterprises: PointFigure;
  sitesIncludingTakeaways?: PointFigure;
  medianRevenue: PointFigure;
  medianRevenueRestaurantsAndCafes?: PointFigure;
  quartiles: {
    p25: PointFigure;
    p50: PointFigure;
    p75: PointFigure;
  };
  turnoverBands?: SeriesFigure;
  survival: SeriesFigure;
  survivalLondonCross?: NullFigure;
  myth: ClaimFigure;
  ownerPaidProperly: PointFigure;
  ordersPerDayAtMedian?: PointFigure;
};

/* ------------------------------ model room ------------------------------ */

export type RosterRole = {
  role: string;
  employment: "full time" | "part time";
  count: number;
  wage: PointFigure;
};

export type CellModelRoomStaff = {
  line: PointFigure;
  sharePct: PointFigure;
  roster: RosterRole[];
  rosterWages: PointFigure;
  rosterAllIn: PointFigure;
  headcount: RangeFigure;
  oncostsMarginalPct: RangeFigure;
  oncostsEffectivePct: PointFigure;
  wageFloor: PointFigure;
  churnPctPerYear: RangeFigure;
  churnCostPerYear: RangeFigure;
  recruitChefDirect: RangeFigure;
  recruitChefAgency: RangeFigure;
  weeksToFillChefRole: NullFigure;
};

export type CellModelRoomRent = {
  total: PointFigure;
  rent: PointFigure;
  rates: PointFigure;
  reviewCycleYears: PointFigure;
  reviewStressPct: PointFigure;
  shareOfRevenueQuartileSpread: RangeFigure;
  depositAndFirstRent: RangeFigure;
};

export type CellModelRoom = {
  description: string;
  floorAreaSqm: PointFigure;
  percentileOfPopulation: PointFigure;
  assumptions: {
    ordersPerDay: PointFigure;
    spendPerHead: PointFigure;
    openDaysPerYear: PointFigure;
  };
  revenue: PointFigure;
  food: {
    pct: PointFigure;
    cost: PointFigure;
    allPurchasesPct: PointFigure;
  };
  staff: CellModelRoomStaff;
  rentAndRates: CellModelRoomRent;
  running: {
    pct: PointFigure;
    total: PointFigure;
    energyPerKwh: PointFigure;
  };
  ownerKeeps: RangeFigure;
  dailyFloor: {
    committedCostPerOpenDay: PointFigure;
    breakevenTakings: PointFigure;
    paysTarget95kTakings: PointFigure;
  };
};

/* ------------------------------- opening -------------------------------- */

export type CellOpening = {
  fitout: RangeFigure;
  fitoutBandFloor?: PointFigure;
  kitchenPackage: RangeFigure;
  depositAndFirstRent: RangeFigure;
  openingStock: RangeFigure;
  companyRegistration: PointFigure;
  foodBusinessRegistration: PointFigure;
  licence: RangeFigure;
  insuranceYear1: RangeFigure;
  total: PointFigure;
};

/* ---------------------------- remaining spine ---------------------------- */

export type CellSeasonality = {
  monthlyIndex: SeriesFigure | NullFigure;
};

export type CellYear1 = {
  openingCosts: PointFigure;
  tradeBuildLosses: PointFigure;
  cashBeforeOpen: PointFigure;
  deepestHoleMonth: PointFigure;
  breakevenMonth: PointFigure;
  paybackYears: PointFigure;
};

/** One peer row in the cross-city comparison table (cell 13, "the same
 * trade in other cities"): the mockup's five columns, plus `citySlug` to
 * identify which place the row is. This is an IDENTIFIER, not an accent
 * flag (PORT-CONTRACT M5): it says which city a row names, never which row
 * is "you". The adapter derives that by matching `citySlug` against
 * `meta.city.slug`, so an authored boolean can never mark the wrong row. */
export type CityPeerRow = {
  city: string;
  citySlug: string;
  revenue: number;
  ownerKeeps: number;
  per10kPeople: number;
  breakIn: string;
};

/** The cross-city comparison figure. Ships only once peer cities have their
 * own cell files, built the same way as this one; until then this stays a
 * NullFigure and the chapter self-omits. */
export type CityComparisonFigure = FigureMeta & {
  cities: CityPeerRow[];
};

export type CellComparisons = {
  cities: CityComparisonFigure | NullFigure;
};

/* ------------------------------- the file ------------------------------- */

/* ------------------------------- subtypes -------------------------------- */

/**
 * HOW OFTEN A REGULAR COMES BACK. A BAND, PER SUBTYPE, NEVER A NUMBER AND
 * NEVER ABOUT A SPECIFIC BUSINESS.
 *
 * Ratified 2026-07-31, decision 12. The founder raised this mechanism and
 * flagged its own contradiction in the same breath: repeat frequency is partly
 * a property of the kind of business and partly of the individual one, and only
 * the first is publishable. "A fast-food counter sees a regular several times a
 * month" is true of the type and unfalsifiable by any single shop. "This
 * restaurant's customers return 18 times a year" is a claim about a business we
 * have never observed.
 *
 * So it is banded, like district wealth, and for the same reason: the ordering
 * is real and the decimal is not.
 */
export type RepeatBand =
  | "weekly-or-more"
  | "monthly"
  | "few-times-a-year"
  | "rarely";

export const REPEAT_BANDS = [
  "weekly-or-more",
  "monthly",
  "few-times-a-year",
  "rarely",
] as const;

/**
 * One kind of business within a trade, in one city.
 *
 * THE PROBLEM THIS EXISTS TO SOLVE, in the founder's words: "for a person
 * opening a Middle Eastern fast food in London, giving him the average of
 * restaurants is not that smart." Every figure on a trade page is an average
 * across subtypes that behave nothing alike. Averaging a kebab counter with a
 * tasting menu produces a number that describes neither, and the subtype is the
 * unit the operator actually is.
 *
 * THE LIST IS PER CITY, and that is deliberate: Istanbul and Oslo do not have
 * the same ten kinds of restaurant. A global list would name sushi in a city
 * with none and miss what the city actually has.
 *
 * THE FIVE FACTS were chosen by the founder, four offered and one he added.
 * `fitOut` is his: what it costs to furnish, equip and stock the place before
 * opening. It is the number that separates a kebab counter from a tasting room
 * more sharply than anything else here, and it is the one an owner most often
 * discovers too late.
 */
export type CellSubtype = {
  slug: string;
  name: string;
  /** How many people it takes to run one, typical. */
  staff: PointFigure | NullFigure;
  /** What one customer spends per visit, typical. */
  orderValue: PointFigure | NullFigure;
  /** How often a regular returns. Banded; see RepeatBand. */
  repeat: RepeatBand;
  /** Floor area a typical one occupies. Combined with district rent this gives
   * a real standing cost rather than a generic one. */
  space: PointFigure | NullFigure;
  /** Furniture, equipment and opening stock, before the doors open. The
   * founder's addition. */
  fitOut: PointFigure | NullFigure;
};

/**
 * Chapter placement is NOT decided here. The founder ruled that the trade
 * average stays the headline and subtypes sit right below it (decision 11), but
 * inserting a chapter at position two would renumber every anchor below it, and
 * the ratified mockups carry the same `ch-NN` scheme. The mockups and the React
 * kit are two artifacts and desynchronising them has cost this project twice.
 * So the mechanism lands here, in the data layer, and where it renders is a
 * review artifact.
 */
export type CellSubtypesFigure = FigureMeta & {
  /** At most ten, and fewer for trades that genuinely have fewer. The founder
   * set the cap and refused a fixed number: "depending on the trade, not more
   * than 10". */
  rows: CellSubtype[];
};

export type CellFile = {
  meta: CellMeta;
  population: CellPopulation;
  modelRoom: CellModelRoom;
  opening: CellOpening;
  seasonality: CellSeasonality;
  year1: CellYear1;
  comparisons: CellComparisons;
  /** Ratified 2026-07-31, decisions 9 to 12. Most cells will hold a NullFigure
   * for a long time, which is the intended state: the page still renders the
   * section and states that this city's subtypes are not filled yet. */
  subtypes: CellSubtypesFigure | NullFigure;
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

/** The headline number a figure contributes: the taken point of a range,
 * else the point value. Null figures contribute nothing. */
export function figureValue(f: PointFigure | RangeFigure): number {
  return isRangeFigure(f) ? (f.taken ?? (f.lo + f.hi) / 2) : f.value;
}
