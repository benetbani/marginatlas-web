/**
 * src/lib/cells/spine2_adapter.ts
 *
 * CellFile -> page props. Every number the spine-2 cell page renders comes
 * through here, and nothing else is allowed to reach into the JSON.
 *
 * Three rules this file exists to hold:
 *
 * 1. TIER AND NULL HANDLING LIVES HERE (PORT-CONTRACT M9). A figure whose
 *    value is null yields `null` props, and the chapter that depended on it
 *    is `null` in the model, so the page renders no frame at all. No
 *    component ever sees a dash, a zero standing in for a hole, or an empty
 *    section header.
 *
 * 2. DERIVED, NEVER TYPED (M5/M7). Shares, per-head cascades, leverage
 *    ranks, the tier tally, the assumed fit-out, the distribution curve: all
 *    computed from the file's own figures, so a caption cannot describe a
 *    number the render does not draw. The only hand-written strings here are
 *    labels and the provenance one-liners.
 *
 * 3. MODEL AND POPULATION STAY TYPED APART. `modelRoom` is the explicit
 *    scenario; `population` is what the trade measurably does. The hero
 *    states which is which and carries both; nothing borrows the other's
 *    authority.
 */
import type {
  CellFile,
  CityPeerRow,
  PointFigure,
  RangeFigure,
  SeriesFigure,
  Tier,
} from "./spine2_types";
import { figureValue, isNullFigure } from "./spine2_types";

/* ------------------------------------------------------------------ */
/* the distribution block, an additive extension of the cell file      */
/* ------------------------------------------------------------------ */

/**
 * The owner-take-home distribution's own constants. They live in the JSON
 * (modelRoom.distribution) because the page store must not carry magic
 * numbers; the curve's exponent and span are DERIVED from these two anchors
 * plus percentileOfPopulation and ownerPaidProperly, so the fit can never
 * drift from the figures it is pinned to.
 */
export type DistributionBlock = {
  unit: string;
  tier: Tier;
  basis: string;
  freshness: string;
  fromModel?: boolean;
  /** The worst room's yearly keep, a loss. */
  floor: number;
  /** What "pays its owner properly" means in money. */
  properlyPaidThreshold: number;
  /** Rooms in the modelled population. */
  sampleSize: number;
};

type CellFileWithDistribution = CellFile & {
  modelRoom: CellFile["modelRoom"] & { distribution?: DistributionBlock };
};

/* ------------------------------------------------------------------ */
/* formatting                                                          */
/* ------------------------------------------------------------------ */

const MINUS = "−";

/** Headline money in the page's grammar: $618K, $1.1M, $693K, $133. */
export function money(n: number | null | undefined): string | null {
  if (n == null || !Number.isFinite(n)) return null;
  const sign = n < 0 ? MINUS : "";
  const a = Math.abs(n);
  if (a >= 1e6) return `${sign}$${trim((a / 1e6).toFixed(2))}M`;
  if (a >= 1e3) return `${sign}$${Math.round(a / 1e3)}K`;
  return `${sign}$${Math.round(a)}`;
}

/** Money that keeps a decimal below ten thousand: $6.2K, $2.9K, $29K. */
export function moneyFine(n: number | null | undefined): string | null {
  if (n == null || !Number.isFinite(n)) return null;
  const sign = n < 0 ? MINUS : "";
  const a = Math.abs(n);
  if (a >= 1e6) return `${sign}$${trim((a / 1e6).toFixed(2))}M`;
  if (a >= 1e4) return `${sign}$${Math.round(a / 1e3)}K`;
  if (a >= 1e3) return `${sign}$${trim((a / 1e3).toFixed(1))}K`;
  return `${sign}$${Math.round(a)}`;
}

/** Split for the Fig atom's small unit suffix: 618488 -> {"$618","K"}. */
export function moneyParts(
  n: number | null | undefined,
): { value: string; unit?: string } | null {
  const s = money(n);
  if (s == null) return null;
  const m = s.match(/^(.*?)(K|M)$/);
  return m ? { value: m[1], unit: m[2] } : { value: s };
}

export function moneyFineParts(
  n: number | null | undefined,
): { value: string; unit?: string } | null {
  const s = moneyFine(n);
  if (s == null) return null;
  const m = s.match(/^(.*?)(K|M)$/);
  return m ? { value: m[1], unit: m[2] } : { value: s };
}

/** "93 to 353" with a shared K suffix, the mockup's range grammar. */
function rangeK(lo: number, hi: number): { value: string; unit: string } {
  const f = (v: number) => (v >= 2e4 ? String(Math.round(v / 1e3)) : trim((v / 1e3).toFixed(1)));
  return { value: `${f(lo)} to ${f(hi)}`, unit: "K" };
}

function trim(s: string): string {
  return s.replace(/\.?0+$/, "");
}

function pct1(n: number): string {
  return `${trim(n.toFixed(1))}`;
}

/* ------------------------------------------------------------------ */
/* chapter model                                                       */
/* ------------------------------------------------------------------ */

export type ChapterId =
  | "hero"
  | "calculator"
  | "keep"
  | "bill"
  | "day"
  | "money"
  | "floor"
  | "team"
  | "opening"
  | "year"
  | "firstYear"
  | "survival"
  | "cities"
  | "voices"
  | "watch"
  | "world"
  | "verdict"
  | "method"
  | "words"
  | "questions"
  | "next";

/** A row the page renders through Statblock. */
export type Row = {
  icon?: string;
  label: string;
  sub?: string;
  value: string | null;
  unit?: string;
  answer?: boolean;
};

/** The one piece of state the page holds, and everything it drives. */
export type CellStoreModel = {
  /** staff + rent and rates + running costs, the yearly bill that does not move. */
  fixed: number;
  /** What one dollar of takings contributes after food. */
  contrib: number;
  /** The default pay-yourself target and its slider bounds. */
  target: number;
  targetMin: number;
  targetMax: number;
  targetStep: number;
  /** The take-home distribution: pay(rank) = floor + span * rank^curve. */
  floor: number;
  span: number;
  curve: number;
  sampleSize: number;
  /** The measured spread the hero's bar draws. */
  p25: number;
  p75: number;
  medianRevenue: number;
  modelRevenue: number;
  /** The daily floor's own inputs. */
  committedPerDay: number;
  openDays: number;
};

export type HeroModel = {
  crumb: { trade: string; city: string; country: string };
  title: string;
  sites: number;
  medianRevenue: string;
  modelRevenue: string;
  floorAreaSqm: number;
  percentile: number;
  topShare: number;
  panelRows: Row[];
  reviewedAt: string;
  tierLine: string;
};

export type CalculatorModel = {
  days: number;
  vars: Array<{
    id: string;
    kind: "volume" | "price" | "pct" | "fixed";
    label: string;
    glyph: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    format: "int" | "usd" | "pct" | "money";
    leverage:
      | { kind: "pct"; pct: number; direction: "up" | "down"; noun: string }
      | { kind: "abs"; amount: number; direction: "up" | "down"; noun: string };
  }>;
  notes: Array<{ below: number; say: string }>;
  publishedOwnerKeeps: number;
  trade: string;
};

export type KeepModel = {
  rentTopQuarterPct: number;
  rentBottomQuarterPct: number;
  differenceOnRevenue: string;
  modelRevenue: string;
  rows: Row[];
};

export type BillModel = {
  spendPerHead: number;
  stages: Array<{ label: string; sub: string; remaining: number }>;
  plainWords: Array<{ index: string; title: string; sub: string }>;
};

export type DayModel = {
  ordersPerDay: number;
  ordersOf: number;
  spendPerHead: number;
  spendOf: number;
  daysAWeek: number;
};

export type MoneyModel = {
  segments: Array<{ label: string; value: number; display: string; kept?: boolean }>;
  keepLoPct: number;
  keepHiPct: number;
  rows: Row[];
  modelRevenue: string;
};

export type FloorModel = {
  committedPerDay: number;
  breakevenPerDay: number;
  committedDisplay: string;
  breakevenDisplay: string;
  foodCents: number;
  rows: Row[];
};

export type TeamModel = {
  roles: Array<{ label: string; wage: number; count?: number; partTime?: boolean }>;
  contribPct: number;
  lineCookWage: number | null;
  lineCookAllIn: number | null;
  headcountLo: number;
  headcountHi: number;
  staffLine: string;
  rows: Row[];
};

export type OpeningModel = {
  rows: Array<{ id: string; label: string; value?: number; range?: [number, number]; display: string }>;
  total: { label: string; value: number; display: string };
  assumedFitout: string;
  sideRows: Row[];
};

export type YearModel = {
  months: number[];
  seasonRows: Row[];
};

export type FirstYearModel = {
  cashBeforeOpen: number;
  cashBeforeOpenDisplay: string;
  halfDisplay: string;
  deepestMonth: number;
  breakevenMonth: number;
  spanMonths: number;
  rows: Row[];
};

export type SurvivalModel = {
  claim: string;
  reality: string;
  stages: Array<{ label: string; remaining: number }>;
  late: Array<{ index: string; title: string; sub: string }>;
};

/** One table row for the cross-city comparison (cell 13), figures already
 * formatted in the page's money grammar; `ownerKeepsValue` stays a raw
 * number too, since the strip positions its dot by value, not by string.
 * `isCurrent` is set by `buildCities`, derived from a slug match, never
 * read off the source row (M5). */
export type CityRow = {
  city: string;
  revenueDisplay: string;
  ownerKeepsValue: number;
  ownerKeepsDisplay: string;
  per10kPeople: number;
  breakIn: string;
  isCurrent: boolean;
};

export type CitiesModel = {
  rows: CityRow[];
};

export type WatchModel = {
  shocks: Array<{ q: string; sub: string; answer: string; bite: boolean }>;
  bitesBelowWage: number;
  wageRung: string;
  you: string[];
  not: string[];
};

export type VerdictModel = {
  keptCents: number;
  chips: Array<{ glyph: string; figureId: string }>;
};

export type MethodModel = {
  arithmetic: Array<{ label: string; detail?: string; value: number; kind: "start" | "sub" | "result" }>;
  ledger: Array<{ label: string; tier: Tier | null; how: string | null }>;
};

export type BandModel = {
  takeaway: string;
  figure: string;
  figureSub: string;
};

export type CellPageModel = {
  meta: {
    id: string;
    title: string;
    urlPath: string;
    country: { slug: string; name: string };
    city: { slug: string; name: string };
    trade: { slug: string; name: string; noun: string };
    reviewedAt: string;
    freshnessLabel: string;
  };
  store: CellStoreModel;
  figures: Record<string, string>;
  /** The chapters that actually render, in spine order, renumbered with no holes. */
  chapters: Array<{ id: ChapterId; num: string; title: string; icon: string; anchor: string }>;
  trust: { sites: number; tierLine: string; reviewedAt: string };
  band: BandModel;
  hero: HeroModel | null;
  calculator: CalculatorModel | null;
  keep: KeepModel | null;
  bill: BillModel | null;
  day: DayModel | null;
  money: MoneyModel | null;
  floor: FloorModel | null;
  team: TeamModel | null;
  opening: OpeningModel | null;
  year: YearModel | null;
  firstYear: FirstYearModel | null;
  survival: SurvivalModel | null;
  cities: CitiesModel | null;
  voices: null;
  watch: WatchModel | null;
  world: null;
  verdict: VerdictModel | null;
  method: MethodModel | null;
  words: Array<{ glyph: string; term: string; plain: string }> | null;
  questions: Array<{ q: string; a: string }> | null;
  next: Array<{ glyph: string; label: string; figure: string | null; href?: string }> | null;
};

/* ------------------------------------------------------------------ */
/* small readers                                                       */
/* ------------------------------------------------------------------ */

function pointOf(f: PointFigure | undefined): number | null {
  if (f == null || !Number.isFinite(f.value)) return null;
  return f.value;
}

function takenOf(f: RangeFigure | undefined): number | null {
  if (f == null) return null;
  const v = figureValue(f);
  return Number.isFinite(v) ? v : null;
}

function seriesAt(f: SeriesFigure | undefined, x: number | string): number | null {
  if (f == null) return null;
  const hit = f.series.find((s) => s.x === x);
  return hit != null && Number.isFinite(hit.value) ? hit.value : null;
}

/* ------------------------------------------------------------------ */
/* the spine, in order                                                 */
/* ------------------------------------------------------------------ */

const SPINE: Array<{ id: ChapterId; title: string; icon: string }> = [
  { id: "hero", title: "The answer", icon: "trade-restaurant" },
  { id: "calculator", title: "Calculator", icon: "calculator" },
  { id: "keep", title: "What owners actually keep", icon: "owner-keeps" },
  { id: "bill", title: "Where a bill goes", icon: "worked-example" },
  { id: "day", title: "A normal day", icon: "freshness" },
  { id: "money", title: "Where the money goes", icon: "cost-breakdown" },
  { id: "floor", title: "What you must take each day", icon: "break-even" },
  { id: "team", title: "What a team costs", icon: "min-wage" },
  { id: "opening", title: "What it costs to open", icon: "raise-money" },
  { id: "year", title: "Through the year", icon: "seasonality" },
  { id: "firstYear", title: "Your first year", icon: "first-year" },
  { id: "survival", title: "Business survival, year by year", icon: "myth-reality" },
  { id: "cities", title: "The same trade in other cities", icon: "compare" },
  { id: "voices", title: "What operators say", icon: "operator-voices" },
  { id: "watch", title: "What to watch", icon: "watch" },
  { id: "world", title: "Versus the world", icon: "vs-world" },
  { id: "verdict", title: "The verdict", icon: "honest-take" },
  { id: "method", title: "How we work this out", icon: "methodology" },
  { id: "words", title: "What these words mean", icon: "search" },
  { id: "questions", title: "Questions people ask", icon: "who-for" },
  { id: "next", title: "Where to go next", icon: "where-it-pays" },
];

/* ------------------------------------------------------------------ */
/* the build                                                           */
/* ------------------------------------------------------------------ */

/**
 * THE TWO WIDER PAGES THIS CELL CAN OPEN, ALREADY RESOLVED.
 *
 * Required, not optional, and passed in rather than worked out here. Both
 * halves of that are deliberate.
 *
 * Passed IN because deciding whether a place has a page means reading the
 * site's route tables, and the module that owns that decision reaches the
 * database. This adapter is a pure CellFile-to-props transformer that server
 * components import for their types and for `money`, so dragging a data client
 * into its graph to answer a routing question would be paying a large
 * structural cost for a lookup the route has already performed.
 *
 * REQUIRED because the alternative fails open. An optional argument lets a
 * future caller build this page without resolving anything, and the failure
 * mode of that is not a missing door, it is a WRONG one: the slug the cell
 * file carries for a city is often also the slug of a region, so the assembled
 * two-segment form frequently answers 200 with a different place's data. Made
 * required, a caller that has not resolved the doors does not compile.
 *
 * Null on either field is a real answer and means the tile is not built.
 */
export type CellPageDoors = {
  /** This city's own page, or null when none is published. */
  geoPage: { href: string } | null;
  /** This country's page, or null when its statistical code has no route. */
  countryPage: { href: string } | null;
};

export function buildCellPage(
  cellFile: CellFile,
  doors: CellPageDoors,
): CellPageModel {
  const cell = cellFile as CellFileWithDistribution;
  const M = cell.modelRoom;
  const P = cell.population;

  /* ---- the five model lines, and everything that falls out of them ---- */
  const revenue = pointOf(M.revenue);
  const foodPct = pointOf(M.food.pct);
  const foodCost = pointOf(M.food.cost);
  const staffLine = pointOf(M.staff.line);
  const rentTotal = pointOf(M.rentAndRates.total);
  const runningTotal = pointOf(M.running.total);
  const keepTaken = takenOf(M.ownerKeeps);
  const keepHi = M.ownerKeeps?.hi ?? null;

  const modelIntact =
    revenue != null &&
    revenue > 0 &&
    foodPct != null &&
    foodCost != null &&
    staffLine != null &&
    rentTotal != null &&
    runningTotal != null &&
    keepTaken != null;

  const fixed = modelIntact ? staffLine! + rentTotal! + runningTotal! : 0;
  const contrib = modelIntact ? 1 - foodPct! / 100 : 0;
  const share = (n: number) => (revenue! > 0 ? (n / revenue!) * 100 : 0);

  const openDays = pointOf(M.assumptions.openDaysPerYear);
  const spendPerHead = pointOf(M.assumptions.spendPerHead);
  const ordersPerDay = pointOf(M.assumptions.ordersPerDay);

  const medianRevenue = pointOf(P.medianRevenue);
  const p25 = pointOf(P.quartiles?.p25);
  const p75 = pointOf(P.quartiles?.p75);
  const sites = pointOf(P.sites);
  const percentile = pointOf(M.percentileOfPopulation);
  const paidProperly = pointOf(P.ownerPaidProperly);

  /* ---- the distribution, fitted to the file's own two anchors ---- */
  const dist = M.distribution;
  const store = buildStore({
    dist,
    fixed,
    contrib,
    keepTaken,
    percentile,
    paidProperly,
    p25,
    p75,
    medianRevenue,
    modelRevenue: revenue,
    committedPerDay: pointOf(M.dailyFloor?.committedCostPerOpenDay),
    openDays,
  });

  /* ---- the calculator, calibrated on the file's own take-home ---- */
  const calculator: CalculatorModel | null =
    modelIntact && openDays != null && spendPerHead != null && ordersPerDay != null
      ? {
          trade: `${cell.meta.trade.noun}, ${cell.meta.city.name}`,
          days: openDays,
          publishedOwnerKeeps: keepTaken!,
          vars: [
            {
              id: "vol",
              kind: "volume",
              label: "Orders a day",
              glyph: "unit-economics",
              min: 30,
              max: 90,
              step: 2,
              defaultValue: ordersPerDay,
              format: "int",
              leverage: { kind: "abs", amount: 5, direction: "up", noun: "orders a day" },
            },
            {
              id: "price",
              kind: "price",
              label: "Average spend",
              glyph: "spending-power",
              min: 22,
              max: 70,
              step: 2,
              defaultValue: spendPerHead,
              format: "usd",
              leverage: { kind: "abs", amount: 2, direction: "up", noun: "a head" },
            },
            {
              id: "food",
              kind: "pct",
              label: "Food and drink",
              glyph: "trade-grocery",
              min: 22,
              max: 40,
              step: 1,
              defaultValue: foodPct!,
              format: "pct",
              leverage: { kind: "abs", amount: 2, direction: "down", noun: "food cost" },
            },
            {
              id: "staff",
              kind: "fixed",
              label: "Staff cost",
              glyph: "staffing-rota",
              min: 150000,
              max: 290000,
              step: 5000,
              defaultValue: staffLine!,
              format: "money",
              leverage: { kind: "pct", pct: 5, direction: "down", noun: "the rota" },
            },
            {
              id: "rent",
              kind: "fixed",
              label: "Rent and rates",
              glyph: "commercial-rent",
              min: 40000,
              max: 130000,
              step: 2000,
              defaultValue: rentTotal!,
              format: "money",
              leverage: { kind: "pct", pct: 10, direction: "down", noun: "the rent you sign" },
            },
            {
              id: "run",
              kind: "fixed",
              label: "Running costs",
              glyph: "cost-breakdown",
              min: 55000,
              max: 135000,
              step: 2000,
              defaultValue: runningTotal!,
              format: "money",
              leverage: { kind: "pct", pct: 5, direction: "down", noun: "running costs" },
            },
          ],
          notes: [
            { below: 0, say: "this room loses money; the rent or the orders have to move" },
            { below: 30000, say: "below a real wage, you are buying yourself a hard job" },
            { below: 70000, say: "a wage, but less than your head chef earns" },
            { below: 120000, say: "a genuinely good living, top third of the trade" },
            { below: Number.POSITIVE_INFINITY, say: "exceptional, the very top of London" },
          ],
        }
      : null;

  /* ---- 18, the method: the ledger drives the trust tally ---- */
  const method: MethodModel | null = modelIntact
    ? {
        arithmetic: [
          {
            kind: "start",
            label: "Revenue",
            detail: `${ordersPerDay} orders × $${spendPerHead} × ${openDays} days`,
            value: revenue!,
          },
          { kind: "sub", label: `less food and drink, ${Math.round(share(foodCost!))}%`, value: -foodCost! },
          { kind: "sub", label: `less staff, ${Math.round(share(staffLine!))}%`, value: -staffLine! },
          { kind: "sub", label: "less rent and rates", value: -rentTotal! },
          { kind: "sub", label: `less running costs, ${Math.round(share(runningTotal!))}%`, value: -runningTotal! },
          { kind: "result", label: "What the owner keeps", value: keepTaken! },
        ],
        ledger: ledgerRows(cell),
      }
    : null;

  const tally = tierTallyOf(method?.ledger ?? []);
  const tierLine = tierSentence(tally);

  /* ---- 01, the hero: model first, the measured room beside it ---- */
  const hero: HeroModel | null =
    modelIntact && medianRevenue != null && sites != null && percentile != null
      ? {
          crumb: {
            trade: cell.meta.trade.name,
            city: cell.meta.city.name,
            country: cell.meta.country.name,
          },
          title: `Opening a ${cell.meta.trade.noun} in ${cell.meta.city.name}`,
          sites,
          medianRevenue: money(medianRevenue)!,
          modelRevenue: money(revenue)!,
          floorAreaSqm: pointOf(M.floorAreaSqm) ?? 0,
          percentile,
          topShare: 100 - percentile,
          reviewedAt: freshnessLabel(cell.meta.freshness),
          tierLine,
          panelRows: [
            {
              label: "Revenue a year",
              sub: "the room this page models",
              ...split(moneyParts(revenue)),
            },
            {
              label: "The owner keeps",
              answer: true,
              ...split(moneyParts(keepTaken)),
            },
            {
              label: "Typical room",
              sub: "the whole trade",
              ...split(moneyParts(medianRevenue)),
            },
            {
              label: "Cash before you open",
              ...split(moneyParts(pointOf(cell.year1?.cashBeforeOpen))),
            },
          ],
        }
      : null;

  /* ---- 03, the hundred ---- */
  const spread = M.rentAndRates.shareOfRevenueQuartileSpread;
  const keepChapter: KeepModel | null =
    modelIntact && store != null && spread != null && Number.isFinite(spread.lo) && Number.isFinite(spread.hi)
      ? {
          rentTopQuarterPct: spread.lo,
          rentBottomQuarterPct: spread.hi,
          differenceOnRevenue: money(((spread.hi - spread.lo) / 100) * revenue!)!,
          modelRevenue: money(revenue)!,
          rows: [
            {
              label: "Rent, top quarter",
              sub: "of revenue",
              value: pct1(spread.lo),
              unit: "%",
            },
            {
              label: "Rent, bottom quarter",
              sub: "same measure",
              value: pct1(spread.hi),
              unit: "%",
            },
            {
              label: `The difference, on ${money(revenue)}`,
              answer: true,
              ...split(moneyParts(((spread.hi - spread.lo) / 100) * revenue!)),
            },
          ],
        }
      : null;

  /* ---- 04, the bill, per head ---- */
  const bill: BillModel | null =
    modelIntact && spendPerHead != null
      ? (() => {
          const s = spendPerHead;
          const afterFoodStaff = s * (1 - share(foodCost!) / 100 - share(staffLine!) / 100);
          const afterRunning = afterFoodStaff - (s * share(runningTotal!)) / 100;
          const afterRent = afterRunning - (s * share(rentTotal!)) / 100;
          const f = (v: number) => (v >= 10 ? `$${Math.round(v)}` : `$${v.toFixed(2)}`);
          return {
            spendPerHead: s,
            stages: [
              { label: "A guest spends", sub: f(s), remaining: s },
              { label: "After food and staff", sub: `${f(afterFoodStaff)} left`, remaining: afterFoodStaff },
              { label: "After running costs", sub: `${f(afterRunning)} left`, remaining: afterRunning },
              { label: "After rent and rates", sub: `${f(afterRent)} is yours`, remaining: afterRent },
            ],
            plainWords: [
              {
                index: "01",
                title: "Two businesses in one room",
                sub: "A kitchen and a floor full of staff, and both get paid before you do.",
              },
              {
                index: "02",
                title: "Food is about a third of every bill",
                sub: "The one cost you can move week to week.",
              },
              {
                index: "03",
                title: "People are about another third",
                sub: "Set by the menu: more dishes means more chefs.",
              },
              {
                index: "04",
                title: "The last third pays for everything else",
                sub: "Space, power, insurance, cards, marketing. What survives is yours.",
              },
            ],
          };
        })()
      : null;

  /* ---- 05, a normal day ---- */
  const volVar = calculator?.vars.find((v) => v.id === "vol");
  const priceVar = calculator?.vars.find((v) => v.id === "price");
  const day: DayModel | null =
    ordersPerDay != null && spendPerHead != null && openDays != null && volVar != null && priceVar != null
      ? {
          ordersPerDay,
          ordersOf: volVar.max,
          spendPerHead,
          spendOf: priceVar.max,
          daysAWeek: Math.round(openDays / (365 / 7)),
        }
      : null;

  /* ---- 06, where the money goes ---- */
  const moneyChapter: MoneyModel | null = modelIntact
    ? {
        modelRevenue: money(revenue)!,
        keepLoPct: share(keepTaken!),
        keepHiPct: keepHi != null ? share(keepHi) : share(keepTaken!),
        segments: [
          { label: "Staff", value: share(staffLine!), display: `${Math.round(share(staffLine!))}%` },
          { label: "Food and drink", value: share(foodCost!), display: `${Math.round(share(foodCost!))}%` },
          { label: "Rent and rates", value: share(rentTotal!), display: `${Math.round(share(rentTotal!))}%` },
          { label: "Running costs", value: share(runningTotal!), display: `${Math.round(share(runningTotal!))}%` },
          { label: "You keep", value: share(keepTaken!), display: `${Math.round(share(keepTaken!))}%`, kept: true },
        ],
        rows: [
          {
            icon: "supplier",
            label: "1% off food cost",
            sub: `on ${money(revenue)}`,
            ...split(moneyFineParts(revenue! * 0.01)),
          },
          {
            icon: "staffing-rota",
            label: "1% off staff cost",
            ...split(moneyFineParts(revenue! * 0.01)),
          },
          {
            icon: "sale-tag",
            label: "5% price rise",
            sub: "food follows it up",
            ...split(moneyFineParts(revenue! * 0.05 * contrib)),
          },
          {
            label: "Both cost lines, 2% each",
            answer: true,
            ...split(moneyFineParts(revenue! * 0.04)),
          },
        ],
      }
    : null;

  /* ---- 07, the daily floor ---- */
  const committed = pointOf(M.dailyFloor?.committedCostPerOpenDay);
  const breakeven = pointOf(M.dailyFloor?.breakevenTakings);
  const floor: FloorModel | null =
    modelIntact && committed != null && breakeven != null && calculator != null
      ? {
          committedPerDay: committed,
          breakevenPerDay: breakeven,
          committedDisplay: `$${committed.toLocaleString("en-US")}`,
          breakevenDisplay: `$${breakeven.toLocaleString("en-US")}`,
          foodCents: Math.round(share(foodCost!)),
          rows: leverageRows(calculator),
        }
      : null;

  /* ---- 08, the team ---- */
  const effective = pointOf(M.staff.oncostsEffectivePct);
  const marginalLo = M.staff.oncostsMarginalPct?.lo ?? null;
  const marginalHi = M.staff.oncostsMarginalPct?.hi ?? null;
  const cook = M.staff.roster?.find((r) => /cook/i.test(r.role));
  const team: TeamModel | null =
    effective != null && M.staff.roster != null && M.staff.roster.length >= 2
      ? {
          contribPct: effective,
          roles: M.staff.roster.map((r) => ({
            label: r.role.replace(/,?\s*part time[^,]*/i, "").replace(/\s*x\d+$/i, "").trim(),
            wage: r.count > 1 ? r.wage.value / r.count : r.wage.value,
            count: r.count,
            partTime: r.employment === "part time",
          })),
          lineCookWage: cook ? cook.wage.value : null,
          lineCookAllIn: cook ? cook.wage.value * (1 + effective / 100) : null,
          headcountLo: M.staff.headcount?.lo ?? 0,
          headcountHi: M.staff.headcount?.hi ?? 0,
          staffLine: money(staffLine) ?? "",
          rows: teamRows(cell, effective, marginalLo, marginalHi),
        }
      : null;

  /* ---- 09, what it costs to open ---- */
  const opening = buildOpening(cell);

  /* ---- 10, through the year ---- */
  const monthly = cell.seasonality?.monthlyIndex;
  const year: YearModel | null =
    monthly != null && !isNullFigure(monthly) && "series" in monthly && monthly.series.length === 12
      ? (() => {
          const months = monthly.series.map((s) => s.value);
          const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
          const peakIdx = months.indexOf(Math.max(...months));
          const troughIdx = months.indexOf(Math.min(...months));
          return {
            months,
            seasonRows: [
              {
                label: MONTHS[peakIdx],
                sub: "the peak",
                value: String(Math.round(months[peakIdx])),
                answer: true,
              },
              { label: "Autumn, Sep to Nov", value: String(Math.round(avg(months.slice(8, 11)))) },
              { label: "Summer, Jun to Aug", value: String(Math.round(avg(months.slice(5, 8)))) },
              {
                label: `${MONTHS[0]} and ${MONTHS[1]}`,
                sub: `the trough, lowest in ${MONTHS[troughIdx]}`,
                value: String(Math.round(avg(months.slice(0, 2)))),
              },
            ],
          };
        })()
      : null;

  /* ---- 11, the first year ---- */
  const Y = cell.year1;
  const cashBeforeOpen = pointOf(Y?.cashBeforeOpen);
  const deepestMonth = pointOf(Y?.deepestHoleMonth);
  const breakevenMonth = pointOf(Y?.breakevenMonth);
  const payback = pointOf(Y?.paybackYears);
  const firstYear: FirstYearModel | null =
    cashBeforeOpen != null && deepestMonth != null && breakevenMonth != null
      ? {
          cashBeforeOpen,
          cashBeforeOpenDisplay: money(cashBeforeOpen)!,
          halfDisplay: money(cashBeforeOpen / 2)!,
          deepestMonth,
          breakevenMonth,
          spanMonths: Math.max(12, Math.ceil(breakevenMonth + 2)),
          rows: [
            {
              icon: "bank",
              label: "Cash you need on opening day",
              ...split(moneyParts(cashBeforeOpen)),
            },
            {
              icon: "raise-money",
              label: "Deepest you go into the hole",
              ...split(moneyParts(-cashBeforeOpen)),
            },
            {
              icon: "break-even",
              label: "Month you stop losing money",
              value: String(breakevenMonth),
            },
            {
              icon: "first-year",
              label: "To earn the opening back",
              value: payback != null ? String(payback) : null,
              unit: "yr",
              answer: true,
            },
          ],
        }
      : null;

  /* ---- 12, survival ---- */
  const surv = P.survival;
  const y1 = seriesAt(surv, 1);
  const y3 = seriesAt(surv, 3);
  const y5 = seriesAt(surv, 5);
  const survival: SurvivalModel | null =
    P.myth != null && y1 != null && y3 != null && y5 != null
      ? {
          claim: P.myth.claim,
          reality: P.myth.reality,
          stages: [
            { label: "Year 1", remaining: y1 },
            { label: "Year 3", remaining: y3 },
            { label: "Year 5", remaining: y5 },
          ],
          late: [
            {
              index: "Y1",
              title: "Ran out of cash",
              sub: "Not out of customers. The fit-out was funded and the first eight months were not.",
            },
            {
              index: "Y3",
              title: "The review, or the founder",
              sub: "Rent resets upward, or the person working ninety hours stops being able to.",
            },
            {
              index: "Y5",
              title: "Reinvestment nobody saved for",
              sub: "The kitchen is tired and the room looks it, and there is no money to put back.",
            },
          ],
        }
      : null;

  /* ---- 13, the same trade in other cities ---- */
  const cities = buildCities(cell);

  /* ---- 15, what to watch ---- */
  const reviewStress = pointOf(M.rentAndRates.reviewStressPct);
  const reviewCycle = pointOf(M.rentAndRates.reviewCycleYears);
  const wageRung = calculator?.notes.find((n) => n.below > 0)?.below ?? 30000;
  const watch: WatchModel | null = modelIntact
    ? (() => {
        const after = (drop: number) => keepTaken! - drop;
        const raw = [
          {
            q: "Revenue falls 15%",
            sub: "a slow year, no other change",
            keep: after(revenue! * 0.15 * contrib),
          },
          reviewStress != null && reviewCycle != null
            ? {
                q: `Rent up ${Math.round(reviewStress)}% at review`,
                sub: `reviews land about every ${reviewCycle} years`,
                keep: after(rentTotal! * (reviewStress / 100)),
              }
            : null,
          {
            q: "Food cost up 3 points",
            sub: "one bad supply year",
            keep: after(revenue! * 0.03),
          },
          {
            q: "Running costs up a tenth",
            sub: "energy, cards, insurance together",
            keep: after(runningTotal! * 0.1),
          },
        ].filter((r): r is { q: string; sub: string; keep: number } => r != null);

        const shocks = raw.map((r) => ({
          q: r.q,
          sub: r.sub,
          answer:
            r.keep < 0
              ? `you lose ${money(Math.abs(r.keep))}`
              : `take-home drops to ${money(r.keep)}`,
          bite: r.keep < wageRung,
        }));

        return {
          shocks,
          bitesBelowWage: shocks.filter((s) => s.bite).length,
          wageRung: money(wageRung)!,
          you: [
            "Prices and the menu",
            "The rota and the hours",
            "Format, and how many chefs",
            "Waste, stock, suppliers",
            "Which room you sign, once",
          ],
          not: [
            "The rent review",
            "Rates and tax",
            "The wage floor",
            "Energy prices",
            "Footfall on the street",
          ],
        };
      })()
    : null;

  /* ---- 17, the verdict, and the registry its chips resolve against ---- */
  const keptCents = modelIntact ? Math.round(share(keepTaken!)) : 0;
  const figures: Record<string, string> = {};
  if (modelIntact) figures["kept-share"] = `${keptCents} cents kept`;
  if (payback != null) figures["payback-years"] = `${payback} years to earn it back`;
  if (y5 != null) figures["survival-year-five"] = `${Math.round(y5)} in 100 at five years`;

  const verdict: VerdictModel | null = modelIntact
    ? {
        keptCents,
        chips: [
          { glyph: "owner-keeps", figureId: "kept-share" },
          { glyph: "myth-reality", figureId: "survival-year-five" },
          { glyph: "first-year", figureId: "payback-years" },
        ].filter((c) => figures[c.figureId] != null),
      }
    : null;

  /* ---- the closing band. The share is a model output, so the tag rides
       with it here exactly as it does in chapter 03. ---- */
  const band: BandModel =
    paidProperly != null && paidProperly > 0
      ? {
          takeaway:
            "Deep demand, real revenue, a thin slice at the end. The rooms that pay properly signed a cheaper room and ran a shorter menu.",
          figure: `1 in ${Math.round(100 / paidProperly)}`,
          figureSub: "pay the owner a real living, on this page's model",
        }
      : {
          takeaway:
            "Deep demand, real revenue, a thin slice at the end. The rooms that pay properly signed a cheaper room and ran a shorter menu.",
          figure: "",
          figureSub: "",
        };

  /* ---- 19 and 20, the tail ---- */
  const words = [
    {
      glyph: "revenue",
      term: "Revenue",
      plain:
        "Everything that crosses the till in a year, before any cost is paid. Not profit, and not what you take home.",
    },
    {
      glyph: "owner-keeps",
      term: "What the owner keeps",
      plain:
        "What is left after every cost, including your own staff wages, but before your personal tax. This is the number that pays you.",
    },
    {
      glyph: "break-even",
      term: "The daily floor",
      plain:
        "What you must take on an average open day just to cover the costs you have already committed to.",
    },
    {
      glyph: "startup-cost",
      term: "Cash before you open",
      plain:
        "Everything you spend before the first sale, plus the losses while trade builds. Not the fit-out alone.",
    },
    {
      glyph: "unit-economics",
      term: "An order",
      plain: "One bill, not one person. A table of two that shares three plates is one order.",
    },
    {
      glyph: "benchmark",
      term: "Typical",
      plain:
        "The middle of the trade, not the average. Half of the rooms sit above it and half below.",
    },
  ];

  const questions: Array<{ q: string; a: string }> = [];
  if (modelIntact && medianRevenue != null) {
    questions.push({
      q: `Is ${money(keepTaken)} really all an owner makes?`,
      a: `That is what the modelled room leaves after every cost, including the wages of everyone who works there. Many owners also pay themselves a salary that sits inside the staff line, so their total take is higher. The point of the figure is that the business itself only generates about ${keptCents} cents in the dollar of surplus.`,
    });
    questions.push({
      q: `Why does this page model ${money(revenue)} when the typical room takes ${money(medianRevenue)}?`,
      a: `Because ${money(medianRevenue)} does not pay an owner properly. The modelled room sits near the ${ordinal(percentile ?? 0)} percentile of the trade, and it still only keeps ${keptCents} cents in the dollar. The measured figure tells you what the trade does; the modelled room tells you what it takes.`,
    });
  }
  questions.push({
    q: "Can I trust a number that is modelled?",
    a: "Only as far as its arithmetic. That is why the working is shown rather than hidden. If you disagree with an input, change it in the calculator and the answer moves. A figure you cannot argue with is a figure you should not trust.",
  });
  questions.push({
    q: "What is the single biggest mistake people make?",
    a: "Budgeting the fit-out and nothing else. The thin months after opening close more rooms than bad food does, and they appear on no opening-cost list.",
  });
  questions.push({
    q: "Does this include delivery?",
    a: `Yes, in the revenue line. Be careful with it: platform commission runs near a third, so on a ${keptCents} per cent margin delivery orders can cost you money while looking like growth.`,
  });

  /* ---- 21, where to go next ----------------------------------------------
     This was hardcoded null, on the reasoning that nothing next carries a
     figure yet. That was over-cautious and it cost the page its whole outbound
     lattice: measured on the real route, the `.av2` body emitted ZERO links to
     another URL. All 27 outbound links came from the site chrome, so the page
     the lattice thesis exists to prove was contributing nothing to it.

     Two doors are offered, no figures, because every figure the mockup shows
     here describes a page we have not built. A count like "42 trades" would
     have to be verified before it could be printed, and inventing it to fill a
     tile is the exact failure the whole provenance system exists to prevent.

     BOTH DESTINATIONS ARE RESOLVED BY THE CALLER AND NEITHER IS ASSEMBLED.
     Until 2026-08-01 they were built from the slug pattern, and the city one
     was not merely dead, it was WRONG. The two-segment form of a trade URL is
     served by the region route, which lists US states and a country's admin1
     entities. A city slug is in none of those, so on the one filled cell the
     door pointed at a page that 404s. Worse, a city and a region can carry the
     SAME slug: the US region list and the city list both hold new-york, one
     meaning the state and one meaning the city. So a New York cell would have
     offered a door reading "Every trade in New York" that answered 200 with the
     STATE's page, handing the reader a different place's figures with no sign
     anything had gone wrong. That is the failure this site's whole argument
     cannot survive, and it is why the resolver is now the only way in.

     A door with no destination is not built at all. It is tempting to keep the
     tile and drop only its link, because the M1 grammar does have a linkless
     form, but that form is a FACT: a reading that keeps its FIGURE and loses
     its affordance, which is how a peer reading states a number for a page that
     does not exist yet. These two readings carry no figure. Their whole content
     is the door. With nothing to open they have nothing to say, and the atom
     agrees: a reading with a null figure renders nothing whatever its href.

     The other four tiles appear on their own when their cell files land. */
  const nextDoors: NonNullable<CellPageModel["next"]> = [];
  if (doors.geoPage) {
    nextDoors.push({
      glyph: "skyline",
      label: `Every trade in ${cell.meta.city.name}`,
      figure: null,
      href: doors.geoPage.href,
    });
  }
  if (doors.countryPage) {
    nextDoors.push({
      glyph: "global-spread",
      label: `${cell.meta.country.name} overall`,
      figure: null,
      href: doors.countryPage.href,
    });
  }
  const next: CellPageModel["next"] = nextDoors.length ? nextDoors : null;

  const model: CellPageModel = {
    meta: {
      id: cell.meta.id,
      title: hero?.title ?? `${cell.meta.trade.name} in ${cell.meta.city.name}`,
      urlPath: cell.meta.urlPath,
      country: cell.meta.country,
      city: cell.meta.city,
      trade: cell.meta.trade,
      reviewedAt: cell.meta.reviewedAt,
      freshnessLabel: freshnessLabel(cell.meta.freshness),
    },
    store,
    figures,
    chapters: [],
    trust: { sites: sites ?? 0, tierLine, reviewedAt: freshnessLabel(cell.meta.freshness) },
    band,
    hero,
    calculator,
    keep: keepChapter,
    bill,
    day,
    money: moneyChapter,
    floor,
    team,
    opening,
    year,
    firstYear,
    survival,
    cities,
    voices: null,
    watch,
    world: null,
    verdict,
    method,
    words,
    questions: questions.length >= 2 ? questions : null,
    next,
  };

  model.chapters = numberChapters(model);
  return model;
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function split(parts: { value: string; unit?: string } | null): { value: string | null; unit?: string } {
  if (parts == null) return { value: null };
  return parts.unit ? { value: parts.value, unit: parts.unit } : { value: parts.value };
}

function ordinal(n: number): string {
  const v = Math.round(n);
  const rest = v % 100;
  if (rest >= 11 && rest <= 13) return `${v}th`;
  switch (v % 10) {
    case 1:
      return `${v}st`;
    case 2:
      return `${v}nd`;
    case 3:
      return `${v}rd`;
    default:
      return `${v}th`;
  }
}

/** "2026-07" -> "July 2026". */
function freshnessLabel(f: string): string {
  const m = /^(\d{4})-(\d{2})/.exec(f);
  if (!m) return f;
  const idx = Number(m[2]) - 1;
  return MONTHS[idx] != null ? `${MONTHS[idx]} ${m[1]}` : f;
}

/**
 * The take-home curve, pinned to the file's own anchors:
 *   pay(rank) = floor + span * rank^curve
 * with pay(percentile) = the modelled room's keep and pay(1 - properlyPaid)
 * = the properly-paid threshold. Two anchors, two unknowns, no hand-set shape.
 */
function buildStore(args: {
  dist: DistributionBlock | undefined;
  fixed: number;
  contrib: number;
  keepTaken: number | null;
  percentile: number | null;
  paidProperly: number | null;
  p25: number | null;
  p75: number | null;
  medianRevenue: number | null;
  modelRevenue: number | null;
  committedPerDay: number | null;
  openDays: number | null;
}): CellStoreModel {
  const {
    dist,
    fixed,
    contrib,
    keepTaken,
    percentile,
    paidProperly,
    p25,
    p75,
    medianRevenue,
    modelRevenue,
    committedPerDay,
    openDays,
  } = args;

  const floor = dist?.floor ?? 0;
  const target = dist?.properlyPaidThreshold ?? 0;
  const sampleSize = dist?.sampleSize ?? 100;

  let span = 0;
  let curve = 1;
  if (
    dist != null &&
    keepTaken != null &&
    percentile != null &&
    paidProperly != null &&
    percentile > 0 &&
    percentile < 100 &&
    paidProperly > 0 &&
    paidProperly < 100
  ) {
    const qModel = percentile / 100;
    const qProper = 1 - paidProperly / 100;
    const payModel = keepTaken - floor;
    const payProper = target - floor;
    if (payModel > 0 && payProper > 0 && qProper !== qModel) {
      curve = Math.log(payProper / payModel) / Math.log(qProper / qModel);
      span = payModel / Math.pow(qModel, curve);
    }
  }

  return {
    fixed,
    contrib,
    target,
    targetMin: 40000,
    targetMax: 200000,
    targetStep: 5000,
    floor,
    span,
    curve,
    sampleSize,
    p25: p25 ?? 0,
    p75: p75 ?? 0,
    medianRevenue: medianRevenue ?? 0,
    modelRevenue: modelRevenue ?? 0,
    committedPerDay: committedPerDay ?? 0,
    openDays: openDays ?? 0,
  };
}

/** The provenance ledger, tiers read straight off the figures it names. */
function ledgerRows(cell: CellFile): MethodModel["ledger"] {
  const M = cell.modelRoom;
  const P = cell.population;
  const rows: MethodModel["ledger"] = [
    {
      label: "How many rooms there are",
      tier: P.sites?.tier ?? null,
      how: "the business register, counted as premises",
    },
    {
      label: "Survival, year by year",
      tier: P.survival?.tier ?? null,
      how: "annual cohorts of registered businesses",
    },
    {
      label: "The staff cost share",
      tier: M.staff?.sharePct?.tier ?? null,
      how: "employment costs over revenue for the trade",
    },
    {
      label: "Typical revenue, the whole trade",
      tier: P.medianRevenue?.tier ?? null,
      how: "interpolated from the register's revenue bands",
    },
    {
      label: "The modelled room's revenue",
      tier: M.revenue?.tier ?? null,
      how: "orders times spend times open days",
    },
    {
      label: "Rent and rates",
      tier: M.rentAndRates?.total?.tier ?? null,
      how: "assessed rent on comparable units, plus the rating multiplier",
    },
    {
      label: "What the owner keeps",
      tier: M.ownerKeeps?.tier ?? null,
      how: "the residual of the five lines",
    },
    {
      label: "Food and drink share",
      tier: M.food?.pct?.tier ?? null,
      how: "a trade benchmark band, not a published split",
    },
    {
      label: "Cost to fit out",
      tier: cell.opening?.fitout?.tier ?? null,
      how: "no register exists, so this is a range",
    },
  ];
  return rows.filter((r) => r.tier != null);
}

function tierTallyOf(rows: MethodModel["ledger"]): Record<Tier, number> {
  const t: Record<Tier, number> = { measured: 0, built: 0, thin: 0 };
  for (const r of rows) if (r.tier != null) t[r.tier] += 1;
  return t;
}

function tierSentence(t: Record<Tier, number>): string {
  const total = t.measured + t.built + t.thin;
  if (total === 0) return "";
  return `${t.measured} of ${total} lines measured, ${t.built} built, ${t.thin} thin`;
}

/**
 * Cell 07's side panel: what one realistic step on each variable is worth,
 * ranked. Same spec the calculator's own leverage readout uses, so the two
 * can never disagree.
 */
function leverageRows(calc: CalculatorModel): Row[] {
  const values: Record<string, number> = {};
  for (const v of calc.vars) values[v.id] = v.defaultValue;

  const keepOf = (vals: Record<string, number>): number => {
    let volume = 1;
    let price = 1;
    let pctSum = 0;
    let fixedSum = 0;
    for (const v of calc.vars) {
      const x = vals[v.id];
      if (v.kind === "volume") volume *= x;
      else if (v.kind === "price") price *= x;
      else if (v.kind === "pct") pctSum += x;
      else fixedSum += x;
    }
    return volume * price * calc.days * (1 - pctSum / 100) - fixedSum;
  };

  const base = keepOf(values);
  const ORDINALS = ["1", "2", "3", "4", "5", "6"];
  const SUFFIX = ["st", "nd", "rd", "th", "th", "th"];

  const moves = calc.vars
    .map((v) => {
      const sign = v.leverage.direction === "up" ? 1 : -1;
      const probed =
        v.leverage.kind === "pct"
          ? values[v.id] * (1 + (sign * v.leverage.pct) / 100)
          : values[v.id] + sign * v.leverage.amount;
      const gain = keepOf({ ...values, [v.id]: probed }) - base;
      const amount =
        v.leverage.kind === "pct"
          ? `${v.leverage.pct}%`
          : v.format === "usd"
            ? `$${v.leverage.amount}`
            : v.format === "pct"
              ? `${v.leverage.amount}%`
              : String(v.leverage.amount);
      const joiner = v.leverage.direction === "up" ? "more" : "off";
      return {
        icon: v.glyph,
        label: v.label,
        sub: `${amount} ${joiner} ${v.leverage.noun}`,
        gain,
      };
    })
    .sort((a, b) => b.gain - a.gain)
    .slice(0, 5);

  return moves.map((m, i) => ({
    icon: m.icon,
    label: m.label,
    sub: m.sub,
    value: ORDINALS[i],
    unit: SUFFIX[i],
    answer: i === 0,
  }));
}

function teamRows(
  cell: CellFile,
  effective: number,
  marginalLo: number | null,
  marginalHi: number | null,
): Row[] {
  const S = cell.modelRoom.staff;
  const rows: Row[] = [];

  if (marginalHi != null) {
    rows.push({
      icon: "taxes",
      label: "Employer contributions",
      sub: marginalLo != null && marginalLo !== marginalHi ? "on every wage above the threshold" : "on every wage",
      value: `+${Math.round(marginalHi)}`,
      unit: "%",
      answer: true,
    });
  }
  rows.push({
    icon: "margin",
    label: "After the employment allowance",
    sub: "what this rota actually pays",
    value: `+${trim(effective.toFixed(1))}`,
    unit: "%",
  });

  const direct = S.recruitChefDirect;
  if (direct != null && Number.isFinite(direct.lo) && Number.isFinite(direct.hi)) {
    const r = rangeK(direct.lo, direct.hi);
    rows.push({
      icon: "hiring",
      label: "To recruit one chef",
      sub: "advert and your own time",
      value: r.value,
      unit: r.unit,
    });
  }
  const agency = S.recruitChefAgency;
  if (agency != null && Number.isFinite(agency.lo) && Number.isFinite(agency.hi)) {
    const r = rangeK(agency.lo, agency.hi);
    rows.push({
      icon: "hiring",
      label: "The same chef, through an agency",
      sub: "a placement fee on the first year",
      value: r.value,
      unit: r.unit,
    });
  }

  const weeks = S.weeksToFillChefRole;
  if (weeks != null && weeks.value === null && weeks.proxy != null && "value" in weeks.proxy) {
    rows.push({
      icon: "first-year",
      label: "Weeks to fill a role",
      sub: "all roles; nobody measures chefs",
      value: String(weeks.proxy.value),
    });
  }

  const churn = S.churnPctPerYear;
  if (churn != null) {
    const taken = churn.taken ?? (churn.lo + churn.hi) / 2;
    rows.push({
      icon: "staffing-rota",
      label: "Staff churn a year",
      sub: `the band runs ${Math.round(churn.lo)} to ${Math.round(churn.hi)}`,
      value: String(Math.round(taken)),
      unit: "%",
    });
  }

  const churnCost = S.churnCostPerYear;
  if (churnCost != null && Number.isFinite(churnCost.lo) && Number.isFinite(churnCost.hi)) {
    const r = rangeK(churnCost.lo, churnCost.hi);
    rows.push({
      icon: "wages",
      label: "Churn cost, a year",
      sub: "rehiring and retraining",
      value: `$${r.value}`,
      unit: r.unit,
    });
  }

  return rows;
}

function buildOpening(cell: CellFile): OpeningModel | null {
  const O = cell.opening;
  if (O == null) return null;

  const fitoutLo = O.fitout?.lo;
  const fitoutHi = O.fitout?.hi;
  const deposit = takenOf(O.depositAndFirstRent);
  const stock = takenOf(O.openingStock);
  const registration = pointOf(O.companyRegistration);
  const foodReg = pointOf(O.foodBusinessRegistration);
  const insurance = takenOf(O.insuranceYear1);
  const licence = takenOf(O.licence);
  const total = pointOf(O.total);

  if (
    fitoutLo == null ||
    fitoutHi == null ||
    deposit == null ||
    stock == null ||
    registration == null ||
    insurance == null ||
    licence == null ||
    total == null
  ) {
    return null;
  }

  const admin = registration + (foodReg ?? 0) + insurance;
  const fitoutRange = rangeK(fitoutLo, fitoutHi);
  const rows: OpeningModel["rows"] = [
    {
      id: "fitout",
      label: "Fit-out and kitchen",
      range: [fitoutLo, fitoutHi],
      display: `${fitoutRange.value}${fitoutRange.unit}`,
    },
    { id: "deposit", label: "Deposit and first rent", value: deposit, display: moneyFine(deposit)! },
    { id: "stock", label: "Opening stock", value: stock, display: moneyFine(stock)! },
    { id: "admin", label: "Registration and insurance", value: admin, display: moneyFine(admin)! },
    { id: "licence", label: "Licence", value: licence, display: moneyFine(licence)! },
  ];

  const pointSum = rows.reduce((s, r) => s + (r.value ?? 0), 0);

  return {
    rows,
    total: { label: "To open the doors", value: total, display: money(total)! },
    assumedFitout: money(total - pointSum)!,
    sideRows: [
      {
        icon: "licence-specific",
        label: "Licence",
        sub: "food, alcohol, hours",
        ...split(moneyFineParts(licence)),
      },
      {
        icon: "register-cost",
        label: "Registration and insurance",
        sub: "the company, the food register, year one cover",
        ...split(moneyFineParts(admin)),
      },
      {
        icon: "commercial-rent",
        label: "Deposit and first rent",
        sub: "the typical ask for a new operator",
        ...split(moneyFineParts(deposit)),
      },
      {
        icon: "startup-cost",
        label: "Fit-out and kitchen",
        sub: "your call",
        answer: true,
        value: fitoutRange.value,
        unit: fitoutRange.unit,
      },
    ],
  };
}

/**
 * Cell 13's peer-city table. Reads `comparisons.cities`; a NullFigure (the
 * launch state, no peer cell files yet) or fewer than two clean rows both
 * yield null, and the chapter never mounts (M9).
 *
 * `isCurrent` is DERIVED here, never read off the row (PORT-CONTRACT M5): a
 * row is "this page's own city" iff its `citySlug` matches
 * `meta.city.slug`, so an authored boolean can never mark the wrong city.
 * Anything other than exactly one match is a broken peer list, not a
 * styling question, and the whole chapter self-omits.
 */
function buildCities(cell: CellFile): CitiesModel | null {
  const figure = cell.comparisons?.cities;
  if (figure == null || isNullFigure(figure) || !("cities" in figure)) return null;

  const clean = (rows: CityPeerRow[]) =>
    rows.filter(
      (r) =>
        typeof r.city === "string" &&
        r.city.length > 0 &&
        typeof r.citySlug === "string" &&
        r.citySlug.length > 0 &&
        Number.isFinite(r.revenue) &&
        Number.isFinite(r.ownerKeeps) &&
        Number.isFinite(r.per10kPeople) &&
        typeof r.breakIn === "string" &&
        r.breakIn.length > 0,
    );

  const rowsRaw = clean(figure.cities);
  if (rowsRaw.length < 2) return null;

  const hereSlug = cell.meta.city.slug;
  const matchCount = rowsRaw.filter((r) => r.citySlug === hereSlug).length;
  if (matchCount !== 1) return null;

  const rows: CityRow[] = rowsRaw.map((r) => ({
    city: r.city,
    revenueDisplay: money(r.revenue)!,
    ownerKeepsValue: r.ownerKeeps,
    ownerKeepsDisplay: money(r.ownerKeeps)!,
    per10kPeople: r.per10kPeople,
    breakIn: r.breakIn,
    isCurrent: r.citySlug === hereSlug,
  }));

  return { rows };
}

/**
 * The spine. Every chapter, always, numbered in order.
 *
 * This used to read `SPINE.filter((s) => model[s.id] != null)` and renumber
 * what was left, so a place with four unfilled sections rendered 17 chapters
 * numbered 01 to 17 and the reader had no way to know four were missing.
 *
 * The founder overruled it on 2026-07-27: a page is always complete and its
 * shape never varies by place. Across hundreds of places a shifting shape
 * teaches a reader that some places are second class, and a silent omission
 * reads as "this site does not cover that" rather than the true and weaker
 * "we have not published this figure here".
 *
 * So the numbering is now a property of the SPINE, not of the data. Chapter 13
 * is chapter 13 in every city. What changes per place is whether a chapter
 * renders its figures or renders a ChapterGap, and that decision belongs to the
 * page, not to this function.
 */
function numberChapters(model: CellPageModel): CellPageModel["chapters"] {
  void model;
  return SPINE.map((s, i) => ({
    id: s.id,
    num: String(i + 1).padStart(2, "0"),
    title: s.title,
    icon: s.icon,
    anchor: `ch-${String(i + 1).padStart(2, "0")}`,
  }));
}
