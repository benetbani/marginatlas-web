/**
 * THE INDUSTRY PAGE'S TURN THREE AND ITS EXIT (MODEL.md 8.7; plan step 34's
 * fourth and last dispatch, 2026-09-19): the band `09 know | 10 field`, then
 * `11 close` full width (the page's third of three, R1). Each card is drawn
 * ONCE here and mounted by industry-view.tsx on the page and by the
 * archetype stories on the sheet, so the card a story is judged on is the
 * card the page draws (the renderers-agree rule, plan step 25). The view
 * seats them.
 *
 * `09 know` (KnowCard): THE PAGE'S ONE PROSE SECTION (R9, `data-editorial="1"`
 * through NoteList's default, once on the page now that the old `#suits`
 * carrying it is gone), on NoteList's law in two columns at the wide seat:
 * the two character notes under the trade page's own labels and the first
 * two failure modes under their file's, at most five, every fact authored
 * text (know_rows.ts says whose and counts them); the one not-gathered row
 * where nothing is authored (no live trade). No figure on the card and no
 * door in its foot (the bracket on 8.7's row: PART 7's foot holds a
 * coverage statement or one companion figure; the close's doors navigate).
 * The opener's mark is on because the notes are authored, not measured
 * (the locals card's idiom). QUIET; a prose form holds no 30 by its law.
 *
 * `10 field` (FieldCard): the trade's market builder at the world altitude
 * (market_rows.ts `buildMarket(id, "world")`, the lasts idiom, only the
 * bases change) on KvGrid, THREE CELLS OF THE FOUR: the density, the chain
 * share and the year's swing; the churn cell is built and not drawn (8.7:
 * beside `01 lasts` it is a second view of one reading), and the cut is
 * `fieldCells` below, which the archetype copy gate reads so a churn cell
 * let onto the card reds (planted and watched, 2026-09-19). The three cells
 * take the trade market's own openers as their labels (one literal at two
 * altitudes); the chains and swing cells carry a note under the figure that
 * says the whole in a person's words; every figure is the shard's, modelled
 * (R12), the foot says so, the opener's mark is on behind his switch. The
 * density leads: on an odd count KvGrid's COMPLETE ROWS gives the first
 * cell the card's width. No 30 (candidate 1, the fact card with a focal,
 * unclicked): the laws list's FOCAL row on `#field` is the seat awaiting
 * his click, as on `#lasts`, `#open` and `#channels`. QUIET; turn three
 * carries zero accent (PART 6).
 *
 * `11 close`: THE TRADE PAGE'S OWN CARD, cell/exit.tsx's CloseCard, on
 * Terminus with the site's kicker, off `buildIndustryCloseDoors`
 * (close_rows.ts: the best-paying city's trade page where `06` draws, the
 * trade next door off `02`, the compare pill last). It stands on the same
 * wrapper the trade's close stands on (the hero band; the section-bands
 * baseline for this page was measured with the close there and may only
 * fall). The census reads NoteList, KvGrid and Terminus.
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import { NoteList } from "@/components/spine/archetypes/NoteList";
import { KvGrid, type KvCell } from "@/components/spine/archetypes/KvGrid";
import { COPY } from "@/lib/spine/copy";
import type { KnowData } from "@/lib/spine/know_rows";
import type { MarketData } from "@/lib/spine/market_rows";

export { CloseCard } from "@/components/spine/cell/exit";

export function KnowCard({ id = "know", know }: { id?: string; know: KnowData | null }) {
  if (!know) return null;
  return (
    <Box id={id}>
      <Rail icon="who-for" kicker={COPY.industryKnow.kicker} sample={know.sample} />
      <NoteList notes={know.rows} columns={2} />
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{know.basis}</p>
    </Box>
  );
}

/** The keys the industry card draws, in order, of the builder's four: the churn cell is not among them (8.7's own cut). */
export const FIELD_CELLS = ["firms", "chains", "swing"] as const;

/** The cells the field card draws, in the card's order, each the builder's figure under the trade market's opener; a cell whose figure is withheld is not drawn (KvGrid's own law, no empty slot) and its stated line stands under the grid through `fieldWithheld`, the licence card's idiom. No shard takes that path today (243 hold all four fields); the shape is the builder's. */
export function fieldCells(market: MarketData): KvCell[] {
  const K = COPY.tradeMarket.kickers;
  const N = COPY.industryField.notes;
  const firms = market.firms, chains = market.chains, swing = market.swing;
  const cells: KvCell[] = [];
  if ("figure" in firms) cells.push({ key: "firms", label: K.firms, value: firms.figure, confidence: "modeled" });
  if ("part" in chains) cells.push({ key: "chains", label: K.chains, value: `${chains.part}%`, note: N.chains, confidence: "modeled" });
  if ("figure" in swing) cells.push({ key: "swing", label: K.swing, value: swing.figure, note: N.swing, confidence: "modeled" });
  return cells;
}

/** The stated lines of the cells not drawn, in the card's order. */
export function fieldWithheld(market: MarketData): string[] {
  const out: string[] = [];
  for (const key of FIELD_CELLS) { const cell = market[key]; if ("withheld" in cell) out.push(cell.withheld); }
  return out;
}

export function FieldCard({ id = "field", market }: { id?: string; market: MarketData | null }) {
  if (!market) return null;
  const cells = fieldCells(market);
  if (cells.length === 0) return null;
  return (
    <Box id={id}>
      {/* Every shard figure is modelled (R12), so the opener's mark is on, behind his switch. */}
      <Rail icon="competition" kicker={COPY.industryField.kicker} sample />
      <KvGrid cells={cells} />
      {fieldWithheld(market).map((line) => (
        <p key={line} className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{line}</p>
      ))}
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{COPY.industryField.basis}</p>
      <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{COPY.industryField.foot}</p>
    </Box>
  );
}
