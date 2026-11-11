# Barry Sacramento Interior Fly-Through · Layer Plan

The scene is intentionally separated before animation.

1. **Deep corridor plate** — existing clean `construction-corridor.webp`; lowest parallax speed.
2. **Mid architecture** — corridor plate redrawn through side clips; medium parallax speed.
3. **Walking shadows** — independent procedural vector floor-shadow layer, moving slightly less than the figures so it remains floor-anchored.
4. **Two walking figures** — independent scalable vector layer with two suited businessmen, briefcase and document folder.
5. **Near foreground occluders** — left wall, right scaffold/column and ceiling strips clipped from the corridor plate; fastest parallax and rendered in front of the people.
6. **Atmosphere** — procedural amber haze/dust; depth-scaled.
7. **Editable title** — `AN 18-STORY` + `OFFICE BUILDING`; appears only after the camera glide settles.

## Camera choreography

**0.00–2.90s** — continuous Z push plus downward camera glide. No orbiting. Foreground planes accelerate past the viewer while the distant corridor moves slowly.

**2.90–3.05s** — short settle/overshoot.

**3.05–4.10s** — title resolves in two staggered editable lines.

**4.10–6.50s** — composition holds with subtle walking sway and atmospheric motion.

## Depth order

Deep corridor → mid architecture → floor shadows → walking figures → near foreground occluders → haze/dust → title.

This ordering is deliberate: the nearest columns can pass in front of the people, which is what sells the 2.5D fly-through rather than a flat Ken Burns zoom.
