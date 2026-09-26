"use client";

/**
 * LoanLever, WHAT A START-UP LOAN COSTS YOU A MONTH (goal 2026-09-26, the plan's M3 on the borrowing card). The card prints the
 * government's start-up loans as a range of amounts at a fixed rate over one to five years; a reader cannot turn that into a
 * monthly cost in their head. The lever takes the amount and the years, both inside the card's own ranges, and prints the
 * monthly repayment by the standard repayment of a fixed-rate loan (the amount times the monthly rate, over one less the monthly
 * rate's compounding across the months), and nothing else. The default is the card's own largest amount over its longest term.
 */
import * as React from "react";
import { usd } from "@/lib/spine/money";
import { Range } from "@/components/spine/interact/Range";

export type LoanWords = { label: string; perMonth: string; amount: string; years: string; yearsUnit: string; total: string };

export function LoanLever({ min, max, rate, termMin, termMax, words }: { min: number; max: number; rate: number; termMin: number; termMax: number; words: LoanWords }) {
  const step = max > 20000 ? 500 : 100;
  const floor = Math.max(step, Math.ceil(min / step) * step);
  const ceiling = Math.max(floor + step, Math.floor(max / step) * step);
  const [amount, setAmount] = React.useState(ceiling);
  const [years, setYears] = React.useState(termMax);
  const r = rate / 100 / 12, n = years * 12;
  const monthly = r > 0 ? (amount * r) / (1 - Math.pow(1 + r, -n)) : amount / n;
  const W = words;
  const terms = Array.from({ length: termMax - termMin + 1 }, (_, i) => termMin + i);
  return (
    /* FROM 560px OF CARD THE ANSWER AND THE CONTROLS STAND SIDE BY SIDE (the page filter's WHITE SPACE at 768: the answer's line
       and the years' buttons left 198 by 156 of nothing to their right in a full-width card). */
    <div data-lever-card="loan" className="mt-5 border-t border-[var(--c-border)] pt-4 [container-type:inline-size]">
      <div className="grid gap-x-8 gap-y-4 [@container(min-width:560px)]:grid-cols-2 [@container(min-width:560px)]:items-center">
      <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[length:var(--t-body)] text-[var(--c-ink)]">{W.label}</span>
        <span aria-live="polite" className="fig text-[length:var(--t-head)] font-semibold text-[var(--c-ink)]">{usd(monthly)}</span>
        <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{W.perMonth}</span>
      </div>
      <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{W.total.replace("{total}", usd(monthly * n)).replace("{n}", String(years))}</p>
      </div>
      <div className="flex flex-col gap-3">
        <Range id="loan-amount" label={W.amount} min={floor} max={ceiling} step={step} value={amount} onChange={setAmount} format={usd} />
        <div className="flex flex-wrap items-center gap-3">
          <span id="loan-years-label" className="text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{W.years}</span>
          <div role="radiogroup" aria-labelledby="loan-years-label" className="inline-flex rounded-md border border-[var(--c-border)] bg-[var(--c-soft)] p-0.5">
            {terms.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={t === years}
                aria-label={`${t} ${W.yearsUnit}`}
                tabIndex={t === years ? 0 : -1}
                onClick={() => setYears(t)}
                onKeyDown={(e) => {
                  const i = terms.indexOf(years);
                  if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); setYears(terms[Math.min(terms.length - 1, i + 1)]); }
                  else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); setYears(terms[Math.max(0, i - 1)]); }
                }}
                className={`min-h-6 min-w-8 rounded-sm px-2 py-1 text-[length:var(--t-micro)] font-semibold tabular-nums focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-ink)] ${t === years ? "bg-[var(--c-card)] text-[var(--c-ink)] shadow-sm" : "text-[var(--c-muted)] hover:text-[var(--c-ink)]"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{W.yearsUnit}</span>
        </div>
      </div>
      </div>
    </div>
  );
}
