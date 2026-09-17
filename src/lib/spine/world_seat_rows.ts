/**
 * src/lib/spine/world_seat_rows.ts
 *
 * AMONG THE COUNTRIES, the country page's `02 world-seat` (MODEL.md 8.2;
 * plan step 31, second dispatch, 2026-09-17). The composition's card is the
 * placed-figures form (candidate 1 in E:/atlas/rules/FORM-CATALOG.md's
 * CANDIDATES AWAITING HIS CLICK: a figure with a placement sentence under
 * it, "Higher than {n} countries in ten"), and a form not in the catalogue
 * is a candidate awaiting his click. So KvGrid holds the seat with the
 * figures alone, no placement sentence and nothing at 30, and the foot says
 * the placement is not shown yet. Pure over the files, synchronous.
 *
 * The cells, each with its file and field:
 *
 *  - SHOP RENT, MAJOR CITIES: `commercial_rent_t2_usd_per_sqm_year` in
 *    data/economic_indicators/country_profile_v2.json through
 *    getCountryProfile(), 195 of 195 (50 tier A, 145 interpolated). The
 *    composition's row says "shop rent in the major cities", which is the
 *    profile's second tier, the one the premises strip labels "Major cities"
 *    (COPY.premises.marks.t2); the first tier is the biggest cities' figure
 *    and "prime street" is the axis the file does not hold (run 13).
 *  - PAYROLL ON WAGES: `employer_social` in src/lib/tax/country_rates_2024.json
 *    through getCountryRates(), the SAME accessor and row the hero prints as
 *    its payroll cell, so the page carries one payroll rate. Held above zero
 *    for 130 of 195; the composition's own count. The profile's
 *    `employer_social_pct` (195 of 195) disagrees with the hero's source by
 *    more than half a point on 97 of the 130 and is not read. WITHHELD with
 *    a stated line on the 65.
 *  - BANK LENDING RATE: `bank_lending_rate_pct` in the profile, 195 of 195,
 *    WITHHELD on every country. DATA-REQUIREMENTS item 38, in its own words:
 *    "no comment in `types.ts`, no research card for any country"; the field
 *    has no published definition, so a figure under it would be a number
 *    with no stated meaning. The line says so. Returns the day item 38 lands.
 *
 * Rent and payroll are printed on the page elsewhere (the premises strip's
 * middle mark, the hero's payroll cell); the composition accepts that
 * because this card's job is to PLACE them against the world, which is the
 * half that waits on his click. Recorded in the dispatch report.
 */
import { getCountryProfile } from "@/lib/economic_profile";
import { getCountryRates } from "@/lib/tax/country_rates";
import { usd } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { KvCell } from "@/components/spine/archetypes/KvGrid";

const isPos = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0;
/** The hero's own percent grammar (hero_facts.ts), so 13.8% is spelled the same way one band down. */
const pct = (v: number) => `${Math.round(v * 1000) / 10}%`;

export type WorldSeatData = {
  iso2: string;
  cells: KvCell[];
  figures: { rent: number | null; payroll: number | null };
  /** The withheld sentences, one line: payroll where not held, the lending rate always. */
  withheld: string;
  basis: string;
  foot: string;
  confidence: "measured" | "modeled";
};

export function buildWorldSeat(iso2In: string): WorldSeatData | null {
  const iso2 = iso2In.toUpperCase();
  const profile = getCountryProfile(iso2);
  if (profile.iso2.toUpperCase() !== iso2) return null;
  const confidence: WorldSeatData["confidence"] = profile.tier === "A" ? "measured" : "modeled";

  const cells: KvCell[] = [];
  const withheld: string[] = [];

  const rent = isPos(profile.commercial_rent_t2_usd_per_sqm_year) ? Math.round(profile.commercial_rent_t2_usd_per_sqm_year) : null;
  if (rent != null) cells.push({ key: "rent", label: COPY.worldSeat.cells.rent, value: usd(rent), confidence });

  const rates = getCountryRates(iso2);
  const payroll = isPos(rates.employerSocial) ? rates.employerSocial : null;
  if (payroll != null) cells.push({ key: "payroll", label: COPY.cells.payroll.label, value: pct(payroll), confidence: "measured" });
  else withheld.push(COPY.worldSeat.withheld.payroll);

  /* The lending rate: held for every row, printed for none (item 38). */
  withheld.push(COPY.worldSeat.withheld.lending);

  if (cells.length === 0) return null;

  return {
    iso2,
    cells,
    figures: { rent, payroll },
    withheld: withheld.join(" "),
    basis: payroll != null ? COPY.worldSeat.basis : COPY.worldSeat.basisRentOnly,
    foot: cells.length > 1 ? COPY.worldSeat.foot : COPY.worldSeat.footOne,
    confidence,
  };
}
