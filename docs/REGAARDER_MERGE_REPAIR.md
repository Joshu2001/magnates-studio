# Regaarder / Magnates merge repair

## Verified diagnosis

- `syncStateToNativeScene` applied the blue-pair offsets and wardrobe to other presets. It now keeps each preset's source positions, rotations, actor count and palette, applying user offsets relative to that foundation.
- The native template was initialized as 3D, then omitted from the later capability check. This conflicting mode state could leave the playback HUD visible. The native template now passes that check; 3D mode pauses playback and explicitly hides its HUD/timer, including hover/fullscreen states.
- The stage was a 2D copy of an offscreen Three.js render, covered by rectangular DOM hit targets. The new stage mesh editor raycasts the actual posed surfaces and projects their actual indexed topology back onto the stage. A rectangle or a wireframe flag alone cannot provide vertex editing.
- The full documentary routed most timestamps through a synthetic chapter/collage renderer. That renderer is removed. The original early renderer runs in an isolated same-origin frame because its classic scripts intentionally share lexical globals. Minute 16, minute 17, Pelé and chapter 7 retain their existing native chapter integrations; legacy and promo use their authentic source modules.
- Gemini's empty-cue diagnosis was not reproduced: the final chapter already merges the imported cue defaults with saved overrides after loading. That merge is preserved.

## Editing

Content → Mesh & Skeleton offers Hand, Select region, Drag region, Inflate and Smooth. Region radius defaults to 0.065 metres. Vertex displacement remains in the existing source node's sculpt/multires edit data, bounded to 0.15 metres per axis; mesh undo keeps 30 snapshots. Shift-click adds a region. Topology and skeleton overlays have independent toggles. Motion includes selected-actor bone X/Y/Z rotation, posture, lean and finger curl.

The shared contextual toolbar now offers native 3D Select, Move, Rotate, actual Surface Color and Smooth/Matte/Metallic material presets. Unimplemented 2D crop/replacement and decorative glow options are excluded from that selection's toolbar. Preset pills use single-line names and descriptive hover titles.

3D editing evaluates an anchored source pose: handshake 1.95 s, seated checkpoint 1.8 s, team 0.65 s, mannequin/blue 0 s. Video mode retains source keyframes and cutaways.

## Documentary source and timing

Source: `Joshu2001/Regaarder-Motion`, pinned commit `dd0646757b042248d99b171166fc9e6dea5af1f8`.

| Source time | Renderer |
| --- | --- |
| 0:00–16:00 | Isolated original source renderer |
| 16:00–17:00 | Existing minute16 module |
| 17:00–18:00 | Existing minute17 module |
| 18:00–18:50 | Source sponsor interval, skipped in single-master playback |
| 18:50–20:14 | Existing Pelé module |
| 20:14–21:25 | Original legacy module |
| 21:25–23:25 | Original promo module |
| 23:25–23:29 | Intentional black transition |
| 23:29–26:54.6 | Existing chapter 7 module |

The source review page explicitly excludes the sponsor interval. It has not been invented from unrelated cutouts. The early renderer is a faithful playback restoration; editing its individual layer controls through the unified sidebar still requires a separate integration. The existing chapter templates retain their controls.

To avoid duplicating roughly 550 MB of source media in this editor repository/deployment, the server streams missing documentary resources from the pinned public source commit. Local vendored resources take precedence. JavaScript uses the correct module MIME type; video Range and partial-response headers are preserved. Upstream paths are fixed to that repository/commit, with traversal rejected. Production therefore needs outbound access to `raw.githubusercontent.com`; the source repository must remain available. This is a material runtime dependency, not an offline media export.

## Validation and remaining review

`node tests/regaarder-merge.cjs` checks five preset layouts and scene validation, relative transforms/palette preservation, checkpoint visibility, source-node mesh deformation, legacy/promo asset references, six distinct CPU-rendered promo frames, master routing and the pinned-source HTTP proxy (MIME, Range, streaming). The CPU render test uses `@napi-rs/canvas` (install as a development dependency, or use the available runtime).

All changed JavaScript passes syntax checks and `git diff --check`.

Browser/WebGL verification is outstanding: this workspace had no browser binary, its download failed, and the cloud browser could not open the local preview. In particular, verify ray picking and dragging at different aspect ratios, topology/skeleton alignment, repeated preset/mode switching, the source frame's readiness, and video scrubbing/loading after deployment. This patch should remain a draft until those visual checks pass. No live deployment is part of this repair.


## Live renderer delivery follow-up

The live browser exposed three additional failures after the initial merge:

- `/native3d-v97/engine.js`, `stage-editor.js` and `vendor/three.module.js` were being transformed to CommonJS by the Node build (`exports`/`require`), which cannot execute as browser ES modules. The deployment now emits public resources through `@vercel/static`, resolving existing static files before the server fallback.
- The original-resource proxy forwarded an upstream compressed `Content-Length` while `fetch()` delivered decoded bytes. Browsers consequently parsed truncated scripts. The proxy now requests identity encoding and lets HTTP frame the actual body. Namespace `regaarder-documentary-v2` avoids old immutable cached failures.
- The original playback stage remained inside a closed dialog. Its exact DOM node now moves to the document's visible playback root. Editor chrome is hidden before blocking scripts execute, preventing the page flash.

Native loading now shares its in-flight promise so hover loading and opening the editor cannot race past mesh-editor setup. Renderer errors produce an explicit load state rather than flat cartoon figures. Preset edit views preserve sampled source transforms, proportions, camera framing and lighting defaults instead of resetting the camera or replacing tracked pose positions with base positions.

Regression checks reproduce the truncated-response headers, verify static delivery for browser dependencies, and confirm that the playback stage leaves its closed dialog. Browser verification for this follow-up is recorded in its PR.
