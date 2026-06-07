/**
 * Buy-or-start page - /[country]/[geo]/[industry]/buy-or-start.
 *
 * "Is it smarter to BUY an existing [business] in [place] or START one fresh?" A
 * focused, single-column data tool that leads with the question and the two
 * headline cash figures (the cash to start fresh and the modeled cash to buy an
 * existing one), sets them side by side with the time to positive cash flow and
 * the risk read on each path, and spells out the honest catch on both sides. It
 * is a dedicated surface for a high-intent question a would-be owner asks, split
 * out of the cell page so it can answer that one question cleanly and link back to
 * the full economics and the full cost-to-open breakdown.
 *
 * The server data builder (src/lib/open/buy_vs_start.ts) does ALL the work. The
 * START side is read straight off buildOpeningPage, which reuses the EXACT
 * functions the cell page uses, so every shared number agrees; the BUY side is a
 * modeled earnings multiple on the cell's live owner take-home, clearly labelled.
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
import { BuyVsStartHero } from "@/components/buy/BuyVsStartHero";
import { BuyVsStartCompare } from "@/components/buy/BuyVsStartCompare";
import { BuyVsStartCatches } from "@/components/buy/BuyVsStartCatches";

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
 * Every entry here MUST resolve to a trusted local cell, because buildBuyVsStart
 * reads the START side off buildOpeningPage, which self-omits (and this route
 * notFound()s) for any cell that is not a trusted local measurement. The cell page
 * prerenders some country-aggregate (geo == country) and region geos that render
 * fine as a cell page but are NOT trusted local cells (gb/gb, es511, de/de, fr/fr,
 * it/it, jp/jp), so this list deliberately uses the trusted city-level geo for
 * every non-US flagship instead. That keeps all 20 URLs rendering instead of
 * prerendering to a 404; every other page renders on demand via dynamicParams +
 * the daily revalidate above.
 *
 * This list is IDENTICAL to the opening route's list (the two routes share a geo
 * slate). Verified end to end with scripts/audit/dryrun_flagship_static_params.ts
 * (each entry returns a non-null buildBuyVsStart). Keep the two lists in sync by
 * hand; re-run that dry-run after any change.
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
    { country: "de", geo: "de21",       industry: "fabricated-metal-mfg" },
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
  const page = await buildBuyVsStart({ country, geo, industry });
  if (!page) return { title: "Page not found" };

  const lower = page.businessName.toLowerCase();
  const title = `Buy or start a ${lower} in ${page.placeName}`;
  const startCash = fmtUSD(page.start.cashNeededUsd);
  const buyCash = fmtUSD(page.buy.cashNeededUsd);
  const desc = `Is it smarter to buy an existing ${lower} in ${page.placeName} or start one fresh? About ${startCash} to start, ${buyCash} to buy in. The cash, the wait, and the honest catch on both sides.`;
  const canonical = `/${country.toLowerCase()}/${geo.toLowerCase()}/${industry.toLowerCase()}/buy-or-start`;
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

export default async function BuyOrStartRoutePage({
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

  return (
    <div className="mx-auto max-w-3xl pb-16">
      <BuyVsStartHero page={page} />
      <BuyVsStartCompare page={page} />
      <BuyVsStartCatches page={page} />
    </div>
  );
}
