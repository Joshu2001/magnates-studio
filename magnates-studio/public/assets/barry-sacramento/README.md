# Barry Sacramento · Searchlight Reveal

A separate eight-second Magnates Studio scene template at `/assets/barry-sacramento/`. It competes with, and does not replace, `barry-minkow-opening`.

## Visual choreography

- A single warm flashlight bloom and low boom announce the shot.
- The supplied Sacramento sunset/storm plate appears, then the unfinished tower cutout resolves in front.
- The supplied floodlight rig and beam are composited behind the building. A separate warm moving pool travels across the facade, with a softer reflected streak clipped to the building silhouette.
- Rolling lower clouds act as a foreground occluder.
- The large, textured gold `SACRAMENTO` title rises behind the cloud veil after the opening beats and holds in the final composition.

The flash-core bloom follows the soft screen-blend optical treatment in `circular-spin-flashlight-glitch`; the unrelated spin, repeated paparazzi strobes, and glitch are not applied.

## Editable controls

Content controls expose the title and visibility of each scene layer. Motion controls expose title timing, searchlight sweep rate, foreground-cloud drift speed, background-sky drift, camera push, and the cloud veil’s vertical offset. Advanced controls expose building and cloud in/out timing plus the building reveal duration. Look controls expose title scale, baseline, title gold, and beam tint. Effects controls expose opening bloom, moving reflected-light strength, cloud opacity, and the synthesized opening audio. The JSON manifest lists the layer/source mapping and sequence beats.

## Run

Open `/assets/barry-sacramento/` from the Magnates Studio server. The page is a self-contained HTML Canvas preview with play, pause, restart, and scrubbing. All preview plates remain separate files in `assets/`.

The building and sky are illustrative generated/user-provided plates, not archival photography or verified documentation.
