/**
 * src/lib/spine/country_depth_rows.ts
 *
 * THE COUNTRY PAGE'S NEW SECTIONS (2026-09-25, his goal of that day: the
 * United Kingdom's page at the highest standard). Four he asked for by name on
 * 2026-09-20 and one his correction 6 of that day widened:
 *  - EMPLOYING PEOPLE: his correction 8 ("the title is wrong ... you are very
 *    correct about the unemployment rate, the days of paid leave, and the share
 *    of work that happens informally"), with the rules an employer meets.
 *  - INSURANCE: his correction 6 names insurance among the costs that are the
 *    same everywhere in a country.
 *  - BORROWING: "financing the business: the interest rates, the ease of taking
 *    a loan".
 *  - GETTING PAID: "banking procedures ... current accounts ... the ease of
 *    settling funds".
 *  - LEGAL AND ADMIN COSTS: "the cost to make an amendment to an LLC ... typical
 *    things, practical".
 * And London's own margins, trade by trade, for the margin card (his ruling 6
 * of 2026-09-04: "net profit margin in %").
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
import type { DonutPart } from "@/components/spine/archetypes/Donut";
import type { DetailRow } from "@/components/spine/archetypes/DetailPanel";
import type { BarRow } from "@/components/spine/archetypes/RankedBars";
import { LONDON_MARKET } from "@/lib/london/market";
import { SLUG_TO_INDUSTRY } from "@/lib/taxonomy";
import { tradeIconFor } from "@/lib/spine/trade_icon";

export type Focal = { figure: string; words: string };
export type DepthCard = { focal: Focal; cells: KvCell[] };

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const conf = (tag: string) => (tag === "held" ? ("measured" as const) : ("modeled" as const));
/* A share as it is stated: 3.75% stays 3.75% (the Bank Rate is set in quarter points), 4.9 stays 4.9, 63.5 stays 63.5. */
const trimPct = (v: number) => `${Math.round(v * 100) / 100}%`;
/** A yes-or-no the shard may hold as a boolean or as the words "True" and "False". */
const isYes = (v: unknown) => v === true || (typeof v === "string" && v.trim().toLowerCase() === "true");
const isYesNo = (v: unknown) => typeof v === "boolean" || (typeof v === "string" && /^(true|false)$/i.test(v.trim()));
/** The shard's one string for a metric, or null. */
function word(iso2: string, metric: string): { value: string; tag: string } | null {
  if (!loadCountryShard(iso2)) return null;
  const f = queryFacts({ entityId: countryEntityId(iso2), metrics: [metric], rowKey: "" })[0];
  return f && typeof f.value === "string" && f.value.trim() ? { value: f.value.trim(), tag: f.tag } : null;
}
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
  if (leaveDays == null && leave && leave.value > 0) cells.push({ key: "leave", label: E.cells.leave, value: `${Math.round(leave.value)} days`, note: E.notes.leave, confidence: conf(leave.tag) });
  if (leaveDays != null) cells.push({ key: "out", label: E.cells.out, value: trimPct(out.value), note: E.notes.out, confidence: conf(out.tag) });
  const week = countryFigure(iso2, "employment.max_week_hours");
  if (week && week.value > 0) cells.push({ key: "week", label: E.cells.week, value: `${Math.round(week.value)} hours`, note: E.notes.week, confidence: conf(week.tag) });
  const sick = countryFigure(iso2, "employment.sick_pay_usd_week");
  if (sick && sick.value > 0) cells.push({ key: "sick", label: E.cells.sick, value: usd(sick.value), note: E.notes.sick, confidence: conf(sick.tag) });
  const dismissal = countryFigure(iso2, "employment.dismissal_qualifying_years");
  if (dismissal && dismissal.value > 0) cells.push({ key: "dismissal", label: E.cells.dismissal, value: `${dismissal.value} ${dismissal.value === 1 ? "year" : "years"}`, note: E.notes.dismissal, confidence: conf(dismissal.tag) });
  /* The weeks of statutory maternity pay (2026-09-25): what the employer pays through payroll while a hire is away, the fourth
     rule of the card once the job market card carries the unemployment rate beside it. */
  const maternity = countryFigure(iso2, "employment.maternity_paid_weeks");
  if (maternity && maternity.value > 0) cells.push({ key: "maternity", label: E.cells.maternity, value: `${Math.round(maternity.value)} weeks`, note: E.notes.maternity, confidence: conf(maternity.tag) });
  /* The share of adults in work and the informal economy were cells here until the working year took the card's picture: two
     facts about the economy, not about employing anyone, and the card keeps to what the employer owes and who is looking. */
  if (cells.length < 2) return null;
  const focal = leaveDays != null ? { figure: `${leaveDays} days`, words: E.leaveWords } : { figure: trimPct(out.value), words: E.focalWords };
  return { focal, cells, leaveDays };
}

/** INSURANCE: the cover the law requires as the figure (its minimum), the typical yearly cost of each cover as the cells. */
export type InsuranceCard = { focal: Focal; cells: KvCell[] };
export function buildCountryInsurance(iso2: string): InsuranceCard | null {
  const I = COPY.insurance;
  const covers = listRows(iso2, "insurance.covers").filter((r) => typeof r.name === "string" && isNum(r.typical_usd) && (r.typical_usd as number) > 0);
  if (covers.length < 2) return null;
  const required = covers.find((r) => isYes(r.required)) ?? null;
  const minCover = countryFigure(iso2, "insurance.employers_liability_min_cover_usd");
  const cells: KvCell[] = covers.map((r) => ({
    key: String(r.name),
    label: String(r.name),
    value: usd(r.typical_usd as number),
    note: isYes(r.required) ? I.requiredNote : I.typicalNote,
    confidence: conf(r._tag),
  }));
  /* The figure is the law's own where the shard holds it (the minimum cover an employer must carry), else the required cover's cost. */
  const focal: Focal | null = minCover && minCover.value > 0 && required
    ? { figure: usd(minCover.value), words: I.minCoverWords.replace("{cover}", String(required.name).toLowerCase()) }
    : required
      ? { figure: usd(required.typical_usd as number), words: I.requiredWords.replace("{cover}", String(required.name).toLowerCase()) }
      : null;
  if (!focal) return null;
  return { focal, cells };
}

/** BORROWING: what a small business pays for a new loan as the figure; the rate lenders start from, the government's start-up loans and the innovation grants as the cells. */
export function buildCountryFinancing(iso2: string): DepthCard | null {
  const F = COPY.financing;
  const sme = countryFigure(iso2, "financing.sme_loan_rate_pct");
  if (!sme) return null;
  const cells: KvCell[] = [];
  const base = countryFigure(iso2, "financing.base_rate_pct");
  if (base) cells.push({ key: "base", label: F.cells.base, value: trimPct(base.value), note: F.notes.base, confidence: conf(base.tag) });
  const lo = countryFigure(iso2, "financing.startup_loan_min_usd");
  const hi = countryFigure(iso2, "financing.startup_loan_max_usd");
  const rate = countryFigure(iso2, "financing.startup_loan_rate_pct");
  if (lo && hi && hi.value > lo.value) cells.push({ key: "startup", label: F.cells.startup, value: `${usd(lo.value)} to ${usd(hi.value)}`, note: rate ? F.notes.startup.replace("{rate}", trimPct(rate.value)) : undefined, confidence: conf(lo.tag) });
  /* The shard's grants list: a grant with a money range prints (the innovation grants); a loan is the row above and a relief is not a sum a reader can bank. */
  for (const g of listRows(iso2, "grants.list")) {
    if (g.kind !== "Grant" || typeof g.value !== "string" || !/^\$[\d.]+[KM]? to \$[\d.]+[KM]?$/.test(g.value)) continue;
    cells.push({ key: `grant-${String(g.name)}`, label: String(g.name), value: g.value, note: typeof g.who === "string" ? `${F.notes.grantFor} ${g.who.toLowerCase()}` : undefined, confidence: conf(g._tag) });
  }
  if (cells.length < 2) return null;
  return { focal: { figure: trimPct(sme.value), words: F.focalWords }, cells };
}

/** GETTING PAID: how customers pay, drawn as a whole; what a card sale costs as the figure; how fast money lands and the account as the cells. */
export type BankingCard = { focal: Focal; parts: DonutPart[]; cells: KvCell[] };
export function buildCountryBanking(iso2: string): BankingCard | null {
  const B = COPY.banking;
  const parts: DonutPart[] = listRows(iso2, "payments.methods")
    .filter((r) => typeof r.name === "string" && isNum(r.pct) && (r.pct as number) > 0)
    .map((r) => ({ key: String(r.name).toLowerCase().replace(/\s+/g, "-"), name: String(r.name), share: r.pct as number }));
  const fee = countryFigure(iso2, "payments.card_fee_pct");
  if (parts.length < 2 || !fee) return null;
  const cells: KvCell[] = [];
  const lands = word(iso2, "payments.settlement_days");
  if (lands) cells.push({ key: "lands", label: B.cells.lands, value: lands.value.replace(/\s+days?$/i, " days"), note: B.notes.lands, confidence: conf(lands.tag) });
  const foreign = queryFacts({ entityId: countryEntityId(iso2), metrics: ["setup.banking.can_foreigner"], rowKey: "" })[0];
  if (foreign && isYesNo(foreign.value)) cells.push({ key: "foreign", label: B.cells.foreign, value: isYes(foreign.value) ? B.yes : B.no, note: B.notes.foreign, confidence: conf(foreign.tag) });
  const friction = word(iso2, "setup.banking.friction");
  if (friction) cells.push({ key: "friction", label: B.cells.friction, value: (B.friction as Record<string, string>)[friction.value.toLowerCase()] ?? friction.value, note: B.notes.friction, confidence: conf(friction.tag) });
  return { focal: { figure: trimPct(fee.value), words: B.focalWords }, parts, cells };
}

/** LEGAL AND ADMIN COSTS: the company's yearly filing fee as the figure; changing it, and the paperwork a year, as the cells. */
export function buildCountryPaperwork(iso2: string): DepthCard | null {
  const P = COPY.paperwork;
  const yearly = countryFigure(iso2, "admin.confirmation_statement_usd");
  if (!yearly) return null;
  const cells: KvCell[] = [];
  const rename = countryFigure(iso2, "admin.name_change_usd");
  if (rename) cells.push({ key: "rename", label: P.cells.rename, value: usd(rename.value), note: P.notes.rename, confidence: conf(rename.tag) });
  const filings = countryFigure(iso2, "admin_load.filings_per_year");
  if (filings && filings.value > 0) cells.push({ key: "filings", label: P.cells.filings, value: String(Math.round(filings.value)), note: P.notes.filings, confidence: conf(filings.tag) });
  const hours = countryFigure(iso2, "admin_load.hours_per_year");
  if (hours && hours.value > 0) cells.push({ key: "hours", label: P.cells.hours, value: `${Math.round(hours.value)} hours`, note: P.notes.hours, confidence: conf(hours.tag) });
  const online = countryFigure(iso2, "admin_load.online_pct");
  if (online && online.value > 0) cells.push({ key: "online", label: P.cells.online, value: trimPct(online.value), note: P.notes.online, confidence: conf(online.tag) });
  /* CLOSING THE COMPANY, the last of its legal costs (2026-09-25): striking off a debt-free company, and how long winding up with debts takes. */
  const strike = countryFigure(iso2, "closing.strike_off_usd");
  if (strike) cells.push({ key: "strike", label: COPY.closing.rows.strike, value: usd(strike.value), note: COPY.closing.notes.strike, confidence: conf(strike.tag) });
  const windUp = word(iso2, "closing.time_months");
  if (windUp) cells.push({ key: "wind-up", label: COPY.closing.rows.windUp, value: `${windUp.value} months`, note: COPY.closing.notes.windUp, confidence: conf(windUp.tag) });
  const liability = word(iso2, "closing.liability");
  if (liability && /^limited/i.test(liability.value)) cells.push({ key: "liability", label: COPY.closing.rows.liability, value: COPY.closing.limited, note: COPY.closing.notes.liability, confidence: conf(liability.tag) });
  if (cells.length < 2) return null;
  return { focal: { figure: usd(yearly.value), words: P.focalWords }, cells };
}

/** CLOSING A COMPANY, behind the exit card's plus: what striking off costs, how long winding up with debts takes, and what the owner answers for. */
export function buildCountryClosing(iso2: string): DetailRow[] | null {
  const C = COPY.closing;
  const rows: DetailRow[] = [];
  const strike = countryFigure(iso2, "closing.strike_off_usd");
  if (strike) rows.push({ label: C.rows.strike, value: usd(strike.value), note: C.notes.strike });
  const time = word(iso2, "closing.time_months");
  if (time) rows.push({ label: C.rows.windUp, value: `${time.value} months`, note: C.notes.windUp });
  const liability = word(iso2, "closing.liability");
  if (liability && /^limited/i.test(liability.value)) rows.push({ label: C.rows.liability, value: C.limited, note: C.notes.liability });
  return rows.length >= 2 ? rows : null;
}

/**
 * LONDON'S OWN MARGINS, TRADE BY TRADE, for the United Kingdom's margin card (2026-09-25). The curated London entries
 * (data/london/london_market_v1.json through src/lib/london/market.ts) are the only trade figures the atlas holds for the United
 * Kingdom as its own, and each London trade page prints the same net margin from the same entry, so the card and the page it opens
 * say one thing. Left out: a trade whose slug is not a live trade page (two entries, childcare and full-service salons, key a slug no
 * route serves), restaurants (its London address still serves the July page; QUEUE launch:exemplar-url-serves-the-july-page), and a
 * mixed bag no reader can picture ("Specialty trades (mixed)").
 */
const LONDON_LEFT_OUT = new Set(["restaurants"]);
export function buildLondonTradeMargins(): { rows: BarRow[]; worldMax: number } | null {
  const market = LONDON_MARKET as { city?: string; country_iso2?: string; activities: Record<string, { economics?: { net_margin_pct?: number } }> };
  const activities = market.activities;
  /* THE PLACE FROM THE DATUM (the chain's no-hardcoded-place, 2026-09-25): each row opens that trade's page in the file's own city
     and country, never a path typed with a city in it; a file that names no place draws no rows. */
  const iso = (market.country_iso2 ?? "").toLowerCase();
  const city = (market.city ?? "").toLowerCase().trim().replace(/\s+/g, "-");
  if (!/^[a-z]{2}$/.test(iso) || !city) return null;
  const rows: BarRow[] = [];
  for (const [slug, entry] of Object.entries(activities)) {
    const ind = (SLUG_TO_INDUSTRY as Record<string, { id: string; name: string } | undefined>)[slug];
    const pct = entry?.economics?.net_margin_pct;
    if (!ind || LONDON_LEFT_OUT.has(slug) || /\(mixed\)/i.test(ind.name) || !isNum(pct) || pct <= 0) continue;
    rows.push({ key: slug, name: COPY.londonMargins.short[slug] ?? ind.name, href: `/${iso}/${city}/${slug}`, lands: "owner-keeps", icon: tradeIconFor(ind.id), value: pct / 100 });
  }
  if (rows.length < 3) return null;
  rows.sort((a, b) => b.value - a.value);
  return { rows, worldMax: Math.max(...rows.map((r) => r.value)) };
}
