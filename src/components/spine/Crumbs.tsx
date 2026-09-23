/**
 * Crumbs , THE TRAIL BACK UP (2026-09-22, QUEUE ui:the-trail-back-up; his
 * hundred interface words name it "breadcrumbs: navigation aid showing the
 * path to current page").
 *
 * WHY: measured on the day it was built, ZERO of the pages the harness renders
 * showed a reader where they were standing, on a site four levels deep
 * (country, city, district, trade). Most readers arrive on a deep page from a
 * search engine, and the page never said what it was part of.
 *
 * THE CONTRACT IS NOT NEW. `src/components/Breadcrumb.tsx` has carried it on
 * the legacy pages for months and it is a good one, so this borrows it whole:
 * a step with no destination renders as text rather than pointing at a URL
 * that answers 404, and the middle collapses rather than wrapping to a second
 * line. What it does not borrow is the palette. That component paints in the
 * pre-spine tokens (`text-ink-700`, `text-atlas-700`); a spine page may only
 * use the spine's own, so this is a sibling rather than a reuse, and the two
 * are named here so a reader knows to change both or neither.
 *
 * THE LAW, inside the component:
 *  - THE LAST STEP IS THE PAGE, never a link, even when a href is passed.
 *  - A STEP WITHOUT A HREF IS TEXT. The callers resolve every destination
 *    through `page_targets.ts`, which refuses to claim a page the route would
 *    404 on, so a dead crumb cannot be built by accident.
 *  - ONE LINE. Over four steps the middle collapses to a mark; the trail never
 *    wraps and never scrolls sideways.
 *  - TWO STEPS AT LEAST. A trail of one is the page's own name said twice, so
 *    it draws nothing (a country page has nothing above it).
 *  - MICRO RUNG, muted, above the masthead, outside the levels: it is not a
 *    card, carries no figure and takes no part in the page laws' levels.
 */
import * as React from "react";
import Link from "next/link";

export type SpineCrumb = { label: string; href?: string };

const MAX_VISIBLE = 4;

export function Crumbs({ items }: { items: SpineCrumb[] }) {
  const trail = items.filter((c) => c && c.label);
  if (trail.length < 2) return null;
  const collapsed = trail.length > MAX_VISIBLE;
  const shown = collapsed ? [trail[0], ...trail.slice(trail.length - (MAX_VISIBLE - 1))] : trail;
  return (
    <nav aria-label="Breadcrumb" data-crumbs={String(trail.length)} className="mb-2 flex flex-nowrap items-center gap-2 overflow-hidden whitespace-nowrap text-[length:var(--t-micro)] leading-none text-[var(--c-muted)]">
      {shown.map((c, i) => {
        const last = i === shown.length - 1;
        return (
          <React.Fragment key={`${c.label}-${i}`}>
            {i > 0 ? <span aria-hidden className="text-[var(--c-border)]">/</span> : null}
            {collapsed && i === 1 ? (
              <>
                <span aria-hidden className="text-[var(--c-border)]">...</span>
                <span aria-hidden className="text-[var(--c-border)]">/</span>
              </>
            ) : null}
            {c.href && !last ? (
              <Link href={c.href} className="rounded-sm text-[var(--c-muted)] no-underline transition-colors hover:text-[var(--c-ink2)]">
                {c.label}
              </Link>
            ) : (
              <span className={last ? "text-[var(--c-ink2)]" : undefined}>{c.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
