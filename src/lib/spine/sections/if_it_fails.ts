/**
 * src/lib/spine/sections/if_it_fails.ts
 *
 * WHAT FAILING COSTS (milestone 2, masterplan step 28; his ruling 28 of 2026-09-26, the first Pro sections; DATA-REQUIREMENTS
 * item 76). What a failed business costs its owner in England and Wales, read from data/uk/law/if_it_fails.json (the research
 * of 2026-10-02, section 76: every field its page, its quote and its day). No ease score: item 76's seed index is coined.
 *
 *   the figure:  the months until a bankrupt sole trader is freed from the debts (a sole trader's liability is unlimited, so
 *                the business's debts are the owner's)
 *   the cells:   the rest of item 76 and the plan's two, each naming the field it reads: the home, the Debt Relief Order's
 *                limit, a liquidation's fees and its time, wrongful trading, the director ban, the guarantee, the director's
 *                loan charge
 *
 * The solvent close is held in the file for the research's example A and never read here: /gb's paperwork card prints the
 * strike-off ("To close"), and a figure is printed once on a page. A law's own amounts stay in pounds, as does the Insolvency
 * Service's median, a published figure the site does not compute.
 */
import type { FactRow } from "@/components/spine/archetypes/FactRows";
import ifItFailsJson from "../../../../data/uk/law/if_it_fails.json";
import type { Provenance } from "@/lib/spine/provenance";

export type IfItFailsField = { value: unknown; source_url: string; quote: string; checked: string };
export type IfItFailsLaw = { checked: string; fields: Record<string, IfItFailsField> };
export const IF_IT_FAILS = ifItFailsJson as unknown as IfItFailsLaw;

export type IfItFails = { focal: { months: number; prov: Provenance }; rows: FactRow[] };

const lookedUp = (key: string): Provenance => ({ src: `uk/law/if_it_fails.json:${key}`, kind: "looked up" });
const worked = (key: string): Provenance => ({ src: `uk/law/if_it_fails.json:${key}`, kind: "worked out" });
const gbpText = (n: number) => `£${n.toLocaleString("en-GB")}`;
const obj = <T>(law: IfItFailsLaw, key: string) => law.fields[key]?.value as T | undefined;
/** Days in whole months, at the calendar's average month (365.25 / 12 days). */
export const monthsOfDays = (days: number) => Math.round((days * 12) / 365.25);

export function buildIfItFails(law: IfItFailsLaw = IF_IT_FAILS): IfItFails | null {
  const discharge = obj<number>(law, "discharge_months");
  if (typeof discharge !== "number" || obj(law, "sole_trader_liability") !== "unlimited") return null;

  const rows: FactRow[] = [];
  const push = (key: string, field: string, label: string, value: string | null, note: string, prov: Provenance = lookedUp(field)) => {
    if (value && law.fields[field]) rows.push({ key, icon: ICON[key], label, value, note, prov });
  };
  /* A SOLE TRADER WHO GOES BANKRUPT: the home, and the way out with no fee where the debts are small. */
  const home = obj<{ protected: string; years: number }>(law, "home_protected");
  push("home", "home_protected", "Your home", home?.protected === "no" ? "Can be sold" : null, `Within ${home?.years} years of the bankruptcy order`);
  const dro = obj<{ debts_under_gbp: number; fee_gbp: number }>(law, "debt_relief_order");
  push("debt-relief", "debt_relief_order", "Debt Relief Order", dro ? `Under ${gbpText(dro.debts_under_gbp)}` : null, dro?.fee_gbp === 0 ? "Debts below this, no fee, if you own little and no home" : "Debts below this, if you own little and no home");
  /* A COMPANY THAT FAILS: what winding it up costs and takes, in the Insolvency Service's sample of liquidations. */
  const cost = obj<{ median_fees_gbp: number; median_assets_gbp: number }>(law, "liquidation_cost_local");
  const sample = obj<{ started: number }>(law, "liquidation_sample");
  push("liquidation-fees", "liquidation_cost_local", "Liquidation fees", cost && sample ? gbpText(cost.median_fees_gbp) : null, `The median, against ${gbpText(cost?.median_assets_gbp ?? 0)} of assets, cases from ${sample?.started}`);
  const time = obj<{ median_days: number }>(law, "liquidation_months");
  push("liquidation-time", "liquidation_months", "Liquidation time", time ? `${monthsOfDays(time.median_days)} months` : null, "The median, start to finish, in the same cases", worked("liquidation_months"));
  /* WHERE THE COMPANY'S DEBTS REACH ITS OWNER. */
  const wrongful = obj<{ applies: boolean; capped: boolean }>(law, "wrongful_trading");
  push("wrongful-trading", "wrongful_trading", "Wrongful trading", wrongful?.applies ? (wrongful.capped ? "Capped" : "No cap") : null, "If you traded on once insolvency could not be avoided");
  const banMin = obj<number>(law, "disqualification_years_min");
  const banMax = obj<number>(law, "disqualification_years_max");
  push("director-ban", "disqualification_years_max", "Director ban", banMin != null && banMax != null ? `${banMin} to ${banMax} years` : null, "For unfit conduct when a company fails");
  push("guarantee", "guarantee_survives", "Your guarantee", obj(law, "guarantee_survives") === true ? "Survives" : null, "A guarantor still owes the rent after the liquidator drops the lease");
  const loan = obj<{ from_2026: number }>(law, "directors_loan_charge_pct");
  push("directors-loan", "directors_loan_charge_pct", "Director's loan", loan ? `${loan.from_2026}%` : null, "Paid by the company on your unpaid loan, back once repaid");

  return { focal: { months: discharge, prov: lookedUp("discharge_months") }, rows };
}

/* One glyph a row, never twice in the card, none the card's opener draws (ICONS.md, rules 3 and 10). */
const ICON: Record<string, NonNullable<FactRow["icon"]>> = {
  home: "neighborhood",
  "debt-relief": "raise-money",
  "liquidation-fees": "cost-breakdown",
  "liquidation-time": "freshness",
  "wrongful-trading": "flag",
  "director-ban": "leaving",
  guarantee: "commercial-rent",
  "directors-loan": "taxes",
};
