import { buildSpineCountrySeed } from "@/lib/spine/adapt_country";
const seed = await buildSpineCountrySeed("gb");
console.log(JSON.stringify({ meta: seed.meta, hero: seed.hero }, null, 2));
