/**
 * BlockedSeat , THE DRAWN BLOCKED SEAT (MODEL.md 8.2, the rows `07 workforce`
 * and `11 easiest`, and PART 9 clause 41 / R6). A block whose data has not
 * been gathered is PRESENT on the page: drawn with its structure, stating
 * what it does not hold, printing no figure and no sample. It counts toward
 * the block floor by 8.2's own words ("a drawn blocked seat, its opener, one
 * stated line, no figure, is a block"), and it holds the band's second seat,
 * so LONE CARD never fires on a band for want of data. His 2026-09-08 answer
 * on sparse sections is what this is built to; the older "a blocked section
 * ships filled and labelled sample" (clause 32, 2026-07-09) is the ground it
 * supersedes for these two rows, and for `11` the only sample there is would
 * be R3's banned archetype capital, so the seat is never filled.
 *
 * THE LAW, inside the component and not in a brief:
 *  - THE OPENER: a Rail with its icon and its kicker, like every other card.
 *  - ONE STATED LINE at `--t-lead` 16 in `--c-ink2`, where the focal would
 *    stand: the card's eye entry and the only line in its body. Under fifteen
 *    words, in the site's idiom, "Not gathered yet: ...". The words live in
 *    src/lib/spine/copy.ts and are read aloud before they ship.
 *  - NO FIGURE. The component has no slot for one: no Fig, nothing at 30, no
 *    40. A seat is not a card that could carry a focal and does not; it is a
 *    form whose law is no figure, which is why `blocked-seat` sits in
 *    EVEN_BY_RULING beside the prose form (check_page_holes.mjs's NO LEAD and
 *    check_model_laws.mjs's FOCAL, "8.2: a seat holds no figure by its law").
 *  - NO SAMPLE MARK. Nothing here is modelled and nothing is measured; a mark
 *    would assert a figure the card does not print.
 *  - THE FOOT: one line at `--t-micro` under a hairline, naming the
 *    requirement the seat waits on (DATA-REQUIREMENTS.md, by item). It sits
 *    at the card's base: the card is stretched to its partner's height by
 *    ruling 7, and a foot belongs on the bottom edge, not floating up under
 *    the line with the card's air beneath it.
 *  - `data-blocked="1"` on the Box, the marker 8.5's BLOCK FLOOR names, and
 *    `data-block` through Box's own id rule, so the page's count reads it.
 *
 * WHEN IT LEAVES: the day the requirement lands, the block's return form
 * takes the seat (8.2: a bento cluster for 07, which then swallows 08 as its
 * first cell; a MarkList with the trade pictogram in the mark slot for 11)
 * and this component is unmounted there. Nothing is padded in the meantime.
 *
 * Defended in scripts/harness/check_archetypes.mjs (BLOCKED SEAT: the line
 * under fifteen words, no .fig, no element at 30 or 40), planted once on
 * 2026-09-17 and watched go red before it was trusted.
 */
import * as React from "react";
import { type AtlasIconId } from "@/components/brand/icons";
import { Box, Rail } from "@/components/spine/kit";

/** The stated line's cap: fourteen words, "under fifteen" (8.2's own count on `07`, "fourteen words, at the cap"). */
export const SEAT_LINE_WORDS_CAP = 14;

export function BlockedSeat({ id, icon, kicker, line, foot }: { id: string; icon: AtlasIconId; kicker: string; line: string; foot: string }) {
  return (
    <Box id={id} data-archetype="blocked-seat" data-blocked="1" className="flex flex-col">
      <Rail icon={icon} kicker={kicker} />
      <p data-seat-line className="mb-5 text-[length:var(--t-lead)] leading-snug text-[var(--c-ink2)]">{line}</p>
      <div data-foot className="mt-auto border-t border-[var(--c-border)] pt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{foot}</div>
    </Box>
  );
}
