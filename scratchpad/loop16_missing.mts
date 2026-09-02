import { COUNTRIES } from "../src/lib/taxonomy";
import cityListJson from "../data/cities/city_list_v1.json";
import { readFileSync } from "node:fs";
const CITY_LIST = (cityListJson as { cities: { slug: string; iso2: string; continent: string }[] }).cities;
const CONTINENT_BY_ISO2 = new Map<string, string>();
for (const c of CITY_LIST) { const iso = (c.iso2 || "").toUpperCase(); if (!iso || CONTINENT_BY_ISO2.has(iso)) continue; CONTINENT_BY_ISO2.set(iso, c.continent); }
const src = readFileSync("src/app/(site)/countries/page.tsx", "utf8");
const blk = src.slice(src.indexOf("const FALLBACK_CONTINENT"), src.indexOf("const CONTINENT_ORDER"));
const FB: Record<string, string> = {};
for (const mm of blk.matchAll(/([A-Z]{2}):\s*"([^"]+)"/g)) FB[mm[1]] = mm[2];
const ORDER = ["Africa", "Asia", "Europe", "North America", "Oceania", "South America"];
const missing = COUNTRIES.filter((c) => { const u = c.code.toUpperCase(); const cont = CONTINENT_BY_ISO2.get(u) || FB[u] || "Other"; return !ORDER.includes(cont); });
console.log("COUNTRIES.length =", COUNTRIES.length);
console.log("unplaced =", missing.map((c) => `${c.code} ${c.name}`).join(", ") || "(none)");
console.log("city-list continents =", [...new Set(CITY_LIST.map((c) => c.continent))].join(" | "));
