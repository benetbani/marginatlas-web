/**
 * Margin Index view , SPINE rebuild BODY. Wave 2 (Task 3).
 *
 * Maps a MarginIndexBoard (Task 2, src/lib/scores/margin_index.ts) onto the shared spine
 * kit primitives, top to bottom: a Movement chapter opener -> the FULL SSR DecisionRow
 * leaderboard, keep-ranked, every row FREE (each wearing its composite MarginIndexBadge,
 * each wrapped in a stable per-row anchor for deep links) -> a SampleTag / modeled line ->
 * a plain /extremes cross-link.
 *
 * Precedent: src/app/dev/decide-v2/recommend-view.tsx uses the same DecisionRow/badge
 * mapping, EXCEPT this view carries NO LockVeil (the Margin Index is fully free), ranks
 * by keep (not composite), and wraps each row in an id anchor.
 *
 * HONESTY RAILS baked in here:
 *  - keptKnown is the row's keepKnown (a null keep dashes, never a fabricated 0%).
 *  - the MarginIndexBadge is fed row.composite?.score ?? null (null-safe: a null-composite
 *    row simply renders no badge but still ranks by keep).
 *  - no rows are dropped from the ranking; toMarginIndexBoard() already omits rows with
 *    neither a keep nor a composite to show.
 */
import {
  DecisionRow,
  DecisionRowHeader,
  MarginIndexBadge,
  KitIndexStyles,
  type SignalDef,
  type DecisionDatum,
} from "@/components/spine/kit-index";
import { Movement, Full, Box, SampleTag } from "@/components/spine/kit";
import type { MarginIndexBoard, MarginIndexRow } from "@/lib/scores/margin_index";

const SIGNALS: SignalDef[] = [
  { key: "composite", label: "Margin Index", higherIsBetter: true, bar: { domain: [0, 100] } },
  { key: "ease", label: "Ease", higherIsBetter: true },
  { key: "demand", label: "Demand", higherIsBetter: true },
];

function toDatum(r: MarginIndexRow): DecisionDatum {
  const c = r.composite;
  return {
    id: r.id,
    name: r.name,
    href: r.href,
    keptPct: r.keepPct ?? 0,
    keptKnown: r.keepKnown, // false => dash, never 0%
    support: [
      { key: "composite", value: c?.score ?? null, display: c ? String(c.score) : undefined },
      { key: "ease", value: c?.axes.ease ?? null },
      { key: "demand", value: c?.axes.demand ?? null },
    ],
  };
}

export function MarginIndexView({ board }: { board: MarginIndexBoard }) {
  const noun = board.direction === "places-for-trade" ? "places" : "trades";
  return (
    <>
      <KitIndexStyles />
      <Movement
        index="01"
        eyebrow="The Margin Index"
        heading={`Where a ${board.subject} keeps the most`}
        icon="ranking"
      />
      <Full>
        <Box>
          <div className="spine-scope">
            <DecisionRowHeader signals={SIGNALS} />
            {board.rows.map((r) => (
              <div key={r.id} id={r.anchor} className="scroll-mt-24">
                <div className="flex items-center gap-3">
                  <MarginIndexBadge score={r.composite?.score ?? null} size={44} showLabel={false} />
                  <div className="min-w-0 flex-1">
                    <DecisionRow d={toDatum(r)} signals={SIGNALS} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Full>
      <Full>
        <p className="text-sm">
          <SampleTag note={`Ranked by margin kept, a like for like share, across ${noun}. The badge is each entity's overall Margin Index. Every figure is modeled.`} />
        </p>
      </Full>
      <Full>
        <p className="text-sm">
          Looking for the fun extremes instead? <a href="/extremes" className="underline">See the leaderboards</a>.
        </p>
      </Full>
    </>
  );
}
