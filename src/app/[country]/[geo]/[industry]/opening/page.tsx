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

export const revalidate = 86400;
export const dynamicParams = true;
// Match the cell page's function budget: cold cells_master queries plus the
// across-cities slate can take a few seconds before warm-up; the builder is
// fully budget-wrapped, but raise the ceiling so a cold render is never dropped.
export const maxDuration = 60;

type Params = { country: string; geo: string; industry: string };

/**
 * Prerender ONLY a small bounded flagship set so the static build stays cheap.
 * This MIRRORS the cell page's own curated generateStaticParams list (the six
 * homepage FEATURED tiles, the top US states x highest-traffic industries, and
 * the top non-US countries x restaurants), because the flagship opening pages a
 * visitor is most likely to deep-link are exactly the flagship cells. That is 20
 * URLs, deliberately well under the ~60-100 ceiling; every other opening page
 * renders on demand via dynamicParams + the daily revalidate above.
 *
 * Kept in sync by hand with the cell page's list and the homepage FEATURED
 * array. We do NOT enumerate the full ~600 cell slate here: a second 600-page
 * prerender would balloon the build for no traffic benefit.
 */
export async function generateStaticParams(): Promise<Params[]> {
  return [
    // The 6 FEATURED tiles from the homepage.
    { country: "us", geo: "california", industry: "software-development" },
    { country: "gb", geo: "gb",         industry: "legal-services" },
    { country: "de", geo: "de21",       industry: "fabricated-metal-mfg" },
    { country: "es", geo: "es511",      industry: "restaurants" },
    { country: "mx", geo: "mx-roo",     industry: "hotels-lodging" },
    { country: "us", geo: "california", industry: "restaurants" },

    // Top US states x highest-traffic industries.
    { country: "us", geo: "new-york",   industry: "restaurants" },
    { country: "us", geo: "texas",      industry: "restaurants" },
    { country: "us", geo: "florida",    industry: "restaurants" },
    { country: "us", geo: "california", industry: "cafes-coffee" },
    { country: "us", geo: "california", industry: "hairdressers-beauty" },
    { country: "us", geo: "california", industry: "auto-repair-shops" },
    { country: "us", geo: "california", industry: "hotels-lodging" },
    { country: "us", geo: "california", industry: "legal-services" },

    // Top non-US countries x restaurants (and GB cafes).
    { country: "gb", geo: "gb",         industry: "restaurants" },
    { country: "gb", geo: "gb",         industry: "cafes-coffee" },
    { country: "de", geo: "de",         industry: "restaurants" },
    { country: "fr", geo: "fr",         industry: "restaurants" },
    { country: "it", geo: "it",         industry: "restaurants" },
    { country: "jp", geo: "jp",         industry: "restaurants" },
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

export default async function OpeningRoutePage({
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

  return (
    <div className="mx-auto max-w-3xl pb-16">
      <OpeningHero page={page} />
      <OpeningPayback page={page} />
      <OpeningChecklist page={page} />
      <OpeningComparisons page={page} />
    </div>
  );
}
