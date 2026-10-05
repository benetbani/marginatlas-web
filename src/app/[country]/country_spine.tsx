/**
 * THE COUNTRY PAGE'S SPINE BODY, FOR TWO ROUTES (milestone 2, masterplan step 17): the public route (./page.tsx) and the Pro
 * reader's uncached mirror (step 18) draw the same page, told whether it is locked. Its own module, beside the page, because a
 * Next page file may export only the names Next reads (default, generateMetadata, revalidate and the rest).
 *
 * The real body with the real seed (buildSpineCountrySeed), never an illustrative sample; the adapter returns undefined for a
 * code the taxonomy does not hold, so this notFound()s exactly as the non-spine page does.
 */
import { notFound } from "next/navigation";
import { SpineShell } from "@/components/spine/shell";
import { ProLockedData } from "@/components/spine/ProLockedData";
import { SpineCountryBody } from "@/components/spine/country/country-view";
import { buildSpineCountrySeed } from "@/lib/spine/adapt_country";

export async function renderCountryRoute(country: string, { locked }: { locked: boolean }) {
  const spineData = await buildSpineCountrySeed(country);
  if (!spineData) notFound();
  /* A page drawn locked says which parts are Pro to search engines (masterplan step 19). */
  return (
    <>
      {locked ? <ProLockedData /> : null}
      <SpineShell>
        <SpineCountryBody data={spineData} locked={locked} />
      </SpineShell>
    </>
  );
}
