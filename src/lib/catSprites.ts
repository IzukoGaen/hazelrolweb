/*
  16-bit style pixel sprites for the cat companion, facing right on a 32x24
  grid. Each character is one pixel; "." is transparent. Colours come from
  the --cat-* tokens via the class names in PIXEL_CLASS.
*/

export const SPRITE_WIDTH = 32;
export const SPRITE_HEIGHT = 24;

export const PIXEL_CLASS = {
  o: "outline",
  F: "fur-light",
  f: "fur",
  d: "fur-dark",
  s: "stripe",
  c: "cream",
  C: "cream-shade",
  e: "eye",
  w: "shine",
  n: "nose",
  p: "ear",
  b: "blush",
  z: "zzz",
  T: "tent-fabric",
  t: "tent-shade",
  S: "tent-stripe",
  D: "tent-door",
  g: "tent-flag",
  y: "tent-eye",
} as const;

export type PixelKey = keyof typeof PIXEL_CLASS;

interface Layer {
  rows: readonly string[];
  x?: number;
  y?: number;
}

export interface PixelPath {
  key: PixelKey;
  d: string;
}

const isPixel = (char: string): char is PixelKey => char in PIXEL_CLASS;

/** Paints layers in order onto a blank grid; later layers cover earlier ones. */
export function compose(layers: readonly Layer[]): string[] {
  const grid = Array.from({ length: SPRITE_HEIGHT }, () => Array<string>(SPRITE_WIDTH).fill("."));
  for (const { rows, x = 0, y = 0 } of layers) {
    rows.forEach((row, dy) => {
      [...row].forEach((char, dx) => {
        const gx = x + dx;
        const gy = y + dy;
        if (char === "." || gx < 0 || gy < 0 || gx >= SPRITE_WIDTH || gy >= SPRITE_HEIGHT) return;
        grid[gy][gx] = char;
      });
    });
  }
  return grid.map((row) => row.join(""));
}

/** One path per colour, built from horizontal runs, so a frame is ~13 elements. */
export function toPaths(rows: readonly string[], offsetX = 0, offsetY = 0): PixelPath[] {
  const byKey = new Map<PixelKey, string[]>();
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const char = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === char) end++;
      if (isPixel(char)) {
        const parts = byKey.get(char) ?? [];
        parts.push(`M${x + offsetX} ${y + offsetY}h${end - x}v1h-${end - x}z`);
        byKey.set(char, parts);
      }
      x = end;
    }
  });
  return [...byKey].map(([key, parts]) => ({ key, d: parts.join("") }));
}

// ---------- Pieces ----------

/** Big chibi head, 19 wide, used by every pose. */
export const HEAD = [
  "...o...........o...",
  "..ofo.........ofo..",
  "..opfo.......ofpo..",
  ".oppffoooooooffppo.",
  ".ofFFFFFFsFsFFFFfo.",
  "ofFFFFFFFsFsFFFFFfo",
  "ofFFFFFFFFsFFFFFFfo",
  "ofFFweFFFFFFweFFfdo",
  "ofFFeeFFFFFFeeFFfdo",
  "ofFFeeFccccFeeFFfdo",
  "ofbbFFccnnccFFbbfdo",
  "odfFFccoccoccFffddo",
  "..ooddoooooooddoo..",
];

const EYE_COLUMNS = [4, 5, 12, 13];

/** Same head with the eyes shut into a soft line. */
export const HEAD_SLEEP = HEAD.map((row, y) => {
  const lid = y === 8 ? "o" : y === 7 || y === 9 ? "F" : null;
  if (!lid) return row;
  const chars = [...row];
  for (const i of EYE_COLUMNS) chars[i] = lid;
  return chars.join("");
});

const BLINK = ["FF......FF", "oo......oo", "FF......FF"];

/** Sitting body with the tail curled up the left side (rows 13-23). */
export const SIT_BODY = [
  "...osfo.....odfffcccccffddo.....",
  "...offo...ofFFfdfcccccffddo.....",
  "...ofso..ofFFFfdfcccccffddo.....",
  "...offo..ofFFffdfcccccffddo.....",
  "...osfo..offFffdfCcccCffddo.....",
  "....offo.odffffdffcccffdddo.....",
  "....odsfoodffffdofFfofFfodo.....",
  ".....odffddffffdofffofffodo.....",
  "......oddddfffddocccocccodo.....",
  ".......oodddddddoCCCoCCCodo.....",
  "........ooooooooooooooooooo.....",
];

const SIT_TIP_A = [".....oo.", "....ofso", "...offo."];
const SIT_TIP_B = ["..oo....", "..osfo..", "...offo."];

/** Walking body seen from the side (rows 12-17); legs are separate pieces. */
export const WALK_BODY = [
  "....odfooooooooo................",
  "....odFFFsFFsFFFfffffffffddo....",
  "...odfFFFFFFFFffffffcccccdddo...",
  "...odfFFFFFFFffffffffcccccddo...",
  "...oddfffffffffffffdCccCddddo...",
  "....odddddccccccccddddddddo.....",
];

const WALK_TAIL = ["..oo....", ".ofso...", ".offo...", ".osfo...", ".offo...", "..ofso..", "...offo."];

const LEG_NEAR_DOWN = ["ofdo", "ofdo", "ofdo", "ofdo", "occo", "oooo"];
const LEG_NEAR_UP = ["ofdo", "ofdo", "occo", "oooo"];
const LEG_FAR_DOWN = ["oddo", "oddo", "oddo", "oddo", "oCCo", "oooo"];
const LEG_FAR_UP = ["oddo", "oddo", "oCCo", "oooo"];

/** Curled-up loaf (rows 11-19) and the tail wrapped along the ground (rows 20-23). */
export const LOAF = [
  ".......oooooooo.................",
  ".....ooFFFsFFsFoo...............",
  "....oFFFFFFFFFFFfo..............",
  "...ofFFFFFFFFFFFffo.............",
  "..ofFFFFFFFFFFFfffo.............",
  "..offFFFFFFFFFffffo.............",
  ".offfFFFFFFFfffffffo............",
  ".offffffffffffffffdo............",
  ".odffffffffffffffddo............",
];

export const LOAF_TAIL = [
  "..oooooooooooooooooooooooooooo..",
  ".ofsffsffsffsffsffffffffffffddo.",
  ".offffffffffffffffffffffffffddo.",
  "..ooooooooooooooooooooooooooo...",
];

const Z_BIG = ["zzzz", "..z.", ".z..", "zzzz"];
const Z_SMALL = ["zzz", ".z.", "zzz"];

// ---------- Frames ----------

const sitFrame = (tip: readonly string[]) =>
  compose([
    { rows: SIT_BODY, y: 13 },
    { rows: tip, y: 10 },
    { rows: HEAD, x: 11 },
  ]);

type LegPlacement = [rows: readonly string[], x: number];

const walkFrame = (far: LegPlacement[], near: LegPlacement[], bob: number) =>
  compose([
    ...far.map(([rows, x]) => ({ rows, x, y: 18 })),
    ...near.map(([rows, x]) => ({ rows, x, y: 18 })),
    { rows: WALK_TAIL, y: 5 + bob },
    { rows: WALK_BODY, y: 12 + bob },
    { rows: HEAD, x: 12, y: bob },
  ]);

const passing = walkFrame(
  [[LEG_FAR_DOWN, 9], [LEG_FAR_DOWN, 19]],
  [[LEG_NEAR_DOWN, 6], [LEG_NEAR_DOWN, 23]],
  1
);

const sleepFrame = (breathIn: boolean) =>
  compose([
    { rows: LOAF, y: 11 },
    ...(breathIn ? [{ rows: LOAF.slice(0, 5), y: 10 }] : []),
    { rows: HEAD_SLEEP, x: 12, y: 7 },
    { rows: LOAF_TAIL, y: 20 },
  ]);

export const CAT_FRAMES = {
  "sit-a": sitFrame(SIT_TIP_A),
  "sit-b": sitFrame(SIT_TIP_B),
  blink: compose([{ rows: BLINK, x: 15, y: 7 }]),
  "walk-1": walkFrame(
    [[LEG_FAR_UP, 11], [LEG_FAR_DOWN, 20]],
    [[LEG_NEAR_DOWN, 5], [LEG_NEAR_UP, 23]],
    0
  ),
  "walk-2": passing,
  "walk-3": walkFrame(
    [[LEG_FAR_DOWN, 9], [LEG_FAR_UP, 19]],
    [[LEG_NEAR_UP, 7], [LEG_NEAR_DOWN, 24]],
    0
  ),
  "walk-4": passing,
  "sleep-a": sleepFrame(false),
  "sleep-b": sleepFrame(true),
} as const;

export type CatFrame = keyof typeof CAT_FRAMES;

/** Floating "z" sprites, drawn above the sleeping head (may extend past the grid). */
export const CAT_ZZZ = {
  big: toPaths(Z_BIG, 26, 2),
  small: toPaths(Z_SMALL, 30, -2),
};

// ---------- Long-haired variant ----------

const FUR_PIXELS = new Set(["F", "f", "d", "s", "c", "C"]);
const NEIGHBOURS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

/**
 * Pushes the silhouette out by one pixel at scattered spots along the outline,
 * which reads as fuzzy tufts. Rows from `groundRow` down stay clean so the paws
 * still sit flat on the floor.
 */
export function fluff(grid: readonly string[], groundRow = 20): string[] {
  const out = grid.map((row) => [...row]);
  for (let y = 0; y < groundRow; y++) {
    for (let x = 0; x < SPRITE_WIDTH; x++) {
      if (grid[y][x] !== "." || (x * 7 + y * 11) % 3 !== 0) continue;
      for (const [dx, dy] of NEIGHBOURS) {
        const edge = grid[y + dy]?.[x + dx];
        const inner = grid[y + 2 * dy]?.[x + 2 * dx];
        if (edge !== "o" || inner === undefined || !FUR_PIXELS.has(inner)) continue;
        // The edge pixel turns into fur, so it must stay enclosed on every other side.
        const exposed = NEIGHBOURS.some(
          ([ex, ey]) => !(ex === -dx && ey === -dy) && (grid[y + dy + ey]?.[x + dx + ex] ?? ".") === "."
        );
        if (exposed) continue;
        out[y][x] = "o";
        out[y + dy][x + dx] = inner;
        break;
      }
    }
  }
  return out.map((row) => row.join(""));
}

export const FLUFFY_FRAMES = Object.fromEntries(
  (Object.keys(CAT_FRAMES) as CatFrame[]).map((name) => [name, name === "blink" ? CAT_FRAMES[name] : fluff(CAT_FRAMES[name])])
) as Record<CatFrame, string[]>;

// ---------- Tent ----------

/** Little A-frame tent with a pennant, generated so the slopes stay even. */
function buildTent(): string[] {
  const grid = Array.from({ length: SPRITE_HEIGHT }, () => Array<string>(SPRITE_WIDTH).fill("."));
  grid[0][15] = "o";
  grid[1][15] = "o";
  for (const x of [16, 17, 18]) grid[0][x] = "g";
  for (const x of [16, 17]) grid[1][x] = "g";

  for (let y = 2; y <= 22; y++) {
    const half = Math.round((y - 2) * 0.68);
    const left = 15 - half;
    const right = 16 + half;
    const doorHalf = y >= 9 ? Math.round((y - 9) * 0.42) : -1;
    const doorLeft = 15 - doorHalf;
    const doorRight = 16 + doorHalf;
    for (let x = left; x <= right; x++) {
      if (x === left || x === right) grid[y][x] = "o";
      else if (doorHalf >= 0 && (x === doorLeft || x === doorRight)) grid[y][x] = "o";
      else if (doorHalf >= 0 && x > doorLeft && x < doorRight) grid[y][x] = "D";
      else if (half >= 4 && (x === left + 2 || x === right - 2)) grid[y][x] = "S";
      else grid[y][x] = x > 15 ? "t" : "T";
    }
  }
  for (let x = 0; x <= 31; x++) grid[23][x] = x >= 1 && x <= 30 ? "o" : ".";
  return grid.map((row) => row.join(""));
}

export const TENT = buildTent();

/** Glowing eyes in the dark doorway while the cat hides inside. */
export const TENT_EYES = compose([{ rows: ["yy..yy", "yy..yy"], x: 13, y: 17 }]);

/** The cat's head poking out of the doorway. */
export const TENT_PEEK = compose([{ rows: HEAD, x: 6, y: 11 }]);

export const TENT_ZZZ = {
  big: toPaths(Z_BIG, 21, 4),
  small: toPaths(Z_SMALL, 25, 0),
};
