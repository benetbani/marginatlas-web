# Homepage band census, 2026-08-18. Tick 2, slot 2.

Rendered from the real `src/app/page.tsx` with real credentials, via
`scripts/spikes/measure_home_bands.tsx`.

```
declared 11   emitted 11   absent 0

band                chars   words  heading
hero                 5961     63  How much does a {rotating} make in {rotating}
specimen             1970     59  Restaurants in California
example-tiles        5181     67  The same question, asked in 5 countries
ledger               3243     63  What the atlas holds
catalog-plates      87140     72  What the atlas can see
world-map            1936     14  Every country, on one map
state-comparison     3448     74  What a typical business brings in, state by
neighborhoods       16455     72  The same benchmarks, block by block
audience            11754     76  Who it's for
blog-rail            3616     71  From the Atlas notebook
newsletter           9148    133  Get the 2026 small business benchmarks

total visible words: 764
```

---

## What this changes, and it corrects my own step file

`10-HOMEPAGE.md` assumed three data bands self-omit locally, so the founder was
seeing roughly eight of eleven. **Measured: all eleven emit, with real data,
absent none.** The assumption came from the charter's note that cell lookups
exceed a 4s budget from this machine, which is true of the cell page's data bands
and is not true of the homepage's.

So **"very deficitary and bland" is not a missing-band problem.** The count he
asked for is already met at the markup level. The deficiency is in what the bands
look like, and the census points at where:

1. **The page carries 764 visible words across eleven bands, and the spread is
   flat: 59 to 76 words in nine of them.** Every band is the same size in
   language. A page with no variation in weight reads as one long even column,
   which is the mechanical shape of "bland" and matches his other words exactly:
   "it just has a lot of text, when it should not."
2. **`newsletter` is the largest band on the page by words, 133**, which is 17
   percent of all the language on the homepage spent on a signup. It is also the
   last thing before the footer.
3. **`catalog-plates` is 87,140 characters of markup for 72 words**, twenty-six
   times the markup of its neighbours. Whatever that band is drawing, it is
   drawing a great deal of it. Worth a look on its own, not because size is a
   defect but because nothing else on the page is shaped like that.
4. **`world-map` carries 14 words**, the quietest band on the page, and it is the
   one band that is pure inventory rather than description. It is the shape the
   other ten should move toward.

## The measurement's blind spots, stated

- **SSR only.** Anything appearing on hydration is invisible here.
- **This is emission, not paint.** An emitted band can still compute to zero
  height. Eleven bands emitting is not eleven bands seen, and the paint
  measurement is the next homepage tick, now trivial because every band carries
  `data-band`.
- Character counts include the closing tags between one band's marker and the
  next. Word counts cannot be inflated that way.
- It cannot tell a band that is quiet by design (`world-map`) from a band that is
  quiet because it failed.

## Queued from this census

1. **Paint measurement**: per-band computed height at 1280 and 375, reloaded
   after the resize, and a screenshot of each. That answers "how many sections
   does he actually see" and gives the height budget the step file asks for.
2. **The flat word distribution** is the first real design finding. A page wants
   a few loud bands and several quiet ones, and this one has eleven of the same
   weight.
3. `catalog-plates` markup volume, `newsletter` word count.
