"use client";
/**
 * StockTiers, THE KIT TO OPEN AT FOUR BUDGETS (2026-09-25; his message that night: "The cost to stock the business should be
 * multiple option one, cheap, medium, premium, luxury but with activity based specifics for example for barbers there should be
 * calculations based on 3 machines of different kinds or 3 chairs of different kinds that are popular in that country with
 * attached cost"). Page-agnostic: its data is keyed by country and trade (sections/stock_kit.ts), and he decides the seat.
 *
 * THE LAW, inside the component:
 *  - THE CARD'S ONE FIGURE is the span, cheapest budget to dearest, with the shop and the VAT in one line under it.
 *  - FROM 720px OF CARD, THE FOUR BUDGETS SIDE BY SIDE, a price table: each head the budget's name, its price mark (one to four
 *    dollar signs, the filled ones in ink), its total, and a bar of the total against the dearest budget (zero-based, in
 *    the accent's gradient). Under the heads, one row a piece of kit: its glyph, its name and its count, then each budget's named
 *    product under the line's cost, so a row reads across as one chair at four prices.
 *  - UNDER 720px, A SWITCH OF THE FOUR BUDGETS (the heads as buttons, the chosen one pressed) over the chosen budget's list:
 *    the same rows, one budget at a time, since four named products do not fit a phone's line.
 *  - Every figure is whole dollars with its thousands comma, in the columns and the heads alike (PART 5: one grammar a column).
 *  - `data-archetype="stock-tiers"`, `data-visual="1"`, `data-tiers`, `data-rows`; `data-row` and `data-label` on each row, so
 *    the model laws read the figures on their row's line.
 */
import * as React from "react";
import { Box, Fig, Ico, InlineDisclosure, Rail } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { StockKit, StockTierKey } from "@/lib/spine/sections/stock_kit";

const dollars = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`;
/* THE SWITCH SHOWS THE FIVE COSTLIEST PIECES AND KEEPS THE REST BEHIND THE PLUS (2026-09-25, the card's first seat): the
   barbershop's twelve lines stood 852px tall at three fifths of a trade page at 1280, beside a card of 400, a hole of 376 by 450
   (the page filter's WHITE SPACE). The five carry most of each budget's total; the plus is his (DetailPanel.tsx's header). */
const SHOWN = 5;
const MARKS: Record<StockTierKey, number> = { budget: 1, mid: 2, premium: 3, luxury: 4 };

/** The price mark: four dollar signs, the budget's count of them in ink, the rest faint (never the accent: ART-DIRECTION C2, the
 *  accent marks a card's answer, and four marks a head made ten accent texts in the card). */
function PriceMark({ tier }: { tier: StockTierKey }) {
  const n = MARKS[tier];
  return (
    <span aria-hidden data-price-mark className="text-[length:var(--t-micro)] font-semibold tracking-wide">
      {[1, 2, 3, 4].map((i) => (
        <span key={i} style={{ color: i <= n ? "var(--c-ink2)" : "var(--c-line-strong)" }}>$</span>
      ))}
    </span>
  );
}

/* ONE BAR IN THE ACCENT, THE BUDGET BEING READ (2026-09-25, seating the card on a trade page): four accent bars were four things
   claiming to be the answer (ART-DIRECTION C2, two a card at most), and a menu of budgets has no answer of its own. The table lights
   the mid-range, the budget the card opens on; the switch lights the budget pressed. The rest in the neutral gradient. */
function TotalBar({ value, high, lead }: { value: number; high: number; lead: boolean }) {
  const w = high > 0 ? Math.max(3, (value / high) * 100) : 0;
  return (
    <span aria-hidden className="relative mt-2 block h-1.5 rounded-full">
      <span className="absolute inset-0 rounded-full bg-[var(--c-soft2)]" />
      <span className="absolute inset-y-0 left-0 rounded-full" style={lead ? { width: `${w}%`, backgroundColor: "var(--terra)", backgroundImage: "linear-gradient(90deg, var(--terra-border), var(--terra))" } : { width: `${w}%`, backgroundColor: "var(--c-line-strong)", backgroundImage: "linear-gradient(90deg, var(--c-border), var(--c-line-strong))" }} />
    </span>
  );
}

export function StockTiers({ id = "stock", kit, initial = "mid" }: { id?: string; kit: StockKit; initial?: StockTierKey }) {
  const S = COPY.stock;
  const [pick, setPick] = React.useState<StockTierKey>(initial);
  const chosen = kit.tiers.find((t) => t.key === pick) ?? kit.tiers[0];
  const rows = kit.tiers[0].lines;
  return (
    <Box id={id} className="flex flex-col">
      <Rail icon="startup-cost" kicker={S.kicker} />
      <div className="mb-5">
        <div data-focal="1" className="fig text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]">
          {dollars(kit.low)} <span className="text-[var(--c-muted)]">{S.spanJoin}</span> {dollars(kit.high)}
        </div>
        <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{S.spanWords.replace("{shop}", kit.shop)}</p>
      </div>
      <div className="[container-type:inline-size]">
        <div data-archetype="stock-tiers" data-visual="1" data-tiers={String(kit.tiers.length)} data-rows={String(rows.length)}>
          {/* THE TABLE, from 720px of card. */}
          <div data-form="table" className="hidden [@container(min-width:720px)]:grid grid-cols-[minmax(0,1.15fr)_repeat(4,minmax(0,1fr))] gap-x-4">
            <span aria-hidden />
            {kit.tiers.map((t) => (
              <div key={t.key} data-tier={t.key} className="pb-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-ink2)]">{t.label}</span>
                  <PriceMark tier={t.key} />
                </div>
                <Fig className="mt-1 block text-[length:var(--t-lead)] font-semibold leading-none text-[var(--c-ink)]">{dollars(t.usd)}</Fig>
                <TotalBar value={t.usd} high={kit.high} lead={t.key === initial} />
              </div>
            ))}
            {rows.map((r, ri) => (
              <div key={r.cat} data-row={r.cat} className="col-span-full grid grid-cols-subgrid items-start border-t border-[var(--c-border)] py-2">
                <span className="flex min-w-0 items-center gap-3">
                  <Ico id={r.icon} tone="terra" />
                  <span className="min-w-0">
                    <span data-label className="block truncate text-[length:var(--t-body)] leading-tight text-[var(--c-ink)]">{r.label}</span>
                    <span className="block text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">&times;{r.qty}</span>
                  </span>
                </span>
                {kit.tiers.map((t) => {
                  const l = t.lines[ri];
                  return (
                    <span key={t.key} className="min-w-0">
                      <Fig className="block text-[length:var(--t-body)] font-semibold leading-tight text-[var(--c-ink)]">{dollars(l.usd)}</Fig>
                      <span className="block truncate text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]" title={l.name}>{l.name}</span>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
          {/* THE SWITCH, under 720px of card: the four heads as buttons over the chosen budget's list. */}
          <div data-form="switch" className="[@container(min-width:720px)]:hidden">
            <div role="group" aria-label={S.pick} className="grid grid-cols-2 gap-2 [@container(min-width:420px)]:grid-cols-4">
              {kit.tiers.map((t) => {
                const on = t.key === chosen.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setPick(t.key)}
                    className={`rounded-lg border px-3 py-2 text-left transition-colors ${on ? "border-[var(--c-ink2)] bg-[var(--c-soft)]" : "border-[var(--c-border)] hover:border-[var(--c-ink2)]"}`}
                  >
                    <span className="flex items-baseline gap-2">
                      <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-ink2)]">{t.label}</span>
                      <PriceMark tier={t.key} />
                    </span>
                    <Fig className="mt-1 block text-[length:var(--t-body)] font-semibold leading-none text-[var(--c-ink)]">{dollars(t.usd)}</Fig>
                    <TotalBar value={t.usd} high={kit.high} lead={on} />
                  </button>
                );
              })}
            </div>
            {(() => {
              const byCost = [...chosen.lines].sort((a, b) => b.usd - a.usd);
              /* `max-w-none`: a list item carries the prose measure site-wide (BarList's rows say the same), and the prices stood 45px
                 short of the card's right edge. */
              const row = (l: (typeof byCost)[number]) => (
                <li key={l.cat} data-row={l.cat} className="grid max-w-none grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 border-t border-[var(--c-border)] py-2 first:border-t-0">
                  <Ico id={l.icon} tone="terra" />
                  <span className="min-w-0">
                    <span data-label className="block text-[length:var(--t-body)] leading-tight text-[var(--c-ink)]">{l.label} <span className="text-[var(--c-muted)]">&times;{l.qty}</span></span>
                    <span className="block truncate text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{l.name}</span>
                  </span>
                  <Fig className="text-right text-[length:var(--t-body)] font-semibold leading-tight text-[var(--c-ink)]">{dollars(l.usd)}</Fig>
                </li>
              );
              return (
                <>
                  <ol className="m-0 mt-3 list-none p-0">{byCost.slice(0, SHOWN).map(row)}</ol>
                  {byCost.length > SHOWN ? (
                    <InlineDisclosure name={`${id}-more`} summary={S.more.replace("{n}", String(byCost.length - SHOWN))} className="group mt-1 border-t border-[var(--c-border)] [&>summary]:py-2.5">
                      <ol className="m-0 list-none p-0">{byCost.slice(SHOWN).map(row)}</ol>
                    </InlineDisclosure>
                  ) : null}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </Box>
  );
}
