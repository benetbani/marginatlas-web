/**
 * Opening page - /[country]/[geo]/[industry]/opening.
 *
 * "What it costs to open a [business] in [place]." A focused, single-column data
 * tool that leads with the answer (the total one-time cost to open), sets the
 * break-in rating beside it, lists the four entry parts, ties the payback to the
 * owner take-home, and contrasts the same business elsewhere and other businesses
 * here. It is a dedicated surface for the highest-intent question a would-be
 * owner asks, split out of the cell page so it can answer that one question
 * cleanly and link back to the full economics.
 *
 * The server data builder (src/lib/open/opening_page.ts) does ALL the work and
 * reuses the EXACT functions the cell page uses, so every shared number agrees.
 * This file is the route shell: resolve params, call buildOpeningPage, notFound()
 * on a miss (never a stub), and compose the open/ components. It lives at its own
 * path with its own single-column layout, so it does not touch the canonical
 * cell-page section skeleton and is outside the section-order gate by
 * construction.
 *
 * ISR: a small bounded flagship set is prebuilt at build time; everything else
 * renders on demand via dynamicParams + the daily revalidate, so this route never
 * balloons the static build (the cell page already prerenders ~600 pages; this
 * adds only a flagship handful).
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures, tokens
 * only.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildOpeningPage } from "@/lib/open/opening_page";
import { fmtUSD } from "@/components/board/format";
import { OpeningHero } from "@/components/open/OpeningHero";
import { OpeningChecklist } from "@/components/open/OpeningChecklist";
import { OpeningPayback } from "@/components/open/OpeningPayback";
import { OpeningComparisons } from "@/components/open/OpeningComparisons";
import { BreakInWhy } from "@/components/board/BreakInScore";
import { SiteChrome } from "@/components/SiteChrome";

export const revalidate = 86400;
export const dynamicParams = true;
// Match the cell page's function budget: cold cells_master queries plus the
// across-cities slate can take a few seconds before warm-up; the builder is
// fully budget-wrapped, but raise the ceiling so a cold render is never dropped.
export const maxDuration = 60;

type Params = { country: string; geo: string; industry: string };

/**
 * Prerender ONLY a small bounded flagship set so the static build stays cheap.
 * Every entry here MUST resolve to a trusted local cell, because buildOpeningPage
 * self-omits (and this route notFound()s) for any cell that is not a trusted local
 * measurement. The cell page prerenders some country-aggregate (geo == country)
 * and region geos that render fine as a cell page but are NOT trusted local cells
 * (gb/gb, es511, de/de, fr/fr, it/it, jp/jp), so this list deliberately uses the
 * trusted city-level geo for every non-US flagship instead. That keeps all 20
 * URLs rendering instead of prerendering to a 404; every other opening page
 * renders on demand via dynamicParams + the daily revalidate above.
 *
 * Verified end to end with scripts/audit/dryrun_flagship_static_params.ts (each
 * entry returns a non-null buildOpeningPage). Keep this list and the buy-or-start
 * route's identical list in sync by hand; re-run that dry-run after any change.
 */
export async function generateStaticParams(): Promise<Params[]> {
  return [
    // US restaurants, hotels, and software resolve a trusted local cell at state
    // level; cafes / hairdressers / auto-repair are extrapolated at state level
    // and only resolve at city level, so those use the metro geo. US
    // legal-services is extrapolated everywhere, so the legal flagship is the
    // curated gb/london one below.
    { country: "us", geo: "california",  industry: "software-development" },
    { country: "us", geo: "california",  industry: "restaurants" },
    { country: "us", geo: "new-york",    industry: "restaurants" },
    { country: "us", geo: "texas",       industry: "restaurants" },
    { country: "us", geo: "florida",     industry: "restaurants" },
    { country: "us", geo: "california",  industry: "hotels-lodging" },
    { country: "us", geo: "new-york",    industry: "hotels-lodging" },
    { country: "us", geo: "los-angeles", industry: "cafes-coffee" },
    { country: "us", geo: "los-angeles", industry: "hairdressers-beauty" },
    { country: "us", geo: "los-angeles", industry: "auto-repair-shops" },

    // Non-US flagships at trusted city / region resolution. The cell page's
    // featured aggregates (gb/gb legal, es511 restaurants, de/de, fr/fr, it/it,
    // jp/jp) do not resolve a trusted local cell, so the city geo is used here.
    { country: "gb", geo: "london",     industry: "legal-services" },
    { country: "gb", geo: "london",     industry: "restaurants" },
    { country: "gb", geo: "london",     industry: "cafes-coffee" },
    { country: "de", geo: "de21",       industry: "metal-fabrication-machine-shops" },
    { country: "de", geo: "berlin",     industry: "restaurants" },
    { country: "es", geo: "barcelona",  industry: "restaurants" },
    { country: "mx", geo: "mx-roo",     industry: "hotels-lodging" },
    { country: "fr", geo: "paris",      industry: "restaurants" },
    { country: "it", geo: "rome",       industry: "restaurants" },
    { country: "jp", geo: "tokyo",      industry: "restaurants" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { country, geo, industry } = await params;
  const page = await buildOpeningPage({ country, geo, industry });
  if (!page) return { title: "Page not found" };

  const lower = page.businessName.toLowerCase();
  const title = `What it costs to open a ${lower} in ${page.placeName}`;
  const total = fmtUSD(page.totalToOpenUsd);
  const score = page.breakIn
    ? `break-in rating ${page.breakIn.score}/100`
    : "with a clear read on the entry cost";
  const desc = `Capital, permits, time, and first hires to open a ${lower} in ${page.placeName}: about ${total} to open, ${score}.`;
  const canonical = `/${country.toLowerCase()}/${geo.toLowerCase()}/${industry.toLowerCase()}/opening`;
  const ogPath = `/og/cell?country=${encodeURIComponent(
    country,
  )}&geo=${encodeURIComponent(geo)}&industry=${encodeURIComponent(industry)}`;

  return {
    title,
    description: desc,
    alternates: { canonical },
    openGraph: {
      title,
      description: desc,
      url: canonical,
      images: [{ url: ogPath, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [ogPath],
    },
  };
}

async function OpeningRoutePageBody({
  params,
}: {
  params: Promise<Params>;
}) {
  const { country, geo, industry } = await params;

  // The builder returns null when the cell does not resolve or is not a trusted
  // local measurement of the requested activity. notFound() in that case, never a
  // stub, so the page can only ever render numbers it can stand behind.
  const page = await buildOpeningPage({ country, geo, industry });
  if (!page) notFound();

  /* `relative`, 2026-08-17. AtlasFrame paints from position:fixed layers at
     z-index 0, which by CSS painting order go above every in-flow
     non-positioned descendant, so this whole route was covered by the frame's
     opaque base. One positioned ancestor puts the column back in front. The
     section components below still carry no surface of their own, which is a
     separate defect in another agent's tree. */
  return (
    <div className="relative mx-auto max-w-3xl pb-16">
      <OpeningHero page={page} />
      <OpeningPayback page={page} />
      {/* The driver breakdown for the score the hero prints. It was reachable
          only through the cell board's "What it takes to open" section, and when
          that section was deleted on 2026-08-18 for being computed and read by
          nobody, this went with it: from then until now the 0-100 rating showed
          on this page and on the cell masthead with no breakdown anywhere on the
          site. It belongs here rather than back on the cell page, because this is
          the surface that prints the raw number with nothing but a band word
          beside it, this page IS the section it used to sit in, and the cell page
          already gives the same score a scale, a band and a hint sentence in the
          honest-take block. showPayback={false}: <OpeningPayback> directly above
          carries that sentence already, with the take-home attached. */}
      <BreakInWhy rating={page.breakIn} showPayback={false} />
      <OpeningChecklist page={page} />
      <OpeningComparisons page={page} />
    </div>
  );
}

/* Chrome is opted into, not inherited. The site masthead, <main> and footer
   moved out of the root layout into <SiteChrome> so that the spine-2 trade
   page , which carries its own , can render without them. This tree sits
   outside src/app/(site)/ because it holds both kinds of route, so each page
   here asks for the chrome explicitly. */
export default function OpeningRoutePage(props: Parameters<typeof OpeningRoutePageBody>[0]) {
  return (
    <SiteChrome>
      <OpeningRoutePageBody {...props} />
    </SiteChrome>
  );
}
