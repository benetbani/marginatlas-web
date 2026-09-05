/**
 * Terminus , THE TERMINUS ARCHETYPE ("Where to next"). The page's last card
 * and, with the hero, the only band sanctioned at full width (art direction
 * D1): a heading, a hairline, and a row of doors that LEAVE the page. The
 * architecture loop's run 4 (2026-09-03) kept the form and refused two of the
 * words: a pill promising "with Pro" while Pro cannot be bought, and "the
 * deepest city", the atlas's own jargon. The doors' words come from the
 * builder and the copy table; this component draws them.
 *
 * THE LAW INSIDE IT:
 *  - At most three doors; a fourth is not drawn. At most one is a pill, the
 *    heaviest object, and it sits last. The copy gate holds the words: no two
 *    doors share a first word, every href resolves to a route, no door
 *    promises what is not on sale.
 *  - Every door leaves the page: an href that begins with "#" is not a door
 *    and is not drawn.
 *  - The row distributes: full with one door and full with three, wrapping
 *    instead of leaving empty cells; on a phone the doors stack, each link
 *    spans the width with its arrow at the right edge and a hairline under
 *    it, and the pill takes the full width, so a thumb finds every door and
 *    the card's right side is never a blank (measured by the harness: two
 *    short links stacked left a 207 by 120 hole in a 301 by 150 card).
 *  - No doors, nothing drawn; the view then draws no card.
 */
import * as React from "react";

export type Door = { key: string; label: string; href: string; kind: "link" | "pill" };
export const DOOR_CAP = 3;

export function Terminus({ kicker, doors }: { kicker: string; doors: Door[] }) {
  const live = doors.filter((d) => d.label && d.href && !d.href.startsWith("#")).slice(0, DOOR_CAP);
  if (live.length === 0) return null;
  const pillIndex = live.findIndex((d) => d.kind === "pill");
  const ordered = pillIndex >= 0 ? [...live.filter((d) => d.kind !== "pill"), live[pillIndex]] : live;
  return (
    <div data-archetype="terminus" data-doors={String(ordered.length)}>
      <h3 data-typography="custom" className="mb-1.5 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.14em] text-[var(--c-muted)]">{kicker}</h3>
      <div className="mt-2 flex flex-col items-start gap-3 border-t border-[var(--c-border)] pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6">
        {ordered.map((d) =>
          d.kind === "pill" ? (
            <a key={d.key} data-door={d.key} data-door-kind="pill" href={d.href} className="w-full rounded-full bg-[var(--c-ink)] px-5 py-2.5 text-center text-[length:var(--t-body)] font-semibold text-white transition-colors hover:bg-[var(--terra-text)] sm:w-auto">
              {d.label} <span aria-hidden>&#8594;</span>
            </a>
          ) : (
            <a key={d.key} data-door={d.key} data-door-kind="link" href={d.href} className="flex w-full items-center justify-between gap-3 border-b border-[var(--c-border)] pb-3 text-[length:var(--t-body)] font-medium text-[var(--c-ink2)] transition-colors hover:text-[var(--c-ink)] sm:w-auto sm:border-0 sm:pb-0">
              <span>{d.label}</span> <span aria-hidden>&#8594;</span>
            </a>
          ),
        )}
      </div>
    </div>
  );
}
