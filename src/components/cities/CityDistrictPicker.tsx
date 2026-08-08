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

  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-medium tracking-tight text-ink-900 md:text-3xl">
        {cityName} district by district
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cocoa-700/90">
        What the same trade earns in each part of the city, against the city
        baseline. Pick a district.
      </p>

      {/* The picker. A wrapping row of names rather than a dropdown: the whole
          set is the interesting part, and a dropdown hides it behind a click. */}
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
                  ? "rounded-full border border-atlas-500 bg-atlas-500 px-3.5 py-1.5 text-sm font-medium text-cream-50"
                  : "rounded-full border border-parchment bg-white px-3.5 py-1.5 text-sm text-cocoa-700 transition-colors hover:border-atlas-300 hover:text-ink-900"
              }
            >
              {d.name}
            </button>
          );
        })}
      </div>

      {/* The open district. */}
      <div className="mt-5 rounded-2xl border border-parchment bg-white p-5 md:p-6">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <h3 className="font-display text-xl font-medium tracking-tight text-ink-900 md:text-2xl">
            {open.name}
          </h3>
          <span className="rounded-full border border-parchment bg-cream-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cocoa-700/60">
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
    </section>
  );
}
