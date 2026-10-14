"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ComboField } from "./ComboField";
import type { Gate } from "@/lib/taxonomy";
import type { PickerHidden, PickerSeed } from "@/lib/home/picker";

/**
 * NavigatorForm: the homepage search, reworked into a three-field guided cascade
 * (country to city to business) per the homepage reform SP3. The submit mechanic
 * is unchanged (router.push to the destination, with the native
 * action="/api/go" fallback for no-JS), per the founder's standing directive.
 *
 * What changed from the six-field Navigator:
 *  - Three visible fields, in order: Country, City, Business. Region, sector,
 *    and size are gone from the UI. The region is resolved behind the scenes: a
 *    picked city slug IS the URL geo, and "Anywhere in {country}" resolves to
 *    that country's curated default region, so the result link still works.
 *  - The form opens on one real example, restaurants in London; on the rebuilt home it follows the h1's case until the reader reaches it, then holds what it shows.
 *  - Business is NOT narrowed by city (activities are not city-specific in the
 *    data), so the full forgiving activity list stays available.
 *
 * IN THE SPINE'S TOKENS, ONE ROW, ONE ACTION (plan 2026-10-10, home reform, Task 2; the critique's P0.4, P1.2, P1.3 and P1.14; the
 * ship audit's 1b.5 and 3.2): the card is the spine's (radius 12, the strong edge, the card's shadow, 24 of padding) and stays a card
 * on the hero's band (data-keep-card: a picker is an instrument); the action is the page's one solid ink button, the fourth column of
 * the field row from 1024, under the fields at the right from 768, full width on a phone; the footer strip and its divider are gone,
 * and so is the examples' line (plan 2026-10-13 home-quiet-editorial, Task 3: the fields follow the h1's case instead). Any failure
 * says so in the card instead of sending the visitor to a random page. THE LISTS LOAD ON FIRST USE: the server passes `seed`
 * (src/lib/home/picker.ts homePickerSeed) or `cases`, one a tick of the h1's words (src/lib/home/picker_cases.ts), with the three
 * labels and the no-script fields the first paint needs, and the 195 countries, the activities and the city lists arrive with import()
 * when the reader reaches the form: a pointer enters it, a press or a focus lands in it, or a key is pressed in it (a field focused
 * before the page hydrated fires no focus that React hears, so its first key starts the load). Until they are in, an open field says
 * "Loading…" in place of a list or of "No match" (ComboField's `loading`, the Task 2 review: typing then filtered the one seeded option
 * alone), and its Enter keeps typed words in the field. A press that comes before them is the browser's own submit to /api/go, which
 * answers through the same destination.
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

/** The picker's lists and destination, as the form loads them on first use. */
type PickerModule = typeof import("@/lib/home/picker");

const NO_HIDDEN: PickerHidden = { country: "", region: "", subdivision: "", industry: "" };

/** `showHeading={false}` drops the card's own heading where the page's h1 already asks the question (the rebuilt home, his
 *  instruction of 2026-10-07: "reform home drastically"); the live home keeps it. `seed` is what the first paint draws, from the
 *  server; with neither it nor `cases` the form loads its lists at once and opens on the same case. `cases` and `caseIndex` (the
 *  rebuilt home, HomeAsk): the h1's case at each tick, the first `cases[0]`, the form's own seed; null where the picker cannot show a
 *  case, which keeps the case on screen. */
export function NavigatorForm({ showHeading = true, seed, cases, caseIndex = 0 }: { showHeading?: boolean; seed?: PickerSeed; cases?: ReadonlyArray<PickerSeed | null>; caseIndex?: number } = {}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  /* THE FIELDS FOLLOW THE QUESTION ON SCREEN, AND STOP WHEN THE READER REACHES THEM (plan 2026-10-13 home-quiet-editorial, Task 3; the
     spec's section 2, item 2). The rebuilt home passes `cases`, one per tick of the h1's words (src/lib/home/picker_cases.ts), and
     `caseIndex`, the tick on screen (HomeAsk), so the three fields show the h1's own case and the form names no city of its own. The first
     pointer over the form, a press, a focus or a key in it is the reader reaching for it (`reach`): from then the fields hold what they
     show, and the h1's words stop at the same moment (HeroWords stops on a pointer over the form), so a submit sends the case on screen. A
     case the picker cannot show whole is null, and the case on screen stays. The values never move once a hand is near: the defect an
     earlier rotating prefill had (a submit reading values that changed while the reader decided) cannot happen. Without `cases` (the live
     home, and any form handed `seed` alone) the form opens on the seed and holds it. */
  const first = seed ?? cases?.[0] ?? null;
  const [shown, setShown] = React.useState<PickerSeed | null>(first);
  const [country, setCountry] = React.useState(first?.country.value ?? "");
  const [city, setCity] = React.useState(first?.city.value ?? "");
  const [business, setBusiness] = React.useState(first?.business.value ?? "");
  const touched = React.useRef(false);
  const [gate, setGate] = React.useState<Gate>({ revealMixed: false, revealCorp: false });
  const [lists, setLists] = React.useState<PickerModule | null>(null);
  const loading = React.useRef<Promise<void> | null>(null);

  // Client gate so ?pro=1 / cookies can widen the activity list.
  React.useEffect(() => {
    setGate(readClientGate());
  }, []);

  const loadLists = React.useCallback(() => {
    if (loading.current) return;
    loading.current = import("@/lib/home/picker").then(
      (m) => {
        setLists(m);
        setFailed(false);
      },
      (err) => {
        loading.current = null;
        // eslint-disable-next-line no-console
        console.error("NavigatorForm: the picker's lists did not load", err);
        setFailed(true);
      },
    );
  }, []);

  /* The reader's hand is at the form: the fields stop following the h1, and the lists load. */
  const reach = React.useCallback(() => {
    touched.current = true;
    loadLists();
  }, [loadLists]);

  /* Follow the h1's case until the reader reaches the form; a null case keeps the case on screen. */
  React.useEffect(() => {
    if (!cases || cases.length === 0 || touched.current) return;
    const next = cases[((caseIndex % cases.length) + cases.length) % cases.length];
    if (!next) return;
    setShown(next);
    setCountry(next.country.value);
    setCity(next.city.value);
    setBusiness(next.business.value);
  }, [cases, caseIndex]);

  /* Nothing to paint first (no seed and no cases): load at once, and open on the case once the lists are in. */
  React.useEffect(() => {
    if (!first) loadLists();
  }, [first, loadLists]);
  React.useEffect(() => {
    if (!lists || first || country) return;
    const p = lists.CASCADE_PREFILLS[0];
    setCountry(p.country);
    setCity(p.city);
    setBusiness(p.business);
  }, [lists, first, country]);

  /* Before the lists arrive each field holds the shown case's option alone, so it shows its label; after, the whole list. */
  const countryOptions = React.useMemo(() => (lists ? lists.countryOptions() : shown ? [shown.country] : []), [lists, shown]);
  const cityOptions = React.useMemo(() => (lists ? lists.cityOptions(country) : shown ? [shown.city] : []), [lists, shown, country]);
  const businessOptions = React.useMemo(() => (lists ? lists.businessOptions(gate) : shown ? [shown.business] : []), [lists, shown, gate]);
  /* Until the lists are in (and unless loading them failed, which the card says), an open field says "Loading…" and filters nothing. */
  const loadingLists = !lists && !failed;
  /* The no-script fields mirror the state for the native submit (action="/api/go"). */
  const hidden = lists ? lists.hiddenFields(country, city, business) : (shown?.hidden ?? NO_HIDDEN);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    /* Before the lists load, the browser sends the form itself: the hidden fields hold the case on screen and /api/go answers
       through the same destination. */
    if (!lists) return;
    e.preventDefault();
    try {
      /* WHERE IT LANDS, ONE TESTED FUNCTION (masterplan step 33): a page that exists, UK first (London's trade page, a UK city's
         own page, the trade's page for anywhere in the UK, /gb alone), today's cell path elsewhere. The business is optional, so
         no box ever pops up to ask for it (the alert it used was a pop-up his refusals name). */
      const path = lists.homeDestination({ country, city, trade: business });
      setFailed(false);
      setIsLoading(true);
      router.push(path);
      window.setTimeout(() => setIsLoading(false), 3000);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("NavigatorForm submit failed", err);
      setIsLoading(false);
      setFailed(true);
    }
  }

  return (
    <form
      action="/api/go"
      method="get"
      onSubmit={onSubmit}
      onPointerEnter={reach}
      onPointerDown={reach}
      onFocus={reach}
      onKeyDown={reach}
      data-keep-card=""
      className="spine-card relative rounded-xl border border-[var(--c-line-strong)] p-5 md:p-6"
    >
      {/* Hidden inputs mirror state for the no-JS native submit (action="/api/go"). */}
      <input type="hidden" name="country" value={hidden.country} />
      <input type="hidden" name="region" value={hidden.region} />
      <input type="hidden" name="subdivision" value={hidden.subdivision} />
      <input type="hidden" name="industry" value={hidden.industry} />

      {/* Card header strip. The vermillion top rule and the "The Navigator" eyebrow were
          deleted 2026-07-12: a decorative accent rule carrying no answer (rule 37/38) and a
          hand-rolled caps eyebrow above the title (rule 11). The title now inherits the
          shell font (Geist on the spine page) instead of font-display (Newsreader serif),
          which is off the locked Geist + Space Grotesk system (rule 38). */}
      {showHeading ? (
        <div className="mb-6 border-b border-[var(--c-border)] pb-4">
          <h2 data-typography="custom" className="font-semibold text-lg md:text-xl text-ink-900 leading-tight">
            Pick a country, a city, and a business.
          </h2>
          {/* No count here: his ruling of 2026-10-07, the number overstated what the atlas holds. */}
        </div>
      ) : null}

      {/* The field row: Country, then City, then Business, then the action. One column on a phone (the action full width under the
          fields), three from 768 (the action under the fields at the right), four from 1024 (the action the row's last column, its foot
          on the fields' foot: the row's inner wrapper steps out of the way there, `lg:contents`). The fields' columns may shrink to
          nothing (minmax(0,1fr)), so the action's column keeps the button's own width and its words stay on one line. */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
        {/* PLACEHOLDERS THAT SAY SOMETHING, which is the half of the founder's
            2026-08-09 ruling that never got done. He removed the "?" badges
            from these two fields ("two question marks at the country and at
            the city, which is like a massive mistake") and the instruction
            that came with it was to fix the label or put the sentence in the
            field. The badges went; the sentence did not arrive. Country and
            city kept ComboField's generic "Pick or type…" while Business,
            which never carried a badge, told a reader exactly what to do.

            City also has a thing worth saying that nothing said: it is the
            only optional field of the three, and its first option is
            "Anywhere in {country}". A reader had no way to know they could
            skip it. */}
        <ComboField
          id="country"
          label="Country"
          required
          options={countryOptions}
          value={country}
          loading={loadingLists}
          onChange={(v) => {
            setCountry(v);
            setCity("");
          }}
          placeholder="Type a country: Spain, Japan, Mexico"
        />
        <ComboField
          id="city"
          label="City"
          options={cityOptions}
          value={city}
          loading={loadingLists}
          onChange={setCity}
          placeholder="Anywhere, or pick a city"
        />
        <ComboField
          id="business"
          label="Business"
          options={businessOptions}
          value={business}
          loading={loadingLists}
          onChange={setBusiness}
          placeholder="Type a business: restaurants, barbers, plumbers"
        />
        <div className="flex flex-col gap-3 md:col-span-3 md:flex-row-reverse md:items-center md:justify-between md:gap-6 lg:contents">
          <div className="lg:col-start-4 lg:row-start-1 lg:self-end">
            {/* THE ONE ACTION, SOLID INK (the critique's P1.2): a pale terracotta pill read as the secondary action, and PART 6
                keeps terracotta off controls. Hover ink2 (7.36:1 with white); focus takes the site's 2px ink ring (globals.css). */}
            <button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[var(--c-ink)] px-6 text-base font-semibold text-white transition-colors hover:bg-[var(--c-ink2)] disabled:cursor-wait disabled:opacity-70 md:w-auto"
            >
              {isLoading ? (
                <>
                  <span
                    aria-hidden="true"
                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none"
                  />
                  Loading…
                </>
              ) : (
                <>Show me the numbers <span aria-hidden="true">&rarr;</span></>
              )}
            </button>
          </div>
        </div>
      </div>
      {failed ? (
        <p role="alert" className="mt-4 text-sm font-medium leading-5 text-[var(--c-ink)]">
          Something went wrong. Reload the page and try again.
        </p>
      ) : null}
    </form>
  );
}
