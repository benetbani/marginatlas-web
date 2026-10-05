/**
 * Margin Index view , SPINE rebuild BODY. Wave 2 (Task 3).
 *
 * Maps a MarginIndexBoard (Task 2, src/lib/scores/margin_index.ts) onto the shared spine
 * kit primitives, top to bottom: a Movement chapter opener -> the FULL SSR DecisionRow
 * leaderboard, keep-ranked, every row FREE (each wrapped in a stable per-row anchor for
 * deep links; the composite badge each wore left on 2026-10-05, below) -> a SampleTag line
 * -> a plain /extremes cross-link.
 *
 * Precedent: src/app/dev/decide-v2/recommend-view.tsx uses the same DecisionRow/badge
 * mapping, EXCEPT this view carries NO LockVeil (the Margin Index is fully free), ranks
 * by keep (not composite), and wraps each row in an id anchor.
 *
 * HONESTY RAILS baked in here:
 *  - keptKnown is the row's keepKnown (a null keep dashes, never a fabricated 0%).
 *  - no rows are dropped from the ranking; toMarginIndexBoard() already omits rows with
 *    neither a keep nor a composite to show.
 */
import {
  DecisionRow,
  DecisionRowHeader,
  KitIndexStyles,
  type SignalDef,
  type DecisionDatum,
} from "@/components/spine/kit-index";
import { Movement, Full, Box, SampleTag } from "@/components/spine/kit";
import type { MarginIndexBoard, MarginIndexRow } from "@/lib/scores/margin_index";

/* NO COMPOSITE (masterplan step 02, 2026-10-05; his ruling 11 of 2026-09-26, "no composite, ever"). Each row wore a
   0..100 composite badge and two of its axes, "Ease" and "Demand", as columns. The ranking was always by margin kept, a
   like-for-like share, and that is all a row prints now. The rows still carry the composite (margin_index.ts); nothing
   here draws it. */
const SIGNALS: SignalDef[] = [];

function toDatum(r: MarginIndexRow): DecisionDatum {
  return {
    id: r.id,
    name: r.name,
    href: r.href,
    keptPct: r.keepPct ?? 0,
    keptKnown: r.keepKnown, // false => dash, never 0%
    support: [],
  };
}

export function MarginIndexView({ board }: { board: MarginIndexBoard }) {
  const noun = board.direction === "places-for-trade" ? "places" : "trades";
  const heading =
    board.direction === "places-for-trade"
      ? `Where ${board.subject} keep the most`
      : `What keeps the most in ${board.subject}`;
  return (
    <>
      <KitIndexStyles />
      <Movement
        index="01"
        eyebrow="The Margin Index"
        heading={heading}
        icon="ranking"
      />
      <Full>
        <Box>
          <div className="spine-scope">
            <DecisionRowHeader signals={SIGNALS} />
            {board.rows.map((r) => (
              <div key={r.id} id={r.anchor} className="scroll-mt-24">
                <DecisionRow d={toDatum(r)} signals={SIGNALS} />
              </div>
            ))}
          </div>
        </Box>
      </Full>
      <Full>
        <p className="text-sm">
          <SampleTag note={`Ranked by margin kept, a like for like share, across ${noun}. Each figure is an estimate.`} />
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
