/**
 * src/lib/simulator/seed.ts , WHAT THE PAGE HANDS THE BROWSER (plan 2026-10-13 cost-simulator, Task 4B): the place, its defaults, the reader's state (Task
 * 5 reads it from the address), the three pickers' lists and the words. Pure; the server builds it (load.ts, the page, the harness) and the client
 * component draws it, importing its types only.
 */
import { COPY } from "@/lib/spine/copy";
import { simulatorCities, simulatorCountries, simulatorTrades, type Place } from "./place";
import { FRESH, type SimBundle, type SimState } from "./bundle";

export type Choices = { countries: Array<{ code: string; name: string }>; cities: Array<{ slug: string; iso2: string; name: string }>; trades: Array<{ slug: string; name: string }> };
export type CalculatorWords = typeof COPY.calculator;
export type CalculatorSeed = { place: Place; bundle: SimBundle; state: SimState; choices: Choices; words: CalculatorWords; path: string };

export const CALCULATOR_PATH = "/calculator";

export function seedOf(place: Place, bundle: SimBundle, state: SimState = FRESH): CalculatorSeed {
  return {
    place,
    bundle,
    state,
    choices: { countries: simulatorCountries(), cities: simulatorCities(), trades: simulatorTrades().map((t) => ({ slug: t.slug, name: t.name })) },
    words: COPY.calculator,
    path: CALCULATOR_PATH,
  };
}
