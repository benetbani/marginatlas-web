/**
 * src/lib/uk/law/business_rates.ts
 *
 * A year's business rates in England, 2026-27, for one property with rateable value RV under 500,000:
 *
 *   multiplier m(RV)  = 38.2p (retail, hospitality, leisure) or 43.2p (other), when RV < 51,000
 *                     = 43p (retail, hospitality, leisure) or 48p (other), from 51,000
 *   gross             = RV x m(RV)
 *   relief fraction f = 1 when RV <= 12,000; (15,000 - RV) / 3,000 when 12,000 < RV < 15,000; 0 from 15,000
 *                       (small business rate relief, one property, the business's only one)
 *   bill              = gross x (1 - f)
 *
 * f is continuous (1 at 12,000, 0 at 15,000). The multiplier is NOT: at 51,000 the bill steps up by RV x 4.8p for retail,
 * hospitality and leisure (2,448 pounds at exactly 51,000) and by 4.8p for others. That cliff is the law's, printed as it is.
 * Transitional relief, the London supplement (above 75,000) and empty-property rules are out of scope (stated).
 */
import { UK_2026_27 as L } from "./params_2026_27";
import { pennies } from "./money";

export type RatesBill = { multiplier: number; gross: number; reliefFraction: number; relief: number; bill: number };

export function businessRates(input: { rateableValue: number; retailHospitalityLeisure: boolean; smallBusinessReliefEligible?: boolean }): RatesBill {
  const b = L.businessRates;
  const rv = input.rateableValue;
  if (!(rv >= 0) || rv >= b.highValueThreshold) throw new Error(`businessRates: rateable value out of scope (${rv})`);
  const small = rv < b.smallThreshold;
  const multiplier = input.retailHospitalityLeisure ? (small ? b.rhlSmallMultiplier : b.rhlStandardMultiplier) : small ? b.smallMultiplier : b.standardMultiplier;
  const gross = pennies(rv * multiplier);
  const eligible = input.smallBusinessReliefEligible ?? true;
  const reliefFraction = !eligible ? 0 : rv <= b.sbrrFullUpTo ? 1 : rv < b.sbrrNoneFrom ? (b.sbrrNoneFrom - rv) / (b.sbrrNoneFrom - b.sbrrFullUpTo) : 0;
  const relief = pennies(gross * reliefFraction);
  return { multiplier, gross, reliefFraction, relief, bill: pennies(gross - relief) };
}
