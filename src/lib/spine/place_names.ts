/**
 * src/lib/spine/place_names.ts
 *
 * A COUNTRY NAME IN A SENTENCE. "How to open a business in United Kingdom"
 * is not English; the names that take "the" take it from their own shape, a
 * plural, a republic, a union, an island group. The rule reads the name, so
 * no list of countries is typed and no name is invented; a name the rule
 * misses reads as it does today, without the article.
 *
 * CZECH IS NOT A START-OF-NAME RULE (truth-fixes round 3A, 2026-10-11). The list holds Czechia, which takes no article, and the old
 * rule gave it "the Czechia" wherever the helper is used. "Czech Republic" still takes it, from Republic below.
 */
const TAKES_THE = /^(United|Republic|Democratic|Central|Dominican|Netherlands|Philippines|Bahamas|Gambia|Maldives|Comoros|Seychelles|Marshall|Solomon|Cayman|Isle|Ivory|Vatican|Holy See)/i;
const TAKES_THE_ANYWHERE = /\b(Islands|Republic|Emirates|Kingdom|States|Federation)\b/i;

/** "the United Kingdom", "France". */
export function inSentence(name: string): string {
  const n = name.trim();
  if (/^the\s/i.test(n)) return n;
  return TAKES_THE.test(n) || TAKES_THE_ANYWHERE.test(n) ? `the ${n}` : n;
}
