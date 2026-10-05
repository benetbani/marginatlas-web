/**
 * /pro/<country>/<place>/<trade>: THE PRO READER'S UNCACHED TRADE PAGE (milestone 2, masterplan step 18). Never linked and never
 * listed: the middleware rewrites a signed-in reader's request for a trade page the paywall locks to here
 * (src/lib/monetization/pro_route.ts), the address bar keeping the public address. It asks the account once and draws the
 * public page through the public route's own renderer, open for Pro and locked for anyone else. Dynamic, so nothing of a
 * reader's page is held at the edge or in the page cache; never indexed, its canonical the public page. The public trade route
 * draws the site chrome itself, so this draws it the same way.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteChrome } from "@/components/SiteChrome";
import { renderCellRoute } from "@/app/[country]/[geo]/[industry]/cell_spine";
import { generateMetadata as publicMetadata } from "@/app/[country]/[geo]/[industry]/page";
import { getSessionTier } from "@/lib/monetization/entitlement";
import { lockablePath } from "@/lib/monetization/pro_route";

export const dynamic = "force-dynamic";

type Params = { country: string; geo: string; industry: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { country, geo, industry } = await params;
  const base = (await publicMetadata({ params })) as Metadata;
  return { ...base, robots: { index: false, follow: false }, alternates: { ...base.alternates, canonical: `/${country}/${geo}/${industry}` } };
}

export default async function ProCellPage({ params }: { params: Promise<Params> }) {
  const { country, geo, industry } = await params;
  if (!lockablePath(`/${country}/${geo}/${industry}`.toLowerCase())) notFound();
  const locked = (await getSessionTier()) !== "pro";
  return <SiteChrome>{await renderCellRoute(country, geo, industry, { locked })}</SiteChrome>;
}
