/**
 * /dev/city2 , the city page rendered from the PLACEHOLDER fixture.
 *
 * A dev route, deliberately. The live city route `/[country]/[geo]` still
 * serves the previous generation and will keep doing so until the founder
 * flips `NEXT_PUBLIC_SPINE_REFORM_CITY`, which is his call and not this loop's.
 *
 * The fixture holds the design mockup's own illustrative numbers. It is safe to
 * import HERE and nowhere else: `verify_no_fixture_in_routes` fails the build if
 * anything under `src/app` outside `dev/` and `_design/` reaches into
 * `fixtures/`. That is the whole reason placeholder data lives in its own tree.
 */
import { CityPage } from "@/components/city2/page/CityPage";
import { buildCityPage } from "@/lib/cities/city_adapter";
import type { CityFile } from "@/lib/cities/city_spine2_types";
import fixture from "../../../../fixtures/city-london.fixture.json";

export const metadata = {
  title: "City page , placeholder data , Margin Atlas dev",
  robots: { index: false, follow: false },
};

export default function DevCityPage() {
  const model = buildCityPage(fixture as unknown as CityFile);
  return <CityPage model={model} />;
}
