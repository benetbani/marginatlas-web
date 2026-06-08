/**
 * /api/cell-take-home — the entitlement-checked reveal of owner take-home (M2).
 *
 * Returns { value } ONLY when gating is on, auth is on, and the signed-in viewer
 * is Basic or Premium (getSessionTier). For everyone else it returns { value:
 * null }, so the real figure never reaches a non-subscriber. NEVER cached (per
 * user): force-dynamic + private/no-store. The client island swaps the redacted
 * placeholder for this value when it is non-null.
 *
 * The take-home is computed via the same single source of truth the cell page
 * uses (estimateNetProfit + resolveOwnerTakeHome over the cell's revenue and
 * per-firm payroll), so the revealed number matches the board.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSessionTier } from "@/lib/monetization/entitlement";
import { isGatingEnabled, isAuthEnabled } from "@/lib/feature_flags";
import { getCellBySlug, type Cell } from "@/lib/cells";
import { estimateNetProfit } from "@/lib/finance/net_profit";
import { resolveOwnerTakeHome } from "@/lib/finance/owner_take_home";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { londonOwnerTakeHome } from "@/lib/london/take_home";

export const dynamic = "force-dynamic";

function isNum(n: number | null | undefined): n is number {
  return n != null && Number.isFinite(n);
}

/** The cell's after-tax owner take-home, computed exactly as the city table does. */
function cellTakeHome(cell: Cell, annualIncome: number | null): number | null {
  const revenue = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  if (!isNum(revenue) || revenue <= 0) return null;

  let payroll: number | null = null;
  if (isNum(cell.payroll_per_employee) && isNum(cell.n_employees)) {
    const empPerFirm =
      isNum(cell.n_enterprises) && cell.n_enterprises > 0
        ? cell.n_employees < cell.n_enterprises
          ? cell.n_employees
          : cell.n_employees / cell.n_enterprises
        : cell.n_employees;
    payroll = cell.payroll_per_employee * Math.max(1, empPerFirm);
  }

  const net = estimateNetProfit({
    iso2: cell.country.toUpperCase(),
    geoId: cell.geo_id || null,
    industryId: cell.industry_id || null,
    sectorId: cell.sector_id || null,
    grossRevenue: revenue,
    payroll,
  });
  const isLargerFirm =
    !!cell.size_band && ["10-19", "20-49", "50-99", "100+"].includes(cell.size_band);
  return resolveOwnerTakeHome({
    structuralNetProfit: net.net_profit,
    rawNetMargin: net.net_margin,
    revenue,
    industryId: cell.industry_id || null,
    isLargerFirm,
    annualIncome,
  });
}

export async function GET(request: NextRequest) {
  // Gate closed unless gating + auth are on AND the viewer is a paying subscriber.
  if (!isGatingEnabled() || !isAuthEnabled()) {
    return NextResponse.json({ value: null });
  }
  const tier = await getSessionTier();
  if (tier !== "basic" && tier !== "premium") {
    return NextResponse.json({ value: null });
  }

  const { searchParams } = new URL(request.url);
  const country = (searchParams.get("country") || "").toLowerCase();
  const geo = (searchParams.get("geo") || "").toLowerCase();
  const industry = (searchParams.get("industry") || "").toLowerCase();
  if (!country || !geo || !industry) return NextResponse.json({ value: null });

  try {
    const cell = await getCellBySlug(country, geo, industry);
    if (!cell) return NextResponse.json({ value: null });
    const econ = getCountryEconomicsSnapshot(cell.country.toUpperCase());
    const annualIncome = isNum(econ.avgMonthlySalary) ? econ.avgMonthlySalary * 12 : null;
    const value = londonOwnerTakeHome(cell) ?? cellTakeHome(cell, annualIncome);
    return NextResponse.json(
      { value: isNum(value) ? value : null },
      { headers: { "cache-control": "private, no-store" } },
    );
  } catch {
    return NextResponse.json({ value: null });
  }
}
