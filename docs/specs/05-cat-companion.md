# 05 Cat companion (desktop pet)

A small ORIGINAL cute orange cat living on the bottom edge of the viewport,
like a desktop pet inside the page. Do not copy oneko, Shimeji, eSheep, or any
existing character. Inline SVG built from separate parts (body, legs, tail,
ears, eyes), colors from tokens, pastel style matching the Sky Dial.
No new dependencies.

## Look
- Orange tabby: warm orange body, lighter cream belly, muzzle and paw tips,
  3 soft darker-orange stripes on the forehead and a few on the tail.
- Chibi proportions: big round head (~half the body), small body, short legs,
  long expressive tail.
- Big dark eyes with a small white shine, tiny pink nose, pink inner ears,
  soft blush on the cheeks.
- Rounded shapes only. Thin warm-brown outline, not black.
- ~64px tall on desktop, ~48px on mobile. Must stay readable at 48px; drop
  tiny details if they turn into noise.

## Behavior: explicit state machine
- walk: paces left/right along the bottom; turns around at edges and before
  reaching the Sky Dial in the bottom-right corner.
- sit: randomly stops for a few seconds, looks around, tail sways.
- airborne: when scroll velocity exceeds a threshold, lifts with dangling paws.
- land: when scroll velocity stays ~0 for 150ms, falls back with squash &
  stretch and a small overshoot.
- chase (desktop only): if the cursor stays within ~200px, walks toward it
  along the bottom edge; when the cursor stops for ~2s, sits next to it.
  Disabled on touch devices.
- sleep: when the Sky Dial is in night range, curls up with "zzz".
- react: on tap, purrs and emits 2-3 hearts (reuse the fidget particle helper;
  respect the particle cap).

## Rules
- position: fixed; container has pointer-events: none, only the cat is
  tappable. Never covers buttons or text.
- Animate only transform and opacity; legs/tail via CSS keyframes, movement
  via requestAnimationFrame.
- Pause when document.hidden (visibilitychange).
- prefers-reduced-motion: cat stays sitting, no movement.
- aria-hidden="true".
- Add showCat (boolean) and catName (string, optional) to theme.json, the
  content schema, AND public/admin/config.yml. If catName is set, show it in a
  small bubble on tap.

## PROCESS
1. Static SVG in sitting and walking poses. STOP.
2. walk + sit. STOP.
3. airborne + land. STOP.
4. chase, sleep, react.
