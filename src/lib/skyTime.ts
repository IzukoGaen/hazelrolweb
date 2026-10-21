export const MINUTES_PER_DAY = 1440;
export const DEGREES_PER_MINUTE = 360 / MINUTES_PER_DAY;

export type SkyPeriod = "night" | "dawn" | "day" | "sunset";
export type DialColor = "rosa" | "celeste";

export function wrapMinutes(minutes: number): number {
  return ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
}

/** Fixed thresholds: night 20–5h, dawn 5–8h, day 8–17h, sunset 17–20h. */
export function periodAt(minutes: number): SkyPeriod {
  const hours = wrapMinutes(minutes) / 60;
  if (hours < 5 || hours >= 20) return "night";
  if (hours < 8) return "dawn";
  if (hours < 17) return "day";
  return "sunset";
}

export function formatClock(minutes: number): string {
  const total = Math.floor(wrapMinutes(minutes));
  const hh = String(Math.floor(total / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}
