/**
 * WHERE NEW BUSINESSES OPEN, /new-businesses (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 5; the home's spec of
 * 2026-10-09, section 6, approved as written: "one new page, /new-businesses, h1 'Where new businesses open', beside the US restaurants
 * as the pair stands today"). The two sections the home printed until that plan, published and counted figures from outside the UK,
 * re-homed on a page of their own so the home reads as one case: where new companies open in Latin America and Africa beside where US
 * restaurants grew and shrank (src/lib/home/new_companies.ts, src/lib/home/us_restaurants.ts, each from its slice in data/home).
 *
 * The frame, in order: its question as the h1, alone in the hero band (the one full width); the pair, open sections, each its own
 * height (not `even`: a stretched list or table stands a blank at its foot); where to next, doors only, at two thirds (the zones' LONE
 * rule); the sources line, the link alone (no UK licence covers these figures); Report a mistake. One URL added and none renamed; not
 * indexed until he rules which pages outside the UK are (open since 2026-10-09). Drawn by src/app/(site)/new-businesses/page.tsx and
 * the harness surface `openings` (page `openings-world`).
 */
import * as React from "react";
import { Zone, zoneTone, type ZoneSplit } from "@/components/spine/zones";
import { NewCompanies } from "./NewCompanies";
import { UsRestaurants } from "./UsRestaurants";
import { buildNewCompanies } from "@/lib/home/new_companies";
import { buildUsRestaurants } from "@/lib/home/us_restaurants";
import { WhereNext } from "@/components/spine/WhereNext";
import { nextDoors } from "@/lib/home/next_doors";
import { ReportFoot } from "@/components/spine/ReportFoot";
import { UK_SOURCES_FOOT } from "@/lib/spine/uk_sources";
import { COPY } from "@/lib/spine/copy";
import type { LoudSeat } from "@/lib/spine/loud_seats";

/** This page's own address, for its doors and its foot. */
export const OPENINGS_PATH = "/new-businesses";

/**
 * THE LOUD MOMENTS (MODEL.md PART 6; the spec's section 8): one lit, the US metro that added the most full-service restaurants, which
 * leads a measured ranking (the home's seat 3 until the section moved); the new companies' card figure is the UK's own for scale and
 * ranks nothing; the exit holds doors. Literals only, read from source (src/lib/spine/loud_seats.ts says why).
 */
export const LOUD_SEATS = [
  { seat: 1, card: "us-restaurants", id: "us-restaurants", figure: "the full-service restaurants the leading US metro added since the first year counted, at 30", state: "LIT", condition: "plan 2026-10-09, home introduction, Task 5 (the home's seat 3 of plan 2026-10-08 before it): the metro leads a measured ranking of 44 by restaurants added (buildUsRestaurants; a tie features nobody and the section is not drawn), `--terra-text` at 30 through Focal's accent" },
  { seat: 2, card: "new-companies", figure: "none: the UK's figure is a yardstick that ranks nothing", state: "NO HONEST CANDIDATE", condition: "plan 2026-10-09, home introduction: the card's figure is the UK's own for scale; each region's leader leads a list of its own region, and featuring one would rank the two regions together" },
  { seat: 3, card: "next", figure: "none: the exit holds doors", state: "NO HONEST CANDIDATE", condition: "plan 2026-10-09, home introduction: where to next is doors with no figure; the page ends quiet (MODEL PART 6)" },
] as const satisfies readonly LoudSeat[];

/** The page's question, alone in the hero band. */
function OpeningsHead() {
  return (
    <div data-hero="1">
      <h1 id="headline" data-typography="custom" className="text-balance text-[length:var(--t-section)] font-semibold leading-[1.05] tracking-tight text-[var(--c-ink)] sm:text-[length:var(--t-answer)]">
        {COPY.openings.h1}
      </h1>
    </div>
  );
}

export function SpineOpeningsBody() {
  const nc = buildNewCompanies();
  const us = buildUsRestaurants();
  const zones: Array<{ key: string; split: ZoneSplit; even?: boolean; label: string; body: React.ReactNode[] }> = [
    { key: "head", split: "wide", label: COPY.openings.h1, body: [<OpeningsHead key="head" />] },
    ...(nc || us ? [{ key: "pair", split: "1-1" as ZoneSplit, even: true, label: COPY.openings.pairLabel, body: [...(nc ? [<NewCompanies key="new-companies" nc={nc} />] : []), ...(us ? [<UsRestaurants key="us-restaurants" us={us} />] : [])] }] : []),
    { key: "next", split: "1-1", label: COPY.home.next.title, body: [<WhereNext key="next" title={COPY.home.next.title} doors={nextDoors(OPENINGS_PATH)} />] },
  ];
  return (
    <>
      <div data-spine-body data-composition="zones">
        {zones.map((z, i) => (
          <Zone key={z.key} tone={zoneTone(i)} split={z.split} even={z.even} label={z.label}>
            {z.body}
          </Zone>
        ))}
      </div>
      {/* THE SOURCES LINE, THE LINK ALONE: these figures come from the two sources outside the UK that About the figures names; the
          UK's licence sentence (SourcesFoot) does not cover them. Its 24px under the last zone is padding, as SourcesFoot's is, so the foot
          lines' band (globals.css, THE ZONES) paints it (critique pass 3, fix round D2, item P2.5). */}
      <p data-sources-foot className="pt-6 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">
        <a href={UK_SOURCES_FOOT.href} className="tap-y whitespace-nowrap underline decoration-[var(--c-line-strong)] underline-offset-2 transition-colors hover:text-[var(--c-ink)]">
          {UK_SOURCES_FOOT.link}
        </a>
      </p>
      <ReportFoot path={OPENINGS_PATH} />
    </>
  );
}
