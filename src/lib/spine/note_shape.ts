/**
 * src/lib/spine/note_shape.ts , A NOTE'S SHAPE AND THE LIST'S CAP, apart from the countries' notes (plan 2026-10-13 cost-simulator, Task 4B):
 * NoteList draws in the browser on /calculator, and locals_rows.ts reads a data file and the register's cities, which no page's browser bundle
 * should carry. locals_rows.ts re-exports both, so every reader of it is unchanged.
 */
import type { AtlasIconId } from "@/components/brand/icons/atlas-icons-data";

/** `icon`: the note's glyph, chosen by hand with the note (2026-09-26, M6); `dots`: a paperwork level, one to five (2026-09-26). */
export type LocalNote = { label: string; fact: string; icon?: AtlasIconId; dots?: 1 | 2 | 3 | 4 | 5; source?: string };

/** At most five notes; the sixth is not drawn. */
export const NOTE_CAP = 5;
