/**
 * src/lib/home/picker_cases.ts
 *
 * THE H1'S CASES, ONE A TICK, FOR THE PICKER TO FOLLOW (plan 2026-10-13 home-quiet-editorial, Task 3; spec docs/superpowers/specs/
 * 2026-10-13-home-quiet-editorial-design.md, section 2, item 2: "The picker under it follows the question's current case until the
 * reader touches it (no single default city)"). The h1 shows HERO_BUSINESSES[i] in HERO_CITIES[i] at tick i, each list cycling
 * (RotatingWord draws words[index % words.length]; src/lib/hero-words.ts), so the case at tick i is that pair, read into what the form
 * paints:
 *   the business  the activity the word names (slugToIndustry), and only one the form's own list offers under the default gate;
 *   the city      the one country whose city list holds a city of that name (getCitiesForCountryCode, the form's own lists: the UK's
 *                 seven for London); a name no list holds, or two countries hold, is not guessed;
 *   the landing   a search for the case lands on a page the edge serves (homeDestination, then edgeNotFound).
 * A tick whose case fails any of the three is null, and the picker keeps the case on screen (src/components/NavigatorForm.tsx). The first
 * case is the form's own seed: the h1's first words are restaurants in London.
 *
 * SERVER ONLY: it reads the edge's route table, which the picker's lazy lists (src/lib/home/picker.ts, loaded in the browser on first use)
 * must never carry; the home's view works the cases out and hands them to HomeAsk as data.
 */
import { COUNTRIES, slugToIndustry } from "@/lib/taxonomy";
import { getCitiesForCountryCode } from "@/lib/home/search_cascade";
import { homeDestination } from "@/lib/home/destination";
import { edgeNotFound } from "@/lib/routing/edge_not_found";
import { HERO_BUSINESSES, HERO_CITIES, HERO_TICKS } from "@/lib/hero-words";
import { businessOptions, pickerSeed, type PickerSeed } from "@/lib/home/picker";

/** The case behind one tick's two words, or null where the picker cannot show it whole or a search for it lands on no page. */
export function pickerCaseFor(word: string, place: string): PickerSeed | null {
  const business = slugToIndustry(word)?.id ?? null;
  if (!business || !businessOptions({ revealMixed: false, revealCorp: false }).some((o) => o.value === business)) return null;
  const homes = COUNTRIES.filter((c) => getCitiesForCountryCode(c.code).some((x) => x.label === place));
  if (homes.length !== 1) return null;
  const country = homes[0].code;
  const city = getCitiesForCountryCode(country).find((x) => x.label === place)?.slug;
  if (!city || edgeNotFound(homeDestination({ country, city, trade: business }))) return null;
  return pickerSeed(country, city, business);
}

/** The h1's cases by tick, one lap of its cities (HERO_TICKS), each followed or null. */
export function homePickerCases(): Array<PickerSeed | null> {
  return Array.from({ length: HERO_TICKS }, (_, i) => pickerCaseFor(HERO_BUSINESSES[i % HERO_BUSINESSES.length], HERO_CITIES[i % HERO_CITIES.length]));
}
