/**
 * /browse — permanent redirect to /world.
 *
 * /Browse repeated the homepage
 * navigator's 'pick a country / sector / city' entry pattern and added
 * lists that were already covered by /world (countries), /industries
 * (sectors), and /cities (cities). The page served no purpose distinct
 * from the others. 308-redirects to /world which is the canonical
 * country-grid destination.
 */
import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";

/**
 * A redirect route still has to say where it belongs.
 *
 * With no `metadata` of its own this file inherited the root layout's, and the
 * root layout sets `alternates: { canonical: "/" }`, so /browse nominated the
 * home page as its canonical URL. The destination is /world, not "/".
 *
 * WHAT THIS DOES AND DOES NOT DO, so nobody over-reads it. The 308 is the
 * operative signal: `permanentRedirect` throws, the response carries no body,
 * and none of these tags reach a crawler on the redirecting path. The value of
 * declaring them is that the canonical now names the right URL for any render
 * that does emit HTML, and that the day this route stops being a redirect it
 * does not silently re-acquire the home page's canonical.
 */
export const metadata: Metadata = {
  title: "Browse the atlas: start at the world map",
  description:
    "The browse entry point resolves to the world map, which lists every country the atlas covers and how far it reaches in each.",
  alternates: { canonical: "/world" },
};

export default function BrowsePage() {
  permanentRedirect("/world");
}
