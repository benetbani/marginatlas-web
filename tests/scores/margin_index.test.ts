/**
 * Run: npx tsx tests/scores/margin_index.test.ts
 * The Margin Index board re-sorts recommender rows by HONEST KEEP (not composite),
 * keeps each row's composite for the badge, dashes a null keep, stamps stable
 * per-row anchors, and omits rows with neither keep nor composite.
 */
import { toMarginIndexBoard, deriveHomeInsight } from "@/lib/scores/margin_index";
import type { RecommendResult, RecommendRow } from "@/lib/scores/recommend";
import type { CompositeScore } from "@/lib/scores/composite";

let failures = 0;
function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error("  x " + msg);
    failures++;
  }
}

function comp(score: number): CompositeScore {
  return { score, band: "manageable", axes: { keep: score, ease: 50, risk: 50, demand: 50 }, coverage: 4, restsOnModeled: true };
}
function row(p: Partial<RecommendRow>): RecommendRow {
  return { id: "lisbon", name: "Lisbon", href: "/pt/lisbon/x", keepPct: 20, startupCostUsd: 100000, composite: comp(70), ...p } as RecommendRow;
}
function result(rows: RecommendRow[]): RecommendResult {
  return { direction: "places-for-trade", subject: "Restaurants", rows, weightsUsed: { keep: 0.4, ease: 0.25, risk: 0.15, demand: 0.2 }, budgetUsd: null, omittedForBudget: 0 } as RecommendResult;
}

// re-sorts by keep desc, regardless of the composite order coming in.
{
  const b = toMarginIndexBoard(result([
    row({ id: "a", name: "A", keepPct: 12, composite: comp(90) }),
    row({ id: "b", name: "B", keepPct: 25, composite: comp(60) }),
  ]));
  assert(b.rows[0].id === "b", "highest keep ranks first, even with a lower composite");
  assert(b.rows[0].composite!.score === 60, "the row keeps its own composite for the badge");
}

// null keep dashes (keepKnown false) and sinks below real-keep rows.
{
  const b = toMarginIndexBoard(result([
    row({ id: "known", keepPct: 15, composite: comp(50) }),
    row({ id: "nokeep", keepPct: null, composite: comp(80) }),
  ]));
  assert(b.rows[0].id === "known", "a real keep outranks a null keep");
  const nk = b.rows.find((r) => r.id === "nokeep")!;
  assert(nk.keepKnown === false, "null keep -> keepKnown false (dashes, never 0%)");
}

// stable anchors from the row id; omit rows with neither keep nor composite.
{
  const b = toMarginIndexBoard(result([
    row({ id: "porto", name: "Porto", keepPct: 18, composite: comp(55) }),
    row({ id: "empty", keepPct: null, composite: null }),
  ]));
  assert(b.rows.length === 1, "a row with neither keep nor composite is omitted");
  assert(b.rows[0].anchor === "mi-porto", "anchor is a stable id-derived slug");
}

// deriveHomeInsight: only from a real top keep; never fabricated.
{
  const b = toMarginIndexBoard(result([
    row({ id: "lisbon", name: "Lisbon", keepPct: 22, composite: comp(77) }),
    row({ id: "porto", name: "Porto", keepPct: 19, composite: comp(67) }),
  ]));
  assert(deriveHomeInsight(b) === "Lisbon keeps 22% of revenue", "insight names the top keeper with its real keep");
  assert(deriveHomeInsight(null) === null, "no board -> null insight");
  const noKeep = toMarginIndexBoard(result([row({ id: "x", keepPct: null, composite: comp(80) })]));
  assert(deriveHomeInsight(noKeep) === null, "top row with unknown keep -> null insight (never fabricated)");
}

if (failures > 0) {
  console.error(`\nmargin_index.test: FAIL (${failures} assertion(s))`);
  process.exit(1);
}
console.log("margin_index.test: PASS. Keep-sorted, badge-carrying, dash-safe, anchored, omitting board.");
