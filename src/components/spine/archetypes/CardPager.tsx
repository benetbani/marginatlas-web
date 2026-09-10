"use client";
/**
 * CardPager , THE CARD-PAGER ARCHETYPE (the cities). What replaced the map
 * (founder, 2026-08-30): up to five cards a row, arrows only when there is a
 * second page, a click and never a swipe, two cards a row on a phone, every
 * card its own link, a "see them all" link beneath. Now with the IMAGE the
 * founder ruled on 2026-09-04 ("stale and bland... an image on its left or
 * right"): on the LEFT, so the eye lands on the picture and reads the name,
 * the same file the city's own hero shows. A city without a photograph draws
 * no slot, never a placeholder.
 *
 * THE 2026-09-11 PLACEHOLDER RULING DOES NOT REACH THIS CARD, AND THAT IS
 * MEASURED RATHER THAN ASSUMED. The founder put a placeholder photograph behind
 * the city card that day ("blast the London in all of them"). Filling this
 * component's slot on every card was tried first: the harness measured three
 * city names clipped at 1280 and 768 and a hole in the single-city form, 12
 * design reds, because the left-hand image only ever fitted a 155px track while
 * three cards in four had no image to show. His ruling is live on the CityCards
 * archetype; bringing it here means re-proportioning a section he already ruled
 * on (2026-09-04, "an image on its left or right"), which is his call and not a
 * side effect of this one. See `CityCard.photo` in lib/spine/city_cards.ts.
 *
 * THE LAW INSIDE IT: cards in one row share one height (the grid stretches and
 * every card fills its cell; ruling 7); the name never truncates mid-word (it
 * wraps to two lines and the card grows, the row with it); hover is ink, never
 * the accent; the phone's two-up is the founder's own.
 */
import * as React from "react";

export type PagerCard = { id: string; name: string; sub?: string; href: string; image?: string | null };
/* FOUR A PAGE. The founder's order was "five cities maximum" (2026-08-30). The
   cities card is the lone two-thirds band, 693px at 1280, whose inner 653px
   holds four 9rem tracks and not five; photographed, a page of five put one
   card alone on a second row. Four is within his maximum and fills the row. */
const PER_PAGE = 4;

export function CardPager({ cards, allHref, allLabel, prevLabel = "Previous", nextLabel = "More" }: { cards: PagerCard[]; allHref: string; allLabel: string; prevLabel?: string; nextLabel?: string }) {
  const [page, setPage] = React.useState(0);
  const pages = Math.max(1, Math.ceil(cards.length / PER_PAGE));
  const cur = Math.min(page, pages - 1);
  const slice = cards.slice(cur * PER_PAGE, cur * PER_PAGE + PER_PAGE);
  const btn = "flex h-8 w-8 items-center justify-center rounded-[14px] border border-[var(--c-border)] text-[var(--c-ink2)] transition-colors hover:border-[var(--c-ink2)] hover:text-[var(--c-ink)] disabled:cursor-default disabled:opacity-35 disabled:hover:border-[var(--c-border)] disabled:hover:text-[var(--c-ink2)]";
  return (
    <div data-archetype="card-pager">
      {pages > 1 ? (
        <div className="mb-2 flex items-center justify-end gap-1.5">
          <span className="mr-1 text-[length:var(--t-micro)] text-[var(--c-muted)]">{cur + 1} of {pages}</span>
          <button type="button" aria-label={prevLabel} disabled={cur === 0} onClick={() => setPage((p) => Math.max(0, p - 1))} className={btn}><span aria-hidden>&#8592;</span></button>
          <button type="button" aria-label={nextLabel} disabled={cur >= pages - 1} onClick={() => setPage((p) => Math.min(pages - 1, p + 1))} className={btn}><span aria-hidden>&#8594;</span></button>
        </div>
      ) : null}
      {/* 9rem is the measured minimum that keeps two tracks in a 302px tablet card (see the retired city-cards.tsx for the arithmetic). */}
      <div className="grid grid-cols-2 items-stretch gap-2 md:[grid-template-columns:repeat(auto-fill,minmax(9rem,1fr))]">
        {slice.map((c) => (
          /* THE PHONE STACKS THE PICTURE OVER THE NAME. Measured by the harness
             at 375: a two-up card is 151px wide, and a 48px image beside a name
             left 39px for "London". So below md the image runs the card's width
             above the name; from md it sits on the left as the founder chose. */
          <a key={c.id} href={c.href} data-card={c.id} className="group flex h-full flex-col gap-2 rounded-[14px] border border-[var(--c-border)] px-3 py-2.5 transition-colors hover:border-[var(--c-ink2)] md:flex-row md:items-center md:gap-2.5">
            {c.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.image} alt="" width={48} height={48} loading="lazy" className="h-16 w-full shrink-0 rounded-lg object-cover md:h-12 md:w-12" />
            ) : null}
            <span className="flex min-w-0 flex-1 items-center gap-2">
            <span className="min-w-0 flex-1">
              <span className="block text-[length:var(--t-body)] font-medium leading-snug text-[var(--c-ink)]" style={{ overflowWrap: "normal" }}>{c.name}</span>
              {c.sub ? <span className="block truncate text-[length:var(--t-micro)] text-[var(--c-muted)]">{c.sub}</span> : null}
            </span>
            <span aria-hidden className="shrink-0 text-[length:var(--t-body)] text-[var(--c-muted)] transition-transform group-hover:translate-x-0.5">&#8594;</span>
            </span>
          </a>
        ))}
      </div>
      <div className="mt-2.5 text-right">
        <a href={allHref} className="text-[length:var(--t-micro)] text-[var(--c-ink2)] transition-colors hover:text-[var(--c-ink)]">{allLabel} <span aria-hidden>&#8594;</span></a>
      </div>
    </div>
  );
}
