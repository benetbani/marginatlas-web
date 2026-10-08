/**
 * src/lib/home/new_companies.ts
 *
 * WHERE NEW COMPANIES OPEN, LATIN AMERICA AND AFRICA (plan 2026-10-08, home sections, section 2; his ideas of 2026-10-08, "LATAM
 * Gems" and "Best of Africa (countries)", with "Rising stars countries" folded in as the audit found it). One measure (new limited
 * companies registered in a year per 1,000 people of working age), one year, countries ranked within their own region and never
 * across the two; each region's five highest drawn with flag and name (his /countries ruling: a country is its flag and its name),
 * the rest behind the founder's plus. A country shows only with a figure for the year and a labour force of a million or more (the
 * export's floor, which leaves a smaller labour force out of the lists). The card's one figure
 * is the UK's own on the same measure, for scale; it ranks nothing. Every number from data/home/new_companies.json, never typed.
 */
import ncJson from "../../../data/home/new_companies.json";
import { iso2ToName } from "@/lib/countries";
import { SURFACE_ANSWERS, type DoorKind } from "@/lib/spine/door_kinds";
import type { Provenance } from "@/lib/spine/provenance";
import { COPY } from "@/lib/spine/copy";

type Member = { iso2: string; value: number | null; shown: boolean };
type Export = { year: number; uk: { iso2: string; value: number }; regions: Array<{ key: string; members: Member[] }> };

/** Each region's rows drawn; the rest stand behind the plus. Under five shown and the region is not drawn, nor the section. */
export const NEW_COMPANIES_SHOWN = 5;
export const NEW_COMPANIES_REGIONS = ["latam", "africa"] as const;

export type NewCompaniesRow = { key: string; iso2: string; name: string; value: number; href: string; lands: DoorKind; prov: Provenance };
export type NewCompaniesGroup = { key: (typeof NEW_COMPANIES_REGIONS)[number]; name: string; rows: NewCompaniesRow[]; rest: Array<{ label: string; value: string; prov: Provenance }>; more: string };
export type NewCompanies = { year: number; uk: { value: number; prov: Provenance }; groups: NewCompaniesGroup[] };

/** One decimal, half up, as every rate on the site prints. */
const one = (v: number) => Math.round(v * 10) / 10;
/** A rate as the site prints it: one decimal, half up; under 0.1 two decimals, so a rate of 0.005 or more never prints as nought. */
export const rateDisplay = (v: number) => (v < 0.1 ? (Math.round(v * 100) / 100).toFixed(2) : one(v).toFixed(1));

export function buildNewCompanies(): NewCompanies | null {
  const d = ncJson as unknown as Export;
  if (!Number.isFinite(d.uk?.value)) return null;
  const C = COPY.home.newCompanies;
  const stamp = (iso2: string): Provenance => ({ src: `home/new_companies.json:${iso2}`, kind: "looked up" });
  const groups: NewCompaniesGroup[] = [];
  for (const key of NEW_COMPANIES_REGIONS) {
    const shown = (d.regions.find((r) => r.key === key)?.members ?? [])
      .filter((m): m is Member & { value: number } => m.shown && typeof m.value === "number" && Number.isFinite(m.value))
      .sort((a, b) => b.value - a.value || a.iso2.localeCompare(b.iso2));
    if (shown.length < NEW_COMPANIES_SHOWN) return null;
    const rows = shown.map((m) => ({ key: m.iso2.toLowerCase(), iso2: m.iso2, name: iso2ToName(m.iso2), value: one(m.value), href: `/${m.iso2.toLowerCase()}`, lands: SURFACE_ANSWERS.country, prov: stamp(m.iso2) }));
    const name = C.regions[key];
    groups.push({
      key,
      name,
      rows: rows.slice(0, NEW_COMPANIES_SHOWN),
      /* The rest print from the full figure through rateDisplay, never from the rounded rows. */
      rest: shown.slice(NEW_COMPANIES_SHOWN).map((m) => ({ label: iso2ToName(m.iso2), value: rateDisplay(m.value), prov: stamp(m.iso2) })),
      more: C.more.replace("{n}", String(rows.length - NEW_COMPANIES_SHOWN)).replace("{region}", name),
    });
  }
  return { year: d.year, uk: { value: one(d.uk.value), prov: stamp("GB") }, groups };
}
