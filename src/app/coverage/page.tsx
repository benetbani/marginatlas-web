/**
 * /coverage — permanent redirect to /world.
 *
 * Plan v32 hotfix. Founder feedback: /coverage and /world were two
 * pages doing the same job (country grid + depth indicators). The
 * separation served no purpose and made the site feel chaotic.
 * /world is now the canonical destination; /coverage 308-redirects
 * to preserve any inbound links + SEO equity.
 */
import { permanentRedirect } from "next/navigation";

export default function CoveragePage() {
  permanentRedirect("/world");
}
