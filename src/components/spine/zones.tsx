/**
 * THE ZONES: the band page's layout (2026-10-04, his words that day: "abandon the bento in favor of a more traditional thing
 * where the sections have alternating background colors maybe just by a little bit ... we can keep some cards but not so much
 * bento, not everything inside the bento").
 *
 * A ZONE is one full-width background band holding ONE LEVEL of the page: one section that takes the column, or two sections
 * side by side from 768px (equal halves there, the level's ratio from 1024). Zones alternate paper and tint down the page (globals.css, THE ZONES, carries the colours, the full
 * bleed and the padding). The sections inside a zone stand OPEN on the band: the section card's box is taken away by the zone's
 * stylesheet, and only a card the reader operates or that is a door keeps its box (`Box keep`).
 *
 * WHY A LEVEL AND NOT A CHAPTER. Research R3 measured data sites changing colour per chapter (Data USA: six changes for 52
 * sections) and warned against per-section stripes. His ask is to separate the SECTIONS by a background; a zone per level does
 * that (one or two sections, the pair chosen by topic), changes colour about every 450px on a desktop and every one or two
 * screens on a phone, and never stripes a single section at a time.
 *
 * THE BOUNDARY IS NOT THE COLOUR ALONE (R3: every band pair scores under APCA's visibility floor; forced colours remove
 * backgrounds): the zone's padding, the numbered chapter heading and each section's own heading carry it; on a phone two
 * sections stacked in one zone are parted by a hairline with 24px either side.
 *
 * Distances, all on the ladder (DISTANCES.md): zone padding 40 / 48 / 64 at 375 / 768 / 1024 (globals.css); chapter number to
 * title 8; chapter heading to the level 24 on a phone, 32 from 1024; two sections in a level 48 apart from 768 and 64 from 1024;
 * stacked sections (under 768) 24, a hairline, 24.
 */
import * as React from "react";

export type ZoneTone = "paper" | "tint";
/** How the level divides from 1024px; from 768 every pair is equal halves, and below 768 every level is one column. */
export type ZoneSplit = "wide" | "1-1" | "2-1" | "1-2" | "3-2" | "2-3";

/* SIDE BY SIDE FROM 768, IN EQUAL HALVES THERE AND IN THE LEVEL'S RATIO FROM 1024 (kit.tsx Band's rule, "the ratio waits for
   desktop; tablet gets equal halves"). Stacked at 768, an open section took the column's 720px and its figure and rows used the
   left half of it (the page filter's WHITE SPACE, four sections, 345 to 375 wide); two halves of 336 hold them. */
const SPLIT: Record<ZoneSplit, string> = {
  wide: "",
  "1-1": "md:grid-cols-2",
  "2-1": "md:grid-cols-2 lg:grid-cols-[2fr_1fr]",
  "1-2": "md:grid-cols-2 lg:grid-cols-[1fr_2fr]",
  "3-2": "md:grid-cols-2 lg:grid-cols-[3fr_2fr]",
  "2-3": "md:grid-cols-2 lg:grid-cols-[2fr_3fr]",
};

/** A chapter's opener: its number and its title, at the top of the chapter's first zone. No eyebrow, no icon, no accent. */
export function ChapterHead({ index, heading }: { index: string; heading: string }) {
  return (
    <div data-chapter-head={index} className="mb-6 lg:mb-8">
      <span className="fig block text-[length:var(--t-body)] leading-5 text-[var(--c-muted)]">{index}</span>
      {/* THE CHAPTER TITLE TAKES THE SECTION RUNG (24): on the band page it anchors a run of coloured zones, and each section's
          own heading below it stands at 20 (globals.css, THE OPEN SECTION). */}
      {/* Balanced lines: at 375 "What it costs to open, and to run" left "run" alone on the second line. */}
      <h2 id={`chapter-${index}`} data-typography="custom" className="mt-2 text-[length:var(--t-section)] font-semibold leading-8 tracking-tight text-[var(--c-ink)] [text-wrap:balance]">
        {heading}
      </h2>
    </div>
  );
}

/**
 * One zone. `tone` is given by the page (it alternates over the zones that draw); `chapter` puts the chapter's opener at the
 * top. A zone with no children draws nothing; a child that RENDERS nothing is still a child here (React cannot see that from
 * outside), so the page must pass only sections it knows will draw: an empty cell is the page laws' ZONE SPLIT red, and a zone
 * counted but not drawn would break the alternation the page computed.
 */
export function Zone({ tone, split = "1-1", chapter, label, children }: { tone: ZoneTone; split?: ZoneSplit; chapter?: { index: string; heading: string }; label?: string; children: React.ReactNode }) {
  const kids = React.Children.toArray(children).filter(Boolean);
  if (kids.length === 0) return null;
  const pair = split !== "wide" && kids.length > 1;
  return (
    /* NAMED ONLY BY ITS CHAPTER (the code review of 2026-10-04): a zone named after its first section announced a "Borrowing" region
       that also held "Getting paid"; a chapter's first zone takes the chapter's title, the others are not regions of their own. */
    <section data-zone={pair ? split : "wide"} data-tone={tone} data-zone-label={label} aria-labelledby={chapter ? `chapter-${chapter.index}` : undefined}>
      {chapter ? <ChapterHead index={chapter.index} heading={chapter.heading} /> : null}
      <div
        data-zone-level=""
        className={
          pair
            ? /* STACKED BELOW 768: 24, a hairline, 24 between the two sections (R3, 3.6); SIDE BY SIDE FROM 768: 48 apart (64 from
                 1024), no rule, each section the height of its own content (an open section has no box to stretch). */
              `grid grid-cols-1 items-start gap-y-6 [&>*+*]:border-t [&>*+*]:border-[var(--c-border)] [&>*+*]:pt-6 md:gap-x-12 md:[&>*+*]:border-t-0 md:[&>*+*]:pt-0 lg:gap-x-16 ${SPLIT[split]}`
            : "grid grid-cols-1"
        }
      >
        {/* EACH SECTION IN ITS OWN CELL: the hairline between two stacked sections belongs to the level, not to the section, so the
            zone's rule that takes a section's box away (border 0) can never take the level's hairline with it. */}
        {kids.map((k, i) => (
          <div key={i} data-zone-cell="" className="min-w-0">
            {k}
          </div>
        ))}
      </div>
    </section>
  );
}

/** The tone of the zone at `index` among the zones that draw: the first takes `first`, then they alternate. */
export function zoneTone(index: number, first: ZoneTone = "tint"): ZoneTone {
  const other: ZoneTone = first === "tint" ? "paper" : "tint";
  return index % 2 === 0 ? first : other;
}
