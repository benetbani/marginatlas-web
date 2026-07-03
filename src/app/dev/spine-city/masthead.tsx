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

/* confidence dots, neutral grey only (no green/tan/purple accents): darker = firmer.
 * The palette is terracotta + neutral grays; confidence is a texture read, never an accent. */
const DOT: Record<string, string> = { measured: "#8c8c8a", modeled: "#bdbdbd", placeholder: "#dcdcda" };

export function CityHero({ d }: { d: any }) {
  const cards: any[] = d.headline?.scorecard ?? [];
  return (
    <section className="overflow-hidden py-6 md:py-8">
      <a className="mb-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--c-border)] bg-white/70 px-3 py-1 text-xs font-semibold text-[var(--c-ink2)] transition hover:border-[var(--terra-border)] hover:text-[var(--terra-text)]">&#8592; All cities</a>
      <div className="flex items-center gap-3.5">
        <CountryFlag iso2="gb" className="w-[44px] rounded-sm shadow-sm" />
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-[var(--c-ink)] md:text-4xl">{d.meta?.city}</h1>
          <div className="text-[12px] text-[var(--c-muted)]">Opening a business in {d.meta?.country_name}</div>
        </div>
      </div>

      {/* decision scorecard , five business signals, small support figures */}
      <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--c-border)] sm:grid-cols-5" style={{ background: "var(--c-border)" }}>
        {cards.map((c) => (
          <div key={c.label} className="min-w-0 bg-[var(--c-card)] px-3 py-2.5">
            <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--c-muted)]">
              <span>{c.label}</span>
              <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: DOT[c.confidence] ?? DOT.modeled }} title={`Confidence: ${c.confidence}`} />
            </div>
            <div className="mt-1 text-[18px] leading-none text-[var(--c-ink)]"><Fig>{c.value}</Fig>{c.unit ? <span className="text-[11px] text-[var(--c-muted)]">{c.unit}</span> : null}</div>
            <div className="mt-1 text-[10.5px] leading-tight text-[var(--c-muted)]">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* provenance, stated once */}
      <div className="mt-4 flex items-center gap-1.5 text-[11px] text-[var(--c-muted)]">
        <span className="inline-block h-2 w-2 rounded-full" style={{ background: DOT.modeled }} />
        {d.meta?.provenance_line}
      </div>
    </section>
  );
}
