# Luckin Coffee — 30-second opening template

This is the selected Option B treatment: cinematic map-to-store camera travel, staged foreground entrances, and still evidence holds. The composition is editable by layer and seeks on an integer 24 fps frame clock. The supplied cup-pickup clip is a replaceable video track, trimmed to its first pickup only. On load, the preview decodes its 60 timeline frames from the original MP4 at exact 24 fps timestamps for reliable stepping.

## Open the preview

Serve the MagnatesStudio `public` directory locally, then open `/assets/luckin-coffee-storyboard/template/`. The preview provides play/pause, a 24 fps frame stepper, a scrub bar, frame labels, and per-layer visibility switches. It uses the same 1280×720 composition as the rendered preview.

## Edit points

- `timeline.json`: 28 storyboard states, integer frame boundaries, asset roles, and the video trim.
- `index.html` and `renderer.js`: deterministic canvas renderer and scrub controls.
- `render_sequence.py`: reproducible silent MP4 preview renderer, using the exact supplied shot segment and 24 fps timeline. It generates the 60-frame pickup cache from the source MP4 if the cache is absent.
- `SHOT_REQUESTS.md`: when a future beat needs a new generated shot, and a precise prompt specification.

The standalone rendered MP4 is an animatic without narration or licensed music. It is not a finished factual film: map points are illustrative, chart surfaces contain no data, and the paper/evidence tableau is labeled as a reconstruction. Replace those with sourced material before publishing.

