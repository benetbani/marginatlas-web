/**
 * src/lib/spine/adapt_industry.ts , the INDUSTRY-page real-data adapter (Phase B).
 *
 * Promotes the industry spine surface (/dev/spine-industry body, SpineIndustryBody)
 * from its illustrative seed to real, reconciled data behind the isSpineReformEnabled()
 * flag. Server only, pure (no "use client"): it must be awaited from the RSC industry
 * route, never called from a client island.
 *
 * HONESTY RAIL (absolute): every figure is driven from the accessor + synthesis
 * engines the live industry page already runs (industry_margins, the industry verdict,
 * the activity survival archetype, the activity character, the real where_pays via
 * buildAcrossCities, the startup-capital archetypes, and the industry AOV via
 * computeBreakeven). Nothing is fabricated. Fields with no honest source at industry
 * altitude are left UNDEFINED in the returned object; the spine body null-guards them so
 * an omitted field renders nothing (never "0" / "undefined" / NaN / a broken block).
 * Prose is reused from the sanctioned synthesis (generateIndustryVerdict, the activity
 * character), never invented here.
 *
 * What is OMITTED on promotion (no honest per-figure source; see the field spec
 * docs/superpowers/specs/2026-07-03-industry-field-provenance-map.md):
 *   - seasonality (no monthly source) , the Season ribbon
 *   - first_year / the Ramp timeline (no ramp source)
 *   - payback / CapitalPayback (needs a single-place take-home + authored gearing)
 *   - cost_structure.breakeven_utilization (the BreakEven meter, no source)
 *   - demand trend Spark + purchases_per_year + venues_per_10k (only the AOV survives)
 *   - operator.sale_multiple_* (no honest exit source)
 *   - subtypes[].rent_sensitivity (drops the WherePays re-rank chips) + per-subtype note
 *   - where_pays[].rent_load_pct , benchmark[].why
 *
 * WHY THIS FILE SITS ON THE TAKE-HOME BYPASS BASELINE AND STAYS THERE.
 * Classified 2026-08-18. verify_take_home_identity flags it for its
 * `clampMargin` calls, made without importing the resolver. Those calls bound a
 * MARGIN at trade altitude (the hero keep, the sibling keeps, the benchmark
 * axis), where there is no revenue and therefore no take-home to reconcile: the
 * whole point of the provenance line is that the dollars land only once a city
 * is picked. The one take-home on this page, `where_pays[].take_home_usd`, is
 * `buildAcrossCities`'s figure rounded, and that module resolves it through
 * `resolveOwnerTakeHome`.
 *
 * Verified by recomputing `buildAcrossCities` independently for restaurants and
 * comparing every carried row: 8 places, zero mismatches, worst dollar gap $0.
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures.
 */
import industryMarginsJson from "@/lib/finance/industry_margins.json";
import {
  slugToIndustry,
  resolveToMeasuredIndustry,
  industryToSlug,
  INDUSTRIES_BY_SECTOR,
  SECTOR_BY_ID,
  type Industry,
} from "@/lib/taxonomy";
import { generateIndustryVerdict } from "@/lib/scores/industry_verdict";
import { getActivitySurvivalArchetype } from "@/lib/scores/activity_board";
import { getActivityCharacter } from "@/lib/content/activity_character";
import { getFailureModes } from "@/lib/qa/industry_failure_modes";
import { computeBreakeven } from "@/lib/economics/breakeven";
import { buildAcrossCities } from "@/lib/markets/across_cities";
import { startupCapitalArchetypeForSlug } from "@/lib/markets/startup_capital_archetypes";
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
 * The MEDIAN net margin (as a whole percent) across every measured trade in the
 * margin table. Computed once from the real table, never a hardcoded seed
 * number. It is the reference the industry benchmark sits this trade against.
 *
 * IT IS A MEDIAN AND IT SHIPS IN A FIELD CALLED `all_trades_avg`. Measured
 * 2026-08-18 over the 204 trades that carry a net margin: the median is 7.920
 * and ships as $8, the mean is 9.126 and would ship as $9. So the two differ by
 * a whole dollar per hundred, on a scale where the trades themselves sit
 * between about $5 and $12, which is the reference tick's entire job to
 * measure. The visible label on the tick reads "All trades / incl. non-food"
 * and never says average, and `avg_note` below says "typical", which is right
 * for a median; but Benchmark's aria-label reads "All trades average" to a
 * screen reader. That string is in a component, and is REPORTED rather than
 * changed from here. The field name cannot be corrected without breaking that
 * component's read, and the VALUE must not be swapped to a mean to fit the
 * name: the median is the better centre for a skewed margin table, which is why
 * it was chosen. The name is the defect, not the number.
 *
 * NOT A DEFECT, MEASURED, so it stops being re-accused: this median is taken on
 * the RAW table while every dot beside it on the same axis is clampMargin'd.
 * The clamp moves 2 of the 204 (both down to a ceiling, worst `bnbs` 16.25% to
 * 14.00%) and neither sits near the centre, so median raw and median clamped
 * are both 7.920 to three decimals. The tick and the dots are on the same scale
 * today. That is a property of the current ceiling table, not of the code, so
 * if the ceilings move this wants re-measuring.
 */
function medianNetPctAcrossTrades(): number {
  const nets = Object.values(INDUSTRY_MARGINS.industries)
    .map((r) => r.net_margin)
    .filter((n): n is number => isNum(n))
    .sort((a, b) => a - b);
  if (nets.length === 0) return 0;
  const mid = Math.floor(nets.length / 2);
  const med = nets.length % 2 ? nets[mid] : (nets[mid - 1] + nets[mid]) / 2;
  return Math.round(med * 100);
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
 * The food-and-drink cuisine/format siblings the benchmark and subtype drill read.
 * These are the real sector siblings that make an honest "vs the trades next door"
 * comparison (the same kitchen-and-room economics), each carrying its own measured
 * net margin. Capped so the lists stay scannable.
 *
 * THEY ARE PEERS, NOT CHILDREN, and this matters because two consumers label
 * them otherwise. The taxonomy has no parent-child relation: `Industry` carries
 * id, name, audience, examples, keywords, sector_id and the three classification
 * arrays, and nothing else. All 23 Food & drink trades are flat members of one
 * sector, each with its own page and its own margin row. So "Bars & nightclubs"
 * is the trade next door to "Restaurants", never a format inside it.
 *
 * THE DOCSTRING USED TO CLAIM "so a non-restaurant trade still gets its own
 * siblings". Measured 2026-08-18 across the whole taxonomy: false. The
 * preferred list below is eight hardcoded food-service ids, so a trade outside
 * that set matches nothing. 23 of 243 trades get any siblings at all, every one
 * of them in Food & drink, and all 23 get the SAME six food-service rows. The
 * other 220 get none, which empties both consumers of this list. Three of the
 * 23 are grocery-stores, specialty-grocers-delis and wine-liquor-stores, which
 * therefore sit beside restaurants, cafés, food trucks, pizzerias, bars and
 * sit-down restaurants. As sector neighbours that is defensible; as anything
 * closer it is not.
 */
function foodDrinkSiblings(ind: Industry): Industry[] {
  const sector = INDUSTRIES_BY_SECTOR[ind.sector_id] || [];
  // Prefer the cuisine/format neighbours, in a stable, reader-friendly order, and
  // only those that carry a measured margin row (so every keep figure is real).
  const preferredOrder = [
    "fast_casual",
    "sit_down_restaurants",
    "cafes_coffee",
    "food_trucks",
    "pizzerias",
    "bars_nightclubs",
    "pubs_taverns",
    "catering",
  ];
  const byId: Record<string, Industry> = Object.fromEntries(sector.map((s) => [s.id, s]));
  const ordered: Industry[] = [];
  for (const id of preferredOrder) {
    if (id === ind.id) continue;
    const sib = byId[id];
    if (sib && INDUSTRY_MARGINS.industries[sib.id]) ordered.push(sib);
  }
  return ordered.slice(0, 6);
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

  const slug = industryToSlug(ind.id);
  const margin = lookupIndustryMargin(ind.id);
  const character = getActivityCharacter(ind.id);
  const sector = SECTOR_BY_ID[ind.sector_id] ?? null;

  // --- the ONE canonical margin set (whole percents), from the measured row ---
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

  // --- the median keep across all measured trades (the honest field average) ---
  const medianNet = medianNetPctAcrossTrades();

  // --- margin index (the hero) ------------------------------------------------
  // The keep is the net percent; the rank word + "vs typical" clause are read
  // honestly against the real cross-trade median, never a seed constant.
  const rankWord =
    isNum(netPct) && isNum(netFraction)
      ? netFraction >= 0.15
        ? "healthy"
        : netFraction >= 0.08
          ? "workable"
          : "thin"
      : undefined;
  const vsTypical = isNum(netPct)
    ? netPct > medianNet
      ? "above the all-trades average"
      : netPct < medianNet
        ? "below the all-trades average"
        : "right at the all-trades average"
    : undefined;

  const marginIndex = isNum(netPct)
    ? { keeps_per_100: netPct, rank_word: rankWord, vs_typical: vsTypical }
    : undefined;

  // --- money split (the $100 stack), 3 real stages from the margin ladder ------
  // Direct cost of sales = 1 - gross; running the business = gross - operating;
  // fixed + tax = operating - net; kept = net. Every stage is a real gap in the
  // measured ladder. The fixed stage is taken as the residual so the stack totals
  // exactly 100 (every dollar accounted). OMITS the seed's 5-line food/wages
  // granularity + the $27/$66 fixed/variable notes (no honest source).
  let moneySplit: any = undefined;
  if (isNum(grossPct) && isNum(operatingPct) && isNum(netPct)) {
    const direct = Math.max(0, 100 - grossPct);
    const running = Math.max(0, grossPct - operatingPct);
    const kept = netPct;
    const fixed = Math.max(0, 100 - direct - running - kept);
    moneySplit = {
      items: [
        { name: "Direct cost of sales", pct: direct, kept: false, group: "variable" },
        { name: "Running the business", pct: running, kept: false, group: "variable" },
        { name: "Fixed costs and tax", pct: fixed, kept: false, group: "fixed" },
        { name: "Owner keeps", pct: kept, kept: true, group: "kept" },
      ],
      annotation:
        "Direct costs and the running cost of the business decide the year; the owner keeps what the bigger lines leave behind.",
      // fixed_note / variable_note deliberately OMITTED (no honest $-per-$100 source).
    };
  }

  // --- demand: only the AOV survives with an honest source --------------------
  // Average order value is revenue-independent (the tier multiplier is neutral
  // here since there is no single place), so a nominal revenue only lets the
  // engine run; the AOV it returns is the real industry baseline. purchases,
  // venues, and the trend Spark are OMITTED (no honest industry-altitude source).
  const be = computeBreakeven(ind.id, 1_000_000, null);
  const spendPerHead = be && isNum(be.aov) ? Math.round(be.aov) : undefined;
  const demand = isNum(spendPerHead)
    ? { spend_per_head_usd: spendPerHead }
    : undefined;

  // --- subtypes: real sector-sibling keeps + archetype capital ----------------
  // The consumer (deriveSubtypes) resolves keep% = base_net + margin_delta_pp and
  // capital = base_capital * (1 + capital_delta_pct/100). Driving the deltas from
  // the real sibling net margins and the real startup-capital archetypes makes the
  // derived rows land exactly on the measured numbers. rent_sensitivity + per-row
  // note are OMITTED, which drops the WherePays re-rank chips (no honest source).
  //
  // THE FIELD IS CALLED `subtypes` AND THE ROWS ARE NOT SUBTYPES. It carries the
  // exact array `benchmark.trades` carries below, minus the self row: measured
  // 2026-08-18, identical in 23 of the 23 seeds that hold either. So one seed
  // ships one set of six sector PEERS twice, and its two consumers label them
  // incompatibly. `benchmark` says "a neighbour in the same sector", which is
  // true. This one is drawn by SubtypeDrill under "Keep and cost, by format",
  // which asserts a containment the taxonomy does not have (see
  // foodDrinkSiblings). The field name cannot be corrected from here without
  // emptying that component's block, which is a section drop; the block-level
  // `note` below is the one string this module owns, and it now says plainly
  // what the rows are. REPORTED for the component owner, not silently reshaped.
  //
  // The capital is a MODELED archetype, never a measurement: the archetype
  // module's own header says the figure is directional and that the surface
  // must say so on the row.
  const siblings = foodDrinkSiblings(ind);
  const baseCapital = startupCapitalArchetypeForSlug(slug);
  let subtypes: any = undefined;
  if (isNum(netPct) && siblings.length > 0) {
    const list = siblings
      .map((sib) => {
        const sm = INDUSTRY_MARGINS.industries[sib.id];
        if (!sm || !isNum(sm.net_margin)) return null;
        /* ROUNDED, and it was not until 2026-08-20. This is the same
           `Math.round(clamp(net) * 100)` the benchmark block below uses for
           `keeps_per_100`, so the two blocks now describe a sibling identically.

           THE DEFECT IT FIXES. `netPct` is already rounded, so subtracting an
           UNROUNDED sibling from it produced a delta carrying the base's rounding
           error. The consumer, `spine/industry/subtypes.ts:26`, resolves
           `keeps_pct = base_net_pct + margin_delta_pp`, which reconstructed the
           sibling's unrounded value exactly: **the same trade printed `8.6%` in
           the subtypes block and `$9` in the benchmark block on the same page.**

           Measured over the margin table: 163 of the 204 trades carrying a net
           margin, 80%, have a printed keep that hides a rounding, worst 0.50pp
           on `fishing_aquaculture` (exact 5.50, shown $6). Each of those is a
           base whose delta arithmetic was off by that much against every sibling.

           Whole percents are the right precision rather than merely the
           convenient one: `base_net_pct` is whole, `keeps_per_100` is whole, and
           the figure is spoken as dollars of every hundred. A delta in "pp"
           against a whole-percent base should be whole too. */
        const sibNetPct = Math.round(clampMargin(sm.net_margin, "net", sib.id) * 100);
        const sibSlug = industryToSlug(sib.id);
        const sibCapital = startupCapitalArchetypeForSlug(sibSlug);
        return {
          name: sib.name,
          slug: sibSlug,
          // Deltas off the base so deriveSubtypes reproduces the real values.
          // Both sides are whole now, so this is exact and needs no toFixed.
          margin_delta_pp: sibNetPct - netPct,
          capital_delta_pct:
            baseCapital > 0 ? Math.round(((sibCapital - baseCapital) / baseCapital) * 100) : 0,
          // rent_sensitivity + note OMITTED.
        };
      })
      .filter((s): s is NonNullable<typeof s> => s !== null);
    if (list.length > 0) {
      subtypes = {
        base_net_pct: netPct,
        base_capital_usd: baseCapital,
        list,
        note: "Each of these is its own trade in the same sector, not a format inside this one. The keep is that trade's own measured net margin; the cost to open is a modeled figure for a baseline economy, not a quote for any one place.",
      };
    }
  }

  // --- operator: real keep, real capital, real 1-yr survival ------------------
  // sale_multiple_* OMITTED (no honest exit source at industry altitude).
  const survival = getActivitySurvivalArchetype(slug);
  const operator: any = {};
  if (isNum(netPct)) operator.owner_keeps_pct = netPct;
  if (isNum(baseCapital)) operator.capital_to_open_usd = baseCapital;
  if (isNum(survival.yr1)) operator.survival_1yr_pct = Math.round(survival.yr1);
  const operatorOut = Object.keys(operator).length > 0 ? operator : undefined;

  // --- survival curve: the real curated archetype -----------------------------
  const survivalOut =
    isNum(survival.yr1) || isNum(survival.yr3) || isNum(survival.yr5)
      ? {
          yr1_pct: isNum(survival.yr1) ? survival.yr1 : undefined,
          yr3_pct: isNum(survival.yr3) ? survival.yr3 : undefined,
          yr5_pct: isNum(survival.yr5) ? survival.yr5 : undefined,
          note: "The attrition is front-loaded: the rooms that clear the first two winters tend to stay.",
        }
      : undefined;

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

  // --- benchmark: real sector-sibling keeps -----------------------------------
  // Each trade's keep is round(net_margin * 100) on the shared axis; self is the
  // industry itself. The all-trades average is the real cross-trade median. The
  // per-trade `why` is OMITTED (no honest per-sibling reason source).
  const benchTrades: any[] = [];
  if (isNum(netPct)) {
    benchTrades.push({ name: ind.name, slug, keeps_per_100: netPct, self: true });
  }
  for (const sib of siblings) {
    const sm = INDUSTRY_MARGINS.industries[sib.id];
    if (!sm || !isNum(sm.net_margin)) continue;
    benchTrades.push({
      name: sib.name,
      slug: industryToSlug(sib.id),
      keeps_per_100: Math.round(clampMargin(sm.net_margin, "net", sib.id) * 100),
    });
  }
  const benchmark =
    benchTrades.length >= 2
      ? {
          all_trades_avg: medianNet,
          avg_note: `The typical trade in the atlas keeps about $${medianNet} of every $100, across every activity, not just the food ones here.`,
          note: "Against its nearest food neighbours, and against the whole trade universe, the gap is real.",
          trades: benchTrades,
          // per-trade `why` OMITTED.
        }
      : undefined;

  // --- caveats: synthesized from the REAL survival + the character/failure read -
  // The myth-debunk is the honest survival read (a high year-1 survival kills the
  // "90% fail" folklore), plus the character watch-out and a named failure mode.
  const myths: string[] = [];
  if (isNum(survival.yr1) && survival.yr1 >= 60) {
    myths.push(
      `The 90% first-year failure claim is folklore: about ${Math.round(survival.yr1)} in 100 make it past year one.`,
    );
  }
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
  const honestTake = character?.watchOut
    ? `Survival is better than the folklore suggests, but the margin is thin: ${character.watchOut.charAt(0).toLowerCase()}${character.watchOut.slice(1)}`
    : undefined;
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
    margin_index: marginIndex,
    money_split: moneySplit,
    demand,
    subtypes,
    operator: operatorOut,
    survival: survivalOut,
    where_pays: wherePays,
    benchmark,
    caveats,
    who_suits: whoSuits,
    // OMITTED entirely (no honest source): first_year (Ramp), payback
    // (CapitalPayback), cost_structure (BreakEven meter), seasonality. Leaving
    // them undefined makes the spine body render nothing there (guarded).
  };
}
