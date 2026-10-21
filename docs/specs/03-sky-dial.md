# 03 Sky Dial

## Concept
A small ornate rotary dial fixed to the bottom-right corner, styled like a
Renaissance astrolabe: central rosette, acanthus-scroll border, hour-tick ring,
engraved sun and moon. Pastel pink (default) or pastel sky-blue, gold accents.
Inline SVG only, colors from tokens.

## Interaction
- Drag in a circle to rotate the inner disc; angle 0-360 maps to time 0-24h.
- Click-to-step and arrow keys also work. role="slider" with
  aria-valuemin/max/now and aria-valuetext like "Atardecer, 18:00".
- First load: dial set to the visitor's local time. Remember the visitor's
  manual choice in localStorage (wrapped in try/catch).

## Sky background
- Full-page background changing continuously through dawn, day, sunset, night,
  using @property-registered color variables (--sky-top, --sky-bottom)
  interpolated in JS from keyframe colors.
- Layers: sun and moon on an arc, stars fading in at night, slow pastel clouds.
- Text/cards use only TWO themes (light/dark) switching at fixed dial
  thresholds, so contrast stays WCAG AA at every time.
- Expose the current time-of-day (e.g. a data attribute or small event) so the
  fidgets and the cat can react to night.

## Constraints
- prefers-reduced-motion: no continuous animation, instant sky changes.
- Add dialColor (rosa | celeste) and showSkyDial (boolean) to theme.json, the
  content schema, AND public/admin/config.yml.
- No new dependencies. Performant on mobile.

## PROCESS
1. Dial SVG only, static, both color variants. STOP.
2. Drag/keyboard interaction. STOP.
3. Sky background and light/dark switching.
