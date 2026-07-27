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

export type CellFile = {
  meta: CellMeta;
  population: CellPopulation;
  modelRoom: CellModelRoom;
  opening: CellOpening;
  seasonality: CellSeasonality;
  year1: CellYear1;
  comparisons: CellComparisons;
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
