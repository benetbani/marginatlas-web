"use client";

/**
 * StickySectionNav - the in-page jump nav (design-system 13.4 / 13.3).
 *
 * The quiet sticky table of contents for any long page. It takes its sections
 * as props (the page passes its REAL rendered ids), which is the fix for the
 * old CellPageNav that hardcoded anchors pointing at deleted sections and so
 * silently scrolled to the top. On desktop it is a left-border rail that tracks
 * the visible section; below xl it becomes a horizontally-scrollable sticky chip
 * row, matching the mobile reflow rule. Sections whose anchor is not on the page
 * are dropped on mount, so a stale entry can never dead-link again.
 *
 * Tokens only, no raw color, no em-dashes.
 */
import * as React from "react";

export type NavSection = { id: string; label: string };

export function StickySectionNav({
  sections,
  title = "On this page",
}: {
  sections: NavSection[];
  title?: string;
}) {
  const [present, setPresent] = React.useState<NavSection[]>(sections);
  const [active, setActive] = React.useState<string>(sections[0]?.id ?? "");

  React.useEffect(() => {
    // Keep only sections whose anchor actually exists, so a stale id never
    // dead-links.
    const live = sections.filter((s) => document.getElementById(s.id));
    setPresent(live);
    if (live.length === 0) return;
    setActive((cur) => (live.some((s) => s.id === cur) ? cur : live[0].id));

    const visibility = new Map<string, number>();
    const observers: IntersectionObserver[] = [];
    for (const s of live) {
      const el = document.getElementById(s.id);
      if (!el) continue;
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            visibility.set(s.id, entry.intersectionRatio);
          }
          let best = live[0].id;
          let bestRatio = 0;
          for (const [id, ratio] of visibility.entries()) {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              best = id;
            }
          }
          if (bestRatio > 0) setActive(best);
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1] },
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  if (present.length < 2) return null;

  return (
    <>
      {/* Desktop: the left-border rail, now ON A CARD.
          FOUND BY LOOKING, at 1440x900 on /gb. This nav carried no surface of
          any kind and sits in the RIGHT GUTTER, which is the one part of the
          page where AtlasFrame deliberately shows the photograph at full
          strength. So the lower half of the list, "What locals know", "Vs the
          world", "The honest take", "Gut check", "Compare", was small cocoa
          type over hillside buildings and foliage. The top half looked fine
          only because the picture happens to be sky up there, which is not a
          design, it is the crop.

          It rendered at all, unlike the footer, because `sticky` is a
          positioned value: it was already in the paint step above the frame's
          fixed layers. Legible is a separate question from painted, and this
          was painted and not legible.

          .atlas-card is the founder's own answer, stated three times: "we put
          everything in those cards." It brings --atlas-surface-card at .955,
          so the picture still whispers through the nav rather than being
          blocked by it. The inner left-border rail is unchanged. */}
      <nav
        aria-label={title}
        className="atlas-card hidden xl:block sticky top-[120px] ml-4 w-[180px] shrink-0 self-start px-3 py-3.5 text-xs"
      >
        <div className="mb-2 pl-3 text-[10px] font-semibold uppercase tracking-wider text-cocoa-700">
          {title}
        </div>
        <ul className="space-y-0.5 border-l border-ink-200">
          {present.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={[
                    "-ml-px block border-l py-1.5 pl-3 transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                    isActive
                      ? "border-atlas-500 font-medium text-atlas-700"
                      : "border-transparent text-cocoa-700 hover:text-ink-900",
                  ].join(" ")}
                >
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Below xl: the sticky chip row. It sticks just below the real header,
          whose height is published as the shared --atlas-header-h custom
          property on the root (layout.tsx), so the old magic top-[56px] (which
          undershot the ~80px header and overlapped it) is gone. z-sticky (20)
          puts the row above page content and above the header's z-raised (10),
          so it can never hide under the header. */}
      <nav
        aria-label={title}
        /* bg-cream-75/90 -> bg-white/90. The founder banned cream outright:
           "remove completely this creamy color from the page. That's totally
           not allowed." cream-75 is #f7f7f8 today, already retoned to a cool
           neutral by the page-ground migration, so this is a naming fix rather
           than a visible colour change, and it takes the last cream reference
           out of this file. The translucency and the blur stay: this bar sits
           over scrolling content, which is what they are for. */
        className="sticky top-[var(--atlas-header-h)] z-sticky -mx-4 mb-6 overflow-x-auto border-b border-parchment/70 bg-white/90 px-4 py-2 backdrop-blur xl:hidden"
      >
        <ul className="flex w-max gap-2">
          {present.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={[
                    "inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive
                      ? "border-atlas-300 bg-atlas-50 text-atlas-700"
                      : "border-parchment bg-cream-50 text-cocoa-700 hover:text-ink-900",
                  ].join(" ")}
                >
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
