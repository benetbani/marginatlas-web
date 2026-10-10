/**
 * src/lib/cities/city_images.ts
 *
 * ONE image per city, read by the country page's card pager AND the city
 * page's hero (founder ruling 2, 2026-09-04: "the city cards should include an
 * image... that same image appears on the hero section of that city's page").
 * The manifest lists the files that exist; a city without one gets null and
 * the callers draw no slot, never a placeholder.
 *
 * THE SMALL COPY (plan 2026-10-10, the home reformed to ship, Task 6; the critique's P1.11): a city's 480 by 360 copy for a short row
 * (public/cities/thumbs, written by scripts/build_city_images_manifest.ts --thumbs) and the crop that keeps its landmark in view,
 * both named in the manifest; null where no small copy is held, and the caller draws the photograph itself.
 */
import manifest from "../../../data/cities/images_manifest.json";
import { own } from "@/lib/own";

type Entry = { file: string; thumb?: string; position?: string };
const CITIES = (manifest as { cities: Record<string, Entry> }).cities ?? {};
/** The image path for a city slug, or null when no photograph is held. */
export function cityImageSrc(slug: string | null | undefined): string | null {
  if (!slug) return null;
  return CITIES[slug.toLowerCase()]?.file ?? null;
}
export function cityImageCount(): number {
  return Object.keys(CITIES).length;
}
/** The city's small copy and its crop ("50% 44%", a CSS object-position), or null where the manifest names no small copy. */
export function cityThumb(slug: string | null | undefined): { src: string; position: string | null } | null {
  if (!slug) return null;
  const e = own(CITIES, slug.toLowerCase());
  return e?.thumb ? { src: e.thumb, position: e.position ?? null } : null;
}
