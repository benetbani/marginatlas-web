/**
 * City spine page , THIN DEV ROUTE. Leg 1.
 *
 * The page body lives in ./city-view (SpineCityBody), a plain module the live metropolis
 * route (src/app/cities/[slug]/page.tsx) can also mount with real data. This route is
 * intentionally thin: Next forbids arbitrary named exports + custom props on a route file,
 * so the body is imported and rendered with its default (the bundled illustrative London
 * seed), keeping this dev surface byte-identical to the pre-split page.
 */
import { SpineCityBody } from "@/components/spine/city/city-view";

export const dynamic = "force-static";

export default function SpineCityPage() {
  return <SpineCityBody />;
}
