/**
 * Industry spine page , THIN DEV ROUTE. Leg 4.
 *
 * The page body lives in ./industry-view (SpineIndustryBody), a plain module the
 * live industry route can also mount with real data. This route is intentionally
 * thin: Next forbids arbitrary named exports + custom props on a route file, so the
 * body is imported and rendered with its default (the bundled illustrative seed),
 * keeping this dev surface byte-identical to the pre-split page.
 */
import { SpineIndustryBody } from "@/components/spine/industry/industry-view";

export const dynamic = "force-static";

export default function SpineIndustryPage() {
  return <SpineIndustryBody />;
}
