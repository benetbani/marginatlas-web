/**
 * src/lib/spine/range_rows.ts
 *
 * THE RANGE STRIPS' MARKS for a country: premises (rent a square metre a year
 * by address, the profile's three national tiers today; the founder's five
 * metrics, prime and secondary street in the metropolis and in a city plus a
 * fifth, are a data requirement the strip is built to hold) and customers
 * (typical full-time pay with the bottom and top tenth where the deciles are
 * researched). Local and synchronous, the adapter's own rules and tiering.
 * And the city's earnings strip (`buildCityEarningsStrip`, plan step 32's
 * fourth dispatch, 2026-09-18): the city's own typical from the one income
 * builder between the country's two deciles.
 */
import { getCountryProfile } from "@/lib/economic_profile";
import { COPY } from "@/lib/spine/copy";
import { inSentence } from "@/lib/spine/place_names";
import { cityTypicalIncome } from "@/lib/spine/city_income";

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
type Conf = "measured" | "modeled";

export type StripData = {
  marks: Array<{ key: string; label: string; value: number; accent?: boolean; lead?: boolean }>;
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
  if (isNum(p.commercial_rent_t3_usd_per_sqm_year) && p.commercial_rent_t3_usd_per_sqm_year > 0) marks.push({ key: "t3", label: COPY.premises.marks.t3, value: Math.round(p.commercial_rent_t3_usd_per_sqm_year) });
  if (isNum(p.commercial_rent_t2_usd_per_sqm_year) && p.commercial_rent_t2_usd_per_sqm_year > 0) marks.push({ key: "t2", label: COPY.premises.marks.t2, value: Math.round(p.commercial_rent_t2_usd_per_sqm_year) });
  if (isNum(p.commercial_rent_t1_usd_per_sqm_year) && p.commercial_rent_t1_usd_per_sqm_year > 0) marks.push({ key: "t1", label: COPY.premises.marks.t1, value: Math.round(p.commercial_rent_t1_usd_per_sqm_year) });
  const kwh = isNum(p.electricity_usd_per_kwh_commercial) && p.electricity_usd_per_kwh_commercial > 0 ? p.electricity_usd_per_kwh_commercial : null;
  if (marks.length === 0 && kwh == null) return null;
  return { marks, confidence: conf, note: null, extra: kwh != null ? { value: `$${kwh}`, label: COPY.premises.electricity } : null };
}

/** Null when no typical pay is held.
 *  THE TYPICAL IS THE LEAD, NOT THE ACCENT (MODEL.md 8.2, `13 customers`:
 *  "the typical goes to ink, giving up the accent it held"; plan step 31's
 *  sixth dispatch, 2026-09-18). It held `accent: true` and drew in terracotta,
 *  a third accent on a page whose two are the hero's rate and the staff card's
 *  average (PART 6); it is `lead` now, the head rung in ink, so the strip
 *  still says which mark is the answer of the spread and spends no colour on
 *  it. THE LEAD IS THE CARD'S 30 (M3, "the typical mark is the card's 30 in
 *  ink on every strip that holds one"; plan step 32's fourth dispatch,
 *  2026-09-18, which took RangeStrip's lead rung from the head to the focal
 *  rung, so FOCAL closes on this strip and on the city's). A city that falls
 *  back to this builder draws the country's strip as this builder draws it. */
export function buildCustomersStrip(iso2: string): StripData | null {
  const { p, held, conf } = profileOf(iso2);
  if (!held || !isNum(p.median_wage_full_time_usd) || p.median_wage_full_time_usd <= 0) return null;
  const med = Math.round(p.median_wage_full_time_usd);
  const p10 = isNum(p.wage_p10_usd) && p.wage_p10_usd > 0 ? Math.round(p.wage_p10_usd) : null;
  const p90 = isNum(p.wage_p90_usd) && p.wage_p90_usd > 0 ? Math.round(p.wage_p90_usd) : null;
  const spread = p10 != null && p90 != null && p10 < med && med < p90;
  const marks: StripData["marks"] = spread
    ? [{ key: "p10", label: COPY.customers.marks.bottom, value: p10 as number }, { key: "typical", label: COPY.customers.marks.typical, value: med, lead: true }, { key: "p90", label: COPY.customers.marks.top, value: p90 as number }]
    : [{ key: "typical", label: COPY.customers.marks.typical, value: med, lead: true }];
  return { marks, confidence: conf, note: spread ? null : COPY.customers.noSpread, extra: null };
}

/** THE CITY'S EARNINGS STRIP, `07 earnings` (MODEL.md 8.3; M3, M5; plan step
 *  32's fourth dispatch, 2026-09-18). Three marks, linear: the country's
 *  bottom tenth and top tenth off the profile's measured deciles
 *  (`wage_p10_usd`, `wage_p90_usd`, data/economics/wage_deciles_v1.json
 *  through apply_wage_deciles.ts) as the outer marks, and the city's OWN
 *  typical pay from the one builder (city_income.ts: `owner_col.
 *  median_salary_usd_mo` times twelve, the same figure the masthead, the
 *  runway and the peers row print) as the middle mark, the lead, the card's
 *  30 in ink. The basis says whose each is: "Typical pay here, a year; the
 *  spread is the country's."
 *
 *  COUNTED 2026-09-18 over the 252 listed cities: 152 draw the three marks;
 *  84 stand on a country holding no deciles (Abidjan among them) and draw
 *  the typical alone, the note saying the country's tenths are not
 *  researched; 16 hold deciles that do not bracket the city's typical (15
 *  below the bottom tenth, Rome, Kyoto and Valencia among them, 1 above,
 *  San Jose) and draw the typical alone with the note saying the spread is
 *  not drawn because the typical sits outside it. The reason under those 16
 *  is item 24's marker gap: the city's figure is a take-home on most files
 *  and the country's deciles are gross, and the shard cannot say which, so
 *  a typical under a bottom tenth is the two bases meeting, not a fact, and
 *  a strip that drew it would read "the typical Roman earns less than
 *  Italy's poorest tenth". Withheld with the stated line instead. Where the
 *  city holds no typical of its own (no city today) the whole strip is the
 *  country's through buildCustomersStrip and `countryBasis` names the
 *  country and says the city is not researched on its own yet.
 *
 *  The spread word that rode the old strip's extra slot (a quartile word off
 *  the gini field) is gone: 8.3's row holds no extra today, a one-word
 *  summary of a place is banned (clause 19), and `gini` is excluded from
 *  the city's cards by `02`'s own row. */
export type CityEarningsData = StripData & {
  slug: string;
  iso2: string;
  name: string;
  basis: string;
  sample: boolean;
  from: "city" | "country";
  /** The figures for the gates: the typical printed, the country's deciles where drawn, and whether the deciles were withheld for not bracketing the typical. */
  figures: { typical: number; p10: number | null; p90: number | null; outside: boolean };
};
export function buildCityEarningsStrip(slug: string): CityEarningsData | null {
  const income = cityTypicalIncome(slug);
  if (!income) return null;
  const base = { slug, iso2: income.iso2, name: income.name };
  if (income.from === "country") {
    const c = buildCustomersStrip(income.iso2);
    if (!c) return null;
    const typical = c.marks.find((m) => m.key === "typical")?.value ?? income.value;
    return {
      ...base,
      ...c,
      basis: COPY.cityCustomers.countryBasis.replace("{country}", inSentence(income.countryName)).replace("{city}", income.name),
      sample: c.confidence !== "measured",
      from: "country",
      figures: { typical, p10: c.marks.find((m) => m.key === "p10")?.value ?? null, p90: c.marks.find((m) => m.key === "p90")?.value ?? null, outside: false },
    };
  }
  const { p } = profileOf(income.iso2);
  const held = p.iso2.toUpperCase() === income.iso2;
  const p10 = held && isNum(p.wage_p10_usd) && p.wage_p10_usd > 0 ? Math.round(p.wage_p10_usd) : null;
  const p90 = held && isNum(p.wage_p90_usd) && p.wage_p90_usd > 0 ? Math.round(p.wage_p90_usd) : null;
  const deciles = p10 != null && p90 != null;
  const brackets = deciles && (p10 as number) < income.value && income.value < (p90 as number);
  const typicalMark = { key: "typical", label: COPY.customers.marks.typical, value: income.value, lead: true };
  const marks: StripData["marks"] = brackets
    ? [{ key: "p10", label: COPY.customers.marks.bottom, value: p10 as number }, typicalMark, { key: "p90", label: COPY.customers.marks.top, value: p90 as number }]
    : [typicalMark];
  const notes: string[] = [];
  if (!deciles) notes.push(COPY.cityCustomers.noSpread);
  else if (!brackets) notes.push(COPY.cityCustomers.outside);
  if (income.sample) notes.push(COPY.cityCustomers.modelled);
  return {
    ...base,
    marks,
    confidence: income.sample ? "modeled" : "measured",
    note: notes.length ? notes.join(" ") : null,
    extra: null,
    basis: brackets ? COPY.cityCustomers.basis : COPY.cityCustomers.basisAlone,
    sample: income.sample,
    from: "city",
    figures: { typical: income.value, p10: brackets ? p10 : null, p90: brackets ? p90 : null, outside: deciles && !brackets },
  };
}

/* THE CITY'S PREMISES STRIP LEFT ON PLAN STEP 32 (second dispatch, 2026-09-18).
   `buildCityPremisesStrip` drew the country's three rents by city size under a
   city's name from run 13 (2026-09-06) until MODEL.md 8.3 seated the premises
   bento in `04 premises` on the city's own `realestate.*` (premises_bento_rows.ts):
   "The old strip of national tiers leaves." The country page keeps
   `buildPremisesStrip` above, unchanged. */
