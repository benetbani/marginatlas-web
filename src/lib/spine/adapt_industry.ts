/**
 * src/lib/spine/adapt_industry.ts , the INDUSTRY-page real-data adapter (Phase B).
 *
 * Promotes the industry spine surface (SpineIndustryBody) from its illustrative
 * seed to real, reconciled data behind the isSpineReformEnabled() flag. Server
 * only, pure (no "use client"): it must be awaited from the RSC industry route,
 * never called from a client island.
 *
 * WHAT THIS ADAPTER STILL FEEDS, AND WHAT THE OPENING READS OFF THE SHARD
 * INSTEAD (MODEL.md 8.7; plan step 34's first dispatch, 2026-09-18). The
 * page's `00 take`, `01 lasts` and `02 benchmark` build off the taxonomy id
 * this seed carries (`meta.id`) through their own builders
 * (industry_hero_facts.ts, lasts_rows.ts, benchmark_rows.ts), which read
 * data/facts/industry/<id>.json through the fact store and the one net
 * builder (trade_net.ts, R7); nothing here composes them. What left this
 * file with that dispatch, each with the fault it carried:
 *   - `margin_index` (the hero's keep off the margins file's clamped net,
 *     with `default_fallback`'s 5% on the 39 trades the file does not hold
 *     and no flag set: 8.7, "the default branch dies"; the rank word and the
 *     "above the all-trades average" clause, verdict words in a hero).
 *   - `benchmark` and `foodDrinkSiblings()` (eight hardcoded food ids, so 23
 *     of 243 trades got a sibling set and every one the same six rows; the
 *     atlas median as `all_trades_avg`): the sector set from the shards
 *     replaces it for 243.
 *   - `subtypes` (the same six siblings again with the archetype's capital
 *     as deltas, drawn as "the trades next door" by cost): its feed was the
 *     list above; `07 formats` draws the shard's own formats at its dispatch.
 *   - `demand` (the AOV off computeBreakeven, the one figure that survived;
 *     visits never fed): the shard's spend and visits feed the hero for 243.
 *   - `operator` (the archetype's cost to open, which printed the 80,000
 *     default as a figure on 90 trades, clause 46; a survival fact off the
 *     London file): the hero's cost cell withholds the default.
 *   - `survival` (getActivitySurvivalArchetype, the 20-activity London file's
 *     triple applied to the trade, R5's "never the London file alone"), and
 *     with it the folklore sentence in the caveats ("The 90% first-year
 *     failure claim is folklore ..."), a myth sentence R5 bans and an echo of
 *     `01`, and the caveats' struck survival claim.
 *
 * WHAT LEFT WITH THE SECOND DISPATCH (plan step 34, 2026-09-18): the
 * `money_split` block (the $100 stack as three stages off the margins file's
 * ladder through the clamp, the file's 5% default on the 39 trades it does
 * not hold, drawn by the old MoneySplit): `03 split` builds off the shard's
 * drivers and THE ONE NET BUILDER by id (split_rows.ts `buildIndustrySplit`,
 * R7), so the page carries one net where it carried two on 8 of 243 trades by
 * a point and the file's default on 39. The old BreakEven, Ramp and
 * CapitalPayback cards, never fed on the live route (`cost_structure`,
 * `first_year`, `payback` were omitted here on purpose), retired into `04
 * open`'s months cell and `05 pays`'s two metric cells, off the shard by id.
 *
 * HONESTY RAIL (absolute) on what remains: every figure is driven from the
 * accessor and synthesis engines the live industry page already runs (the
 * margins file for the caveats' margin claim until `09 know` lands, the
 * activity character, the failure modes, the real where_pays via
 * buildAcrossCities). Nothing is fabricated. Fields with no honest source at
 * industry altitude are left UNDEFINED; the spine body null-guards them so
 * an omitted field renders nothing.
 *
 * What is OMITTED on promotion (no honest per-figure source):
 *   - seasonality (no monthly source) , the Season ribbon
 *   - where_pays[].rent_load_pct
 *
 * WHY THIS FILE SITS ON THE TAKE-HOME BYPASS BASELINE AND STAYS THERE.
 * Classified 2026-08-18. verify_take_home_identity flags it for its
 * `clampMargin` call, made without importing the resolver. That call bounds a
 * MARGIN at trade altitude (the $100 stack's net), where there is no revenue
 * and therefore no take-home to reconcile. The one take-home on this page,
 * `where_pays[].take_home_usd`, is `buildAcrossCities`'s figure rounded, and
 * that module resolves it through `resolveOwnerTakeHome`.
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
import { generateIndustryVerdict } from "@/lib/scores/industry_verdict";
import { getActivityCharacter } from "@/lib/content/activity_character";
import { getFailureModes } from "@/lib/qa/industry_failure_modes";
import { buildAcrossCities } from "@/lib/markets/across_cities";
import { clampMargin } from "@/lib/finance/margin_floor";

type IndustryMarginRow = {
  gross_margin: number;
  operating_margin: number;
  net_margin: number;
  asset_intensity?: number;
  notes?: string;
};
const INDUSTRY_MARGINS = industryMarginsJson as unknown as {
  default_fallback: IndustryMarginRow;
  industries: Record<string, IndustryMarginRow>;
};
function lookupIndustryMargin(industryId: string | null | undefined): IndustryMarginRow {
  if (!industryId) return INDUSTRY_MARGINS.default_fallback;
  return INDUSTRY_MARGINS.industries[industryId] || INDUSTRY_MARGINS.default_fallback;
}

function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}

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
 * Build the real-data spine industry seed for one industry slug. Every filled
 * field is driven from the margin table / synthesis engines; every field without
 * an honest industry-altitude source is left undefined so the spine body renders
 * nothing there. Returns undefined when the slug resolves to no industry (the route
 * falls back to notFound() upstream, matching the non-spine page).
 */
export async function buildSpineIndustrySeed(industrySlug: string): Promise<any> {
  const ind = resolveIndustry(industrySlug);
  if (!ind) return undefined;

  const margin = lookupIndustryMargin(ind.id);
  const character = getActivityCharacter(ind.id);
  const sector = SECTOR_BY_ID[ind.sector_id] ?? null;

  // --- the margins file's ladder (whole percents), for the caveats' margin
  // claim until `09 know` lands on NoteList. NEITHER THE HERO NOR THE SPLIT
  // READS THIS: `00 take` and `03 split` print the one builder's net, which is
  // the shard's ladder or the sector profile's residual (trade_net.ts).
  const grossPct = isNum(margin.gross_margin) ? Math.round(margin.gross_margin * 100) : undefined;
  const operatingPct = isNum(margin.operating_margin) ? Math.round(margin.operating_margin * 100) : undefined;
  // Net through the shared clamp (floor 3%), exactly as every other surface, so a
  // sub-floor net can never reach the page.
  const netFraction = isNum(margin.net_margin) ? clampMargin(margin.net_margin, "net", ind.id) : null;
  const netPct = isNum(netFraction) ? Math.round(netFraction * 100) : undefined;

  // --- the verdict prose (pure synthesis over the same margins) ---------------
  const verdict = generateIndustryVerdict({
    industryName: ind.name,
    margins: {
      grossMargin: isNum(margin.gross_margin) ? margin.gross_margin : null,
      operatingMargin: isNum(margin.operating_margin) ? margin.operating_margin : null,
      netMargin: isNum(margin.net_margin) ? margin.net_margin : null,
      assetIntensity: isNum(margin.asset_intensity) ? margin.asset_intensity : null,
    },
    // The character edge/watch-out feed the close so it speaks the real failure
    // read, mirroring how the cell + verdict modules reuse sanctioned prose.
    edge: character?.edge ?? null,
    watchOut: character?.watchOut ?? null,
  });

  // --- where_pays: the REAL like-for-like leaderboard (buildAcrossCities) ------
  // The commercial heart, fully real: each city is a trusted local measurement of
  // this activity, with the same after-tax take-home + net margin the cell page
  // computes. rent_load_pct OMITTED (no honest source), which is why the re-rank
  // chips are dropped upstream. Self-omits when fewer than three cities resolve.
  const across = await buildAcrossCities(ind.id);
  const wherePlaces =
    across && across.cities.length > 0
      ? across.cities
          .filter((c) => isNum(c.takeHome) && isNum(c.netMarginFraction))
          .map((c) => ({
            name: c.name,
            take_home_usd: Math.round(c.takeHome as number),
            net_margin_pct: Math.round((c.netMarginFraction as number) * 100),
            // rent_load_pct OMITTED.
          }))
      : [];
  const wherePays =
    wherePlaces.length >= 3
      ? {
          note: "Owner take-home, like-for-like and converted to one currency, across the world cities where this trade resolves to a real local measurement.",
          places: wherePlaces,
        }
      : undefined;

  // --- caveats: the margin read and the character/failure read -----------------
  // The survival folklore sentence and the struck survival claim left with the
  // `survival` feed (plan step 34, first dispatch; the header says why).
  const myths: string[] = [];
  if (isNum(grossPct) && isNum(netPct) && grossPct - netPct >= 30) {
    myths.push(
      "A high gross margin is misleading: wages, rent, and overhead consume most of it, leaving a low single-digit net.",
    );
  }
  const failureModes = getFailureModes(ind.id);
  if (failureModes && failureModes.length > 0) {
    const fm = failureModes[0];
    myths.push(`${fm.label}: ${fm.explanation}`);
  }
  /* THE HONEST TAKE IS THE TRADE'S MONEY SHAPE: the character's economics
     paragraph, which says where the money in this trade goes and why, authored
     for 243 of 243 activities. It sits inside a disclosure, after the myths. */
  const honestTake = character?.economics ?? undefined;
  const caveats =
    myths.length > 0 || honestTake
      ? {
          myths: myths.length > 0 ? myths : undefined,
          honest_take: honestTake,
        }
      : undefined;

  // --- who it suits: reuse the character edge/watch-out as the two columns ------
  // Only real, sanctioned prose. Suits reads the edge; think-twice reads the
  // watch-out. Omitted entirely when no character is written.
  const whoSuits =
    character && (character.edge || character.watchOut)
      ? {
          suits: character.edge ? [character.edge] : [],
          think_twice: character.watchOut ? [character.watchOut] : [],
        }
      : undefined;

  // --- meta + provenance ------------------------------------------------------
  const provenanceLine = `Modeled from the trade's structural cost shape${
    wherePays ? " and its real per-city take-home" : ""
  }. Figures are directional and place-stable; the dollars land once you pick a city.`;

  return {
    meta: { industry: ind.id, name: ind.name, id: ind.id, sector: sector?.name ?? undefined },
    provenance_line: provenanceLine,
    verdict: { headline: verdict.headline, lead: verdict.lead, close: verdict.close },
    margins:
      isNum(grossPct) && isNum(operatingPct) && isNum(netPct)
        ? { gross_pct: grossPct, operating_pct: operatingPct, net_pct: netPct }
        : undefined,
    where_pays: wherePays,
    caveats,
    who_suits: whoSuits,
    // OMITTED entirely (no honest source): seasonality. Leaving it undefined
    // makes the spine body render nothing there (guarded). `first_year`,
    // `payback` and `cost_structure` are read off the shard by id now.
  };
}
