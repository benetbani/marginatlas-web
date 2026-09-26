"use client";

/**
 * HireLever, WHAT A HIRE AT YOUR PAY COSTS YOU (goal 2026-09-26, the plan's M3 on the staff card). The block the staff card drew
 * at the average salary since 2026-09-25 (the hire's cost: the pay, the employer's share on top, their sum), with the pay now the
 * reader's: a slider and a typed figure from the country's minimum salary up, the default the average salary the card already
 * prints. The rule is the card's own and the only arithmetic: the employer's rate on pay above the threshold (the United
 * Kingdom's National Insurance: 15% above $6,632), the rate on the whole pay where the file holds no threshold.
 *
 * Everything printed is recomputed from the four figures the server passes; nothing else enters. The words come from the copy
 * table through the server, so the table stays out of the browser.
 */
import * as React from "react";
import { usd } from "@/lib/spine/money";
import { Range } from "@/components/spine/interact/Range";

export type HireLeverWords = { label: string; unit: string; salary: string; onCost: string; rule: string; lever: string };

export function HireLever({ pay, min, rate, threshold, words }: { pay: number; min: number; rate: number; threshold: number; words: HireLeverWords }) {
  const step = 500;
  const floor = Math.max(step, Math.ceil(min / step) * step);
  const ceiling = Math.max(floor + step, Math.round((pay * 3) / 1000) * 1000);
  const [value, setValue] = React.useState(Math.round(pay));
  const onCost = Math.round((rate / 100) * Math.max(0, value - threshold));
  const total = value + onCost;
  const W = words;
  return (
    <div data-hire-cost="" data-lever-card="hire" className="mt-5 border-t border-[var(--c-border)] pt-4">
      <div className="flex items-baseline gap-3">
        <span className="text-[length:var(--t-body)] text-[var(--c-ink)]">{W.label}</span>
        <span aria-live="polite" className="fig text-[length:var(--t-head)] font-semibold text-[var(--c-ink)]">{usd(total)}</span>
        <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{W.unit}</span>
      </div>
      <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full" role="img" aria-label={`${W.label}: ${usd(total)} ${W.unit}, ${usd(value)} ${W.salary.toLowerCase()} and ${usd(onCost)} ${W.onCost}`}>
        <span aria-hidden style={{ width: `${(value / total) * 100}%`, background: "var(--c-line-strong)" }} />
        {/* The employer's share in ink (ART-DIRECTION C2): the card's answer is the average salary, already in the accent above. */}
        <span aria-hidden style={{ width: `${(onCost / total) * 100}%`, backgroundColor: "var(--c-ink2)", backgroundImage: "linear-gradient(90deg, var(--c-muted), var(--c-ink2))" }} />
      </div>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[length:var(--t-micro)] text-[var(--c-muted)]">
        <span className="inline-flex items-center gap-2"><span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: "var(--c-line-strong)" }} />{W.salary}</span>
        <span className="inline-flex items-center gap-2"><span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: "var(--c-ink2)" }} /><span className="fig font-semibold text-[var(--c-ink)]">{usd(onCost)}</span> {W.onCost}</span>
      </div>
      <div className="mt-4">
        <Range id="hire-pay" label={W.lever} min={floor} max={ceiling} step={step} value={value} onChange={setValue} format={usd} unit={W.unit} />
      </div>
      {threshold > 0 ? <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{W.rule.replace("{rate}", `${rate}%`).replace("{threshold}", usd(threshold))}</p> : null}
    </div>
  );
}
