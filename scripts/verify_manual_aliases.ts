/**
 * Plan v24 Block 4.4 — verify the manual city alias supplement resolves
 * the 30 most critical entries to the expected codes and labels.
 *
 * Run: `npx tsx scripts/verify_manual_aliases.ts`
 *
 * If this fires: an alias either points to a wrong code, or the label
 * is mis-spelled. Fix `src/lib/cities/manual_city_aliases.ts` and
 * re-run.
 */
import {
  MANUAL_FRIENDLY_TO_GEO_ID,
  MANUAL_DISPLAY_LABEL,
} from "../src/lib/cities/manual_city_aliases";

const checks: Array<[string, string, string, string]> = [
  ["DE", "frankfurt", "DE71", "Frankfurt am Main"],
  ["DE", "hamburg", "DE60", "Hamburg"],
  ["DE", "cologne", "DEA2", "Cologne"],
  ["DE", "munich", "DE21", "Munich"],
  ["DE", "berlin", "DE30", "Berlin"],
  ["FR", "lyon", "FRK2", "Lyon"],
  ["FR", "marseille", "FRL0", "Marseille"],
  ["FR", "paris", "FR10", "Paris"],
  ["GB", "birmingham", "GB-E08000025", "Birmingham"],
  ["GB", "manchester", "GB-E08000003", "Manchester"],
  ["IT", "rome", "ITI4", "Rome"],
  ["IT", "milan", "ITC4", "Milan"],
  ["ES", "madrid", "ES-28", "Madrid"],
  ["ES", "barcelona", "ES-08", "Barcelona"],
  ["NL", "amsterdam", "NL-GM0363", "Amsterdam"],
  ["BE", "brussels", "BE10", "Brussels"],
  ["CH", "zurich", "CH-CITY-zurich", "Zurich"],
  ["AT", "vienna", "AT-CITY-vienna", "Vienna"],
  ["PL", "warsaw", "PL91", "Warsaw"],
  ["PT", "lisbon", "PT17", "Lisbon"],
  ["SE", "stockholm", "SE11", "Stockholm"],
  ["DK", "copenhagen", "DK01", "Copenhagen"],
  ["NO", "oslo", "NO08", "Oslo"],
  ["FI", "helsinki", "FI1B", "Helsinki"],
  ["CZ", "prague", "CZ01", "Prague"],
  ["HU", "budapest", "HU11", "Budapest"],
  ["RO", "bucharest", "RO32", "Bucharest"],
  ["TR", "istanbul", "TR-CITY-istanbul", "Istanbul"],
  ["RU", "moscow", "RU-CITY-moscow", "Moscow"],
  ["IE", "dublin", "IE06", "Dublin"],
];

// Apply the same upper-casing logic as regionalSlugToGeoId so we
// verify the resolved geo_id, not the raw alias value.
function resolve(country: string, slug: string): string {
  const manual = MANUAL_FRIENDLY_TO_GEO_ID[country]?.[slug] || "";
  if (!manual) return "";
  if (manual.includes("-city-")) {
    const idx = manual.indexOf("-city-");
    const prefix = manual.slice(0, idx).toUpperCase();
    return `${prefix}-CITY-${manual.slice(idx + 6)}`;
  }
  return manual.toUpperCase();
}

let fail = 0;
for (const [country, slug, expectedGeo, expectedLabel] of checks) {
  const got = resolve(country, slug);
  const label = MANUAL_DISPLAY_LABEL[country]?.[slug] || "";
  const okGeo = got === expectedGeo;
  const okLabel = label === expectedLabel;
  const status = okGeo && okLabel ? "PASS" : "FAIL";
  if (!okGeo || !okLabel) fail++;
  const note = okGeo && okLabel
    ? ""
    : `   << EXPECTED ${expectedGeo} (${expectedLabel})`;
  console.log(
    `[${status}] /${country.toLowerCase()}/${slug} -> ${got} (${label})${note}`,
  );
}

console.log("");
if (fail === 0) {
  console.log(`PASS  All ${checks.length} critical aliases resolve.`);
} else {
  console.error(`FAIL  ${fail} of ${checks.length} aliases mis-resolved.`);
  process.exit(1);
}
