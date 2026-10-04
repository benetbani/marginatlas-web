"use client";

/**
 * HireLever, WHAT A HIRE AT YOUR PAY COSTS YOU (goal 2026-09-26, the plan's M3 on the staff card). The block the staff card drew
 * at the average salary since 2026-09-25 (the hire's cost: the pay, the employer's share on top, their sum), with the pay now the
 * reader's: a slider and a typed figure from the country's minimum salary up, the default the average salary the card already
 * prints. The rule is the card's own and the only arithmetic: the employer's rate on pay above the threshold (the United
 * Kingdom's National Insurance: 15% above $6,632), the rate on the whole pay where the file holds no threshold.
 *
 * A FIRST HIRE, WHERE THE COUNTRY'S RULES SAY SO (2026-10-04, the design review of the UK page reform: "$6,773 of employer NI two
 * rows below 'Employment Allowance £10,500 off the employer NI bill'", and the 3% pension left out): with `allowance` the
 * employer's National Insurance is what the yearly allowance leaves of it (a small employer's first hire pays none up to about
 * $100K of pay), and with `pension` the employer's minimum workplace pension on the qualifying band of pay is added, where the
 * pay reaches the band's trigger. The bar draws the salary, the pension and the NI that is left; the two rules print under it.
 *
 * Everything printed is recomputed from the figures the server passes; nothing else enters. The words come from the copy table
 * through the server, so the table stays out of the browser.
 */
import * as React from "react";
import { usd } from "@/lib/spine/money";
import { Range } from "@/components/spine/interact/Range";

export type HireLeverWords = { label: string; unit: string; salary: string; onCost: string; rule: string; lever: string; pension?: string; ni?: string };
/** The employer's minimum pension: `rate` percent of the pay between `lower` and `upper`, owed once the pay passes `trigger`. */
export type HirePension = { rate: number; lower: number; upper: number; trigger: number };

/** `notes`: the rules under the lever as the server wrote them, each a label and its terms in the law's own currency ("Employer
 *  NI", "15% above £5,000, less the £10,500 allowance"), drawn as a short list (they are rules, not a sentence under the figure:
 *  COPY-STYLE's one supporting line); without them the one rule line prints from `words.rule` in the lever's dollars. */
export function HireLever({ pay, min, rate, threshold, words, allowance = 0, pension = null, notes = null }: { pay: number; min: number; rate: number; threshold: number; words: HireLeverWords; allowance?: number; pension?: HirePension | null; notes?: Array<{ label: string; text: string }> | null }) {
  const step = 500;
  const floor = Math.max(step, Math.ceil(min / step) * step);
  const ceiling = Math.max(floor + step, Math.round((pay * 3) / 1000) * 1000);
  const [value, setValue] = React.useState(Math.round(pay));
  const ni = Math.round(Math.max(0, (rate / 100) * Math.max(0, value - threshold) - allowance));
  const pensionCost = pension && value > pension.trigger ? Math.round((pension.rate / 100) * Math.max(0, Math.min(value, pension.upper) - pension.lower)) : 0;
  const parts = pension || allowance > 0;
  const onCost = ni + pensionCost;
  const total = value + onCost;
  const W = words;
  return (
    <div data-hire-cost="" data-lever-card="hire" className="mt-5 border-t border-[var(--c-border)] pt-4">
      <div className="flex items-baseline gap-3">
        <span className="text-[length:var(--t-body)] text-[var(--c-ink)]">{W.label}</span>
        <span aria-live="polite" className="fig text-[length:var(--t-head)] font-semibold text-[var(--c-ink)]">{usd(total)}</span>
        <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{W.unit}</span>
      </div>
      <div
        className="mt-3 flex h-3 w-full overflow-hidden rounded-full"
        role="img"
        aria-label={
          parts
            ? `${W.label}: ${usd(total)} ${W.unit}, ${usd(value)} ${W.salary.toLowerCase()}, ${usd(pensionCost)} ${W.pension ?? ""} and ${usd(ni)} ${W.ni ?? ""}`
            : `${W.label}: ${usd(total)} ${W.unit}, ${usd(value)} ${W.salary.toLowerCase()} and ${usd(onCost)} ${W.onCost}`
        }
      >
        <span aria-hidden style={{ width: `${(value / total) * 100}%`, background: "var(--c-line-strong)" }} />
        {/* The employer's share in ink (ART-DIRECTION C2): the card's answer is the average salary, already in the accent above. With
            the parts, the pension in the second ink and what is left of National Insurance in the first. */}
        {parts ? (
          <>
            <span aria-hidden style={{ width: `${(pensionCost / total) * 100}%`, background: "var(--c-ink2)" }} />
            <span aria-hidden style={{ width: `${(ni / total) * 100}%`, background: "var(--c-ink)" }} />
          </>
        ) : (
          <span aria-hidden style={{ width: `${(onCost / total) * 100}%`, backgroundColor: "var(--c-ink2)", backgroundImage: "linear-gradient(90deg, var(--c-muted), var(--c-ink2))" }} />
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[length:var(--t-micro)] text-[var(--c-muted)]">
        <span className="inline-flex items-center gap-2"><span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: "var(--c-line-strong)" }} />{W.salary}</span>
        {parts ? (
          <>
            <span className="inline-flex items-center gap-2"><span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: "var(--c-ink2)" }} /><span className="fig font-semibold text-[var(--c-ink)]">{usd(pensionCost)}</span> {W.pension}</span>
            <span className="inline-flex items-center gap-2"><span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: "var(--c-ink)" }} /><span className="fig font-semibold text-[var(--c-ink)]">{usd(ni)}</span> {W.ni}</span>
          </>
        ) : (
          <span className="inline-flex items-center gap-2"><span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: "var(--c-ink2)" }} /><span className="fig font-semibold text-[var(--c-ink)]">{usd(onCost)}</span> {W.onCost}</span>
        )}
      </div>
      <div className="mt-4">
        <Range id="hire-pay" label={W.lever} min={floor} max={ceiling} step={step} value={value} onChange={setValue} format={usd} unit={W.unit} />
      </div>
      {notes && notes.length ? (
        <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">
          {notes.map((n) => (
            <div key={n.label} className="contents">
              <dt className="font-medium text-[var(--c-ink2)]">{n.label}</dt>
              <dd className="m-0">{n.text}</dd>
            </div>
          ))}
        </dl>
      ) : threshold > 0 ? (
        <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{W.rule.replace("{rate}", `${rate}%`).replace("{threshold}", usd(threshold))}</p>
      ) : null}
    </div>
  );
}
