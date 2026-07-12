"use client";
/**
 * Masthead , the answer-first hero. The single most valuable number on the page,
 * what a typical owner KEEPS, is the dominant figure (focal .fig, counts up on
 * mount, top 20%). Net margin + break-in read as support beside it. The revenue
 * spread renders as a labeled p10/p50/p90 SpreadStrip BELOW the scorecard, neutral
 * (support, ink marker). Provenance is stated ONCE here as a calm line, not
 * per-card pills. terracotta: the take-home hero figure is the hero's ONLY accent.
 * The market-density count (n_firms, "how many already trade here") lives as the
 * scorecard's third tile (founder D7 + rulebook v1 section 17: the old half-width
 * HonestTake card was a lone figure swimming in white space, folded in here).
 */
import * as React from "react";
import { Fig, InfoTip, SpreadStrip, usd } from "@/components/spine/kit";
import { AtlasMark } from "@/components/spine/marks";
import { useCountUp } from "./format-picker";

const money = usd; // ONE money grammar page-set-wide (kit usd: $43K / $1.4M)

export function Masthead({ d }: { d: any }) {
  const h = d.headline ?? {};
  const breakWord = h.break_in_0_100 >= 45 ? "Manageable" : h.break_in_0_100 >= 30 ? "Demanding" : "Brutal";
  const hasFirms = typeof h.n_firms === "number" && Number.isFinite(h.n_firms);
  const take = d.owner?.take_home_usd ?? 0;
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => { setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  const t = useCountUp(take, reduced, 620);

  return (
    <section className="overflow-hidden py-6 md:py-8">
      <div className="rounded-[14px] border border-[var(--c-border)] bg-[var(--c-card)] p-5 md:p-6">
        {/* crumb , real wayfinding: each segment carries its altitude mark, kept quiet (muted ink) */}
        {/* allow-eyebrow: a trade/city/country wayfinding crumb, not a restated title; panel-approved (cell-00 passed) */}
        <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--c-ink2)]">
          <span className="inline-flex items-center gap-1.5"><AtlasMark id="alt-business" size={13} className="opacity-55" />{d.meta?.trade}</span>
          <span aria-hidden>&middot;</span>
          <span className="inline-flex items-center gap-1.5"><AtlasMark id="alt-city" size={13} className="opacity-55" />{d.meta?.city}</span>
          <span aria-hidden>&middot;</span>
          <span className="inline-flex items-center gap-1.5"><AtlasMark id="alt-country" size={13} className="opacity-55" />{d.meta?.country_name}</span>
        </div>
        {/* rulebook v1 section 35: H1 is font-semibold, never bold (bold display reads cheap) */}
        <h1 data-typography="custom" className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-[var(--c-ink)] md:text-[2.6rem]">{h.answer}</h1>

        {/* the hero scorecard: owner-keeps dominant, the other two as support */}
        <div className="mt-6 grid gap-5 md:grid-cols-[1.5fr_1fr] md:items-end">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">A typical owner keeps</div>
            <div className="fig leading-none text-[var(--terra-text)]" style={{ fontSize: "clamp(2.6rem, 7vw, 3.6rem)" }}>{money(reduced ? take : t)}</div>
            <div className="mt-1 text-[12.5px] text-[var(--c-ink2)]">a year, after every cost is paid.</div>
          </div>
          <div className={`grid ${hasFirms ? "grid-cols-3" : "grid-cols-2"} gap-px overflow-hidden rounded-xl border border-[var(--c-border)]`} style={{ background: "var(--c-border)" }}>
            <div className="bg-[var(--c-card)] px-3.5 py-3">
              <Fig className="text-[20px] text-[var(--c-ink)]">{d.margins?.net_pct}%</Fig>
              <div className="text-[9.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">net margin<InfoTip gloss="Profit as a share of sales, after every cost." /></div>
            </div>
            <div className="bg-[var(--c-card)] px-3.5 py-3">
              <Fig className="text-[20px] text-[var(--c-ink)]">{breakWord}</Fig>
              <div className="text-[9.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">to break in</div>
            </div>
            {hasFirms ? (
              <div className="bg-[var(--c-card)] px-3.5 py-3">
                <Fig className="text-[20px] text-[var(--c-ink)]">{h.n_firms.toLocaleString()}</Fig>
                <div className="text-[9.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">already trade here</div>
              </div>
            ) : null}
          </div>
        </div>

        {/* the turnover spread , SUPPORT below the scorecard (neutral ink marker), so the
            $43K take-home stays the hero's only terracotta */}
        {h.rev_p10_usd && h.rev_p50_usd && h.rev_p90_usd ? (
          <div className="mt-5 max-w-md">
            <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Yearly turnover, comparable rooms</div>
            <SpreadStrip p10={h.rev_p10_usd} p50={h.rev_p50_usd} p90={h.rev_p90_usd} fmt={money} neutral />
          </div>
        ) : null}

        {/* provenance, stated once , a quiet footnote, not a body element (no brown dot,
            no per-card confidence legend). The seed line carries no dot sentence anymore. */}
        <div className="mt-4 text-[10.5px] leading-snug text-[var(--c-muted)]">
          {d.meta?.provenance_line}
        </div>
      </div>
    </section>
  );
}
