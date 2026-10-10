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
 *  - The form opens on one real example, restaurants in London, and holds it.
 *  - Business is NOT narrowed by city (activities are not city-specific in the
 *    data), so the full forgiving activity list stays available.
 *
 * IN THE SPINE'S TOKENS, ONE ROW, ONE ACTION (plan 2026-10-10, home reform, Task 2; the critique's P0.4, P1.2, P1.3 and P1.14; the
 * ship audit's 1b.5 and 3.2): the card is the spine's (radius 12, the strong edge, the card's shadow, 24 of padding) and stays a card
 * on the hero's band (data-keep-card: a picker is an instrument); the action is the page's one solid ink button, the fourth column of
 * the field row from 1024, under the fields at the right from 768, full width on a phone; the footer strip and its divider are gone,
 * and the examples' line stands under the row in ink2. Any failure says so in the card instead of sending the visitor to a random
 * page. THE LISTS LOAD ON FIRST USE: the server passes `seed`, the three labels and the no-script fields the first paint needs
 * (src/lib/home/picker.ts homePickerSeed), and the 195 countries, the activities and the city lists arrive with import() when a
 * pointer enters the form or focus lands in it. A press that comes before them is the browser's own submit to /api/go, which
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
 *  server; without it (the live home behind its switch) the form loads its lists at once and opens on the same case. */
export function NavigatorForm({ showHeading = true, seed }: { showHeading?: boolean; seed?: PickerSeed } = {}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
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
     while the examples' line under this card's fields already names three
     genuinely different examples and holds still while it does it.

     One real example, kept, because the design intent it served is right: the
     form should never read blank. CASCADE_PREFILLS[0] is restaurants in
     London, the home's worked example (plan 2026-10-09, home introduction);
     the seed carries it from the server. */
  const [country, setCountry] = React.useState(seed?.country.value ?? "");
  const [city, setCity] = React.useState(seed?.city.value ?? "");
  const [business, setBusiness] = React.useState(seed?.business.value ?? "");
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

  /* No seed: load at once, and open on the case once the lists are in. */
  React.useEffect(() => {
    if (!seed) loadLists();
  }, [seed, loadLists]);
  React.useEffect(() => {
    if (!lists || seed || country) return;
    const p = lists.CASCADE_PREFILLS[0];
    setCountry(p.country);
    setCity(p.city);
    setBusiness(p.business);
  }, [lists, seed, country]);

  /* Before the lists arrive each field holds its seeded option alone, so it shows its label; after, the whole list. */
  const countryOptions = React.useMemo(() => (lists ? lists.countryOptions() : seed ? [seed.country] : []), [lists, seed]);
  const cityOptions = React.useMemo(() => (lists ? lists.cityOptions(country) : seed ? [seed.city] : []), [lists, seed, country]);
  const businessOptions = React.useMemo(() => (lists ? lists.businessOptions(gate) : seed ? [seed.business] : []), [lists, seed, gate]);
  /* The no-script fields mirror the state for the native submit (action="/api/go"). */
  const hidden = lists ? lists.hiddenFields(country, city, business) : (seed?.hidden ?? NO_HIDDEN);
  /* The line's three examples and their city, from the destination's one list (src/lib/home/destination.ts, HOME_TRY), so a link and a
     search for the same words land on one page. */
  const tries = seed?.tries ?? (lists ? lists.homeTryLinks() : []);
  const tryCity = seed?.tryCity ?? (lists ? lists.homeTryCityLabel() : "");

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
      onPointerEnter={loadLists}
      onFocus={loadLists}
      data-keep-card=""
      className="spine-card relative rounded-xl border border-[var(--c-line-strong)] p-6"
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

      {/* The field row: Country, then City, then Business, then the action; the examples' line under it. One column on a phone
          (the action full width under the fields, the line under it), three from 768 (the line and the action on one row under the
          fields, the action at the right), four from 1024 (the action the row's last column, its foot on the fields' foot, the line
          under the row: the row's inner wrapper steps out of the way there, `lg:contents`). The fields' columns may shrink to
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
          onChange={setCity}
          placeholder="Anywhere, or pick a city"
        />
        <ComboField
          id="business"
          label="Business"
          options={businessOptions}
          value={business}
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
          {/* THE EXAMPLES ARE LINKS (plan 2026-10-09, home introduction), three other London trades whose pages print the
              register's figures (plan 2026-10-10, the critique's P1.14): the line no longer repeats the case the fields already
              show. A space is text, not margin, so the words read as words to a crawler and a screen reader. */}
          {tries.length > 0 ? (
            <p data-try="" className="text-sm leading-5 text-[var(--c-ink2)] lg:col-span-4 lg:row-start-2">
              Or try{" "}
              {tries.map((t, i) => (
                <React.Fragment key={t.href}>
                  {i === 0 ? null : i === tries.length - 1 ? " or " : ", "}
                  <a href={t.href} className="underline decoration-[var(--c-line-strong)] underline-offset-2 transition-colors hover:text-[var(--c-ink)] hover:decoration-[var(--c-ink)]">
                    {t.word}
                  </a>
                </React.Fragment>
              ))}
              {` in ${tryCity}.`}
            </p>
          ) : null}
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
