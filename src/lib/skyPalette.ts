import { wrapMinutes } from "./skyTime";

/** Each part maps to a `--sky-<part>` custom property on the scene. */
export const SKY_PARTS = ["top", "mid", "bottom", "far", "hill", "near", "cloud", "glow", "mist"] as const;
export type SkyPart = (typeof SKY_PARTS)[number];

export type Rgb = [number, number, number];
export type SkyPalette = Record<SkyPart, Rgb>;

/** Keyframe names match the `--sky-<name>-<part>` tokens in tokens.css. */
export const SKY_KEYFRAMES = [
  { name: "midnight", hour: 0 },
  { name: "predawn", hour: 4.5 },
  { name: "sunrise", hour: 6 },
  { name: "morning", hour: 8.5 },
  { name: "noon", hour: 12.5 },
  { name: "golden", hour: 16.5 },
  { name: "sunset", hour: 18.5 },
  { name: "dusk", hour: 20 },
] as const;

export const SUN_RISE_HOUR = 5.75;
export const SUN_SET_HOUR = 19.25;
export const MOON_RISE_HOUR = 19;
export const MOON_SET_HOUR = 6.5;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (t: number) => t * t * (3 - 2 * t);
const hourOf = (minutes: number) => wrapMinutes(minutes) / 60;

export function parseHex(value: string): Rgb {
  let hex = value.trim().replace("#", "");
  if (hex.length === 3) hex = [...hex].map((c) => c + c).join("");
  const n = Number.parseInt(hex, 16);
  if (hex.length !== 6 || Number.isNaN(n)) return [0, 0, 0];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function toCss([r, g, b]: Rgb): string {
  return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`;
}

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/** Blends the two keyframes around `minutes`; `palettes` is indexed like SKY_KEYFRAMES. */
export function paletteAt(minutes: number, palettes: readonly SkyPalette[]): SkyPalette {
  const hour = hourOf(minutes);
  const count = SKY_KEYFRAMES.length;
  let index = count - 1;
  for (let i = 0; i < count; i++) {
    if (hour >= SKY_KEYFRAMES[i].hour) index = i;
  }
  const start = SKY_KEYFRAMES[index].hour;
  const end = index + 1 < count ? SKY_KEYFRAMES[index + 1].hour : 24;
  const t = smooth(clamp01((hour - start) / (end - start)));
  const from = palettes[index];
  const to = palettes[(index + 1) % count];
  const result = {} as SkyPalette;
  for (const part of SKY_PARTS) result[part] = mix(from[part], to[part], t);
  return result;
}

/** 0 in daylight, 1 in deep night, easing through dusk (19–21h) and dawn (4.5–6.25h). */
export function nightAmount(minutes: number): number {
  const hour = hourOf(minutes);
  if (hour >= 19 && hour < 21) return smooth((hour - 19) / 2);
  if (hour >= 4.5 && hour < 6.25) return 1 - smooth((hour - 4.5) / 1.75);
  return hour >= 21 || hour < 4.5 ? 1 : 0;
}

/** Warm horizon glow that peaks around sunrise and sunset. */
export function horizonGlow(minutes: number): number {
  const hour = hourOf(minutes);
  const bump = (center: number, width: number) => smooth(clamp01(1 - Math.abs(hour - center) / width));
  return Math.max(bump(6.25, 1.75), bump(18.75, 2));
}

/** Progress 0..1 of a body crossing the sky between rise and set, or null below the horizon. */
export function arcProgress(minutes: number, riseHour: number, setHour: number): number | null {
  const hour = hourOf(minutes);
  const span = (setHour - riseHour + 24) % 24;
  const elapsed = (hour - riseHour + 24) % 24;
  return elapsed <= span ? elapsed / span : null;
}
