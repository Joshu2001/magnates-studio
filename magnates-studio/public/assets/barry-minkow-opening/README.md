# Barry Minkow tower reveal template

An eight-second, 24 fps, 1280 × 720 opening animatic registered in Magnates Studio and previewed from `index.html`.

## Motion beats

| Time | Picture and motion |
| --- | --- |
| 00:00.00–00:00.72 | A full-frame warm flare contracts to a bright point and dissipates. |
| 00:00.55–00:01.45 | Storm clouds drift independently above the Sacramento skyline. |
| 00:01.45–00:02.65 | The upper tower rises first; the lower podium remains below the frame. |
| 00:02.15–00:03.35 | The camera pushes in on the upper tower. |
| 00:02.65–00:03.85 | A warm searchlight sweeps across the facade. |
| 00:03.55–00:04.90 | The camera makes one smooth downward glide, revealing the three unfinished podium stories. |
| 00:03.82–00:05.08 | “SACRAMENTO” moves across the lower facade as it enters the frame. |
| 00:05.30–00:06.35 | A gold-edged wipe reveals the unfinished corridor. |
| 00:06.35–00:07.12 | The corridor makes a slow forward camera move. |
| 00:07.12–00:08.00 | A brief flash cut reveals the separate grayscale facade and caption-free portrait cutout. |

## Resolution and source format

The replacement tower is a transparent 1103 × 1426 PNG. The animation draws from this full-size source and never enlarges it beyond its native dimensions at the 1280 × 720 output. It is a raster illustration, not a true vector; placing it inside an SVG would not remove its pixel-resolution limit. The camera move is kept below the source resolution to retain clean detail.

## Preview and controls

Open this directory through the Studio server at `/assets/barry-minkow-opening/`. Scrub, play, or restart the animatic and edit the location text. Camera timing and framing are shared by the browser preview and offline renderer through `tower-camera.json`.

## Asset status

The new building asset is generated illustrative art, not an archival photograph or verified real building. It replaces the active tower layer; the earlier tower image remains in the asset folder as an unused fallback. The portrait is an AI-generated reconstruction, not an authenticated likeness.

## Render a review MP4

Requires Python Pillow, NumPy, and FFmpeg. From this directory:

```sh
python3 render_preview.py
ffmpeg -y -framerate 24 -i preview-frames/frame-%04d.jpg -an -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart preview.mp4
```

The review render is silent. The HTML Canvas preview is the editable source for the full sequence.
