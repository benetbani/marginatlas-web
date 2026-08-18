# Claims census. Started 2026-08-18, tick 3, slot 3.

The register the reform runs on. One module per entry, classified MEASURED /
DERIVED / JUDGED / ASSERTED per `08-CLAIMS-AND-INDICES.md`. Modules are added as
they are read; **an unread module is listed as unclassified rather than assumed
clean**, because reading the module that produces a number is the working
method's first rule and six measurement artifacts have died to skipping it.

---

## 1. `break_in_rating.ts` , the founder's own example. **JUDGED.**

Prints: one of four words (forgiving, manageable, demanding, brutal) and a 0-100
score. Imported by 12 modules, the widest reach of anything in `src/lib/scores/`.

**The mechanism, read from the module:**

```
payback years = (startup + permits) / annual owner take-home
three sub-scores off piecewise-linear anchor curves
score = 0.58*payback + 0.24*speed + 0.18*room, rounded, clamped 0..100
band  = >=78 forgiving, >=60 manageable, >=40 demanding, else brutal
a missing speed or room input does NOT omit: it substitutes a neutral 50
```

Every weight, every one of the 13 payback anchors, all six speed anchors, all six
room anchors and all three band cut-points are values we chose. That is the
definition of JUDGED, and none of it is published beside the word.

### Three measurements, from `scripts/spikes/sensitivity_break_in.tsx`

**A. The word is not stable under ordinary error.** Across 1,764 plausible input
combinations, moving ONE input by 10 percent changes the printed word in
**14.1 percent** of them; at 20 percent it changes in **29.9 percent**. By input,
at 10 percent: take-home 12.6, startup 12.4, time-to-open 6.0, density 4.9.

Ten percent is well inside the error of every one of those inputs. So roughly one
page in seven is a rounding error away from telling a reader a different word
about the same business in the same place.

**B. The neutral-50 fallback is heavy, and it is defensive rather than live.**
CORRECTED after `tsc` rejected the first probe for omitting a field I had not
read. When an input is absent the module substitutes a neutral 50 instead of
omitting, and that substitution is worth a mean 5.1 points and **changes the word
for 24.8 percent** of the grid with time-to-open absent, 6.5 points and **32.3
percent** with both absent.

**But production callers do not pass null.** They pass a modeled archetype, and
the module's own header says so: "The three modeled inputs are always available
on the board; if one is somehow absent its sub-score falls back to a neutral 50".
So these figures measure the WEIGHT OF THE FALLBACK, not live behaviour, and the
first version of this entry read them as live. That was wrong and the correction
is the point: the honest problem is not a missing input, it is a modeled one.

**B2. The module already tracks its own modelling, and one surface shows it.**
`BreakInRatingInput.restsOnModeled` is set by the caller "when ANY input is
modeled rather than a trusted-real figure", and the rating echoes it back "so the
surface can mark it". Measured across the call sites: **four of the five
production callers hard-code `restsOnModeled: true`**
(`markets/across_cities.ts:274`, `open/opening_page.ts:342`,
`scores/city_board.ts:388`, `scores/country_board.ts:419`); only
`scores/cell_board.ts:340` computes it.

**And exactly one component reads it.** `components/board/BreakInScore.tsx:259`
prints "Entry cost and crowding here are modeled, so read it as directional",
alongside three driver bars showing the sub-scores, which is precisely the
show-the-ingredients behaviour this reform wants. Every other surface that prints
the band word carries neither the caveat nor the bars.

So the honesty machinery exists, is switched on almost everywhere, and is
displayed in one place.

**C. Some of the score cannot vary by place at all.** Three of the four call
sites (`markets/across_cities.ts:268`, `open/opening_page.ts:336`,
`scores/country_board.ts:411`) pass `timeToOpenWeeks(industryId)`, and that
function takes **no place argument**: it is a per-trade lookup with a default.
Density falls back to `densityArchetypePer10k(industryId)` whenever the real
column is absent, the same way.

So on those surfaces **24 percent of the score is a per-trade constant, identical
in every city**, and the place-to-place difference a reader sees comes from
payback, plus density only where a real figure exists. The word looks
place-specific and is substantially trade-specific. That is the founder's
sentence, in numbers: asking how hard a trade is "in a shithole city" returns an
answer that is partly a national average of that trade.

`cell_board.ts:334` is the honest call site: it passes real values or null.

### What this does NOT show, stated

- The grid is a plausible spread, **not the live distribution of published
  cells**. It says how fragile the function is, never what fraction of live pages
  are fragile. That needs the database and is queued.
- It perturbs one input at a time; real errors arrive together and can cancel.
- It measures stability, never whether the score measures difficulty at all. A
  perfectly stable number can still be the wrong idea.

### Queued, in order

1. The live distribution: how many published cells reach the rating with a null
   time-to-open or a null density, and how many sit within 3 points of a band
   cut-point. That converts every percentage above into a page count.
2. The repair, once 1 is known. Raised as **Q7**, not acted on, because it
   changes what the site says.

---

## 2. The rest of `src/lib/scores/`, unclassified

22 modules, 5,796 lines. Band-word counts are code occurrences of the four
break-in words or the five score-band words, importer counts are modules that
import from the file.

| module | lines | band words | importers | status |
|---|---|---|---|---|
| `index` | 408 | 30 | 0 | **next**, it defines the 0-100 score bands |
| `break_in_rating` | 305 | 9 | 12 | **classified above, JUDGED** |
| `band_tone` | 164 | 9 | 7 | colour only, no claim |
| `band_labels` | 43 | 8 | 7 | the words themselves, one place, good |
| `verdict` | 125 | 7 | 0 | 0 importers, check before reading |
| `city_attractiveness` | 403 | 4 | 1 | unclassified |
| `composite` | 204 | 4 | 1 | unclassified |
| `city_board` | 672 | 0 | 7 | unclassified, the largest |
| `country_board` | 498 | 0 | 6 | unclassified |
| `activity_board` | 358 | 0 | 8 | unclassified |
| `cell_board` | 344 | 0 | 9 | unclassified |
| `industry_verdict` | 332 | 1 | 3 | unclassified |
| `founder_decision` | 282 | 1 | 2 | unclassified |
| `geo_verdict` | 260 | 1 | 2 | unclassified |
| `world_atlas` | 254 | 0 | 2 | unclassified |
| `country_verdict` | 241 | 0 | **0** | dead? check with barrel re-exports in mind |
| `city_directory` | 238 | 1 | 1 | unclassified |
| `compare_verdict` | 229 | 0 | 1 | unclassified |
| `recommend` | 173 | 0 | 4 | unclassified |
| `margin_index` | 68 | 0 | 4 | unclassified |
| `city_peers` | 119 | 0 | 3 | unclassified |
| `recommend_core` | 76 | 0 | 1 | unclassified |

**Importer counts are a trap here** and are recorded as raw: barrel re-exports
hide real consumers, and the dossier already records `buildCountryBoard` showing
six references that were all its own gate. Two modules read zero importers
(`country_verdict`, `verdict`) and that is a lead for `06-REFORMATION.md`, not a
conclusion.
