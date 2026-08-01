/**
 * /og/city , OG image for a city page (/cities/{slug}).
 *
 * Usage:
 *   <meta property="og:image" content="/og/city?slug=london" />
 *
 * IT CARRIES NO FIGURE, AND THAT IS THE FINDING, NOT AN OMISSION.
 *
 * What the city page leads with is its Business Climate Score, a single 0-100
 * number set as the masthead anchor (city_view.ts, the `richBoard` branch).
 * That figure was checked against the rule this card family runs on, that a
 * printed figure must carry a machine-derived statement of how it was
 * produced, and it fails that rule on two counts.
 *
 * FIRST, THERE IS NO DERIVATION TO READ. deriveCoverageTier answers a question
 * about a cell: was this revenue counted here, borrowed from a wider
 * benchmark, built from country indicators, or expected rather than observed.
 * The climate score is not a cell and not an observation of anything. It is a
 * weighted blend of resident population, an income proxy, visitor arrivals, a
 * cost-of-living index and a country self-employment share, put through a
 * documented contrast stretch (city_attractiveness.ts). There is no
 * observation behind it whose provenance could be stated, so the four tier
 * words are a category error applied to it, not a weaker or stronger claim.
 *
 * SECOND, THE ONE CONFIDENCE SIGNAL IT DOES CARRY IS A CONSTANT. Two exist and
 * both are fixed wherever the figure appears:
 *   - CityAttractivenessScore.restsOnModeled, which buildCityScore sets to a
 *     hardcoded `true` for every city, with the comment that the score always
 *     leans on at least one modeled input and is directional by construction.
 *   - CityViewMasthead.tier, which is `tier === 1 ? "good" : "modeled"`, while
 *     the anchor renders only when `richBoard`, which requires `tier === 1`.
 *     So whenever the figure is on screen the tier word is provably "good" and
 *     can be nothing else.
 * A sentence that cannot vary is a sentence I wrote, not one the data
 * produced, and the brief is explicit that provenance is derived and never
 * authored.
 *
 * WHAT IT DOES INSTEAD. The city and its country, so a pasted link reads
 * "Amsterdam, Netherlands" rather than the sitewide brand card, plus the
 * page's own claim-free framing line. Note that the page's scored H1 ("X is an
 * excellent place to start a small business.") is also kept off this card: it
 * is the score's verdict in words, so putting it here would smuggle the same
 * unqualified claim past the same rule with the number removed.
 *
 * Node.js runtime, matching the rest of the family. This route reads only a
 * bundled JSON and a static country table, so the Edge bundle history in
 * /og/cell/route.tsx does not bind it directly; it stays on Node so all five
 * cards behave identically under load and one of them cannot quietly acquire a
 * different cold-start profile.
 */
import { ImageResponse } from "next/og";
// A typed accessor, not a reach into data/. The city page's own JSON import is
// on verify_layering's grandfathered allowlist and the standing rule is to
// migrate those when touched and never add another, so this route reads the
// city list through src/lib/cities/city_tier.ts like any other consumer.
import { getCityIdentity } from "@/lib/cities/city_tier";
import { COUNTRIES } from "@/lib/taxonomy";
import { CARD_SIZE, OgFrame, OgBrand, OgTitle, OgFooter } from "../_card";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") || "";

  let title = "Margin Atlas";
  let subtitle = "Small-business benchmarks worldwide";

  const city = getCityIdentity(slug);
  if (city) {
    const countryName =
      COUNTRIES.find((c) => c.code === city.iso2)?.name || city.iso2;
    // City and country together. A card is read out of context by someone who
    // did not choose the link, and a bare "Birmingham" or "Cambridge" names
    // two different places on two continents.
    title = `${city.name}, ${countryName}`;
    // The city page's own framing for a place it holds no score for, which is
    // the one sentence on that page that promises nothing.
    subtitle = "What it is like to run a small business here";
  }

  return new ImageResponse(
    (
      <OgFrame>
        <OgBrand />
        <OgTitle title={title} subtitle={subtitle} />
        {/* No figure block, so the footer takes the free space itself. See
            OgFooter's note on why this is not cosmetic. */}
        <OgFooter marginTop="auto" />
      </OgFrame>
    ),
    CARD_SIZE
  );
}
