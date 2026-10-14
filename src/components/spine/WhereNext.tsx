/**
 * WhereNext, WHERE TO NEXT AS DOORS (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Tasks 5 and 10; the home's spec of
 * 2026-10-09, section 6). Furniture, not a reading: no figure, so it stands outside the section cards (no Box), its heading at the head
 * rung and one row a door, a hairline between, each row the whole width a plain link read without script. It fills the half its level
 * gives it (`even`, ruling 7: cards in a row share a height): the list takes the height left under the heading and its rows share it
 * from 768; stacked under 768 each row keeps its own. /new-businesses draws it; the home drew it until plan 2026-10-13 (home, quiet
 * editorial, Task 7A), which also took out its `pitch`, the home's 56px slots beside the city rows. Not the terminus: that archetype
 * holds three doors and no two of them may open on one word, and these are the site's ways out.
 */
import * as React from "react";
import type { NextDoor } from "@/lib/home/next_doors";
/* A DOOR'S NAME TYPE IS ONE CONSTANT (fix round F1, group G7): 14 at weight 500, read here and by the 404's rows (src/lib/spine/door_look.ts). */
import { DOOR_NAME } from "@/lib/spine/door_look";

export function WhereNext({ id = "next", title, doors }: { id?: string; title: string; doors: readonly NextDoor[] }) {
  if (doors.length === 0) return null;
  return (
    <nav data-next={id} aria-labelledby={`${id}-title`} className="flex h-full flex-col">
      <h2 id={`${id}-title`} data-typography="custom" className="text-[length:var(--t-head)] font-semibold leading-7 tracking-[-0.01em] text-[var(--c-ink)]">
        {title}
      </h2>
      <ul className="mt-3 grid flex-1 grid-cols-1 md:auto-rows-fr">
        {doors.map((d, i) => (
          <li key={d.key} className={i > 0 ? "border-t border-[var(--c-border)]" : ""}>
            <a href={d.href} data-door-key={d.key} className={`tap-y flex h-full items-center justify-between gap-3 py-3 ${DOOR_NAME} text-[var(--c-ink2)] no-underline transition-colors hover:text-[var(--c-ink)]`}>
              <span>{d.label}</span>
              <span aria-hidden>&#8594;</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
