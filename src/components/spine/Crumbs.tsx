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
 *  - ONE LINE, AND NO LABEL IS EVER CUT. Each step after the first is one unit with its slash, and a unit that does not
 *    fit the line gives way whole: the row wraps into a second line the nav's one-line height hides. The page's own step
 *    is last, so it gives way first (the h1 under the trail says it); when a middle step gives way, it and the middle after it
 *    collapse to the mark ("/ ..."), as over four steps they always do, so a first step never stands alone with no sign of what
 *    gave way; a step that gave way leaves the tab order (`inert`); the nav clips (`overflow-clip`), so focus can never scroll it.
 *    The mark and the tab order are CrumbFit's, a client child running crumbFit (src/lib/spine/crumb_fit.ts) after layout.
 *    The trail never shows a second line, never scrolls sideways and never ends in an ellipsis.
 *    Measured before this rule (2026-10-16, release 3 job C): 13 of 22 longest trails clipped mid-word at 320 and 375, the
 *    London trade's "Catering &" among them; the page laws' CRUMB CUT and scripts/harness/check_crumb_trails.ts read it.
 *  - TWO STEPS AT LEAST. A trail of one is the page's own name said twice, so
 *    it draws nothing (a country page has nothing above it).
 *  - BODY RUNG (14, the type floor of plan 2026-10-12), muted, above the masthead, outside the levels: it is not a
 *    card, carries no figure and takes no part in the page laws' levels.
 */
import * as React from "react";
import Link from "next/link";
import { CrumbFit } from "./CrumbFit";

export type SpineCrumb = { label: string; href?: string };

const MAX_VISIBLE = 4;

export function Crumbs({ items }: { items: SpineCrumb[] }) {
  const trail = items.filter((c) => c && c.label);
  if (trail.length < 2) return null;
  const collapsed = trail.length > MAX_VISIBLE;
  const shown = collapsed ? [trail[0], ...trail.slice(trail.length - (MAX_VISIBLE - 1))] : trail;
  /* AT 14, A TRAIL DOES NOT ALWAYS FIT A PHONE (plan 2026-10-12 rhythm-air-inside put it at 14; a phone's line is 288 at 320 and 343 at 375): the row
     wraps (flex-wrap) inside a nav one line tall (max-h-[1lh]) that hides what wrapped, so a unit gone to the second line is gone whole, from the end.
     The page's own step goes first; a step that gave way keeps its anchor in the markup (hidden by overflow), so the page's links read the same.
     Replaces the rule of four steps under 420px of window, which collapsed the middle before the page's own step had given way. */
  return (
    <nav aria-label="Breadcrumb" data-crumbs={String(trail.length)} className="mb-2 flex max-h-[1lh] flex-wrap items-center gap-2 overflow-clip whitespace-nowrap text-[length:var(--t-body)] leading-none text-[var(--c-muted)]">
      {shown.map((c, i) => {
        const last = i === shown.length - 1;
        const step = c.href && !last ? (
          <Link href={c.href} className="rounded-sm text-[var(--c-muted)] no-underline transition-colors hover:text-[var(--c-ink2)]">
            {c.label}
          </Link>
        ) : (
          <span className={last ? "text-[var(--c-ink2)]" : undefined}>{c.label}</span>
        );
        /* THE MARK A MIDDLE STEP GIVES WAY TO, drawn after the first step and shown by crumbFit only when one does. */
        if (i === 0) return (
          <React.Fragment key={`${c.label}-${i}`}>
            {step}
            {shown.length > 2 && !collapsed ? (
              <span data-crumb-gap aria-hidden className="hidden items-center gap-2">
                <span className="text-[var(--c-border)]">/</span>
                <span className="text-[var(--c-border)]">...</span>
              </span>
            ) : null}
          </React.Fragment>
        );
        return (
          <React.Fragment key={`${c.label}-${i}`}>
            {collapsed && i === 1 ? (
              <span data-crumb-step data-crumb-mark className="flex items-center gap-2">
                <span aria-hidden className="text-[var(--c-border)]">/</span>
                <span aria-hidden className="text-[var(--c-border)]">...</span>
              </span>
            ) : null}
            <span data-crumb-step data-crumb-last={last ? "" : undefined} className="flex items-center gap-2">
              <span aria-hidden className="text-[var(--c-border)]">/</span>
              {step}
            </span>
          </React.Fragment>
        );
      })}
      <CrumbFit />
    </nav>
  );
}
