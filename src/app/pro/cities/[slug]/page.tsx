/**
 * /pro/cities/<slug>: THE PRO READER'S UNCACHED CITY PAGE (milestone 2, masterplan step 18). Never linked and never listed: the
 * middleware rewrites a signed-in reader's request for a UK city page to here (src/lib/monetization/pro_route.ts), the address
 * bar keeping the public address. It asks the account once and draws the public page through the public route's own renderer,
 * open for Pro and locked for anyone else. Dynamic, so nothing of a reader's page is held at the edge or in the page cache;
 * never indexed, its canonical the public page.
 *
 * Under /pro beside the other two mirrors rather than inside the (site) group: two route groups holding the same first segment
 * is what the build's route-conflict outage was made of. The (site) layout is the site chrome and nothing else
 * (src/app/(site)/layout.tsx), so this draws the same chrome itself.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteChrome } from "@/components/SiteChrome";
import { renderCityRoute } from "@/app/(site)/cities/[slug]/city_spine";
import { generateMetadata as publicMetadata } from "@/app/(site)/cities/[slug]/page";
import { getSessionTier } from "@/lib/monetization/entitlement";
import { lockablePath } from "@/lib/monetization/pro_route";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const base = await publicMetadata({ params });
  return { ...base, robots: { index: false, follow: false }, alternates: { ...base.alternates, canonical: `/cities/${slug}` } };
}

export default async function ProCityPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!lockablePath(`/cities/${slug}`)) notFound();
  const locked = (await getSessionTier()) !== "pro";
  return <SiteChrome>{await renderCityRoute(slug, { locked })}</SiteChrome>;
}
