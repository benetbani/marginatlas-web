/**
 * Recommender view , SPINE rebuild BODY. Wave 1 (Task 6).
 *
 * Maps a RecommendResult (Task 4, src/lib/scores/recommend.ts) onto the shared spine
 * kit primitives, top to bottom: WinnerCard (rank #1 + the honesty "catch" counterweight)
 * -> a MarginIndexBadge fed the winner's real composite score (Task 1/5, composite.ts)
 * -> Podium (top 3, FREE) -> a LockVeil wrapping the full DecisionRow ranking (Pro) ->
 * a SampleTag / coverage honesty line.
 *
 * This file renders a bundled illustrative DEV_SEED by default so the dev route works
 * without an async fetch. The real resolver output (rankPlacesForTrade /
 * rankTradesForPlace) is wired in by Task 7's route, which will pass a live
 * RecommendResult as the `result` prop instead.
 *
 * HONESTY RAILS baked in here:
 *  - keptKnown is false whenever a row's keepPct is null, so the row dashes rather
 *    than showing a fabricated 0%.
 *  - rows with a null composite (no net margin to anchor on) are filtered out of the
 *    ranking entirely, never shown with a guessed rank.
 *  - the LockVeil wraps the REAL DecisionRow list (blurred, not hidden) , the honest
 *    figures stay in the DOM for crawlers/a11y, only the pixels are masked.
 *  - the "catch" is the runner-up that beats the winner on its weakest axis, sitting
 *    beside the verdict, never suppressed.
 */
import {
  WinnerCard,
  Podium,
  LockVeil,
  DecisionRow,
  DecisionRowHeader,
  MarginIndexBadge,
  KitIndexStyles,
  type SignalDef,
  type DecisionDatum,
  type PodiumDatum,
  type WinnerStrip,
} from "@/components/spine/kit-index";
import { Box, Head, Full, Narrow, SampleTag, usd } from "@/components/spine/kit";
import type { RecommendResult, RecommendRow } from "@/lib/scores/recommend";
import { compositeScore, DEFAULT_COMPOSITE_WEIGHTS } from "@/lib/scores/composite";
import { rankByComposite } from "@/lib/scores/recommend_core";

const SIGNALS: SignalDef[] = [
  { key: "composite", label: "Margin Index", higherIsBetter: true, bar: { domain: [0, 100] } },
  { key: "ease", label: "Ease", higherIsBetter: true },
  { key: "risk", label: "Durable", higherIsBetter: true },
  { key: "demand", label: "Demand", higherIsBetter: true },
];

function toDatum(r: RecommendRow): DecisionDatum {
  const c = r.composite;
  return {
    id: r.id,
    name: r.name,
    href: r.href,
    keptPct: r.keepPct ?? 0,
    keptKnown: r.keepPct != null, // false => the row dashes keep, never shows 0%
    support: [
      { key: "composite", value: c?.score ?? null, display: c ? String(c.score) : undefined },
      { key: "ease", value: c?.axes.ease ?? null },
      { key: "risk", value: c?.axes.risk ?? null },
      { key: "demand", value: c?.axes.demand ?? null },
    ],
  };
}

/** The honesty counterweight: the runner-up that beats the winner on its weakest axis. */
function catchFor(rows: RecommendRow[]): string | undefined {
  const [winner, ...rest] = rows;
  if (!winner?.composite || rest.length === 0) return undefined;
  const axes: Array<["ease" | "risk" | "demand", string]> = [
    ["ease", "opens easier"],
    ["risk", "is more durable"],
    ["demand", "has deeper demand"],
  ];
  let weakest: (typeof axes)[number] | null = null;
  let weakestVal = Infinity;
  for (const [key] of axes) {
    const v = winner.composite.axes[key];
    if (v != null && v < weakestVal) {
      weakestVal = v;
      weakest = axes.find(([k]) => k === key) ?? null;
    }
  }
  if (!weakest) return undefined;
  const [key, phrase] = weakest;
  const beats = rest.find(
    (r) => (r.composite?.axes[key] ?? -1) > (winner.composite?.axes[key] ?? Infinity),
  );
  return beats ? `${beats.name} ${phrase}.` : undefined;
}

export function RecommendView({ result }: { result: RecommendResult }) {
  const rows = result.rows.filter((r) => r.composite !== null);
  if (rows.length === 0) {
    return (
      <Full>
        <Box>
          <Head>Not enough covered {result.direction === "places-for-trade" ? "places" : "trades"} yet</Head>
          <p>We only rank where the numbers are real. This slate is still filling in.</p>
        </Box>
      </Full>
    );
  }

  const top = rows[0];
  const noun = result.direction === "places-for-trade" ? "place" : "trade";
  const strip: [WinnerStrip, WinnerStrip, WinnerStrip] = [
    { value: String(top.composite?.score ?? ""), label: "Margin Index" },
    { value: top.composite?.axes.ease != null ? String(top.composite.axes.ease) : "n/a", label: "Ease, of 100" },
    { value: top.startupCostUsd != null ? usd(top.startupCostUsd) : "n/a", label: "To open" },
  ];

  const podium: PodiumDatum[] = rows.slice(0, 3).map((r) => ({
    id: r.id,
    name: r.name,
    keptPct: r.keepPct ?? 0,
    sub: `Margin Index ${r.composite?.score ?? ""}`,
    href: r.href,
  }));

  return (
    <>
      <KitIndexStyles />
      <Full>
        <WinnerCard
          kicker={`Best ${noun} for ${result.subject}`}
          winner={top.name}
          keptPct={top.keepPct ?? 0}
          why="Highest overall on the Margin Index across keep, ease, durability, and demand."
          catch={catchFor(rows)}
          strip={strip}
        />
      </Full>
      <Full>
        <div className="flex items-center gap-4">
          <MarginIndexBadge score={top.composite?.score ?? null} />
          <p>The Margin Index blends what you keep, how hard it is to break in, durability, and demand into one 0 to 100 read. Every figure here is modeled.</p>
        </div>
      </Full>
      <Full>
        <Podium items={podium} keptLabel="kept" />
      </Full>
      <Full>
        <LockVeil headline="See the full ranking" note="Every place scored, sortable, with the tuning that reorders it." cta="Unlock with Pro">
          <div className="spine-scope">
            <DecisionRowHeader signals={SIGNALS} />
            {rows.map((r) => (
              <DecisionRow key={r.id} d={toDatum(r)} signals={SIGNALS} />
            ))}
          </div>
        </LockVeil>
      </Full>
      <Narrow>
        <p className="text-sm">
          <SampleTag note={`Modeled from curated economics.${result.omittedForBudget > 0 ? ` ${result.omittedForBudget} more sit above your budget.` : ""}`} />
        </p>
      </Narrow>
    </>
  );
}

/* ============================================================================
 * DEV SEED , illustrative only. Replaced by the real resolver output
 * (rankPlacesForTrade / rankTradesForPlace, src/lib/scores/recommend.ts) once
 * Task 7 wires the /dev/decide-v2 route to a live query. Every row's composite
 * below is REAL engine output: compositeScore() is called on plausible sample
 * inputs, never hand-typed, so the seed's shape and math match production.
 * One row (Split) is deliberately missing its keep margin, so its composite
 * comes back null and the honesty filter drops it from the rendered ranking ,
 * proof the "dash, never fabricate" rail actually fires on this seed.
 * ========================================================================== */
const SEED_INPUTS: Array<{
  id: string;
  name: string;
  href: string;
  keepPct: number | null;
  startupCostUsd: number | null;
  breakInScore: number | null;
  survivalYr5Pct: number | null;
  demandScore: number | null;
}> = [
  { id: "lisbon", name: "Lisbon", href: "/cities/lisbon", keepPct: 22, startupCostUsd: 38000, breakInScore: 71, survivalYr5Pct: 58, demandScore: 64 },
  { id: "porto", name: "Porto", href: "/cities/porto", keepPct: 19, startupCostUsd: 29000, breakInScore: 66, survivalYr5Pct: 55, demandScore: 52 },
  { id: "valencia", name: "Valencia", href: "/cities/valencia", keepPct: 17, startupCostUsd: 41000, breakInScore: 60, survivalYr5Pct: 61, demandScore: 58 },
  { id: "krakow", name: "Krakow", href: "/cities/krakow", keepPct: 15, startupCostUsd: 24000, breakInScore: 74, survivalYr5Pct: 49, demandScore: 45 },
  { id: "split", name: "Split", href: "/cities/split", keepPct: null, startupCostUsd: null, breakInScore: 63, survivalYr5Pct: 52, demandScore: 41 },
];

const DEV_SEED_ROWS: RecommendRow[] = SEED_INPUTS.map((r) => ({
  id: r.id,
  name: r.name,
  href: r.href,
  keepPct: r.keepPct,
  startupCostUsd: r.startupCostUsd,
  composite: compositeScore(
    {
      keepPct: r.keepPct,
      breakInScore: r.breakInScore,
      survivalYr5Pct: r.survivalYr5Pct,
      demandScore: r.demandScore,
      restsOnModeled: true,
    },
    DEFAULT_COMPOSITE_WEIGHTS,
  ),
}));

/** Dev-only illustrative seed. Real data arrives via Task 7's route. */
export const DEV_SEED: RecommendResult = {
  direction: "places-for-trade",
  subject: "specialty coffee shop",
  rows: rankByComposite(DEV_SEED_ROWS),
  weightsUsed: DEFAULT_COMPOSITE_WEIGHTS,
  budgetUsd: 45000,
  omittedForBudget: 2,
};
