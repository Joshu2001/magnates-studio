# Luckin Coffee first 30 seconds asset kit

This is an asset-only staging pack for the first 30 seconds of the storyboard. It is **not animated** and is not yet connected to an active editor template. It separates image plates, object cutouts, UI/document surfaces, and effect overlays so timing and motion can be applied as independent tracks after review.

## Asset groups

- `plates/`: generated city-night, cafe-counter, evidence-desk, and unbranded storefront plates. PNGs are original generation outputs; WebP copies are production-size derivatives.
- `cutouts/`: original transparent blank-sleeve cup plus WebP derivative.
- `svg/`: abstract globe, sample map markers, phone shell/UI, comparison panels, neutral document/receipt props, generic silhouette. SVG groups have IDs for separate control.
- `effects/`: standalone glow, highlight, glass wipe, haze, contact shadow.
- `preview/`: non-animated static stack preview; turn layers on/off to inspect separation.
- `docs/`: video-generation prompt for the one action better supplied as moving footage.
- `layer_manifest.json`: 1920×1080, 30 fps, frame ranges, depth order, and intended controls.
- `asset_sources.json`: source filenames, SHA-256 checksums, dimensions, transparency, and derivatives.

## Evidence guardrail

Generated imagery is illustrative. The city lights are **not** a verified China map; marker positions are explicitly sample positions. The phone is not an authentic Luckin app capture. The paper and receipt are blank props, not actual transaction records or a filing. Replace them with verified assets and preserve citations before publishing. Do not label generated people or places as historical documentation.

## Animation-ready controls (not animated yet)

`position`, `scale`, `rotation`, `opacity`, `blur`, `camera push`, `parallax depth`, `strokeDashoffset`, and `mask` belong in editor tracks. Highlight, glow, haze, wipe, phone UI, and route remain separate from their background plates. The manifest gives suggested frame spans, not final keyframes.

## Best-fit motion

- Map reveal/push: animate the camera over the plate; reveal verified locations on their own marker track. Do not rotate a flat city plate as if it were a globe. The abstract sphere is an optional transitional element only.
- Phone/app: keep phone body fixed while UI groups enter sequentially.
- Evidence: add record, receipt, and inset one by one; keep authentic source pages legible and still during the claim hold.
- Highlight and effects: use vector stroke/opacity and separate layers; never bake annotation or glow into a source document.
- Cup handoff: use the supplied video prompt for continuous hand motion, or replace with original footage. The transparent cup is for held compositions, not a substitute for a hand action.
