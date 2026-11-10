# Luckin Coffee first 30 seconds asset kit

This pack contains the visual assets and an interactive 30-second template integrated into the MagnatesStudio template gallery. Search for **Luckin Coffee · Investigation Intro (30s)** and choose **Preview** to open its 24 fps player in-app. The player exposes 28 storyboard states, layer visibility switches, and the supplied pickup footage. The standalone player page is the renderer embedded by that in-app preview, and the same timeline also has a reproducible MP4 renderer.

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

## Animated template controls

`position`, `scale`, `rotation`, `opacity`, `blur`, `camera push`, `parallax depth`, `strokeDashoffset`, and `mask` belong in editor tracks. Highlight, glow, haze, wipe, phone UI, and route remain separate from their background plates. The template records 28 timed storyboard states and animates the mapped layers. The same motion can be revised by editing its timeline and renderer.

## Best-fit motion

- Map reveal/push: animate the camera over the plate; reveal verified locations on their own marker track. Do not rotate a flat city plate as if it were a globe. The abstract sphere is an optional transitional element only.
- Phone/app: keep phone body fixed while UI groups enter sequentially.
- Evidence: add record, receipt, and inset one by one; keep authentic source pages legible and still during the claim hold.
- Highlight and effects: use vector stroke/opacity and separate layers; never bake annotation or glow into a source document.
- Cup handoff: use the user-supplied first pickup action as a replaceable video track; a copy-ready request guide covers future shots that require continuous physical motion. The transparent cup is for held compositions, not a substitute for a hand action.

## Animated template

The selected Option B intro is implemented as a 30-second, 24 fps, 1280×720 gallery template. Its renderer and asset kit live in `template/` and the surrounding pack. Start with `template/README.md` and `template/index.html` for the timeline and render details.

The hand movement is used as supplied footage, not rebuilt from cutout layers. Only the first pickup is used; the repository clip is trimmed to 2.5 seconds. Future requests for generated motion are documented in `template/SHOT_REQUESTS.md`. The current silent animatic contains no narration or licensed score. Visuals remain illustrative; replace all evidence surfaces and graphics with verified sources before publication.
