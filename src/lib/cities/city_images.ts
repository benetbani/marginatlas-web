/**
 * src/lib/cities/city_images.ts
 *
 * ONE image per city, read by the country page's card pager AND the city
 * page's hero (founder ruling 2, 2026-09-04: "the city cards should include an
 * image... that same image appears on the hero section of that city's page").
 * The manifest lists the files that exist; a city without one gets null and
 * the callers draw no slot, never a placeholder.
 */
import manifest from "../../../data/cities/images_manifest.json";
const CITIES = (manifest as { cities: Record<string, { file: string }> }).cities ?? {};
/** The image path for a city slug, or null when no photograph is held. */
export function cityImageSrc(slug: string | null | undefined): string | null {
  if (!slug) return null;
  return CITIES[slug.toLowerCase()]?.file ?? null;
}
export function cityImageCount(): number {
  return Object.keys(CITIES).length;
}
