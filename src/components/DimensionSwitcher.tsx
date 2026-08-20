"use client";

/**
 * DimensionSwitcher — sticky in-page bar that lets the user pivot the
 * current cell across regions, industries, size bands, and years without
 * navigating back to the home page.
 *
 * The component is purely client-side; it owns no data, only the user's
 * selection. On change it either:
 *   - navigates to a new URL (region / industry switches)
 *   - or appends a query string (size / year — same cell, narrower slice)
 */

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { Segmented } from "@/components/kit/controls/Segmented";

type Region = { name: string; slug: string };
type IndustryOpt = { id: string; name: string; slug: string };

export type DimensionSwitcherProps = {
  country: string;
  geoSlug: string;
  industrySlug: string;
  industryName: string;
  geoName: string;
  regions: Region[];
  industries: IndustryOpt[];
  /** The trade's sub-niche group (parent first), for the "Type" select. Empty
   *  when the trade has no sub-types. Each is a real cell slug. */
  subTypes?: IndustryOpt[];
  /** The slug currently selected in the type group (the URL's trade). */
  currentTypeSlug?: string;
  sizeBands: string[];
  years: number[];
  currentSize: string | null;
  currentYear: number | null;
};

// Shared select chrome (2026-06-13): warm tokens (parchment border, ink-500
// chevron), the SaaS surface. One constant so every control matches.
const SELECT_CLASS =
  "appearance-none bg-white border border-parchment hover:border-atlas-400 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium text-ink-900 focus:outline-none focus:ring-2 focus:ring-atlas-500/30 transition cursor-pointer bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22 fill=%22none%22><path d=%22M3 5l3 3 3-3%22 stroke=%22%237d6c58%22 stroke-width=%221.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-no-repeat bg-[length:12px] bg-[right_0.625rem_center]";

export function DimensionSwitcher({
  country,
  geoSlug,
  industrySlug,
  industryName,
  geoName,
  regions,
  industries,
  subTypes = [],
  currentTypeSlug,
  sizeBands,
  years,
  currentSize,
  currentYear,
}: DimensionSwitcherProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [size, setSize] = useState<string>(currentSize || "");
  const [year, setYear] = useState<string>(currentYear ? String(currentYear) : "");

  function navigate(toGeo: string, toIndustry: string, nextSize?: string, nextYear?: string) {
    const qs = new URLSearchParams();
    const s = nextSize ?? size;
    const y = nextYear ?? year;
    if (s) qs.set("size", s);
    if (y) qs.set("year", y);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    startTransition(() => {
      router.push(`/${country}/${toGeo}/${toIndustry}${suffix}`);
    });
  }

  /* THE OFFSET IS THE HEADER'S OWN VARIABLE, NOT A NUMBER.

       This bar parked at `top-[57px]` under a masthead that measures 89px, so
       32px of it, its entire first row, sat underneath the header and was
       sliced off. Photographed at 1440x900 on /gb/london/restaurants: the word
       SHOWING and the industry field were cut through the middle at every
       scroll position past the hero. The masthead is z-10 and this bar is z-5,
       so the header wins and there is nothing to see.

       57 was never a measurement of anything current. `--atlas-header-h` is
       declared on <html> in the root layout as 80px, 88px from md up, and the
       cell page's own CellPageNav already sticks to
       `top-[var(--atlas-header-h)]`. Two sticky bars on one page disagreeing
       about where the header ends is the cohesion defect underneath the visual
       one, so this now reads the same variable.

       The full-bleed `-mx-6` also goes, and the hand-rolled ground with it. It
       pushed this bar 24px past the content column on both sides, so it was the
       one block on the page with a different left edge (152 against every
       card's 176 at 1440), and the opaque `bg-white` punched a hole through the
       fixed photograph where every card beside it is the .955 card surface.
       `.atlas-card` is the site's one card rule and carries all of it: the
       translucent surface, the hairline, the radius and the elevation. The
       TWO THINGS THE 375 SHOT ADDED, both invisible at 1440.

       It must be OPAQUE. `.atlas-card` is the .955 surface, which is right for
       a card sitting still over the photograph and wrong for a bar that
       content scrolls underneath: at 375 the masthead's own H1 and lede read
       straight through it, "normal year" and "the dining room" legible through
       the filter fields. 4.3% is nothing over a photograph and plenty over
       high-contrast black type. So the class supplies the hairline, radius and
       elevation and `bg-white` overrides the surface, which is the same call
       the bar made before this commit and the only part of it that was right.

       It must not be STICKY on a phone. The bar wraps to four rows at 375 and
       measures 224px, so pinned it holds a quarter of an 812px viewport for the
       whole page. It sticks from md up, where there is room for it, and simply
       sits in the flow below that. */
  return (
    <div className="atlas-card bg-white md:sticky md:top-[var(--atlas-header-h)] z-[5] px-4 py-3 mb-6">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-xs uppercase tracking-wide text-ink-700/60 font-medium">
          Showing
        </span>

        {/* Industry */}
        <label className="flex items-center gap-2">
          <span className="sr-only">Industry</span>
          <select
            aria-label="Industry"
            value={industrySlug}
            disabled={pending}
            onChange={(e) => navigate(geoSlug, e.target.value)}
            className={SELECT_CLASS}
          >
            <option value={industrySlug}>{industryName}</option>
            {industries
              .filter((i) => i.slug !== industrySlug)
              .map((i) => (
                <option key={i.id} value={i.slug}>
                  {i.name}
                </option>
              ))}
          </select>
        </label>

        {/* Type: the sub-niches of this trade (e.g. restaurants -> pizzeria,
            food truck). Each option is a real cell slug; only shown when the
            trade has a sub-type group. */}
        {/* A SEGMENTED CONTROL WHEN THE GROUP IS SMALL, THE SELECT WHEN IT IS NOT.
            Founder, 2026-08-20, pointing at a Today/Week/Month switch: "for the
            business category, for example restaurants, we can have switches based
            on different restaurant categories. Only the switch part."

            THE THRESHOLD IS MEASURED, NOT COPIED FROM THE REFERENCE. Counted over
            the real taxonomy: 35 trade groups have sub-types, and the option count
            (parent plus children) runs from 2 to 13. **25 groups fit in five
            options or fewer; 10 do not**, and a thirteen-option segmented control
            is a worse select. So the switch appears where it reads as a switch and
            the list stays a list everywhere else.

            NOT `SubTypeSwitcher`, though it exists, wraps `Segmented`, and was
            built for exactly this job. It writes the choice to a QUERY PARAM and
            expects the page to re-derive around it. This site gives every sub-type
            its OWN URL, and "no URL slug renames, SEO equity rides on existing
            URLs" is a hard constraint. Mounting it as designed would collapse N
            indexed cell pages into one param-driven page, which is a regression
            wearing the right control. `Segmented` is the part worth having, so it
            is used directly and navigation is left alone. */}
        {subTypes.length > 1 && subTypes.length <= 5 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-700/60">Type</span>
            <Segmented
              ariaLabel="Type"
              size="sm"
              value={currentTypeSlug ?? industrySlug}
              onChange={(next) => navigate(geoSlug, next)}
              options={subTypes.map((t, i) => ({
                value: t.slug,
                label: i === 0 ? `${t.name} (all)` : t.name,
                disabled: pending,
              }))}
            />
          </div>
        )}
        {subTypes.length > 5 && (
          <label className="flex items-center gap-2">
            <span className="text-xs text-ink-700/60">Type</span>
            <select
              aria-label="Type"
              value={currentTypeSlug ?? industrySlug}
              disabled={pending}
              onChange={(e) => navigate(geoSlug, e.target.value)}
              className={SELECT_CLASS}
            >
              {subTypes.map((t, i) => (
                <option key={t.id} value={t.slug}>
                  {i === 0 ? `${t.name} (all)` : t.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <span className="text-ink-700/40">in</span>

        {/* Region */}
        <label className="flex items-center gap-2">
          <span className="sr-only">Region</span>
          <select
            aria-label="Region"
            value={geoSlug}
            disabled={pending}
            onChange={(e) => navigate(e.target.value, industrySlug)}
            className={SELECT_CLASS}
          >
            <option value={geoSlug}>{geoName}</option>
            {regions
              .filter((r) => r.slug !== geoSlug)
              .map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.name}
                </option>
              ))}
          </select>
        </label>

        {/* Size band */}
        {sizeBands.length > 0 && (
          <>
            <span className="text-ink-700/40 hidden md:inline">·</span>
            <label className="flex items-center gap-2">
              <span className="text-xs text-ink-700/60">Size</span>
              <select
                aria-label="Size band"
                value={size}
                disabled={pending}
                onChange={(e) => {
                  setSize(e.target.value);
                  navigate(geoSlug, industrySlug, e.target.value);
                }}
                className={SELECT_CLASS}
              >
                <option value="">All sizes</option>
                {sizeBands.map((b) => (
                  <option key={b} value={b}>
                    {prettySizeBand(b)}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        {/* Plan v13 Wave 1: year selector removed. The page always
           shows the most recent vintage; users never pick a year. */}

        {pending && (
          <span className="text-xs text-ink-700/60 ml-auto animate-pulse">
            Loading…
          </span>
        )}
      </div>
    </div>
  );
}

/** Friendly label for a size band. */
function prettySizeBand(b: string): string {
  // Common US Census SUSB bands and similar
  const map: Record<string, string> = {
    "0-4": "1–4 employees",
    "1-4": "1–4 employees",
    "5-9": "5–9 employees",
    "10-19": "10–19 employees",
    "20-49": "20–49 employees",
    "50-99": "50–99 employees",
    "100-249": "100–249 employees",
    "250-499": "250–499 employees",
    "500-999": "500–999 employees",
    "1000+": "1,000+ employees",
    all: "All sizes",
    total: "All sizes",
  };
  const lower = b.toLowerCase().trim();
  if (map[lower]) return map[lower];
  // Generic fallback: "0-9" → "1–9 employees"
  if (/^\d+-\d+$/.test(lower)) return `${lower.replace("-", "–")} employees`;
  if (/^\d+\+$/.test(lower)) return `${lower} employees`;
  return b;
}
