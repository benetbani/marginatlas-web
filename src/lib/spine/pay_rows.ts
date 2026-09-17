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
 *
 * THE PLACEMENT SENTENCES COME OFF THE SAME SWEEP (MODEL.md PART 6, decision
 * 2: "computed from the same single sweep `worldMaxAverage()` already runs";
 * plan step 31's sixth dispatch, 2026-09-18). The one pass over every
 * country that finds the world's highest average now also keeps every
 * average and every minimum it saw, so each of a country's two figures is
 * ranked among every country on file holding that figure, through the one
 * site-wide builder in placement.ts ("Higher than {n} countries in ten",
 * "Among the lowest tenth"; a tie is not lower). A withheld pair gets no
 * line, because its figures are not drawn; a figure the sweep does not hold
 * gets no line, because there is no set to place it in. The country holding
 * the edge is never named (his 2026-09-07 reversal); the sweep's `name` and
 * `iso2` on the edge survive for the story sheet's own instance picker only.
 *
 * WHAT THE SWEEP'S SET IS, stated so the rank is read for what it is: the
 * profile's figures on every row it holds, measured for the tier A rows and
 * modelled for the rest (the card's own `confidence` says which the country
 * is, and the sample mark, behind his switch, follows it). glance_rows.ts
 * withholds the minimum wherever it is the 0.45-times-median fingerprint of a
 * fill; this builder does not, because the card draws the pair on 195
 * countries by its composition row (8.2, `08 hiring`), so the minimum's rank
 * stands among all 195 minimums as filed, fills included. That is the set the
 * card has always drawn its bar against; the sentence places the figure in
 * the same set the bar does.
 */
import { COUNTRIES } from "@/lib/taxonomy";
import { getCountryProfile } from "@/lib/economic_profile";
import { COPY } from "@/lib/spine/copy";
import { placementOf } from "@/lib/spine/placement";
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

/** What ONE pass over every country on file yields: the edge, and the two sets the ranks are read from. */
type WorldPay = { max: PayBarsData["worldMax"]; averages: number[]; minimums: number[] };
let WORLD_PAY: WorldPay | undefined;
/** The sweep, run once per process: every country's average and minimum as the card prints them (whole dollars), and the highest average among them. */
function worldPay(): WorldPay {
  if (WORLD_PAY !== undefined) return WORLD_PAY;
  let best: PayBarsData["worldMax"] = null;
  const averages: number[] = [];
  const minimums: number[] = [];
  for (const c of codes()) {
    const p = getCountryProfile(c);
    if (p.iso2.toUpperCase() !== c) continue;
    if (isPos(p.median_wage_full_time_usd)) {
      const avg = Math.round(p.median_wage_full_time_usd);
      averages.push(avg);
      if (!best || avg > best.value) best = { value: avg, name: nameOf(c), iso2: c };
    }
    if (isPos(p.minimum_wage_annual_usd)) minimums.push(Math.round(p.minimum_wage_annual_usd));
  }
  WORLD_PAY = { max: best, averages, minimums };
  return WORLD_PAY;
}

/** The world's highest average salary on file, computed once per process. */
export function worldMaxAverage(): PayBarsData["worldMax"] {
  return worldPay().max;
}

/** The two sets a country's figures are placed in, for the tests and the census: how many countries hold each figure. */
export function worldPaySets(): { averages: readonly number[]; minimums: readonly number[] } {
  const w = worldPay();
  return { averages: w.averages, minimums: w.minimums };
}

export function buildPayBars(iso2: string): PayBarsData | null {
  const code = iso2.toUpperCase();
  const p = getCountryProfile(code);
  if (p.iso2.toUpperCase() !== code) return null;
  const floor = isPos(p.minimum_wage_annual_usd) ? Math.round(p.minimum_wage_annual_usd) : null;
  const avg = isPos(p.median_wage_full_time_usd) ? Math.round(p.median_wage_full_time_usd) : null;
  if (floor == null && avg == null) return null;
  const confidence: PayBarsData["confidence"] = p.tier === "A" ? "measured" : "modeled";
  const withheld = floor != null && avg != null && avg < floor * PAY_RATIO_FLOOR ? COPY.pay.withheld : null;
  const world = worldPay();
  /* The sentence for a figure: its rank among every country holding that
     figure, or null when the pair is withheld (nothing is drawn) or the sweep
     holds no set for it. Computed here and not in the component, so the
     component draws what the builder decided and decides nothing. */
  const place = (value: number, set: number[]): string | null => (withheld ? null : placementOf(value, set, "countries"));
  const rows: PayRow[] = [];
  if (floor != null) rows.push({ key: "minimum", label: COPY.pay.minimum, value: floor, placement: place(floor, world.minimums) });
  if (avg != null) rows.push({ key: "average", label: COPY.pay.average, value: avg, placement: place(avg, world.averages) });
  return { rows, worldMax: world.max, withheld, confidence };
}
