/**
 * src/lib/spine/peer_marks.ts
 *
 * THE PEERS ON A WORLD TRACK (2026-10-04, the UK page reform; his words that day: "there has to be some context below, there has
 * to be some hot stuff, some gold nuggets ... but we should avoid making each section with a line of sentences below"). A figure on
 * the world's range says where it stands among 195 countries, which reads the same on every page; the four countries a reader
 * actually weighs this one against say what is going on HERE (research R4, pattern P2, "named peer ticks").
 *
 * THE PEERS ARE THE PAGE'S OWN: the comparison table's group (PEER_GROUPS, "comparable market size, not bordering"), so the
 * reason for featuring them is printed on the same page (MODEL PART 5: featuring needs a reason a reader would accept). A peer
 * holding no figure, or only the field's known fill (world_stats.ts FIELD_FILLS), is left out; under three left, no marks at all,
 * because two read as a cherry-pick (R4, P2). The marks print absolutes only: never a difference, a multiple or a rank (clause 15).
 *
 * Its blind spot, stated: the profile's vintages differ by country (research R5, pitfall 7: the United Kingdom's pay, electricity
 * and lending rate were rewritten to 2025 and 2026 figures on 2026-09-25, its peers' were not), so a peer mark compares figures
 * of different years; the marks are the profile's own figures, the same ones the peers table and the world's range already read.
 */
import { COUNTRIES } from "@/lib/taxonomy";
import { PEER_GROUPS } from "@/lib/countries/country_view";
import { listCountryProfiles } from "@/lib/economic_profile";
import { isFieldFill } from "@/lib/spine/world_stats";

export type PeerMark = { iso2: string; name: string; value: number };

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

function nameOf(iso2: string): string | null {
  const hit = (COUNTRIES as Array<{ code: string; name: string }>).find((c) => c.code === iso2);
  return hit ? hit.name : null;
}

/** The page's peers holding a measured value for one profile field, lowest first; null under three. */
export function peerMarks(iso2: string, field: string): PeerMark[] | null {
  const code = iso2.toUpperCase();
  const peers = (PEER_GROUPS[code] ?? []).slice(0, 4);
  if (peers.length === 0) return null;
  const profiles = new Map(listCountryProfiles().map((p) => [p.iso2.toUpperCase(), p as unknown as Record<string, unknown>]));
  const out: PeerMark[] = [];
  for (const pc of peers) {
    const v = profiles.get(pc)?.[field];
    const name = nameOf(pc);
    if (!name || !isNum(v) || v <= 0 || isFieldFill(field, v)) continue;
    out.push({ iso2: pc, name, value: v });
  }
  return out.length >= 3 ? out.sort((a, b) => a.value - b.value) : null;
}
