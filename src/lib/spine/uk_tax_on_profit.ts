/**
 * src/lib/spine/uk_tax_on_profit.ts
 *
 * The United Kingdom's tax on profit, worked out (plan 06, task B1): the law engine's income tax and Class 4 national insurance
 * on the median full-time pay taken as a sole trader's profit, as a share of it. One function, read by the hero board and the
 * peers table's home row, so the two never print two figures for one thing.
 */
import { getCountryProfile } from "@/lib/economic_profile";
import { soleTraderTakeHome } from "@/lib/uk/law/take_home";
import { convertToUsd, convertUsdTo } from "@/lib/finance/fx";
import { honestRound } from "@/lib/uk/present/precision";

export type UkTaxOnProfit = { share: number; percent: number; profitUsd: number };

export function ukTaxOnProfit(): UkTaxOnProfit | null {
  const profile = getCountryProfile("GB");
  const pay = profile.iso2.toUpperCase() === "GB" ? profile.median_wage_full_time_usd : null;
  if (typeof pay !== "number" || !(pay > 0)) return null;
  const gbp = convertUsdTo("GBP", pay);
  if (gbp == null || !(gbp > 0)) return null;
  const t = soleTraderTakeHome(gbp);
  const share = (t.incomeTax + t.class4) / gbp;
  return { share, percent: honestRound(share * 100), profitUsd: honestRound(convertToUsd("GBP", gbp) ?? pay) };
}
