/**
 * THE HOME PAGE ON THE BAND PAGE (milestone 3, masterplan step 32; his interview of 2026-09-26: 11, "a place-and-trade search,
 * then the UK's headline answers; the recommender later, ranked by one real figure, never a composite"; 23, "a quiet band after the
 * search and the UK answers: what Pro opens, the price, one button"; milestone 3, the two criticised sections replaced and the page
 * built to the UK page's standard; 2026-08-16, the hero's h1, "it was just perfect"; 2026-10-04, the band page).
 *
 * The frame, in the order the page reads: the h1 he kept, with its rotating words, and the search (step 33 makes it land on pages
 * that exist, UK first); then the UK's answers (step 34), the UK's cities and what the atlas holds (step 35), Pro said once and
 * quietly while the paywall's switch is on (step 35), the notebook and the newsletter (step 36). Each level is a zone
 * (src/components/spine/zones.tsx); a level that has nothing to draw is not listed, so no band stands empty. No chapters: a home
 * page is not a reading in chapters. One 40 on the page, at the UK's answer (PART 4), when step 34 seats it.
 *
 * Drawn by the root route's flagged branch (`isHomeReformEnabled()`), the harness surface `home` (page `home-gb`).
 */
import * as React from "react";
import { Zone, zoneTone, type ZoneSplit } from "@/components/spine/zones";
import { Box, Rail } from "@/components/spine/kit";
import { Focal } from "@/components/spine/country/focal";
import { FactRows } from "@/components/spine/archetypes/FactRows";
import { SegmentBar } from "@/components/spine/archetypes/SegmentBar";
import { provAttrs } from "@/lib/spine/provenance";
import { buildHomeAnswers, type HomeAnswer } from "@/lib/spine/home_answers";
import { NavigatorForm } from "@/components/NavigatorForm";
import { RotatingWord } from "@/components/RotatingWord";
import { HERO_BUSINESSES, HERO_CITIES } from "@/lib/hero-words";
import { COPY } from "@/lib/spine/copy";
import { ReportFoot } from "@/components/spine/ReportFoot";
import type { LoudSeat } from "@/lib/spine/loud_seats";

/**
 * THE THREE LOUD MOMENTS (MODEL.md PART 6; the masterplan's step 32: the UK's answer at 40, the search's button, the Pro band's
 * button), each checked at step 37. The answer is lit since step 34; the search's button is drawn in the hero's own red
 * (atlas-700, not the accent token) until step 37 weighs it, and the Pro band draws only with the paywall's switch on. Literals
 * only, read from source (src/lib/spine/loud_seats.ts says why).
 */
export const LOUD_SEATS = [
  { seat: 1, card: "00 answer", figure: "the UK's total effective tax burden on a sole trader's profit, at 40", state: "LIT", condition: "masterplan step 34: the same figure /gb's masthead prints (buildHeroBoard), `--terra-text` at 40, the page's only 40" },
  { seat: 2, card: "00 search", figure: "the search's button", state: "HELD EMPTY", condition: "the button keeps the live hero's atlas-700, which is not the accent token; masterplan step 37 decides whether it takes the accent" },
  { seat: 3, card: "pro", figure: "the Pro band's button", state: "HELD EMPTY", condition: "ruling 23: drawn only while the paywall's switch is on (masterplan step 35); off in today's production" },
] as const satisfies readonly LoudSeat[];

/** The hero he kept: the visitor's own question, its business and its city rotating, then the search. Left-aligned, as every
 *  band page's text is (the page laws' ALIGNMENT): the words he ruled on are kept, the centring was the old page's. */
function HomeSearch() {
  const C = COPY.home;
  return (
    <div data-hero="1">
      <Box id="search" className="flex flex-col">
        <h1 className="font-display text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[var(--c-ink)] leading-[1.08]">
          {C.h1.lead}{" "}
          <span className="text-atlas-700">
            <RotatingWord words={HERO_BUSINESSES as unknown as string[]} interval={2000} />
          </span>{" "}
          {C.h1.middle}{" "}
          <span className="text-atlas-700">
            <RotatingWord words={HERO_CITIES as unknown as string[]} interval={2000} offset={1000} />
          </span>
          ?
        </h1>
        <p className="mt-3 max-w-2xl text-[length:var(--t-lead)] text-[var(--c-muted)]">{C.subtitle}</p>
        {/* The id the header's search reads: while this card is on screen the header keeps its own search hidden. */}
        <div id="home-search-anchor" className="relative z-30 mt-5 w-full">
          <NavigatorForm />
        </div>
      </Box>
    </div>
  );
}

/* THE UK'S ANSWERS, EACH A DOOR TO ITS SECTION OF /gb (masterplan step 34): the section's name and figure as /gb prints them
   (src/lib/spine/home_answers.ts), stamped with where the figure came from, the whole card the link (it keeps its box: a door).
   The tax burden takes the page's one 40 in the accent and the masthead's own bar; the trades and the years their 30 in ink and
   rows, /gb's first three trades and its curve's years before the last (clause 65: a figure is never alone; clause 64: one
   drawing on the level). Each card written out with its own id and archetypes, so the census and the coverage gate read it. */
const DOOR = "tap-y flex h-full flex-col text-[var(--c-ink)] no-underline";

function TaxAnswer({ a }: { a: HomeAnswer }) {
  return (
    <Box id="answer" keep className="flex flex-col">
      <a href={a.href} data-lands={a.lands} className={DOOR}>
        <Rail icon={a.icon} kicker={a.kicker} />
        <div className="mb-4">
          <div data-hero-figure className="fig text-[length:var(--t-answer)] leading-none text-[var(--terra-text)]" {...provAttrs(a.prov)}>
            {a.figure}
          </div>
          <p data-focal-words="" className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{a.words}</p>
        </div>
        {a.bar ? (
          <div data-answer-bar className="max-w-[28ch]">
            <SegmentBar bare label={a.bar.aria} value={a.bar.value} figure={a.figure} unit="" part={a.bar.part} rest={a.bar.rest} />
          </div>
        ) : null}
      </a>
    </Box>
  );
}

function TradesAnswer({ a }: { a: HomeAnswer }) {
  return (
    <Box id="trades" keep className="flex flex-col">
      <a href={a.href} data-lands={a.lands} className={DOOR}>
        <Rail icon={a.icon} kicker={a.kicker} />
        <Focal figure={a.figure} words={a.words} prov={a.prov} />
        <FactRows rows={(a.rows ?? []).map((r) => ({ key: r.key, label: r.label, value: r.value, icon: r.icon, prov: r.prov }))} />
      </a>
    </Box>
  );
}

function YearsAnswer({ a }: { a: HomeAnswer }) {
  return (
    <Box id="years" keep className="flex flex-col">
      <a href={a.href} data-lands={a.lands} className={DOOR}>
        <Rail icon={a.icon} kicker={a.kicker} />
        <Focal figure={a.figure} words={a.words} prov={a.prov} />
        <FactRows rows={(a.rows ?? []).map((r) => ({ key: r.key, label: r.label, value: r.value, prov: r.prov }))} />
      </a>
    </Box>
  );
}

function AnswerDoor({ a }: { a: HomeAnswer }) {
  return a.key === "answer" ? <TaxAnswer a={a} /> : a.key === "trades" ? <TradesAnswer a={a} /> : <YearsAnswer a={a} />;
}

export function SpineHomeBody({ data = null }: { data?: { iso2?: string } | null } = {}) {
  const answers = buildHomeAnswers(data?.iso2 ?? "GB");
  const zones: Array<{ key: string; split: ZoneSplit; label: string; body: React.ReactNode[] }> = [
    { key: "search", split: "wide", label: COPY.home.searchLabel, body: [<HomeSearch key="search" />] },
    /* THE UK'S ANSWERS, A LEVEL OF THREE (PART 10.5; masterplan step 34): the tax burden, what London's trades take, who is still
       trading, each a door to its section of /gb. */
    ...(answers.length ? [{ key: "answers", split: "1-1-1" as ZoneSplit, label: COPY.home.answersLabel, body: answers.map((a) => <AnswerDoor key={a.key} a={a} />) }] : []),
  ];
  return (
    <>
      <div className="-mx-2 md:mx-0" data-spine-body data-composition="zones">
        {zones.map((z, i) => (
          <Zone key={z.key} tone={zoneTone(i)} split={z.split} label={z.label}>
            {z.body}
          </Zone>
        ))}
      </div>
      {/* REPORT A MISTAKE (masterplan step 31), as under every spine page; no date is held for the home page. */}
      <ReportFoot path="/" />
    </>
  );
}
