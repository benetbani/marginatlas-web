/**
 * /dev/cell2 , the trade page, v2, rendered from the ONE RECONCILED CELL FILE.
 *
 * THIS ROUTE DID NOT EXIST UNTIL NOW, AND ITS ABSENCE HID BEHIND A PASSING
 * AUDIT. `/dev/cell2`, `/dev/hood2` and `/dev/industry2` were all named in the
 * default route list of `audit_row_layout.mjs` and all three reported
 * `ok, 0 unstyled, 0 clipped` for days. None of them had a route file. Next
 * renders the layout for an unmatched path, so each answered HTTP 200 with 594
 * characters of chrome and zero page content, and a green result for a page
 * that does not exist is worse than a red one because nobody looks again.
 *
 * WHY IT IS WORTH BUILDING NOW. `CellPage` is the most finished thing in the
 * repository: twenty-one chapters, the `.av2` root already in place at
 * `CellPage.tsx:90`, and the only data in the project that is reconciled line
 * by line. It is invisible anyway, because the live route branches on
 * `isSpineReformEnabledFor("cell")`, that resolves to the master
 * `NEXT_PUBLIC_SPINE_REFORM`, and the master is unset. So the best page on the
 * site renders for nobody, including the founder.
 *
 * NOTE ON THAT FLAG, because the code reads the other way at a glance. The
 * `true` in `isSpineReformEnabledFor`'s cell case is NOT a default-on. It means
 * "this page is allowed to follow the master", and `resolveSpinePage` then
 * returns `masterEnables ? isSpineReformEnabled() : false`. Master unset means
 * off. Reading the rendered page is what settled it: the live route serves the
 * legacy trade page with the old masthead and the full industry dropdown.
 *
 * THIS IS NOT A FIXTURE PAGE. Unlike `/dev/city2` and `/dev/country2`, which
 * both render `fixtures/*.json` and therefore cannot be promoted to a public
 * URL, this route reads `loadSpine2Cell`, the same domain-layer door the live
 * route uses, backed by `data/cells/restaurants-in-london.json`. Every figure
 * here is the reconciled one. Nothing is invented, so nothing needs a
 * SampleTag, and the page is a true preview of what the flag would serve.
 *
 * WHAT IS DELIBERATELY ABSENT: the structured data the live branch emits,
 * `CellDataset`, `FAQSchema` and `Breadcrumbs`. Those exist to be crawled, this
 * route is `noindex`, and duplicating a Dataset declaration on a second URL is
 * how two pages start claiming to be the same dataset.
 */
import { notFound } from "next/navigation";

import { CellPage } from "@/components/spine2/page/CellPage";
import { loadSpine2Cell } from "@/lib/cells/spine2_loader";
import { buildCellPage } from "@/lib/cells/spine2_adapter";
import { countryPagePath, resolveGeoPage } from "@/lib/cells/related_links";

export const metadata = {
  title: "Trade page , reconciled data , Margin Atlas dev",
  robots: { index: false, follow: false },
};

export default function DevCellPage() {
  const cell = loadSpine2Cell("gb", "london", "restaurants");

  /* The registry holds a key if and only if a reconciled file exists, so this
     is unreachable while that one file is committed. It is here because the
     alternative is a crash with no explanation the day the file is renamed,
     and because "coming soon" is banned: a page either renders or it is
     honestly absent. */
  if (!cell) notFound();

  /* The onward doors are RESOLVED, never assembled, and they are resolved once
     so the breadcrumb and the page's own exits cannot reach different
     conclusions about which pages exist. Either may be null, and null means no
     destination is offered rather than a link that 404s. Greece is held as
     `GR`, so every hand-built `/el` link in this repository was dead until the
     resolvers existed; `verify_geo_link_construction` gates exactly that. */
  const m = cell.meta;
  const model = buildCellPage(cell, {
    geoPage: resolveGeoPage(m.country.slug, m.city.slug),
    countryPage: countryPagePath(m.country.slug),
  });

  return <CellPage model={model} />;
}
