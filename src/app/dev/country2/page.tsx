/**
 * /dev/country2 , the country page rendered from the PLACEHOLDER fixture.
 *
 * A dev route, deliberately. There is no live country route on the spine-2
 * generation yet: the country page was the last of the five page types still
 * unported, parked behind "no honest hero" until the ratified mockup led on a
 * share of profit rather than a sum of money.
 *
 * The fixture holds the design mockup's own illustrative numbers. It is safe to
 * import HERE and nowhere else: `verify_no_fixture_in_routes` fails the build if
 * anything under `src/app` outside `dev/` and `_design/` reaches into
 * `fixtures/`. That is the whole reason placeholder data lives in its own tree.
 */
import { CountryPage } from "@/components/country2/page/CountryPage";
import { buildCountryPage } from "@/lib/countries/country_adapter";
import type { CountryFile } from "@/lib/countries/country_spine2_types";
import fixture from "../../../../fixtures/country-gb.fixture.json";

export const metadata = {
  title: "Country page , placeholder data , Margin Atlas dev",
  robots: { index: false, follow: false },
};

export default function DevCountryPage() {
  const model = buildCountryPage(fixture as unknown as CountryFile);
  return <CountryPage model={model} />;
}
