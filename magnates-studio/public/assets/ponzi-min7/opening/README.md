# Ponzi Minute 7 — editable opening

Template ID: `ponzi-minute7-documentary`. The opening covers local time 0–15 seconds (07:00–07:15); 15–60 seconds remain the original implementation. Disable **Use editable opening** in the contextual inspector to restore the legacy opening.

## Asset installation

Copy the separately supplied generated asset ZIP's `magnates-studio/public/assets/ponzi-min7/opening/` files into this directory. The engine uses these filenames:

- office.jpg, city.jpg, table.jpg, currency.jpg, amber.jpg
- handshake.png, balcony-man.png, watermelon.png, watermelon-slices.png, weights.png
- banknote-1.png, banknote-2.png
- merchant.png (corrected generated grayscale merchant, included in the revised asset pack)
- cash-man.png, portrait.png, distressed-man.png (still require corrected independent generated cutouts; do not treat the supplied concepts as verified historical likenesses)

The final amber reveal is a distressed man blended with three independent banknote layers, not a glass vessel. The lens flare and masks remain procedural. The new blend-mode control is editable in the inspector.

Existing template images are fallback assets where specified. Uninstalled optional cutouts can be missing from the preview; install the generated images before visual acceptance. Do not extract replacement images from reference video frames.

## Native controls

The existing contextual inspector saves the opening configuration through the Studio contextual data API. Select a layer by name or its timing bar. Adjust in/out points, depth, visibility, order, transform, appearance, image source, text, mask, procedural particle, arrow or flare parameters as applicable. Layer and camera keyframes are editable JSON arrays. The timing bars are inspector-local, not independent tracks in the application's main timeline.

## Validation

Engine and inspector JavaScript parse checks passed. A mocked SVG DOM was exercised at all 375 time samples at 25 FPS; unique layer IDs, valid sampled transforms, node persistence, visibility overrides, legacy toggle and 15-second handoff passed. This is not a browser rendering, visual-fidelity, project export, or deployment test.

The generated images, exact typography, final amber foreground, and end-to-end editor behavior still require visual validation.
