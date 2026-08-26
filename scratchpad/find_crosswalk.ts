import { LEGACY_DB_TO_TAXONOMY } from "../src/lib/cells/industry_resolution";
import { isInScope } from "../src/lib/taxonomy/scope_rules";
import { INDUSTRY_BY_ID, industryToSlug } from "../src/lib/taxonomy";

console.log("legacy -> taxonomy pairs whose TARGET is still in scope:\n");
for (const [legacyId, taxId] of Object.entries(LEGACY_DB_TO_TAXONOMY)) {
  const ind = INDUSTRY_BY_ID[taxId as string];
  if (!ind) { console.log(`  ${legacyId} -> ${taxId}   (target not in taxonomy at all)`); continue; }
  const live = isInScope(ind).inScope;
  console.log(`  ${live ? "LIVE   " : "retired"} ${legacyId} -> ${taxId}  slug=${industryToSlug(taxId as string)}`);
}
