/**
 * /browse — permanent redirect to /world.
 *
 * Plan v32 hotfix. Founder feedback: /browse repeated the homepage
 * navigator's 'pick a country / sector / city' entry pattern and added
 * lists that were already covered by /world (countries), /industries
 * (sectors), and /cities (cities). The page served no purpose distinct
 * from the others. 308-redirects to /world which is the canonical
 * country-grid destination.
 */
import { permanentRedirect } from "next/navigation";

export default function BrowsePage() {
  permanentRedirect("/world");
}
