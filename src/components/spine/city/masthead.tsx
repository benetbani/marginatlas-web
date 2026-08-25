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
  /* THE HEADLINE FIGURE IS ONE THE QUICK READS DO NOT ALREADY CARRY.
     On the real-data path this page has no chosen focal, so it took the first
     scorecard tile, which on London is customer income. The six quick reads 650px
     below name customer income too, as a position among 252 cities. Two readings
     of one metric near the top of a page is the founder's "repeating the front
     part", measured at 82px and 760px.

     So the focal prefers a tile whose label is not among the quick reads, and
     falls back to the first tile when every one of them is. On London that
     promotes self-employment, which is a real, measured, differentiating fact
     about how entrepreneurial a place is: 14% here against 81% in Lagos. The
     income figure keeps its place in the support strip, where it does not compete
     with the read of it below. */
  const lensLabels = new Set(
    ((d.lenses?.scales ?? []) as any[]).map((x) => String(x?.label ?? "").trim().toLowerCase()),
  );
  const notDuplicated = scorecard.filter((t) => !lensLabels.has(String(t?.label ?? "").trim().toLowerCase()));
  const chosen = d.headline?.focal ?? notDuplicated[0] ?? scorecard[0] ?? null;
  const focal = chosen;
  const support: any[] = d.headline?.focal ? scorecard : scorecard.filter((t) => t !== chosen);
  const inPhrase = d.meta?.country_in_phrase ?? d.meta?.country_name;
  return (
    <section className="overflow-hidden py-6 md:py-8">
      <a className="mb-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--c-border)] bg-white/70 px-3 py-1 text-xs font-semibold text-[var(--c-ink2)] transition hover:border-[var(--c-line-strong)] hover:text-[var(--c-ink)]">&#8592; All cities</a>

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
            {/* TWO FAULTS IN ONE LINE, BOTH MEASURED.

                INK, NOT THE ACCENT. On the real-data path this page carries no
                explicit focal, so the headline figure is whatever happened to sit
                first in the scorecard: on London that is customer income. A figure
                chosen by list order was wearing the colour this site reserves for
                THE answer (§37), while the page's actual answer, the lightest rent
                load, sits in the card directly below it also in terracotta. Two
                answers, one page. The accent stays on the rent read.

                AND leading-none SET THE LINE BOX SHORTER THAN THE GLYPHS, so a
                48px figure rose into the label above it: measured 124x7px of
                overlap at 1440, 1280 and 768, and 77x5px at 375. A figure needs a
                line box at least as tall as itself. */}
            <div className="fig mt-1.5 leading-[1.2] text-[var(--c-ink)] text-[30px] md:text-[48px]"><Fig>{focal.value}</Fig>{focal.unit ? <span className="text-[length:var(--t-lead)] text-[var(--c-muted)]">{focal.unit}</span> : null}</div>
            {focal.sub ? <div className="mt-1 text-[length:var(--t-body)] text-[var(--c-muted)]">{focal.sub}</div> : null}
          </div>
        ) : null}
      </div>

      {/* support strip , the smaller decision signals, clearly subordinate to the focal */}
      {support.length > 0 ? (
        /* THE TRACK COUNT FOLLOWS THE CONTENT. Rulebook v2 §17.
           This was a fixed two-column grid whose own background is the hairline
           colour, so an unfilled cell does not read as space, it reads as a flat
           grey block. Counted across fifteen cities on 2026-08-24, THIRTEEN
           render and every one of them carries exactly ONE tile, so every city
           page has shown a hero strip that is half fact and half grey since the
           day it shipped, and it is the first thing on the page.
           One tile sizes to its content instead of stretching; two or more keep
           the pair; an odd count above two lets the last one span, so there is
           no arrangement left that can leave a cell empty. */
        <div
          className={`mt-5 grid gap-px overflow-hidden rounded-xl border border-[var(--c-border)]${support.length === 1 ? " w-fit" : ""}`}
          style={{ background: "var(--c-border)", gridTemplateColumns: `repeat(${Math.min(support.length, 2)}, minmax(0, 1fr))` }}
        >
          {support.map((c, i) => (
            <div
              key={c.label}
              className="min-w-0 bg-[var(--c-card)] px-3 py-2.5"
              style={support.length > 2 && support.length % 2 === 1 && i === support.length - 1 ? { gridColumn: "1 / -1" } : undefined}
            >
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
        {/* The provenance sentence carried no width at all and ran 99 characters a
            line, measured, which made it the widest text on this page. 56ch is the
            measure the spine stylesheet's own note class uses. Rulebook v2 §17. */}
        <span className="max-w-[56ch]">{d.meta?.provenance_line}</span>
      </div>
    </section>
  );
}
