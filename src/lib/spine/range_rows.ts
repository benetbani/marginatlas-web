/**
 * src/lib/spine/range_rows.ts
 *
 * THE RANGE STRIPS' MARKS for a country: premises (rent a square metre a year
 * by address, the profile's three national tiers today; the founder's five
 * metrics, prime and secondary street in the metropolis and in a city plus a
 * fifth, are a data requirement the strip is built to hold) and customers
 * (typical full-time pay with the bottom and top tenth where the deciles are
 * researched). Local and synchronous, the adapter's own rules and tiering.
 */
import { getCountryProfile } from "@/lib/economic_profile";
import { COPY } from "@/lib/spine/copy";
import { inSentence } from "@/lib/spine/place_names";

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
type Conf = "measured" | "modeled";

export type StripData = {
  marks: Array<{ key: string; label: string; value: number; accent?: boolean }>;
  confidence: Conf;
  note: string | null;
  extra: { value: string; label: string } | null;
};

function profileOf(iso2: string) {
  const code = iso2.toUpperCase();
  const p = getCountryProfile(code);
  const held = p.iso2.toUpperCase() === code;
  const conf: Conf = held && p.tier === "A" ? "measured" : "modeled";
  return { p, held, conf };
}

/** Null when no rent tier and no electricity rate is held. */
export function buildPremisesStrip(iso2: string): StripData | null {
  const { p, held, conf } = profileOf(iso2);
  if (!held) return null;
  const marks: StripData["marks"] = [];
  if (isNum(p.commercial_rent_t3_usd_per_sqm_year) && p.commercial_rent_t3_usd_per_sqm_year > 0) marks.push({ key: "edge", label: COPY.premises.marks.edge, value: Math.round(p.commercial_rent_t3_usd_per_sqm_year) });
  if (isNum(p.commercial_rent_t2_usd_per_sqm_year) && p.commercial_rent_t2_usd_per_sqm_year > 0) marks.push({ key: "ordinary", label: COPY.premises.marks.ordinary, value: Math.round(p.commercial_rent_t2_usd_per_sqm_year) });
  if (isNum(p.commercial_rent_t1_usd_per_sqm_year) && p.commercial_rent_t1_usd_per_sqm_year > 0) marks.push({ key: "prime", label: COPY.premises.marks.prime, value: Math.round(p.commercial_rent_t1_usd_per_sqm_year) });
  const kwh = isNum(p.electricity_usd_per_kwh_commercial) && p.electricity_usd_per_kwh_commercial > 0 ? p.electricity_usd_per_kwh_commercial : null;
  if (marks.length === 0 && kwh == null) return null;
  return { marks, confidence: conf, note: null, extra: kwh != null ? { value: `$${kwh}`, label: COPY.premises.electricity } : null };
}

/** Null when no typical pay is held. */
export function buildCustomersStrip(iso2: string): StripData | null {
  const { p, held, conf } = profileOf(iso2);
  if (!held || !isNum(p.median_wage_full_time_usd) || p.median_wage_full_time_usd <= 0) return null;
  const med = Math.round(p.median_wage_full_time_usd);
  const p10 = isNum(p.wage_p10_usd) && p.wage_p10_usd > 0 ? Math.round(p.wage_p10_usd) : null;
  const p90 = isNum(p.wage_p90_usd) && p.wage_p90_usd > 0 ? Math.round(p.wage_p90_usd) : null;
  const spread = p10 != null && p90 != null && p10 < med && med < p90;
  const marks: StripData["marks"] = spread
    ? [{ key: "p10", label: COPY.customers.marks.bottom, value: p10 as number }, { key: "typical", label: COPY.customers.marks.typical, value: med, accent: true }, { key: "p90", label: COPY.customers.marks.top, value: p90 as number }]
    : [{ key: "typical", label: COPY.customers.marks.typical, value: med, accent: true }];
  return { marks, confidence: conf, note: spread ? null : COPY.customers.noSpread, extra: null };
}

/** THE CITY'S CUSTOMERS STRIP (city:earnings, the build loop's run 11, 2026-09-06).
 *  The city's own bottom tenth, typical and top tenth where the seed holds them
 *  (London: a spread modelled on the city's average pay, so the note says
 *  modelled and the head wears the sample mark); else the country's typical pay
 *  through buildCustomersStrip, the basis line naming the country and saying the
 *  city is not researched on its own yet. Null when neither is held. The spread
 *  word (the city's place among cities by how unevenly income is spread) rides
 *  the extra slot. */
export type CityStripData = StripData & { basis: string; sample: boolean; from: "city" | "country" };
export function buildCityCustomersStrip(seed: any): CityStripData | null {
  const o = seed?.income ?? null;
  const city = String(seed?.meta?.city ?? "").trim();
  const med = o && isNum(o.median_income_usd) && o.median_income_usd > 0 ? Math.round(o.median_income_usd) : null;
  if (med != null) {
    const p10 = isNum(o.bottom10_income_usd) && o.bottom10_income_usd > 0 ? Math.round(o.bottom10_income_usd) : null;
    const p90 = isNum(o.top10_income_usd) && o.top10_income_usd > 0 ? Math.round(o.top10_income_usd) : null;
    const spread = p10 != null && p90 != null && p10 < med && med < p90;
    const marks: StripData["marks"] = spread
      ? [{ key: "p10", label: COPY.customers.marks.bottom, value: p10 as number }, { key: "typical", label: COPY.customers.marks.typical, value: med, accent: true }, { key: "p90", label: COPY.customers.marks.top, value: p90 as number }]
      : [{ key: "typical", label: COPY.customers.marks.typical, value: med, accent: true }];
    const conf: Conf = o._meta?.confidence === "measured" ? "measured" : "modeled";
    const word = typeof seed?.demand?.spread_word === "string" && seed.demand.spread_word.trim() ? String(seed.demand.spread_word).trim() : null;
    return { marks, confidence: conf, note: conf === "modeled" ? COPY.cityCustomers.modelled : null, extra: word ? { value: word, label: COPY.cityCustomers.spreadWord } : null, basis: COPY.cityCustomers.basis, sample: conf !== "measured", from: "city" };
  }
  const iso2 = String(seed?.meta?.iso2 ?? "").toUpperCase();
  const country = String(seed?.meta?.country_name ?? "").trim();
  if (iso2.length !== 2 || !city || !country) return null;
  const c = buildCustomersStrip(iso2);
  if (!c) return null;
  return { ...c, basis: COPY.cityCustomers.countryBasis.replace("{country}", inSentence(country)).replace("{city}", city), sample: c.confidence !== "measured", from: "country" };
}
