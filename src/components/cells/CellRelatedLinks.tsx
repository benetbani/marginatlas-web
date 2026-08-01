/**
 * CellRelatedLinks - the onward moves at the foot of a trade page.
 *
 * The trade page is one cell of a lattice: one activity, one place. This block
 * is the only place on the page that offers the moves along it, so a reader who
 * has finished reading about this trade here can go sideways to the same trade
 * somewhere else, sideways to a different trade in the same place, or up to the
 * place and the country the page sits inside.
 *
 * It renders NOTHING it cannot stand behind. Every link handed to it was already
 * resolved against a real row and round-tripped through the destination route's
 * own resolver (see src/lib/cells/related_links.ts); a category with no
 * surviving link does not render, with no heading, no placeholder and no
 * promise of later. On a thin cell this block is short, or absent, and that is
 * the honest state rather than a failure.
 *
 * WHY THE LINKS CARRY NO FIGURES. THIS IS NOW A DECISION, NOT A DEFERRAL.
 *
 * A gloss beside a link ("keeps about $43K") is what would make it worth
 * clicking. It was held back once for a stated reason: filled figures were
 * published under a measured label across a large part of the site, so every
 * gloss would have inherited that false claim. This note used to promise the
 * gloss as a one-line addition the moment the label became honest.
 *
 * The label WAS repaired on 2026-08-01. A figure the fill supplied rather than
 * read now derives "estimated". The precondition named here has been met, and
 * the gloss was then measured against real data and does not survive it. It is
 * not a decoration this block is missing. It is a claim this block cannot make.
 *
 * WHAT WAS MEASURED. Every related link on a spread of real pages was resolved
 * through the destination route's own lookup, and the figure that destination
 * publishes was read off the resolved cell rather than guessed at:
 *
 *   90.2% of 265 link destinations derive "estimated", not "measured".
 *   38 of 49 lists publish ONE identical figure across every link in them.
 *   27.6% of the rows behind these pages carry a revenue of their own, and for
 *     Spain, Germany, France, Italy, Brazil, Poland and the Netherlands that
 *     share is zero.
 *
 * The repair kept every figure and dropped the label, which is all it claimed
 * to do. The shared FIGURES remain: most activities have no revenue envelope of
 * their own and most countries share a scale factor, so the fill hands the same
 * anchor to every place. On a page that prints ONE figure that is a defensible
 * estimate wearing an honest label. This block prints TWELVE side by side, and
 * side by side the same number under six different place names stops reading as
 * an estimate and starts reading as a finding that six places are identical. No
 * qualifier repairs that, because a reader compares the numbers before reading
 * the words next to them.
 *
 * The concrete case. On the London trade page all six "same trade somewhere
 * else" links would read $433,169: the figure the page itself carries, and the
 * figure Manchester, Leeds, Camden, Westminster and Sheffield each carry. The
 * myths chapter further up that page exists to say a London restaurant takes
 * far more money than a Manchester one while the two owners keep about the
 * same. The gloss would refute the page's own argument in the page's own foot.
 *
 * WHY NOT GLOSS ONLY THE MEASURED ONES. That rule is honest, and the
 * shared-revenue gate backs it: no measured-class figure is published for two
 * countries. It was costed and rejected on what it buys, not on principle. The
 * row this module holds is NOT the row the destination resolves (the sibling
 * read orders by firm count, the destination orders by year first, and the
 * published figure is rolled forward on top), so an honest figure needs a full
 * destination lookup per link, twelve a page. That buys a figure on about one
 * link in ten, nearly all of them US state pages, so the whole non-US site pays
 * the lookups and gains nothing. A list where one link in six carries a figure
 * also reads as though the other five were unknown, when each of them publishes
 * a figure on its own page.
 *
 * The firm count was tested too, as the one figure the sibling read already
 * selects. It varies honestly per place and per trade, but the count held here
 * disagreed with the count the destination publishes on 31 of 78 links, for the
 * same row-selection reason. It is also the wrong question: this site argues
 * that take-home is the number that matters, not how many rivals there are.
 *
 * WHAT WOULD CHANGE THIS. Not a label, not a treatment, not a qualifier.
 * Per-place revenue. The day a place's figure is read in that place instead of
 * handed to it, the six links stop agreeing and the gloss starts earning its
 * space. Until then a bare link that works beats a decorated one that misleads.
 * Re-run the measurement before building it; do not take this note's word.
 *
 * Tokens and existing classes only; no raw color, no em-dashes.
 */
import * as React from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import type { CellRelatedLinks as RelatedLinksModel, RelatedLink } from "@/lib/cells/related_links";

function LinkPill({ link }: { link: RelatedLink }) {
  return (
    <a
      href={link.href}
      className="inline-flex items-center rounded-full border border-parchment bg-white px-3 py-1.5 text-sm text-ink-900 transition hover:border-atlas-500 hover:bg-atlas-50"
    >
      {link.label}
    </a>
  );
}

function LinkGroup({
  heading,
  links,
}: {
  heading: string;
  links: RelatedLink[];
}) {
  if (links.length === 0) return null;
  return (
    <div>
      <div className="text-sm font-medium text-ink-900">{heading}</div>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {links.map((l) => (
          <LinkPill key={l.href} link={l} />
        ))}
      </div>
    </div>
  );
}

export function CellRelatedLinks({ model }: { model: RelatedLinksModel }) {
  if (!model.any) return null;
  // The lede names three moves, so it only appears when the sideways moves are
  // actually on offer. On a place with no verified neighbours the block is just
  // the step back up, and a lede promising two things that are not there would
  // be the same small dishonesty as an empty heading.
  const hasSidewaysMoves =
    model.sameTradeElsewhere.length > 0 || model.otherTradesHere.length > 0;
  return (
    <div className="space-y-5">
      <div>
        {/* The eyebrow is the section's registered name in CELL_SECTIONS, so the
            sticky nav entry and the block agree, and it is not a vaguer restating
            of the title under it. */}
        <SectionEyebrow size="md" className="mb-2">
          Related
        </SectionEyebrow>
        <h3 className="font-display text-lg font-semibold tracking-tight text-ink-900 md:text-xl">
          Where to go from here
        </h3>
        {hasSidewaysMoves ? (
          <p className="mt-1.5 text-sm text-cocoa-700/70">
            This page is one trade in one place. Change the place and keep the
            trade, change the trade and keep the place, or step back and read
            the place whole.
          </p>
        ) : null}
      </div>

      {/* Each link names its own destination in full, rather than leaning on the
          heading above it. That repeats the trade down one list and the place
          down the other, which is the deliberate trade: a link that reads
          "Restaurants in Westminster" tells a reader and a crawler where it goes
          on its own, and internal anchor text is the whole reason this block
          exists. Swap to bare place and trade names if density wins. */}
      <LinkGroup
        heading="The same trade somewhere else"
        links={model.sameTradeElsewhere}
      />
      <LinkGroup
        heading="Other trades in the same place"
        links={model.otherTradesHere}
      />
      <LinkGroup heading="Wider than this page" links={model.wider} />
    </div>
  );
}
