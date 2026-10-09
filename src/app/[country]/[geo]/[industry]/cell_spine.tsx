/**
 * THE TRADE PAGE'S SPINE BODY, FOR TWO ROUTES (milestone 2, masterplan step 17): the public route (./page.tsx) and the Pro
 * reader's uncached mirror (step 18) draw the same page, told whether it is locked. Its own module, beside the page, because a
 * Next page file may export only the names Next reads (default, generateMetadata, revalidate and the rest).
 *
 * THE JULY PAGE IS RETIRED (his ruling 4 of 2026-09-26, milestone 1; 2026-10-02). Until that day a reconciled cell file
 * (gb/london/restaurants, the one slug that had one) sent this URL to the spine-2 page of July, so the trade the rebuilt page was
 * proven on served the page it replaced. Every trade now takes the rebuilt page. The spine-2 modules stay: the city adapter and
 * the dev routes read them. When the adapter finds no cell it returns undefined, and this notFound()s as the non-spine page does.
 */
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/StructuredData";
import { SpineShell } from "@/components/spine/shell";
import { ProLockedData } from "@/components/spine/ProLockedData";
import { SpineCellBody as SpineCell } from "@/components/spine/cell/cell-view";
import { buildSpineCellSeed } from "@/lib/spine/adapt_cell";
import { buildCellCrumbs } from "@/lib/spine/crumb_rows";
import { tradeCanonicalPath } from "@/lib/seo/alias_canonical";

export async function renderCellRoute(country: string, geo: string, industry: string, { locked }: { locked: boolean }) {
  const spineData = await buildSpineCellSeed(country, geo, industry);
  if (!spineData) notFound();
  /* THE TRAIL, MACHINE-READABLE (2026-10-02): the July page emitted a BreadcrumbList and the rebuilt page emitted none, so
     retiring the one would have taken the breadcrumbs off London restaurants and left every rebuilt trade without them. One
     source for the trail the reader sees and the one a search engine reads (crumb_rows.ts); a step that resolves to no page
     is left out, as the July page left it out, and the last step is this page's canonical address, so an alias page's trail names
     the live slug's page as its canonical does (P1-C, 2026-10-09; src/lib/seo/alias_canonical.ts). */
  const origin = "https://www.marginatlas.com";
  const trail = buildCellCrumbs(spineData.meta);
  const crumbItems = trail.flatMap((c, i) => (i === trail.length - 1 ? [{ name: c.label, url: `${origin}${tradeCanonicalPath(country, geo, industry)}` }] : c.href ? [{ name: c.label, url: `${origin}${c.href}` }] : []));
  return (
    <>
      {crumbItems.length > 1 ? <Breadcrumbs items={[{ name: "Home", url: `${origin}/` }, ...crumbItems]} /> : null}
      {/* A page drawn locked says which parts are Pro to search engines (masterplan step 19). */}
      {locked ? <ProLockedData /> : null}
      <SpineShell>
        <SpineCell data={spineData} locked={locked} />
      </SpineShell>
    </>
  );
}
