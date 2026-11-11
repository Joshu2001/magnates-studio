# Barry Minkow opening scene template

An eight-second, 24 fps, 1280 × 720 opening animatic registered in the Studio homepage scene library and previewed from `index.html`.

## Motion beats

| Time | Picture and motion |
| --- | --- |
| 00:00.00–00:00.72 | A full-frame warm flare contracts to a hot spot, then dissipates. |
| 00:00.55–00:01.45 | Storm clouds drift independently above the Sacramento skyline. |
| 00:01.45–00:02.65 | A single transparent blue-gray construction tower cutout, including its scaffold bay and illuminated podium, rises into view as the camera pushes in. |
| 00:02.65–00:03.85 | A warm searchlight sweeps from right to left across the tower. |
| 00:02.25–00:04.78 | The editable word “SACRAMENTO” appears on the podium and glides right. Its letters contain the actual podium image texture beneath a translucent gold tint. |
| 00:05.05–00:06.35 | A gold-edged occlusion reveals the unfinished corridor. |
| 00:06.35–00:07.12 | The corridor makes a slow forward camera move. |
| 00:07.12–00:08.00 | A brief flash cut reveals the separate grayscale facade plate and caption-free portrait cutout. |

## Using the preview

Open this directory through the Studio server at `/assets/barry-minkow-opening/`. Scrub, play, or restart the animatic and edit the location text. The headline, allegation tag, and portrait name are removed. Text remains editor-rendered and is not baked into image assets.

## Asset status

The tower-and-podium cutout and the other scene plates are AI-generated illustrative art, not archival images of a verified real building. The portrait is an AI-generated reconstruction, not an authenticated likeness or archival photograph; its grayscale facade background is a separate layer. Replace the portrait slot with verified Barry Minkow archival media if identity-level accuracy is required.

## Render a review MP4

Requires Python Pillow, NumPy, and FFmpeg. From this directory:

```sh
python3 render_preview.py
ffmpeg -y -framerate 24 -i preview-frames/frame-%04d.jpg -an -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart preview.mp4
```

The review render is silent. The HTML Canvas preview is the editable source for timing, text, easing, and compositing.
