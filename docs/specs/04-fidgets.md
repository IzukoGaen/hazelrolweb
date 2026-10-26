# 04 Fidget details

Same visual family as the Sky Dial: pastel pink/sky-blue, gold accents,
Renaissance ornament. Inline SVG, colors from tokens, no new dependencies.

## Items (build in this order)
1. Pressable buttons: on press, translate(4px,4px) and collapse the hard offset
   shadow; spring back on release with slight overshoot.
2. Wax-seal confirmation on the contact form: on successful submit, a pink wax
   seal stamps onto a small letter (scale down + slight bounce).
3. Rosette spinner: small ornamental rosette in a page margin; flick to spin
   with inertia and friction (velocity decays each frame), max speed capped.
4. Squishy clouds: tap a cloud in the sky layer -> squash & stretch, then
   2-3 small hearts/sparkles that fade out. Build this as a small reusable
   particle helper (the cat reuses it).
5. Optional: night-only secret constellation. When the dial is at night, some
   stars become tappable; lighting all of them draws an "H".

## Rules for all fidgets
- Pointer events only (pointerdown/move/up); feedback starts < 100ms.
- Animate only transform and opacity. Pause offscreen with IntersectionObserver.
  Max ~10 particles alive at once.
- Decorative fidgets: aria-hidden="true", not focusable. Functional ones
  (buttons, seal) fully accessible.
- prefers-reduced-motion: no motion, instant state changes.
- Optional navigator.vibrate(10) on tap, feature-detected.
- Never over text or project cards; margins and sky only.
- Add "fidgets" (boolean) to theme.json, the content schema, AND
  public/admin/config.yml; when false, render none of items 3-5.

## PROCESS
Build one item at a time and STOP for review after each.
