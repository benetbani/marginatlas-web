"use client";
/**
 * CityHero , the ANSWER-FIRST masthead (rulebook v1 §16). The identity (flag + name)
 * sits left; ONE dominant answer figure , the city's per-resident consumer spend ,
 * sits right, filling the band and dwarfing the support tiles (>=1.6x, §16). The old
 * four co-equal tiles are gone: the $196B metro total (a vague big total, twice
 * corrected, §7) and the borrowed-altitude 6/10 survival score (§16) were DELETED; the
 * two remaining tiles (cost to open, customer income) demote to a slim support strip.
 * Provenance is the one modeled mark, stated once. All strings from the seed.
 *
 * Null-guards (real-data promotion): the focal falls back to the first scorecard tile
 * when the seed carries no explicit `focal` (the live adapter supplies `scorecard`, not
 * `focal`), so the masthead always leads with one dominant figure and never a blank.
 */
import * as React from "react";
import { CountryFlag } from "@/components/CountryFlag";
import { Fig } from "@/components/spine/kit";
import { AtlasMark } from "@/components/spine/marks";

export function CityHero({ d }: { d: any }) {
  const scorecard: any[] = d.headline?.scorecard ?? [];
  // The one dominant answer: the seed's explicit focal, else the first available tile
  // promoted (real-data path carries no focal, only the scorecard).
  const focal = d.headline?.focal ?? scorecard[0] ?? null;
  const support: any[] = d.headline?.focal ? scorecard : scorecard.slice(1);
  const inPhrase = d.meta?.country_in_phrase ?? d.meta?.country_name;
  return (
    <section className="overflow-hidden py-6 md:py-8">
      <a className="mb-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--c-border)] bg-white/70 px-3 py-1 text-xs font-semibold text-[var(--c-ink2)] transition hover:border-[var(--terra-border)] hover:text-[var(--terra-text)]">&#8592; All cities</a>

      {/* identity LEFT, the one answer figure RIGHT , the band fills, nothing competes */}
      <div className="grid gap-5 md:grid-cols-[1.3fr_1fr] md:items-end">
        <div className="flex items-center gap-3.5">
          <CountryFlag iso2={d.meta?.iso2?.toLowerCase()} className="w-[44px] rounded-sm shadow-sm" />
          <div>
            <h1 data-typography="custom" className="text-balance text-3xl font-semibold tracking-tight text-[var(--c-ink)] md:text-4xl">{d.meta?.city}</h1>
            <div className="text-[length:var(--t-body)] text-[var(--c-muted)]">Opening a business in {inPhrase}</div>
          </div>
        </div>
        {focal ? (
          <div className="md:justify-self-end md:text-right">
            <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.08em] text-[var(--c-muted)]">{focal.label}</div>
            <div className="fig leading-none text-[var(--terra-text)] text-[30px] md:text-[48px]"><Fig>{focal.value}</Fig>{focal.unit ? <span className="text-[length:var(--t-lead)] text-[var(--c-muted)]">{focal.unit}</span> : null}</div>
            {focal.sub ? <div className="mt-1 text-[length:var(--t-body)] text-[var(--c-muted)]">{focal.sub}</div> : null}
          </div>
        ) : null}
      </div>

      {/* support strip , the smaller decision signals, clearly subordinate to the focal */}
      {support.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--c-border)] sm:grid-cols-2" style={{ background: "var(--c-border)" }}>
          {support.map((c) => (
            <div key={c.label} className="min-w-0 bg-[var(--c-card)] px-3 py-2.5">
              <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.06em] text-[var(--c-muted)]">{c.label}</div>
              <div className="mt-1 text-[length:var(--t-sub)] leading-none text-[var(--c-ink)]"><Fig>{c.value}</Fig>{c.unit ? <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{c.unit}</span> : null}</div>
              <div className="mt-1 text-[length:var(--t-micro)] leading-tight text-[var(--c-muted)]">{c.sub}</div>
            </div>
          ))}
        </div>
      ) : null}

      {/* provenance, stated once , the modeled mark beside the sentence covers every
          masthead figure (the focal included); no per-tile dots, no legend. */}
      <div className="mt-4 flex items-start gap-1.5 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">
        <AtlasMark id="modeled" size={14} className="mt-px shrink-0" />
        <span>{d.meta?.provenance_line}</span>
      </div>
    </section>
  );
}
