/**
 * src/lib/spine/sections/from_abroad.ts
 *
 * OPENING FROM ABROAD (milestone 2, masterplan step 26; his ruling 28 of 2026-09-26, the first Pro sections; DATA-REQUIREMENTS
 * item 74). The walls a founder with no right to live or work in the UK meets, in the order the research gives them (company,
 * address, identity, the tax code, the bank, the routes to work here, hiring from abroad), each with its state (open,
 * conditional, closed), what it costs and how long it takes, read from data/uk/law/opening_from_abroad.json (the research of
 * 2026-10-02, section 74: every field its page, its quote and its day). No difficulty score: item 74's seed index is coined.
 *
 *   the figure:  the Innovator Founder route's fees for three years, per person: the visa from outside the UK, the health
 *                surcharge for each year, the endorsement and two contact meetings (the research's example 74.5 A, 6,462)
 *   its weeks:   the weeks to a decision from outside the UK
 *
 * Computed money is given in pounds and in dollars through the site's FX module; a law's own amounts stay in pounds.
 */
import fromAbroadJson from "../../../../data/uk/law/opening_from_abroad.json";
import { convertToUsd } from "@/lib/finance/fx";
import type { Provenance } from "@/lib/spine/provenance";
import { sumPennies } from "@/lib/uk/law/money";

export type FromAbroadField = { value: unknown; source_url: string; quote: string; checked: string };
export type FromAbroadLaw = { checked: string; fields: Record<string, FromAbroadField> };
export const FROM_ABROAD = fromAbroadJson as unknown as FromAbroadLaw;

export type WallState = "open" | "conditional" | "closed";
export type Wall = {
  key: string;
  label: string;
  state: WallState;
  /** A computed cost in pounds and dollars, where the wall has one the card prints as a figure. */
  gbp: number | null;
  usd: number | null;
  /** A law's own fee in its pounds, or the time it takes, as the law gives them; null where it gives none. */
  fee: string | null;
  time: string | null;
  note: string;
  prov: Provenance;
};
export type FromAbroad = {
  focal: { gbp: number; usd: number | null; weeks: number; prov: Provenance };
  walls: Wall[];
};

const lookedUp = (key: string): Provenance => ({ src: `uk/law/opening_from_abroad.json:${key}`, kind: "looked up" });
const worked = (key: string): Provenance => ({ src: `uk/law/opening_from_abroad.json:${key}`, kind: "worked out" });
const gbpText = (n: number) => `£${n.toLocaleString("en-GB")}`;
const obj = <T>(law: FromAbroadLaw, key: string) => law.fields[key]?.value as T | undefined;

export function buildFromAbroad(law: FromAbroadLaw = FROM_ABROAD): FromAbroad | null {
  const founder = obj<{ fee_outside_gbp: number; endorsement_gbp: number; contact_meeting_gbp: number; contact_meetings_min: number; years: number }>(law, "innovator_founder");
  const surcharge = obj<{ standard: number; youth_mobility: number }>(law, "health_surcharge_gbp_year");
  const decision = obj<{ outside: number; inside: number }>(law, "decision_weeks");
  if (!founder || !surcharge || !decision) return null;

  /* EXAMPLE A (74.5): the visa, a surcharge a year, the endorsement and the two contact meetings, per person. */
  const focalGbp = sumPennies([founder.fee_outside_gbp, surcharge.standard * founder.years, founder.endorsement_gbp, founder.contact_meeting_gbp * founder.contact_meetings_min]);

  const walls: Wall[] = [];
  const wall = (w: Omit<Wall, "gbp" | "usd"> & { gbp?: number | null }) => walls.push({ ...w, gbp: w.gbp ?? null, usd: w.gbp != null ? convertToUsd("GBP", w.gbp) : null });

  const inc = obj<{ fee_gbp: number; hours: number }>(law, "incorporation");
  if (inc && obj(law, "director_residence") === "none")
    wall({ key: "company", label: "The company", state: "open", fee: gbpText(inc.fee_gbp), time: inc.hours <= 24 ? "1 day" : `${inc.hours} hours`, note: "No residence test", prov: lookedUp("incorporation") });
  if (law.fields.registered_office)
    wall({ key: "address", label: "A UK address", state: "conditional", fee: null, time: null, note: "A real address, no PO box", prov: lookedUp("registered_office") });
  const id = obj<{ fee_gbp: number }>(law, "identity_verification");
  if (id) wall({ key: "identity", label: "Identity check", state: "open", fee: gbpText(id.fee_gbp), time: null, note: "Online, any passport", prov: lookedUp("identity_verification") });
  const codeDays = obj<number>(law, "corporation_tax_code_days_abroad");
  if (typeof codeDays === "number")
    wall({ key: "tax-code", label: "The tax code", state: "open", fee: null, time: `${codeDays} days`, note: "Posted to the UK address", prov: lookedUp("corporation_tax_code_days_abroad") });
  if (law.fields.bank_account)
    wall({ key: "bank", label: "Bank account", state: "conditional", fee: null, time: null, note: "A bank may refuse", prov: lookedUp("bank_account") });
  if (obj(law, "innovator_founder_shop") === "unlikely")
    /* Its fees and its weeks are the card's figure and second figure, printed once there (clause 66). */
    wall({ key: "founder-visa", label: "Founder visa", state: "conditional", fee: null, time: null, note: "Unlikely for an ordinary shop", prov: lookedUp("innovator_founder_shop") });
  const youth = obj<{ fee_gbp: number; months: number; employees: number }>(law, "youth_mobility");
  if (youth) {
    /* EXAMPLE B (74.5): the fee and a surcharge a year for the scheme's two years. */
    const years = youth.months / 12;
    wall({ key: "youth-mobility", label: "Youth Mobility", state: "conditional", gbp: sumPennies([youth.fee_gbp, surcharge.youth_mobility * years]), fee: null, time: `${youth.months} months`, note: youth.employees === 0 ? "If eligible, no staff" : "If eligible", prov: worked("youth_mobility") });
  }
  const trades = obj<{ ineligible: string[] }>(law, "skilled_worker_trades");
  if (trades?.ineligible.length)
    wall({ key: "hiring", label: "Hiring from abroad", state: "closed", fee: null, time: null, note: "Not barbers, salons or cooks", prov: lookedUp("skilled_worker_trades") });

  return { focal: { gbp: focalGbp, usd: convertToUsd("GBP", focalGbp), weeks: decision.outside, prov: worked("innovator_founder") }, walls };
}
