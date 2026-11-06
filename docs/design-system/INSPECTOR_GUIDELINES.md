# Shared inspector contract

All template builders use the existing Content / Motion / Look / Effects shell and Advanced Controls drawer. The shared presentation adapter in `magnates-studio/public/js/regaarder-shell.js` normalizes every `.rg-inspector-shell`, including dynamically mounted builders. Styling lives in `regaarder-shell.css`.

## Presentation

- Put common edits first. Native disclosure sections retain keyboard behavior, visible labels, focus indicators and per-template expansion state during the session.
- Generic controls are grouped by media, text and settings. Long groups retain their remaining controls in a named disclosure. Never discard controls because another object uses the same label.
- Retain actual media thumbnails and semantic names. Add media and Replace have distinct meanings. Background presets and color controls use a focused inline drawer; cutout editing launches its existing dedicated editor.
- Specialized builders retain their existing controls, data attributes and event listeners. Header actions retain their original nodes inside the expanded section. Numeric calibration and native3D precision tools remain accessible.
- Never invent a visual preview or pretend a setting is connected. Empty tabs explain that the template has no corresponding settings.

## Scene and selection context

The context strip reads current chapter runtime and existing toolbar selection, scoped to the owning editor so blueprint and template contexts cannot leak into each other. Scene navigation follows playback without overwriting a focused select. Text with explicitly known scene membership is promoted for that scene; other scene text stays available in `Text in other scenes`. Unknown membership always remains accessible. Do not infer scene membership from names alone. Focused text fields are not moved during editing.

## Preservation and performance

Presentation uses original nodes and listeners, not replacement input fields. The generic legacy adapter forwards changes to its original source fields. It excludes hidden ancestor groups while allowing hidden file inputs with visible upload actions. Media-specific actions delegate to their original owners.

A structural observer normalizes newly mounted sections once. It does not rebuild forms on slider changes or animation frames. A 300ms context update operates only on visible shells. Rendering, geometry, animation state, saved documents and export formats are unchanged.

## Validation

`node tests/inspector-system.cjs` checks original node/handler preservation, specialized actions, scene promotion, idempotence, disclosure accessibility, empty states and actual generic category classification. It uses the app checkout's existing jsdom dependency. Existing precision-editing, merge and software-renderer checks remain required for this integration.

Browser verification samples generic video, native3D, chapter, origins, master and blueprint builders. Shared coverage is not a claim that every frame or every specialized operation in all templates has been exhaustively tested.
