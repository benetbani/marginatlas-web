"use client";
/**
 * CityHero , the answer-first masthead. A slim city band (flag + name + back link)
 * over a five-tile DECISION scorecard. The banned trivia (climate, cost-of-living
 * index) is gone; every tile is a business signal. The tiles are deliberately small
 * support figures , the dominant owner-keep figure lives in the WinnerCard directly
 * below, so the page has ONE loudest element. Provenance is stated once here, calm.
 * All strings from the seed.
 */
import * as React from "react";
import { CountryFlag } from "@/components/CountryFlag";
import { Fig } from "@/components/spine/kit";
import { AtlasMark } from "@/components/spine/marks";

export function CityHero({ d }: { d: any }) {
  const cards: any[] = d.headline?.scorecard ?? [];
  // The scorecard sizes to the number of REAL tiles (some omit on promotion), so it
  // never leaves an empty band. Full literal class strings keep Tailwind from purging.
  const colClass = ({ 1: "sm:grid-cols-2", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4", 5: "sm:grid-cols-5" } as Record<number, string>)[Math.min(cards.length, 5)] ?? "sm:grid-cols-5";
  return (
    <section className="overflow-hidden py-6 md:py-8">
      <a className="mb-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--c-border)] bg-white/70 px-3 py-1 text-xs font-semibold text-[var(--c-ink2)] transition hover:border-[var(--terra-border)] hover:text-[var(--terra-text)]">&#8592; All cities</a>
      <div className="flex items-center gap-3.5">
        <CountryFlag iso2={d.meta?.iso2?.toLowerCase()} className="w-[44px] rounded-sm shadow-sm" />
        <div>
          <h1 data-typography="custom" className="text-balance text-3xl font-bold tracking-tight text-[var(--c-ink)] md:text-4xl">{d.meta?.city}</h1>
          <div className="text-[12px] text-[var(--c-muted)]">Opening a business in {d.meta?.country_name}</div>
        </div>
      </div>

      {/* decision scorecard , five business signals, small support figures */}
      <div className={`mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--c-border)] ${colClass}`} style={{ background: "var(--c-border)" }}>
        {cards.map((c) => (
          // 5 tiles in the 2-col mobile grid leave a dead 6th cell: the last odd tile
          // spans both columns below sm (and returns to one column at sm:grid-cols-5).
          <div key={c.label} className="min-w-0 bg-[var(--c-card)] px-3 py-2.5 last:odd:col-span-2 sm:last:odd:col-span-1">
            <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--c-muted)]">{c.label}</div>
            <div className="mt-1 text-[18px] leading-none text-[var(--c-ink)]"><Fig>{c.value}</Fig>{c.unit ? <span className="text-[11px] text-[var(--c-muted)]">{c.unit}</span> : null}</div>
            <div className="mt-1 text-[10.5px] leading-tight text-[var(--c-muted)]">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* provenance, stated once , the exemplar's one-line treatment: the "modeled"
          mark beside the sentence, no per-tile dots, no legend. */}
      <div className="mt-4 flex items-start gap-1.5 text-[11px] leading-snug text-[var(--c-muted)]">
        <AtlasMark id="modeled" size={14} className="mt-px shrink-0" />
        <span>{d.meta?.provenance_line}</span>
      </div>
    </section>
  );
}
