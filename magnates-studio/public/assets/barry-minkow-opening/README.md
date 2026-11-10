# Barry Minkow opening scene template

An eight-second, 24 fps, 1280 × 720 opening animatic registered in the Studio homepage scene library and previewed from `index.html`.

## Motion beats

| Time | Picture and motion |
| --- | --- |
| 00:00.00–00:00.55 | Warm white optical flash contracts and dissipates. |
| 00:00.55–00:01.45 | Storm clouds drift independently above the Sacramento skyline. |
| 00:01.45–00:02.65 | The transparent blue office-tower cutout rises into frame as the camera pushes closer. |
| 00:02.65–00:03.85 | A warm searchlight sweeps from right to left across the tower, then begins to turn back. |
| 00:03.85–00:05.05 | A translucent, textured gold field and editable title reveal across the facade. |
| 00:05.05–00:06.35 | A gold-edged occlusion climbs as the view changes upward from tower to unfinished corridor. |
| 00:06.35–00:07.12 | The corridor makes a slow forward camera move; “THE INDICTMENT ALLEGED” stays attached to the claim. |
| 00:07.12–00:08.00 | Brief flash match cut reveals a separate grayscale facade plate, then the caption-free transparent portrait cutout and editable name. |

## Using the preview

Open this directory through the Studio server at `/assets/barry-minkow-opening/`. Scrub the timeline, play or restart, and change each title field. Title text is drawn by Canvas as independent overlays and is never baked into source imagery. Asset paths, roles, and timing are also in `manifest.json`.

## Asset status

All six source layers are AI-generated illustrative scene art. The portrait is a caption-free, AI-generated reconstruction, not an authenticated likeness or archival photograph. Its grayscale facade background is a distinct layer. The previous composite with embedded “ILLUSTRATIVE RECONSTRUCTION” lettering is not included. Replace the portrait slot with verified Barry Minkow archival media if identity-level accuracy is required.

## Render a review MP4

Requires Python Pillow and FFmpeg. From this directory:

```sh
python3 render_preview.py
ffmpeg -y -framerate 24 -i preview-frames/frame-%04d.jpg -an -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart preview.mp4
```

The delivered review render is silent. The HTML Canvas preview remains the editable source for timing, title copy, easing, and compositing changes.
