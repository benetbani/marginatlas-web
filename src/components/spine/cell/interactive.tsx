"use client";
/**
 * Client interactives for the cell page: the Risks dot plot on a shared
 * labeled 0-10 scale, `10 watch`'s seat until his B1 lands (MODEL.md 8.6).
 * THE WAGE TABLE LEFT THIS FILE on plan step 33's third dispatch (2026-09-18):
 * MODEL.md 8.6 `06 team` draws the shard's roles on TiersTable in
 * cell/turn-one.tsx from team_rows.ts, on 243 trades where this card drew
 * three London roles off the seed alone. THE NEARBY TABLE LEFT ON THE FOURTH
 * (2026-09-18): a sortable client island (click-to-sort heads, a coined
 * keeps-per-dollar column, an "Illustrative" line under four invented UK
 * cities) where 8.6 `07 peers` draws CompareTable full width from
 * trade_peer_rows.ts, the rows never navigating (M23), never an invented
 * peer. All prose from the seed.
 */
import * as React from "react";
import { Box, Rail, EaseScale, InlineDisclosure } from "@/components/spine/kit";

/* Risks , WI-3 brief (enriched, Final Ascent):
 * decision: what actually closes these kitchens. ALL FOUR scores visible on ONE shared
 * labeled scale, flipped to the PAGE scale (high = good): each danger score becomes a
 * safety read (safe = 11 - score, clamped 1..10), most-dangerous first, so the /10
 * convention means the same thing everywhere on the page. Notes sit behind the
 * disclosure. width: rail half. terracotta target: none (ink markers; the set is the read). */
export function Risks({ d }: { d: any }) {
  const arr: any[] = d.risks?.items ?? [];
  if (arr.length === 0) return null;
  const rows = arr
    .map((r) => ({ r, safe: Math.max(1, Math.min(10, 11 - r.score_1_10)) }))
    .sort((a, b) => a.safe - b.safe)
    .map(({ r, safe }) => [r.name, (safe / 10) * 100, `${safe}/10`]) as Array<[string, number, string, string?]>;
  return (
    <Box id="risks" className="md:flex-[2]">
      <Rail icon="watch" kicker="What to watch" sample />
      <div className="mt-1"><EaseScale rows={rows} endLabels={["Riskier", "Safer"]} /></div>
      <InlineDisclosure name="risks" summary="What each risk does">
        {/* TWO UP, AND THE REASON IS THE READING MEASURE. Rulebook v2 §17.
            One item per row gave the note column every pixel the card had:
            measured at 1280, 898px of card left 750px of note, which is 155
            CHARACTERS PER LINE at this size, roughly double a comfortable
            measure and the widest text anywhere in the four pages. Capping the
            column instead would have left 300px of dead space on every row,
            which §17 forbids in the same breath. Two columns spend the width on
            a second item rather than on air, and take the measure to about 60.

            THE PAIRING FIRES AT lg, NOT sm or md. Founder, 2026-08-21: "in mobile the
            look is always stacked with one card after another where there is a
            good opportunity that we can put two cards in the same row." sm: is
            640px and phones are 375 to 430, so a pairing written there has never
            once fired on a phone; a ratchet counts them for that reason. These
            are sentences rather than number tiles, and two columns of prose at
            375px would be about 25 characters a line, so this one genuinely
            wants the wider tier. Measured at every tier below rather than
            assumed: 54 characters a line at 375, 56 at 768, and the cap below holds the
            widest tier at 73. 56ch is not a new number: it is the measure the spine
            stylesheet's own .note class already uses. The ch unit measures the
            "0" advance, which in this face runs wider than the average lowercase
            letter, so 56ch lands at about 73 REAL characters; the number that
            matters is the measured one, and it was measured with the webfont
            settled, because the first two readings disagreed until it was.

            IT IS AN INLINE STYLE RATHER THAN max-w-[56ch] FOR ONE REASON: the
            preview these were measured in reads a stylesheet built earlier, so a
            newly written arbitrary class cannot appear in it and the cap could
            not be seen in a picture. Production would have generated it, but a
            change nobody can look at is not a change anyone can check. A ch cap is a MEASURE; a rem cap is a width, which
            is why max-w-2xl reads as 96 characters and is the thing being
            migrated away from. */}
        <div className="mt-2 grid gap-x-7 gap-y-2.5 border-t border-[var(--c-border)] pt-2.5 lg:grid-cols-2">
          {arr.map((r) => (
            <div key={r.name} className="grid grid-cols-1 items-baseline gap-x-3 gap-y-0.5 sm:grid-cols-[104px_1fr]">
              <span className="text-[12px] font-medium text-[var(--c-ink)]">{r.name}</span>
              <span className="block text-[11.5px] leading-snug text-[var(--c-ink2)]" style={{ maxWidth: "56ch" }}>{r.note}</span>
            </div>
          ))}
        </div>
      </InlineDisclosure>
    </Box>
  );
}
