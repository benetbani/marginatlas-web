/**
 * THE HOME PAGE, QUIET EDITORIAL (plan docs/superpowers/plans/2026-10-13-home-quiet-editorial.md; spec
 * docs/superpowers/specs/2026-10-13-home-quiet-editorial-design.md, approved 2026-10-13). His words that led to it: "The homepage
 * talks about London and fails all the premises of what a homepage should include", and "It fails on establishing brand, not elegant and
 * slaps infographics which is soooo wrong at so many levels." His choice: quiet editorial, the brand first, the atlas laid out as a
 * contents page, no charts.
 *
 * The frame, in the order the page reads:
 *   the search    the positioning line beside the compass mark, "The reference atlas of small-business earnings." (his pick, the
 *                 no-eyebrow rule's one named exception), above his h1 with its two moving words (HeroWords, one timer that stops), and
 *                 the picker under it, which follows the h1's case until the reader reaches it (HomeAsk; src/lib/home/picker_cases.ts)
 *   the contents  one wide zone, six numbered departments (HomeContents, the Department form): countries, cities, trades, tools,
 *                 reading, how it is made, each member chosen by a rule read from the code (src/lib/home/contents.ts)
 *   Pro           only while the paywall's switch is on, quiet (ruling 23), after the contents
 *   the band      one solid statement on the brand terracotta at full strength, white, one sentence and one link to the method
 *                 (HomeBand), the page's one loud seat, lit by its ground
 * then the colophon: the licence line, Sources and licences, Report a mistake, the corrections log and status (HomeColophon; no checked
 * date, the plan's Q3 ruled B: the home prints no register figure). No worked example, proofs, counts, city rows or where-to-next list:
 * each left with plan 2026-10-13, Task 7A, its tests with it. Each level is a zone (src/components/spine/zones.tsx);
 * tests/trust/home_shape.test.ts holds the order.
 *
 * Drawn by the root route's flagged branch (`isHomeReformEnabled()`), the harness surface `home` (page `home-gb`).
 */
import * as React from "react";
import { Zone, zoneTone, type ZoneSplit } from "@/components/spine/zones";
import { LogoMark } from "@/components/brand/LogoMark";
import { isPaywallOn } from "@/lib/feature_flags";
import { ProBand } from "./ProBand";
import { HomeAsk } from "./HomeAsk";
import { HomeContents } from "./HomeContents";
import { HomeBand } from "./HomeBand";
import { HomeColophon } from "./HomeColophon";
import { buildContents } from "@/lib/home/contents";
import { homePickerCases } from "@/lib/home/picker_cases";
import { HERO_BUSINESSES, HERO_CITIES } from "@/lib/hero-words";
import { COPY } from "@/lib/spine/copy";
import type { LoudSeat } from "@/lib/spine/loud_seats";

/**
 * THE THREE LOUD MOMENTS (MODEL.md PART 6; plan 2026-10-13 home-quiet-editorial; the spec's sections 3 and 4): the band, lit by its ground
 * (FIELD: the brand terracotta is the moment, its words white); the contents and the colophon hold none. The question's two moving words
 * are his h1's red (data-founder-accent), never a seat. Literals only, read from source (src/lib/spine/loud_seats.ts says why).
 */
export const LOUD_SEATS = [
  { seat: 1, card: "contents", figure: "none: the six departments are doors, a trade row's own figure in ink", state: "NO HONEST CANDIDATE", condition: "plan 2026-10-13, home quiet editorial (the spec's section 2, item 3): his choice of 2026-10-13, the atlas as a contents page, no charts; a door holds no lit figure" },
  { seat: 2, card: "band", id: "band", figure: "the band, one solid statement on the brand terracotta, its words white", state: "FIELD", condition: "plan 2026-10-13, home quiet editorial (the spec's section 2, item 4): his decision of 2026-10-13, one solid statement in the brand terracotta at full strength; the zone is the seat's moment and holds no figure" },
  { seat: 3, card: "colophon", figure: "none: the colophon holds the licence line and the links", state: "NO HONEST CANDIDATE", condition: "plan 2026-10-13, home quiet editorial (the spec's section 2, item 5): the page ends quiet" },
] as const satisfies readonly LoudSeat[];

/** The search: the positioning line, then the question and the picker that follows it (HomeAsk). Left-aligned, as every band page's text
 *  is. THE POSITIONING LINE (the spec's section 2, item 1; his pick of 2026-10-13): the category the site owns, a serious line at the head
 *  rung beside the compass mark in the brand terracotta, never a small capitals kicker (scripts/verify_no_eyebrow.ts names it the rule's one
 *  exception); 16 under it to the question, 24 from 1024. THE QUESTION IS ASKED ONCE (his instruction of 2026-10-07): the h1 asks it, so
 *  the picker draws no heading, and its fields follow the h1's case. */
/** His words with each hyphenated compound held on one line (the final review's M2: at 375 the line broke "small-|business"); the words
 *  and their order are unchanged, only the break is held. */
function keepCompounds(text: string): React.ReactNode[] {
  return text.split(/(\S+-\S+)/).filter((part) => part !== "").map((part, i) => (/\S-\S/.test(part) ? <span key={i} className="whitespace-nowrap">{part}</span> : part));
}

function HomeSearch() {
  const C = COPY.home;
  return (
    <div data-hero="1">
      <section id="search" className="flex flex-col">
        <p data-positioning="" className="mb-4 flex items-center gap-3 text-[length:var(--t-head)] font-semibold leading-7 text-[var(--c-ink)] lg:mb-6">
          <LogoMark size={24} className="shrink-0 text-[var(--terra-full)]" />
          <span>{keepCompounds(C.positioning)}</span>
        </p>
        <HomeAsk lead={C.h1.lead} middle={C.h1.middle} businesses={HERO_BUSINESSES} cities={HERO_CITIES} cases={homePickerCases()} />
      </section>
    </div>
  );
}

export function SpineHomeBody({ data = null }: { data?: { iso2?: string } | null } = {}) {
  /* `data` stays in the signature for the root route's and the harness's call ({ iso2: "GB" }); the home reads nothing from it since plan
     2026-10-13: each department's rule reads its own lists (src/lib/home/contents.ts). */
  void data;
  const contents = buildContents();
  /* Each zone one line, so tests/trust/home_shape.test.ts reads its split and its body together. The band draws its own zone on the
     terracotta (HomeBand); Pro only with the paywall's switch on. */
  const zones: Array<{ key: string; split: ZoneSplit; tone?: "terra"; label: string; body: React.ReactNode[] }> = [
    { key: "search", split: "wide", label: COPY.home.searchLabel, body: [<HomeSearch key="search" />] },
    { key: "contents", split: "wide", label: COPY.home.contents.label, body: [<HomeContents key="contents" contents={contents} />] },
    ...(isPaywallOn() ? [{ key: "pro", split: "2-1" as ZoneSplit, label: COPY.home.pro.kicker, body: [<ProBand key="pro" />] }] : []),
    { key: "band", split: "wide" as ZoneSplit, tone: "terra" as const, label: COPY.home.band.label, body: [<HomeBand key="band" />] },
  ];
  /* THE TONES ALTERNATE OVER THE ZONES THAT ARE NOT THE BAND (critique section 7 of plan 2026-10-10): the search takes the tint, the
     contents the paper, Pro the tint again when it draws; the band draws its own zone on the terracotta. */
  const toned = zones.filter((z) => z.tone !== "terra");
  return (
    <>
      <div data-spine-body data-composition="zones">
        {zones.map((z) =>
          z.tone === "terra" ? (
            <React.Fragment key={z.key}>{z.body}</React.Fragment>
          ) : (
            <Zone key={z.key} tone={zoneTone(toned.indexOf(z))} split={z.split} label={z.label}>
              {z.body}
            </Zone>
          ),
        )}
      </div>
      {/* THE COLOPHON (the spec's section 2, item 5): the licence line and the page's links; no checked date (the plan's Q3, ruled B: the home prints no register figure, src/lib/spine/checked.ts). */}
      <HomeColophon />
    </>
  );
}
