/**
 * /[country]/how-to-open , "How to open a business in [country name]", the
 * page the founder asked for on 2026-09-04 (ruling 8) and the door the
 * registering table has been waiting to draw. Every figure and word comes
 * from the builders the country page already uses; the page composes the
 * archetypes (key-value grid, tiers table, note list, terminus) and nothing
 * else. Unknown country: a 404 from generateMetadata, before the shell
 * flushes, for the reason recorded on the country page.
 */
import * as React from "react";
import { notFound } from "next/navigation";
import { COUNTRIES } from "@/lib/taxonomy";
import { SpineShell } from "@/components/spine/shell";
import { HowToBody } from "@/components/spine/country/how-to-view";
import { buildHowTo } from "@/lib/spine/howto_rows";

type Params = { country: string };

export async function generateStaticParams(): Promise<Params[]> {
  // Only the countries whose legal forms are on file have a page; the rest answer 404.
  return (COUNTRIES as Array<{ code: string }>).filter((c) => buildHowTo(c.code) !== null).map((c) => ({ country: c.code.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { country } = await params;
  const d = buildHowTo(country);
  if (!d) notFound();
  return {
    title: `${d.title} | Margin Atlas`,
    description: d.lead,
    alternates: { canonical: `/${country.toLowerCase()}/how-to-open` },
  };
}

export default async function HowToOpenPage({ params }: { params: Promise<Params> }) {
  const { country } = await params;
  const iso2 = country.toUpperCase();
  if (!buildHowTo(iso2)) notFound();
  return (
    <SpineShell>
      <HowToBody iso2={iso2} />
    </SpineShell>
  );
}
