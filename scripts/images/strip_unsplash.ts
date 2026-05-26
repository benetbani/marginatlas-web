/**
 * scripts/images/strip_unsplash.ts
 *
 * Founder direction 2026-05-26: Unsplash attribution requirements are
 * unacceptable. Rip the 43 Unsplash entries out of
 * data/images/city_heroes_v1.json and convert them to pattern
 * fallback so the city pages render the gradient initial-letter block
 * instead of the photo.
 *
 * Also writes a follow-up list to scripts/images/_pexels_swap_queue.json
 * documenting which cities now need hand-picked Pexels replacements.
 *
 * Run: npx tsx scripts/images/strip_unsplash.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const HEROES_PATH = resolve(ROOT, "data/images/city_heroes_v1.json");
const QUEUE_PATH = resolve(ROOT, "scripts/images/_pexels_swap_queue.json");

type Hero = {
  city_slug?: string;
  slug?: string;
  city_name?: string;
  name?: string;
  iso2?: string;
  source?: string;
  source_url?: string;
  unsplash_url?: string;
  variant?: string;
  image_url_full?: string;
  image_url_regular?: string;
  image_url_small?: string;
  image_url_thumb?: string;
  photographer_name?: string;
  photographer_username?: string;
  photographer_url?: string;
  download_location?: string;
  blur_hash?: string;
  alt?: string;
};

type HeroesFile = {
  heroes: Hero[];
};

function isUnsplash(h: Hero): boolean {
  if (h.source === "unsplash") return true;
  const url = h.source_url || h.unsplash_url || "";
  return (
    !h.source &&
    url.includes("unsplash") &&
    !url.includes("pexels")
  );
}

const file = JSON.parse(readFileSync(HEROES_PATH, "utf-8")) as HeroesFile;
const swapQueue: Array<{ slug: string; name: string; iso2: string }> = [];

let stripped = 0;
for (const h of file.heroes) {
  if (!isUnsplash(h)) continue;
  const slug = h.city_slug || h.slug || "";
  const name = h.city_name || h.name || "";
  swapQueue.push({ slug, name, iso2: (h.iso2 || "").toUpperCase() });

  // Convert in place to a pattern-fallback record. The renderer
  // already branches on variant === "pattern" and shows the gradient
  // initial-letter block.
  delete h.image_url_full;
  delete h.image_url_regular;
  delete h.image_url_small;
  delete h.image_url_thumb;
  delete h.photographer_name;
  delete h.photographer_username;
  delete h.photographer_url;
  delete h.download_location;
  delete h.unsplash_url;
  delete h.source_url;
  delete h.blur_hash;
  h.source = "pattern";
  h.variant = "pattern";
  h.alt = `${name} city block`;
  stripped++;
}

writeFileSync(HEROES_PATH, JSON.stringify(file, null, 2) + "\n");
writeFileSync(
  QUEUE_PATH,
  JSON.stringify(
    {
      generated_at: new Date().toISOString().slice(0, 10),
      note: "Cities that lost their Unsplash hero. Each needs a Pexels (or other free + no-attribution) replacement to be re-curated.",
      count: swapQueue.length,
      cities: swapQueue,
    },
    null,
    2,
  ) + "\n",
);

console.log(`Stripped ${stripped} Unsplash entries to pattern fallback.`);
console.log(`Pexels swap queue written to scripts/images/_pexels_swap_queue.json`);
