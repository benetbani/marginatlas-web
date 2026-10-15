/**
 * STAGE 4, SLOT 7, WHAT A HIRE COSTS (plan 2026-10-13 country-page-journey, Task 3E): the slot's frame (src/components/spine/country/Slot.tsx)
 * with the hire's lever under its rows (Q2, answer A), where the pay pair's average and the employer's rate stand. HireCost moved here from
 * country-view.tsx unchanged: the lever's start at the average, the UK's allowance and pension minimums in dollars, the law's pounds beside.
 */
import * as React from "react";
import { Slot } from "@/components/spine/country/Slot";
import { HireLever } from "@/components/spine/interact/HireLever";
import { COPY } from "@/lib/spine/copy";
import { countryFigure } from "@/lib/facts/country_shard";
import { lawValue, ruleAmount } from "@/lib/spine/sections/country_rules";
import { convertToUsd } from "@/lib/finance/fx";
import type { buildPayBars } from "@/lib/spine/pay_rows";
import type { SlotModel } from "@/lib/spine/slots/types";
import type { HireDrawing } from "@/lib/spine/slots/hire";

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export function HireSlot({ model }: { model: SlotModel<HireDrawing> }) {
  const { iso2, pay, rate } = model.drawing;
  return <Slot model={model} after={pay && rate != null ? <HireCost iso2={iso2} pay={pay} rate={rate} /> : null} />;
}

/**
 * WHAT A HIRE COSTS YOU (2026-09-25, his "numbers with no relation to each other"): the average salary and what the employer pays
 * on top of it, as one bar of its two parts and their sum. The employer's part is the rate on wages above the threshold where the
 * country's file holds one (the United Kingdom's National Insurance: 15% above the first $6.6K), the rate on the whole salary
 * otherwise. Every figure is the staff card's own or the shard's; the sum is arithmetic on them, never a new estimate.
 */
export function HireCost({ iso2, pay, rate }: { iso2: string; pay: NonNullable<ReturnType<typeof buildPayBars>>; rate: number | null }) {
  const avg = pay.rows.find((r) => r.key === "average")?.value;
  const min = pay.rows.find((r) => r.key === "minimum")?.value;
  if (!isNum(avg) || avg <= 0 || rate == null || rate <= 0) return null;
  const threshold = countryFigure(iso2, "employment.employer_ni_threshold_usd")?.value ?? 0;
  const H = COPY.hireCost;
  /* A FIRST HIRE BY THE COUNTRY'S OWN RULES (2026-10-04): where rules.json holds the employer's yearly allowance and the pension
     minimum, the lever takes them, in dollars at the site's one pound rate (fx.ts, the rate every UK figure was converted at). */
  const gbp = (topic: string, key: string) => {
    const a = ruleAmount(iso2, topic, key)?.gbp;
    return typeof a === "number" ? convertToUsd("GBP", a) : null;
  };
  const allowance = gbp("employing", "employment-allowance");
  const pRate = ruleAmount(iso2, "employing", "pension-employer")?.pct;
  const pLower = gbp("employing", "pension-band-lower");
  const pUpper = gbp("employing", "pension-band-upper");
  const pTrigger = gbp("employing", "pension-trigger");
  const pension = typeof pRate === "number" && pLower != null && pUpper != null && pUpper > pLower ? { rate: pRate, lower: pLower, upper: pUpper, trigger: pTrigger ?? 0 } : null;
  const first = (allowance ?? 0) > 0 || pension != null;
  /* THE RULES UNDER THE LEVER IN THE LAW'S POUNDS (the design review's first finding: "$6,632 ... is the £5,000 threshold" read
     as a made-up figure): the lever's own figures stay in the page's dollars, the law it applies is printed as the law states it. */
  const lb = (topic: string, key: string) => {
    const a = ruleAmount(iso2, topic, key)?.gbp;
    return typeof a === "number" ? lawValue({ gbp: a }) : null;
  };
  const niGbp = lb("employing", "employer-ni-threshold");
  const eaGbp = lb("employing", "employment-allowance");
  const lowGbp = lb("employing", "pension-band-lower");
  const highGbp = lb("employing", "pension-band-upper");
  /* EACH FIGURE SAYS WHICH RULES IT IS WORKED OUT FROM (plan 2026-10-12 rhythm-air-inside, Task 4): the average pay (the profile's field), the employer's rate and threshold, the allowance and the pension band, each where it is read. */
  const payField = "economic_indicators/country_profile_v2.json:median_wage_full_time_usd";
  const rateField = `tax/country_rates_2024.json:rates.${iso2}.employer_social`;
  const niRules = `${rateField} + facts/country/${iso2}.json:employment.employer_ni_threshold_usd${(allowance ?? 0) > 0 ? ` + sections/rules.json:${iso2}:employing:employment-allowance` : ""}`;
  const pensionRules = `sections/rules.json:${iso2}:employing:pension-employer + pension-band-lower + pension-band-upper + pension-trigger`;
  const provs = {
    total: { src: `${payField} + ${niRules}${pension ? ` + ${pensionRules}` : ""}`, kind: "worked out" as const },
    pension: pension ? { src: `${payField} + ${pensionRules}`, kind: "worked out" as const } : null,
    ni: first ? { src: `${payField} + ${niRules}`, kind: "worked out" as const } : null,
    onCost: !first ? { src: `${payField} + ${niRules}`, kind: "worked out" as const } : null,
  };
  const notes = first
    ? [
        ...(niGbp && eaGbp ? [{ label: H.niLabel, text: H.niRule.replace("{rate}", `${rate}%`).replace("{threshold}", niGbp).replace("{allowance}", eaGbp) }] : []),
        ...(pension && lowGbp && highGbp ? [{ label: H.pensionLabel, text: H.pensionRule.replace("{rate}", `${pension.rate}%`).replace("{lower}", lowGbp).replace("{upper}", highGbp) }] : []),
      ]
    : null;
  /* THE PAY IS THE READER'S (goal 2026-09-26, M3): the block the card drew at the average salary is a lever from the minimum
     salary up, its default the average the card prints above; the rule is unchanged (src/components/spine/interact/HireLever.tsx). */
  return (
    <HireLever
      pay={avg}
      min={isNum(min) && min > 0 ? min : Math.round(avg / 2)}
      rate={rate}
      threshold={threshold}
      allowance={allowance ?? 0}
      pension={pension}
      notes={notes}
      provs={provs}
      words={{ label: first ? H.labelFirst : H.label, unit: H.unit, salary: H.salary, onCost: H.onCost, rule: H.rule, lever: H.lever, pension: H.pension, ni: H.ni }}
    />
  );
}
