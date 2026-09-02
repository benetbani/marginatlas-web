/**
 * WhereToTrade , the city page's SIGNATURE moment. The old split (district
 * conveyor, then a chapter-weight Movement, then a separate map) is merged into
 * ONE coordinated pairing: a tall real MapLibre map beside a ranked district
 * list. The list ranks by RENT LOAD, lightest first (the
 * founder's D1 call, 2026-07-11): rent is the held, knowable figure. The old
 * derived per-district "keep index" is DELETED , rulebook v1 §5 names it an
 * unknowable metric, never rendered , and the district x trade ProMatrix built
 * on it is deleted with it (it squared the banned figure).
 *
 * A6 OF THE SUBSECTION QUEUE, rebuilt 2026-09-02 on the catalogue's
 * LollipopColumn (idea I2, bar set, cap 3 per page). The city page had declared
 * ONE idea in total, an I9, so this is its second declaration and its first
 * drawn one.
 *
 * WARRANT (subsection procedure, step 1). A visitor reads this to decide WHICH
 * DISTRICT TO GO LOOKING FOR A UNIT IN, given what they can carry in rent.
 * Without it they would have the two ends of the spread from the card above and
 * would have to assume the districts in between are spaced evenly across it,
 * which they are not: two sit within a tenth of the cheapest, and then the ladder
 * jumps by two thirds.
 *
 * NOT A DUPLICATE OF THE VERDICT CARD ABOVE IT, checked rather than assumed. That
 * card states three figures, the lightest, the city average and the heaviest. This
 * one states the SHAPE of the ladder between them, which is the part a reader
 * cannot infer from two ends, and it is the only place the five districts in the
 * middle appear at all.
 *
 * WHAT WAS HERE, AND WHY IT HAD TO GO. Seven horizontal tracks, one per district,
 * each with a dot on it, hand-rolled inline so none of them carried a data-idea
 * and no budget could see them: the catalogue addendum's "where the sameness
 * actually lives", and the exact shape the founder named on 2026-09-01. Seven
 * against a cap of two. A track is the right drawing for a POSITION BETWEEN TWO
 * NAMED POLES, and only one of this one's ends was named: the right-hand end was
 * the city average, the left-hand end was `max + 0.2 rounded`, which is not a pole
 * a reader could name or a district could reach.
 *
 * THE STEMS STAND UP FROM A TRUE ZERO, which a rent MULTIPLE has: x2.40 really is
 * twice x1.20, so a stem twice as tall is a true statement rather than a drawn
 * one. That is the test the previous run applied to a modelled 0-to-100 index and
 * failed it; this figure passes it.
 *
 * RULE 29A IS SATISFIED BY THE ORDER, NOT BY AN INVERSION. Rent is a burden, so
 * the rule wants the good end marked and never the worse one. The entries are
 * passed CHEAPEST FIRST, which is the founder's own D1 call for this section, so
 * the form's one accent lands on entry one, which is the lightest district: the
 * good end. Nothing is inverted before rendering, because inverting a rent would
 * make every stem publish a number the data does not hold and disagree with the
 * figure printed on its own dot.
 *
 * map: ink pins, terra ONLY on the rent-load leader; uniform pin size; label
 * declutter priority follows rent rank (points passed in rank order), so the
 * packed West End trio yields its labels first.
 * width: half the band, beside the six quick reads. The revenue-vs-city
 * counterpoint and the cross-district verdict footer stay deleted (rulebook v1
 * §15).
 *
 * THE CROSS-LINK THIS FILE USED TO DESCRIBE WAS NEVER BUILT, and the sentence
 * claiming it has been removed rather than left to mislead the next reader. The
 * map component takes points, a fit padding, a select callback, a label, a class
 * and a height. It has no prop for an externally highlighted point, so nothing
 * the list did could ever have reached it.
 *
 * What the list DID keep was a piece of state for that link: a hovered slug, two
 * mouse handlers, and an inline background applied when a row matched. That
 * background is `var(--c-soft)`, which is the exact value the shared hover class
 * on the same element already applies on hover. So the state reproduced a CSS
 * rule, re-rendering every row in the list on every mouse move across it, in
 * service of a connection that does not exist. All of it is gone, and with the
 * last piece of state went the client boundary: this section renders on the
 * server now, and the map, which is its own client component, still does not.
 *
 * WIRING THE CROSS-LINK PROPERLY IS A REAL FEATURE and is not attempted here: it
 * needs a new prop on the map and a browser to verify in, and this machine could
 * not keep a dev server alive. Written down instead.
 */
import * as React from "react";
import { Box, Rail, InfoTip, InlineDisclosure } from "@/components/spine/kit";
import { LollipopColumn } from "@/components/spine/forms-v2";
import { SpineMap, type SpinePoint } from "@/components/spine/SpineMap";

type District = { name: string; slug: string; character: string; rev_vs_city_pct: number; rent_mult: number; lat: number; lng: number };

export function WhereToTrade({ d }: { d: any }) {
  const w = d.where_to_trade ?? {};
  const list: District[] = w.list ?? [];
  // Null-guard (real-data promotion): omit the whole section when no district set.
  if (list.length === 0) return null;
  // D1 (founder, 2026-07-11): rank by rent load, lightest first. The seed rent
  // multiple is the ranked figure, plainly labelled , nothing derived.
  const rows: District[] = list.slice().sort((a, b) => a.rent_mult - b.rent_mult);

  /* Both district links pointed at /dev/spine-hood, the sandbox these
     components were built in before they were promoted to real data. The
     sandbox renders one hardcoded London district for ANY row, so every
     district in every city led to the same borrowed page.

     There is no per-district public route, so the honest destination is the
     city's own neighborhoods page. When the datum carries no city slug there is
     nothing to link to, and the row renders as text rather than as a link to
     somewhere else's data. */
  const hoodHref: string | undefined = d.meta?.slug
    ? `/cities/${d.meta.slug}/neighborhoods`
    : undefined;
  const sample = w._meta?.confidence === "placeholder" || w._meta?.confidence === "modeled";

  /* THE UNIT IS PRINTED ON EVERY MARK, in the notation the rest of this page
     already uses for a rent multiple: an x and two decimals. The form draws its
     stems from a true zero, so the heights are ratios between districts and the
     figures say which ratio. */
  const asMult = (v: number) => `x${v.toFixed(2)}`;
  const entries = rows.map((r) => ({ name: r.name, value: r.rent_mult }));

  // map points in RENT-RANK order (declutter keeps labels by array priority, so
  // the lightest-rent districts keep their names and the packed West End trio
  // yields first). Uniform pin size; ink pins, terra = the rent-load leader;
  // the rent multiple rides the hover/focus popup.
  const points: SpinePoint[] = rows
    .filter((x) => Number.isFinite(x.lat) && Number.isFinite(x.lng))
    .map((x, i) => ({
      name: x.name, slug: x.slug, lat: x.lat, lng: x.lng,
      signal: 50, signalLabel: `rent x${Number(x.rent_mult).toFixed(2)} the city level`, sub: x.character,
      tone: i === 0 ? "terra" : "ink",
      href: hoodHref,
    }));

  // The map self-omits when no district carries real coordinates (real-data promotion
  // holds no lat/lng); the ranked rent-load list then takes the full width alone.
  const hasMap = points.length > 0;

  return (
    <Box id="districts">
      {/* "By district" , plain, and deliberately NOT "Where to trade": this chapter's
          Movement heading (city-view.tsx) already carries those words, and the same
          words on two labels is the exact defect the rulebook's residue pass exists
          to kill , so the box's own kicker carries different words.
          THE RAIL IS INK. It carried tone="terra", which put the accent on chrome:
          an icon tile is an affordance, not an answer, and this card's one accent
          belongs to the lightest district's mark. Rule 37, and the same call the
          format picker's own header records in as many words. */}
      <Rail icon="best-areas" kicker="By district" sample={sample} />
      {/* THE MAP SITS ABOVE THE CHART RATHER THAN BESIDE IT, and the reason is
          measurable. The pairing used to be 1.35fr of map to 1fr of list, which
          suited a stack of rows and starves a set of columns: in a half-band card
          at 1280 that column is under 200px, where seven districts get 27px of
          name each. A map wants HEIGHT and a column chart wants WIDTH, so stacked
          each one gets the axis it needs and neither takes it from the other.
          It changes nothing a reader has seen: the live adapter carries no
          coordinates for any city, so hasMap is false on every real page today. */}
      <div className="grid gap-4">
        {/* the map , the highest-craft object, given real height. Omitted with no coords. */}
        {hasMap ? (
          <div className="min-w-0">
            <SpineMap points={points} ariaLabel="Map of London districts" fitPadding={56} />
          </div>
        ) : null}
        <div className="min-w-0">
          {/* THE COLUMN HEAD, and it is a label rather than a caption: what the
              ranking is ordered by on the left, what the figures are counted in on
              the right. Rule 26 allows a chart its direct labels and its unit and
              nothing else. */}
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Ranked by rent load, lightest first</span>
            <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">rent, x the city level<InfoTip gloss="The district&#39;s commercial rent as a multiple of the city-average level; x1.00 is the city average." /></span>
          </div>
          {/* FIVE COLUMNS BELOW lg, ALL OF THEM ABOVE IT, and the count came off a
              photograph rather than a preference. At 375 this card is 303px inside
              its padding, where seven columns are 38px each and the word "London"
              alone is 46px: every name would break mid-word or run into its
              neighbour. Five are 56px, which clears the longest word in the set.
              WHAT THE PHONE LOSES IS THE TOP OF THE LADDER, and it is the one
              honest place to lose it: the card directly above states the heaviest
              district and its multiple as one of its three figures, so a reader
              scrolling a phone meets x3.00 in the West End immediately before this
              drawing rather than not at all. */}
          <LollipopColumn
            rows={entries}
            format={asMult}
            narrowCount={5}
            ariaLabel="Districts ranked by commercial rent, lightest first"
          />
          {/* THE CARD'S FOOT IS ONE ROW, NOT TWO, and a photograph is why. Stacked,
              the disclosure and the link left about 290px of nothing to their right
              across two lines, which is an empty rectangle wider than a third of a
              480px card: the founder's first fault class, in the quietest part of
              the card. Both are chrome, so they share a row, one at each edge, and
              the row spans what the drawing above it spans.
              WHAT EACH DISTRICT IS, kept rather than dropped: the character line
              used to sit under every row, and a column chart has one line of label
              per entry which belongs to the name. The words are text and not a
              graphic, so a disclosure is where they are allowed to be (rulebook v2
              S6).
              ONE LINK, NOT SEVEN: every district row used to be an anchor and all
              seven pointed at the same page, so the card offered one destination
              dressed as seven choices. Navigation is chrome and stays ink. */}
          <div className="mt-3 flex items-baseline justify-between gap-3">
            <InlineDisclosure name="districts" summary="What each district is" className="group min-w-0">
              <div className="mt-2 divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
                {rows.map((r) => (
                  <div key={r.slug} className="flex items-baseline justify-between gap-3 py-1.5">
                    <span className="text-[length:var(--t-micro)] text-[var(--c-ink)]">{r.name}</span>
                    <span className="text-[length:var(--t-micro)] text-[var(--c-ink2)]">{r.character}</span>
                  </div>
                ))}
              </div>
            </InlineDisclosure>
            {hoodHref ? (
              <a href={hoodHref} className="hov shrink-0 -mr-2 rounded-md px-2 py-1 text-[length:var(--t-body)] font-medium text-[var(--c-ink2)]">
                The districts &#8594;
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </Box>
  );
}
