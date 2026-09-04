/**
 * src/lib/spine/hero_facts.ts
 *
 * THE MASTHEAD'S FACTS, BUILT LOCALLY AND SYNCHRONOUSLY, for the AnswerCard
 * archetype and its stories. One responsibility: turn a country code into the
 * answer (the small-business effective rate under its named regime) and the
 * companion cells (payroll on wages, sales tax, the LLC's registration time
 * and fee), each with its own confidence, from the same modules the country
 * adapter reads. No network, no secret, so the archetype harness can render
 * every country in the build chain.
 *
 * WHY A SECOND BUILDER AND NOT THE ADAPTER. buildSpineCountrySeed is async and
 * reaches the cell lattice for the money block; the masthead needs none of
 * that, and a harness that must never touch the network cannot call it. The
 * adapter's hero block and this builder read the same four modules; when the
 * adapter's masthead moves onto the archetype it calls this function, so the
 * two cannot drift (the C29 lesson: one formatter, one picker).
 *
 * THE FOUNDER'S RULINGS OF 2026-09-04 ARE BUILT IN: the registration cells are
 * the LLC's (ruling 1); the labels say what is measured, because the file
 * holds the government fee and the filing time and not the all-in cost or the
 * time until the activity opens (rulings 3 and 4 are a data requirement,
 * defined in design/loop/architecture/research/country-take-llc.md).
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only money.
 */
import { getCountryRates, getFormationRowByTier } from "@/lib/tax/country_rates";
import { getSmbRegime, getVatRow } from "@/lib/tax/smb_effective_rates";
import { getCountryProfile } from "@/lib/economic_profile";
import { COUNTRIES } from "@/lib/taxonomy";
import { usd } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";

export type Confidence = "measured" | "modeled" | "placeholder";

export type HeroCell = {
  key: string;
  /** Micro caps label, from the copy table. */
  label: string;
  /** The figure as printed, by the ratified grammar. */
  value: string;
  /** One plain qualifier line, from the copy table, or none. */
  note?: string;
  /** A row heading shared by the cells of one group, printed once. */
  group?: string;
  confidence: Confidence;
};

export type HeroFacts = {
  iso2: string;
  name: string;
  answer: { label: string; value: string; regime: string | null; confidence: Confidence } | null;
  cells: HeroCell[];
  /** Composed from what resolved, never promising an absent cell. */
  subtitle: string | null;
  /** The weakest confidence on the card, for the tag. */
  confidence: Confidence;
};

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const pct = (v: number) => `${Math.round(v * 1000) / 10}%`;

function countryName(iso2: string): string {
  const list: any = COUNTRIES;
  if (Array.isArray(list)) {
    const hit = list.find((c: any) => String(c.iso2 ?? c.code ?? "").toUpperCase() === iso2);
    if (hit?.name) return String(hit.name);
  } else if (list && typeof list === "object") {
    const hit = list[iso2] ?? list[iso2.toLowerCase()];
    if (hit) return typeof hit === "string" ? hit : String(hit.name ?? iso2);
  }
  return iso2;
}

export function buildHeroFacts(iso2In: string): HeroFacts {
  const iso2 = iso2In.toUpperCase();
  const name = countryName(iso2);
  const regime = getSmbRegime(iso2);
  const rates = getCountryRates(iso2);
  const vat = getVatRow(iso2);
  const profile = getCountryProfile(iso2);
  const profileHeld = profile.iso2.toUpperCase() === iso2;
  const profileConfidence: Confidence = profileHeld && profile.tier === "A" ? "measured" : "modeled";
  const llc = getFormationRowByTier(iso2, "LLC");

  const answer = regime && isNum(regime.effective_rate)
    ? { label: COPY.answer.label, value: pct(regime.effective_rate), regime: regime.local_name || null, confidence: "modeled" as Confidence }
    : null;

  const cells: HeroCell[] = [];
  if (isNum(rates.employerSocial) && rates.employerSocial > 0) {
    cells.push({ key: "payroll", label: COPY.cells.payroll.label, value: pct(rates.employerSocial), note: COPY.cells.payroll.note, confidence: "measured" });
  }
  if (vat && isNum(vat.standard)) {
    cells.push({ key: "sales-tax", label: COPY.cells.salesTax.label, value: pct(vat.standard), note: COPY.cells.salesTax.note, confidence: "measured" });
  } else if (profileHeld && isNum(profile.vat_gst_standard_pct)) {
    cells.push({ key: "sales-tax", label: COPY.cells.salesTax.label, value: pct(profile.vat_gst_standard_pct), note: COPY.cells.salesTax.note, confidence: profileConfidence });
  }
  if (llc && isNum(llc.days)) {
    cells.push({ key: "llc-time", group: COPY.cells.llcGroup, label: COPY.cells.llcTime.label, value: llc.days === 1 ? "1 day" : `${llc.days} days`, note: COPY.cells.llcTime.note, confidence: "measured" });
  }
  if (llc && isNum(llc.costUsd)) {
    cells.push({ key: "llc-cost", group: COPY.cells.llcGroup, label: COPY.cells.llcCost.label, value: llc.costUsd === 0 ? COPY.free : usd(llc.costUsd), note: COPY.cells.llcCost.note, confidence: "measured" });
  }

  const promises: string[] = [];
  if (answer) promises.push(COPY.subtitle.pays);
  if (cells.some((c) => c.key === "llc-cost")) promises.push(COPY.subtitle.register);
  const subtitle = promises.length > 0 ? `${promises.join(", and ").replace(/^./, (c) => c.toUpperCase())}.` : null;

  const order: Confidence[] = ["measured", "modeled", "placeholder"];
  const all: Confidence[] = [...(answer ? [answer.confidence] : []), ...cells.map((c) => c.confidence)];
  const confidence = all.reduce<Confidence>((w, c) => (order.indexOf(c) > order.indexOf(w) ? c : w), "measured");

  return { iso2, name, answer, cells, subtitle, confidence };
}
