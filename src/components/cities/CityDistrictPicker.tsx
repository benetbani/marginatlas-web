"use client";

/**
 * CityDistrictPicker , every district of a city in one section, one open at a
 * time, the first open on arrival.
 *
 * WHY THIS EXISTS. Until 2026-08-08 a city's districts were spread across
 * 25,320 URLs of the shape /[country]/[city]/[district]/[trade]. Measured on
 * production, three trades in the same district shared 95% of their body text:
 * a district page is the city figure times a character score, so the number
 * moved and the page did not. Those URLs are now noindexed and out of the
 * sitemap, and this is where the content lands instead, on the founder's
 * instruction: "a big section for each city where the neighborhoods can just be
 * clicked, and the first one will be already selected".
 *
 * A CLIENT COMPONENT THAT FETCHES NOTHING. Every district's figures are
 * computed on the server and handed down as plain data. Selecting a district is
 * a local state change with no request, so the whole section is interactive on
 * a page that is otherwise static, and a reader with a slow connection still
 * gets all of it in the first response.
 *
 * The list is not truncated. The city page already features four districts as
 * cards above; this is the complete set, which is the half the separate pages
 * were carrying.
 */
import * as React from "react";
import Link from "next/link";
import { BeatCard } from "@/components/kit/editorial";

export type DistrictSummary = {
  slug: string;
  name: string;
  /** "financial-cbd" etc, rendered with the dashes removed. */
  character: string;
  /** One paragraph. Falls back to the scheme description, then to nothing. */
  blurb: string | null;
  /** Revenue against the city baseline, already rounded, as a percentage. */
  pct: number;
  /** True when the model's clip bit, so `pct` is a floor rather than a reading. */
  clipped: boolean;
  commuter: number;
  tourism: number;
  tags: number;
  /** Human tag labels, already resolved and filtered. */
  tagLabels: string[];
  /** Deep link to the district's own page. */
  href: string;
};

export function CityDistrictPicker({
  cityName,
  districts,
}: {
  cityName: string;
  districts: DistrictSummary[];
}) {
  const [openSlug, setOpenSlug] = React.useState(districts[0]?.slug ?? "");
  if (districts.length === 0) return null;
  const open = districts.find((d) => d.slug === openSlug) ?? districts[0];

  /* ONE card, the site's canonical one, and the kit's own section grammar.
     Was: a bare <h2> and lede sitting straight on the page, then a hand-rolled
     `rounded-2xl border border-parchment bg-white` panel. Three faults in that,
     all of them the founder's:
       1. AtlasFrame paints a fixed photograph behind every page with no centre
          plate, so the heading and the lede were dark text on a picture, and
          the panel was an opaque hole punched through it. Legibility is a
          property of the CARD ("we put everything in those cards"), which is
          what BeatCard carries: .atlas-card, translucent at .955, and
          position:relative so it sits above the fixed frame layers instead of
          sinking behind them.
       2. Every other section on the city page IS a BeatCard. This one rolled
          its own surface, its own eyebrow-less header and its own type step
          (text-2xl md:text-3xl), a full step LOUDER than the ten siblings it
          sits between. Same component now, so the same card, the same eyebrow
          and the same heading size.
       3. The open district was a second opaque plate stacked on the first. It
          is now a hairline division inside the one card, which is the idiom
          this page already uses for the score band in the hero and the income
          spread under the customer beat. */
  return (
    <BeatCard eyebrow="Districts" heading={`${cityName} district by district`}>
      <p className="max-w-2xl text-sm leading-relaxed text-cocoa-700 md:text-base">
        What the same trade earns in each part of the city, against the city
        baseline. Pick a district.
      </p>

      {/* The picker. A wrapping row of names rather than a dropdown: the whole
          set is the interesting part, and a dropdown hides it behind a click.
          No fill on the resting chip: the card underneath is already the
          surface, so a white pill on a white card only adds a third level. */}
      <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label={`Districts of ${cityName}`}>
        {districts.map((d) => {
          const on = d.slug === open.slug;
          return (
            <button
              key={d.slug}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setOpenSlug(d.slug)}
              className={
                on
                  ? "rounded-full border border-atlas-500 bg-atlas-500 px-3.5 py-1.5 text-sm font-medium text-white"
                  : "rounded-full border border-parchment px-3.5 py-1.5 text-sm text-cocoa-700 transition-colors hover:border-atlas-300 hover:text-ink-900"
              }
            >
              {d.name}
            </button>
          );
        })}
      </div>

      {/* The open district, divided by a hairline rather than by a second plate. */}
      <div className="mt-5 border-t border-parchment pt-5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink-900">
            {open.name}
          </h3>
          <span className="rounded-full border border-parchment px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cocoa-700">
            {open.character.replace(/-/g, " ")}
          </span>
          {open.tagLabels.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full border border-atlas-200 bg-atlas-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-atlas-700"
            >
              {t}
            </span>
          ))}
        </div>

        {open.blurb ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cocoa-700/90">
            {open.blurb}
          </p>
        ) : null}

        {/* The one figure that carries the section, and the three that build it.
            "at least" when the model's clip bit: a value sitting on a bound is
            the bound, not a reading, and five districts sit on ours. */}
        <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-4">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-cocoa-500">
              Restaurant revenue against the city
            </div>
            <div className="mt-1 font-display text-3xl font-medium tracking-tight text-atlas-700">
              {open.clipped ? "at least " : ""}
              {open.pct > 0 ? "+" : ""}
              {open.pct}%
            </div>
          </div>
          <dl className="flex gap-6 text-sm text-cocoa-700">
            {[
              ["Commuters", open.commuter],
              ["Visitors", open.tourism],
              ["Character", open.tags],
            ].map(([label, v]) => (
              <div key={String(label)}>
                <dt className="text-[11px] uppercase tracking-wide text-cocoa-500">{label}</dt>
                <dd className="mt-1 tabular-nums text-ink-900">{Number(v).toFixed(2)}x</dd>
              </div>
            ))}
          </dl>
        </div>

        <Link
          href={open.href}
          className="mt-5 inline-block text-sm font-medium text-atlas-700 underline-offset-4 hover:underline"
        >
          Everything in {open.name}
        </Link>
      </div>
    </BeatCard>
  );
}
