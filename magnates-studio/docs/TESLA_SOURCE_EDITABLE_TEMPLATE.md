# Tesla — The Electrical Age (7s)
## Source-driven editable documentary scene for Magnates Studio

**Status:** beta feature branch. The canvas renderer and controls are source-based. It is **not** an MP4/GIF playback wrapper. Current fallback artwork is stylized and does **not** reproduce the approved photo-realistic V4/V11 frame until matching production PNG plates are imported.

### Open editor
Navigate to `/tesla-opening.html` (from Studio's floating Tesla link). The template uses the existing Studio's **Content / Motion / Look / Effects + Advanced Controls** organization; it lives on its own route to prevent regressions in other template customizers.

### Editable controls
- **Content:** replace each asset slot with a PNG/JPG/WebP, including room wall, chair, desk, books, coil, lamp, blueprint, portrait, window frame, glass reflections, three city planes and storm clouds. Each asset independently exposes horizontal/vertical position, depth, scale, rotation, opacity, visibility and editable entrance/exit times and fade durations.
- **Motion:** initial/final camera scale (reversible zoom-in/zoom-out), camera push start/end, city parallax strength, window-cross timing.
- **Look:** room and city exposure, glass reflectivity, lamp glow, vignette.
- **Effects:** exterior rain density, speed, wind, pane rain; clouds drift/darkening; lightning intensity, two strike times and duration; city light activation start/spread/count; blueprint and portrait reveal start/duration; on/off switches for each major effect.
- **Advanced:** exact strike times, blueprint and portrait positions, parameter fine-tuning.

Camera is deterministic from timeline time; weather particle seeds are stable. City window activation is staggered and renders unlit until its assigned activation time. The storm continues through the city segment.

### Review and export
- Stage Play/Pause + seek bar preview source animation, not a video element.
- Export JSON stores all parameter changes, layer transforms and uploaded image data as data URLs.
- Import JSON restores all saved settings and replaceable artwork.
- Record WebM (MediaRecorder; browser support required). WebM is a review output, NOT the editable source. If the browser lacks MediaRecorder or the system throttles Canvas it may not be a reliable frame-accurate master. Final MP4 export requires the existing Studio transcoding path or a separate deterministic frame exporter.

### Asset-slot order and recommended mapping
| Slot | Preferred asset | Depth relationship |
| --- | --- | --- |
| room | Clean interior background with transparent window aperture | Rear wall |
| portrait | Portrait face/image only, transparent cutout | Wall |
| blueprint | Paper/blueprint, transparent cutout | Desk top |
| chair | Leather armchair, alpha cutout | Foreground |
| desk | Desk, alpha cutout | Mid-foreground |
| lamp | Brass lamp, alpha cutout | Desk top |
| coil | Tesla coil cutout | Desk top |
| books | Book stack cutout | Desk top |
| window_frame | Window muntins only, transparent cutout | In front of city |
| glass_reflection | Transparent reflected specular / droplets | Glass plane |
| storm_clouds | Cloud plate; procedural atmosphere continues behind it | Far background |
| lightning_overlay | Replaceable transparent lightning image | Storm FX |
| rain_overlay | Replaceable transparent rain-streak texture, moved by renderer | Storm FX |
| city_lights_emission | Transparent windows-only emission image revealed by wave mask | Building lights |
| city_far | Distant skyline with transparent sky | Farthest city |
| city_mid | Midground architecture with transparent sky | Intermediate city |
| foreground_roof | Near rooftops with transparent skyline | Nearest outside |

The downloadable conversation asset import pack `tesla_editable_asset_import_pack.zip` contains 14 mapped reconstruction candidates for the 17 slots. Three new overlay slots can use user-provided PNGs. These source PNG files have **not been uploaded into the GitHub branch** in this change. Their extraction quality, alignment and provenance require review before publishing the Tesla card as final.

### Fidelity criteria for acceptance
- Opening begins with short near-black, not prolonged darkness.
- Blueprint and portrait reveal sequentially with enough time to be perceived.
- City doesn't start with lights already on; windows are staggered in local groups.
- Window frame doesn't duplicate building silhouettes. Glass is a separate layer and remains visible.
- Exterior city layers have differentiated camera motion without ghosting.
- Rain, lightning and moving/darkening clouds continue after window crossing.
- Assets are replaceable without changing the effect timeline.
- Other Studio templates and shared inspectors have no behavior changes except the Tesla navigation entry.

### Test
```bash
node --check magnates-studio/public/js/tesla-opening-engine.js
node tests/tesla-opening.cjs
```

Known limitations: source-driven canvas with independent 2.5D assets, **not actual 3D building geometry**. It doesn't contain a native 4K cinematic source library or reproduce V4 lightning image pixels identically. Current default lightning is procedural; substitute approved animation assets in an upgraded lightning-slot renderer for an exact V4 match.
