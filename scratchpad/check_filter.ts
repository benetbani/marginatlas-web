import { INDUSTRIES, ALL_INDUSTRIES, industryToSlug, INDUSTRY_BY_ID, SLUG_TO_INDUSTRY, visibleIndustries } from "../src/lib/taxonomy";
import { RETIRED } from "../src/lib/taxonomy/retired";

console.log("ALL_INDUSTRIES            ", ALL_INDUSTRIES.length);
console.log("INDUSTRIES (in scope)     ", INDUSTRIES.length);
console.log("visibleIndustries()       ", visibleIndustries().length);
console.log("SLUG_TO_INDUSTRY entries  ", Object.keys(SLUG_TO_INDUSTRY).length);
console.log("");
console.log("retired id -> name        ", INDUSTRY_BY_ID["other_transport_mfg"]?.name);
console.log("retired id -> slug        ", industryToSlug("other_transport_mfg"));
console.log("  (must be aerospace-other-transport-mfg)");
console.log("");
console.log("grain_farming listed?     ", INDUSTRIES.some((i) => i.id === "grain_farming"));
console.log("banking listed?           ", INDUSTRIES.some((i) => i.id === "banking"));
console.log("hospitals listed?         ", INDUSTRIES.some((i) => i.id === "hospitals"));
console.log("restaurants listed?       ", INDUSTRIES.some((i) => i.id === "restaurants"));
console.log("");
const leaked = INDUSTRIES.filter((i) => RETIRED[industryToSlug(i.id)]);
console.log("retired activities leaking into the live list:", leaked.length, leaked.map((i) => i.name).join(", "));
