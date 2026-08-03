# `_archive/` , removed from the working tree, kept in history

Nothing here is imported, built, typechecked or deployed. `tsconfig.json`
excludes this directory, so its broken relative imports are expected and inert:
a file that moved here kept its `./Sibling` imports and the sibling did not move.

**Nothing was deleted.** Every file is one `git mv` from returning, and its full
history is intact. That is deliberate: on this project "this looks unused" has
been wrong repeatedly, and an archive costs nothing while a deletion costs a
recovery.

---

## 2026-08-03 , dead code

**74 files** that nothing in `src/` imports and that are not route entry points,
framework convention files, or named in a registry.

### How the list was built

`node scripts/audit_dead_code.mjs`, which is read-only and prints evidence
rather than instructions. A file is LIVE if anything imports it, if it is a
Next.js route or convention file, or if a config or the gate registry names it.

### How it was checked before anything moved

Three independent passes, because the tool's first run was wrong twice:

1. **A random sample of eight** was re-checked by hand for an exact import
   specifier. All eight had zero importers.
2. **`npx tsc --noEmit`** after the move. Every error was inside `_archive`
   (relative imports to files that stayed behind), none in `src/`, which is the
   proof that nothing in the live tree depended on them.
3. **The full 58-gate chain.**

### What that process caught, and this is the point of writing it down

- **Two files were used by `scripts/`, not by `src/`.** `qa/reasonableness.ts`
  and `images/query_templates.ts`. The audit only walked `src/`, so it never saw
  those importers. **Restored.**
- **Three files are REQUIRED BY A GATE and imported by nothing.**
  `page-layout/section-registry.ts`, `sections/SubIndustryPicker.tsx` and
  `sections/AnnualCostStack.tsx` are named in `verify_deepening.ts` as part of a
  documented framework. **Required by contract is not the same as referenced by
  an import**, and no reference-graph tool can see the difference. **Restored.**
- **One framework convention file** (`instrumentation-client.ts`) was a false
  positive: Next loads it by name, so nothing imports it. The tool now knows.

**Five of seventy-nine, about six percent, would have been wrong deletions.**
That is the argument for archiving instead of deleting, and for running the gates
rather than trusting a clean typecheck.

### What is NOT in here

Dev routes. `src/app/dev/` holds 41 route trees, which are scaffolding by
definition and never appear as orphans because routes are entry points. Whether
each still earns its keep is a judgment about intent, not a reference question,
so it is a separate decision and not this one.

### Restoring a file

```
git mv _archive/2026-08-03-dead-code/src/components/Thing.tsx src/components/Thing.tsx
```

Then fix its relative imports, which are stale by construction, and run
`npx tsc --noEmit`.
