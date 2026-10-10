/**
 * src/lib/spine/uk_tax_on_profit.ts
 *
 * The United Kingdom's tax on profit, worked out (plan 06, task B1): the law engine's income tax and Class 4 national insurance
 * on the median full-time pay taken as a sole trader's profit, as a share of it. One function, read by the hero board and the
 * peers table's home row, so the two never print two figures for one thing.
 *
 * ITS TWO RULES (plan 2026-10-10, the home reformed to ship, Task 4; the critique's P0.7): the home's tax proof, "Tax, rule by rule",
 * prints the two parts this function already works out, income tax and Class 4 National Insurance, each a share of the profit
 * (`parts`, percents, unrounded) and as whole numbers that sum to the printed total (`partsPercent`, largest remainder over
 * `percent`): on today's figures 13.56 and 4.07 of 17.63, printed 14 and 4 of 18. And what is kept (critique pass 2, P0.1: the tax
 * proof draws the two rules and the rest as one stacked bar, "Tax 18%" and "You keep 82%"): `partsPercent.keep` is 100 less the printed
 * total, a whole number, so the three printed parts sum to 100.
 */
import { getCountryProfile } from "@/lib/economic_profile";
import { soleTraderTakeHome } from "@/lib/uk/law/take_home";
import { convertToUsd, convertUsdTo } from "@/lib/finance/fx";
import { honestRound, largestRemainder } from "@/lib/uk/present/precision";

/** The two parts, each a share of the profit, in percent. */
export type UkTaxParts = { incomeTax: number; class4: number };
/** The printed parts as whole numbers: the two rules and what is kept, summing to 100. */
export type UkTaxPercents = UkTaxParts & { keep: number };
export type UkTaxOnProfit = { share: number; percent: number; profitUsd: number; parts: UkTaxParts; partsPercent: UkTaxPercents };

export function ukTaxOnProfit(): UkTaxOnProfit | null {
  const profile = getCountryProfile("GB");
  const pay = profile.iso2.toUpperCase() === "GB" ? profile.median_wage_full_time_usd : null;
  if (typeof pay !== "number" || !(pay > 0)) return null;
  const gbp = convertUsdTo("GBP", pay);
  if (gbp == null || !(gbp > 0)) return null;
  const t = soleTraderTakeHome(gbp);
  const share = (t.incomeTax + t.class4) / gbp;
  const percent = honestRound(share * 100);
  const parts: UkTaxParts = { incomeTax: (t.incomeTax / gbp) * 100, class4: (t.class4 / gbp) * 100 };
  const [incomeTax, class4] = largestRemainder([parts.incomeTax, parts.class4], percent);
  return { share, percent, profitUsd: honestRound(convertToUsd("GBP", gbp) ?? pay), parts, partsPercent: { incomeTax, class4, keep: 100 - percent } };
}
