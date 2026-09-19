/**
 * The district page: one district of a city, the neighbourhood hub's spine in
 * focus (MODEL.md 8.8; plan step 35, 2026-09-19, the controller's rulings a
 * and b).
 *
 * Route: /cities/[slug]/neighborhoods/[district], UNDER THE HUB, never the
 * plan's `/gb/london/<district>`: that shape is the trade route's third
 * segment (src/app/[country]/[geo]/[industry]), where every unknown slug
 * answers 404 by design, and a district slug would have to be told apart from
 * a trade slug on every request. A new path; the hub's URL stands.
 *
 * WHICH DISTRICTS HAVE A PAGE: exactly the ones the hub's admission gate
 * admits (src/lib/spine/hood_scheme.ts, `spineHoodDistrict`: a city with four
 * or more curated districts and an authored centroid; London's seven today),
 * and only while the neighbourhood spine is on (the hub's own flag: with it
 * off the hub serves the legacy page and this route answers 404, so the
 * city's cards land on the legacy anchors instead; page_targets.ts
 * `districtPageTarget` reads the same two conditions for every door and
 * card). `generateStaticParams` lists every admitted city's districts; a
 * district the scheme does not hold answers `notFound()`.
 *
 * THE BODY IS THE HUB'S (SpineHoodBody with `focus`), one component, never a
 * second page type: it self-wraps in SpineShell. The seed is the adapter's,
 * for its `meta`; every card is built by the slug off the files.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isSpineReformEnabledFor } from "@/lib/feature_flags";
import { SpineHoodBody } from "@/components/spine/hood/hood-view";
import { buildSpineHoodSeed } from "@/lib/spine/adapt_hood";
import { hoodCity, spineHoodCities, spineHoodDistrict, spineHoodDistricts, districtPageHref } from "@/lib/spine/hood_scheme";

export const revalidate = 43200;

export async function generateStaticParams() {
  return spineHoodCities().flatMap((slug) => (spineHoodDistricts(slug) ?? []).map((d) => ({ slug, district: d.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; district: string }> }): Promise<Metadata> {
  const { slug, district } = await params;
  const city = hoodCity(slug);
  const row = spineHoodDistrict(slug, district);
  if (!city || !row) return { title: "District not found | Margin Atlas" };
  /* The hub's own pattern ("{city} neighborhoods | Margin Atlas"), one altitude
     down: the district, the city, what the page answers. Built from the
     RESOLVED slugs, so the canonical is the page this route rendered. */
  return {
    title: `${row.name}, ${city.name}: what rent takes | Margin Atlas`,
    description: `Shop rent in ${row.name} against the other districts of ${city.name}, and what the district is like.`,
    alternates: { canonical: districtPageHref(city.slug, row.slug) },
  };
}

export default async function DistrictPage({ params }: { params: Promise<{ slug: string; district: string }> }) {
  const { slug, district } = await params;
  if (!isSpineReformEnabledFor("hood")) notFound();
  const row = spineHoodDistrict(slug, district);
  if (!row) notFound();
  const spineData = await buildSpineHoodSeed(slug);
  if (!spineData) notFound();
  return <SpineHoodBody data={spineData} focus={row.slug} />;
}
