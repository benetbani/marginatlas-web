/**
 * src/lib/spine/country_spend_rows.ts
 *
 * WHAT HOUSEHOLDS SPEND ON, the country page's `18 spend` (2026-09-23, brief
 * NEW-SECTIONS-2026-09-23.md row C5).
 *
 * THE PAIN. Whoever opens a shop is competing for one slice of a household's
 * money, and the slices are not the same size in two countries. Food and drink
 * bought for the house is 11 of every 100 a British household spends and 62 in
 * Afghanistan; eating out is 7 in the United Kingdom and 1.5 in Afghanistan.
 * Nobody publishes the two beside each other for free, and a person deciding
 * which country to open a cafe in is deciding exactly that.
 *
 * WHERE THE FIGURES COME FROM, with their coverage, measured 2026-09-23 by
 * `scripts/audit/unused_fields.mjs` and read by nothing under `src/` until this
 * builder: `income.household_spend.*.category` and `.pct` on the country shard
 * (`data/facts/country/<ISO2>.json`). All 198 shards hold all seven categories,
 * one set of names across the whole bank (housing_utilities, transport,
 * food_drink, recreation, dining_out, household_goods, other), and their
 * percentages sum to 99.9, 100 or 100.2 depending on the shard. The tags,
 * counted 2026-09-23 night: `modeled` on 194, `held` on 3 (Albania, Bulgaria,
 * Lithuania), `placeholder` on 1 (North Korea, withheld below; the header's
 * first count of "modeled on 195" folded it in). So the card wears the sample
 * mark and its basis line says modelled in its first word (the mark itself is
 * behind his switch and prints nothing in production, so the word carries it).
 *
 * THE FORM IS RANKED BARS AND NOT A DONUT, by briefs/VISUAL-CHOICE.md section
 * 2: past five parts the eye cannot order wedges, and these are seven. The
 * residual, "everything else", is pinned last by RankedBars' `residualKey`
 * however big it is (32 of every 100 in the United Kingdom, the largest number
 * on the card), because a ranking led by the part nobody can name is not a
 * finding. The track's far end is the WHOLE, a hundred, so every bar is read
 * against the budget it comes out of rather than against its neighbours.
 *
 * THE CARD'S FOCAL IS NOT ONE OF THE BARS, by RankedBars' own law (a figure
 * the rows do not print, never a sum the bars are read to make). It is the
 * share of all the money that goes on food which is spent OUT of the house:
 * `dining_out / (food_drink + dining_out)`, named in the basis line in those
 * words. It cannot be read off the drawing (no addition of bars produces it),
 * it is the reading this page's audience actually wants, and it separates
 * countries harder than anything else on the card: 68 in Singapore, 65 in
 * Ireland, 39 in the United Kingdom, 2 in Afghanistan.
 *
 * WITHHOLDING, and two countries fall to it: all seven categories, every one of
 * them named in the copy, a sum within a point of a hundred, and a figure above
 * zero for both halves of the food question. Sri Lanka's shard holds 0 for
 * eating out, which is a gap wearing a number rather than a country where
 * nobody eats out, so it draws no card at all. AND A PLACEHOLDER IS NOT A
 * FIGURE (the bank's word for a slot waiting on research; the city crew
 * builder's rule): North Korea's seven are tagged placeholder, and until
 * 2026-09-23 night this builder read them as modelled and built the card. No
 * page printed it only because /kp is a 404 (North Korea is not in the site's
 * country list), which was luck; the store has refused a placeholder unasked
 * since the same night. 196 of 198 build; where the card is withheld the exit
 * card beside it stands at the survivor's two thirds, the country page's own
 * idiom.
 *
 * THE DISPLAYED SHARES ARE RECONCILED TO SUM TO EXACTLY 100, by the same
 * largest-remainder rounding IncomeBreakdown uses and for the same reason:
 * independently rounded shares almost never add up, and a budget a reader has
 * to check is the opposite of the job. The reconciled integer is what the bar
 * draws and what the row prints, so the drawing and the figure cannot drift
 * apart. The focal is worked from the RAW figures, before rounding, because it
 * is a ratio and rounding its two inputs first would move it.
 */
import { loadCountryShard, countryEntityId } from "@/lib/facts/country_shard";
import { queryFacts } from "@/lib/facts/store";
import type { FactTag } from "@/lib/facts/types";
import { COPY } from "@/lib/spine/copy";

export const COUNTRY_SPEND_PREFIX = "income.household_spend.*.";
/** The row pinned last whatever its size; the file's own key for the leftover. */
export const SPEND_RESIDUAL = "other";
/** The two halves of the food question the focal divides. */
export const SPEND_FOOD_IN = "food_drink";
export const SPEND_FOOD_OUT = "dining_out";
/** The track's far end: the whole budget the parts divide. */
export const SPEND_WHOLE = 100;

export type CountrySpendRow = { key: string; name: string; value: number };

export type CountrySpendData = {
  iso2: string;
  /** Seven parts of a hundred, biggest first, the residual last. */
  rows: CountrySpendRow[];
  /** The card's focal: how much of the food money is spent out of the house. */
  out: { figure: string; value: number };
  basis: string;
  tag: FactTag;
};

/** Largest remainder: the integers sum to exactly `whole`, and the biggest fractions round up. */
function reconcile(values: number[], whole: number): number[] {
  const floors = values.map((v) => Math.floor(v));
  let left = whole - floors.reduce((n, v) => n + v, 0);
  const order = values
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i);
  const out = [...floors];
  for (const { i } of order) {
    if (left <= 0) break;
    out[i] += 1;
    left -= 1;
  }
  return out;
}

export function buildCountrySpend(iso2: string): CountrySpendData | null {
  const code = countryEntityId(iso2);
  if (!code || !loadCountryShard(code)) return null;
  const C = COPY.countrySpend;
  const byKey = new Map<string, { key: string; category?: string; pct?: number; tag?: FactTag }>();
  for (const f of queryFacts({ entityId: code })) {
    if (!f.metric.startsWith(COUNTRY_SPEND_PREFIX)) continue;
    const field = f.metric.slice(COUNTRY_SPEND_PREFIX.length);
    const key = String(f.rowKey ?? "");
    const row = byKey.get(key) ?? { key };
    if (field === "category" && typeof f.value === "string") row.category = f.value.trim();
    if (field === "pct" && typeof f.value === "number" && Number.isFinite(f.value) && f.value >= 0) row.pct = f.value;
    if (f.tag === "placeholder") return null;
    if (f.tag && f.tag !== "held") row.tag = "modeled";
    byKey.set(key, row);
  }
  const live = [...byKey.values()].filter((r) => r.category && typeof r.pct === "number");
  if (live.length < 5) return null;
  const sum = live.reduce((n, r) => n + (r.pct as number), 0);
  if (Math.abs(sum - SPEND_WHOLE) > 1) return null;
  const named = (key: string) => (C.categories as Record<string, string>)[key] ?? null;
  /* A CATEGORY THE COPY DOES NOT NAME IS A CATEGORY THIS SITE CANNOT PRINT:
     the file's key is a machine word and a reader never sees one. All 198
     shards hold the same seven today, so this guard is for the shard that
     gains an eighth, which would otherwise print "household_goods". */
  if (live.some((r) => !named(r.category as string))) return null;
  /* THE FOOD QUESTION, on the raw figures: both halves above zero or no card.
     A zero here is a gap wearing a number, and the focal would print 0. */
  const inHouse = live.find((r) => r.category === SPEND_FOOD_IN)?.pct ?? 0;
  const outHouse = live.find((r) => r.category === SPEND_FOOD_OUT)?.pct ?? 0;
  if (!(inHouse > 0) || !(outHouse > 0)) return null;
  const outShare = Math.round((outHouse / (inHouse + outHouse)) * 100);

  const ordered = [...live].sort((a, b) =>
    a.category === SPEND_RESIDUAL ? 1 : b.category === SPEND_RESIDUAL ? -1 : (b.pct as number) - (a.pct as number),
  );
  const shown = reconcile(ordered.map((r) => r.pct as number), SPEND_WHOLE);
  const rows: CountrySpendRow[] = ordered.map((r, i) => ({
    key: r.category as string,
    name: named(r.category as string) as string,
    value: shown[i],
  }));
  return {
    iso2: code,
    rows,
    out: { figure: `${outShare}%`, value: outShare },
    basis: C.basis,
    tag: live.some((r) => r.tag === "modeled") ? "modeled" : "held",
  };
}
