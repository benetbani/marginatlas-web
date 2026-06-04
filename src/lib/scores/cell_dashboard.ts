/**
 * src/lib/scores/cell_dashboard.ts
 *
 * Pure synthesis for the top-of-page cell dashboard. Turns the numbers the
 * cell page has already computed into two tight tables of label/value rows:
 * "The numbers" (money) and "The market". The page renders these as a
 * scannable stat grid above the prose, so the reader perceives the economics
 * before reading a word.
 *
 * HIDE WEAKNESS (founder rule): a row is pushed ONLY when its value is a real,
 * finite number. A null or non-finite input means the row is omitted, never
 * faked. We do NOT invent chain share, informality, revenue concentration,
 * survival, churn, or pricing power here; those arrive in a later data drop and
 * stay out of this module until then.
 *
 * Pure module: no Supabase, no fs, no other domain modules at runtime. Cell is
 * a type-only import, so this stays trivially unit-testable and cannot trip the
 * layering gate. The caller passes its own money formatter so the dashboard
 * matches the rest of the page exactly.
 */
import type { Cell } from "@/lib/cells";

export type DashRow = { label: string; value: string | null; hint?: string };

export type CellDashboardData = { money: DashRow[]; market: DashRow[] };

export interface CellDashboardInput {
  cell: Cell;
  typicalRevenue: number | null;
  grossMarginPct: number | null; // 0..1
  netMarginPct: number | null; // 0..1
  ownerTakeHome: number | null;
  breakevenOrdersDaily: number | null;
  typicalOrdersDaily: number | null;
  peopleWorking: number | null;
  wagePerEmployee: number | null;
  cityPopulation: number | null; // residents, null if geo is not a city
  fmtMoney: (n: number | null | undefined) => string; // the page's formatter
}

/** A finite, real number (not null, not NaN, not Infinity). */
function isNum(n: number | null | undefined): n is number {
  return n != null && Number.isFinite(n);
}

/**
 * Derive a one-word market-structure read from the firm-size distribution.
 *
 * firm_distribution is a share-per-size-band record. Values may arrive as
 * fractions that sum to ~1 or as percentages that sum to ~100; we normalise
 * when any value looks like a percentage (> 1). The small-operator share is
 * the "1-4" band plus "5-9" when present. >= 0.7 reads fragmented, <= 0.4
 * concentrated, otherwise mixed. Null/empty distribution returns null so the
 * row self-omits.
 */
function marketStructure(
  dist: Record<string, number> | null | undefined,
): string | null {
  if (!dist) return null;
  const entries = Object.entries(dist).filter(([, v]) => isNum(v));
  if (entries.length === 0) return null;

  // Normalise to fractions when the values look like percentages.
  const looksLikePercent = entries.some(([, v]) => v > 1);
  const norm = (v: number) => (looksLikePercent ? v / 100 : v);

  const band = (key: string): number => {
    const hit = entries.find(([k]) => k === key);
    return hit ? norm(hit[1]) : 0;
  };

  const smallShare = band("1-4") + band("5-9");
  if (!isNum(smallShare) || smallShare <= 0) return null;

  if (smallShare >= 0.7) return "Fragmented (many small operators)";
  if (smallShare <= 0.4) return "Concentrated (few large operators)";
  return "Mixed";
}

/**
 * Build the dashboard tables for a cell. Deterministic and side-effect free:
 * same inputs always yield the same rows. Each row is pushed only when its
 * value is a real number.
 */
export function buildCellDashboard(input: CellDashboardInput): CellDashboardData {
  const {
    cell,
    typicalRevenue,
    grossMarginPct,
    netMarginPct,
    ownerTakeHome,
    breakevenOrdersDaily,
    typicalOrdersDaily,
    peopleWorking,
    wagePerEmployee,
    cityPopulation,
    fmtMoney,
  } = input;

  const money: DashRow[] = [];

  if (isNum(typicalRevenue)) {
    money.push({
      label: "Typical revenue",
      value: fmtMoney(typicalRevenue),
      hint: "median firm",
    });
  }
  if (isNum(grossMarginPct)) {
    money.push({
      label: "Gross margin",
      value: `${Math.round(grossMarginPct * 100)}%`,
    });
  }
  if (isNum(netMarginPct)) {
    money.push({
      label: "Net margin",
      value: `${Math.round(netMarginPct * 100)}%`,
    });
  }
  if (isNum(ownerTakeHome)) {
    money.push({
      label: "Owner take-home",
      value: fmtMoney(ownerTakeHome),
    });
  }
  if (isNum(breakevenOrdersDaily)) {
    money.push({
      label: "Break-even",
      value: `${Math.round(breakevenOrdersDaily)} orders/day`,
      hint: isNum(typicalOrdersDaily)
        ? `vs ${Math.round(typicalOrdersDaily)} typical`
        : undefined,
    });
  }
  if (isNum(peopleWorking)) {
    money.push({
      label: "People working",
      value: peopleWorking.toLocaleString(),
    });
  }
  if (isNum(wagePerEmployee)) {
    money.push({
      label: "Wage / employee",
      value: fmtMoney(wagePerEmployee),
    });
  }

  const market: DashRow[] = [];

  const competitors = cell.n_enterprises;
  if (isNum(competitors)) {
    market.push({
      label: "Competitors",
      value: competitors.toLocaleString(),
      hint: "firms in this market",
    });
  }

  if (isNum(competitors) && isNum(cityPopulation) && cityPopulation > 0) {
    const per10k = Math.round((competitors / (cityPopulation / 10000)) * 10) / 10;
    if (isNum(per10k)) {
      market.push({
        label: "Density",
        value: `${per10k} per 10k residents`,
      });
    }
  }

  const structure = marketStructure(cell.firm_distribution);
  if (structure) {
    market.push({ label: "Market structure", value: structure });
  }

  return { money, market };
}
