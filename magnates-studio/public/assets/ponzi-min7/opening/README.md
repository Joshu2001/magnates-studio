# Ponzi Minute 7 — editable opening

Template ID: `ponzi-minute7-documentary`. The opening covers local time 0–15 seconds (07:00–07:15); 15–60 seconds retain the original implementation. Disable **Use editable opening** in Content to restore the legacy opening.

## Generated images

All sixteen required replacement images are installed in this directory. The installed handshake is the 1376×768 long-sleeve RGBA PNG, not the earlier 1672×708 asset-pack version. `asset-checksums.json` records the exact SHA-256 for each expected file; the verification script deliberately fails if any file is absent or differs.

Retain the filenames when replacing images; update the checksum manifest for approved replacements.

- Backgrounds: office.jpg, city.jpg, table.jpg, currency.jpg, amber.jpg.
- Characters: handshake.png, balcony-man.png, merchant.png, cash-man.png, portrait.png, distressed-man.png.
- Props: watermelon.png, watermelon-slices.png, weights.png, banknote-1.png, banknote-2.png.

The portrait and other characters are generated visual reconstructions, not authenticated historical photographs. The final amber reveal uses a distressed man and three independently transformed banknotes. Existing legacy images are fallbacks where specified.

## Native editing

Select a visible object in the SVG stage or select its layer by name/timing bar in Content. The same layer selection is used in the native Content, Animation (Motion), Look and Effects tabs. The standard Cutout Effects & Animations menu routes to those native tabs. Image replacement, typography, camera and layer keyframes, deterministic particles, vector arrows, organic masks, glow, focus blur and procedural flare remain editable. Additional glow, blur, ink/burn masks and motion presets are applied and saved via the Studio contextual data API. Layer timing bars remain inspector-local, not individual main-timeline tracks.

## Validation

From the repository root run:

```sh
node magnates-studio/scripts/verify-ponzi-minute7-opening.cjs
```

Use `--logic-only` to exercise the 375 time samples, 31 layer identities, native inspector classification, persistent effect and animation changes, and legacy handoff without requiring the image bundle. The strict check additionally validates the exact 16 assets. The JavaScript mock-DOM checks were exercised successfully, including the native inspector and saved effects. The 375 reference frames were examined for timing and optical flow. The V4 calibration uses a non-destructive sleeve extension, removes the stray balcony cutout fragment, holds the initial typography at t=0, aligns the market transition, calibrates the foreground depth/zoom and portrait position, and animates white/yellow word opacity. The default handshake sleeve boundaries were checked using the actual installed PNG alpha-edge ranges: zero visible edge samples; minimum geometric clearance 269.6 px. A local isolated sleeve prototype was rendered in Chromium using the earlier package asset; the actual installed PNG was inspected and tested geometrically, not rendered in a full browser application. Full editor playback, export and quantitative pixel-fidelity validation remain outstanding. If a saved customized scene overrides the new defaults, use Content → Reset opening to defaults after preserving any desired edits.
