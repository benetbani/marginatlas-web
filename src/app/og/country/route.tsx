/**
 * /og/country , OG image for a country page (/{country}).
 *
 * Usage:
 *   <meta property="og:image" content="/og/country?country=gb" />
 *
 * IT CARRIES NO FIGURE, AND THAT IS THE FINDING, NOT AN OMISSION.
 *
 * THE PAGE ITSELF LEADS WITH NO NUMBER. The country hero is a block the
 * founder accepted and the page comments mark "KEPT EXACTLY": a masthead
 * image, the flag, an H1 that is the bare country name, and one fixed
 * subtitle. There is no anchor figure in it. The first block carrying numbers
 * is the eight-cell scorecard below it, and eight equal cells have no lead:
 * they are a grid, not a headline. The rule for this card family is to print
 * the figure the page leads with, and this page leads with a name.
 *
 * THE SCORECARD'S FIRST CELL IS NOT A SUBSTITUTE. It holds GDP per capita.
 * That is a country indicator, not a small-business figure, and it is exactly
 * the kind of context number the founder's density rule tells this project to
 * keep off a surface where it would read as the answer. It also has no
 * derivable provenance: getCountryEconomicsSnapshot and the held indicator
 * maps carry no coverage, quality or confidence field per figure.
 *
 * THERE IS A COUNTRY-LEVEL TIER, AND IT DOES NOT BELONG TO THESE NUMBERS.
 * country_view.ts derives one from a registry letter (A/B/C to
 * deep/good/starter/modeled) and the page prints it in the freshness stamp at
 * the foot. It describes how well this project covers the country's business
 * data. GDP per capita comes from an external indicator table that the letter
 * knows nothing about. Pairing them would put a confidence sentence under a
 * number it is not about, which is a sharper version of the defect this whole
 * card family was built to stop.
 *
 * ONE FIGURE WAS CONSIDERED AND REJECTED FOR A DIFFERENT REASON.
 * country_view.ts builds a masthead anchor, "Typical small-business tax", the
 * charge that actually lands on an owner, and it would be a good card figure.
 * But the page never renders that masthead: it uses `view.decisive` and
 * `view.masthead.tier` and nothing else off it, so the anchor is computed and
 * dropped. Printing it here would lead the card on a number a reader cannot
 * find when they arrive, which the brief calls a worse defect than no card. If
 * that anchor is ever promoted into the hero, this route should print it, and
 * its provenance question becomes live at that point.
 *
 * Node.js runtime, matching the rest of the family.
 */
import { ImageResponse } from "next/og";
import { COUNTRIES } from "@/lib/taxonomy";
import { CARD_SIZE, OgFrame, OgBrand, OgTitle, OgFooter } from "../_card";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const country = url.searchParams.get("country") || "";

  let title = "Margin Atlas";
  let subtitle = "Small-business benchmarks worldwide";

  const meta = COUNTRIES.find((c) => c.code === country.toUpperCase());
  if (meta) {
    // The page's H1 is the bare country name. This is that.
    title = meta.name;
    // The page's own hero subtitle, word for word.
    subtitle =
      "What it costs, what you keep, and how hard it is to run a small business here.";
  }

  return new ImageResponse(
    (
      <OgFrame>
        <OgBrand />
        <OgTitle title={title} subtitle={subtitle} />
        {/* No figure block, so the footer takes the free space itself. */}
        <OgFooter marginTop="auto" />
      </OgFrame>
    ),
    CARD_SIZE
  );
}
