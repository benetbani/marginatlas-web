/**
 * WhereNext, WHERE TO NEXT AS DOORS (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Tasks 5 and 10; the home's spec of
 * 2026-10-09, section 6). Furniture, not a reading, as the notebook it replaces on the home was: no figure, so it stands outside the
 * section cards (no Box), its heading at the head rung and one row a door, a hairline between, each row the whole width a plain link
 * read without script. It fills the half its level gives it (`even`, ruling 7: cards in a row share a height): the list takes the height
 * left under the heading and its rows share it from 768; stacked under 768 each row keeps its own. A page that stands it beside a list
 * of rows on a fixed pitch (the home's cities) passes `pitch`: from 768 each door is a 56px slot and the list starts 16px under the
 * heading, so the pairs meet row for row (critique pass 2, fix round C2, item P1.3). Not the terminus: that archetype
 * holds three doors and no two of them may open on one word, and these are the site's ways out.
 */
import * as React from "react";
import type { NextDoor } from "@/lib/home/next_doors";

export function WhereNext({ id = "next", title, doors, pitch = false }: { id?: string; title: string; doors: readonly NextDoor[]; /** The page stands this list beside a list of rows on a fixed pitch (the home's cities): from 768 each door is a 56px slot, the list 16px under the heading, so the pairs meet row for row. */ pitch?: boolean }) {
  if (doors.length === 0) return null;
  return (
    <nav data-next={id} aria-labelledby={`${id}-title`} className="flex h-full flex-col">
      <h2 id={`${id}-title`} data-typography="custom" className="text-[length:var(--t-head)] font-semibold leading-7 tracking-[-0.01em] text-[var(--c-ink)]">
        {title}
      </h2>
      <ul className={pitch ? "mt-4 grid flex-1 grid-cols-1 md:auto-rows-[56px]" : "mt-3 grid flex-1 grid-cols-1 md:auto-rows-fr"}>
        {doors.map((d, i) => (
          <li key={d.key} className={i > 0 ? "border-t border-[var(--c-border)]" : ""}>
            <a href={d.href} data-door-key={d.key} className="tap-y flex h-full items-center justify-between gap-3 py-3 text-[length:var(--t-body)] font-medium text-[var(--c-ink2)] no-underline transition-colors hover:text-[var(--c-ink)]">
              <span>{d.label}</span>
              <span aria-hidden>&#8594;</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
