"use client";

/**
 * CellPageNav — sticky table-of-contents that floats on the right side
 * of the cell page on desktop. Scrolls into view on click and tracks the
 * currently visible section via IntersectionObserver.
 *
 * Hidden on mobile (replaced implicitly by the DimensionSwitcher above
 * the fold).
 */

import { useEffect, useState } from "react";

type Section = { id: string; label: string };

/**
 * Section IDs match canonical CELL_PAGE_SECTIONS
 * after the legacy rename. The hero `<header>` still carries id="headline"
 * so we keep that as the first anchor; everything else uses the canonical
 * id that the page now renders.
 *
 * Removed: `timeseries` (Wave 1 ripped the time-series chart) and `quality`
 * (Wave 1 follow-up removed the engineering provenance panel). Both
 * sections no longer exist on the page, so navigating to them silently
 * scrolled to the top — worse than not listing them.
 */
const SECTIONS: Section[] = [
  { id: "headline", label: "Headline" },
  { id: "tax-and-cost-panel", label: "Typical firm" },
  { id: "revenue-distribution", label: "Distribution" },
  { id: "across-states", label: "Across states" },
  { id: "related-cells", label: "Other industries" },
];

export function CellPageNav() {
  const [active, setActive] = useState<string>("headline");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visibility = new Map<string, number>();

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            visibility.set(s.id, entry.intersectionRatio);
          }
          // Pick the section with the highest visibility ratio
          let best = "headline";
          let bestRatio = 0;
          for (const [id, ratio] of visibility.entries()) {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              best = id;
            }
          }
          if (bestRatio > 0) setActive(best);
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1] }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav
      aria-label="Page sections"
      // Wider left margin (was ml-6) so the TOC sits
      // further from the main content per founder direction.
      className="hidden xl:block sticky top-[120px] self-start ml-4 w-[180px] shrink-0 text-xs"
    >
      <div className="text-[10px] uppercase tracking-wider text-ink-700/50 font-semibold pl-3 mb-2">
        On this page
      </div>
      <ul className="space-y-0.5 border-l border-paper-350">
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`block pl-3 py-1.5 -ml-px border-l transition ${
                  isActive
                    ? "border-atlas-500 text-atlas-700 font-medium"
                    : "border-transparent text-ink-700/70 hover:text-ink-900"
                }`}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
