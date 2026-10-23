# Regaarder Studio — Cinematic Reference Fidelity Audit

Baseline commit: `0174eb907a308cf380120ea1c54d6687200eee47`.
Status: **audit in progress; NOT pixel-perfect verified**.

## Reference targets and implementation gates

### 1. 3D Spatial Motion Titles & Parallax Rig (highest priority)
Three switchable styles using one non-destructive scene model:
- **Premium Documentary** (default): near-black charcoal atmosphere, warm gold editorial serif title, photographic archival evidence, soft volumetric beams, subtle shadows, no default wireframe grid, limited restrained outlines.
- **Tech / Investigative**: blue/cyan 3D point-cloud globe, network paths, credible data panels, controlled lighting, legible labels and composition.
- **Cyberpunk**: deep violet holographic globe, immersive panels, neon reflections and grid as deliberate optional style, not imposed on documentary.
- The visual references supplied in the conversation are *render targets*, not reusable code or existing repo assets. A standalone generated PNG is not an editable scene.

**Acceptance:** camera orbits/dollies without clipping or occluding the hero title at designated hold frames; parallax respects depth; style changes preserve user data, image assets, layer transforms and keyframes; inspector and export produce the same frame at identical timeline times. Preview/export screenshots must be compared against approved target images at 1920×1080, with recorded visual differences. Avoid false "pixel-perfect" claims until verified.

### 2. Google Search Typing
- Aurora on by default but toggleable; customizable intensity, backdrop and light waves.
- Crisp brand logo, legible query and suggestions, controlled frosted card.
- Default width 65%, centered; drag, corner resize, aspect lock; Compact/Standard/Large/Fullscreen.
- 2D front-facing and optional 3D perspective share text, scene data and timing.
- Verify preview/gallery/export fidelity and rights to third-party logo assets.

### 3. Cinematic Funding Progress
- Premium Documentary default, plus Tech and Editorial.
- Clear percentage, raised/target labels, slim restrained bar, one primary accent, no gratuitous arrows or metallic bevel.
- Preserve editable values and deterministic count/fill animation.

### 4. Text Scramble / Hacker
- Cinematic default with subtle atmosphere; Minimal and Retro Cyberpunk alternatives.
- Crisp mono type; reduce bloom; default neutral message; separate editor selection overlays from exported scene.
- Scramble characters resolve deterministically; editable timing and text.

### 5. Financial Statement Visualization
- Paper document remains focal; four metric cards use restrained semantic accents and readable values.
- Remove bright red directional arrows and pseudo-technical jargon.
- Preserve data accuracy, layering and independent card controls.

### 6. Checklist
- Everything sharp at rest by default; blur opt-in.
- Global depth-of-field and per-item blur are separately adjustable; avoid accidental cumulative blur.
- Test blur behavior on entry, settled state and export.

## Code locations inspected
- `magnates-studio/public/js/tpl-3d-inspector.js` (scene state, presets, camera, effects)
- `magnates-studio/public/js/search-3d-engine.js` (search scene, aurora, sizing)
- `magnates-studio/public/js/checklist-3d-engine.js` (blur engine)

## Verification protocol (not yet completed)
1. Locate the actual scene renderers, CSS and asset pipeline for each template.
2. Inventory existing preset behaviors, including defaults and persisted user state.
3. Make incremental changes in isolated commits, preserving existing projects.
4. Render fixed timestamp screenshots at 0%, 25%, 50%, 75%, 100% of each scene; inspect perspective and typography.
5. Compare reference to exported frames using aligned crops, perceptual difference, and manual art-direction review.
6. Run automated interaction tests (resize, drag, preset switching, save/reopen, scrub, export) and benchmark performance.
7. Only mark a template **verified** when evidence exists; do not infer success from comments or feature catalogs.

## Initial findings (code inspection, not visual validation)
- Google engine defines `auroraEnabled: true`, `widthPercent: 65`, `lockAspectRatio: true`.
- Spatial inspector persists style, flight mode, custom trajectory, lighting, grid and layers. Its saved-state fallback still contains `bgStyle: 'cyber-set'`, which requires runtime checking against the intended documentary default.
- Checklist defaults use `blurMode: 'sequential'` and nonzero `entryBlurPx`; the user's latest instruction calls for a sharp-by-default presentation with blur optional. This is a concrete design/behavior mismatch to resolve.
- The repository's own effect registry is not proof of visual or functional correctness.

This file is a **tracked acceptance specification**, not a claim that the requested rendering changes have already been implemented.
