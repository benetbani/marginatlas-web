/**
 * src/lib/v0/cell-props.ts
 *
 * The REAL cell-page data, shaped exactly like the numbers written into the v0
 * prompts (E:/atlas/v0/PROMPTS.md). A component pasted in from v0 arrives with
 * those figures hardcoded; wiring it live is then a swap, not a rewrite: delete
 * the hardcoded values and pass `CELL_LONDON_RESTAURANTS` (or, on promotion, the
 * adapter output) as props.
 *
 * Source of truth today: src/lib/spine-seeds/cells/GB-london-restaurants.json
 * (illustrative/modeled). On promotion this module returns the real cell record
 * from the data layer instead, and every consumer keeps working unchanged.
 */

export type MoneySlice = { name: string; usd: number; isAnswer?: boolean };
export type BigLine = { name: string; usd: number; note: string };
export type FormatRow = {
  name: string; ownerKeepsPct: number; costToOpenUsd: number;
  breakIn: string; note: string; isCurrent?: boolean;
};
export type WageRow = { role: string; low: number; mid: number; high: number };
export type CityRow = { city: string; turnoverUsd: number; ownerKeepsUsd: number; isHome?: boolean };
export type TradeCard = { name: string; costToOpenUsd: number };

export type CellPageData = {
  meta: { trade: string; city: string; country: string };
  /** true while figures are modeled: every measured-looking number needs a visible tag */
  modeled: boolean;
  answer: { ownerKeepsUsdYear: number; centsPerDollar: number };
  heroStats: {
    netMarginPct: number; breakIn: string;
    costToOpenUsd: number; paybackYears: number; firmsTrading: number;
  };
  turnover: { lean: number; typical: number; strong: number };
  whereEachDollarGoes: MoneySlice[];
  threeBiggestLines: BigLine[];
  demand: {
    dayparts: { name: string; pct: number }[];
    channels: { name: string; pct: number }[];
    monthsIndexed: number[]; // Jan..Dec
  };
  formats: FormatRow[];
  costToOpen: { totalUsd: number; paybackYears: number; items: { name: string; usd: number }[] };
  breakEven: { covers: number; typicalCovers: number; line: string };
  wages: WageRow[];
  survival: { year1Pct: number; year3Pct: number; year5Pct: number; folklore: string; reality: string };
  nearbyCities: CityRow[];
  relatedTrades: TradeCard[];
};

export const CELL_LONDON_RESTAURANTS: CellPageData = {
  meta: { trade: "Restaurants", city: "London", country: "United Kingdom" },
  modeled: true,
  answer: { ownerKeepsUsdYear: 43000, centsPerDollar: 7 },
  heroStats: {
    netMarginPct: 7, breakIn: "Demanding",
    costToOpenUsd: 197000, paybackYears: 4.5, firmsTrading: 18000,
  },
  turnover: { lean: 280000, typical: 620000, strong: 1400000 },
  whereEachDollarGoes: [
    { name: "Wages", usd: 34 },
    { name: "Food and drink", usd: 31 },
    { name: "Rent and rates", usd: 13 },
    { name: "Other running costs", usd: 11 },
    { name: "Marketing", usd: 4 },
    { name: "Owner keeps", usd: 7, isAnswer: true },
  ],
  threeBiggestLines: [
    { name: "Wages", usd: 34, note: "Kitchen and floor. Rota tightly." },
    { name: "Food cost", usd: 31, note: "Menu engineering and waste." },
    { name: "Rent and rates", usd: 13, note: "A prime address eats margin first." },
  ],
  demand: {
    dayparts: [
      { name: "Weekday lunch", pct: 22 },
      { name: "Weekday dinner", pct: 31 },
      { name: "Weekend", pct: 47 },
    ],
    channels: [
      { name: "Dine-in", pct: 62 },
      { name: "Delivery", pct: 24 },
      { name: "Takeaway", pct: 14 },
    ],
    monthsIndexed: [58, 56, 64, 68, 72, 78, 80, 76, 80, 74, 78, 96],
  },
  formats: [
    { name: "Fast casual", ownerKeepsPct: 9, costToOpenUsd: 140000, breakIn: "Easier", note: "Counter service, tight menu" },
    { name: "Full service", ownerKeepsPct: 7, costToOpenUsd: 197000, breakIn: "Demanding", note: "Table service, full kitchen and floor", isCurrent: true },
    { name: "Fine dining", ownerKeepsPct: 5, costToOpenUsd: 340000, breakIn: "Hardest", note: "High spend, heavy labour and fit-out" },
  ],
  costToOpen: {
    totalUsd: 197000, paybackYears: 4.5,
    items: [
      { name: "Fit-out", usd: 120000 },
      { name: "Kitchen equipment", usd: 60000 },
      { name: "Deposit and first rent", usd: 16000 },
      { name: "Registration and licence", usd: 1200 },
    ],
  },
  breakEven: { covers: 36, typicalCovers: 45, line: "A quiet Tuesday is the real test, not a busy Friday." },
  wages: [
    { role: "Head chef", low: 52000, mid: 66000, high: 86000 },
    { role: "Manager", low: 40000, mid: 50000, high: 64000 },
    { role: "Line cook", low: 30000, mid: 38000, high: 48000 },
    { role: "Waitstaff", low: 24000, mid: 28000, high: 34000 },
    { role: "Kitchen porter", low: 23000, mid: 26000, high: 30000 },
  ],
  survival: {
    year1Pct: 74, year3Pct: 52, year5Pct: 41,
    folklore: "Nine in ten restaurants fail.",
    reality: "Nearer three in four rooms are still trading at year one. Most closures come later and quietly.",
  },
  nearbyCities: [
    { city: "London", turnoverUsd: 620000, ownerKeepsUsd: 43000, isHome: true },
    { city: "Manchester", turnoverUsd: 380000, ownerKeepsUsd: 41000 },
    { city: "Edinburgh", turnoverUsd: 360000, ownerKeepsUsd: 40000 },
    { city: "Birmingham", turnoverUsd: 340000, ownerKeepsUsd: 39000 },
  ],
  relatedTrades: [
    { name: "Cafe", costToOpenUsd: 180000 },
    { name: "Grocery store", costToOpenUsd: 250000 },
    { name: "Gym", costToOpenUsd: 200000 },
    { name: "Auto repair", costToOpenUsd: 180000 },
  ],
};

/** $43K / $1.4M money grammar, matches the rest of the app. */
export const usd = (v: number) =>
  v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : v >= 1000 ? `$${Math.round(v / 1000)}K` : `$${Math.round(v)}`;
