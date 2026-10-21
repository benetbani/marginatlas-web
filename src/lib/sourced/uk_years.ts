/**
 * THE YEARS BEHIND THE UK FIGURES (the UK round, 2026-10-20, spec 1.2: "The source's own year stays in the data rows and on the
 * methodology page; it never prints on a page"). The methodology page lists what each kind of figure is read from, in plain words, and
 * the years its source covers for the United Kingdom, computed here from the sourced files' UK rows (never typed). No publisher is
 * named: the Sources page names them (R-002, one sources page).
 */
import { SOURCED_FILES } from "./files";
import { yearsHeld } from "./sources_page";
import type { SourcedFile, SourcedRow } from "./schema";

/** A UK row: the United Kingdom or Great Britain, or one of its statistical areas (a nine-character code, E12000007 and the like). */
const isUkRow = (r: SourcedRow) => /^(GB|UK)(\b|-|$)/.test(r.geo.code) || /^[EKSWN]\d{8}$/.test(r.geo.code);

/** What the pages print from each file, in plain words, in the order the methodology page lists them. Files sharing words join. */
const WHAT: ReadonlyArray<readonly [string, readonly string[]]> = [
  ["A trade's sales, buying and running costs", ["ons-abs-2024"]],
  ["How sales split by the size of a business", ["ons-abs-size-2024", "size-bands-gb-us"]],
  ["Sales month by month", ["ons-mbs-turnover-month"]],
  ["New businesses, and how long they last", ["ons-business-demography-2024", "ons-bd-rates-2024"]],
  ["How many businesses a place holds, for every 10,000 people", ["ons-business-counts-2026", "ons-business-counts-sectors-2026", "populations"]],
  ["Pay", ["ons-ashe-annual-2025", "ons-ashe-residence-2025", "place-incomes"]],
  ["The minimum wage", ["minimum-wages-2026"]],
  ["What households spend on eating out", ["ons-family-spending-eating-out-2025"]],
  ["Shop rents", ["place-voa-retail-rents-2025"]],
  ["Flat rents and transport passes", ["place-flat-rents", "place-transport-passes"]],
  ["Visitors", ["place-visitors", "place-visitors-monthly"]],
  ["Energy and fuel prices", ["desnz-nondomestic-energy-prices", "desnz-road-fuel-diesel"]],
  ["Taxes, rules and lending rates", ["profit-taxes", "vat-sales-tax", "employer-charges", "registration", "rates-and-loans", "local-business-taxes"]],
];

export type UkYears = { what: string; years: string; files: string[] };

/** Each kind of figure with the years its UK rows cover; a kind whose files hold no UK row is left out. */
export function ukSourceYears(files: readonly SourcedFile[] = SOURCED_FILES): UkYears[] {
  const byId = new Map(files.map((f) => [f.id, f] as const));
  const out: UkYears[] = [];
  for (const [what, ids] of WHAT) {
    const held = ids.map((id) => byId.get(id)).filter((f): f is SourcedFile => !!f);
    const years = held.flatMap((f) => f.rows.filter((r) => isUkRow(r) && !r.unconfirmed).map((r) => r.year));
    if (years.length) out.push({ what, years: yearsHeld(years), files: held.map((f) => f.id) });
  }
  return out;
}
