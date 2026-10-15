/**
 * Buy-or-start page - /[country]/[geo]/[industry]/buy-or-start.
 *
 * "Is it smarter to BUY an existing [business] in [place] or START one fresh?" A
 * focused, single-column data tool that leads with the question and the two
 * headline cash figures (the cash to start fresh and the sale range to buy an
 * existing one), sets them side by side with the time to positive cash flow and
 * the risk read on each path, and spells out the honest catch on both sides. It
 * is a dedicated surface for a high-intent question a would-be owner asks, split
 * out of the cell page so it can answer that one question cleanly and link back to
 * the full economics and the full cost-to-open breakdown.
 *
 * The server data builder (src/lib/open/buy_vs_start.ts) does ALL the work. The
 * START side is read straight off buildOpeningPage, which reuses the EXACT
 * functions the cell page uses, so every shared number agrees; the BUY side is
 * the trade page's own "What one sells for" range in currency (the trade's shard
 * figures times the cell's live owner take-home, stamped, called an estimate),
 * or the card's stated line where the shard cannot price it.
 * This file is the route shell: resolve params, call buildBuyVsStart, notFound()
 * on a miss (never a stub), and compose the buy/ components. It lives at its own
 * path with its own single-column layout, so it does not touch the canonical
 * cell-page section skeleton and is outside the section-order gate by
 * construction.
 *
 * ISR: a small bounded flagship set is prebuilt at build time; everything else
 * renders on demand via dynamicParams + the daily revalidate, so this route never
 * balloons the static build.
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures, tokens
 * only.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildBuyVsStart } from "@/lib/open/buy_vs_start";
import { fmtUSD } from "@/components/board/format";
import { buyMetaDescription } from "@/lib/open/buy_side";
import { BuyVsStartHero } from "@/components/buy/BuyVsStartHero";
import { BuyVsStartCompare } from "@/components/buy/BuyVsStartCompare";
import { BuyVsStartCatches } from "@/components/buy/BuyVsStartCatches";
import { SiteChrome } from "@/components/SiteChrome";
import { robotsFor } from "@/lib/seo/indexable";
import { tradeCanonicalPath } from "@/lib/seo/alias_canonical";

export const revalidate = 86400;
export const dynamicParams = true;
// Match the cell page's function budget: cold cells_master queries can take a few
// seconds before warm-up; the builder is fully budget-wrapped (through the
// opening builder it wraps), but raise the ceiling so a cold render is never
// dropped.
export const maxDuration = 60;

type Params = { country: string; geo: string; industry: string };

/**
 * Prerender ONLY a small bounded flagship set so the static build stays cheap.
 * Each entry names a place and a trade this page can be asked at; whether it
 * DRAWS depends on buildBuyVsStart, which reads the START side off
 * buildOpeningPage, which self-omits (and this route notFound()s) for any cell
 * that is not a trusted local measurement with a row of its own. Counted from
 * production on 2026-10-15 (the typed-multiples investigation, section 1.3): FIVE of
 * these eight draw (California software and restaurants, New York, Texas and
 * Florida restaurants) and THREE answer "Page not found" (California and New York
 * hotels-lodging, Mexico hotels-lodging), because their rows hold a filled
 * revenue and the revenue-filled guard of 2026-09-19 (src/lib/cells/trust.ts)
 * refuses them. Dropping the three would change what the build prerenders, which
 * is his call, so they stay and are said here: an entry that answers "Page not
 * found" at build costs a 404 page and nothing else, and the route notFound()s
 * the same way on demand.
 *
 * The cell page prerenders some country-aggregate (geo == country) and region
 * geos that render fine as a cell page but are NOT trusted local cells (gb/gb,
 * es511, de/de, fr/fr, it/it, jp/jp), so this list uses the trusted city-level geo
 * for every non-US flagship instead; every other page renders on demand via
 * dynamicParams + the daily revalidate above.
 *
 * This list is IDENTICAL to the opening route's list (the two routes share a geo
 * slate). Keep the two lists in sync by hand. scripts/audit/dryrun_flagship_
 * static_params.ts reads each entry through the builder with live credentials
 * and prints which draw: re-run it after any change.
 *
 * TWENTY TO EIGHT, 2026-09-19 (QUEUE trust:revenue-filled): the opening route's
 * header says why; the same eight, in the same order.
 */
export async function generateStaticParams(): Promise<Params[]> {
  return [
    // US software and restaurants resolve a trusted local cell at state level
    // with a revenue of their own, and these five draw. The two US hotels-lodging
    // entries below do not: their rows hold a filled revenue, the 2026-09-19
    // guard refuses them, and they answer "Page not found" (see the header).
    // US legal-services is extrapolated everywhere and the London flagships
    // stand on filled rows, so no legal flagship prerenders today.
    { country: "us", geo: "california",  industry: "software-development" },
    { country: "us", geo: "california",  industry: "restaurants" },
    { country: "us", geo: "new-york",    industry: "restaurants" },
    { country: "us", geo: "texas",       industry: "restaurants" },
    { country: "us", geo: "florida",     industry: "restaurants" },
    { country: "us", geo: "california",  industry: "hotels-lodging" },
    { country: "us", geo: "new-york",    industry: "hotels-lodging" },

    // The one non-US flagship, at state level (tier P). Its row holds a filled
    // revenue, so it too answers "Page not found" (see the header). The cell
    // page's featured aggregates (gb/gb legal, es511 restaurants, de/de, fr/fr,
    // it/it, jp/jp) do not resolve a trusted local cell either.
    { country: "mx", geo: "mx-roo",     industry: "hotels-lodging" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { country, geo, industry } = await params;
  const page = await buildBuyVsStart({ country, geo, industry });
  if (!page) return { title: "Page not found" };

  const lower = page.businessName.toLowerCase();
  const title = `Buy or start a ${lower} in ${page.placeName}`;
  const startCash = fmtUSD(page.start.cashNeededUsd);
  /* The buy figure in the description is the trade's sale range, an estimate, built in src/lib/open/buy_side.ts (a gate runs it on a priced and an unpriced trade); where the shard cannot price it the description names the start cash alone. */
  const desc = buyMetaDescription(lower, page.placeName, startCash, page.buy);
  /* An alias names its live trade's buy-or-start page (P1-C, 2026-10-09; src/lib/seo/alias_canonical.ts). */
  const canonical = tradeCanonicalPath(country, geo, industry, "buy-or-start");
  const ogPath = `/og/cell?country=${encodeURIComponent(
    country,
  )}&geo=${encodeURIComponent(geo)}&industry=${encodeURIComponent(industry)}`;

  return {
    title,
    description: desc,
    alternates: { canonical },
    /* Its trade page's index status (P1-B of the page architecture, 2026-10-09); until then this page set no robots tag. */
    robots: robotsFor(canonical),
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

async function BuyOrStartRoutePageBody({
  params,
}: {
  params: Promise<Params>;
}) {
  const { country, geo, industry } = await params;

  // The builder returns null when the cell does not resolve, is not a trusted
  // local measurement of the requested activity, or has no defensible owner
  // take-home / cost-to-open to anchor the two sides. notFound() in that case,
  // never a stub, so the page can only ever render numbers it can stand behind.
  const page = await buildBuyVsStart({ country, geo, industry });
  if (!page) notFound();

  /* `relative`, 2026-08-17. AtlasFrame paints from position:fixed layers at
     z-index 0, which by CSS painting order go above every in-flow
     non-positioned descendant, so this whole route was covered by the frame's
     opaque base. One positioned ancestor puts the column back in front. The
     section components below still carry no surface of their own, which is a
     separate defect in another agent's tree. */
  return (
    <div className="relative mx-auto max-w-3xl pb-16">
      <BuyVsStartHero page={page} />
      <BuyVsStartCompare page={page} />
      <BuyVsStartCatches page={page} />
    </div>
  );
}

/* Chrome is opted into, not inherited. The site masthead, <main> and footer
   moved out of the root layout into <SiteChrome> so that the spine-2 trade
   page , which carries its own , can render without them. This tree sits
   outside src/app/(site)/ because it holds both kinds of route, so each page
   here asks for the chrome explicitly. */
export default function BuyOrStartRoutePage(props: Parameters<typeof BuyOrStartRoutePageBody>[0]) {
  return (
    <SiteChrome>
      <BuyOrStartRoutePageBody {...props} />
    </SiteChrome>
  );
}
