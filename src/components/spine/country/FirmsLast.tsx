/**
 * WHERE NEW FIRMS LAST, ON THE UK PAGE (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 4; the home's spec of
 * 2026-10-09, section 6: the ranking moves from the home to /gb's chapter 04, "The first years", a level after the chapter's first,
 * beside which trades fail most). The lead city's share of its 2019 firms still trading five years on, the card's one figure at 30 in
 * ink (quiet: /gb's three loud moments are its own, LOUD_SEATS in country-view.tsx), then the UK's cities as the site's bar list,
 * highest first, each a door to its city page, the lead's bar marked by weight (ink2, BarList's `quiet`; it leads a measured
 * ranking), a tick at the UK's own share keyed once under the list. The bars' far end is the whole, 100. Not a spread (clause 40):
 * one cohort's five-year share a city. Every figure from src/lib/home/firms_last.ts, stamped.
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import { Focal } from "@/components/spine/country/focal";
import { BarList } from "@/components/spine/charts/BarList";
import { COPY } from "@/lib/spine/copy";
import type { FirmsLast as FirmsLastData } from "@/lib/home/firms_last";

/** Of 100: the bars' far end is the whole. */
const WHOLE = 100;

export function FirmsLast({ last }: { last: FirmsLastData }) {
  const C = COPY.home.firmsLast;
  return (
    <Box id="firms-last" className="flex flex-col">
      <Rail icon="ranking" kicker={C.kicker} />
      <Focal figure={last.lead.figure} words={last.lead.words} prov={last.lead.prov} />
      <BarList items={last.rows.map((r) => ({ key: r.key, label: r.name, value: r.value, display: r.display, href: r.href, prov: r.prov }))} max={WHOLE} look="plain" mark={last.lead.key} fill quiet reference={last.uk} ariaUnit={C.aria} />
    </Box>
  );
}
