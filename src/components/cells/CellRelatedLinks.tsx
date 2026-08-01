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
 * WHY THE LINKS CARRY NO FIGURES. A gloss beside a link ("keeps about $43K")
 * is what makes it worth clicking, and it is deliberately held back for one
 * release. Filled figures are currently published under a measured label across
 * a large part of the site, and the repair for that is the founder's call, not
 * this block's. Every gloss here would inherit exactly that defect and multiply
 * it by twelve links a page. Once the provenance label is honest, the gloss is a
 * one-line addition: put the figure in a second line under the label inside
 * LinkPill below, and pass it through on RelatedLink.
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
