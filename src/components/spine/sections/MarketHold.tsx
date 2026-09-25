/**
 * MarketHold, WHO HOLDS THE MARKET (2026-09-25; his message that night: "how dominated by big brands a market is"). Page-agnostic,
 * keyed by country and market (sections/market_jobs.ts).
 *
 * THE LAW, inside the component:
 *  - THE CARD'S ONE FIGURE is the biggest chains' combined share, said once; the bar says the same thing as a length.
 *  - ONE BAR OF THE WHOLE MARKET: the biggest chains first, the largest of them the one part in the accent and the rest of them
 *    in its tint, then the other named chains in the neutral, then everyone else the palest and last; a bracket over the biggest
 *    chains' length, so the figure is read off the bar.
 *  - THE PARTS AS ROWS under the bar, each its swatch, its name and its share, two a line from 560px of card.
 *  - `data-archetype="market-hold"`, `data-visual="1"`, `data-parts`; `data-row` and `data-label` on each part.
 */
import * as React from "react";
import { Box, Fig, Rail } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { MarketHold as MarketHoldData, HoldPart } from "@/lib/spine/sections/market_jobs";

export function MarketHold({ id = "market-hold", data }: { id?: string; data: MarketHoldData }) {
  const M = COPY.marketHold;
  const big = data.parts.filter((p) => p.big);
  const others = data.parts.filter((p) => !p.big && !p.rest);
  const rest = data.parts.filter((p) => p.rest);
  const ordered = [...big.sort((a, b) => b.pct - a.pct), ...others.sort((a, b) => b.pct - a.pct), ...rest];
  const leader = big[0]?.key;
  const fill = (p: HoldPart) => (p.key === leader ? "var(--terra)" : p.big ? "var(--terra-border)" : p.rest ? "var(--c-soft2)" : "var(--c-line-strong)");
  const total = ordered.reduce((n, p) => n + p.pct, 0);
  const bigWidth = (data.bigShare / total) * 100;
  return (
    <Box id={id} className="flex flex-col">
      <Rail icon="competition" kicker={M.kicker} />
      <div className="mb-5">
        <div data-focal="1" className="fig text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]">{Math.round(data.bigShare)}%</div>
        <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{M.focalWords.replace("{market}", data.label).replace("{n}", String(data.bigCount))}</p>
      </div>
      <div className="[container-type:inline-size]">
        <div data-archetype="market-hold" data-visual="1" data-parts={String(ordered.length)}>
          {/* The bracket over the biggest chains, the figure's own length. */}
          <div aria-hidden className="relative mb-1 h-2">
            <span className="absolute inset-y-0 left-0 rounded-t-sm border-x-2 border-t-2 border-[var(--c-ink2)]" style={{ width: `${bigWidth}%` }} />
          </div>
          <div className="flex h-9 w-full gap-0.5 overflow-hidden rounded-lg" role="img" aria-label={ordered.map((p) => `${p.name} ${p.pct}%`).join(", ")}>
            {ordered.map((p) => (
              <span key={p.key} data-wedge={p.key} className="block h-full min-w-0.5 first:rounded-l-lg last:rounded-r-lg" style={{ width: `${((p.pct / total) * 100).toFixed(2)}%`, background: fill(p) }} />
            ))}
          </div>
          <div className="mt-3 grid gap-x-6 [@container(min-width:560px)]:grid-cols-2">
            {ordered.map((p) => (
              <div key={p.key} data-row={p.key} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 border-t border-[var(--c-border)] py-2">
                <span aria-hidden className="inline-block h-3 w-3 rounded-sm border border-[var(--c-border)]" style={{ background: fill(p) }} />
                <span data-label className="min-w-0 truncate text-[length:var(--t-body)] leading-tight text-[var(--c-ink)]">{p.name}</span>
                <Fig className="text-right text-[length:var(--t-body)] font-semibold leading-tight text-[var(--c-ink)]">{p.pct}%</Fig>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Box>
  );
}
