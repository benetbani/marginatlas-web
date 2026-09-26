"use client";

/**
 * CoverPicker, WHAT YOUR COVER COSTS A YEAR (goal 2026-09-26, the plan's M3 on the insurance card).
 *
 * THE SENSE FIX FIRST. The card's figure was the law's minimum cover, $6.6M of employers' liability, printed at the focal size
 * over a list of yearly premiums: a reader glancing at "Insurance" and "$6.6M" reads a cost of six million dollars. The figure is
 * now what the covers cost a year, and the minimum cover is the words on the one row the law requires.
 *
 * THE LEVER. Every cover is a row that ticks: the card's figure is the sum of the ticked rows' typical yearly premiums, the only
 * arithmetic, and an unticked row fades with its bar. All are ticked at first, so the first figure is the whole list the file
 * holds; the cover the law requires stays ticked (it cannot be declined once you employ), its chip says so. The rows share the
 * height the level lends the card, a hairline between them (the ruled rows of 2026-09-26).
 */
import * as React from "react";
import { usd } from "@/lib/spine/money";

export type Cover = { key: string; label: string; usd: number; required: boolean };
export type CoverWords = { focal: string; required: string; minimum: string | null; aYear: string; tick: string };

export function CoverPicker({ covers, words, fill = false }: { covers: Cover[]; words: CoverWords; fill?: boolean }) {
  const sorted = React.useMemo(() => [...covers].sort((a, b) => b.usd - a.usd), [covers]);
  const [ticked, setTicked] = React.useState<Set<string>>(() => new Set(covers.map((c) => c.key)));
  const total = sorted.reduce((sum, c) => sum + (ticked.has(c.key) ? c.usd : 0), 0);
  const top = Math.max(...sorted.map((c) => c.usd));
  const toggle = (key: string) => setTicked((prev) => { const next = new Set(prev); if (next.has(key)) next.delete(key); else next.add(key); return next; });
  return (
    <div data-lever-card="covers" className={`[container-type:inline-size] ${fill ? "flex flex-1 flex-col" : ""}`}>
      <div className="mb-5">
        <div data-focal="1" aria-live="polite" className="fig text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]">{usd(total)}</div>
        <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{words.focal}</p>
      </div>
      <fieldset className={`m-0 min-w-0 border-0 p-0 ${fill ? "flex flex-1 flex-col" : ""}`}>
        <legend className="sr-only">{words.tick}</legend>
        <ol data-archetype="bar-list" data-visual="1" data-look="plain" data-rows={String(sorted.length)} className={`m-0 grid list-none items-center gap-x-3 p-0 grid-cols-[auto_minmax(0,1fr)_auto] [@container(min-width:420px)]:grid-cols-[auto_minmax(0,24ch)_auto_minmax(0,1fr)] ${fill ? "flex-1 gap-y-0" : "gap-y-5"}`}>
          {sorted.map((c, i) => {
            const on = ticked.has(c.key);
            const w = top > 0 ? Math.max(2, (c.usd / top) * 100) : 0;
            return (
              /* THE ROW STANDS ON ITS NAME'S LINE (the model laws' ROW LINE): top-aligned, so the figure, the box and the bar read on
                 the name's first line and the required cover's note hangs under the name alone. */
              <li key={c.key} data-row={c.key} className={`col-span-full grid max-w-none grid-cols-subgrid items-start gap-y-1 ${fill ? `self-stretch content-center py-3${i > 0 ? " border-t border-[var(--c-border)]" : " pt-0"}${i === sorted.length - 1 ? " pb-0" : ""}` : ""}`}>
                {/* The boxes in ink2, not the accent: the accent marks the card's answer, never its controls. The required cover's box
                    stands ticked and does not move (a disabled box greys out and reads as unticked, the opposite of its meaning). */}
                <input
                  id={`cover-${i}`}
                  type="checkbox"
                  checked={on}
                  aria-disabled={c.required || undefined}
                  onChange={() => { if (!c.required) toggle(c.key); }}
                  onClick={(e) => { if (c.required) e.preventDefault(); }}
                  className={`mt-px h-4 w-4 accent-[var(--c-ink2)] ${c.required ? "cursor-default" : "cursor-pointer"}`}
                />
                <div className="min-w-0">
                  <label htmlFor={`cover-${i}`} data-label className={`block text-[length:var(--t-body)] leading-tight ${c.required ? "cursor-default" : "cursor-pointer"} ${on ? "text-[var(--c-ink)]" : "text-[var(--c-muted)]"}`}>
                    {c.label}
                    {c.required ? <>{" "}<span className="ml-1 rounded-md border border-[var(--c-border)] bg-[var(--c-soft)] px-2 py-0.5 align-middle text-[length:var(--t-micro)] font-semibold text-[var(--c-ink2)]">{words.required}</span></> : null}
                  </label>
                  {c.required && words.minimum ? <span className="mt-1 block text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{words.minimum}</span> : null}
                </div>
                <span className={`fig text-right text-[length:var(--t-body)] font-semibold ${on ? "text-[var(--c-ink)]" : "text-[var(--c-muted)] line-through decoration-[var(--c-line-strong)]"}`}>{usd(c.usd)} {words.aYear}</span>
                <span className="relative col-span-full mt-px block h-4 rounded-full [@container(min-width:420px)]:col-span-1" role="img" aria-label={`${c.label}: ${usd(c.usd)} ${words.aYear}`} style={{ opacity: on ? 1 : 0.35 }}>
                  <span aria-hidden className="absolute inset-0 rounded-full bg-[var(--c-soft2)]" />
                  <span aria-hidden data-bar data-marked={c.required ? "1" : undefined} className="absolute inset-y-0 left-0 rounded-full" style={c.required ? { width: `${w}%`, backgroundColor: "var(--terra)", backgroundImage: "linear-gradient(90deg, var(--terra-border), var(--terra))" } : { width: `${w}%`, backgroundColor: "var(--c-line-strong)", backgroundImage: "linear-gradient(90deg, var(--c-border), var(--c-line-strong))" }} />
                </span>
              </li>
            );
          })}
        </ol>
      </fieldset>
    </div>
  );
}
