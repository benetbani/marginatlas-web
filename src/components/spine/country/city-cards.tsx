"use client";
/**
 * The city card pager , what REPLACED the map (founder verdict 2026-08-30,
 * verbatim: "avoid the functionality of the map... remove the map altogether
 * and just replace everything with the cards. The standard row should have
 * five cities maximum, and if there are more, the person can click left or
 * right. And an option so the person sees the full list of cities, which
 * redirects him to the terminal.").
 *
 * Five cards per page. Paging is a CLICK on the arrow buttons, never a swipe:
 * law M says nothing scrolls sideways, at any width, so the grid WRAPS on a
 * phone (auto-fill at a readable minimum) instead of sliding. The arrows only
 * exist when there is a second page; a control that can do nothing teaches a
 * reader to stop pressing controls, the same lesson as the dead city cards
 * this section already paid for (verdict 6). Every card IS its anchor; a city
 * without a page never reaches this component (the adapter withholds the
 * href, and the body filters unlinked rows before the seed gets here).
 *
 * Hover is ink, never the accent (rule 37).
 */
import * as React from "react";

export type CityCardRow = { id: string; name: string; region?: string; href: string };

const PER_PAGE = 5;

export function CityCardsPager({ cities, allHref }: { cities: CityCardRow[]; allHref: string }) {
  const [page, setPage] = React.useState(0);
  const pages = Math.max(1, Math.ceil(cities.length / PER_PAGE));
  const cur = Math.min(page, pages - 1);
  const slice = cities.slice(cur * PER_PAGE, cur * PER_PAGE + PER_PAGE);

  return (
    <div>
      {pages > 1 ? (
        <div className="mb-2 flex items-center justify-end gap-1.5">
          <span className="mr-1 text-[length:var(--t-micro)] text-[var(--c-muted)]">
            {cur + 1} of {pages}
          </span>
          <button
            type="button"
            aria-label="Previous cities"
            disabled={cur === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-[14px] border border-[var(--c-border)] text-[var(--c-ink2)] transition-colors hover:border-[var(--c-ink2)] hover:text-[var(--c-ink)] disabled:cursor-default disabled:opacity-35 disabled:hover:border-[var(--c-border)] disabled:hover:text-[var(--c-ink2)]"
          >
            <span aria-hidden>&#8592;</span>
          </button>
          <button
            type="button"
            aria-label="More cities"
            disabled={cur >= pages - 1}
            onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-[14px] border border-[var(--c-border)] text-[var(--c-ink2)] transition-colors hover:border-[var(--c-ink2)] hover:text-[var(--c-ink)] disabled:cursor-default disabled:opacity-35 disabled:hover:border-[var(--c-border)] disabled:hover:text-[var(--c-ink2)]"
          >
            <span aria-hidden>&#8594;</span>
          </button>
        </div>
      ) : null}
      {/* TWO PER ROW on phones (founder, 2026-08-30 second batch: "on phones
          we should have two cities in a row instead of one"); from md up the
          row is auto-fill at a readable minimum, five across at 1280. */}
      <div className="grid grid-cols-2 gap-2 md:[grid-template-columns:repeat(auto-fill,minmax(9.5rem,1fr))]">
        {slice.map((c) => (
          <a
            key={c.id}
            href={c.href}
            className="group flex items-center justify-between gap-2 rounded-[14px] border border-[var(--c-border)] px-3.5 py-3 transition-colors hover:border-[var(--c-ink2)]"
          >
            <span className="min-w-0">
              <span className="block truncate text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{c.name}</span>
              {c.region ? (
                <span className="block truncate text-[length:var(--t-micro)] text-[var(--c-muted)]">{c.region}</span>
              ) : null}
            </span>
            <span aria-hidden className="shrink-0 text-[length:var(--t-body)] text-[var(--c-muted)] transition-transform group-hover:translate-x-0.5">
              &#8594;
            </span>
          </a>
        ))}
      </div>
      <div className="mt-2.5 text-right">
        <a href={allHref} className="text-[length:var(--t-micro)] text-[var(--c-ink2)] transition-colors hover:text-[var(--c-ink)]">
          Every covered city <span aria-hidden>&#8594;</span>
        </a>
      </div>
    </div>
  );
}
