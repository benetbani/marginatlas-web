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
import { Zone } from "@/components/spine/zones";
import { SpineShell } from "@/components/spine/shell";
import { COPY } from "@/lib/spine/copy";
import { buildHoodTake } from "@/lib/spine/hood_take_rows";
import { buildHoodRank } from "@/lib/spine/hood_rank_rows";
import { buildHoodCharacter } from "@/lib/spine/hood_character_rows";
import { buildHoodCloseDoors } from "@/lib/spine/close_rows";
import { HoodTake, RankCard, CharacterCard, HoodClose } from "./blocks";
import type { LoudSeat } from "@/lib/spine/loud_seats";
import { Crumbs } from "@/components/spine/Crumbs";
import { buildHoodCrumbs } from "@/lib/spine/crumb_rows";
import { SourcesFoot } from "@/components/spine/SourcesFoot";
import { ReportFoot } from "@/components/spine/ReportFoot";

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
  { seat: 3, card: "04 works", figure: "the leading trade's lift figure", state: "NO HONEST CANDIDATE", condition: "8.8: the card LEFT THE PAGE 2026-09-24 (the goal's NEVER list, no 'not gathered yet' card on a UK page); the lift figure waits on DATA-REQUIREMENTS item 70 (the calibration, 4 of 21 London rows within 30 percent) and the card returns with it" },
] as const satisfies readonly LoudSeat[];

export function SpineHoodBody({ data = spineHoodSeed, focus = null }: { data?: any; focus?: string | null }) {
  const d = data ?? spineHoodSeed;
  const slug: string = typeof d?.meta?.slug === "string" ? d.meta.slug : "";

  /* WHO IS HOME, ASKED ONCE, FROM THE BUILDERS THE CARDS DRAW FROM (the city
     view's idiom): every builder reads the files by the slug; the focused
     district passes through to the three cards it changes. */
  const take = buildHoodTake(slug, focus);
  const rank = buildHoodRank(slug);
  /* `02 premium` IS WITHHELD UNTIL MEASURED (his interview of 2026-09-26, answer 36; QUEUE hood:visitor-figures; milestone 1, M6): its
     "visitors a year for every resident" failed against its own file's notes (the City of London at 22 a resident is about 176,000
     visitors a year; St Paul's alone logged about 1.5 million in 2024) and nothing measured replaces it yet (DATA-REQUIREMENTS item
     91). The builder and the card stay for the day a measured count lands; the district doors moved onto `01 rank`'s rows. */
  const character = buildHoodCharacter(slug, focus);
  const doors = buildHoodCloseDoors(slug, focus);

  /* THE BAND PAGE (2026-10-04, his "push forward man" after the United Kingdom's band page went live; MODEL.md PART 10): each level
     a zone, the tone by its place, the sections open on it. The answer; 01 the rent table beside the visitors (2-1, one under the
     other until 1024: at a tablet's halves the table's head names the reference district in four words over 344px); 02 the notes
     beside the exit (2-1, the same), or the exit alone where the district holds no notes. The bento's measurements are in git (this
     file before 2026-10-04). */
  return (
    <SpineShell>
      {/* NO MAIN AND NO GUTTER OF ITS OWN (the goal's A13, 2026-09-24): every route that draws this body wraps it in SiteChrome. */}
      {/* THE TRAIL BACK UP (Crumbs.tsx, 2026-09-22): the real hierarchy, every step resolved through page_targets.ts, the last step the page itself. */}
      <Crumbs items={buildHoodCrumbs(slug, focus)} />
      <div className="-mx-2 md:mx-0" data-spine-body data-composition="zones">
        <Zone split="wide" label="The answer">
          <HoodTake take={take} />
        </Zone>
        <Zone split="2-1" stack="lg" label={COPY.hoodChapters.rent} chapter={{ index: "01", heading: COPY.hoodChapters.rent }}>
          {rank ? <RankCard rank={rank} /> : null}
        </Zone>
        {character ? (
          <Zone split="2-1" stack="lg" label={COPY.hoodChapters.works} chapter={{ index: "02", heading: COPY.hoodChapters.works }}>
            <CharacterCard character={character} />
            <HoodClose doors={doors} />
          </Zone>
        ) : (
          <Zone split="wide" label={COPY.close.kicker}>
            <HoodClose doors={doors} />
          </Zone>
        )}
      </div>
      {/* THE UK'S SOURCES, ONE LINE UNDER THE BANDS (plan 06, task B4): the licence's sentence and the link to the one sources page; nothing off the UK. */}
      <SourcesFoot iso2={d?.meta?.iso2} />
      {/* REPORT A MISTAKE (masterplan step 31): the hub's or the district's own path. No checked line: the district rents are
         estimates from each district's character (the seed), which no export dates (src/lib/spine/checked.ts). */}
      <ReportFoot path={slug ? `/cities/${slug}/neighborhoods${focus ? `/${focus}` : ""}` : null} />
    </SpineShell>
  );
}
