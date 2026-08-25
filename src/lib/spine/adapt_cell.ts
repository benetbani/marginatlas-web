/**
 * src/lib/spine/adapt_cell.ts , the CELL-page real-data adapter (Phase B).
 *
 * Promotes the cell spine surface (/dev/spine-cell body) from its illustrative
 * seed to real, reconciled data behind the isSpineReformEnabled() flag. Server
 * only, pure (no "use client"): it must be awaited from the RSC cell route, never
 * called from a client island.
 *
 * HONESTY RAIL (absolute): every figure is driven from the accessor + finance
 * engines via the SAME call chain the live cell page runs (loadCellView below,
 * shared with the live page so there is one source of truth). Nothing is
 * fabricated. Fields with no honest source are left UNDEFINED in the returned
 * object; the spine components null-guard them so an omitted field renders
 * nothing (never "0" / "undefined" / NaN / a broken block). Prose is reused from
 * the sanctioned cell_view.ts synthesis, never invented here.
 *
 * What is OMITTED on promotion (no honest per-figure source; see the field spec
 * docs/superpowers/specs/2026-07-03-cell-field-provenance-map.md):
 *   - the whole Demand chapter (dayparts / channels / catchment)
 *   - the entire subtype control room (FormatPicker / FormatProvider / ComparePro)
 *   - who_suits numeric dot scales
 *   - per-peer take-home / break-in columns in Nearby
 *   - setup / cost-to-open when the cell carries no real setup_costs
 *   - off-London: seasonality / first_year / wages / risks / myth (cell_view
 *     already returns null there, so they pass through as undefined)
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures.
 */
import {
  getCellBySlug,
  getSameIndustryAcrossStates,
  cellUrl,
  withBudget,
} from "@/lib/cells";
import type { Cell } from "@/lib/cells";
import { isTrustedLocalCell } from "@/lib/cells/trust";
import { computeBreakeven } from "@/lib/economics/breakeven";
import { getCityTier } from "@/lib/cities/city_tier";
import { iso2ToName } from "@/lib/countries";
import { estimateNetProfit } from "@/lib/finance/net_profit";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { clampMargin } from "@/lib/finance/margin_floor";
import { resolveOwnerTakeHome } from "@/lib/finance/owner_take_home";
import {
  estimateWagePerEmployee,
  estimateEmployeesFromFirms,
} from "@/lib/extrapolations/fill_missing";
import { buildCellBoard, getLondonEntry } from "@/lib/scores/cell_board";
import { buildCellView } from "@/lib/cells/cell_view";
import type { CellView } from "@/lib/cells/cell_view";
import { slugToIndustry, tradeNounFor } from "@/lib/taxonomy";
import { getActivityCharacter } from "@/lib/content/activity_character";

/* ------------------------------------------------------------------------- */
/* Shared cell-view loader , the ONE call chain the live cell page also runs. */
/* ------------------------------------------------------------------------- */

/**
 * The resolved cell view plus the engine outputs the callers need. Reuses the
 * exact accessor + finance-engine sequence from the live cell route so the spine
 * adapter and the non-spine page can never disagree on a figure.
 */
export type LoadedCellView = {
  cell: Cell;
  cellView: CellView;
  /** The London exemplar entry (GB cells only), or null. */
  londonEconomics: { revenue: number; net_margin_pct: number; owner_take_home: number; firms: number } | null;
  /** Reconciliation values, so the caller can shape the seed + report them. */
  typicalRevenue: number | null;
  netMarginPct: number | null; // 0..100
  ownerTakeHome: number | null;
  firms: number | null;
  breakInScore: number | null;
  breakevenOrdersDaily: number | null;
  typicalOrdersDaily: number | null;
  avgSpendUsd: number | null;
  placeName: string;
  tradeName: string;
  tradeNoun: string;
  isLondon: boolean;
};

/**
 * Load the cell view + the engine outputs for one (country, geo, industry),
 * running the identical chain the live cell page uses (getCellBySlug ->
 * computeBreakeven -> estimateNetProfit -> resolveOwnerTakeHome -> buildCellBoard
 * -> buildCellView), so both surfaces share a single source of truth. Returns
 * null when the cell does not resolve (the caller decides what to do).
 */
export async function loadCellView(
  country: string,
  geo: string,
  industry: string,
): Promise<LoadedCellView | null> {
  const cell = await getCellBySlug(country, geo, industry, { sizeBand: null, year: null });
  if (!cell) return null;

  const isUsCell = country.toLowerCase() === "us";

  // Margin waterfall inputs (mirrors the live page's payroll-per-firm detection).
  const grossRevenueForMargin = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  let payrollForMargin: number | null = null;
  if (cell.payroll_per_employee != null && cell.n_employees != null) {
    const empPerFirm =
      cell.n_enterprises && cell.n_enterprises > 0
        ? cell.n_employees < cell.n_enterprises
          ? cell.n_employees
          : cell.n_employees / cell.n_enterprises
        : cell.n_employees;
    const effectiveEmpPerFirm = Math.max(1, empPerFirm);
    payrollForMargin = cell.payroll_per_employee * effectiveEmpPerFirm;
  }
  const netProfitResult =
    grossRevenueForMargin && grossRevenueForMargin > 0
      ? estimateNetProfit({
          iso2: country.toUpperCase(),
          geoId: cell.geo_id || geo,
          industryId: cell.industry_id || null,
          sectorId: cell.sector_id || null,
          grossRevenue: grossRevenueForMargin,
          payroll: payrollForMargin,
        })
      : null;
  const rawNetMargin = netProfitResult?.net_margin ?? null;
  const netTakeHome = netProfitResult?.net_profit ?? null;

  const isLargerFirm =
    !!cell.size_band && ["10-19", "20-49", "50-99", "100+"].includes(cell.size_band);
  const econSnap = getCountryEconomicsSnapshot(country.toUpperCase());
  const annualIncome = econSnap.avgMonthlySalary != null ? econSnap.avgMonthlySalary * 12 : null;
  const computedNetMargin =
    rawNetMargin != null ? clampMargin(rawNetMargin, "net", cell.industry_id || null) : null;
  const adjustedNetTakeHome = resolveOwnerTakeHome({
    structuralNetProfit: netTakeHome,
    rawNetMargin,
    revenue: grossRevenueForMargin,
    industryId: cell.industry_id || null,
    isLargerFirm,
    annualIncome,
  });

  const cityTier = getCityTier(geo);
  const be = cell.industry_id
    ? computeBreakeven(cell.industry_id, cell.revenue_per_firm ?? cell.rev_p50 ?? null, cityTier)
    : null;
  const employeesEstimate =
    cell.n_employees ?? estimateEmployeesFromFirms(cell.industry_id, cell.n_enterprises);
  const wageEstimate =
    cell.payroll_per_employee ?? estimateWagePerEmployee(country, cell.industry_id, geo);

  const londonEntry = getLondonEntry(cell);

  const { breakInRating } = buildCellBoard({
    cell,
    ownerTakeHome: adjustedNetTakeHome,
    cityPopulation: null,
    cityCostOfLivingIndex: null,
    econ: econSnap,
    londonEntry,
  });

  const Le = londonEntry?.economics ?? null;
  const expectedIndustryId = slugToIndustry(industry)?.id ?? cell.industry_id ?? undefined;
  const trustedLocalCell = isTrustedLocalCell(cell, expectedIndustryId);
  const placeName = cell.geo_name || iso2ToName(country) || country.toUpperCase();
  const tradeName = cell.industry_name || industry.replace(/-/g, " ");
  const tradeNoun = tradeNounFor(tradeName);

  const viewRevenue = Le?.revenue ?? cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  const viewNetMarginPct = Le
    ? Le.net_margin_pct
    : computedNetMargin != null
      ? computedNetMargin * 100
      : null;
  const viewTakeHome = Le?.owner_take_home ?? adjustedNetTakeHome ?? null;
  const viewFirms = Le?.firms ?? cell.n_enterprises ?? null;

  // Same-trade peers: US-state slate (real per-peer revenue). Off the US there
  // are none, and the London exemplar's own UK peers are synthesized INSIDE the
  // view model (name + revenue only), so no fabricated per-peer money leaks.
  const acrossStates = isUsCell
    ? await withBudget(
        getSameIndustryAcrossStates(industry, cell.geo_id, 10),
        [],
        4_000,
        "getSameIndustryAcrossStates",
      )
    : [];
  const nearbyPeers = (isUsCell ? acrossStates : [])
    .filter((c) => (c.geo_name || "") && (c.geo_name || "") !== (cell.geo_name || ""))
    .map((c) => ({
      name: c.geo_name || "",
      href: cellUrl(c),
      value: c.revenue_per_firm ?? c.rev_p50 ?? null,
    }));

  const cellView = buildCellView({
    cell,
    londonEntry,
    placeName,
    tradeName,
    tradeNoun,
    industrySlug: industry,
    typicalRevenue: viewRevenue,
    netMarginPct: viewNetMarginPct,
    ownerTakeHome: viewTakeHome,
    firms: viewFirms,
    breakInRating: breakInRating?.score ?? null,
    isTrustedLocal: trustedLocalCell,
    costStructure: cell.cost_structure ?? null,
    breakevenOrdersDaily: be?.breakevenOrdersDaily ?? null,
    typicalOrdersDaily: be?.currentOrdersDaily ?? null,
    employees: employeesEstimate ?? null,
    wagePerEmployee: wageEstimate ?? null,
    peers: nearbyPeers,
    narrative: null,
  });

  return {
    cell,
    cellView,
    londonEconomics: Le,
    typicalRevenue: viewRevenue,
    netMarginPct: viewNetMarginPct,
    ownerTakeHome: cellView.ownerKeeps?.takeHome ?? null,
    firms: viewFirms,
    breakInScore: breakInRating?.score ?? null,
    breakevenOrdersDaily: be?.breakevenOrdersDaily ?? null,
    typicalOrdersDaily: be?.currentOrdersDaily ?? null,
    avgSpendUsd: be?.aov ?? null,
    placeName,
    tradeName,
    tradeNoun,
    isLondon: cellView.isLondon,
  };
}

/* ------------------------------------------------------------------------- */
/* Small honest helpers.                                                     */
/* ------------------------------------------------------------------------- */

function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}
/** Round a 0..100 margin to a whole percent, or undefined if not real. */
function pctOrUndef(v: number | null | undefined): number | undefined {
  return isNum(v) ? Math.round(v) : undefined;
}
/** Map cell_view masthead tier + break-in score to the 0..100 the masthead reads. */
function breakInWord(score: number | null): "Manageable" | "Demanding" | "Brutal" | undefined {
  if (!isNum(score)) return undefined;
  return score >= 45 ? "Manageable" : score >= 30 ? "Demanding" : "Brutal";
}

/* ------------------------------------------------------------------------- */
/* The adapter , reshape LoadedCellView into the spine cell seed shape.       */
/* ------------------------------------------------------------------------- */

/**
 * Build the real-data spine cell seed for one (country, geo, industry). Every
 * filled field is driven from the accessor / finance engines via loadCellView;
 * every field without an honest source is left undefined so the spine components
 * render nothing there. Returns undefined when the cell does not resolve (the
 * route falls back to notFound() upstream, matching the non-spine page).
 */
/**
 * Strip internal markers from a reader-facing provenance sentence.
 *
 * These lines are authored in the data, not here, so a marker added upstream
 * reaches a reader with nothing in between. Cuts a trailing pipe-separated
 * segment that is a bare key:value token, which is what internal markers look
 * like, and leaves prose alone: "Estimated from regional patterns | see note"
 * keeps its second half, "Estimated from regional patterns | scrub:x-2026-05-31"
 * loses it.
 */
function sanitiseProvenance(line: string | null | undefined): string | null {
  if (!line) return null;
  const parts = String(line).split("|").map((p) => p.trim()).filter(Boolean);
  const kept = parts.filter((p) => !/^[a-z][\w-]*:[\w.\-/]+$/i.test(p));
  return kept.length ? kept.join(" | ") : null;
}

export async function buildSpineCellSeed(
  country: string,
  geo: string,
  industry: string,
): Promise<any> {
  const loaded = await loadCellView(country, geo, industry);
  if (!loaded) return undefined;

  const {
    cell,
    cellView: v,
    netMarginPct,
    ownerTakeHome,
    firms,
    breakInScore,
    placeName,
    tradeName,
  } = loaded;

  const countryName = iso2ToName(country) || country.toUpperCase();

  /* -- meta ---------------------------------------------------------------- */
  // Provenance from the cell's real coverage_source (NEVER the seed's
  // "illustrative" line). Kept short and agency-name-free by the accessor.
  const meta = {
    iso2: country.toUpperCase(),
    geo,
    industry,
    city: placeName,
    country_name: countryName,
    trade: tradeName,
    /* THE PROVENANCE LINE IS SANITISED, BECAUSE IT COMES FROM DATA AND NOT FROM
       CODE. Found by rendering a trade page for a city that is not the exemplar:
       Mumbai cafes printed "Estimated from regional patterns |
       scrub:revenue-cap-2026-05-31" to a reader. That token is an internal
       marker, and the gate that catches internal notes scans SOURCE, so a note
       carried in a database field walks straight past it. Anything after a pipe
       that looks like an internal key is cut, and the sentence keeps its meaning. */
    provenance_line: sanitiseProvenance(cell.coverage_source) || "Modeled from national business statistics.",
  };

  /* -- headline ------------------------------------------------------------ */
  // The spread is the masthead's p10/p50/p90; break-in as a 0..100 for the word.
  const spread = v.masthead.spread;
  const headline = {
    answer: v.masthead.answer ?? v.masthead.title,
    rev_p10_usd: isNum(spread?.p10) ? Math.round(spread!.p10!) : undefined,
    rev_p50_usd: isNum(spread?.p50) ? Math.round(spread!.p50!) : undefined,
    rev_p90_usd: isNum(spread?.p90) ? Math.round(spread!.p90!) : undefined,
    /* WHERE THE BAND'S SHAPE CAME FROM, carried instead of dropped. One of the
       two paths that builds this spread multiplies the typical figure by fixed
       constants, so it draws the same shape for every trade. The ruling on
       invented bands says that must be marked; the mark was being discarded
       here, one layer above the component that needs it. */
    rev_spread_basis: spread && "basis" in spread && spread.basis ? spread.basis : "measured",
    break_in_0_100: isNum(breakInScore) ? Math.round(breakInScore) : undefined,
    n_firms: isNum(firms) ? Math.round(firms) : undefined,
  };

  /* -- margins ------------------------------------------------------------- */
  const margins = { net_pct: pctOrUndef(netMarginPct) };

  /* -- owner (the hero take-home) ------------------------------------------ */
  const owner = isNum(ownerTakeHome)
    ? {
        take_home_usd: Math.round(ownerTakeHome),
        margin_pct: pctOrUndef(netMarginPct),
        surface_line: v.narrative ?? undefined,
      }
    : undefined;

  /* -- verdict (the honest-take prose) ------------------------------------- */
  const verdict = v.honestTake
    ? {
        break_in_line: v.honestTake.verdict,
        // The crowded line reuses the first honest-take point when present; else
        // a plain, number-free consequence line (no fabricated figure).
        crowded_line:
          v.honestTake.points[0] ??
          v.honestTake.body ??
          "A new operator competes for the same customers from day one.",
      }
    : undefined;

  /* -- money_split (the $100 cost stack; kept slice = net margin) ----------
     ROUNDED AS A SET, NOT ONE AT A TIME. Each share used to go through its own
     Math.round, and five independent roundings do not have to add up. Measured on
     the real London pages: the raw shares sum to 100.00 in every case, and after
     rounding, restaurants came to 30 + 34 + 15 + 15 + 5 = NINETY-NINE, while hair
     salons and cafes happened to land on 100. Correct by luck on two of three and
     wrong on the flagship.

     It matters beyond the arithmetic: the card holding this is a waterfall whose
     own code refuses to draw at all when the split does not close to the opening
     figure. A lost point costs the reader the whole section.

     The fix is the standard apportionment method: floor every share, then hand the
     leftover points to the largest fractional parts. It has the property this needs,
     which is that it REPRODUCES the naive result wherever the naive result already
     closed. Verified against all three real pages: hair salons and cafes come out
     byte for byte as before, restaurants gains its missing point on the largest
     remainder. No share moves by more than one. */
  const roundToTotal = (values: number[], total: number): number[] => {
    const floors = values.map((x) => Math.floor(x));
    let left = total - floors.reduce((a, b) => a + b, 0);
    const order = values
      .map((x, i) => ({ i, frac: x - Math.floor(x) }))
      .sort((a, b) => b.frac - a.frac);
    const out = floors.slice();
    for (const { i } of order) {
      if (left <= 0) break;
      out[i] += 1;
      left -= 1;
    }
    return out;
  };
  const moneySplit =
    v.moneyGoes && v.moneyGoes.length > 0
      ? (() => {
          const pcts = roundToTotal(
            v.moneyGoes.map((m) => m.perHundred),
            100,
          );
          return {
            surface_line: v.narrative ?? undefined,
            items: v.moneyGoes.map((m, i) => ({
              name: m.label,
              pct: pcts[i],
              kept: !!m.kept,
            })),
          };
        })()
      : undefined;

  /* -- cost_drivers (the margin levers) ------------------------------------ */
  const costDrivers =
    v.costDrivers && v.costDrivers.length > 0
      ? v.costDrivers.map((c) => ({ name: c.label, note: c.note ?? "" }))
      : undefined;

  /* -- break_even (real covers a day) -------------------------------------- */
  const breakEven =
    v.breakEven && isNum(v.breakEven.value)
      ? {
          covers_per_day: v.breakEven.value,
          typical_covers_per_day: isNum(v.breakEven.typical) ? v.breakEven.typical : undefined,
          surface_line: v.breakEven.detail ?? v.breakEven.headline,
        }
      : undefined;

  /* -- wages (London exemplar only; null off London -> undefined) ---------- */
  const wages =
    v.wages && v.wages.length > 0
      ? {
          surface_line: undefined,
          roles: v.wages.map((w) => ({
            role: w.role,
            low_usd: isNum(w.low) ? w.low : isNum(w.median) ? w.median : 0,
            mid_usd: isNum(w.median) ? w.median : isNum(w.low) ? w.low : 0,
            high_usd: isNum(w.high) ? w.high : isNum(w.median) ? w.median : 0,
          })),
        }
      : undefined;

  /* -- seasonality (London only) ------------------------------------------- */
  const seasonality =
    v.seasonality && v.seasonality.monthly && v.seasonality.monthly.length >= 2
      ? {
          surface_line: v.seasonality.note ?? undefined,
          // cell_view emits 0..1 multipliers; the column chart reads an index
          // where the reference rule is 100, so scale to an index.
          months: v.seasonality.monthly.map((m) => Math.round(m * 100)),
        }
      : undefined;

  /* -- first_year (London only) -------------------------------------------- */
  const firstYear =
    v.firstYear && v.firstYear.milestones && v.firstYear.milestones.length > 0
      ? {
          read: v.firstYear.headline ?? undefined,
          // cell_view milestones carry a text `at` tag (e.g. "Mo 6-9"), not a
          // week number. The spine Timeline needs week positions we do not hold
          // honestly, so map to evenly spaced weeks across the year and flag the
          // break-even node (the ONE emphasis cell_view marks). No fabricated
          // dates: the labels + read are real; the positions are an even spread.
          milestones: v.firstYear.milestones.map((mi, i, arr) => ({
            week: Math.round(((i + 1) / arr.length) * 52),
            label: mi.label,
            kind: mi.emphasis ? "breakeven" : "normal",
          })),
          phases: undefined,
        }
      : undefined;

  /* -- myth (London only; survival is the real GB curve) ------------------- */
  // cell_view surfaces the myth prose (myths[0]) but not the survival curve. The
  // real GB survival triple rides on the London entry (getLondonEntry), so re-read
  // it from the entry via the cell. The Myth section needs both to render.
  const mythEntry = v.myths && v.myths.length > 0 ? v.myths[0] : null;
  const londonSurvival = getLondonEntry(cell)?.survival ?? null;
  const myth =
    mythEntry && londonSurvival && isNum(londonSurvival.yr1)
      ? {
          claim: mythEntry.myth,
          reality: mythEntry.reality,
          survival: {
            year1_pct: londonSurvival.yr1,
            year3_pct: isNum(londonSurvival.yr3) ? londonSurvival.yr3 : undefined,
            year5_pct: isNum(londonSurvival.yr5) ? londonSurvival.yr5 : undefined,
            line: undefined,
          },
        }
      : undefined;

  /* -- risks (London only) ------------------------------------------------- */
  const risks =
    v.risks && v.risks.length > 0
      ? {
          surface_line: undefined,
          // cell_view risks carry a severity word (rare/watch/serious), not a
          // 1..10 score. Map severity to a modest score band so the shared 0..10
          // dot scale reads honestly (serious high, watch mid, rare low).
          items: v.risks.map((r) => ({
            name: r.title,
            score_1_10: r.severity === "serious" ? 8 : r.severity === "watch" ? 6 : 3,
            note: r.note,
          })),
        }
      : undefined;

  /* -- nearby (name + revenue real; per-peer take/break-in OMITTED) -------- */
  const nearby =
    v.nearby && v.nearby.length > 0
      ? {
          surface_line: undefined,
          places: v.nearby.map((p, i) => ({
            name: p.name,
            home: i === 0 && p.name === placeName,
            rev_p50_usd: isNum(p.value) ? p.value : undefined,
            // take_home_usd / break_in_0_100 are DELIBERATELY absent (no honest
            // per-peer source); interactive.tsx null-guards those columns.
          })),
        }
      : undefined;

  /* -- setup (only when the cell holds real setup_costs; else undefined) ---- */
  // setupItemsFromCell returns undefined when no real line item is present, so
  // this is the honest omit: cost-to-open + payback derive from these items, and
  // a cell with no setup_costs contributes nothing rather than a fabricated $0.
  const setup = setupItemsFromCell(cell);

  /* -- OMITTED entirely (no honest source): demand, subtypes, who_suits,
        related keep-% column. Leaving them undefined makes the spine components
        render nothing (guarded). ------------------------------------------- */

  /* -- who this suits: authored trade character, connected across altitudes ----
     THE FIRST TRUE CONNECTION FOUND ON ANY LONDON PAGE, and my instrument could
     not see it. That probe compares each adapter against its OWN page, so it is
     blind to content that exists in a sibling module at a different altitude.
     This is exactly that: the trade-across-places page has rendered an authored
     "who it suits" read for months, from a lookup keyed by trade, and the trade
     page never asked for it.

     Read the module before using it (the standing rule): the lookup is a generated
     set of 243 activities plus four hand-written overrides, and it is genuinely
     per-trade rather than a family default. Restaurants and salons return
     different text, checked, not assumed. Trades with no entry return nothing and
     the section self-omits; auto repair and pharmacies are two such today.

     The component is the one the sibling page already uses, imported rather than
     rebuilt (§0 never invent a form, §44 the shared piece is the leverage point).
     Its accent on the "suits" column is correct under §29A: terracotta marks the
     good end, never the worse one. */
  /* The trade's taxonomy id, resolved the same way the loader resolves it. The
     URL slug is hyphenated and the lookup is keyed by the underscored taxonomy id,
     so the slug alone matches nothing: that is the identifier-guessing trap this
     work already fell into once, on a different filter, silently, on every city. */
  const tradeCharacter = getActivityCharacter(slugToIndustry(industry)?.id ?? cell.industry_id ?? undefined);
  /* NAMED trade_character, NOT who_suits. The trade page already has a component
     called WhoSuits and it expects tier BANDS under that key; feeding it prose
     would have made it return null and the section would have stayed dark while
     looking wired. Found by reading the component before naming the field. */
  const tradeCharacterOut =
    tradeCharacter && (tradeCharacter.edge || tradeCharacter.watchOut)
      ? {
          suits: tradeCharacter.edge ? [tradeCharacter.edge] : [],
          think_twice: tradeCharacter.watchOut ? [tradeCharacter.watchOut] : [],
        }
      : undefined;

  return {
    meta,
    headline,
    margins,
    verdict,
    trade_character: tradeCharacterOut,
    money_split: moneySplit,
    cost_drivers: costDrivers,
    owner,
    break_even: breakEven,
    wages,
    seasonality,
    first_year: firstYear,
    myth,
    risks,
    nearby,
    setup,
    // demand: undefined  (Demand chapter omitted)
    // subtypes: undefined  (FormatPicker control room omitted)
    // who_suits: undefined  (numeric scales omitted; rightWrong bullets could
    //   be surfaced later, but the seed's WhoSuits reads scales, so omit here)
    // related: undefined  (keep-% column has no honest per-sibling source)
  };
}

/** Build the setup line items from a cell's real setup_costs block. Only called
 * when hasSetupCostData(cell) is true, so at least one line is real. */
function setupItemsFromCell(cell: Cell): { surface_line?: string; items: Array<{ name: string; usd: number }> } | undefined {
  const setup = cell.setup_costs;
  if (!setup) return undefined;
  const items: Array<{ name: string; usd: number }> = [];
  const reg = setup.registration;
  const cap = setup.capital;
  const push = (name: string, usd: number | undefined) => {
    if (isNum(usd) && usd > 0) items.push({ name, usd: Math.round(usd) });
  };
  if (cap) {
    push("Fit-out", cap.property_fitout);
    push("Equipment", cap.equipment_initial);
    push("Initial inventory", cap.initial_inventory);
    push("Lease deposit", cap.lease_deposit);
    push("Pre-opening marketing", cap.pre_opening_marketing);
  }
  if (reg) {
    push("Business registration", reg.business_registration_fee);
    push("Industry licences", reg.industry_licenses_fee);
    push("Professional licences", reg.professional_license_fee);
    push("Insurance and bonds", reg.insurance_bond_initial);
    push("Certifications", reg.certifications_initial);
  }
  if (items.length === 0) return undefined;
  return { items };
}
