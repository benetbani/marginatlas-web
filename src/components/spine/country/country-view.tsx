/**
 * Country page , SPINE rebuild BODY (SpineCountryBody).
 *
 * The body/route split every other spine page type already uses: the live route
 * (src/app/[country]/page.tsx) mounts this with the REAL seed from
 * buildSpineCountrySeed, so the country page stops rendering the bundled
 * illustrative GB sample the moment its flag is ever opened. Next forbids
 * arbitrary named exports and custom props on a route file, so the body lives
 * here as a plain module and the route imports it.
 *
 * SCAFFOLD, DELIBERATELY. This file currently renders the seed's country name
 * and nothing else. Tasks 10 to 18 of the walk reform build the real sections
 * into it, one section per task, each with its own form from the kit. Landing
 * the empty body with the adapter is what lets the adapter be verified against
 * the real route rather than only against a probe, and it is why the flag stays
 * shut: an empty page must never be reachable, and isSpineReformEnabledFor
 * ("country") returns false with the master switch unable to open it.
 *
 * Null-guarded like its siblings: every section added here must early-return
 * null when its block is absent, so an omitted field renders NOTHING rather
 * than a zero, an "undefined" or a broken frame. The adapter self-omits whole
 * blocks, so those guards are load-bearing from the first section onward.
 *
 * Does NOT wrap itself in SpineShell; the route wraps it, matching the city
 * body. No em-dashes, no raw hex, tokens only.
 */
import * as React from "react";

/**
 * The country spine page body. `data` is the seed from buildSpineCountrySeed.
 * Every block on it is optional by design, so read defensively.
 */
export function SpineCountryBody({ data }: { data?: any }) {
  const d = data ?? {};
  const name: string | undefined = d.meta?.country_name;
  if (!name) return null;

  /* data-typography="custom" for the same reason every other spine masthead
     carries it: the spine pages run on the shell's own scale and palette
     variables, not on the site's serif heading tokens, so a canonical token
     here would import a different typeface into the middle of the shell.

     The SIZE comes from the shell's ten-step type ladder (--t-focal, 30px) and
     not from a Tailwind size class. The city masthead's text-3xl md:text-4xl
     shape was the first thing written here, and md:text-4xl is 36px, which is
     off that ladder; the ratchet counts off-ladder sizes down only, so a new
     file may not add one. Task 10 sets the real masthead scale. */
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
      <h1
        id="headline"
        data-typography="custom"
        className="text-balance text-[length:var(--t-focal)] font-semibold tracking-tight text-[var(--c-ink)]"
      >
        {name}
      </h1>
    </main>
  );
}

export default SpineCountryBody;
