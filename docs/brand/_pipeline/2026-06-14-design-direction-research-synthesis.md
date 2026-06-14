# Design-direction research synthesis (2026-06-14)

Eight parallel research specialists investigated the founder's design vision (glassmorphism, rich
category-specific backgrounds, static-behind-scrolling, digestibility of dense data, the in-control
feeling, the design pipeline). Every report cited current, reputable sources (NN/g, web.dev, MDN,
WCAG, Apple HIG, Stripe/Linear analyses, Playwright/Vercel docs). They converge hard on one idea.

## The organizing principle (all eight agree)

**Warmth lives in the FRAME. The data stays clean in the middle.**

The frame = the left/right gutters, the masthead chrome, a short top hero wash, the warm shadows,
the serif headline, the copy voice, the edges. The data column = an opaque, high-contrast, calm
cream surface that every number, table, spread strip, and score sits on, untouched by texture or
translucency. This single rule reconciles the founder's two goals: it makes the page warm, beautiful,
transparent and in-control, while never risking a figure's legibility (the launch bar).

## What this REFINES in the founder's vision (the honest part)

The founder's instincts are right; the research narrows the *execution* in three ways:

1. **Glassmorphism is for CHROME, never for the data.** Every authoritative source (NN/g's "Liquid
   Glass Is Cracked", Apple's own iOS 26 walk-back, Axess Lab) says dense numbers are the single
   worst case for frosted glass: separators vanish, microcopy drops below 4.5:1, rows stop being
   scannable. So glass goes ONLY on floating chrome that sits over the background, the sticky
   masthead, the sub-nav, the watch-tray and switchers, the mobile bottom bar, command-k, toasts,
   and every figure on it rides an opaque scrim. Glass becomes the warm translucent membrane between
   the gutter art and the content column, exactly where the founder's "transparent" feeling belongs.
2. **Backgrounds go in the GUTTERS, never behind the data.** A single fixed layer paints the
   viewport, but the content column sits on near-opaque cream so the art is only seen in the
   left/right gutters and a short top hero wash that fades to calm before the first data section.
   Use a `position: fixed` layer, NOT `background-attachment: fixed` (broken on iOS, janky on
   desktop). On mobile the gutters collapse to a flat warm ground.
3. **The backgrounds should be a procedural place-seeded SVG art system, not photographs.** Real
   place photos fail on all four axes for 615 pages: cliche-postcard coldness, licensing cost,
   inconsistency, and an LCP/contrast hazard. Per-place AI rasters drift in style and cost storage +
   LCP. The right primitive for a cartographic brand is one deterministic generative SVG layer: a
   hash of the place slug seeds warm contour/grid line work, the visual GRAMMAR keyed to category
   (business = fine measurement grid; country = broad slow topographic contours; city = denser
   concentric/street isolines), the palette locked to warm Atlas tokens at ~4-8% opacity. Each of
   the 615 pages is visibly its own, all unmistakably Atlas, at zero network/LCP cost (build-time
   inline SVG). Real geodata can later feed the seed for marquee places (a phase-2 polish).

These are not a "no" to the founder's ideas; they are the version that ships beautifully AND keeps
the numbers trustworthy. If the founder wants to push glass or photography further, that is their
call, this doc records the evidence so the decision is informed.

## The eight verdicts, distilled

1. **Glassmorphism**: chrome only; blur 8-12px max; `backdrop-saturate-150` to keep it warm not
   gray; text on an opaque scrim; `@supports` + `prefers-reduced-transparency` opaque fallback;
   isolate each glass layer; cap ~3 visible at once; Apple's "scroll-edge fade" on the sticky bar.
2. **Static backgrounds + gutters**: fixed layer (not background-attachment); CSS-Grid named-line
   frame for a fixed-measure readable column; gutter art masked to fade out before the content;
   short self-extinguishing hero wash; mobile collapses to flat warm ground; gate on reduced-motion
   /-transparency.
3. **Art direction at scale**: ONE procedural, place-seeded SVG system; grammar by category, palette
   locked warm; gutters + masthead only; catalog 30-50 examples per category on `/dev` first.
4. **Digestibility**: enforce a page contract in the kit, above the fold = what-it-is + headline
   number + spread + honest-take; progressive disclosure capped at TWO levels; answer-phrased
   headings; data-ink discipline (no gridlines, `tabular-nums`, color only where meaningful);
   group by whitespace + common region, not lines; one primary action per section; make it a lint.
5. **In control (five principles)**: (P1) controls move the visible numbers in place, never bounce
   to a reload; (P2) respond at the action's tempo, cheap = live <100ms no apply, costly = instant
   ack + dim-old-numbers + skeleton, never blank/spinner; (P3) always reversible + anchored, visible
   reset, the canonical figure shown beside any adjusted one, URL-state; (P4) always oriented, a
   sticky trade+place+altitude header; (P5) disclosed not displayed, controls collapsed until intent.
   Agency = fewer controls with louder feedback + visible undo, not a cockpit.
6. **Warmth (six moves)**: serif headline + warm tabular figures; one warm-shadow card grammar with
   interior air; a quiet finance-student copy layer (kickers, sign-offs, empty states, captions);
   restrained spot illustration / cartographic motif; one faint paper grain (<=3-4%); every warm
   gesture tied to a real editorial moment. Space itself signals transparency. Atlas already owns the
   token-level warmth; the risk is cold numbers, a voiceless spec-sheet, and dead gutters.
7. **Performance + rollout**: ship the background as one fixed layer kept OUT of the LCP path (the
   headline number stays LCP); glass on thin chrome only; data cards solid; two independent feature
   flags (backdrop vs glass-chrome), server-evaluated for an instant kill switch; `content-visibility:
   auto` on long sections; stage by page type, COUNTRY first (lower density, visually motivated),
   then city/neighbourhood, then industry, then BUSINESS/CELL last (densest, highest bar); measure
   field CWV (LCP/INP/CLS) via `@vercel/speed-insights` between stages.
8. **Design-improvement pipeline**: do not build a new pipeline, extend Fable with a 5-stage QUALITY
   LOOP (Reference -> Discover -> Build -> Design-QA Gate -> Critique-and-Capture). Three artifacts:
   `docs/brand/design-principles.md` (8-12 anchored principles = the critic rubric), `reference-packs/
   <page-type>/` (curated refs + why-notes), `scripts/verify_design_qa.ts` (Half 1 = Playwright
   screenshot baselines on `/dev/kit` + one real instance per type at 1280 and 375, masking dynamic
   numbers; Half 2 = a multimodal Claude design-critic returning MET/UNMET per principle, advisory,
   never the approver). Binary/3-point rubrics, not 10-point. The human stays the sole taste
   authority. The glass/background idea is the FIRST experiment to run through this loop, gated on a
   contrast check + a "numbers pixel-unchanged" screenshot diff. Every iteration tightens a contract
   OR upgrades an exemplar so the bar ratchets up and never drifts.

## How this composes with the 40 architecture decisions

The 40 answers (the per-type spines, the masthead sub-type switch, the inline calculator, the watch-
tray, the zoom control, the profile chip, the new section slots, the typed content-slot model) are
the STRUCTURE. This design direction is the SKIN + the FEEL + the CONTROL GRAMMAR that wraps them:
- The calculator / switchers / tray / zoom = the in-control "control grammar" (report 5).
- The page contract (answer + number + spread + honest-take first) = the digestibility spine the
  per-type spines all satisfy (report 4), already half-built by R5.5/R5.6.
- The glass chrome carries the sticky masthead + watch-tray + switchers; the gutter art gives each
  page type its category identity; the data column stays the clean SaaS surface already shipped.
- All of it ships behind flags, staged by page type, measured, and governed by the new quality loop.

## Founder direction decisions (2026-06-14)

After the synthesis + a visual mockup, the founder chose:
1. **Glass scope: chrome + feature cards.** Glass on the floating chrome (masthead, switchers,
   watch-tray, mobile bar) AND a few non-data feature surfaces (honest-take box, editorial beats),
   always with an opaque scrim under the text. NEVER on raw numbers / tables / the spread strip.
2. **Backgrounds: curated photography** (overrides the procedural-SVG recommendation). Real place
   photos. SAFEGUARDS the founder accepts and we MUST apply (from reports 2 + 7): photos live in the
   GUTTERS + the short top hero wash ONLY, never behind the data column; rendered as a single
   `position: fixed` next/image layer (NOT background-attachment: fixed); kept OUT of the LCP path
   (no `priority`, low quality, the headline number stays LCP); deduped by PLACE (one image reused
   across a place's child pages) so transformation cost stays trivial; AVIF/WebP; art-directed warm +
   desaturated + scrim-masked so it never fights the numbers; behind a feature flag with an instant
   kill switch; gutters collapse to a flat warm ground on mobile.
3. **Rollout: all at once, one big preview** (overrides the staged recommendation). Apply the new
   frame to every page type together behind the flag, one comprehensive Vercel preview, then decide.
   We still keep the flag + measure field CWV + run the Design-QA gate before any production promote.
4. **Sequence: architecture first.** Build the 40-answer forward ARCHITECTURE (sub-type + venue
   switchers, inline calculator, watch/compare tray, zoom control, profile chip, the new section
   slots, the typed content-slot model, storytelling furniture, homepage migration) FIRST, then wrap
   it in the warm design frame (glass + photography + the digestibility contract + warmth).

The design-improvement PIPELINE (the 5-stage quality loop + `design-principles.md` + the Design-QA
gate) is built alongside to govern the frame experiment. Production held on `reform-v2/palette-brick`.
