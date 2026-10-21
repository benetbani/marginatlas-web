/**
 * THE CITY PAGE'S SPINE BODY, FOR TWO ROUTES (milestone 2, masterplan step 17): the public route (./page.tsx) and the Pro
 * reader's uncached mirror (step 18) draw the same page, told whether it is locked. Its own module, beside the page, because a
 * Next page file may export only the names Next reads (default, generateMetadata, revalidate and the rest).
 *
 * The real, reconciled data from buildSpineCitySeed (the same accessors the non-spine route runs, plus the real neighborhood
 * engine), never the illustrative seed. When the adapter finds no city it returns undefined, and this notFound()s as the
 * non-spine page does.
 */
import { notFound } from "next/navigation";
import { SpineShell } from "@/components/spine/shell";
import { ProLockedData } from "@/components/spine/ProLockedData";
import { SpineCityBody } from "@/components/spine/city/city-view";
import { buildSpineCitySeed } from "@/lib/spine/adapt_city";
import { buildCityV9 } from "@/lib/spine/city_v9";
import { SpineCityV9Body } from "@/components/spine/city/sourced-view";

export async function renderCityRoute(slug: string, { locked }: { locked: boolean }) {
  /* THE CITY PAGE v9 (his "v9 looks right. Record it as the approved London target", 2026-10-21): a city whose every v9 section fills
     from data/sourced/ draws v9 (src/lib/spine/city_v9.ts says which: London today). v9 draws no lock, so a page drawn locked (the
     paywall on) keeps the September view below, which carries it. The harness (scripts/harness/render_page.tsx) asks the same. */
  const v9 = locked ? null : buildCityV9(slug);
  if (v9) {
    return (
      <SpineShell>
        <SpineCityV9Body v={v9} path={`/cities/${slug.toLowerCase()}`} />
      </SpineShell>
    );
  }
  const spineData = await buildSpineCitySeed(slug);
  if (!spineData) notFound();
  /* A page drawn locked says which parts are Pro to search engines (masterplan step 19). */
  return (
    <>
      {locked ? <ProLockedData /> : null}
      <SpineShell>
        <SpineCityBody data={spineData} locked={locked} />
      </SpineShell>
    </>
  );
}
