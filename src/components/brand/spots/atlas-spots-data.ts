/**
 * atlas-spots-data.ts - the 12 editorial spot illustrations, ported from the
 * design export (atlas-spots.js) per docs/brand/visual-assets.md 2.5. GENERATED;
 * edit here from now on. Line-and-wash: ink shapes inherit stroke (currentColor)
 * from the AtlasSpot wrapper; wash fills are retoned to the live tokens.
 *
 * THREE WASH COLOURS, AND NO FOURTH. atlas-500 #e62200, atlas-700 #991600, and
 * ink-700 #463726. That is the whole set and it is not a style preference.
 *
 * The founder, 2026-08-09, on the four-roles spot at the foot of the home page:
 * "in some cases at the bottom of the home page I see a shade of orange that is
 * not accepted as a brand color." The spots were carrying moss #6f8f25 (green,
 * 6 uses), cocoa #87745d (brown, 6 uses) and a warm tan #E2D2BC (2 uses), all
 * washed to 12-22% over the page ground, where a brown at 16% reads as exactly the
 * off-orange he is describing. Green and brown are banned outright by the
 * ratified palette rule: terracotta plus cool neutrals, no green, no brown, no
 * amber. All 14 are now ink-700; the two tans dropped from 0.5 to 0.12 opacity
 * because ink at 0.5 is a blot, not a wash.
 *
 * THIS DID NOT COME FROM NOWHERE, and the root is still open: the token layer
 * in globals.css declares --moss-*, --amber-* and --cocoa-* as a "meaning
 * scale" for positive / caution / low. That scale encodes data elsewhere and is
 * NOT touched here, because deleting it is a decision and this is a decorative
 * graphic. If a spot ever needs a fourth colour, the answer is that it does not.
 */

export type AtlasSpotId =
  | "honest-take"
  | "four-roles"
  | "neighborhood-street"
  | "vs-the-world"
  | "opening-abroad"
  | "free-zone"
  | "airport-venue"
  | "what-locals-know"
  | "first-year"
  | "reality-check"
  | "report-cover"
  | "calculator";

export interface AtlasSpotDef {
  id: AtlasSpotId;
  title: string;
  caption: string;
  /** SVG viewBox, e.g. "0 0 240 190". */
  vb: string;
  /** Inner SVG markup (retoned washes + ink line). */
  body: string;
}

export const ATLAS_SPOTS: AtlasSpotDef[] = [
  {
    id: "honest-take",
    title: "The honest take",
    caption: "A straight word over coffee, our read, no spin.",
    vb: "0 0 240 190",
    body: "<ellipse cx=\"95\" cy=\"150\" rx=\"48\" ry=\"6\" fill=\"#463726\" fill-opacity=\"0.16\" stroke=\"none\"/> <path d=\"M64 114 h60 l-6 32 a24 21 0 0 1-48 0 Z\" fill=\"#e62200\" fill-opacity=\"0.18\" stroke=\"none\" transform=\"translate(4 4)\"/> <ellipse cx=\"94\" cy=\"147\" rx=\"44\" ry=\"5\"/> <path d=\"M70 112 h54 l-6 30 a22 19 0 0 1-42 0 Z\"/> <ellipse cx=\"97\" cy=\"112\" rx=\"27\" ry=\"6\"/> <path d=\"M122 120 a13 12 0 0 1 0 22\"/> <path class=\"thin\" d=\"M86 100 q-6 -10 0 -19 q5 -8 0 -17M104 100 q6 -10 0 -19 q-5 -8 0 -17\"/> <path d=\"M152 116 h42 v36 h-42 Z\"/> <path d=\"M180 116 l14 0 0 14\"/> <path class=\"thin\" d=\"M158 128 h28M158 136 h28M158 144 h17\"/>",
  },
  {
    id: "four-roles",
    title: "The four audience roles",
    caption: "The dreamer, the operator, the backer, the local, who the Atlas is for.",
    vb: "0 0 250 210",
    body: "<circle cx=\"65\" cy=\"71\" r=\"40\" fill=\"#463726\" fill-opacity=\"0.16\" stroke=\"none\"/><circle cx=\"191\" cy=\"71\" r=\"40\" fill=\"#e62200\" fill-opacity=\"0.16\" stroke=\"none\"/><circle cx=\"65\" cy=\"161\" r=\"40\" fill=\"#463726\" fill-opacity=\"0.16\" stroke=\"none\"/><circle cx=\"191\" cy=\"161\" r=\"40\" fill=\"#991600\" fill-opacity=\"0.16\" stroke=\"none\"/> <!-- dreamer --> <circle cx=\"62\" cy=\"60\" r=\"14\"/><path d=\"M40 96 a22 18 0 0 1 44 0\"/><path class=\"thin\" d=\"M82 34 l3 -8M92 44 l7 -4M88 54 l8 1\"/> <!-- operator --> <circle cx=\"188\" cy=\"60\" r=\"14\"/><path d=\"M166 96 a22 18 0 0 1 44 0\"/><path class=\"thin\" d=\"M178 80 v14M198 80 v14M178 86 h20\"/> <!-- backer --> <circle cx=\"62\" cy=\"150\" r=\"14\"/><path d=\"M40 186 a22 18 0 0 1 44 0\"/><path class=\"thin\" d=\"M53 148 a6 5 0 0 1 9 0a6 5 0 0 1 9 0M54 150 v3M71 150 v3\"/> <!-- local --> <circle cx=\"188\" cy=\"152\" r=\"14\"/><path d=\"M166 186 a22 18 0 0 1 44 0\"/><path class=\"thin\" d=\"M174 142 a14 9 0 0 1 28 0 Z M188 142 v-7\"/>",
  },
  {
    id: "neighborhood-street",
    title: "A neighborhood street",
    caption: "The few blocks that set the tone, where a trade lives or dies.",
    vb: "0 0 250 180",
    body: "<rect x=\"92\" y=\"98\" width=\"74\" height=\"20\" rx=\"2\" fill=\"#e62200\" fill-opacity=\"0.18\" stroke=\"none\" transform=\"translate(3 3)\"/> <circle cx=\"220\" cy=\"112\" r=\"20\" fill=\"#463726\" fill-opacity=\"0.22\" stroke=\"none\"/> <path d=\"M16 152 H236\"/> <path d=\"M34 152 V74 h58 V152\"/> <path class=\"thin\" d=\"M46 92 h14 v14 h-14 Z M70 92 h12 v14 h-12 Z M52 152 v-20 h22 v20\"/> <path d=\"M92 152 V62 h74 V152\"/> <path d=\"M88 100 h82 l-8 16 h-66 Z\"/> <path class=\"thin\" d=\"M114 152 v-26 h30 v26\"/> <path d=\"M166 152 V86 h44 V152\"/> <path class=\"thin\" d=\"M176 104 h10 v12 h-10 Z M192 104 h10 v12 h-10 Z M176 152 v-22 h26\"/> <path d=\"M22 152 V58\"/><circle cx=\"22\" cy=\"53\" r=\"5\"/> <path d=\"M220 152 V118\"/><circle cx=\"220\" cy=\"108\" r=\"18\"/>",
  },
  {
    id: "vs-the-world",
    title: "Vs the world",
    caption: "How a local market reads against the rest of the planet.",
    vb: "0 0 230 200",
    body: "<path d=\"M112 28 A72 72 0 0 0 112 172 Z\" fill=\"#463726\" fill-opacity=\"0.12\" stroke=\"none\"/> <g class=\"thin\"> <circle cx=\"112\" cy=\"100\" r=\"72\"/> <line x1=\"40\" y1=\"100\" x2=\"184\" y2=\"100\"/> <line x1=\"56.8\" y1=\"53.7\" x2=\"167.2\" y2=\"53.7\"/> <line x1=\"56.8\" y1=\"146.3\" x2=\"167.2\" y2=\"146.3\"/> <ellipse cx=\"112\" cy=\"100\" rx=\"36\" ry=\"72\"/> <ellipse cx=\"112\" cy=\"100\" rx=\"62\" ry=\"72\"/> <line x1=\"112\" y1=\"28\" x2=\"112\" y2=\"172\"/> </g> <path class=\"thin\" d=\"M92 74 Q118 60 140 92\" stroke=\"#e62200\" stroke-dasharray=\"2 4\"/> <circle cx=\"92\" cy=\"74\" r=\"4.5\" fill=\"#e62200\" stroke=\"none\"/> <circle cx=\"140\" cy=\"92\" r=\"4.5\" fill=\"#e62200\" stroke=\"none\"/> <circle cx=\"92\" cy=\"74\" r=\"8.5\" stroke=\"#e62200\" class=\"thin\" opacity=\"0.5\"/>",
  },
  {
    id: "opening-abroad",
    title: "Opening abroad",
    caption: "Carrying a tested model into an unfamiliar market.",
    vb: "0 0 250 180",
    body: "<rect x=\"40\" y=\"104\" width=\"72\" height=\"48\" rx=\"9\" fill=\"#e62200\" fill-opacity=\"0.18\" stroke=\"none\" transform=\"translate(4 4)\"/> <path d=\"M192 152 V120 a16 16 0 0 1 32 0 V152 Z\" fill=\"#463726\" fill-opacity=\"0.2\" stroke=\"none\"/> <path d=\"M22 152 H236\"/> <rect x=\"40\" y=\"104\" width=\"72\" height=\"48\" rx=\"9\"/> <path d=\"M62 104 v-8 a8 8 0 0 1 26 0 v8\"/> <path class=\"thin\" d=\"M40 122 h72M86 104 v48\"/> <path d=\"M104 104 V70\"/><path d=\"M104 74 h24 l-8 7 8 7 h-24\"/> <path d=\"M122 132 Q170 96 206 122\" stroke-dasharray=\"3 5\" class=\"thin\"/> <path d=\"M190 152 V118 a16 16 0 0 1 32 0 V152\"/> <path class=\"thin\" d=\"M206 152 v-20\"/>",
  },
  {
    id: "free-zone",
    title: "A free zone",
    caption: "A ring-fenced enclave where the usual rules bend.",
    vb: "0 0 250 178",
    body: "<rect x=\"40\" y=\"46\" width=\"170\" height=\"104\" rx=\"14\" fill=\"#463726\" fill-opacity=\"0.14\" stroke=\"none\"/> <rect x=\"38\" y=\"44\" width=\"174\" height=\"108\" rx=\"15\" stroke-dasharray=\"3 6\" class=\"thin\"/> <path d=\"M22 150 H228\"/> <path d=\"M64 150 V104 h44 v46\"/> <path class=\"thin\" d=\"M64 116 h44M86 104 v46\"/> <path d=\"M118 150 V90 h42 v60\" fill=\"#e62200\" fill-opacity=\"0.12\" stroke=\"none\"/> <path d=\"M118 150 V90 h42 v60\"/> <path class=\"thin\" d=\"M126 102 h8 v8 h-8 Z M146 102 h8 v8 h-8 Z M126 122 h8 v8 h-8 Z M146 122 h8 v8 h-8 Z\"/> <path d=\"M160 90 V64\"/><path d=\"M160 66 h22 l-7 6 7 6 h-22\" fill=\"#e62200\" fill-opacity=\"0.18\"/> <g class=\"thin\"><circle cx=\"186\" cy=\"118\" r=\"2\"/><circle cx=\"196\" cy=\"132\" r=\"2\"/><path d=\"M197 116 l-12 18\"/></g>",
  },
  {
    id: "airport-venue",
    title: "An airport venue",
    caption: "A site with a built-in, captive crowd that never stops moving.",
    vb: "0 0 250 178",
    body: "<path d=\"M150 150 V74 h18 V150 Z\" fill=\"#e62200\" fill-opacity=\"0.16\" stroke=\"none\" transform=\"translate(3 0)\"/> <path d=\"M28 150 H236\"/> <path d=\"M34 150 V112 h84 v38\"/> <path d=\"M28 112 l46 -17 46 17\"/> <path class=\"thin\" d=\"M46 124 h12 v12 h-12 Z M66 124 h12 v12 h-12 Z M86 124 h12 v12 h-12 Z\"/> <path d=\"M150 150 V74 h18 V150\"/> <path d=\"M148 74 l9 -13 9 13\" fill=\"#e62200\" fill-opacity=\"0.18\"/> <path class=\"thin\" d=\"M154 88 h10 M154 100 h10 M154 112 h10\"/> <g class=\"thin\"><circle cx=\"60\" cy=\"142\" r=\"3\"/><circle cx=\"72\" cy=\"142\" r=\"3\"/><circle cx=\"84\" cy=\"142\" r=\"3\"/><path d=\"M60 145 v5M72 145 v5M84 145 v5\"/></g> <path d=\"M188 66 q24 -9 44 -4 l-7 8 q-12 5 -25 3 Z\" fill=\"#e62200\" fill-opacity=\"0.18\"/> <path d=\"M214 64 l9 -13 5 1 -5 15\"/><path d=\"M190 67 l-7 -9 4 -1 7 7\"/>",
  },
  {
    id: "what-locals-know",
    title: "What locals know",
    caption: "The insider read you can't get from a spreadsheet.",
    vb: "0 0 250 180",
    body: "<circle cx=\"95\" cy=\"98\" r=\"42\" fill=\"#463726\" fill-opacity=\"0.15\" stroke=\"none\"/> <circle cx=\"158\" cy=\"104\" r=\"40\" fill=\"#463726\" fill-opacity=\"0.16\" stroke=\"none\"/> <path d=\"M30 168 H220\"/> <circle cx=\"92\" cy=\"86\" r=\"16\"/> <path d=\"M64 150 a28 22 0 0 1 56 0\"/> <circle cx=\"156\" cy=\"92\" r=\"15\" transform=\"rotate(-12 156 92)\"/> <path d=\"M132 150 a26 21 0 0 1 50 0\"/> <path class=\"thin\" d=\"M114 78 q8 -6 16 0\" stroke=\"#e62200\"/> <circle cx=\"124\" cy=\"70\" r=\"3\" fill=\"#e62200\" stroke=\"none\"/> <path class=\"thin\" d=\"M120 60 q4 -3 8 0\" stroke=\"#e62200\"/>",
  },
  {
    id: "first-year",
    title: "The first year",
    caption: "The fragile, make-or-break opening months.",
    vb: "0 0 210 190",
    body: "<circle cx=\"156\" cy=\"56\" r=\"18\" fill=\"#e62200\" fill-opacity=\"0.2\" stroke=\"none\"/> <path d=\"M70 110 q-22 -4 -27 -24 q22 0 27 19 Z\" fill=\"#463726\" fill-opacity=\"0.22\" stroke=\"none\"/> <path d=\"M104 100 q22 -6 27 -26 q-22 0 -27 21 Z\" fill=\"#463726\" fill-opacity=\"0.22\" stroke=\"none\"/> <path d=\"M28 152 H182\"/> <path d=\"M78 152 l6 -28 h34 l6 28 Z\" fill=\"#463726\" fill-opacity=\"0.18\"/> <path d=\"M76 124 h48\"/> <path d=\"M100 124 V86\"/> <path d=\"M100 108 q-20 -4 -25 -23 q20 0 25 18\"/> <path d=\"M100 100 q20 -6 25 -25 q-20 0 -25 19\"/> <circle cx=\"156\" cy=\"56\" r=\"15\"/> <path class=\"thin\" d=\"M156 33 v-7M156 86 v7M133 56 h-7M179 56 h7M139 39 l-5 -5M173 39 l5 -5M139 73 l-5 5\"/>",
  },
  {
    id: "reality-check",
    title: "The reality check",
    caption: "What the headline number hides once you look closely.",
    vb: "0 0 250 178",
    body: "<circle cx=\"158\" cy=\"92\" r=\"36\" fill=\"#e62200\" fill-opacity=\"0.12\" stroke=\"none\"/> <path d=\"M30 138 H140\" class=\"thin\"/> <g class=\"thin\"> <rect x=\"40\" y=\"118\" width=\"11\" height=\"20\"/><rect x=\"56\" y=\"104\" width=\"11\" height=\"34\"/> <rect x=\"72\" y=\"90\" width=\"11\" height=\"48\"/><rect x=\"88\" y=\"100\" width=\"11\" height=\"38\"/> <rect x=\"104\" y=\"116\" width=\"11\" height=\"22\"/> </g> <path d=\"M36 132 Q70 70 110 120\" stroke=\"#e62200\" fill=\"none\"/> <circle cx=\"158\" cy=\"92\" r=\"34\"/> <circle cx=\"158\" cy=\"92\" r=\"28\" stroke=\"#e62200\" class=\"thin\" opacity=\"0.55\"/> <path class=\"thin\" d=\"M146 96 l7 7 14 -16\" stroke=\"#e62200\"/> <path d=\"M182 116 l34 34\" stroke-width=\"5\" stroke-linecap=\"round\"/>",
  },
  {
    id: "report-cover",
    title: "The report cover",
    caption: "The almanac itself, the annual benchmarks, bound.",
    vb: "0 0 200 250",
    body: "<rect x=\"42\" y=\"30\" width=\"120\" height=\"194\" rx=\"6\" fill=\"#991600\" fill-opacity=\"0.14\" stroke=\"none\" transform=\"translate(4 4)\"/> <rect x=\"38\" y=\"26\" width=\"120\" height=\"194\" rx=\"6\"/> <path d=\"M52 26 V220\"/> <path class=\"thin\" d=\"M70 58 h44\" stroke=\"#e62200\"/> <path d=\"M70 78 h70M70 94 h52\"/> <g class=\"thin\"> <circle cx=\"98\" cy=\"166\" r=\"30\"/> <line x1=\"68\" y1=\"166\" x2=\"128\" y2=\"166\"/><line x1=\"98\" y1=\"136\" x2=\"98\" y2=\"196\"/> <ellipse cx=\"98\" cy=\"166\" rx=\"15\" ry=\"30\"/> </g> <circle cx=\"86\" cy=\"156\" r=\"3.5\" fill=\"#e62200\" stroke=\"none\"/> <path d=\"M70 204 h70\" class=\"thin\"/>",
  },
  {
    id: "calculator",
    title: "The calculator",
    caption: "Run your own scenario, the model in your hands.",
    vb: "0 0 230 190",
    body: "<rect x=\"44\" y=\"84\" width=\"94\" height=\"96\" rx=\"11\" fill=\"#463726\" fill-opacity=\"0.16\" stroke=\"none\" transform=\"translate(4 4)\"/> <path d=\"M132 84 C156 54 156 46 182 44 q16 -1 16 9 l0 30\" fill=\"#463726\" fill-opacity=\"0.12\" stroke=\"none\"/> <rect x=\"44\" y=\"84\" width=\"94\" height=\"96\" rx=\"11\"/> <rect x=\"58\" y=\"98\" width=\"66\" height=\"20\" rx=\"2\"/> <g class=\"thin\"> <circle cx=\"66\" cy=\"136\" r=\"3.5\"/><circle cx=\"83\" cy=\"136\" r=\"3.5\"/><circle cx=\"100\" cy=\"136\" r=\"3.5\"/><circle cx=\"117\" cy=\"136\" r=\"3.5\"/> <circle cx=\"66\" cy=\"154\" r=\"3.5\"/><circle cx=\"83\" cy=\"154\" r=\"3.5\"/><circle cx=\"100\" cy=\"154\" r=\"3.5\"/> <circle cx=\"66\" cy=\"170\" r=\"3.5\"/><circle cx=\"83\" cy=\"170\" r=\"3.5\"/> </g> <circle cx=\"117\" cy=\"162\" r=\"5.5\" fill=\"#e62200\" fill-opacity=\"0.85\" stroke=\"none\"/> <path d=\"M132 84 C156 54 156 46 182 44 q16 -1 16 9\"/> <path class=\"thin\" d=\"M150 70 C168 52 168 50 190 50\"/> <path class=\"thin\" d=\"M168 56 h22 M168 64 h16\" stroke=\"#e62200\"/>",
  },
];

export const ATLAS_SPOTS_BY_ID: Record<AtlasSpotId, AtlasSpotDef> = Object.fromEntries(
  ATLAS_SPOTS.map((s) => [s.id, s]),
) as Record<AtlasSpotId, AtlasSpotDef>;
