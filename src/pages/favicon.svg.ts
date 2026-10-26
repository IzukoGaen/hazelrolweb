import type { APIRoute } from "astro";
import tokens from "../styles/tokens.css?raw";
import { HEAD, PIXEL_CLASS, toPaths } from "../lib/catSprites";

// Favicons can't read CSS variables, so the cat's colours are copied from
// the --cat-* tokens at build time.
const tokenColour = (name: string) => tokens.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,8})`))?.[1] ?? "#000000";

export const GET: APIRoute = () => {
  const paths = toPaths(HEAD)
    .map(({ key, d }) => `<path fill="${tokenColour(`cat-${PIXEL_CLASS[key]}`)}" d="${d}"/>`)
    .join("");
  const body = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -3 19 19" shape-rendering="crispEdges">${paths}</svg>`;
  return new Response(body, { headers: { "Content-Type": "image/svg+xml" } });
};
