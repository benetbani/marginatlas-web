/**
 * THE FREE DOORS (his ruling of 2026-10-05 on PARKED P20.1, option (a): "a free row of plain doors (names only, no figures) to the
 * other London trades on the trade page, and to the UK's city pages on /gb, in each page's free half, so locking never cuts the
 * site's paths"). A locked level hides its links with its figures; this row, drawn only on a locked page and only where a locked
 * level held such links, stands in the page's free close (outside the chapters, so it never locks) and carries the same addresses
 * by name. No figure, no card: page furniture, like the notebook. The paywall gate holds that a free reader loses no page the open
 * page links (scripts/harness/check_paywall.mjs, rule 7).
 */
import * as React from "react";

export type FreeDoor = { name: string; href: string };

export function FreeDoors({ id, title, doors }: { id: string; title: string; doors: FreeDoor[] }) {
  const seen = new Set<string>();
  const unique = doors.filter((d) => d.href && !seen.has(d.href) && (seen.add(d.href), true));
  if (unique.length === 0) return null;
  return (
    <nav data-free-doors={id} aria-labelledby={`free-doors-${id}`}>
      <h2 id={`free-doors-${id}`} className="text-[length:var(--t-head)] font-semibold leading-7 text-[var(--c-ink)]">
        {title}
      </h2>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {unique.map((d) => (
          <li key={d.href}>
            <a href={d.href} className="tap-y inline-flex items-center text-[length:var(--t-body)] text-[var(--c-ink)] underline underline-offset-2 hover:text-[var(--c-ink2)]">
              {d.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
