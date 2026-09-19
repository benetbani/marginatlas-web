/**
 * Neighbourhood HUB and DISTRICT PAGE, SPINE body (SpineHoodBody), split out
 * of the routes so the live hub route (src/app/(site)/cities/[slug]/
 * neighborhoods/page.tsx) and the district route under it
 * (.../neighborhoods/[district]/page.tsx) render one body with real data
 * (buildSpineHoodSeed's meta), and the dev route renders it too. Next forbids
 * arbitrary named exports and custom props on a route file, hence the split.
 * The body self-wraps in SpineShell (the routes do not double-wrap it).
 *
 * THE ORDER IS MODEL.md 8.8's (plan step 35, 2026-09-19, one dispatch): the
 * opening full width (`00 take`); chapter turn one, what rent costs, district
 * by district (`01 rank | 02 premium`, then `03 compare` full width); chapter
 * turn two, what lifts revenue, and what the place is like (`04 works | 05
 * character`); the exit full width (`06 close`). The city view's idiom,
 * exactly: the builders built once at the top of the body, a band seated only
 * when a card exists, `Movement` with an index and a heading and nothing else
 * (the kit's icon prop on the old headings goes). Three full widths, R1: the
 * take, the compare table, the close. One prose section, `05`. One loud
 * moment, the take's 40; turn one carries none (the 2026-09-10 no-featuring
 * ruling: every bar one neutral, every figure one ink, MarkList's headline
 * ink by its law); turn two's is held empty on item 70.
 *
 * THE DISTRICT PAGE IS THIS BODY IN FOCUS (the controller's ruling b), never
 * a second page type: `focus` names a district the scheme holds, and then
 * `00 take` answers the district (its own rent against the cheapest at 40,
 * the h1 its name, the crumb naming the city once), `01 | 02` draw exactly
 * as the hub draws them (no home row, nothing featured), `03 compare` tints
 * the district's row as the home row (CompareTable's own law, the trade's
 * peers table's precedent), `04` stands as the seat, `05` draws the
 * district's own rows, `06` opens on the hub, the city and the pill.
 *
 * THE BUILDERS READ THE FILES BY THE CITY'S SLUG (hood_scheme.ts and the
 * five hood_*_rows.ts), pure and synchronous, the city's fact seats' idiom;
 * `data` carries the adapter's `meta` (the city's slug, name, iso2) and the
 * body reads its slug and nothing else from it, so the stories and the copy
 * gates build every card without the database, and the illustrative dev
 * seed's nine invented districts (Mayfair, Soho, Shoreditch: never in any
 * live scheme) are drawn nowhere any more; the dev route shows London's
 * seven off the files.
 *
 * RETIRED BY THIS COMPOSITION, and what each drew: the bespoke masthead
 * (hood/masthead.tsx, the one masthead on the site not on AnswerCard: a
 * client island with a count-up, the h1 "London neighborhoods", a "Back to
 * London" pill, the alt-district mark beside the h1, a three-sentence lede
 * defining "rent load", the answer "x1.20" against an undrawn city rate in a
 * shrink-to-fit card, and the provenance paragraph under it with the modeled
 * mark); the explorer (src/components/spine/NeighborhoodExplorer.tsx, the
 * file gone with it, nothing else mounted its three exports: the rent strip
 * as a LollipopColumn with the city's x1.00 centre line, the MapLibre map
 * (SpineMap, which stays for its other callers) with rent-encoded pins on the
 * seven authored centroids, the district picker with its detail panel
 * of x1.00-based rows and the Pro-gated rows behind LockVeil, the "why the
 * number moves" running product, the myth chapter's rank slope with "9 in 10"
 * struck across it, and the compare picker with its three-column table of
 * the one-word character class, walkability and the price tier); the funnel
 * band (`#funnel`, the four `CANONICAL_TRADES` doors as chips, the fourth
 * over Terminus's cap); the two chapter headings' icons and strings ("What
 * rent takes, district by district", "The revenue myth, and the districts
 * side by side"); and the adapter's strings that fed them (adapt_hood.ts:
 * hero_note, support_label, support_note, rail, map_note, compare, myth,
 * provenance_line, and the districts' verdict, blurb, tags, character,
 * walkability, price_tier, demographics and cell_href). The adapter's
 * `best_trades` stays as it is, the slug fault recorded (QUEUE
 * bug:district-revenue-dead), unread by this body: `04 works` stays blocked
 * on item 70 (ruling d).
 *
 * NULL-GUARDS: every card returns null when its builder does, and a band is
 * drawn when either of its cards exists; the chapter breaks are fixed "01"
 * and "02" (8.8's own two) and each stands over a card that always draws on
 * an admitted city (the rank on every one, the seat on every one).
 */
import * as React from "react";
import { spineHoodSeed } from "@/lib/spine-seeds";
import { Movement, Band } from "@/components/spine/kit";
import { SpineShell } from "@/components/spine/shell";
import { COPY } from "@/lib/spine/copy";
import { buildHoodTake } from "@/lib/spine/hood_take_rows";
import { buildHoodRank } from "@/lib/spine/hood_rank_rows";
import { buildHoodPremium } from "@/lib/spine/hood_premium_rows";
import { buildHoodCompare } from "@/lib/spine/hood_compare_rows";
import { buildHoodCharacter } from "@/lib/spine/hood_character_rows";
import { buildHoodCloseDoors } from "@/lib/spine/close_rows";
import { HoodTake, RankCard, PremiumCard, CompareCard, WorksSeat, CharacterCard, HoodClose } from "./blocks";
import type { LoudSeat } from "@/lib/spine/loud_seats";

/**
 * THE THREE LOUD MOMENTS, declared where they are lit or held (MODEL.md 8.8's
 * seat table, its seat one re-ruled 2026-09-19 to the spread; plan step 40).
 * Seat one is the take's AnswerCard in ./blocks.tsx (`tone="accent"`; the hub
 * prints the spread, a district page the district's own rent, one 40 either
 * way, so the hub and the district render each carry one accent), seat two is
 * turn one's, with no honest candidate under the no-featuring ruling and
 * MarkList's law, seat three the works seat, held empty on item 70. The census
 * prints this ledger; the loud-seats gate holds both renders to it. Literals
 * only, read from source (src/lib/spine/loud_seats.ts says why).
 */
export const LOUD_SEATS = [
  { seat: 1, card: "00 take", figure: "the spread, the dearest against the cheapest, 40; on a district page the district's own rent", state: "LIT", condition: "8.8's seat table, its 2026-09-19 bracket (RULED: 2.50x on London; the table's first words, the lightest district's multiple, are the 1.00x base the ruling replaced, printed as a companion); real data, one city, `--terra-text` at 40, the page's only 40" },
  { seat: 2, card: "turn one", figure: "none", state: "NO HONEST CANDIDATE", condition: "8.8: the 2026-09-10 no-featuring ruling forbids marking any one district loud in `01 rank` (every bar one neutral, every figure one ink), and MarkList's law keeps `02`'s headline at ink" },
  { seat: 3, card: "04 works", figure: "the leading trade's lift figure", state: "HELD EMPTY", condition: "8.8: HELD EMPTY on DATA-REQUIREMENTS item 70 (the calibration, 4 of 21 London rows within 30 percent); best_trades is real on the seven since the 2026-09-17 boundary fix, so the seat no longer waits on the slug fault; the drawn blocked seat until then" },
] as const satisfies readonly LoudSeat[];

export function SpineHoodBody({ data = spineHoodSeed, focus = null }: { data?: any; focus?: string | null }) {
  const d = data ?? spineHoodSeed;
  const slug: string = typeof d?.meta?.slug === "string" ? d.meta.slug : "";

  /* WHO IS HOME, ASKED ONCE, FROM THE BUILDERS THE CARDS DRAW FROM (the city
     view's idiom): every builder reads the files by the slug; the focused
     district passes through to the three cards it changes. */
  const take = buildHoodTake(slug, focus);
  const rank = buildHoodRank(slug);
  const premium = buildHoodPremium(slug);
  const compare = buildHoodCompare(slug, focus);
  const character = buildHoodCharacter(slug, focus);
  const doors = buildHoodCloseDoors(slug, focus);

  return (
    <SpineShell>
      <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
        {/* `00 take`, FULL WIDTH, the page's only 40 (8.8, loud 1): the archetype's own hero band carries the attribute the full-width gate reads. */}
        <HoodTake take={take} />
        {/* CHAPTER TURN ONE (8.8, "What rent costs, district by district"): the
            kit's Movement, the muted index and one plain heading, no icon (the
            old heading passed one and the kit voids it; the prop goes). */}
        <Movement index="01" heading={COPY.hoodChapters.rent} />
        {/* `01 rank | 02 premium`, 2-1 (8.8's provisional split, RULED BY
            MEASUREMENT on London at 1280, 768 and 375 with the probe and the
            page filter; the numbers are in the dispatch's report): the seven-row
            rent table wide, the visitor list narrow. Stacked until lg: at a
            tablet's equal halves the seven-row table's head names the reference
            district in four words over a 344px card and the list's figures
            would sit under a wrapped head. Both cards build on every admitted
            city (the rent on every district, the visitors on every district
            holding a figure, four or more), so the band holds two children. */}
        {rank || premium ? (
          <Band split="2-1" stack="lg">
            <RankCard rank={rank} />
            <PremiumCard premium={premium} />
          </Band>
        ) : null}
        {/* `03 compare`, FULL WIDTH, the page's second of three (8.8, R1),
            resting turn one: the table on CompareTable, which draws its own
            `data-wide-table` wrapper. */}
        <CompareCard compare={compare} />
        {/* CHAPTER TURN TWO (8.8, "What lifts revenue, and what the place is
            like"): one band, the blocked seat beside the prose. */}
        <Movement index="02" heading={COPY.hoodChapters.works} />
        {/* `04 works | 05 character`, 1-2, the seat narrow and the notes wide,
            RULED BY MEASUREMENT (8.4 rule 1: the taller card takes the wide
            side; 8.8's provisional 1-1 measured on London and the City of
            London with the probe and the page filter, the numbers in the
            dispatch's report): at 1-1 the seat, a Rail, one line and a foot,
            stands 149 tall at 1280 beside notes of 277 (the hub) and 296 (the
            City of London), so stretched level it carries 128 to 147 pixels of
            air under its foot, over the filter's 120 floor; at 1-2 its one line
            wraps to two in the 347 seat and the notes' one-line facts stay one
            line at 693, so the air falls under the floor. Stacked until lg: at
            a tablet's equal halves the notes wrap to 313 beside the seat's 171.
            8.8's order stands, the seat before the prose. The seat stands on
            every page; the notes on every district holding an authored row
            (London's seven), so the band holds two children; a city whose
            cheapest district holds no row would show the seat alone, LONE CARD
            by the rule. */}
        <Band split="1-2" stack="lg">
          <WorksSeat />
          <CharacterCard character={character} />
        </Band>
        {/* `06 close`, FULL WIDTH on the hero band (8.8, R1; the trade's
            precedent): the exit carries no break (PART 1). */}
        <Band hero><HoodClose doors={doors} /></Band>
      </main>
    </SpineShell>
  );
}
