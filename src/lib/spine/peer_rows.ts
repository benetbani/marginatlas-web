/**
 * src/lib/spine/peer_rows.ts
 *
 * THE COMPARISON TABLE'S ROWS for a country: the home row and its ratified
 * peers (PEER_GROUPS, comparable market size, not bordering), four
 * like-for-like facts per country from the same modules the masthead reads,
 * so the home row and the masthead can never disagree. Local and
 * synchronous, so the archetype harness can build every country.
 *
 * THE FOUNDER'S RULINGS OF 2026-09-04 (3 and 4): the registration columns are
 * the LLC's. The file holds the government fee and the filing time; the
 * all-in cost to put an LLC in action and the time until the activity opens
 * are a defined data requirement (design/loop/architecture/research/
 * country-take-llc.md), so the column heads say what is measured until then.
 */
import { COUNTRIES } from "@/lib/taxonomy";
import { PEER_GROUPS } from "@/lib/countries/country_view";
import { getCountryRates, getFormationRowByTier } from "@/lib/tax/country_rates";
import { getSmbRegime } from "@/lib/tax/smb_effective_rates";
import { COPY } from "@/lib/spine/copy";

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export type PeerRow = { iso2: string; key?: string; name: string; home: boolean; values: Record<string, number | null> };
export type PeerColumn = { key: string; head: string; unit: "pct" | "usd" | "days" | "m"; best: "min" | "max" };

export const PEER_COLUMNS: PeerColumn[] = [
  { key: "effective_tax_pct", head: COPY.peers.cols.tax, unit: "pct", best: "min" },
  { key: "payroll_pct", head: COPY.peers.cols.payroll, unit: "pct", best: "min" },
  { key: "llc_cost_usd", head: COPY.peers.cols.llcCost, unit: "usd", best: "min" },
  { key: "llc_days", head: COPY.peers.cols.llcDays, unit: "days", best: "min" },
];

export type PeerTable = { rows: PeerRow[]; columns: PeerColumn[]; caveat: string };

function nameOf(iso2: string): string | null {
  const hit = (COUNTRIES as Array<{ code: string; name: string }>).find((c) => c.code === iso2);
  return hit ? hit.name : null;
}

/** Null when the country has no peer group or fewer than two rows resolve. */
export function buildPeerTable(iso2In: string): PeerTable | null {
  const code = iso2In.toUpperCase();
  const peerCodes = (PEER_GROUPS[code] ?? []).slice(0, 4);
  if (peerCodes.length === 0) return null;
  const rows: PeerRow[] = [];
  for (const pc of [code, ...peerCodes]) {
    const name = nameOf(pc);
    if (!name) continue;
    const regime = getSmbRegime(pc);
    const rates = getCountryRates(pc);
    const llc = getFormationRowByTier(pc, "LLC");
    rows.push({
      iso2: pc,
      name,
      home: pc === code,
      values: {
        effective_tax_pct: regime && isNum(regime.effective_rate) ? Math.round(regime.effective_rate * 1000) / 10 : null,
        payroll_pct: isNum(rates.employerSocial) && rates.employerSocial > 0 ? Math.round(rates.employerSocial * 1000) / 10 : null,
        llc_cost_usd: llc && isNum(llc.costUsd) ? Math.round(llc.costUsd) : null,
        llc_days: llc && isNum(llc.days) ? Math.round(llc.days) : null,
      },
    });
  }
  if (rows.length < 2) return null;
  return { rows, columns: PEER_COLUMNS, caveat: COPY.peers.caveat };
}

/** THE CITY'S PEERS TABLE (city:peers, the build loop's run 22, 2026-09-06;
 *  UNITS REWORKED task 9, 2026-09-08): the city and up to four peers as rows,
 *  the country's flag on each, three measures as columns, EVERY CELL THE
 *  ABSOLUTE FIGURE THAT ROW HOLDS, never a difference against the home row.
 *
 *  His words, 2026-09-07, are why the diff is gone: "for Los Angeles you say
 *  minus 14, for Paris you say plus 2, for customer income you say minus 10%,
 *  and for Los Angeles you say plus 3%. So you have made a mishmash of all of
 *  these things." A signed index-point diff in one column and a signed
 *  percent diff in another, both against a home row that itself printed a
 *  bare zero, was the mishmash; a peer tied to the home row exactly used to
 *  print the word "same" (his other complaint, the same run), which a column
 *  of figures cannot hold either.
 *
 *  THE ABSOLUTE EXISTS FOR ALL THREE, checked against adapt_city.ts before
 *  this rewrite (its own comment: "Each peer's rent_index <- cost_of_living_
 *  index (real, London = 75, NOT indexed to 100), median_income_usd <- avg_
 *  gross_salary_usd_year (real), visitors_m <- tourist_arrivals_m (real)"):
 *   - cheaper: `rent_index` is the source cost-of-living index itself, "a
 *     leading metro = 100" (cities/[slug]/page.tsx's own field comment), so a
 *     value IS honestly a percent of that leading metro; LOWER reads cheaper,
 *     so `best` is "min" here, unlike the other two.
 *   - income: `median_income_usd` is already a dollar figure (a mean, not
 *     really a median; see adapt_city.ts's own warning on the field name),
 *     printed through the unit the country table already uses for money.
 *   - visitors: `visitors_m` is millions of arrivals a year, an absolute no
 *     existing unit could honestly carry (not a currency, a percentage or a
 *     day count), hence CompareColumn's new "m" unit.
 *  No fallback branch was needed: this is not a data requirement, every peer
 *  row already carries all three absolutes, home row included.
 *
 *  A column with fewer than two held figures is dropped; a table with fewer
 *  than two rows or no column is not drawn. */
export type CityPeerTable = PeerTable & { entityHead: string };
const fillWords = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");
export function buildCityPeerTable(seed: any): CityPeerTable | null {
  const list: any[] = Array.isArray(seed?.peers?.list) ? seed.peers.list.filter((r: any) => r && r.name) : [];
  const home = list.find((r) => r.home) ?? list[0];
  if (!home || list.length < 2) return null;
  const fallbackIso2 = String(seed?.meta?.iso2 ?? "").toUpperCase();
  const rows: PeerRow[] = list.map((r) => ({
    iso2: String(r.iso2 ?? (r.home ? fallbackIso2 : "")).toUpperCase(),
    key: String(r.slug ?? r.name).toLowerCase(),
    name: String(r.name),
    home: !!r.home,
    values: {
      cheaper: isNum(r.rent_index) ? Math.round(r.rent_index) : null,
      income: isNum(r.median_income_usd) && r.median_income_usd > 0 ? Math.round(r.median_income_usd) : null,
      visitors: isNum(r.visitors_m) && r.visitors_m > 0 ? Math.round(r.visitors_m * 10) / 10 : null,
    },
  }));
  const all: PeerColumn[] = [
    { key: "cheaper", head: COPY.cityPeers.cols.cheaper, unit: "pct", best: "min" },
    { key: "income", head: COPY.cityPeers.cols.income, unit: "usd", best: "max" },
    { key: "visitors", head: COPY.cityPeers.cols.visitors, unit: "m", best: "max" },
  ];
  const columns = all.filter((c) => rows.filter((r) => isNum(r.values[c.key])).length >= 2);
  if (columns.length === 0) return null;
  return { rows, columns, caveat: fillWords(COPY.cityPeers.caveat, { city: String(home.name) }), entityHead: COPY.cityPeers.cols.city };
}
