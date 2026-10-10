/**
 * WhereNext, WHERE TO NEXT AS DOORS (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Tasks 5 and 10; the home's spec of
 * 2026-10-09, section 6). Furniture, not a reading, as the notebook it replaces on the home was: no figure, so it stands outside the
 * section cards (no Box), its heading at the head rung and one row a door, a hairline between, each row the whole width a plain link
 * read without script. It fills the half its level gives it (`even`, ruling 7: cards in a row share a height): the list takes the height
 * left under the heading and its rows share it from 768; stacked under 768 each row keeps its own. Not the terminus: that archetype
 * holds three doors and no two of them may open on one word, and these are the site's ways out.
 */
import * as React from "react";
import type { NextDoor } from "@/lib/home/next_doors";

export function WhereNext({ id = "next", title, doors }: { id?: string; title: string; doors: readonly NextDoor[] }) {
  if (doors.length === 0) return null;
  return (
    <nav data-next={id} aria-labelledby={`${id}-title`} className="flex h-full flex-col">
      <h2 id={`${id}-title`} data-typography="custom" className="text-[length:var(--t-head)] font-semibold leading-7 text-[var(--c-ink)]">
        {title}
      </h2>
      <ul className="mt-3 grid flex-1 grid-cols-1 md:auto-rows-fr">
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
