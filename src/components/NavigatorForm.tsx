"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { ComboField, type ComboOption } from "./ComboField";
import {
  COUNTRIES,
  industryToSlug,
  visibleIndustries,
  type Gate,
} from "@/lib/taxonomy";
import { getDefaultRegionForCountry } from "@/lib/regions/default_region_by_country";
import { getCitiesForCountryCode, CASCADE_PREFILLS } from "@/lib/home/search_cascade";
import { elevation } from "@/lib/design-tokens";

/**
 * NavigatorForm: the homepage search, reworked into a three-field guided cascade
 * (country to city to business) per the homepage reform SP3. The submit mechanic
 * is unchanged (router.push to `/{country}/{geo}/{industry}`, with the native
 * action="/api/go" fallback for no-JS), per the founder's standing directive.
 *
 * What changed from the six-field Navigator:
 *  - Three visible fields, in order: Country, City, Business. Region, sector,
 *    and size are gone from the UI. The region is resolved behind the scenes: a
 *    picked city slug IS the URL geo, and "Anywhere in {country}" resolves to
 *    that country's curated default region, so the result link still works.
 *  - The form pre-fills with a rotating real example so it never reads blank;
 *    the rotation stops for good on the first user interaction.
 *  - Business is NOT narrowed by city (activities are not city-specific in the
 *    data), so the full forgiving activity list stays available.
 *
 * The card chrome (header strip, footer sample line, submit CTA) is reused. The vermillion
 * top rule, the "The Navigator" eyebrow, and the "Surprise me" button were removed in the
 * 2026-07-12 taste pass (see the inline notes).
 */

/** Client-side gate read. Matches lib/audience.ts on the server. */
function readClientGate(): Gate {
  if (typeof window === "undefined") return { revealMixed: false, revealCorp: false };
  const params = new URLSearchParams(window.location.search);
  const cookie = document.cookie || "";
  const cookiePro = /(?:^|;\s*)atlas_pro=1(?:;|$)/.test(cookie);
  const showLarge = params.get("show_large") === "1" || params.get("show_large") === "true";
  const showMixed = params.get("show_mixed") === "1" || params.get("show_mixed") === "true";
  const pro = params.get("pro") === "1" || params.get("pro") === "true" || cookiePro;
  return {
    revealCorp: pro || showLarge,
    revealMixed: pro || showMixed || showLarge,
  };
}

export function NavigatorForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  /* THE PRE-FILL NO LONGER ROTATES, and the reason is the same ruling that
     took the rotating words out of the h1 one band above this card.

     It cycled all three fields through CASCADE_PREFILLS every four seconds
     until the reader touched something. The h1's two rotating words were
     removed on the grounds that "motion in the headline competes with the
     search for the eye, and the search is the instrument". This was motion
     INSIDE the instrument, which is the same argument only worse.

     And it was not only a matter of taste. Submit reads state, so the values
     on screen were live: a reader who saw "restaurants in Barcelona", decided,
     and reached for the button could land on legal services in the UK because
     the interval fired on the way. A form that changes its own answer while
     you are deciding is a defect, not a demonstration.

     It also demonstrated very little. Six of the eight prefills are
     restaurants, so the carousel mostly showed one trade in different cities,
     while the "Try" line in this card's own footer already names three
     genuinely different examples and holds still while it does it.

     One real example, kept, because the design intent it served is right: the
     form should never read blank. CASCADE_PREFILLS[0] is restaurants in Los
     Angeles, which is also the first example in that footer line, so the card
     shows the reader the same thing twice instead of two different things. */
  const [country, setCountry] = useState(CASCADE_PREFILLS[0].country);
  const [city, setCity] = useState(CASCADE_PREFILLS[0].city);
  const [business, setBusiness] = useState(CASCADE_PREFILLS[0].business);
  const [gate, setGate] = useState<Gate>({ revealMixed: false, revealCorp: false });

  // Client gate so ?pro=1 / cookies can widen the activity list.
  useEffect(() => {
    setGate(readClientGate());
  }, []);

  const countryOptions: ComboOption[] = useMemo(
    () =>
      COUNTRIES.map((c) => ({
        value: c.code,
        label: c.name,
        keywords: [c.code.toLowerCase(), c.name.toLowerCase()],
      })),
    []
  );

  // City options depend on country: a leading "Anywhere in {country}" (value "")
  // plus the country's curated cities (each slug is a URL-resolving geo).
  const cityOptions: ComboOption[] = useMemo(() => {
    const countryName = COUNTRIES.find((c) => c.code === country)?.name || country;
    const anywhere: ComboOption = { value: "", label: `Anywhere in ${countryName}` };
    const cities = getCitiesForCountryCode(country).map((c) => ({
      value: c.slug,
      label: c.label,
      keywords: [c.slug, c.label.toLowerCase()],
    }));
    return [anywhere, ...cities];
  }, [country]);

  // Business options: the full forgiving activity list (audience-gated),
  // alphabetical. NOT narrowed by city (activities are not city-specific).
  const businessOptions: ComboOption[] = useMemo(
    () =>
      visibleIndustries(gate)
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((i) => ({
          value: i.id,
          label: i.name,
          examples: i.examples,
          keywords: i.keywords,
        })),
    [gate]
  );

  function submit() {
    try {
      if (!business) {
        alert("Pick a business to find the data you're looking for.");
        return;
      }
      const cc = country.toLowerCase();
      // Submit mechanic unchanged: navigate to /{country}/{geo}/{industry}.
      // geo precedence: the picked city slug (a resolving geo), else this
      // country's curated default region, else the country code itself.
      const geo = city || getDefaultRegionForCountry(country) || cc;
      const path = `/${cc}/${geo}/${industryToSlug(business)}`;
      setIsLoading(true);
      router.push(path);
      window.setTimeout(() => setIsLoading(false), 3000);
    } catch (err) {
      if (typeof window !== "undefined") {
        // eslint-disable-next-line no-console
        console.error("NavigatorForm submit failed", err);
        window.location.href = "/random";
      }
    }
  }

  // Native-fallback geo (no-JS via /api/go): subdivision carries the city;
  // region carries the curated default when no city is picked, so the native
  // submit still lands on a cell (/api/go prefers subdivision, then region).
  const fallbackRegion = city ? "" : getDefaultRegionForCountry(country) || "";

  return (
    <form
      action="/api/go"
      method="get"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="relative rounded-2xl atlas-paper-card border border-ink-200 hover:border-ink-300 transition-colors"
      style={{ boxShadow: elevation.card }}
    >
      {/* Hidden inputs mirror state for the no-JS native submit (action="/api/go"). */}
      <input type="hidden" name="country" value={country.toLowerCase()} />
      <input type="hidden" name="region" value={fallbackRegion.toLowerCase()} />
      <input type="hidden" name="subdivision" value={city.toLowerCase()} />
      <input type="hidden" name="industry" value={business ? industryToSlug(business) : ""} />

      {/* Card header strip. The vermillion top rule and the "The Navigator" eyebrow were
          deleted 2026-07-12: a decorative accent rule carrying no answer (rule 37/38) and a
          hand-rolled caps eyebrow above the title (rule 11). The title now inherits the
          shell font (Geist on the spine page) instead of font-display (Newsreader serif),
          which is off the locked Geist + Space Grotesk system (rule 38). */}
      <div className="flex items-baseline justify-between gap-4 px-5 md:px-8 pt-5 md:pt-7 pb-3 border-b border-ink-200">
        <div>
          <h2 data-typography="custom" className="font-semibold text-lg md:text-xl text-ink-900 leading-tight">
            Pick a country, a city, and a business.
          </h2>
        </div>
        <div className="hidden sm:block text-right text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-cocoa-700/70 font-medium leading-tight">
          {/* Derived, not typed. This read "105 countries", which matches
              nothing: the picker below offers all of COUNTRIES, and the atlas
              holds 94 with benchmarks. Neither is 105, so it was a figure from
              some earlier shape of the list left to rot on the home page, which
              is the one surface where a wrong number is least affordable.
              Counting the options the control actually offers means it cannot
              drift from them again. */}
          <div>{COUNTRIES.length} countries</div>
          <div>{visibleIndustries().length} activities</div>
        </div>
      </div>

      {/* Three-field cascade: Country, then City, then Business. */}
      <div className="px-5 md:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <ComboField
            id="country"
            label="Country"
            required
            options={countryOptions}
            value={country}
            onChange={(v) => {
              setCountry(v);
              setCity("");
            }}
          />
          <ComboField
            id="city"
            label="City"
            options={cityOptions}
            value={city}
            onChange={setCity}
          />
          <ComboField
            id="business"
            label="Business"
            required
            options={businessOptions}
            value={business}
            onChange={setBusiness}
            placeholder="Type a business: restaurants, barbers, plumbers"
          />
        </div>
      </div>

      {/* Footer bar: sample line + submit. */}
      <div className="rounded-b-2xl border-t border-ink-200 bg-white px-5 md:px-8 py-4 md:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[11px] md:text-xs text-cocoa-700/80 leading-relaxed">
            <span className="font-semibold uppercase tracking-[0.12em] text-ink-500 mr-1.5">
              Try
            </span>
            restaurants in Los Angeles
            <span aria-hidden="true" className="mx-1.5 text-cocoa-700/40">·</span>
            law firms in the UK
            <span aria-hidden="true" className="mx-1.5 text-cocoa-700/40">·</span>
            software in San Francisco
          </p>
          <div className="flex items-center shrink-0">
            {/* Soft-terracotta submit, the ONE action the card leads to (rule 37). The
                crimson filled pill + bold white label were deleted 2026-07-12:
                off-palette accent on chrome + "cheap" heavy fill. The soft shape is
                the reform masthead's ratified CTA and is kept exactly.

                THE COLOUR WAS STOCK TAILWIND ORANGE, AND IT WAS THIS BUTTON.
                border-orange-200 / bg-orange-50 / text-orange-700, on the primary
                call to action of the home page. orange-700 is #c2410c at hue 17.5
                degrees; the brand accent is #991600 at hue 8.6. The founder's note
                is quoted verbatim in verify_palette_membership's own header: "at the
                bottom of the home page I see a shade of orange that is not accepted
                as a brand color."

                Its justification was mistaken. It read that NavigatorForm renders
                outside SpineShell where the --terra-* vars do not exist, so the
                terracotta had to come from Tailwind. But atlas-* is not a CSS
                variable: design-tokens' tailwindColors are spread into the config as
                plain hex, which is why the h1 twenty lines up this same legacy page
                uses text-atlas-700 and renders correctly. Nothing ever required the
                stock ramp.

                Same ladder, on the brand: 50 wash, 200 border, 700 text. Contrast of
                #991600 on #fff1ee is 7.7:1, past AA and past AAA for body text.
                These five were the only orange-* classes in the repository, so the
                palette gate now bans the token outright. */}
            <button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="px-5 py-2.5 rounded-full border border-atlas-200 bg-atlas-50 hover:bg-atlas-100 text-atlas-700 font-semibold text-sm transition disabled:opacity-70 disabled:cursor-wait inline-flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span
                    aria-hidden="true"
                    className="inline-block w-3.5 h-3.5 border-2 border-atlas-700/30 border-t-atlas-700 rounded-full animate-spin"
                  />
                  Loading...
                </>
              ) : (
                <>Show me the numbers <span aria-hidden="true">&rarr;</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
