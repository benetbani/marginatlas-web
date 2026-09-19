/**
 * src/lib/spine/adapt_industry.ts , the INDUSTRY-page real-data adapter (Phase B).
 *
 * Promotes the industry spine surface (SpineIndustryBody) from its illustrative
 * seed to real, reconciled data behind the isSpineReformEnabled() flag. Server
 * only, pure (no "use client"): it must be awaited from the RSC industry route,
 * never called from a client island.
 *
 * WHAT THIS ADAPTER CARRIES SINCE PLAN STEP 34's FOURTH AND LAST DISPATCH
 * (2026-09-19), and it is everything the twelve blocks of MODEL.md 8.7 read
 * off the seed: the trade's identity (`meta.id`, the taxonomy id the shard
 * is filed under, which every builder takes; `meta.industry`, `meta.name`
 * and `meta.sector` beside it) and the slate resolved for `06 places`
 * (`across`). Every block builds by that id through its own pure builder
 * (industry_hero_facts.ts, lasts_rows.ts, benchmark_rows.ts, split_rows.ts,
 * industry_open_rows.ts, pays_rows.ts, industry_places_rows.ts,
 * formats_rows.ts, mix_rows.ts, know_rows.ts, market_rows.ts,
 * close_rows.ts), reading data/facts/industry/<id>.json through the fact
 * store, the one net builder (trade_net.ts, R7), the authored character and
 * failure modes; nothing here composes a figure or a sentence any more.
 *
 * ONE READ OF THE MARGINS FILE REMAINS, in `resolveIndustry` below, and it
 * is not a figure: the live route has always resolved a slug to the
 * requested trade when that trade holds a row in industry_margins.json and
 * to a measured parent otherwise (`resolveToMeasuredIndustry`), and that
 * decides which id the page is for. Changing it changes the page's subject
 * on the trades that fall to a parent, which is the controller's (the queue
 * row on the parent-resolving route, plan step 34's third dispatch), not a
 * dispatch's; so the read stays, said here, and the file's ladder is read
 * for nothing else.
 *
 * WHAT LEFT WITH THE FOURTH DISPATCH, each with the fault it carried: the
 * `margins` block (the file's gross, operating and net through the clamp,
 * whole percents, a second ladder beside the one net builder's, R7); the
 * `caveats` block (the computed sentence "A high gross margin is misleading
 * ..." fired by a thirty-point gap on that ladder, a string nobody wrote;
 * the first failure mode as "label: explanation"; the character's economics
 * as an honest take behind a disclosure): `09 know` draws the character's
 * two notes and the first two failure modes as authored text and nothing
 * computed; the `who_suits` block (the edge and the watch-out as two bullet
 * lists): the same two facts are `09`'s first two notes by id; the `verdict`
 * block (generateIndustryVerdict's headline, lead and close over the file's
 * margins) and the `provenance_line`, both read by nothing on the spine
 * (the old masthead that printed them left with the first dispatch). The
 * dev industry2 page reads those fields with null guards and draws less.
 *
 * WHAT LEFT WITH THE THIRD DISPATCH (2026-09-19): the `where_pays` block
 * (the slate's columns re-shaped to name, take-home and margin, dropped to
 * `undefined` under three cities, with a note nothing printed; it fed the
 * WherePaysExplorer, which gated on `rent_load_pct`, a field this adapter
 * never set, so `06`'s seat never drew on a live page). WITH THE SECOND
 * (2026-09-18): the `money_split` block (the $100 stack as three stages off
 * the margins file's ladder through the clamp, the file's 5% default on the
 * 39 trades it does not hold, drawn by the old MoneySplit); the old
 * BreakEven, Ramp and CapitalPayback cards, never fed on the live route,
 * retired into `04 open`'s months cell and `05 pays`'s two metric cells,
 * off the shard by id. WITH THE FIRST (2026-09-18): `margin_index` (the
 * hero's keep off the margins file's clamped net with `default_fallback`'s
 * 5% on 39 trades and no flag set, the rank word and the "above the
 * all-trades average" clause); `benchmark` and `foodDrinkSiblings()` (eight
 * hardcoded food ids, 23 of 243 trades served the same six rows); `subtypes`
 * (the same siblings as deltas); `demand` (the AOV off computeBreakeven);
 * `operator` (the archetype's cost to open printing the 80,000 default on
 * 90 trades, clause 46); `survival` (the 20-activity London file's triple,
 * R5) and the folklore sentence it fed.
 *
 * OFF THE TAKE-HOME BYPASS BASELINE since the third dispatch: the one
 * take-home on this page is each column's `takeHome` in `across`, which
 * across_cities.ts resolves through `resolveOwnerTakeHome`; nothing here
 * names a take-home or a margin.
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures.
 */
import industryMarginsJson from "@/lib/finance/industry_margins.json";
import {
  slugToIndustry,
  resolveToMeasuredIndustry,
  SECTOR_BY_ID,
  type Industry,
} from "@/lib/taxonomy";
import { resolveAcrossColumns } from "@/lib/markets/across_cities";

/* The file is read for the ids it holds and nothing else (the header says why). */
const INDUSTRY_MARGINS = industryMarginsJson as unknown as { industries: Record<string, unknown> };

/**
 * Resolve the industry the same way the live route does: prefer the requested
 * trade when it carries its OWN measured margin row, else fall back to a measured
 * parent, else the raw match. Returns null when the slug resolves to nothing.
 */
function resolveIndustry(industrySlug: string): Industry | null {
  const raw = slugToIndustry(industrySlug);
  const ind =
    raw && INDUSTRY_MARGINS.industries[raw.id]
      ? raw
      : resolveToMeasuredIndustry(raw) || raw;
  return ind ?? null;
}

/**
 * Build the real-data spine industry seed for one industry slug: the trade's
 * identity and the slate resolved for `06 places`. Returns undefined when the
 * slug resolves to no industry (the route falls back to notFound() upstream,
 * matching the non-spine page).
 */
export async function buildSpineIndustrySeed(industrySlug: string): Promise<any> {
  const ind = resolveIndustry(industrySlug);
  if (!ind) return undefined;
  const sector = SECTOR_BY_ID[ind.sector_id] ?? null;

  // --- across: the slate resolved, for `06 places` (MODEL.md 8.7; plan step
  // 34's third dispatch, 2026-09-19). The one database read this adapter
  // makes: every city of the curated slate where this trade resolves to a
  // real, trusted local measurement, with the same after-tax take-home and
  // net margin the trade page computes for that city, through
  // `resolveAcrossColumns` (the resolution `buildAcrossCities` runs for the
  // across route, with no floor, so the page's seat can name the count it
  // holds). Handed down as the columns themselves; the builder
  // (industry_places_rows.ts, pure) decides the table or the seat, and an
  // empty list is a count of zero, never an omission.
  const across = await resolveAcrossColumns(ind.id);

  return {
    meta: { industry: ind.id, name: ind.name, id: ind.id, sector: sector?.name ?? undefined },
    across,
  };
}
