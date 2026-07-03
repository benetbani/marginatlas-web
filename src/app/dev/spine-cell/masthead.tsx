"use client";
/**
 * Masthead , the answer-first hero. The single most valuable number on the page,
 * what a typical owner KEEPS, is the dominant figure (focal .fig, counts up on
 * mount, top 20%). Net margin + break-in read as support beside it. The revenue
 * spread is demoted to a one-line support note under the headline (was the wide
 * left column). Provenance is stated ONCE here as a calm line, not per-card pills.
 * terracotta target: the take-home hero figure only.
 */
import * as React from "react";
import { Fig } from "@/components/spine/kit";
import { useCountUp } from "./format-picker";

const money = (v: number) => (v >= 1e6 ? "$" + (v / 1e6).toFixed(1) + "M" : "$" + Math.round(v / 1000) + "K");

export function Masthead({ d }: { d: any }) {
  const h = d.headline ?? {};
  const breakWord = h.break_in_0_100 >= 45 ? "Manageable" : h.break_in_0_100 >= 30 ? "Demanding" : "Brutal";
  const take = d.owner?.take_home_usd ?? 0;
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => { setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  const t = useCountUp(take, reduced, 620);

  return (
    <section className="overflow-hidden py-6 md:py-8">
      <div className="rounded-[14px] border border-[var(--c-border)] bg-[var(--c-card)] p-5 md:p-6">
        <div className="mb-1.5 flex flex-wrap items-center gap-x-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--c-ink2)]">
          {d.meta?.trade} &middot; {d.meta?.city} &middot; {d.meta?.country_name}
        </div>
        <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[var(--c-ink)] md:text-[2.6rem]">{h.answer}</h1>
        <p className="mt-2 max-w-2xl text-[13px] text-[var(--c-ink2)]">{h.spread_line}</p>

        {/* the hero scorecard: owner-keeps dominant, the other two as support */}
        <div className="mt-6 grid gap-5 md:grid-cols-[1.5fr_1fr] md:items-end">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">A typical owner keeps</div>
            <div className="fig leading-none text-[var(--terra-text)]" style={{ fontSize: "clamp(2.6rem, 7vw, 3.6rem)" }}>{money(reduced ? take : t)}</div>
            <div className="mt-1 text-[12.5px] text-[var(--c-ink2)]">a year, after every cost is paid.</div>
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--c-border)]" style={{ background: "var(--c-border)" }}>
            <div className="bg-[var(--c-card)] px-3.5 py-3">
              <Fig className="text-[20px] text-[var(--c-ink)]">{d.margins?.net_pct}%</Fig>
              <div className="text-[9.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">net margin</div>
            </div>
            <div className="bg-[var(--c-card)] px-3.5 py-3">
              <Fig className="text-[20px] text-[var(--c-ink)]">{breakWord}</Fig>
              <div className="text-[9.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">to break in</div>
            </div>
          </div>
        </div>

        {/* provenance, stated once , a quiet footnote, not a body element (no brown dot,
            no per-card confidence legend). The seed's trailing "confidence dot" sentence
            is dropped here since the dots are gone. */}
        <div className="mt-4 text-[10.5px] leading-snug text-[var(--c-muted)]">
          {String(d.meta?.provenance_line ?? "").replace(/\s*Each number carries a confidence dot\.?/i, "").trim()}
        </div>
      </div>
    </section>
  );
}
