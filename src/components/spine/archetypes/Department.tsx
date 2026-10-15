/**
 * Department, ONE PART OF THE ATLAS AS A CONTENTS ENTRY (plan 2026-10-13 home-quiet-editorial, Task 4B; spec docs/superpowers/
 * specs/2026-10-13-home-quiet-editorial-design.md, section 2, item 3, and section 3; catalogued in E:/atlas/rules/FORM-CATALOG.md, VERSION
 * 10). Quiet editorial, from parts the site owns: the muted index in the figures' face, the title at the head rung (20, a section title's
 * size and tracking on a zone), one plain line in ink2 8 under it (the title's own line, marked a line for the plain-copy law), then 24 to
 * the member rows. A row is one shape everywhere: its mark, its name, a figure only where the model asks for one (a trade row carries its
 * own, MODEL PART 9), the arrow every door on the site carries (DOOR_ARROW); a hairline between rows; the door to the whole part last, its
 * name in ink2. Every row is a link 44 tall at least, so a tap never misses. No accent and no 30: a department is a door to a part of the
 * site, never a figure's card (MODEL PART 4, WHO HOLDS NO 30, names the form; FOCAL_EXEMPT_FORMS in check_model_laws.mjs). Hidden from a
 * screen reader: the index (the title says the part) and each mark (the name says the member); a figure says its unit there instead.
 */
import * as React from "react";
import { Fig } from "@/components/spine/kit";
import { DOOR_ARROW, DOOR_NAME } from "@/lib/spine/door_look";
import type { Provenance } from "@/lib/spine/provenance";

export type DepartmentRow = { key: string; href: string; name: string; mark: React.ReactNode; figure?: { text: string; unit: string; prov: Provenance } | null };

export function Department({ dept, index, title, line, rows, door }: { dept: string; index: string; title: string; line: string; rows: readonly DepartmentRow[]; door: { label: string; href: string } }) {
  return (
    <div data-archetype="department" data-dept={dept} className="flex flex-col">
      <div className="flex items-baseline gap-3">
        <span aria-hidden data-dept-index="" className="font-serif text-[length:var(--t-body)] font-semibold leading-5 tabular-nums text-[var(--c-muted)]">
          {index}
        </span>
        <h2 data-typography="custom" data-rail-title="" className="text-[length:var(--t-head)] font-semibold leading-7 tracking-[-0.01em] text-[var(--c-ink)]">
          {title}
        </h2>
      </div>
      <p data-dept-line="" data-line="" className="mt-2 text-pretty text-[var(--c-ink2)] text-[length:var(--t-body)] leading-5">
        {line}
      </p>
      <ul data-dept-rows="" className="mt-6">
        {rows.map((r, i) => (
          <li key={r.key} className={i === 0 ? undefined : "border-t border-[var(--c-border)]"}>
            <a href={r.href} data-member={r.key} className="group tap-y grid min-h-11 grid-cols-[2.5rem_minmax(0,1fr)_auto_0.75rem] items-center gap-x-3 py-2 text-[var(--c-ink)] no-underline">
              <span aria-hidden data-member-mark="" className="flex h-7 items-center">
                {r.mark}
              </span>
              <span data-member-name="" className="min-w-0 text-[length:var(--t-lead)] font-medium leading-6 group-hover:underline">
                {r.name}
              </span>
              {r.figure ? (
                <span className="text-[length:var(--t-lead)] leading-6">
                  <Fig prov={r.figure.prov}>{r.figure.text}</Fig>
                  <span className="sr-only">{` ${r.figure.unit}`}</span>
                </span>
              ) : (
                <span />
              )}
              <span aria-hidden className={DOOR_ARROW}>&#8594;</span>
            </a>
          </li>
        ))}
        <li className={rows.length === 0 ? undefined : "border-t border-[var(--c-border)]"}>
          <a href={door.href} data-dept-all="" className={`tap-y flex min-h-11 items-center justify-between gap-3 py-2 ${DOOR_NAME} text-[var(--c-ink2)] no-underline hover:text-[var(--c-ink)] hover:underline`}>
            <span>{door.label}</span>
            <span aria-hidden className={DOOR_ARROW}>&#8594;</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
