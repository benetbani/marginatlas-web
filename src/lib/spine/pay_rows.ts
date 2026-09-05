/**
 * src/lib/spine/pay_rows.ts
 *
 * THE PAY BARS' ROWS for a country: the minimum salary (the profile's annual
 * minimum wage) and the average salary (the profile's median full-time pay),
 * the world's highest average across every country as the shared edge
 * (founder ruling 13, 2026-09-04), and the withholding rule (ruling 14): an
 * average under 110 percent of the minimum is not a credible pair and is not
 * drawn. Local and synchronous; the same profile fields the adapter's staff
 * block reads. All 195 countries held both figures on 2026-09-05; Cuba and
 * Egypt fell under the rule.
 */
import { COUNTRIES } from "@/lib/taxonomy";
import { getCountryProfile } from "@/lib/economic_profile";
import { COPY } from "@/lib/spine/copy";
import type { PayRow } from "@/components/spine/archetypes/PayBars";

const isPos = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0;
export const PAY_RATIO_FLOOR = 1.1;

export type PayBarsData = {
  rows: PayRow[];
  worldMax: { value: number; name: string; iso2: string } | null;
  withheld: string | null;
  confidence: "measured" | "modeled";
};

const codes = (): string[] => (COUNTRIES as Array<{ code?: string; iso2?: string }>).map((c) => String(c.code ?? c.iso2 ?? "").toUpperCase()).filter((c) => c.length === 2);
const nameOf = (iso2: string): string => String((COUNTRIES as Array<{ code?: string; name?: string }>).find((c) => c.code === iso2)?.name ?? iso2);

let WORLD_MAX: PayBarsData["worldMax"] | undefined;
/** The world's highest average salary on file, computed once per process. */
export function worldMaxAverage(): PayBarsData["worldMax"] {
  if (WORLD_MAX !== undefined) return WORLD_MAX;
  let best: PayBarsData["worldMax"] = null;
  for (const c of codes()) {
    const p = getCountryProfile(c);
    if (p.iso2.toUpperCase() !== c || !isPos(p.median_wage_full_time_usd)) continue;
    if (!best || p.median_wage_full_time_usd > best.value) best = { value: Math.round(p.median_wage_full_time_usd), name: nameOf(c), iso2: c };
  }
  WORLD_MAX = best;
  return best;
}

export function buildPayBars(iso2: string): PayBarsData | null {
  const code = iso2.toUpperCase();
  const p = getCountryProfile(code);
  if (p.iso2.toUpperCase() !== code) return null;
  const floor = isPos(p.minimum_wage_annual_usd) ? Math.round(p.minimum_wage_annual_usd) : null;
  const avg = isPos(p.median_wage_full_time_usd) ? Math.round(p.median_wage_full_time_usd) : null;
  if (floor == null && avg == null) return null;
  const confidence: PayBarsData["confidence"] = p.tier === "A" ? "measured" : "modeled";
  const rows: PayRow[] = [];
  if (floor != null) rows.push({ key: "minimum", label: COPY.pay.minimum, value: floor });
  if (avg != null) rows.push({ key: "average", label: COPY.pay.average, value: avg });
  const withheld = floor != null && avg != null && avg < floor * PAY_RATIO_FLOOR ? COPY.pay.withheld : null;
  return { rows, worldMax: worldMaxAverage(), withheld, confidence };
}
