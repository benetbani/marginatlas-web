/**
 * src/lib/spine/country_depth_rows.ts
 *
 * THE COUNTRY PAGE'S DEPTH (2026-09-25, his goal of that day: the United
 * Kingdom's page at the highest standard), what the slots read of it since plan
 * 2026-10-13 country-page-journey:
 *  - EMPLOYING PEOPLE: his correction 8 ("the title is wrong ... you are very
 *    correct about the unemployment rate, the days of paid leave, and the share
 *    of work that happens informally"), with the rules an employer meets (slot 7).
 *  - BORROWING: "financing the business: the interest rates, the ease of taking
 *    a loan" (slot 9).
 *  - What London's trades take, trade by trade (slot 5).
 * The insurance, getting-paid and legal-costs cards left with the page's old
 * sections (that plan's Task 6): the slots read the law's own rows instead.
 *
 * THE LAW OF EVERY SECTION (his, 2026-09-20): labels and categories defined
 * once here and filled per country, never a sentence written for one country.
 * Every label below is the same on every country that holds the figure; a
 * country that holds none of a card's figures gets no card, and the view seats
 * the page the way it did before (the United Kingdom holds them all today).
 *
 * THE FIGURES: the country shard (`data/facts/country/<ISO2>.json`); the
 * United Kingdom's official ones were written on 2026-09-25 from the sources in
 * design/loop/build/research/2026-09-25-uk-official-figures.md (tag held), the
 * rest are the shard's researched estimates (tag modelled). A placeholder never
 * prints (the store drops it). Money at the one rate that file states.
 */
import { queryFacts } from "@/lib/facts/store";
import { countryFigure, loadCountryShard, countryEntityId } from "@/lib/facts/country_shard";
import { getCountryProfile } from "@/lib/economic_profile";
import { usd } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { KvCell } from "@/components/spine/archetypes/KvGrid";
import type { BarRow } from "@/components/spine/archetypes/RankedBars";
import { LONDON_MARKET } from "@/lib/london/market";
import { SLUG_TO_INDUSTRY } from "@/lib/taxonomy";
import { own } from "@/lib/own";
import { tradeIconFor } from "@/lib/spine/trade_icon";
import { LONDON_GEOGRAPHY, londonTradeRegister, londonTradeSales } from "@/lib/uk/registers/london_trade";
import { registerSrc } from "@/lib/spine/provenance";
import { honestRound } from "@/lib/uk/present/precision";
import { convertToUsd } from "@/lib/finance/fx";

/** Pounds to dollars at the site's one rate (london_trade_hero.ts does the same before rounding once). */
const usdOf = (gbp: number): number => convertToUsd("GBP", gbp) ?? Number.NaN;

export type Focal = { figure: string; words: string };
export type DepthCard = { focal: Focal; cells: KvCell[] ; /** The government's start-up loan as numbers, for the loan lever (2026-09-26). */ loan?: { min: number; max: number; rate: number }; /** The central bank's rate as a number, for the reference mark on the lending track (2026-10-04). */ baseRate?: number | null };

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const conf = (tag: string) => (tag === "held" ? ("measured" as const) : ("modeled" as const));
/* A share as it is stated: 3.75% stays 3.75% (the Bank Rate is set in quarter points), 4.9 stays 4.9, 63.5 stays 63.5. */
const trimPct = (v: number) => `${Math.round(v * 100) / 100}%`;
/** The rows of one list the shard holds (`<prefix>.*.<field>`), in file order, keyed by the row. */
function listRows(iso2: string, prefix: string): Array<Record<string, string | number | boolean> & { _tag: string }> {
  if (!loadCountryShard(iso2)) return [];
  const order: string[] = [];
  const byKey = new Map<string, Record<string, string | number | boolean> & { _tag: string }>();
  for (const f of queryFacts({ entityId: countryEntityId(iso2) })) {
    if (!f.metric.startsWith(`${prefix}.*.`)) continue;
    const key = String(f.rowKey ?? "");
    if (!byKey.has(key)) {
      byKey.set(key, { _tag: f.tag });
      order.push(key);
    }
    const row = byKey.get(key)!;
    row[f.metric.slice(prefix.length + 3)] = f.value as string | number | boolean;
    if (f.tag !== "held") row._tag = f.tag;
  }
  return order.map((k) => byKey.get(k)!);
}

/** EMPLOYING PEOPLE (2026-09-25): the paid holiday a full-time hire takes is the card's figure, since it is what the employer
 *  pays for and does not get worked; the rules and who is looking for work are its cells. Where no holiday figure is held the
 *  unemployment rate stands as the figure, as it did. */
export type EmploymentCard = DepthCard & { leaveDays: number | null };
export function buildCountryEmployment(iso2: string): EmploymentCard | null {
  const E = COPY.employment;
  const out = countryFigure(iso2, "employment.unemployment_pct");
  if (!out) return null;
  const cells: KvCell[] = [];
  const leave = countryFigure(iso2, "employment.holiday_days");
  const leaveDays = leave && leave.value > 0 && leave.value < 260 ? Math.round(leave.value) : null;
  if (leaveDays == null && leave && leave.value > 0) cells.push({ key: "leave", icon: "first-year", label: E.cells.leave, value: `${Math.round(leave.value)} days`, note: E.notes.leave, confidence: conf(leave.tag) });
  if (leaveDays != null) cells.push({ key: "out", icon: "hiring", label: E.cells.out, value: trimPct(out.value), note: E.notes.out, confidence: conf(out.tag) });
  const week = countryFigure(iso2, "employment.max_week_hours");
  if (week && week.value > 0) cells.push({ key: "week", icon: "freshness", label: E.cells.week, value: `${Math.round(week.value)} hours`, note: E.notes.week, confidence: conf(week.tag) });
  const sick = countryFigure(iso2, "employment.sick_pay_usd_week");
  if (sick && sick.value > 0) cells.push({ key: "sick", icon: "sick-pay", label: E.cells.sick, value: usd(sick.value), note: E.notes.sick, confidence: conf(sick.tag) });
  const dismissal = countryFigure(iso2, "employment.dismissal_qualifying_years");
  if (dismissal && dismissal.value > 0) cells.push({ key: "dismissal", icon: "leaving", label: E.cells.dismissal, value: `${dismissal.value} ${dismissal.value === 1 ? "year" : "years"}`, note: E.notes.dismissal, confidence: conf(dismissal.tag) });
  /* The weeks of statutory maternity pay (2026-09-25): what the employer pays through payroll while a hire is away, the fourth
     rule of the card once the job market card carries the unemployment rate beside it. */
  const maternity = countryFigure(iso2, "employment.maternity_paid_weeks");
  if (maternity && maternity.value > 0) cells.push({ key: "maternity", icon: "parental-leave", label: E.cells.maternity, value: `${Math.round(maternity.value)} weeks`, note: E.notes.maternity, confidence: conf(maternity.tag) });
  /* The share of adults in work and the informal economy were cells here until the working year took the card's picture: two
     facts about the economy, not about employing anyone, and the card keeps to what the employer owes and who is looking. */
  if (cells.length < 2) return null;
  const focal = leaveDays != null ? { figure: `${leaveDays} days`, words: E.leaveWords } : { figure: trimPct(out.value), words: E.focalWords };
  return { focal, cells, leaveDays };
}

/** BORROWING: what a small business pays for a new loan as the figure; the rate lenders start from, the government's start-up loans and the innovation grants as the cells. */
export function buildCountryFinancing(iso2: string): DepthCard | null {
  const F = COPY.financing;
  const sme = countryFigure(iso2, "financing.sme_loan_rate_pct");
  if (!sme) return null;
  const cells: KvCell[] = [];
  const base = countryFigure(iso2, "financing.base_rate_pct");
  if (base) cells.push({ key: "base", icon: "bank", label: F.cells.base, value: trimPct(base.value), note: F.notes.base, confidence: conf(base.tag) });
  const lo = countryFigure(iso2, "financing.startup_loan_min_usd");
  const hi = countryFigure(iso2, "financing.startup_loan_max_usd");
  const rate = countryFigure(iso2, "financing.startup_loan_rate_pct");
  if (lo && hi && hi.value > lo.value) cells.push({ key: "startup", icon: "currency-stability", label: F.cells.startup, value: `${usd(lo.value)} to ${usd(hi.value)}`, note: rate ? F.notes.startup.replace("{rate}", trimPct(rate.value)).replace("{min}", String(F.startupTerm.min)).replace("{max}", String(F.startupTerm.max)) : undefined, confidence: conf(lo.tag) });
  const loan = lo && hi && rate && hi.value > lo.value && rate.value > 0 ? { min: lo.value, max: hi.value, rate: rate.value } : undefined;
  /* The shard's grants list: a grant with a money range prints (the innovation grants); a loan is the row above and a relief is not a sum a reader can bank. */
  for (const g of listRows(iso2, "grants.list")) {
    if (g.kind !== "Grant" || typeof g.value !== "string" || !/^\$[\d.]+[KM]? to \$[\d.]+[KM]?$/.test(g.value)) continue;
    cells.push({ key: `grant-${String(g.name)}`, icon: "grant", label: String(g.name), value: g.value, note: typeof g.who === "string" ? `${F.notes.grantFor} ${g.who.toLowerCase()}` : undefined, confidence: conf(g._tag) });
  }
  if (cells.length < 2) return null;
  return { focal: { figure: trimPct(sme.value), words: F.focalWords }, cells, loan, baseRate: base && base.value > 0 ? base.value : null };
}

/**
 * WHAT LONDON'S TRADES TAKE, TRADE BY TRADE, for the United Kingdom's card in `03` (plan 06, task B3b, 2026-10-04).
 *
 * UNTIL THAT DAY this card printed each trade's net margin off the curated London file (data/london/london_market_v1.json, its own
 * words "directional ranges, not exact measurements": barbershops and accountants 22%, dental practices 18%), and said the trade
 * page it opens printed the same. The truth pass took that money off the trade pages (task A5: they lead with the register), so the
 * card printed a figure its own doors no longer showed, from a file no reader could check.
 *
 * NOW each row is the register's typical (median) yearly sales of the trade's registered businesses in Greater London (his ruling
 * of 2026-10-04), the figure the trade page's head prints, read once from the band counts and rounded once in dollars
 * (london_trade.ts, honestRound with the median's own range). The set is the curated file's list of London trades (its place makes
 * the links; its figures are not read): a trade whose code is approximate or none prints nothing, a shared code prints once, named
 * as its group (COPY.londonSales.groups, the code's own name in plain words: barbershops and nail salons are one row, "Hair and
 * beauty"), and a median in an open band (under 50,000 or over 50,000,000 pounds) is no bar. The left-out list went with it:
 * restaurants serves the rebuilt page since the exemplar branch was retired (QUEUE launch:exemplar-url-serves-the-july-page).
 */
/** THE MIDDLE TRADE (2026-09-25, the model laws' FOCAL on the UK page): the median of every London trade the list holds; with an
 *  even count the midpoint of the two middle trades. One function, so /gb's card and the home page's answer (masterplan step 34)
 *  print one number for one thing. */
export function londonMiddleSales(sales: { rows: BarRow[] }): number {
  const sorted = sales.rows.map((r) => r.value).sort((a, b) => a - b);
  return sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
}

export function buildLondonTradeSales(): { rows: BarRow[]; worldMax: number } | null {
  const market = LONDON_MARKET as { city?: string; country_iso2?: string; activities: Record<string, unknown> };
  /* THE PLACE FROM THE DATUM (the chain's no-hardcoded-place, 2026-09-25): each row opens that trade's page in the file's own city
     and country, never a path typed with a city in it; a file that names no place draws no rows. */
  const iso = (market.country_iso2 ?? "").toLowerCase();
  const city = (market.city ?? "").toLowerCase().trim().replace(/\s+/g, "-");
  if (!/^[a-z]{2}$/.test(iso) || !city) return null;
  const rows: BarRow[] = [];
  const seen = new Set<string>();
  for (const slug of Object.keys(market.activities)) {
    const ind = own(SLUG_TO_INDUSTRY, slug);
    const reg = londonTradeRegister(slug);
    const sales = londonTradeSales(slug);
    if (!ind || !reg || !sales || sales.q50.open !== false) continue;
    const code = reg.sic.join("+");
    const name = reg.group ? COPY.londonSales.groups[code] : COPY.londonSales.short[slug] ?? ind.name;
    if (!name || seen.has(code)) continue;
    seen.add(code);
    const r = sales.medianRangeGbp;
    const value = r ? honestRound(usdOf(sales.q50.gbp), usdOf(r[0]), usdOf(r[1])) : honestRound(usdOf(sales.q50.gbp));
    if (!isNum(value) || value <= 0) continue;
    rows.push({ key: slug, name, href: `/${iso}/${city}/${slug}`, lands: "owner-keeps", icon: tradeIconFor(ind.id), value, prov: { src: registerSrc("turnover.json", slug, LONDON_GEOGRAPHY), kind: "worked out" } });
  }
  if (rows.length < 3) return null;
  rows.sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
  return { rows, worldMax: Math.max(...rows.map((r) => r.value)) };
}
