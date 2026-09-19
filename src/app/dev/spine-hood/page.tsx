/**
 * /dev/spine-hood , the neighborhood-hub spine DEV route. Thin wrapper: the page body
 * lives in ./hood-view (SpineHoodBody) so the live route
 * src/app/cities/[slug]/neighborhoods/page.tsx can render the same body with REAL data.
 * This route renders the illustrative bundled seed (SpineHoodBody's default),
 * whose `meta.slug` is London: since plan step 35 (2026-09-19) the body builds
 * every card off the files by that slug, so this route shows London's seven
 * real districts and the seed's nine invented ones are drawn nowhere.
 */
import { SpineHoodBody } from "@/components/spine/hood/hood-view";

export const dynamic = "force-static";

export default function SpineHoodPage() {
  return <SpineHoodBody />;
}
