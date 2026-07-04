/**
 * /dev/spine-hood , the neighborhood-hub spine DEV route. Thin wrapper: the page body
 * lives in ./hood-view (SpineHoodBody) so the live route
 * src/app/cities/[slug]/neighborhoods/page.tsx can render the same body with REAL data.
 * This route renders the illustrative bundled seed (SpineHoodBody's default).
 */
import { SpineHoodBody } from "./hood-view";

export const dynamic = "force-static";

export default function SpineHoodPage() {
  return <SpineHoodBody />;
}
