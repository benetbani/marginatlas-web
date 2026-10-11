/**
 * /[country]/how-to-open , "How to open a business in [country name]", the
 * page the founder asked for on 2026-09-04 (ruling 8) and the door the
 * registering table has been waiting to draw. Every figure and word comes
 * from the builders the country page already uses; the page composes the
 * archetypes (key-value grid, tiers table, note list, terminus) and nothing
 * else. Unknown country: a 404 from generateMetadata, before the shell
 * flushes, for the reason recorded on the country page.
 *
 * THE PAGE DRAWS THE SITE'S CHROME, as every other spine route does (the bar and its sheet, the one <main>, the newsletter bar and the
 * footer: src/components/SiteChrome.tsx). It once wrote a <main> of its own inside the shell and drew none of them, and the build of
 * 2026-10-11 measured it so (header false, footer false, main true); the route-chrome contract let a route that named SpineShell count
 * as having chrome, and the shell draws only the ground. tests/chrome/masthead.test.ts draws this route and reads the markup.
 */
import * as React from "react";
import { notFound } from "next/navigation";
import { COUNTRIES } from "@/lib/taxonomy";
import { SiteChrome } from "@/components/SiteChrome";
import { SpineShell } from "@/components/spine/shell";
import { HowToBody } from "@/components/spine/country/how-to-view";
import { buildHowTo } from "@/lib/spine/howto_rows";
import { robotsFor } from "@/lib/seo/indexable";

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
    /* Indexed only where his rule allows (milestone 1, M10; src/lib/seo/indexable.ts): a UK page, or a page at its floor. */
    robots: robotsFor(`/${country.toLowerCase()}/how-to-open`),
  };
}

export default async function HowToOpenPage({ params }: { params: Promise<Params> }) {
  const { country } = await params;
  const iso2 = country.toUpperCase();
  if (!buildHowTo(iso2)) notFound();
  /* SiteChrome's <main id="main"> is the page's one landmark, on the site's gutter and the 16px under the bar that the trail's rule in
     globals.css (THE ZONES, item P2.1) paints over; the body is the shell's only content, its trail first. */
  return (
    <SiteChrome>
      <SpineShell>
        <HowToBody iso2={iso2} />
      </SpineShell>
    </SiteChrome>
  );
}
