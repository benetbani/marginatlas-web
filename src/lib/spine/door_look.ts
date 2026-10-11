/**
 * src/lib/spine/door_look.ts
 *
 * THE LOOK OF A DOOR, IN ONE PLACE (fix round F1 of the plan "The home, reformed to ship": group G7 for the name's type, group G9 for the
 * arrow). A door is a link whose name stands with an arrow at its edge: the home's three proof doors, Where to next's rows and the
 * 404's six. Their classes were copied from file to file and kept in step by a test that read one file's source from another's test;
 * they are constants here, read by each, so one edit moves them all and the test compares by import.
 *
 * A LEAF ON PURPOSE: this module imports nothing. The 404 reads it, and the 404's static export is the thing a heavy import killed
 * once (src/app/not-found.tsx's header records the Phosphor barrel); tests/chrome/masthead.test.ts holds the 404's imports to
 * SiteChrome, next/link and this file, and holds this file to having none of its own.
 */

/**
 * A door's name in a row: 14 at weight 500, Where to next's own (WhereNext.tsx draws its door links with it). Critique pass 3 called
 * Where to next's doors "16 medium" and round D2 set the 404's names at that; they measure 14 at 500, so the 404's rows under 640 read
 * this constant, and its cards from 640 keep the 16 semibold they were by `sm:` classes of their own.
 */
export const DOOR_NAME = "text-[length:var(--t-body)] font-medium";
